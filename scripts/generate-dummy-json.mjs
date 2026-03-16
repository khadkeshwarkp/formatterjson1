import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = join(process.cwd(), 'public', 'dummy-json');
const TARGETS_KB = [64, 128, 256, 512, 1024, 5120];

const baseProfile = {
  city: 'Springfield',
  state: 'CA',
  country: 'USA',
  bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.',
};

function buildRecord(index) {
  const id = index + 1;
  return {
    id,
    name: `User ${id}`,
    email: `user${id}@example.com`,
    active: id % 2 === 0,
    score: 500 + (id % 97),
    created_at: `2024-01-${String((id % 28) + 1).padStart(2, '0')}T12:00:00Z`,
    tags: ['alpha', 'beta', 'gamma', 'delta'],
    profile: baseProfile,
    metrics: {
      logins: id % 25,
      sessions: id % 40,
      latency_ms: 120 + (id % 37),
    },
  };
}

function generateDataset(targetBytes) {
  const items = [];
  let json = '';
  while (true) {
    items.push(buildRecord(items.length));
    json = JSON.stringify({ items }, null, 2);
    if (Buffer.byteLength(json, 'utf8') >= targetBytes) {
      return { items, json };
    }
  }
}

function writeFile(name, content) {
  writeFileSync(join(OUT_DIR, name), content, 'utf8');
}

mkdirSync(OUT_DIR, { recursive: true });

for (const kb of TARGETS_KB) {
  const targetBytes = kb * 1024;
  const { items, json } = generateDataset(targetBytes);
  const prettyName = `${kb}KB.json`;
  const minName = `${kb}KB-min.json`;

  writeFile(prettyName, json);
  writeFile(minName, JSON.stringify({ items }));
  console.log(`Generated ${prettyName} and ${minName}`);
}

writeFile('missing-colon.json', '{"name" "John Doe"}');
writeFile('unterminated.json', '{"name": "John Doe"');
writeFile('binary-data.json', '{"binary": [0x00, 0xFF]}');

console.log('Invalid JSON samples generated.');
