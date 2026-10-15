VOS WEBSITE STARTER
===================

Domain:
valleyoperationservices.com

STRUCTURE (multi-page)
-----------------------
index.html            Home (hero + what we do)
services/index.html   Services page
worked-with/index.html  Worked With page (client list)
process/index.html    Process page
about/index.html       About / team page
contact/index.html     Contact page
styles.css             Shared site styling and responsive design
script.js              Mobile navigation + current year (shared across all pages)
vos-logo.png           Logo (referenced as /vos-logo.png from every page)

Each page shares the same header/nav and footer markup, copy-pasted into
each HTML file (no build step/templating). If you change the nav or footer,
update it in all six HTML files.

LOCAL PREVIEW
-------------
Open index.html in a browser. Internal links use root-relative paths
(e.g. /services/), so they work correctly once deployed, and also work
with a local static server (e.g. `npx serve .`). Opening the files
directly from disk (file://) may not resolve the leading-slash links
correctly in every browser.

DEPLOYMENT
----------
This folder can be uploaded to a GitHub repository and deployed with Cloudflare Pages.

Recommended Cloudflare Pages settings for this static site:
- Framework preset: None
- Build command: leave blank
- Build output directory: /
- Root directory: /

Cloudflare Pages automatically serves index.html for a folder request
(e.g. a visit to /services/ serves services/index.html), so no extra
redirect/routing config is needed.

Before publishing:
1. Replace contact@valleyoperationservices.com if you choose a different email.
2. Add your final VOS logo if desired.
3. Review service wording.
4. Add contact form backend/email routing.
5. Add favicon and social preview image.
