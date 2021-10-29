import React from 'react';
import SmallViewNews from '../../news/smallViewNews.jsx';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../services/helpers';
import TabHeader from '../tabHeader.jsx'

const IndependentBlock = ({ newsList, translate, locateForURL }) => {
    if (!newsList || newsList.length == 0) return;
    const mainNews = newsList[0];
    const newsListWithoutMain = newsList.slice(1);
    const rubric = mainNews.rubric ? mainNews.rubric.title : translate('withoutRubrics')
    return (
        <div className="MainRubricNews">
            <div className="featured-tab color-theme">
                <TabHeader title={rubric} />
                <div className="tab-content">
                    <div className="tab-pane animated fadeInRight active mb-3">
                        <div className="row">
                            <div key={'rubricNewsMainFirst' + mainNews.id} className="col-lg-6 col-md-6">
                                <div className="post-overaly-style clearfix">
                                    <div className="post-thumb resized-img-container">
                                        <Link to={`${locateForURL}/news/${mainNews.id}`}>
                                            <img
                                                className="img-fluid responsive-image"
                                                src={mainNews.main_picture}
                                                alt={mainNews.title}
                                                title={mainNews.title}
                                            />
                                        </Link>
                                    </div>
                                </div>
                                <div className="post-content post-content-odd-posts">
                                    <h2 className="post-title title-small line-clampNews weight">
                                        <Link to={`${locateForURL}/news/${mainNews.id}`}>
                                            {mainNews.title}
                                        </Link>
                                    </h2>
                                    <div className="post-meta">
                                        <span className="post-date">
                                            {formatDate(
                                                mainNews.published_date,
                                                translate('localeCode')
                                            )}
                                        </span>
                                    </div>
                                    <Link to={`${locateForURL}/news/${mainNews.id}`}>
                                        <button
                                            type="button"
                                            className='text-white mt-2 btn paddingblue bg-color'
                                        >
                                            {translate('showMore')}
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6">
                                <div className="list-post-block">
                                    <ul className="list-post">
                                        {newsListWithoutMain.map((news) => (
                                            <li key={'rubricNewsMainViewSecond' + news.id} className="clearfix">
                                                <SmallViewNews
                                                    news={news}
                                                    colorThemeTextSmall='post-title title-small line-clampNews weight'
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        locateForURL: state.Intl.locale,
    };
};

export default connect(mapStateToProps)(withTranslate(IndependentBlock));
