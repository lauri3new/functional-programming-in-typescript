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

  console.log('from', from(21).tail().head())

  const fibs = (n: number): Stream<number> => {
    if (n < 1) return Empty()
    if (n === 1) return Stream(() => 1, () => Empty())
    if (n === 2) return Stream(() => 1, () => Empty())
    return Stream(() => fibs(n - 1).head() + fibs(n - 2).head() , () => fibs(n - 3))
  }

  console.log('fibs', fibs(10).head())

  
  // def unfold[A, S](z: S)(f: S => Option[(A, S)]): Stream[A]

  const unfold = <A, S>(z: S) => (f:(_:S) => Option<[A, S]>): Stream<A> => {
    return f(z).map(([A, S]) => {
      return Stream(() => A, () => unfold<A, S>(S)(f))
    }).getOrElse(
      Empty()
    )
  }
  
  const fibsUnfold = unfold(0)((n) => {
    if (n === 0) return Some([1, 1])
    return Some([2 * n + 1, n])
  }) as any

  console.log('daba unfold', fibsUnfold.tail().head(), fibsUnfold.tail().tail().tail().tail().head())

  const fromUnfold = (n: number): Stream<number> => unfold<number, number>(n)((n) => Some([n, n + 1])) // Stream(() => n, () => from(n + 1))
  
  console.log('fromUnfold', fromUnfold(21).tail().head())

  const constantUnfold = <A>(a: A): Stream<A> => unfold<A, A>(a)(a => Some([a, a]))// Stream(() => a, () => constant<A>(a))

  console.log('constantUnfold', constantUnfold("hello").tail().head())

  const onesUnfold: Stream<1> = unfold<1, 1>(1)(() => Some([1, 1])) // Stream(() => 1, () => ones)
  console.log('onesUnfold', onesUnfold.tail().tail().head())

