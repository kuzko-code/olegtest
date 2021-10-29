import React from 'react';
import { useTranslate } from 'react-redux-multilingual';
import SectionHeader from '../../components/header/SectionHeader.jsx';
import VisitorsList from './visitorsList.jsx';

const IndexVisitors = (props) => {
    const translate = useTranslate();

    return (
        <div>
            <SectionHeader title={translate("personalCabinet")} />
            <div className="p-4">
                <VisitorsList/>
            </div>

        </div>
    )
}
export default IndexVisitors;