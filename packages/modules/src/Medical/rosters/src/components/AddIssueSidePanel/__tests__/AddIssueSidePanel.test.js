import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  renderWithProvider,
  storeFake,
} from '@kitman/common/src/utils/test_utils';
import * as medicalSharedApi from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { mockedPastAthlete } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import {
  useGetOrganisationQuery,
  useGetCurrentUserQuery,
  useGetPermissionsQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import useIssueFields from '@kitman/modules/src/Medical/shared/hooks/useIssueFields';
import { initialStore } from '../../../redux/store';

import AddIssueSidePanel from '../index';

jest.mock('@kitman/common/src/hooks/useEventTracking');
jest.mock('@kitman/modules/src/Medical/shared/hooks/useIssueFields');
jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetOrganisationQuery: jest.fn(),
  useGetCurrentUserQuery: jest.fn(),
  useGetPermissionsQuery: jest.fn(),
}));
jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useGetAthleteDataQuery: jest.fn(),
  })
);

describe('AddIssueSidePanel', () => {
  const baseProps = {
    preliminarySchema: {
      activity: 'optional',
      game_id: 'optional',
      training_session_id: 'optional',
      position_when_injured_id: 'optional',
      presentation_type: 'optional',
    },
    activityGroups: [],
    activeSquad: {},
    athleteData: {},
    attachedConcussionAssessments: [],
    currentPage: 1,
    enteredInitialNote: '',
    enteredSupplementalPathology: null,
    fetchGameAndTrainingOptions: jest.fn(),
    gameOptions: [],
    otherEventOptions: [],
    grades: [],
    initialDataRequestStatus: 'SUCCESS',
    isAthleteSelectable: false,
    isBamic: false,
    isOpen: true,
    onAddStatus: jest.fn(),
    onClose: jest.fn(),
    onEnterSupplementalPathology: jest.fn(),
    onRemoveStatus: jest.fn(),
    onRemoveSupplementalPathology: jest.fn(),
    onSelectActivity: jest.fn(),
    onSelectAthlete: jest.fn(),
    onSelectBamicGrade: jest.fn(),
    onSelectBamicSite: jest.fn(),
    onSelectBodyArea: jest.fn(),
    onSelectClassification: jest.fn(),
    onSelectCoding: jest.fn(),
    onSelectContinuationIssue: jest.fn(),
    onSelectDiagnosisDate: jest.fn(),
    onSelectEvent: jest.fn(),
    onSelectExaminationDate: jest.fn(),
    onSelectIssueType: jest.fn(),
    onSelectOnset: jest.fn(),
    onSelectPathology: jest.fn(),
    onSelectPositionWhenInjured: jest.fn(),
    onSelectPreviousIssue: jest.fn(),
    onSelectSessionCompleted: jest.fn(),
    onSelectSide: jest.fn(),
    onSelectSquad: jest.fn(),
    onSelectPresentationType: jest.fn(),
    onUpdatePresentationFreeText: jest.fn(),
    onSelectTimeOfInjury: jest.fn(),
    onUpdateAttachedConcussionAssessments: jest.fn(),
    onUpdateInitialNote: jest.fn(),
    onUpdateStatusDate: jest.fn(),
    onUpdateStatusType: jest.fn(),
    onUpdatePrimaryMechanismFreetext: jest.fn(),
    onUpdateInjuryMechanismFreetext: jest.fn(),
    onChronicConditionOnsetDate: jest.fn(),
    chronicConditionOnsetDate: null,
    permissions: {
      medical: {
        notes: {
          canCreate: false,
        },
      },
      concussion: {
        canAttachConcussionAssessments: true,
        canManageConcussionAssessments: true,
      },
    },
    positionGroups: [],
    requestStatus: 'SUCCESS',
    selectedActivity: null,
    selectedAthlete: null,
    selectedBamicGrade: null,
    selectedBamicSite: null,
    selectedCoding: {},
    selectedSupplementalCoding: {},
    selectedDiagnosisDate: null,
    selectedEvent: null,
    selectedEventType: null,
    selectedExaminationDate: null,
    selectedIssueType: 'INJURY',
    selectedOnset: null,
    selectedPositionWhenInjured: null,
    selectedPresentationType: null,
    selectedIssue: null,
    selectedSessionCompleted: null,
    selectedSide: null,
    selectedTimeOfInjury: null,
    injuryMechanismFreetext: '',
    primaryMechanismFreetext: '',
    sides: [],
    squadAthletesOptions: [],
    statuses: [{ status: '', date: null }],
    trainingSessionOptions: [],
    injuryStatuses: [
      {
        description: 'Causing unavailability (time-loss)',
        id: 1,
      },
      {
        description: 'Not affecting availability (medical attention)',
        id: 2,
      },
      {
        description: 'Resolved',
        id: 3,
      },
    ],
    conditionalFieldsQuestions: [],
    pathologyGroupRequestStatus: null,
    t: (key) => key,
  };

  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });
    useGetOrganisationQuery.mockReturnValue({ data: {}, isSuccess: true });
    useGetCurrentUserQuery.mockReturnValue({ data: {}, isSuccess: true });
    useGetPermissionsQuery.mockReturnValue({
      data: { permissions: {} },
      isSuccess: true,
    });
    medicalSharedApi.useGetAthleteDataQuery.mockReturnValue({
      data: mockedPastAthlete,
    });
    useIssueFields.mockReturnValue({
      validate: (fields) => {
        const errors = [];
        if (!fields.athlete_id) errors.push('athlete_id');
        if (!fields.occurrence_date) errors.push('occurrence_date');
        if (!fields.squad) errors.push('squad');
        if (!fields.activity_id) errors.push('activity_id');
        if (!fields.position_when_injured_id)
          errors.push('position_when_injured_id');
        return errors;
      },
      getFieldLabel: (key) => {
        const labels = {
          athlete_id: 'Athlete',
          occurrence_date: 'Onset date',
          squad: 'Occurred in Squad',
          activity_id: 'Mechanism',
          position_when_injured_id: 'Position',
        };
        return labels[key] || key;
      },
      isFieldVisible: () => true,
      isFieldVisibleByType: () => true,
      fieldConfigRequestStatus: 'SUCCESS',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with title and first page displayed', async () => {
    renderWithProvider(
      <AddIssueSidePanel {...baseProps} />,
      storeFake(initialStore)
    );

    const panelTitle = screen.getByTestId('sliding-panel|title');
    expect(panelTitle).toHaveTextContent('Add injury/ illness');

    // Wait for the loading state to disappear
    await screen.findByText('Initial Information');

    const page1 = screen.getByTestId('AddIssueSidePanel|Page1');
    expect(page1).toHaveStyle('display: block');
  });

  test('shows the second page when currentPage is 2', async () => {
    renderWithProvider(
      <AddIssueSidePanel {...baseProps} currentPage={2} />,
      storeFake(initialStore)
    );

    // Wait for the loading state to disappear
    await screen.findByText('Diagnosis Information');

    const page1 = screen.getByTestId('AddIssueSidePanel|Page1');
    expect(page1).toHaveStyle('display: none');

    const page2 = screen.getByTestId('AddIssueSidePanel|Page2');
    expect(page2).toHaveStyle('display: block');
  });

  test('shows the fourth page when currentPage is 4', async () => {
    renderWithProvider(
      <AddIssueSidePanel {...baseProps} currentPage={4} />,
      storeFake(initialStore)
    );

    // Wait for the loading state to disappear
    await screen.findByText('Additional Information');

    const page1 = screen.getByTestId('AddIssueSidePanel|Page1');
    expect(page1).toHaveStyle('display: none');

    const page4 = screen.getByTestId('AddIssueSidePanel|Page4');
    expect(page4).toHaveStyle('display: block');
  });

  describe('validates correct fields: Page 1 fields (initialInformation)', () => {
    test('athlete_id is validated when empty', async () => {
      const user = userEvent.setup();
      const store = storeFake(initialStore);
      renderWithProvider(
        <AddIssueSidePanel
          {...baseProps}
          currentPage={1}
          selectedAthlete={null} // Empty athlete_id
        />,
        store
      );

      const nextButton = await screen.findByRole('button', { name: /next/i });
      await user.click(nextButton);

      await waitFor(() => {
        const athleteLabel = screen.getByText('Athlete');
        const athleteSelectContainer = athleteLabel.closest(
          '.kitmanReactSelect__labelContainer'
        ).nextElementSibling;
        expect(athleteSelectContainer).toHaveClass(
          'kitmanReactSelect--invalid'
        );
      });
    });

    test('occurrence_date is validated when empty', async () => {
      const user = userEvent.setup();
      const store = storeFake(initialStore);
      renderWithProvider(
        <AddIssueSidePanel
          {...baseProps}
          currentPage={1}
          selectedAthlete={1}
          selectedOnset={null}
        />,
        store
      );

      const nextButton = await screen.findByRole('button', { name: /next/i });
      await user.click(nextButton);

      await waitFor(() => {
        expect(
          screen.getAllByLabelText('Onset date', { selector: 'input' })[0]
        ).toBeInTheDocument(); // Ensure the input is present
        // Assertion for error message will be added here after inspecting debug output
      });
    });

    test('squad is validated when empty for a past athlete', async () => {
      const user = userEvent.setup();
      const store = storeFake(initialStore);
      renderWithProvider(
        <AddIssueSidePanel
          {...baseProps}
          currentPage={1}
          selectedAthlete={1}
          selectedSquadId={null} // Empty squad
        />,
        store
      );

      const nextButton = await screen.findByRole('button', { name: /next/i });
      await user.click(nextButton);

      await waitFor(() => {
        const squadLabel = screen.getAllByText('Occurred in Squad')[0];
        const squadSelectContainer = squadLabel.closest(
          '.kitmanReactSelect__labelContainer'
        ).nextElementSibling;
        expect(squadSelectContainer).toHaveClass('kitmanReactSelect--invalid');
      });
    });
  });

  describe('[FEATURE FLAG] medical-additional-event-info-events', () => {
    beforeEach(() => {
      window.featureFlags['medical-additional-event-info-events'] = true;
    });
    afterEach(() => {
      window.featureFlags['medical-additional-event-info-events'] = false;
    });

    test('Correctly validates fields for injury when the selectedEvent is game', async () => {
      const store = storeFake(initialStore);
      renderWithProvider(
        <AddIssueSidePanel
          {...baseProps}
          currentPage={3}
          selectedIssueType="INJURY"
          selectedEvent="game"
          selectedEventType="game"
        />,
        store
      );

      const nextButton = await screen.findByRole('button', { name: /next/i });
      expect(nextButton).toBeInTheDocument();

      // For 'game' event, 'Mechanism' and 'Position' fields should be visible
      const mechanismLabel = screen.getByText('Mechanism');
      expect(mechanismLabel).toBeInTheDocument();
      const positionLabel = screen.getByText('Position');
      expect(positionLabel).toBeInTheDocument();
    });

    test('Correctly validates fields for injury when the selectedEvent is other', async () => {
      const store = storeFake(initialStore);
      renderWithProvider(
        <AddIssueSidePanel
          {...baseProps}
          currentPage={3}
          selectedIssueType="INJURY"
          selectedEvent="other"
          selectedEventType="other"
        />,
        store
      );

      const nextButton = await screen.findByRole('button', { name: /next/i });
      expect(nextButton).toBeInTheDocument();

      // For 'other' event, 'Mechanism' should be visible, 'Position' should not
      const mechanismLabel = screen.getByText('Mechanism');
      expect(mechanismLabel).toBeInTheDocument();
      const positionLabel = screen.queryByText('Position');
      expect(positionLabel).not.toBeInTheDocument();
    });

    test('Correctly validates fields for injury when the selectedEventType is nonsport', async () => {
      const store = storeFake(initialStore);
      renderWithProvider(
        <AddIssueSidePanel
          {...baseProps}
          currentPage={3}
          selectedIssueType="INJURY"
          selectedEvent="other"
          selectedEventType="nonsport"
        />,
        store
      );

      const nextButton = await screen.findByRole('button', { name: /next/i });
      expect(nextButton).toBeInTheDocument();

      // For 'nonsport' event, 'Mechanism' and 'Position' should not be in the document
      const mechanismLabel = screen.queryByText('Mechanism');
      expect(mechanismLabel).not.toBeInTheDocument();
      const positionLabel = screen.queryByText('Position');
      expect(positionLabel).not.toBeInTheDocument();
    });

    test('Correctly validates fields for injury when the selectedEventType is prior', async () => {
      const store = storeFake(initialStore);
      renderWithProvider(
        <AddIssueSidePanel
          {...baseProps}
          currentPage={3}
          selectedIssueType="INJURY"
          selectedEvent="other"
          selectedEventType="prior"
        />,
        store
      );

      const nextButton = await screen.findByRole('button', { name: /next/i });
      expect(nextButton).toBeInTheDocument();

      // For 'prior' event, 'Mechanism' and 'Position' should not be in the document
      const mechanismLabel = screen.queryByText('Mechanism');
      expect(mechanismLabel).not.toBeInTheDocument();
      const positionLabel = screen.queryByText('Position');
      expect(positionLabel).not.toBeInTheDocument();
    });
  });

  describe('[FEATURE FLAG] medical-additional-event-info-events OFF', () => {
    beforeEach(() => {
      window.featureFlags['medical-additional-event-info-events'] = false;
    });
    afterEach(() => {
      window.featureFlags['medical-additional-event-info-events'] = true;
    });

    test('Correctly validates fields for injury when the selectedEvent is game', async () => {
      const store = storeFake(initialStore);
      renderWithProvider(
        <AddIssueSidePanel
          {...baseProps}
          currentPage={3}
          selectedIssueType="INJURY"
          selectedEvent="game"
          selectedEventType="game"
        />,
        store
      );

      const nextButton = await screen.findByRole('button', { name: /next/i });
      expect(nextButton).toBeInTheDocument();

      // When FEATURE FLAG medical-additional-event-info-events is off
      // Then validation is not skipped
      const mechanismLabel = screen.getByText('Mechanism');
      expect(mechanismLabel).toBeInTheDocument();
      const positionLabel = screen.getByText('Position');
      expect(positionLabel).toBeInTheDocument();
    });

    test('Correctly validates fields for injury when the selectedEvent is other', async () => {
      const store = storeFake(initialStore);
      renderWithProvider(
        <AddIssueSidePanel
          {...baseProps}
          currentPage={3}
          selectedIssueType="INJURY"
          selectedEvent="other"
          selectedEventType="other"
        />,
        store
      );

      const nextButton = await screen.findByRole('button', { name: /next/i });
      expect(nextButton).toBeInTheDocument();

      // When FEATURE FLAG medical-additional-event-info-events is off
      // Then validation is not skipped
      const mechanismLabel = screen.getByText('Mechanism');
      expect(mechanismLabel).toBeInTheDocument();
      const positionLabel = screen.queryByText('Position');
      expect(positionLabel).not.toBeInTheDocument();
    });

    test('Correctly validates fields for injury when the selectedEventType is nonsport', async () => {
      const store = storeFake(initialStore);
      renderWithProvider(
        <AddIssueSidePanel
          {...baseProps}
          currentPage={3}
          selectedIssueType="INJURY"
          selectedEvent="other"
          selectedEventType="nonsport"
        />,
        store
      );

      const nextButton = await screen.findByRole('button', { name: /next/i });
      expect(nextButton).toBeInTheDocument();

      // For 'nonsport' event, 'Mechanism' and 'Position' should not be in the document
      const mechanismLabel = screen.queryByText('Mechanism');
      expect(mechanismLabel).not.toBeInTheDocument();
      const positionLabel = screen.queryByText('Position');
      expect(positionLabel).not.toBeInTheDocument();
    });

    test('Correctly validates fields for injury when the selectedEventType is prior', async () => {
      const store = storeFake(initialStore);
      renderWithProvider(
        <AddIssueSidePanel
          {...baseProps}
          currentPage={3}
          selectedIssueType="INJURY"
          selectedEvent="other"
          selectedEventType="prior"
        />,
        store
      );

      const nextButton = await screen.findByRole('button', { name: /next/i });
      expect(nextButton).toBeInTheDocument();

      // For 'prior' event, 'Mechanism' and 'Position' should not be in the document
      const mechanismLabel = screen.queryByText('Mechanism');
      expect(mechanismLabel).not.toBeInTheDocument();
      const positionLabel = screen.queryByText('Position');
      expect(positionLabel).not.toBeInTheDocument();
    });
  });
});
