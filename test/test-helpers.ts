import {Result, err} from '../src/result';

export const tailError = <A>(r: Result<A, string>): Result<A, string> => {
  if (r.ok === false) {
    return err(r.error.substring(r.error.lastIndexOf('\n') + 1));
  } else {
    return r;
  }
};
