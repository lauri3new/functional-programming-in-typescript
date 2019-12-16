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

export const threeThirteen = () => {
  const foldRightT = <A, B>(f: (_:A, __:B) => B, b:B) => foldLeft((a: B, b: A) => f(b, a), b)
  const foldLeftT = <A, B>(f: (_:B, __:A) => B, b:B) => foldRight((a: A, b: B) => f(b, a), b)
}

// 3.14 append in terms of foldLeft

export const threeFourteen = () => {
  const append = <A>(as: A[]) => (aas: A[]) => foldLeft((a: A[], b: A[]) => [...b, ...a], [])([as, aas])

  console.log(append([1,2,3])([4,5,6]))
}

// 3.15 function that concatenates a list of lists into a single list

export const threeFifteen = () => {
  const flatMap = <A>([a, ...as]: A[][]): A[] => {
    if (as.length === 0) return a
    return [...a, ...flatMap(as)]
  }

  console.log(flatMap([[1, 2,], [3, 4], [5, 6]]))
  const append = <A>(as: A[], aas: A[]) => foldLeft((a: A[], b: A[]) => [...b, ...a], [])([as, aas])
  const flatMapi = <A>(as: A[][]): A[] => foldLeft((a: A[], b: A[]) => append(b, a), [])(as)

  console.log(flatMapi([[1, 2,], [3, 4], [5, 6]]))
}

// 3.16 function that transforms a list of integers by adding 1 to each element.

export const threeSixteen = () => {
  const addOne = ([a, ...as]: number[]): number[] => {
    if (!a) return []
    return [a + 1, ...addOne(as)]
  }

  console.log(addOne([1, 2, 3, 4]))
}

// 3.17 converts each number to string

export const threeSeventeen = () => {
  const toStrings = ([a, ...as]: number[]): string[] => {
    if (!a) return []
    return [a.toString(), ...toStrings(as)]
  }

  console.log(toStrings([1, 2, 3, 4]))
}

// 3.18 map

export const threeEighteen = () => {
  const map = <A, B>([a, ...as]: A[], f:(_:A) => B): B[] => {
    if (!a) return []
    return [f(a), ...map(as, f)]
  }

  console.log(map([1, 2, 3, 4], a => a * 10))
}

// 3.19 filter

export const threeNineteen = () => {
  const filter = <A, B>([a, ...as]: A[]) => (f:(_:A) => boolean): A[] => {
    if (!a) return []
    if (f(a)) return [a, ...filter(as)(f)]
    return [...filter(as)(f)]
  }

  console.log(filter([1, 5, 3, 4, 5, 6])(a => a > 3))
}

// 3.20 flatMap

export const threeTwenty = () => {
  const flatMap = <A, B>([a, ...as]: A[]) => (f:(_:A) => A[]): A[] => {
    if (!a) return []
    return [ ...f(a), ...flatMap(as)(f)]
  }

  console.log(flatMap([1, 5, 3, 4, 5, 6])(a => a > 3 ? [a, a] : []))
}

// 3.21 use flatMap to implement filter.

export const threeTwentyOne = () => {
  const flatMap = <A, B>([a, ...as]: A[]) => (f:(_:A) => A[]): A[] => {
    if (!a) return []
    return [ ...f(a), ...flatMap(as)(f)]
  }

  const filter = <A, B>([a, ...as]: A[]) => (f:(_:A) => boolean): A[] => flatMap(as)((a: A) => f(a) ? [a] : [])

  console.log(filter([1, 5, 3, 4, 5, 6])(a => a > 3))
}

// 3.22 List(1,2,3) and List(4,5,6) become List(5,7,9)

export const threeTwentyTwo = () => {
  const zipAdd = ([a, ...as]: number[], [b, ...bs]: number[]): number[] => {
    if (!a || !b) return []
    return [ a + b, ...zipAdd(as, bs)]
  }

  console.log(zipAdd([1, 2, 3], [4, 5, 6]))
}

// 3.23 zipWith

export const threeTwentyThree = () => {
  const zipWith = <A, B, C>([a, ...as]: A[], [b, ...bs]: B[]) => (f: (_:A, __:B) => C): C[] => {
    if (!a || !b) return []
    return [ f(a, b), ...zipWith<A, B, C>(as, bs)(f)]
  }

  console.log(zipWith([1, 2, 3], [4, 5, 6])((a, b) => a + b))
  console.log(zipWith(['a', 'b', 'c'], ['d', 'e', 'f'])((a, b) => a + b))
  console.log(zipWith(['a', 'b', 'c'], ['d', 'e', 'f'])((a, b) => `${a} said hello to ${b}.`))
}

// sealed trait Tree[+A]
// case class Leaf[A](value: A) extends Tree[A]
// case class Branch[A](left: Tree[A], right: Tree[A]) extends Tree[A]

type Tuple<A,B> = [A, B]
type Identity<A> = [A]

interface Leafi<A> extends Identity<A> {}
interface Branchi<A, B> extends Tuple<Treei<A>, Treei<A>> {}
type Treei<A> = Leafi<A> | Branchi<A, A>

interface Leaf<A> { value: A }
interface Branch<A> { left: Tree<A>, right: Tree<A> }
type Tree<A> = Leaf<A> | Branch<A>
// type Branch<A> = [Leaf<A> | Branch<A>, Leaf<A> | Branch<A>]

const Leafi = <A>(value: A): Leafi<A> => ([value])
const Branchi = <A>(left: Treei<A>, right: Treei<A>): Branchi<A, A> => ([left, right])

console.log(Branchi<number>(Leafi(1), Branchi(Leafi(2), Leafi(4))))

const Leaf = <A>(value: A): Leaf<A> => ({ value })
const Branch = <A>(left: Tree<A>, right: Tree<A>): Branch<A> => ({ left, right })

console.log(Branch<number>(Leaf(1), Branch(Leaf(2), Leaf(4))))

// 3.25 function size that counts the number of nodes (leaves and branches) in a tree.

const size = <A>([a, b]: Treei<A>): number => {
  if (a && !b) return 1
  if (Array.isArray(a) && Array.isArray(b)) return 1 + size(a) + size(b)
  return 0
}

console.log('size', size(Branchi(Branchi(Leafi(1), Leafi(2)), Leafi(5))))