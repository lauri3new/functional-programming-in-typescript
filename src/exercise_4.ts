import { None, Some, Option } from "./Option"
import { Either, Right, Left } from './Either'

// variance function in terms of flatMap
export const fourTwo = () => {

  const mean = (ns: number[]): Option<number> => {
    if (ns.length > 0) {
      return Some(ns.reduce((a, b) => a + b, 0) / ns.length)
    }
    return None()
  } 

  const variance = (as: number[]): Option<number> => {

    return mean(as).flatMap(m => mean(as.map(x => Math.pow(x - m, 2))))
    
  }

  console.log(variance([1,2,3,4,5,6]).getOrElse('boom'))

}

// variance function in terms of flatMap
export const fourThree = () => {

  const map2 = <A, B, C>(a: Option<A>, b: Option<B>) => (f:(_:A, __:B) => C): Option<C> => {
    return a.flatMap(ia => b.flatMap(ib => Some(f(ia, ib))))
  } 

  console.log(map2(None<number>(), Some(3))((a: number ,b: number) => a + b).getOrElse('doh'))

}

// sequence - any used as base type (Nothing type in scala)
export const fourFour = () => {

  const sequence = <A>(as: Option<A>[]): Option<A[]> => {
    return as.reduce((acc, item) => {
      return item.flatMap(ia => acc.flatMap(iacc => Some([...iacc, ia])))
    }, Some<any>([]))
  }

  console.log(sequence([ Some(5), Some(2), None() ]).getOrElse('none'))
  console.log(sequence([ Some(5), Some(2), Some(10) ]).getOrElse('none'))

}

// traverse - any used as base type (Nothing type in scala)
export const fourFive = () => {

  const sequence = <A>(as: Option<A>[]): Option<A[]> => {
    return as.reduce((acc, item) => {
      return item.flatMap(ia => acc.flatMap(iacc => Some([...iacc, ia])))
    }, Some<any>([]))
  }

  const traverse = <A, B>(as: Option<A>[]) => (f: (_:A) => B): Option<B[]> => {
    return sequence(as).map(as => as.map(f))
  }

  const traverseI = <A, B>(as: Option<A>[]) => (f: (_:A) => B): Option<B[]> => {
    return as.reduce((acc, item) => {
      return item.flatMap(ia => acc.flatMap(iacc => Some([...iacc, f(ia)])))
    }, Some<any>([]))
  }

  const sequenceI = <A, B>(as: Option<A>[]) => traverseI<A, A>(as)(a => a)

  console.log(traverse([ Some(5), Some(2), None<number>() ])(a => a + 1).getOrElse('none'))
  console.log(traverse([ Some(5), Some(2), Some(10) ])(a => a + 1).getOrElse('none'))
  console.log(traverseI([ Some(5), Some(2), None<number>() ])(a => a + 1).getOrElse('none'))
  console.log(traverseI([ Some(5), Some(2), Some(10) ])(a => a + 1).getOrElse('none'))

  console.log(sequenceI([ Some(5), Some(2), None() ]).getOrElse('none'))
  console.log(sequenceI([ Some(5), Some(2), Some(10) ]).getOrElse('none'))

}

export const fourSix = () => {
  const sequence = <A, B>(as: Either<A, B>[]): Either<A, B[]> => {
    return as.reduce((acc, item) => {
      return item.flatMap(ia => acc.flatMap(iacc => Right([...iacc, ia])))
    }, Right<any>([]))
  }

  sequence([ Right(5), Right(2) ]).map(a => {
    console.log(a)
    return a
  })
  console.log(sequence([ Right(5), Right(2), Left("something went sronage") ]).map(a => {
    console.log(a)
    return a
  }).get())

  const traverse = <A, B, C>(as: Either<A, B>[]) => (f: (_:B) => C): Either<A, C[]> => {
    return sequence(as).map(as => as.map(f))
  }

  const mean = (xs: number[]): Either<string, number> => {
    if (xs.length === 0) {
      return Left("mean of empty list!")
    }
    return Right(xs.reduce((a, b) => a + b, 0) / xs.length)
  }

  const safeDiv = (x: number, y: number): Either<string, number> => {
    if (typeof (x/y) === 'number') {
      return Right(x/y)
    }
    return Left("cannot divide by zero")
  }

  const Try = <A>(a:() => A): Either<Error, A> => {
    try {
      return Right(a())
    } catch (e) {
      return Left(e)
    }
  }

  const map2 = <E, A>(a: Either<E, A>, b: Either<E, A>) => (f: (_: A, __:A) => A) => {
    return a.flatMap(ia => b.map(ib => f(ia, ib)))
  }

  console.log(map2(Right(5), Right(5))((a, b) => a + b).get())

}