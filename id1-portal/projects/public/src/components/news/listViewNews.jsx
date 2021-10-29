import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {formatDate} from "../../services/helpers.js"


class listViewNews extends Component {
    render() {
        const { news, locateForURL, language } = this.props;
        return (
            <div className="post-block-style post-float clearfix">
                <div className="post-content">
                    <div className="post-meta">
                        <span className="post-date">
                            {formatDate(news.published_date, this.props.translate('localeCode'))}
                        </span>
                    </div>
                    <h3 className="post-title title-small line-clampNews font-weight-normal" >
                        <Link to={`${locateForURL}/news/${news.id}`}>
                            {news.title}
                        </Link>
                    </h3>

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

export default connect(mapStateToProps)(withTranslate(listViewNews));