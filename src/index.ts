import * as Result from './result';
export {Result};

export {Decoder, DecoderResult, DecoderError, isDecoderError, DecoderObject} from './decoder';

export {
  string,
  number,
  boolean,
  anyJson,
  unknownJson,
  constant,
  object,
  array,
  tuple,
  dict,
  optional,
  oneOf,
  union,
  intersection,
  withDefault,
  valueAt,
  succeed,
  fail,
  result,
  lazy
} from './combinators';
