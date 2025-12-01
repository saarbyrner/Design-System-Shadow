import { render, screen, within } from '@testing-library/react';
import moment from 'moment';

import {
  mockedDiagnosticContextValue,
  MockedDiagnosticContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/DiagnosticContext/utils/mocks';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import LinkedIssue from '@kitman/modules/src/Medical/diagnostics/src/components/LinkedIssue';

describe('<LinkedIssue />', () => {
  const props = {
    t: i18nextTranslateStub(),
  };

  test('renders the correct content', () => {
    render(
      <MockedDiagnosticContextProvider
        diagnosticContext={mockedDiagnosticContextValue}
      >
        <LinkedIssue {...props} />
      </MockedDiagnosticContextProvider>
    );

    const list = screen.getByTestId('LinkedIssue|LinkedIssueSummary');
    const items = within(list).getAllByRole('listitem');
    const firstOccurrence =
      mockedDiagnosticContextValue.diagnostic.issue_occurrences[0];
    const expectedDate = moment(firstOccurrence.occurrence_date).format(
      'MMM DD YYYY'
    );
    const expectedPathology = firstOccurrence.full_pathology || '--';
    expect(items[0]).toHaveTextContent(expectedDate);
    expect(items[1]).toHaveTextContent(expectedPathology);
  });
});
