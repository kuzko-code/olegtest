import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { Link } from 'react-router-dom';
import AspectRatio from 'react-aspect-ratio';
import { connect } from 'react-redux';
import { formatDate } from '../../../services/helpers';
import "./SmallViewNews.css";

class SmallViewNews extends Component {
  render() {
    const { news, className, locateForURL } = this.props;
    return (
      <div className={"small-view-news " + (className || "")}>
        <AspectRatio ratio="100/75" style={{ maxWidth: '100px' }}>
          <div className="small-view-news-thumb" style={{ height: '75px' }}>
            <Link to={`${locateForURL}/news/${news.id}`} >
              <div className="img-container">
                <img
                  src={news.main_picture}
                  alt={news.title}
                  title={news.title}
                  className="responsive-image"
                />
              </div>
            </Link>
          </div>
        </AspectRatio>
        <div className="small-view-news-content">
          <h3 className="small-view-news-title">
            <Link to={`${locateForURL}/news/${news.id}`}>{news.title}</Link>
          </h3>
          <div className="small-view-news-date">
            {formatDate(
              news.published_date,
              this.props.translate('localeCode')
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    locateForURL: `/${state.Intl.locale}`,
  };
};

export default connect(mapStateToProps)(withTranslate(SmallViewNews));
