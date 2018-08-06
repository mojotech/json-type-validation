[@mojotech/json-type-validation](../README.md) > ["decoder"](../modules/_decoder_.md)

# External module: "decoder"

## Index

### Classes

* [Decoder](../classes/_decoder_.decoder.md)

### Interfaces

* [DecoderError](../interfaces/_decoder_.decodererror.md)

### Type aliases

* [DecoderObject](_decoder_.md#decoderobject)

### Functions

* [isDecoderError](_decoder_.md#isdecodererror)

---

## Type aliases

<a id="decoderobject"></a>

###  DecoderObject

**ΤDecoderObject**: *`object`*

Defines a mapped type over an interface `A`. `DecoderObject<A>` is an interface that has all the keys or `A`, but each key's property type is mapped to a decoder for that type. This type is used when creating decoders for objects.

Example:

```
interface X {
  a: boolean;
  b: string;
}

const decoderObject: DecoderObject<X> = {
  a: boolean(),
  b: string()
}
```

#### Type declaration

___

## Functions

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

