import {Decoder, DecoderObject} from './decoder';

/** See `Decoder.string` */
export function string(): Decoder<string> {
  return Decoder.string();
}

/** See `Decoder.number` */
export function number(): Decoder<number> {
  return Decoder.number();
}

/** See `Decoder.boolean` */
export function boolean(): Decoder<boolean> {
  return Decoder.boolean();
}

/** See `Decoder.anyJson` */
export const anyJson: () => Decoder<any> = Decoder.anyJson;

/** See `Decoder.constant` */
export function constant(value: true): Decoder<true>;
export function constant(value: false): Decoder<false>;
export function constant<A>(value: A): Decoder<A>;
export function constant(value: any): Decoder<any> {
  return Decoder.constant(value);
}

/** See `Decoder.object` */
export function object<A>(decoders: DecoderObject<A>): Decoder<A> {
  return Decoder.object(decoders);
}

/** See `Decoder.array` */
export const array: <A>(decoder: Decoder<A>) => Decoder<A[]> = Decoder.array;

/** See `Decoder.dict` */
export const dict: <A>(decoder: Decoder<A>) => Decoder<{[name: string]: A}> = Decoder.dict;

/** See `Decoder.optional` */
export const optional: <A>(decoder: Decoder<A>) => Decoder<A | undefined> = Decoder.optional;

/** See `Decoder.oneOf` */
export const oneOf: <A>(...decoders: Decoder<A>[]) => Decoder<A> = Decoder.oneOf;

/** See `Decoder.union` */
export function union <A, B>(ad: Decoder<A>, bd: Decoder<B>): Decoder<A | B>; // prettier-ignore
export function union <A, B, C>(ad: Decoder<A>, bd: Decoder<B>, cd: Decoder<C>): Decoder<A | B | C>; // prettier-ignore
export function union <A, B, C, D>(ad: Decoder<A>, bd: Decoder<B>, cd: Decoder<C>, dd: Decoder<D>): Decoder<A | B | C | D>; // prettier-ignore
export function union <A, B, C, D, E>(ad: Decoder<A>, bd: Decoder<B>, cd: Decoder<C>, dd: Decoder<D>, ed: Decoder<E>): Decoder<A | B | C | D | E>; // prettier-ignore
export function union <A, B, C, D, E, F>(ad: Decoder<A>, bd: Decoder<B>, cd: Decoder<C>, dd: Decoder<D>, ed: Decoder<E>, fd: Decoder<F>): Decoder<A | B | C | D | E | F>; // prettier-ignore
export function union <A, B, C, D, E, F, G>(ad: Decoder<A>, bd: Decoder<B>, cd: Decoder<C>, dd: Decoder<D>, ed: Decoder<E>, fd: Decoder<F>, gd: Decoder<G>): Decoder<A | B | C | D | E | F | G>; // prettier-ignore
export function union <A, B, C, D, E, F, G, H>(ad: Decoder<A>, bd: Decoder<B>, cd: Decoder<C>, dd: Decoder<D>, ed: Decoder<E>, fd: Decoder<F>, gd: Decoder<G>, hd: Decoder<H>): Decoder<A | B | C | D | E | F | G | H>; // prettier-ignore
export function union(ad: Decoder<any>, bd: Decoder<any>, ...ds: Decoder<any>[]): Decoder<any> {
  return Decoder.oneOf(ad, bd, ...ds);
}

export const intersection = Decoder.intersection;

/** See `Decoder.withDefault` */
export const withDefault: <A>(defaultValue: A, decoder: Decoder<A>) => Decoder<A> =
  Decoder.withDefault;

/** See `Decoder.valueAt` */
export const valueAt: <A>(paths: (string | number)[], decoder: Decoder<A>) => Decoder<A> =
  Decoder.valueAt;

/** See `Decoder.succeed` */
export const succeed: <A>(fixedValue: A) => Decoder<A> = Decoder.succeed;

/** See `Decoder.fail` */
export const fail: <A>(errorMessage: string) => Decoder<A> = Decoder.fail;

/** See `Decoder.lazy` */
export const lazy: <A>(mkDecoder: () => Decoder<A>) => Decoder<A> = Decoder.lazy;
