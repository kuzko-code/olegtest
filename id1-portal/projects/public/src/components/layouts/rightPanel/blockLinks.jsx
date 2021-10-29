import React from 'react';
import shortid from 'shortid';
import { withTranslate } from 'react-redux-multilingual';
import { useSelector } from 'react-redux';
import BlockLinksItem from './BlockLinksItem.jsx';

const BlockLinks = ({form_data}) => {

  const formData = Array.isArray(form_data) ? form_data : [];

  return (
    <div className="widget blockLinks__wrapper">
      {formData.map((item) => (
        <BlockLinksItem key={shortid.generate()} data={item} />
      ))}
    </div>
  );
};

export default withTranslate(BlockLinks);
