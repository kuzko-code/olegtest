import React, { Component } from 'react';
import Helmet from 'react-helmet';
import classnames from 'classnames';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import PopularTags from "../../components/widget/PopularTags/PopularTags.jsx"
import AutocompleteRubrics from "./AutocompleteRubrics.jsx"
import NewsList from "./List.jsx"
import { TabHeader, BreadcrumbsUI, withMediaQuery } from '../../components/ReExportComponents.js'

import * as actions from '../../redux/settings/actions.js';

import "./NewsList.css";

class NewsListPage extends Component {

    static propTypes = {
        rubric: PropTypes.string,
        tag: PropTypes.string,
        page: PropTypes.string,
        search: PropTypes.string,

        onChangeSearch: PropTypes.func,
        onChangePage: PropTypes.func,
        onChangeRubric: PropTypes.func,
        onChangeTag: PropTypes.func,
    }

    constructor(props) {
        super(props);
        var tempSearch = this.props.search ? this.props.search : ""
        this.state = {
            search: tempSearch,
            searchKey: tempSearch,
            rubric: this.props.rubric,
            tag: this.props.tag,
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
    }

    componentDidUpdate(prevProps, PrevState) {
        if (this.props.rubric != prevProps.rubric) {
            this.setState({ rubric: this.props.rubric })
            this.props.onChangeRubric(this.props.rubric);
        }
    }

    handleSearchChange = (event) => {
        if (event.target.value === "") {
            this.setState({ search: "", searchKey: "" })
            this.props.onChangeSearch("");
        }
        else {
            this.setState({ searchKey: event.target.value });
        }
    }

    handleSearchSubmit = (event) => {
        event.preventDefault();
        this.props.onChangeSearch(this.state.searchKey);
        this.setState({ search: this.state.searchKey });
    }

    handleRubricChange = (event, value) => {
        event.preventDefault();

        if (value == null) {
            this.setState({ rubric: null, });
            this.props.onChangeRubric("");
        } else {
            this.setState({ rubric: value.id })
            this.props.onChangeRubric(value.id);
        }
    }

    activateTags = (event) => {
        event.preventDefault;
        this.setState({ tag: event.target.attributes[0].value });
        this.props.onChangeTag(event.target.attributes[0].value);
    }

    render() {
        const { rubric, tag, search, CssTextField } = this.state;

        const { layout, onChangePage, page, translate, locateForURL } = this.props;

        return (
            <div className="news-list-page">
                <Helmet>
                    <title>{translate('allNews')}</title>
                    <meta name="description" content={translate('allNews')} />
                    <meta name="keywords" content={translate('allNews')}></meta>
                    <link rel="canonical" href={process.env.PUBLIC_HOST + window.location.pathname + (this.props.page > 1 ? `?page=${this.props.page}` : "")} />
                    <meta property="og:title" content={translate('allNews')} />
                    <meta property="og:type" content="article" />
                    <meta property="og:url" content={process.env.PUBLIC_HOST + window.location.pathname + (this.props.page > 1 ? `?page=${this.props.page}` : "")} />
                    <meta property="og:image" content={process.env.PUBLIC_HOST + layout.headerLogo} />
                </Helmet>

                <BreadcrumbsUI curentPageTitle={translate('allNews')} />
                <section className="news-list-content">
                    <div className="row">
                        <div className="col-lg-8 col-md-12">
                            <NewsList tag={tag} rubric={rubric} search={search} onChangePage={onChangePage} defaultPage={page} />
                        </div>

                        <div className="col-lg-4 col-md-12">
                            <TabHeader title={translate('search')} />
                            <form onSubmit={this.handleSearchSubmit}>
                                <CssTextField fullWidth id="search-text-field" label={translate('search')} margin={this.props.isDesktop ? 'none' : 'dense'} variant="outlined" value={this.state.searchKey}
                                    onChange={this.handleSearchChange} />
                            </form>

                            <AutocompleteRubrics
                                handleRubricChange={this.handleRubricChange}
                                selectedRubric={rubric}
                                CssTextField={CssTextField} />
                            <PopularTags
                                activeTag={tag}
                                activateTags={this.activateTags} />
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        layout: state.reducerSettings.Layout,
        locateForURL: `/${state.Intl.locale}`,
    };
};
const urlPropsQueryConfig = {
    rubric: { type: UrlQueryParamTypes.string },
    tag: { type: UrlQueryParamTypes.string },
    search: { type: UrlQueryParamTypes.string },
    page: { type: UrlQueryParamTypes.string },
};

export default connect(mapStateToProps, actions)(withTranslate(addUrlProps({ urlPropsQueryConfig })(withMediaQuery([
    ['isDesktop', '(min-width:768px)', {
        defaultMatches: true
    }]
])(NewsListPage))));