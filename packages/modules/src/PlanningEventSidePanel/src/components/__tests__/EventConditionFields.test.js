import { render, screen, waitFor } from '@testing-library/react';
import selectEvent from 'react-select-event';

import {
  renderWithUserEventSetup,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import { getEventConditions } from '@kitman/services';
import { data as mockEventConditionsData } from '@kitman/services/src/mocks/handlers/getEventConditions';

import EventConditionFields from '../common/EventConditionFields';

// Mock the getEventConditions service
jest.mock('@kitman/services', () => ({
  ...jest.requireActual('@kitman/services'),
  getEventConditions: jest.fn(),
}));

describe('PlanningEventSidePanel <EventConditionFields /> component', () => {
  const testEvent = {
    surface_type: 1,
    surface_quality: 2,
    weather: 3,
    temperature: '-10',
  };

  const simpleValidResult = {
    isInvalid: false,
  };

  const simpleInvalidResult = {
    isInvalid: true,
  };

  const testValidity = {
    surface_type: simpleValidResult,
    surface_quality: simpleValidResult,
    weather: simpleValidResult,
    temperature: simpleValidResult,
  };

  const mockOnUpdateEventDetails = jest.fn();
  const mockOnDataLoadingStatusChanged = jest.fn();

  const defaultProps = {
    event: testEvent,
    eventValidity: testValidity,
    onUpdateEventDetails: mockOnUpdateEventDetails,
    onDataLoadingStatusChanged: mockOnDataLoadingStatusChanged,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getEventConditions.mockResolvedValue(mockEventConditionsData);
    mockOnUpdateEventDetails.mockClear();
    mockOnDataLoadingStatusChanged.mockClear();
  });

  it('renders', async () => {
    render(<EventConditionFields {...defaultProps} />);

    // Wait for the component to load data
    await waitFor(() => {
      expect(mockOnDataLoadingStatusChanged).toHaveBeenCalledWith(
        'SUCCESS',
        'eventConditions',
        null
      );
    });

    expect(screen.getByText('Surface Type')).toBeInTheDocument();
  });

  it('renders the necessary fields with supplied values', async () => {
    render(<EventConditionFields {...defaultProps} />);

    // Wait for the component to load data
    await waitFor(() => {
      expect(mockOnDataLoadingStatusChanged).toHaveBeenCalledWith(
        'SUCCESS',
        'eventConditions',
        null
      );
    });

    // Check Surface Type field - it displays the selected value as text
    expect(screen.getByText('Grass')).toBeInTheDocument(); // Based on mock data, id 1 = 'Grass'

    // Check Surface Quality field
    expect(screen.getByText('Wet')).toBeInTheDocument(); // Based on mock data, id 2 = 'Wet'

    // Check Weather field - id 3 doesn't exist in mock data, so no value should be displayed
    const weatherField = screen.getByLabelText('Weather');
    expect(weatherField).toBeInTheDocument();

    // Check Temperature field
    const temperatureField = screen.getByDisplayValue('-10');
    expect(temperatureField).toBeInTheDocument();
    expect(temperatureField).toHaveAttribute('name', 'temperature');
  });

  it('calls onUpdateEventDetails callback for Surface Type changes', async () => {
    render(<EventConditionFields {...defaultProps} />);

    // Wait for the component to load data
    await waitFor(() => {
      expect(mockOnDataLoadingStatusChanged).toHaveBeenCalledWith(
        'SUCCESS',
        'eventConditions',
        null
      );
    });

    const surfaceTypeField = screen.getByLabelText('Surface Type');

    await selectEvent.select(surfaceTypeField, 'Synthetic');

    expect(mockOnUpdateEventDetails).toHaveBeenCalledWith({
      surface_type: 2, // 'Synthetic' has id 2 in mock data
    });
  });

  it('calls onUpdateEventDetails callback for Surface Quality changes', async () => {
    render(<EventConditionFields {...defaultProps} />);

    // Wait for the component to load data
    await waitFor(() => {
      expect(mockOnDataLoadingStatusChanged).toHaveBeenCalledWith(
        'SUCCESS',
        'eventConditions',
        null
      );
    });

    const surfaceQualityField = screen.getByLabelText('Surface Quality');

    await selectEvent.select(surfaceQualityField, 'Dry');

    expect(mockOnUpdateEventDetails).toHaveBeenCalledWith({
      surface_quality: 1, // 'Dry' has id 1 in mock data
    });
  });

  it('calls onUpdateEventDetails callback for Weather changes', async () => {
    render(<EventConditionFields {...defaultProps} />);

    // Wait for the component to load data
    await waitFor(() => {
      expect(mockOnDataLoadingStatusChanged).toHaveBeenCalledWith(
        'SUCCESS',
        'eventConditions',
        null
      );
    });

    const weatherField = screen.getByLabelText('Weather');

    await selectEvent.select(weatherField, 'Sunny');

    expect(mockOnUpdateEventDetails).toHaveBeenCalledWith({
      weather: 1, // 'Sunny' has id 1 in mock data
    });
  });

  it('calls onUpdateEventDetails callback for Temperature changes', async () => {
    const { user } = renderWithUserEventSetup(
      <EventConditionFields {...defaultProps} />
    );

    // Wait for the component to load data
    await waitFor(() => {
      expect(mockOnDataLoadingStatusChanged).toHaveBeenCalledWith(
        'SUCCESS',
        'eventConditions',
        null
      );
    });

    const temperatureField = screen.getByDisplayValue('-10');

    await user.clear(temperatureField);
    await user.type(temperatureField, '-100');

    expect(mockOnUpdateEventDetails).toHaveBeenCalledWith({
      temperature: '-100',
      temperature_units: '°C', // From mock data
    });
  });

  it('renders the necessary fields as invalid', async () => {
    const invalidResults = {
      surface_type: simpleInvalidResult,
      surface_quality: simpleInvalidResult,
      weather: simpleInvalidResult,
      temperature: simpleInvalidResult,
    };

    render(
      <EventConditionFields {...defaultProps} eventValidity={invalidResults} />
    );

    // Wait for the component to load data
    await waitFor(() => {
      expect(mockOnDataLoadingStatusChanged).toHaveBeenCalledWith(
        'SUCCESS',
        'eventConditions',
        null
      );
    });

    // Check that Select components have invalid class
    const surfaceTypeContainer = screen
      .getByLabelText('Surface Type')
      .closest('.kitmanReactSelect');
    expect(surfaceTypeContainer).toHaveClass('kitmanReactSelect--invalid');

    const surfaceQualityContainer = screen
      .getByLabelText('Surface Quality')
      .closest('.kitmanReactSelect');
    expect(surfaceQualityContainer).toHaveClass('kitmanReactSelect--invalid');

    const weatherContainer = screen
      .getByLabelText('Weather')
      .closest('.kitmanReactSelect');
    expect(weatherContainer).toHaveClass('kitmanReactSelect--invalid');

    // Check that Temperature field has invalid class
    const temperatureContainer = screen
      .getByDisplayValue('-10')
      .closest('.InputNumeric__inputContainer');
    expect(temperatureContainer).toHaveClass(
      'InputNumeric__inputContainer--invalid'
    );
  });

  it('handles service loading failure', async () => {
    getEventConditions.mockRejectedValue(new Error('Service failed'));

    render(<EventConditionFields {...defaultProps} />);

    await waitFor(() => {
      expect(mockOnDataLoadingStatusChanged).toHaveBeenCalledWith(
        'FAILURE',
        'eventConditions',
        null
      );
    });
  });

  it('handles clear action for Surface Type', async () => {
    const { user } = renderWithUserEventSetup(
      <EventConditionFields {...defaultProps} />
    );

    // Wait for the component to load data
    await waitFor(() => {
      expect(mockOnDataLoadingStatusChanged).toHaveBeenCalledWith(
        'SUCCESS',
        'eventConditions',
        null
      );
    });

    // Clear the mock calls from initial render
    mockOnUpdateEventDetails.mockClear();

    // Find the Surface Type field container and click its clear button
    const surfaceTypeContainer = screen
      .getByLabelText('Surface Type')
      .closest('.kitmanReactSelect');
    const clearButton = surfaceTypeContainer.querySelector(
      '.kitmanReactSelect__clear-indicator'
    );

    await user.click(clearButton);

    expect(mockOnUpdateEventDetails).toHaveBeenCalledWith({
      surface_type: null,
    });
  });

  it('handles clear action for Surface Quality', async () => {
    const { user } = renderWithUserEventSetup(
      <EventConditionFields {...defaultProps} />
    );

    // Wait for the component to load data
    await waitFor(() => {
      expect(mockOnDataLoadingStatusChanged).toHaveBeenCalledWith(
        'SUCCESS',
        'eventConditions',
        null
      );
    });

    // Clear the mock calls from initial render
    mockOnUpdateEventDetails.mockClear();

    // Find the Surface Quality field container and click its clear button
    const surfaceQualityContainer = screen
      .getByLabelText('Surface Quality')
      .closest('.kitmanReactSelect');
    const clearButton = surfaceQualityContainer.querySelector(
      '.kitmanReactSelect__clear-indicator'
    );

    await user.click(clearButton);

    expect(mockOnUpdateEventDetails).toHaveBeenCalledWith({
      surface_quality: null,
    });
  });

  it('handles clear action for Weather', async () => {
    // Use props with weather value set so there's a clear button
    const propsWithWeatherValue = {
      ...defaultProps,
      event: {
        ...defaultProps.event,
        weather: 1, // Set a valid weather value so clear button appears
      },
    };

    const { user } = renderWithUserEventSetup(
      <EventConditionFields {...propsWithWeatherValue} />
    );

    // Wait for the component to load data
    await waitFor(() => {
      expect(mockOnDataLoadingStatusChanged).toHaveBeenCalledWith(
        'SUCCESS',
        'eventConditions',
        null
      );
    });

    // Clear the mock calls from initial render
    mockOnUpdateEventDetails.mockClear();

    // Find the Weather field container and click its clear button
    const weatherContainer = screen
      .getByLabelText('Weather')
      .closest('.kitmanReactSelect');
    const clearButton = weatherContainer.querySelector(
      '.kitmanReactSelect__clear-indicator'
    );

    await user.click(clearButton);

    expect(mockOnUpdateEventDetails).toHaveBeenCalledWith({
      weather: null,
    });
  });
});
