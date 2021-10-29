import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { formatDate } from '../../services/helpers.js';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

const BlockViewRubricItem = ({ news, translate }) => {
  const language = useSelector((state) => state.Intl.locale);

  const { title, id, published_date, main_picture } = news;

  const date = formatDate(published_date, translate('localeCode'));

  return (
    <div className="blockViewRubricItem__wrapper">
      <div className="post-thumb clearfix mb-2">
        <div className="post-thumb resized-img-container">
          <img
            src={main_picture}
            alt={`image for ${title}`}
            width={300}
            className="blockViewRubricItem__img"
          />
        </div>
      </div>
      <p className="blockViewRubricItem__date">{date}</p>
      <Link to={`${language}/news/${id}`} className="blockViewRubricItem__link">
        <p className="post-title title-small font-weight-normal blockViewRubricItem__title">
          {title}
        </p>
      </Link>
    </div>
  );
};

export default withTranslate(BlockViewRubricItem);
