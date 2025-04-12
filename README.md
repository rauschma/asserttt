# asserttt: minimal API for testing types

---

Table of contents:

* [Installation](#installation)
* [Use cases](#use-cases)
* [Complementary tools](#complementary-tools)
* [Usage](#usage)
* [API](#api)
* [How does the code work?](#how-does-the-code-work)
* [Related work](#related-work)

---

<!-- ############################################################ -->

## Installation

```js
npm install asserttt
```

`asserttt` has no non-dev dependencies!

<!-- ############################################################ -->

## Use cases

* Testing types
* Documenting TypeScript with code examples (e.g. via [Markcheck](https://github.com/rauschma/markcheck))
* Support for TypeScript exercises, such as the ones provided by [`Type<Challenge[]>`](https://tsch.js.org).
* [Testing that related types are consistent](https://exploringjs.com/ts/book/ch_testing-types.html#type-level-assertions-in-normal-code) in normal code

<!-- ############################################################ -->

## Complementary tools

If a file contains type tests, it’s not enough to run it, we must also type-check it:

* [tsx (TypeScript Execute)](https://www.npmjs.com/package/tsx) is a tool that type-checks files before running them.
  * It works well with the Mocha test runner: [example setup](https://github.com/mochajs/mocha-examples/tree/main/packages/typescript-tsx-esm-import)
* [ts-expect-error](https://www.npmjs.com/package/ts-expect-error) performs two tasks:
  * Checking if each `@ts-expect-error` annotation prevents the right kind of error
  * Optional: reporting errors detected by TypeScript
* [Markcheck](https://github.com/rauschma/markcheck) tests Markdown code blocks.

<!-- ############################################################ -->

## Usage

```ts
import { type Assert, assertType, type Assignable, type Equal, type Extends, type Includes, type Not } from 'asserttt';

//========== Asserting types: Assert<B> ==========

{
  type Pair<X> = [X, X];
  type _1 = Assert<Equal<
    Pair<'a'>, ['a', 'a']
  >>;
  type _2 = Assert<Not<Equal<
    Pair<'a'>, ['x', 'x']
  >>>;
}

{
  type _ = [
    Assert<Assignable<number, 123>>,

    Assert<Extends<Array<string>, Object>>,
    Assert<Not<Extends<Array<string>, RegExp>>>,

    Assert<Includes<'a'|'b', 'a'>>,
    Assert<Includes<'a'|'b'|'c', 'a'|'c'>>,
  ];
}

//========== Asserting types of values: assertType<T>(v)  ==========

const n = 3 + 1;
assertType<number>(n);
```

<!-- ############################################################ -->

## API

### Asserting

* `Assert<B>`
* `assertType<T>(value)`

### Included _predicates_ (boolean results)

Equality:

* `Equal<X, Y>`
* `MutuallyAssignable<X, Y>`
* `PedanticEqual<X, Y>`

Comparing/detecting types:

* `Extends<Sub, Super>`
* `Assignable<Target, Source>`
* `Includes<Superset, Subset>`
* `IsAny<T>`

Boolean operations:

* `Not<B>`

<!-- ############################################################ -->

## How does the code work?

<!-- ======================================== -->

### Determining if two types are equal

#### `MutuallyAssignable`

```ts
export type MutuallyAssignable<X, Y> =
  [X, Y] extends [Y, X] ? true : false
  ;
```

* The brackets on the left-hand side of `extends` prevent distributivity.
* Almost what we want for checking equality, but `any` is equal to all types – which is problematic when testing types.

#### `Equal`: like `MutuallyAssignable` but `any` is only equal to itself

This `Equal` predicate works well for many use cases:

```ts
type Equal<X, Y> =
  [IsAny<X>, IsAny<Y>] extends [true, true] ? true
  : [IsAny<X>, IsAny<Y>] extends [false, false] ? MutuallyAssignable<X, Y>
  : false
  ;
type IsAny<T> = 0 extends (1 & T) ? true : false;
```

* [Explanation of `Equal<X, Y>`](https://exploringjs.com/ts/book/ch_testing-types.html#checking-type-equality)
* [Explanation of `IsAny<T>`](https://exploringjs.com/ts/book/ch_testing-types.html#checking-if-type-is-any).

#### `PedanticEqual`: a popular hack with several downsides

```ts
type PedanticEqual<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends // (A)
  (<T>() => T extends Y ? 1 : 2) ? true : false // (B)
  ;
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

**This hack has several downsides:** See [`test/pedantic-equal_test.ts`](test/pedantic-equal_test.ts) for more information.

<!-- ======================================== -->

### Asserting

```ts
type Assert<_T extends true> = void;
```

Alas, we can’t conditionally produce errors at the type level. That’s why we need to resort to a type parameter whose `extends` constraint requires it to be assignable to `true`.

(Idea by Blaine Bublitz)

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
