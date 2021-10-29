import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './layouts/headers/header.jsx';
import Footer from './layouts/footer/footer.jsx';
import ServerError from './pages/500.jsx';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withTranslate } from 'react-redux-multilingual';
import Helmet from 'react-helmet';
import AuthModal from './auth/AuthModal.jsx';
import { checkUser } from '../redux/user/userOperations.js';
import { getStorageKeyForBearerToken, getEventTypeForBearerToken } from '../services/auth-service.js'

function createPluginRoutes(plugin, languagesString) {
  let url = '';
  if (JSON.parse(plugin.activate)) {
    url = `${languagesString}/plugins/${plugin.name}${plugin.fixedRightSideButton.url}`;
  }
  return url;
}

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLowVisionOn: false,
      loading: true,
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
    const hasData = !(loading || error);
    const errorMessage = error ? <ServerError /> : null;
    const spinner = loading ? <LinearProgress /> : null;

    const content = hasData ? (
      <React.Fragment>
        <div className="wrapper">{this.props.children}</div>
        <Footer
          isLowVisionOn={isLowVisionOn}
          toggleLowVision={this.toggleLowVision}
        />
        {/* <div className="fixedRightSideButtonDiv d-flex">
                    <div className="mx-auto h-100">
                        {
                            this.props.reducerPlugins.filter(reducerPlugin => reducerPlugin.fixedRightSideButton).map(plugin =>
                                <FixedRightSideButton
                                    key={shortid.generate()}
                                    url={
                                        createPluginRoutes(
                                            plugin,
                                            this.props.locateForURL)
                                    }
                                    label={(plugin.fixedRightSideButton.translateLabel && translate(plugin.fixedRightSideButton.translateLabel) !== undefined && translate(plugin.fixedRightSideButton.translateLabel) !== null) ? translate(plugin.fixedRightSideButton.translateLabel) : plugin.fixedRightSideButton.label}
                                    icon={plugin.fixedRightSideButton.icon}
                                />
                            )

                        }
                    </div>
                </div> */}
      </React.Fragment>
    ) : null;

    return (
      <React.Fragment>
        <Helmet htmlAttributes={{ lang: this.props.translate('localeCode') }} />
        {spinner}
        <Header
          isLowVisionOn={isLowVisionOn}
          toggleLowVision={this.toggleLowVision}
          setErrorPage={this.setErrorPage}
          pageLoaded={this.pageLoaded}
        />
        {content}
        {errorMessage}
        {this.props.isAuthModalShown && <AuthModal />}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    reducerPlugins: state.reducerPlugins,
    locateForURL: `/${state.Intl.locale}`,
    isAuthModalShown: state.general.isAuthModalShown,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getCurrentUser: () => {
    dispatch(checkUser());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(App));
