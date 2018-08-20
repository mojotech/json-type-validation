import {
  Decoder,
  Result,
  isDecoderError,
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
  withDefault,
  valueAt,
  succeed,
  fail,
  lazy
} from '../src/index';

describe('string', () => {
  const decoder = string();

  it('succeeds when given a string', () => {
    expect(decoder.run('hey')).toEqual({ok: true, result: 'hey'});
  });

  it('fails when given a number', () => {
    expect(decoder.run(1)).toMatchObject({
      ok: false,
      error: {at: 'input', message: 'expected a string, got a number'}
    });
  });

  it('fails when given null', () => {
    expect(decoder.run(null)).toMatchObject({
      ok: false,
      error: {at: 'input', message: 'expected a string, got null'}
    });
  });

  it('fails when given a boolean', () => {
    expect(decoder.run(true)).toMatchObject({
      ok: false,
      error: {at: 'input', message: 'expected a string, got a boolean'}
    });
  });
});

describe('number', () => {
  const decoder = number();

  it('succeeds when given a number', () => {
    expect(decoder.run(5)).toEqual({ok: true, result: 5});
  });

  it('fails when given a string', () => {
    expect(decoder.run('hey')).toMatchObject({
      ok: false,
      error: {at: 'input', message: 'expected a number, got a string'}
    });
  });

  it('fails when given boolean', () => {
    expect(decoder.run(true)).toMatchObject({
      ok: false,
      error: {at: 'input', message: 'expected a number, got a boolean'}
    });
  });
});

describe('boolean', () => {
  const decoder = boolean();

  it('succeeds when given a boolean', () => {
    expect(decoder.run(true)).toEqual({ok: true, result: true});
  });

  it('fails when given a string', () => {
    expect(decoder.run('hey')).toMatchObject({
      ok: false,
      error: {at: 'input', message: 'expected a boolean, got a string'}
    });
  });

  it('fails when given a number', () => {
    expect(decoder.run(1)).toMatchObject({
      ok: false,
      error: {at: 'input', message: 'expected a boolean, got a number'}
    });
  });
});

describe('anyJson', () => {
  it('can be used in other decoders', () => {
    const json: any = [1, true, 2, 3, 'five', 4, []];
    const jsonArray: any[] = Result.withDefault([], array(anyJson()).run(json));
    const successes: Result.Ok<number>[] = jsonArray.map(number().run).filter(Result.isOk);
    const numbers: number[] = successes.map(ok => ok.result);

    expect(numbers).toEqual([1, 2, 3, 4]);
  });
});

describe('constant', () => {
  it('works for string-literals', () => {
    const decoder = constant<'zero'>('zero');

    expect(decoder.run('zero')).toEqual({ok: true, result: 'zero'});
  });

  it('fails when given two different values', () => {
    const decoder = constant<42>(42);

    expect(decoder.run(true)).toMatchObject({
      ok: false,
      error: {at: 'input', message: 'expected 42, got true'}
    });
  });

  it('can decode the true-literal type', () => {
    interface TrueValue {
      x: true;
    }
    const decoder: Decoder<TrueValue> = object<TrueValue>({x: constant(true)});

    expect(decoder.run({x: true})).toEqual({ok: true, result: {x: true}});
  });

  it('can decode the false-literal type', () => {
    interface FalseValue {
      x: false;
    }
    const decoder = object<FalseValue>({x: constant(false)});

    expect(decoder.run({x: false})).toEqual({ok: true, result: {x: false}});
  });

  it('can decode the null-literal type', () => {
    interface NullValue {
      x: null;
    }
    const decoder = object<NullValue>({x: constant(null)});

    expect(decoder.run({x: null})).toEqual({ok: true, result: {x: null}});
  });

  it('can decode undefined', () => {
    interface UndefinedValue {
      a: string;
      b: undefined;
    }
    const decoder = object<UndefinedValue>({a: string(), b: constant(undefined)});

    const run1 = decoder.run({a: 'qwerty', b: undefined});
    expect(run1).toEqual({ok: true, result: {a: 'qwerty', b: undefined}});
    expect(Result.map(Object.keys, run1)).toEqual({ok: true, result: ['a', 'b']});

    const run2 = decoder.run({a: 'asdfgh'});
    expect(run2).toEqual({ok: true, result: {a: 'asdfgh', b: undefined}});
    expect(Result.map(Object.keys, run2)).toEqual({ok: true, result: ['a', 'b']});
  });

  it('can decode a constant array', () => {
    type A = [1, 2, 3];
    const decoder: Decoder<A> = constant<A>([1, 2, 3]);

    expect(decoder.run([1, 2, 3])).toEqual({ok: true, result: [1, 2, 3]});
    expect(decoder.run([1, 2, 3, 4])).toMatchObject({
      ok: false,
      error: {at: 'input', message: 'expected [1,2,3], got [1,2,3,4]'}
    });
  });

  it('can decode a constant object', () => {
    type O = {a: true; b: 12};
    const decoder: Decoder<O> = constant<O>({a: true, b: 12});

    expect(decoder.run({a: true, b: 12})).toEqual({ok: true, result: {a: true, b: 12}});
    expect(decoder.run({a: true, b: 7})).toMatchObject({
      ok: false,
      error: {at: 'input', message: 'expected {"a":true,"b":12}, got {"a":true,"b":7}'}
    });
  });
});

