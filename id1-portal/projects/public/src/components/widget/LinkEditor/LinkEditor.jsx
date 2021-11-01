import React from 'react';

import "./LinkEditor.css";

import { TabHeader } from '../../ReExportComponents.js'

const LinkEditor = ({ form_data }) => {
    const { content, title } = form_data;

    return (
        title && content ?
            <div>
                <div className="link-editor">
                    <TabHeader title={title} />
                    <div className="entry-content" dangerouslySetInnerHTML={{ __html: content }} />
                </div>
            </div> : <></>
    )
}

export default LinkEditor;