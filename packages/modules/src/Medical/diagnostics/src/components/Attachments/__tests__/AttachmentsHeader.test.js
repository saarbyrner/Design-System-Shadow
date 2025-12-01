import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';

import {
  mockedDiagnosticContextValue,
  MockedDiagnosticContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/DiagnosticContext/utils/mocks';
import AttachmentsHeader from '../AttachmentsHeader';

describe('<AttachmentsHeader />', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  const mockOnOpenAddDiagnosticAttachmentSidePanel = jest.fn();
  const mockOnOpenAddDiagnosticLinkSidePanel = jest.fn();

  const props = {
    onOpenAddDiagnosticAttachmentSidePanel:
      mockOnOpenAddDiagnosticAttachmentSidePanel,
    onOpenAddDiagnosticLinkSidePanel: mockOnOpenAddDiagnosticLinkSidePanel,
    t: i18nextTranslateStub(),
  };

  test('renders correct content and handles interactions', async () => {
    render(
      <MockedOrganisationContextProvider
        organisationContext={{
          organisation: { id: 37 },
        }}
      >
        <MockedDiagnosticContextProvider
          diagnosticContext={mockedDiagnosticContextValue}
        >
          <AttachmentsHeader {...props} />
        </MockedDiagnosticContextProvider>
      </MockedOrganisationContextProvider>
    );

    // Find the "Add" button and click it to open the menu
    const addButton = screen.getByRole('button', { name: 'Add' });

    expect(addButton).toBeInTheDocument();
    await user.click(addButton);

    // Find the menu items by text and click them
    const addAttachmentMenuItem = screen.getByText('File');
    const addLinkMenuItem = screen.getByText('Link');

    expect(addAttachmentMenuItem).toBeInTheDocument();
    expect(addLinkMenuItem).toBeInTheDocument();

    await user.click(addAttachmentMenuItem);
    expect(mockOnOpenAddDiagnosticAttachmentSidePanel).toHaveBeenCalledTimes(1);

    // Re-open the menu after clicking the first item
    await user.click(addButton);

    await user.click(addLinkMenuItem);
    expect(mockOnOpenAddDiagnosticLinkSidePanel).toHaveBeenCalledTimes(1);
  });

  test('does not render the add button when organisation id is different', () => {
    render(
      <MockedOrganisationContextProvider
        organisationContext={{
          organisation: { id: 38 }, // Different organisation ID
        }}
      >
        <MockedDiagnosticContextProvider
          diagnosticContext={mockedDiagnosticContextValue}
        >
          <AttachmentsHeader {...props} />
        </MockedDiagnosticContextProvider>
      </MockedOrganisationContextProvider>
    );

    // Check that the "Add" button is not present
    const addButton = screen.queryByRole('button', { name: 'Add' });
    expect(addButton).not.toBeInTheDocument();
  });
});
