import React, { Component } from 'react'
import classList from 'classlist';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import * as actions from '../../../../redux/settings/actions.js';
import { withRouter } from "react-router-dom";
import GovSites from '../GovSites/GovSites.jsx';
import Sticky from 'react-sticky-el';
import HeaderActions from '../HeaderActions/HeaderActions.jsx';
import HeaderSocials from '../HeaderSocials/HeaderSocials.jsx';
import { CustomLink } from '../../../ReExportComponents.js'
import HeaderSearch from '../HeaderSearch/HeaderSearch.jsx';
import Helmet from 'react-helmet';

import "./header.css";
import "./lowvision_header.css";

class MonochromeLimitedHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            active: false,
            index: true,
            data: [],
            isSticky: false,
            showAllNavItems: false,
            hasOverflowedItems: false,
            menuDesktopWasFound: false,
            overflovedItemsList: [],
            currentActiveMenuElement: null,
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

    toggleShowAllItems = () => {
        this.setState({ showAllNavItems: !this.state.showAllNavItems });
    };

    active(e) {
        e.preventDefault();
        var list = classList(e.currentTarget.parentElement.parentElement);
        var list1 = document.getElementsByClassName('showSubmenu');
        var list2 = Object.values(list1);
        list2.map(q => classList(q).remove('active'));
        classList(document.getElementById('menu-desktop')).add('active-hidden');
        classList(document.getElementById('searchToggle')).remove('active');
        var contains = list.contains("active");
        contains ? list.remove('active') : list.add('active');
        this.setState({ currentActiveMenuElement: e.currentTarget })
    }


    menuLinkClick() {
        this.setState({ active: false })
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside2, false);
        document.addEventListener('click', this.handleClickOutside, false);
        if (window.innerWidth > 991) {
            this.setState({
                isSticky: true
            })
        }
        window.onresize = () => {

            if (window.innerWidth > 991) {
                this.setState({
                    isSticky: true
                });
            } else {
                this.setState({
                    isSticky: false
                });
            }
            this.menuDesktop = this.menuDesktopRef;
            let hasOverflowedItems = false;
            if (this.menuDesktop.current !== null) {
                hasOverflowedItems = this.checkOverflow();
                this.setState({
                    hasOverflowedItems: hasOverflowedItems,
                })
            }
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
        let formSearch = document.getElementById("searchToggle").contains(event.target);

        if (!(formSearch || buttonOpenSearchForm)) {
            let showSearch = document.getElementById('searchToggle');
            classList(showSearch).remove('active');
        }
        if (!showSubmenu || linkSubMenu) {
            if (
                (event.target !== this.state.currentActiveMenuElement && linkSubMenu && event.target.hasAttribute("href")) ||
                (event.target !== this.state.currentActiveMenuElement && linkSubMenu && classList(event.target.parentElement).contains('menu__list-item')) ||
                (event.target !== this.state.currentActiveMenuElement && !linkSubMenu)
            ) {
                let showSubmenu1 = document.getElementsByClassName('showSubmenu');
                for (let res of showSubmenu1) {
                    classList(res).remove('active');
                }
            }
        }
    }

    componentDidUpdate(prevProps) {
        this.menuDesktop = this.menuDesktopRef;
        let hasOverflowedItems = false;
        if (this.state.menuDesktopWasFound === false && this.menuDesktop.current !== null || prevProps.menu != this.props.menu && this.menuDesktop.current !== null) {
            hasOverflowedItems = this.checkOverflow();
            this.setState({
                hasOverflowedItems: hasOverflowedItems,
                menuDesktopWasFound: true
            })
        }
    }

    checkOverflow = () => {
        this.menuDesktop = this.menuDesktopRef;
        let hasOverflowedItems = false;
        let firstRowLastElementIndex = 0;
        let childrenArray = Array.from(this.menuDesktop.current.children);
        if (this.state.isntHeaderBottomSticky) {
            if (this.menuDesktop.current.getBoundingClientRect().top === 0) { this.callResize() }
        }
        childrenArray.map((children, index) => {
            children.style.width = "unset"

            if (this.menuDesktop.current.getBoundingClientRect().top !== children.getBoundingClientRect().top && firstRowLastElementIndex === 0) {
                firstRowLastElementIndex = index
                this.calcPosition(firstRowLastElementIndex)
            }
            if (this.menuDesktop.current.getBoundingClientRect().top !== children.getBoundingClientRect().top) {
                hasOverflowedItems = true;
            }
            children.style.width = parseInt(children.getBoundingClientRect().width).toString().concat("px")

        })
        return hasOverflowedItems;
    }

    callResize = () => {
        this.menuDesktop = this.menuDesktopRef;
        if (this.menuDesktop.current !== null) {
            let childrenArray = Array.from(this.menuDesktop.current.children);
            childrenArray.map((children, index) => {
                children.style.width = "unset"
            })
        }
        window.onresize()
    }

    calcPosition = (firstRowLastElementIndex) => {
        this.menuDesktop = this.menuDesktopRef;
        let firstRowWidth = 0;
        if (this.menuDesktop !== undefined && document.getElementById("overflovedArrowBlock") !== null && document.getElementById("overflovedArrowBlock") !== undefined) {

            let childrenArray = Array.from(this.menuDesktop.current.children);
            childrenArray.slice(0, firstRowLastElementIndex).map(children => {
                firstRowWidth += children.getBoundingClientRect().width;
            })
            document.getElementById("overflovedArrowBlock").style.left = firstRowWidth.toString().concat("px")
        }
    }

    render() {
        const { isSticky } = this.state;
        const { translate, settings, languages, setErrorPage, pageLoaded, locateForURL, menu, loading, error } = this.props;
        const hasData = !(loading || error);
        if (error) setErrorPage();
        if (hasData) pageLoaded();

        const localesRe = languages.map(item => item.value).join('|');
        const reString = '^\\/(' + localesRe + ')\\/?$|^\\/$';
        const re = new RegExp(reString, 'gim')
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

        var allNavItemsArrowClassnames = classnames("d-inline-block allNavItemsIcon", {
            'rotate-180 allNavItemsActive': this.state.showAllNavItems,
        });

        var menuDesktopClassnames = classnames("menu__list pagesNavigation", {
            'overflow-hidden': !this.state.showAllNavItems && window.innerWidth > 991,
            'showAllItems': this.state.showAllNavItems
        });
        var overflowArrowBlockClassnames = classnames("arrowBlock position-fixed top-0 d-flex", {
            "show": this.state.hasOverflowedItems
        })

        let nav = null;
        if (hasData)
            nav =
                <div className={isSticky ? 'header_bottom sticky-color' : 'header_bottom'} id="headerBottom">
                    <nav className={liColorBG} id="menu">
                        <div id="mobileMenuToggle" className={menuToggle} onClick={this.toggle} >
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <ul className={menuDesktopClassnames} ref={this.menuDesktopRef} id="menu-desktop" >
                            {menu.map((res, index) => (
                                <li key={index} className="menu__list-item showSubmenu" ref="showSubmenu">
                                    {res.nodes.length > 0 ?
                                        (<div>
                                            <a className="s90" role="button" onClick={this.active.bind(this)}>{res.label}</a>
                                            <div className="submenu">
                                                <ul className="submenu_list row" >
                                                    {res.nodes.map(node =>
                                                        <li className="col-lg-4" key={node.key}>
                                                            <CustomLink url={node.url} onClick={this.menuLinkClick} className="s90" >
                                                                {node.label}
                                                            </CustomLink>
                                                        </li>)}
                                                </ul>
                                            </div>
                                        </div>) :
                                        (res.url ?
                                            <CustomLink url={res.url} onClick={this.menuLinkClick} className="s90" >
                                                {res.label}
                                            </CustomLink> :
                                            <a className="s90" role="button">{res.label}</a>)
                                    }
                                </li>))}
                        </ul>
                        <HeaderActions className="actions_header-mobile d-flex flex-column flex-grow-1 d-lg-none" isLowVisionOn={this.props.isLowVisionOn} toggleLowVision={this.props.toggleLowVision} closeDrawer={this.menuLinkClick} />
                    </nav>
                    <div className={overflowArrowBlockClassnames} id="overflovedArrowBlock">
                        <div className="m-auto" id="allItemsIconDiv">
                            <FontAwesomeIcon
                                className={allNavItemsArrowClassnames}
                                id="allNavItemsArrow"
                                color="#fff"
                                onClick={this.toggleShowAllItems}
                                icon={faChevronDown} />
                        </div>
                    </div>

                    <div id="customTestDiv">
                        <HeaderSocials />
                        <HeaderSearch />

                    </div>
                </div>

        if (hasData === true) {
            return (
                <header className="wrapper" id="layout-header">
                    <Helmet>
                        <style rel>
                            {`:root {
                             --theme-lightcolor:${settings.Layout.selectedColorTheme[2] || '#104D82'};
                             --theme-color:${settings.Layout.selectedColorTheme[1] || '#304f80'};
                             --theme-darkcolor:${settings.Layout.selectedColorTheme[0] || '#273043'};
                             --body-background: #dee4e7;
                             --content-background: #fff;
                             --content-max-width: 1300px;
                             --content-font-family: "ProbaPro", "SourceSansPro";
                             --content-color: #1d1d1b;
                            }
                            `}
                        </style>
                    </Helmet>
                    <section className="header-bg header-bg-color monochromeLimitedHeader"  >
                        <div className="header_content justify-content-center margin-left-10">
                            <div id="headerMainLogo">
                                <div className="d-none d-lg-block col-lg-3">
                                    <div className="nav-gov-sites">
                                        <GovSites />
                                    </div>
                                </div>
                                <Link to={`${locateForURL}`} className="col-12 col-lg-6 header_main-link">
                                    {settings.Layout.headerLogo !== undefined ?
                                        <div>
                                            {settings.Layout.headerLogo ?
                                                <img alt={settings.Layout.siteName} className="header_logo" src={settings.Layout.headerLogo} /> :
                                                <div className="py-4"> </div>}
                                        </div>
                                        : null}
                                    <div id="headerMainSiteName" className="mt-2">
                                        {match ? <h1 className="header_headline center">
                                            {settings.Layout.siteName}
                                        </h1>
                                            : <div className="header_headline center">
                                                {settings.Layout.siteName}
                                            </div>}
                                        <br />
                                        <div className="header_siteDescription text-center">
                                            {settings.Layout.descriptionForSite}

                                        </div>
                                    </div>
                                </Link>
                                <div className="col-lg-3 pr-0">
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
                        </div>
                        {window.innerWidth > 991 ?
                            <div className={!this.state.showAllNavItems ? "childDivMinHeight50" : ""}>
                                <Sticky stickyClassName="sticky-nav" onFixedToggle={(isntSticky => this.setState({ isntHeaderBottomSticky: isntSticky }))}>
                                    {
                                        nav
                                    }
                                </Sticky>
                            </div>
                            : nav
                        }
                    </section>
                </header>
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

export default withRouter(connect(mapStateToProps, actions)(withTranslate(MonochromeLimitedHeader)));