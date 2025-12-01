import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import selectEvent from 'react-select-event';
import LoggedMedicationSelect from '..';

describe('<LoggedMedicationSelect />', () => {
  const selectLabel = 'Test Label';
  const props = {
    medicationSourceListName: 'fdb_dispensable_drugs',
    label: selectLabel,
    placeholder: 'Test Placeholder',
    onChange: jest.fn(),
    value: null,
    invalid: false,
    isDisabled: false,
  };

  it('renders the label', async () => {
    render(<LoggedMedicationSelect {...props} />);
    expect(await screen.findByText(selectLabel)).toBeVisible();
  });

  it('displays drugs from searchDispensableDrugs service and calls onChange prop when user selects', async () => {
    render(<LoggedMedicationSelect {...props} />);

    await screen.findByText(selectLabel);
    const select = screen.getByLabelText(selectLabel);
    selectEvent.openMenu(select);

    fireEvent.change(select, { target: { value: 'Advil' } });
    await waitForElementToBeRemoved(screen.queryByText('Loading...'));

    await selectEvent.select(
      select,
      ['Advil Cold and Sinus 30 mg-200 mg tablet'],
      {
        container: document.body,
      }
    );

    await expect(props.onChange).toHaveBeenCalledTimes(1);
    const expectedOnChangeData = {
      dispensable_drug_id: '431391',
      dose_form_desc: 'tablet',
      drug_name_desc: 'Advil Cold and Sinus',
      id: 1,
      label: 'Advil Cold and Sinus 30 mg-200 mg tablet',
      med_strength: '30-200',
      med_strength_unit: 'mg',
      name: 'Advil Cold and Sinus 30 mg-200 mg tablet',
      route_desc: 'oral',
      value: 1,
    };
    await expect(props.onChange).toHaveBeenCalledWith(expectedOnChangeData);
  });

  it('renders invalid CSS when invalid', async () => {
    const { container } = render(<LoggedMedicationSelect {...props} invalid />);
    await screen.findByText(selectLabel);
    expect(
      container.getElementsByClassName('kitmanReactSelect--invalid')
    ).toHaveLength(1);
  });

  describe('[FEATURE FLAG] medications-general-availability', () => {
    beforeEach(() => {
      window.featureFlags['medications-general-availability'] = true;
    });
    afterEach(() => {
      window.featureFlags['medications-general-availability'] = false;
    });

    it('displays NHS drugs from searchDrugs service', async () => {
      render(
        <LoggedMedicationSelect
          {...props}
          medicationSourceListName="nhs_dmd_drugs"
        />
      );

      await screen.findByText(selectLabel);
      const select = screen.getByLabelText(selectLabel);
      selectEvent.openMenu(select);

      fireEvent.change(select, { target: { value: 'NHS' } });
      await waitForElementToBeRemoved(screen.queryByText('Loading...'));

      await selectEvent.select(select, ['NHS_Test2'], {
        container: document.body,
      });

      await expect(props.onChange).toHaveBeenCalledTimes(1);

      const expectedOnChangeData = {
        drug_type: 'Emr::Private::Models::NhsDmdDrug',
        id: 2,
        label: 'NHS_Test2',
        value: 2,
      };
      expect(props.onChange).toHaveBeenCalledWith(expectedOnChangeData);
    });

    it('sorts favorite medications first', async () => {
      render(
        <LoggedMedicationSelect
          {...props}
          medicationSourceListName="nhs_dmd_drugs"
        />
      );
      await screen.findByText(selectLabel);

      const select = screen.getByLabelText(selectLabel);
      selectEvent.openMenu(select);

      // Favorites display before entering text
      expect(screen.getByText('NHS_B')).toBeInTheDocument();
      const displayedFavorites = screen.getAllByTestId(
        'Favorite|FavoriteTemplate'
      );

      expect(displayedFavorites).toHaveLength(4);
      expect(displayedFavorites[0]).toHaveTextContent(
        "Generic Nairn's gluten free wholegrain crackers"
      );
      expect(displayedFavorites[1]).toHaveTextContent(
        'Generic Sudocrem antiseptic healing cream'
      );
      expect(displayedFavorites[2]).toHaveTextContent('NHS_B');

      fireEvent.change(select, { target: { value: 'NHS_' } });
      await waitForElementToBeRemoved(screen.queryByText('Loading...'));
      const sortedResults = screen.getAllByTestId('Favorite|FavoriteTemplate');
      expect(sortedResults).toHaveLength(4);
      // Favorites display first
      expect(sortedResults[0]).toHaveTextContent('NHS_B'); // Favorite Alpha ordered
      expect(sortedResults[1]).toHaveTextContent('NHS_Test1'); // Favorite Alpha ordered
      expect(sortedResults[2]).toHaveTextContent('NHS_A'); // NOT A FAVORITE
    });
  });
});
