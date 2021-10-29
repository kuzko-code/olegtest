import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import { getAllLanguages, getPublicLanguages, getAdminLanguages, putPublicSiteLanguages, putAdminSiteLanguages } from "../../services";
//services
import { getUserByToken } from "../../services/user-api-services.js";
import "../../../public/assets/css/newssettings.css";
import "../../../public/assets/css/multilanguage.css";
import Select from "react-select";
import Customselect from './customSelect.jsx';
import { toast } from 'react-toastify';
import $ from "jquery";
import { connect } from 'react-redux';
import { UpdateLanguages } from '../../redux/actions/languages.js'
import classnames from 'classnames';
import SectionHeader from '../header/SectionHeader.jsx';
var isEqual = require('lodash/fp/isEqual');

export class languageSettings extends Component {
  constructor(props) {
    super(props);

    this.customSelectPublicLang = [];
    this.customSelectAdminLang = [];
    this.state = {
      newSelectCreate: false,
      optionsupdate: [false],

      publicLanguages: [],
      publicLangselect: [],
      publicLangselectnum: 0,
      publicLangselectresult: [],
      availablePublicLanguages: [],
      initialPublicLangselectresult: [],

      adminLanguages: [],
      adminLangselect: [],
      adminLangselectnum: 0,
      adminLangselectresult: [],
      availableAdminLanguages: [],
      initialAdminLangselectresult: [],

      access: false,
      all: ["global_admin", "root_admin"]
    };
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onchangeOption = this.onchangeOption.bind(this);
    this.onClickDown = this.onClickDown.bind(this);
    this.onClickUp = this.onClickUp.bind(this);
    this.optionsUpdate = this.optionsUpdate.bind(this);

    this.onClickAddPublicLang = this.onClickAddPublicLang.bind(this);
    this.onClickSubmitPublicLanguages = this.onClickSubmitPublicLanguages.bind(this);
    this.handleChangePublicLang = this.handleChangePublicLang.bind(this);

    this.onClickAddAdminLang = this.onClickAddAdminLang.bind(this);
    this.onClickSubmitAdminLanguages = this.onClickSubmitAdminLanguages.bind(this);
    this.handleChangeAdminLang = this.handleChangeAdminLang.bind(this);

  }

  componentDidMount() {
    this.loadingdata();
  }

  loadingdata() {
    let result = null;
    let { all, access } = this.state;
    let publicLanguages = [];
    let publicLangselectresult = [];
    let initialPublicLangselectresult = [];
    let adminLanguages = [];
    let adminLangselectresult = [];
    let initialAdminLangselectresult = [];
    let availableAdminLanguages, availablePublicLanguages = [];
    Promise.all([getAllLanguages(), getPublicLanguages(), getAdminLanguages(), getUserByToken()]).then(resonses => {

      if (all.filter(allrole => allrole === resonses[3].data.role).length !== 0) {
        access = true;
      }

      resonses[0].data.map(datas =>
        publicLanguages.push({
          value: datas.cutback.toString(),
          label: datas.title.toString()
        })
      );

      resonses[0].data.map(datas =>
        adminLanguages.push({
          value: datas.cutback.toString(),
          label: datas.title.toString()
        })

      );

      if (resonses[1].data) {
        resonses[1].data.map(lang => {
          result = publicLanguages.filter(res => res.value == lang.cutback);
          publicLangselectresult.push(result);
          initialPublicLangselectresult.push(result);
        })
      }

      if (resonses[2].data) {
        resonses[2].data.map(lang => {
          result = adminLanguages.filter(res => res.value == lang.cutback);
          adminLangselectresult.push(result);
          initialAdminLangselectresult.push(result);
        })
      }

      availablePublicLanguages = publicLanguages.filter(res => res);
      publicLangselectresult.map(lang => {
        for (var i = 0; i < availablePublicLanguages.length; i++) {
          if (lang) {
            if (availablePublicLanguages[i].value === lang[0].value) {
              availablePublicLanguages.splice(i, 1);
            }
          }
        }
      })

      availableAdminLanguages = adminLanguages.filter(res => res);
      adminLangselectresult.map(lang => {
        for (var i = 0; i < availableAdminLanguages.length; i++) {
          if (lang) {
            if (availableAdminLanguages[i].value === lang[0].value) {
              availableAdminLanguages.splice(i, 1);
            }
          }
        }
      })

      this.setState({
        access: access,
        newSelectCreate: true,
        availablePublicLanguages: availablePublicLanguages,
        availableAdminLanguages: availableAdminLanguages,
        publicLanguages: publicLanguages,
        publicLangselectresult: publicLangselectresult,
        initialPublicLangselectresult: initialPublicLangselectresult,
        adminLanguages: adminLanguages,
        adminLangselectresult: adminLangselectresult,
        initialAdminLangselectresult: initialAdminLangselectresult
      });
    });
  }

