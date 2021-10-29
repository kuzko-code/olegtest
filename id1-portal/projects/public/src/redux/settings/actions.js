const AddContacts = (contacts) => {
  return {
    type: 'ADDContacts',
    contacts: contacts
  };
};

const Addlayout = (layout) => {
  return {
    type: 'ADDLayout',
    layout: layout
  };
};

const AddBanners = (bannersPosition) => {
  return {
    type: 'ADDBanners',
    bannersPosition: bannersPosition
  };
};

export {
  AddContacts,
  Addlayout,
  AddBanners
};