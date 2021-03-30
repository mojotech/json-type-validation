import {Decoder, string, number, boolean, constant, array, dict, union, lazy} from '../src/index';

describe('create tagged json objects', () => {
  type TaggedJson =
    | {tag: 'null'; value: null}
    | {tag: 'string'; value: string}
    | {tag: 'number'; value: number}
    | {tag: 'boolean'; value: boolean}
    | {tag: 'array'; value: Array<TaggedJson>}
    | {tag: 'object'; value: {[name: string]: TaggedJson}};

  const json: any = [{x: 1, y: 5}, {a: true, b: 'false'}, 1, true];

  const taggedJsonDecoder: Decoder<TaggedJson> = union(
    constant(null).map<TaggedJson>(value => ({tag: 'null', value: value})),
    string().map<TaggedJson>(value => ({tag: 'string', value: value})),
    number().map<TaggedJson>(value => ({tag: 'number', value: value})),
    boolean().map<TaggedJson>(value => ({tag: 'boolean', value: value})),
    lazy(() => array(taggedJsonDecoder).map<TaggedJson>(value => ({tag: 'array', value: value}))),
    lazy(() => dict(taggedJsonDecoder).map<TaggedJson>(value => ({tag: 'object', value: value})))
  );

  it('maps json to tagged json', () => {
    expect(taggedJsonDecoder.run(json)).toEqual({
      ok: true,
      result: {
        tag: 'array',
        value: [
          {
            tag: 'object',
            value: {
              x: {tag: 'number', value: 1},
              y: {tag: 'number', value: 5}
            }
          },
          {
            tag: 'object',
            value: {
              a: {
                tag: 'boolean',
                value: true
              },
              b: {
                tag: 'string',
                value: 'false'
              }
            }
          },
          {
            tag: 'number',
            value: 1
          },
          {
            tag: 'boolean',
            value: true
          }
        ]
      }
    });
  });
});