  handleChangePublicLang(optionSelected, value) {
    let publicLanguages = this.state.publicLanguages;
  }

  handleChangeAdminLang(optionSelected, value) {
    let adminLanguages = this.state.adminLanguages;
  }

  onClickAddPublicLang() {
    let publicLangselect = this.state.publicLangselect;
    let publicLangselectnumplus = this.state.publicLangselectnum + 1;
    let publicLangselectresult = this.state.publicLangselectresult;
    let availablePublicLanguages = this.state.availablePublicLanguages;
    publicLangselectresult[this.state.publicLangselectnum] = null;

    publicLangselect.push(
      <Customselect
        ref={this.customSelectPublicLang[this.state.publicLangselectnum] = React.createRef()}
        onClickDelete={this.onClickDelete}
        onClickDown={this.onClickDown}
        onClickUp={this.onClickUp}
        options={availablePublicLanguages}
        optionsupdatevalue={this.state.optionsupdate}
        optionsUpdate={this.optionsUpdate}
        value={publicLangselectresult}
        id={this.state.publicLangselectnum}
        onchangeOption={this.onchangeOption}
        result={"publicLanguage"}
      ></Customselect>
    );

    this.setState({
      publicLangselect: publicLangselect,
      publicLangselectnum: publicLangselectnumplus,
      publicLangselectresult: publicLangselectresult
    });
  }

  onClickAddAdminLang() {
    let adminLangselect = this.state.adminLangselect;
    let adminLangselectnumplus = this.state.adminLangselectnum + 1;
    let adminLangselectresult = this.state.adminLangselectresult;
    let availableAdminLanguages = this.state.availableAdminLanguages;
    adminLangselectresult[this.state.adminLangselectnum] = null;

    adminLangselect.push(
      <Customselect
        ref={this.customSelectAdminLang[this.state.adminLangselectnum] = React.createRef()}
        onClickDelete={this.onClickDelete}
        onClickDown={this.onClickDown}
        onClickUp={this.onClickUp}
        options={availableAdminLanguages}
        optionsupdatevalue={this.state.optionsupdate}
        optionsUpdate={this.optionsUpdate}
        value={adminLangselectresult}
        id={this.state.adminLangselectnum}
        onchangeOption={this.onchangeOption}
        result={"adminLanguage"}
      ></Customselect>
    );

    this.setState({
      adminLangselect: adminLangselect,
      adminLangselectnum: adminLangselectnumplus,
      adminLangselectresult: adminLangselectresult
    });
  }


  onClickDelete(id, result) {
    if (result === "publicLanguage") {
      let publicLangselect = [...this.state.publicLangselect];
      let publicLangselectresult = this.state.publicLangselectresult;
      let publicLangselectnumminus = this.state.publicLangselectnum;
      let availablePublicLanguages = this.state.availablePublicLanguages;
      let publicLanguages = this.state.publicLanguages;
      if (publicLangselectresult[parseInt(id)]) {
        publicLangselectresult[parseInt(id)][0] ?
          availablePublicLanguages.push(publicLangselectresult[parseInt(id)][0]) : availablePublicLanguages.push(publicLangselectresult[parseInt(id)])
      }

      delete publicLangselect[parseInt(id)];
      delete publicLangselectresult[parseInt(id)];
      delete this.customSelectPublicLang[parseInt(id)];
      this.setState({
        availablePublicLanguages: availablePublicLanguages,
        publicLanguages: publicLanguages,
        publicLangselect: publicLangselect,
        publicLangselectresult: publicLangselectresult,
        publicLangselectnum: publicLangselectnumminus
      });
    } else if (result === "adminLanguage") {
      let adminLangselect = [...this.state.adminLangselect];
      let adminLangselectresult = this.state.adminLangselectresult;
      let adminLangselectnumminus = this.state.adminLangselectnum;
      let adminLanguages = this.state.adminLanguages;
      let availableAdminLanguages = this.state.availableAdminLanguages;
      if (adminLangselectresult[parseInt(id)]) {
        adminLangselectresult[parseInt(id)][0] ?
          availableAdminLanguages.push(adminLangselectresult[parseInt(id)][0]) : availableAdminLanguages.push(adminLangselectresult[parseInt(id)])
      }

      delete adminLangselect[parseInt(id)];
      delete adminLangselectresult[parseInt(id)];
      delete this.customSelectAdminLang[parseInt(id)];
      this.setState({
        availableAdminLanguages: availableAdminLanguages,
        adminLanguages: adminLanguages,
        adminLangselect: adminLangselect,
        adminLangselectresult: adminLangselectresult,
        adminLangselectnum: adminLangselectnumminus,
      });
    }
  }

