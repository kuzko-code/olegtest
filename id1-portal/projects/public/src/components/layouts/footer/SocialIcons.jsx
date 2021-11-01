import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faLinkedinIn, faFacebookF, faYoutube, faTelegramPlane } from '@fortawesome/free-brands-svg-icons'
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons'
import React from 'react';
import { CustomLink } from '../../ReExportComponents.js'

const SocialIcons = ({
  twitterUrl,
  linkedinUrl,
  facebookUrl,
  youtubeUrl,
  telegramNotification,
  shopUrl,
}) => {
  return (
    <div className="footer__iconsWrapper">
      {twitterUrl && (
        <CustomLink url={twitterUrl} className="mx-2" ariaLabel="twitter">
          <FontAwesomeIcon color="#1DA1F2" icon={faTwitter} />
        </CustomLink>
      )}
      {linkedinUrl && (
        <CustomLink url={linkedinUrl} className="mx-2" ariaLabel="linkedin">
          <FontAwesomeIcon color="#0a66c2" icon={faLinkedinIn} />
        </CustomLink>
      )}
      {facebookUrl && (
        <CustomLink url={facebookUrl} className="mx-2" ariaLabel="facebook">
          <FontAwesomeIcon color="#4267B2" icon={faFacebookF} />
        </CustomLink>
      )}
      {youtubeUrl && (
        <CustomLink url={youtubeUrl} className="mx-2" ariaLabel="youtube">
          <FontAwesomeIcon color="red" icon={faYoutube} />
        </CustomLink>
      )}
      {telegramNotification.enabled && telegramNotification.channel_url && (
        <CustomLink
          url={telegramNotification.channel_url}
          className="mx-2"
          ariaLabel="telegram"
        >
          <FontAwesomeIcon color="#0088cc" icon={faTelegramPlane} />
        </CustomLink>
      )}
      {shopUrl && (
        <CustomLink url={shopUrl} className="mx-2" ariaLabel="shop">
          <FontAwesomeIcon color="#4267B2" icon={faShoppingBag} />
        </CustomLink>
      )}
    </div>
  );
};

export default SocialIcons;
