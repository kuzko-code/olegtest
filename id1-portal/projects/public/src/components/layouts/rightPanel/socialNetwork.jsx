import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux'
import * as actions from '../../../redux/settings/actions.js';
import TabHeader from '../../main/tabHeader.jsx'
import CustomLink from '../../util/CustomLink.jsx'
class SocialNetwork extends Component {


    render() {
        const { colorThemeWidget, socialMedia, translate } = this.props;

        return (
            <div className={colorThemeWidget}>
                <TabHeader title={translate('ourSocialNetworks')} />
                {socialMedia !== null ?
                    <ul className="social-icon">
                        <li className="mb-2 mr-2">
                            <CustomLink url={socialMedia.facebookUrl} ariaLabel="facebook">
                                <i className="fa fa-facebooks"><FontAwesomeIcon icon={['fab', 'facebook']} /></i>
                            </CustomLink>
                        </li>
                        <li className="mb-2 mr-2">
                            <CustomLink url={socialMedia.twitterUrl} ariaLabel="twitter">
                                <i className="fa fa-twitters"><FontAwesomeIcon icon={['fab', 'twitter']} /></i>
                            </CustomLink>
                        </li>
                        <li className="mb-2 mr-2">
                            <CustomLink url={socialMedia.linkedinUrl} ariaLabel="linkedin">
                                <i className="fa fa-linkedins"><FontAwesomeIcon icon={['fab', 'linkedin-in']} /></i>
                            </CustomLink>
                        </li>
                        <li className="mb-2 mr-2">
                            <CustomLink url={socialMedia.youtubeUrl} ariaLabel="youtube">
                                <i className="fa fa-youtubes"><FontAwesomeIcon icon={['fab', 'youtube']} /></i>
                            </CustomLink>
                        </li>
                    </ul>
                    : null}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        socialMedia: state.reducerSettings.Contacts.socialMedia
    };
};

export default connect(mapStateToProps, actions)(withTranslate(SocialNetwork));