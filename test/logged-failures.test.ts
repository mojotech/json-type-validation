import {Decoder, DecoderError, Result, number, array, result} from '../src/index';

type Logger<E> = (err: E) => void;

const logError = <T>(logger: Logger<DecoderError>, decoder: Decoder<T>): Decoder<T> =>
  decoder.mapError(e => {
    logger(e);
    return e;
  });

const loggedArrayDecoder = <T>(decoder: Decoder<T>, logger: Logger<DecoderError>): Decoder<T[]> => {
  const logged = <U>(d: Decoder<U>) => logError(logger, d);
  return logged(array(result(logged(decoder)))).map(Result.successes);
};

const makeLogger = () => {
  const log: string[] = [];
  const logger = ({message}: DecoderError) => log.push(message);
  return {log, logger};
};

describe('decode valid array members and log invalid members', () => {
  it('succeeds on valid input', () => {
    const {log, logger} = makeLogger();
    const r = loggedArrayDecoder(number(), logger).run([1, 2, 3, 4]);
    expect(r).toEqual({ok: true, result: [1, 2, 3, 4]});
    expect(log).toEqual([]);
  });

  it('succeeds on valid array members while logging and filtering invalid ones', () => {
    const {log, logger} = makeLogger();
    const r = loggedArrayDecoder(number(), logger).run([true, [], 999]);
    expect(r).toEqual({ok: true, result: [999]});
    expect(log).toEqual(['expected a number, got a boolean', 'expected a number, got an array']);
  });

  it('failes on non-array json and logs the failure', () => {
    const {log, logger} = makeLogger();
    const r = loggedArrayDecoder(number(), logger).run(5);
    expect(r).toMatchObject({
      ok: false,
      error: {at: 'input', message: 'expected an array, got a number'}
    });
    expect(log).toEqual(['expected an array, got a number']);
  });
});
