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

//========== Predicates: comparing types ==========

/**
 * - Is type `X` equal to type `Y` (with `any` only being equal to itself)?
 * - Source: https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-421529650
 */
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false
;

/**
 * Does type `Sub` extend type `Super`?
 */
export type Extends<Sub, Super> = Sub extends Super ? true : false;

/**
 * Is type `Target` assignable from type `Source`?
 */
export type Assignable<Target, Source> = Source extends Target ? true : false;

/**
 * Is type `Subset` a subset of type `Superset`?
 */
export type Includes<Superset, Subset> = Subset extends Superset ? true : false;

//========== Predicates: boolean operations ==========

/**
 * Boolean NOT for type `B`.
 */
export type Not<B extends boolean> = B extends true ? false : true;
