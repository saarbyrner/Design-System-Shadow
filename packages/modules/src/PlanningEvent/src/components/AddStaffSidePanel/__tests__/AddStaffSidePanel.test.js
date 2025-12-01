import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { axios } from '@kitman/common/src/utils/services';
import { server, rest } from '@kitman/services/src/mocks/server';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { saveEventsUsers } from '@kitman/services/src/services/planning';
import { data as mockStaffUsers } from '@kitman/services/src/mocks/handlers/medical/getStaffUsers';
import { data as mockEventUsers } from '@kitman/services/src/mocks/handlers/planning/getEventsUsers';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { ClubPhysicianDMRRequiredRole } from '@kitman/modules/src/PlanningEvent/src/hooks/useUpdateDmrStatus';

import AddStaffSidePanel from '../AddStaffSidePanel';

jest.mock('@kitman/common/src/hooks/useEventTracking');

jest.mock('@kitman/services/src/services/planning', () => ({
  ...jest.requireActual('@kitman/services/src/services/planning'),
  saveEventsUsers: jest.fn(),
}));

describe('<AddStaffSidePanel />', () => {
  const props = {
    event: {
      id: 1,
      start_date: '2020-12-31T12:03:00+00:00',
      squad: { owner_id: 1222 },
    },
    isOpen: true,
    useOrgId: false,
    onClose: jest.fn(),
    onSaveUsersSuccess: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const mockStaffDataEligibility = [
    {
      ...mockStaffUsers[0],
      fullname: "Stuart O'Brien",
      discipline_status: 'eligible',
    },
    {
      ...mockStaffUsers[1],
      discipline_status: 'suspended',
    },
  ];

  const mockStaffDataRoles = [
    {
      ...mockStaffUsers[0],
      fullname: "Stuart O'Brien",
      staff_role: 'N/D',
    },
    {
      ...mockEventUsers[2].user,
      staff_role: ClubPhysicianDMRRequiredRole,
    },
    {
      ...mockStaffUsers[2],
      staff_role: ClubPhysicianDMRRequiredRole,
    },
    {
      id: 2478,
      fullname: 'Nick Cunningham',
      staff_role: 'Assistant Coach',
    },
  ];

  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });
  });

  describe('when loading the initial data', () => {
    it('renders a loader', () => {
      render(<AddStaffSidePanel {...props} />);

      const loader = screen.getByTestId('DelayedLoadingFeedback');
      expect(loader).toBeInTheDocument();
    });

    it('calls prop `onSaveUsersSuccess` when saving the form', async () => {
      const user = userEvent.setup();
      render(<AddStaffSidePanel {...props} />);

      const saveButton = await screen.findByText('Done');
      await user.click(saveButton);
      expect(props.onSaveUsersSuccess).toHaveBeenCalled();
    });
  });

  describe('Match day flow render', () => {
    const matchDayProps = {
      ...props,
      event: {
        ...props.event,
        league_setup: true,
        type: 'game_event',
        competition: {
          required_designation_roles: [ClubPhysicianDMRRequiredRole],
        },
      },
      maxStaffs: 2,
      preferences: { league_game_team: true },
    };
    beforeEach(() => {
      server.use(
        rest.get('/users/staff_only', (_, res, ctx) =>
          res(ctx.json(mockStaffDataRoles))
        )
      );
    });

    it('calls the get staff endpoint with the correct url params', () => {
      const axiosSpy = jest.spyOn(axios, 'get');
      render(<AddStaffSidePanel {...matchDayProps} />);
      expect(axiosSpy).toHaveBeenCalledWith('/users/staff_only', {
        params: {
          include_staff_role: true,
        },
      });
    });

    it('renders out the correct roles', async () => {
      render(<AddStaffSidePanel {...matchDayProps} />);

      await waitFor(() => {
        expect(screen.getByText('N/D')).toBeInTheDocument();
      });
      expect(screen.getAllByText(ClubPhysicianDMRRequiredRole).length).toEqual(
        2
      );

      expect(screen.getByText('Assistant Coach')).toBeInTheDocument();
    });

    it('sets the search query to an empty string when the user clicks done', async () => {
      const user = userEvent.setup();
      render(<AddStaffSidePanel {...matchDayProps} />);
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search staff')).toBeInTheDocument();
      });
      await user.type(screen.getByPlaceholderText('Search staff'), 'Stuart');
      expect(screen.getByPlaceholderText('Search staff')).toHaveValue('Stuart');
      const saveButton = await screen.findByText('Done');
      await user.click(saveButton);
      expect(screen.getByPlaceholderText('Search staff')).toHaveValue('');
    });

    it('doesnt count the vetted club physician role towards the max staff count', async () => {
      const user = userEvent.setup();

      render(<AddStaffSidePanel {...matchDayProps} />);
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search staff')).toBeInTheDocument();
      });
      await user.click(screen.getByText('Nick Cunningham'));
      await user.click(screen.getByText('Rod Murphy'));
      await user.click(screen.getByText('Stephen Smith'));
      await user.click(screen.getByText('Done'));
      expect(props.onSaveUsersSuccess).toHaveBeenCalled();
    });

    it('counts the vetted club physician role towards the max staff count when there is no competition role', async () => {
      const user = userEvent.setup();

      const matchDayPropsNoCompRole = {
        ...matchDayProps,
        event: {
          ...matchDayProps.event,
          competition: { required_designation_roles: [] },
        },
      };
      render(<AddStaffSidePanel {...matchDayPropsNoCompRole} />);
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search staff')).toBeInTheDocument();
      });
      await user.click(screen.getByText('Nick Cunningham'));
      await user.click(screen.getByText('Rod Murphy'));
      await user.click(screen.getByText('Stephen Smith'));
      await user.click(screen.getByText('Done'));
      expect(props.onSaveUsersSuccess).not.toHaveBeenCalled();
    });

    it('doesnt allow multiple vetted club physicians to be saved', async () => {
      const user = userEvent.setup();

      render(<AddStaffSidePanel {...matchDayProps} />);
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search staff')).toBeInTheDocument();
      });
      await user.click(screen.getByText('Rod Murphy'));

      await user.click(screen.getByText('Done'));
      expect(props.onSaveUsersSuccess).not.toHaveBeenCalled();
    });

    describe('staff endpoint uses org id', () => {
      it('calls the get staff endpoint with the correct url params', () => {
        const axiosSpy = jest.spyOn(axios, 'get');
        render(<AddStaffSidePanel {...matchDayProps} useOrgId />);
        expect(axiosSpy).toHaveBeenCalledWith('/users/staff_only', {
          params: {
            include_staff_role: true,
            organisation_id: 1222,
          },
        });
      });
    });
  });

  describe("with 'event-notifications' FF", () => {
    const modalTitle = 'Confirm you would like to notify selected recipients?';
    const mockSaveUsers = saveEventsUsers;

    beforeEach(() => {
      mockSaveUsers.mockClear();
    });

    describe('when the FF is off', () => {
      beforeEach(() => {
        window.featureFlags['event-notifications'] = false;
      });

      it('calls the save mutation directly without showing the modal', async () => {
        const user = userEvent.setup();
        render(<AddStaffSidePanel {...props} />);

        const doneButton = await screen.findByText('Done');
        await user.click(doneButton);

        expect(screen.queryByText(modalTitle)).not.toBeInTheDocument();
        expect(mockSaveUsers).toHaveBeenCalledWith({
          eventId: props.event.id,
          userIds: [1236],
          sendNotifications: false,
        });
      });
    });

    describe('when the FF is on', () => {
      beforeEach(() => {
        window.featureFlags['event-notifications'] = true;
      });

      it('shows the notification modal when clicking "Done"', async () => {
        const user = userEvent.setup();
        render(<AddStaffSidePanel {...props} />);

        const doneButton = await screen.findByText('Done');
        await user.click(doneButton);

        expect(await screen.findByText(modalTitle)).toBeInTheDocument();
        expect(mockSaveUsers).not.toHaveBeenCalled();
      });

      it('calls save with sendNotifications: true when user clicks "Send"', async () => {
        const user = userEvent.setup();
        render(<AddStaffSidePanel {...props} />);

        const doneButton = await screen.findByText('Done');
        await user.click(doneButton);

        const sendButton = await screen.findByRole('button', { name: 'Send' });
        await user.click(sendButton);

        expect(mockSaveUsers).toHaveBeenCalledWith({
          eventId: props.event.id,
          userIds: [1236],
          sendNotifications: true,
        });

        await waitForElementToBeRemoved(() => screen.queryByText(modalTitle));
      });

      it('calls save with sendNotifications: false when user clicks "Don\'t Send"', async () => {
        const user = userEvent.setup();
        render(<AddStaffSidePanel {...props} />);

        const doneButton = await screen.findByText('Done');
        await user.click(doneButton);

        const dontSendButton = await screen.findByRole('button', {
          name: "Don't send",
        });
        await user.click(dontSendButton);

        expect(mockSaveUsers).toHaveBeenCalledWith({
          eventId: props.event.id,
          userIds: [1236],
          sendNotifications: false,
        });

        await waitForElementToBeRemoved(() => screen.queryByText(modalTitle));
      });
    });
  });

  describe('[Feature flag leagueOpsDisciplineFlag] render', () => {
    beforeEach(() => {
      window.featureFlags = { 'league-ops-discipline-area': true };
      server.use(
        rest.get('/users/staff_only', (_, res, ctx) =>
          res(ctx.json(mockStaffDataEligibility))
        )
      );
    });

    afterEach(() => {
      window.featureFlags = { 'league-ops-discipline-area': false };
    });

    it('calls the get staff endpoint with the correct url params', () => {
      const axiosSpy = jest.spyOn(axios, 'get');
      render(<AddStaffSidePanel {...props} />);
      expect(axiosSpy).toHaveBeenCalledWith('/users/staff_only', {
        params: {
          event_id: 1,
          include_discipline_status: true,
        },
      });
    });

    it('renders out the eligibility statuses', async () => {
      render(<AddStaffSidePanel {...props} />);

      await waitFor(() => {
        expect(screen.getByText('Suspended')).toBeInTheDocument();
      });
      expect(screen.getByText('Eligible')).toBeInTheDocument();
    });

    it('does not allow the user to select an ineligible staff user', async () => {
      const user = userEvent.setup();
      render(<AddStaffSidePanel {...props} />);

      await waitFor(() => {
        expect(screen.getByText('Suspended')).toBeInTheDocument();
      });
      await user.click(screen.getByText('Stephen Smith'));

      expect(screen.getAllByRole('checkbox')[0]).toBeDisabled();
    });
  });

  describe('when the first initial request fails', () => {
    beforeEach(() => {
      server.use(
        rest.get('/users/staff_only', (_, res, ctx) => res(ctx.status(500)))
      );
    });

    it('shows an error message', async () => {
      render(<AddStaffSidePanel {...props} />);

      const failureStatus = await screen.findByTestId('AppStatus-error');
      expect(failureStatus).toBeInTheDocument();
    });
  });

  describe('when the second initial request fails', () => {
    beforeEach(() => {
      server.use(
        rest.get('/planning_hub/events/:eventId/events_users', (_, res, ctx) =>
          res(ctx.status(500))
        )
      );
    });

    it('shows an error message', async () => {
      render(<AddStaffSidePanel {...props} />);

      const failureStatus = await screen.findByTestId('AppStatus-error');
      expect(failureStatus).toBeInTheDocument();
    });
  });

  describe('when the saving request fails', () => {
    it('shows an error message', async () => {
      const mockSaveUsers = saveEventsUsers;

      mockSaveUsers.mockRejectedValueOnce(new Error('Failed to save'));

      const user = userEvent.setup();
      render(<AddStaffSidePanel {...props} />);

      const saveButton = await screen.findByText('Done');
      await user.click(saveButton);
      const failureStatus = await screen.findByTestId('AppStatus-error');
      expect(failureStatus).toBeInTheDocument();
    });
  });
});
