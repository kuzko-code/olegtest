import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import '../../../public/assets/css/layout/notfound.css';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../../redux/settings/actions.js';

export class ForbidenPage extends Component {
  render() {
    const { translate, layout } = this.props;

    var colorMainPage = classnames({
      'error-color': true,
    });

    return (
      <div id="error-main">
        <div className={`error ${colorMainPage}`}>
          <p className="error-description">403</p>
          <p className="error-proposition">{translate('accessDenied')}</p>
          <p className="error-proposition">
            {translate('goTo')}&nbsp;
            <Link to="/">{translate('pageNotFoundMainPageLink')}</Link>
            {' ' + translate('orAuthorize')}
          </p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    layout: state.reducerSettings.Layout,
  };
};

export default connect(mapStateToProps, actions)(withTranslate(ForbidenPage));