describe('object', () => {
  describe('when given valid JSON', () => {
    it('can decode a simple object', () => {
      const decoder = object({x: number()});

      expect(decoder.run({x: 5})).toMatchObject({ok: true, result: {x: 5}});
    });

    it('can decode a nested object', () => {
      interface Point {
        x: number;
        y: number;
      }

      interface Location {
        payload: Point;
        error: false;
      }

      const decoder = object<Location>({
        payload: object<Point>({x: number(), y: number()}),
        error: constant(false)
      });
      const json = {payload: {x: 5, y: 2}, error: false};

      expect(decoder.run(json)).toEqual({ok: true, result: json});
    });
  });

  describe('when given incorrect JSON', () => {
    it('fails when not given an object', () => {
      const decoder = object({x: number()});

      expect(decoder.run('true')).toMatchObject({
        ok: false,
        error: {at: 'input', message: 'expected an object, got a string'}
      });
    });

    it('fails when given an array', () => {
      const decoder = object({x: number()});

      expect(decoder.run([])).toMatchObject({
        ok: false,
        error: {at: 'input', message: 'expected an object, got an array'}
      });
    });

    it('reports a missing key', () => {
      const decoder = object({x: number()});

      expect(decoder.run({})).toMatchObject({
        ok: false,
        error: {at: 'input', message: "the key 'x' is required but was not present"}
      });
    });

    it('reports invalid values', () => {
      const decoder = object({name: string()});

      expect(decoder.run({name: 5})).toMatchObject({
        ok: false,
        error: {at: 'input.name', message: 'expected a string, got a number'}
      });
    });

    it('properly displays nested errors', () => {
      const decoder = object({
        hello: object({
          hey: object({
            'Howdy!': string()
          })
        })
      });

      const error = decoder.run({hello: {hey: {'Howdy!': {}}}});
      expect(error).toMatchObject({
        ok: false,
        error: {at: 'input.hello.hey.Howdy!', message: 'expected a string, got an object'}
      });
    });
  });

  describe('optional and undefined fields', () => {
    it('ignores optional fields that decode to undefined', () => {
      interface AB {
        a: number;
        b?: string;
      }

      const decoder: Decoder<AB> = object<AB>({
        a: number(),
        b: optional(string())
      });

      expect(decoder.run({a: 12, b: 'hats'})).toEqual({ok: true, result: {a: 12, b: 'hats'}});
      expect(decoder.run({a: 12})).toEqual({ok: true, result: {a: 12}});
    });

    it('includes fields that are mapped to a value when not found', () => {
      interface AB {
        a: number;
        b: string;
      }

      const decoder: Decoder<AB> = object<AB>({
        a: number(),
        b: oneOf(string(), constant(undefined)).map(
          (b: string | undefined) => (b === undefined ? 'b not found' : b)
        )
      });

      expect(decoder.run({a: 12, b: 'hats'})).toEqual({ok: true, result: {a: 12, b: 'hats'}});
      expect(decoder.run({a: 12})).toEqual({ok: true, result: {a: 12, b: 'b not found'}});
    });

    it('includes fields that are mapped to a undefined when not found', () => {
      interface AB {
        a: number;
        b: string | undefined;
      }

      const decoder: Decoder<AB> = object<AB>({
        a: number(),
        b: oneOf(string(), constant(undefined))
      });

      expect(decoder.run({a: 12, b: 'hats'})).toEqual({ok: true, result: {a: 12, b: 'hats'}});
      expect(decoder.run({a: 12})).toEqual({ok: true, result: {a: 12, b: undefined}});
    });
  });
});

