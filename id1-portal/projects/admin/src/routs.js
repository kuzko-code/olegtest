import React, { Suspense } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Route, BrowserRouter, Switch, Redirect, withRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { IntlReducer as Intl, IntlProvider, IntlActions } from 'react-redux-multilingual';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import PropTypes from 'prop-types';
//component
import translations from './constants/translations/translations.js';
import Login from './components/admin/authorization/index.jsx';
import Restore from './components/admin/restore/index.jsx';
import CreatePasswordForm from './components/admin/restore/createPasswordForm.jsx';
import Profile from './components/admin/profile.jsx';
import NewsList from './components/news/index.jsx';
import RubricsAndTags from './components/news/rubricsAndTags/index.jsx';
import NewsForm from './components/news/newsform.jsx';
import MainSettings from './components/settings/mainSettings.jsx';
import MenuSettings from './components/settings/menuSettings.jsx';
import UsersGroupsSettings from './components/settings/users/index.jsx';
import GroupManagement from './components/settings/users/groupManagement.jsx';
import Layout from './components/app.js';
import LanguageSettings from './components/settings/languageSettings.jsx';
import LinksSettings from './components/links/linksSettings.jsx';
import AccessDenied from './pages/error/accessDenied.jsx';
import SocialNetworks from './pages/social-networks/index.jsx';
import SMTPSettings from './components/settings/smtpSettings.jsx';
//common
import withAuth from './withAuth.jsx';
import languages from './languages.js';
//redux
import reducerUser from './redux/reducers/index.js';
import reducerLogo from './redux/reducers/logo.js';
import reducerLanguages from './redux/reducers/languages.js';
import interfaceReducer from './redux/reducers/interfaceReducer.js';
import reducerPlugins from './redux/reducers/plugins.js';
//pages
import Plugin from './pages/plugin/index.jsx';
import PluginAdd from './pages/plugin/pluginAdd.jsx';
import PluginDetails from './pages/plugin/pluginDetails.jsx';
import UpdatePage from './pages/update/index.jsx';

import NotFound from './pages/error/404.jsx';
import NoAccess from './pages/error/403.js';
//icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import IndexVisitors from './pages/visitors/index.jsx';

library.add(fab, fas);

const middleware = [ thunk ];

class Routs extends React.Component {
	static propTypes = {
		lng: PropTypes.string,
		onChangeLng: PropTypes.func
	};

	constructor(props) {
		super(props);

		var { languagesOnSite, pluginsInfo, navigation, languagesOnSite, headerLogo } = props;
		var defaultLocate = languagesOnSite.length > 0 ? languagesOnSite[0].value : 'ua';
		var locate = defaultLocate;

		if (props.match.params.lng) {
			locate = props.match.params.lng;
		}

		var locateForURL = '/' + locate;
		if (locate != defaultLocate) locateForURL = '/' + locate;

		var mainTranslations = Object.assign({}, translations);

		this.handleEmailSubmit=this.handleEmailSubmit.bind(this)

		for (const languagePlugins of languages) {
			Object.keys(languagePlugins.translation).forEach(function(languagePlugin) {
				if (!mainTranslations.hasOwnProperty(languagePlugin)) {
					mainTranslations = Object.assign(mainTranslations, {
						[languagePlugin]: languagePlugins.translation[languagePlugin]
					});
				} else {
					mainTranslations[languagePlugin].messages = Object.assign(
						languagePlugins.translation[languagePlugin].messages,
						mainTranslations[languagePlugin].messages
					);
				}
			});
		}

		this.state = {
			defaultLocate: defaultLocate,
			locateForURL: locateForURL,
			locate: locate,
			mainTranslations: mainTranslations,
			redirect: false,
			email:null,
		};
	}
	handleEmailSubmit(data){
		this.setState({email:data});
	}
	checkPermission = (permissionLink) => {
		return this.props.userPermissionsLinks.includes(permissionLink);
	};

	updateRoutes = async (pluginsInfo) => {
		this.props.loadingData();
	};

