# @lukecjohnson/flags

A quick, lightweight command-line argument and flag parser with type checking,
shorthand flags, and default values

## Installation

```
npm install @lukecjohnson/flags
```

*Note: `@lukecjohnson/flags` is an ESM-only package*

## Usage

`parse` parses command-line arguments according to the provided flag
definition object where each entry's key is a flag name and it's value is an
object describing the flag with the following properties:

- Required:
  - `type`: A string indicating the expected type of the flag's value
    (`'boolean'`, `'number'`, `'string'`)
- Optional:
  - `default`: The default value assigned to the flag if no value is provided by
    the end-user
  - `shorthand`: A single-letter alias that can be used with a single dash on
    the command line (e.g. `-p` instead of `--port`)
  - `description`: A short description of the flag to be included in the
    generated help text that is printed when the built-in `--help` or `-h` flag
    is provided

`parse` returns an object containing `args` and `flags`:

- `args`: Non-flag arguments provided by the end-user
- `flags`: Flags with default values or values provided by the end-user

### Example

```
node serve.js public --host 0.0.0.0 --port=8080 -d
```

```js
import { parse } from '@lukecjohnson/flags';

const { args, flags } = parse({
  host: {
    type: 'string',
    default: 'localhost',
    shorthand: 'H',
  },
  port: {
    type: 'number',
    default: 3000,
    shorthand: 'p',
  },
  debug: {
    type: 'boolean',
    default: false,
    shorthand: 'd',
  },
});

console.log({ args, flags });

/*
  {
    args: ['public'],
    flags: {
      host: '0.0.0.0',
      port: 8080,
      debug: true
    }
  }
*/
```

### Options

`parse` can accept an object as an optional second argument to customize its
behavior. The following options are available:

- `argv`: An array of raw arguments to be parsed (Default: `process.argv.slice(2)`)
- `usage`: The general usage pattern of the program or command to be included
  in the generated help text that is printed when the built-in `--help` or `-h`
  flag is provided (Example: `'node serve.js [directory] [flags]'`)
- `disableHelp`: When `true`, the built-in `--help` and `-h` flags are
  disabled (Default: `false`)
- `stopEarly`: When `true`, all arguments after the first non-flag argument are
  pushed to `result.args` (Default: `false`)

## Benchmarks

```
yargs-parser          27,173 ops/sec ±0.99% (89 runs sampled)
minimist              233,989 ops/sec ±3.20% (94 runs sampled)
mri                   550,229 ops/sec ±1.01% (92 runs sampled)
arg                   1,111,470 ops/sec ±0.60% (93 runs sampled)
@lukecjohnson/flags   2,355,067 ops/sec ±0.52% (96 runs sampled)
```

See [`/benchmark`](benchmark) for benchmark details
