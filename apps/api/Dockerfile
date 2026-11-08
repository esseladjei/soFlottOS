# Build context: apps/api
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY src/soFlottOS.Api/soFlottOS.Api.csproj src/soFlottOS.Api/
RUN dotnet restore src/soFlottOS.Api/soFlottOS.Api.csproj

COPY src/soFlottOS.Api/ src/soFlottOS.Api/
RUN dotnet publish src/soFlottOS.Api/soFlottOS.Api.csproj \
    -c Release -o /app/publish --no-restore /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

# Render injects PORT; default to 10000 (Render's default) when unset.
ENV ASPNETCORE_ENVIRONMENT=Production \
    DOTNET_RUNNING_IN_CONTAINER=true \
    DOTNET_gcServer=0 \
    PORT=10000
EXPOSE 10000

USER $APP_UID

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -fs http://localhost:${PORT}/healthz || exit 1

ENTRYPOINT ["/bin/sh", "-c", "export ASPNETCORE_URLS=http://0.0.0.0:${PORT} && exec dotnet soFlottOS.Api.dll"]
