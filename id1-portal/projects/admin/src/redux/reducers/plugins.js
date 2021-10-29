
const reducerPlugins = (state = "", action) => {
  switch (action.type) {        
      case 'UPDATEPLUGINSINFO': 
      state = state.map(plugin => {if(plugin.name === action.Plugin.name) { return action.Plugin} else {return plugin}}); 
        return state;
    default:
      return state;
  }
};

export default reducerPlugins;