import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { analyticsMarkup } from './analytics.mjs';

const config = JSON.parse(fs.readFileSync(new URL('../data/analytics.json', import.meta.url), 'utf8'));
const source = fs.readFileSync(new URL('../assets/analytics.js', import.meta.url), 'utf8');
function simulate({ url = 'https://mkcorleone.github.io/chatnote-site/', token = config.siteToken, privacy = {}, duplicate = false } = {}) {
  const scripts = [];
  const document = {
    currentScript: { dataset: { siteToken: token } },
    getElementById: () => duplicate || scripts[0],
    createElement: () => ({ dataset: {} }),
    head: { appendChild: script => scripts.push(script) },
  };
  const context = vm.createContext({ document, location: new URL(url), navigator: privacy });
  vm.runInContext(source, context);
  vm.runInContext(source, context);
  return scripts;
}
test('production pages load one official beacon with the public site token', () => {
  for (const page of ['', 'privacy.html', 'en/downloads.html', 'zh-hant/index.html']) {
    const scripts = simulate({ url: `https://mkcorleone.github.io/chatnote-site/${page}` });
    assert.equal(scripts.length, 1);
    assert.equal(scripts[0].type, 'module');
    assert.equal(scripts[0].src, 'https://static.cloudflareinsights.com/beacon.min.js');
    assert.deepEqual(JSON.parse(scripts[0].dataset.cfBeacon), { token: config.siteToken, spa: false });
  }
});
test('previews, other projects and mirrors send no analytics', () => {
  for (const url of ['http://127.0.0.1:4174/chatnote-site/', 'file:///D:/chatnote-site/index.html', 'https://example.com/chatnote-site/', 'https://mkcorleone.github.io/other/', 'https://mkcorleone.github.io/chatnote-site-copy/', 'http://mkcorleone.github.io/chatnote-site/']) {
    assert.equal(simulate({ url }).length, 0);
  }
});
test('privacy preferences, missing tokens and duplicate beacons are respected', () => {
  for (const privacy of [{ globalPrivacyControl: true }, { doNotTrack: '1' }]) assert.equal(simulate({ privacy }).length, 0);
  assert.equal(simulate({ token: '' }).length, 0);
  assert.equal(simulate({ token: 'not-a-token' }).length, 0);
  assert.equal(simulate({ duplicate: true }).length, 0);
});
test('disabled configuration emits no loader; enabled configuration validates its scope', () => {
  assert.equal(analyticsMarkup({ enabled: false }, './'), '');
  assert.match(analyticsMarkup(config, '../'), /src="\.\.\/assets\/analytics\.js"/);
  assert.throws(() => analyticsMarkup({ ...config, siteToken: 'secret' }, './'));
  assert.throws(() => analyticsMarkup({ ...config, hostname: 'example.com' }, './'));
});
