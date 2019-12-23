import { Option, Some, None } from './Option'
import { log } from './helper'

export const fiveOne = () => {
  interface Stream<A> {
    head: () => A
    tail: () => Stream<A>
    isEmpty: boolean
  }

  interface Empty<A> extends Stream<A> {
    head: () => any
    tail: () => Stream<any>
    isEmpty: boolean
  }

  const Stream = <A>(head: () => A, tail: () => Stream<A>): Stream<A> => ({
    head,
    tail,
    isEmpty: false
  })

  const Empty = <A>(): Empty<A> => ({
    head: () => Empty(),
    tail: () => Empty(),
    isEmpty: true
  })

  // console.log('stream 1', Stream(() => 2, () => Empty()))

  const toList = <A>(a: Stream<A>): A[] => {
    if (a.isEmpty) {
      return []
    }
    return [ a.head(), ...toList(a.tail()) ]
  }

  // console.log('stream 1', toList(Stream(() => 2, () => (Stream(() => 2, () => Empty())))))
  // five two

  const take = <A>(n: number) => (as:Stream<A>): Stream<A> => {
    if (n === 0) return Empty()
    return Stream(as.head, () => take<A>(n -1)(as.tail()))
  }

  const takeFive = take(5)(Stream(() => 1, () => Stream(() => 2, () => Stream(() => 3, () => Stream(() => 4, () => Stream(() => 5, () => Stream(() => 6, () => Stream(() => 7, () => Empty<number>()))))))))
  // console.log('takeFive', takeFive.head(), takeFive.tail())

  const drop = <A>(n: number) => (as:Stream<A>): Stream<A> => {
    if (n === 0) return as
    return drop<A>(n -1)(as.tail())
  }

  const dropFive = drop(5)(Stream(() => 1, () => Stream(() => 2, () => Stream(() => 3, () => Stream(() => 4, () => Stream(() => 5, () => Stream(() => 6, () => Stream(() => 7, () => Empty<number>()))))))))
  // console.log('dropFive', dropFive.head(), dropFive.tail())

  const takeWhile = <A>(f: (_:A) => boolean) => (as: Stream<A>): Stream<A> => {
    if (f(as.head())) {
      return Stream(as.head, () => takeWhile(f)(as.tail()))
    }
    return Empty()
  }

  // console.log('takeWhile < 3', takeWhile((a: number) => a < 3)(Stream(() => 1, () => Stream(() => 2, () => Stream(() => 3, () => Empty())))).tail().tail().head())

  const forAll = <A>(f: (_:A) => boolean) => (as: Stream<A>): boolean => {
    if (as.isEmpty) {
      return true
    }
    if (f(as.head())) { 
      return forAll(f)(as.tail())
    }
    return false
  }

  console.log('forAll success', forAll((a: number) => a > 0)(Stream(() => 1, () => Stream(() => 2, () => Stream(() => 3, () => Empty())))))
  console.log('forAll fail', forAll((a: number) => a < 2)(Stream(() => 1, () => Stream(() => 2, () => Stream(() => 3, () => Empty())))))

  const foldRight = <A, B>(z:() => B) => (f: (_:A, __:() => B) => B) => (as: Stream<A>): (() => B) => {
    if (as.isEmpty) return z
    return () => f(as.head(), foldRight<A, B>(z)(f)(as.tail()))
  }

  console.log('foldRight stream 1', foldRight<number, number>(() => 0)((a: number, b: () => number) => a + b())(Stream(() => 1, () => Stream(() => 10, () => Empty())))())


  const headOption = <A>(as: Stream<A>): Option<A> => {
    if (as.isEmpty) {
      return None()
    }
    return Some(as.head())
  }

  const headOptionI = <A>(as: Stream<A>): Option<A> => {
    return foldRight<A, Option<A>>(() => {
      if (as.isEmpty) return None()
      return Some(as.head())
    })((a: A, b: () => Option<A>) => b().flatMap(ib => Some(a)))(as.tail())()
  }

  console.log('non empety head', headOptionI(Stream(() => 1, () => Empty())))
  console.log('empty head', headOptionI(Empty()))

  const map = <A, B>(f:(_:A) => B) => (as: Stream<A>): () => Stream<B> => foldRight<A, Stream<B>>(
    () => Empty()
  )
  (
    (a, b) => Stream(() => f(a), b)
  )
  (
    as
  )

  console.log('mappa', map((a: number) => a + 1)(Stream(() => 1, () => Empty()))().head())
  const filter = <A>(f:(_:A) => boolean) => (as: Stream<A>): () => Stream<A> => foldRight<A, Stream<A>>(
    () => Empty()
  )
  (
    (a, b) => f(a) ? Stream(() => a, b) : b()
  )
  (
    as
  )

  console.log('filter',
  filter((a: number) => a > 2)(Stream(() => 1, () => Stream(() => 2, () => Stream(() => 3, () => Stream(() => 1, () => Empty())))))().head()
  )
  
  const append = <A>(newas:Stream<A>) => (as: Stream<A>): () => Stream<A> => foldRight<A, Stream<A>>(
    () => as
  )
  (
    (a, b) => Stream(() => a, b)
  )
  (
    newas
  )

  console.log('append',
    append(Stream<number>(() => 5, () => Empty()))(Stream<number>(() => 2, () => Empty()))().head()
  )
  
  // TODO: check lazyness is correct for all methods
  
  const flatMap = <A, B>(f:(_:A) => Stream<B>) => (as: Stream<A>): () => Stream<B> => foldRight<A, Stream<B>>(
    () => Empty<B>()
  )
  (
    (a, b) => append(f(a))(b())()
  )
  (
    as
  )

  const flatmappa: () => Stream<number> = flatMap((a: number) => Stream(() => a + 1, () => Stream(() => a + 1, () => Empty())))(Stream(() => 1, () => Empty()))
  console.log('flatmappa', toList(flatmappa()))

  const ones: Stream<1> = Stream(() => 1, () => ones)

  const constant = <A>(a: A): Stream<A> => Stream(() => a, () => constant<A>(a))

  console.log(constant("hello").tail().head())

  const from = (n: number): Stream<number> => Stream(() => n, () => from(n + 1))

  console.log(from(21).tail().head())

  const fibs = (n: number): Stream<number> => {
    if (n < 1) return Empty()
    if (n === 1) return Stream(() => 1, () => Empty())
    if (n === 2) return Stream(() => 1, () => Empty())
    return Stream(() => fibs(n - 1).head() + fibs(n - 2).head() , () => fibs(n - 3))
  }

  console.log('fibs', fibs(10).head())
  
}