describe('array', () => {
  const decoder = array(number());

  it('works when given an array', () => {
    expect(decoder.run([1, 2, 3])).toEqual({ok: true, result: [1, 2, 3]});
  });

  it('fails when given something other than a array', () => {
    expect(decoder.run('oops')).toMatchObject({
      ok: false,
      error: {at: 'input', message: 'expected an array, got a string'}
    });
  });

  describe('when given something other than an array', () => {
    it('fails when the elements are of the wrong type', () => {
      expect(decoder.run(['dang'])).toMatchObject({
        ok: false,
        error: {at: 'input[0]', message: 'expected a number, got a string'}
      });
    });

    it('properly displays nested errors', () => {
      const nestedDecoder = array(array(array(number())));

      expect(nestedDecoder.run([[], [], [[1, 2, 3, false]]])).toMatchObject({
        ok: false,
        error: {at: 'input[2][0][3]', message: 'expected a number, got a boolean'}
      });
    });
  });
});

describe('dict', () => {
  describe('with a simple value decoder', () => {
    const decoder = dict(number());

    it('can decode an empty object', () => {
      expect(decoder.run({})).toEqual({ok: true, result: {}});
    });

    it('can decode an object of with arbitrary keys', () => {
      expect(decoder.run({a: 1, b: 2})).toEqual({ok: true, result: {a: 1, b: 2}});
    });

    it('fails if a value cannot be decoded', () => {
      expect(decoder.run({oh: 'no'})).toMatchObject({
        ok: false,
        error: {at: 'input.oh', message: 'expected a number, got a string'}
      });
    });

    it('fails if given an array', () => {
      expect(decoder.run([])).toMatchObject({
        ok: false,
        error: {at: 'input', message: 'expected an object, got an array'}
      });
    });

    it('fails if given a primitive', () => {
      expect(decoder.run(5)).toMatchObject({
        ok: false,
        error: {at: 'input', message: 'expected an object, got a number'}
      });
    });
  });

  describe('given a transformative value decoder', () => {
    const decoder = dict(string().map(str => str + '!'));

    it('transforms the values', () => {
      expect(decoder.run({hey: 'there', yo: 'dude'})).toEqual({
        ok: true,
        result: {hey: 'there!', yo: 'dude!'}
      });
    });
  });
});

describe('optional', () => {
  interface User {
    id: number;
    isDog?: boolean;
  }

  describe('decoding an interface with optional fields', () => {
    const decoder = object<User>({
      id: number(),
      isDog: optional(boolean())
    });

    it('can decode the object when the optional field is present', () => {
      expect(decoder.run({id: 1, isDog: true})).toEqual({ok: true, result: {id: 1, isDog: true}});
    });

    it('can decode the object when the optional field is missing', () => {
      expect(decoder.run({id: 2})).toEqual({ok: true, result: {id: 2}});
    });

    it('fails when the optional field is invalid', () => {
      const error = decoder.run({id: 3, isDog: 'supdog'});
      expect(error).toMatchObject({
        ok: false,
        error: {at: 'input.isDog', message: 'expected a boolean, got a string'}
      });
    });
  });

  it('supports map', () => {
    const decoder = object<User>({
      id: number(),
      isDog: optional(number()).map(num => num !== 0)
    });

    expect(decoder.run({id: 1, isDog: 0})).toEqual({ok: true, result: {id: 1, isDog: false}});
    expect(decoder.run({id: 1, isDog: 77})).toEqual({ok: true, result: {id: 1, isDog: true}});
    expect(decoder.run({id: 1})).toEqual({ok: true, result: {id: 1}});
  });

  it('supports andThen', () => {
    const decoder = object<User>({
      id: number(),
      isDog: optional(string()).andThen(
        dogName =>
          dogName.toLowerCase()[0] === 'd'
            ? succeed(true)
            : fail(`${dogName} is not a dog, all dog names start with 'D'`)
      )
    });

    expect(decoder.run({id: 1, isDog: 'Doug'})).toEqual({ok: true, result: {id: 1, isDog: true}});
    expect(decoder.run({id: 1, isDog: 'Wanda'})).toMatchObject({
      ok: false,
      error: {message: "Wanda is not a dog, all dog names start with 'D'"}
    });
    expect(decoder.run({id: 1})).toEqual({ok: true, result: {id: 1}});
  });
});

