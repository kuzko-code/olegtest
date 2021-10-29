
const reducerLogo = (state = "", action) => {
  switch (action.type) {        
      case 'UPDATELOGO':   
      state = action.Logo 
        return state;
    default:
      return state;
  }
};

export default reducerLogo;