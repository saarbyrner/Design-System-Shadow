import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { getIsRegisteredPlayerImageModalOpen } from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/selectors';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';

import RegisteredPlayerImageModal from '..';

jest.mock(
  '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/selectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/selectors'
    ),
    getIsRegisteredPlayerImageModalOpen: jest.fn(),
  })
);

const props = {
  t: i18nextTranslateStub(),
  imageModalData: {
    playerName: 'Kobbie Mainoo',
    playerImage: '/path/to/avatar.jpeg',
  },
  onClose: jest.fn(),
};

describe('<RegisteredPlayerImageModal />', () => {
  beforeEach(() => {
    getIsRegisteredPlayerImageModalOpen.mockReturnValue(true);
  });
  it('displays the modal', () => {
    renderWithProviders(<RegisteredPlayerImageModal {...props} />);
    expect(screen.getByText('Kobbie Mainoo')).toBeInTheDocument();
    const avatar = screen.getByAltText('Kobbie Mainoo Avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', '/path/to/avatar.jpeg');
    expect(screen.getByText('Close')).toBeInTheDocument();
  });
  it('fires the onClose function when the close button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisteredPlayerImageModal {...props} />);
    const closeButton = screen.getByText('Close');
    expect(closeButton).toBeInTheDocument();
    await user.click(closeButton);
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });
});
