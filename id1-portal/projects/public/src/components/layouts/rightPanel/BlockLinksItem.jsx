import React from 'react';
import CustomLink from '../../util/CustomLink.jsx';

const BlockLinksItem = ({ data }) => {
  return (
    <div className="blockLinksItem__wrapper">
      <CustomLink url={data.url} className="blockLinks__link">
        <img src={data.file} alt={data.title} className="blockLinks__img" />
        <p className="blockLinks__title">{data.title}</p>
      </CustomLink>
    </div>
  );
};

export default BlockLinksItem;
