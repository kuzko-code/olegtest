const initialState = {
  userId: 0,
  userName: "",
  role: "",
  internalrole: ""
}

const reducerUser = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD':
      var tempState = Object.assign({}, state);
      tempState.userId = action.User.userId;
      tempState.userName = action.User.userName;
      tempState.role = action.User.role;
      tempState.internalrole = action.User.internalrole;
      return tempState;
      
      case 'UPDATE':
        var tempState = Object.assign({}, state);        
        tempState.userName = action.newName;
        return tempState;
    default:
      return state;
  }
};

export default reducerUser;