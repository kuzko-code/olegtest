import React from 'react';
import {
  Checkbox,
  FormControlLabel,
  makeStyles,
  Radio,
  RadioGroup,
} from '@material-ui/core';

const useStyles = makeStyles({
  label: {
    fontSize: 'inherit',
    fontFamily: 'inherit',
  },
});
//CheckboxesWidget
export const CustomArrayOfCheckboxes = (props) => {
  const { id, disabled, options, value, autofocus, readonly, onChange } = props;
  const { enumOptions } = options;

  return (
    <>
      <div className="checkboxes" id={id}>
        {enumOptions.map((option, index) => {
          const checked = value.indexOf(option.value) !== -1;
          const disabledCls = disabled || readonly ? "disabled" : "";
          const checkbox = (
            <span>
              <FormControlLabel
                id={`${id}_${index}`}
                control={
                  <Checkbox
                    checked={checked}
                    disabled={disabled || readonly}
                    autoFocus={autofocus && index === 0}
                    onChange={event => {
                      const all = enumOptions.map(({ value }) => value);
                      if (event.target.checked) {
                        const updated = [...value, option.value];
                        onChange(all.filter(i => updated.includes(i)));
                      } else {
                        onChange(value.filter(v => v !== option.value));
                      }
                    }}
                    style={{ color: '#1ab394' }}
                  />
                }
                label={option.label}
              />
            </span>
          );
          return (
            <div key={index} className={`checkbox mb-0 ${disabledCls}`}>
              <label>{checkbox}</label>
            </div>
          );
        })}
      </div>


    </>
  );
};

export const CustomCheckbox = (props) => {
  const classes = useStyles();

  return (
    <FormControlLabel
      id="custom_checkbox"
      classes={{
        label: classes.label,
      }}
      control={
        <Checkbox
          checked={props.value}
          onChange={() => props.onChange(!props.value)}
          style={{ color: '#1ab394' }}
        />
      }
      label={props.label}
    />
  );
};

export const CustomRadio = (props) => {
  const classes = useStyles();
  return (
    <RadioGroup row name="custom-radio" id="custom-radio">
      {props.schema.oneOf.map((item) => (
        <FormControlLabel
          key={item.const}
          checked={item.const === props.value}
          value={item.const}
          control={
            <Radio id={item.const} size="small" style={{ color: '#43a047' }} />
          }
          label={item.title}
          labelPlacement="end"
          onChange={() => props.onChange(item.const)}
          classes={{ label: classes.label }}
        />
      ))}
    </RadioGroup>
  );
};
