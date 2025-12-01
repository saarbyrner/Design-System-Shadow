import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import alertsDummyData from '../../../resources/alertDummyData';
import AlertEditModal from '../AlertEditModal';
import * as alertActions from '../../actions';

jest.mock('../../actions');

describe('Alerts <AlertEditModal /> Container', () => {
  let user;
  let preloadedState;

  beforeEach(() => {
    user = userEvent.setup();

    preloadedState = {
      alerts: {
        alertList: alertsDummyData,
        // Set to 'edit' to make the modal visible
        openModal: 'edit',
        currentAlert: { ...alertsDummyData[0] },
        staticData: {
          users: [{ id: 1916, name: 'Jon Doe' }],
          variables: [{ id: 4, name: 'Mood' }],
          squads: {
            data: [],
            isLoading: false,
            hasErrored: false,
          },
        },
      },
      appStatus: {
        message: null,
        status: null,
      },
    };
  });

  it('renders the modal and maps state to props correctly', () => {
    renderWithRedux(<AlertEditModal />, {
      useGlobalStore: false,
      preloadedState,
    });

    expect(
      screen.getByRole('heading', { name: 'Edit Alert' })
    ).toBeInTheDocument();

    const alertNameInput = screen.getByLabelText('Alert Name');

    expect(alertNameInput).toHaveValue(preloadedState.alerts.currentAlert.name);
  });

  it('maps dispatch to props and calls the correct action on Save', async () => {
    renderWithRedux(<AlertEditModal />, {
      useGlobalStore: false,
      preloadedState,
    });

    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.click(saveButton);

    expect(alertActions.editAlert).toHaveBeenCalledTimes(1);
    expect(alertActions.editAlert).toHaveBeenCalledWith();
  });

  it('maps dispatch to props and calls updateAlertName when the name is changed', async () => {
    renderWithRedux(<AlertEditModal />, {
      useGlobalStore: false,
      preloadedState,
    });

    const alertNameInput = screen.getByLabelText('Alert Name');

    fireEvent.change(alertNameInput, { target: { value: '' } });
    fireEvent.change(alertNameInput, { target: { value: 'A New Alert Name' } });

    // Verify that the updateAlertName action creator was called with the new value
    expect(alertActions.updateAlertName).toHaveBeenCalledWith(
      'A New Alert Name'
    );
  });
});
