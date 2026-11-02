---
description: 'Invoicing and tax generation rules for C# ASP.NET Core services'
applyTo: 'src/Services/**/*.cs, src/Controllers/**/*.cs'
---

# C# Tax & Invoicing Rules
- Always enforce German tax rules (§13b UStG Reverse Charge vs. §3a UStG vs. 19% MwSt).
- Ensure all generated invoice PDFs contain consecutive invoice numbers and compliant tax exemption notes.