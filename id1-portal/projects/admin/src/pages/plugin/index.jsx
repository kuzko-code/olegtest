import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import PluginsList from "./pluginsList.jsx"
//component
import SectionHeader from '../../components/header/SectionHeader.jsx';
//style
import "../../../public/assets/css/general.css"

class Plugin extends Component {

    render() {
        const { translate } = this.props;

        return (
            <div className="pagePlugins">
                <SectionHeader title={translate('plugins')} />
                <div className="wrapper wrapperContent animated fadeInRight">
                    <PluginsList></PluginsList>
                </div>
            </div>
        )
    }
}

export default (withTranslate(Plugin));
