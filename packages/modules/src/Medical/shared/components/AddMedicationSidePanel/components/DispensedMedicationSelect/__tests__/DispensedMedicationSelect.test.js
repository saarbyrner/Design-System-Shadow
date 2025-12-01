import { render, screen, waitFor } from '@testing-library/react';
import selectEvent from 'react-select-event';
import DispensedMedicationSelect from '..';

jest.mock('@kitman/services/src/services/medical');

describe('<DispensedMedicationSelect />', () => {
  const selectLabel = 'Test Label';
  const props = {
    medicationSourceListName: 'fdb_dispensable_drugs',
    label: selectLabel,
    placeholder: 'Select Med',
    onChange: jest.fn(),
    value: null,
    invalid: false,
    isDisabled: false,
    stockMedicationOptions: [
      {
        value: 1,
        stockId: 1,
        label: 'ibuprofen 200 mg capsule',
        dispensable_drug_id: '182478',
      },
      {
        value: 3,
        stockId: 3,
        label: 'ibuprofen 800 mg tablet',
        dispensable_drug_id: '173420',
      },
      {
        value: 11,
        stockId: 2,
        label: 'zinc oxide (bulk) powder',
        dispensable_drug_id: '209882',
      },
    ],
  };

  it('renders the label', async () => {
    render(<DispensedMedicationSelect {...props} />);
    expect(await screen.findByText(selectLabel)).toBeVisible();
  });

  it('calls onChange prop when user selects a favorite', async () => {
    render(<DispensedMedicationSelect {...props} />);
    await screen.findByText(selectLabel);
    await waitFor(() =>
      expect(screen.getByText('Select Med')).toBeInTheDocument()
    );

    // NOTE: Cannot use getByLabelText as FavoriteSelect is not using aria-labelledby
    const select = screen.getByRole('textbox');
    selectEvent.openMenu(select);
    await selectEvent.select(select, ['ibuprofen 800 mg tablet'], {
      container: document.body,
    });

    await expect(props.onChange).toHaveBeenCalledTimes(1);
    expect(props.onChange).toHaveBeenCalledWith({
      label: 'ibuprofen 800 mg tablet',
      value: 3,
      id: 3,
      name: 'ibuprofen 800 mg tablet',
      isFavorite: true, // Is a favorite
      dispensable_drug_id: '173420',
    });
  });

  it('calls onChange prop when user selects a non favorite', async () => {
    render(<DispensedMedicationSelect {...props} />);
    await screen.findByText(selectLabel);
    await waitFor(() =>
      expect(screen.getByText('Select Med')).toBeInTheDocument()
    );

    // NOTE: Cannot use getByLabelText as FavoriteSelect is not using aria-labelledby
    const select = screen.getByRole('textbox');
    selectEvent.openMenu(select);
    await selectEvent.select(select, ['zinc oxide (bulk) powder'], {
      container: document.body,
    });

    await expect(props.onChange).toHaveBeenCalledTimes(1);
    expect(props.onChange).toHaveBeenCalledWith({
      label: 'zinc oxide (bulk) powder',
      value: 11,
      id: 11,
      name: 'zinc oxide (bulk) powder',
      isFavorite: false, // Is not a favorite
      dispensable_drug_id: '209882',
      stockId: 2,
    });
  });

  it('renders invalid CSS when invalid', async () => {
    const { container } = render(
      <DispensedMedicationSelect {...props} invalid />
    );
    await screen.findByText(selectLabel);
    await waitFor(() =>
      expect(
        container.getElementsByClassName('kitmanReactSelect--invalid')
      ).toHaveLength(1)
    );
  });
});
