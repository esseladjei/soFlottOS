import Image, {type StaticImageData} from "next/image";

export function MarketingVisual({
    src,
    priority = false,
    sizes = "(min-width: 1024px) 42vw, 100vw",
}: {
    src: StaticImageData;
    priority?: boolean;
    sizes?: string;
}) {
    return (
        <Image
            alt=""
            className="block h-auto w-full object-contain"
            priority={priority}
            sizes={sizes}
            src={src}
        />
    );
}
