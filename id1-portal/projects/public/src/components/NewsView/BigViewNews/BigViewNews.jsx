import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { Link } from 'react-router-dom';
import RubricButton from "../../RubricButton/RubricButton.jsx";
import { connect } from 'react-redux'
import { formatDate } from "../../../services/helpers.js"

import "./BigViewNews.css";

class BigViewNews extends Component {
    render() {
        const { news, className, locateForURL } = this.props;
        return (
            <div className={"big-view-news " + (className || "")}>
                <div className="big-view-news-thumb">
                    <Link to={`${locateForURL}/news/${news.id}`}>
                        <img src={news.main_picture}
                            alt={news.title}
                            title={news.title}
                        />
                    </Link>
                </div>
                <div className="big-view-news-content">
                    <RubricButton rubric={news.rubric} className="big-view-news-rubric" />
                    <h3 className="big-view-news-title">
                        <Link to={`${locateForURL}/news/${news.id}`}>
                            {news.title}
                        </Link>
                    </h3>
                    <div className="big-view-news-date">
                        {formatDate(news.published_date, this.props.translate('localeCode'))}
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        locateForURL: `/${state.Intl.locale}`
    };
};

export default connect(mapStateToProps)(withTranslate(BigViewNews));