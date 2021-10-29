import React, { Suspense } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { getLanguages, getPluginsInfo } from "./services/index.js";
import LinearProgress from '@material-ui/core/LinearProgress';
import Routs from './routs.js';
import ServerError from "./components/pages/500.jsx"
import { Router, Route, IndexRoute, BrowserRouter, Switch } from 'react-router-dom';
import { hydrate, render } from 'react-dom';
import plugins from "../src/plugins.js";


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
			loading: true,
			error: false,
			languages: [],
			locate: "",
			pluginsInfo: [],
			routs: [],
			languagesString: ""
		};
	}

	onError = () => {
		this.setState({
			error: true,
			loading: false
		});
	};

	componentDidMount = async () => {
		var languages = [];

		Promise.all([getLanguages(), getPluginsInfo()]).then(resonses => {

			if (resonses[0].data.length) resonses[0].data.map(lang => languages.push({ value: lang.cutback.toString(), label: lang.title.toString() }));

			var pluginsInfo = resonses[1].data.map(plugin => { if (plugin.hasOwnProperty('activate')) { return plugin; } else { return Object.assign(plugin, { activate: true }) } });
			
			var languagesString = languages.map(e => e.value).join('|');
			var routs = createPluginRoutes(pluginsInfo, languagesString);

			this.setState({ languages: languages, pluginsInfo: pluginsInfo, routs: routs, languagesString: languagesString, loading: false, error: false });
		}).catch(() => this.onError());
	}

	render() {
		const { loading, languages, pluginsInfo, error, languagesString, routs } = this.state;

		const hasData = !(loading || error);
		const errorMessage = error ? <ServerError /> : null;
		const spinner = loading ? <LinearProgress /> : null;

		const content = hasData ? <Routs languagesOnSite={languages} pluginsInfo={pluginsInfo} languagesString={languagesString} routs={routs} /> : null;


		return (
			<BrowserRouter>
				<Route path={"/:lng(" + languagesString + ")?"} >
					<div className="mx-auto d-flex flex-column" id="root-children-container">
						{content}
						{errorMessage}
						{spinner}
					</div>
				</Route>
			</BrowserRouter>
		);
	}
}

render(<Root />, document.getElementById('root'));