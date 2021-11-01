const initialState = {
  Contacts: {
    socialMedia: {},
    email: "",
    phone: "",
    hotlineNumber: "",
    address: ""
  },
  Layout: {
    siteName: "",
    colorTheme: "",
    selectedColorTheme: [],
    headerLogo: "",
    footerLogo: ""
  },
  BannersPosition: {
    locationOfTopBanners: [],
    locationOfLeftBanners: [],
    locationOfRightBanners: [],
    locationOfBottomBanners: []
  },
  Template: {
    title: "",
    header: "",
    footer: ""
  }
}

const reducerSettings = (state = initialState, action) => {
  switch (action.type) {
    case 'ADDContacts':

      var tempState = Object.assign({}, state);

      tempState.Contacts.socialMedia = action.contacts.socialMedia
      tempState.Contacts.email = action.contacts.email;
      tempState.Contacts.phone = action.contacts.phone;
      tempState.Contacts.hotlineNumber = action.contacts.hotlineNumber;
      tempState.Contacts.address = action.contacts.address;
      return tempState;

    case 'ADDLayout':
      var tempState = Object.assign({}, state);
      tempState.Layout.siteName = action.layout.siteName;
      tempState.Layout.descriptionForSite = action.layout.descriptionForSite;
      tempState.Layout.colorTheme = action.layout.colorTheme;
      tempState.Layout.selectedColorTheme = action.layout.selectedColorTheme;
      tempState.Layout.headerLogo = action.layout.headerLogo;
      tempState.Layout.footerLogo = action.layout.footerLogo;
      tempState.Layout.siteOldVersion = action.layout.siteOldVersion;
      tempState.Layout.header = action.layout.header;

      return tempState;

    case 'ADDBanners':
      var tempState = Object.assign({}, state);
      tempState.BannersPosition = action.bannersPosition;

      return tempState;
    case 'ADDTemplate':
      var tempState = Object.assign({}, state);
      tempState.Template = action.Template;

      return tempState;

    default:
      return state;
  }
};

export default reducerSettings;