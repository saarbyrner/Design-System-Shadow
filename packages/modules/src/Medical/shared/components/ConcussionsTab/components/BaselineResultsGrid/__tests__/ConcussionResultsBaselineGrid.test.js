import { render, screen, within } from '@testing-library/react';
import {
  concussionBaselinesData,
  rosterConcussionBaselinesData,
} from '@kitman/services/src/mocks/handlers/medical/getConcussionFormAnswersSetsList';
import getConcussionFormAnswersSetsList from '@kitman/services/src/services/medical/getConcussionFormAnswersSetsList';
import ConcussionResultsBaseline from '../index';
import getConcussionTabTableHeaders from '../../../getTableHeaders';

jest.mock(
  '@kitman/services/src/services/medical/getConcussionFormAnswersSetsList'
);

describe('<BaselineResultsGrid athleteView />', () => {
  const athleteId = 1234;
  const props = {
    tableHeaders: getConcussionTabTableHeaders({ athleteId }).baselineHeaders,
    athleteId,
    t: (t) => t,
  };

  beforeEach(() => {
    getConcussionFormAnswersSetsList.mockResolvedValue(concussionBaselinesData);
  });

  it('should render', async () => {
    render(<ConcussionResultsBaseline {...props} />);
    expect(await screen.findByTestId('baselineList')).toBeInTheDocument();
  });

  it('should render data grid', async () => {
    render(<ConcussionResultsBaseline {...props} />);
    const baselineList = await screen.findByTestId('baselineList');
    const dataGrid = within(baselineList).getByRole('grid');
    expect(dataGrid).toBeInTheDocument();
  });

  it('should render the correct columns and rows', async () => {
    render(<ConcussionResultsBaseline {...props} />);
    const baselineList = await screen.findByTestId('baselineList');
    const dataGrid = within(baselineList).getByRole('grid');
    expect(dataGrid).toBeInTheDocument();

    const columnHeaders = within(dataGrid).getAllByRole('columnheader');
    expect(columnHeaders).toHaveLength(2);

    const rows = within(dataGrid).getAllByRole('row');
    // The first row is the header row
    expect(rows).toHaveLength(5);
  });

  it('should render the correct content with athleteId', async () => {
    render(<ConcussionResultsBaseline {...props} />);
    const baselineList = await screen.findByTestId('baselineList');
    const dataGrid = within(baselineList).getByRole('grid');
    expect(dataGrid).toBeInTheDocument();

    expect(screen.getByText('King Devick')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getAllByText('Near Point of Convergence')).toHaveLength(2);
    expect(screen.getAllByText('Outstanding')).toHaveLength(3);
    expect(
      screen.getByText('Baseline (Neurological Section Optional)')
    ).toBeInTheDocument();
  });
});

describe('<BaselineResultsGrid rosterView />', () => {
  const concussionHeaders = getConcussionTabTableHeaders({});
  const rosterHeaders = concussionHeaders.baselineHeadersRosterView;
  rosterHeaders.push({
    key: 'king_devick',
    name: 'King Devick',
    formatter: concussionHeaders.baselineStatusFormatter,
  });

  const props = {
    tableHeaders: rosterHeaders,
    t: (t) => t,
  };

  beforeEach(() => {
    getConcussionFormAnswersSetsList.mockResolvedValue(
      rosterConcussionBaselinesData
    );
  });

  it('should render', async () => {
    render(<ConcussionResultsBaseline {...props} />);
    expect(await screen.findByTestId('baselineList')).toBeInTheDocument();
  });

  it('should render the correct columns and rows when no athleteId provided', async () => {
    render(<ConcussionResultsBaseline {...props} />);
    const baselineList = await screen.findByTestId('baselineList');
    const dataGrid = within(baselineList).getByRole('grid');
    expect(dataGrid).toBeInTheDocument();

    const columnHeaders = within(dataGrid).getAllByRole('columnheader');
    expect(columnHeaders).toHaveLength(2);

    const rows = within(dataGrid).getAllByRole('row');
    // The first row is the header row
    expect(rows).toHaveLength(4);
  });

  it('should render the correct content with no athleteId', async () => {
    render(<ConcussionResultsBaseline {...props} />);
    const baselineList = await screen.findByTestId('baselineList');
    const dataGrid = within(baselineList).getByRole('grid');
    expect(dataGrid).toBeInTheDocument();

    expect(screen.getByText('Heasip Jamie')).toBeInTheDocument();
    expect(screen.getByText('Completed - January 4, 2022')).toBeInTheDocument();
    expect(
      screen.getByText('Expired - September 14, 2022')
    ).toBeInTheDocument();
    expect(screen.getByText('Outstanding')).toBeInTheDocument();
  });
});
