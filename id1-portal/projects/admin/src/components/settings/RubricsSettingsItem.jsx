import React from 'react';
import { useTranslate } from 'react-redux-multilingual';
import Select from 'react-select';
import '../../../public/assets/css/newssettings.css';
import { sortArray } from '../../services/helpers.js';

const RubricsSettingsItem = ({
  rubricsNews,
  data,
  idx,
  rubrics,
  setBanner,
}) => {
  const translate = useTranslate();
  const defaultValue = {
    value: data.id,
    label: data.id === 0 ? translate('withoutRubrics') : data.title,
  };
  const options = rubrics
    .map((item) => ({
      value: item.id,
      label: item.title,
    }))
    .sort(sortArray);

  options.unshift({ value: 0, label: translate('withoutRubrics') });

  const moveItemUp = () => {
    if (idx === 0) {
      return;
    }

    setBanner((banner) => {
      const b = JSON.parse(JSON.stringify(banner));

      b.rubrics.splice(idx - 1, 2, b.rubrics[idx], b.rubrics[idx - 1]);
      return b;
    });
  };

  const moveItemDown = () => {
    if (idx === rubricsNews.length - 1) {
      return;
    }

    setBanner((banner) => {
      const b = JSON.parse(JSON.stringify(banner));

      b.rubrics.splice(idx, 2, b.rubrics[idx + 1], b.rubrics[idx]);
      return b;
    });

    if (idx === rubricsNews.length - 1) {
      return;
    }
  };

  const deleteItem = () => {
    setBanner((banner) => {
      const b = JSON.parse(JSON.stringify(banner));
      b.rubrics.splice(idx, 1);
      return b;
    });
  };

  const handleChangeOption = (item) => {
    setBanner((banner) => {
      const b = JSON.parse(JSON.stringify(banner));
      const res = rubrics.find((rubricsNews) => rubricsNews.id === item.value);

      b.rubrics[idx] = res?.id || 0;
      return b;
    });
  };

  return (
    <div className="row mb-4 d-flex justify-content-between">
      <div className="col" style={{ display: 'inline-block' }}>
        <div
          className="newsSettings"
          style={{ width: '100%', display: 'inline-block' }}
        >
          <Select
            options={options}
            defaultValue={defaultValue}
            onChange={handleChangeOption}
            placeholder=""
          />
        </div>
      </div>

      <div className=" array-item-toolbox col-auto">
        <div
          className="btn-group  selectActionButtons"
          style={{ display: 'inline-flex', justifyContent: 'space-around' }}
        >
          <button
            type="button"
            onClick={moveItemUp}
            className="btn btn-light border array-item-move-up sliderSettingsItem__button"
            tabIndex="-1"
          >
            <i className="glyphicon glyphicon-arrow-up"></i>
          </button>
          <button
            type="button"
            onClick={moveItemDown}
            className="btn btn-light border array-item-move-down sliderSettingsItem__button"
            tabIndex="-1"
          >
            <i className="glyphicon glyphicon-arrow-down"></i>
          </button>
          <button
            type="button"
            onClick={deleteItem}
            className="btn btn-danger array-item-remove sliderSettingsItem__button"
            tabIndex="-1"
          >
            <i className="glyphicon glyphicon-remove"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RubricsSettingsItem;
