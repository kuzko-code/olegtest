export const emitSelected = (reduxUid, e) => ({
  type: 'EMIT_SELECTED',
  reduxUid,
  event: e,
});

export const updateListener = (reduxUid, listener) => ({
  type: 'UPDATE_LISTENER',
  reduxUid,
  listener,
});

export default true;
