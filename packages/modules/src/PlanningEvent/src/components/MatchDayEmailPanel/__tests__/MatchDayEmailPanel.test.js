import i18n from 'i18next';
import { Provider } from 'react-redux';
import * as redux from 'react-redux';
import { axios } from '@kitman/common/src/utils/services';
import { setI18n } from 'react-i18next';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { getIsPanelOpen } from '@kitman/modules/src/PlanningEvent/src/redux/selectors/matchDayEmailSelectors';
import {
  REDUCER_KEY as MATCH_DAY_EMAIL_SLICE,
  initialState,
} from '@kitman/modules/src/PlanningEvent/src/redux/slices/matchDayEmailSlice';
import getEmailRecipients from '@kitman/services/src/services/notifications/getEmailRecipients';
import createMatchDayPdf from '@kitman/services/src/services/planning/createMatchDayPdf';
import mockPdfData from '@kitman/services/src/services/planning/createMatchDayPdf/mock';
import mockedEmailRecipients from '@kitman/services/src/services/notifications/getEmailRecipients/mock';
import { TAGS as planningEventTags } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/planningEventApi';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import { data as MOCK_ACTIVE_SQUAD } from '@kitman/services/src/mocks/handlers/getActiveSquad';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import saveEvent from '@kitman/modules/src/PlanningEvent/src/services/saveEvent';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { getMatchDayView } from '@kitman/modules/src/PlanningEvent/src/redux/selectors/planningEventSelectors';
import MatchDayEmailPanel from '..';

setI18n(i18n);

jest.mock(
  '@kitman/modules/src/PlanningEvent/src/redux/selectors/planningEventSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/PlanningEvent/src/redux/selectors/planningEventSelectors'
    ),
    getMatchDayView: jest.fn(),
  })
);

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock(
  '@kitman/modules/src/PlanningEvent/src/redux/selectors/matchDayEmailSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/PlanningEvent/src/redux/selectors/matchDayEmailSelectors'
    ),
    getIsPanelOpen: jest.fn(),
  })
);

jest.mock('@kitman/services/src/services/notifications/getEmailRecipients');

jest.mock('@kitman/services/src/services/planning/createMatchDayPdf');

jest.mock('@kitman/common/src/hooks/useLeagueOperations');

jest.mock('@kitman/modules/src/PlanningEvent/src/services/saveEvent');
jest.mock('@kitman/modules/src/PlanningEvent/src/services/saveEvent');
jest.mock('@kitman/common/src/redux/global/selectors', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/selectors'),
  getActiveSquad: jest.fn(),
}));
jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');

