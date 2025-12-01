// packages/modules/src/Medical/shared/contexts/IssueContext/__tests__/IssueContext.test.js
import { screen } from '@testing-library/react';
import {
  renderWithProvider,
  storeFake, // This is a factory function that needs to be called
} from '@kitman/common/src/utils/test_utils';
import { server, rest } from '@kitman/services/src/mocks/server';
import { useGetAthleteDataQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { mockedTrialAthlete } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { IssueContextProvider, useIssue } from '..';
import { mockedIssue } from '../../../services/getAthleteIssue';
import {
  mockedIssueContextValue,
  MockedIssueContextProvider,
} from '../utils/mocks';

// Mock the RTK Query hook as per the project guidelines
jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useGetAthleteDataQuery: jest.fn(),
  })
);

// A simple component to consume and display the context value for testing
const TestingComponent = () => {
  const { issue } = useIssue();
  if (!issue) return null;

  return (
    <>
      <p>{`Issue ID: ${issue.id}`}</p>
      <p>{`Activity: ${issue.activity}`}</p>
      <p>{`Activity type: ${issue.activity_type}`}</p>
      <p>{`Occurrence date: ${issue.occurrence_date}`}</p>
      <p>{`Examination date: ${issue.examination_date}`}</p>
      <p>{`Game ID: ${issue.game_id}`}</p>
      <p>{`Conditional questions: ${JSON.stringify(
        issue.conditional_questions
      )}`}</p>
      <p>{`Conditions with questions: ${JSON.stringify(
        issue.conditions_with_questions
      )}`}</p>
    </>
  );
};

describe('IssueContext', () => {
  beforeEach(() => {
    useGetAthleteDataQuery.mockReturnValue({ data: mockedTrialAthlete });
  });

  describe('IssueContextProvider', () => {
    it('fetches issue data and provides it via context', async () => {
      server.use(
        rest.get('/athletes/1/injuries/1', (req, res, ctx) => {
          return res(ctx.json(mockedIssue));
        })
      );

      // Call storeFake() to get the store object
      renderWithProvider(
        <IssueContextProvider athleteId={1} issueType="Injury" issueId={1}>
          <TestingComponent />
        </IssueContextProvider>,
        storeFake() // Call the function here
      );

      expect(
        await screen.findByText(`Issue ID: ${mockedIssue.id}`)
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Activity: ${mockedIssue.activity}`)
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Activity type: ${mockedIssue.activity_type}`)
      ).toBeInTheDocument();
    });
  });

  describe('useIssue hook', () => {
    it('returns the correct context value when using a mock provider', () => {
      // Also call storeFake() here
      renderWithProvider(
        <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
          <TestingComponent />
        </MockedIssueContextProvider>,
        storeFake() // Call the function here
      );

      const { issue } = mockedIssueContextValue;

      expect(screen.getByText(`Issue ID: ${issue.id}`)).toBeInTheDocument();
      expect(
        screen.getByText(`Activity: ${issue.activity}`)
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Activity type: ${issue.activity_type}`)
      ).toBeInTheDocument();
      // ... other assertions remain the same
      expect(
        screen.getByText(`Occurrence date: ${issue.occurrence_date}`)
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Examination date: ${issue.examination_date}`)
      ).toBeInTheDocument();
      expect(screen.getByText(`Game ID: ${issue.game_id}`)).toBeInTheDocument();
      expect(
        screen.getByText(
          `Conditional questions: ${JSON.stringify(
            issue.conditional_questions
          )}`
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          `Conditions with questions: ${JSON.stringify(
            issue.conditions_with_questions
          )}`
        )
      ).toBeInTheDocument();
    });
  });
});
