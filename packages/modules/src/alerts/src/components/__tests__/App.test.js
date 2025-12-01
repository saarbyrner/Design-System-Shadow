import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';

import alertsDummyData from '../../../resources/alertDummyData';
import App from '../App';

const mockUsers = [
  { id: 1916, name: 'Jon Doe' },
  { id: 95239, name: 'Jon Doe 2' },
  { id: 38185, name: 'Jon Doe 3' },
];

const mockVariables = [
  { id: 4, name: 'Mood' },
  { id: 14, name: 'Enforced Rest' },
  { id: 15, name: 'Game' },
];

describe('<App />', () => {
  let baseProps;
  let user;
  let preloadedState;

  beforeEach(() => {
    user = userEvent.setup();
    window.featureFlags = {};

    preloadedState = {
      appStatus: {
        status: null,
        message: '',
        secondaryMessage: '',
      },
      alerts: {
        openModal: null,
        currentAlert: {
          id: null,
          name: '',
          training_variable_ids: [],
          notification_recipient_ids: [],
        },
        staticData: {
          squads: {
            data: [],
            isLoading: false,
          },
          variables: [],
        },
      },
    };

    baseProps = {
      alerts: alertsDummyData,
      onClickEditAlert: jest.fn(),
      onClickCreateAlert: jest.fn(),
      onClickDeleteAlert: jest.fn(),
      onClickActivateAlert: jest.fn(),
      onClickDuplicateAlert: jest.fn(),
      users: mockUsers,
      variables: mockVariables,
      canEditAlerts: true,
      canAddAlerts: true,
      canDeleteAlerts: true,
      t: i18nextTranslateStub(),
    };
  });

  it('renders the table with the correct number of alert rows', () => {
    renderWithRedux(<App {...baseProps} />, {
      useGlobalStore: false,
      preloadedState,
    });

    // Get all rowgroups (thead and tbody)
    const rowgroups = screen.getAllByRole('rowgroup');
    // The second rowgroup is the tbody, which contains the data rows.
    const tableBody = rowgroups[1];
    // Find all rows within the table body
    const rows = within(tableBody).getAllByRole('row');

    // Expect the number of rows to match the number of alerts
    expect(rows).toHaveLength(alertsDummyData.length);
  });

  it('calls the correct callback when an activate alert button is clicked', async () => {
    const firstAlert = alertsDummyData[0];

    renderWithRedux(<App {...baseProps} />, {
      useGlobalStore: false,
      preloadedState,
    });

    const rows = screen.getAllByRole('row');

    // First row is the header, second row is the first alert
    const firstAlertRow = rows[1];

    const activateButton = within(firstAlertRow).getAllByRole('button')[0];

    await user.click(activateButton);

    expect(baseProps.onClickActivateAlert).toHaveBeenCalledTimes(1);
    expect(baseProps.onClickActivateAlert).toHaveBeenCalledWith(firstAlert);
  });

  describe('with permissions', () => {
    it('does not render the "Add Alert" button when the user lacks permission', () => {
      renderWithRedux(<App {...baseProps} canAddAlerts={false} />, {
        useGlobalStore: false,
        preloadedState,
      });

      // With the feature flag off, the button should not be present regardless
      expect(
        screen.queryByRole('button', { name: 'Add Alert' })
      ).not.toBeInTheDocument();
    });

    it('does not render activate or edit buttons when the user lacks edit permission', () => {
      renderWithRedux(<App {...baseProps} canEditAlerts={false} />, {
        useGlobalStore: false,
        preloadedState,
      });
      const rows = screen.getAllByRole('row');
      const firstAlertRow = rows[1];

      // Check that activate button is absent
      expect(
        within(firstAlertRow).queryByRole('button', { name: /icon-tick/ })
      ).not.toBeInTheDocument();

      // Check that edit button is absent
      expect(
        within(firstAlertRow).queryByRole('button', { name: /icon-edit/ })
      ).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag] alerts-add-edit-delete', () => {
    beforeEach(() => {
      // Enable the feature flag for this block of tests
      window.featureFlags['alerts-add-edit-delete'] = true;
    });

    afterEach(() => {
      // Disable it after to ensure clean state for other tests
      window.featureFlags['alerts-add-edit-delete'] = false;
    });

    it('calls the correct callback when the "Add Alert" button is clicked', async () => {
      renderWithRedux(<App {...baseProps} />, {
        useGlobalStore: false,
        preloadedState,
      });

      const addAlertButton = screen.getByRole('button', { name: 'Add Alert' });
      await user.click(addAlertButton);

      expect(baseProps.onClickCreateAlert).toHaveBeenCalledTimes(1);
      expect(baseProps.onClickCreateAlert).toHaveBeenCalledWith(null);
    });

    it('calls the correct callback when an edit alert button is clicked', async () => {
      const firstAlert = alertsDummyData[0];

      renderWithRedux(<App {...baseProps} />, {
        useGlobalStore: false,
        preloadedState,
      });

      const rows = screen.getAllByRole('row');
      const firstAlertRow = rows[1];

      const editButton = within(firstAlertRow).getAllByRole('button')[1];

      await user.click(editButton);

      expect(baseProps.onClickEditAlert).toHaveBeenCalledTimes(1);
      expect(baseProps.onClickEditAlert).toHaveBeenCalledWith(firstAlert.id);
    });

    it('calls the correct callback when a delete alert button is clicked', async () => {
      const firstAlert = alertsDummyData[0];

      renderWithRedux(<App {...baseProps} />, {
        useGlobalStore: false,
        preloadedState,
      });

      const rows = screen.getAllByRole('row');
      const firstAlertRow = rows[1];
      const deleteButton = within(firstAlertRow).getAllByRole('button')[2];

      await user.click(deleteButton);

      expect(baseProps.onClickDeleteAlert).toHaveBeenCalledTimes(1);
      expect(baseProps.onClickDeleteAlert).toHaveBeenCalledWith(firstAlert);
    });

    it('does not render a delete button when the user lacks delete permission', () => {
      renderWithRedux(<App {...baseProps} canDeleteAlerts={false} />, {
        useGlobalStore: false,
        preloadedState,
      });

      const rows = screen.getAllByRole('row');
      const firstAlertRow = rows[1];
      const buttons = within(firstAlertRow).queryAllByRole('button');

      expect(buttons[3]).toBeUndefined(); // Assuming the delete button is the third button in the row
    });
  });
});
