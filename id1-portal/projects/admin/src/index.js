import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import Routs from './routs.js';
//services
import { getAdminLanguages, getSiteLogos, getNavigation } from "./services/index.js";
import { getUserByToken } from "./services/user-api-services.js";
import { getPluginsInfo } from "./services/plugin-api-services.js";
import plugins from "./plugins.js";
//pages
import ServerError from "./pages/error/500.jsx";


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

class Root extends React.Component {

	constructor() {
		super();
		this.state = {
			pathsForPlugins: [],
			languagesString: "",
			userPermissionsLinks: [],
			navigation: [],
			loading: true,
			error: false,
			languages: [],
			locate: "",
			headerLogo: "",
			pluginsInfo: [],
			currentUser: { userName: "", role: "" }
		};
	}

	onError = () => {
		this.setState({
			error: true,
			loading: false
		});
	};

	componentDidMount = async () => {
		this.loadingData();
	}

	loadingData = async () => {
		let { currentUser } = this.state;

		var defaultLocate = 'ua';
		var languages = [];

		Promise.all([getAdminLanguages(), getSiteLogos(), getPluginsInfo(), getUserByToken(), getNavigation()]).then(resonses => {

			if (resonses[0].data.length) resonses[0].data.map(lang => languages.push({ value: lang.cutback.toString(), label: lang.title.toString() }));

			var headerLogo = "";
			try { headerLogo = resonses[1].data.settings_object.headerLogo } catch { }

			currentUser.userId = resonses[3].data.userId;
			currentUser.userName = resonses[3].data.userName;
			currentUser.role = resonses[3].data.role;

			let userPermissionsLinks = [];
			let navigation = [];
			if (resonses[4].error_message === null) {
				navigation = resonses[4].data;
				resonses[4].data.map(element => {
					element.to ? userPermissionsLinks.push(element.to) : null;
					element.content ?
						element.content.map(subElement => {
							userPermissionsLinks.push(subElement.to)
						}) : null;
				})
			}
			var pluginsInfo = resonses[2].data.map(plugin => { if (plugin.hasOwnProperty('activate')) { return plugin; } else { return Object.assign(plugin, { activate: false }) } });
			var languagesString = languages.map(e => e.value).join('|');
			var pathsForPlugins = createPluginRoutes(pluginsInfo, languagesString);

			this.setState({
				pathsForPlugins: pathsForPlugins,
				userPermissionsLinks: userPermissionsLinks,
				navigation: navigation,
				currentUser: currentUser,
				languages: languages,
				languagesString: languagesString,
				locate: defaultLocate,
				loading: false,
				headerLogo: headerLogo,
				error: false,
				pluginsInfo: pluginsInfo
			})
		}).catch(this.onError);
	}

	render() {
		const { languagesString, pathsForPlugins, loading, languages, locate, headerLogo, pluginsInfo, currentUser, navigation, userPermissionsLinks, error } = this.state;

		const hasData = !(loading || error);
		const errorMessage = error ? <ServerError /> : null;
		const spinner = loading ? <LinearProgress /> : null;

		const content = hasData ? <Routs pathsForPlugins={pathsForPlugins} languagesString={languagesString} userPermissionsLinks={userPermissionsLinks} navigation={navigation} languagesOnSite={languages} locate={locate} headerLogo={headerLogo} pluginsInfo={pluginsInfo} currentUser={currentUser} loadingData={this.loadingData} /> : null;

		return (
			<BrowserRouter>
				<Route path={"/:lng(" + languagesString + ")?"} >
					<div>
						{content}
						{errorMessage}
						{spinner}
					</div>
				</Route>
			</BrowserRouter>
		);
	}
}

ReactDOM.render(<Root />, document.getElementById('root'));