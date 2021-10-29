import React, { useEffect, useState } from 'react';
import { useTranslate } from 'react-redux-multilingual';
import DatePicker, { registerLocale } from 'react-datepicker';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import InfoIcon from '@material-ui/icons/Info';
import { checkToday, roundTime } from '../../services/helpers';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

const DateTimePicker = ({
  autoPublishDate,
  setAutoPublishDate,
  changePublishDate,
  showCheckBox = false,
  onCheckboxChange,
  checkboxChecked = false,
  checkBoxTooltipText = " ",
}) => {
  const GreenCheckbox = withStyles({
    root: {
      color: green[400],
      '&$checked': {
        color: '#1ab394',
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

  const translate = useTranslate();
  const datePickerValue = autoPublishDate ? new Date(autoPublishDate) : '';
  const [timeIntervals, setTimeIntervals] = useState(60);
  const [lang, setLang] = useState(null);

  useEffect(() => {
    const code = translate("localeCode_date_fns") || "en-US";
    import(`date-fns/locale/${code}/index.js`)
      .then(obj => {
        registerLocale(code, obj.default)
        setLang(code);
      })
      .catch(err => console.error(err))
  }, []);

  const handleDateSelect = (date) => {
    const isToday = checkToday(date);
    const today = new Date();

    if (isToday) {
      setAutoPublishDate(today, roundTime(today));
      return;
    }

    setAutoPublishDate(date, date.setHours(0, 0, 0));
  };

  return (
    <div className="pageElementBox collapsed border-bottom">
      <div className="pageElementBoxTitle border-bottom-0">
          <h5>{translate('publishedDate')}</h5>
        {showCheckBox &&
          <GreenCheckbox
            title={checkBoxTooltipText}
            checked={checkboxChecked}
            onChange={onCheckboxChange}
            value="checked"
          />
        }
      </div>
      <div
        className="pageElementBoxContent"
        style={{
          display: 'block',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <div style={{ marginRight: 8 }}>
            {lang && <DatePicker
              className={'form-control border-radius-1 shadow-none'}
              showTimeSelect
              timeIntervals={timeIntervals}
              timeCaption={translate('time')}
              locale={lang}
              selected={datePickerValue}
              disabledKeyboardNavigation
              // filterDate={filterPassedDate}
              // excludeTimes={excludeTime(
              //   this.state._selectedDate
              // )}
              onSelect={handleDateSelect}
              // onFocus={onFocus}
              onChange={changePublishDate}
              dateFormat="d MMMM yyyy, HH:mm"
            />}
          </div>
          <OverlayTrigger
            overlay={<Tooltip>{translate('autoPublishTooltip')}</Tooltip>}
          >
            <InfoIcon fontSize="small" />
          </OverlayTrigger>
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;
