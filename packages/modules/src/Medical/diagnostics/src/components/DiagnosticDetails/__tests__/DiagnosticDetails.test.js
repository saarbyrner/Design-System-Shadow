import { screen } from '@testing-library/react';
import {
  mockedDiagnosticContextValue,
  MockedDiagnosticContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/DiagnosticContext/utils/mocks';
import DiagnosticDetails from '@kitman/modules/src/Medical/diagnostics/src/components/DiagnosticDetails/index';

import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import {
  renderWithProvider,
  storeFake,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';

setI18n(i18n);

const store = storeFake({
  addDiagnosticSidePanel: {
    isOpen: false,
  },
});

describe('DiagnosticDetails', () => {
  const props = {
    t: i18nextTranslateStub(),
  };

  test('renders the correct content', () => {
    renderWithProvider(
      <MockedDiagnosticContextProvider
        diagnosticContext={mockedDiagnosticContextValue}
      >
        <DiagnosticDetails {...props} />
      </MockedDiagnosticContextProvider>,
      store
    );

    // Check for the presence of the Header component by querying for its main heading
    expect(
      screen.getByRole('heading', { name: /Diagnostic details/i })
    ).toBeInTheDocument();

    // Check for the presence of the AdditionalInfo component by querying for its data-testid
    expect(
      screen.getByTestId('AdditionalInfo|AuthorDetails')
    ).toBeInTheDocument();
  });

  describe('[feature-flag] print-diagnostics', () => {
    beforeEach(() => {
      window.featureFlags['print-diagnostics'] = true;
    });
    afterEach(() => {
      window.featureFlags['print-diagnostics'] = false;
    });

    test('renders PrintView when feature flag is enabled', () => {
      renderWithProvider(
        <MockedDiagnosticContextProvider
          diagnosticContext={mockedDiagnosticContextValue}
        >
          <DiagnosticDetails {...props} />
        </MockedDiagnosticContextProvider>,
        store
      );

      expect(
        screen.getByTestId('DiagnosticReport|Printable')
      ).toBeInTheDocument();
    });

    test('does not render PrintView when feature flag is disabled', () => {
      window.featureFlags['print-diagnostics'] = false; // Ensure flag is off for this test
      renderWithProvider(
        <MockedDiagnosticContextProvider
          diagnosticContext={mockedDiagnosticContextValue}
        >
          <DiagnosticDetails {...props} />
        </MockedDiagnosticContextProvider>,
        store
      );

      expect(
        screen.queryByTestId('DiagnosticReport|Printable')
      ).not.toBeInTheDocument();
    });
  });
});
