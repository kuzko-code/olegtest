import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './headers/template/header.js';
import Footer from './footer/footer.jsx';
import ServerError from '../../pages/Errors/ServerError.jsx';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withTranslate } from 'react-redux-multilingual';
import Helmet from 'react-helmet';
import AuthModal from '../auth/AuthModal/AuthModal.jsx';
import { checkUser } from '../../redux/user/userOperations.js';
import { getStorageKeyForBearerToken, getEventTypeForBearerToken } from '../../services/auth-service.js'

import "./layout.css"

export class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLowVisionOn: false,
      loading: false,
      error: false,
    };
  }

  setErrorPage = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  pageLoaded = () => {
    this.setState({
      error: false,
      loading: false,
    });
  };

  toggleLowVision = () => {
    this.setState({ isLowVisionOn: !this.state.isLowVisionOn });
    if (this.state.isLowVisionOn) {
      document.body.style.removeProperty('font-size');
      localStorage.isLowvision = false;
    } else {
      localStorage.isLowvision = true;
    }
    if (localStorage.getItem('isLowvision')) {
      if (localStorage.getItem('isLowvision').toString() === 'true') {
        document.body.classList.add('lowvision');
      } else {
        document.body.classList.remove('lowvision');
      }
    }
  };

  onLocalStorageUpdate = ({ originalEvent }) => {
    originalEvent.key === getStorageKeyForBearerToken() && this.props.getCurrentUser();
  };

  componentDidMount() {

    this.props.getCurrentUser();
    document.addEventListener(getEventTypeForBearerToken(), this.onLocalStorageUpdate);

    if (localStorage.getItem('isLowvision')) {
      if (localStorage.getItem('isLowvision').toString() === 'true') {
        document.body.classList.add('lowvision');
        this.setState({ isLowVisionOn: true });
      } else {
        document.body.classList.remove('lowvision');
        this.setState({ isLowVisionOn: false });
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener(getEventTypeForBearerToken(), this.onLocalStorageUpdate);
  }

  render() {

    const { error, loading, isLowVisionOn } = this.state;
    const { settings, language, translate } = this.props;
    const hasData = !(loading || error);

    var keywords = hasData
      ? (keywords = settings.Layout.siteName
        ? [
          ...settings.Layout.siteName.split(' '),
          translate('mainPage'),
        ].join(',')
        : translate('mainPage'))
      : '';
    return (
      <React.Fragment>
        <Helmet
          htmlAttributes={{ lang: this.props.translate('localeCode') }}
          script={[
            {
              type: 'application/ld+json',
              innerHTML: `{
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "headline": "${(settings.Layout.siteName || "").replace(/"/g, '\\"')}",
                    "url": "${process.env.PUBLIC_HOST + window.location.pathname
                }",
                    "potentialAction": [{
                      "@type": "SearchAction",
                      "target": "${process.env.PUBLIC_HOST}/${language}/search?key={search_term_string}",
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
        </Helmet>
        {loading && <LinearProgress />}
        <Header
          isLowVisionOn={isLowVisionOn}
          toggleLowVision={this.toggleLowVision}
          setErrorPage={this.setErrorPage}
          pageLoaded={this.pageLoaded}
        />
        {hasData && <React.Fragment>
          {/* <div className="wrapper">{this.props.children}</div> */}
          <main>{this.props.children}</main>
          <Footer
            isLowVisionOn={isLowVisionOn}
            toggleLowVision={this.toggleLowVision}
          />
        </React.Fragment>}
        {error && <ServerError />}
        {this.props.isAuthModalShown && <AuthModal />}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.reducerSettings,
    reducerPlugins: state.reducerPlugins,
    locateForURL: `/${state.Intl.locale}`,
    language: state.Intl.locale,
    isAuthModalShown: state.general.isAuthModalShown,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getCurrentUser: () => {
    dispatch(checkUser());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Layout));
