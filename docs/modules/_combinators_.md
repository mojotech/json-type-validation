[@mojotech/json-type-validation](../README.md) > ["combinators"](../modules/_combinators_.md)

# External module: "combinators"

## Index

### Variables

* [anyJson](_combinators_.md#anyjson)
* [array](_combinators_.md#array)
* [dict](_combinators_.md#dict)
* [fail](_combinators_.md#fail)
* [lazy](_combinators_.md#lazy)
* [oneOf](_combinators_.md#oneof)
* [optional](_combinators_.md#optional)
* [succeed](_combinators_.md#succeed)
* [valueAt](_combinators_.md#valueat)
* [withDefault](_combinators_.md#withdefault)

### Functions

* [boolean](_combinators_.md#boolean)
* [constant](_combinators_.md#constant)
* [number](_combinators_.md#number)
* [object](_combinators_.md#object)
* [string](_combinators_.md#string)
* [union](_combinators_.md#union)

---

## Variables

<a id="anyjson"></a>

### `<Const>` anyJson

**● anyJson**: *`function`* =  Decoder.anyJson

See `Decoder.anyJson`

#### Type declaration
▸(): [Decoder](../classes/_decoder_.decoder.md)<`any`>

**Returns:** [Decoder](../classes/_decoder_.decoder.md)<`any`>

___
<a id="array"></a>

### `<Const>` array

**● array**: *`function`* =  Decoder.array

See `Decoder.array`

#### Type declaration
▸A(decoder: *[Decoder](../classes/_decoder_.decoder.md)<`A`>*): [Decoder](../classes/_decoder_.decoder.md)<`A`[]>

**Type parameters:**

#### A 
**Parameters:**

| Param | Type |
| ------ | ------ |
| decoder | [Decoder](../classes/_decoder_.decoder.md)<`A`> |

**Returns:** [Decoder](../classes/_decoder_.decoder.md)<`A`[]>

___
<a id="dict"></a>

### `<Const>` dict

**● dict**: *`function`* =  Decoder.dict

See `Decoder.dict`

#### Type declaration
▸A(decoder: *[Decoder](../classes/_decoder_.decoder.md)<`A`>*): [Decoder](../classes/_decoder_.decoder.md)<`object`>

**Type parameters:**

#### A 
**Parameters:**

| Param | Type |
| ------ | ------ |
| decoder | [Decoder](../classes/_decoder_.decoder.md)<`A`> |

**Returns:** [Decoder](../classes/_decoder_.decoder.md)<`object`>

___
<a id="fail"></a>

### `<Const>` fail

**● fail**: *`function`* =  Decoder.fail

See `Decoder.fail`

#### Type declaration
▸A(errorMessage: *`string`*): [Decoder](../classes/_decoder_.decoder.md)<`A`>

**Type parameters:**

#### A 
**Parameters:**

| Param | Type |
| ------ | ------ |
| errorMessage | `string` |

**Returns:** [Decoder](../classes/_decoder_.decoder.md)<`A`>

___
<a id="lazy"></a>

### `<Const>` lazy

**● lazy**: *`function`* =  Decoder.lazy

See `Decoder.lazy`

#### Type declaration
▸A(mkDecoder: *`function`*): [Decoder](../classes/_decoder_.decoder.md)<`A`>

**Type parameters:**

#### A 
**Parameters:**

| Param | Type |
| ------ | ------ |
| mkDecoder | `function` |

**Returns:** [Decoder](../classes/_decoder_.decoder.md)<`A`>

___
<a id="oneof"></a>

### `<Const>` oneOf

**● oneOf**: *`function`* =  Decoder.oneOf

See `Decoder.oneOf`

#### Type declaration
▸A(...decoders: *[Decoder](../classes/_decoder_.decoder.md)<`A`>[]*): [Decoder](../classes/_decoder_.decoder.md)<`A`>

**Type parameters:**

#### A 
**Parameters:**

| Param | Type |
| ------ | ------ |
| `Rest` decoders | [Decoder](../classes/_decoder_.decoder.md)<`A`>[] |

**Returns:** [Decoder](../classes/_decoder_.decoder.md)<`A`>

___
<a id="optional"></a>

### `<Const>` optional

**● optional**: *`function`* =  Decoder.optional

See `Decoder.optional`

#### Type declaration
▸A(decoder: *[Decoder](../classes/_decoder_.decoder.md)<`A`>*): [Decoder](../classes/_decoder_.decoder.md)< `A` &#124; `undefined`>

**Type parameters:**

#### A 
**Parameters:**

| Param | Type |
| ------ | ------ |
| decoder | [Decoder](../classes/_decoder_.decoder.md)<`A`> |

**Returns:** [Decoder](../classes/_decoder_.decoder.md)< `A` &#124; `undefined`>

___
<a id="succeed"></a>

### `<Const>` succeed

**● succeed**: *`function`* =  Decoder.succeed

See `Decoder.succeed`

#### Type declaration
▸A(fixedValue: *`A`*): [Decoder](../classes/_decoder_.decoder.md)<`A`>

**Type parameters:**

#### A 
**Parameters:**

| Param | Type |
| ------ | ------ |
| fixedValue | `A` |

**Returns:** [Decoder](../classes/_decoder_.decoder.md)<`A`>

___
<a id="valueat"></a>

### `<Const>` valueAt

**● valueAt**: *`function`* = 
  Decoder.valueAt

See `Decoder.valueAt`

#### Type declaration
▸A(paths: *( `string` &#124; `number`)[]*, decoder: *[Decoder](../classes/_decoder_.decoder.md)<`A`>*): [Decoder](../classes/_decoder_.decoder.md)<`A`>

**Type parameters:**

#### A 
**Parameters:**

| Param | Type |
| ------ | ------ |
| paths | ( `string` &#124; `number`)[] |
| decoder | [Decoder](../classes/_decoder_.decoder.md)<`A`> |

**Returns:** [Decoder](../classes/_decoder_.decoder.md)<`A`>

___
<a id="withdefault"></a>

### `<Const>` withDefault

**● withDefault**: *`function`* = 
  Decoder.withDefault

See `Decoder.withDefault`

#### Type declaration
▸A(defaultValue: *`A`*, decoder: *[Decoder](../classes/_decoder_.decoder.md)<`A`>*): [Decoder](../classes/_decoder_.decoder.md)<`A`>

**Type parameters:**

#### A 
**Parameters:**

| Param | Type |
| ------ | ------ |
| defaultValue | `A` |
| decoder | [Decoder](../classes/_decoder_.decoder.md)<`A`> |

**Returns:** [Decoder](../classes/_decoder_.decoder.md)<`A`>

___

## Functions

<a id="boolean"></a>

###  boolean

▸ **boolean**(): [Decoder](../classes/_decoder_.decoder.md)<`boolean`>

See `Decoder.boolean`

**Returns:** [Decoder](../classes/_decoder_.decoder.md)<`boolean`>

___
<a id="constant"></a>

###  constant

▸ **constant**(value: *`true`*): [Decoder](../classes/_decoder_.decoder.md)<`true`>

▸ **constant**(value: *`false`*): [Decoder](../classes/_decoder_.decoder.md)<`false`>

▸ **constant**A(value: *`A`*): [Decoder](../classes/_decoder_.decoder.md)<`A`>

See `Decoder.constant`

**Parameters:**

| Param | Type |
| ------ | ------ |
| value | `true` |

**Returns:** [Decoder](../classes/_decoder_.decoder.md)<`true`>

**Parameters:**

| Param | Type |
| ------ | ------ |
| value | `false` |

**Returns:** [Decoder](../classes/_decoder_.decoder.md)<`false`>

**Type parameters:**

#### A 
**Parameters:**

| Param | Type |
| ------ | ------ |
| value | `A` |

**Returns:** [Decoder](../classes/_decoder_.decoder.md)<`A`>

___
<a id="number"></a>

###  number

▸ **number**(): [Decoder](../classes/_decoder_.decoder.md)<`number`>

See `Decoder.number`

**Returns:** [Decoder](../classes/_decoder_.decoder.md)<`number`>

___
<a id="object"></a>

###  object

▸ **object**A(decoders: *[DecoderObject](_decoder_.md#decoderobject)<`A`>*): [Decoder](../classes/_decoder_.decoder.md)<`A`>

See `Decoder.object`

**Type parameters:**

#### A 
**Parameters:**

| Param | Type |
| ------ | ------ |
| decoders | [DecoderObject](_decoder_.md#decoderobject)<`A`> |

**Returns:** [Decoder](../classes/_decoder_.decoder.md)<`A`>

___
<a id="string"></a>

###  string

▸ **string**(): [Decoder](../classes/_decoder_.decoder.md)<`string`>

See `Decoder.string`

**Returns:** [Decoder](../classes/_decoder_.decoder.md)<`string`>

___
<a id="union"></a>

###  union

▸ **union**A,B(ad: *[Decoder](../classes/_decoder_.decoder.md)<`A`>*, bd: *[Decoder](../classes/_decoder_.decoder.md)<`B`>*): [Decoder](../classes/_decoder_.decoder.md)< `A` &#124; `B`>

▸ **union**A,B,C(ad: *[Decoder](../classes/_decoder_.decoder.md)<`A`>*, bd: *[Decoder](../classes/_decoder_.decoder.md)<`B`>*, cd: *[Decoder](../classes/_decoder_.decoder.md)<`C`>*): [Decoder](../classes/_decoder_.decoder.md)< `A` &#124; `B` &#124; `C`>

▸ **union**A,B,C,D(ad: *[Decoder](../classes/_decoder_.decoder.md)<`A`>*, bd: *[Decoder](../classes/_decoder_.decoder.md)<`B`>*, cd: *[Decoder](../classes/_decoder_.decoder.md)<`C`>*, dd: *[Decoder](../classes/_decoder_.decoder.md)<`D`>*): [Decoder](../classes/_decoder_.decoder.md)< `A` &#124; `B` &#124; `C` &#124; `D`>

▸ **union**A,B,C,D,E(ad: *[Decoder](../classes/_decoder_.decoder.md)<`A`>*, bd: *[Decoder](../classes/_decoder_.decoder.md)<`B`>*, cd: *[Decoder](../classes/_decoder_.decoder.md)<`C`>*, dd: *[Decoder](../classes/_decoder_.decoder.md)<`D`>*, ed: *[Decoder](../classes/_decoder_.decoder.md)<`E`>*): [Decoder](../classes/_decoder_.decoder.md)< `A` &#124; `B` &#124; `C` &#124; `D` &#124; `E`>

▸ **union**A,B,C,D,E,F(ad: *[Decoder](../classes/_decoder_.decoder.md)<`A`>*, bd: *[Decoder](../classes/_decoder_.decoder.md)<`B`>*, cd: *[Decoder](../classes/_decoder_.decoder.md)<`C`>*, dd: *[Decoder](../classes/_decoder_.decoder.md)<`D`>*, ed: *[Decoder](../classes/_decoder_.decoder.md)<`E`>*, fd: *[Decoder](../classes/_decoder_.decoder.md)<`F`>*): [Decoder](../classes/_decoder_.decoder.md)< `A` &#124; `B` &#124; `C` &#124; `D` &#124; `E` &#124; `F`>

▸ **union**A,B,C,D,E,F,G(ad: *[Decoder](../classes/_decoder_.decoder.md)<`A`>*, bd: *[Decoder](../classes/_decoder_.decoder.md)<`B`>*, cd: *[Decoder](../classes/_decoder_.decoder.md)<`C`>*, dd: *[Decoder](../classes/_decoder_.decoder.md)<`D`>*, ed: *[Decoder](../classes/_decoder_.decoder.md)<`E`>*, fd: *[Decoder](../classes/_decoder_.decoder.md)<`F`>*, gd: *[Decoder](../classes/_decoder_.decoder.md)<`G`>*): [Decoder](../classes/_decoder_.decoder.md)< `A` &#124; `B` &#124; `C` &#124; `D` &#124; `E` &#124; `F` &#124; `G`>

▸ **union**A,B,C,D,E,F,G,H(ad: *[Decoder](../classes/_decoder_.decoder.md)<`A`>*, bd: *[Decoder](../classes/_decoder_.decoder.md)<`B`>*, cd: *[Decoder](../classes/_decoder_.decoder.md)<`C`>*, dd: *[Decoder](../classes/_decoder_.decoder.md)<`D`>*, ed: *[Decoder](../classes/_decoder_.decoder.md)<`E`>*, fd: *[Decoder](../classes/_decoder_.decoder.md)<`F`>*, gd: *[Decoder](../classes/_decoder_.decoder.md)<`G`>*, hd: *[Decoder](../classes/_decoder_.decoder.md)<`H`>*): [Decoder](../classes/_decoder_.decoder.md)< `A` &#124; `B` &#124; `C` &#124; `D` &#124; `E` &#124; `F` &#124; `G` &#124; `H`>

See `Decoder.union`

**Type parameters:**

#### A 
#### B 
**Parameters:**

| Param | Type |
| ------ | ------ |
| ad | [Decoder](../classes/_decoder_.decoder.md)<`A`> |
| bd | [Decoder](../classes/_decoder_.decoder.md)<`B`> |

**Returns:** [Decoder](../classes/_decoder_.decoder.md)< `A` &#124; `B`>

**Type parameters:**

#### A 
#### B 
#### C 
**Parameters:**

| Param | Type |
| ------ | ------ |
| ad | [Decoder](../classes/_decoder_.decoder.md)<`A`> |
| bd | [Decoder](../classes/_decoder_.decoder.md)<`B`> |
| cd | [Decoder](../classes/_decoder_.decoder.md)<`C`> |

**Returns:** [Decoder](../classes/_decoder_.decoder.md)< `A` &#124; `B` &#124; `C`>

**Type parameters:**

#### A 
#### B 
#### C 
#### D 
**Parameters:**

| Param | Type |
| ------ | ------ |
| ad | [Decoder](../classes/_decoder_.decoder.md)<`A`> |
| bd | [Decoder](../classes/_decoder_.decoder.md)<`B`> |
| cd | [Decoder](../classes/_decoder_.decoder.md)<`C`> |
| dd | [Decoder](../classes/_decoder_.decoder.md)<`D`> |

**Returns:** [Decoder](../classes/_decoder_.decoder.md)< `A` &#124; `B` &#124; `C` &#124; `D`>

**Type parameters:**

#### A 
#### B 
#### C 
#### D 
#### E 
**Parameters:**

| Param | Type |
| ------ | ------ |
| ad | [Decoder](../classes/_decoder_.decoder.md)<`A`> |
| bd | [Decoder](../classes/_decoder_.decoder.md)<`B`> |
| cd | [Decoder](../classes/_decoder_.decoder.md)<`C`> |
| dd | [Decoder](../classes/_decoder_.decoder.md)<`D`> |
| ed | [Decoder](../classes/_decoder_.decoder.md)<`E`> |

**Returns:** [Decoder](../classes/_decoder_.decoder.md)< `A` &#124; `B` &#124; `C` &#124; `D` &#124; `E`>

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
| ad | [Decoder](../classes/_decoder_.decoder.md)<`A`> |
| bd | [Decoder](../classes/_decoder_.decoder.md)<`B`> |
| cd | [Decoder](../classes/_decoder_.decoder.md)<`C`> |
| dd | [Decoder](../classes/_decoder_.decoder.md)<`D`> |
| ed | [Decoder](../classes/_decoder_.decoder.md)<`E`> |
| fd | [Decoder](../classes/_decoder_.decoder.md)<`F`> |

**Returns:** [Decoder](../classes/_decoder_.decoder.md)< `A` &#124; `B` &#124; `C` &#124; `D` &#124; `E` &#124; `F`>

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
| ad | [Decoder](../classes/_decoder_.decoder.md)<`A`> |
| bd | [Decoder](../classes/_decoder_.decoder.md)<`B`> |
| cd | [Decoder](../classes/_decoder_.decoder.md)<`C`> |
| dd | [Decoder](../classes/_decoder_.decoder.md)<`D`> |
| ed | [Decoder](../classes/_decoder_.decoder.md)<`E`> |
| fd | [Decoder](../classes/_decoder_.decoder.md)<`F`> |
| gd | [Decoder](../classes/_decoder_.decoder.md)<`G`> |

**Returns:** [Decoder](../classes/_decoder_.decoder.md)< `A` &#124; `B` &#124; `C` &#124; `D` &#124; `E` &#124; `F` &#124; `G`>

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
| ad | [Decoder](../classes/_decoder_.decoder.md)<`A`> |
| bd | [Decoder](../classes/_decoder_.decoder.md)<`B`> |
| cd | [Decoder](../classes/_decoder_.decoder.md)<`C`> |
| dd | [Decoder](../classes/_decoder_.decoder.md)<`D`> |
| ed | [Decoder](../classes/_decoder_.decoder.md)<`E`> |
| fd | [Decoder](../classes/_decoder_.decoder.md)<`F`> |
| gd | [Decoder](../classes/_decoder_.decoder.md)<`G`> |
| hd | [Decoder](../classes/_decoder_.decoder.md)<`H`> |

**Returns:** [Decoder](../classes/_decoder_.decoder.md)< `A` &#124; `B` &#124; `C` &#124; `D` &#124; `E` &#124; `F` &#124; `G` &#124; `H`>

___

