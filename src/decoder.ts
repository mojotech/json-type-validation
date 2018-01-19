import * as Result from './result';

/**
 * Information describing how json data failed to match a decoder.
 * Includes the full input json, since in most cases it's useless to know how a
 * decoder failed without also seeing the malformed data.
 */
export interface DecoderError {
  kind: 'DecoderError';
  input: any;
  at: string;
  message: string;
}

/**
 * Defines a mapped type over an interface `A`. `DecoderObject<A>` is an
 * interface that has all the keys or `A`, but each key's property type is
 * mapped to a decoder for that type. This type is used when creating decoders
 * for objects.
 *
 * Example:
 * ```
 * interface X {
 *   a: boolean;
 *   b: string;
 * }
 *
 * const decoderObject: DecoderObject<X> = {
 *   a: boolean(),
 *   b: string()
 * }
 * ```
 */
export type DecoderObject<A> = {[t in keyof A]: Decoder<A[t]>};

/**
 * Type guard for `DecoderError`. One use case of the type guard is in the
 * `catch` of a promise. Typescript types the error argument of `catch` as
 * `any`, so when dealing with a decoder as a promise you may need to
 * distinguish between a `DecoderError` and an error string.
 */
export const isDecoderError = (a: any): a is DecoderError =>
  a.kind === 'DecoderError' && typeof a.at === 'string' && typeof a.message === 'string';

/**
 * `DecoderError` information as a formatted string.
 */
export const decoderErrorString = (error: DecoderError): string =>
  `Input: ${JSON.stringify(error.input)}\nFailed at ${error.at}: ${error.message}`;

/*
 * Helpers
 */
const isJsonArray = (json: any): boolean => json instanceof Array;

const isJsonObject = (json: any): boolean =>
  typeof json === 'object' && json !== null && !isJsonArray(json);

const expectedGot = (expected: string, got: any) =>
  `expected ${expected}, got ${JSON.stringify(got)}`;

const printPath = (paths: (string | number)[]): string =>
  paths.map(path => (typeof path === 'string' ? `.${path}` : `[${path}]`)).join('');

const prependAt = (newAt: string, {at, ...rest}: Partial<DecoderError>): Partial<DecoderError> => ({
  at: newAt + (at || ''),
  ...rest
});

/**
 * Decoders transform json objects with unknown structure into known and
 * verified forms. You can create objects of type `Decoder<A>` with either the
 * primitive decoder functions, such as `boolean()` and `string()`, or by
 * applying higher-order decoders to the primitives, such as `array(boolean())`
 * or `dict(string())`.
 *
 * Each of the decoder functions are available both as a static method on
 * `Decoder` and as a function alias -- for example the string decoder is
 * defined at `Decoder.string()`, but is also aliased to `string()`. Using the
 * function aliases is recommended.
 *
 * `Decoder` exposes a number of 'run' methods, which all decode json in the
 * same way, but communicate success and failure in different ways. The `map`
 * and `andThen` methods modify decoders without having to call a 'run' method.
 *
 * Alternatively, the main decoder `run()` method returns an object of type
 * `Result<A, DecoderError>`. This library provides a number of helper
 * functions for dealing with the `Result` type, so you can do all the same
 * things with a `Result` as with the decoder methods.
 */
export class Decoder<A> {
  private constructor(private decode: (json: any) => Result.Result<A, Partial<DecoderError>>) {}

  /**
   * Decoder primitive that passes through string values, and fails on all other
   * input.
   */
  static string(): Decoder<string> {
    return new Decoder<string>(
      (json: any) =>
        typeof json === 'string'
          ? Result.ok(json)
          : Result.err({message: expectedGot('a string', json)})
    );
  }

  /**
   * Decoder primitive that passes through number values, and fails on all other
   * input.
   */
  static number(): Decoder<number> {
    return new Decoder<number>(
      (json: any) =>
        typeof json === 'number'
          ? Result.ok(json)
          : Result.err({message: expectedGot('a number', json)})
    );
  }

  /**
   * Decoder primitive that passes through boolean values, and fails on all other
   * input.
   */
  static boolean(): Decoder<boolean> {
    return new Decoder<boolean>(
      (json: any) =>
        typeof json === 'boolean'
          ? Result.ok(json)
          : Result.err({message: expectedGot('a boolean', json)})
    );
  }

