# Xperf
local performance tool for nodejs

## I. Install

```bash
npm install -g xperf
```

# II. Usage

Use ``xperf` to run nodejs application:

```bash
xperf start [app.js]
```

Immediately start profiling:

* `--start-cpu-profiling`
* `--start-gc-profiling`
* `--start-heap-profling`

Use a custom node executable:

* `--node [/path/to/node]`

Pass custom arguments to node:

* `--arg [arg1] --arg [arg2]`

# III. License

[BSD-2-Clause](LICENSE)