import React, { Component } from 'react';
import classnames from 'classnames';
import { withTranslate } from 'react-redux-multilingual';
import "../../../../public/assets/css/layout/header.css";
import "../../../../public/assets/css/layout/header_important.css";
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import * as actions from '../../../redux/settings/actions.js';
import { getMenuSettingsData } from '../../../redux/menu/menuOperation.js';
import { withRouter } from 'react-router-dom';
import MonochromeLimitedHeader from './monochromeLimitedHeader.jsx';
import DichromaticAllWidthHeader from './dichromaticAllWidthHeader.jsx';
import DichromaticLimitedHeader from './dichromaticLimitedHeader.jsx';
import '../../../../public/style/fixedRightSideButton.css';
//services
import { getSettingsByTitles, getLocationOfBanners, getLocationOfBannersPreview } from '../../../services/settings-api-services.js';
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sites: [],
      metaGoogleSiteVerification: null,
      error: false,
      loading: true,
    };
  }

  componentDidMount() {
    this.loadingData();
  }

  async loadingData() {
    const { language } = this.props;
    const isPreview = this.props.location.pathname.endsWith('/preview');

    const titles = isPreview ?
      'layoutOfPreview,siteLogosOfPreview,contactsOfPreview,GovSites' :
      'layout,siteLogos,contacts,GovSites';

    this.props.getNavMenuSettings(language);

    const bannersPromise = isPreview ? getLocationOfBannersPreview : getLocationOfBanners;
    const promiseList = [getSettingsByTitles(language, `${titles},metaGoogleSiteVerification,telegramNotification,facebookSettings`),
    bannersPromise({
      language: language,
      enabled: true
    })];
    Promise.all(promiseList)
      .then(([settingsData, bannersData]) => {
        const layout =
          settingsData.find(res => res.title === (isPreview ? 'layoutOfPreview' : 'layout')).settings_object;
        const siteLogos =
          settingsData.find(res => res.title === (isPreview ? 'siteLogosOfPreview' : 'siteLogos')).settings_object;
        const metaGoogleSiteVerification =
          settingsData.find(res => res.title === 'metaGoogleSiteVerification').settings_object.metaGoogleSiteVerification;
        let contacts =
          settingsData.find(res => res.title === (isPreview ? 'contactsOfPreview' : 'contacts')).settings_object;
        contacts.socialMedia.telegramNotification =
          settingsData.find(res => res.title === 'telegramNotification').settings_object;
        contacts.socialMedia.facebookSettings =
          settingsData.find(res => res.title === 'facebookSettings').settings_object;

        let bannersPosition = {};
        bannersPosition.locationOfTopBanners = bannersData.topBar || [];
        bannersPosition.locationOfLeftBanners = bannersData.leftBar || [];
        bannersPosition.locationOfRightBanners = bannersData.rightBar || [];
        bannersPosition.locationOfBottomBanners = bannersData.bottomBar || [];

        this.props.AddContacts(contacts);
        this.props.Addlayout(Object.assign(siteLogos, layout));
        this.props.AddBanners(bannersPosition);

        this.setState({
          metaGoogleSiteVerification: metaGoogleSiteVerification,
          loading: false,
          error: false,
          sites: settingsData.find(({ title }) => title === 'GovSites').settings_object,
        });
      })
      .catch((error_message) => {
        console.log('Error in getSettings and banners:>> ', error_message);
        this.onError()
      });
  }

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  getHeader = () => {
    if (
      this.props.settings.Layout.hasOwnProperty('header') &&
      this.props.settings.Layout.header !== undefined &&
      this.props.settings.Layout.header !== null &&
      this.props.settings.Layout.header.length > 0
    ) {
      switch (this.props.settings.Layout.header) {
        case 'MonochromeLimited':
          return MonochromeLimitedHeader;
          break;
        case 'DichromaticAllWidth':
          return DichromaticAllWidthHeader;
          break;
        case 'DichromaticLimited':
          return DichromaticLimitedHeader;
          break;
        default:
          return MonochromeLimitedHeader;
      }
    } else {
      return MonochromeLimitedHeader;
    }
  };

  render() {
    const { settings, language, translate } = this.props;
    let {
      sites,
      loading,
      error,
      metaGoogleSiteVerification,
    } = this.state;
    const hasData = !(loading || error);
    var keywords = hasData
      ? (keywords = settings.Layout.siteName
        ? [
          ...settings.Layout.siteName.split(' '),
          translate('mainPage'),
        ].join(',')
        : translate('mainPage'))
      : '';
    let Header = this.getHeader();
    var headerClassnames = classnames({
      wrapper: !['DichromaticAllWidth'].includes(
        this.props.settings.Layout.header
      ),
    });
    if (metaGoogleSiteVerification) {
      let div = document.createElement('div');
      div.innerHTML = metaGoogleSiteVerification.trim();
      let head = document.querySelector("head");
      if (!head.querySelector(`meta[name="${div.firstChild.getAttribute('name')}"]`))
        head.append(div.firstChild);
    }
    return (
      <header className={headerClassnames} id="layout-header">
        <Helmet
          script={[
            {
              type: 'application/ld+json',
              innerHTML: `{
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "headline": "${(settings.Layout.siteName || "").replaceAll('"', '\\"')}",
                    "url": "${process.env.PUBLIC_HOST + window.location.pathname
                }",
                    "potentialAction": [{
                      "@type": "SearchAction",
                      "target": "${process.env.PUBLIC_HOST
                }/${language}/search?key={search_term_string}",
                      "query-input": "required name=search_term_string"
                    }]
                }`,
            },
          ]}
        >
          <link rel="icon" href={process.env.PUBLIC_HOST + settings.Layout.headerLogo} />
          <title>{settings.Layout.siteName}</title>
          <meta name="description" content={settings.Layout.siteName} />
          <meta name="keywords" content={keywords}></meta>
          <link
            rel="canonical"
            href={process.env.PUBLIC_HOST + window.location.pathname}
          />
          <meta property="og:title" content={settings.Layout.siteName} />
          <meta property="og:type" content="article" />
          <meta
            property="og:url"
            content={process.env.PUBLIC_HOST + window.location.pathname}
          />
          <meta property="og:image" content={process.env.PUBLIC_HOST + settings.Layout.headerLogo} />
          <style rel>
            {`
                        :root{
                            --theme-lightcolor:${settings.Layout.selectedColorTheme
                ? settings.Layout.selectedColorTheme[2]
                : '#104D82'
              };
                            --theme-color:${settings.Layout.selectedColorTheme
                ? settings.Layout.selectedColorTheme[1]
                : '#304f80'
              };
                            --theme-darkcolor:${settings.Layout.selectedColorTheme
                ? settings.Layout.selectedColorTheme[0]
                : '#273043'
              };
                        }
                        :root{
                            --body-background-color: ${['MonochromeLimited'].includes(
                this.props.settings.Layout.header
              )
                ? '#dee4e7'
                : '#fff'
              };
                        }
                        
                        :root{
                            --content-max-width: ${!['DichromaticAllWidth'].includes(
                this.props.settings.Layout.header
              )
                ? '1300px'
                : 'unset'
              };
                        }
                    `}
          </style>
        </Helmet>
        <Header
          isLowVisionOn={this.props.isLowVisionOn}
          toggleLowVision={this.props.toggleLowVision}
          setErrorPage={this.props.setErrorPage}
          pageLoaded={this.props.pageLoaded}
          menu={this.props.menu}
          sites={sites}
          loading={loading}
          error={error}
        />
      </header>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.reducerSettings,
    language: state.Intl.locale,
    menu: state.menuSettings,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    AddBanners: (bannersPosition) => {
      dispatch(actions.AddBanners(bannersPosition));
    },

    AddContacts: (contacts) => {
      dispatch(actions.AddContacts(contacts));
    },

    Addlayout: (data) => {
      dispatch(actions.Addlayout(data));
    },

    getNavMenuSettings: (language) => {
      dispatch(getMenuSettingsData(language));
    }
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslate(Header))
);
