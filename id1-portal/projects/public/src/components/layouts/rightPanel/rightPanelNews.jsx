import React, { Component } from 'react';
import "../../../../public/assets/css/layout/newspage.css"
import "../../../../public/assets/css/layout/newsform.css";
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { getLatestNews, getPopularNews } from "../../../services/index.js"
import BlockViewRightNews from "./blockViewRightNews.jsx"
import ListViewRightNews from "./listViewRightNews.jsx"
import LinkToAllNews from "../../main/linkToAllNews.jsx"
import TabHeader from '../../main/tabHeader.jsx'
class RightPanelNews extends Component {
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
        const { colorThemeWidget, translate, title, form_data } = this.props;
        let { news } = this.state;

        let hasData = !(news.length === 0);
        var content = null;
        if (hasData) {
            let bannerTranslateName = title.concat("TabTranslateName");

            content = <React.Fragment>
                <TabHeader title={translate(bannerTranslateName)} />
                {
                    (form_data.typeOfView === "block") &&
                    <BlockViewRightNews news={news} />
                }
                {
                    (form_data.typeOfView === "list") &&
                    <ListViewRightNews news={news} />
                }
                {
                    form_data.showLinksToAllNews &&
                    <div className="m-t-10">
                        <LinkToAllNews className="justify-content-end" />
                    </div>
                }
            </React.Fragment>
        }
        return (
            <div className={colorThemeWidget}>
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

export default connect(mapStateToProps)(withTranslate(RightPanelNews));