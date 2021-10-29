import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SiteMap from './siteMap.jsx';
import SocialIcons from './SocialIcons.jsx';
import { getMenuSettingsData } from '../../../redux/menu/menuOperation.js';
import '../../../../public/assets/css/layout/footer.css';
import CustomLink from '../../util/CustomLink.jsx'

class Footer extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
      screenSize: null,
    };
    this.footerRef = React.createRef();
  }

  onResizeDebounced = debounce(({ target }) => {
    const width = target.innerWidth;
    if (width < 768) {
      if (this.state.screenSize === 'mobile') {
        return;
      }
      this.setState({ screenSize: 'mobile' });
      return;
    }

    if (width > 767 && width < 991) {
      if (this.state.screenSize === 'tablet') {
        return;
      }
      this.setState({ screenSize: 'tablet' });
      return;
    }

    if (this.state.screenSize === 'desktop') {
      return;
    }
    this.setState({ screenSize: 'desktop' });
  }, 200);

  componentDidMount() {
    const width = window.innerWidth;
    if (width < 768) {
      this.setState({ screenSize: 'mobile' });
    }

    if (width > 767 && width < 991) {
      this.setState({ screenSize: 'tablet' });
    }

    window.addEventListener('resize', this.onResizeDebounced);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeDebounced);
  }

  handleOnClick = () => {
    if (this.footerRef.current) {
      this.footerRef.current.scrollIntoView();
    }
  };

  menuLinkClick = () => {
    this.setState({ show: !this.state.show });
  };

  menuLinkClickAndScroll = () => {
    this.menuLinkClick();
    setTimeout(this.handleOnClick, 0);
  };

  render() {
    const {
      translate,
      settings: { Layout, Contacts },
    } = this.props;
    const { footerLogo } = Layout;
    const siteName = Layout.siteName && Layout.siteName.trim();
    const address = Contacts.address && Contacts.address.trim();
    const phone = Contacts.phone && Contacts.phone.trim();
    const hotlineNumber =
      Contacts.hotlineNumber && Contacts.hotlineNumber.trim();
    const email = Contacts.email && Contacts.email.trim();
    const {
      facebookUrl,
      twitterUrl,
      linkedinUrl,
      youtubeUrl,
      telegramNotification,
      shopUrl,
    } = Contacts.socialMedia;
    const social = !!(
      facebookUrl ||
      twitterUrl ||
      linkedinUrl ||
      youtubeUrl ||
      telegramNotification &&
      telegramNotification.enabled &&
      telegramNotification.channel_url ||
      shopUrl
    );

    return (
      <footer
        className={`footer-color footer__gridContainer ${this.props.isLowVisionOn && 'footer__contrast'
          }`}
        ref={this.footerRef}
      >
        {this.state.screenSize !== 'mobile' && (
          footerLogo ?
          <img alt={siteName} src={footerLogo} width={40} className="footer__logo" /> :
          <span></span>
        )}

        <div className="footer__item">
          {siteName && (
            <div className="footer__itemTitle footer__siteName">{siteName}</div>
          )}
          {address && <div className="footer__address">{address}</div>}
          {social && this.state.screenSize === 'tablet' && (
            <SocialIcons
              twitterUrl={twitterUrl}
              linkedinUrl={linkedinUrl}
              facebookUrl={facebookUrl}
              youtubeUrl={youtubeUrl}
              telegramNotification={telegramNotification}
              shopUrl={shopUrl}
            />
          )}
        </div>

        {phone && (
          <div
            className="footer__item footer__phones"
            style={{
              marginRight:
                this.state.screenSize === 'mobile' &&
                phone &&
                hotlineNumber &&
                40,
            }}
          >
            <p className="footer__itemTitle">{translate('phone')}</p>
            <a className="footer__link" href={'tel:' + phone}>
              {phone}
            </a>
          </div>
        )}

        {hotlineNumber && (
          <div className="footer__item footer__phones">
            <p className="footer__itemTitle">{translate('hotline')}</p>
            <a className="footer__link" href={'tel:' + hotlineNumber}>
              {hotlineNumber}
            </a>
          </div>
        )}

        {email && (
          <div className="footer__item">
            <div className="footer__itemTitle">{translate('email')}</div>
            <a className="footer__link" href={'mailto:' + email}>
              {email}
            </a>
          </div>
        )}

        {social && this.state.screenSize === 'mobile' && (
          <div className="footer__item">
            <div className="footer__itemTitle">
              {translate('ourSocialNetworks')}
            </div>
            <SocialIcons
              twitterUrl={twitterUrl}
              linkedinUrl={linkedinUrl}
              facebookUrl={facebookUrl}
              youtubeUrl={youtubeUrl}
              telegramNotification={telegramNotification}
              shopUrl={shopUrl}
            />
          </div>
        )}

        <div
          className="footer__item footer__siteMapTitle"
          onClick={this.menuLinkClickAndScroll}
        >
          <span className="footer__link">{translate('siteMap')}</span>
          {this.state.show ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </div>

        {this.state.show && <SiteMap menu={this.props.menu} menuLinkClick={this.menuLinkClick} />}

        <div className="footer__item footer__developer">
          <a
            className="footer__link footer__link-underline"
            target="_blank"
            href="https://softlist.ua/"
            rel="noopener noreferrer"
          >
            {translate('developer')}
          </a>
        </div>
        <div className="footer__item footer__license">
          <img src="/public/assets/pictures/layout/footer/cc-logo.svg" alt="Creative Commons Attribution logo" />
          <span>
            {translate("license_messagePart1")} <CustomLink url="https://creativecommons.org/licenses/by/4.0/deed.uk">Creative Commons Attribution 4.0 International license</CustomLink>{translate("license_messagePart2")}
          </span>
        </div>
      </footer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    menu: state.menuSettings,
    settings: state.reducerSettings,
  };
};

const mapDispatchToProps = () => {
  return {
    getNavMenuSettings: (language) => {
      dispatch(getMenuSettingsData(language));
    },
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslate(Footer))
);
