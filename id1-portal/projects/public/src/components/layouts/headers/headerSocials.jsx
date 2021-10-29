import React, { Component } from 'react'
import { withTranslate, IntlActions } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import * as actions from '../../../redux/settings/actions.js';
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomLink from '../../util/CustomLink.jsx'

class HeaderActions extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { translate, settings } = this.props;

        return (
            <div id="cutom-header-socials">
                {
                    settings.Contacts.socialMedia.twitterUrl &&
                    <CustomLink url={settings.Contacts.socialMedia.twitterUrl} ariaLabel="twitter">
                        <FontAwesomeIcon icon={['fab', 'twitter']} />
                    </CustomLink>
                }
                {
                    settings.Contacts.socialMedia.linkedinUrl &&
                    <CustomLink url={settings.Contacts.socialMedia.linkedinUrl} ariaLabel="linkedin">
                        <FontAwesomeIcon icon={['fab', 'linkedin']} />
                    </CustomLink>
                }
                {
                    settings.Contacts.socialMedia.facebookUrl &&
                    <CustomLink url={settings.Contacts.socialMedia.facebookUrl} ariaLabel="facebook">
                        <FontAwesomeIcon icon={['fab', 'facebook']} />
                    </CustomLink>
                }
                {
                    settings.Contacts.socialMedia.youtubeUrl &&
                    <CustomLink url={settings.Contacts.socialMedia.youtubeUrl} ariaLabel="youtube">
                        <FontAwesomeIcon icon={['fab', 'youtube']} />
                    </CustomLink>
                }
                {
                    settings.Contacts.socialMedia.telegramNotification &&
                    settings.Contacts.socialMedia.telegramNotification.enabled === true &&
                    settings.Contacts.socialMedia.telegramNotification.channel_url &&

                    <CustomLink url={settings.Contacts.socialMedia.telegramNotification.channel_url} ariaLabel="telegram">
                        <FontAwesomeIcon icon={['fab', 'telegram']} />
                    </CustomLink>
                }
                {
                    settings.Contacts.socialMedia.shopUrl &&

                    <CustomLink url={settings.Contacts.socialMedia.shopUrl} ariaLabel="shop">
                        <FontAwesomeIcon icon={['fas', 'shopping-bag']} />
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

export default withRouter(connect(mapStateToProps, actions)(withTranslate(HeaderActions)));