import { render, screen } from '@testing-library/react';
import moment from 'moment';

import IntegrationSelector from '../index';

describe('IntegrationSelector', () => {
  const mockProps = {
    integrationData: [],
    selectedIntegration: { id: null, name: null },
    setSelectedIntegration: jest.fn(),
    headerHeight: '70px',
    parseState: 'Dormant',
    hasErrors: false,
    eventTime: '2025-10-16',
    integrationEvents: null,
  };

  it('should render CSV file button when importType when there is no integrations passed', () => {
    render(<IntegrationSelector {...mockProps} />);

    expect(
      screen.getByRole('button', { name: 'CSV file' })
    ).toBeInTheDocument();
  });

  it('should render integration buttons when importType and there are integrations passed', () => {
    const mockIntegrations = [
      {
        source_identifier: 'statsports',
        name: 'Statsport',
      },
      {
        source_identifier: 'polar',
        name: 'Polar',
      },
      {
        source_identifier: 'oura',
        name: 'Oura Ring',
      },
    ];
    render(
      <IntegrationSelector
        {...mockProps}
        integrationData={{ integrations: mockIntegrations }}
      />
    );

    expect(
      screen.getByRole('button', { name: 'CSV file' })
    ).toBeInTheDocument();
    mockIntegrations.forEach((integration) => {
      expect(
        screen.getByRole('button', { name: `${integration.name} logo` })
      ).toBeInTheDocument();
    });
  });

  it('should render integration button with text if no image mapping exists', () => {
    render(
      <IntegrationSelector
        {...mockProps}
        integrationData={{
          integrations: [
            {
              source_identifier: 'integration_without_mapping',
              name: 'Integration Without Mapping',
            },
          ],
        }}
      />
    );

    expect(screen.getByText('Integration Without Mapping')).toBeInTheDocument();
  });

  describe('error alert', () => {
    it('should not render error alert when hasErrors is false', () => {
      render(<IntegrationSelector {...mockProps} />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should render correct error alert when hasErrors is true and there are no integrationEvents', () => {
      render(<IntegrationSelector {...mockProps} hasErrors />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Could not load data.')).toBeInTheDocument();
      expect(
        screen.getByText('API failed to fetch data. Try again.')
      ).toBeInTheDocument();
    });

    it('should render correct error alert when hasErrors is true and there are integrationEvents', () => {
      render(
        <IntegrationSelector {...mockProps} hasErrors integrationEvents={[]} />
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(
        screen.getByText(
          `No data found on device for date of session or game: ${moment(
            mockProps.eventTime
          ).format('D MMM YYYY')}.`
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Change the date of the session or game or select a different data source.'
        )
      ).toBeInTheDocument();
    });
  });
});
