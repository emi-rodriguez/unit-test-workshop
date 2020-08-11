export class CacheNotConnected extends Error{ // don't forget to write tests for meeeeee
    constructor () {
        super(JSON.stringify({ message: `Sorry! It seems we're having some connection issues. Don't worry! Your cats will stay safe while we work on the problem.`}, null, 2))
        Error.captureStackTrace(this, CacheNotConnected)
      }
}