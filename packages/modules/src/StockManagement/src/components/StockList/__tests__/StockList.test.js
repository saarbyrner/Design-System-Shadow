import { act, render, screen, within } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import {
  useGetOrganisationQuery,
  useGetPermissionsQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';
import StockList from '..';

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical');
jest.mock('@kitman/common/src/redux/global/hooks/useGlobal');
jest.mock('@kitman/common/src/redux/global/services/globalApi');

const props = {
  t: i18nextTranslateStub(),
  drugStocks: [
    {
      id: 54,
      drug_type: 'FdbDispensableDrug',
      drug: {
        id: 28,
        name: 'aminolevulinic acid HCl 20 % topical solution',
        dispensable_drug_id: '150124',
        med_strength: '20',
        med_strength_unit: '20%',
        dose_form_desc: 'solution',
        route_desc: 'topical',
        drug_name_desc: 'aminolevulinic acid HCl',
      },
      lot_number: '901A2',
      expiration_date: '2023-02-24',
      quantity: 5.0,
      dispensed_quantity: 40.0,
    },
    {
      id: 38,
      drug_type: 'FdbDispensableDrug',
      drug: {
        id: 21,
        name: 'Bard Latex Leg Straps',
        dispensable_drug_id: '257978',
        med_strength: null,
        med_strength_unit: null,
        dose_form_desc: 'Miscellaneous',
        route_desc: 'miscellaneous',
        drug_name_desc: 'Bard Latex Leg Straps',
      },
      lot_number: 'A2435',
      expiration_date: '2023-02-06',
      quantity: 234.0,
      dispensed_quantity: 63.0,
    },
    {
      id: 39,
      drug_type: 'FdbDispensableDrug',
      drug: {
        id: 22,
        name: 'Minimum data',
      },
      lot_number: 'A2435',
      expiration_date: '2023-02-06',
      quantity: 234.0,
      dispensed_quantity: 63.0,
    },
  ],
};

describe('<StockList/>', () => {
  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const store = storeFake({
    global: {
      useGlobal: jest.fn(),
      useGetOrganisationQuery: jest.fn(),
      useGetPermissionsQuery: jest.fn(),
    },
    medicalSharedApi: {
      useGetMedicationListSourcesQuery: jest.fn(),
    },
  });

  window.featureFlags['medications-general-availability'] = true;

  useGlobal.mockReturnValue({
    isLoading: false,
    hasFailed: false,
    isSuccess: true,
  });

  useGetOrganisationQuery.mockReturnValue({
    data: {
      id: 66,
    },
    isError: false,
    isSuccess: true,
  });

  useGetPermissionsQuery.mockReturnValue({
    data: {
      medical: {
        stockManagement: {
          canAdd: false,
          canRemove: false,
        },
      },
    },
    isSuccess: true,
  });

  it('renders correct table header columns', async () => {
    render(
      <Provider store={store}>
        <StockList {...props} />
      </Provider>
    );

    const tableColumnHeaders = screen.getAllByRole('columnheader');

    // NOTE: // If can remove stock permission were on then moreActions would add 1 more cell
    expect(tableColumnHeaders).toHaveLength(7);

    expect(tableColumnHeaders[0]).toHaveTextContent('Name');
    expect(tableColumnHeaders[1]).toHaveTextContent('Strength');
    expect(tableColumnHeaders[2]).toHaveTextContent('Type');
    expect(tableColumnHeaders[3]).toHaveTextContent('Lot no.');
    expect(tableColumnHeaders[4]).toHaveTextContent('Exp. date');
    expect(tableColumnHeaders[5]).toHaveTextContent('Dispensed');
    expect(tableColumnHeaders[6]).toHaveTextContent('On hand');
  });

  it('renders correct table cell values', async () => {
    act(() => {
      render(<StockList {...props} />);
    });

    // There will be 3 rows including the table header, we want [1] onwards
    const tableRow = screen.getAllByRole('row')[1];

    // This will be a stock list row, 8 cell values
    expect(within(tableRow).getAllByRole('cell')).toHaveLength(7);

    const cellValues = within(tableRow).getAllByRole('cell');

    expect(cellValues[0]).toHaveTextContent('aminolevulinic acid HCl');
    expect(cellValues[1]).toHaveTextContent('20');
    expect(cellValues[2]).toHaveTextContent('solution');
    expect(cellValues[3]).toHaveTextContent('901A2');

    // Expiration date. value is formatted on front-end
    expect(cellValues[4]).toHaveTextContent('Feb 24, 2023');
    expect(cellValues[5]).toHaveTextContent('40');
    expect(cellValues[6]).toHaveTextContent('5');

    // Test the 3rd stock
    const stockRow3 = screen.getAllByRole('row')[3];
    expect(within(stockRow3).getAllByRole('cell')).toHaveLength(7);
    const cellValuesStockRow3 = within(stockRow3).getAllByRole('cell');

    const stockRow3Values = props.drugStocks[2];
    expect(cellValuesStockRow3[0]).toHaveTextContent(stockRow3Values.drug.name);
    expect(cellValuesStockRow3[1]).toHaveTextContent('--');
    expect(cellValuesStockRow3[2]).toHaveTextContent('--');
    expect(cellValuesStockRow3[3]).toHaveTextContent(
      stockRow3Values.lot_number
    );
    expect(cellValuesStockRow3[4]).toHaveTextContent('Feb 6, 2023');
    expect(cellValuesStockRow3[5]).toHaveTextContent('63');
    expect(cellValuesStockRow3[6]).toHaveTextContent('234');
  });

  it('[permissions] - prevents stock tooltip render if permissions.medical.stockManagement.canRemove is false', async () => {
    useGetPermissionsQuery.mockReturnValue({
      data: {
        medical: {
          stockManagement: {
            canAdd: true,
            canRemove: false,
          },
        },
      },
      isSuccess: true,
    });

    render(
      <Provider store={store}>
        <StockList {...props} />
      </Provider>
    );

    // There will be 3 rows including the table header, we want [1] onwards
    const tableRow = screen.getAllByRole('row')[1];

    // This will be a stock list row, 8 cell values without .canRemove permissions
    expect(within(tableRow).getAllByRole('cell')).toHaveLength(7);

    expect(screen.queryByTestId('StockList|Actions')).not.toBeInTheDocument();
  });

  it('[permissions] - does show stock tooltip render if permissions.medical.stockManagement.canRemove is true', async () => {
    useGetPermissionsQuery.mockReturnValue({
      data: {
        medical: {
          stockManagement: {
            canAdd: true,
            canRemove: true,
          },
        },
      },
      isSuccess: true,
    });

    render(
      <Provider store={store}>
        <StockList {...props} />
      </Provider>
    );

    // There will be 3 rows including the table header, we want [1] onwards
    const tableRow = screen.getAllByRole('row')[1];

    // This will be a stock list row, 9 cell values with .canRemove tooltip #9
    expect(within(tableRow).getAllByRole('cell')).toHaveLength(8);

    // two tooltip items for the two rows we provide in drugStocks prop
    expect(screen.queryAllByTestId('StockList|Actions')).toHaveLength(3);
  });
});
