import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';
import {
  mockedDiagnosticContextValue,
  MockedDiagnosticContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/DiagnosticContext/utils/mocks';

import Attachments from '@kitman/modules/src/Medical/diagnostics/src/components/Attachments';

describe('<Attachments />', () => {
  const props = {
    onOpenAddDiagnosticAttachmentSidePanel: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('renders the correct content', () => {
    render(
      <MockedDiagnosticContextProvider
        diagnosticContext={mockedDiagnosticContextValue}
      >
        <Attachments {...props} />
      </MockedDiagnosticContextProvider>
    );

    // Check for headings
    expect(
      screen.getByRole('heading', { name: 'Attachments' })
    ).toBeInTheDocument();
    expect(screen.getByTestId('Links|Heading')).toHaveTextContent('Links');
    expect(screen.getByTestId('Files|Heading')).toHaveTextContent('Files');

    // Check for attachment links
    const attachmentLink = screen.getByRole('link', {
      name: 'Fake Link for testing',
    });
    expect(attachmentLink).toBeInTheDocument();
    expect(attachmentLink).toHaveAttribute('href', 'www.thisisafakelink.com');

    // Check for attachment files
    const attachmentFile = screen.getByRole('link', { name: 'filePond.png' });
    expect(attachmentFile).toBeInTheDocument();
    expect(attachmentFile).toHaveAttribute(
      'href',
      'https://s3:9000/some_awesome/url/'
    );

    // Check for AttachmentsHeader presence is implicitly done by checking its rendered content (headings, links, files)
  });

  it('contains Add button when created by the same org', () => {
    render(
      <MockedOrganisationContextProvider
        organisationContext={{
          organisation: { id: 37 },
        }}
      >
        <MockedDiagnosticContextProvider
          diagnosticContext={mockedDiagnosticContextValue}
        >
          <Attachments {...props} />
        </MockedDiagnosticContextProvider>
      </MockedOrganisationContextProvider>
    );

    // Check for the "Add" button using text content and role
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('does not contain the Add button when created by a different org', () => {
    render(
      <MockedOrganisationContextProvider
        organisationContext={{
          organisation: { id: 69 },
        }}
      >
        <MockedDiagnosticContextProvider
          diagnosticContext={mockedDiagnosticContextValue}
        >
          <Attachments {...props} />
        </MockedDiagnosticContextProvider>
      </MockedOrganisationContextProvider>
    );

    // Use queryByRole to check for absence
    expect(
      screen.queryByRole('button', { name: 'Add' })
    ).not.toBeInTheDocument();
  });
});
