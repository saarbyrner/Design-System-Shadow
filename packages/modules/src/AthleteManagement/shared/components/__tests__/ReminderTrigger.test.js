import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { server, rest } from '@kitman/services/src/mocks/server';

import AppRoot from '@kitman/modules/src/AppRoot';
import {
  MockedManageAthletesContextProvider,
  mockedManageAthletesContextValue,
} from '@kitman/modules/src/ManageAthletes/src/contexts/mocks';
import getNonCompliantAthletes from '@kitman/modules/src/AthleteManagement/shared/redux/services/api/getNonCompliantAthletes';
import ReminderTrigger from '../ReminderTrigger';

jest.mock(
  '@kitman/modules/src/AthleteManagement/shared/redux/services/api/getNonCompliantAthletes'
);

describe('<ReminderTrigger />', () => {
  const getTooltipMenuButton = (container) => {
    return container.querySelector('.icon-more'); // this button doesn't have text
  };

  const props = {
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    window.featureFlags['form-based-athlete-profile'] = true;
  });

  afterEach(() => {
    window.featureFlags = {};
  });

  it('shows an error toast if fetching non-compliant athletes fails', async () => {
    getNonCompliantAthletes.mockRejectedValue(new Error('API Error'));

    const component = render(
      <AppRoot>
        <ReminderTrigger {...props} />
      </AppRoot>
    );

    await userEvent.click(getTooltipMenuButton(component.container));
    await userEvent.click(
      screen.getByRole('button', { name: 'Training Session Reminder' })
    );

    await waitFor(() => {
      expect(
        screen.getByText('Error getting non-compliant athletes')
      ).toBeInTheDocument();
    });
  });

  describe('Training Session Reminder', () => {
    beforeEach(() => {
      window.featureFlags['league-ops-mass-create-athlete-staff'] = true;
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    describe('Modal content', () => {
      it('Shows the correct modal content', async () => {
        getNonCompliantAthletes.mockResolvedValue({
          wellbeing: [],
          session: [],
        });
        const component = render(
          <AppRoot>
            <ReminderTrigger {...props} />
          </AppRoot>
        );

        await userEvent.click(getTooltipMenuButton(component.container));
        await userEvent.click(
          screen.getByRole('button', { name: 'Training Session Reminder' })
        );

        expect(screen.getByTestId('Modal|Content')).toHaveTextContent(
          'All athletes have added a training session today.'
        );
        const NoSessionsEnteredbutton = screen.queryByRole('button', {
          name: 'No sessions entered',
        });
        expect(NoSessionsEnteredbutton).not.toBeInTheDocument();
      });
    });

    describe('non-compliant athletes', () => {
      it('sends notifications to athletes when clicking the Entire Squad button', async () => {
        getNonCompliantAthletes.mockResolvedValue({
          wellbeing: [],
          session: [1, 2, 3],
        });
        const component = render(
          <AppRoot>
            <MockedManageAthletesContextProvider
              manageAthletesContext={mockedManageAthletesContextValue}
            >
              <ReminderTrigger {...props} />
            </MockedManageAthletesContextProvider>
          </AppRoot>
        );

        await userEvent.click(getTooltipMenuButton(component.container));
        await userEvent.click(
          screen.getByRole('button', { name: 'Training Session Reminder' })
        );

        expect(screen.getByTestId('Modal|Content')).toHaveTextContent(
          '3 athlete have not entered an RPE today.'
        );

        await userEvent.click(
          screen.getByRole('button', { name: 'Entire squad', hidden: true })
        );

        await waitFor(() => {
          expect(
            screen.queryByText('Push Notifications Sent')
          ).toBeInTheDocument();
        });
      });
      it("sends notifications to non compliant athletes when clicking the 'No sessions entered' button", async () => {
        getNonCompliantAthletes.mockResolvedValue({
          wellbeing: [],
          session: [1, 2, 3],
        });
        const component = render(
          <AppRoot>
            <MockedManageAthletesContextProvider
              manageAthletesContext={mockedManageAthletesContextValue}
            >
              <ReminderTrigger {...props} />
            </MockedManageAthletesContextProvider>
          </AppRoot>
        );

        await userEvent.click(getTooltipMenuButton(component.container));
        await userEvent.click(screen.getByText('Training Session Reminder'));

        expect(screen.getByTestId('Modal|Content')).toHaveTextContent(
          '3 athlete have not entered an RPE today.'
        );

        await userEvent.click(
          screen.getByRole('button', {
            name: 'No sessions entered',
            hidden: true,
          })
        );

        await waitFor(() => {
          expect(
            screen.queryByText('Push Notifications Sent')
          ).toBeInTheDocument();
        });
      });
    });

    it('Shows an error when the request fails', async () => {
      server.use(
        rest.post('/settings/athlete_push', (req, res, ctx) =>
          res(ctx.status(500))
        )
      );
      getNonCompliantAthletes.mockResolvedValue({
        wellbeing: [],
        session: [1, 2, 3],
      });
      const component = render(
        <AppRoot>
          <MockedManageAthletesContextProvider
            manageAthletesContext={mockedManageAthletesContextValue}
          >
            <ReminderTrigger {...props} />
          </MockedManageAthletesContextProvider>
        </AppRoot>
      );

      await userEvent.click(getTooltipMenuButton(component.container));
      await userEvent.click(screen.getByText('Training Session Reminder'));

      await userEvent.click(
        screen.getByRole('button', { name: 'Entire squad', hidden: true })
      );

      await waitFor(() => {
        expect(
          screen.queryByText('Error sending push notifications')
        ).toBeInTheDocument();
      });
    });

    it('closes the training session modal when clicking cancel', async () => {
      getNonCompliantAthletes.mockResolvedValue({
        wellbeing: [],
        session: [1, 2, 3],
      });
      const component = render(
        <AppRoot>
          <MockedManageAthletesContextProvider
            manageAthletesContext={mockedManageAthletesContextValue}
          >
            <ReminderTrigger {...props} />
          </MockedManageAthletesContextProvider>
        </AppRoot>
      );

      await userEvent.click(getTooltipMenuButton(component.container));
      await userEvent.click(screen.getByText('Training Session Reminder'));

      await userEvent.click(
        screen.getByRole('button', { name: 'Cancel', hidden: true })
      );

      expect(screen.queryByTestId('Modal|Content')).not.toBeInTheDocument();
    });
  });

  describe('Well Being Reminder', () => {
    beforeEach(() => {
      window.featureFlags['league-ops-mass-create-athlete-staff'] = true;
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('Shows the correct modal content when all athletes ar compliants', async () => {
      getNonCompliantAthletes.mockResolvedValue({
        wellbeing: [],
        session: [],
      });
      const component = render(
        <AppRoot>
          <MockedManageAthletesContextProvider
            manageAthletesContext={mockedManageAthletesContextValue}
          >
            <ReminderTrigger {...props} />
          </MockedManageAthletesContextProvider>
        </AppRoot>
      );

      await userEvent.click(getTooltipMenuButton(component.container));
      await userEvent.click(screen.getByText('Well-being Reminder'));

      expect(screen.getByTestId('Modal|Content')).toHaveTextContent(
        'All athletes have screened today'
      );
    });

    it('sends notifications to athletes when clicking send notification button', async () => {
      getNonCompliantAthletes.mockResolvedValue({
        wellbeing: [1, 2, 3],
        session: [],
      });
      const component = render(
        <AppRoot>
          <MockedManageAthletesContextProvider
            manageAthletesContext={mockedManageAthletesContextValue}
          >
            <ReminderTrigger {...props} />
          </MockedManageAthletesContextProvider>
        </AppRoot>
      );

      await userEvent.click(getTooltipMenuButton(component.container));
      await userEvent.click(screen.getByText('Well-being Reminder'));

      expect(screen.getByTestId('Modal|Content')).toHaveTextContent(
        'Do you want to send a Well-being reminder notification to 3 athlete?'
      );

      await userEvent.click(
        screen.getByRole('button', { name: 'Send notification', hidden: true })
      );

      await waitFor(() => {
        expect(
          screen.queryByText('Push Notifications Sent')
        ).toBeInTheDocument();
      });
    });

    it('Shows an error when the request fails', async () => {
      server.use(
        rest.post('/settings/athlete_push', (req, res, ctx) =>
          res(ctx.status(500))
        )
      );
      getNonCompliantAthletes.mockResolvedValue({
        wellbeing: [1, 2, 3],
        session: [],
      });
      const component = render(
        <AppRoot>
          <MockedManageAthletesContextProvider
            manageAthletesContext={mockedManageAthletesContextValue}
          >
            <ReminderTrigger {...props} />
          </MockedManageAthletesContextProvider>
        </AppRoot>
      );

      await userEvent.click(getTooltipMenuButton(component.container));
      await userEvent.click(screen.getByText('Well-being Reminder'));

      await userEvent.click(
        screen.getByRole('button', { name: 'Send notification', hidden: true })
      );

      await waitFor(() => {
        expect(
          screen.queryByText('Error sending push notifications')
        ).toBeInTheDocument();
      });
    });

    it('closes the well being modal when clicking cancel', async () => {
      getNonCompliantAthletes.mockResolvedValue({
        wellbeing: [1, 2, 3],
        session: [],
      });
      const component = render(
        <AppRoot>
          <MockedManageAthletesContextProvider
            manageAthletesContext={mockedManageAthletesContextValue}
          >
            <ReminderTrigger {...props} />
          </MockedManageAthletesContextProvider>
        </AppRoot>
      );

      await userEvent.click(getTooltipMenuButton(component.container));
      await userEvent.click(screen.getByText('Well-being Reminder'));

      await userEvent.click(
        screen.getByRole('button', { name: 'Cancel', hidden: true })
      );

      expect(screen.queryByTestId('Modal|Content')).not.toBeInTheDocument();
    });
  });
});
