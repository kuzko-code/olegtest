import React, { Component } from 'react';
import ListViewNews from "../../news/listViewNews.jsx";

class ListViewRightNews extends Component {

    render() {
        const { news } = this.props;

        return (
            <React.Fragment>
               <div className="list-post-block ListViewNews mt-0">
                    <ul className="list-post">
                      {news.map(news => (
                        <li key={"LiSecondaryListRightNewsLi" + news.id} className="clearfix h-auto">
                              <ListViewNews
                                  key={news.id}
                                  news={news} />
                        </li>))}
                    </ul>
                  </div>        
                </React.Fragment>
        )
    }
}

export default ListViewRightNews;
