import React, { Component } from "react";
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import "./Breadcrumb.css";

class BreadcrumbsUI extends Component {


  render() {
    const { includeMainPage, breadcrumbsArray, curentPageTitle, translate, locateForURL } = this.props;

    let renderArray = [];
    if(includeMainPage){
      renderArray = [{href:locateForURL, title:translate('mainPage')}, ...breadcrumbsArray];
    }else{
      renderArray = [...breadcrumbsArray];
    }
    let prevElem = null;
    if(renderArray.length>0){
      prevElem = renderArray[renderArray.length-1]
    }
    return (
      <>
        <Breadcrumbs className={"breadcrumb breadcrumb-color"} separator={<NavigateNextIcon />} aria-label="breadcrumb">
          {renderArray.map(crumb => <Link key={crumb.href} to={crumb.href}>{crumb.title}</Link>)}
          <Typography color="textSecondary">{curentPageTitle}</Typography>
        </Breadcrumbs>
        {prevElem==null?null:
        <Breadcrumbs className={"breadcrumb breadcrumb-color breadcrumb-mobile"} separator={<NavigateBeforeIcon />} aria-label="breadcrumb">
          <div></div>
          {<Link to={prevElem.href}>{prevElem.title}</Link>}
        </Breadcrumbs>}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    layout: state.reducerSettings.Layout,
    language: state.Intl.locale,
    locateForURL: `/${state.Intl.locale}`,
  };
};
BreadcrumbsUI.defaultProps = {
  includeMainPage: true,
  breadcrumbsArray: [],
  curentPageTitle: ""
}
export default connect(mapStateToProps)(withTranslate(BreadcrumbsUI));
