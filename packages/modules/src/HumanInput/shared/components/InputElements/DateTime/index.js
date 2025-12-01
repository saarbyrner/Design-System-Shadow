// @flow

import {
  TimePicker,
  DatePicker,
  DateTimePicker,
} from '@kitman/playbook/components';
import moment from 'moment';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';

type Props = {
  element: HumanInputFormElement,
  value: string,
  onChange: Function,
};

const DateTime = (props: Props) => {
  const { organisation } = useOrganisation();
  const locale = organisation?.locale || navigator.language;
  const { element, value, onChange } = props;
  const {
    element_id: elementId,
    text = '',
    type,
    custom_params: customParams,
  } = element.config;

  const handleChange = (time) =>
    time && onChange(moment(time).format('YYYY-MM-DDTHH:mm:ss'));

  const handleChangeMonthYear = (date) =>
    onChange(moment(date).format('MMMM YYYY'));

  const handleChangeYear = (date) => onChange(moment(date).format('YYYY'));

  const createDateRestriction = (dateValue: ?string) =>
    dateValue ? moment(dateValue) : null;

  const minDate = createDateRestriction(element.config?.min);
  const maxDate = createDateRestriction(element.config?.max);

  switch (type) {
    case 'date_time':
      return (
        <DateTimePicker
          id={`${elementId}-dateTimePicker`}
          label={text}
          value={value && moment(value)}
          onChange={handleChange}
          readOnly={customParams?.readonly}
        />
      );
    case 'time':
      return (
        <TimePicker
          id={`${elementId}-timePicker`}
          label={text}
          value={value && moment(value)}
          onChange={handleChange}
          readOnly={customParams?.readonly}
        />
      );
    case 'month_year':
      return (
        <DatePicker
          id={`${elementId}-dateTimePicker`}
          label={text}
          value={value && moment(value)}
          onChange={handleChangeMonthYear}
          readOnly={customParams?.readonly}
          format="MMMM YYYY"
          views={['month', 'year']}
        />
      );
    case 'year':
      return (
        <DatePicker
          id={`${elementId}-dateTimePicker`}
          label={text}
          value={value && moment(value)}
          onChange={handleChangeYear}
          openTo="year"
          readOnly={customParams?.readonly}
          format="YYYY"
          views={['year']}
        />
      );
    case 'date':
    default:
      return (
        <DatePicker
          id={`${elementId}-dateTimePicker`}
          label={text}
          value={value && moment(value)}
          onChange={handleChange}
          readOnly={customParams?.readonly}
          format={locale === 'en-US' ? 'MM/DD/YYYY' : 'DD/MM/YYYY'}
          minDate={minDate}
          maxDate={maxDate}
        />
      );
  }
};

export default DateTime;
