// https://gist.github.com/rauschma/7f23068c0dd00bba3f59df955101e421

// • API for asserting types (think unit tests for types)
// • Inspiration: https://github.com/TypeStrong/ts-expect
// • Feedback welcome!

//==================== Asserting types ====================

// https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-421529650
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false;

// Is `Target` assignable from `Source`?
export type Assignable<Target, Source> = Source extends Target ? true : false;

// Credit: Blaine Bublitz
export type Assert<_T extends true> = void;

// ❌ Would be useful – but I don’t see how:
// @ts-expect-error: Type 'Equal<X, Y>' does not satisfy the constraint 'true'.
export type AssertEqual<X, Y> = Assert<Equal<X, Y>>;

// Is the type of `_value` assignable to `T`?
export function assertType<T>(_value: T): void {}

export type Not<B extends boolean> = B extends true ? false : true;

//---------- Usage ----------

type _1 = Assert<Assignable<number, 123>>;

type Pair<X> = [X, X];
type _2 = Assert<Equal<Pair<'a'>, ['a', 'a']>>;

//==================== Simple assertions for non-test code ====================

/**
 * Useful whenever you don’t want to use Node’s built-in `assert()` or
 * `assert.ok()` – e.g. in browsers.
 */
export function assertTrue(value: boolean, message=''): asserts value {
  if (!value) {
    throw new TypeError(message);
  }
}

export function assertNonNullable<T>(value: T, message?: string): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    message ??= 'Value must not be undefined or null';
    throw new TypeError('Failed: ' + message);
  }
}

//==================== Exhaustiveness checking ====================

export class UnsupportedValueError extends Error {
  constructor(value: never, message = `Unsupported value: ${String(value)}`) {
    super(message)
  }
}

//---------- Usage ----------

enum Color {Red, Green}
function colorToString(color: Color) {
  switch (color) {
    case Color.Red:
      return 'RED';
    case Color.Green:
      return 'GREEN';
    default:
      throw new UnsupportedValueError(color);
  }
}
