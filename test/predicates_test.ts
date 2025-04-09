// * All tests in this file run at compile/editing time.
// * Therefore, the tests succeed if you open it in a TypeScript editor and
//   see no errors.

import { type Assert, assertType, type Assignable, type Equal, type Extends, type Includes, type IsAny, type Not } from 'asserttt';

//========== Asserting types of values: assertType<T>(v)  ==========

const n = 3 + 1;
assertType<number>(n);

//========== Assert<B> and type comparison predicates ==========

{
  type _ = [
    Assert<Assignable<number, 123>>,

    Assert<Extends<Array<string>, Object>>,
    Assert<Not<Extends<Array<string>, RegExp>>>,
    Assert<Extends<number, number | string>>,
    // Must not trigger distributivity (left-hand side of `extends`)
    Assert<Not<Extends<number | string, number>>>,

    Assert<Includes<'a' | 'b', 'a'>>,
    // Must not trigger distributivity (left-hand side of `extends`)
    Assert<Not<Includes<'a', 'a' | 'b'>>>,
  ];
}

//========== Predicate `Not<B>` ==========

{
  type _ = [
    Assert<Equal<Not<true>, false>>,
    Assert<Equal<Not<false>, true>>,
    Assert<Equal<Not<boolean>, never>>,
    Assert<Equal<Not<any>, never>>,
  ];
}

//========== Predicate `IsAny<T>` ==========

{
  type _ = [
    Assert<IsAny<any>>,
    
    Assert<Not<IsAny<unknown>>>,
    Assert<Not<IsAny<never>>>,
    Assert<Not<IsAny<123>>>,
    Assert<Not<IsAny<number>>>,
  ];
}
