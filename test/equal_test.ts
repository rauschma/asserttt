// * All tests in this file run at compile/editing time.
// * Therefore, the tests succeed if you open it in a TypeScript editor and
//   see no errors.

import { type Assert, type Equal, type MutuallyAssignable, type Not } from 'asserttt';

{
  type Pair<X> = [X, X];
  type _ = [
    Assert<Equal<Pair<'a'>, ['a', 'a']>>,
    Assert<Not<Equal<Pair<'a'>, ['x', 'x']>>>,
  ];
}

{
  // - `MutuallyAssignable` considers `any` to be equal to other types.
  // - `Equal` doesn’t.
  type _ = [
    Assert<MutuallyAssignable<any, number>>,
    Assert<MutuallyAssignable<number, any>>,
    Assert<Not<Equal<any, number>>>,
    Assert<Not<Equal<number, any>>>,
  ];
}

{ // There must be no distributivity.
  // Try to trigger it for both type parameters.
  type _ = [
    Assert<Not<Equal<'a' | 'b', 'a'>>>,
    Assert<Not<Equal<'a', 'a' | 'b'>>>,
  ];
}

//========== `PedanticEqual` bugs that `Equal` doesn’t have ==========

{ // Works with with intersections
  type Point = { x: number } & { y: number };
  type _ = [
    Assert<Equal<Point, { x: number, y: number }>>,
  ];
}

{ // Honor `exactOptionalPropertyTypes` in tsconfig.json
  type T1 = {
    prop?: string,
  }
  type T2 = {
    prop?: undefined | string,
  }
  type _ = [
    // T1 and T2 must not be considered equal
    Assert<Not<Equal<
      T1, T2
    >>>,
  ];
}

{ // Works with enums
  enum NoYes { No, Yes }
  type _ = [
    Assert<Equal<NoYes, 0 | 1>>,
  ];
}

{ // Rare quirk
  type _ = [
    Assert<Equal<
    `${string & {tag: string}}`,
    `${string & {tag: string}}`  
    >>,
  ];
}
