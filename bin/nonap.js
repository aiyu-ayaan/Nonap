#!/usr/bin/env node
'use strict';

const { parseArgs } = require('util');
const cfg = require('../src/config');
const { createMouse } = require('../src/mouse');
const { wiggle, nextDelay, sleep } = require('../src/wiggle');
const HELP = require('../src/help');
const pkg = require('../package.json');

const options = {
  start: { type: 'boolean', short: 's' },
  help: { type: 'boolean', short: 'h' },
  version: { type: 'boolean', short: 'v' },
  quiet: { type: 'boolean', short: 'q' },
  interval: { type: 'string', short: 'i' },
  jitter: { type: 'string', short: 'j' },
  distance: { type: 'string', short: 'd' },
  pattern: { type: 'string', short: 'p' },
  duration: { type: 'string', short: 't' },
};

function fail(msg) {
  console.error(`nonap: ${msg}\nTry "nonap --help".`);
  process.exit(1);
}

function configCommand(args) {
  const [sub, key, value] = args;
  if (!sub || sub === 'show') {
    console.log(`${cfg.CONFIG_PATH}\n${JSON.stringify(cfg.load(), null, 2)}`);
  } else if (sub === 'set') {
    if (!key || value === undefined) fail('usage: nonap config set <key> <value>');
    const next = cfg.load();
    next[key] = cfg.coerce(key, value);
    cfg.save(next);
    console.log(`saved ${key} = ${next[key]}`);
  } else if (sub === 'reset') {
    cfg.save({ ...cfg.DEFAULTS });
    console.log('config reset to defaults');
  } else {
    fail(`unknown config command "${sub}"`);
  }
}

async function run(settings, quiet) {
  const mouse = createMouse();
  const log = quiet ? () => {} : (m) => console.log(m);
  const startedAt = Date.now();
  const endAt = settings.duration ? startedAt + settings.duration * 1000 : Infinity;
  let stopping = false;
  let count = 0;

  const stop = () => {
    stopping = true;
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);

  log(
    `NoNap running: every ~${cfg.format(settings.interval)} (+/-${cfg.format(settings.jitter)}), ` +
      `${settings.pattern} ${settings.distance}px` +
      (settings.duration ? `, for ${cfg.format(settings.duration)}` : '') +
      '. Ctrl+C to stop.',
  );

  while (!stopping && Date.now() < endAt) {
    // Sleep in 250ms slices so Ctrl+C and the duration limit react quickly.
    const wakeAt = Date.now() + nextDelay(settings) * 1000;
    while (!stopping && Date.now() < Math.min(wakeAt, endAt)) await sleep(250);
    if (stopping || Date.now() >= endAt) break;
    await wiggle(mouse, settings);
    count++;
    log(`[${new Date().toLocaleTimeString()}] wiggle #${count}`);
  }

  log(`Stopped after ${cfg.format((Date.now() - startedAt) / 1000)}, ${count} wiggles.`);
}

async function main() {
  let parsed;
  try {
    parsed = parseArgs({ options, allowPositionals: true });
  } catch (e) {
    fail(e.message);
  }
  const { values, positionals } = parsed;

  if (values.help) return console.log(HELP);
  if (values.version) return console.log(pkg.version);
  if (positionals[0] === 'config') {
    try {
      return configCommand(positionals.slice(1));
    } catch (e) {
      fail(e.message);
    }
  }
  if (positionals.length) fail(`unknown command "${positionals[0]}"`);
  if (!values.start) return console.log(HELP);

  const settings = cfg.load();
  try {
    for (const key of ['interval', 'jitter', 'distance', 'pattern', 'duration']) {
      if (values[key] !== undefined) settings[key] = cfg.coerce(key, values[key]);
    }
    await run(settings, values.quiet);
  } catch (e) {
    fail(e.message);
  }
}

main();
