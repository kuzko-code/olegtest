import React from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import * as actions from '../../../redux/settings/actions.js';
import classnames from 'classnames';
import { CustomLink } from '../../ReExportComponents.js';

import "./LinkWrapper.css";

const LinkWrapper = (props) => {
    const { file, title, url } = props.data;

    return (
        <>
            {
                file &&
                <div className="link-wrapper link-wrapper-wide">
                    {title && (
                        url ? <CustomLink className="link-wrapper-title" url={url}>
                            {title}
                        </CustomLink> :
                            <div className="link-wrapper-title">{title}</div>
                    )}
                    {url ?
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