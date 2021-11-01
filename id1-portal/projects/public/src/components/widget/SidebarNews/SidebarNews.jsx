import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { getLatestNews, getPopularNews } from "../../../services/index.js"
import SidebarPlateNews from "./SidebarPlateNews.jsx"
import ListViewNews from "../../NewsView/ListViewNews/ListViewNews.jsx"
import LinkToAllNews from "../linkToAllNews.jsx"
import { TabHeader } from '../../ReExportComponents.js'
class SidebarNews extends Component {
    constructor(props) {
        super(props);
        this.state = {
            news: []
        };
    }

    componentDidMount() {
        const { language, title, form_data } = this.props;
        if (title === "popularNews") {
            getPopularNews(form_data.numberOfNews, language).then(res => {
                this.setState({ news: res.data })
            })
        }
        else if (title === "latestNews") {
            getLatestNews(form_data.numberOfNews, language).then(res => {
                this.setState({ news: res.data })
            })
        }
    }

    render() {
        const { translate, title, form_data } = this.props;
        let { news } = this.state;

        let hasData = !(news.length === 0);
        var content = null;
        if (hasData) {
            let bannerTranslateName = title.concat("TabTranslateName");

            content = <React.Fragment>
                <TabHeader title={translate(bannerTranslateName)} />
                {
                    (form_data.typeOfView === "block") &&
                    <SidebarPlateNews news={news} />
                }
                {
                    (form_data.typeOfView === "list") &&
                    <div className="list-news">
                        {news.map(news => <ListViewNews key={news.id} news={news} />)}
                    </div>

                }
                {
                    form_data.showLinksToAllNews &&
                    <div className="mt-10">
                        <LinkToAllNews className="justify-content-end" />
                    </div>
                }
            </React.Fragment>
        }
        return (
            <div className="sidebar-news">
                {content}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.Intl.locale
    };
};

export default connect(mapStateToProps)(withTranslate(SidebarNews));