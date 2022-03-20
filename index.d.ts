export interface BaseFlag {
  shorthand?: string;
}

export interface BooleanFlag extends BaseFlag {
  type: 'boolean';
  defaultValue?: boolean;
}

export interface StringFlag extends BaseFlag {
  type: 'string';
  defaultValue?: string;
}

export interface NumberFlag extends BaseFlag {
  type: 'number';
  defaultValue?: number;
}

export interface Flags {
  [key: string]: BooleanFlag | StringFlag | NumberFlag;
}

export interface Options {
  argv?: string[];
  stopEarly?: boolean;
}

export interface Result<T extends Flags> {
  args: string[];
  flags: {
    [K in keyof T]?: T[K] extends BooleanFlag
      ? boolean
      : T[K] extends StringFlag
      ? string
      : T[K] extends NumberFlag
      ? number
      : never;
  };
}

export default function parse<T extends Flags>(
  flags: T,
  options: Options
): Result<T>;
