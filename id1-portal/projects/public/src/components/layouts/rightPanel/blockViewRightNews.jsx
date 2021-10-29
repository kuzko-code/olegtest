import React, { Component } from 'react';
import classnames from 'classnames';
import BigViewNews from "../../news/bigViewNews.jsx";
import SmallViewNews from "../../news/smallViewNews.jsx";

class BlockViewRightNews extends Component {

    render() {
        const { news } = this.props;

        var colorThemeTextSmall = classnames({
            'post-title': true,
            'title-small line-clampNews weight': true
        });
        const MainNews = news[0];
        var tempNews = [...news];
        tempNews = tempNews.splice(1);
        return (
            <React.Fragment>
                <div className="right-block-big">
                    <BigViewNews news={MainNews} />
                </div>
                <div className="right-block-big-ipad">
                    <div className="row">
                        <div className={tempNews.length > 0 ? "col" : "col-6"}>
                            <BigViewNews news={MainNews} />
                        </div>
                        {
                            tempNews.length > 0 &&
                            <div className="col ipad-view-big">
                                <BigViewNews news={tempNews[0]} />
                            </div>
                        }
                    </div>
                </div>
                <div className="list-post-block mobileMainPopularNews">
                    <div className="list-post">

                        <SmallViewNews news={MainNews}
                            colorThemeTextSmall={colorThemeTextSmall} />
                    </div>
                </div>
                <div className="list-post-block">
                    <ul className="list-post">
                        {tempNews.map(news => (
                            <li key={"SecondaryPopularNews" + news.id} className="clearfix">
                                <SmallViewNews news={news}
                                    colorThemeTextSmall={colorThemeTextSmall} />
                            </li>
                        ))}
                    </ul>
                    <ul className="list-post list-post-ipad">
                        {tempNews.splice(1).map(news => (
                            <li key={"SecondaryPopularNews" + news.id} className="clearfix">
                                <SmallViewNews news={news}
                                    colorThemeTextSmall={colorThemeTextSmall} />
                            </li>
                        ))}
                    </ul>
                </div>
            </React.Fragment>
        )
    }
}

export default BlockViewRightNews;
