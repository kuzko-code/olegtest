import React, { useState } from 'react';
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux'
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { CustomLink } from '../../../ReExportComponents.js'

import "./SiteMap.css";

class SiteMap extends Component {

  render() {
    const { translate, menuLinkClick } = this.props;
    const siteMap = (
      <div className="row-f site-map_content site-map_dev active d-flex align-content-around flex-wrap">
        {this.props.menu.map((menus, index) => (
          <div key={index} className="col-12 col-md-6 site_map_min">
            <div className="site-map_item">
              <h6 className="title">
                {menus.url.length > 0 ? <CustomLink url={menus.url} key={menus.label} onClick={menuLinkClick}>
                  {menus.label}
                </CustomLink> :
                  <CustomLink url={menus.url} key={menus.label}>
                    {menus.label}
                  </CustomLink>}
                {!menus.label.includes(translate('mainPage')) && menus.nodes.map(datas => { }).length !== 0 &&
                  <ul className="lisite">
                    <li>
                      <ul className="site-map_list">
                        {menus.nodes.map(datas =>
                          <li key={datas.key}>
                            {datas.url.length > 0 ? <CustomLink url={datas.url} onClick={menuLinkClick}>
                              {datas.label}  </CustomLink> :
                              <CustomLink url={datas.url}>
                                {datas.label}
                              </CustomLink>}
                          </li>)
                        }
                      </ul>
                    </li>
                  </ul>
                }
              </h6>
            </div>
          </div>))
        }
      </div>
    );
    return (
      <div className="footer__siteMap">{siteMap}</div>
    );

  }
}

const mapStateToProps = (state) => {
  return {
    language: state.Intl.locale
  };
};

export default connect(mapStateToProps)(withTranslate(SiteMap));
