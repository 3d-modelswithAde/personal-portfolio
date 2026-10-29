# Adediwura Afolabi — Portfolio

Personal portfolio website showcasing technical community management, hardware & engineering systems, workflow automation, and product marketing case studies.

## Case Studies Included

- **Smart Systems Research Laboratory** (`/smart-systems/`) — A 4-degree-of-freedom robot arm, modelled in SolidWorks
- **Workflow Automation** (`/automation/`) — Connecting enquiries across n8n, HubSpot, Gmail and Telegram
- **Akure Tech Hub Mechatronics Community** (`/akure-tech-hub/`) — Moderating a 114-member technical community across Robotics, ML, and 3D Modeling
- **MT Babs Foundation Scholars Community** (`/mtbabs-seminars/`) — Coordinating a 17-volunteer cross-functional committee for virtual technical seminars
- **Ovie’s Kitchen** (`/ovies-kitchen/`) — From a dormant account to 250+ paid transactions
- **BootClass** (`/bootclass/`) — Marathon Revision Class: 500+ reached, 300+ enrolled

## Tech Stack & Features

- Pure static HTML5, CSS3 (`site.css`), and vanilla JavaScript (`site.js`) with zero external runtime dependencies
- Light and dark theme support with `prefers-color-scheme` and persistent user toggle
- Viewport-triggered count-up motion design (`IntersectionObserver`, cubic-out easing, `tabular-nums`, respects `prefers-reduced-motion: reduce`)
- Accessible contact form with inline validation, prefilled editable enquiry template, optional `/api/contact` webhook relay (`CONTACT_WEBHOOK_URL`), and truthful `mailto:` + clipboard fallback
- Direct LinkedIn (`https://www.linkedin.com/in/adediwura-afolabi`) and Email (`adediwura.ainaafolabi@gmail.com`) actions

## Local Development

```bash
python3 -m http.server 8000
```
