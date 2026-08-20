// middleware.js
// Place this file at the ROOT of your repo (same level as vercel.json),
// replacing the previous version. Vercel auto-detects it and runs it on
// every request — no project settings changes needed.
//
// This injects Google Tag Manager instead of a direct GA4 tag:
//   - the GTM script goes before </head>
//   - the GTM <noscript> fallback goes right after the opening <body> tag
//
// IMPORTANT: don't run this alongside the old GA4-only middleware — GTM
// will fire GA4 for you once you add the GA4 Configuration tag inside
// the GTM dashboard, so keeping both would double-count pageviews.

export const config = {
  matcher: '/((?!_next|api|.*\\.(?:js|css|png|jpg|jpeg|gif|svg|ico|webp|woff2?|xml|txt|json)$).*)',
};

const GTM_ID = 'GTM-T4RBFL4H';

const HEAD_SNIPPET = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');</script>
<!-- End Google Tag Manager -->`;

const BODY_SNIPPET = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;

export default async function middleware(request) {
  const response = await fetch(request);
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('text/html')) {
    return response;
  }

  let html = await response.text();
  let changed = false;

  // Inject head snippet, unless a GTM script is already present
  if (!html.includes('googletagmanager.com/gtm.js') && html.includes('</head>')) {
    html = html.replace('</head>', `${HEAD_SNIPPET}\n</head>`);
    changed = true;
  }

  // Inject body snippet right after the opening <body ...> tag,
  // unless the noscript fallback is already present
  if (!html.includes('googletagmanager.com/ns.html')) {
    const bodyTagMatch = html.match(/<body[^>]*>/i);
    if (bodyTagMatch) {
      const bodyTag = bodyTagMatch[0];
      html = html.replace(bodyTag, `${bodyTag}\n${BODY_SNIPPET}`);
      changed = true;
    }
  }

  if (!changed) {
    return new Response(html, {
      status: response.status,
      headers: response.headers,
    });
  }

  // Content-Length no longer matches the modified body
  const headers = new Headers(response.headers);
  headers.delete('content-length');

  return new Response(html, {
    status: response.status,
    headers,
  });
}
