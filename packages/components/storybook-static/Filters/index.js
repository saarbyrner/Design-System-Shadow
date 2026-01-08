// @flow
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
} from '@kitman/playbook/components';
import type { Option } from '@kitman/components/src/Select';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import style from './style';

const Filters = {};

type SearchFilterProps = {
  value: string,
  placeholder: string,
  onChange: (value: string) => void,
};

const SearchFilter = (props: SearchFilterProps) => {
  return (
    <FormControl>
      <TextField
        value={props.value}
        label={props.placeholder}
        css={style.inputFilter}
        onChange={(e) => props.onChange(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <KitmanIcon name={KITMAN_ICON_NAMES.Search} />
            </InputAdornment>
          ),
        }}
      />
    </FormControl>
  );
};

type SelectProps<T> = {
  placeholder: string,
  value?: Array<T>,
  onChange: (selectedOptions: Array<T>) => void,
  options?: Array<Option>,
};

const SelectFilter = <T>({
  placeholder,
  value = [],
  onChange,
  options = [],
}: SelectProps<T>) => {
  return (
    <FormControl>
      <InputLabel id={`${placeholder}-label`}>{placeholder}</InputLabel>
      <Select
        labelId={`${placeholder}-label`}
        id={`${placeholder}-field`}
        css={style.inputFilter}
        displayEmpty
        value={value}
        onChange={(e) => onChange(e.target.value)}
        multiple
        endAdornment={
          value.length > 0 && (
            <InputAdornment
              position="end"
              sx={{ marginRight: '16px', cursor: 'pointer' }}
              onClick={() => onChange([])}
            >
              <KitmanIcon name={KITMAN_ICON_NAMES.Close} />
            </InputAdornment>
          )
        }
      >
        {options?.map((option) => {
          return (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

Filters.Search = SearchFilter;
Filters.Select = SelectFilter;

export default Filters;
