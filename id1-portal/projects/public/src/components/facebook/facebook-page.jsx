import React from 'react';
import { FacebookProvider, Page } from 'react-facebook';
import { withTranslate } from 'react-redux-multilingual';
import { useSelector } from 'react-redux';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { TabHeader } from '../ReExportComponents.js'

const FacebookPage = (props) => {
    const settings = useSelector((state) => state.reducerSettings.Contacts.socialMedia.facebookSettings);
    const { translate, form_data } = props;
    const { title, href, tabs, hideCover, smallHeader } = form_data;
    let min360 = useMediaQuery('(min-width:360px)');
    let min380 = useMediaQuery('(min-width:380px)');
    let min400 = useMediaQuery('(min-width:400px)');
    let min420 = useMediaQuery('(min-width:420px)');
    let min440 = useMediaQuery('(min-width:440px)');
    let min460 = useMediaQuery('(min-width:460px)');
    let min480 = useMediaQuery('(min-width:480px)');
    let min500 = useMediaQuery('(min-width:500px)');
    let min520 = useMediaQuery('(min-width:520px)');
    let min540 = useMediaQuery('(min-width:540px)');
    let min991 = useMediaQuery('(min-width:991px)');
    let min1060 = useMediaQuery('(min-width:1060px)');
    let min1120 = useMediaQuery('(min-width:1120px)');
    let min1180 = useMediaQuery('(min-width:1180px)');
    let min1240 = useMediaQuery('(min-width:1240px)');
    let min1300 = useMediaQuery('(min-width:1300px)');
    let width = 280;
    if (min1300) {
        width = 380;
    } else if (min1240) {
        width = 360;
    } else if (min1180) {
        width = 340;
    } else if (min1120) {
        width = 320;
    } else if (min1060) {
        width = 300;
    } else if (min991) {
        width = 280;
    } else if (min540) {
        width = 500;
    } else if (min520) {
        width = 480;
    } else if (min500) {
        width = 460;
    } else if (min480) {
        width = 440;
    } else if (min460) {
        width = 420;
    } else if (min440) {
        width = 400;
    } else if (min420) {
        width = 380;
    } else if (min400) {
        width = 360;
    } else if (min380) {
        width = 340;
    } else if (min360) {
        width = 320;
    }

    return (
        <>
            {settings && settings.appID &&
                <div className="widget color-default color-theme">
                    <TabHeader title={title} />
                    <FacebookProvider
                        language={translate('localeCode_facebook') || 'en_US'}
                        appId={settings.appID}>
                        <Page
                            width={width}
                            href={href}
                            tabs={(tabs || []).join(',')}
                            hideCover={!!hideCover}
                            smallHeader={!!smallHeader}
                            adaptContainerWidth={true}
                        />
                    </FacebookProvider>
                </div>}
        </>)
};

export default withTranslate(FacebookPage);