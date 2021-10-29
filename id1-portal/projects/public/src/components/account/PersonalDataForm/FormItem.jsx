import React from 'react';

const FormItem = ({
  itemId,
  label,
  spanLabel,
  spanItem,
  isRequired,
  children,
}) => {
  return (
    <div className="row align-items-center mb-3">
      <label
        htmlFor={itemId}
        className={`col-sm-${spanLabel} col-form-label ${
          isRequired && 'requiredCustom'
        }`}
      >
        {label}
      </label>
      <div className={`col-sm-${spanItem}`}>{children}</div>
    </div>
  );
};

export default FormItem;
