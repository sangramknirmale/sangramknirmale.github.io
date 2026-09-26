# sangramknirmale.github.io

Personal and research-group website of Sangram Krishna Nirmale, IIT Bombay.

## Structure

- `index.html`: home (about, research, consulting summary, projects, publications, teaching, awards, team, outreach, contact)
- `consulting.html`: consulting and sponsored research services
- `news.html`, `gallery.html`, `joinUs.html`
- `assets/site.css`, `assets/site.js`: the only stylesheet and script (no jQuery or theme files)
- `images/profile`, `images/team`, `images/gallery`: photos, resized for the web
- `sitemap.xml`, `robots.txt`: for search engines

## Updating

- **New paper:** copy an `<li>` in the Journal articles list in `index.html` and edit it. Wrap your name in `<span class="me">…</span>`.
- **New news item:** copy an `<li>` at the top of the list in `news.html`.
- **New team member:** resize the photo to about 480 px wide, save it in `images/team/`, and copy a `<li class="person">` block in `index.html`.
- **Photos:** keep them under about 1600 px wide and 400 KB.
- The header and footer are repeated in each HTML file; edit all five pages if you change the menu.
- After a major update, change `<lastmod>` in `sitemap.xml`.
