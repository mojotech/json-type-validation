import * as Result from './result';
const isEqual = require('lodash.isequal'); // this syntax avoids TS1192

/**
 * Information describing how json data failed to match a decoder.
 * Includes the full input json, since in most cases it's useless to know how a
 * decoder failed without also seeing the malformed data.
 */
export interface DecoderError {
  kind: 'DecoderError';
  input: unknown;
  at: string;
  message: string;
}

/**
 * Alias for the result of the `Decoder.run` method. On success returns `Ok`
 * with the decoded value of type `A`, on failure returns `Err` containing a
 * `DecoderError`.
 */
export type DecoderResult<A> = Result.Result<A, DecoderError>;

interface Context {
  input: unknown;
  at: string;
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

/*
 * Helpers
 */
const isJsonArray = (json: any): json is unknown[] => Array.isArray(json);

const isJsonObject = (json: any): json is Record<string, unknown> =>
  typeof json === 'object' && json !== null && !isJsonArray(json);

const typeString = (json: unknown): string => {
  switch (typeof json) {
    case 'string':
      return 'a string';
    case 'number':
      return 'a number';
    case 'boolean':
      return 'a boolean';
    case 'undefined':
      return 'undefined';
    case 'object':
      if (json instanceof Array) {
        return 'an array';
      } else if (json === null) {
        return 'null';
      } else {
        return 'an object';
      }
    default:
      return JSON.stringify(json);
  }
};

const decoderError = <A>({input, at}: Context, message: string): DecoderResult<A> =>
  Result.err({
    kind: 'DecoderError' as 'DecoderError',
    input,
    at,
    message
  });

const expectedGot = (expected: string, got: unknown) =>
  `expected ${expected}, got ${typeString(got)}`;

const printPath = (paths: (string | number)[]): string =>
  paths.map(path => (typeof path === 'string' ? `.${path}` : `[${path}]`)).join('');

const appendAt = ({input, at}: Context, newAt: string): Context => ({input, at: at + newAt});

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
 * function aliases exported with the library is recommended.
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
  /**
   * @ignore
   */
  private constructor(private decode: (json: unknown, context: Context) => DecoderResult<A>) {}

  /**
   * Decoder primitive that validates strings, and fails on all other input.
   */
  static string(): Decoder<string> {
    return new Decoder(
      (json, context) =>
        typeof json === 'string'
          ? Result.ok(json)
          : decoderError(context, expectedGot('a string', json))
    );
  }

  /**
   * Decoder primitive that validates numbers, and fails on all other input.
   */
  static number(): Decoder<number> {
    return new Decoder(
      (json, context) =>
        typeof json === 'number'
          ? Result.ok(json)
          : decoderError(context, expectedGot('a number', json))
    );
  }

  /**
   * Decoder primitive that validates booleans, and fails on all other input.
   */
  static boolean(): Decoder<boolean> {
    return new Decoder(
      (json, context) =>
        typeof json === 'boolean'
          ? Result.ok(json)
          : decoderError(context, expectedGot('a boolean', json))
    );
  }

  /**
   * Escape hatch to bypass validation. Always succeeds and types the result as
   * `any`. Useful for defining decoders incrementally, particularly for
   * complex objects.
   *
   * Example:
   * ```
   * interface User {
   *   name: string;
   *   complexUserData: ComplexType;
   * }
   *
   * const userDecoder: Decoder<User> = object({
   *   name: string(),
   *   complexUserData: anyJson()
   * });
   * ```
   */
  static anyJson = (): Decoder<any> => new Decoder((json, _) => Result.ok(json));

  /**
   * Decoder identity function which always succeeds and types the result as
   * `unknown`.
   */
  static unknownJson = (): Decoder<unknown> => new Decoder((json, _) => Result.ok(json));

