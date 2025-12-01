import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DownloadOptionsModal from '../DownloadOptionsModal';

jest.mock('../Template', () => ({
  TemplateTranslated: () => {
    return <div>Template Preview</div>;
  },
}));

describe('<DownloadOptionsModal />', () => {
  let user;
  const closeModal = jest.fn();
  const mockEvent = {
    id: 1,
    type: 'game',
    start_date: '2025-07-18T10:00:00Z',
    squads: [{ id: 1, name: 'Test Squad' }],
  };

  const baseProps = {
    isOpen: true,
    closeModal,
    event: mockEvent,
    orgTimezone: 'UTC',
    orgLogoPath: 'logo.png',
    orgName: 'Test Org',
    orgSport: { perma_id: 'rugby_union' },
    squadName: 'Test Squad',
    gameParticipationLevels: [],
    areCoachingPrinciplesEnabled: true,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    user = userEvent.setup();
    closeModal.mockClear();
  });

  const renderComponent = (overrideProps = {}) => {
    return render(<DownloadOptionsModal {...baseProps} {...overrideProps} />);
  };

  it('renders the component', () => {
    renderComponent();
    expect(screen.getByText('Template Preview')).toBeInTheDocument();
  });

  it('renders the modal with default options', () => {
    renderComponent();
    expect(
      screen.getByRole('button', { name: 'Download' })
    ).toBeInTheDocument();
    expect(screen.getByText('Template layout')).toBeInTheDocument();
    expect(screen.getByText('Page fitting')).toBeInTheDocument();
    expect(screen.getByText('Show / Hide')).toBeInTheDocument();
  });

  it('calls closeModal when the cancel button is clicked', async () => {
    renderComponent();
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);
    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});
