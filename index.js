function assert(expr, msg) {
  if (!expr) {
    throw new Error(msg);
  }
}

export default function parse(
  flags,
  { argv = process.argv.slice(2), stopEarly = false } = {},
) {
  const result = {
    args: [],
    flags: {},
  };

  const shorthandFlags = {};

  for (const key in flags) {
    const { defaultValue, shorthand, type } = flags[key];

    assert(
      type === 'boolean' || type === 'number' || type === 'string',
      `type for "${key}" flag must be "boolean", "number", or "string`,
    );

    if (shorthand) {
      assert(
        shorthand.length === 1,
        `shorthand for "${key}" flag must be 1 character`,
      );
      shorthandFlags[shorthand] = key;
    }

    if (defaultValue) {
      assert(
        typeof defaultValue === type,
        `default value for "${key}" flag must be of type "${type}"`,
      );
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

    let beginName = 1;

    if (arg[1] === '-') {
      if (arg.length === 2) {
        result.args.push(...argv.slice(i + 1));
        break;
      }
      beginName = 2;
    }

    const beginValue = arg.indexOf('=');
    let name, value;

    if (beginValue > -1) {
      name = arg.substring(beginName, beginValue);
      value = arg.substring(beginValue + 1);
    } else {
      name = arg.substring(beginName);
    }

    if (beginName === 1) {
      if (name.length === 1) {
        name = shorthandFlags[name];
      } else {
        for (let j = 1; j < arg.length; j++) {
          const shorthand = arg[j];
          assert(shorthandFlags[shorthand], `unknown flag: "${arg[j]}"`);
          assert(
            flags[shorthandFlags[shorthand]].type === 'boolean',
            'only flags of type "boolean" can be stacked',
          );
          result.flags[shorthandFlags[shorthand]] = true;
        }
        continue;
      }
    }

    assert(flags[name], `unknown flag: "${name}"`);

    const { type } = flags[name];

    if (type === 'boolean') {
      if (value) {
        assert(
          value === 'true' || value === 'false',
          `"${name}" flag requires a value of type "boolean"`,
        );
        result.flags[name] = value === 'true';
      } else {
        result.flags[name] = true;
      }
      continue;
    }

    if (!value) {
      value = argv[i + 1];
      assert(
        value && (value[0] !== '-' || type === 'number'),
        `"${name}" flag requires a value of type "${type}"`,
      );
      i++;
    }

    if (type === 'number') {
      value = +value;
      assert(!isNaN(value), `"${name}" flag requires a value of type "number"`);
    }

    result.flags[name] = value;
  }

  return result;
}
