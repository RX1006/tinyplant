// middleware.js
// Place this file at the ROOT of your repo (same level as vercel.json).
// Vercel auto-detects it and runs it on every request — no project
// settings changes needed. It injects the GA4 snippet into every HTML
// page's <head>, including pages you add in the future, so you never
// have to touch individual files again.

export const config = {
  // Run on page requests; skip static assets and API routes.
  matcher: '/((?!_next|api|.*\\.(?:js|css|png|jpg|jpeg|gif|svg|ico|webp|woff2?|xml|txt|json)$).*)',
};

const GA_ID = 'G-ZJS83T4QJ0';

const GA_SNIPPET = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_ID}');
</script>`;

export default async function middleware(request) {
  const response = await fetch(request);
  const contentType = response.headers.get('content-type') || '';

  // Only touch HTML responses — leave images, CSS, JSON, etc. untouched.
  if (!contentType.includes('text/html')) {
    return response;
  }

  const html = await response.text();

  // Don't double-inject on pages that already have the tag
  // (e.g. any you already added manually).
  if (html.includes('googletagmanager.com/gtag/js')) {
    return new Response(html, {
      status: response.status,
      headers: response.headers,
    });
  }

  if (!html.includes('</head>')) {
    return new Response(html, {
      status: response.status,
      headers: response.headers,
    });
  }

  const modified = html.replace('</head>', `${GA_SNIPPET}</head>`);

  // Content-Length no longer matches the modified body, so drop it
  // and let Vercel recalculate/stream correctly.
  const headers = new Headers(response.headers);
  headers.delete('content-length');

  return new Response(modified, {
    status: response.status,
    headers,
  });
}
