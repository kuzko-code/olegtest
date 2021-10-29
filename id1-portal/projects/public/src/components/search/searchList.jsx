import React, { Component } from 'react';
import { getSearch } from "../../services/index.js";
import { Item } from "./item.jsx";
import { connect } from 'react-redux';
import { AddInformation, Clean } from '../../redux/search/actions.js';
import { Link } from 'react-router-dom';
import { withTranslate } from 'react-redux-multilingual';

import Pagination from '../Pagination/Pagination.jsx';

class SearchList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            error: false,
            pages: 0,
            itemsOnMainPage: 6,
            itemsOnPage: 8,
            activePage: 1,
            items: 0,
            itemsLoaded: false,
            loadedNewPage: false
        };
    };

    componentDidUpdate(prevProps, PrevState) {

        if (this.state.itemsLoaded) {
            const { allEssence } = this.props;
            if (!allEssence) this.props.Clean();
            this.setState({ itemsLoaded: false })
            this.props.AddInformation({ id: this.props.title, query: this.props.query, count: this.state.items, name: this.props.name });
        }
    }

    componentDidMount() {
        this.loadingData();
    }

    onError = (err) => {
        this.setState({
            error: true,
            loading: false,
            loadedNewPage: false
        });
        this.props.componentDownloadHasCompleted();
    };

    loadingData(page) {
        const { allEssence } = this.props;
        let itemsOnPage = allEssence ? this.state.itemsOnMainPage : this.state.itemsOnPage;
        let activePage = page || this.state.activePage;
        let pages = this.state.pages;
        if (pages == 0) {
            Promise.all([
                getSearch(`${this.props.APIRequest}&start=${(activePage - 1) * itemsOnPage}&count=${itemsOnPage}`),
                getSearch(`${this.props.APIRequest}&aggFunc=count`)]).then(responses => {
                    this.setState({
                        data: responses[0].data,
                        loading: false,
                        loadedNewPage: false,
                        error: false,
                        items: responses[1].data.count,
                        pages: Math.ceil(responses[1].data.count / itemsOnPage),
                        itemsLoaded: true
                    });
                    this.props.componentDownloadHasCompleted();
                }).catch(() => this.onError());
        } else {
            getSearch(`${this.props.APIRequest}&start=${(activePage - 1) * itemsOnPage}&count=${itemsOnPage}`).then(responses => {

                this.setState({
                    data: responses.data,
                    loading: false,
                    error: false,
                    loadedNewPage: false
                });
                this.props.componentDownloadHasCompleted();
            }).catch(() => this.onError());
        }
    }

    handlePaginationChange = (e, page) => {
        if (this.state.activePage != page) {
            this.setState({ activePage: page, loading: true, loadedNewPage: true });
            this.loadingData(page);
        }

    }

    render() {
        const { data, loading, error, pages, activePage, items, loadedNewPage } = this.state;
        const { allEssence, translate } = this.props;
        let itemsOnPage = allEssence ? this.state.itemsOnMainPage : this.state.itemsOnPage;

        const hasData = !(loading || error);
        const errorMessage = error ? <div className="alert alert-light">{translate('errorOccurredWhileSearching')} "{this.props.title}"</div> : null;
        const spinner = loadedNewPage ? <div className="d-flex justify-content-center">
            <div className={`spinner-border text-color`}>
            </div>
        </div> : null;

        const content = hasData ? <div>
            <SearchListView data={data}
                textSearch={this.props.textSearch}
                title={this.props.title}
                query={this.props.query}
                items={items}
                itemsOnPage={itemsOnPage}
                url={this.props.url}
                activePage={activePage}
                pages={pages}
                handlePaginationChange={this.handlePaginationChange}
                setessence={this.props.action}
                allEssence={allEssence}
                props={this.props} />
        </div> : null;

        return (
            <div>
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }

};

const SearchListView = ({ textSearch, data, url, title, query, items, itemsOnPage, activePage, pages, handlePaginationChange, allEssence, props }) => {
    const { translate } = props;
    let index = 1;

    return (
        <div>
            {(items > 0) ?
                <React.Fragment>
                    <div className="px-2">
                        <h2 className="post-title title-large text-color">
                            <strong>{title}</strong>
                        </h2>
                    </div>
                    <ol className="page-contents">
                        {data.length > 0 ? index = data.map(item =>
                            <li key={item[Object.keys(item)[0]].toString()}>
                                <div className="d-flex resultItem">
                                    <div className="text-muted counter">
                                        <p>{(activePage - 1) * itemsOnPage + (index++)}</p>
                                    </div>
                                    <Item textSearch={textSearch}
                                        translate={translate}
                                        key={item[Object.keys(item)[0]].toString()}
                                        id={item.id || null}
                                        title={item.title || null}
                                        content={item.content || null}
                                        date={item.date || null}
                                        url={item.urlparams ? url + item.urlparams: url} />
                                </div>
                            </li>
                        ) :
                            <li></li>
                        }
                    </ol>
                    {(allEssence & items > itemsOnPage) ?
                        <div className="d-flex flex-row-reverse ">
                            <div className="detail_link_img m-2"></div>
                            <Link className="btn btn-link post-title title-large m-2" to={`${query}`}><h5 className="text-dark">{translate('moreOnTheTopic')} {title} </h5></Link>
                        </div> : null}

                    {(!allEssence & items > itemsOnPage) ?
                        <Pagination
                            defaultPage={1}
                            count={+pages}
                            page={+activePage}
                            onChange={handlePaginationChange}
                            size={'medium'}
                        /> : null}
                    <hr />
                </React.Fragment> : null}

        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        items: state
    };
};

const mapDispatchToProps = {
    AddInformation,
    Clean
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SearchList));