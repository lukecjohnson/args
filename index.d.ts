export interface Flag {
  description?: string;
  shorthand?: string;
}

export interface BooleanFlag extends Flag {
  type: 'boolean';
  default?: boolean;
}

export interface NumberFlag extends Flag {
  type: 'number';
  default?: number;
}

export interface StringFlag extends Flag {
  type: 'string';
  default?: string;
}

export interface ParseOptions {
  args?: string[];
  flags?: Record<string, BooleanFlag | NumberFlag | StringFlag>;
  disableHelp?: boolean;
  stopAtPositional?: boolean;
  usage?: string;
}

export interface ParseResult<T extends ParseOptions> {
  args: string[];
  flags: {
    [K in keyof T['flags']]?: T['flags'][K] extends BooleanFlag
      ? boolean
      : T['flags'][K] extends NumberFlag
      ? number
      : T['flags'][K] extends StringFlag
      ? string
      : never;
  };
}

export function parse<T extends ParseOptions>(options: T): ParseResult<T>;
