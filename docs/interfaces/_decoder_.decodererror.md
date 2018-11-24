[@mojotech/json-type-validation](../README.md) > ["decoder"](../modules/_decoder_.md) > [DecoderError](../interfaces/_decoder_.decodererror.md)

# Interface: DecoderError

Information describing how json data failed to match a decoder. Includes the full input json, since in most cases it's useless to know how a decoder failed without also seeing the malformed data.

## Hierarchy

**DecoderError**

## Index

### Properties

* [at](_decoder_.decodererror.md#at)
* [input](_decoder_.decodererror.md#input)
* [kind](_decoder_.decodererror.md#kind)
* [message](_decoder_.decodererror.md#message)

---

## Properties

<a id="at"></a>

###  at

**● at**: *`string`*

___
<a id="input"></a>

###  input

**● input**: *`unknown`*

___
<a id="kind"></a>

###  kind

**● kind**: *"DecoderError"*

___
<a id="message"></a>

###  message

**● message**: *`string`*

___

