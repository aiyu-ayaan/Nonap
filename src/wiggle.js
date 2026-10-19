'use strict';

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

// One wiggle: step away, then straight back, so the cursor ends where it began.
async function wiggle(mouse, { pattern, distance }) {
  const [ux, uy] = DIRS[rand(0, DIRS.length - 1)];
  const step = pattern === 'random' ? rand(1, distance) : distance;
  const dx = ux * step;
  const dy = uy * step;
  mouse.move(dx, dy);
  await sleep(rand(30, 90));
  mouse.move(-dx, -dy);
  return { dx, dy };
}

// Seconds until the next wiggle, interval +/- jitter (never below 1s).
function nextDelay({ interval, jitter }) {
  return Math.max(1, interval + rand(-jitter, jitter));
}

module.exports = { wiggle, nextDelay, sleep };
