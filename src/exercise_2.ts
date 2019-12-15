// 2.1 (tail recursive?) fib
export const twoOne = () => {
  const fib = (total: number): number => {
    if (total > 1 ) {
      return fib(total - 1) + fib(total - 2)
    }
    if (total === 1) { return 1 + 1 }
    return 1
  }
  console.log(fib(1), fib(2), fib(3), fib(4), fib(5), fib(6))  
}


// 2.2 isSorted

export const twoTwo = () => {
  const isSorted = <A>([a, ...as]: A[]) => (ordered: (_:A, __:A) => boolean): boolean => {
    if (as.length > 0) {
      return ordered(a, as[0]) && isSorted(as)(ordered)
    }
    return true
  }
  console.log(isSorted([1,2,3,4,5])((a: number, b: number) => a < b))
  console.log(isSorted([1,5,3,4,5])((a: number, b: number) => a < b))
  console.log(isSorted([1])((a: number, b: number) => a < b))
}

// 2.3 curry

export const twoThree = () => {
  const curry = <A, B, C>(f: (_:A, __:B) => C): (_:A) => (_:B) => C => (a: A) => (b: B) => f(a, b)

  const exampleAdd = (a: number, b: number) => a + b
  console.log(curry(exampleAdd)(5)(10))

}

// 2.4 uncurry

export const twoFour = () => {
  const uncurry = <A, B, C>(f:(_:A) => (_:B) => C) => (a: A, b: B) => f(a)(b)

  const exampleCurryAdd = (a: number) => (b: number) => a + b
  console.log(uncurry(exampleCurryAdd)(5,10))
}

// 2.5 compose

export const twoFive = () => {
  const compose = <A, B, C>(f: (_:A) => B, g: (_:B) => C) => (a: A) => g(f(a))
  const addTen = (a: number) => a + 10
  const saidJohn = (b: number) => b + ", said john."
  console.log(compose(addTen, saidJohn)(5))
}

export default {}
