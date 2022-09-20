export function parse(
  flags,
  {
    argv = process.argv.slice(2),
    disableHelp = false,
    stopAtPositional = false,
    usage,
  } = {},
) {
  const result = { args: [], flags: {} };
  const shorthandMap = {};

  for (const key in flags) {
    const flag = flags[key];

    if (!disableHelp && (key === 'help' || flag.shorthand === 'h')) {
      throw new Error(
        '"--help" and "-h" are built-in flags - set the `disableHelp` option ' +
          'to disable them',
      );
    }

    if (
      flag.type !== 'boolean' &&
      flag.type !== 'number' &&
      flag.type !== 'string'
    ) {
      throw new Error(
        `type for "${key}" flag must be "boolean", "number", or "string`,
      );
    }

    if (flag.shorthand) {
      if (flag.shorthand.length !== 1) {
        throw new Error(`shorthand for "${key}" flag must be 1 character`);
      }

      shorthandMap[flag.shorthand] = key;
    }

    if (flag.default !== undefined) {
      if (typeof flag.default !== flag.type) {
        throw new Error(
          `default value for "${key}" flag must be of type "${flag.type}"`,
        );
      }

      result.flags[key] = flag.default;
    }
  }

  if (!disableHelp) {
    flags.help = { type: 'boolean' };
    shorthandMap.h = 'help';
  }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg[0] !== '-') {
      if (stopAtPositional) {
        result.args.push(...argv.slice(i));
        break;
      }

      result.args.push(arg);
      continue;
    }

    let nameStartIndex = 1;

    if (arg[1] === '-') {
      if (arg.length === 2) {
        result.args.push(...argv.slice(i + 1));
        break;
      }

      nameStartIndex = 2;
    }

    let name, value;
    const valueStartIndex = arg.indexOf('=');

    if (valueStartIndex > -1) {
      name = arg.substring(nameStartIndex, valueStartIndex);
      value = arg.substring(valueStartIndex + 1);
    } else {
      name = arg.substring(nameStartIndex);
    }

    if (nameStartIndex === 1) {
      if (name.length === 1) {
        const mappedFlagName = shorthandMap[name];

        if (!mappedFlagName) {
          throw new Error(`unknown flag: -${name}`);
        }

        name = mappedFlagName;
      } else {
        for (let j = 1; j < arg.length; j++) {
          const shorthand = arg[j];
          const mappedFlagName = shorthandMap[shorthand];

          if (!mappedFlagName) {
            throw new Error(`unknown flag: -${shorthand}`);
          }

          if (flags[mappedFlagName].type !== 'boolean') {
            throw new Error('only flags of type "boolean" can be stacked');
          }

          result.flags[mappedFlagName] = true;
        }

        continue;
      }
    }

    if (!flags[name]) {
      throw new Error(`unknown flag: --${name}`);
    }

    if (flags[name].type === 'boolean') {
      if (!value) {
        result.flags[name] = true;
        continue;
      }

      if (value !== 'true' && value !== 'false') {
        throw new Error(`"${name}" flag requires a value of type "boolean"`);
      }

      result.flags[name] = value === 'true';
      continue;
    }

    if (!value) {
      value = argv[i + 1];

      if (!value || (value[0] === '-' && flags[name].type !== 'number')) {
        throw new Error(
          `"${name}" flag requires a value of type "${flags[name].type}"`,
        );
      }

      i++;
    }

    if (flags[name].type === 'number') {
      value = +value;

      if (isNaN(value)) {
        throw new Error(`"${name}" flag requires a value of type "number"`);
      }
    }

    result.flags[name] = value;
  }

  if (!disableHelp && result.flags.help) {
    let output = '\n';

    if (usage) {
      output += `Usage:\n  ${usage}\n\n`;
    }

    output += 'Flags:\n';

    for (const key in flags) {
      const flag = flags[key];

      if (!flag.description) {
        continue;
      }

      output += '  ';

      if (flag.shorthand) {
        output += `-${flag.shorthand}, `;
      }

      output += `--${key}\t\t${flag.description}`;

      if (flag.default !== undefined) {
        output += ` (Default: ${
          flag.type === 'string' ? `"${flag.default}"` : flag.default
        })`;
      }

      output += '\n';
    }

    console.log(output);
    process.exit();
  }

  return result;
}