	render() {
		var {
			navigation,
			languagesString,
			pathsForPlugins,
			pluginsInfo,
			languagesOnSite,
			headerLogo,
			history
		} = this.props;
		var { locate, locateForURL, defaultLocate, mainTranslations, redirect } = this.state;

		const changeLocale = (locate) => {
			store.dispatch(IntlActions.setLocale(locate));
			this.setState({ redirect: true, locate: locate });
			history.push(`/${locate}`);
		};

		const composedEnhancer = composeWithDevTools(applyMiddleware(...middleware));
		const reducers = combineReducers(
			Object.assign(
				{},
				{ Intl },
				{ currentUser: reducerUser },
				{ reducerLogo: reducerLogo },
				{ reducerLanguages: reducerLanguages },
				{ reducerPlugins },
				{ interface: interfaceReducer }
			)
		);
		const store = createStore(
			reducers,
			{
				Intl: {
					locale: locate,
					changeLocale: changeLocale,
					updateRoutes: this.updateRoutes,
					navigation: navigation
				},
				reducerLanguages: languagesOnSite,
				reducerLogo: headerLogo,
				currentUser: {
					...this.props.currentUser,
					internalrole: this.props.currentUser.role
				},
				reducerPlugins: pluginsInfo
			},
			composedEnhancer
		);

		return (
			<Provider store={store}>
				<IntlProvider translations={mainTranslations}>
					<BrowserRouter basename={'/'}>
						<Suspense
							fallback={
								<Layout>
									<div>...loading</div>
								</Layout>
							}
						>
							<Switch>
								<Route path="/:lng/login" component={Login} />
								<Route path="/:lng/restore"render={()=><Restore onEmailSubmit={this.handleEmailSubmit}/>} />
								<Route path="/:lng/createPassword" render={()=><CreatePasswordForm email={this.state.email}/>}/> 
								<LayoutWithAuth>
									<Switch>
										<Route
											exact
											path={`/:lng(${languagesString})?/`}
											component={function Post(props) {
												if (navigation && navigation.length !== 0) {
													if (navigation[0].content && navigation[0].content.length !== 0) {
														return (
															<Redirect
																to={{
																	pathname: `/${locate}${navigation[0].content[0].to}`
																}}
															/>
														);
													}
													return (
														<Redirect to={{ pathname: `/${locate}${navigation[0].to}` }} />
													);
												}
												return <AccessDenied />;
											}}
										/>
										<Route
											path={'/:lng(' + languagesString + ')?/news'}
											component={withAuth(NewsList, this.checkPermission('/news'))}
										/>
										<Route
											path={'/:lng(' + languagesString + ')?/rubrics'}
											component={withAuth(RubricsAndTags, this.checkPermission('/rubrics'))}
										/>
										<Route
											path={'/:lng(' + languagesString + ')?/newsform/:id'}
											component={withAuth(NewsForm, this.checkPermission('/news'))}
										/>
										{/* <Route path={"/:lng(" + languagesString + ")?/contacts"} component={withAuth(Contacts, this.checkPermission("/main_settings"))} /> */}
										<Route
											path={'/:lng(' + languagesString + ')?/menu_settings'}
											component={withAuth(MenuSettings, this.checkPermission('/menu_settings'))}
										/>
										<Route
										path={'/:lng('+languagesString+")?/smtp"}
										component={withAuth(SMTPSettings,this.checkPermission("/smtp"))}
										/>
										<Route
											path={'/:lng(' + languagesString + ')?/main_settings'}
											component={withAuth(MainSettings, this.checkPermission('/main_settings'))}
										/>
										<Route
											path={
												'/:lng(' +
												languagesString +
												')?/usersAndGroups_settings/groupManagement/:id'
											}
											component={withAuth(
												GroupManagement,
												this.checkPermission('/usersAndGroups_settings') &&
												[ 'root_admin', 'global_admin' ].includes(this.props.currentUser.role)
													? true
													: false
											)}
										/>
										<Route
											path={'/:lng(' + languagesString + ')?/usersAndGroups_settings'}
											component={withAuth(
												UsersGroupsSettings,
												this.checkPermission('/usersAndGroups_settings')
											)}
										/>
										<Route
											path={'/:lng(' + languagesString + ')?/plugins'}
											component={withAuth(Plugin, this.checkPermission('/plugins'))}
											exact
										/>
										<Route
											path={'/:lng(' + languagesString + ')?/pluginAdd'}
											component={withAuth(PluginAdd, this.checkPermission('/plugins'))}
											exact
										/>
										<Route
											path={'/:lng(' + languagesString + ')?/pluginDetails/:name'}
											component={withAuth(PluginDetails, this.checkPermission('/plugins'))}
											exact
										/>
										<Route
											path={'/:lng(' + languagesString + ')?/profile'}
											component={withAuth(Profile, true)}
										/>
										<Route
											path={'/:lng(' + languagesString + ')?/403'}
											component={withAuth(NoAccess, true)}
										/>
										<Route
											path={'/:lng(' + languagesString + ')?/language_settings'}
											component={withAuth(
												LanguageSettings,
												this.checkPermission('/language_settings')
											)}
										/>
										<Route
											path={'/:lng(' + languagesString + ')?/links'}
											component={withAuth(LinksSettings, this.checkPermission('/links'))}
										/>
										<Route
											path={'/:lng(' + languagesString + ')?/social_networks'}
											component={withAuth(SocialNetworks, this.checkPermission('/social_networks'))}
										/>
										<Route
											path={'/:lng(' + languagesString + ')?/update/:ver?'}
											component={withAuth(UpdatePage, this.checkPermission('/update'))}
										/>
										<Route
											path={'/:lng(' + languagesString + ')?/visitors'}
											component={withAuth(IndexVisitors, this.checkPermission('/visitors'))}
										/>
										{pathsForPlugins}
										<Route render={() => <NotFound />} />
									</Switch>
								</LayoutWithAuth>
							</Switch>
						</Suspense>
					</BrowserRouter>
				</IntlProvider>
			</Provider>
		);
	}
}

const LayoutWithAuth = withAuth(Layout, 0);

export default withRouter(Routs);
