import { Provider } from 'react-redux';
import { screen, render } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import { configureStore } from '@reduxjs/toolkit';
import moment from 'moment';

import i18n from '@kitman/common/src/utils/i18n';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import getInjuryData from '@kitman/modules/src/AthleteInjury/utils/InjuryData';
import InjuryOccurrenceContainer from '../../containers/InjuryOccurrence';

const modalDataReducer = (state = {}) => state;
const issueDataReducer = (state = {}) => state;

const renderWithCustomStore = (
  ui,
  { preloadedState = {}, ...renderOptions } = {}
) => {
  const store = configureStore({
    reducer: {
      ModalData: modalDataReducer,
      IssueData: issueDataReducer,
    },
    preloadedState,
  });

  // Mock the dispatch function to track actions
  store.dispatch = jest.fn();

  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

const injuryData = getInjuryData();

const defaultStore = {
  ModalData: {
    formMode: 'CREATE',
    formType: 'INJURY',
    activityGroupOptions: [{ id: '1', name: 'Training' }],
    gameOptions: [{ id: '1', name: 'Game 1', date: '2024-01-01' }],
    trainingSessionOptions: [{ id: '1', name: 'Session 1' }],
    positionGroupOptions: [],
    periodOptions: [],
  },
  IssueData: {
    ...injuryData,
    occurrence_date: moment('2024-01-01').format(dateTransferFormat),
    activity_type: 'game',
    game_id: '1',
  },
};

describe('Injury Occurrence Container', () => {
  beforeAll(() => {
    setI18n(i18n);
  });

  it('renders correctly in create mode for an injury and dispatches initial action', () => {
    const { store } = renderWithCustomStore(<InjuryOccurrenceContainer />, {
      preloadedState: defaultStore,
    });

    // The component dispatches this action on mount
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function));

    expect(screen.getByText('Date of Injury')).toBeInTheDocument();
    expect(screen.getByText('Activity')).toBeInTheDocument();
    expect(screen.getByText('Game')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Session completed')).toBeInTheDocument();
  });

  describe('When editing an old recurrence', () => {
    it('disables the form', () => {
      const issueData = { ...getInjuryData() };
      issueData.has_recurrence = true;
      issueData.is_last_occurrence = false;

      const storeWithOldRecurrence = {
        ModalData: {
          ...defaultStore.ModalData,
          formMode: 'EDIT',
        },
        IssueData: {
          ...defaultStore.IssueData,
          ...issueData,
        },
      };

      const { container } = renderWithCustomStore(
        <InjuryOccurrenceContainer />,
        {
          preloadedState: storeWithOldRecurrence,
        }
      );

      // Use querySelector for more reliable targeting of custom component inputs
      const datePickerInput = container.querySelector(
        'input[name="InjuryOccurrenceDate"]'
      );
      expect(datePickerInput).toBeDisabled();

      const activityDropdown = container.querySelector(
        '[data-testid="GroupedDropdown|TriggerButton"]'
      );
      expect(activityDropdown).toBeDisabled();

      const gameDropdown = container.querySelector(
        'button[aria-expanded="true"]'
      );
      expect(gameDropdown).toBeDisabled();
    });
  });
});
