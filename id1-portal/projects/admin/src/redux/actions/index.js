const AddUser = (User) => {
  return {
    type: 'ADD',
    User: User
  };
};

const UpdateUser = (newName) => {
  return {
    type: 'UPDATE',
    newName: newName
  };
};

export {
  AddUser,
  UpdateUser
};