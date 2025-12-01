import { fireEvent, screen, within } from '@testing-library/react';

import {
  renderWithUserEventSetup,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';

import AdvancedEventOptions from '..';

const gameFormData = {
  loaded: true,
  fixtures: [],
  venueTypes: [{ id: '543', title: 'Home' }],
  organisationTeams: [{ id: '143', title: 'Kitman Tags' }],
  teams: [{ id: '9', title: 'Tag Lions' }],
  competitions: [{ id: '51', title: 'World Cup' }],
  surfaceTypes: [
    {
      id: '12',
      name: 'Artificial',
    },
  ],
  surfaceQualities: [
    {
      id: '21',
      title: 'Dry',
    },
  ],
  weathers: [
    {
      id: '31',
      title: 'Sunny/Clear',
    },
  ],
  temperatureUnit: 'C',
};

const baseProps = {
  formData: gameFormData,
  surfaceType: '',
  surfaceQuality: '',
  weather: '',
  temperature: '',
  handleSurfaceTypeChange: jest.fn(),
  handleSurfaceQualityChange: jest.fn(),
  handleWeatherChange: jest.fn(),
  handleTemperatureChange: jest.fn(),
  t: i18nextTranslateStub(),
};

describe('<AdvancedEventOptions />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component', () => {
    renderWithUserEventSetup(<AdvancedEventOptions {...baseProps} />);
    expect(screen.getByText('Additional options')).toBeInTheDocument();
  });

  it('initiates the advanced options correctly', () => {
    const props = {
      ...baseProps,
      surfaceType: '12',
      surfaceQuality: '21',
      weather: '31',
      temperature: '40',
    };
    renderWithUserEventSetup(<AdvancedEventOptions {...props} />);

    expect(screen.getByText('Artificial')).toBeInTheDocument();
    // The text 'Dry' and 'Sunny/Clear' appear twice, once for the value and once in the dropdown
    expect(screen.getAllByText('Dry')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Sunny/Clear')[0]).toBeInTheDocument();
    const temperatureInput = screen
      .getByText('Temperature')
      .closest('[data-testid="InputNumeric"]')
      .querySelector('input');
    expect(temperatureInput).toHaveValue(40);
  });

  it('calls the correct props when editing the advanced options', async () => {
    const { user } = renderWithUserEventSetup(
      <AdvancedEventOptions {...baseProps} />
    );

    await user.click(screen.getByTestId('GroupedDropdown|TriggerButton'));
    await user.click(screen.getByText('Artificial'));
    expect(baseProps.handleSurfaceTypeChange).toHaveBeenCalledWith('12');

    // The surface quality and weather dropdowns are siblings of their labels
    await user.click(screen.getByText('Surface Quality').nextSibling);
    await user.click(screen.getByText('Dry'));
    expect(baseProps.handleSurfaceQualityChange).toHaveBeenCalledWith('21');

    await user.click(screen.getByText('Weather').nextSibling);
    await user.click(screen.getByText('Sunny/Clear'));
    expect(baseProps.handleWeatherChange).toHaveBeenCalledWith('31');

    const temperatureInput = screen
      .getByText('Temperature')
      .closest('[data-testid="InputNumeric"]')
      .querySelector('input');
    fireEvent.change(temperatureInput, { target: { value: '40' } });
    expect(baseProps.handleTemperatureChange).toHaveBeenCalledWith('40');
  });

  it('clears the inputs when the clear button is clicked', async () => {
    const props = {
      ...baseProps,
      surfaceType: '12',
      surfaceQuality: '21',
      weather: '31',
    };
    const { user } = renderWithUserEventSetup(
      <AdvancedEventOptions {...props} />
    );

    const surfaceTypeDropdown = screen.getByTestId(
      'GroupedDropdown|TriggerButton'
    ).parentElement;
    await user.click(within(surfaceTypeDropdown).getByRole('button'));
    await user.click(within(surfaceTypeDropdown).getByText('clear'));
    expect(baseProps.handleSurfaceTypeChange).toHaveBeenCalledWith('');

    const surfaceQualityDropdown =
      screen.getByText('Surface Quality').parentElement.parentElement;
    await user.click(within(surfaceQualityDropdown).getByRole('button'));
    await user.click(within(surfaceQualityDropdown).getByText('clear'));
    expect(baseProps.handleSurfaceQualityChange).toHaveBeenCalledWith('');

    const weatherDropdown =
      screen.getByText('Weather').parentElement.parentElement;
    await user.click(within(weatherDropdown).getByRole('button'));
    await user.click(within(weatherDropdown).getByText('clear'));
    expect(baseProps.handleWeatherChange).toHaveBeenCalledWith('');
  });
});
