import React, { Component } from 'react';
import "../../../public/assets/css/layout/newslist.css";
import classnames from 'classnames';
import { withTranslate } from 'react-redux-multilingual';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux'
import * as actions from '../../redux/settings/actions.js';
import PopularTags from "./popularTags.jsx"
import AutocompleteRubrics from "./autocompleteRubrics.jsx"
import NewsList from "./newslist.jsx"
import BreadcrumbsUI from "../pages/BreadcrumbsUI.jsx"
import PropTypes from 'prop-types';
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';
import { withStyles } from '@material-ui/core/styles';
import Helmet from 'react-helmet';
import TabHeader from '../main/tabHeader.jsx'
import { withMediaQuery } from '../util/withMediaQuery.js';

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

        var colorThemeWidget = classnames({
            'widget': true,
            'color-default': true,
            'color-theme': true
        });

        var colorThemeNews = classnames({
            'block category-listing category-style2': true,
            'color-theme': true
        });

        var colorThemeTags = classnames({
            'widget': true,
            'widget-tags': true,
            'color-theme': true
        });

        return (
            <div className="newstitle" id="newstitle">
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
                <div className="main">
                    <div className="indent">
                        <BreadcrumbsUI curentPageTitle={translate('allNews')} />
                        <section className="block-wrapper">
                            <div className="row" id="newslist-content">
                                <div className="col-lg-8 col-md-12">

                                    <div className={colorThemeNews}>
                                        <NewsList tag={tag} rubric={rubric} search={search} onChangePage={onChangePage} defaultPage={page} />
                                    </div>
                                </div>

                                <div className="col-lg-4 col-md-12">
                                    <div className="sidebar sidebar-right">
                                        <div className={colorThemeWidget}>
                                            <TabHeader title={translate('search')} />
                                            <form onSubmit={this.handleSearchSubmit}>
                                                <CssTextField fullWidth id="search-text-field" label={translate('search')} margin={this.props.isDesktop ? 'none' : 'dense'} variant="outlined" value={this.state.searchKey}
                                                    onChange={this.handleSearchChange} />
                                            </form>
                                        </div>

                                        <div className={colorThemeWidget}>
                                            <AutocompleteRubrics handleRubricChange={this.handleRubricChange} selectedRubric={rubric} CssTextField={CssTextField} />
                                        </div>

                                        <div className={colorThemeTags}>
                                            <PopularTags activeTag={tag} activateTags={this.activateTags} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
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