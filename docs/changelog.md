# Changelog

* Version 1.0.1 (2025-07-12):
  * Simplify implementation of `MutuallyAssignable`
* Version 1.0.0 (2025-07-09):
  * Make these generic types non-distributive: `Extends`, `Assignable`, `Includes`
  * `Not<any>` and `Not<boolean>` are `never`
  * Better implementation of `Equal<X, Y>` (based on `MutuallyAssignable`)
  * New predicate: `MutuallyAssignable<X, Y>`
  * New predicate: `PedanticEqual<X, Y>`
  * New predicate: `IsAny<T>`
