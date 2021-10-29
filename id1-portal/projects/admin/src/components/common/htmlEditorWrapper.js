import React from 'react';

const contentWidth = {
  newsForm: 830 + 34,
  pageForm: 1260 + 34,
  employeeForm: 844 + 34,
  linksEditor: 414,
};

export const htmlEditorWrapper = (parent, isScroll) => (children) => {
  const editorWidth = isScroll
    ? contentWidth[parent] + 16
    : contentWidth[parent];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        backgroundColor: '#f3f3f4',
        zIndex: 1100,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 50,
          right: 50,
          bottom: 80,
          overflowX: 'auto',
        }}
      >
        <div
          style={{
            width: editorWidth,
            margin: '0 auto',
            height: '100%',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
