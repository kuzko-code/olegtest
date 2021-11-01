import React from 'react';
import SmallViewNews from '../../NewsView/SmallViewNews/SmallViewNews.jsx';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../services/helpers';
import { TabHeader } from '../../ReExportComponents.js'
import "./IndependentBlock.css"

const IndependentBlock = ({ newsList, translate, locateForURL }) => {
    if (!newsList || newsList.length == 0) return;
    const mainNews = newsList[0];
    const newsListWithoutMain = newsList.slice(1);
    const rubric = mainNews.rubric ? mainNews.rubric.title : translate('withoutRubrics')
    return (
        <div className="independent-block">
            <TabHeader title={rubric} />
            <div className="row">
                <div className="col-lg-6 col-md-6">
                    <div className="independent-block-thumb d-none d-md-block">
                        <Link to={`${locateForURL}/news/${mainNews.id}`}>
                            <img
                                className="img-fluid responsive-image"
                                src={mainNews.main_picture}
                                alt={mainNews.title}
                                title={mainNews.title}
                            />
                        </Link>
                    </div>
                    <div className="independent-block-content d-none d-md-block">
                        <h3 className="independent-block-title">
                            <Link to={`${locateForURL}/news/${mainNews.id}`}>
                                {mainNews.title}
                            </Link>
                        </h3>
                        <div className="independent-block-date">
                            {formatDate(
                                mainNews.published_date,
                                translate('localeCode')
                            )}
                        </div>
                        <Link className="independent-block-btn" to={`${locateForURL}/news/${mainNews.id}`}>
                            {translate('showMore')}
                        </Link>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6">
                    <ul className="list-unstyled">
                        <li className="d-block d-md-none">
                            <SmallViewNews news={mainNews} />
                        </li>
                        {newsListWithoutMain.map((news) => (
                            <li key={news.id}>
                                <SmallViewNews news={news} />
                            </li>
                        ))}
                    </ul>
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
