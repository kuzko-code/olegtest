import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faLinkedinIn, faFacebook, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { connect } from 'react-redux'
import * as actions from '../../../redux/settings/actions.js';
import { TabHeader, CustomLink } from '../../ReExportComponents.js'

import "./SocialNetwork.css"

class SocialNetwork extends Component {
    render() {
        const { socialMedia, translate } = this.props;

        return (
            <div className="widget color-default color-theme">
                <TabHeader title={translate('ourSocialNetworks')} />
                {socialMedia !== null ?
                    <ul className="social-icon">
                        <li className="mb-2 mr-2">
                            <CustomLink url={socialMedia.facebookUrl} ariaLabel="facebook">
                                <i className="fa fa-facebooks">
                                    <FontAwesomeIcon icon={faFacebook} />
                                </i>
                            </CustomLink>
                        </li>
                        <li className="mb-2 mr-2">
                            <CustomLink url={socialMedia.twitterUrl} ariaLabel="twitter">
                                <i className="fa fa-twitters">
                                    <FontAwesomeIcon icon={faTwitter} />
                                </i>
                            </CustomLink>
                        </li>
                        <li className="mb-2 mr-2">
                            <CustomLink url={socialMedia.linkedinUrl} ariaLabel="linkedin">
                                <i className="fa fa-linkedins">
                                    <FontAwesomeIcon icon={faLinkedinIn} />
                                </i>
                            </CustomLink>
                        </li>
                        <li className="mb-2 mr-2">
                            <CustomLink url={socialMedia.youtubeUrl} ariaLabel="youtube">
                                <i className="fa fa-youtubes">
                                    <FontAwesomeIcon icon={faYoutube} />
                                </i>
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