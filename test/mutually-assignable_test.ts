// * All tests in this file run at compile/editing time.
// * Therefore, the tests succeed if you open it in a TypeScript editor and
//   see no errors.

import { type Assert, type MutuallyAssignable, type Not } from 'asserttt';

{
  type Pair<X> = [X, X];
  type _ = [
    Assert<MutuallyAssignable<
      Pair<'a'>, ['a', 'a']
    >>,
    Assert<Not<MutuallyAssignable<
      Pair<'a'>, ['x', 'x']
    >>>,
  ];
}
{
  type _ = [
    Assert<Not<MutuallyAssignable<
      1, 2
    >>>,
    Assert<MutuallyAssignable<
      1, 1
    >>,
    Assert<MutuallyAssignable<
      any, 123
    >>,
    Assert<MutuallyAssignable<
      123, any
    >>,
    Assert<MutuallyAssignable<
      { prop: true }, { prop: true }
    >>,
    Assert<MutuallyAssignable<
      ['a', 'b'], ['a', 'b']
    >>,
  ];
}
