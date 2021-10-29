import React from 'react';
import "../../../../public/assets/css/layout/newspage.css"
import classnames from 'classnames';
import "../../../../public/assets/css/layout/banner.css";

import TabHeader from '../../main/tabHeader.jsx'

const Banner = ({ colorThemeWidget, form_data }) => {
    const { content, title } = form_data;
    const bannerClass = classnames(colorThemeWidget, {
        'banner': true,
    });

    return (
        title && content ?
            <div>
                <div className={bannerClass}>
                    <TabHeader title={title} />
                    <div className="entry-content" dangerouslySetInnerHTML={{ __html: content }} />
                </div>
            </div> : <></>
    )
}

export default Banner;