'use strict';

const { execFileSync, spawnSync } = require('child_process');

function has(cmd) {
  return spawnSync(process.platform === 'win32' ? 'where' : 'which', [cmd], { stdio: 'ignore' }).status === 0;
}

// Each backend exposes move(dx, dy): relative cursor move in pixels.
function linux() {
  if (has('xdotool') && process.env.DISPLAY) {
    return (dx, dy) => execFileSync('xdotool', ['mousemove_relative', '--', String(dx), String(dy)], { stdio: 'ignore' });
  }
  if (has('ydotool')) {
    return (dx, dy) => execFileSync('ydotool', ['mousemove', '-x', String(dx), '-y', String(dy)], { stdio: 'ignore' });
  }
  throw new Error('need `xdotool` (X11) or `ydotool` (Wayland): e.g. sudo apt install xdotool');
}

function windows() {
  const ps = (dx, dy) =>
    "Add-Type -MemberDefinition '[DllImport(\"user32.dll\")] public static extern void mouse_event(int f,int x,int y,int d,int e);' " +
    `-Name M -Namespace N; [N.M]::mouse_event(1,${dx},${dy},0,0)`;
  return (dx, dy) => execFileSync('powershell', ['-NoProfile', '-NonInteractive', '-Command', ps(dx, dy)], { stdio: 'ignore' });
}

function mac() {
  const js = (dx, dy) =>
    "ObjC.import('CoreGraphics');" +
    "var p=$.CGEventGetLocation($.CGEventCreate($()));" +
    `var e=$.CGEventCreateMouseEvent($(),$.kCGEventMouseMoved,{x:p.x+(${dx}),y:p.y+(${dy})},0);` +
    '$.CGEventPost($.kCGHIDEventTap,e);';
  return (dx, dy) => execFileSync('osascript', ['-l', 'JavaScript', '-e', js(dx, dy)], { stdio: 'ignore' });
}

function createMouse() {
  switch (process.platform) {
    case 'linux':
      return { move: linux() };
    case 'win32':
      return { move: windows() };
    case 'darwin':
      return { move: mac() };
    default:
      throw new Error(`unsupported platform: ${process.platform}`);
  }
}

module.exports = { createMouse };
