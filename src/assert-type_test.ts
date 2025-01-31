// * All tests in this file run at compile/editing time.
// * Therefore, the tests succeed if you open it in a TypeScript editor and
//   see no errors.

import { type Assert, assertType, type AssignableFrom, type Equal, type Extends, type Not } from './assert-type.js';

//========== Predicates ==========

{
  type _ = [
    Assert<Equal<Not<true>, false>>,
    Assert<Equal<Not<false>, true>>,
    Assert<Equal<Not<boolean>, boolean>>,
  ];
}

//========== Asserting types ==========

{
  type Pair<X> = [X, X];
  type _1 = Assert<Equal<Pair<'a'>, ['a', 'a']>>;
  type _2 = Assert<Not<Equal<Pair<'a'>, ['x', 'x']>>>;
}

{
  type _ = [
    Assert<AssignableFrom<number, 123>>,
    Assert<Extends<'a', 'a'|'b'>>,
  ];
}

{
  type NumRange<Upper extends number, Acc extends number[] = []> =
    Upper extends Acc['length']
      ? Acc
      : NumRange<Upper, [...Acc, Acc['length']]>
  ;
  type _ = Assert<Equal<
    NumRange<3>,
    [0, 1, 2]
  >>;
}

//========== Asserting types of values ==========

const n = 3 + 1;
assertType<number>(n);
