import React, { useEffect } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTags } from '../../../redux/tags/tagsOperations.js';
import { TabHeader } from '../../ReExportComponents.js'

import './PopularTags.css'

const PopularTags = ({ activeTag, activateTags, translate }) => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.Intl.locale);
  const { data, isLoading, error } = useSelector((state) => state.tags);

  useEffect(() => {
    if (data) {
      return;
    }
    dispatch(getTags(language));
  }, [data]);

  const popularTags = data
    ? [translate('allTags'), ...data]
    : [translate('allTags')];

  const hasData = !(isLoading || error);

  return (
    <div className="widget-popular-tags">
      <TabHeader title={translate('popularTags')} />
      {hasData && (
        <ul className="tags-list">
          {popularTags.map((tag, index) => (
            <li
              tag={`${tag}`}
              key={index}
              className={activeTag == tag ? 'active' : null}

            >
              <div tag={`${tag}`} onClick={activateTags}>
                <Link
                  to={`/${language}/newslist`}
                  tag={`${tag}`}
                >
                  {tag}
                </Link>
              </div>

            </li>
          ))}
        </ul>
      )}
      {error && (
        <>
          <b>Error!</b>
          <p>{error}</p>
        </>
      )}
    </div>
  );
};

export default withTranslate(PopularTags);
