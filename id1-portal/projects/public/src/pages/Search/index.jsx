import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { Redirect } from 'react-router';
import { Helmet } from "react-helmet";
import queryString from 'query-string'
import classnames from 'classnames';
import { connect } from 'react-redux'
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

import * as actions from '../../redux/search/actions.js';
import { TabHeader, BreadcrumbsUI, withMediaQuery } from '../../components/ReExportComponents.js'

import SearchInPlugins from "./searchInPlugins.jsx";
import Statistics from './statistics.jsx';

import "./Search.css"

export class SearchPage extends Component {

    constructor(props) {
        super(props);
        const values = queryString.parse(this.props.location.search)

        this.state = {
            textSearch: values.key,
            foundText: values.key,
            essence: this.props.match.params.essence,
            redirect: false,
            goToMainSearchPage: false,
            pluginsName: "",
            isSearchValid: true,
            CssTextField: withStyles({
                root: {
                    '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                            borderColor: 'var(--theme-color)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'var(--theme-color)',
                        },
                    },
                },
            })(TextField)
        };

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    };

    componentDidUpdate(prevProps) {
        const values = queryString.parse(this.props.location.search)
        if (prevProps.match.params.essence !== this.props.match.params.essence || values.key !== this.state.foundText) {
            var essence = this.props.match.params.essence ? this.props.match.params.essence : null;
            this.setState({ redirect: true, essence: essence, textSearch: values.key });
        }
    }

    componentDidMount() {
        this.props.Clean();
        const { textSearch } = this.state;
        let { isSearchValid } = this.state;
        textSearch.length >= 3 ? isSearchValid = true : isSearchValid = false;
        this.setState({ isSearchValid: isSearchValid });
    }

    handleSearchChange(event) {
        this.setState({ textSearch: event.target.value });
        if (event.target.value.length >= 3) {
            this.setState({ isSearchValid: true });
        }
    }

    handleSearchSubmit(event) {
        const { textSearch } = this.state;
        let { isSearchValid } = this.state;
        textSearch.length >= 3 & textSearch.trim().length > 0 ? isSearchValid = true : isSearchValid = false;
        this.setState({ isSearchValid: isSearchValid });
        event.preventDefault();
        if (isSearchValid) {
            this.setState({ redirect: true, goToMainSearchPage: true });
        }
    }

    pluginsNameChange = (pluginsName) => {
        this.setState({ pluginsName: pluginsName });
    }


    render() {
        const { textSearch, essence, redirect, foundText, goToMainSearchPage, pluginsName, CssTextField, isSearchValid } = this.state;
        const { layout, translate, locateForURL } = this.props;
        var colorTheme = classnames({
            'color-default': true,
            'color-theme': true
        });

        if (redirect) {
            var tempessence = "/";
            if (!goToMainSearchPage) tempessence = (this.props.match.params.essence) ? `/${this.props.match.params.essence}` : "";
            this.setState({ redirect: false, goToMainSearchPage: false, foundText: textSearch });
            return <Redirect push to={`${locateForURL}/search${tempessence}?key=${textSearch}`} />;
        }

        return (
            <div className="search-page">
                <Helmet>
                    <title>{translate('search')}...</title>
                    <meta name="description" content={translate('search')} />
                    <meta name="keywords" content={translate('search')}></meta>
                    <link rel="canonical" href={process.env.PUBLIC_HOST + window.location.pathname} />
                    <meta property="og:title" content={translate('search')} />
                    <meta property="og:type" content="article" />
                    <meta property="og:url" content={process.env.PUBLIC_HOST + window.location.pathname} />
                    <meta property="og:image" content={process.env.PUBLIC_HOST + layout.headerLogo} />
                </Helmet>
                {essence ?
                    <BreadcrumbsUI
                        breadcrumbsArray={[{ href: `${locateForURL}/search/?key=${textSearch}`, title: translate('search') }]}
                        curentPageTitle={pluginsName} /> :
                    <BreadcrumbsUI curentPageTitle={translate('search')} />}
                <TabHeader variant="h1" title={translate('searchResults')} />
                <div className="row">
                    <div className="col-md-8 col-sm-12  order-2 order-md-1">
                        <form onSubmit={this.handleSearchSubmit}>
                            <div className="d-flex flex-row">
                                <div className="w-100">
                                    <CssTextField
                                        className="error-text"
                                        name="key"
                                        label={translate('search')}
                                        fullWidth
                                        id="standard-multiline-static"
                                        variant="outlined"
                                        margin={this.props.isDesktop ? 'none' : 'dense'}
                                        value={textSearch}
                                        onChange={this.handleSearchChange} />
                                    {!isSearchValid && textSearch.length === 0 &&
                                        <div className="customErrorMessage">
                                            <span>{translate('emptySearchTextError')}</span>
                                        </div>
                                    }
                                    {!isSearchValid && textSearch.length !== 0 &&
                                        <div className="customErrorMessage">
                                            <span>{translate('searchTextMinLenghtError')}</span>
                                        </div>
                                    }
                                </div>
                                <div className="input-group-append">
                                    <button aria-label="search" className="btn-search"></button>
                                </div>
                            </div>
                        </form>

                        <SearchInPlugins textSearch={foundText} essence={essence} pluginsNameChange={this.pluginsNameChange} />
                    </div>
                    <div className="col-md-4 col-sm-12  order-1 order-md-2">
                        <Statistics props={this.props} />
                    </div>
                </div>
            </div>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        layout: state.reducerSettings.Layout,
        locateForURL: `/${state.Intl.locale}`,
    };
};

export default connect(mapStateToProps, actions)(withTranslate(withMediaQuery([
    ['isDesktop', '(min-width:768px)', {
        defaultMatches: true
    }]
])(SearchPage)));