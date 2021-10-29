import React from 'react';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

const filter = createFilterOptions();

export default function CreateOptionForTitleNav(props) {
  const [value, setValue] = React.useState(null);

  return (
    <Autocomplete
      disabled={!props.selectedNode}
      value={props.selectedNode ? props.selectedNode.label : ""}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          props.onPropertyChange("label", newValue);
          setValue({
            title: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          props.onPropertyChange("label", newValue.inputValue);
          setValue({
            title: newValue.inputValue,
          });
        } else {
          props.onPropertiesChange(newValue);
          setValue(newValue);
        };
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        if (params.inputValue !== '') {
          filtered.push({
            inputValue: params.inputValue,
            title: `${props.translate("add")} "${params.inputValue}"`,
          });
        }
        return filtered;
      }}
      selectOnFocus
      blurOnSelect = {false}
      // clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text"
      options={props.pluginsUrl}
      getOptionLabel={(option) => {
        if (typeof option === 'string') {
          return option;
        }
        if (option.inputValue) {
          return option.inputValue;
        }
        return option.title;
      }}
      renderOption={(option) => option.title}
      freeSolo
      renderInput={(params) => (
        <div ref={params.InputProps.ref}>
          <input type="text" {...params.inputProps} className="form-control border-radius-1 shadow-none" placeholder={props.translate('enterATitle')} required />
        </div>
      )}
    />
  );
}