  /**
   * Decoder primitive that only matches on exact values.
   *
   * Note that `constant('string to match')` returns a `Decoder<string>` which
   * fails if the input is not equal to `'string to match'`. In many cases this
   * is sufficient, but in some situations typescript requires that the decoder
   * type be a type-literal. In such a case you must provide the type parameter,
   * which looks like `constant<'string to match'>('string to match')`.
   *
   * Providing the type parameter is only necessary for type-literal strings
   * and numbers, as detailed by this table:
   *
   * ```
   *  | Decoder                      | Type                 |
   *  | ---------------------------- | ---------------------|
   *  | constant(true)               | Decoder<true>        |
   *  | constant(false)              | Decoder<false>       |
   *  | constant(null)               | Decoder<null>        |
   *  | constant('alaska')           | Decoder<string>      |
   *  | constant<'alaska'>('alaska') | Decoder<'alaska'>    |
   *  | constant(50)                 | Decoder<number>      |
   *  | constant<50>(50)             | Decoder<50>          |
   *  | constant([1,2,3])            | Decoder<number[]>    |
   *  | constant<[1,2,3]>([1,2,3])   | Decoder<[1,2,3]>     |
   *  | constant({x: 't'})           | Decoder<{x: string}> |
   *  | constant<{x: 't'}>({x: 't'}) | Decoder<{x: 't'}>    |
   * ```
   *
   *
   * One place where this happens is when a type-literal is in an interface:
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
   * Another is in type-literal unions:
   * ```
   * type animal = 'bird' | 'bear';
   *
   * const animalDecoder1: Decoder<animal> = union(
   *   constant('bird'),
   *   constant('bear')
   * );
   * // Type 'Decoder<string>' is not assignable to type 'Decoder<animal>'.
   * // Type 'string' is not assignable to type 'animal'.
   *
   * const animalDecoder2: Decoder<animal> = union(
   *   constant<'bird'>('bird'),
   *   constant<'bear'>('bear')
   * );
   * // no compiler errors
   * ```
   */
  static constant(value: true): Decoder<true>;
  static constant(value: false): Decoder<false>;
  static constant<A>(value: A): Decoder<A>;
  static constant(value: any): Decoder<any> {
    return new Decoder(
      (json, context) =>
        isEqual(json, value)
          ? Result.ok(value)
          : decoderError(context, `expected ${JSON.stringify(value)}, got ${JSON.stringify(json)}`)
    );
  }

  /**
   * An higher-order decoder that runs decoders on specified fields of an object,
   * and returns a new object with those fields. If `object` is called with no
   * arguments, then the outer object part of the json is validated but not the
   * contents, typing the result as a record where all keys have a value of
   * type `unknown`.
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
   *
   * object().map(Object.keys).run({n: 1, i: [], c: {}, e: 'e'})
   * // => {ok: true, result: ['n', 'i', 'c', 'e']}
   * ```
   */
  static object(): Decoder<Record<string, unknown>>;
  static object<A>(decoders: DecoderObject<A>): Decoder<A>;
  static object<A>(decoders?: DecoderObject<A>) {
    return new Decoder((json, context) => {
      if (isJsonObject(json) && decoders) {
        let obj: any = {};
        for (const key in decoders) {
          if (decoders.hasOwnProperty(key)) {
            const r = decoders[key].decode(json[key], appendAt(context, `.${key}`));
            if (r.ok === true) {
              // tslint:disable-next-line:strict-type-predicates
              if (r.result !== undefined) {
                obj[key] = r.result;
              }
            } else if (json[key] === undefined) {
              return decoderError(context, `the key '${key}' is required but was not present`);
            } else {
              return r;
            }
          }
        }
        return Result.ok(obj);
      } else if (isJsonObject(json)) {
        return Result.ok(json);
      } else {
        return decoderError(context, expectedGot('an object', json));
      }
    });
  }

  /**
   * Decoder for json arrays. Runs `decoder` on each array element, and succeeds
   * if all elements are successfully decoded. If no `decoder` argument is
   * provided then the outer array part of the json is validated but not the
   * contents, typing the result as `unknown[]`.
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
   *
   * array().map(a => a.length).run(['a', true, 15, 'z'])
   * // => {ok: true, result: 4}
   * ```
   */
  static array(): Decoder<unknown[]>;
  static array<A>(decoder: Decoder<A>): Decoder<A[]>;
  static array<A>(decoder?: Decoder<A>) {
    return new Decoder((json, context) => {
      if (isJsonArray(json) && decoder) {
        return json.reduce(
          (acc: DecoderResult<A[]>, v: unknown, i: number) =>
            Result.map2(
              (arr, result) => [...arr, result],
              acc,
              decoder.decode(v, appendAt(context, `[${i}]`))
            ),
          Result.ok([])
        );
      } else if (isJsonArray(json)) {
        return Result.ok(json);
      } else {
        return decoderError(context, expectedGot('an array', json));
      }
    });
  }

