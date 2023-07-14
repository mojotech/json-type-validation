[yuyaryshev-json-type-validation](../README.md) > ["decoder"](../modules/_decoder_.md) > [Decoder](../classes/_decoder_.decoder.md)

# Class: Decoder

Decoders transform json objects with unknown structure into known and verified forms. You can create objects of type `Decoder<A>` with either the primitive decoder functions, such as `boolean()` and `string()`, or by applying higher-order decoders to the primitives, such as `array(boolean())` or `dict(string())`.

Each of the decoder functions are available both as a static method on `Decoder` and as a function alias -- for example the string decoder is defined at `Decoder.string()`, but is also aliased to `string()`. Using the function aliases exported with the library is recommended.

`Decoder` exposes a number of 'run' methods, which all decode json in the same way, but communicate success and failure in different ways. The `map` and `andThen` methods modify decoders without having to call a 'run' method.

Alternatively, the main decoder `run()` method returns an object of type `Result<A, DecoderError>`. This library provides a number of helper functions for dealing with the `Result` type, so you can do all the same things with a `Result` as with the decoder methods.

## Type parameters
#### A 
## Hierarchy

**Decoder**

## Index

### Constructors

* [constructor](_decoder_.decoder.md#constructor)

### Properties

* [decode](_decoder_.decoder.md#decode)

### Methods

* [andThen](_decoder_.decoder.md#andthen)
* [map](_decoder_.decoder.md#map)
* [run](_decoder_.decoder.md#run)
* [runPromise](_decoder_.decoder.md#runpromise)
* [runWithException](_decoder_.decoder.md#runwithexception)
* [where](_decoder_.decoder.md#where)
* [anyJson](_decoder_.decoder.md#anyjson)
* [array](_decoder_.decoder.md#array)
* [boolean](_decoder_.decoder.md#boolean)
* [constant](_decoder_.decoder.md#constant)
* [dict](_decoder_.decoder.md#dict)
* [fail](_decoder_.decoder.md#fail)
* [intersection](_decoder_.decoder.md#intersection)
* [lazy](_decoder_.decoder.md#lazy)
* [number](_decoder_.decoder.md#number)
* [object](_decoder_.decoder.md#object)
* [oneOf](_decoder_.decoder.md#oneof)
* [optional](_decoder_.decoder.md#optional)
* [string](_decoder_.decoder.md#string)
* [succeed](_decoder_.decoder.md#succeed)
* [tuple](_decoder_.decoder.md#tuple)
* [union](_decoder_.decoder.md#union)
* [unknownJson](_decoder_.decoder.md#unknownjson)
* [valueAt](_decoder_.decoder.md#valueat)
* [withDefault](_decoder_.decoder.md#withdefault)

---

## Constructors

<a id="constructor"></a>

### `<Private>` constructor

⊕ **new Decoder**(decode: *`function`*): [Decoder](_decoder_.decoder.md)

The Decoder class constructor is kept private to separate the internal `decode` function from the external `run` function. The distinction between the two functions is that `decode` returns a `Partial<DecoderError>` on failure, which contains an unfinished error report. When `run` is called on a decoder, the relevant series of `decode` calls is made, and then on failure the resulting `Partial<DecoderError>` is turned into a `DecoderError` by filling in the missing information.

While hiding the constructor may seem restrictive, leveraging the provided decoder combinators and helper functions such as `andThen` and `map` should be enough to build specialized decoders as needed.

**Parameters:**

| Param | Type |
| ------ | ------ |
| decode | `function` |

**Returns:** [Decoder](_decoder_.decoder.md)

___

## Properties

<a id="decode"></a>

### `<Private>` decode

**● decode**: *`function`*

#### Type declaration
▸(json: *`unknown`*): `DecodeResult`<`A`>

**Parameters:**

| Param | Type |
| ------ | ------ |
| json | `unknown` |

**Returns:** `DecodeResult`<`A`>

___

## Methods

<a id="andthen"></a>

###  andThen

▸ **andThen**B(f: *`function`*): [Decoder](_decoder_.decoder.md)<`B`>

Chain together a sequence of decoders. The first decoder will run, and then the function will determine what decoder to run second. If the result of the first decoder succeeds then `f` will be applied to the decoded value. If it fails the error will propagate through.

This is a very powerful method -- it can act as both the `map` and `where` methods, can improve error messages for edge cases, and can be used to make a decoder for custom types.

Example of adding an error message:

```
const versionDecoder = valueAt(['version'], number());
const infoDecoder3 = object({a: boolean()});

const decoder = versionDecoder.andThen(version => {
  switch (version) {
    case 3:
      return infoDecoder3;
    default:
      return fail(`Unable to decode info, version ${version} is not supported.`);
  }
});

decoder.run({version: 3, a: true})
// => {ok: true, result: {a: true}}

decoder.run({version: 5, x: 'abc'})
// =>
// {
//   ok: false,
//   error: {... message: 'Unable to decode info, version 5 is not supported.'}
// }
```

Example of decoding a custom type:

```
// nominal type for arrays with a length of at least one
type NonEmptyArray<T> = T[] & { __nonEmptyArrayBrand__: void };

const nonEmptyArrayDecoder = <T>(values: Decoder<T>): Decoder<NonEmptyArray<T>> =>
  array(values).andThen(arr =>
    arr.length > 0
      ? succeed(createNonEmptyArray(arr))
      : fail(`expected a non-empty array, got an empty array`)
  );
```

**Type parameters:**

#### B 
**Parameters:**

| Param | Type |
| ------ | ------ |
| f | `function` |

**Returns:** [Decoder](_decoder_.decoder.md)<`B`>

___
<a id="map"></a>

###  map

▸ **map**B(f: *`function`*): [Decoder](_decoder_.decoder.md)<`B`>

Construct a new decoder that applies a transformation to the decoded result. If the decoder succeeds then `f` will be applied to the value. If it fails the error will propagated through.

Example:

```
number().map(x => x * 5).run(10)
// => {ok: true, result: 50}
```

**Type parameters:**

#### B 
**Parameters:**

| Param | Type |
| ------ | ------ |
| f | `function` |

**Returns:** [Decoder](_decoder_.decoder.md)<`B`>

___
<a id="run"></a>

###  run

▸ **run**(json: *`unknown`*): `RunResult`<`A`>

Run the decoder and return a `Result` with either the decoded value or a `DecoderError` containing the json input, the location of the error, and the error message.

Examples:

```
number().run(12)
// => {ok: true, result: 12}

string().run(9001)
// =>
// {
//   ok: false,
//   error: {
//     kind: 'DecoderError',
//     input: 9001,
//     at: 'input',
//     message: 'expected a string, got 9001'
//   }
// }
```

**Parameters:**

| Param | Type |
| ------ | ------ |
| json | `unknown` |

**Returns:** `RunResult`<`A`>

___
<a id="runpromise"></a>

###  runPromise

▸ **runPromise**(json: *`unknown`*): `Promise`<`A`>

Run the decoder as a `Promise`.

**Parameters:**

| Param | Type |
| ------ | ------ |
| json | `unknown` |

**Returns:** `Promise`<`A`>

___
<a id="runwithexception"></a>

###  runWithException

▸ **runWithException**(json: *`unknown`*): `A`

Run the decoder and return the value on success, or throw an exception with a formatted error string.

**Parameters:**

| Param | Type |
| ------ | ------ |
| json | `unknown` |

**Returns:** `A`

___
<a id="where"></a>

###  where

▸ **where**(test: *`function`*, errorMessage: *`string`*): [Decoder](_decoder_.decoder.md)<`A`>

Add constraints to a decoder _without_ changing the resulting type. The `test` argument is a predicate function which returns true for valid inputs. When `test` fails on an input, the decoder fails with the given `errorMessage`.

```
const chars = (length: number): Decoder<string> =>
  string().where(
    (s: string) => s.length === length,
    `expected a string of length ${length}`
  );

chars(5).run('12345')
// => {ok: true, result: '12345'}

chars(2).run('HELLO')
// => {ok: false, error: {... message: 'expected a string of length 2'}}

chars(12).run(true)
// => {ok: false, error: {... message: 'expected a string, got a boolean'}}
```

**Parameters:**

| Param | Type |
| ------ | ------ |
| test | `function` |
| errorMessage | `string` |

**Returns:** [Decoder](_decoder_.decoder.md)<`A`>

___
<a id="anyjson"></a>

### `<Static>` anyJson

▸ **anyJson**(): [Decoder](_decoder_.decoder.md)<`any`>

Escape hatch to bypass validation. Always succeeds and types the result as `any`. Useful for defining decoders incrementally, particularly for complex objects.

Example:

```
interface User {
  name: string;
  complexUserData: ComplexType;
}

const userDecoder: Decoder<User> = object({
  name: string(),
  complexUserData: anyJson()
});
```

**Returns:** [Decoder](_decoder_.decoder.md)<`any`>

___
<a id="array"></a>

### `<Static>` array

▸ **array**(): [Decoder](_decoder_.decoder.md)<`unknown`[]>

▸ **array**A(decoder: *[Decoder](_decoder_.decoder.md)<`A`>*): [Decoder](_decoder_.decoder.md)<`A`[]>

Decoder for json arrays. Runs `decoder` on each array element, and succeeds if all elements are successfully decoded. If no `decoder` argument is provided then the outer array part of the json is validated but not the contents, typing the result as `unknown[]`.

To decode a single value that is inside of an array see `valueAt`.

Examples:

```
array(number()).run([1, 2, 3])
// => {ok: true, result: [1, 2, 3]}

array(array(boolean())).run([[true], [], [true, false, false]])
// => {ok: true, result: [[true], [], [true, false, false]]}

const validNumbersDecoder = array()
  .map((arr: unknown[]) => arr.map(number().run))
  .map(Result.successes)

validNumbersDecoder.run([1, true, 2, 3, 'five', 4, []])
// {ok: true, result: [1, 2, 3, 4]}

validNumbersDecoder.run([false, 'hi', {}])
// {ok: true, result: []}

validNumbersDecoder.run(false)
// {ok: false, error: {..., message: "expected an array, got a boolean"}}
```

**Returns:** [Decoder](_decoder_.decoder.md)<`unknown`[]>

**Type parameters:**

#### A 
**Parameters:**

| Param | Type |
| ------ | ------ |
| decoder | [Decoder](_decoder_.decoder.md)<`A`> |

**Returns:** [Decoder](_decoder_.decoder.md)<`A`[]>

___
<a id="boolean"></a>

### `<Static>` boolean

▸ **boolean**(): [Decoder](_decoder_.decoder.md)<`boolean`>

Decoder primitive that validates booleans, and fails on all other input.

**Returns:** [Decoder](_decoder_.decoder.md)<`boolean`>

___
<a id="constant"></a>

### `<Static>` constant

▸ **constant**T(value: *`T`*): [Decoder](_decoder_.decoder.md)<`T`>

▸ **constant**T,U(value: *`U`*): [Decoder](_decoder_.decoder.md)<`U`>

▸ **constant**T,U(value: *`U`*): [Decoder](_decoder_.decoder.md)<`U`>

▸ **constant**T(value: *`T`*): [Decoder](_decoder_.decoder.md)<`T`>

Decoder primitive that only matches on exact values.

For primitive values and shallow structures of primitive values `constant` will infer an exact literal type:

```
| Decoder                      | Type                          |
 | ---------------------------- | ------------------------------|
 | constant(true)               | Decoder<true>                 |
 | constant(false)              | Decoder<false>                |
 | constant(null)               | Decoder<null>                 |
 | constant(undefined)          | Decoder<undefined>            |
 | constant('alaska')           | Decoder<'alaska'>             |
 | constant(50)                 | Decoder<50>                   |
 | constant([1,2,3])            | Decoder<[1,2,3]>              |
 | constant({x: 't'})           | Decoder<{x: 't'}>             |
```

Inference breaks on nested structures, which require an annotation to get the literal type:

```
| Decoder                      | Type                          |
 | -----------------------------|-------------------------------|
 | constant([1,[2]])            | Decoder<(number|number[])[]>  |
 | constant<[1,[2]]>([1,[2]])   | Decoder<[1,[2]]>              |
 | constant({x: [1]})           | Decoder<{x: number[]}>        |
 | constant<{x: [1]}>({x: [1]}) | Decoder<{x: [1]}>             |
```

**Type parameters:**

#### T :   `string` &#124; `number` &#124; `boolean` &#124; `[]`

**Parameters:**

| Param | Type |
| ------ | ------ |
| value | `T` |

**Returns:** [Decoder](_decoder_.decoder.md)<`T`>

**Type parameters:**

#### T :   `string` &#124; `number` &#124; `boolean`

#### U :  [`T`, `Array`]
**Parameters:**

| Param | Type |
| ------ | ------ |
| value | `U` |

**Returns:** [Decoder](_decoder_.decoder.md)<`U`>

**Type parameters:**

#### T :   `string` &#124; `number` &#124; `boolean`

#### U :  `Record`<`string`, `T`>
**Parameters:**

| Param | Type |
| ------ | ------ |
| value | `U` |

**Returns:** [Decoder](_decoder_.decoder.md)<`U`>

**Type parameters:**

#### T 
**Parameters:**

| Param | Type |
| ------ | ------ |
| value | `T` |

**Returns:** [Decoder](_decoder_.decoder.md)<`T`>

___
<a id="dict"></a>

### `<Static>` dict

▸ **dict**A(decoder: *[Decoder](_decoder_.decoder.md)<`A`>*): [Decoder](_decoder_.decoder.md)<`Record`<`string`, `A`>>

Decoder for json objects where the keys are unknown strings, but the values should all be of the same type.

Example:

```
dict(number()).run({chocolate: 12, vanilla: 10, mint: 37});
// => {ok: true, result: {chocolate: 12, vanilla: 10, mint: 37}}
```

**Type parameters:**

#### A 
**Parameters:**

| Param | Type |
| ------ | ------ |
| decoder | [Decoder](_decoder_.decoder.md)<`A`> |

**Returns:** [Decoder](_decoder_.decoder.md)<`Record`<`string`, `A`>>

___
<a id="fail"></a>

### `<Static>` fail

▸ **fail**A(errorMessage: *`string`*): [Decoder](_decoder_.decoder.md)<`A`>

Decoder that ignores the input json and always fails with `errorMessage`.

**Type parameters:**

#### A 
**Parameters:**

| Param | Type |
| ------ | ------ |
| errorMessage | `string` |

**Returns:** [Decoder](_decoder_.decoder.md)<`A`>

___
<a id="intersection"></a>

### `<Static>` intersection

▸ **intersection**A,B(ad: *[Decoder](_decoder_.decoder.md)<`A`>*, bd: *[Decoder](_decoder_.decoder.md)<`B`>*): [Decoder](_decoder_.decoder.md)< `A` & `B`>

▸ **intersection**A,B,C(ad: *[Decoder](_decoder_.decoder.md)<`A`>*, bd: *[Decoder](_decoder_.decoder.md)<`B`>*, cd: *[Decoder](_decoder_.decoder.md)<`C`>*): [Decoder](_decoder_.decoder.md)< `A` & `B` & `C`>

▸ **intersection**A,B,C,D(ad: *[Decoder](_decoder_.decoder.md)<`A`>*, bd: *[Decoder](_decoder_.decoder.md)<`B`>*, cd: *[Decoder](_decoder_.decoder.md)<`C`>*, dd: *[Decoder](_decoder_.decoder.md)<`D`>*): [Decoder](_decoder_.decoder.md)< `A` & `B` & `C` & `D`>

▸ **intersection**A,B,C,D,E(ad: *[Decoder](_decoder_.decoder.md)<`A`>*, bd: *[Decoder](_decoder_.decoder.md)<`B`>*, cd: *[Decoder](_decoder_.decoder.md)<`C`>*, dd: *[Decoder](_decoder_.decoder.md)<`D`>*, ed: *[Decoder](_decoder_.decoder.md)<`E`>*): [Decoder](_decoder_.decoder.md)< `A` & `B` & `C` & `D` & `E`>

▸ **intersection**A,B,C,D,E,F(ad: *[Decoder](_decoder_.decoder.md)<`A`>*, bd: *[Decoder](_decoder_.decoder.md)<`B`>*, cd: *[Decoder](_decoder_.decoder.md)<`C`>*, dd: *[Decoder](_decoder_.decoder.md)<`D`>*, ed: *[Decoder](_decoder_.decoder.md)<`E`>*, fd: *[Decoder](_decoder_.decoder.md)<`F`>*): [Decoder](_decoder_.decoder.md)< `A` & `B` & `C` & `D` & `E` & `F`>

▸ **intersection**A,B,C,D,E,F,G(ad: *[Decoder](_decoder_.decoder.md)<`A`>*, bd: *[Decoder](_decoder_.decoder.md)<`B`>*, cd: *[Decoder](_decoder_.decoder.md)<`C`>*, dd: *[Decoder](_decoder_.decoder.md)<`D`>*, ed: *[Decoder](_decoder_.decoder.md)<`E`>*, fd: *[Decoder](_decoder_.decoder.md)<`F`>*, gd: *[Decoder](_decoder_.decoder.md)<`G`>*): [Decoder](_decoder_.decoder.md)< `A` & `B` & `C` & `D` & `E` & `F` & `G`>

▸ **intersection**A,B,C,D,E,F,G,H(ad: *[Decoder](_decoder_.decoder.md)<`A`>*, bd: *[Decoder](_decoder_.decoder.md)<`B`>*, cd: *[Decoder](_decoder_.decoder.md)<`C`>*, dd: *[Decoder](_decoder_.decoder.md)<`D`>*, ed: *[Decoder](_decoder_.decoder.md)<`E`>*, fd: *[Decoder](_decoder_.decoder.md)<`F`>*, gd: *[Decoder](_decoder_.decoder.md)<`G`>*, hd: *[Decoder](_decoder_.decoder.md)<`H`>*): [Decoder](_decoder_.decoder.md)< `A` & `B` & `C` & `D` & `E` & `F` & `G` & `H`>

Combines 2-8 object decoders into a decoder for the intersection of all the objects.

Example:

```
interface Pet {
  name: string;
  maxLegs: number;
}

interface Cat extends Pet {
  evil: boolean;
}

const petDecoder: Decoder<Pet> = object({name: string(), maxLegs: number()});
const catDecoder: Decoder<Cat> = intersection(petDecoder, object({evil: boolean()}));
```

**Type parameters:**

#### A 
#### B 
**Parameters:**

| Param | Type |
| ------ | ------ |
| ad | [Decoder](_decoder_.decoder.md)<`A`> |
| bd | [Decoder](_decoder_.decoder.md)<`B`> |

**Returns:** [Decoder](_decoder_.decoder.md)< `A` & `B`>

**Type parameters:**

#### A 
#### B 
#### C 
**Parameters:**

| Param | Type |
| ------ | ------ |
| ad | [Decoder](_decoder_.decoder.md)<`A`> |
| bd | [Decoder](_decoder_.decoder.md)<`B`> |
| cd | [Decoder](_decoder_.decoder.md)<`C`> |

**Returns:** [Decoder](_decoder_.decoder.md)< `A` & `B` & `C`>

**Type parameters:**

#### A 
#### B 
#### C 
#### D 
**Parameters:**

| Param | Type |
| ------ | ------ |
| ad | [Decoder](_decoder_.decoder.md)<`A`> |
| bd | [Decoder](_decoder_.decoder.md)<`B`> |
| cd | [Decoder](_decoder_.decoder.md)<`C`> |
| dd | [Decoder](_decoder_.decoder.md)<`D`> |

**Returns:** [Decoder](_decoder_.decoder.md)< `A` & `B` & `C` & `D`>

**Type parameters:**

#### A 
#### B 
#### C 
#### D 
#### E 
**Parameters:**

| Param | Type |
| ------ | ------ |
| ad | [Decoder](_decoder_.decoder.md)<`A`> |
| bd | [Decoder](_decoder_.decoder.md)<`B`> |
| cd | [Decoder](_decoder_.decoder.md)<`C`> |
| dd | [Decoder](_decoder_.decoder.md)<`D`> |
| ed | [Decoder](_decoder_.decoder.md)<`E`> |

**Returns:** [Decoder](_decoder_.decoder.md)< `A` & `B` & `C` & `D` & `E`>

**Type parameters:**

#### A 
#### B 
#### C 
#### D 
#### E 
#### F 
**Parameters:**

| Param | Type |
| ------ | ------ |
| ad | [Decoder](_decoder_.decoder.md)<`A`> |
| bd | [Decoder](_decoder_.decoder.md)<`B`> |
| cd | [Decoder](_decoder_.decoder.md)<`C`> |
| dd | [Decoder](_decoder_.decoder.md)<`D`> |
| ed | [Decoder](_decoder_.decoder.md)<`E`> |
| fd | [Decoder](_decoder_.decoder.md)<`F`> |

**Returns:** [Decoder](_decoder_.decoder.md)< `A` & `B` & `C` & `D` & `E` & `F`>

**Type parameters:**

#### A 
#### B 
#### C 
#### D 
#### E 
#### F 
#### G 
**Parameters:**

| Param | Type |
| ------ | ------ |
| ad | [Decoder](_decoder_.decoder.md)<`A`> |
| bd | [Decoder](_decoder_.decoder.md)<`B`> |
| cd | [Decoder](_decoder_.decoder.md)<`C`> |
| dd | [Decoder](_decoder_.decoder.md)<`D`> |
| ed | [Decoder](_decoder_.decoder.md)<`E`> |
| fd | [Decoder](_decoder_.decoder.md)<`F`> |
| gd | [Decoder](_decoder_.decoder.md)<`G`> |

**Returns:** [Decoder](_decoder_.decoder.md)< `A` & `B` & `C` & `D` & `E` & `F` & `G`>

**Type parameters:**

#### A 
#### B 
#### C 
#### D 
#### E 
#### F 
#### G 
#### H 
**Parameters:**

| Param | Type |
| ------ | ------ |
| ad | [Decoder](_decoder_.decoder.md)<`A`> |
| bd | [Decoder](_decoder_.decoder.md)<`B`> |
| cd | [Decoder](_decoder_.decoder.md)<`C`> |
| dd | [Decoder](_decoder_.decoder.md)<`D`> |
| ed | [Decoder](_decoder_.decoder.md)<`E`> |
| fd | [Decoder](_decoder_.decoder.md)<`F`> |
| gd | [Decoder](_decoder_.decoder.md)<`G`> |
| hd | [Decoder](_decoder_.decoder.md)<`H`> |

**Returns:** [Decoder](_decoder_.decoder.md)< `A` & `B` & `C` & `D` & `E` & `F` & `G` & `H`>

___
<a id="lazy"></a>

### `<Static>` lazy

▸ **lazy**A(mkDecoder: *`function`*): [Decoder](_decoder_.decoder.md)<`A`>

Decoder that allows for validating recursive data structures. Unlike with functions, decoders assigned to variables can't reference themselves before they are fully defined. We can avoid prematurely referencing the decoder by wrapping it in a function that won't be called until use, at which point the decoder has been defined.

Example:

```
interface Comment {
  msg: string;
  replies: Comment[];
}

const decoder: Decoder<Comment> = object({
  msg: string(),
  replies: lazy(() => array(decoder))
});
```

**Type parameters:**

#### A 
**Parameters:**

| Param | Type |
| ------ | ------ |
| mkDecoder | `function` |

**Returns:** [Decoder](_decoder_.decoder.md)<`A`>

___
<a id="number"></a>

### `<Static>` number

▸ **number**(): [Decoder](_decoder_.decoder.md)<`number`>

Decoder primitive that validates numbers, and fails on all other input.

**Returns:** [Decoder](_decoder_.decoder.md)<`number`>

___
<a id="object"></a>

### `<Static>` object

▸ **object**(): [Decoder](_decoder_.decoder.md)<`Record`<`string`, `unknown`>>

▸ **object**A(decoders: *[DecoderObject](../modules/_decoder_.md#decoderobject)<`A`>*): [Decoder](_decoder_.decoder.md)<`A`>

An higher-order decoder that runs decoders on specified fields of an object, and returns a new object with those fields. If `object` is called with no arguments, then the outer object part of the json is validated but not the contents, typing the result as a record where all keys have a value of type `unknown`.

The `optional` and `constant` decoders are particularly useful for decoding objects that match typescript interfaces.

To decode a single field that is inside of an object see `valueAt`.

Example:

```
object({x: number(), y: number()}).run({x: 5, y: 10})
// => {ok: true, result: {x: 5, y: 10}}

object().map(Object.keys).run({n: 1, i: [], c: {}, e: 'e'})
// => {ok: true, result: ['n', 'i', 'c', 'e']}
```

**Returns:** [Decoder](_decoder_.decoder.md)<`Record`<`string`, `unknown`>>

**Type parameters:**

#### A 
**Parameters:**

| Param | Type |
| ------ | ------ |
| decoders | [DecoderObject](../modules/_decoder_.md#decoderobject)<`A`> |

**Returns:** [Decoder](_decoder_.decoder.md)<`A`>

___
<a id="oneof"></a>

### `<Static>` oneOf

▸ **oneOf**A(...decoders: *[Decoder](_decoder_.decoder.md)<`A`>[]*): [Decoder](_decoder_.decoder.md)<`A`>

Decoder that attempts to run each decoder in `decoders` and either succeeds with the first successful decoder, or fails after all decoders have failed.

Note that `oneOf` expects the decoders to all have the same return type, while `union` creates a decoder for the union type of all the input decoders.

Examples:

```
oneOf(string(), number().map(String))
oneOf(constant('start'), constant('stop'), succeed('unknown'))
```

**Type parameters:**

#### A 
**Parameters:**

| Param | Type |
| ------ | ------ |
| `Rest` decoders | [Decoder](_decoder_.decoder.md)<`A`>[] |

**Returns:** [Decoder](_decoder_.decoder.md)<`A`>

___
<a id="optional"></a>

### `<Static>` optional

▸ **optional**A(decoder: *[Decoder](_decoder_.decoder.md)<`A`>*): [Decoder](_decoder_.decoder.md)< `undefined` &#124; `A`>

Decoder for values that may be `undefined`. This is primarily helpful for decoding interfaces with optional fields.

Example:

```
interface User {
  id: number;
  isOwner?: boolean;
}

const decoder: Decoder<User> = object({
  id: number(),
  isOwner: optional(boolean())
});
```

**Type parameters:**

#### A 
**Parameters:**

| Param | Type |
| ------ | ------ |
| decoder | [Decoder](_decoder_.decoder.md)<`A`> |

**Returns:** [Decoder](_decoder_.decoder.md)< `undefined` &#124; `A`>

___
<a id="string"></a>

### `<Static>` string

▸ **string**(): [Decoder](_decoder_.decoder.md)<`string`>

Decoder primitive that validates strings, and fails on all other input.

**Returns:** [Decoder](_decoder_.decoder.md)<`string`>

___
<a id="succeed"></a>

### `<Static>` succeed

▸ **succeed**A(fixedValue: *`A`*): [Decoder](_decoder_.decoder.md)<`A`>

Decoder that ignores the input json and always succeeds with `fixedValue`.

**Type parameters:**

#### A 
**Parameters:**

| Param | Type |
| ------ | ------ |
| fixedValue | `A` |

**Returns:** [Decoder](_decoder_.decoder.md)<`A`>

___
<a id="tuple"></a>

### `<Static>` tuple

▸ **tuple**A(decoder: *[[Decoder](_decoder_.decoder.md)<`A`>]*): [Decoder](_decoder_.decoder.md)<[`A`]>

▸ **tuple**A,B(decoder: *[[Decoder](_decoder_.decoder.md)<`A`>, [Decoder](_decoder_.decoder.md)<`B`>]*): [Decoder](_decoder_.decoder.md)<[`A`, `B`]>

▸ **tuple**A,B,C(decoder: *[[Decoder](_decoder_.decoder.md)<`A`>, [Decoder](_decoder_.decoder.md)<`B`>, [Decoder](_decoder_.decoder.md)<`C`>]*): [Decoder](_decoder_.decoder.md)<[`A`, `B`, `C`]>

▸ **tuple**A,B,C,D(decoder: *[[Decoder](_decoder_.decoder.md)<`A`>, [Decoder](_decoder_.decoder.md)<`B`>, [Decoder](_decoder_.decoder.md)<`C`>, [Decoder](_decoder_.decoder.md)<`D`>]*): [Decoder](_decoder_.decoder.md)<[`A`, `B`, `C`, `D`]>

▸ **tuple**A,B,C,D,E(decoder: *[[Decoder](_decoder_.decoder.md)<`A`>, [Decoder](_decoder_.decoder.md)<`B`>, [Decoder](_decoder_.decoder.md)<`C`>, [Decoder](_decoder_.decoder.md)<`D`>, [Decoder](_decoder_.decoder.md)<`E`>]*): [Decoder](_decoder_.decoder.md)<[`A`, `B`, `C`, `D`, `E`]>

▸ **tuple**A,B,C,D,E,F(decoder: *[[Decoder](_decoder_.decoder.md)<`A`>, [Decoder](_decoder_.decoder.md)<`B`>, [Decoder](_decoder_.decoder.md)<`C`>, [Decoder](_decoder_.decoder.md)<`D`>, [Decoder](_decoder_.decoder.md)<`E`>, [Decoder](_decoder_.decoder.md)<`F`>]*): [Decoder](_decoder_.decoder.md)<[`A`, `B`, `C`, `D`, `E`, `F`]>

▸ **tuple**A,B,C,D,E,F,G(decoder: *[[Decoder](_decoder_.decoder.md)<`A`>, [Decoder](_decoder_.decoder.md)<`B`>, [Decoder](_decoder_.decoder.md)<`C`>, [Decoder](_decoder_.decoder.md)<`D`>, [Decoder](_decoder_.decoder.md)<`E`>, [Decoder](_decoder_.decoder.md)<`F`>, [Decoder](_decoder_.decoder.md)<`G`>]*): [Decoder](_decoder_.decoder.md)<[`A`, `B`, `C`, `D`, `E`, `F`, `G`]>

▸ **tuple**A,B,C,D,E,F,G,H(decoder: *[[Decoder](_decoder_.decoder.md)<`A`>, [Decoder](_decoder_.decoder.md)<`B`>, [Decoder](_decoder_.decoder.md)<`C`>, [Decoder](_decoder_.decoder.md)<`D`>, [Decoder](_decoder_.decoder.md)<`E`>, [Decoder](_decoder_.decoder.md)<`F`>, [Decoder](_decoder_.decoder.md)<`G`>, [Decoder](_decoder_.decoder.md)<`H`>]*): [Decoder](_decoder_.decoder.md)<[`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`]>

Decoder for fixed-length arrays, aka Tuples.

Supports up to 8-tuples.

Example:

```
tuple([number(), number(), string()]).run([5, 10, 'px'])
// => {ok: true, result: [5, 10, 'px']}
```

**Type parameters:**

#### A 
**Parameters:**

| Param | Type |
| ------ | ------ |
| decoder | [[Decoder](_decoder_.decoder.md)<`A`>] |

**Returns:** [Decoder](_decoder_.decoder.md)<[`A`]>

**Type parameters:**

#### A 
#### B 
**Parameters:**

| Param | Type |
| ------ | ------ |
| decoder | [[Decoder](_decoder_.decoder.md)<`A`>, [Decoder](_decoder_.decoder.md)<`B`>] |

**Returns:** [Decoder](_decoder_.decoder.md)<[`A`, `B`]>

**Type parameters:**

#### A 
#### B 
#### C 
**Parameters:**

| Param | Type |
| ------ | ------ |
| decoder | [[Decoder](_decoder_.decoder.md)<`A`>, [Decoder](_decoder_.decoder.md)<`B`>, [Decoder](_decoder_.decoder.md)<`C`>] |

**Returns:** [Decoder](_decoder_.decoder.md)<[`A`, `B`, `C`]>

**Type parameters:**

#### A 
#### B 
#### C 
#### D 
**Parameters:**

| Param | Type |
| ------ | ------ |
| decoder | [[Decoder](_decoder_.decoder.md)<`A`>, [Decoder](_decoder_.decoder.md)<`B`>, [Decoder](_decoder_.decoder.md)<`C`>, [Decoder](_decoder_.decoder.md)<`D`>] |

**Returns:** [Decoder](_decoder_.decoder.md)<[`A`, `B`, `C`, `D`]>

**Type parameters:**

#### A 
#### B 
#### C 
#### D 
#### E 
**Parameters:**

| Param | Type |
| ------ | ------ |
| decoder | [[Decoder](_decoder_.decoder.md)<`A`>, [Decoder](_decoder_.decoder.md)<`B`>, [Decoder](_decoder_.decoder.md)<`C`>, [Decoder](_decoder_.decoder.md)<`D`>, [Decoder](_decoder_.decoder.md)<`E`>] |

**Returns:** [Decoder](_decoder_.decoder.md)<[`A`, `B`, `C`, `D`, `E`]>

**Type parameters:**

#### A 
#### B 
#### C 
#### D 
#### E 
#### F 
**Parameters:**

| Param | Type |
| ------ | ------ |
| decoder | [[Decoder](_decoder_.decoder.md)<`A`>, [Decoder](_decoder_.decoder.md)<`B`>, [Decoder](_decoder_.decoder.md)<`C`>, [Decoder](_decoder_.decoder.md)<`D`>, [Decoder](_decoder_.decoder.md)<`E`>, [Decoder](_decoder_.decoder.md)<`F`>] |

**Returns:** [Decoder](_decoder_.decoder.md)<[`A`, `B`, `C`, `D`, `E`, `F`]>

**Type parameters:**

#### A 
#### B 
#### C 
#### D 
#### E 
#### F 
#### G 
**Parameters:**

| Param | Type |
| ------ | ------ |
| decoder | [[Decoder](_decoder_.decoder.md)<`A`>, [Decoder](_decoder_.decoder.md)<`B`>, [Decoder](_decoder_.decoder.md)<`C`>, [Decoder](_decoder_.decoder.md)<`D`>, [Decoder](_decoder_.decoder.md)<`E`>, [Decoder](_decoder_.decoder.md)<`F`>, [Decoder](_decoder_.decoder.md)<`G`>] |

**Returns:** [Decoder](_decoder_.decoder.md)<[`A`, `B`, `C`, `D`, `E`, `F`, `G`]>

**Type parameters:**

#### A 
#### B 
#### C 
#### D 
#### E 
#### F 
#### G 
#### H 
**Parameters:**

| Param | Type |
| ------ | ------ |
| decoder | [[Decoder](_decoder_.decoder.md)<`A`>, [Decoder](_decoder_.decoder.md)<`B`>, [Decoder](_decoder_.decoder.md)<`C`>, [Decoder](_decoder_.decoder.md)<`D`>, [Decoder](_decoder_.decoder.md)<`E`>, [Decoder](_decoder_.decoder.md)<`F`>, [Decoder](_decoder_.decoder.md)<`G`>, [Decoder](_decoder_.decoder.md)<`H`>] |

**Returns:** [Decoder](_decoder_.decoder.md)<[`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`]>

___
<a id="union"></a>

### `<Static>` union

▸ **union**A,B(ad: *[Decoder](_decoder_.decoder.md)<`A`>*, bd: *[Decoder](_decoder_.decoder.md)<`B`>*): [Decoder](_decoder_.decoder.md)< `A` &#124; `B`>

▸ **union**A,B,C(ad: *[Decoder](_decoder_.decoder.md)<`A`>*, bd: *[Decoder](_decoder_.decoder.md)<`B`>*, cd: *[Decoder](_decoder_.decoder.md)<`C`>*): [Decoder](_decoder_.decoder.md)< `A` &#124; `B` &#124; `C`>

▸ **union**A,B,C,D(ad: *[Decoder](_decoder_.decoder.md)<`A`>*, bd: *[Decoder](_decoder_.decoder.md)<`B`>*, cd: *[Decoder](_decoder_.decoder.md)<`C`>*, dd: *[Decoder](_decoder_.decoder.md)<`D`>*): [Decoder](_decoder_.decoder.md)< `A` &#124; `B` &#124; `C` &#124; `D`>

▸ **union**A,B,C,D,E(ad: *[Decoder](_decoder_.decoder.md)<`A`>*, bd: *[Decoder](_decoder_.decoder.md)<`B`>*, cd: *[Decoder](_decoder_.decoder.md)<`C`>*, dd: *[Decoder](_decoder_.decoder.md)<`D`>*, ed: *[Decoder](_decoder_.decoder.md)<`E`>*): [Decoder](_decoder_.decoder.md)< `A` &#124; `B` &#124; `C` &#124; `D` &#124; `E`>

▸ **union**A,B,C,D,E,F(ad: *[Decoder](_decoder_.decoder.md)<`A`>*, bd: *[Decoder](_decoder_.decoder.md)<`B`>*, cd: *[Decoder](_decoder_.decoder.md)<`C`>*, dd: *[Decoder](_decoder_.decoder.md)<`D`>*, ed: *[Decoder](_decoder_.decoder.md)<`E`>*, fd: *[Decoder](_decoder_.decoder.md)<`F`>*): [Decoder](_decoder_.decoder.md)< `A` &#124; `B` &#124; `C` &#124; `D` &#124; `E` &#124; `F`>

▸ **union**A,B,C,D,E,F,G(ad: *[Decoder](_decoder_.decoder.md)<`A`>*, bd: *[Decoder](_decoder_.decoder.md)<`B`>*, cd: *[Decoder](_decoder_.decoder.md)<`C`>*, dd: *[Decoder](_decoder_.decoder.md)<`D`>*, ed: *[Decoder](_decoder_.decoder.md)<`E`>*, fd: *[Decoder](_decoder_.decoder.md)<`F`>*, gd: *[Decoder](_decoder_.decoder.md)<`G`>*): [Decoder](_decoder_.decoder.md)< `A` &#124; `B` &#124; `C` &#124; `D` &#124; `E` &#124; `F` &#124; `G`>

▸ **union**A,B,C,D,E,F,G,H(ad: *[Decoder](_decoder_.decoder.md)<`A`>*, bd: *[Decoder](_decoder_.decoder.md)<`B`>*, cd: *[Decoder](_decoder_.decoder.md)<`C`>*, dd: *[Decoder](_decoder_.decoder.md)<`D`>*, ed: *[Decoder](_decoder_.decoder.md)<`E`>*, fd: *[Decoder](_decoder_.decoder.md)<`F`>*, gd: *[Decoder](_decoder_.decoder.md)<`G`>*, hd: *[Decoder](_decoder_.decoder.md)<`H`>*): [Decoder](_decoder_.decoder.md)< `A` &#124; `B` &#124; `C` &#124; `D` &#124; `E` &#124; `F` &#124; `G` &#124; `H`>

Combines 2-8 decoders of disparate types into a decoder for the union of all the types.

If you need more than 8 variants for your union, it's possible to use `oneOf` in place of `union` as long as you annotate every decoder with the union type.

Example:

```
type C = {a: string} | {b: number};

const unionDecoder: Decoder<C> = union(object({a: string()}), object({b: number()}));
const oneOfDecoder: Decoder<C> = oneOf(object<C>({a: string()}), object<C>({b: number()}));
```

**Type parameters:**

#### A 
#### B 
**Parameters:**

| Param | Type |
| ------ | ------ |
| ad | [Decoder](_decoder_.decoder.md)<`A`> |
| bd | [Decoder](_decoder_.decoder.md)<`B`> |

**Returns:** [Decoder](_decoder_.decoder.md)< `A` &#124; `B`>

**Type parameters:**

#### A 
#### B 
#### C 
**Parameters:**

| Param | Type |
| ------ | ------ |
| ad | [Decoder](_decoder_.decoder.md)<`A`> |
| bd | [Decoder](_decoder_.decoder.md)<`B`> |
| cd | [Decoder](_decoder_.decoder.md)<`C`> |

**Returns:** [Decoder](_decoder_.decoder.md)< `A` &#124; `B` &#124; `C`>

**Type parameters:**

#### A 
#### B 
#### C 
#### D 
**Parameters:**

| Param | Type |
| ------ | ------ |
| ad | [Decoder](_decoder_.decoder.md)<`A`> |
| bd | [Decoder](_decoder_.decoder.md)<`B`> |
| cd | [Decoder](_decoder_.decoder.md)<`C`> |
| dd | [Decoder](_decoder_.decoder.md)<`D`> |

**Returns:** [Decoder](_decoder_.decoder.md)< `A` &#124; `B` &#124; `C` &#124; `D`>

**Type parameters:**

#### A 
#### B 
#### C 
#### D 
#### E 
**Parameters:**

| Param | Type |
| ------ | ------ |
| ad | [Decoder](_decoder_.decoder.md)<`A`> |
| bd | [Decoder](_decoder_.decoder.md)<`B`> |
| cd | [Decoder](_decoder_.decoder.md)<`C`> |
| dd | [Decoder](_decoder_.decoder.md)<`D`> |
| ed | [Decoder](_decoder_.decoder.md)<`E`> |

**Returns:** [Decoder](_decoder_.decoder.md)< `A` &#124; `B` &#124; `C` &#124; `D` &#124; `E`>

**Type parameters:**

#### A 
#### B 
#### C 
#### D 
#### E 
#### F 
**Parameters:**

| Param | Type |
| ------ | ------ |
| ad | [Decoder](_decoder_.decoder.md)<`A`> |
| bd | [Decoder](_decoder_.decoder.md)<`B`> |
| cd | [Decoder](_decoder_.decoder.md)<`C`> |
| dd | [Decoder](_decoder_.decoder.md)<`D`> |
| ed | [Decoder](_decoder_.decoder.md)<`E`> |
| fd | [Decoder](_decoder_.decoder.md)<`F`> |

**Returns:** [Decoder](_decoder_.decoder.md)< `A` &#124; `B` &#124; `C` &#124; `D` &#124; `E` &#124; `F`>

**Type parameters:**

#### A 
#### B 
#### C 
#### D 
#### E 
#### F 
#### G 
**Parameters:**

| Param | Type |
| ------ | ------ |
| ad | [Decoder](_decoder_.decoder.md)<`A`> |
| bd | [Decoder](_decoder_.decoder.md)<`B`> |
| cd | [Decoder](_decoder_.decoder.md)<`C`> |
| dd | [Decoder](_decoder_.decoder.md)<`D`> |
| ed | [Decoder](_decoder_.decoder.md)<`E`> |
| fd | [Decoder](_decoder_.decoder.md)<`F`> |
| gd | [Decoder](_decoder_.decoder.md)<`G`> |

**Returns:** [Decoder](_decoder_.decoder.md)< `A` &#124; `B` &#124; `C` &#124; `D` &#124; `E` &#124; `F` &#124; `G`>

**Type parameters:**

#### A 
#### B 
#### C 
#### D 
#### E 
#### F 
#### G 
#### H 
**Parameters:**

| Param | Type |
| ------ | ------ |
| ad | [Decoder](_decoder_.decoder.md)<`A`> |
| bd | [Decoder](_decoder_.decoder.md)<`B`> |
| cd | [Decoder](_decoder_.decoder.md)<`C`> |
| dd | [Decoder](_decoder_.decoder.md)<`D`> |
| ed | [Decoder](_decoder_.decoder.md)<`E`> |
| fd | [Decoder](_decoder_.decoder.md)<`F`> |
| gd | [Decoder](_decoder_.decoder.md)<`G`> |
| hd | [Decoder](_decoder_.decoder.md)<`H`> |

**Returns:** [Decoder](_decoder_.decoder.md)< `A` &#124; `B` &#124; `C` &#124; `D` &#124; `E` &#124; `F` &#124; `G` &#124; `H`>

___
<a id="unknownjson"></a>

### `<Static>` unknownJson

▸ **unknownJson**(): [Decoder](_decoder_.decoder.md)<`unknown`>

Decoder identity function which always succeeds and types the result as `unknown`.

**Returns:** [Decoder](_decoder_.decoder.md)<`unknown`>

___
<a id="valueat"></a>

### `<Static>` valueAt

▸ **valueAt**A(paths: *( `string` &#124; `number`)[]*, decoder: *[Decoder](_decoder_.decoder.md)<`A`>*): [Decoder](_decoder_.decoder.md)<`A`>

Decoder that pulls a specific field out of a json structure, instead of decoding and returning the full structure. The `paths` array describes the object keys and array indices to traverse, so that values can be pulled out of a nested structure.

Example:

```
const decoder = valueAt(['a', 'b', 0], string());

decoder.run({a: {b: ['surprise!']}})
// => {ok: true, result: 'surprise!'}

decoder.run({a: {x: 'cats'}})
// => {ok: false, error: {... at: 'input.a.b[0]' message: 'path does not exist'}}
```

Note that the `decoder` is ran on the value found at the last key in the path, even if the last key is not found. This allows the `optional` decoder to succeed when appropriate.

```
const optionalDecoder = valueAt(['a', 'b', 'c'], optional(string()));

optionalDecoder.run({a: {b: {c: 'surprise!'}}})
// => {ok: true, result: 'surprise!'}

optionalDecoder.run({a: {b: 'cats'}})
// => {ok: false, error: {... at: 'input.a.b.c' message: 'expected an object, got "cats"'}

optionalDecoder.run({a: {b: {z: 1}}})
// => {ok: true, result: undefined}
```

**Type parameters:**

#### A 
**Parameters:**

| Param | Type |
| ------ | ------ |
| paths | ( `string` &#124; `number`)[] |
| decoder | [Decoder](_decoder_.decoder.md)<`A`> |

**Returns:** [Decoder](_decoder_.decoder.md)<`A`>

___
<a id="withdefault"></a>

### `<Static>` withDefault

▸ **withDefault**A(defaultValue: *`A`*, decoder: *[Decoder](_decoder_.decoder.md)<`A`>*): [Decoder](_decoder_.decoder.md)<`A`>

Decoder that always succeeds with either the decoded value, or a fallback default value.

**Type parameters:**

#### A 
**Parameters:**

| Param | Type |
| ------ | ------ |
| defaultValue | `A` |
| decoder | [Decoder](_decoder_.decoder.md)<`A`> |

**Returns:** [Decoder](_decoder_.decoder.md)<`A`>

___

