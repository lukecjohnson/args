# @lukecjohnson/flags

A quick, lightweight command-line argument and flag parser with basic type
checking, shorthand flags, and default values.

## Installation

```
npm install @lukecjohnson/flags
```

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
  - `shorthand`: A single-letter alias that can be used with a single dash on the
    command line (e.g. `-p` instead of `--port`)

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

- `argv`: Raw arguments that should be parsed (Default: `process.argv.slice(2)`)
- `stopEarly`: Whether `result.args` should be populated with every argument
  after the first non-flag argument (Default: `false`)

## Benchmarks

```
yargs-parser            24,777 ops/sec ±0.81% (94 runs sampled)
minimist                211,443 ops/sec ±0.56% (95 runs sampled)
mri                     477,898 ops/sec ±1.09% (94 runs sampled)
arg                     996,026 ops/sec ±0.75% (93 runs sampled)
@lukecjohnson/flags     2,109,096 ops/sec ±0.44% (92 runs sampled)
```

See [`/benchmark`](benchmark) for benchmark details
