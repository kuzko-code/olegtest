import React from 'react';
import { Link } from 'react-router-dom';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import './LinkToAll.css'

const LinkToAll = ({ href, title }) =>
  <Link to={`${href}`} className="linkToAll">
    <div className="linkToAll__title">{title}</div>
    <div className="linkToAll__iconWrapper">
      <ChevronRightIcon fontSize="small" className="linkToAll__icon" />
    </div>
  </Link>

export default LinkToAll;
