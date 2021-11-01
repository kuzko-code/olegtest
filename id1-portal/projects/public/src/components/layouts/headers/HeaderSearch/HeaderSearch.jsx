import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import classList from 'classlist';
import { withTranslate } from 'react-redux-multilingual';

import SearchForm from "./SearchForm.jsx";

import "./HeaderSearch.css"

const HeaderSearch = ({ className, translate }) => {

    const active_search = (e) => {

        var list1 = document.getElementsByClassName('showSubmenu');
        var list2 = Object.values(list1);
        list2.map(q => classList(q).remove('active'));
        var list = classList(e.currentTarget);
        list.contains('active') ? list.remove('active') : list.add('active');
        document.getElementById('searchToggle').setAttribute("autoFocus", "true")
        e.preventDefault();
    }

    return (
        <>
            <div onClick={active_search} className={classNames(className, "btn_search-toggle")} id="searchToggle">
                <div>
                    <div className="icon"></div>
                    <span>
                        {translate('search')}
                    </span>
                </div>
            </div>
            <div className="search_form search_form_new" id="form-search">
                <SearchForm />
            </div>
        </>
    )
};
const mapStateToProps = (state) => {
    return {
        language: state.Intl.locale
    };
};
export default connect(mapStateToProps)(withTranslate(HeaderSearch));
