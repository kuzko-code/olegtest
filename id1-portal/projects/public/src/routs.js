import React, { Suspense } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Route, Switch } from 'react-router-dom';
import { __RouterContext as RouterContext } from 'react-router-dom';
import { RouterToUrlQuery } from 'react-url-query';
import languages from './languages.js';
import translations from './constants/translations/translations.js';
import { IntlReducer as Intl, IntlProvider } from 'react-redux-multilingual';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fab, fas);
import MainPage from './components/main/index.jsx';
import Preview from './components/main/preview.jsx';
import SearchPage from './components/search/index.jsx';
import NewsListPage from './components/news/newslistpage.jsx';
import NewsPage from './components/news/newspage.jsx';
import NotFound from './components/pages/404.jsx';
import Layout from './components/app.js';
import reducerSettings from './redux/settings/reducers.js';
import reducerSearch from './redux/search/reducers.js';
import newsByRubricReducer from './redux/newsByRubric/newsByRubricReducer.js';
import ScrollToTop from './components/pages/scrolltotop.js';
import reducerPlugins from './redux/plugins/reducers.js';
import reducerPluginsTabs from './redux/plugins/reducersPluginsTabs.js';
import FloatMenu from './components/main/FloatMenu.jsx';
import { withRouter } from 'react-router-dom';
import navMenuReducer from './redux/menu/menuReducer.js';
import tagsReducer from './redux/tags/tagsReducer.js';
import AccountSettings from './components/account/AccountSettings/AccountSettings.jsx';
import PrivateRoute from './components/util/PrivateRoute.jsx';
import userReducer from './redux/user/userReducer';
import generalReducer from './redux/general/generalReducer';
import SubscriptionSettings from './components/pages/SubscriptionSettings.jsx';

class Routs extends React.Component {
  constructor(props) {
    super();
    var { languagesOnSite, pluginsInfo } = props;
    var defaultLocate =
      languagesOnSite.length > 0 ? languagesOnSite[0].value : 'ua';
    var locate = defaultLocate;

    if (props.match.params.lng) {
      locate = props.match.params.lng;
    }

    let pluginsTabs = {};
    if (pluginsInfo) {
      pluginsInfo.map(plugin => {
        if (plugin && plugin.tabs) {
          plugin.tabs.map(tab => {
            if (tab && tab.type && tab.viewOfTab) {
              pluginsTabs[tab.type] = tab;
              pluginsTabs[tab.type]["pluginName"] = plugin.name;
            }
          })
        }
      })
    }

    var mainTranslations = Object.assign({}, translations);
    for (const languagePlagins of languages) {
      Object.keys(languagePlagins.translation).forEach(function (
        languagePlagin
      ) {
        if (!mainTranslations.hasOwnProperty(languagePlagin)) {
          mainTranslations = Object.assign(mainTranslations, {
            [languagePlagin]: languagePlagins.translation[languagePlagin],
          });
        } else {
          mainTranslations[languagePlagin].messages = Object.assign(
            languagePlagins.translation[languagePlagin].messages,
            mainTranslations[languagePlagin].messages
          );
        }
      });
    }

    const reducers = combineReducers(
      Object.assign(
        {},
        { Intl },
        { reducerSettings: reducerSettings },
        { reducerSearch: reducerSearch },
        { reducerPlugins: reducerPlugins },
        { reducerPluginsTabs: reducerPluginsTabs },
        { newsByRubric: newsByRubricReducer },
        { menuSettings: navMenuReducer },
        { tags: tagsReducer },
        { user: userReducer },
        { general: generalReducer }
      )
    );
    // const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(
      reducers,
      {
        Intl: {
          locale: locate,
          languagesOnSite: languagesOnSite,
        },
        reducerPlugins: pluginsInfo,
        reducerPluginsTabs : pluginsTabs
      },
      compose(applyMiddleware(thunk))
    );

    this.state = {
      defaultLocate,
      locate,
      mainTranslations,
      store,
    };
  }

  render() {
    const {
      mainTranslations,
      store,
    } = this.state;

    const { routs, languagesString } = this.props;

    return (
      <Provider store={store}>
        <IntlProvider translations={mainTranslations}>
          <RouterToUrlQuery routerContext={RouterContext}>
            <Suspense fallback={<div>...loading</div>}>
                <Layout>
                  <ScrollToTop />
                  <Switch>
                    <Route
                      exact
                      path={'/:lng(' + languagesString + ')?/'}
                      component={MainPage}
                    />
                    <Route
                      exact
                      path={'/:lng(' + languagesString + ')?/preview'}
                      component={Preview}
                    />
                    <Route
                      path={'/:lng(' + languagesString + ')?/news/:id'}
                      component={NewsPage}
                    />
                    <Route
                      path={'/:lng(' + languagesString + ')?/search/:essence?'}
                      component={SearchPage}
                    />
                    {routs}
                    <Route
                      path={'/:lng(' + languagesString + ')?/newslist'}
                      component={NewsListPage}
                    />
                    <Route
                      path={'/:lng(' + languagesString + ')?/mailing/settings/:id'}
                      component={SubscriptionSettings}
                    />
                    <PrivateRoute
                      path={'/:lng(' + languagesString + ')?/myaccount'}
                      component={AccountSettings}
                    />
                    <Route path="/NotFound" component={NotFound} />
                    <Route render={() => <NotFound />} />
                  </Switch>
                  <FloatMenu />
                </Layout>
            </Suspense>
          </RouterToUrlQuery>
        </IntlProvider>
      </Provider>
    );
  }
}

export default withRouter(Routs);
