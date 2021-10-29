import React from 'react';
import { useSelector } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { Link } from 'react-router-dom';
import { formatDate } from '../../services/helpers.js';

const ListViewRubricItem = ({ news, translate }) => {
  const language = useSelector((state) => state.Intl.locale);

  const { title, id, published_date } = news;

  const date = formatDate(published_date, translate('localeCode'));

  return (
    <div className="listViewRubricItem__wrapper">
      <p className="listViewRubricItem__date">{date}</p>
      <Link to={`${language}/news/${id}`} className="listViewRubricItem__link">
        <p className="post-title title-small font-weight-normal listViewRubricItem__title mb-2">
          {title}
        </p>
      </Link>
    </div>
  );
};

export default withTranslate(ListViewRubricItem);
