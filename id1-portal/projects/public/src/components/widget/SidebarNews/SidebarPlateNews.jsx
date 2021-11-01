import React, { Component } from 'react';
import BigViewNews from "../../NewsView/BigViewNews/BigViewNews.jsx";
import SmallViewNews from "../../NewsView/SmallViewNews/SmallViewNews.jsx";

class SidebarPlateNews extends Component {

    render() {
        const { news } = this.props;

        const MainNews = news[0];
        var tempNews = [...news];
        tempNews = tempNews.splice(1);
        return (
            <React.Fragment>
                <div className="d-none d-lg-block">
                    <BigViewNews news={MainNews} className="mb-3" />
                </div>
                <div className="d-none d-md-block d-lg-none mb-3">
                    <div className="row">
                        <div className={tempNews.length > 0 ? "col" : "col-6"}>
                            <BigViewNews news={MainNews} />
                        </div>
                        {
                            tempNews.length > 0 &&
                            <div className="col">
                                <BigViewNews news={tempNews[0]}/>
                            </div>
                        }
                    </div>
                </div>
                <SmallViewNews news={MainNews} className="d-block d-md-none" />
                {tempNews.map(news => (
                    <SmallViewNews key={news.id} news={news}  className="d-block d-md-none d-lg-block" />
                ))}
                {tempNews.splice(1).map(news => (
                    <SmallViewNews key={news.id} news={news} className="d-none d-md-block d-lg-none" />
                ))}
            </React.Fragment>
        )
    }
}

export default SidebarPlateNews;
