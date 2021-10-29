import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { Link } from 'react-router-dom';
import RubricButton from "./rubricButton.jsx";
import { connect } from 'react-redux'
import { formatDate } from "../../services/helpers.js"

class BigViewNews extends Component {
    render() {
        const { news, locateForURL, language } = this.props;
        return (
            <div className="post-overaly-style clearfix bigViewNews">

                <div className="post-thumb resized-img-container">
                    <a href={`${locateForURL}/news/${news.id}`}>
                        <img className=""
                            src={news.main_picture}
                            alt={news.title}
                            title={news.title}
                            className="responsive-image"
                        />
                    </a>
                </div>

                <div className="w-100 post-content">

                    <RubricButton rubric={news.rubric} ></RubricButton>

                    <h3 className="text-white post-title line-clampNews weight">
                        <Link to={`${locateForURL}/news/${news.id}`}>
                            {news.title}
                        </Link>
                    </h3>
                    <div className="post-meta">
                        <span className="post-date">
                            {formatDate(news.published_date, this.props.translate('localeCode'))}</span>
                    </div>
                </div>

            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        locateForURL: `/${state.Intl.locale}`,
        language: state.Intl.locale,
    };
};

export default connect(mapStateToProps)(withTranslate(BigViewNews));