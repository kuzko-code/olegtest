import React, { Component } from 'react';
import classnames from 'classnames';
import "../../../../public/css/bootstrap.min.css";
import "../../../../public/font-awesome/css/font-awesome.css";
import "../../../../public/css/animate.css";
import "../../../../public/css/style.css";
import "../../../../public/assets/css/navbar.css"
import { logout } from "../../../services/index.js";
import { Link, withRouter } from 'react-router-dom';
import { AddUser } from '../../../redux/actions/index.js';
import UserInfo from "./userInfo.jsx";
import MetisMenu from './MetisMenu/components/MetisMenu.jsx';
import "../../../../node_modules/material-design-icons/iconfont/material-icons.css";
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';

class Sidebar extends Component {

  constructor(props) {
    super(props);
    const { currentUser } = this.props;
    var all = ["global_admin", "root_admin"];
    var access1 = null;

    if (all.filter(allrole => allrole === currentUser.internalrole).length === 0) {
      access1 = false;
    }
    else {
      access1 = true;
    }

    this.state = {
      all: all,
      access1: access1,
      menu: []
    };
  }

  componentDidMount() {
    this.loadingData();
  }

  loadingData = async () => {
    let { all, access1 } = this.state;
    const { translate, currentUser } = this.props;

    let menu = this.props.navigation;
    menu = menu.map(res => {
      let element = Object.create({ ...res })

      var label = (translate(element.label) && translate(element.label).length > 0) ? translate(element.label) : element.name;
      let result = { ...res,  label: label};

      if(element.to)
      {
        result = { ...res,  label: label, to: "/" + this.props.language + element.to}
      }

      if (element.content) {
        var resultContent = [];
        let content = [...element.content];
        if (content.length > 0) {
          resultContent = content.map(contentEl => {
            let el = Object.create({ ...contentEl });
            el.label = (translate(el.label) && translate(el.label).length > 0) ? translate(el.label) : el.name;
            el.to = "/" + this.props.language + el.to;
            return el;
          });
          return { ...res,  label: label, content: resultContent};
        }
      }
      return result;
    })


    this.setState({ menu: menu })
  }
  componentDidUpdate(prevProps) {
    if (this.props.navigation != prevProps.navigation) {
      this.loadingData();
    }
  }

  render() {
    const {translate}=this.props;
    let { access1, menu } = this.state;

    return (
      <>
        {this.props.isHidden && <div className="SideBar">
          <nav className="navbar-default sideNavbar" role="navigation">
            <div className="sidebar-collapse">

              <div className="headerNav">
                <div className="dropdown w-100">
                  <UserInfo props={this.props} />
                </div>
              </div>
              {access1 !== null && <MetisMenu content={menu} activeLinkFromLocation iconNameStateHidden="angle-left" iconNameStateVisible="angle-left rotate-minus-90"/>}
            </div>
          </nav>
        </div>}
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.Intl.locale,
    navigation: state.Intl.navigation,
    currentUser: state.currentUser,
    isHidden: !state.interface.isEditorInFullscreen,
  };
};

const mapDispatchToProps = {
  AddUser
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Sidebar));