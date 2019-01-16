# JSON Type Validation

A [TypeScript](https://www.typescriptlang.org/) library to perform type checking and validation on untyped JSON data at runtime.

This library owes thanks to:

- [JsonDecoder](https://github.com/aische/JsonDecoder) by Daniel van den Eijkel
- [Type-safe JSON Decoder](https://github.com/ooesili/type-safe-json-decoder) by Wesley Merkel
- The Elm [Json.Decode](http://package.elm-lang.org/packages/elm-lang/core/latest/Json-Decode) API

## Installation
```
npm i @mojotech/json-type-validation
```
Projects using `< typescript@3.0.1` will need a polyfill for the `unknown`
type, such as [unknown-ts](https://www.npmjs.com/package/unknown-ts).

## Motivation

Let's say we're creating a web app for our pet sitting business, and we've
picked TypeScript as one of our core technologies. This is a great choice
because the extra stability and type safety that TypeScript provides is really
going to help us market our business.

We've defined the data we need to track about each client's pet:

```typescript
interface Pet {
  name: string;
  species: string;
  age?: number;
  isCute?: boolean;
}
```

And we've got some data about current client's pets which is stored as JSON:

```typescript
const croc: Pet = JSON.parse('{"name":"Lyle","species":"Crocodile","isCute":true}')
const moose: Pet = JSON.parse('{"name":"Bullwinkle","age":59}')
```

But that can't be right -- our data for `moose` is missing information required
for the `Pet` interface, but TypeScript compiles the code just fine!

Of course this isn't an issue with TypeScript, but with our own type
annotations. In TypeScript `JSON.parse` has a return type of `any`, which pushes
the responsibility of verifying the type of data onto the user. By assuming that
all of our data is correctly formed, we've left ourselves open to unexpected
errors at runtime.

Unfortunately TypeScript doesn't provide a good built-in way to deal with this
issue. Providing run-time type information is one of TypeScript's
[non-goals](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Design-Goals#non-goals),
and our web app is too important to risk using a forked version of TypeScript
with that added functionality.
[Type guards](https://basarat.gitbooks.io/typescript/docs/types/typeGuard.html)
work, but are limited in that they circumvent type inference instead of working
with it, and can be cumbersome to write.

With `json-type-validation` we can define decoders that validate untyped json
input. Decoders are concise, composable, and typecheck against our defined types
and interfaces.

```typescript
import {Decoder, object, string, optional, number, boolean} from 'json-type-validation'

const petDecoder: Decoder<Pet> = object({
  name: string(),
  species: string(),
  age: optional(number()),
  isCute: optional(boolean())
})
```

Finally, we can choose from a number of decoding methods to validate json and
report success or failure. When some json input fails validation the decoder
clearly shows how the data was malformed.

```typescript
const lyle: Pet = petDecoder.runWithException(croc)

const bullwinkle: Pet = petDecoder.runWithException(moose)
// Throws the exception:
// `Input: {"name":"Bullwinkle","age":59}
//  Failed at input: the key 'species' is required but was not present`
```

## Documentation

[Documentation](https://github.com/mojotech/json-type-validation/tree/master/docs).

## Building

### With Nix

There exists some [Nix](https://nixos.org/nix) infrastructure that can be used
to reproduce a build environment exactly. A helper shell script lives at
`bin/jtv` that you can use to enter environments for multiple uses.
You'll need to follow the directions on the Nix website to install and use the
Nix package manager.

* To enter a shell suitable for building the library run `./bin/jtv
  build-shell`. This will leave you in the root of the project and automatically
  install any project and npm dependencies. You can run further yarn commands
  here.
* To build the library for distribution and exit you can run `./bin/jtv distribute`.
* To enter a build shell and run the build process, watching for changes, run
  `./bin/jtv build-watch`.
* To run an arbitrary command in a build environment use `./bin/jtv run
  COMMAND`. For example, `./bin/jtv run yarn test` will run the tests and exit.