describe('oneOf', () => {
  describe('when given valid input', () => {
    it('can decode a value with a single alternative', () => {
      const decoder = oneOf(string());

      expect(decoder.run('yo')).toEqual({ok: true, result: 'yo'});
    });

    it('can decode a value with multiple alternatives', () => {
      const decoder = array(oneOf(string().map(s => s.length), number()));

      expect(decoder.run(['hey', 10])).toEqual({ok: true, result: [3, 10]});
    });
  });

  it('fails when a value does not match any decoder', () => {
    const decoder = oneOf(string(), number().map(String));

    expect(decoder.run([])).toMatchObject({
      ok: false,
      error: {
        at: 'input',
        message:
          'expected a value matching one of the decoders, got the errors ' +
          '["at error: expected a string, got an array", "at error: expected a number, got an array"]'
      }
    });
  });

  it('fails and reports errors for nested values', () => {
    const decoder = array(
      oneOf(valueAt([1, 'a', 'b'], number()), valueAt([1, 'a', 'x'], number()))
    );

    expect(decoder.run([[{}, {a: {b: true}}]])).toMatchObject({
      ok: false,
      error: {
        at: 'input[0]',
        message:
          'expected a value matching one of the decoders, got the errors ' +
          '["at error[1].a.b: expected a number, got a boolean", ' +
          '"at error[1].a.x: path does not exist"]'
      }
    });
  });

  it('can act as the union function when given the correct annotation', () => {
    type C = {a: string} | {b: number};

    const decoder: Decoder<C> = oneOf(object<C>({a: string()}), object<C>({b: number()}));

    expect(decoder.run({a: 'xyz'})).toEqual({ok: true, result: {a: 'xyz'}});
  });
});

describe('union', () => {
  interface A {
    kind: 'a';
    value: number;
  }
  interface B {
    kind: 'b';
    value: boolean;
  }
  type C = A | B;

  const decoder: Decoder<C> = union(
    object<A>({kind: constant<'a'>('a'), value: number()}),
    object<B>({kind: constant<'b'>('b'), value: boolean()})
  );

  it('can decode a value that matches one of the union types', () => {
    const json = {kind: 'a', value: 12};
    expect(decoder.run(json)).toEqual({ok: true, result: json});
  });

  it('fails when a value does not match any decoders', () => {
    const error = decoder.run({kind: 'b', value: 12});
    expect(error).toMatchObject({
      ok: false,
      error: {
        at: 'input',
        message:
          'expected a value matching one of the decoders, got the errors ' +
          '["at error.kind: expected "a", got "b"", "at error.value: expected a boolean, got a number"]'
      }
    });
  });
});

describe('withDefault', () => {
  const decoder = withDefault('puppies', string());

  it('uses the json value when decoding is successful', () => {
    expect(decoder.run('pancakes')).toEqual({ok: true, result: 'pancakes'});
  });

  it('uses the default when the decoder fails', () => {
    expect(decoder.run(5)).toEqual({ok: true, result: 'puppies'});
  });
});

