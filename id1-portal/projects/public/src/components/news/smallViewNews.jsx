import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { Link } from 'react-router-dom';
import AspectRatio from 'react-aspect-ratio';
import { connect } from 'react-redux';
import { formatDate } from '../../services/helpers';

class smallViewNews extends Component {
  render() {
    const { news, colorThemeTextSmall, locateForURL } = this.props;
    return (
      <div className="post-block-style post-float clearfix">
        <AspectRatio ratio="100/75" style={{ maxWidth: '100px' }}>
          <div className="post-thumb sub-img-grid" style={{ height: '75px' }}>
            <Link
              to={`${locateForURL}/news/${news.id}`}
              className="img-fluid"
            >
              <div className="resized-img-container">
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
        <div className="post-content">
          <h3 className={colorThemeTextSmall}>
            <Link to={`${locateForURL}/news/${news.id}`}>{news.title}</Link>
          </h3>
          <div className="post-meta">
            <span className="post-date">
              {formatDate(
                news.published_date,
                this.props.translate('localeCode')
              )}
            </span>
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

export default connect(mapStateToProps)(withTranslate(smallViewNews));
