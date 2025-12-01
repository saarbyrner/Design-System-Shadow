import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import i18n from '@kitman/common/src/utils/i18n';
import { concussionInjuryData } from '@kitman/services/src/mocks/handlers/medical/getConcussionFormAnswersSetsList';

import useConcussionInjuryResults from '@kitman/modules/src/Medical/shared/hooks/useConcussionInjuryResults';
import getConcussionTabTableHeaders from '@kitman/modules/src/Medical/shared/components/ConcussionsTab/getTableHeaders';
import ConcussionResultsGrid from '../index';

jest.mock(
  '@kitman/modules/src/Medical/shared/hooks/useConcussionInjuryResults'
);

const mockUseConcussionInjuryResults = (
  concussionInjurySummaryList,
  requestStatus
) => {
  useConcussionInjuryResults.mockImplementation(() => ({
    concussionInjurySummaryList,
    requestStatus,
  }));
};

const renderComponent = (props) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <ConcussionResultsGrid {...props} />
    </I18nextProvider>
  );
};

describe('<ConcussionResultsGrid />', () => {
  const props = {
    tableHeaders: getConcussionTabTableHeaders({}).testHistoryHeaders,
    t: (t) => t,
  };

  it('renders', () => {
    mockUseConcussionInjuryResults([], 'SUCCESS');
    renderComponent(props);
    expect(screen.getByTestId('concussionList')).toBeInTheDocument();
  });

  it('renders data grid', async () => {
    mockUseConcussionInjuryResults(concussionInjuryData, 'SUCCESS');
    renderComponent(props);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });
});
