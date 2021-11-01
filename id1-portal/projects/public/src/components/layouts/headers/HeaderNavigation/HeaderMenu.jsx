import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import classList from 'classlist';
import { withTranslate } from 'react-redux-multilingual';




const HeaderMenu = ({ className, translate }) => {

    var menuDesktopClassnames = classnames("menu__list pagesNavigation", {
        'overflow-hidden': !this.state.showAllNavItems && window.innerWidth > 991,
        'showAllItems': this.state.showAllNavItems
    });

    const closeAllMenu = () => {
        let menus = document.querySelectorAll('.showSubmenu');
        menus.forEach(menu => {
            menu.classList.remove('active');
        })
    }
    const closeSearchForm = () => {
        classList(document.getElementById('searchToggle')).remove('active');
    }




    const active = (e) => {
        e.preventDefault();
        closeAllMenu();
        closeSearchForm();

        var list = classList(e.currentTarget.parentElement.parentElement);
        var contains = list.contains("active");
        contains ? list.remove('active') : list.add('active');
        this.setState({ currentActiveMenuElement: e.currentTarget })
    }

    return (
        <ul className={menuDesktopClassnames}  id="menu-desktop" >
            {menu.map((res, index) => (
                <li key={index} className="menu__list-item showSubmenu" ref="showSubmenu">
                    {res.nodes.length > 0 ?
                        (<div>
                            <a className="s90" role="button" onClick={active}>{res.label}</a>
                            <div className="submenu">
                                <ul className="submenu_list row" >
                                    {res.nodes.map(node =>
                                        <li className="col-lg-4" key={node.key}>
                                            <CustomLink url={node.url} /*onClick={this.menuLinkClick}*/ className="s90" >
                                                {node.label}
                                            </CustomLink>
                                        </li>)}
                                </ul>
                            </div>
                        </div>) :
                        (res.url ?
                            <CustomLink url={res.url} /*onClick={this.menuLinkClick}*/ className="s90" >
                                {res.label}
                            </CustomLink> :
                            <a className="s90" role="button">{res.label}</a>)
                    }
                </li>))}
        </ul>
    )
};
const mapStateToProps = (state) => {
    return {
        language: state.Intl.locale
    };
};
export default connect(mapStateToProps)(withTranslate(HeaderMenu));
