# asserttt: minimal API for testing types

**Experimental API, currently in testing. Feedback welcome!**

---

Table of contents:

* [About asserttt](#about-asserttt)
* [Complementary tools](#complementary-tools)
* [Usage](#usage)
* [How does the code work?](#how-does-the-code-work)
* [Related work](#related-work)
* [Potential future additions](#potential-future-additions)
* [Acknowledgements](#acknowledgements)

---

<!-- ############################################################ -->

## About asserttt

```js
npm install asserttt
```

* Use cases:
  * Documenting types in code examples (e.g. via [Markcheck](https://github.com/rauschma/markcheck))
  * Testing utility types
* No non-dev dependencies

<!-- ############################################################ -->

## Complementary tools

If a file contains type tests, it’s not enough to run it, we must also type-check it:

* [tsx (TypeScript Execute)](https://www.npmjs.com/package/tsx) is a tool that type-checks files before running them.
  * It works well with the Mocha test runner: [example setup](https://github.com/mochajs/mocha-examples/tree/main/packages/typescript-tsx-esm-import)
* [ts-expect-error](https://www.npmjs.com/package/ts-expect-error) additionally checks if each `@ts-expect-error` annotation prevents the right kind of error.
* [Markcheck](https://github.com/rauschma/markcheck) tests Markdown code blocks.

<!-- ############################################################ -->

## Usage

### Asserting a type predicate invocation `P`: `Assert<P>`

```ts
type Pair<X> = [X, X];
type _1 = Assert<Equal<Pair<'a'>, ['a', 'a']>>;
type _2 = Assert<Not<Equal<Pair<'a'>, ['x', 'x']>>>;

type _ = [
  Assert<Assignable<number, 123>>,
  Assert<Extends<'a', 'a'|'b'>>,
];
```

#### Included type predicates

* `Equal<X, Y>`
* `Extends<Sub, Sup>`
* `Assignable<Target, Source>`

### Asserting the type of a value: `assertType<T>(v)`

```ts
const n = 3 + 1;
assertType<number>(n);
```

### Using the utility types in a TypeScript Playground

```ts
import type { Assert, Equal } from 'asserttt';
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
type B1 = Equal<123, number>; // OK: false
type B2 = Equal<['a', 'b'], ['a', 'b']>; // OK: true
type B3 = Equal<any, 123>; // // not OK: boolean
```

#### Proper solution

In contrast, the following non-intuitive solution works even for `any`:

```ts
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends // (A)
  (<T>() => T extends Y ? 1 : 2) ? true : false // (B)
;
type B = Equal<any, 123>; // OK: false
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

## Related work

* Package [ts-expect](https://github.com/TypeStrong/ts-expect) inspired this package. It’s very similar. This package uses different names and has a utility type `Assert` (which doesn’t produce runtime code):
  ```ts
  type _ = Assert<Equal<X,Y>>; // asserttt
  expectType<TypeEqual<X, Y>>(true); // ts-expect
  ```

* The type-challenges repository has [a module with utility types for exercises](https://github.com/type-challenges/type-challenges/blob/main/utils/index.d.ts). How is asserttt different?
  * Smaller API
  * Different names
  * Implements boolean NOT via a helper type `Not` (vs. two versions of the same utility type).

* [eslint-plugin-expect-type](https://www.npmjs.com/package/eslint-plugin-expect-type) supports an elegant notation but requires a special tool (eslint) for checking.

<!-- ############################################################ -->

## Potential future additions

* type-challenges has [several interesting utility types](https://github.com/type-challenges/type-challenges/blob/main/utils/index.d.ts). These look useful but I’m not yet sure how:
  * `Debug`
  * `IsAny`

<!-- ############################################################ -->

## Acknowledgements

* `Assert` is based on code by Blaine Bublitz.
