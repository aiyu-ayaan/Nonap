'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const CONFIG_PATH = path.join(os.homedir(), '.nonap', 'config.json');

const DEFAULTS = {
  interval: 30, // seconds between wiggles
  jitter: 5, // random +/- seconds added to interval
  distance: 1, // max pixels moved per wiggle
  pattern: 'nudge', // nudge | random
  duration: 0, // seconds to run, 0 = until stopped
};

const PATTERNS = ['nudge', 'random'];

function load() {
  try {
    return { ...DEFAULTS, ...JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')) };
  } catch {
    return { ...DEFAULTS };
  }
}

function save(cfg) {
  fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2) + '\n');
}

// "90", "90s", "30m", "2h", "1h30m" -> seconds
function parseDuration(value) {
  if (typeof value === 'number') return value;
  const str = String(value).trim().toLowerCase();
  if (/^\d+(\.\d+)?$/.test(str)) return Number(str);
  const re = /(\d+(?:\.\d+)?)([hms])/g;
  const units = { h: 3600, m: 60, s: 1 };
  let total = 0;
  let matched = '';
  let m;
  while ((m = re.exec(str))) {
    total += Number(m[1]) * units[m[2]];
    matched += m[0];
  }
  if (!matched || matched !== str) throw new Error(`invalid duration: "${value}" (try 90, 30m, 2h, 1h30m)`);
  return total;
}

function format(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h && `${h}h`, m && `${m}m`, (s || (!h && !m)) && `${s}s`].filter(Boolean).join('');
}

// Validate + normalise a single key/value pair.
function coerce(key, value) {
  switch (key) {
    case 'interval':
    case 'jitter':
    case 'duration': {
      const n = parseDuration(value);
      if (n < 0 || (key === 'interval' && n < 1)) throw new Error(`${key} out of range`);
      return n;
    }
    case 'distance': {
      const n = Number(value);
      if (!Number.isInteger(n) || n < 1 || n > 50) throw new Error('distance must be an integer 1-50');
      return n;
    }
    case 'pattern':
      if (!PATTERNS.includes(value)) throw new Error(`pattern must be one of: ${PATTERNS.join(', ')}`);
      return value;
    default:
      throw new Error(`unknown key "${key}" (keys: ${Object.keys(DEFAULTS).join(', ')})`);
  }
}

module.exports = { CONFIG_PATH, DEFAULTS, PATTERNS, load, save, coerce, parseDuration, format };
