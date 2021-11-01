import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { __RouterContext as RouterContext } from 'react-router-dom';
import { RouterToUrlQuery } from 'react-url-query';
import { withRouter } from 'react-router-dom';
//redux
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { IntlReducer as Intl, IntlProvider } from 'react-redux-multilingual';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
//reducer
import reducerSettings from './redux/settings/reducers.js';
import reducerSearch from './redux/search/reducers.js';
import newsByRubricReducer from './redux/newsByRubric/newsByRubricReducer.js';
import reducerPlugins from './redux/plugins/reducers.js';
import reducerPluginsTabs from './redux/plugins/reducersPluginsTabs.js';
import navMenuReducer from './redux/menu/menuReducer.js';
import tagsReducer from './redux/tags/tagsReducer.js';
import sitesReducer from './redux/sites/sitesReducer.js';
import userReducer from './redux/user/userReducer';
import generalReducer from './redux/general/generalReducer';
//components
import LinearProgress from '@material-ui/core/LinearProgress';

import ScrollToTopOnHistoryChange from './components/layouts/ScrollToTopOnHistoryChange.js';
const Layout = React.lazy(() => import('./components/layouts/layout.js'));
const Preview = React.lazy(() => import('./components/layouts/preview.jsx'));
const PrivateRoute = React.lazy(() => import('./components/layouts/PrivateRoute.jsx'));
const FloatMenu = React.lazy(() => import('./components/layouts/FloatMenu/FloatMenu.jsx'));
const AccountSettings = React.lazy(() => import('./components/account/AccountSettings/AccountSettings.jsx'));
//pages
const MainPage = React.lazy(() => import('./pages/Main/index.jsx'));
const NewsPage = React.lazy(() => import('./pages/News/News.jsx'));
const NewsListPage = React.lazy(() => import('./pages/NewsList/NewsList.jsx'));
const SearchPage = React.lazy(() => import('./pages/Search/index.jsx'));
const SubscriptionSettings = React.lazy(() => import('./pages/SubscriptionSettings/SubscriptionSettings.jsx'));
const NotFound = React.lazy(() => import('./pages/Errors/NotFound.jsx'));
//service
import translations from './constants/translations/translations.js';
import plugins from "./services/plugins.js";
import languages from './services/languages.js';
//icons
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { fab } from '@fortawesome/free-brands-svg-icons';
// import { fas } from '@fortawesome/free-solid-svg-icons';
// library.add(fab, fas);

function createPluginRoutes(pluginsInfo, languagesString) {
  const routes = [];
  for (const plugin of plugins) {
    var pluginInfo = pluginsInfo.filter(res => { if (res.name == plugin.name) { return res } })[0];
    if (pluginInfo) {
      if (JSON.parse(pluginInfo.activate)) {
        for (const page of plugin.pages) {
          var url = `/:lng(${languagesString})?/plugins/${plugin.name}${page.url}`;
          routes.push(
            <Route key={url} path={url} component={page.component} exact />
          );
        }
      }
    }
  }
  return routes;
}
function createTranslations() {
  let mainTranslations = Object.assign({}, translations);
  for (const languagePlugins of languages) {
    Object.keys(languagePlugins.translation).forEach(function (
      languagePlugin
    ) {
      if (!mainTranslations.hasOwnProperty(languagePlugin)) {
        mainTranslations = Object.assign(mainTranslations, {
          [languagePlugin]: languagePlugins.translation[languagePlugin],
        });
      } else {
        mainTranslations[languagePlugin].messages = Object.assign(
          languagePlugins.translation[languagePlugin].messages,
          mainTranslations[languagePlugin].messages
        );
      }
    });
  }

  return mainTranslations;
}

class Routs extends React.Component {
  constructor(props) {
    super(props);
    //redux
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
        { GovSites: sitesReducer },
        { user: userReducer },
        { general: generalReducer }
      )
    );

    const store = createStore(
      reducers,
      props.reduxStore,
      compose(applyMiddleware(thunk))
    );

    const languagesString = props.reduxStore.Intl.languagesOnSite.map(e => e.value).join('|');
    let routs = createPluginRoutes(props.reduxStore.reducerPlugins, languagesString);

    let mainTranslations = createTranslations();

    this.state = {
      store,
      languagesString,
      mainTranslations,
      routs
    };
    
  }

  render() {
    const { routs, languagesString, store, mainTranslations } = this.state;

    return (
      <Provider store={store}>
        <IntlProvider translations={mainTranslations}>
          <RouterToUrlQuery routerContext={RouterContext}>
            <Suspense fallback={<LinearProgress />}>
              <Layout>
                <ScrollToTopOnHistoryChange />
                <Suspense fallback={<LinearProgress />}>
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
                </Suspense>

              </Layout>
            </Suspense>
          </RouterToUrlQuery>
        </IntlProvider>
      </Provider>
    );
  }
}

export default withRouter(Routs);