  optionsUpdate() {
    this.setState({ optionsupdate: false });
  }

  onClickDown(id, result) {
    if (result === "publicLanguage") {
      let publicLangselectresult = this.state.publicLangselectresult;
      let valuedownLang = null;
      for (
        let index = parseInt(id) + 1;
        index < publicLangselectresult.length;
        ++index
      ) {
        if (publicLangselectresult[index] !== undefined) {
          valuedownLang = publicLangselectresult[index];
          publicLangselectresult[index] = publicLangselectresult[id];
          publicLangselectresult[id] = valuedownLang;

          this.setState({
            publicLangselectresult: publicLangselectresult,
            optionsupdate: true
          });
          this.customSelectPublicLang[id].current.changeOptionResult();
          this.customSelectPublicLang[index].current.changeOptionResult();
          break;
        }
      }
    } else if (result === "adminLanguage") {
      let adminLangselectresult = this.state.adminLangselectresult;
      let valuedownLang = null;
      for (
        let index = parseInt(id) + 1;
        index < adminLangselectresult.length;
        ++index
      ) {
        if (adminLangselectresult[index] !== undefined) {
          valuedownLang = adminLangselectresult[index];
          adminLangselectresult[index] = adminLangselectresult[id];
          adminLangselectresult[id] = valuedownLang;

          this.setState({
            adminLangselectresult: adminLangselectresult,
            optionsupdate: true
          });
          this.customSelectAdminLang[id].current.changeOptionResult();
          this.customSelectAdminLang[index].current.changeOptionResult();
          break;
        }
      }
    }
  }

  onClickUp(id, result) {
    if (result === "publicLanguage") {
      let publicLangselectresult = this.state.publicLangselectresult;
      let valuedownLang = null;

      for (let index = parseInt(id) - 1; index >= 0; --index) {
        if (publicLangselectresult[index] !== undefined) {
          valuedownLang = publicLangselectresult[index];
          publicLangselectresult[index] = publicLangselectresult[id];
          publicLangselectresult[id] = valuedownLang;

          this.setState({
            publicLangselectresult: publicLangselectresult,
            optionsupdate: true
          });
          this.customSelectPublicLang[id].current.changeOptionResult();
          this.customSelectPublicLang[index].current.changeOptionResult();
          break;
        }
      }
    } else if (result === "adminLanguage") {
      let adminLangselectresult = this.state.adminLangselectresult;
      let valuedownLang = null;

      for (let index = parseInt(id) - 1; index >= 0; --index) {
        if (adminLangselectresult[index] !== undefined) {
          valuedownLang = adminLangselectresult[index];
          adminLangselectresult[index] = adminLangselectresult[id];
          adminLangselectresult[id] = valuedownLang;

          this.setState({
            adminLangselectresult: adminLangselectresult,
            optionsupdate: true
          });
          this.customSelectAdminLang[id].current.changeOptionResult();
          this.customSelectAdminLang[index].current.changeOptionResult();
          break;
        }
      }
    }
  }

