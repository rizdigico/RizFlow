# RizFlow SEO Setup Guide

Google blocked automated login from our VPS. Complete these steps manually from your browser.

## 1. Google Search Console Setup

1. Go to https://search.google.com/search-console
2. Click "Add property" → enter `rizflow.co`
3. Choose "HTML tag" verification method
4. Copy the `content` value from the meta tag (e.g. `abc123xyz`)
5. Replace `YOUR_GSC_VERIFICATION_CODE` in `index.html` with that value
6. Deploy the change
7. Click "Verify" in GSC

### Submit Sitemap

After verification:

1. In GSC, go to **Sitemaps** → enter `sitemap.xml` → Submit
2. Also submit to Bing: https://www.bing.com/webmasters → Add site → submit sitemap URL `https://rizflow.co/sitemap.xml`

### IndexNow (Instant Indexing for Bing/ChatGPT)

Already configured in `public/llms.txt`. To trigger:

```bash
curl "https://api.indexnow.org/IndexNow?key=rizflow2026&url=https://rizflow.co/&url=https://rizflow.co/about&url=https://rizflow.co/services&url=https://rizflow.co/audit&url=https://rizflow.co/blog&url=https://rizflow.co/demo&url=https://rizflow.co/case-study/rainfresh-sg"
```

## 2. Google Analytics 4 Setup

1. Go to https://analytics.google.com/
2. Create GA4 property for `rizflow.co`
3. Get your Measurement ID (format: `G-XXXXXXXXXX`)
4. Add to `index.html` in the `<head>` section:

```html
<!-- Google Analytics 4 -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-XXXXXXXXXX");
</script>
```

### Conversion Events to Track

Set these up in GA4 → Configure → Events:

- `form_submit` — when audit form is submitted
- `demo_click` — when Live Demo button is clicked
- `cta_click` — when any CTA button is clicked

## 3. Verification Status

- [x] llms.txt created
- [x] robots.txt updated with AI crawler directives
- [x] sitemap.xml fixed (removed 404, added new pages, staggered dates)
- [x] All pages have proper meta tags (title, description, OG, Twitter cards)
- [x] JSON-LD structured data (Organization, WebSite+SearchAction, Article, FAQPage, BreadcrumbList, Person)
- [x] Mobile CTA bar added
- [x] Form error handling fixed
- [x] Services H1 improved (value-first)
- [ ] GSC verification meta tag (needs manual replacement)
- [ ] GA4 tracking code (needs manual addition)
- [ ] Sitemap submitted to Google & Bing
- [ ] IndexNow API pinged
