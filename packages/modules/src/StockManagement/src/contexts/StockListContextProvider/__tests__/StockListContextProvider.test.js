import { renderHook, act } from '@testing-library/react-hooks';
import { useStockList, StockListContextProvider } from '..';

const wrapper = ({ children }) => (
  <StockListContextProvider>{children}</StockListContextProvider>
);

describe('<StockListContextProvider />', () => {
  it('returns correct state on TOGGLE_ADD_STOCK_SIDEPANEL', () => {
    const { result } = renderHook(() => useStockList(), { wrapper });
    expect(result.current.stockListState.addStockSidePanel.isOpen).toBeFalsy();
    act(() => {
      result.current.toggleAddStockSidePanel();
    });

    expect(result.current.stockListState.addStockSidePanel.isOpen).toBeTruthy();
  });

  it('returns correct state on TOGGLE_REMOVE_STOCK_SIDEPANEL', () => {
    const { result } = renderHook(() => useStockList(), { wrapper });
    expect(
      result.current.stockListState.removeStockSidePanel.isOpen
    ).toBeFalsy();
    act(() => {
      result.current.toggleRemoveStockSidePanel();
    });

    expect(
      result.current.stockListState.removeStockSidePanel.isOpen
    ).toBeTruthy();
  });

  it('returns correct state on TOGGLE_REMOVE_STOCK_SIDEPANEL with a stockToRemove', () => {
    const { result } = renderHook(() => useStockList(), { wrapper });
    expect(
      result.current.stockListState.removeStockSidePanel.isOpen
    ).toBeFalsy();

    const mockedDrugToRemove = {
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
    };

    act(() => {
      result.current.toggleRemoveStockSidePanel(mockedDrugToRemove);
    });

    expect(
      result.current.stockListState.removeStockSidePanel.isOpen
    ).toBeTruthy();

    expect(result.current.stockListState.stockToRemove.id).toEqual(54);

    expect(result.current.stockListState.stockToRemove.drug.name).toEqual(
      'aminolevulinic acid HCl 20 % topical solution'
    );
  });
});
