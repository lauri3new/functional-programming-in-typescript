// case class Player(name: String, score: Int)
// def contest(p1: Player, p2: Player): Unit = if (p1.score > p2.score)
 
// println(s"${p1.name} is the winner!") else if (p2.score > p1.score)
//     println(s"${p2.name} is the winner!")
// else
// println("It's a draw.")

interface Player {
  name: string
  score: number
}
const Player = (name: string, score: number): Player => ({
  name,
  score
})

const contest = (p1: Player, p2: Player): void => 
  p1.score > p2.score
  ? console.log("hello") : p2.score > p1.score
  ? console.log("hello")
  : console.log("its a draw")

export interface IO<A> {
  (): A
}

const IO = <A>(action: () => A): IO<A> => () => action()

IO(() => console.log('wahoo'))