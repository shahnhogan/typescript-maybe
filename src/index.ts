import { curry } from "ramda";

export enum MaybeType {
  Just = "just",
  Nothing = "nothing",
}

export interface Just<T> {
  type: typeof MaybeType.Just;
  value: T;
}

export interface Nothing {
  type: typeof MaybeType.Nothing;
}

export type Maybe<T> = Just<T> | Nothing;

export const Nothing = (): Nothing => ({
  type: MaybeType.Nothing,
});

export const Just = <T>(value: T): Just<T> => ({
  type: MaybeType.Just,
  value,
});

function maybeOf<T>(value: T): Maybe<T> {
  return value === undefined || value === null
    ? { type: MaybeType.Nothing }
    : { type: MaybeType.Just, value };
}

function maybeMap<A, B>(f: (val: A) => B, m: Maybe<A>): Maybe<B> {
  switch (m.type) {
    case MaybeType.Nothing:
      return { ...m };
    case MaybeType.Just:
      return { ...m, value: f(m.value) };
  }
}

function maybeAndThen<A, B>(f: (val: A) => Maybe<B>, m: Maybe<A>): Maybe<B> {
  switch (m.type) {
    case MaybeType.Nothing:
      return { ...m };
    case MaybeType.Just:
      return f(m.value);
  }
}

function maybeWithDefault<T>(defaultVal: T, m: Maybe<T>): T {
  switch (m.type) {
    case MaybeType.Nothing:
      return defaultVal;
    case MaybeType.Just:
      return m.value;
  }
}

function maybeAp<A, B>(f: Maybe<(val: A) => B>, m: Maybe<A>): Maybe<B> {
  return f.type == MaybeType.Nothing || m.type == MaybeType.Nothing
    ? { type: MaybeType.Nothing }
    : { type: MaybeType.Just, value: f.value(m.value) };
}

function maybeIsJust<T>(m: Maybe<T>): boolean {
  return m.type == MaybeType.Just;
}

function maybeIsNothing<T>(m: Maybe<T>): boolean {
  return m.type == MaybeType.Nothing;
}

export const Maybe = {
  andThen: curry(maybeAndThen),
  ap: curry(maybeAp),
  isJust: maybeIsJust,
  isNothing: maybeIsNothing,
  map: curry(maybeMap),
  of: maybeOf,
  withDefault: curry(maybeWithDefault),
};
