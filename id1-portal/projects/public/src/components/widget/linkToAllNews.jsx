import React from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { useSelector } from 'react-redux';
import LinkToAll from '../LinkToAll/LinkToAll.jsx'

const LinkToAllNews = ({ translate }) => {
  const locateForURL = useSelector((state) => `/${state.Intl.locale}`);
  return (<LinkToAll href={`${locateForURL}/newslist`} title={translate('allNews')} />);
};

export default withTranslate(LinkToAllNews);
