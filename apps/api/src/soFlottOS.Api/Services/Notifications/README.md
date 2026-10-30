# SMS and alert localization

All current notification events (`order_created`, `order_assigned`,
`driver_en_route`, `proof_of_delivery`) use typed order templates in German or
English. Linked customer/drop-off notifications use the customer's saved app
locale; manual clients use `X-App-Locale` from the triggering request. Missing
or unsupported locale selections default to German. The Next.js backend
adapter forwards the selected app locale for authenticated proxy requests.

`NotificationRequest.ForOrder` carries the order model to `NotificationQueue`,
which renders before persisting the existing outbox record. The background
worker/provider behavior is unchanged: retries send the stored body, never
re-render in a different locale. Amounts are EUR, delivery timestamps are
explicitly UTC, and unknown event types fail explicitly. Zero/negative travel
estimates are omitted instead of claiming an unavailable arrival time.

Arbitrary caller-provided bodies remain supported for non-template integrations;
all existing application notification producers use the localized templates.
