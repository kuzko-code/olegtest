import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { Link } from 'react-router-dom';
import RubricButton from "../../RubricButton/RubricButton.jsx";
import { connect } from 'react-redux';

import './MiddleViewNews.css'

class MiddleViewNews extends Component {
    render() {
        const { news, locateForURL } = this.props;
        var optionsTime = { hour: 'numeric', minute: 'numeric', hour12: false };
        var optionsDate = { day: 'numeric', month: 'numeric', year: 'numeric' };
        return (
            <div key={news.id} className="middle-view-news">
                <div className="row">
                    <div className="col-lg-5 col-md-6">
                        <div className="middle-view-news-thumb">
                            <Link to={`${locateForURL}/news/${news.id}`}>
                                <div className="img-container">
                                    <img src={news.main_picture} alt={news.title} title={news.title} />
                                </div>
                            </Link>
                            <RubricButton rubric={news.rubric} className="middle-view-news-rubric"></RubricButton>
                        </div>
                    </div>

                    <div className="col-lg-7 col-md-6">
                        <div className="middle-view-news-content">
                            <h2 className="middle-view-news-title">
                                <Link to={`${locateForURL}/news/${news.id}`}>{news.title}</Link>
                            </h2>
                            <div className="middle-view-news-date">
                                {((new Date(news.published_date)).toLocaleString("uk-UA", optionsDate)).toString() + " " +
                                    ((new Date(news.published_date)).toLocaleString("uk-UA", optionsTime)).toString()}
                            </div>
                            <p className="middle-view-news-description">{news.description}</p>
                        </div>
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

export default connect(mapStateToProps)(withTranslate(MiddleViewNews));