import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { useGetPermittedSquadsQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import {
  useGetAthleteDataQuery,
  useLazyGetAthleteDataQuery,
  useGetAncillaryEligibleRangesQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';

import InitialInformation from '../InitialInformation';

// Mock the useGetPermittedSquadsQuery hook
jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/Medical/shared/redux/services/medical'
  ),
  useGetPermittedSquadsQuery: jest.fn(),
}));

// Mock the useGetAthleteDataQuery and useLazyGetAthleteDataQuery hook
jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useGetAthleteDataQuery: jest.fn(),
    useLazyGetAthleteDataQuery: jest.fn(),
    useGetAncillaryEligibleRangesQuery: jest.fn(),
  })
);

// Mock the moment library
jest.mock('moment', () => jest.requireActual('moment'));

const props = {
  examinationDateProps: { isInvalid: false },
  issueTypeProps: {
    isVisible: true,
    selectedIssueType: 'INJURY',
    fieldLabel: 'Type',
    onSelectIssueType: jest.fn(),
  },
  athleteIDProps: {
    isVisible: true,
    squadAthletesOptions: [],
    onAthleteChange: jest.fn(),
    fieldLabel: 'Athlete',
    value: 111,
  },
  previousIssueProps: {
    value: null,
    isVisible: true,
    fieldLabel: 'Previous injury',
    athletePreviousIssues: [],
    onSelectPreviousIssue: jest.fn(),
    isLoading: false,
  },
  continuationIssueProps: {
    value: null,
    fieldLabel: 'Select injury/ illness',
    athletePreviousOrganisationIssues: [],
    onSelectContinuationIssue: jest.fn(),
    isLoading: false,
  },
  occurrenceDateProps: {
    selectedDiagnosisDate: '2022-09-13T10:12:51.894Z',
    onSelectOccurrenceDate: jest.fn(),
    isVisible: true,
    fieldLabel: 'Onset date',
  },
  issueTitleProps: {
    isFocused: false,
    setIsFocused: jest.fn(),
    onSetTitle: jest.fn(),
    value: 'Title',
  },
  noteEditorProps: {
    onUpdateNote: jest.fn(),
    value: '<p>Note</p>',
  },
  selectedAthlete: null,
  issueIsARecurrence: false,
  permissions: {
    medical: {
      notes: {
        canCreate: false,
      },
    },
    concussion: {},
  },
  reportedDateProps: {
    selectedDiagnosisDate: '2022-09-13T10:12:51.894Z',
    onSelectReportedDate: jest.fn(),
    isVisible: true,
    fieldLabel: 'Reported date',
  },
  chronicIssuesProps: {
    onSelectChronicIssue: jest.fn(),
    chronicIssues: [],
    selectedChronicIssue: null,
    onChronicConditionOnsetDate: jest.fn(),
    chronicConditionOnsetDate: null,
  },
  squadProps: {
    squadId: 10,
  },
  isPastAthlete: false,
  t: i18nextTranslateStub(),
};

const mockedProps = {
  isPastAthlete: true,
  permissions: {
    ...props.permissions,
    medical: {
      notes: {
        canCreate: true,
      },
    },
  },
  occurrenceDateProps: {
    earliestPermittedOnsetDate: '2022-12-15T10:12:51.894Z',
    maxPermittedOnsetDate: '2022-12-15T10:12:51.894Z',
    onSelectOccurrenceDate: jest.fn(),
    isVisible: true,
    fieldLabel: 'Onset date',
  },
};

const renderTestComponent = (additionalProps) => {
  render(
    <LocalizationProvider>
      <MockedOrganisationContextProvider
        organisationContext={{
          organisation: { coding_system_key: codingSystemKeys.OSICS_10 },
        }}
      >
        <InitialInformation {...props} {...mockedProps} {...additionalProps} />
      </MockedOrganisationContextProvider>
    </LocalizationProvider>
  );
};

const getInputFields = () => {
  return screen.getAllByPlaceholderText('MM/DD/YYYY');
};

function checkDatesInRangeAreEnabled(range, allDatesInMonth) {
  const startIdx = range.start - 1;
  const endIdx = range.end;

  for (let i = startIdx; i < endIdx; i++) {
    expect(allDatesInMonth[i]).toBeEnabled();
  }
}

