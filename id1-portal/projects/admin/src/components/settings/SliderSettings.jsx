import React from 'react';
import shortid from 'shortid';
import { useTranslate } from 'react-redux-multilingual';

import SliderSettingsItem from './SliderSettingsItem.jsx';

const SliderSettings = ({ newsIds, blockIdx, allNews, setBanner }) => {
  const translate = useTranslate();

  const news = newsIds.map((newsId) => {
    const res = allNews.find((item) => item.id === newsId);
    if (res === undefined) {
      return {
        id: newsId,
        title: '',
        published_date: '',
        rubric: {},
      };
    }

    return res;
  });

  const moveItemUp = (idx) => {
    if (idx === 0) {
      return;
    }

    setBanner((banner) => {
      const b = JSON.parse(JSON.stringify(banner));

      b[blockIdx].splice(idx - 1, 2, newsIds[idx], newsIds[idx - 1]);
      return b;
    });
  };

  const moveItemDown = (idx) => {
    if (idx === newsIds.length - 1) {
      return;
    }

    setBanner((banner) => {
      const b = JSON.parse(JSON.stringify(banner));

      b[blockIdx].splice(idx, 2, newsIds[idx + 1], newsIds[idx]);
      return b;
    });
  };

  const deleteItem = (idx) => {
    setBanner((banner) => {
      const b = JSON.parse(JSON.stringify(banner));
      b[blockIdx].splice(idx, 1);
      return b;
    });
  };

  const addItem = () => {
    setBanner((banner) => {
      const b = JSON.parse(JSON.stringify(banner));
      b[blockIdx] = [...newsIds, Date.now().toString()];
      return b;
    });
  };

  const updateItem = (item, idx) => {
    setBanner((banner) => {
      const b = JSON.parse(JSON.stringify(banner));
      const res = allNews.find((news) => news.id === item.value);
      b[blockIdx][idx] = res.id;
      return b;
    });
  };

  return (
    <div className="mb-4">
      <h5>{`${translate('slider')} ${blockIdx + 1}`}</h5>
      {news.map((item, idx) => (
        <SliderSettingsItem
          key={shortid.generate()}
          data={item}
          allNews={allNews}
          idx={idx}
          moveItemDown={moveItemDown}
          moveItemUp={moveItemUp}
          deleteItem={deleteItem}
          updateItem={updateItem}
        />
      ))}

      <div style={{ textAlign: 'right' }}>
        <button
          type="button"
          className="btn btn-mint-green btn-add col-xs-12 btnModalAddClose"
          tabIndex="0"
          onClick={addItem}
        >
          <i className="glyphicon glyphicon-plus"></i>
        </button>
      </div>
    </div>
  );
};

export default SliderSettings;
