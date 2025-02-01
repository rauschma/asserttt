//========== Predicates ==========

/**
 * - Is type `X` equal to type `Y` (with `any` only being equal to itself)?
 * - Source: https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-421529650
 */
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false
;

/**
 * Does type `Sub` extend type `Sup`?
 */
export type Extends<Sub, Sup> = Sub extends Sup ? true : false;

/**
 * Is type `Target` assignable from type `Source`?
 */
export type Assignable<Target, Source> = Source extends Target ? true : false;

/**
 * Boolean NOT for type `B`.
 */
export type Not<B extends boolean> = B extends true ? false : true;

//========== Asserting ==========

/**
 * - Is type `_T` assignable to `true`
 * - Based on code by Blaine Bublitz.
 */
export type Assert<_T extends true> = void;

/**
 * Is the type of `_value` assignable to `T`?
 */
export function assertType<T>(_value: T): void { }
