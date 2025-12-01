import { render } from '@testing-library/react';
import i18n from 'i18next';
import moment from 'moment-timezone';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';
import RowPanel from '../index';

describe('<RowPanel />', () => {
  const i18nT = i18nextTranslateStub(i18n);
  let props = {};

  const onSetDateRangeMock = jest.fn();

  beforeEach(() => {
    moment.tz.setDefault('UTC');
    const fakeNowDate = new Date('2024-07-10T15:30:10Z');
    jest.useFakeTimers();
    jest.setSystemTime(fakeNowDate);
    const squadAthletes = {
      position_groups: [
        {
          id: '1',
          name: 'Position Group',
          positions: [
            {
              id: '1',
              name: 'Position',
              athletes: [
                {
                  id: '1',
                  fullname: 'Athete',
                },
              ],
            },
          ],
        },
      ],
    };
    props = {
      rowId: null,
      appliedRows: [],
      availableVariables: [],
      calculation: 'mean',
      isOpen: true,
      timePeriod: TIME_PERIODS.today,
      dateRange: null,
      dataSource: [{ name: 'Fatigue', key_name: 'kitman:tv|fatigue' }],
      onComparisonRowApply: jest.fn(),
      onLongitudinalRowApply: jest.fn(),
      onScorecardRowApply: jest.fn(),
      onSetDateRange: onSetDateRangeMock,
      selectedPopulation: [],
      squadAthletes,
      t: i18nT,
      tableType: 'COMPARISON',
    };
  });

  afterEach(() => {
    moment.tz.setDefault();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('will not date range if time period not custom date', () => {
    render(<RowPanel {...props} />);
    expect(onSetDateRangeMock).not.toHaveBeenCalled();
  });

  it('will set date range if time period is custom date', () => {
    render(<RowPanel {...props} timePeriod={TIME_PERIODS.customDateRange} />);
    expect(onSetDateRangeMock).toHaveBeenCalledWith({
      end_date: '2024-07-10T23:59:59+00:00',
      start_date: '2024-07-10T00:00:00+00:00',
    });
  });
});
