import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment-timezone';
import {
  mockedDiagnosticContextValue,
  MockedDiagnosticContextProvider,
  mockedRedoxDiagnosticContextValue,
} from '@kitman/modules/src/Medical/shared/contexts/DiagnosticContext/utils/mocks';
import AdditionalInfo from '../AdditionalInfo';

const mockResultBlock = {
  results: [
    {
      application_order_id: 'mock_accession_id',
      reference_id: 'mock_ref_id',
      status: 'complete',
      original_organisation_name: 'Rottenham FC',
      created_at: '2023-05-06T00:00:00+01:00',
    },
  ],
};

beforeEach(() => {
  moment.tz.setDefault('UTC');
});

afterEach(() => {
  moment.tz.setDefault();
});

const today = DateFormatter.formatStandard({
  date: moment(),
});

describe('<AdditionalInfo />', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    t: i18nT,
  };

  it('renders the correct content for non-redox', () => {
    render(
      <MockedDiagnosticContextProvider
        diagnosticContext={mockedDiagnosticContextValue}
      >
        <AdditionalInfo {...props} />
      </MockedDiagnosticContextProvider>
    );

    const container = screen.getByText('Additional Info').parentNode;
    expect(container).toBeInTheDocument();
    expect(container.querySelectorAll('li')[0]).toHaveTextContent(
      'Practitioner: '
    );
    expect(container.querySelectorAll('li')[1]).toHaveTextContent('Location: ');
    expect(
      screen.getByTestId('AdditionalInfo|AuthorDetails')
    ).toHaveTextContent(`Created ${today} by Greg Levine-Rozenvayn`);
  });

  it('renders the correct content for redox', () => {
    // eslint-disable-next-line dot-notation
    window.featureFlags['redox'] = true;
    window.featureFlags['redox-iteration-1'] = true;

    render(
      <MockedDiagnosticContextProvider
        diagnosticContext={mockedRedoxDiagnosticContextValue}
      >
        <AdditionalInfo {...props} resultBlocks={mockResultBlock} />
      </MockedDiagnosticContextProvider>
    );

    const container = screen.getByTestId('RedoxDetailsAdditionalInfo');
    // Query the parent as the items are rendered in different <ul>'s
    const listItems = container.parentNode.querySelectorAll(
      "[class$='-detailLabel']"
    );
    const labelNames = [
      'Name: ',
      'D.O.B.: ',
      'NFL ID: ',
      'Gender: ',
      'Type - name: ',
      'CPT: ',
      'Provider: ',
      'Reason: ',
      'Body area: ',
      'Laterality: ',
      'Company: ',
      'Club: ',
      'Completion date: ',
      'Order date:  ',
      'Appt. date:  ',
      'Results date:  ',
      'Accession ID: ',
      'REF ID: ',
      'Status: ',
    ];

    expect(container).toBeInTheDocument();
    expect(listItems).toHaveLength(19);

    listItems.forEach((_, i) => {
      expect(listItems[i]).toHaveTextContent(labelNames[i].trim());
    });

    expect(
      screen.getByTestId('AdditionalInfo|AuthorDetails')
    ).toHaveTextContent(`Created ${today} by Dr. K`);
  });

  it('renders NPI and Company name when supplied', () => {
    // eslint-disable-next-line dot-notation
    window.featureFlags['redox'] = true;
    window.featureFlags['redox-iteration-1'] = true;

    render(
      <MockedDiagnosticContextProvider
        diagnosticContext={{
          diagnostic: {
            ...mockedRedoxDiagnosticContextValue.diagnostic,
            provider: {
              ...mockedRedoxDiagnosticContextValue.diagnostic.provider,
              npi: '1902378274',
            },
            location: {
              ...mockedRedoxDiagnosticContextValue.diagnostic.location,
              account: 'APAL Local Account',
            },
          },
        }}
      >
        <AdditionalInfo {...props} resultBlocks={mockResultBlock} />
      </MockedDiagnosticContextProvider>
    );

    expect(
      screen.getByText('Provider, Fullname (NPI#: 1902378274)')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Mock company (Account#: APAL Local Account)')
    ).toBeInTheDocument();
  });

  it('does not render Company name when missing', () => {
    // eslint-disable-next-line dot-notation
    window.featureFlags['redox'] = true;
    window.featureFlags['redox-iteration-1'] = true;

    render(
      <MockedDiagnosticContextProvider
        diagnosticContext={{
          diagnostic: {
            ...mockedRedoxDiagnosticContextValue.diagnostic,
            location: {
              ...mockedRedoxDiagnosticContextValue.diagnostic.location,
              account: null,
            },
          },
        }}
      >
        <AdditionalInfo {...props} resultBlocks={mockResultBlock} />
      </MockedDiagnosticContextProvider>
    );

    expect(screen.getByText('Mock company')).toBeInTheDocument();

    expect(
      screen.queryByText('Mock company (Account #): Local Account #3434')
    ).not.toBeInTheDocument();
  });
});
