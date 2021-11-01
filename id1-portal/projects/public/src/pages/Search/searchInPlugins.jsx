import React, { Component } from 'react';
import { AddInformation, Clean } from '../../redux/search/actions.js';
import SearchList from "./searchList.jsx"
import Spinner from "../../components/Spinner/Spinner.jsx"
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';


class SearchInPlugins extends Component {
    constructor(props) {
        super(props);

        const essence = this.props.essence;
        const { translate, pluginsInfo } = this.props;
        let pluginsEssnece = this.getEssence(pluginsInfo);      


        if (essence && essence != 'news') {
            pluginsEssnece = pluginsEssnece.filter(pluginEssence => pluginEssence.name === essence);
            if(pluginsEssnece.length > 0)
            this.props.pluginsNameChange(pluginsEssnece[0].displayName);
        } else if(essence && essence == 'news'){
            pluginsEssnece = [];
            this.props.pluginsNameChange(translate('news'));
        }

        this.state = {
            pluginsInfo: pluginsEssnece,
            loading: true,
            error: false,
            essence: this.props.essence,
            redirect: false
        };
    };

    componentDidCatch() { }

    componentDownloadHasCompleted = () => {
        this.setState({
            loading: false
        });
    };

    getEssence = (plugins) => {
        var pluginsInfo = [];
        var {translate, textSearch, language } = this.props;
        
        plugins.map(plugin => {
            if (plugin.searchParams) {
                plugin.searchParams ? plugin.searchParams.map((item, i) => {  
                    var pluginName = item.translateTitle && translate(item.translateTitle) ? translate(item.translateTitle) : plugin.displayName;

                    const temp = {
                        'searchRequesr': `${item.routeAPI}&search=${textSearch}&language=${language}`,
                        'displayName': pluginName,
                        'name': plugin.name + item.title,
                        'url': item.pageUrl
                    }
                    pluginsInfo.push(temp);
                }) : null;
            }
        });

        return pluginsInfo;
    };

    onError = (err) => {
        this.setState({
            error: true,
            loading: false
        });
    };

    render() {
        const { pluginsInfo, essence, loading, error } = this.state;
        let { textSearch, items, language, translate, locateForURL } = this.props;

        let APIRequestNews = `/news?search=${textSearch}&searchKeys=title,content&language=${language}&sortDirection=desc&sortField=published_date&isPublished=true&fields=id,title,content,published_date`;
        let allEssence = (essence === 'undefined' || essence == null) ? true : false;

        let SearchNewsList = (essence === 'news' || allEssence) ? <SearchList
            textSearch={textSearch}
            APIRequest={APIRequestNews}
            title={translate('news')}
            name={"1news"}
            url={`${locateForURL}/news`}
            allEssence={allEssence}
            query={`${locateForURL}/search/news?key=${textSearch}`}
            componentDownloadHasCompleted={this.componentDownloadHasCompleted} /> : null;


        const spinner = loading ? <Spinner/> : null;
        return (
            <React.Fragment>
                <SearchInformation items={items} props={this.props}></SearchInformation>
                {SearchNewsList}
                {pluginsInfo.length > 0 ? pluginsInfo.map(pluginsInfo =>
                    <React.Fragment key={pluginsInfo.name}>
                        <SearchList key={pluginsInfo.name}
                            textSearch={textSearch}
                            APIRequest={pluginsInfo.searchRequesr}
                            title={pluginsInfo.displayName}
                            name={pluginsInfo.name}
                            url={locateForURL + pluginsInfo.url}
                            allEssence={allEssence}
                            query={`${locateForURL}/search/${pluginsInfo.name}?key=${textSearch}`}
                            componentDownloadHasCompleted={this.componentDownloadHasCompleted} />
                    </React.Fragment>
                ) : null
                }
                {spinner}
            </React.Fragment>
        )
    }
};

const SearchInformation = ({ items, props }) => {
    const { translate } = props;
    var count = 0;
    items.forEach(element => count += parseInt(element.count));
    return (
        <div className="m-2">
            <br />
            {translate('searchResults')}: {count}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        items: state.reducerSearch,
        layout: state.reducerSettings.Layout,
        language: state.Intl.locale,
        pluginsInfo: state.reducerPlugins,
        locateForURL: `/${state.Intl.locale}`,
    };
};

const mapDispatchToProps = {
    AddInformation,
    Clean
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SearchInPlugins));