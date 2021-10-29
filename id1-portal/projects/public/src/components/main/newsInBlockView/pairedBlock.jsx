import React from 'react';
import SmallViewNews from '../../news/smallViewNews.jsx';
import BigViewNews from '../../news/bigViewNews.jsx';
import { withTranslate } from 'react-redux-multilingual';
import { cutNews } from '../../../services/helpers';
import TabHeader from '../tabHeader.jsx'
const shortid = require('shortid');

const PairedBlock = ({ newsByRubric, translate }) =>
    <div className="SecondaryRubricNews">
        <div className="block" >
            <div className="row">
                {newsByRubric.map((newsList) => {
                    if (!newsList || newsList.length == 0) return;
                    const mainNews = newsList[0];
                    const newsListWithoutMain = cutNews(newsList, 'rubric').slice(1);
                    const rubric = mainNews.rubric ? mainNews.rubric.title : translate('withoutRubrics')
                    return (
                        <div key={shortid.generate()} className="col-lg-6 col-md-6 color-theme">
                            <TabHeader title={rubric} />
                            <div>
                                <BigViewNews news={mainNews} />
                            </div>
                            <div className="post-block-style post-float clearfix mobileHeadNewsByRubrics">
                                <SmallViewNews news={mainNews} colorThemeTextSmall='post-title title-small line-clampNews weight' />
                            </div>
                            <div className="list-post-block">
                                <ul className="list-post">
                                    {
                                        newsListWithoutMain.map((news) => (
                                            <li key={'LiSecondaryRubricLi' + news.id} className="clearfix">
                                                <SmallViewNews
                                                    news={news}
                                                    colorThemeTextSmall='post-title title-small line-clampNews weight' />
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>


export default withTranslate(PairedBlock);
