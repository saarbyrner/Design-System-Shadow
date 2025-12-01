import { screen } from '@testing-library/react';
import moment from 'moment-timezone';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';

import CustomDateRange from '../DateRangeModule/CustomDateRange';

describe('analysis dashboard | <DateRangeModule />', () => {
  const props = {
    dateRange: null,
    onSetDateRange: jest.fn(),
    t: i18nextTranslateStub(),
  };

  describe('DateRangeModule > CustomDateRange', () => {
    beforeEach(() => {
      moment.tz.setDefault('UTC');
      const fakeNowDate = new Date('2024-07-10T15:30:10Z');
      jest.useFakeTimers();
      jest.setSystemTime(fakeNowDate);
    });

    afterEach(() => {
      moment.tz.setDefault();
      jest.useRealTimers();
      jest.clearAllMocks();
    });

    it('renders the title', () => {
      renderWithStore(<CustomDateRange {...props} />);

      expect(screen.getByText('Select Date Range')).toBeInTheDocument();
    });

    it('calls onSetDateRange with todays date if dateRange not supplied', () => {
      renderWithStore(<CustomDateRange {...props} />);

      expect(props.onSetDateRange).toHaveBeenCalledWith({
        end_date: '2024-07-10T23:59:59+00:00',
        start_date: '2024-07-10T00:00:00+00:00',
      });
    });

    it('renders the date range select field with dates from props', () => {
      const updatedProps = {
        ...props,
        dateRange: {
          start_date: '2024-02-26T10:35:31+00:00',
          end_date: '2024-02-26T10:35:31+00:00',
        },
      };

      renderWithStore(<CustomDateRange {...updatedProps} />);

      const button = screen.getByRole('button', {
        name: '26 Feb 2024 - 26 Feb 2024',
      });

      expect(button).toBeInTheDocument();
    });
  });
});
