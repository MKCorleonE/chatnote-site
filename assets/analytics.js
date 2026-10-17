// The site token identifies a public beacon; it grants no access to the dashboard.
(() => {
  const token = document.currentScript?.dataset.siteToken;
  if (!token || !/^[a-f0-9]{32}$/.test(token)) return;
  // Keep local previews, mirrors and unrelated GitHub Pages projects out of analytics.
  if (location.protocol !== 'https:' || location.hostname !== 'mkcorleone.github.io') return;
  if (!location.pathname.startsWith('/chatnote-site/')) return;
  if (navigator.globalPrivacyControl === true || navigator.doNotTrack === '1') return;
  if (document.getElementById('chatnote-analytics-beacon')) return;
  const beacon = document.createElement('script');
  beacon.id = 'chatnote-analytics-beacon';
  beacon.type = 'module';
  beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  beacon.dataset.cfBeacon = JSON.stringify({ token, spa: false });
  document.head.appendChild(beacon);
})();
