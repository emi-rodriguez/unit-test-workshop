export class CatNotFound extends Error{
    constructor (name: string) {
        super(JSON.stringify({ message: `${name} isn't here :(. Maybe they haven't been adopted yet?`}, null, 2))
        Error.captureStackTrace(this, CatNotFound)
      }
}

export class CatAlreadyAdopted extends Error{
    constructor (name: string) {
        super(JSON.stringify({ message: `${name} is already here. That means you can't adopt them!`}, null, 2))
        Error.captureStackTrace(this, CatAlreadyAdopted)
      }
}

export class WrongCatBirthday extends Error{
    constructor (name: string) {
        super(JSON.stringify({ message: `That isn't ${name}'s birthday. Your kitty will be sad if you can't remember their birthday.`}, null, 2))
        Error.captureStackTrace(this, WrongCatBirthday)
      }
}