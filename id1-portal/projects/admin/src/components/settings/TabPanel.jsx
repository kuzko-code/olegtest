import React from 'react';

const TabPanel = ({ children, currentTab, index, hasData }) => {
  return (
    <>
      {Number(currentTab) === index && hasData && (
        <div
          style={{
            paddingTop: 20,
            paddingLeft: 30,
            paddingRight: 30,
            backgroundColor: 'white',
          }}
        >
          {children}
        </div>
      )}
    </>
  );
};

export default TabPanel;