//   Use unfold to implement map, take, takeWhile,
// zipWith (as in chapter 3), and zipAll. The zipAll function
// should continue the traversal as long as either stream has more elements—
// it uses Option to indicate whether each stream has been exhausted.
// def zipAll[B](s2: Stream[B]): Stream[(Option[A],Option[B])]

  const mapUnfold = <A, B>(f:(_:A) => B) => (as: Stream<A>) => unfold(as)(a => Some([f(a.head()), a.tail()]))

  console.log('mapUnfold', map((a: number) => a + 1)(Stream(() => 1, () => Stream(() => 1, () => Empty())))().tail().head())

  const takeUnfold = <A>(n: number) => (as:Stream<A>): Stream<A> => {
    return unfold<A, [Stream<A>, number]>([as, n])(([as, n]) => {
      if (n === 0) return None()
      return Some([as.head(), [as.tail(), n - 1]])
    })
  }

  const takeFiveU = takeUnfold(2)(Stream(() => 1, () => Stream(() => 2, () => Stream(() => 3, () => Stream(() => 4, () => Stream(() => 5, () => Stream(() => 6, () => Stream(() => 7, () => Empty<number>()))))))))
  console.log('takeUnfoldFive', takeFiveU.head(), takeFiveU.tail().head(), takeFiveU.tail().tail().head())

  const takeWhileUnfold = <A>(f: (_:A) => boolean) => (as: Stream<A>): Stream<A> => {
    return unfold<A, Stream<A>>(as)((as) => {
      if (as.isEmpty) return None()
      if (f(as.head())) return Some([as.head(), as.tail()])
      return None()
    })
  }

  const takeTwoWhileU = takeWhileUnfold((a: number) => a < 2)(Stream(() => 1, () => Stream(() => 2, () => Stream(() => 3, () => Stream(() => 4, () => Stream(() => 5, () => Stream(() => 6, () => Stream(() => 7, () => Empty<number>()))))))))
  console.log('takeWhileLessThanTwo', takeFiveU.head(), takeFiveU.tail().head(), takeFiveU.tail().tail().head())

  const zipWith = <A>(f: (_:A, __:A) => A) => (as: Stream<A>, mas: Stream<A>): Stream<A> => {
    return unfold<A, [Stream<A>, Stream<A>]>([as, mas])(([as, mas]) => {
      if (as.isEmpty || mas.isEmpty) return None()
      return Some([f(as.head(), (mas).head()), [as.tail(), mas.tail()]])
    })
  }

  console.log('zipeWith', zipWith(((a: number, b: number) => a + b))(Stream(() => 1, () => Empty()), Stream(() => 1, () => Empty())).head())

  const zipAll = <A>(f: (_:Option<A>, __:Option<A>) => A) => (as: Stream<A>, mas: Stream<A>): Stream<A> => {
    return unfold<A, [Stream<A>, Stream<A>]>([as, mas])(([as, mas]) => {
      if (as.isEmpty && mas.isEmpty) return None()
      const asHead = !as.isEmpty ? Some(as.head()) : None<A>()
      const masHead = !mas.isEmpty ? Some(mas.head()) : None<A>()
      return Some([f(asHead, masHead), [as.tail(), mas.tail()]])
    })
  }

  console.log('ZipAll', zipAll(((a: Option<number>, b: Option<number>) => a.getOrElse(b.getOrElse(12))))(Empty(), Stream(() => 21, () => Empty())).head())

  const startsWith = <A>(as: Stream<A>) => (mas: Stream<A>): boolean => {
    if (mas.isEmpty) return true
    if (as.head() === mas.head()) return startsWith(as.tail())(mas.tail())
    return false
  } // def startsWith[A](s: Stream[A]): Boolean

  console.log('startWith', startsWith(Stream(() => 1, () => Stream(() => 2, () => Stream(() => 3, () => Empty()))))(Stream(() => 1, () => Stream(() => 2, () => Stream(() => 3, () => Empty())))))
  console.log('startWith', startsWith(Stream(() => 1, () => Stream(() => 2, () => Stream(() => 3, () => Empty()))))(Stream(() => 1, () => Empty())))
  console.log('startWith', startsWith(Stream(() => 1, () => Stream(() => 2, () => Stream(() => 3, () => Empty()))))(Stream(() => 1, () => Stream(() => 2, () => Empty()))))
  console.log('startWith', startsWith(Stream(() => 1, () => Stream(() => 2, () => Stream(() => 3, () => Empty()))))(Stream(() => 3, () => Stream(() => 2, () => Stream(() => 3, () => Empty())))))

  // def tails: Stream[Stream[A]]
  // const unfold = <A, S>(z: S) => (f:(_:S) => Option<[A, S]>): Stream<A> => {
  //   return f(z).map(([A, S]) => {
  //     return Stream(() => A, () => unfold<A, S>(S)(f))
  //   }).getOrElse(
  //     Empty()
  //   )
  // }

  const tails = <A>(as: Stream<A>): Stream<Stream<A>> => {
    return unfold<Stream<A>, Stream<A>>(as)((as) => {
      if (as.isEmpty) return None()
      return Some([ as, drop<A>(1)(as)])
    })
  }

  console.log('tails',
  toList(take(5)(tails(Stream(() => 1, () => Stream(() => 2, () => Empty()))))).map((a: any) => toList(a))
  )

  // Hard: Generalize tails to the function scanRight, which is like a foldRight that returns a stream of the intermediate results. For example:

  // const foldRight = <A, B>(z:() => B) => (f: (_:A, __:() => B) => B) => (as: Stream<A>): (() => B) => {
  //   if (as.isEmpty) return z
  //   return () => f(as.head(), foldRight<A, B>(z)(f)(as.tail()))
  // }

  const scanRight = <A, B>([a, ...as]: A[]) => (f:(_:B, __:A) => B, z: B): B[] => {
    if (!a) return []
    return [ ...scanRight<A, B>(as)(f, f(z, a)), f(z, a)]
  }

  const scanRightT = <A, B>(as: Stream<A>) => (f:(_:B, __:A) => B, z: B): Stream<B> => {
    if (as.isEmpty) return Empty()
    return Stream(() => f(z, as.head()), () => scanRightT<A, B>(as.tail())(f, f(z, as.head())))
  }

  console.log('scanRight', scanRight<number, number>([1,2,3,4])((a: number, b: number) => a + b, 0))
  console.log('scanRightT', 
  toList(
  scanRightT<number, number>(Stream(() => 1, () => Stream(() => 2, () => Stream(() => 3,() => Stream(() => 4, () => Empty())))))((a: number, b: number) => a + b, 0)
  )
  )

  // console.log(toList(scanRight<number, number>(() => 0)((a: number, b:number) => a + b)(Stream(() => 1, () => Stream(() => 2, () => Empty())))))

}