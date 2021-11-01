import React from 'react';
import SmallViewNews from '../../NewsView/SmallViewNews/SmallViewNews.jsx';
import BigViewNews from '../../NewsView/BigViewNews/BigViewNews.jsx';
import { withTranslate } from 'react-redux-multilingual';
import { cutNews } from '../../../services/helpers';
import { TabHeader } from '../../ReExportComponents.js'
const shortid = require('shortid');

const PairedBlock = ({ newsByRubric, translate }) =>
    <div className="paired-block">

        <div className="row">
            {newsByRubric.map((newsList) => {
                if (!newsList || newsList.length == 0) return;
                const mainNews = newsList[0];
                const newsListWithoutMain = cutNews(newsList, 'rubric').slice(1);
                const rubric = mainNews.rubric ? mainNews.rubric.title : translate('withoutRubrics')
                return (
                    <div key={shortid.generate()} className="col-lg-6 col-md-6">
                        <TabHeader title={rubric} />

                        <BigViewNews news={mainNews} className="d-none d-md-block mb-3" />

                        <ul className="list-unstyled">
                            <li className="d-block d-md-none">
                                <SmallViewNews news={mainNews} />
                            </li>
                            {
                                newsListWithoutMain.map((news) => (
                                    <li key={news.id}>
                                        <SmallViewNews news={news} />
                                    </li>
                                ))}
                        </ul>

                    </div>
                );
            })}
        </div>
    </div>


export default withTranslate(PairedBlock);
