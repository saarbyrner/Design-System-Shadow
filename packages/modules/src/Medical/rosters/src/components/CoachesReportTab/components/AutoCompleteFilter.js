// @flow

import {
  Autocomplete,
  Checkbox,
  TextField,
} from '@kitman/playbook/components/index';
import { KitmanIcon } from '@kitman/playbook/icons';

type FilterKeyType = 'positions' | 'squads' | 'issues';

export const AutocompleteFilter = ({
  testId,
  label,
  options,
  filterKey,
  isMobile,
  filters,
  onFiltersUpdate,
  customStyles,
}: {
  testId: string,
  label: string,
  options: Array<{ value: string | number, label: string }>,
  filterKey: FilterKeyType,
  isMobile: boolean,
  filters: Object,
  onFiltersUpdate: Function,
  customStyles?: Object,
}) => {
  const icon = <KitmanIcon name="CheckBoxOutlineBlank" />;
  const checkedIcon = <KitmanIcon name="CheckBox" />;

  // State is structured around id values but MUI requires the full object
  const getObjectByValueKeys = (values, objects) => {
    const matchingObjects = [];

    (objects ?? []).forEach((obj) => {
      if (values?.includes(obj.value)) {
        matchingObjects.push(obj);
      }
    });

    return matchingObjects;
  };

  const getFilterStyle = (isMobileView) => {
    const mobileStyles = {
      width: '100%',
      paddingTop: 10,
    };
    const desktopStyles = {
      width: '16.5rem',
    };
    return isMobileView ? mobileStyles : desktopStyles;
  };

  return (
    <div data-testid={testId} style={{ display: 'contents' }}>
      <Autocomplete
        multiple
        disableCloseOnSelect
        disablePortal
        value={filters && getObjectByValueKeys(filters[filterKey], options)}
        options={options || []}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        getOptionLabel={(option) => option?.label}
        limitTags={1}
        renderOption={(renderProps, option, { selected }) => (
          <li {...renderProps}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{
                marginRight: 8,
              }}
              checked={selected}
            />
            {option?.label}
          </li>
        )}
        style={{ ...getFilterStyle(isMobile), ...customStyles }}
        renderInput={(params) => <TextField {...params} label={label} />}
        onInputChange={(event, value, reason) => {
          // User clicks the x in the input
          if (reason === 'clear' && filters) {
            onFiltersUpdate({
              ...filters,
              [filterKey.toString()]: [],
            });
          }
        }}
        onChange={(selectedItems, newValue) => {
          if (filters) {
            return onFiltersUpdate({
              ...filters,
              [filterKey.toString()]: newValue.map(({ value }) => value),
            });
          }
          return null;
        }}
      />
    </div>
  );
};

export default AutocompleteFilter;