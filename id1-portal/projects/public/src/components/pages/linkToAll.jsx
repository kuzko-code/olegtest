import React from 'react';
import { Link } from 'react-router-dom';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const LinkToAll = ({ href, title }) => {

  return (
    <Link to={`${href}`} className="allNewsLink">
      <div className="allNewsLink__title">{title}</div>
      <div className="allNewsLink__iconWrapper">
        <ChevronRightIcon fontSize="small" className="allNewsLink__icon" />
      </div>
    </Link>
  );
};

export default LinkToAll;
