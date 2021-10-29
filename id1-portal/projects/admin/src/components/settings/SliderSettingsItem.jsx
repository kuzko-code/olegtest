import React from 'react';
import { withTranslate } from 'react-redux-multilingual';
import Select from 'react-select';
import '../../../public/assets/css/newssettings.css';

const SliderSettingsItem = ({
  data,
  allNews,
  idx,
  moveItemDown,
  moveItemUp,
  deleteItem,
  updateItem,
}) => {
  const defaultValue = { value: data.id, label: data.title };
  const options = allNews.map((item) => ({
    value: item.id,
    label: item.title,
  }));

  const handleChangeOption = (selected) => {
    updateItem(selected, idx);
  };

  const onClickUp = () => {
    moveItemUp(idx);
  };

  const onClickDown = () => {
    moveItemDown(idx);
  };

  const onClickDelete = () => {
    deleteItem(idx);
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
            onClick={onClickUp}
            className="btn btn-light border array-item-move-up sliderSettingsItem__button"
            tabIndex="-1"
          >
            <i className="glyphicon glyphicon-arrow-up"></i>
          </button>
          <button
            type="button"
            onClick={onClickDown}
            className="btn btn-light border array-item-move-down sliderSettingsItem__button"
            tabIndex="-1"
          >
            <i className="glyphicon glyphicon-arrow-down"></i>
          </button>
          <button
            type="button"
            onClick={onClickDelete}
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

export default withTranslate(SliderSettingsItem);