  /**
   * Decoder identity function. Useful for incremental decoding.
   *
   * Example:
   * ```
   * const json: any = [1, true, 2, 3, 'five', 4, []];
   * const jsonArray: any[] = Result.withDefault([], array(anyJson()).run(json));
   * const successes: Result.Ok<number>[] = jsonArray.map(number().run).filter(Result.isOk);
   * const numbers: number[] = successes.map(ok => ok.result);
   *
   * numbers
   * // => [1, 2, 3, 4]
   * ```
   */
  static anyJson = (): Decoder<any> => new Decoder<any>((json: any) => Result.ok(json));

  /**
   * Decoder primitive that only matches on exact values.
   *
   * Note that `constant('string to match')` returns a `Decoder<string>` which
   * fails if the input is not equal to `'string to match'`. In many cases this
   * is sufficient, but in some situations typescript requires that the decoder
   * type be a type-literal. In such a case you must provide the type parameter,
   * which looks like `constant<'string to match'>('string to match')`.
   *
   * Example:
   * ```
   * interface Bear {
   *   kind: 'bear';
   *   isBig: boolean;
   * }
   *
   * const bearDecoder1: Decoder<Bear> = object({
   *   kind: constant('bear'),
   *   isBig: boolean()
   * });
   * // Type 'Decoder<{ kind: string; isBig: boolean; }>' is not assignable to
   * // type 'Decoder<Bear>'. Type 'string' is not assignable to type '"bear"'.
   *
   * const bearDecoder2: Decoder<Bear> = object({
   *   kind: constant<'bear'>('bear'),
   *   isBig: boolean()
   * });
   * // no compiler errors
   * ```
   *
   * In this second case, using the type alias works just as well as using the
   * string-literal types:
   * ```
   * type animal = 'bird' | 'bear';
   *
   * const animalDecoder1: Decoder<animal> = oneOf(
   *   constant('bird'),
   *   constant('bear')
   * );
   * // Type 'Decoder<string>' is not assignable to type 'Decoder<animal>'. Type
   * // 'string' is not assignable to type 'animal'.
   *
   * const animalDecoder2: Decoder<animal> = oneOf(
   *   constant<animal>('bird'),
   *   constant<animal>('bear')
   * );
   * // no compiler errors
   * ```
   * This is technically not accurate, since the typing of
   * `constant<animal>('bird')` asserts that the constant decoder could return
   * either of the animal values, when it actually only decodes 'bird'. At the
   * same time, since there is no exhaustiveness check on the decoder we don't
   * gain anything by being more specific.
   */
  static constant = <A>(value: A): Decoder<A> =>
    new Decoder(
      (json: any) =>
        json === value
          ? Result.ok(value)
          : Result.err({message: expectedGot(JSON.stringify(value), json)})
    );

  /**
   * Decoder primitive that only matches the value `true`, and returns the
   * decoder `Decoder<true>` instead of `Decoder<boolean>`. It is a more
   * ergonomic alias for `constant<true>(true)`.
   */
  static constantTrue = (): Decoder<true> => Decoder.constant<true>(true);

  /**
   * Decoder primitive that only matches the value `false`, and returns the
   * decoder `Decoder<false>` instead of `Decoder<boolean>`. It is a more
   * ergonomic alias for `constant<false>(false)`.
   */
  static constantFalse = (): Decoder<false> => Decoder.constant<false>(false);

  /**
   * Decoder primitive that only matches the value `null`. It is a more ergonomic
   * alias for `constant<null>(null)`.
   */
  static constantNull = (): Decoder<null> => Decoder.constant<null>(null);

  /**
   * An higher-order decoder that runs decoders on specified fields of an object,
   * and returns a new object with those fields.
   *
   * The `optional` and `constant` decoders are particularly useful for decoding
   * objects that match typescript interfaces.
   *
   * To decode a single field that is inside of an object see `valueAt`.
   *
   * Example:
   * ```
   * object({x: number(), y: number()}).run({x: 5, y: 10})
   * // => {ok: true, result: {x: 5, y: 10}}
   * ```
   */
  static object<A>(decoders: DecoderObject<A>): Decoder<A> {
    return new Decoder<A>((json: any) => {
      if (isJsonObject(json)) {
        let obj: any = {};
        for (const key in decoders) {
          if (decoders.hasOwnProperty(key)) {
            const r = decoders[key].decode(json[key]);
            if (r.ok === true) {
              obj[key] = r.result;
            } else {
              return Result.err(prependAt(`.${key}`, r.error));
            }
          }
        }
        return Result.ok(obj);
      } else {
        return Result.err({message: expectedGot('an object', json)});
      }
    });
  }

