import React from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { Link } from 'react-router-dom';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { useSelector } from 'react-redux';

const LinkToAllNews = ({ translate }) => {
  const locateForURL = useSelector((state) => `/${state.Intl.locale}`);

  return (
    <Link to={`${locateForURL}/newslist`} className="allNewsLink">
      <div className="allNewsLink__title">{translate('allNews')}</div>
      <div className="allNewsLink__iconWrapper">
        <ChevronRightIcon fontSize="small" className="allNewsLink__icon" />
      </div>
    </Link>
  );
};

export default withTranslate(LinkToAllNews);
