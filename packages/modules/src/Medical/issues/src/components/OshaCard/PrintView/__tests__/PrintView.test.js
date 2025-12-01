import { screen, render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { mockedIssueContextValue } from '../../../../../../shared/contexts/IssueContext/utils/mocks';
import PrintView from '..';

describe('<PrintView />', () => {
  it('should render OshaForm as expected', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <PrintView issue={mockedIssueContextValue} t={i18nextTranslateStub()} />
      </I18nextProvider>
    );

    expect(screen.getByTestId('OshaForm|Printable')).toBeInTheDocument();
  });
});
