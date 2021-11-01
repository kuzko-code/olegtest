import React from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { Link } from 'react-router-dom';

import './TagsList.css'

const TagsList = ({ tags }) => {

  return (
    tags.length > 0 &&
    <ul className="tags-list">
      {tags.map((tag) => (
        <li
          key={tag}
        >
          <Link
            to={`/newslist?tag=${tag}`}
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>

  );
};

export default withTranslate(TagsList);
