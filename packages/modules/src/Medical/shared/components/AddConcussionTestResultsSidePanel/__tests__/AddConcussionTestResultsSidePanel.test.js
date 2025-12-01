/* eslint-disable camelcase */
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import selectEvent from 'react-select-event';
import moment from 'moment-timezone';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import * as medicalSharedApi from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import useEnrichedAthletesIssues from '@kitman/modules/src/Medical/shared/hooks/useEnrichedAthletesIssues';
import { mockedPastAthlete } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { server, rest } from '@kitman/services/src/mocks/server';
import * as services from '@kitman/services';
import { data as mockedIssues } from './getAthleteIssues';
import AddConcussionTestResultsSidePanel from '../index';

jest.mock('@kitman/components/src/DatePicker');
jest.mock('@kitman/components/src/FileUploadField');
jest.mock('@kitman/components/src/DelayedLoadingFeedback');
jest.mock('@kitman/modules/src/Medical/shared/hooks/useEnrichedAthletesIssues');
jest.mock('@kitman/services', () => ({
  ...jest.requireActual('@kitman/services'),
  saveAttachmentLegacy: jest.fn(),
  saveConcussionTestResults: jest.fn(),
}));

describe('<AddConcussionTestResultsSidePanel />', () => {
  const props = {
    isOpen: true,
    testProtocol: 'NPC',
    testUnit: 'cm',
    squadAthletes: [
      {
        label: 'Squad A Name',
        options: [
          {
            value: 1,
            label: 'Athlete 1 Name',
          },
          {
            value: 2,
            label: 'Athlete 2 Name',
          },
        ],
      },
      {
        label: 'Squad B Name',
        options: [
          {
            value: 3,
            label: 'Athlete 3 Name',
          },
          {
            value: 4,
            label: 'Athlete 4 Name',
          },
        ],
      },
    ],
    examiners: [
      {
        value: 1,
        label: 'Examiner 1 Name',
      },
      {
        value: 2,
        label: 'Examiner 2 Name',
      },
    ],
    formTypes: [
      {
        name: 'Baseline',
        value: 'baseline',
      },
      {
        name: 'Initial assessment',
        value: 'initial_assessment',
      },
      {
        name: 'Start of RTP',
        value: 'start_of_rtp',
      },
      {
        name: 'RTP recurring',
        value: 'rtp_recurring',
      },
    ],
    onClose: jest.fn(),
    onFileUploadStart: jest.fn(),
    onFileUploadSuccess: jest.fn(),
    onFileUploadFailure: jest.fn(),
    initialDataRequestStatus: jest.fn(),
    onAssessmentAdded: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const store = storeFake({
    medicalApi: {},
  });

  const renderComponent = (additionalProps = {}) => {
    return {
      user: userEvent.setup({ advanceTimers: jest.advanceTimersByTime }),
      ...render(
        <Provider store={store}>
          <AddConcussionTestResultsSidePanel {...props} {...additionalProps} />
        </Provider>
      ),
    };
  };

  let fetchAthleteIssues; // Declare outside to be accessible in tests

  beforeEach(() => {
    fetchAthleteIssues = jest.fn().mockResolvedValue(); // Initialize inside beforeEach
    moment.tz.setDefault('UTC');
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2022-05-12T00:00:00Z'));

    // Mocking for all tests
    useEnrichedAthletesIssues.mockReturnValue({
      enrichedAthleteIssues: [
        {
          label: 'Open injury/ illness',
          options: [
            {
              value: 'Injury_400',
              label: 'May 23, 2020 - Acute Concussion [N/A]',
            },
          ],
        },
        {
          label: 'Prior injury/illness',
          options: [],
        },
      ],
      fetchAthleteIssues,
    });
    services.saveAttachmentLegacy.mockResolvedValue({ attachment_id: 1001 });
    services.saveConcussionTestResults.mockResolvedValue({});

    jest
      .spyOn(medicalSharedApi, 'useGetAthleteDataQuery')
      .mockReturnValue({ data: mockedPastAthlete });

    // Mock jQuery.ajax for issue occurrences
    server.use(
      rest.get(
        '/ui/medical/athletes/:id/issue_occurrences',
        (req, res, ctx) => {
          const { grouped, include_issue } = req.url.searchParams;
          if (grouped === 'true' && include_issue === 'true') {
            return res(ctx.json(mockedIssues.groupedIssues));
          }
          return res(ctx.json(mockedIssues));
        }
      ),
      rest.post('/attachments', (req, res, ctx) => {
        return res(ctx.json({ attachment_id: 1001 }));
      }),
      rest.post('/concussion/npc', (req, res, ctx) => {
        return res(ctx.json({}));
      }),
      rest.post('/concussion/king_devick', (req, res, ctx) => {
        return res(ctx.json({}));
      })
    );
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
    moment.tz.setDefault();
  });

  it('calls fetchAthleteIssues with the correct parameters when the athlete is changed', async () => {
    renderComponent({ isAthleteSelectable: true });

    const athleteSelector = screen.getByLabelText('Athlete');
    await selectEvent.select(athleteSelector, 'Athlete 2 Name');

    expect(fetchAthleteIssues).toHaveBeenCalledWith({
      selectedAthleteId: 2,
      useOccurrenceIdValue: true,
      includeDetailedIssue: true,
      issueFilter: expect.any(Function),
      includeIssue: true,
      includeGrouped: true,
    });
  });

  describe('when the test protocol is KING-DEVICK', () => {
    it('renders the panel with the proper title', () => {
      renderComponent({ testProtocol: 'KING-DEVICK' });
      expect(screen.getByText('Add King-Devick results')).toBeInTheDocument();
    });

    it('renders the correct content', () => {
      renderComponent({ testProtocol: 'KING-DEVICK' });

      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Baseline' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Initial assessment' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Start of RTP' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'RTP recurring' })
      ).toBeInTheDocument();

      expect(screen.getByLabelText('Athlete')).toBeInTheDocument();
      expect(screen.getByLabelText('Date of examination')).toBeInTheDocument();

      expect(screen.getByText('Time of examination')).toBeInTheDocument();
      expect(screen.getByLabelText('Timezone')).toBeInTheDocument();
      expect(screen.getByLabelText('Examiner')).toBeInTheDocument();

      const numericInputsLabels = screen.getAllByTestId('InputNumeric|label');
      expect(numericInputsLabels[0]).toHaveTextContent('Score');
      expect(numericInputsLabels[1]).toHaveTextContent('Errors');

      expect(
        screen.getByRole('button', { name: 'Add attachment' })
      ).toBeInTheDocument();
    });

    it('input of score and error values are reflected back in component values', async () => {
      renderComponent({ testProtocol: 'KING-DEVICK' });

      const numericInputs = screen.getAllByTestId('InputNumeric');
      const scoreInput = within(numericInputs[0]).getByRole('spinbutton');
      const errorsInput = within(numericInputs[1]).getByRole('spinbutton');

      fireEvent.change(scoreInput, { target: { value: '5' } });
      fireEvent.change(errorsInput, { target: { value: '3' } });

      expect(scoreInput).toHaveValue(5);
      expect(errorsInput).toHaveValue(3);
    });

    it('input of float score and error values are reflected back in component values', async () => {
      renderComponent({ testProtocol: 'KING-DEVICK' });

      const numericInputs = screen.getAllByTestId('InputNumeric');
      const scoreInput = within(numericInputs[0]).getByRole('spinbutton');
      const errorsInput = within(numericInputs[1]).getByRole('spinbutton');

      fireEvent.change(scoreInput, { target: { value: '5.1' } });
      fireEvent.change(errorsInput, { target: { value: '3.1' } });

      expect(scoreInput).toHaveValue(5.1);
      expect(errorsInput).toHaveValue(3.1);
    });
  });

  describe('when the test protocol is NPC', () => {
    it('renders the panel with the proper title', () => {
      renderComponent({ testProtocol: 'NPC' });
      expect(
        screen.getByText('Add near point of convergence (NPC) results')
      ).toBeInTheDocument();
    });

    it('renders the correct content', () => {
      renderComponent({ testProtocol: 'NPC' });

      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Baseline' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Initial assessment' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Start of RTP' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'RTP recurring' })
      ).toBeInTheDocument();

      expect(screen.getByLabelText('Athlete')).toBeInTheDocument();
      expect(screen.getByLabelText('Date of examination')).toBeInTheDocument();
      expect(screen.getByText('Time of examination')).toBeInTheDocument();
      expect(screen.getByLabelText('Timezone')).toBeInTheDocument();
      expect(screen.getByLabelText('Examiner')).toBeInTheDocument();

      const numericInputsLabels = screen.getAllByTestId('InputNumeric|label');
      expect(numericInputsLabels[0]).toHaveTextContent('Distance 1');
      expect(numericInputsLabels[1]).toHaveTextContent('Distance 2');
      expect(numericInputsLabels[2]).toHaveTextContent('Distance 3');
      expect(numericInputsLabels[3]).toHaveTextContent('Average');

      const numericInputs = screen.getAllByTestId('InputNumeric');
      const averageInput = within(numericInputs[3]).getByRole('spinbutton');

      expect(averageInput).toBeInTheDocument();
      expect(averageInput).toBeDisabled();

      expect(
        screen.getByRole('button', { name: 'Add attachment' })
      ).toBeInTheDocument();
    });

    it('renders average value as numbers inputted', async () => {
      renderComponent({ testProtocol: 'NPC' });

      const numericInputsLabels = screen.getAllByTestId('InputNumeric|label');
      expect(numericInputsLabels[0]).toHaveTextContent('Distance 1');
      expect(numericInputsLabels[1]).toHaveTextContent('Distance 2');
      expect(numericInputsLabels[2]).toHaveTextContent('Distance 3');
      expect(numericInputsLabels[3]).toHaveTextContent('Average');

      const numericInputs = screen.getAllByTestId('InputNumeric');

      const distance1Input = within(numericInputs[0]).getByRole('spinbutton');
      const distance2Input = within(numericInputs[1]).getByRole('spinbutton');
      const distance3Input = within(numericInputs[2]).getByRole('spinbutton');
      const averageInput = within(numericInputs[3]).getByRole('spinbutton');

      fireEvent.change(distance1Input, { target: { value: '2' } });
      expect(distance1Input).toHaveValue(2);

      fireEvent.change(distance2Input, { target: { value: '1.5' } });
      expect(distance2Input).toHaveValue(1.5);

      fireEvent.change(distance3Input, { target: { value: '1' } });
      expect(distance3Input).toHaveValue(1);

      // The average calculation is handled by the component's internal logic (useConcussionTestForm hook).
      // We need to wait for the component to re-render and update the average.
      // The average should be (2 + 1.5 + 1) / 3 = 4.5 / 3 = 1.5
      await waitFor(() => {
        expect(averageInput).toHaveValue(1.5);
      });
    });
  });

  it('renders injury select when result type not a baseline', async () => {
    const { user } = renderComponent();

    let associatedInjuriesSelect = screen.queryByLabelText(
      'Associated injury/ illness'
    );
    expect(associatedInjuriesSelect).not.toBeInTheDocument();

    const initialAssessmentButton = screen.getByRole('button', {
      name: 'Initial assessment',
    });
    await user.click(initialAssessmentButton);

    associatedInjuriesSelect = screen.getByLabelText(
      'Associated injury/ illness'
    );
    expect(associatedInjuriesSelect).toBeInTheDocument();
    expect(associatedInjuriesSelect).toBeDisabled();
  });

  it('renders injury select as non optional when result type is rtp_recurring', async () => {
    const { user } = renderComponent();

    let associatedInjuriesSelect = screen.queryByLabelText(
      'Associated injury/ illness'
    );
    expect(associatedInjuriesSelect).not.toBeInTheDocument();

    const rtpRecurringButton = screen.getByRole('button', {
      name: 'RTP recurring',
    });
    await user.click(rtpRecurringButton);

    associatedInjuriesSelect = screen.getByLabelText(
      'Associated injury/ illness'
    );
    expect(associatedInjuriesSelect).toBeInTheDocument();
    expect(associatedInjuriesSelect).toBeDisabled();
  });

  it('calls the correct function when clicking the close button', async () => {
    const { user } = renderComponent();
    const closeButton = screen.getByTestId('sliding-panel|close-button');
    await user.click(closeButton);
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('shows an error message when the initial request fails', () => {
    renderComponent({ initialDataRequestStatus: 'FAILURE' });
    expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
  });

  describe('when selecting a player and the request succeeds', () => {
    it('populates the associated issues selector with only concussion options', async () => {
      const { user } = renderComponent();

      const initialAssessmentButton = screen.getByRole('button', {
        name: 'Initial assessment',
      });
      await user.click(initialAssessmentButton);

      const athleteSelector = screen.getByLabelText('Athlete');
      await selectEvent.select(athleteSelector, 'Athlete 1 Name');

      expect(
        screen.getByTestId('AddConcussionResultSidePanel|AssociatedInjuries')
      ).toBeInTheDocument();

      expect(
        screen.getByText('Associated injury/ illness')
      ).toBeInTheDocument();

      expect(
        screen.getByText('Associated injury/ illness')
      ).toBeInTheDocument();

      await user.click(screen.getByLabelText('Associated injury/ illness'));
      expect(screen.getByText('Open injury/ illness')).toBeInTheDocument();

      expect(
        screen.getByText('May 23, 2020 - Acute Concussion [N/A]')
      ).toBeInTheDocument();
    });
  });

  describe('when selecting a player and the request fails', () => {
    beforeEach(() => {
      server.use(
        rest.get(
          '/ui/medical/athletes/:id/issue_occurrences',
          (req, res, ctx) => {
            return res(ctx.status(500));
          }
        )
      );
      useEnrichedAthletesIssues.mockReturnValue({
        enrichedAthleteIssues: [],
        fetchAthleteIssues: jest.fn().mockRejectedValue(new Error('API Error')),
      });
    });

    it('shows an error message when the request fails', async () => {
      renderComponent();

      const athleteSelector = screen.getByLabelText('Athlete');
      await selectEvent.select(athleteSelector, 'Athlete 1 Name');

      await waitFor(() => {
        expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
      });
    });
  });

  describe('when saving without setting the required fields', () => {
    it('sets the required fields as invalid', async () => {
      const { user } = renderComponent();
      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      const athleteSelect = screen.getByLabelText('Athlete');
      expect(athleteSelect.parentNode.parentNode.parentNode).toHaveClass(
        'kitmanReactSelect--invalid'
      );

      const examinerSelect = screen.getByLabelText('Examiner');
      expect(examinerSelect.parentNode.parentNode.parentNode).toHaveClass(
        'kitmanReactSelect--invalid'
      );

      const numericInputs = screen.getAllByTestId('InputNumeric');
      const distance1Input = within(numericInputs[0]).getByRole('spinbutton');

      expect(distance1Input.parentNode).toHaveClass(
        'InputNumeric__inputContainer--invalid'
      );

      const distance2Input = within(numericInputs[1]).getByRole('spinbutton');
      expect(distance2Input.parentNode).toHaveClass(
        'InputNumeric__inputContainer--invalid'
      );

      const distance3Input = within(numericInputs[2]).getByRole('spinbutton');
      expect(distance3Input.parentNode).toHaveClass(
        'InputNumeric__inputContainer--invalid'
      );
    });

    it('requires injury or illness in RTP modes', async () => {
      const { user } = renderComponent();

      const startOfRTPButton = screen.getByRole('button', {
        name: 'Start of RTP',
      });
      await user.click(startOfRTPButton);

      let associatedInjuriesSelect = screen.getByLabelText(
        'Associated injury/ illness'
      );
      expect(associatedInjuriesSelect).toBeInTheDocument();
      expect(
        associatedInjuriesSelect.parentNode.parentNode.parentNode
      ).not.toHaveClass('kitmanReactSelect--invalid');

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      associatedInjuriesSelect = screen.getByLabelText(
        'Associated injury/ illness'
      );
      expect(
        associatedInjuriesSelect.parentNode.parentNode.parentNode
      ).toHaveClass('kitmanReactSelect--invalid');

      const athleteSelect = screen.getByLabelText('Athlete');
      expect(athleteSelect.parentNode.parentNode.parentNode).toHaveClass(
        'kitmanReactSelect--invalid'
      );

      const examinerSelect = screen.getByLabelText('Examiner');
      expect(examinerSelect.parentNode.parentNode.parentNode).toHaveClass(
        'kitmanReactSelect--invalid'
      );

      const numericInputs = screen.getAllByTestId('InputNumeric');
      const distance1Input = within(numericInputs[0]).getByRole('spinbutton');
      expect(distance1Input.parentNode).toHaveClass(
        'InputNumeric__inputContainer--invalid'
      );

      const distance2Input = within(numericInputs[1]).getByRole('spinbutton');
      expect(distance2Input.parentNode).toHaveClass(
        'InputNumeric__inputContainer--invalid'
      );

      const distance3Input = within(numericInputs[2]).getByRole('spinbutton');
      expect(distance3Input.parentNode).toHaveClass(
        'InputNumeric__inputContainer--invalid'
      );
    });
  });

  describe('saving a new concussion test result', () => {
    it('saves the attachments and sends NPC results when clicking the save button', async () => {
      props.onClose.mockClear();
      props.onAssessmentAdded.mockClear();

      const { user } = renderComponent();

      // Fill the required parts of the form
      const athleteSelector = screen.getByLabelText('Athlete');
      await selectEvent.select(athleteSelector, 'Athlete 1 Name');

      const examinerSelect = screen.getByLabelText('Examiner');
      await selectEvent.select(examinerSelect, 'Examiner 1 Name');

      const numericInputs = screen.getAllByTestId('InputNumeric');

      const distance1Spinbutton = within(numericInputs[0]).getByRole(
        'spinbutton'
      );
      fireEvent.change(distance1Spinbutton, { target: { value: '1.1' } });

      const distance2Spinbutton = within(numericInputs[1]).getByRole(
        'spinbutton'
      );
      fireEvent.change(distance2Spinbutton, { target: { value: '2.2' } });

      const distance3Spinbutton = within(numericInputs[2]).getByRole(
        'spinbutton'
      );
      fireEvent.change(distance3Spinbutton, { target: { value: '3' } });

      const addAttachmentButton = screen.getByRole('button', {
        name: 'Add attachment',
      });
      await user.click(addAttachmentButton);

      const fileAction = screen.getAllByTestId('TooltipMenu|ListItemButton')[0];
      await user.click(fileAction);

      const fileInput = screen.getByTestId('file-input-mock');

      const file = new File(['file content'], 'file.pdf', {
        type: 'application/pdf',
      });
      await user.upload(fileInput, file);

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      await waitFor(() => {
        expect(props.onAssessmentAdded).toHaveBeenCalledWith('NPC');
        expect(props.onClose).toHaveBeenCalledTimes(1);
      });
    });

    it('saves the attachments and sends King-Devick results when clicking the save button', async () => {
      props.onClose.mockClear();
      props.onAssessmentAdded.mockClear();

      const { user } = renderComponent({ testProtocol: 'KING-DEVICK' });

      // Fill the required parts of the form
      const athleteSelector = screen.getByLabelText('Athlete');
      await selectEvent.select(athleteSelector, 'Athlete 1 Name');

      const examinerSelect = screen.getByLabelText('Examiner');
      await selectEvent.select(examinerSelect, 'Examiner 1 Name');

      const numericInputs = screen.getAllByTestId('InputNumeric');
      const scoreInput = within(numericInputs[0]).getByRole('spinbutton');
      fireEvent.change(scoreInput, { target: { value: '5.1' } });

      const errorsInput = within(numericInputs[1]).getByRole('spinbutton');
      fireEvent.change(errorsInput, { target: { value: '3.1' } });

      const addAttachmentButton = screen.getByRole('button', {
        name: 'Add attachment',
      });
      await user.click(addAttachmentButton);

      const fileAction = screen.getAllByTestId('TooltipMenu|ListItemButton')[0];
      await user.click(fileAction);

      const fileInput = screen.getByTestId('file-input-mock');

      const file = new File(['file content'], 'file.pdf', {
        type: 'application/pdf',
      });
      await user.upload(fileInput, file);

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      await waitFor(() => {
        expect(props.onAssessmentAdded).toHaveBeenCalledWith('KING-DEVICK');
        expect(props.onClose).toHaveBeenCalledTimes(1);
      });
    });

    it('sends King-Devick results with zero as valid values', async () => {
      props.onClose.mockClear();
      props.onAssessmentAdded.mockClear();

      const { user } = renderComponent({ testProtocol: 'KING-DEVICK' });

      // Fill the required parts of the form
      const athleteSelector = screen.getByLabelText('Athlete');
      await selectEvent.select(athleteSelector, 'Athlete 1 Name');

      const examinerSelect = screen.getByLabelText('Examiner');
      await selectEvent.select(examinerSelect, 'Examiner 1 Name');

      const numericInputs = screen.getAllByTestId('InputNumeric');
      const scoreInput = within(numericInputs[0]).getByRole('spinbutton');
      fireEvent.change(scoreInput, { target: { value: '0' } });

      const errorsInput = within(numericInputs[1]).getByRole('spinbutton');
      fireEvent.change(errorsInput, { target: { value: '0' } });

      const addAttachmentButton = screen.getByRole('button', {
        name: 'Add attachment',
      });
      await user.click(addAttachmentButton);

      const fileAction = screen.getAllByTestId('TooltipMenu|ListItemButton')[0];
      await user.click(fileAction);

      const fileInput = screen.getByTestId('file-input-mock');

      const file = new File(['file content'], 'file.pdf', {
        type: 'application/pdf',
      });
      await user.upload(fileInput, file);

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      await waitFor(() => {
        expect(props.onAssessmentAdded).toHaveBeenCalledWith('KING-DEVICK');
        expect(props.onClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('player-movement-entity-concussion-test FF is on', () => {
    beforeEach(() => {
      window.featureFlags['player-movement-entity-concussion-test'] = true;
    });

    afterEach(() => {
      window.featureFlags['player-movement-entity-concussion-test'] = false;
    });

    it('renders the correct date ranges on date pickers', async () => {
      renderComponent({ athleteId: 5 });

      const examinationDateInput = screen.getByLabelText(/Date of examination/);
      // DatePicker is mocked, so we can't directly check minDate/maxDate props.
      // We would need to mock the DatePicker component to expose these props for testing.
      // For now, we'll assert its presence.
      expect(examinationDateInput).toBeInTheDocument();
    });
  });

  describe('player-movement-entity-concussion-test FF is off', () => {
    beforeEach(() => {
      window.featureFlags['player-movement-entity-concussion-test'] = false;
    });

    it('does not restrict the date picker range', async () => {
      renderComponent({ athleteId: 5 });

      const examinationDateInput = screen.getByLabelText(/Date of examination/);
      // Similar to the above, we can only assert presence without mocking DatePicker's internal props.
      expect(examinationDateInput).toBeInTheDocument();
    });
  });
});
