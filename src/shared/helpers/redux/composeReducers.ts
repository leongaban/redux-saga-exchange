import { Reducer, Action } from 'redux';
import * as R from 'ramda';

export default function composeReducers<S>(reducers: Array<Reducer<S>>) {
  return <A extends Action>(state: S, action: A) => R.reduceRight(
    (reducer: Reducer<S>, _state: S) => reducer(_state, action),
    state,
    reducers
  );
}
