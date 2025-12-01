import { render, screen } from '@testing-library/react';

import { data as mockResponse } from '@kitman/modules/src/shared/MassUpload/services/mocks/handlers/getIntegrationData';

import IntegrationImportDetailTable from '..';

describe('<IntegrationImportDetailTable />', () => {
  const defaultProps = {
    selectedApiImport: mockResponse.events[0].event.unique_identifier,
    integrationEvents: mockResponse.events,
  };

  it('should render import detail table with correct headers', async () => {
    render(<IntegrationImportDetailTable {...defaultProps} />);

    // Column headers
    expect(
      screen.getByRole('columnheader', { name: 'Import name' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Time' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Included athletes' })
    ).toBeInTheDocument();
  });

  it('should correctly render amount of athletes to be included in import', () => {
    render(<IntegrationImportDetailTable {...defaultProps} />);
    expect(
      screen.getByText(
        `Included athletes: ${mockResponse.events[0].athletes.length}`
      )
    ).toBeInTheDocument();
  });

  it('should correctly render amount of athletes not to be included in import', () => {
    render(<IntegrationImportDetailTable {...defaultProps} />);
    expect(
      screen.getByText(
        `Not found: ${mockResponse.events[0].non_setup_athletes_identifiers.length}`
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Check these athlete identifiers are correct within the Manage Athlete area'
      )
    ).toBeInTheDocument();
  });
});
