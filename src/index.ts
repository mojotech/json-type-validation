import * as Result from './result';
export {Result};

export {Decoder, DecoderError, isDecoderError, DecoderObject} from './decoder';

export {
  string,
  number,
  boolean,
  anyJson,
  constant,
  object,
  array,
  dict,
  optional,
  oneOf,
  union,
  intersection,
  withDefault,
  valueAt,
  succeed,
  fail,
  lazy
} from './combinators';
