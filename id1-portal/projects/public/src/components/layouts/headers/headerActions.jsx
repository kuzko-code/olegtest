import React, { Component } from 'react'
import classnames from 'classnames';
import { withTranslate, IntlActions } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import actions from '../../../redux/general/generalActions';
import { withRouter } from "react-router-dom";
import LanguageButton from "./languageButton.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GovSites from './govSites.jsx';
import CustomLink from '../../util/CustomLink.jsx'

class HeaderActions extends Component {

    constructor(props) {
        super(props);
    }

    tgs = new Array('body', 'div', 'div', 'div', 'a', 'p', 'h2');
    szs = new Array('55%', '65%', '80%', '100%', '120%', '150%', '200%');
    startSz = 3;
    size(trgt, inc) {

        var cEl = null;
        var sz = this.startSz;
        sz += inc;
        if (sz < 0) sz = 0;
        if (sz > 6) sz = 6;
        this.startSz = sz;
        localStorage.setItem("lowvisionStartSz", this.startSz)
        cEl = document.querySelectorAll(trgt);
        for (var c = 0; c < cEl.length; c++) {
            cEl[c].style.fontSize = this.szs[sz];

        }
        this.props.callResize ? this.props.callResize() : null

    }

    handleSignIn = () => {
        this.props.closeDrawer();
        this.props.user.isAuth ? this.props.history.push('/myaccount') :
            this.props.showAuthModal()
    }

    render() {
        const { translate, user } = this.props;
        let actionsULClassnames = classnames(this.props.className, {
            'actions': true
        });
        return (
            <ul className={actionsULClassnames}>
                <li>
                    <button className="header__signInBtn" type="button" onClick={this.handleSignIn}>
                        <FontAwesomeIcon icon={['fas', "user-circle"]} className="actionsHeaderIcon" />
                        <span>{user.isAuth ? user.first_name + ' ' + user.last_name : translate('logInToAccount')}</span>
                    </button>
                </li>

                <li className="font-size-btns">
                    <div className="font-size-dec js_font_minus" id="fontInc" onClick={() => this.size('body', -1)}>
                        A-</div>
                    <div className="font-size-inc js_font_plus" id="fontDec" onClick={() => this.size('body', 1)}>
                        A+</div>
                    <div className="clearfix"></div>
                </li>

                <li className="change-version" id="changeVision">
                    <FontAwesomeIcon className="actionsHeaderIcon lowvisionIcon" icon={['fas', "low-vision"]} />
                    <span onClick={() => {
                        this.props.toggleLowVision()
                        this.props.callResize ? this.props.callResize() : null
                    }

                    }>{this.props.isLowVisionOn ? translate('standardVersion') : translate('lowvisionVersion')}</span>
                </li>
                {
                    this.props.Intl.languagesOnSite.length > 1 &&
                    <li className="change-lang">
                        <LanguageButton Intl={this.props.Intl} history={this.props.history}></LanguageButton>
                    </li>
                }

                {
                    this.props.settings.Layout.siteOldVersion !== undefined &&
                    this.props.settings.Layout.siteOldVersion !== null &&
                    this.props.settings.Layout.siteOldVersion.length > 0 &&
                    <li className="old-version" id="oldVision">
                        <FontAwesomeIcon className="actionsHeaderIcon oldVersionIcon" icon={['fas', "history"]} />
                        <CustomLink url={this.props.settings.Layout.siteOldVersion}>
                            <span>{translate('oldVersion')}</span>
                        </CustomLink>
                    </li>
                }

                {this.props.includeGovSites === true && this.props.govSites !== undefined &&
                    <li className="nav-gov-sites mt-auto">
                        <GovSites sites={this.props.govSites} />
                    </li>
                }

            </ul>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        Intl: state.Intl,
        settings: state.reducerSettings,
        user: state.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showAuthModal: () => {
            dispatch(actions.setAuthModalShownTrue());
        },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslate(HeaderActions)));