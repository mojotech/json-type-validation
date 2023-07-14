
Documentation
=============

[Documentation](https://github.com/mojotech/json-type-validation/tree/master/docs).

The best places to start are with the examples in the `test/` directory, and the documentation for the [Decoder class](https://github.com/mojotech/json-type-validation/blob/master/docs/classes/_decoder_.decoder.md). At some point you may need documentation for dealing with the [Result type](https://github.com/mojotech/json-type-validation/blob/master/docs/modules/_result_.md).

### Type Parameters

Many of the decoder functions take an optional type parameter which determines the type of the decoded value. In most cases typescript successfully infers these types, although some specific decoders include documentation for situations where the type is necessary (see the `constant` and `union` decoders). You may still find that including the type parameter improves type inference in situations where typescript's error messages are particularly unhelpful.

As an example, a decoder for the `Pet` interface can be typechecked just as effectively using the type parameter as with the `Decoder<Pet>` annotation.

```
const petDecoder = object<Pet>({
  name: string(),
  species: string(),
  age: optional(number()),
  isCute: optional(boolean())
})
```

### Combinators

This library uses the [combinator pattern](https://wiki.haskell.org/Combinator_pattern) to build decoders. The decoder primitives `string`, `number`, `boolean`, `anyJson`, `constant`, `succeed`, and `fail` act as decoder building blocks that each perform a simple decoding operation. The decoder combinators `object`, `array`, `dict`, `optional`, `oneOf`, `union`, `withDefault`, `valueAt`, and `lazy` take decoders as arguments, and combined the decoders into more complicated structures. You can think of your own user-defined decoders as an extension of these composable units.

## Index

### External modules

* ["combinators"](modules/_combinators_.md)
* ["decoder"](modules/_decoder_.md)
* ["index"](modules/_index_.md)
* ["isEqual"](modules/_isequal_.md)
* ["result"](modules/_result_.md)

---

