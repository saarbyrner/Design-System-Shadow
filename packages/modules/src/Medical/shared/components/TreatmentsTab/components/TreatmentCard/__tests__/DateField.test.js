import moment from 'moment';
import { render, screen } from '@testing-library/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { setI18n } from 'react-i18next';

import i18n from '@kitman/common/src/utils/i18n';

import DateField from '../DateField';

setI18n(i18n);

describe('<DateField />', () => {
  const baseProps = {
    defaultString: 'No Date',
    isEditing: false,
    isDisabled: false,
    initialDate: moment('2022-07-22T00:00:00Z'),
    onUpdateDate: jest.fn(),
  };

  test('renders the correct content', () => {
    render(
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
        <DateField {...baseProps} />
      </LocalizationProvider>
    );
    expect(screen.getByText('Jul 22, 2022')).toBeInTheDocument();
  });

  test('renders the correct content when no initialDate', () => {
    render(
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
        <DateField {...baseProps} initialDate={null} />
      </LocalizationProvider>
    );
    expect(screen.getByText('No Date')).toBeInTheDocument();
  });

  describe('when isEditing', () => {
    test('renders a date picker with the initial value', () => {
      render(
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
          <DateField {...baseProps} isEditing />
        </LocalizationProvider>
      );
      // The playbook DatePicker renders an input with a formatted date value (en-gb)
      expect(screen.getByDisplayValue('22 Jul 2022')).toBeInTheDocument();
    });
  });
});
