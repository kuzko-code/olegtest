import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import CustomLink from '../../util/CustomLink.jsx'

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
          <FontAwesomeIcon color="#1DA1F2" icon={['fab', 'twitter']} />
        </CustomLink>
      )}
      {linkedinUrl && (
        <CustomLink url={linkedinUrl} className="mx-2" ariaLabel="linkedin">
          <FontAwesomeIcon color="#0a66c2" icon={['fab', 'linkedin-in']} />
        </CustomLink>
      )}
      {facebookUrl && (
        <CustomLink url={facebookUrl} className="mx-2" ariaLabel="facebook">
          <FontAwesomeIcon color="#4267B2" icon={['fab', 'facebook-f']} />
        </CustomLink>
      )}
      {youtubeUrl && (
        <CustomLink url={youtubeUrl} className="mx-2" ariaLabel="youtube">
          <FontAwesomeIcon color="red" icon={['fab', 'youtube']} />
        </CustomLink>
      )}
      {telegramNotification.enabled && telegramNotification.channel_url && (
        <CustomLink
          url={telegramNotification.channel_url}          
          className="mx-2"
          ariaLabel="telegram"
        >
          <FontAwesomeIcon color="#0088cc" icon={['fab', 'telegram-plane']} />
        </CustomLink>
      )}
      {shopUrl && (
        <CustomLink url={shopUrl} className="mx-2" ariaLabel="shop">
          <FontAwesomeIcon color="#4267B2" icon={['fas', 'shopping-bag']} />
        </CustomLink>
      )}
    </div>
  );
};

export default SocialIcons;
