const AddInformation = (item) => {
  return {
    type: 'ADD',
    item: item
  };
};

export const Clean = (item) => {
  return {
    type: 'CLEAN',
    item: item
  };
};


export {
  AddInformation
};
