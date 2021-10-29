import React, { Component } from 'react'
import classList from 'classlist';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as actions from '../../../redux/settings/actions.js';
import SeachForm from "./seachForm.jsx";
import { withRouter } from "react-router-dom";
import Sticky from 'react-sticky-el';
import HeaderActions from './headerActions.jsx';
import HeaderSocials from './headerSocials.jsx';
import CustomLink from '../../util/CustomLink.jsx'

class DichromaticLimitedHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            active: false,
            index: true,
            data: [],
            menu: [],
            sites: [],
            loading: true,
            error: false,
            isSticky: false,
            menuDesktopWasFound: false,
            overflovedItemsList: [],
            activeShowSubmenu: false,
            isntHeaderBottomSticky: true
        };
        this.toggle = this.toggle.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.menuLinkClick = this.menuLinkClick.bind(this);
        this.menuDesktopRef = React.createRef();
    }
    menuDesktop = this.menuDesktopRef;

    toggle() {
        this.setState(prevState => ({
            active: !prevState.active
        }));
    };

    mobileActiveSubmenu = (e) => {
        e.preventDefault();
        if (window.innerWidth <= 991) {

            var list = classList(e.currentTarget.parentElement.parentElement);
            var list1 = document.getElementsByClassName('showSubmenu');
            var list2 = Object.values(list1);
            list2.map(q => classList(q).remove('active'));
            classList(document.getElementById('menu-desktop')).add('active-hidden');
            classList(document.getElementById('searchToggle')).remove('active');
            this.state.activeShowSubmenu === true ? list.remove('active') : list.add('active');
            this.setState({ activeShowSubmenu: !this.state.activeShowSubmenu })
        }
    }

    overflovedActiveSubmenu = (e) => {
        e.preventDefault();
        if (window.innerWidth > 991) {

            var list = classList(e.currentTarget.parentElement.parentElement);
            var list1 = document.getElementsByClassName('showSubmenu');
            var list2 = Object.values(list1);
            list2.map(q => classList(q).remove('active'));
            classList(document.getElementById('menu-desktop')).add('active-hidden');
            classList(document.getElementById('searchToggle')).remove('active');
            this.state.activeShowSubmenu === true ? list.remove('active') : list.add('active');
            this.setState({ activeShowSubmenu: !this.state.activeShowSubmenu })
        }
    }

    active_seach(e) {

        var list1 = document.getElementsByClassName('showSubmenu');
        var list2 = Object.values(list1);
        list2.map(q => classList(q).remove('active'));
        var list = classList(e.currentTarget);
        list.contains('active') ? list.remove('active') : list.add('active');
        document.getElementById('searchToggle').setAttribute("autoFocus", "true")
        e.preventDefault();
    }

    active_seach_mobile(e) {

        var list1 = document.getElementsByClassName('showSubmenu');
        var list2 = Object.values(list1);
        list2.map(q => classList(q).remove('active'));
        var list = classList(e.currentTarget);
        list.contains('active') ? list.remove('active') : list.add('active');
        document.getElementById('searchToggleMobile').setAttribute("autoFocus", "true")
        e.preventDefault();
    }

    menuLinkClick() {
        this.setState({ active: false })
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, false);

        window.onresize = () => {

            this.menuDesktop = this.menuDesktopRef;
            let overflovedItemsList = [];
            if (this.menuDesktop.current !== null) {
                overflovedItemsList = this.checkOverflow();
                this.setState({
                    overflovedItemsList: overflovedItemsList,
                })
            }
            if (document.getElementById("overflovedMenu").style.left === "" && window.innerWidth > 991) {
                overflovedItemsList = this.checkOverflow();
                this.setState({
                    overflovedItemsList: overflovedItemsList,
                })
            }

        }
    }

    componentDidUpdate() {
        this.menuDesktop = this.menuDesktopRef;
        let overflovedItemsList = [];
        if (this.state.menuDesktopWasFound === false && this.menuDesktop.current !== null) {
            overflovedItemsList = this.checkOverflow();
            this.setState({
                overflovedItemsList: overflovedItemsList,
                menuDesktopWasFound: true
            })
        }
    }

    checkOverflow = () => {
        this.menuDesktop = this.menuDesktopRef;
        let overflovedItemsList = [];
        const { menu } = this.props;
        let firstRowLastElementIndex = 0;
        let childrenArray = Array.from(this.menuDesktop.current.children);
        if (this.state.isntHeaderBottomSticky) {
            if (this.menuDesktop.current.getBoundingClientRect().top === 0 && menu && menu.length > 0) { this.callResize() }
        }

        childrenArray.map((children, index) => {
            if (this.menuDesktop.current.getBoundingClientRect().top !== children.getBoundingClientRect().top && firstRowLastElementIndex === 0) {
                firstRowLastElementIndex = index
                this.calcPosition(firstRowLastElementIndex)
            }
            if (this.menuDesktop.current.getBoundingClientRect().top !== children.getBoundingClientRect().top) {
                overflovedItemsList.push(children.innerText)
            }
        })
        return overflovedItemsList;
    }

    callResize = () => {
        window.onresize()
    }

    calcPosition = (firstRowLastElementIndex) => {
        this.menuDesktop = this.menuDesktopRef;
        let firstRowWidth = 0;
        if (this.menuDesktop !== undefined && document.getElementById("overflovedMenu") !== null && document.getElementById("overflovedMenu") !== undefined) {

            let childrenArray = Array.from(this.menuDesktop.current.children);
            childrenArray.slice(0, firstRowLastElementIndex).map(children => {
                firstRowWidth += children.getBoundingClientRect().width;
            })
            firstRowWidth += 20//menu left padding
            document.getElementById("overflovedMenu").style.left = firstRowWidth.toString().concat("px")
        }
    }


    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, false);
    }

    handleClickOutside(event) {
        let showSubmenu = document.getElementById("menu").contains(event.target);

        let linkSubMenu = false;
        try {
            linkSubMenu = classList(event.target).contains('s90');
        } catch { }

        let buttonOpenSearchForm = document.getElementById("form-search").contains(event.target);
        let buttonOpenSearchFormMobile = document.getElementById("form-search-mobile").contains(event.target);
        let formSearch = document.getElementById("searchToggle").contains(event.target);
        let formSearchMobile = document.getElementById("searchToggleMobile").contains(event.target);

        if (!(formSearch || buttonOpenSearchForm)) {
            let showSearch = document.getElementById('searchToggle');
            classList(showSearch).remove('active');
        }
        if (!(formSearchMobile || buttonOpenSearchFormMobile)) {
            let showSearchMobile = document.getElementById('searchToggleMobile');
            classList(showSearchMobile).remove('active');
        }
        if (!showSubmenu || linkSubMenu) {
            let showSubmenu1 = document.getElementsByClassName('showSubmenu');
            for (let res of showSubmenu1) {
                classList(res).remove('active');
            }
        }
    }


    render() {
        const { translate, settings, languages, setErrorPage, pageLoaded, locateForURL, menu, loading, error } = this.props;
        let { overflovedItemsList } = this.state;

        const hasData = !(loading || error);
        if (error) setErrorPage();
        if (hasData) pageLoaded();

        const localesRe = languages.map((item) => item.value).join('|');
        const reString = '^\\/(' + localesRe + ')\\/?$|^\\/$';
        const re = new RegExp(reString, 'gim');
        const match = re.test(location.pathname);

        if (this.state.active) {
            document.querySelector('body').classList.add('disable_scroll');
        } else {
            document.querySelector('body').classList.remove('disable_scroll');
        }

        var menuToggle = classnames({
            'menu-toggle': true,
            'active': this.state.active
        });

        var liColorBG = classnames({
            'menu': true,
            'active': this.state.active,
            'menu-bg-color': true
        });
        var overflovedMenuClassnames = classnames("d-flex allNavItemsDiv", {
            "show": this.state.overflovedItemsList.length > 0
        })

        let nav = null;
        if (hasData)
            nav =
                <div className="header-bg header-bg-color">
                    <div className="wrapper bg-transparent overflow-visible headerBottomPadding">
                        <div className={'header_bottom'} id="headerBottom">
                            <nav className={liColorBG} id="menu">
                                <div id="mobileMenuToggle" className={menuToggle} onClick={this.toggle} >
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                                <ul className="menu__list pagesNavigation hoverMenu" ref={this.menuDesktopRef} id="menu-desktop" >
                                    {menu.map((res, index) => (
                                        <li key={index} className="menu__list-item showSubmenu" ref="showSubmenu">
                                            {res.label.includes(translate('mainPage')) &&
                                                <Link to={`${locateForURL}`} key={res.label} className="s90" onClick={this.menuLinkClick}>{res.label}</Link>}
                                            {!res.label.includes(translate('mainPage')) && res.nodes.map(datas => { }).length === 0 && res.url.length > 0 &&
                                                <CustomLink url={res.url} onClick={this.menuLinkClick} className="s90" >
                                                    {res.label}
                                                </CustomLink>
                                            }
                                            {!res.label.includes(translate('mainPage')) && res.nodes.map(datas => { }).length === 0 && res.url.length < 1 &&
                                                <a className="s90" role="button">{res.label}</a>}
                                            {!res.label.includes(translate('mainPage')) && res.nodes.map(datas => { }).length !== 0 &&
                                                <div>
                                                    <a className="s90" role="button" onClick={this.mobileActiveSubmenu.bind(this)}>{res.label}</a>
                                                    <div className="submenu headerNavItemSubmenu position-lg-fixed">
                                                        <ul className="submenu_list wrapper bg-transparent mx-auto pb-0" >
                                                            {res.nodes.map(datas =>
                                                                <li className="hovergreen" key={datas.key}>
                                                                    <CustomLink url={datas.url} onClick={this.menuLinkClick} className="s90">
                                                                        {datas.label}
                                                                    </CustomLink>
                                                                </li>)}
                                                        </ul>
                                                    </div>
                                                </div>
                                            }
                                        </li>))}
                                </ul>
                                <HeaderActions className="actions_header-mobile d-flex flex-column flex-grow-1 d-lg-none" id="test" isLowVisionOn={this.props.isLowVisionOn} toggleLowVision={this.props.toggleLowVision} closeDrawer={this.menuLinkClick} />

                            </nav>


                            <div className={overflovedMenuClassnames} id="overflovedMenu">

                                <div className="m-auto" id="allItemsIconDiv">
                                    <FontAwesomeIcon className="ml-auto my-auto d-none d-lg-inline-block allNavItemsIcon" color="#fff" icon={['fas', "bars"]} />
                                </div>

                                <ul className="position-fixed pl-0" id="overflowedItemsList">
                                    {menu.slice(overflovedItemsList.length * -1).map((res, index) => (
                                        <li key={index} className="menu__list-item showSubmenu" ref="showSubmenu">
                                            {res.label.includes(translate('mainPage')) &&
                                                <Link to={`${locateForURL}`} key={res.label} className="s90" onClick={this.menuLinkClick}>{res.label}</Link>}
                                            {!res.label.includes(translate('mainPage')) && res.nodes.map(datas => { }).length === 0 && res.url.length > 0 &&
                                                <CustomLink url={res.url} onClick={this.menuLinkClick} className="s90" >
                                                    {res.label}
                                                </CustomLink>
                                            }
                                            {!res.label.includes(translate('mainPage')) && res.nodes.map(datas => { }).length === 0 && res.url.length < 1 &&
                                                <a className="s90" role="button">{res.label}</a>}
                                            {!res.label.includes(translate('mainPage')) && res.nodes.map(datas => { }).length !== 0 &&
                                                <div>
                                                    <a className="s90" role="button" onClick={this.overflovedActiveSubmenu}>{res.label}</a>
                                                    <div className="submenu headerNavItemSubmenu position-lg-fixed">
                                                        <ul className="submenu_list wrapper bg-transparent mx-auto pb-0" >
                                                            {res.nodes.map(datas =>
                                                                <li className="hovergreen" key={datas.key}>
                                                                    <CustomLink url={datas.url} onClick={this.menuLinkClick} className="s90" >
                                                                        {datas.label}
                                                                    </CustomLink>
                                                                </li>)}
                                                        </ul>
                                                    </div>
                                                </div>
                                            }
                                        </li>))}
                                </ul>
                            </div>


                            <div id="customTestDiv">
                                <HeaderSocials />
                                <div className="btn_search-toggle" id="searchToggle" onClick={this.active_seach.bind(this)} >
                                    <div>
                                        <div className="icon" />
                                        <span>
                                            {translate('search')}
                                        </span>
                                    </div>
                                </div>

                                <div className="search_form search_form_new" id="form-search">
                                    <SeachForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

        if (hasData === true) {
            return (
                <section className="p-0 header-bg dichromaticHeader dichromaticLimitedHeader indent-md-x-margin" >
                    <div className="wrapper bg-transparent">

                        <div className="header_content justify-content-center margin-left-10 headerContentPadding">
                            <div id="headerMainLogo">
                                <div className="col col-lg-9 align-self-center pl-0">
                                    <Link to={`${locateForURL}`} className="header_main-link d-lg-inline-flex align-items-center">
                                        {settings.Layout.headerLogo !== undefined ?
                                            <div>
                                                {settings.Layout.headerLogo ? 
                                                <img alt={settings.Layout.siteName} className="header_logo" src={settings.Layout.headerLogo} /> :
                                                <div className="py-4"> </div>}
                                            </div>
                                            : null} <div id="headerMainSiteName">
                                            {match ? <h1 className="header_headline text-lg-left">
                                                {settings.Layout.siteName}
                                            </h1>
                                                : <div className="header_headline text-lg-left">
                                                    {settings.Layout.siteName}
                                                </div>}
                                            <div className="header_siteDescription mt-2 text-center text-lg-left">
                                                {settings.Layout.descriptionForSite}

                                            </div>
                                        </div></Link></div>
                                <div className="col col-lg-3 header-actions d-none d-lg-block">
                                    <HeaderActions className="actions_header d-none d-lg-block mb-0" isLowVisionOn={this.props.isLowVisionOn} toggleLowVision={this.props.toggleLowVision} callResize={this.callResize} closeDrawer={this.menuLinkClick} />
                                </div>
                            </div>

                            <div className="menu-toggle_box d-lg-none d-block">
                                <div id="menuToggle" className={menuToggle} onClick={this.toggle} >
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                            <div className="btn_search-toggle" id="searchToggleMobile" onClick={this.active_seach_mobile.bind(this)} >
                                <div>
                                    <div className="icon" />
                                    <span>
                                        {translate('search')}
                                    </span>
                                </div>
                            </div>

                            <div className="search_form search_form_new" id="form-search-mobile">
                                <SeachForm />
                            </div>
                        </div>
                    </div>

                    {window.innerWidth > 991 ?
                        <Sticky stickyClassName="sticky-nav" onFixedToggle={(isntSticky => this.setState({ isntHeaderBottomSticky: isntSticky }))}>
                            {
                                nav
                            }
                        </Sticky>
                        : nav
                    }
                </section>
            )
        }
        else {
            return (null)
        }
    }
}

const mapStateToProps = (state) => {
    return {
        settings: state.reducerSettings,
        language: state.Intl.locale,
        languages: state.Intl.languagesOnSite,
        locateForURL: `/${state.Intl.locale}`,
    };
};

export default withRouter(connect(mapStateToProps, actions)(withTranslate(DichromaticLimitedHeader)));