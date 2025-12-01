import { render, screen, waitFor } from '@testing-library/react';

import * as getDiagnosticResults from '../../../services/getDiagnosticResults';
import { DiagnosticResultsContextProvider, useDiagnosticResults } from '..';
import {
  mockedDiagnosticResultsContextValue,
  mockedDiagnosticRadiologyResultsContextValue,
  MockeddiagnosticResultsContextProvider,
} from '../utils/mocks';

const LabComponentTest = () => {
  const { resultBlocks } = useDiagnosticResults();

  return (
    <>
      <p>{`Result length: ${resultBlocks.results?.length}`}</p>
      <p>{`Result has order_id: ${
        resultBlocks.results[0].order_id != null &&
        resultBlocks.results[0].order_id > 0
      }`}</p>
      <p>{`Result has correct type: ${
        resultBlocks.results[0].type === 'lab'
      }`}</p>
      <p>{`Result has a result value: ${
        resultBlocks.results[0].results.length > 0
      }`}</p>
      <p>{`Result values have the same order_id as ResultBlock: ${
        resultBlocks.results[0].results[0].redox_order_id ===
        resultBlocks.results[0].order_id
      }`}</p>
      <p>{`Result value has athlete_id: ${
        resultBlocks.results[0].results[0].athlete_id === 1
      }`}</p>
    </>
  );
};

const ReportComponentTest = () => {
  const { resultBlocks } = useDiagnosticResults();

  return (
    <>
      <p>{`Result length: ${resultBlocks.results.length}`}</p>
      <p>{`Result has order_id: ${
        resultBlocks.results[0].order_id != null &&
        resultBlocks.results[0].order_id > 0
      }`}</p>
      <p>{`Result has correct type: ${
        resultBlocks.results[0].type === 'report'
      }`}</p>
      <p>{`Result has a formatted_text value: ${
        resultBlocks.results[0].results[0].formatted_text.length > 0
      }`}</p>
      <p>{`Result values have the same order_id as ResultBlock: ${
        resultBlocks.results[0].results[0].redox_order_id ===
        resultBlocks.results[0].order_id
      }`}</p>
      <p>{`Result value has athlete_id: ${
        resultBlocks.results[0].results[0].athlete_id === 1
      }`}</p>
      <p>{`formatted_text has a value for head: ${
        resultBlocks.results[0].results[0].formatted_text[0].head.length > 0
      }`}</p>
      <p>{`formatted_text has a value for body: ${
        resultBlocks.results[0].results[0].formatted_text[0].body.length > 0
      }`}</p>
    </>
  );
};

describe('DiagnosticContext', () => {
  let getDiagnosticResultsSpy;

  beforeEach(() => {
    getDiagnosticResultsSpy = jest
      .spyOn(getDiagnosticResults, 'default')
      .mockResolvedValue({});
  });

  describe('<DiagnosticResultContextProvider/>', () => {
    it('calls the correct endpoint when mounting', async () => {
      render(
        <DiagnosticResultsContextProvider diagnosticId={111}>
          <></>
        </DiagnosticResultsContextProvider>
      );

      await waitFor(() =>
        expect(getDiagnosticResultsSpy).toHaveBeenCalledWith(111)
      );
    });
  });

  describe('<DiagnosticResultContext/>', () => {
    it('sets the context correctly when result type is lab', () => {
      render(
        <MockeddiagnosticResultsContextProvider
          diagnosticResultsContext={mockedDiagnosticResultsContextValue}
        >
          <LabComponentTest />
        </MockeddiagnosticResultsContextProvider>
      );

      expect(screen.getByText('Result length: 1')).toBeInTheDocument();
      expect(screen.getByText('Result has order_id: true')).toBeInTheDocument();
      expect(
        screen.getByText('Result has correct type: true')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Result has a result value: true')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Result values have the same order_id as ResultBlock: true'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText('Result value has athlete_id: true')
      ).toBeInTheDocument();
    });

    it('sets the context correctly when result type is report(radiology)', () => {
      render(
        <MockeddiagnosticResultsContextProvider
          diagnosticResultsContext={
            mockedDiagnosticRadiologyResultsContextValue
          }
        >
          <ReportComponentTest />
        </MockeddiagnosticResultsContextProvider>
      );

      expect(screen.getByText('Result length: 1')).toBeInTheDocument();
      expect(screen.getByText('Result has order_id: true')).toBeInTheDocument();
      expect(
        screen.getByText('Result has correct type: true')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Result has a formatted_text value: true')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Result values have the same order_id as ResultBlock: true'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText('Result value has athlete_id: true')
      ).toBeInTheDocument();
      expect(
        screen.getByText('formatted_text has a value for head: true')
      ).toBeInTheDocument();
      expect(
        screen.getByText('formatted_text has a value for body: true')
      ).toBeInTheDocument();
    });
  });
});
