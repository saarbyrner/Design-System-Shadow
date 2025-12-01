import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import moment from 'moment-timezone';
import {
  mockedDiagnosticContextValue,
  MockedDiagnosticContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/DiagnosticContext/utils/mocks';
import { mockedDiagnosticResultsContextValue } from '@kitman/modules/src/Medical/shared/contexts/DiagnosticResultsContext/utils/mocks';
import LabReport from '../LabReport';

describe('<LabReport />', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  const props = {
    t: i18nextTranslateStub(),
  };

  it('renders the correct headings when completed_at is empty', async () => {
    render(
      <MockedDiagnosticContextProvider
        diagnosticContext={mockedDiagnosticContextValue}
      >
        <LabReport
          {...props}
          resultBlocks={
            mockedDiagnosticResultsContextValue.resultBlocks.results[0]
          }
        />
      </MockedDiagnosticContextProvider>
    );

    const heading = screen.getAllByRole('heading', { level: 2 })[0];
    expect(heading).toHaveTextContent('Results');

    const checkBox = screen.getByRole('checkbox');
    expect(checkBox).toBeInTheDocument();

    const resultsTable = screen.getByRole('table');
    expect(resultsTable).toBeInTheDocument();

    const resultsTableRow = await screen.findAllByRole('rowgroup');
    expect(resultsTableRow.length).toBe(1);

    const resultsTableColumns = await screen.findAllByRole('columnheader');
    expect(resultsTableColumns.length).toBe(7);
    expect(resultsTableColumns[0]).toHaveTextContent('Test name');
    expect(resultsTableColumns[1]).toHaveTextContent('Status');
    expect(resultsTableColumns[2]).toHaveTextContent('Result');
    expect(resultsTableColumns[3]).toHaveTextContent('Flag');
    expect(resultsTableColumns[4]).toHaveTextContent('Units');
    expect(resultsTableColumns[5]).toHaveTextContent('Reference interval');
    expect(resultsTableColumns[6]).toHaveTextContent('Comment');

    const resultsTableCells = await screen.findAllByRole('cell');
    expect(resultsTableCells.length).toBe(14);
  });

  it('renders the correct headings & table data when completed_at date is populated', async () => {
    render(
      <MockedDiagnosticContextProvider
        diagnosticContext={mockedDiagnosticContextValue}
      >
        <LabReport
          {...props}
          resultBlocks={{
            ...mockedDiagnosticResultsContextValue.resultBlocks.results[0],
            completed_at: '2023-05-06T00:00:00+01:00',
          }}
        />
      </MockedDiagnosticContextProvider>
    );

    const heading = screen.getAllByRole('heading', { level: 2 })[0];
    expect(heading).toHaveTextContent('Results - 05/05/2023 11:00 pm');

    const checkBox = screen.getByRole('checkbox');
    expect(checkBox).toBeInTheDocument();

    const resultsTable = screen.getByRole('table');
    expect(resultsTable).toBeInTheDocument();

    const resultsTableRow = await screen.findAllByRole('rowgroup');
    expect(resultsTableRow.length).toBe(1);

    const resultsTableColumns = await screen.findAllByRole('columnheader');
    expect(resultsTableColumns.length).toBe(7);
    expect(resultsTableColumns[0]).toHaveTextContent('Test name');
    expect(resultsTableColumns[1]).toHaveTextContent('Status');
    expect(resultsTableColumns[2]).toHaveTextContent('Result');
    expect(resultsTableColumns[3]).toHaveTextContent('Flag');
    expect(resultsTableColumns[4]).toHaveTextContent('Units');
    expect(resultsTableColumns[5]).toHaveTextContent('Reference interval');
    expect(resultsTableColumns[6]).toHaveTextContent('Comment');

    const resultsTableCells = await screen.findAllByRole('cell');
    expect(resultsTableCells.length).toBe(14);

    expect(resultsTableCells[0]).toHaveTextContent('G-6-PD, QN, RBC');
    expect(resultsTableCells[1]).toHaveTextContent('Final');
    expect(resultsTableCells[2]).toHaveTextContent('260');
    expect(resultsTableCells[3]).toHaveTextContent('abnormal');
    expect(resultsTableCells[4]).toHaveTextContent('U/10E12 RBC');
    expect(resultsTableCells[5]).toHaveTextContent('127-427');
  });

  it('renders <PatientNotes/> when notes are present', async () => {
    render(
      <MockedDiagnosticContextProvider
        diagnosticContext={mockedDiagnosticContextValue}
      >
        <LabReport
          {...props}
          resultBlocks={{
            ...mockedDiagnosticResultsContextValue.resultBlocks.results[0],
            patient_notes: [
              { body: 'A small sample note' },
              { body: 'A note to be noted. Second item of note content' },
            ],
          }}
        />
      </MockedDiagnosticContextProvider>
    );

    const heading = screen.getByRole('heading', {
      name: 'Patient Comments',
      level: 2,
    });
    expect(heading).toHaveTextContent('Patient Comments');
    expect(screen.getByText('A small sample note')).toBeInTheDocument();
    expect(
      screen.getByText('A note to be noted. Second item of note content')
    ).toBeInTheDocument();
  });

  it('does not render <PatientNotes/> when notes are empty', async () => {
    render(
      <MockedDiagnosticContextProvider
        diagnosticContext={mockedDiagnosticContextValue}
      >
        <LabReport
          {...props}
          resultBlocks={{
            ...mockedDiagnosticResultsContextValue.resultBlocks.results[0],
            patient_notes: [],
          }}
        />
      </MockedDiagnosticContextProvider>
    );

    const heading = screen.queryByRole('heading', {
      name: 'Patient Comments',
      level: 2,
    });
    expect(heading).not.toBeInTheDocument();

    expect(
      screen.queryByText('A note to be noted. Second item of note content')
    ).not.toBeInTheDocument();
  });
});
