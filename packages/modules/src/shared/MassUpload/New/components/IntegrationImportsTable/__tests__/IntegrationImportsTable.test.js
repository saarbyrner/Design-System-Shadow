import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { data as mockResponse } from '@kitman/modules/src/shared/MassUpload/services/mocks/handlers/getIntegrationData';

import IntegrationImportsTable from '..';

describe('<IntegrationImportsTable />', () => {
  const defaultProps = {
    selectedIntegration: {
      id: 1325,
      name: 'catapult',
      sourceIdentifier: 'catapult',
    },
    integrationEvents: null,
    selectedApiImport: null,
    setSelectedApiImport: jest.fn(),
    resetState: jest.fn(),
    eventType: 'Session',
  };

  it('should render loading state and integration image when there are no integration events', () => {
    render(<IntegrationImportsTable {...defaultProps} />);
    expect(screen.getByText('Connecting to API...')).toBeInTheDocument();
    expect(screen.getByAltText('catapult logo')).toBeInTheDocument();
  });

  it('should render import table when there are integration events', async () => {
    render(
      <IntegrationImportsTable
        {...defaultProps}
        integrationEvents={mockResponse.events}
      />
    );

    // Column headers
    expect(
      screen.getByRole('columnheader', { name: 'Date' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Catapult name' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Duration' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Session time' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Participants' })
    ).toBeInTheDocument();

    // Mapped rows
    expect(screen.getAllByRole('row')).toHaveLength(
      mockResponse.events.length + 1 // +1 for header row);
    );
  });

  it('should auto select import that matches event date', async () => {
    render(
      <IntegrationImportsTable
        {...defaultProps}
        integrationEvents={mockResponse.events}
        eventTime={mockResponse.events[2].event.datetime}
      />
    );
    expect(defaultProps.setSelectedApiImport).toHaveBeenCalledWith(
      mockResponse.events[2].event.unique_identifier
    );
  });

  it('should select import on click of radio button', async () => {
    const user = userEvent.setup();
    render(
      <IntegrationImportsTable
        {...defaultProps}
        integrationEvents={mockResponse.events}
      />
    );

    await user.click(screen.getAllByRole('radio')[1]);
    expect(defaultProps.setSelectedApiImport).toHaveBeenCalledWith(
      mockResponse.events[1].event.unique_identifier
    );
  });

  it('should render no participants found error when there are no participants in the event', () => {
    render(
      <IntegrationImportsTable
        {...defaultProps}
        integrationEvents={mockResponse.events.map((event) => ({
          ...event,
          athletes: [],
        }))}
      />
    );

    expect(screen.getAllByText('No participants found')).toHaveLength(
      mockResponse.events.length
    );
  });

  it('should call resetEvent if there are no integration events', () => {
    render(
      <IntegrationImportsTable {...defaultProps} integrationEvents={[]} />
    );
    expect(defaultProps.resetState).toHaveBeenCalled();
  });
});
