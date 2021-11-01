import React, { Component } from 'react'
import { withTranslate, IntlActions } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import * as actions from '../../../../redux/settings/actions.js';
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faLinkedin, faFacebook, faYoutube, faTelegram } from '@fortawesome/free-brands-svg-icons'
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons'
import { CustomLink } from '../../../ReExportComponents.js'

import "../HeaderSocials/HeaderSocials.css"

class HeaderSocials extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { settings } = this.props;

        return (
            <div id="header-socials">
                {
                    settings.Contacts.socialMedia.twitterUrl &&
                    <CustomLink url={settings.Contacts.socialMedia.twitterUrl} ariaLabel="twitter">
                        <FontAwesomeIcon icon={faTwitter} />
                    </CustomLink>
                }
                {
                    settings.Contacts.socialMedia.linkedinUrl &&
                    <CustomLink url={settings.Contacts.socialMedia.linkedinUrl} ariaLabel="linkedin">
                        <FontAwesomeIcon icon={faLinkedin} />
                    </CustomLink>
                }
                {
                    settings.Contacts.socialMedia.facebookUrl &&
                    <CustomLink url={settings.Contacts.socialMedia.facebookUrl} ariaLabel="facebook">
                        <FontAwesomeIcon icon={faFacebook} />
                    </CustomLink>
                }
                {
                    settings.Contacts.socialMedia.youtubeUrl &&
                    <CustomLink url={settings.Contacts.socialMedia.youtubeUrl} ariaLabel="youtube">
                        <FontAwesomeIcon icon={faYoutube} />
                    </CustomLink>
                }
                {
                    settings.Contacts.socialMedia.telegramNotification &&
                    settings.Contacts.socialMedia.telegramNotification.enabled === true &&
                    settings.Contacts.socialMedia.telegramNotification.channel_url &&
                    <CustomLink url={settings.Contacts.socialMedia.telegramNotification.channel_url} ariaLabel="telegram">
                        <FontAwesomeIcon icon={faTelegram} />
                    </CustomLink>
                }
                {
                    settings.Contacts.socialMedia.shopUrl &&
                    <CustomLink url={settings.Contacts.socialMedia.shopUrl} ariaLabel="shop">
                        <FontAwesomeIcon icon={faShoppingBag} />
                    </CustomLink>
                }
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        settings: state.reducerSettings,
    };
};

export default withRouter(connect(mapStateToProps, actions)(withTranslate(HeaderSocials)));