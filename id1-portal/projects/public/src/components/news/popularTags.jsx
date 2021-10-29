import React, { useEffect } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTags } from '../../redux/tags/tagsOperations.js';
import TabHeader from '../main/tabHeader.jsx'

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
    <>
      <TabHeader title={translate('popularTags')} />
      {hasData && (
        <ul className="unstyled clearfix" id="popular-tags">
          {popularTags.map((tag) => (
            <li
              key={tag}
              tag={`${tag}`}
              className={activeTag == tag ? 'activetag' : null}
            >
              <div tag={`${tag}`} onClick={activateTags} className="tag-widget">
                <Link
                  to={`/${language}/newslist`}
                  style={{ textDecoration: 'none' }}
                  tag={`${tag}`}
                >
                  <span tag={`${tag}`}>{tag}</span>
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
    </>
  );
};

export default withTranslate(PopularTags);
