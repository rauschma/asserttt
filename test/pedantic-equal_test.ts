// * All tests in this file run at compile/editing time.
// * Therefore, the tests succeed if you open it in a TypeScript editor and
//   see no errors.

import { type Assert, type Assignable, type Equal, type Extends, type Not, type PedanticEqual } from 'asserttt';

{ // `PedanticEqual` is not useful with intersections
  type Point = { x: number } & { y: number };
  type _ = [
    Assert<Not<PedanticEqual<
      Point, { x: number, y: number }
    >>>,
    Assert<Equal<
      Point, { x: number, y: number }
    >>,
  ];
}

{ // `PedanticEqual` bug with `exactOptionalPropertyTypes`
  type T1 = {
    prop?: string,
  }
  type T2 = {
    prop?: undefined | string,
  }
  type _ = [
    // ❌ Bug: T1 and T2 are considered pedantically equal
    Assert<PedanticEqual<
      T1, T2
    >>,
    // T1 and T2 are not considered loosely equal
    Assert<Not<Equal<
      T1, T2
    >>>,
    // T2 is not assignable to T1
    Assert<Not<Assignable<
      T1, T2
    >>>,
    // T1 is assignable to T2
    Assert<Assignable<
      T2, T1
    >>,
  ];
}

{ // `PedanticEqual` is not useful with enums
  enum NoYes { No, Yes }
  type _ = [
    Assert<Not<PedanticEqual<NoYes, 0 | 1>>>,

    Assert<Extends<NoYes, 0 | 1>>,
    Assert<Extends<0 | 1, NoYes>>,
    Assert<Equal<NoYes, 0 | 1>>,
  ];
}

{ // Rare quirk
  type _ = [
    Assert<Not<PedanticEqual<
    `${string & {tag: string}}`,
    `${string & {tag: string}}`  
    >>>,
  ];
}