import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import * as planningApi from '@kitman/services/src/services/planning';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AthletesTabHeader from '../AthletesTabHeader';

jest.mock('@kitman/services/src/services/planning', () => ({
  __esModule: true,
  ...jest.requireActual('@kitman/services/src/services/planning'),
}));

const confirmationModalContent =
  "WARNING: Pressing the Update button will override any manual Participation Level updates. (It will reset the Participation Level based on today's roster and worst Injury Status.) Do you want to proceed?";

const defaultProps = {
  event: { id: 2, type: 'session_event' },
  canEditEvent: true,
  onSaveParticipantsSuccess: jest.fn(),
  onClickOpenReorderColumnModal: jest.fn(),
  toastAction: jest.fn(),
  refreshGrid: jest.fn(),
  t: i18nextTranslateStub(),
};

const renderComponent = (props = defaultProps) => ({
  user: userEvent.setup(),
  ...renderWithProviders(<AthletesTabHeader {...props} />),
});

describe('AthletesTabHeader', () => {
  describe('initial render', () => {
    it('renders correctly', async () => {
      const { user } = renderComponent();

      expect(screen.getAllByText('Edit athletes').length).toEqual(2);
      expect(screen.getByText('Add column')).toBeInTheDocument();

      await user.click(screen.getAllByRole('button')[2]);

      expect(screen.getByText('Reorder')).toBeInTheDocument();
      expect(screen.getByText('Print')).toBeInTheDocument();
    });

    it('opens the side panel when clicking the "Add athletes" button', async () => {
      const { user } = renderComponent();

      await user.click(screen.getAllByText('Edit athletes')[0]);

      expect(screen.getByText('Squad 1')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Done')).toBeInTheDocument();

      await user.click(screen.getAllByRole('button')[3]);
    });

    it('closes the side panel when adding athletes to the event succeed', async () => {
      const { user } = renderComponent();

      await user.click(screen.getAllByText('Edit athletes')[0]);
      await user.click(screen.getByText('Done'));

      expect(defaultProps.onSaveParticipantsSuccess).toHaveBeenCalled();
    });

    it('does not show the edit athlete button when the user is not an event admin', () => {
      renderComponent({ ...defaultProps, canEditEvent: false });

      expect(screen.queryAllByText('Edit athletes').length).toEqual(0);
      expect(screen.queryByText('Add column')).not.toBeInTheDocument();
    });
  });
  describe('[feature-flag nfl-session-participation-level-update]', () => {
    beforeEach(() => {
      window.featureFlags = {
        'nfl-session-participation-level-update': true,
      };
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('successfully updates the participation levels  when Update Participation is clicked', async () => {
      jest
        .spyOn(planningApi, 'updateNflParticipationLevels')
        .mockResolvedValue('SUCCESS');

      const { user } = renderComponent();

      expect(screen.getByText('Update')).toBeInTheDocument();

      await user.click(screen.getByText('Update'));

      expect(
        screen.getByRole('heading', {
          name: 'Update Participation Levels',
          level: 2,
        })
      ).toBeInTheDocument();

      expect(screen.getByText(confirmationModalContent)).toBeInTheDocument();

      const modalConfirmButton = screen.getByRole('button', {
        name: 'Confirm',
      });

      await user.click(modalConfirmButton);

      expect(defaultProps.toastAction).toHaveBeenCalledWith({
        toast: {
          id: 'update_nfl_levels',
          status: 'SUCCESS',
          title: 'NFL Participation Levels Updated Successfully',
        },
        type: 'UPDATE_TOAST',
      });

      expect(defaultProps.refreshGrid).toHaveBeenCalled();
    });

    it('throws an error toast when Update Participation is clicked and fails', async () => {
      jest
        .spyOn(planningApi, 'updateNflParticipationLevels')
        .mockRejectedValue('ERROR');

      const { user } = renderComponent();

      expect(screen.getByText('Update')).toBeInTheDocument();

      await user.click(screen.getByText('Update'));

      expect(
        screen.getByRole('heading', {
          name: 'Update Participation Levels',
          level: 2,
        })
      ).toBeInTheDocument();

      expect(screen.getByText(confirmationModalContent)).toBeInTheDocument();

      const modalConfirmButton = screen.getByRole('button', {
        name: 'Confirm',
      });

      await user.click(modalConfirmButton);

      expect(defaultProps.toastAction).toHaveBeenCalledWith({
        toast: {
          id: 'update_nfl_levels',
          status: 'ERROR',
          title: 'NFL Participation Levels Failed to Update',
        },
        type: 'UPDATE_TOAST',
      });
    });
  });
});
