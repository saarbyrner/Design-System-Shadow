import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import FormationEditor from '..';

const mocks = {
  onClose: jest.fn(),
};

describe('FormationEditor', () => {
  const renderComponent = () => {
    return renderWithProviders(
      <FormationEditor
        open
        onClose={mocks.onClose}
        t={i18nextTranslateStub()}
        sport="soccer"
        gameFormats={[
          {
            id: 1,
            name: '11v11',
            number_of_players: 11,
          },
        ]}
        formations={[
          {
            id: 123,
            name: '4-4-2',
            number_of_players: 11,
          },
        ]}
      />
    );
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  const expectPositionNameStatesToBe = ({ enabled }) => {
    const cursor = enabled ? 'cursor: pointer' : 'cursor: not-allowed';
    const allPlayers = screen.getAllByTestId('position-with-abbreviation');

    expect(allPlayers).toHaveLength(18);
    allPlayers.forEach((element) => {
      expect(element).toHaveStyle(cursor);
    });
  };

  const waitForLoaderToBeRemoved = async () => {
    await waitForElementToBeRemoved(screen.queryByText('Loading pitch view'), {
      timeout: 5000,
    });
  };

  it('renders correctly', async () => {
    renderComponent();
    await waitForLoaderToBeRemoved();
    expect(screen.getByText('Update formation')).toBeInTheDocument();
    expect(screen.getByText('Format')).toBeInTheDocument();
    expect(screen.getByText('Formation')).toBeInTheDocument();
    expect(screen.getByText('Assign position')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Drag or click a position on the pitch to assign a new position or update its name'
      )
    ).toBeInTheDocument();
    expectPositionNameStatesToBe({ enabled: false });
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeDisabled();
  });

  // eslint-disable-next-line jest/expect-expect
  it('clicks on position in the field enables position names', async () => {
    renderComponent();
    await waitForLoaderToBeRemoved();
    const inFieldGoalkeeper = screen.getByText('GK');
    await userEvent.click(inFieldGoalkeeper);
    expectPositionNameStatesToBe({ enabled: true });
  });

  // eslint-disable-next-line jest/expect-expect
  it('deselects active position', async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitForLoaderToBeRemoved();
    const inFieldGoalkeeper = screen.getByText('GK');
    await user.click(inFieldGoalkeeper);
    expectPositionNameStatesToBe({ enabled: true });
    await user.click(inFieldGoalkeeper);
    expectPositionNameStatesToBe({ enabled: false });
  }, 25000);

  it('assigns a new position name', async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitForLoaderToBeRemoved();
    // select in field position
    await user.click(screen.getByText('GK'));
    // assign new position name
    await user.click(screen.getByText('Left Back (LB)'));
    expect(screen.queryByText('GK')).not.toBeInTheDocument();
    expect(screen.getByText('LB')).toBeInTheDocument();
  });

  it('undos an update', async () => {
    const user = userEvent.setup();
    renderComponent();
    await waitForLoaderToBeRemoved();
    expect(screen.getByLabelText('undo')).toBeDisabled();
    // select in field position
    await user.click(screen.getByText('GK'));
    // assign new position name
    await user.click(screen.getByText('Left Back (LB)'));

    expect(screen.queryByText('GK')).not.toBeInTheDocument();
    expect(screen.getByText('LB')).toBeInTheDocument();

    // undo change
    expect(screen.getByLabelText('undo')).toBeEnabled();
    await user.click(screen.getByLabelText('undo'));

    expect(screen.queryByText('LB')).not.toBeInTheDocument();
    expect(screen.getByText('GK')).toBeInTheDocument();
  });

  it('redos an update', async () => {
    renderComponent();
    await waitForLoaderToBeRemoved();
    expect(screen.getByLabelText('undo')).toBeDisabled();
    // assign new position
    await userEvent.click(screen.getByText('GK'));
    await userEvent.click(screen.getByText('Left Back (LB)'));

    expect(screen.queryByText('GK')).not.toBeInTheDocument();
    expect(screen.getByText('LB')).toBeInTheDocument();

    // undo change
    expect(screen.getByLabelText('undo')).toBeEnabled();
    await userEvent.click(screen.getByLabelText('undo'));

    expect(screen.queryByText('LB')).not.toBeInTheDocument();
    expect(screen.getByText('GK')).toBeInTheDocument();

    // redo change
    expect(screen.getByLabelText('redo')).toBeEnabled();
    await userEvent.click(screen.getByLabelText('redo'));

    expect(screen.queryByText('GK')).not.toBeInTheDocument();
    expect(screen.getByText('LB')).toBeInTheDocument();
  });

  it('saves a formation position update', async () => {
    renderComponent();
    await waitForLoaderToBeRemoved();
    expect(screen.getByLabelText('undo')).toBeDisabled();
    const pitch = within(screen.getByTestId('Pitch'));
    // assign new position
    await userEvent.click(pitch.getByText('GK'));
    await userEvent.click(screen.getByText('Left Back (LB)'));

    expect(pitch.queryByText('GK')).not.toBeInTheDocument();
    expect(pitch.getByText('LB')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(screen.getByText('Formation updated.')).toBeInTheDocument();
    });
  });

  it('calls onClose when click the cancel button', async () => {
    renderComponent();
    await userEvent.click(screen.getByText('Cancel'));
    expect(mocks.onClose).toHaveBeenCalled();
  });

  describe('with "show-position-view-ids" feature flag', () => {
    beforeEach(() => {
      window.featureFlags['show-position-view-ids'] = true;
    });
    afterEach(() => {
      window.featureFlags['show-position-view-ids'] = false;
    });
    it('shows the formation id in the title', async () => {
      renderComponent();
      await waitForLoaderToBeRemoved();
      expect(screen.getByText('Update formation id: 123')).toBeInTheDocument();
    });
  });
});
