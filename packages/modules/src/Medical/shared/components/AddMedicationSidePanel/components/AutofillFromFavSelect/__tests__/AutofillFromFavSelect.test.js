import { render, screen, waitFor } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { data as mockedMedicationFavorite } from '@kitman/services/src/mocks/handlers/medical/getMedicationFavorites';
import userEvent from '@testing-library/user-event';
import AutofillFromFavSelect from '../index';

describe('<AutofillFromFavSelect />', () => {
  const favorites = mockedMedicationFavorite.map((favorite, index) => {
    return {
      ...favorite,
      label: `favorite_test_summary_${index}`,
    };
  });
  const props = {
    medConfigFavorites: favorites,
    setMedConfigFavorites: jest.fn(),
    onChange: jest.fn(),
    selectedMedConfig: favorites[0],
    isDisabled: false,
    onStart: jest.fn(),
    onSuccess: jest.fn(),
    onFailure: jest.fn(),
    t: i18nextTranslateStub(),
  };
  it('renders correctly when a config is selected', async () => {
    render(<AutofillFromFavSelect {...props} />);

    await waitFor(() => {
      expect(screen.getByText('Autofill from favorites')).toBeInTheDocument();
      expect(screen.getByText('favorite_test_summary_0')).toBeInTheDocument();
    });
  });

  it('shows the bin icon for each option', async () => {
    render(<AutofillFromFavSelect {...props} />);

    const medConfig = await screen.findByText('favorite_test_summary_0');
    await userEvent.click(medConfig);

    const icons = await screen.findAllByTestId('IconConfigButton');
    expect(icons.length).toEqual(3);
  });

  it('renders the error when dispense date is not populated', async () => {
    const disabledProps = {
      ...props,
      isDisabled: true,
    };

    render(<AutofillFromFavSelect {...disabledProps} />);

    await waitFor(() => {
      expect(
        screen.getByText('Please select a dispense date.')
      ).toBeInTheDocument();
    });
  });
});
