# assert-type

**Experimental API, currently in testing. Feedback welcome!**

## About the npm package assert-type

* Use cases:
  * Documenting types in code examples (e.g. via [Markcheck](https://github.com/rauschma/markcheck))
  * Testing utility types
* No non-dev dependencies

### Complementary tools

If a file contains type tests, it’s not enough to run it, we must also type-check it:

* [tsx (TypeScript Execute)](https://www.npmjs.com/package/tsx) is a tool that type-checks files before running them.
* [ts-expect-error](https://www.npmjs.com/package/ts-expect-error) additionally checks if each `@ts-expect-error` annotation prevents the right kind of error.

### Related work

* Package [ts-expect](https://github.com/TypeStrong/ts-expect) inspired this package. It’s very similar. This package uses different names and has a utility type `Assert` (which doesn’t produce runtime code):
  ```ts
  type _ = Assert<Equal<X,Y>>; // assert-type
  expectType<TypeEqual<X, Y>>(true); // ts-expect
  ```

* The type-challenges repository has [a module with utility types for exercises](https://github.com/type-challenges/type-challenges/blob/main/utils/index.d.ts). How is assert-type different?
  * Smaller API
  * Different names
  * Implements boolean NOT via a helper type `Not`.

* [eslint-plugin-expect-type](https://www.npmjs.com/package/eslint-plugin-expect-type) supports an elegant notation but requires a special tool (eslint) to run.

<!-- ############################################################ -->

## Usage

### Asserting types

```ts
type Pair<X> = [X, X];
type _1 = Assert<Equal<Pair<'a'>, ['a', 'a']>>;
type _2 = Assert<Not<Equal<Pair<'a'>, ['x', 'x']>>>;

type _ = [
  Assert<AssignableFrom<number, 123>>,
  Assert<Extends<'a', 'a'|'b'>>,
];
```

### Asserting the types of values

```ts
const n = 3 + 1;
assertType<number>(n);
```

### Predicates

* `Equal<X, Y>`
* `Extends<Sub, Sup>`
* `AssignableFrom<Target, Source>`

### Using the utility types in a TypeScript Playground

```ts
import type { Assert, Equal } from 'assert-type';
```

<!-- ############################################################ -->

## How does the code work?

### Comparing types

#### Naive solution

The problem with a naive solution is that it fails for `any` (last line):

```ts
type Equal<X, Y> =
  X extends Y
    ? Y extends X
      ? true
      : false
    : false
;
type B1 = Equal<123, number>; // false
type B2 = Equal<['a', 'b'], ['a', 'b']>; // true
type B3 = Equal<any, 123>; // boolean
```

#### Proper solution

In contrast, the following non-intuitive solution works even for `any`:

```ts
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends // (A)
  (<T>() => T extends Y ? 1 : 2) ? true : false // (B)
;
type B = Equal<any, 123>; // false
```

It was suggested by Matt McCutchen ([source](https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-421529650)). How does it work ([source](https://github.com/microsoft/TypeScript/issues/27024#issuecomment-510924206))?

In order to check whether the function type in line A extends the function type in line B, TypeScript has to compare the following two conditional types:

```ts
T extends X ? 1 : 2
T extends Y ? 1 : 2
```

Since `T` does not have a value, both conditional types are _deferred_. Assignability of two deferred conditional types is computed via the internal function `isTypeIdenticalTo()` and only `true` if:

1. Both have the same constraint.
2. Their “then” branches have the same type and their “else” branches have the same type.

Thanks to #1, `X` and `Y` are compared precisely.

### Asserting

```ts
type Assert<_T extends true> = void;
```

Alas, we can’t conditionally produce errors at the type level. That’s why we need to resort to a type parameter whose `extends` constraint requires it to be assignable to `true`.

<!-- ############################################################ -->

## Potential future additions

* type-challenges has [several interesting utility types](https://github.com/type-challenges/type-challenges/blob/main/utils/index.d.ts). These look most useful:
  * `Debug`
  * `IsAny`

<!-- ############################################################ -->

## Acknowledgements

* `Assert` is based on code by Blaine Bublitz.
