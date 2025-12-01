import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import moment from 'moment';
import AthleteConstraints from '..';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  medicalSharedApi: {
    queries: {
      'getAthleteData(5)': {
        status: 'fulfilled',
        isLoading: false,
        data: { constraints: { active_periods: [] } },
      },
      'getAthleteData(10)': {
        status: 'fulfilled',
        isLoading: false,
        data: {
          constraints: {
            active_periods: [{ start: '2022/05/10', end: '2022/07/10' }],
            organisation_status: 'PAST_ATHLETE',
          },
        },
      },
      'getAthleteData(15)': {
        status: 'fulfilled',
        isLoading: false,
        data: {
          constraints: {
            active_periods: [{ start: '2022/05/10', end: '2022/07/10' }],
            organisation_status: 'PRESENT_ATHLETE',
          },
        },
      },
    },
  },
});

describe('<AthleteConstraints />', () => {
  const defaultProps = {
    athleteId: null,
  };

  it('renders correctly when children is passed', () => {
    const Child = () => <h3>So date, very picker</h3>;

    render(
      <Provider store={defaultStore}>
        <AthleteConstraints {...defaultProps}>
          {() => <Child />}
        </AthleteConstraints>
      </Provider>
    );
    expect(screen.getByText('So date, very picker')).toBeInTheDocument();
  });

  describe('lastActivePeriod', () => {
    const lastPeriodRender = (props, store) =>
      render(
        <Provider store={store}>
          <AthleteConstraints {...props}>
            {({ lastActivePeriod }) => (
              <div>
                <span>Start Date: {lastActivePeriod.start}</span>
                <span>
                  End Date:{' '}
                  {moment.isMoment(lastActivePeriod.end)
                    ? lastActivePeriod.end.format('YYYY MM DD')
                    : lastActivePeriod.end}
                </span>
              </div>
            )}
          </AthleteConstraints>
        </Provider>
      );

    it('renders the date lastActivePeriod empty dates when no athlete data', () => {
      const component = lastPeriodRender(defaultProps, defaultStore);
      expect(component.getByText('Start Date:')).toBeInTheDocument();
      expect(component.getByText('End Date:')).toBeInTheDocument();
    });

    it('renders the lastActivePeriod info empty when there are no active periods', () => {
      const component = lastPeriodRender({ athleteId: 5 }, defaultStore);
      expect(component.getByText('Start Date:')).toBeInTheDocument();
      expect(component.getByText('End Date:')).toBeInTheDocument();
    });

    it('renders the lastActivePeriod info with the first active period data when it is a past athlete', () => {
      const component = lastPeriodRender({ athleteId: 10 }, defaultStore);
      expect(component.getByText('Start Date: 2022/05/10')).toBeInTheDocument();
      expect(component.getByText('End Date: 2022/07/10')).toBeInTheDocument();
    });

    it('renders the lastActivePeriod info with the end date being the current date', () => {
      Date.now = jest.fn(() => new Date('2023-05-13T12:33:37.000Z'));
      const component = lastPeriodRender({ athleteId: 15 }, defaultStore);
      expect(component.getByText('Start Date: 2022/05/10')).toBeInTheDocument();
      expect(component.getByText('End Date: 2023 05 13')).toBeInTheDocument();
    });
  });
});
