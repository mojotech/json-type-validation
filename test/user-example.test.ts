import {Decoder, string, number, boolean, object} from '../src/index';

describe('decode json as User interface', () => {
  interface User {
    firstname: string;
    lastname: string;
    age: number;
    active: boolean;
  }

  const userJson: any = {
    firstname: 'John',
    lastname: 'Doe',
    age: 99,
    active: false
  };

  const invalidUserJson: any = {
    firstname: 'John',
    lastName: 'Doe', // invalid camelCase
    age: 99,
    active: false
  };

  const userDecoder: Decoder<User> = object({
    firstname: string(),
    lastname: string(),
    age: number(),
    active: boolean()
  });

  it('successfuly passes through the valid user object', () => {
    expect(userDecoder.run(userJson)).toEqual({
      ok: true,
      result: userJson
    });
  });

  it('fails when a required key is missing', () => {
    const error = userDecoder.run(invalidUserJson);
    expect(error).toMatchObject({
      ok: false,
      error: {at: 'input', message: "the key 'lastname' is required but was not present"}
    });
  });
});