  /**
   * Decoder for json arrays. Runs `decoder` on each array element, and succeeds
   * if all elements are successfully decoded.
   *
   * To decode a single value that is inside of an array see `valueAt`.
   *
   * Examples:
   * ```
   * array(number()).run([1, 2, 3])
   * // => {ok: true, result: [1, 2, 3]}
   *
   * array(array(boolean())).run([[true], [], [true, false, false]])
   * // => {ok: true, result: [[true], [], [true, false, false]]}
   * ```
   */
  static array = <A>(decoder: Decoder<A>): Decoder<A[]> =>
    new Decoder<A[]>(json => {
      if (isJsonArray(json)) {
        let arr: A[] = [];
        for (let i = 0; i < json.length; i++) {
          const r = decoder.decode(json[i]);
          if (r.ok === true) {
            arr.push(r.result);
          } else {
            return Result.err(prependAt(`[${i}]`, r.error));
          }
        }
        return Result.ok(arr);
      } else {
        return Result.err({message: expectedGot('an array', json)});
      }
    });

  /**
   * Decoder for json objects where the keys are unknown strings, but the values
   * should all be of the same type.
   *
   * Example:
   * ```
   * dict(number()).run({chocolate: 12, vanilla: 10, mint: 37});
   * // => {ok: true, result: {chocolate: 12, vanilla: 10, mint: 37}}
   * ```
   */
  static dict = <A>(decoder: Decoder<A>): Decoder<{[name: string]: A}> =>
    new Decoder<{[name: string]: A}>(json => {
      if (isJsonObject(json)) {
        let obj: {[name: string]: A} = {};
        for (const key in json) {
          if (json.hasOwnProperty(key)) {
            const r = decoder.decode(json[key]);
            if (r.ok === true) {
              obj[key] = r.result;
            } else {
              return Result.err(prependAt(`.${key}`, r.error));
            }
          }
        }
        return Result.ok(obj);
      } else {
        return Result.err({message: expectedGot('an object', json)});
      }
    });

  /**
   * Decoder for values that may be `undefined`. This is primarily helpful for
   * decoding interfaces with optional fields.
   *
   * Example:
   * ```
   * interface User {
   *   id: number;
   *   isOwner?: boolean;
   * }
   *
   * const decoder: Decoder<User> = object({
   *   id: number(),
   *   isOwner: optional(boolean())
   * });
   * ```
   */
  static optional = <A>(decoder: Decoder<A>): Decoder<undefined | A> =>
    new Decoder<undefined | A>(
      (json: any) => (json === undefined ? Result.ok(undefined) : decoder.decode(json))
    );

  /**
   * Decoder that attempts to run each decoder in `decoders` and either succeeds
   * with the first successful decoder, or fails after all decoders have failed.
   *
   * Note that `oneOf` expects the decoders to all have the same return type,
   * while `union` creates a decoder for the union type of all the input
   * decoders.
   *
   * Examples:
   * ```
   * oneOf(string(), number().map(String))
   * oneOf(constant('start'), constant('stop'), succeed('unknown'))
   * ```
   */
  static oneOf = <A>(...decoders: Decoder<A>[]): Decoder<A> =>
    new Decoder<A>((json: any) => {
      const errors: Partial<DecoderError>[] = [];
      for (let i: number = 0; i < decoders.length; i++) {
        const r = decoders[i].decode(json);
        if (r.ok === true) {
          return r;
        } else {
          errors[i] = r.error;
        }
      }
      const errorsList =
        '["' +
        errors.map(error => `at input${error.at || ''}: ${error.message}`).join('", "') +
        '"]';
      return Result.err({
        message: `expected a value matching one of the decoders, got the errors ${errorsList}`
      });
    });

