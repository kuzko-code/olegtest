
const reducerLanguages = (state = [], action) => {
  switch (action.type) {        
      case 'UPDATELANG':   
      state = action.Languages 
        return state;
    default:
      return state;
  }
};

export default reducerLanguages;