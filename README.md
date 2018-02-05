# JSON Type Validation

A typescript library to perform type checking and validation on untyped JSON
data at runtime.

This library owes thanks to:
- [JsonDecoder](https://github.com/aische/JsonDecoder) by Daniel van den Eijkel
- [Type-safe JSON Decoder](https://github.com/ooesili/type-safe-json-decoder) by Wesley Merkel
- The Elm [Json.Decode](http://package.elm-lang.org/packages/elm-lang/core/latest/Json-Decode) API

## Installation

TODO

## Motivation

TODO:
* `JSON.parse` has a return type of `any`
* It's up to the user to type the parsed json at runtime
* A naive approach can be dangerous
* Here's an alternative...
* ...and here's an example

```
import {Decoder, object, string, optional, number, boolean} from 'json-type-validation'

interface Pet {
  name: string;
  species: string;
  age?: number;
  isCute?: boolean;
}

petDecoder: Decoder<Pet> = object({
  name: string(),
  species: string(),
  age: optional(number()),
  isCute: optional(boolean())
})

const input: any = {name: 'Lyle', species: 'Crocodile', isCute: true}

const myPet: Pet = petDecoder.runWithException(input)
```

## Documentation

[Documentation](https://github.com/mojotech/json-type-validation/tree/master/docs).
