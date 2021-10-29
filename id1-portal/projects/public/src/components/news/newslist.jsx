import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { getNewsList, getNewsCount } from "../../services/index.js"
import NotFound from "../pages/404.jsx"
import MiddleViewNews from "./middleViewNews.jsx"
import { connect } from 'react-redux'
import * as actions from '../../redux/settings/actions.js';
import TabHeader from '../main/tabHeader.jsx'
import Pagination from '../Pagination/Pagination.jsx';

class NewsList extends Component {

    constructor(props) {
        super(props);
        var defaultPage = this.props.defaultPage ? this.props.defaultPage : 1;
        this.state = {
            data: [],
            activePage: defaultPage,
            itemsOnPage: 8,
            pages: 1,
            loading: true,
            error: false
        };
    }

    componentDidMount() {
        this.loadingData(false);
    }

    componentDidUpdate(prevProps, PrevState) {

        if (this.state.activePage != PrevState.activePage) {
            this.loadingData(false);
        }

        if (this.props.tag != prevProps.tag
            || this.props.rubric != prevProps.rubric
            || this.props.search != prevProps.search) {
            this.props.onChangePage();
            this.loadingData(true);
        }
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    };

    loadingData(resetActivePage) {
        let { rubric, tag, search, language } = this.props;
        let { activePage, itemsOnPage, } = this.state;
        const { translate } = this.props;
        let data = [];
        let pages = 1;

        if (rubric === "null" || rubric == undefined || rubric == 'undefined') { rubric = ""; };
        if (!tag || tag === "0" || tag === translate('allTags')) tag = "";

        if (resetActivePage) activePage = 1;
        var firstItem = (activePage - 1) * itemsOnPage;

        Promise.all([getNewsList(search, rubric, tag, firstItem, itemsOnPage, language), getNewsCount(search, rubric, tag, language)]).then(resonses => {

            if (resonses[0].status != "ok" || resonses[1].status != "ok") {
                this.onError();
                return;
            }

            data = resonses[0].data;
            pages = Math.ceil(resonses[1].data.count / itemsOnPage);

            this.setState({
                pages: pages,
                data: data,
                activePage: activePage,
                error: false,
                loading: false
            });
        }).catch(() => this.onError());
    }

    handlePaginationChange = (e, page) => {
        if (this.state.activePage != page) {
            this.setState({ activePage: page, redirect: true });
            this.props.onChangePage(page);
        }
    }

    render() {
        const { data, activePage, pages, loading, error } = this.state;
        const { translate } = this.props;
        const hasData = !(loading || error);
        const errorMessage = error ? <NotFound /> : null;
        const spinner = loading ? <div className="d-flex justify-content-center">
            <div className={`spinner-border text-color`}>
            </div>
        </div> : null;
        const content = hasData ? <div className="tab-content">

            <div className="tab-pane animated fadeInRight active" id="tab_a" >
                {data.length > 0 ? data.map(news =>
                    <MiddleViewNews key={"ListNews" + news.id} news={news} />
                ) :
                    <div> {translate('nothingFound')} </div>
                }
            </div>
        </div> : null

        const pagination =
            <React.Fragment>
                {pages > 1 ?
                    <Pagination
                        defaultPage={1}
                        count={+pages}
                        page={+activePage}
                        onChange={this.handlePaginationChange}
                        size={'medium'}
                    />
                    : null}
            </React.Fragment>

        return (
            <React.Fragment>
                <TabHeader title={translate('allNews')}/>
                {errorMessage}
                {spinner}
                {content}
                {pagination}
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.Intl.locale
    };
};

export default connect(mapStateToProps)(withTranslate(NewsList));