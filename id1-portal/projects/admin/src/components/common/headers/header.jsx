import React, { Component } from 'react';
import classList from 'classlist';
import { withTranslate } from 'react-redux-multilingual';
import { logout, getPortalSize } from '../../../services/index.js';
import Select from 'react-select';
import TranslateTwoToneIcon from '@material-ui/icons/TranslateTwoTone';
import NotificationsIcon from '@material-ui/icons/Notifications';
import CloseIcon from '@material-ui/icons/Close';
import '../../../../public/assets/css/multilanguage.css';
import '../../../../public/assets/css/header.css';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getLastNewMessages, setReadMessages } from '../../../services/messages-api-services.js';


export class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languages: [],
      language: {},
      loading: true,
      messages: [],
      portalSize: null,
    };
  }

  onClickNavBar(e) {
    e.preventDefault();
    let body = classList(document.getElementById('body'));
    body.contains('miniNavbar')
      ? body.remove('miniNavbar')
      : body.add('miniNavbar');
  }

  componentDidMount() {
    Promise.all([getLastNewMessages(5), getPortalSize()]).then(res => {
      let messages = []
      if (res[0] && res[0].length > 0) {
        messages = res[0]
      } else {
        if (this.state.messages.length != 0)
          messages = []
      }
      let portalSize = null
      if (res[1].error_message === null)
        portalSize = res[1].data.size
      this.setState({
        messages: messages,
        portalSize: portalSize
      });
    })
  }

  handleChangeLanguage = (selectedOption) => {
    this.setState({ language: selectedOption });
    this.props.Intl.changeLocale(selectedOption.value);
  };

  handleReadMessage = (event, id) => {
    setReadMessages(id)
      .then(res => getLastNewMessages(5))
      .then(res => {
        if (res && res.length > 0) {
          this.setState({ messages: res });
        } else {
          if (this.state.messages.length != 0)
            this.setState({ messages: [] });
        }
      })
  };

  render() {
    const { translate, Languages, Intl } = this.props;
    const { messages, portalSize } = this.state;
    var language = Languages.filter((lang) => {
      if (lang.value === Intl.locale) return lang;
    });

    return (
      <>
        {!this.props.isHidden && (
          <div className="border-bottom">
            <nav
              className="navbar navbarTop"
              role="navigation"
              style={{ marginBottom: '0px' }}
            >
              <div className="d-flex w-100">
                <div className="flex-grow-1">
                  <div className="navbar-header">
                    <a
                      className="navToggle btn btn-mint-green "
                      href="#"
                      onClick={this.onClickNavBar}
                    >
                      <i className="fa fa-bars"></i>
                    </a>
                  </div>
                </div>
                {portalSize &&
                  <div className="pt-3 mt-1 pr-4 row">
                    <h7 className="d-none d-md-block">{translate("portalSize")}</h7>
                    <h7 className="text-success pl-1">{portalSize}</h7>
                  </div>
                }
                <div>
                  <ul className="nav navbarTopLinks navbar-right">
                    <li className="dropdown mb-0">
                      <a className="dropdown-toggle p-0 d-flex align-items-center mx-2" data-toggle="dropdown" href="#">
                        <NotificationsIcon fontSize="small" />
                        {messages && messages.length > 0 && <span className="red-dot"></span>}
                      </a>
                      <ul className="dropdown-menu" style={messages.length > 0 ? { left: '-25px', width: '312px' } : {}}>
                        {messages.map(mes =>
                          <li key={mes.id}>
                            {mes.link ?
                              <Link className="dropdown-item" to={mes.link}>
                                <div className="dropdown-messages-box" style={{ whiteSpace: 'pre-line' }}>
                                  <i className="fa fa-info fa-fw"></i> {mes.title}
                                  <span className="float-right text-muted small">{translate("readMore")} &gt;</span>
                                </div>
                              </Link> :
                              <a className="dropdown-item">
                                <div className="dropdown-messages-box" style={{ whiteSpace: 'pre-line' }}>
                                  <i className="fa fa-info fa-fw"></i>
                                  {mes.title}
                                </div>
                              </a>
                            }
                            <CloseIcon className="close-button" onClick={(e) => this.handleReadMessage(e, mes.id)} />
                          </li>
                        )}
                        {messages.length == 0 && <li className="no-messages">{translate("noNewMessages")}</li>}
                      </ul>
                    </li>
                    {Languages.length > 1 &&
                      <li>
                        <div className="d-flex align-items-center">
                          <TranslateTwoToneIcon fontSize="small" />
                          <Select
                            id="SelectLanguage"
                            options={Languages}
                            value={language}
                            onChange={this.handleChangeLanguage}
                            styles={customStyles}
                            defaultValue={language}
                            placeholder={translate('сhooseLanguage')}
                          />
                        </div>
                      </li>}
                    <li>
                      <Link
                        to={`/${Intl.locale}/login`}
                        className="text-secondary"
                        onClick={logout}
                      >
                        <i className="fa fa-sign-out"></i>
                        {translate('signOut')}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        )
        }
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    Intl: state.Intl,
    Languages: state.reducerLanguages,
    isHidden: state.interface.isEditorInFullscreen,
  };
};

export default connect(mapStateToProps)(withTranslate(Header));

const customStyles = {
  option: (provided, state) => ({ ...provided }),
  control: (provided, state) => ({
    ...provided,
    // This line disable the blue border
    '&:hover': { borderColor: '#1ab394' }, // border style on hover
    border: '1px solid lightgray', // default border color
    boxShadow: 'none', // no box-shadow
    // width: '33%',
  }),
};
