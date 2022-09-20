# @lukecjohnson/flags

A quick, lightweight command-line argument and flag parser with type checking,
shorthand flags, default values, and help text generation.

## Installation

```
npm install @lukecjohnson/flags
```

*Note: `@lukecjohnson/flags` is an ESM-only package*

## Usage

### Flag definitions

`parse` parses command-line arguments according to the provided flag
definition object where each entry's key is a flag name and it's value is an
object describing the flag with the following properties:

- `type`: A string indicating the expected type of the flag's value (required)
- `default`: The default value assigned to the flag if no value is provided by
  the end-user
- `shorthand`: A single-letter alias that can be used with a single dash on
  the command line
- `description`: A short description of the flag to be included in the
  generated help text

### Options

`parse` can accept an object as an optional second argument to customize its
behavior. The following options are available:

- `argv`: An array of raw arguments to be parsed (Default: `process.argv.slice(2)`)
- `usage`: The general usage pattern of the program or command to be included
  in the generated help text
- `disableHelp`: When `true`, the built-in `--help` and `-h` flags are
  disabled (Default: `false`)
- `stopEarly`: When `true`, all arguments after the first non-flag argument are
  pushed to `result.args` (Default: `false`)

### Result

`parse` returns an object containing `args` and `flags`:

- `args`: Non-flag arguments provided by the end-user
- `flags`: Flags with default values or values provided by the end-user


### Example

```js
import { parse } from '@lukecjohnson/flags';

const { args, flags } = parse(
  {
    host: {
      type: 'string',
      default: 'localhost',
      shorthand: 'H',
      description: 'Hostname to bind'
    },
    port: {
      type: 'number',
      default: 3000,
      shorthand: 'p',
      description: 'Port to bind'
    },
    debug: {
      type: 'boolean',
      default: false,
      shorthand: 'd',
      description: 'Show debugging information'
    }
  },
  { usage: 'node serve.js [directory] [flags]' }
);

console.log({ args, flags });

```


```console
$ node serve.js public --host 0.0.0.0 --port=8080 -d

{
  args: ['public'],
  flags: {
    host: '0.0.0.0',
    port: 8080,
    debug: true
  }
}
```


```console
$ node serve.js --help

Usage:
  node serve.js [directory] [flags]

Flags:
  -H, --host            Hostname to bind (Default: "localhost")
  -p, --port            Port to bind (Default: 3000)
  -d, --debug           Show debugging information (Default: false)

```

## Benchmarks

```
yargs-parser          24,706 ops/sec ±0.62% (92 runs sampled)
minimist              209,497 ops/sec ±0.54% (92 runs sampled)
mri                   505,183 ops/sec ±0.34% (91 runs sampled)
arg                   1,020,208 ops/sec ±0.75% (93 runs sampled)
@lukecjohnson/flags   2,085,279 ops/sec ±0.40% (94 runs sampled)
```

See [`/benchmark`](benchmark) for benchmark details
