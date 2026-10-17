import assert from 'node:assert/strict';

export function analyticsMarkup(config, base) {
  assert.equal(typeof config.enabled, 'boolean', 'Analytics enabled must be a boolean');
  if (!config.enabled) return '';
  assert.match(config.siteToken, /^[a-f0-9]{32}$/, 'Use the public Cloudflare site token, not an API credential');
  assert.equal(config.hostname, 'mkcorleone.github.io', 'Review analytics scope before changing the hostname');
  assert.equal(config.pathPrefix, '/chatnote-site/', 'Review analytics scope before changing the path');
  return `<script src="${base}assets/analytics.js" data-site-token="${config.siteToken}" defer></script>`;
}
