# @lukecjohnson/args

A quick, lightweight command-line argument parser with type checking, 
shorthand flags, default values, and help text generation


## Installation

```
npm install @lukecjohnson/args
```

*Note: `@lukecjohnson/args` is an ESM-only package*


## Usage

### Options

`parse` accepts an `options` object that can be used to define flags and 
customize its behavior. The following options are available:

- `flags`: An object defining the flags the program or command accepts. Each 
  entry's key is a flag name that can be used with a double hyphen on the 
  command line (`--example`) and its value is an object further describing the 
  flag with the following properties:
  - `type`: A string indicating the expected type of the flag's value 
    ("string", "number", or "boolean")
  - `default`: The default value assigned to the flag if no value is provided by
    the end-user
  - `shorthand`: A single-letter alias that can be used with a single hyphen on
    the command line
  - `description`: A short description of the flag to be included in the
    generated help text
- `args`: An array of raw arguments to be parsed (Default: `process.argv.slice(2)`)
- `usage`: The general usage pattern of the program or command to be included
  in the generated help text
- `disableHelp`: When `true`, the built-in `--help` and `-h` flags are
  disabled (Default: `false`)
- `stopAtPositional`: When `true`, all arguments after the first positional,
  non-flag argument are pushed to `result.args` (Default: `false`)


### Result

`parse` returns an object containing `args` and `flags`:

- `args`: An array of non-flag arguments provided by the end-user
- `flags`: An object containing the values of flags provided by the end-user or 
  their default values


### Example

```js
import parse from '@lukecjohnson/args';

const { args, flags } = parse({
  flags: {
    host: {
      type: 'string',
      shorthand: 'H',
      description: 'Hostname to bind',
      default: 'localhost',
    },
    port: {
      type: 'number',
      shorthand: 'p',
      description: 'Port to bind',
      default: 3000,
    },
    debug: {
      type: 'boolean',
      shorthand: 'd',
      description: 'Show debugging information',
      default: false,
    }
  },
  usage: 'node serve.js [directory] [flags]'
});

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
@lukecjohnson/args    2,227,270 ops/sec ±0.70% (94 runs sampled)
arg                   1,067,095 ops/sec ±1.24% (92 runs sampled)
mri                     520,460 ops/sec ±0.39% (95 runs sampled)
minimist                216,378 ops/sec ±0.39% (97 runs sampled)
command-line-args        61,050 ops/sec ±0.85% (93 runs sampled)
yargs-parser             24,684 ops/sec ±2.47% (93 runs sampled)
```

See [`/benchmark`](benchmark) for benchmark details
