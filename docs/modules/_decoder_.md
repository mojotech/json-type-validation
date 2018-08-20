[@mojotech/json-type-validation](../README.md) > ["decoder"](../modules/_decoder_.md)

# External module: "decoder"

## Index

### Classes

* [Decoder](../classes/_decoder_.decoder.md)
* [OptionalDecoder](../classes/_decoder_.optionaldecoder.md)

### Interfaces

* [DecoderError](../interfaces/_decoder_.decodererror.md)

### Type aliases

* [DecoderObject](_decoder_.md#decoderobject)

### Functions

* [decoderErrorString](_decoder_.md#decodererrorstring)
* [isDecoderError](_decoder_.md#isdecodererror)

---

## Type aliases

<a id="decoderobject"></a>

###  DecoderObject

**ΤDecoderObject**: *`object`*

Defines a mapped type over an interface `A`. This type is used when creating decoders for objects.

`DecoderObject<A>` is an interface that has all the properties or `A`, but each property's type is mapped to a decoder for that type. If a property is required in `A`, the decoder type is `Decoder<proptype>`. If a property is optional in `A`, then that property is required in `DecoderObject<A>`, but the decoder type is `OptionalDecoder<proptype> | Decoder<proptype>`.

The `OptionalDecoder` type is only returned by the `optional` decoder.

Example:

```
interface ABC {
  a: boolean;
  b?: string;
  c: number | undefined;
}

DecoderObject<ABC> === {
  a: Decoder<boolean>;
  b: OptionalDecoder<string> | Decoder<string>;
  c: Decoder<number | undefined>;
}
```

#### Type declaration

___

## Functions

<a id="decodererrorstring"></a>

### `<Const>` decoderErrorString

▸ **decoderErrorString**(error: *[DecoderError](../interfaces/_decoder_.decodererror.md)*): `string`

`DecoderError` information as a formatted string.

**Parameters:**

| Param | Type |
| ------ | ------ |
| error | [DecoderError](../interfaces/_decoder_.decodererror.md) |

**Returns:** `string`

___
<a id="isdecodererror"></a>

### `<Const>` isDecoderError

▸ **isDecoderError**(a: *`any`*): `boolean`

Type guard for `DecoderError`. One use case of the type guard is in the `catch` of a promise. Typescript types the error argument of `catch` as `any`, so when dealing with a decoder as a promise you may need to distinguish between a `DecoderError` and an error string.

**Parameters:**

| Param | Type |
| ------ | ------ |
| a | `any` |

**Returns:** `boolean`

___

