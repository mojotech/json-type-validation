[@mojotech/json-type-validation](../README.md) > ["result"](../modules/_result_.md)

# External module: "result"

## Index

### Interfaces

* [Err](../interfaces/_result_.err.md)
* [Ok](../interfaces/_result_.ok.md)

### Type aliases

* [Result](_result_.md#result)

### Functions

* [andThen](_result_.md#andthen)
* [asPromise](_result_.md#aspromise)
* [err](_result_.md#err-1)
* [isErr](_result_.md#iserr)
* [isOk](_result_.md#isok)
* [map](_result_.md#map)
* [map2](_result_.md#map2)
* [mapError](_result_.md#maperror)
* [ok](_result_.md#ok-1)
* [successes](_result_.md#successes)
* [withDefault](_result_.md#withdefault)
* [withException](_result_.md#withexception)

---

## Type aliases

<a id="result"></a>

###  Result

**ΤResult**: * [Ok](../interfaces/_result_.ok.md)<`V`> &#124; [Err](../interfaces/_result_.err.md)<`E`>
*

The result of a computation that may fail. The decoding function `Decoder.run` returns a `Result`. The value of a `Result` is either `Ok` if the computation succeeded, or `Err` if there was some failure in the process.

___

## Functions

<a id="andthen"></a>

### `<Const>` andThen

▸ **andThen**A,B,E(f: *`function`*, r: *[Result](_result_.md#result)<`A`, `E`>*): [Result](_result_.md#result)<`B`, `E`>

Chain together a sequence of computations that may fail, similar to a `Promise`. If the first computation fails then the error will propagate through. If it succeeds, then `f` will be applied to the value, returning a new `Result`.

**Type parameters:**

#### A 
#### B 
#### E 
**Parameters:**

| Param | Type |
| ------ | ------ |
| f | `function` |
| r | [Result](_result_.md#result)<`A`, `E`> |

**Returns:** [Result](_result_.md#result)<`B`, `E`>

___
<a id="aspromise"></a>

### `<Const>` asPromise

▸ **asPromise**V(r: *[Result](_result_.md#result)<`V`, `any`>*): `Promise`<`V`>

Create a `Promise` that either resolves with the result of `Ok` or rejects with the error of `Err`.

**Type parameters:**

#### V 
**Parameters:**

| Param | Type |
| ------ | ------ |
| r | [Result](_result_.md#result)<`V`, `any`> |

**Returns:** `Promise`<`V`>

___
<a id="err-1"></a>

### `<Const>` err

▸ **err**E(error: *`E`*): [Err](../interfaces/_result_.err.md)<`E`>

Wraps errors in an `Err` type.

Example: `err('on fire') // => {ok: false, error: 'on fire'}`

**Type parameters:**

#### E 
**Parameters:**

| Param | Type |
| ------ | ------ |
| error | `E` |

**Returns:** [Err](../interfaces/_result_.err.md)<`E`>

___
<a id="iserr"></a>

### `<Const>` isErr

▸ **isErr**E(r: *[Result](_result_.md#result)<`any`, `E`>*): `boolean`

Typeguard for `Err`.

**Type parameters:**

#### E 
**Parameters:**

| Param | Type |
| ------ | ------ |
| r | [Result](_result_.md#result)<`any`, `E`> |

**Returns:** `boolean`

___
<a id="isok"></a>

### `<Const>` isOk

▸ **isOk**V(r: *[Result](_result_.md#result)<`V`, `any`>*): `boolean`

Typeguard for `Ok`.

**Type parameters:**

#### V 
**Parameters:**

| Param | Type |
| ------ | ------ |
| r | [Result](_result_.md#result)<`V`, `any`> |

**Returns:** `boolean`

___
<a id="map"></a>

### `<Const>` map

▸ **map**A,B,E(f: *`function`*, r: *[Result](_result_.md#result)<`A`, `E`>*): [Result](_result_.md#result)<`B`, `E`>

Apply `f` to the result of an `Ok`, or pass the error through.

**Type parameters:**

#### A 
#### B 
#### E 
**Parameters:**

| Param | Type |
| ------ | ------ |
| f | `function` |
| r | [Result](_result_.md#result)<`A`, `E`> |

**Returns:** [Result](_result_.md#result)<`B`, `E`>

___
<a id="map2"></a>

### `<Const>` map2

▸ **map2**A,B,C,E(f: *`function`*, ar: *[Result](_result_.md#result)<`A`, `E`>*, br: *[Result](_result_.md#result)<`B`, `E`>*): [Result](_result_.md#result)<`C`, `E`>

Apply `f` to the result of two `Ok`s, or pass an error through. If both `Result`s are errors then the first one is returned.

**Type parameters:**

#### A 
#### B 
#### C 
#### E 
**Parameters:**

| Param | Type |
| ------ | ------ |
| f | `function` |
| ar | [Result](_result_.md#result)<`A`, `E`> |
| br | [Result](_result_.md#result)<`B`, `E`> |

**Returns:** [Result](_result_.md#result)<`C`, `E`>

___
<a id="maperror"></a>

### `<Const>` mapError

▸ **mapError**V,A,B(f: *`function`*, r: *[Result](_result_.md#result)<`V`, `A`>*): [Result](_result_.md#result)<`V`, `B`>

Apply `f` to the error of an `Err`, or pass the success through.

**Type parameters:**

#### V 
#### A 
#### B 
**Parameters:**

| Param | Type |
| ------ | ------ |
| f | `function` |
| r | [Result](_result_.md#result)<`V`, `A`> |

**Returns:** [Result](_result_.md#result)<`V`, `B`>

___
<a id="ok-1"></a>

### `<Const>` ok

▸ **ok**V(result: *`V`*): [Ok](../interfaces/_result_.ok.md)<`V`>

Wraps values in an `Ok` type.

Example: `ok(5) // => {ok: true, result: 5}`

**Type parameters:**

#### V 
**Parameters:**

| Param | Type |
| ------ | ------ |
| result | `V` |

**Returns:** [Ok](../interfaces/_result_.ok.md)<`V`>

___
<a id="successes"></a>

### `<Const>` successes

▸ **successes**A(results: *[Result](_result_.md#result)<`A`, `any`>[]*): `A`[]

Given an array of `Result`s, return the successful values.

**Type parameters:**

#### A 
**Parameters:**

| Param | Type |
| ------ | ------ |
| results | [Result](_result_.md#result)<`A`, `any`>[] |

**Returns:** `A`[]

___
<a id="withdefault"></a>

### `<Const>` withDefault

▸ **withDefault**V(defaultValue: *`V`*, r: *[Result](_result_.md#result)<`V`, `any`>*): `V`

Unwraps a `Result` and returns either the result of an `Ok`, or `defaultValue`.

Example:

```
Result.withDefault(5, number().run(json))
```

It would be nice if `Decoder` had an instance method that mirrored this function. Such a method would look something like this:

```
class Decoder<A> {
  runWithDefault = (defaultValue: A, json: any): A =>
    Result.withDefault(defaultValue, this.run(json));
}

number().runWithDefault(5, json)
```

Unfortunately, the type of `defaultValue: A` on the method causes issues with type inference on the `object` decoder in some situations. While these inference issues can be solved by providing the optional type argument for `object`s, the extra trouble and confusion doesn't seem worth it.

**Type parameters:**

#### V 
**Parameters:**

| Param | Type |
| ------ | ------ |
| defaultValue | `V` |
| r | [Result](_result_.md#result)<`V`, `any`> |

**Returns:** `V`

___
<a id="withexception"></a>

### `<Const>` withException

▸ **withException**V(r: *[Result](_result_.md#result)<`V`, `any`>*): `V`

Return the successful result, or throw an error.

**Type parameters:**

#### V 
**Parameters:**

| Param | Type |
| ------ | ------ |
| r | [Result](_result_.md#result)<`V`, `any`> |

**Returns:** `V`

___

