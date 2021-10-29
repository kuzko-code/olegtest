import React from 'react';
import SectionHeader from '../../components/header/SectionHeader.jsx';
import TelegramBot from './telegram-bot.jsx';
import FacebookBot from './facebook-bot.jsx';
import FacebookPlugins from './facebook-plugins.jsx';
import { useTranslate } from 'react-redux-multilingual';
import '../../../public/css/social-networks.css'

const SocialNetworks = (props) => {
    const translate = useTranslate();

    return (
        <div>
            <SectionHeader title={translate("settingSocialNetworks")} />
            <div className="socialNetworks">
                <div className="wrapper wrapperContent animated fadeInRight">
                    <div className="row">
                        <div className="col-lg-12">
                                <div className="px-15">
                                    <ul className="nav nav-tabs" role="tablist">
                                        <li className="nav-item">
                                            <a className={`nav-link text-secondary font-weight-600 active`}
                                                data-toggle="tab"
                                                href="#tab-1">{translate("telegram_bot")}</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className={`nav-link text-secondary font-weight-600`}
                                                data-toggle="tab"
                                                href="#tab-2">{translate('facebook_bot')}</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className={`nav-link text-secondary font-weight-600`}
                                                data-toggle="tab"
                                                href="#tab-3">{translate('facebook_plugins')}</a>
                                        </li>
                                    </ul>
                                    <div className="tab-content max-w-800px no-gutters">
                                        <div role="tabpanel" id="tab-1"
                                            className={`tab-pane border-top-0 border-radius-2px bg-white col-md-11 active`}>
                                            <TelegramBot />
                                        </div>
                                        <div role="tabpanel" id="tab-2"
                                            className={`tab-pane border-top-0 border-radius-2px bg-white col-md-11`}>
                                            <FacebookBot />
                                        </div>
                                        <div role="tabpanel" id="tab-3"
                                            className={`tab-pane border-top-0 border-radius-2px bg-white col-md-11`}>
                                            <FacebookPlugins />
                                        </div>
                                    </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SocialNetworks;
