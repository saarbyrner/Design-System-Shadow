import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { concussionIncidentFormsData } from '@kitman/services/src/mocks/handlers/medical/getConcussionFormAnswersSetsList';
import getConcussionTabTableHeaders from '@kitman/modules/src/Medical/shared/components/ConcussionsTab/getTableHeaders';
import useConcussionFormAnswersSetsList from '@kitman/modules/src/Medical/shared/hooks/useConcussionFormAnswersSetsList';
import TestHistoryGrid from '../index';

jest.mock('@kitman/modules/src/Medical/shared/hooks/useConcussionFormAnswersSetsList');

const mockUseConcussionFormAnswersSetsList = (
  concussionSummaryList,
  requestStatus
) => {
  useConcussionFormAnswersSetsList.mockImplementation(() => ({
    concussionSummaryList,
    requestStatus,
  }));
};

const renderComponent = (props) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <TestHistoryGrid {...props} />
    </I18nextProvider>
  );
};

describe('<TestHistoryGrid />', () => {
  const props = {
    tableHeaders: getConcussionTabTableHeaders({}).testHistoryHeaders,
    athleteId: '1234',
    t: (t) => t,
  };

  it('renders', () => {
    mockUseConcussionFormAnswersSetsList([], 'SUCCESS');
    renderComponent(props);
    expect(screen.getByTestId('testHistoryList')).toBeInTheDocument();
  });

  it('renders data grid', async () => {
    mockUseConcussionFormAnswersSetsList(
      concussionIncidentFormsData,
      'SUCCESS'
    );
    renderComponent(props);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('renders the correct columns', async () => {
    mockUseConcussionFormAnswersSetsList(
      concussionIncidentFormsData,
      'SUCCESS'
    );
    renderComponent(props);
    const headers = screen.getAllByRole('columnheader');
    expect(headers.length).toBe(2);
  });

  it('renders the correct rows', async () => {
    mockUseConcussionFormAnswersSetsList(
      concussionIncidentFormsData,
      'SUCCESS'
    );
    renderComponent(props);
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(2);
  });
});
