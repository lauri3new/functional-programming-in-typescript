import { None, Some, Option } from "./Option"

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
  
}