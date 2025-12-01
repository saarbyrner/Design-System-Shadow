import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ProfileWidgetModalTranslated as ProfileWidgetModalComponent } from '@kitman/modules/src/analysis/Dashboard/components/ProfileWidgetModal';
import ProfileWidgetModalContainer from '../ProfileWidgetModal';

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/components/ProfileWidgetModal',
  () => ({
    ProfileWidgetModalTranslated: jest.fn(() => (
      <div data-testid="profile-widget-modal-component" />
    )),
  })
);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: jest.fn(),
  getState: () => ({ ...state }),
});

describe('ProfileWidgetModal Container', () => {
  let store;
  let dispatchSpy;
  const containerProps = {
    athletes: [],
  };

  beforeEach(() => {
    dispatchSpy = jest.fn();
    store = storeFake({
      dashboard: {},
      dashboardApi: {},
      profileWidgetModal: {
        athlete_id: null,
        avatar_availability: false,
        avatar_squad_number: false,
        fields: [
          { name: 'name' },
          { name: 'availability' },
          { name: 'date_of_birth' },
          { name: 'position' },
        ],
        preview: {},
        open: true,
      },
      staticData: {},
    });
    store.dispatch = dispatchSpy;

    ProfileWidgetModalComponent.mockClear();
    dispatchSpy.mockClear();
  });

  const renderContainer = () => {
    return render(
      <Provider store={store}>
        <ProfileWidgetModalContainer {...containerProps} />
      </Provider>
    );
  };

  it('sets props correctly', () => {
    renderContainer();

    expect(ProfileWidgetModalComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        open: true,
      }),
      {}
    );
  });

  it('dispatches the correct action when onClickCloseModal is called', () => {
    renderContainer();

    const componentProps = ProfileWidgetModalComponent.mock.calls[0][0];
    const expectedAction = {
      type: 'CLOSE_PROFILE_WIDGET_MODAL',
    };

    componentProps.onClickCloseModal();
    expect(dispatchSpy).toHaveBeenCalledWith(expectedAction);
  });

  it('dispatches the correct action when onSelectAthlete is called', () => {
    renderContainer();

    const componentProps = ProfileWidgetModalComponent.mock.calls[0][0];
    const expectedAction = {
      type: 'SELECT_ATHLETE',
      payload: {
        athleteId: '123',
      },
    };

    componentProps.onSelectAthlete('123');
    expect(dispatchSpy).toHaveBeenCalledWith(expectedAction);
  });

  it('dispatches the correct action when onSelectWidgetInfoItem is called', () => {
    renderContainer();

    const componentProps = ProfileWidgetModalComponent.mock.calls[0][0];
    const expectedAction = {
      type: 'SELECT_WIDGET_INFO_ITEM',
      payload: {
        index: 0,
        itemId: 'position_group',
      },
    };

    componentProps.onSelectWidgetInfoItem(0, 'position_group');
    expect(dispatchSpy).toHaveBeenCalledWith(expectedAction);
  });

  it('dispatches the correct action when onSetAvatarAvailability is called', () => {
    renderContainer();

    const componentProps = ProfileWidgetModalComponent.mock.calls[0][0];
    const expectedAction = {
      type: 'SET_AVATAR_AVAILABILITY',
      payload: {
        showAvailabilityIndicator: true,
      },
    };

    componentProps.onSetAvatarAvailability(true);
    expect(dispatchSpy).toHaveBeenCalledWith(expectedAction);
  });

  it('dispatches the correct action when onSetAvatarSquadNumber is called', () => {
    renderContainer();

    const componentProps = ProfileWidgetModalComponent.mock.calls[0][0];

    const expectedAction = {
      type: 'SET_AVATAR_SQUAD_NUMBER',
      payload: {
        showSquadNumber: true,
      },
    };

    componentProps.onSetAvatarSquadNumber(true);
    expect(dispatchSpy).toHaveBeenCalledWith(expectedAction);
  });
});