function checkDatesInRangeAreDisabled(range, allDatesInMonth) {
  const startIdx = range.start - 1;
  const endIdx = range.end;

  for (let i = startIdx; i < endIdx; i++) {
    expect(allDatesInMonth[i]).toHaveAttribute('disabled');
    expect(allDatesInMonth[i]).toBeDisabled();
  }
}

describe('<InitialInformation />', () => {
  // Player movement flags
  beforeEach(() => {
    window.featureFlags['player-movement-entity-injury'] = true;
    window.featureFlags['player-movement-entity-illness'] = true;

    useGetAncillaryEligibleRangesQuery.mockReturnValue({
      data: [],
    });
  });
  afterEach(() => {
    window.featureFlags['player-movement-entity-injury'] = false;
    window.featureFlags['player-movement-entity-illness'] = false;
  });

  describe('MovementAwareDatePicker with FF ON', () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    beforeEach(() => {
      const fakeDate = new Date('2024-01-31T18:00:00Z'); // UTC FORMAT
      jest.useFakeTimers();
      jest.setSystemTime(fakeDate);

      window.featureFlags['nfl-injury-flow-fields'] = true;
      window.featureFlags['player-movement-aware-datepicker'] = true;
    });
    afterEach(() => {
      jest.useRealTimers();
      jest.clearAllMocks();
      window.featureFlags['nfl-injury-flow-fields'] = false;
      window.featureFlags['player-movement-aware-datepicker'] = false;
    });

    useGetAthleteDataQuery.mockImplementation((athleteId) => {
      if (athleteId === 111) {
        return {
          data: {
            constraints: {
              active_periods: [{ start: '2024-01-15', end: '2024-01-20' }],
            },
          },
        };
      }
      return { data: {} };
    });
    useLazyGetAthleteDataQuery.mockReturnValue([
      jest.fn(),
      {
        data: {},
        isFetching: false,
      },
    ]);
    useGetPermittedSquadsQuery.mockReturnValue({
      data: [],
    });

    it('renders the new datepicker', async () => {
      renderTestComponent();

      const movementAwareDateinputs = getInputFields();

      expect(movementAwareDateinputs).toHaveLength(2);
    });

    it('Onset date: it correctly sets the max date and min date', async () => {
      expect.hasAssertions();

      renderTestComponent();

      const onsetDateinput = getInputFields()[0];
      let allDatesInMonth;

      // open calendar view
      await user.click(onsetDateinput);
      await waitFor(async () => {
        const calendar = screen.getByRole('grid');
        allDatesInMonth = Array.from(
          calendar.querySelectorAll('button[role="gridcell"]')
        );
        // remove 31st Dec
        allDatesInMonth.shift();
        // remove 1st, 2nd and 3rd Feb
        allDatesInMonth.splice(allDatesInMonth.length - 3, 3);

        // Dates from BE that are fetched based on athleteID passed via props should be the only dates enabled
        checkDatesInRangeAreEnabled({ start: 15, end: 20 }, allDatesInMonth);
      });
      // All other dates should be disabled
      checkDatesInRangeAreDisabled({ start: 1, end: 14 }, allDatesInMonth);
      checkDatesInRangeAreDisabled(
        { start: 21, end: allDatesInMonth.length },
        allDatesInMonth
      );
    });

    it('Onset date: it does not set the max date and min date when no constraints for athlete in BE', async () => {
      expect.hasAssertions();

      renderTestComponent({ athleteIDProps: { value: 123 } });

      const onsetDateinput = getInputFields()[0];
      let allDatesInMonth;

      // open calendar view
      await user.click(onsetDateinput);
      await waitFor(async () => {
        const calendar = screen.getByRole('grid');
        allDatesInMonth = calendar.querySelectorAll('button[role="gridcell"]');

        checkDatesInRangeAreDisabled(
          { start: 1, end: allDatesInMonth.length },
          allDatesInMonth
        );
      });
    });

    it('Reported date: it correctly sets the max date and min date', async () => {
      expect.hasAssertions();

      renderTestComponent({
        occurrenceDateProps: {
          ...mockedProps.occurrenceDateProps,
          selectedDiagnosisDate: null,
        },
      });

      const reportedDateinput = getInputFields()[1];
      let allDatesInMonth;

      // open calendar view
      await user.click(reportedDateinput);
      await waitFor(async () => {
        const calendar = screen.getByRole('grid');
        allDatesInMonth = Array.from(
          calendar.querySelectorAll('button[role="gridcell"]')
        );
        // remove 31st Dec
        allDatesInMonth.shift();
        // remove 1st, 2nd and 3rd Feb
        allDatesInMonth.splice(allDatesInMonth.length - 3, 3);

        // Dates from BE that are fecthed based on athleteID passed via props should be the only dates enabled
        checkDatesInRangeAreEnabled({ start: 15, end: 20 }, allDatesInMonth);
      });
      // All other dates should be disabled
      checkDatesInRangeAreDisabled({ start: 1, end: 14 }, allDatesInMonth);
      checkDatesInRangeAreDisabled(
        { start: 21, end: allDatesInMonth.length },
        allDatesInMonth
      );
    });

    it('Reported date: it does not set the max date and min date when no constraints for athlete in BE', async () => {
      expect.hasAssertions();

      renderTestComponent({ athleteIDProps: { value: 123 } });

      const reportedDateinput = getInputFields()[1];
      let allDatesInMonth;

      // open calendar view
      await user.click(reportedDateinput);
      await waitFor(async () => {
        const calendar = screen.getByRole('grid');
        allDatesInMonth = calendar.querySelectorAll('button[role="gridcell"]');

        checkDatesInRangeAreDisabled(
          { start: 1, end: allDatesInMonth.length },
          allDatesInMonth
        );
      });
    });
  });

  describe('MovementAwareDatePicker with FF OFF', () => {
    beforeEach(() => {
      const fakeDate = new Date('2024-01-31T18:00:00Z'); // UTC FORMAT
      jest.useFakeTimers();
      jest.setSystemTime(fakeDate);

      window.featureFlags['nfl-injury-flow-fields'] = true;
      window.featureFlags['player-movement-aware-datepicker'] = false;
    });
    afterEach(() => {
      jest.useRealTimers();
      jest.clearAllMocks();
      window.featureFlags['nfl-injury-flow-fields'] = false;
    });

    useGetAthleteDataQuery.mockImplementation((athleteId) => {
      if (athleteId === 111) {
        return {
          data: {
            constraints: {
              active_periods: [{ start: '2024-01-15', end: '2024-01-20' }],
            },
          },
        };
      }
      return { data: {} };
    });

    it('does not render the new datepicker', async () => {
      renderTestComponent();

      const onsetDateinput = screen.queryByPlaceholderText('MM/DD/YYYY');

      expect(onsetDateinput).not.toBeInTheDocument();
    });
  });

  describe('squad selector', () => {
    it('renders correctly', () => {
      renderTestComponent();

      const squadSelector = screen.getByLabelText('Occurred in Squad');

      expect(squadSelector).toBeInTheDocument();
    });

    it('hides squad selector when issue is chronic condition', async () => {
      renderTestComponent({
        ...props,
        issueTypeProps: {
          ...props.issueTypeProps,
          selectedIssueType: 'CHRONIC_INJURY',
        },
      });
      await waitFor(() => {
        const squadSelector = screen.queryByLabelText('Occurred in Squad');
        expect(squadSelector).not.toBeInTheDocument();
      });
    });
  });

  describe('[feature-flag] pm-editing-examination-and-date-of-injury', () => {
    beforeEach(() => {
      window.featureFlags['pm-editing-examination-and-date-of-injury'] = true;
      window.featureFlags['player-movement-entity-injury'] = true;
      window.featureFlags['player-movement-entity-illness'] = true;
      window.featureFlags['player-movement-aware-datepicker'] = true;
    });
    afterEach(() => {
      window.featureFlags = {};
    });

    it('renders IssueExaminationDatePicker when flag is true', () => {
      window.featureFlags['pm-editing-examination-and-date-of-injury'] = true;
      renderTestComponent();

      const examinationDatePicker = screen.getByTestId(
        'IssueExaminationDatePicker'
      );
      expect(examinationDatePicker).toBeInTheDocument();
    });

    it('does not render IssueExaminationDatePicker when flag is false', () => {
      window.featureFlags['pm-editing-examination-and-date-of-injury'] = false;
      renderTestComponent();

      const examinationDatePicker = screen.queryByText('Examination Date');
      expect(examinationDatePicker).not.toBeInTheDocument();
    });
  });
});
