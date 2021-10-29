import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions/index.js';
import { Link } from 'react-router-dom';
import {logout} from '../../../services/index.js'
import {withTranslate} from 'react-redux-multilingual';

const UserInfo = ({ state, props, language }) => {
    const{translate}=props;

    var role = state.currentUser.role;
    if (role === "root_admin") { role = translate('rootAdmin') }
    else if (role === "global_admin") { role = translate('globalAdmin') }
    else if (role === "group_admin") { role = translate('groupAdmin') }
    else if (role === "content_admin") { role = translate('contentAdmin') }
 
    return (
        <React.Fragment>
            <a className="dropdown-toggle text-white userProfileActions" data-toggle="dropdown" href="#">
                <span className="d-block m-t-5 font-weight-600 profileElement">{state.currentUser.userName}</span>
                <span className="text-light-grey text-xs d-block profileElement">{role}
                    <span className="fa fa-caret-down ml-1"></span>
                </span>
            </a>
            <a className="dropdown-toggle miniUserProfileActions" data-toggle="dropdown" href="#">
                <i className="fa fa-user-circle navbarLogo" aria-hidden="true"></i>
            </a>
            
            <ul className="dropdown-menu animated fadeInRight m-t-40">
                <li>
                    <Link className="dropdown-item bg-light w-auto" to="/profile">{translate('profile')}</Link>
                </li>
                <li className="dropdown-divider"></li>
                <li>
                    <Link className="dropdown-item bg-light w-auto" to={`/${language}/login`} onClick={logout}>{translate('signOut')}</Link>
                </li>
            </ul>
        </React.Fragment>
    )
};

const mapStateToProps = (state) => {
  return {
    state: state,
    language: state.Intl.locale
  };
};

export default connect(mapStateToProps, actions)(withTranslate(UserInfo));