  /**
   * Decoder for fixed-length arrays, aka Tuples.
   *
   * Supports up to 8-tuples.
   *
   * Example:
   * ```
   * tuple([number(), number(), string()]).run([5, 10, 'px'])
   * // => {ok: true, result: [5, 10, 'px']}
   * ```
   */
  static tuple<A>(decoder: [Decoder<A>]): Decoder<[A]>;
  static tuple<A, B>(decoder: [Decoder<A>, Decoder<B>]): Decoder<[A, B]>;
  static tuple<A, B, C>(decoder: [Decoder<A>, Decoder<B>, Decoder<C>]): Decoder<[A, B, C]>;
  static tuple<A, B, C, D>(decoder: [Decoder<A>, Decoder<B>, Decoder<C>, Decoder<D>]): Decoder<[A, B, C, D]>; // prettier-ignore
  static tuple<A, B, C, D, E>(decoder: [Decoder<A>, Decoder<B>, Decoder<C>, Decoder<D>, Decoder<E>]): Decoder<[A, B, C, D, E]>; // prettier-ignore
  static tuple<A, B, C, D, E, F>(decoder: [Decoder<A>, Decoder<B>, Decoder<C>, Decoder<D>, Decoder<E>, Decoder<F>]): Decoder<[A, B, C, D, E, F]>; // prettier-ignore
  static tuple<A, B, C, D, E, F, G>(decoder: [Decoder<A>, Decoder<B>, Decoder<C>, Decoder<D>, Decoder<E>, Decoder<F>, Decoder<G>]): Decoder<[A, B, C, D, E, F, G]>; // prettier-ignore
  static tuple<A, B, C, D, E, F, G, H>(decoder: [Decoder<A>, Decoder<B>, Decoder<C>, Decoder<D>, Decoder<E>, Decoder<F>, Decoder<G>, Decoder<H>]): Decoder<[A, B, C, D, E, F, G, H]>; // prettier-ignore
  static tuple<A>(decoders: Decoder<A>[]) {
    return new Decoder((json, context) => {
      if (isJsonArray(json)) {
        if (json.length !== decoders.length) {
          return decoderError(
            context,
            `expected a tuple of length ${decoders.length}, got one of length ${json.length}`
          );
        }
        const result = [];
        for (let i: number = 0; i < decoders.length; i++) {
          const r = decoders[i].decode(json[i], appendAt(context, `[${i}]`));
          if (r.ok) {
            result[i] = r.result;
          } else {
            return r;
          }
        }
        return Result.ok(result);
      } else {
        return decoderError(context, expectedGot(`a tuple of length ${decoders.length}`, json));
      }
    });
  }

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
  static dict = <A>(decoder: Decoder<A>): Decoder<Record<string, A>> =>
    new Decoder((json, context) => {
      if (isJsonObject(json)) {
        const obj: Record<string, A> = {};
        for (const key in json) {
          if (json.hasOwnProperty(key)) {
            const r = decoder.decode(json[key], appendAt(context, `.${key}`));
            if (r.ok === true) {
              obj[key] = r.result;
            } else {
              return r;
            }
          }
        }
        return Result.ok(obj);
      } else {
        return decoderError(context, expectedGot('an object', json));
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
    new Decoder(
      (json, context) => (json === undefined ? Result.ok(undefined) : decoder.decode(json, context))
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
    new Decoder((json, context) => {
      const errors: DecoderError[] = [];
      for (let i: number = 0; i < decoders.length; i++) {
        const r = decoders[i].decode(json, context);
        if (r.ok === true) {
          return r;
        } else {
          errors[i] = r.error;
        }
      }
      const errorsList = errors.map(error => `at ${error.at}: ${error.message}`).join('", "');
      return decoderError(
        context,
        `expected a value matching one of the decoders, got the errors ["${errorsList}"]`
      );
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
   * Combines 2-8 object decoders into a decoder for the intersection of all the objects.
   *
   * Example:
   * ```
   * interface Pet {
   *   name: string;
   *   maxLegs: number;
   * }
   *
   * interface Cat extends Pet {
   *   evil: boolean;
   * }
   *
   * const petDecoder: Decoder<Pet> = object({name: string(), maxLegs: number()});
   * const catDecoder: Decoder<Cat> = intersection(petDecoder, object({evil: boolean()}));
   * ```
   */
  static intersection <A, B>(ad: Decoder<A>, bd: Decoder<B>): Decoder<A & B>; // prettier-ignore
  static intersection <A, B, C>(ad: Decoder<A>, bd: Decoder<B>, cd: Decoder<C>): Decoder<A & B & C>; // prettier-ignore
  static intersection <A, B, C, D>(ad: Decoder<A>, bd: Decoder<B>, cd: Decoder<C>, dd: Decoder<D>): Decoder<A & B & C & D>; // prettier-ignore
  static intersection <A, B, C, D, E>(ad: Decoder<A>, bd: Decoder<B>, cd: Decoder<C>, dd: Decoder<D>, ed: Decoder<E>): Decoder<A & B & C & D & E>; // prettier-ignore
  static intersection <A, B, C, D, E, F>(ad: Decoder<A>, bd: Decoder<B>, cd: Decoder<C>, dd: Decoder<D>, ed: Decoder<E>, fd: Decoder<F>): Decoder<A & B & C & D & E & F>; // prettier-ignore
  static intersection <A, B, C, D, E, F, G>(ad: Decoder<A>, bd: Decoder<B>, cd: Decoder<C>, dd: Decoder<D>, ed: Decoder<E>, fd: Decoder<F>, gd: Decoder<G>): Decoder<A & B & C & D & E & F & G>; // prettier-ignore
  static intersection <A, B, C, D, E, F, G, H>(ad: Decoder<A>, bd: Decoder<B>, cd: Decoder<C>, dd: Decoder<D>, ed: Decoder<E>, fd: Decoder<F>, gd: Decoder<G>, hd: Decoder<H>): Decoder<A & B & C & D & E & F & G & H>; // prettier-ignore
  static intersection(ad: Decoder<any>, bd: Decoder<any>, ...ds: Decoder<any>[]): Decoder<any> {
    return new Decoder((json, context) =>
      [ad, bd, ...ds].reduce(
        (acc: DecoderResult<any>, decoder) =>
          Result.map2(Object.assign, acc, decoder.decode(json, context)),
        Result.ok({})
      )
    );
  }

  /**
   * Decoder that always succeeds with either the decoded value, or a fallback
   * default value.
   */
  static withDefault = <A>(defaultValue: A, decoder: Decoder<A>): Decoder<A> =>
    new Decoder((json, context) =>
      Result.ok(Result.withDefault(defaultValue, decoder.decode(json, context)))
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
    new Decoder((json, context) => {
      let jsonAtPath: any = json;
      for (let i: number = 0; i < paths.length; i++) {
        const pathContext = appendAt(context, printPath(paths.slice(0, i + 1)));
        if (jsonAtPath === undefined) {
          return decoderError(pathContext, 'path does not exist');
        } else if (typeof paths[i] === 'string' && !isJsonObject(jsonAtPath)) {
          return decoderError(pathContext, expectedGot('an object', jsonAtPath));
        } else if (typeof paths[i] === 'number' && !isJsonArray(jsonAtPath)) {
          return decoderError(pathContext, expectedGot('an array', jsonAtPath));
        } else {
          jsonAtPath = jsonAtPath[paths[i]];
        }
      }
      const decoderContext = appendAt(context, printPath(paths));
      const r = decoder.decode(jsonAtPath, decoderContext);
      if (Result.isErr(r) && jsonAtPath === undefined) {
        return decoderError(decoderContext, 'path does not exist');
      } else {
        return r;
      }
    });

  /**
   * Decoder that ignores the input json and always succeeds with `fixedValue`.
   */
  static succeed = <A>(fixedValue: A): Decoder<A> => new Decoder((_, __) => Result.ok(fixedValue));

  /**
   * Decoder that ignores the input json and always fails with `errorMessage`.
   */
  static fail = <A>(errorMessage: string): Decoder<A> =>
    new Decoder((_, context) => decoderError(context, errorMessage));

  /**
   * Decoder to prevent error propagation. Always succeeds, but instead of
   * returning the decoded value, return a `Result` object containing either
   * the successfully decoded value, or the decoder failure error.
   *
   * Example:
   * ```
   * array(result(string())).run(['a', 1])
   * // => {
   * //   ok: true,
   * //   result: [
   * //     {ok: true, result: 'a'},
   * //     {ok: false, error: {..., message: 'expected a string, got a number'}}
   * //   ]
   * // }
   *
   * array(result(number())).map(Result.successes).run([1, true, 2, 3, [], 4])
   * // => {ok: true, result: [1, 2, 3, 4]}
   *
   * array(result(boolean())).run(false)
   * // => {ok: false, error: {..., message: "expected an array, got a boolean"}}
   * ```
   */
  static result = <A>(decoder: Decoder<A>): Decoder<DecoderResult<A>> =>
    new Decoder((json, _) => Result.ok(decoder.run(json)));

  /**
   * Decoder that allows for validating recursive data structures. Unlike with
   * functions, decoders assigned to variables can't reference themselves
   * before they are fully defined. We can avoid prematurely referencing the
   * decoder by wrapping it in a function that won't be called until use, at
   * which point the decoder has been defined.
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
    new Decoder((json, context) => mkDecoder().decode(json, context));

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
  run = (json: unknown): DecoderResult<A> => this.decode(json, {input: json, at: 'input'});

  /**
   * Run the decoder as a `Promise`.
   */
  runPromise = (json: unknown): Promise<A> => Result.asPromise(this.run(json));

  /**
   * Run the decoder and return the value on success, or throw an exception
   * with a formatted error string.
   */
  runWithException = (json: unknown): A => Result.withException(this.run(json));

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
    new Decoder((json, context) => Result.map(f, this.decode(json, context)));

  /**
   * Chain together a sequence of decoders. The first decoder will run, and
   * then the function will determine what decoder to run second. If the result
   * of the first decoder succeeds then `f` will be applied to the decoded
   * value. If it fails the error will propagate through.
   *
   * This is a very powerful method -- it can act as both the `map` and `where`
   * methods, can improve error messages for edge cases, and can be used to
   * make a decoder for custom types.
   *
   * Example of adding an error message:
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
   * //   error: {... message: 'Unable to decode info, version 5 is not supported.'}
   * // }
   * ```
   *
   * Example of decoding a custom type:
   * ```
   * // nominal type for arrays with a length of at least one
   * type NonEmptyArray<T> = T[] & { __nonEmptyArrayBrand__: void };
   *
   * const nonEmptyArrayDecoder = <T>(values: Decoder<T>): Decoder<NonEmptyArray<T>> =>
   *   array(values).andThen(arr =>
   *     arr.length > 0
   *       ? succeed(createNonEmptyArray(arr))
   *       : fail(`expected a non-empty array, got an empty array`)
   *   );
   * ```
   */
  andThen = <B>(f: (value: A) => Decoder<B>): Decoder<B> =>
    new Decoder((json, context) =>
      Result.andThen(value => f(value).decode(json, context), this.decode(json, context))
    );

  /**
   * Add constraints to a decoder _without_ changing the resulting type. The
   * `test` argument is a predicate function which returns true for valid
   * inputs. When `test` fails on an input, the decoder fails with the given
   * `errorMessage`.
   *
   * ```
   * const chars = (length: number): Decoder<string> =>
   *   string().where(
   *     (s: string) => s.length === length,
   *     `expected a string of length ${length}`
   *   );
   *
   * chars(5).run('12345')
   * // => {ok: true, result: '12345'}
   *
   * chars(2).run('HELLO')
   * // => {ok: false, error: {... message: 'expected a string of length 2'}}
   *
   * chars(12).run(true)
   * // => {ok: false, error: {... message: 'expected a string, got a boolean'}}
   * ```
   */
  where = (test: (value: A) => boolean, errorMessage: string): Decoder<A> =>
    this.andThen((value: A) => (test(value) ? Decoder.succeed(value) : Decoder.fail(errorMessage)));
}