describe('valueAt', () => {
  describe('decode a value accessed from a path', () => {
    it('can decode a single object field', () => {
      const decoder = valueAt(['a'], string());
      expect(decoder.run({a: 'boots', b: 'cats'})).toEqual({ok: true, result: 'boots'});
    });

    it('can decode a single array value', () => {
      const decoder = valueAt([1], string());
      expect(decoder.run(['boots', 'cats'])).toEqual({ok: true, result: 'cats'});
    });
  });

  describe('decode a nested path', () => {
    const decoder = valueAt(['a', 1, 'b'], string());

    it('can decode a field in a nested structure', () => {
      expect(decoder.run({a: [{}, {b: 'surprise!'}]})).toEqual({ok: true, result: 'surprise!'});
    });

    it('fails when an array path does not exist', () => {
      expect(decoder.run({a: []})).toMatchObject({
        ok: false,
        error: {at: 'input.a[1].b', message: 'path does not exist'}
      });
    });

    it('fails when an object path does not exist', () => {
      expect(decoder.run({x: 12})).toMatchObject({
        ok: false,
        error: {at: 'input.a[1]', message: 'path does not exist'}
      });
    });

    it('fails when the decoder fails at the end of the path', () => {
      expect(decoder.run({a: ['a', {b: 12}]})).toMatchObject({
        ok: false,
        error: {at: 'input.a[1].b', message: 'expected a string, got a number'}
      });
    });
  });

  describe('decode an optional field', () => {
    const decoder: Decoder<string | undefined> = valueAt(
      ['a', 'b', 'c'],
      union(string(), constant(undefined))
    );

    it('fails when the path does not exist', () => {
      const error = decoder.run({a: {x: 'cats'}});
      expect(error).toMatchObject({
        ok: false,
        error: {at: 'input.a.b.c', message: 'path does not exist'}
      });
    });

    it('succeeds when the final field is not found', () => {
      expect(decoder.run({a: {b: {z: 1}}})).toEqual({ok: true, result: undefined});
    });
  });

  describe('non-object json', () => {
    it('only accepts json objects and arrays', () => {
      const decoder = valueAt(['a'], string());

      expect(decoder.run('abc')).toMatchObject({
        ok: false,
        error: {at: 'input.a', message: 'expected an object, got a string'}
      });
      expect(decoder.run(true)).toMatchObject({
        ok: false,
        error: {at: 'input.a', message: 'expected an object, got a boolean'}
      });
    });

    it('fails when a feild in the path does not correspond to a json object', () => {
      const decoder = valueAt(['a', 'b', 'c'], string());

      const error = decoder.run({a: {b: 1}});
      expect(error).toMatchObject({
        ok: false,
        error: {at: 'input.a.b.c', message: 'expected an object, got a number'}
      });
    });

    it('fails when an index in the path does not correspond to a json array', () => {
      const decoder = valueAt([0, 0, 1], string());

      const error = decoder.run([[false]]);
      expect(error).toMatchObject({
        ok: false,
        error: {at: 'input[0][0][1]', message: 'expected an array, got a boolean'}
      });
    });
  });

  it('decodes the input when given an empty path', () => {
    const decoder = valueAt([], number());

    expect(decoder.run(12)).toEqual({ok: true, result: 12});
  });
});

describe('succeed', () => {
  const decoder = succeed(12345);

  it('always decodes the input as the same value', () => {
    expect(decoder.run('pancakes')).toEqual({ok: true, result: 12345});
    expect(decoder.run(5)).toEqual({ok: true, result: 12345});
  });
});

describe('fail', () => {
  const wisdom = 'People don’t think it be like it is, but it do.';
  const decoder = fail(wisdom);

  it('always fails and returns the same error message', () => {
    expect(decoder.run('pancakes')).toMatchObject({
      ok: false,
      error: {at: 'input', message: wisdom}
    });
    expect(decoder.run(5)).toMatchObject({ok: false, error: {at: 'input', message: wisdom}});
  });
});

