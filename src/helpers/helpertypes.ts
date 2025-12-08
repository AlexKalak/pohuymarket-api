export type Result<T, E> = OkType<T> | ErrType<E>;

export function Ok<T>(value: T): OkType<T> {
  return {
    ok: true,
    value,
  };
}

export function Err<E>(error: E): ErrType<E> {
  return {
    ok: false,
    error,
  };
}

export interface OkType<T> {
  ok: true;
  value: T;
}

export interface ErrType<E> {
  ok: false;
  error: E;
}
