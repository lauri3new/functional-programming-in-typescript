export const sixOne = () => {
  interface RNG {
    nextInt: () => [number, RNG] 
  }
  const RNG = (seed: number): RNG => ({
    nextInt: () => {
      const s = seed % 2147483647 < 0 ? (seed % 2147483647 + 2147483646) : seed % 2147483647
      const n = s * 16807 % 2147483647
      return [n, RNG(n)]
    }
  })
  
  const callrng = (RNG: RNG, n: number): void => {
    if (n < 0) {
      return console.log('done')
    }
    const next = RNG.nextInt()
    console.log(next[0])
    return callrng(next[1], n - 1)
  }

  callrng(RNG(3), 100)

}