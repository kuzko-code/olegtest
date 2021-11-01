export const getStoreByGeneralSettings = (generalSettings) => {
    // console.log(generalSettings)

    //Default store
    let store =
    {
        Intl: {
            locale: "",
            languagesOnSite: [],
        },
        reducerSettings: {
            Contacts: {
                socialMedia: {},
                email: "",
                phone: "",
                hotlineNumber: "",
                address: ""
            },
            Layout: {
                siteName: "",
                descriptionForSite: "",
                colorTheme: "", //TODO: Видалити там де використовуться і почистити
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
        },
        reducerPlugins: [],
        reducerPluginsTabs: [],
        menuSettings: [],
        GovSites: []
    };

    const {
        siteLogos, layout,
        language,
        languagesOnThePublicSite,
        plugins,
        contacts,
        facebookSettings,
        telegramNotification,
        tabs,
        mainNavigation,
        GovSites,
        template
    } = generalSettings;



    //Layout & siteLogos
    store.reducerSettings.Layout = Object.assign(siteLogos, layout);

    //language
    store.Intl.locale = language;

    //languagesOnThePublicSite
    if (languagesOnThePublicSite && languagesOnThePublicSite.length) {
        store.Intl.languagesOnSite = languagesOnThePublicSite.map(lang => ({ value: lang.cutback, label: lang.title }));
    }

    //plugins
    if (plugins && plugins.length) {
        let pluginsTabs = {};
        plugins.map(plugin => {
            if (plugin && plugin.tabs) {
                plugin.tabs.map(tab => {
                    if (tab && tab.type && tab.viewOfTab) {
                        pluginsTabs[tab.type] = tab;
                        pluginsTabs[tab.type]["pluginName"] = plugin.name;
                    }
                })
            }
        })

        store.reducerPlugins = plugins;
        store.reducerPluginsTabs = pluginsTabs;
    }

    //Contacts
    if (contacts) {
        store.reducerSettings.Contacts = contacts;
    }

    //Template
    if (template) {
        store.reducerSettings.Template = template;
    }

    //facebookSettings
    if (facebookSettings) {
        store.reducerSettings.Contacts.socialMedia.facebookSettings = facebookSettings;
    }

    //telegramNotification
    if (telegramNotification) {
        store.reducerSettings.Contacts.socialMedia.telegramNotification = telegramNotification;
    }

    //tabs
    if (tabs) {
        store.reducerSettings.BannersPosition.locationOfTopBanners = tabs.topBar || [];
        store.reducerSettings.BannersPosition.locationOfLeftBanners = tabs.leftBar || [];
        store.reducerSettings.BannersPosition.locationOfRightBanners = tabs.rightBar || [];
        store.reducerSettings.BannersPosition.locationOfBottomBanners = tabs.bottomBar || [];
    }

    //mainNavigation
    if (mainNavigation) {
        store.menuSettings = mainNavigation;
    }

    //GovSites
    if (mainNavigation) {
        store.GovSites = GovSites;
    }

    return store;
};