
export interface Option<A> {
  _tag: string
  get: () => A
  map:<B>(f:(_: A) => B) => Option<B>
  getOrElse:<B>(_:B) => A | B
  flatMap:<B>(f:(_: A) => Option<B>) => Option<B>
  orElse:<B>(_: Option<B>) => Option<A> | Option<B>
  filter:(f:(_:A) => boolean) => Option<A>
}

export interface None<A> extends Option<A> {
  _tag: string
  get: () => any
  map:<B>(f:(_: A) => B) => None<any>
  getOrElse:<B>(_:B) => B
  orElse:<B>(_: Option<B>) => Option<B>
  flatMap:<B>(f:(_: A) => Option<B>) => None<any>
  filter:(f:(_:A) => boolean) => None<A>
}

type Some<A> = Option<A>

export const Some = <A>(a: A): Option<A> => ({
  _tag: 'some',
  get: () => a,
  map: f => Some(f(a)),
  getOrElse: _ => a,
  orElse: () => Some(a),
  flatMap: f => f(a),
  filter: f => f(a) ? Some(a) : None()
})

export const None = <A>(): None<A> => ({
  _tag: 'none',
  get: () => undefined,
  map: f => None<A>(),
  getOrElse: b => b,
  orElse: b => b,
  flatMap: f => None<A>(),
  filter: f => None()
})

const isNone = <A>(a: Option<A>): a is None<A> => a._tag === 'none'
const isSomething = <A>(a: Option<A>): a is Some<A> => a._tag === 'some'



// export const Option = <A>(a: A) => Some<A>(a)
