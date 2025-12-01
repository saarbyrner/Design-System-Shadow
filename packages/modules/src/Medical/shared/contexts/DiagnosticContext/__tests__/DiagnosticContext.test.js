import { render, screen, waitFor } from '@testing-library/react';
import { data as mockedDiagnostics } from '@kitman/services/src/mocks/handlers/medical/getDiagnostics';
import getCurrentDiagnostic from '../../../services/getCurrentDiagnostic';
import {
  DiagnosticContextProvider,
  useDiagnostic,
} from '..';
import {
  mockedDiagnosticContextValue,
  MockedDiagnosticContextProvider,
} from '../utils/mocks';

jest.mock('../../../services/getCurrentDiagnostic');

const TestingComponent = () => {
  const { diagnostic } = useDiagnostic();

  if (!diagnostic || Object.keys(diagnostic).length === 0) {
    return null;
  }

  const { id, type } = diagnostic;
  const date = diagnostic.diagnostic_date;
  const fullname = diagnostic?.created_by?.fullname;
  const linkedIssue = diagnostic.issue_occurrences
    ? diagnostic.issue_occurrences[0].full_pathology
    : '';
  return (
    <>
      <p>{`Diagnostic ID: ${id}`}</p>
      <p>{`Type: ${type}`}</p>
      <p>{`Date: ${date}`}</p>
      <p>{`Created by: ${fullname}`}</p>
      <p>{`Linked issue: ${linkedIssue}`}</p>
    </>
  );
};

describe('DiagnosticContext', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('<DiagnosticContextProvider/>', () => {
    it('calls the correct endpoint when mounting', async () => {
      getCurrentDiagnostic.mockResolvedValue(mockedDiagnostics);
      render(
        <DiagnosticContextProvider athleteId={1} diagnosticId={1}>
          <TestingComponent />
        </DiagnosticContextProvider>
      );

      await waitFor(() => {
        expect(getCurrentDiagnostic).toHaveBeenCalledWith(1, 1);
      });
    });
  });

  describe('<DiagnosticContext/>', () => {
    it('sets the context correctly', () => {
      // We need to replace the sinon.spy with jest.fn() in the mock utility
      const mockedContext = {
        ...mockedDiagnosticContextValue,
        updateIssue: jest.fn(),
      };

      render(
        <MockedDiagnosticContextProvider
          diagnosticContext={mockedContext}
        >
          <TestingComponent />
        </MockedDiagnosticContextProvider>
      );

      expect(screen.getByText('Diagnostic ID: 168637')).toBeInTheDocument();
      expect(screen.getByText('Type: 3D Analysis')).toBeInTheDocument();
      expect(screen.getByText('Date: 2022-05-15T23:00:00Z')).toBeInTheDocument();
      expect(
        screen.getByText('Created by: Greg Levine-Rozenvayn')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Linked issue: Adductor strain [Right]')
      ).toBeInTheDocument();
    });
  });
});
