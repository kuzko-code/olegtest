import React from 'react';
import { withTranslate } from 'react-redux-multilingual';
import {
    FacebookShareButton,
    FacebookIcon,
    LinkedinShareButton,
    LinkedinIcon,
    TwitterShareButton,
    TwitterIcon
} from 'react-share';
import './PageShare.css'

const PageShare = ({ className, translate }) =>
    <div className={"page-share " + (className || "")}>
        <div className="page-share-title">{translate('share')}</div>
        <div className="page-share-buttons">
            <FacebookShareButton
                className=""
                url={process.env.PUBLIC_HOST + window.location.pathname}>
                <span title={translate('shareTooltip')}>
                    <FacebookIcon size={32} round={true} />
                </span>
            </FacebookShareButton>
            <TwitterShareButton
                className=""
                url={process.env.PUBLIC_HOST + window.location.pathname}>
                <span title={translate('shareTooltip')}>
                    <TwitterIcon size={32} round={true} />
                </span>
            </TwitterShareButton>
            <LinkedinShareButton
                className=""
                url={process.env.PUBLIC_HOST + window.location.pathname}>
                <span title={translate('shareTooltip')}>
                    <LinkedinIcon size={32} round={true} />
                </span>
            </LinkedinShareButton>
        </div>
    </div>;
export default withTranslate(PageShare);