  onchangeOption(optionSelected, i, name) {
    if (name == "publicLanguage") {
      let publicLangselectresult = this.state.publicLangselectresult;
      let availablePublicLanguages = this.state.availablePublicLanguages;
      if (publicLangselectresult[i] !== null) {
        publicLangselectresult[i][0] ?
          availablePublicLanguages.push(publicLangselectresult[i][0]) : availablePublicLanguages.push(publicLangselectresult[i])
      }

      publicLangselectresult[i] = optionSelected;
      publicLangselectresult.map(lang => {
        for (var i = 0; i < availablePublicLanguages.length; i++) {
          if (lang) {
            if (availablePublicLanguages[i].value === lang.value) {
              availablePublicLanguages.splice(i, 1);
            }
          }
        }
      })
      this.setState({ publicLangselectresult: publicLangselectresult, availablePublicLanguages: availablePublicLanguages });
    } else if (name == "adminLanguage") {
      let adminLangselectresult = this.state.adminLangselectresult;
      let availableAdminLanguages = this.state.availableAdminLanguages;
      if (adminLangselectresult[i] !== null) {
        adminLangselectresult[i][0] ?
          availableAdminLanguages.push(adminLangselectresult[i][0]) : availableAdminLanguages.push(adminLangselectresult[i])
      }

      adminLangselectresult[i] = optionSelected;
      adminLangselectresult.map(lang => {
        for (var i = 0; i < availableAdminLanguages.length; i++) {
          if (lang) {
            if (availableAdminLanguages[i].value === lang.value) {
              availableAdminLanguages.splice(i, 1);
            }
          }
        }
      })
      this.setState({ adminLangselectresult: adminLangselectresult, availableAdminLanguages: availableAdminLanguages });
    }
  }

  onClickSubmitPublicLanguages(e) {
    const { translate } = this.props;
    const { publicLangselectresult } = this.state;
    let publicLanguages = [];
    let initialPublicLangselectresult = [];
    publicLangselectresult.filter(res => res !== undefined).filter(res => res !== null).map(res => {
      res.value !== undefined ? publicLanguages.push(res.value)
        : publicLanguages.push(res[0].value)
      initialPublicLangselectresult.push(res)
    });

    if (publicLanguages.filter(res => res).length > 0) {
      let publicLanguagesjson = JSON.stringify(publicLanguages);
      putPublicSiteLanguages(publicLanguagesjson).then((res) => {
        if (res.status != "ok") {
          toast.error(translate('errorOccurredWhileSavingTheSettings'));
          return;
        }
        this.setState({ initialPublicLangselectresult: initialPublicLangselectresult })
        toast.success(translate('changesSavedSuccessfully'));
      })
    }
    else {
      toast.error(translate('errorCannotDeleteAllLanguages'));
    }
  }

  onClickSubmitAdminLanguages = (e) => {
    const { translate } = this.props;
    const { adminLangselectresult } = this.state;
    let languagesForSelect = [];
    let adminLanguages = [];
    let initialAdminLangselectresult = [];
    adminLangselectresult.filter(res => res !== undefined).filter(res => res !== null).map(res => {
      res.value !== undefined ? adminLanguages.push(res.value)
        : adminLanguages.push(res[0].value)
      initialAdminLangselectresult.push(res)
    });

    adminLangselectresult.filter(res => res !== undefined).filter(res => res !== null).map(res => {
      res[0] !== undefined ? languagesForSelect.push(res[0])
        : languagesForSelect.push(res)
    });

    if (adminLanguages.filter(res => res).length > 0) {
      this.props.UpdateLanguages(languagesForSelect)
      let adminLanguagesjson = JSON.stringify(adminLanguages);


      putAdminSiteLanguages(adminLanguagesjson).then((res) => {
        if (res.status != "ok") {
          toast.error(translate('errorOccurredWhileSavingTheSettings'));
          return;
        }
        this.setState({ initialAdminLangselectresult: initialAdminLangselectresult })
        toast.success(translate('changesSavedSuccessfully'));
      })
    }
    else {
      toast.error(translate('errorCannotDeleteAllLanguages'));
    }

  }

