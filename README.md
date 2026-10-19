# NoNap

Tiny, zero-dependency CLI mouse wiggler. Each wiggle moves the cursor 1px and straight back, so the final position never changes.

```sh
npm install -g nonap
nonap --start            # or: nonap -s
nonap -s -i 20 -t 2h     # every ~20s, stop after 2h
nonap config set interval 45
nonap --help
```

Options: `-i/--interval`, `-j/--jitter`, `-d/--distance`, `-p/--pattern nudge|random`, `-t/--duration`, `-q/--quiet`. Time values: `90`, `30m`, `2h`, `1h30m`. Config lives in `~/.nonap/config.json`.

Linux needs `xdotool` (X11) or `ydotool` (Wayland). macOS needs Accessibility permission for the terminal.
