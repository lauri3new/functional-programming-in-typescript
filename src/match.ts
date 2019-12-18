

// export const match = <A, B>(m: [(_: any) => _ is A, (_: A) => B], d: [ () => B]) => (c: A | C | E) => {
//   if (m[0](c)) {
//     return 
//   }
//   return d[0]()
// }

// function isNumber(x: any): x is number {
//   return typeof x === "number";
// }

// console.log(match([isNumber, a => a + 1], [() => 5])(100))

// export const gmatch = <A, B extends A, C extends A>(m: [(_: any) => _ is A, (_: A) => B], d: [ () => B]) => (c: any) => {
//   if (m[0](c)) {
//     return 
//   }
//   return d[0]()
// }

// // match([
// //   isNumber, (number) => 
// // ])
