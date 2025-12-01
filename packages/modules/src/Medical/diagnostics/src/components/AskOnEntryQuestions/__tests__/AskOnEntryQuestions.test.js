import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  mockedRedoxDiagnosticContextValue,
  MockedDiagnosticContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/DiagnosticContext/utils/mocks';
import AskOnEntryQuestions from '../index';

describe('<AskOnEntryQuestions />', () => {
  const props = {
    t: i18nextTranslateStub(),
  };

  it('renders the correct content', () => {
    render(
      <MockedDiagnosticContextProvider
        diagnosticContext={mockedRedoxDiagnosticContextValue}
      >
        <AskOnEntryQuestions {...props} />
      </MockedDiagnosticContextProvider>
    );

    expect(screen.getByRole('heading')).toHaveTextContent(
      'Ask on entry questions:'
    );
    expect(screen.getByRole('list')).toHaveTextContent(
      'This is a mock text questionThis is mock text input'
    );
    expect(screen.getByRole('list')).toHaveTextContent(
      'This is mock text input'
    );
  });
});
