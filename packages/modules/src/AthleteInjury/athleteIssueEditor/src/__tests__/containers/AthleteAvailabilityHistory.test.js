import { Provider } from 'react-redux';
import { screen, render } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import { configureStore } from '@reduxjs/toolkit';

import i18n from '@kitman/common/src/utils/i18n';
import getInjuryData from '@kitman/modules/src/AthleteInjury/utils/InjuryData';
import AthleteAvailabilityHistoryContainer from '../../containers/AthleteAvailabilityHistory';

// The container expects ModalData and IssueData at the root of the state.
// We create simple reducers that just return the state passed to them.
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

  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

const initialEventsOrder = ['event1', 'event2'];
const injuryData = getInjuryData();

const defaultStore = {
  ModalData: {
    injuryStatusOptions: [
      { id: '1', name: 'Available' },
      { id: '2', name: 'Unavailable' },
    ],
    initialEventsOrder,
  },
  IssueData: {
    ...injuryData,
    events_order: initialEventsOrder,
    events: {
      event1: { date: '2024-01-01', injury_status_id: '1' },
      event2: { date: '2024-01-02', injury_status_id: '2' },
    },
  },
};

describe('Athlete Availability History Container', () => {
  beforeAll(() => {
    setI18n(i18n);
  });

  it('renders the component and sets props correctly', () => {
    const { container } = renderWithCustomStore(
      <AthleteAvailabilityHistoryContainer />,
      {
        preloadedState: defaultStore,
      }
    );

    expect(screen.getByText('Availability History')).toBeInTheDocument();
    // Two events are rendered from the store
    const statusSelects = screen.getAllByTestId('issue-status-select');
    expect(statusSelects).toHaveLength(2);

    // Check if the add button is enabled by default
    const addButton = container.querySelector('.icon-add');
    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeEnabled();
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
        <AthleteAvailabilityHistoryContainer />,
        {
          preloadedState: storeWithOldRecurrence,
        }
      );

      const addButton = container.querySelector('.icon-add');
      expect(addButton).toBeInTheDocument();
      expect(addButton).toBeDisabled();
    });
  });
});
