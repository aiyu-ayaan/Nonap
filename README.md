# NoNap

Tiny, zero-dependency CLI mouse wiggler. Keeps your machine awake.

Each wiggle moves the cursor a pixel or so and straight back, so the final position never changes and the movement is hard to notice.

## Install

```sh
npm install -g @aiyu-ayaan/nonap
```

Or from a clone: `npm link`.

## Usage

```sh
nonap --start              # or: nonap -s
nonap -s -i 20 -t 2h       # wiggle every ~20s, stop after 2h
nonap -s -p random -d 3    # random direction, up to 3px
nonap --help               # or: nonap -h
```

## Options

| Flag | Long | Meaning | Default |
| --- | --- | --- | --- |
| `-s` | `--start` | Start wiggling until Ctrl+C | |
| `-i` | `--interval <time>` | Time between wiggles | `30s` |
| `-j` | `--jitter <time>` | Random ± added to the interval, so timing is not robotic | `5s` |
| `-d` | `--distance <px>` | Max pixels per wiggle, 1-50 | `1` |
| `-p` | `--pattern <name>` | `nudge` (fixed distance) or `random` (1 to distance) | `nudge` |
| `-t` | `--duration <time>` | Stop after this long, `0` = never | `0` |
| `-q` | `--quiet` | No output while running | |
| `-h` | `--help` | Show help | |
| `-v` | `--version` | Show version | |

Time values: `90`, `90s`, `30m`, `2h`, `1h30m`.

## Config

Save defaults so you do not retype flags. Stored in `~/.nonap/config.json`. Flags override saved values.

```sh
nonap config                    # show
nonap config set interval 45
nonap config set distance 2
nonap config reset
```

Keys: `interval`, `jitter`, `distance`, `pattern`, `duration`.

## Platform support

- **Linux:** needs `xdotool` (X11) or `ydotool` (Wayland).
- **Windows:** works out of the box (PowerShell).
- **macOS:** works out of the box; grant Accessibility permission to your terminal.

## License

[MIT](LICENSE)
