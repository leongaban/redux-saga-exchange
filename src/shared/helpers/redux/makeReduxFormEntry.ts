import * as R from 'ramda';
import { IReduxFormEntry } from 'shared/types/reduxForm';

interface INamed {
  getName(): string;
}

export type FieldTree<T> = { [P in keyof T]: FieldTreeDescendant<T[P]> };
export type FieldTreeDescendant<T> = T extends null ? INamed : FieldTree<T> & INamed;

export type RawFieldTree<T> = { [P in keyof T]: RawFieldTreeDescendant<T[P]> };
export type RawFieldTreeDescendant<T> = T extends number | string | boolean | any[]
  ? null
  : RawFieldTree<T>;

function buildFieldTree<T>(rawTree: RawFieldTree<T>): FieldTree<RawFieldTree<T>> {
  function loop(node: any, key: any): any {
    if (node === null) {
      return { getName: () => key };
    }
    return Object
      .keys(node)
      .reduce((acc, k) => {
        return { ...acc, [k]: loop(node[k], k) };
      }, { getName: () => key });
  }

  return R.mapObjIndexed(loop, rawTree) as any;
}

export default function makeReduxFormEntry<E, T = string>(
  formName: T,
  fieldNames: RawFieldTree<E>,
): IReduxFormEntry<T, FieldTree<RawFieldTree<E>>>;

export default function makeReduxFormEntry<E, T = string>(
  formName: T,
  fieldNames: Array<keyof E>,
): IReduxFormEntry<T, { [K in keyof E]: K }>;

export default function makeReduxFormEntry<E, T = string>(
  formName: T,
  fieldNames: Array<keyof E> | RawFieldTree<E>,
): IReduxFormEntry<T, { [K in keyof E]: K } | FieldTree<RawFieldTree<E>>> {
  return {
    name: formName,
    fieldNames: Array.isArray(fieldNames)
      ? fieldNames.reduce((res, name) => ({ ...res, [name]: name }), {}) as any
      : buildFieldTree(fieldNames),
  };
}
