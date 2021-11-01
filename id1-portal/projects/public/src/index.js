import React, { Suspense } from 'react';
import { render } from 'react-dom';
import { Route, BrowserRouter } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import LinearProgress from '@material-ui/core/LinearProgress';
const Routs = React.lazy(() => import('./routs.js'));
const ServerError = React.lazy(() => import("./pages/Errors/ServerError.jsx"));

//services
import { getGeneralSettings, getPreviewGeneralSettings } from "./services/index.js";
//helper
import { getStoreByGeneralSettings } from "./helpers/redux-helpers.js";
//styles
import 'bootstrap/dist/css/bootstrap.css';
import '../public/common.css';

class Root extends React.Component {
	constructor(props) {
		super(props);

		let defaultLocate = "";
		if (props.match.params.lng) {
			defaultLocate = props.match.params.lng;
		}

		const isPreview = props.location.pathname.endsWith('/preview');

		this.state = {
			loading: true,
			error: false,
			metaGoogleSiteVerification: null,
			locate: defaultLocate,
			isPreview,
			reduxStore: null
		};
	}

	loadData = async (language, isPreview) => {
		const promiseGetSettings = isPreview ? getPreviewGeneralSettings : getGeneralSettings;

		this.setState({
			loading: true
		});

		promiseGetSettings(language)
			.then(({ data: res }) => {

				try {
					const reduxStore = getStoreByGeneralSettings(res);

					this.setState({
						loading: false,
						error: false,
						reduxStore,
						metaGoogleSiteVerification: res.metaGoogleSiteVerification.metaGoogleSiteVerification || ""
					});
				}
				catch (error) {
					console.error(error);
					this.setState({
						error: true,
						loading: false
					});
				}

			})
			.catch(error => {
				console.error(error);
				this.setState({
					error: true,
					loading: false
				});
			})
	}


	componentDidMount = async () => {
		this.loadData(this.state.locate, this.state.isPreview)
	}

	componentDidUpdate = async (prevProps) => {
		if (this.props.match.params.lng != prevProps.match.params.lng) {
			this.loadData(this.props.match.params.lng, this.state.isPreview)
		}
	}

	render() {
		const {
			loading,
			error,
			metaGoogleSiteVerification,
			reduxStore
		} = this.state;

		if (metaGoogleSiteVerification) {
			let div = document.createElement('div');
			div.innerHTML = metaGoogleSiteVerification.trim();
			let head = document.querySelector("head");
			if (!head.querySelector(`meta[name="${div.firstChild.getAttribute('name')}"]`))
				head.append(div.firstChild);
		}
		return (
			<div className="mx-auto d-flex flex-column" id="root-children-container">
				{loading && <LinearProgress />}
				<Suspense fallback={<LinearProgress />}>
					{error && <ServerError />}
					{!(loading || error) && <Routs reduxStore={reduxStore} />}
				</Suspense>
			</div>
		);
	}
}

render(
	<BrowserRouter>
		<Route path={"/:lng([a-z]{2})?"} >
			{withRouter(Root)}
		</Route>
	</BrowserRouter>,
	document.getElementById('root'));