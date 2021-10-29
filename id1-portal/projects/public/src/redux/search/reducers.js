const reducerSearch = (state = [], action) => {

  switch (action.type) {
    case 'ADD':
      var tempState =  [...state, action.item];

      for( var i = 0; i < tempState.length-1; i++){ 
        if ( tempState[i].id === action.item.id) { 
           tempState.splice(i, 1);
        }
      }
      return [...tempState];
    case 'CLEAN':
      state = [];
      return [...state];

    default:
      return state;
  }
};

export default reducerSearch;