describe('lazy', () => {
  describe('decoding a primitive data type', () => {
    const decoder = lazy(() => string());

    it('can decode type as normal', () => {
      expect(decoder.run('hello')).toEqual({ok: true, result: 'hello'});
    });

    it('does not alter the error message', () => {
      expect(decoder.run(5)).toMatchObject({
        ok: false,
        error: {at: 'input', message: 'expected a string, got a number'}
      });
    });
  });

  describe('decoding a recursive data structure', () => {
    interface Comment {
      msg: string;
      replies: Comment[];
    }

    const decoder: Decoder<Comment> = object<Comment>({
      msg: string(),
      replies: lazy(() => array(decoder))
    });

    it('can decode the data structure', () => {
      const tree = {msg: 'hey', replies: [{msg: 'hi', replies: []}]};

      expect(decoder.run(tree)).toEqual({
        ok: true,
        result: {msg: 'hey', replies: [{msg: 'hi', replies: []}]}
      });
    });

    it('fails when a nested value is invalid', () => {
      const badTree = {msg: 'hey', replies: [{msg: 'hi', replies: ['hello']}]};

      expect(decoder.run(badTree)).toMatchObject({
        ok: false,
        error: {at: 'input.replies[0].replies[0]', message: 'expected an object, got a string'}
      });
    });
  });
});

describe('runPromise', () => {
  const promise = (json: any): Promise<boolean> => boolean().runPromise(json);

  it('resolves the promise when the decoder succeeds', () => {
    return expect(promise(true)).resolves.toBe(true);
  });

  it('rejects the promise when the decoder fails', () => {
    return expect(promise(42)).rejects.toEqual({
      kind: 'DecoderError',
      input: 42,
      at: 'input',
      message: 'expected a boolean, got a number'
    });
  });

  it('returns a DecoderError when the decoder fails', () => {
    return expect(promise(42).catch(e => isDecoderError(e))).resolves.toBeTruthy();
  });
});

describe('runWithException', () => {
  const decoder = boolean();

  it('can run a decoder and return the successful value', () => {
    expect(decoder.runWithException(false)).toBe(false);
  });

  it('throws an exception when the decoder fails', () => {
    expect(() => decoder.runWithException(42)).toThrowError(
      'Input: 42\nFailed at input: expected a boolean, got a number'
    );
  });
});

describe('map', () => {
  it('can apply the identity function to the decoder', () => {
    const decoder = string().map(x => x);

    expect(decoder.run('hey there')).toEqual({ok: true, result: 'hey there'});
  });

  it('can apply an endomorphic function to the decoder', () => {
    const decoder = number().map(x => x * 5);

    expect(decoder.run(10)).toEqual({ok: true, result: 50});
  });

  it('can apply a function that transforms the type', () => {
    const decoder = string().map(x => x.length);

    expect(decoder.run('hey')).toEqual({ok: true, result: 3});
  });
});

describe('andThen', () => {
  describe('creates decoders based on previous results', () => {
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

    it('can decode using both the first and second decoder', () => {
      expect(decoder.run({version: 5, x: 'bootsncats'})).toMatchObject({
        ok: false,
        error: {at: 'input', message: 'Unable to decode info, version 5 is not supported.'}
      });

      expect(decoder.run({version: 3, a: true})).toEqual({ok: true, result: {a: true}});
    });

    it('fails when the first decoder fails', () => {
      expect(decoder.run({version: null, a: true})).toMatchObject({
        ok: false,
        error: {at: 'input.version', message: 'expected a number, got null'}
      });
    });

    it('fails when the second decoder fails', () => {
      const json = {version: 3, a: 1};
      expect(decoder.run(json)).toMatchObject({
        ok: false,
        error: {at: 'input.a', message: 'expected a boolean, got a number'}
      });
    });
  });
});

describe('Result', () => {
  describe('can run a decoder with default value', () => {
    const decoder = number();

    it('succeeds with the value', () => {
      expect(Result.withDefault(0, decoder.run(12))).toEqual(12);
    });

    it('succeeds with the default value instead of failing', () => {
      expect(Result.withDefault(0, decoder.run('999'))).toEqual(0);
    });
  });

  it('can return successes from an array of decoded values', () => {
    const json: any = [1, true, 2, 3, 'five', 4, []];
    const jsonArray: any[] = Result.withDefault([], array(anyJson()).run(json));
    const numbers: number[] = Result.successes(jsonArray.map(number().run));

    expect(numbers).toEqual([1, 2, 3, 4]);
  });
});
