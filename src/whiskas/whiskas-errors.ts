export class OutOfStock extends Error{
    constructor (favoriteFood: string) {
        super(JSON.stringify({ message: `We're out of ${favoriteFood}. Someone needs to go buy some more.`}, null, 2))
        Error.captureStackTrace(this, OutOfStock)
      }
}
