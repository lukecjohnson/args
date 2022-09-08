export default function parse(
  flags,
  { argv = process.argv.slice(2), stopEarly = false } = {},
) {
  const result = { args: [], flags: {} };
  const shorthandMap = {};

  for (const key in flags) {
    const { default: defaultValue, shorthand, type } = flags[key];

    if (type !== 'boolean' && type !== 'number' && type !== 'string') {
      throw new Error(
        `type for "${key}" flag must be "boolean", "number", or "string`,
      );
    }

    if (shorthand) {
      if (shorthand.length !== 1) {
        throw new Error(`shorthand for "${key}" flag must be 1 character`);
      }
      shorthandMap[shorthand] = key;
    }

    if (defaultValue) {
      if (typeof defaultValue !== type) {
        throw new Error(
          `default value for "${key}" flag must be of type "${type}"`,
        );
      }
      result.flags[key] = defaultValue;
    }
  }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg[0] !== '-') {
      result.args.push(arg);

      if (stopEarly) {
        result.args.push(...argv.slice(i + 1));
        break;
      }

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
        name = shorthandMap[name];
      } else {
        for (let j = 1; j < arg.length; j++) {
          const shorthand = arg[j];
          const mappedFlagName = shorthandMap[shorthand];

          if (!mappedFlagName) {
            throw new Error(`unknown flag: "${shorthand}"`);
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
      throw new Error(`unknown flag: "${name}"`);
    }

    if (flags[name].type === 'boolean') {
      if (value) {
        if (value !== 'true' && value !== 'false') {
          throw new Error(`"${name}" flag requires a value of type "boolean"`);
        }
        result.flags[name] = value === 'true';
      } else {
        result.flags[name] = true;
      }
      continue;
    }

    if (!value) {
      value = argv[i + 1];
      i++;
      if (!value || (value[0] === '-' && flags[name].type !== 'number')) {
        throw new Error(
          `"${name}" flag requires a value of type "${flags[name].type}"`,
        );
      }
    }

    if (flags[name].type === 'number') {
      value = +value;
      if (isNaN(value)) {
        throw new Error(`"${name}" flag requires a value of type "number"`);
      }
    }

    result.flags[name] = value;
  }

  return result;
}