const mockSelectors = ({ isOpen = false }) => {
  getIsPanelOpen.mockReturnValue(isOpen);
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = {
  globalApi: {},
  [MATCH_DAY_EMAIL_SLICE]: initialState,
};

const defaultProps = {
  t: i18nextTranslateStub(),
  eventId: '1221221',
  homeTeam: 'Man Utd',
  awayTeam: 'Arsenal',
  matchDay: '4',
  startDate: '11-24-2024',
  roundNumber: '7',
  mlsGameKey: '777',
  leagueEvent: {
    skip_automatic_game_team_email: false,
  },
  onUpdateLeagueEvent: jest.fn(),
};

const renderComponent = ({
  myProps = {},
  isAssociationAdmin = false,
  skipAutomaticGameTeamEmail = false,
  viewerPage = false,
  mode = 'DMN',
  leagueGameTeamNotifications = true,
} = {}) => {
  const props = { ...defaultProps, ...myProps };

  getMatchDayView.mockReturnValue(() => mode);

  useLeagueOperations.mockReturnValue({ isAssociationAdmin });

  saveEvent.mockResolvedValue({
    skip_automatic_game_team_email: skipAutomaticGameTeamEmail,
  });
  getActiveSquad.mockReturnValue(() => MOCK_ACTIVE_SQUAD);

  useGetOrganisationQuery.mockReturnValue({
    data: {
      id: 1,
      name: 'kls',
    },
  });

  usePreferences.mockReturnValue({
    preferences: {
      viewer_page: viewerPage,
      league_game_team_notifications: leagueGameTeamNotifications,
    },
  });

  render(
    <Provider store={storeFake(defaultStore)}>
      <MatchDayEmailPanel {...props} />
    </Provider>
  );
};

const expectedDmnMessageTextAreaContent = [
  'All,',
  'Please find attached the MLS Match Notice for MLS Matchday 7 - 11-24-2024 – Man Utd vs Arsenal.',
  'Clubs that fail to adhere to the kit designations in the attached MLS Match Notice are subject to sanctions.',
  'Inquiries regarding kit designations can be directed to MLS Match Notice (matchnotice@mlssoccer.com) with Alfonso Mondelo (alfonso.mondelo@mlssoccer.com) copied.',
  'Inquiries regarding operations can be directed to MLS Operations (mls.ops@mlssoccer.com).',
  'Inquiries regarding broadcast (e.g., kick times) can be directed to MLS Broadcasting (mlsbroadcast@mlssoccer.com).',
  'Thank you.',
].join('\n\n');

const expectedEmptyDmnMessageTextAreaContent = [
  'All,',
  'Please find attached the MLS Match Notice for MLS - 11-24-2024 – Man Utd vs Arsenal.',
  'Clubs that fail to adhere to the kit designations in the attached MLS Match Notice are subject to sanctions.',
  'Inquiries regarding kit designations can be directed to MLS Match Notice (matchnotice@mlssoccer.com) with Alfonso Mondelo (alfonso.mondelo@mlssoccer.com) copied.',
  'Inquiries regarding operations can be directed to MLS Operations (mls.ops@mlssoccer.com).',
  'Inquiries regarding broadcast (e.g., kick times) can be directed to MLS Broadcasting (mlsbroadcast@mlssoccer.com).',
  'Thank you.',
].join('\n\n');

const expectedDmnMessage =
  'All,<br><br>Please find attached the MLS Match Notice for MLS Matchday 7 - 11-24-2024 – Man Utd vs Arsenal.<br><br>Clubs that fail to adhere to the kit designations in the attached MLS Match Notice are subject to sanctions.<br><br>Inquiries regarding kit designations can be directed to MLS Match Notice (matchnotice@mlssoccer.com) with Alfonso Mondelo (alfonso.mondelo@mlssoccer.com) copied.<br><br>Inquiries regarding operations can be directed to MLS Operations (mls.ops@mlssoccer.com).<br><br>Inquiries regarding broadcast (e.g., kick times) can be directed to MLS Broadcasting (mlsbroadcast@mlssoccer.com).<br><br>Thank you.';

const expectedDmrMessage =
  'Please find the Match Roster attached for KLS 777 – Man Utd vs Arsenal.';

const expectedDmrModalMessageForDisabledEmails =
  'By disabling email, DMR emails will not go out and all contacts will receive an email stating that DMRs will be distributed on paper. Click disable to continue.';

describe('<MatchDayEmailPanel />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getEmailRecipients.mockResolvedValueOnce(mockedEmailRecipients);
  });
  describe('NOT OPEN', () => {
    beforeEach(() => {
      mockSelectors({ isOpen: false });
    });
    it('does not render', () => {
      renderComponent();
      expect(screen.queryByText('Email')).not.toBeInTheDocument();
    });
  });
  describe('IS OPEN', () => {
    describe('MODE IS DMN', () => {
      beforeEach(() => {
        mockSelectors({ isOpen: true });
      });
      it('does render', () => {
        renderComponent();
        expect(screen.getByLabelText('Mailing List')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Subject')).toBeInTheDocument();
        expect(document.querySelector('.textarea__input')).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Copy contacts' })
        ).toBeInTheDocument();
      });
      it('has the correct values in the form input', async () => {
        renderComponent();
        await waitFor(() => expect(getEmailRecipients).toHaveBeenCalled());
        expect(
          screen.getByText('DMN Contacts (3 recipients)')
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Subject')).toHaveValue(
          'KLS 7 - 777 – Man Utd vs Arsenal Notice'
        );
        expect(document.querySelector('.textarea__input')).toHaveValue(
          expectedDmnMessageTextAreaContent
        );
      });

      it('allows the user to copy the contacts to the clipboard', async () => {
        const user = userEvent.setup();
        document.execCommand = jest.fn();
        renderComponent();
        await waitFor(() => expect(getEmailRecipients).toHaveBeenCalled());
        await user.click(screen.getByRole('button', { name: 'Copy contacts' }));
        expect(document.execCommand).toHaveBeenCalledWith('copy');
      });

      it('allows the message body to be editable', async () => {
        const user = userEvent.setup();
        renderComponent();
        await waitFor(() => expect(getEmailRecipients).toHaveBeenCalled());
        await user.clear(document.querySelector('.textarea__input'));
        fireEvent.change(document.querySelector('.textarea__input'), {
          target: { value: 'Test MEssage Here' },
        });
        await waitFor(() => {
          expect(document.querySelector('.textarea__input')).toHaveValue(
            'Test MEssage Here'
          );
        });
      });

      it('deselects recipients', async () => {
        const user = userEvent.setup();
        renderComponent();
        await waitFor(() => expect(getEmailRecipients).toHaveBeenCalled());
        expect(
          screen.getByText('DMN Contacts (3 recipients)')
        ).toBeInTheDocument();
        user.click(screen.getByLabelText('Mailing List'));
        await user.click(
          await screen.findByText('walterwhite@ididntcookthemeth.com')
        );
        expect(
          screen.getByText('DMN Contacts (2 recipients)')
        ).toBeInTheDocument();
      });

      it('renders without a match day and match number', () => {
        renderComponent({ myProps: { roundNumber: null, mlsGameKey: null } });
        expect(screen.getByLabelText('Subject')).toHaveValue(
          'KLS – Man Utd vs Arsenal Notice'
        );
        expect(document.querySelector('.textarea__input')).toHaveValue(
          expectedEmptyDmnMessageTextAreaContent
        );
      });

      it('does not render the disable email switch if the mode is DMN', () => {
        renderComponent();
        expect(screen.queryByText('Disable email')).not.toBeInTheDocument();
      });
    });
    describe('MODE IS DMR', () => {
      beforeEach(() => {
        mockSelectors({ isOpen: true });
      });
      it('does render', () => {
        renderComponent({ mode: 'DMR' });
        expect(screen.getByLabelText('Mailing List')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Subject')).toBeInTheDocument();
        expect(document.querySelector('.textarea__input')).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Copy contacts' })
        ).toBeInTheDocument();
      });
      it('has the correct values in the form input', async () => {
        renderComponent({ mode: 'DMR' });
        await waitFor(() => expect(getEmailRecipients).toHaveBeenCalled());
        expect(
          screen.getByText('DMR Contacts (3 recipients)')
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Subject')).toHaveValue(
          'KLS 777 – Man Utd vs Arsenal Roster'
        );
        expect(document.querySelector('.textarea__input')).toHaveValue(
          expectedDmrMessage
        );
      });

      it('allows the user to copy the contacts to the clipboard', async () => {
        const user = userEvent.setup();
        document.execCommand = jest.fn();
        renderComponent();
        await waitFor(() => expect(getEmailRecipients).toHaveBeenCalled());
        await user.click(screen.getByRole('button', { name: 'Copy contacts' }));
        expect(document.execCommand).toHaveBeenCalledWith('copy');
      });

      it('deselects recipients', async () => {
        const user = userEvent.setup();
        renderComponent({ mode: 'DMR' });
        await waitFor(() => expect(getEmailRecipients).toHaveBeenCalled());
        expect(
          screen.getByText('DMR Contacts (3 recipients)')
        ).toBeInTheDocument();
        userEvent.click(screen.getByLabelText('Mailing List'));
        await user.click(
          await screen.findByText('walterwhite@ididntcookthemeth.com')
        );
        expect(
          screen.getByText('DMR Contacts (2 recipients)')
        ).toBeInTheDocument();
      });

      it('does not render the disable email switch if the mode is DMR and the user is not an association admin', () => {
        renderComponent({
          mode: 'DMR',
          isAssociationAdmin: false,
        });
        expect(screen.queryByText('Disable email')).not.toBeInTheDocument();
      });

      it('renders the disable email switch if the mode is DMR and the user is an association admin', () => {
        renderComponent({
          mode: 'DMR',
          isAssociationAdmin: true,
        });
        expect(screen.getByText('Disable email')).toBeInTheDocument();
      });

      describe('viewing page preference email', () => {
        it('renders the appropriate viewing page link in the message text when the preference is on', () => {
          renderComponent({ mode: 'DMR', viewerPage: true });
          expect(document.querySelector('.textarea__input')).toHaveValue(
            [
              expectedDmrMessage,
              'Roster information can also be found here:',
              'https://mls-assist.theintelligenceplatform.com/?org=kls&division=kls',
            ].join('\n')
          );
        });
      });
    });

    describe('Send Email Action', () => {
      let useDispatchSpy;
      let mockDispatch;

      beforeEach(() => {
        useDispatchSpy = jest.spyOn(redux, 'useDispatch');
        mockDispatch = jest.fn();
        useDispatchSpy.mockReturnValue(mockDispatch);
        createMatchDayPdf.mockResolvedValueOnce(mockPdfData);
      });

      describe('MODE IS DMN', () => {
        it('hits the sendMatchNoticeEmail successfully and fires a toast', async () => {
          jest.spyOn(axios, 'post');
          const user = userEvent.setup();
          mockSelectors({ isOpen: true });
          renderComponent();
          await user.click(screen.getByText('Send'));

          expect(axios.post).toHaveBeenCalledWith('/notifications/send_email', {
            attachment_ids: [1],
            kind: 'dmn',
            message: expectedDmnMessage,
            message_format: 'html',
            notificationable_id: '1221221',
            notificationable_type: 'event',
            recipients: mockedEmailRecipients.map(({ email }) => email),
            subject: 'KLS 7 - 777 – Man Utd vs Arsenal Notice',
          });

          expect(mockDispatch).toHaveBeenCalledWith({
            payload: [planningEventTags.GAME_INFORMATION],
            type: 'planningEventApi/invalidateTags',
          });

          expect(mockDispatch).toHaveBeenCalledWith({
            payload: { status: 'SUCCESS', title: 'Emails sent successfully' },
            type: 'toasts/add',
          });
        });
      });

      describe('MODE IS DMR', () => {
        it('hits the sendMatchNoticeEmail successfully and fires a toast', async () => {
          jest.spyOn(axios, 'post');
          const user = userEvent.setup();
          mockSelectors({ isOpen: true });
          renderComponent({ mode: 'DMR' });
          await user.click(screen.getByText('Send'));

          expect(axios.post).toHaveBeenCalledWith('/notifications/send_email', {
            attachment_ids: [1],
            kind: 'dmr',
            message: expectedDmrMessage,
            message_format: 'html',
            notificationable_id: '1221221',
            notificationable_type: 'event',
            recipients: mockedEmailRecipients.map(({ email }) => email),
            subject: 'KLS 777 – Man Utd vs Arsenal Roster',
          });

          expect(mockDispatch).toHaveBeenCalledWith({
            payload: { status: 'SUCCESS', title: 'Emails sent successfully' },
            type: 'toasts/add',
          });
        });

        it('hits the sendMatchNotice email with the viewer page link', async () => {
          jest.spyOn(axios, 'post');
          const user = userEvent.setup();
          mockSelectors({ isOpen: true });
          renderComponent({ mode: 'DMR', viewerPage: true });
          await user.click(screen.getByText('Send'));
          expect(axios.post).toHaveBeenCalledWith('/notifications/send_email', {
            attachment_ids: [1],
            kind: 'dmr',
            message:
              'Please find the Match Roster attached for KLS 777 – Man Utd vs Arsenal.<br>Roster information can also be found here:<br>https://mls-assist.theintelligenceplatform.com/?org=kls&amp;division=kls',
            message_format: 'html',
            notificationable_id: '1221221',
            notificationable_type: 'event',
            recipients: mockedEmailRecipients.map(({ email }) => email),
            subject: 'KLS 777 – Man Utd vs Arsenal Roster',
          });
        });
      });

      it('fails hitting the sendMatchNoticeEmail endpoint and fires a toast', async () => {
        jest.spyOn(axios, 'post').mockRejectedValue({});
        const user = userEvent.setup();
        mockSelectors({ isOpen: true });
        renderComponent();
        await user.click(screen.getByText('Send'));

        expect(mockDispatch).toHaveBeenCalledWith({
          payload: { status: 'ERROR', title: 'Failed to send emails' },
          type: 'toasts/add',
        });
      });
    });
    describe('EMAIL MESSAGE IS EMPTY', () => {
      beforeEach(() => {
        mockSelectors({ isOpen: true });
      });
      it('disables the send button', async () => {
        const user = userEvent.setup();
        renderComponent();
        await waitFor(() => expect(getEmailRecipients).toHaveBeenCalled());
        expect(screen.getByText('Send')).toBeEnabled();
        await user.clear(document.querySelector('.textarea__input'));
        expect(screen.getByText('Send')).toBeDisabled();
      });
    });

    describe('Disable Email Switch', () => {
      it('disables the DMR emails when the switch is on', async () => {
        const user = userEvent.setup();
        renderComponent({
          mode: 'DMR',
          isAssociationAdmin: true,
          skipAutomaticGameTeamEmail: true,
        });
        await user.click(
          screen.getByLabelText('Disable email', { selector: 'input' })
        );
        expect(
          screen.getByText(expectedDmrModalMessageForDisabledEmails)
        ).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Disable' }));

        expect(
          screen.getByLabelText('Disable email', { selector: 'input' })
        ).toBeChecked();

        expect(screen.getByText('Send', { selector: 'button' })).toBeDisabled();
      });
      it('enables the send button when the switch is off', async () => {
        const user = userEvent.setup();
        renderComponent({
          mode: 'DMR',
          myProps: {
            leagueEvent: {
              skip_automatic_game_team_email: true,
            },
          },
          isAssociationAdmin: true,
          skipAutomaticGameTeamEmail: false,
        });
        await user.click(
          screen.getByLabelText('Disable email', { selector: 'input' })
        );
        expect(
          screen.getByLabelText('Disable email', { selector: 'input' })
        ).not.toBeChecked();
        expect(screen.getByText('Send', { selector: 'button' })).toBeEnabled();
      });
      it('keeps the email switch in the same state when the user clicks the cancel button', async () => {
        const user = userEvent.setup();
        renderComponent({
          mode: 'DMR',
          myProps: {
            leagueEvent: {
              skip_automatic_game_team_email: false,
            },
          },
          isAssociationAdmin: true,
          skipAutomaticGameTeamEmail: false,
        });
        await user.click(
          screen.getByLabelText('Disable email', { selector: 'input' })
        );
        await user.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(
          screen.getByLabelText('Disable email', { selector: 'input' })
        ).not.toBeChecked();
      });
    });

    describe('when `league_game_team_notifications` is false', () => {
      beforeEach(() => {
        mockSelectors({ isOpen: true });
        window.featureFlags['league-ops-match-day-email-preview'] = true;
        createMatchDayPdf.mockResolvedValue(mockPdfData);
        jest.spyOn(axios, 'post').mockResolvedValue({});
      });

      afterEach(() => {
        window.featureFlags = {};
        jest.clearAllMocks();
      });

      it('hides the preview attachment button and the disable email switch when the mode is DMR', async () => {
        renderComponent({
          mode: 'DMR',
          leagueGameTeamNotifications: false,
          isAssociationAdmin: true,
        });

        await waitFor(() => {
          expect(
            screen.queryByRole('button', { name: 'Preview attachment' })
          ).not.toBeInTheDocument();
        });
        expect(screen.queryByText('Disable email')).not.toBeInTheDocument();
      });

      it('shows the preview attachment button when the mode is DMN', async () => {
        renderComponent({
          mode: 'DMN',
          leagueGameTeamNotifications: false,
          isAssociationAdmin: true,
        });
        await waitFor(() => {
          expect(
            screen.getByRole('button', { name: 'Preview attachment' })
          ).toBeInTheDocument();
        });
      });

      it('shows an empty subject and message body when the mode is DMR', async () => {
        renderComponent({
          mode: 'DMR',
          leagueGameTeamNotifications: false,
          isAssociationAdmin: true,
        });
        await waitFor(() => {
          expect(screen.getByLabelText('Subject')).toHaveValue('');
        });
        expect(document.querySelector('.textarea__input')).toHaveValue('');
      });

      it('is able to edit the subject when the mode is DMR', async () => {
        renderComponent({
          mode: 'DMR',
          leagueGameTeamNotifications: false,
          isAssociationAdmin: true,
        });
        const subjectInput = screen.getByLabelText('Subject');
        fireEvent.change(subjectInput, {
          target: { value: 'Test Subject' },
        });
        await waitFor(() => {
          expect(subjectInput).toHaveValue('Test Subject');
        });
      });

      it('is not able to edit the subject when the mode is DMN', async () => {
        renderComponent({
          mode: 'DMN',
          leagueGameTeamNotifications: false,
          isAssociationAdmin: true,
        });
        const subjectInput = screen.getByLabelText('Subject');
        fireEvent.change(subjectInput, {
          target: { value: 'Test Subject' },
        });
        await waitFor(() => {
          expect(subjectInput).toHaveValue(
            'KLS 7 - 777 – Man Utd vs Arsenal Notice'
          );
        });
      });

      it('resets the subject and message when the email sends successfully', async () => {
        const user = userEvent.setup();
        renderComponent({
          mode: 'DMR',
          leagueGameTeamNotifications: false,
          isAssociationAdmin: true,
        });

        fireEvent.change(screen.getByLabelText('Subject'), {
          target: { value: 'Test Subject' },
        });
        fireEvent.change(document.querySelector('.textarea__input'), {
          target: { value: 'Test Message' },
        });
        await waitFor(() => {
          expect(screen.getByLabelText('Subject')).toHaveValue('Test Subject');
        });
        expect(document.querySelector('.textarea__input')).toHaveValue(
          'Test Message'
        );
        expect(screen.getByText('Send')).toBeEnabled();

        await user.click(screen.getByText('Send'));
        await waitFor(() => {
          expect(screen.getByLabelText('Subject')).toHaveValue('');
        });
        expect(document.querySelector('.textarea__input')).toHaveValue('');
      });
    });

    describe('when `league_game_team_notifications` is true', () => {
      beforeEach(() => {
        mockSelectors({ isOpen: true });
        window.featureFlags['league-ops-match-day-email-preview'] = true;
      });

      it('shows the  preview attachment button when the mode is DMN', async () => {
        renderComponent({
          mode: 'DMN',
          leagueGameTeamNotifications: true,
          isAssociationAdmin: true,
        });
        await waitFor(() => {
          expect(
            screen.getByRole('button', { name: 'Preview attachment' })
          ).toBeInTheDocument();
        });
      });

      it('shows the preview attachment button and the disable email switch when the mode is DMR', async () => {
        renderComponent({
          mode: 'DMR',
          leagueGameTeamNotifications: true,
          isAssociationAdmin: true,
        });
        await waitFor(() => {
          expect(
            screen.getByRole('button', { name: 'Preview attachment' })
          ).toBeInTheDocument();
        });
        expect(screen.getByText('Disable email')).toBeInTheDocument();
      });

      it.each([
        { mode: 'DMR', expectedValue: 'KLS 777 – Man Utd vs Arsenal Roster' },
        {
          mode: 'DMN',
          expectedValue: 'KLS 7 - 777 – Man Utd vs Arsenal Notice',
        },
      ])(
        'is not able to edit the subject when the mode is $mode',
        async ({ mode, expectedValue }) => {
          renderComponent({
            mode,
            leagueGameTeamNotifications: true,
            isAssociationAdmin: true,
          });
          const subjectInput = screen.getByLabelText('Subject');
          fireEvent.change(subjectInput, {
            target: { value: 'Test Subject' },
          });
          await waitFor(() => expect(subjectInput).toHaveValue(expectedValue));
        }
      );
    });
  });
});
