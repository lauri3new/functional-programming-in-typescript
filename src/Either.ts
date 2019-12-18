// sealed trait Either[+E,+A] {
//   def map[B](f: A => B): Either[E, B] = ???
 
//   def flatMap[EE >: E, B](f: A => Either[EE, B]): Either[EE, B] = ???
 
//   def orElse[EE >: E, B >: A](b: => Either[EE, B]): Either[EE, B] = ???
 
//   def map2[EE >: E, B, C](b: Either[EE, B])(f: (A, B) => C): Either[EE, C] = ???
//  }
//  case class Left[+E](get: E) extends Either[E,Nothing]
//  case class Right[+A](get: A) extends Either[Nothing,A]


export interface Either<E, A> {
  _tag: string
  orElse: <EE, B>(_:Either<EE, B>) => Either<E, A> | Either<EE, B>
  map:<B>(f:(_: A) => B) => Either<E, B>
  flatMap:<EE, B>(f:(_: A) => Either<EE, B>) => Either<EE, B>
}

export interface Left<E, A> extends Either<E, A> {
  _tag: string
  orElse: <EE, B>(_:Either<EE, B>) => Either<E, A> | Either<EE, B>
  map:<B>(f:(_: A) => B) => Either<E, B>
  flatMap:<EE, B>(f:(_: A) => Either<EE, any>) => Either<EE | any, any>
}

export interface Right<E, A> extends Either<E, A> {
  _tag: string
  orElse: <EE, B>(_:Either<EE, B>) => Either<E, A> | Either<EE, B>
  map:<B>(f:(_: A) => B) => Either<E, B>
  flatMap:<EE, B>(f:(_: A) => Either<any, B>) => Either<any, B>
}

export const Right = <A>(a: A): Either<any, A> => ({
  _tag: 'some',
  orElse: f => Right(a),
  map: f => Right(f(a)),
  flatMap: f => f(a),
})

export const Left = <A>(a: A): Left<A, any> => ({
  _tag: 'none',
  orElse: a => a,
  map: _ => Left<A>(a),
  flatMap: _ => Left<A>(a),
})

const getNumber = (): Either<string, number> => {
  if (Math.random() > 0.5) {
    return Right(123)
  }
  return Left("doh")
}




// export const Option = <A>(a: A) => Some<A>(a)
