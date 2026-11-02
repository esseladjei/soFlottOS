---
description: 'Rules for Driver PWA and Proof of Delivery components'
applyTo: 'app/driver/**/*.tsx, components/driver/**/*.tsx'
---

# Driver PWA Guidelines
- Always capture HTML5 Canvas signatures as Base64 strings.
- Fetch device GPS coordinates via `navigator.geolocation` prior to submitting Proof of Delivery (PoD). and make the explicit GPS capture button action only when automatic capture fails.