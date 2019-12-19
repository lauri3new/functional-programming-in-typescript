
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

  console.log('stream 1', Stream(() => 2, () => Empty()))

  const toList = <A>(a: Stream<A>): A[] => {
    if (a.isEmpty) {
      return []
    }
    return [ a.head(), ...toList(a.tail()) ]
  }

  console.log('stream 1', toList(Stream(() => 2, () => (Stream(() => 2, () => Empty())))))
}