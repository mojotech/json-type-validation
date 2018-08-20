[@mojotech/json-type-validation](../README.md) > ["decoder"](../modules/_decoder_.md) > [OptionalDecoder](../classes/_decoder_.optionaldecoder.md)

# Class: OptionalDecoder

The `optional` decoder is given it's own type, the `OptionalDecoder` type, since it behaves differently from the other decoders. This decoder has no `run` method, so it can't be directly used to test a value. Instead, the `object` decoder accepts `optional` for decoding object properties that have been marked as optional with the `field?: value` notation.

## Type parameters
#### A 
## Hierarchy

**OptionalDecoder**

## Index

### Properties

* [decode](_decoder_.optionaldecoder.md#decode)

### Methods

* [andThen](_decoder_.optionaldecoder.md#andthen)
* [map](_decoder_.optionaldecoder.md#map)
* [optional](_decoder_.optionaldecoder.md#optional)

---

## Properties

<a id="decode"></a>

### `<Private>` decode

**● decode**: *`function`*

#### Type declaration
▸(json: *`any`*): `Result.Result`< `A` &#124; `undefined`, `Partial`<[DecoderError](../interfaces/_decoder_.decodererror.md)>>

**Parameters:**

| Param | Type |
| ------ | ------ |
| json | `any` |

**Returns:** `Result.Result`< `A` &#124; `undefined`, `Partial`<[DecoderError](../interfaces/_decoder_.decodererror.md)>>

___

## Methods

<a id="andthen"></a>

###  andThen

▸ **andThen**B(f: *`function`*): [OptionalDecoder](_decoder_.optionaldecoder.md)<`B`>

See `Decoder.prototype.andThen`. The function `f` is only executed if the optional decoder successfuly finds and decodes a value.

**Type parameters:**

#### B 
**Parameters:**

| Param | Type |
| ------ | ------ |
| f | `function` |

**Returns:** [OptionalDecoder](_decoder_.optionaldecoder.md)<`B`>

___
<a id="map"></a>

###  map

▸ **map**B(f: *`function`*): [OptionalDecoder](_decoder_.optionaldecoder.md)<`B`>

See `Decoder.prototype.map`. The function `f` is only executed if the optional decoder successfuly finds and decodes a value.

**Type parameters:**

#### B 
**Parameters:**

| Param | Type |
| ------ | ------ |
| f | `function` |

**Returns:** [OptionalDecoder](_decoder_.optionaldecoder.md)<`B`>

___
<a id="optional"></a>

### `<Static>` optional

▸ **optional**A(decoder: *[Decoder](_decoder_.decoder.md)<`A`>*): [OptionalDecoder](_decoder_.optionaldecoder.md)<`A`>

Decoder to designate that a property may not be present in an object. The behavior of `optional` is distinct from using `constant(undefined)` in that when the property is not found in the input, the key will not be present in the decoded value.

Example:

```
// type with explicit undefined property
interface Breakfast1 {
  eggs: number;
  withBacon: boolean | undefined;
}

// type with optional property
interface Breakfast2 {
  eggs: number;
  withBacon?: boolean;
}

// in the first case we can't use `optional`
breakfast1Decoder = object<Breakfast1>({
  eggs: number(),
  withBacon: union(boolean(), constant(undefined))
});

// in the second case we can
breakfast2Decoder = object<Breakfast2>({
  eggs: number(),
  withBacon: optional(boolean())
});

breakfast1Decoder.run({eggs: 12})
// => {ok: true, result: {eggs: 12, withBacon: undefined}}

breakfast2Decoder.run({eggs: 7})
// => {ok: true, result: {eggs: 7}}
```

**Type parameters:**

#### A 
**Parameters:**

| Param | Type |
| ------ | ------ |
| decoder | [Decoder](_decoder_.decoder.md)<`A`> |

**Returns:** [OptionalDecoder](_decoder_.optionaldecoder.md)<`A`>

___