  /**
   * Combines 2-8 decoders of disparate types into a decoder for the union of all
   * the types.
   *
   * If you need more than 8 variants for your union, it's possible to use
   * `oneOf` in place of `union` as long as you annotate every decoder with the
   * union type.
   *
   * Example:
   * ```
   * type C = {a: string} | {b: number};
   *
   * const unionDecoder: Decoder<C> = union(object({a: string()}), object({b: number()}));
   * const oneOfDecoder: Decoder<C> = oneOf(object<C>({a: string()}), object<C>({b: number()}));
   * ```
   */
  static union <A, B>(ad: Decoder<A>, bd: Decoder<B>): Decoder<A | B>; // prettier-ignore
  static union <A, B, C>(ad: Decoder<A>, bd: Decoder<B>, cd: Decoder<C>): Decoder<A | B | C>; // prettier-ignore
  static union <A, B, C, D>(ad: Decoder<A>, bd: Decoder<B>, cd: Decoder<C>, dd: Decoder<D>): Decoder<A | B | C | D>; // prettier-ignore
  static union <A, B, C, D, E>(ad: Decoder<A>, bd: Decoder<B>, cd: Decoder<C>, dd: Decoder<D>, ed: Decoder<E>): Decoder<A | B | C | D | E>; // prettier-ignore
  static union <A, B, C, D, E, F>(ad: Decoder<A>, bd: Decoder<B>, cd: Decoder<C>, dd: Decoder<D>, ed: Decoder<E>, fd: Decoder<F>): Decoder<A | B | C | D | E | F>; // prettier-ignore
  static union <A, B, C, D, E, F, G>(ad: Decoder<A>, bd: Decoder<B>, cd: Decoder<C>, dd: Decoder<D>, ed: Decoder<E>, fd: Decoder<F>, gd: Decoder<G>): Decoder<A | B | C | D | E | F | G>; // prettier-ignore
  static union <A, B, C, D, E, F, G, H>(ad: Decoder<A>, bd: Decoder<B>, cd: Decoder<C>, dd: Decoder<D>, ed: Decoder<E>, fd: Decoder<F>, gd: Decoder<G>, hd: Decoder<H>): Decoder<A | B | C | D | E | F | G | H>; // prettier-ignore
  static union(ad: Decoder<any>, bd: Decoder<any>, ...decoders: Decoder<any>[]): Decoder<any> {
    return Decoder.oneOf(ad, bd, ...decoders);
  }

  /**
   * Decoder that always succeeds with either the decoded value, or a fallback
   * default value.
   */
  static withDefault = <A>(defaultValue: A, decoder: Decoder<A>): Decoder<A> =>
    new Decoder<A>((json: any) =>
      Result.ok(Result.withDefault(defaultValue, decoder.decode(json)))
    );

  /**
   * Decoder that pulls a specific field out of a json structure, instead of
   * decoding and returning the full structure. The `paths` array describes the
   * object keys and array indices to traverse, so that values can be pulled out
   * of a nested structure.
   *
   * Example:
   * ```
   * const decoder = valueAt(['a', 'b', 0], string());
   *
   * decoder.run({a: {b: ['surprise!']}})
   * // => {ok: true, result: 'surprise!'}
   *
   * decoder.run({a: {x: 'cats'}})
   * // => {ok: false, error: {... at: 'input.a.b[0]' message: 'path does not exist'}}
   * ```
   *
   * Note that the `decoder` is ran on the value found at the last key in the
   * path, even if the last key is not found. This allows the `optional`
   * decoder to succeed when appropriate.
   * ```
   * const optionalDecoder = valueAt(['a', 'b', 'c'], optional(string()));
   *
   * optionalDecoder.run({a: {b: {c: 'surprise!'}}})
   * // => {ok: true, result: 'surprise!'}
   *
   * optionalDecoder.run({a: {b: 'cats'}})
   * // => {ok: false, error: {... at: 'input.a.b.c' message: 'expected an object, got "cats"'}
   *
   * optionalDecoder.run({a: {b: {z: 1}}})
   * // => {ok: true, result: undefined}
   * ```
   */
  static valueAt = <A>(paths: (string | number)[], decoder: Decoder<A>): Decoder<A> =>
    new Decoder<A>((json: any) => {
      let jsonAtPath: any = json;
      for (let i: number = 0; i < paths.length; i++) {
        if (jsonAtPath === undefined) {
          return Result.err({
            at: printPath(paths.slice(0, i + 1)),
            message: 'path does not exist'
          });
        } else if (typeof paths[i] === 'string' && !isJsonObject(jsonAtPath)) {
          return Result.err({
            at: printPath(paths.slice(0, i + 1)),
            message: expectedGot('an object', jsonAtPath)
          });
        } else if (typeof paths[i] === 'number' && !isJsonArray(jsonAtPath)) {
          return Result.err({
            at: printPath(paths.slice(0, i + 1)),
            message: expectedGot('an array', jsonAtPath)
          });
        } else {
          jsonAtPath = jsonAtPath[paths[i]];
        }
      }
      return Result.mapError(
        error => prependAt(printPath(paths), error),
        decoder.decode(jsonAtPath)
      );
    });

