// Owner-side utility only. Never imported by a website page.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = new Set(process.argv.slice(2));
if ([...args].some(arg => !['--github-login', '--save'].includes(arg))) throw new Error('Options: --github-login --save');
let token;
if (args.has('--github-login')) {
  const credential = spawnSync('git', ['credential', 'fill'], {
    input: 'protocol=https\nhost=github.com\nusername=MKCorleonE\n\n', encoding: 'utf8',
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'never' },
  });
  token = credential.status === 0 ? credential.stdout.split('\n').find(line => line.startsWith('password='))?.slice(9).trim() : null;
  if (!token) throw new Error('No existing GitHub login. Sign in with Git Credential Manager first. Never put credentials in this repository.');
}
async function getReleases(repository) {
  const releases = [];
  for (let page = 1; ; page++) {
    const response = await fetch(`https://api.github.com/repos/MKCorleonE/${repository}/releases?per_page=100&page=${page}`, {
      headers: { Accept: 'application/vnd.github+json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error(`GitHub returned ${response.status} for ${repository}. For API rate limits, retry with --github-login; a failed query is not zero downloads.`);
    const batch = await response.json();
    if (!Array.isArray(batch)) throw new Error('Unexpected GitHub response');
    releases.push(...batch);
    if (batch.length < 100) return releases;
  }
}
try {
  const assets = [];
  for (const repository of ['ChatNote', 'chatnote-site']) {
    for (const release of await getReleases(repository)) {
      if (release.draft) continue;
      for (const asset of release.assets) {
        if (!asset.name.endsWith('.exe')) continue;
        if (!Number.isSafeInteger(asset.download_count) || asset.download_count < 0) throw new Error('Invalid download counter');
        assets.push({ repository, version: release.tag_name, file: asset.name, downloads: asset.download_count, kind: asset.name.endsWith('-setup.exe') ? 'installer' : 'direct' });
      }
    }
  }
  const checkedAt = new Date().toISOString();
  const totals = Object.fromEntries(['installer', 'direct'].map(kind => [kind, assets.filter(a => a.kind === kind).reduce((n, a) => n + a.downloads, 0)]));
  console.log(`Checked: ${new Date(checkedAt).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })} (Asia/Shanghai)`);
  console.table(assets);
  console.log(`Installers: ${totals.installer}; direct executables: ${totals.direct}. Includes repeat, verification and update downloads; not installed users.`);
  if (args.has('--save')) {
    const directory = path.join(root, '.cache', 'download-counts');
    fs.mkdirSync(directory, { recursive: true });
    const file = path.join(directory, checkedAt.replaceAll(':', '-') + '.json');
    fs.writeFileSync(file, JSON.stringify({ checkedAt, assets, totals }, null, 2) + '\n');
    console.log(`Local snapshot: ${file}`);
  }
} catch (error) {
  console.error(token ? error.message.replaceAll(token, '[redacted]') : error.message);
  process.exitCode = 1;
}
