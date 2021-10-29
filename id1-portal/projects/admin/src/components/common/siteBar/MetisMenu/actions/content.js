export const updateContent = (reduxUid, content) => ({
  type: 'UPDATE_CONTENT',
  reduxUid,
  content,
});

export const changeSubMenuVisibility = (reduxUid, id, trace, subMenuVisibility) => ({
  type: 'CHANGE_SUBMENU_VISIBILITY',
  reduxUid,
  id,
  trace,
  subMenuVisibility,
});

export const changeActiveLinkId = (reduxUid, value) => ({
  type: 'CHANGE_ACTIVE_LINK',
  reduxUid,
  propName: 'id',
  value,
});
export const changeActiveLinkTo = (reduxUid, value) => ({
  type: 'CHANGE_ACTIVE_LINK',
  reduxUid,
  propName: 'to',
  value,
});
export const changeActiveLinkLabel = (reduxUid, value) => ({
  type: 'CHANGE_ACTIVE_LINK',
  reduxUid,
  propName: 'label',
  value,
});
export const changeActiveLinkFromLocation = reduxUid => ({
  type: 'CHANGE_ACTIVE_LINK_FROM_LOCATION',
  reduxUid,
});
