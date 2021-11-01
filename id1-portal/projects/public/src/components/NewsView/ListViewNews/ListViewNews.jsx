import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { formatDate } from "../../../services/helpers.js"

import "./ListViewNews.css";

class ListViewNews extends Component {
    render() {
        const { news, locateForURL } = this.props;
        return (
            <div className="list-view-news">
                <div className="list-view-news-date">
                    {formatDate(news.published_date, this.props.translate('localeCode'))}
                </div>
                <h3 className="list-view-news-title" >
                    <Link to={`${locateForURL}/news/${news.id}`}>
                        {news.title}
                    </Link>
                </h3>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        locateForURL: `/${state.Intl.locale}`
    };
};

export default connect(mapStateToProps)(withTranslate(ListViewNews));