export interface Flag {
  shorthand?: string;
}

export interface BooleanFlag extends Flag {
  type: 'boolean';
  defaultValue?: boolean;
}

export interface NumberFlag extends Flag {
  type: 'number';
  defaultValue?: number;
}

export interface StringFlag extends Flag {
  type: 'string';
  defaultValue?: string;
}

export interface Flags {
  [key: string]: BooleanFlag | NumberFlag | StringFlag;
}

export interface ParseOptions {
  argv?: string[];
  stopEarly?: boolean;
}

export interface ParseResult<T extends Flags> {
  args: string[];
  flags: {
    [K in keyof T]?: T[K] extends BooleanFlag
      ? boolean
      : T[K] extends NumberFlag
      ? number
      : T[K] extends StringFlag
      ? string
      : never;
  };
}

export default function parse<T extends Flags>(
  flags: T,
  options: ParseOptions,
): ParseResult<T>;
