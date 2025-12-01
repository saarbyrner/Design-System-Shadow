import { render, screen, waitFor } from '@testing-library/react';
import selectEvent from 'react-select-event';
import { setI18n } from 'react-i18next';

import i18n from '@kitman/common/src/utils/i18n';
import { renderWithUserEventSetup } from '@kitman/common/src/utils/test_utils';
import {
  mockedIssueContextValue,
  MockedIssueContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/IssueContext/utils/mocks';
import { saveIssue } from '@kitman/services';
import useAthleteAssessments from '@kitman/modules/src/Medical/shared/hooks/useAthleteAssessments';

import { AddConcussionAssessmentSidePanelTranslated } from '../index';
import mockedSquadAthletes from './mockedSquadAthletes';

jest.mock('@kitman/services', () => ({
  ...jest.requireActual('@kitman/services'),
  saveIssue: jest.fn(),
}));

const mockFetchAthleteIssues = jest.fn().mockResolvedValue();

jest.mock(
  '@kitman/modules/src/Medical/shared/hooks/useEnrichedAthletesIssues',
  () => ({
    __esModule: true,
    default: jest.fn(() => ({
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
      fetchAthleteIssues: mockFetchAthleteIssues,
    })),
  })
);

jest.mock(
  '@kitman/modules/src/Medical/shared/hooks/useAthleteAssessments',
  () => ({
    __esModule: true,
    default: jest.fn(() => ({
      athleteAssessmentOptions: [],
      fetchAthleteAssessments: jest.fn().mockResolvedValue(),
    })),
  })
);

setI18n(i18n);

const props = {
  isOpen: true,
  isAthleteSelectable: true,
  squadAthletes: mockedSquadAthletes,
  athleteId: 2,
  showProgress: true,
  onClose: jest.fn(),
  initialDataRequestStatus: null,
  onAssessmentAdded: jest.fn(),
  t: (key) => key,
};

const propsWithoutAthlete = {
  ...props,
  athleteId: null,
};

describe('<AddConcussionAssessmentSidePanel />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the panel title without the athlete name', () => {
    render(
      <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
        <AddConcussionAssessmentSidePanelTranslated {...propsWithoutAthlete} />
      </MockedIssueContextProvider>
    );
    const title = screen.getByText('Add concussion assessment');

    expect(title).toBeInTheDocument();
  });

  it('renders the correct content', () => {
    render(
      <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
        <AddConcussionAssessmentSidePanelTranslated {...props} />
      </MockedIssueContextProvider>
    );

    expect(
      screen.getByTestId('AddConcussionAssessmentSidePanel|ProgressTracker')
    ).toBeInTheDocument();
    expect(screen.getByText('Assessment')).toBeInTheDocument();
    expect(screen.getByLabelText('Athlete')).toBeInTheDocument();
    expect(screen.getByLabelText('Attach report(s)')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Associated injury/ illness')
    ).toBeInTheDocument();
  });

  it('calls the correct function when clicking the close button', async () => {
    const { user } = renderWithUserEventSetup(
      <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
        <AddConcussionAssessmentSidePanelTranslated {...props} />
      </MockedIssueContextProvider>
    );

    const closeButton = screen.getByTestId('sliding-panel|close-button');
    await user.click(closeButton);

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  describe('when mounting AddConcussionAssessmentSidePanel', () => {
    it('renders the panel title with the athlete name', async () => {
      render(
        <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
          <AddConcussionAssessmentSidePanelTranslated {...props} />
        </MockedIssueContextProvider>
      );
      const title = await screen.findByText(
        'Add concussion assessment - Athlete 2 Name'
      );

      expect(title).toBeInTheDocument();
    });

    it('shows an error message when the initial request fails', () => {
      render(
        <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
          <AddConcussionAssessmentSidePanelTranslated
            {...props}
            initialDataRequestStatus="FAILURE"
          />
        </MockedIssueContextProvider>
      );

      expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
    });

    describe('when selecting a player and the resulting requests succeed', () => {
      it('populates the associated issues selector with only concussion options', async () => {
        renderWithUserEventSetup(
          <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
            <AddConcussionAssessmentSidePanelTranslated {...props} />
          </MockedIssueContextProvider>
        );

        const athleteSelect = screen.getByLabelText('Athlete');
        await selectEvent.select(
          athleteSelect,
          mockedSquadAthletes[0].options[1].label
        );

        const associatedInjuriesSelect = screen.getByLabelText(
          'Associated injury/ illness'
        );
        expect(associatedInjuriesSelect).toBeInTheDocument();
      });

      it('populates the report selector with the correct options', async () => {
        renderWithUserEventSetup(
          <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
            <AddConcussionAssessmentSidePanelTranslated {...props} />
          </MockedIssueContextProvider>
        );

        const athleteSelect = screen.getByLabelText('Athlete');
        await selectEvent.select(
          athleteSelect,
          mockedSquadAthletes[0].options[1].label
        );

        const reportSelect = screen.getByLabelText('Attach report(s)');
        expect(reportSelect).toBeInTheDocument();
      });
    });

    describe('when selecting a player and the request fails', () => {
      it('shows an error message when the request fails', async () => {
        useAthleteAssessments.mockReturnValue({
          athleteAssessmentOptions: [
            { label: 'Return to play Jun 07, 2022', value: 5 },
          ],
          fetchAthleteAssessments: jest.fn().mockResolvedValue(),
        });
        saveIssue.mockImplementationOnce(() =>
          Promise.reject(new Error('Request failed'))
        );
        const { user } = renderWithUserEventSetup(
          <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
            <AddConcussionAssessmentSidePanelTranslated {...props} />
          </MockedIssueContextProvider>
        );

        const athleteSelect = screen.getByLabelText('Athlete');
        await selectEvent.select(
          athleteSelect,
          mockedSquadAthletes[0].options[1].label
        );

        const reportSelect = screen.getByLabelText('Attach report(s)');
        await selectEvent.openMenu(reportSelect);
        const reportOption = await screen.findByText(
          'Return to play Jun 07, 2022'
        );
        await user.click(reportOption);

        const saveButton = screen.getByRole('button', { name: 'Save' });
        await user.click(saveButton);

        expect(
          await screen.findByTestId('AppStatus-error')
        ).toBeInTheDocument();
      });
    });

    describe('when saving without setting the required fields', () => {
      it('requires a report to be selected', async () => {
        saveIssue.mockResolvedValue({}); // Prevent ".then is not a function" error
        const { user } = renderWithUserEventSetup(
          <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
            <AddConcussionAssessmentSidePanelTranslated {...props} />
          </MockedIssueContextProvider>
        );

        const saveButton = screen.getByRole('button', { name: 'Save' });
        await user.click(saveButton);

        await waitFor(() => {
          const reportsSelect = screen.getByLabelText('Attach report(s)');
          expect(reportsSelect.closest('.kitmanReactSelect')).toHaveClass(
            'kitmanReactSelect--invalid'
          );
        });
      });

      it('requires an athlete be selected', async () => {
        saveIssue.mockResolvedValue({}); // Prevent ".then is not a function" error
        const { user } = renderWithUserEventSetup(
          <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
            <AddConcussionAssessmentSidePanelTranslated
              {...propsWithoutAthlete}
              isAthleteSelectable
            />
          </MockedIssueContextProvider>
        );

        const saveButton = screen.getByRole('button', { name: 'Save' });
        await user.click(saveButton);

        await waitFor(() => {
          const athleteSelect = screen.getByLabelText('Athlete');
          expect(athleteSelect.closest('.kitmanReactSelect')).toHaveClass(
            'kitmanReactSelect--invalid'
          );

          const reportsSelect = screen.getByLabelText('Attach report(s)');
          expect(reportsSelect.closest('.kitmanReactSelect')).toHaveClass(
            'kitmanReactSelect--invalid'
          );
        });
      });
    });

    describe('saving an concussion assessment', () => {
      it('saves the assessment when clicking the save button', async () => {
        useAthleteAssessments.mockReturnValue({
          athleteAssessmentOptions: [
            { label: 'Return to play Jun 07, 2022', value: 5 },
          ],
          fetchAthleteAssessments: jest.fn().mockResolvedValue(),
        });
        saveIssue.mockResolvedValueOnce({ id: 3, concussion_assessments: [5] });

        const { user } = renderWithUserEventSetup(
          <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
            <AddConcussionAssessmentSidePanelTranslated {...props} />
          </MockedIssueContextProvider>
        );

        const athleteSelect = screen.getByLabelText('Athlete');
        await selectEvent.select(
          athleteSelect,
          mockedSquadAthletes[0].options[1].label
        );

        const reportsSelect = screen.getByLabelText('Attach report(s)');

        reportsSelect.focus();
        await user.keyboard('{ArrowDown}');

        // Press Enter to confirm the selection
        await user.keyboard('{Enter}');

        const saveButton = screen.getByRole('button', { name: 'Save' });
        await user.click(saveButton);

        await waitFor(() => {
          expect(props.onAssessmentAdded).toHaveBeenCalledTimes(1);
        });

        expect(saveIssue).toHaveBeenCalledWith(
          'Injury',
          mockedIssueContextValue.issue,
          { concussion_assessments: [5] }
        );

        expect(props.onClose).toHaveBeenCalledTimes(1);
      });
    });

    it('calls fetchAthleteIssues with the correct parameters when the athlete is changed', async () => {
      renderWithUserEventSetup(
        <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
          <AddConcussionAssessmentSidePanelTranslated {...props} />
        </MockedIssueContextProvider>
      );

      const athleteSelect = screen.getByLabelText('Athlete');
      await selectEvent.select(
        athleteSelect,
        mockedSquadAthletes[0].options[1].label
      );

      expect(mockFetchAthleteIssues).toHaveBeenCalledWith({
        selectedAthleteId: 2,
        useOccurrenceIdValue: true,
        includeDetailedIssue: true,
        issueFilter: expect.any(Function),
        includeIssue: true,
        includeGrouped: true,
      });
    });
  });
});
