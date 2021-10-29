import React from 'react';
import { FacebookProvider, Comments } from 'react-facebook';
import { withTranslate } from 'react-redux-multilingual';
import { useSelector } from 'react-redux';

const FacebookComments = (props) => {
    const settings = useSelector((state) => state.reducerSettings.Contacts.socialMedia.facebookSettings);
    const translate = props.translate;
    return (
        <>
            {settings && settings.appID && settings.commentsEnable &&
                <FacebookProvider
                    language={translate('localeCode_facebook') || 'en_US'}
                    appId={settings.appID}>
                    <Comments
                        href={props.href || window.location.href}
                        width="100%"
                        numPosts={5}
                        orderBy={"reverse_time"} />
                </FacebookProvider>}
        </>)
};

export default withTranslate(FacebookComments);