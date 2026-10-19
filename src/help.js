'use strict';

const { DEFAULTS } = require('./config');

module.exports = `
NoNap - tiny CLI mouse wiggler. Keeps your machine awake.

Usage
  nonap --start [options]        start wiggling (alias: -s)
  nonap config                   show saved config
  nonap config set <key> <val>   save a default (interval, jitter, distance, pattern, duration)
  nonap config reset             restore defaults

Options
  -s, --start               start wiggling until Ctrl+C
  -i, --interval <time>     time between wiggles        (default ${DEFAULTS.interval}s)
  -j, --jitter <time>       random +/- on the interval  (default ${DEFAULTS.jitter}s)
  -d, --distance <px>       max pixels per wiggle, 1-50 (default ${DEFAULTS.distance})
  -p, --pattern <name>      nudge | random             (default ${DEFAULTS.pattern})
  -t, --duration <time>     stop after this long, 0 = never (default 0)
  -q, --quiet               no output while running
  -h, --help                show this help
  -v, --version             show version

Time values: 90, 90s, 30m, 2h, 1h30m

Examples
  nonap -s
  nonap -s -i 20 -t 2h
  nonap config set interval 45

Requires xdotool or ydotool on Linux. Works out of the box on Windows and macOS
(macOS: grant Accessibility permission to your terminal).
`.trimStart();
