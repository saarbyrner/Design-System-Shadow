import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setI18n } from 'react-i18next';

import i18n from '@kitman/common/src/utils/i18n';
import {
  renderWithProvider,
  storeFake,
} from '@kitman/common/src/utils/test_utils';

import App from '../App';

setI18n(i18n);

const mockEvent = {
  type: 'GAME',
  id: '123',
  name: 'Carlow 1 - 2 Dublin',
  duration: 90,
  rpeCollectionAthlete: true,
  rpeCollectionKiosk: false,
  massInput: false,
};

const mockState = {
  participantForm: {
    event: mockEvent,
    participants: [],
    initialParticipants: [],
  },
  staticData: {
    availableSquads: [
      {
        id: 'squad1',
        name: 'Squad 1',
        position_groups: [],
        positions: [],
        athletes: [],
      },
    ],
    primarySquads: [],
    participationLevels: [{ id: 'level1', name: 'Full' }],
  },
  appStatus: {
    status: 'success',
  },
};

const renderComponent = (props = {}) => {
  const defaultProps = {
    event: mockEvent,
    appStatus: {
      status: 'success',
    },
    onClickHideAppStatus: jest.fn(),
    t: (key) => key,
  };

  return renderWithProvider(
    <App {...defaultProps} {...props} />,
    storeFake(mockState)
  );
};

describe('App component', () => {
  it('renders', () => {
    renderComponent();
    expect(screen.getByText('Carlow 1 - 2 Dublin')).toBeInTheDocument();
  });

  it('renders the participant form', () => {
    renderComponent();
    expect(
      screen.getByRole('columnheader', { name: '#sport_specific__Athlete' })
    ).toBeInTheDocument();
  });

  it('renders the session name as title', () => {
    renderComponent();
    expect(
      screen.getByRole('heading', { name: 'Carlow 1 - 2 Dublin' })
    ).toBeInTheDocument();
  });

  it('opens the side panel when clicking RPE Collection Channels', async () => {
    const user = userEvent.setup();
    renderComponent();

    expect(
      screen.getByText('RPE Collection Channels', {
        selector: '.slidingPanel__title',
      })
    ).not.toBeVisible();

    const rpeButtons = screen.getAllByText('RPE Collection Channels');
    await user.click(rpeButtons[0]);

    expect(
      screen.getByText('RPE Collection Channels', {
        selector: '.slidingPanel__title',
      })
    ).toBeVisible();
  });

  it('renders the AppStatus with confirm message and buttons', () => {
    renderComponent({
      appStatus: {
        status: 'confirm',
      },
    });

    expect(
      screen.getByText(
        'Any unsaved changes will be lost if you exit without saving.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Return to page')).toBeInTheDocument();
    expect(screen.getByText('Exit')).toBeInTheDocument();
  });
});
