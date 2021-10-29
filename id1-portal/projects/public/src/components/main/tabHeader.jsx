import React from 'react';
import '../../../public/assets/css/components/tab-header.css'

const elements = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
};

const TabHeader = ({ title, style, variant }) => {

    return (
        <div className="tab-header" style={style}>
            <div className="tab-title-container">
                {React.createElement(
                    elements[variant] || elements.h2,
                    { className: "tab-title" },
                    title
                )}
                <span className="tab-indicator"></span>
            </div>
        </div>
    );
};

TabHeader.defaultProps = {
    variant: 'h2',
};

export default TabHeader;