  render() {
    const { translate } = this.props;
    var {
      access,
      newSelectCreate,
      availableAdminLanguages,
      availablePublicLanguages,
      publicLanguages,
      publicLangselect,
      publicLangselectresult,
      publicLangselectnum,
      adminLanguages,
      adminLangselect,
      adminLangselectresult,
      adminLangselectnum,
      initialPublicLangselectresult,
      initialAdminLangselectresult
    } = this.state;

    if (this.state.newSelectCreate == true) {
      newSelectCreate = false;

      publicLangselectresult.map(res => {
        publicLangselect.push(
          <Customselect
            ref={this.customSelectPublicLang[publicLangselectnum] = React.createRef()}
            onClickDelete={this.onClickDelete}
            onClickDown={this.onClickDown}
            onClickUp={this.onClickUp}
            options={availablePublicLanguages}
            optionsupdatevalue={this.state.optionsupdate}
            optionsUpdate={this.optionsUpdate}
            value={this.state.publicLangselectresult}
            id={publicLangselectnum}
            onchangeOption={this.onchangeOption}
            result={"publicLanguage"}
          ></Customselect>
        );
        publicLangselectnum++;
      });



      adminLangselectresult.map(res => {
        adminLangselect.push(
          <Customselect
            ref={this.customSelectAdminLang[adminLangselectnum] = React.createRef()}
            onClickDelete={this.onClickDelete}
            onClickDown={this.onClickDown}
            onClickUp={this.onClickUp}
            options={availableAdminLanguages}
            optionsupdatevalue={this.state.optionsupdate}
            optionsUpdate={this.optionsUpdate}
            value={this.state.adminLangselectresult}
            id={adminLangselectnum}
            onchangeOption={this.onchangeOption}
            result={"adminLanguage"}
          ></Customselect>
        );
        adminLangselectnum++;
      });

      this.setState({
        newSelectCreate: newSelectCreate,
        publicLangselect: publicLangselect,
        publicLangselectnum: publicLangselectnum,
        adminLangselect: adminLangselect,
        adminLangselectnum: adminLangselectnum
      })
    }

    var publicSelectsBoxAndButtons = classnames({
      'mb-4': true,
      'disabledActionButtons': publicLangselectresult.filter(res => res).length > 1 ? false : true
    });

    var adminSelectsBoxAndButtons = classnames({
      'mb-4': true,
      'disabledActionButtons': adminLangselectresult.filter(res => res).length > 1 ? false : true
    });


    return (
      <div className="newsSettings">
        <SectionHeader title={translate('languageSettings')} />
        <div className="mt-4 mx-3">
          <div className="row">
            {access === true ? <div className="col-lg">
              <div className="pageElementBox collapsed border-bottom">
                <div className="pageElementBoxTitle border-bottom-0 d-flex justify-content-between">
                  <h5>{translate('publicSiteLanguageSettings')}</h5>
                  <button
                    type="button"
                    className="btn btn-mint-green btn-sm"
                    onClick={this.onClickSubmitPublicLanguages}
                    disabled={isEqual(
                      publicLangselectresult.filter(res => res).map(res => Array.isArray(res) ? res[0] : res),
                      initialPublicLangselectresult.filter(res => res).map(res => Array.isArray(res) ? res[0] : res)
                    )}
                  >
                    {translate('saveChanges')}
                  </button>
                </div>
                <div className="pageElementBoxContent" style={{ display: "block" }}>
                  <div className={publicSelectsBoxAndButtons}>
                    {this.state.publicLanguages.length !== 0 ? this.state.publicLangselect.map(res => res) : null}
                    {this.state.publicLangselectresult.filter(res => res !== undefined).length < this.state.publicLanguages.length ?
                      <div style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className="btn btn-mint-green btn-add col-xs-12"
                          tabIndex="0"
                          onClick={this.onClickAddPublicLang}
                          style={{ width: "79px" }}
                        >
                          <i className="glyphicon glyphicon-plus"></i>
                        </button>
                      </div>
                      : null}
                  </div>
                </div>
              </div>
            </div> : null}
            <div className={access === true ? "col-lg" : "col-12 col-xl-6"}>
              <div className="pageElementBox collapsed border-bottom">
                <div className="pageElementBoxTitle border-bottom-0 d-flex justify-content-between">
                  <h5>{translate('adminSiteLanguageSettings')}</h5>
                  <button
                    type="button"
                    className="btn btn-mint-green btn-sm"
                    onClick={this.onClickSubmitAdminLanguages}
                    disabled={isEqual(
                      adminLangselectresult.filter(res => res).map(res => Array.isArray(res) ? res[0] : res),
                      initialAdminLangselectresult.filter(res => res).map(res => Array.isArray(res) ? res[0] : res)
                    )}
                  >
                    {translate('saveChanges')}
                  </button>
                </div>
                <div className="pageElementBoxContent" style={{ display: "block" }}>
                  <div className={adminSelectsBoxAndButtons}>
                    {this.state.adminLanguages.length !== 0 ? this.state.adminLangselect.map(res => res) : null}
                    {this.state.adminLangselectresult.filter(res => res !== undefined).length < this.state.adminLanguages.length ?
                      <div style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className="btn btn-mint-green btn-add col-xs-12"
                          tabIndex="0"
                          onClick={this.onClickAddAdminLang}
                          style={{ width: "79px" }}
                        >
                          <i className="glyphicon glyphicon-plus"></i>
                        </button>
                      </div>
                      : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // srcLogo: state.reducerLogo
  };
};

const mapDispatchToProps = {
  UpdateLanguages
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(languageSettings));