  /**
   * Decoder that ignores the input json and always succeeds with `fixedValue`.
   */
  static succeed = <A>(fixedValue: A): Decoder<A> =>
    new Decoder<A>((json: any) => Result.ok(fixedValue));

  /**
   * Decoder that ignores the input json and always fails with `errorMessage`.
   */
  static fail = <A>(errorMessage: string): Decoder<A> =>
    new Decoder<A>((json: any) => Result.err({message: errorMessage}));

  /**
   * Decoder that allows for decoding recursive data structures. Unlike with
   * functions, variables such as decoders can't reference themselves before
   * they are fully defined. We can avoid prematurely referencing the decoder
   * by wrapping it in a function that won't be called until use, at which
   * point the decoder has been defined.
   *
   * Example:
   * ```
   * interface Comment {
   *   msg: string;
   *   replies: Comment[];
   * }
   *
   * const decoder: Decoder<Comment> = object({
   *   msg: string(),
   *   replies: lazy(() => array(decoder))
   * });
   * ```
   */
  static lazy = <A>(mkDecoder: () => Decoder<A>): Decoder<A> =>
    new Decoder((json: any) => mkDecoder().decode(json));

  /**
   * Run the decoder and return a `Result` with either the decoded value or a
   * `DecoderError` containing the json input, the location of the error, and
   * the error message.
   *
   * Examples:
   * ```
   * number().run(12)
   * // => {ok: true, result: 12}
   *
   * string().run(9001)
   * // =>
   * // {
   * //   ok: false,
   * //   error: {
   * //     kind: 'DecoderError',
   * //     input: 9001,
   * //     at: 'input',
   * //     message: 'expected a string, got 9001'
   * //   }
   * // }
   * ```
   */
  run = (json: any): Result.Result<A, DecoderError> =>
    Result.mapError(
      error => ({
        kind: 'DecoderError' as 'DecoderError',
        input: json,
        at: 'input' + (error.at || ''),
        message: error.message || ''
      }),
      this.decode(json)
    );

  /**
   * Run the decoder as a `Promise`.
   */
  runPromise = (json: any): Promise<A> => Result.asPromise(this.run(json));

  /**
   * Run the decoder and return the value on success, or throw an exception
   * with a formatted error string.
   */
  runWithException = (json: any): A =>
    Result.withException(Result.mapError(decoderErrorString, this.run(json)));

  /**
   * Construct a new decoder that applies a transformation to the decoded
   * result. If the decoder succeeds then `f` will be applied to the value. If
   * it fails the error will propagated through.
   *
   * Example:
   * ```
   * number().map(x => x * 5).run(10)
   * // => {ok: true, result: 50}
   * ```
   */
  map = <B>(f: (value: A) => B): Decoder<B> =>
    new Decoder<B>((json: any) => Result.map(f, this.decode(json)));

  /**
   * Chain together a sequence of decoders. The first decoder will run, and
   * then the function will determine what decoder to run second. If the result
   * of the first decoder succeeds then `f` will be applied to the decoded
   * value. If it fails the error will propagate through. One use case for
   * `andThen` is returning a custom error message.
   *
   * Example:
   * ```
   * const versionDecoder = valueAt(['version'], number());
   * const infoDecoder3 = object({a: boolean()});
   *
   * const decoder = versionDecoder.andThen(version => {
   *   switch (version) {
   *     case 3:
   *       return infoDecoder3;
   *     default:
   *       return fail(`Unable to decode info, version ${version} is not supported.`);
   *   }
   * });
   *
   * decoder.run({version: 3, a: true})
   * // => {ok: true, result: {a: true}}
   *
   * decoder.run({version: 5, x: 'abc'})
   * // =>
   * // {
   * //   ok: false,
   * //   error: {
   * //     ...
   * //     at: 'input',
   * //     message: 'Unable to decode info, version 5 is not supported.'
   * //   }
   * // }
   * ```
   */
  andThen = <B>(f: (value: A) => Decoder<B>): Decoder<B> =>
    new Decoder<B>((json: any) =>
      Result.andThen(value => f(value).decode(json), this.decode(json))
    );
}
