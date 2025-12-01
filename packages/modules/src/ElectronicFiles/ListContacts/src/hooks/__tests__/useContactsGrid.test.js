import { renderHook, act } from '@testing-library/react-hooks';
import { data as contactsData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/searchContactList.mock';
import ReduxProvider from '@kitman/modules/src/ElectronicFiles/shared/redux/provider';
import { FIELD_KEY } from '@kitman/modules/src/ElectronicFiles/shared/types';
import useContactsGrid, {
  getEmptyTableText,
} from '@kitman/modules/src/ElectronicFiles/ListContacts/src/hooks/useContactsGrid';

const wrapper = ReduxProvider;
let renderHookResult;
const actAndRenderHook = async () => {
  await act(async () => {
    renderHookResult = renderHook(() => useContactsGrid(), {
      wrapper,
    }).result;
  });
};

describe('useContactsGrid', () => {
  describe('[initial data]', () => {
    it('returns initial data', async () => {
      await actAndRenderHook();

      expect(renderHookResult.current).toHaveProperty('isContactListError');
      expect(renderHookResult.current).toHaveProperty('isContactListFetching');
      expect(renderHookResult.current).toHaveProperty('grid');
      expect(renderHookResult.current.grid).toHaveProperty('rows');
      expect(renderHookResult.current.grid).toHaveProperty('columns');
      expect(renderHookResult.current.grid).toHaveProperty('emptyTableText');
      expect(renderHookResult.current.grid).toHaveProperty('id');
      expect(renderHookResult.current.grid.emptyTableText).toEqual(
        'No contacts found'
      );
      expect(renderHookResult.current.grid.id).toEqual('contactsGrid');
      expect(renderHookResult.current.grid.columns[1].field).toEqual(
        FIELD_KEY.name
      );
      expect(renderHookResult.current.grid.columns[2].field).toEqual(
        FIELD_KEY.company_name
      );
      expect(renderHookResult.current.grid.columns[3].field).toEqual(
        FIELD_KEY.fax_number
      );
    });
  });

  describe('[computed data]', () => {
    it('fetches the contacts', async () => {
      await actAndRenderHook();

      expect(renderHookResult.current.grid.rows.length).toEqual(
        contactsData.data.length
      );
    });

    it('has the correct grid.rows', async () => {
      await actAndRenderHook();

      expect(renderHookResult.current.grid.rows.length).toEqual(
        contactsData.data.length
      );
      const rows = renderHookResult.current.grid.rows;

      rows.forEach((row, index) => {
        expect(row.id).toEqual(contactsData.data[index].id);
      });
    });
  });
});

describe('getEmptyTableText', () => {
  it('show the correct text when the there is no data', () => {
    expect(getEmptyTableText({ query: '' })).toEqual('No contacts found');
  });
});
