import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import UnlistedMedicationInput from '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/components/UnlistedMedicationInput';
import { useGetCountriesQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { countriesData } from '@kitman/services/src/mocks/handlers/general/getCountries';
import {
  useGetDrugFormsQuery,
  useGetMedStrengthUnitsQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import {
  drugFormsMock,
  medStrengthUnitsMock,
} from '@kitman/services/src/mocks/handlers/medical/medications/data.mock';

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetCountriesQuery: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useGetDrugFormsQuery: jest.fn(),
    useGetMedStrengthUnitsQuery: jest.fn(),
  })
);

describe('<UnlistedMedicationInput />', () => {
  const toggleOpenCallback = jest.fn();
  const updateCallback = jest.fn();

  const testCustomDrug1 = {
    name: 'Triactin',
    brand_name: 'acme',
    drug_form: 'Tablet',
    med_strength: '100',
    med_strength_unit: 'mg',
    country: 'IE',
  };

  const testCustomDrug2 = {
    name: 'Triactin',
    brand_name: 'acme',
    drug_form: 'Tablet',
    med_strength: '100',
    med_strength_unit: 'other',
    country: 'IE',
  };

  const props = {
    isOpen: true,
    toggleOpen: toggleOpenCallback,
    unlistedMed: testCustomDrug1,
    updateUnlistedMed: updateCallback,
    isDisabled: false,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    useGetCountriesQuery.mockReturnValue({
      data: countriesData,
      isSuccess: true,
      isError: false,
      isLoading: false,
    });
    useGetDrugFormsQuery.mockReturnValue({
      data: drugFormsMock.drug_forms,
      error: false,
      isLoading: false,
    });
    useGetMedStrengthUnitsQuery.mockReturnValue({
      data: medStrengthUnitsMock.med_strength_units,
      error: false,
      isLoading: false,
    });
  });

  it('renders the medication values', async () => {
    render(<UnlistedMedicationInput {...props} />);
    expect(screen.getByText('Unlisted medication')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();

    const inputTextFields = screen.getAllByRole('textbox');
    expect(inputTextFields.length).toEqual(3);

    const otherUnitInput = screen.queryByRole('textbox', {
      name: 'Other unit',
    });
    expect(otherUnitInput).not.toBeInTheDocument();

    const drugNameInput = screen.getByRole('textbox', {
      name: 'Drug/Generic name',
    });
    expect(drugNameInput).toHaveValue('Triactin');

    const brandNameInput = screen.getByRole('textbox', {
      name: 'Brand name',
    });
    expect(brandNameInput).toHaveValue('acme');

    const strengthInput = screen.getByRole('textbox', {
      name: 'Strength',
    });
    expect(strengthInput).toHaveValue('100');

    const comboInputFields = screen.getAllByRole('combobox');
    expect(comboInputFields.length).toEqual(3);

    const drugFormInput = screen.getByRole('combobox', { name: 'Drug form' });
    expect(drugFormInput).toHaveValue('Tablet');

    const unitInput = screen.getByRole('combobox', { name: 'unit' });
    expect(unitInput).toHaveValue('mg (milligram)');

    const countryInput = screen.getByRole('combobox', { name: 'Country' });
    expect(countryInput).toHaveValue('Ireland');
  });

  it('calls to updateUnlistedMed on editing medication values', async () => {
    const user = userEvent.setup();
    render(<UnlistedMedicationInput {...props} />);

    const drugNameInput = screen.getByRole('textbox', {
      name: 'Drug/Generic name',
    });
    await user.type(drugNameInput, 'X');
    expect(updateCallback).toHaveBeenCalledWith({
      name: 'TriactinX',
      type: 'SET_UNLISTED_MED_NAME',
    });

    const brandNameInput = screen.getByRole('textbox', {
      name: 'Brand name',
    });
    await user.type(brandNameInput, 'X');
    expect(updateCallback).toHaveBeenCalledWith({
      brandName: 'acmeX',
      type: 'SET_UNLISTED_MED_BRAND_NAME',
    });

    const strengthInput = screen.getByRole('textbox', {
      name: 'Strength',
    });
    await user.type(strengthInput, '0');
    expect(updateCallback).toHaveBeenCalledWith({
      strength: '1000',
      type: 'SET_UNLISTED_MED_STRENGTH',
    });

    const drugFormInput = screen.getByRole('combobox', { name: 'Drug form' });
    await user.click(drugFormInput);
    const creamDrugForm = screen.getByRole('option', { name: 'Cream' });
    await user.click(creamDrugForm);
    expect(updateCallback).toHaveBeenCalledWith({
      drugForm: 'Cream',
      type: 'SET_UNLISTED_MED_DRUG_FORM',
    });

    const unitInput = screen.getByRole('combobox', { name: 'unit' });
    await user.click(unitInput);
    const mlUnit = screen.getByRole('option', { name: 'ml (millilitre)' });
    await user.click(mlUnit);
    expect(updateCallback).toHaveBeenCalledWith({
      unit: 'ml',
      type: 'SET_UNLISTED_MED_STRENGTH_UNIT',
    });

    const countryInput = screen.getByRole('combobox', { name: 'Country' });
    await user.click(countryInput);
    const countryOptions = screen.getAllByRole('option');

    expect(countryOptions.length).toEqual(6);
    expect(countryOptions[4]).toHaveTextContent('United States');

    await user.click(countryOptions[4]);
    expect(updateCallback).toHaveBeenCalledWith({
      country: 'US',
      type: 'SET_UNLISTED_MED_COUNTRY',
    });
  });

  it('displays and other unit input when other selected', async () => {
    const user = userEvent.setup();
    render(
      <UnlistedMedicationInput {...props} unlistedMed={testCustomDrug2} />
    );

    const unitInput = screen.getByRole('combobox', { name: 'unit' });
    expect(unitInput).toHaveValue('Other');

    const otherUnitInput = screen.getByRole('textbox', {
      name: 'Other unit',
    });
    expect(otherUnitInput).toBeInTheDocument();
    await user.type(otherUnitInput, 'X');

    expect(updateCallback).toHaveBeenCalledWith({
      unit: 'X',
      type: 'SET_UNLISTED_MED_OTHER_UNIT',
    });
  });

  it('calls to toggleOpen on clicking cancel', async () => {
    const user = userEvent.setup();
    render(<UnlistedMedicationInput {...props} />);
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    await expect(toggleOpenCallback).toHaveBeenCalledTimes(1);
  });
});
