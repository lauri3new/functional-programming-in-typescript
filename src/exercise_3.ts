import { isEmptyArray, isSingleElemArray } from "./helper"

// 3.1 pattern matching question - not supported in ts

// 3.2 tail

export const threeTwo = () => {
  const tail = <A>([a, ...as]: A[]) => as

  console.log(tail([1, 2, 3, 4]))
}

// 3.3 setHead

export const threeThree = () => {
  const setHead = <A>(a: A) => ([_, ...as]: A[]) => [a, ...as]

  console.log(setHead(100)([2, 3, 4]))
}

// 3.4 drop

export const threeFour = () => {
  const drop = <A>(n: number) => (as: A[]): A[] => {
    if (n === 0) return as
    const [a, ...rest] = as
    return drop<A>(n - 1)(rest)
  }

  console.log(drop(4)([1,2,3,4,5,6]))
  console.log(drop(4)([1,2,3]))
  console.log(drop(4)([1]))
}

// 3.5 drop

export const threeFive = () => {
  const dropWhile = <A>(n: number, f: (_:A) => boolean) => (as: A[]): A[] => {
    if (n === 0) return as
    const [a, ...rest] = as
    if (f(a)) {
      return dropWhile<A>(n - 1, f)(rest)
    }
    return as
  }

  console.log(dropWhile(4, (a: number) => a < 3)([1,2,3,4,5,6]))
}

// 3.6 init

export const threeSix = () => {
  const init = <A>([a, ...as]: A[]): A[] => {
    if (as.length > 0) return [a, ...init(as)]
    return []
  }

  console.log(init([]))
}

// 3.9 length

const foldRight = <A, B>(f:(_:A,__:B) => B, b: B) => ([a, ...as]: A[]): B => {
  if (!a) return b
  if (as.length === 0) return f(a, b)
  return f(a, foldRight(f, b)(as))
}

const add = (a: number, b: number) => a + b
console.log('foldRight add 0', foldRight(add, 0)([]))
console.log('foldRight add 1-5', foldRight(add, 0)([1,2,3,4,5]))

export const threeNine = () => {
  const length = <A>(as: A[]) => foldRight((item, acc) => acc + 1, 0)(as)

  console.log(length([1,2,3,4,5,6]))
}

// 3.10 foldLeft

const foldLeft = <A, B>(f:(_:B,__:A) => B, b: B) => ([a, ...as]: A[]): B => {
  if (!a) return b
  if (as.length === 0) return f(b, a)
  return f(foldLeft(f, b)(as), a)
}

console.log('foldLeft add 0', foldLeft(add, 0)([]))
console.log('foldLeft add 1-5', foldLeft(add, 0)([1,2,3,4,5]))


// 3.11 threeEleven
export const threeEleven = () => {
  const sum = <A>(as: number[]) => foldLeft((a: number, b: number) => a + b, 0)(as)
  const product = <A>(as: number[]) => foldLeft((a: number, b: number) => a * b, 1)(as)
  console.log(sum([10, 5]), product([10, 5]))
}

// 3.12 threeEleven
export const threeTwelve = () => {
  const reverse = <A>([a, ...as]: A[]): A[] => {
    if (as.length > 0) return [...reverse(as), a]
    if (a) return [a]
    return []
  }
  console.log(reverse(['a', 'b', 'c', 'd', 'e']))
  console.log(reverse(['a']))
  console.log(reverse([]))
}

// 3.13 implement foldRight in terms of foldLeft and vice versa

// 3.14 append in terms of foldLeft ?

// const threeFourteen = () => {
//   const append = (as: A[]) => (moreAs: A[]) => foldLeft((a, b) => , [])(as)
// }

// 3.15 