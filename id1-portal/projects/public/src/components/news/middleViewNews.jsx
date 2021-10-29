import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { Link } from 'react-router-dom';
import RubricButton from "./rubricButton.jsx";
import { connect } from 'react-redux';


class MiddleViewNews extends Component {
    render() {
        const { news, locateForURL } = this.props;
        var optionsTime = { hour: 'numeric', minute: 'numeric', hour12: false };
        var optionsDate = { day: 'numeric', month: 'numeric', year: 'numeric' };
        return (
            <div key={news.id} className="post-block-style post-list clearfix">
                <div className="row">
                    <div className="col-lg-5 col-md-6 news-list-images">
                        <div className="post-thumb thumb-float-style card">
                            <Link to={`${locateForURL}/news/${news.id}`} className="backround img-fluid">
                                <div className="img-container imgsliderElement newslist-image">
                                    <img src={news.main_picture} alt={news.title} title={news.title} className="responsive-image"/>
                                </div>
                            </Link>
                            <RubricButton rubric={news.rubric} ></RubricButton>
                        </div>
                    </div>

                    <div className="col-lg-7 col-md-6 news-list-post-content">
                        <div className="post-content">
                            <h2 className="post-title title-large">
                                <Link to={`${locateForURL}/news/${news.id}`}>{news.title}</Link>
                            </h2>
                            <div className="post-meta">
                                <span className="post-date">{((new Date(news.published_date)).toLocaleString("uk-UA", optionsDate)).toString() + " " + ((new Date(news.published_date)).toLocaleString("uk-UA", optionsTime)).toString()}</span>
                            </div>
                            <p className="post-preview">{news.description}</p>
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