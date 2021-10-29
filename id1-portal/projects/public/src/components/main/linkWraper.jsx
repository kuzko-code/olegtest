import React from 'react';
import "../../../public/assets/css/layout/banner.css";
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import * as actions from '../../redux/settings/actions.js';
import classnames from 'classnames';
import CustomLink from '../util/CustomLink.jsx';

const LinkWrapper = (props) => {
    const { file, title, url } = props.data;
    const wrapperClasses = classnames('link-wrapper movable-widget', {
        'link-wrapper-wide': props.settings.Layout.header === 'MonochromeLimited',
    });

    return (
        <>
            {
                file &&
                <div className={wrapperClasses}>
                    {title && (
                        url ? <CustomLink className="title" url={url}>
                            {title}
                        </CustomLink> :
                            <div className="title">{title}</div>
                    )}
                    {
                        url ?
                            <CustomLink url={url}>
                                <img
                                    src={file}
                                    alt={title || url}
                                    className={
                                        title && 'dark'
                                    }
                                />
                            </CustomLink>
                            : <img
                                src={file}
                                alt={title || file}
                                className={
                                    title && 'dark'
                                }
                            />
                    }
                </div>
            }
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        settings: state.reducerSettings,
        language: state.Intl.locale,
    };
};

export default withRouter(connect(mapStateToProps, actions)(withTranslate(LinkWrapper)));