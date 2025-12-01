// @flow
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import {
  Stack,
  TextField,
  FormControl,
  InputAdornment,
  DateRangePicker,
  Autocomplete,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import moment from 'moment';
import {
  errorOptions,
  distributionTypeOptions,
  emailTypeOptions,
} from '../../shared/constants';
import type { Filters } from '../../shared/types';

type FilterOption = { value: string, label: string };

type SearchFilterProps = {
  value: string,
  label: string,
  onChange: (value: string) => void,
};

const SearchFilter = ({ value, label, onChange }: SearchFilterProps) => (
  <FormControl sx={{ minWidth: '220px', width: '220px' }}>
    <TextField
      label={label}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
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

type SelectFilterProps = {
  value: string | null,
  label: string,
  options: Array<FilterOption>,
  onChange: (value: string | null) => void,
  width: number,
};

const SelectFilter = ({
  value,
  label,
  options,
  onChange,
  width = 116,
}: SelectFilterProps) => (
  <FormControl sx={{ minWidth: `${width}px`, width: `${width}px` }}>
    <Autocomplete
      value={
        value ? options.find((option) => option.value === value) || null : null
      }
      onChange={(_, newValue) => onChange(newValue?.value || null)}
      options={options}
      getOptionLabel={(option) => option.label}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  </FormControl>
);

type DateRangeFilterProps = {
  value: [Date | null, Date | null],
  label: string,
  onChange: (dates: [Date | null, Date | null]) => void,
};

const DateRangeFilter = ({ value, label, onChange }: DateRangeFilterProps) => {
  const hasValue = !!value[0] && !!value[1];
  return (
    <FormControl sx={{ minWidth: '280px', width: '280px' }}>
      <DateRangePicker
        variant="filled"
        label={label}
        value={value}
        onChange={onChange}
        allowFutureDate
        allowAllPastDates
        clearable
        slots={{ field: SingleInputDateRangeField }}
        slotProps={{
          textField: {
            InputProps: {
              endAdornment: !hasValue ? (
                <KitmanIcon name={KITMAN_ICON_NAMES.CalendarTodayOutlined} />
              ) : null,
            },
            clearable: hasValue,
          },
        }}
      />
    </FormControl>
  );
};

type Props = {
  filters: Filters,
  search: {
    recipient: string,
    subject: string,
  },
  handleFiltersChange: (
    key: string,
    value: string | null | Array<string | null>
  ) => void,
  handleSearchChange: (key: string, value: string) => void,
};

const EmailFilters = (props: I18nProps<Props>) => {
  const {
    filters: { type, messageStatus, distributionType, dateRange },
    search: { recipient, subject },
    handleFiltersChange,
    handleSearchChange,
  } = props;

  return (
    <Stack direction="row" width="100%" paddingLeft={2} gap={1}>
      <SelectFilter
        label={props.t('Type')}
        value={type}
        onChange={(value) => handleFiltersChange('type', value)}
        options={emailTypeOptions}
        width={120}
      />
      <SearchFilter
        label={props.t('Search email subject')}
        value={subject}
        onChange={(value) => handleSearchChange('subject', value)}
      />

      <DateRangeFilter
        label={props.t('Sent date range')}
        value={[
          dateRange[0] ? moment(dateRange[0]) : null,
          dateRange[1] ? moment(dateRange[1]) : null,
        ]}
        onChange={(dates) => {
          if (!dates[0] && !dates[1]) {
            handleFiltersChange('dateRange', [null, null]);
          } else if (dates[0] && dates[1]) {
            const formattedDates = dates.map((date) =>
              date
                ? moment(date).format(DateFormatter.dateTransferFormat)
                : null
            );
            handleFiltersChange('dateRange', formattedDates);
          }
        }}
      />

      <SearchFilter
        label={props.t('Search by recipient')}
        value={recipient}
        onChange={(value) => handleSearchChange('recipient', value)}
      />

      <SelectFilter
        label={props.t('Status')}
        value={messageStatus}
        onChange={(value) => handleFiltersChange('messageStatus', value)}
        options={errorOptions}
        width={135}
      />

      <SelectFilter
        label={props.t('Distribution type')}
        value={distributionType}
        onChange={(value) => handleFiltersChange('distributionType', value)}
        options={distributionTypeOptions}
        width={175}
      />
    </Stack>
  );
};

export const EmailFiltersTranslated = withNamespaces()(EmailFilters);
export default EmailFilters;
