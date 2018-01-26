[json-type-validation](../README.md) > ["combinators"](../modules/_combinators_.md)



# External module: "combinators"

## Index

### Variables

* [anyJson](_combinators_.md#anyjson)
* [array](_combinators_.md#array)
* [constant](_combinators_.md#constant)
* [constantFalse](_combinators_.md#constantfalse)
* [constantNull](_combinators_.md#constantnull)
* [constantTrue](_combinators_.md#constanttrue)
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
* [number](_combinators_.md#number)
* [object](_combinators_.md#object)
* [string](_combinators_.md#string)
* [union](_combinators_.md#union)



---
## Variables
<a id="anyjson"></a>

###  anyJson

**●  anyJson**:  *`function`*  =  Decoder.anyJson




See `Decoder.anyJson`

#### Type declaration
►(): [Decoder](../classes/_decoder_.decoder.md)`any`





**Returns:** [Decoder](../classes/_decoder_.decoder.md)`any`






___

<a id="array"></a>

###  array

**●  array**:  *`function`*  =  Decoder.array




See `Decoder.array`

#### Type declaration
►A(decoder: *[Decoder](../classes/_decoder_.decoder.md)`A`*): [Decoder](../classes/_decoder_.decoder.md)`A`[]



**Type parameters:**

#### A 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| decoder | [Decoder](../classes/_decoder_.decoder.md)`A`   |  - |





**Returns:** [Decoder](../classes/_decoder_.decoder.md)`A`[]






___

<a id="constant"></a>

###  constant

**●  constant**:  *`function`*  =  Decoder.constant




See `Decoder.constant`

#### Type declaration
►A(value: *`A`*): [Decoder](../classes/_decoder_.decoder.md)`A`



**Type parameters:**

#### A 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| value | `A`   |  - |





**Returns:** [Decoder](../classes/_decoder_.decoder.md)`A`






___

<a id="constantfalse"></a>

###  constantFalse

**●  constantFalse**:  *`function`*  =  Decoder.constantFalse




See `Decoder.constantFalse`

#### Type declaration
►(): [Decoder](../classes/_decoder_.decoder.md)`false`





**Returns:** [Decoder](../classes/_decoder_.decoder.md)`false`






___

<a id="constantnull"></a>

###  constantNull

**●  constantNull**:  *`function`*  =  Decoder.constantNull




See `Decoder.constantNull`

#### Type declaration
►(): [Decoder](../classes/_decoder_.decoder.md)`null`





**Returns:** [Decoder](../classes/_decoder_.decoder.md)`null`






___

<a id="constanttrue"></a>

###  constantTrue

**●  constantTrue**:  *`function`*  =  Decoder.constantTrue




See `Decoder.constantTrue`

#### Type declaration
►(): [Decoder](../classes/_decoder_.decoder.md)`true`





**Returns:** [Decoder](../classes/_decoder_.decoder.md)`true`






___

<a id="dict"></a>

###  dict

**●  dict**:  *`function`*  =  Decoder.dict




See `Decoder.dict`

#### Type declaration
►A(decoder: *[Decoder](../classes/_decoder_.decoder.md)`A`*): [Decoder](../classes/_decoder_.decoder.md)`object`



**Type parameters:**

#### A 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| decoder | [Decoder](../classes/_decoder_.decoder.md)`A`   |  - |





**Returns:** [Decoder](../classes/_decoder_.decoder.md)`object`






___

<a id="fail"></a>

###  fail

**●  fail**:  *`function`*  =  Decoder.fail




See `Decoder.fail`

#### Type declaration
►A(errorMessage: *`string`*): [Decoder](../classes/_decoder_.decoder.md)`A`



**Type parameters:**

#### A 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| errorMessage | `string`   |  - |





**Returns:** [Decoder](../classes/_decoder_.decoder.md)`A`






___

<a id="lazy"></a>

###  lazy

**●  lazy**:  *`function`*  =  Decoder.lazy




See `Decoder.lazy`

#### Type declaration
►A(mkDecoder: *`function`*): [Decoder](../classes/_decoder_.decoder.md)`A`



**Type parameters:**

#### A 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| mkDecoder | `function`   |  - |





**Returns:** [Decoder](../classes/_decoder_.decoder.md)`A`






___

<a id="oneof"></a>

###  oneOf

**●  oneOf**:  *`function`*  =  Decoder.oneOf




See `Decoder.oneOf`

#### Type declaration
►A(...decoders: *[Decoder](../classes/_decoder_.decoder.md)`A`[]*): [Decoder](../classes/_decoder_.decoder.md)`A`



**Type parameters:**

#### A 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| decoders | [Decoder](../classes/_decoder_.decoder.md)`A`[]   |  - |





**Returns:** [Decoder](../classes/_decoder_.decoder.md)`A`






___

<a id="optional"></a>

###  optional

**●  optional**:  *`function`*  =  Decoder.optional




See `Decoder.optional`

#### Type declaration
►A(decoder: *[Decoder](../classes/_decoder_.decoder.md)`A`*): [Decoder](../classes/_decoder_.decoder.md)`A`⎮`undefined`



**Type parameters:**

#### A 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| decoder | [Decoder](../classes/_decoder_.decoder.md)`A`   |  - |





**Returns:** [Decoder](../classes/_decoder_.decoder.md)`A`⎮`undefined`






___

<a id="succeed"></a>

###  succeed

**●  succeed**:  *`function`*  =  Decoder.succeed




See `Decoder.succeed`

#### Type declaration
►A(fixedValue: *`A`*): [Decoder](../classes/_decoder_.decoder.md)`A`



**Type parameters:**

#### A 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| fixedValue | `A`   |  - |





**Returns:** [Decoder](../classes/_decoder_.decoder.md)`A`






___

<a id="valueat"></a>

###  valueAt

**●  valueAt**:  *`function`*  = 
  Decoder.valueAt




See `Decoder.valueAt`

#### Type declaration
►A(paths: *(`string`⎮`number`)[]*, decoder: *[Decoder](../classes/_decoder_.decoder.md)`A`*): [Decoder](../classes/_decoder_.decoder.md)`A`



**Type parameters:**

#### A 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| paths | (`string`⎮`number`)[]   |  - |
| decoder | [Decoder](../classes/_decoder_.decoder.md)`A`   |  - |





**Returns:** [Decoder](../classes/_decoder_.decoder.md)`A`






___

<a id="withdefault"></a>

###  withDefault

**●  withDefault**:  *`function`*  = 
  Decoder.withDefault




See `Decoder.withDefault`

#### Type declaration
►A(defaultValue: *`A`*, decoder: *[Decoder](../classes/_decoder_.decoder.md)`A`*): [Decoder](../classes/_decoder_.decoder.md)`A`



**Type parameters:**

#### A 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| defaultValue | `A`   |  - |
| decoder | [Decoder](../classes/_decoder_.decoder.md)`A`   |  - |





**Returns:** [Decoder](../classes/_decoder_.decoder.md)`A`






___


## Functions
<a id="boolean"></a>

###  boolean

► **boolean**(): [Decoder](../classes/_decoder_.decoder.md)`boolean`






See `Decoder.boolean`




**Returns:** [Decoder](../classes/_decoder_.decoder.md)`boolean`





___

<a id="number"></a>

###  number

► **number**(): [Decoder](../classes/_decoder_.decoder.md)`number`






See `Decoder.number`




**Returns:** [Decoder](../classes/_decoder_.decoder.md)`number`





___

<a id="object"></a>

###  object

► **object**A(decoders: *[DecoderObject](_decoder_.md#decoderobject)`A`*): [Decoder](../classes/_decoder_.decoder.md)`A`






See `Decoder.object`


**Type parameters:**

#### A 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| decoders | [DecoderObject](_decoder_.md#decoderobject)`A`   |  - |





**Returns:** [Decoder](../classes/_decoder_.decoder.md)`A`





___

<a id="string"></a>

###  string

► **string**(): [Decoder](../classes/_decoder_.decoder.md)`string`






See `Decoder.string`




**Returns:** [Decoder](../classes/_decoder_.decoder.md)`string`





___

<a id="union"></a>

###  union

► **union**A,B(ad: *[Decoder](../classes/_decoder_.decoder.md)`A`*, bd: *[Decoder](../classes/_decoder_.decoder.md)`B`*): [Decoder](../classes/_decoder_.decoder.md)`A`⎮`B`

► **union**A,B,C(ad: *[Decoder](../classes/_decoder_.decoder.md)`A`*, bd: *[Decoder](../classes/_decoder_.decoder.md)`B`*, cd: *[Decoder](../classes/_decoder_.decoder.md)`C`*): [Decoder](../classes/_decoder_.decoder.md)`A`⎮`B`⎮`C`

► **union**A,B,C,D(ad: *[Decoder](../classes/_decoder_.decoder.md)`A`*, bd: *[Decoder](../classes/_decoder_.decoder.md)`B`*, cd: *[Decoder](../classes/_decoder_.decoder.md)`C`*, dd: *[Decoder](../classes/_decoder_.decoder.md)`D`*): [Decoder](../classes/_decoder_.decoder.md)`A`⎮`B`⎮`C`⎮`D`

► **union**A,B,C,D,E(ad: *[Decoder](../classes/_decoder_.decoder.md)`A`*, bd: *[Decoder](../classes/_decoder_.decoder.md)`B`*, cd: *[Decoder](../classes/_decoder_.decoder.md)`C`*, dd: *[Decoder](../classes/_decoder_.decoder.md)`D`*, ed: *[Decoder](../classes/_decoder_.decoder.md)`E`*): [Decoder](../classes/_decoder_.decoder.md)`A`⎮`B`⎮`C`⎮`D`⎮`E`

► **union**A,B,C,D,E,F(ad: *[Decoder](../classes/_decoder_.decoder.md)`A`*, bd: *[Decoder](../classes/_decoder_.decoder.md)`B`*, cd: *[Decoder](../classes/_decoder_.decoder.md)`C`*, dd: *[Decoder](../classes/_decoder_.decoder.md)`D`*, ed: *[Decoder](../classes/_decoder_.decoder.md)`E`*, fd: *[Decoder](../classes/_decoder_.decoder.md)`F`*): [Decoder](../classes/_decoder_.decoder.md)`A`⎮`B`⎮`C`⎮`D`⎮`E`⎮`F`

► **union**A,B,C,D,E,F,G(ad: *[Decoder](../classes/_decoder_.decoder.md)`A`*, bd: *[Decoder](../classes/_decoder_.decoder.md)`B`*, cd: *[Decoder](../classes/_decoder_.decoder.md)`C`*, dd: *[Decoder](../classes/_decoder_.decoder.md)`D`*, ed: *[Decoder](../classes/_decoder_.decoder.md)`E`*, fd: *[Decoder](../classes/_decoder_.decoder.md)`F`*, gd: *[Decoder](../classes/_decoder_.decoder.md)`G`*): [Decoder](../classes/_decoder_.decoder.md)`A`⎮`B`⎮`C`⎮`D`⎮`E`⎮`F`⎮`G`

► **union**A,B,C,D,E,F,G,H(ad: *[Decoder](../classes/_decoder_.decoder.md)`A`*, bd: *[Decoder](../classes/_decoder_.decoder.md)`B`*, cd: *[Decoder](../classes/_decoder_.decoder.md)`C`*, dd: *[Decoder](../classes/_decoder_.decoder.md)`D`*, ed: *[Decoder](../classes/_decoder_.decoder.md)`E`*, fd: *[Decoder](../classes/_decoder_.decoder.md)`F`*, gd: *[Decoder](../classes/_decoder_.decoder.md)`G`*, hd: *[Decoder](../classes/_decoder_.decoder.md)`H`*): [Decoder](../classes/_decoder_.decoder.md)`A`⎮`B`⎮`C`⎮`D`⎮`E`⎮`F`⎮`G`⎮`H`






See `Decoder.union`


**Type parameters:**

#### A 
#### B 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| ad | [Decoder](../classes/_decoder_.decoder.md)`A`   |  - |
| bd | [Decoder](../classes/_decoder_.decoder.md)`B`   |  - |





**Returns:** [Decoder](../classes/_decoder_.decoder.md)`A`⎮`B`






**Type parameters:**

#### A 
#### B 
#### C 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| ad | [Decoder](../classes/_decoder_.decoder.md)`A`   |  - |
| bd | [Decoder](../classes/_decoder_.decoder.md)`B`   |  - |
| cd | [Decoder](../classes/_decoder_.decoder.md)`C`   |  - |





**Returns:** [Decoder](../classes/_decoder_.decoder.md)`A`⎮`B`⎮`C`






**Type parameters:**

#### A 
#### B 
#### C 
#### D 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| ad | [Decoder](../classes/_decoder_.decoder.md)`A`   |  - |
| bd | [Decoder](../classes/_decoder_.decoder.md)`B`   |  - |
| cd | [Decoder](../classes/_decoder_.decoder.md)`C`   |  - |
| dd | [Decoder](../classes/_decoder_.decoder.md)`D`   |  - |





**Returns:** [Decoder](../classes/_decoder_.decoder.md)`A`⎮`B`⎮`C`⎮`D`






**Type parameters:**

#### A 
#### B 
#### C 
#### D 
#### E 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| ad | [Decoder](../classes/_decoder_.decoder.md)`A`   |  - |
| bd | [Decoder](../classes/_decoder_.decoder.md)`B`   |  - |
| cd | [Decoder](../classes/_decoder_.decoder.md)`C`   |  - |
| dd | [Decoder](../classes/_decoder_.decoder.md)`D`   |  - |
| ed | [Decoder](../classes/_decoder_.decoder.md)`E`   |  - |





**Returns:** [Decoder](../classes/_decoder_.decoder.md)`A`⎮`B`⎮`C`⎮`D`⎮`E`






**Type parameters:**

#### A 
#### B 
#### C 
#### D 
#### E 
#### F 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| ad | [Decoder](../classes/_decoder_.decoder.md)`A`   |  - |
| bd | [Decoder](../classes/_decoder_.decoder.md)`B`   |  - |
| cd | [Decoder](../classes/_decoder_.decoder.md)`C`   |  - |
| dd | [Decoder](../classes/_decoder_.decoder.md)`D`   |  - |
| ed | [Decoder](../classes/_decoder_.decoder.md)`E`   |  - |
| fd | [Decoder](../classes/_decoder_.decoder.md)`F`   |  - |





**Returns:** [Decoder](../classes/_decoder_.decoder.md)`A`⎮`B`⎮`C`⎮`D`⎮`E`⎮`F`






**Type parameters:**

#### A 
#### B 
#### C 
#### D 
#### E 
#### F 
#### G 
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| ad | [Decoder](../classes/_decoder_.decoder.md)`A`   |  - |
| bd | [Decoder](../classes/_decoder_.decoder.md)`B`   |  - |
| cd | [Decoder](../classes/_decoder_.decoder.md)`C`   |  - |
| dd | [Decoder](../classes/_decoder_.decoder.md)`D`   |  - |
| ed | [Decoder](../classes/_decoder_.decoder.md)`E`   |  - |
| fd | [Decoder](../classes/_decoder_.decoder.md)`F`   |  - |
| gd | [Decoder](../classes/_decoder_.decoder.md)`G`   |  - |





**Returns:** [Decoder](../classes/_decoder_.decoder.md)`A`⎮`B`⎮`C`⎮`D`⎮`E`⎮`F`⎮`G`






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

| Param | Type | Description |
| ------ | ------ | ------ |
| ad | [Decoder](../classes/_decoder_.decoder.md)`A`   |  - |
| bd | [Decoder](../classes/_decoder_.decoder.md)`B`   |  - |
| cd | [Decoder](../classes/_decoder_.decoder.md)`C`   |  - |
| dd | [Decoder](../classes/_decoder_.decoder.md)`D`   |  - |
| ed | [Decoder](../classes/_decoder_.decoder.md)`E`   |  - |
| fd | [Decoder](../classes/_decoder_.decoder.md)`F`   |  - |
| gd | [Decoder](../classes/_decoder_.decoder.md)`G`   |  - |
| hd | [Decoder](../classes/_decoder_.decoder.md)`H`   |  - |





**Returns:** [Decoder](../classes/_decoder_.decoder.md)`A`⎮`B`⎮`C`⎮`D`⎮`E`⎮`F`⎮`G`⎮`H`





___


