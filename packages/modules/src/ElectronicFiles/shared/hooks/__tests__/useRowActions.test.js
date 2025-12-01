import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { MENU_ITEM } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import { data as inboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/fetchInboundElectronicFile.mock';
import { data as contactsData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/searchContactList.mock';
import {
  useUpdateViewedMutation,
  useUpdateArchivedMutation,
  useUpdateContactsArchivedMutation,
} from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import useRowActions from '@kitman/modules/src/ElectronicFiles/shared/hooks/useRowActions';

jest.mock(
  '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles'
    ),
    useUpdateViewedMutation: jest.fn(),
    useUpdateArchivedMutation: jest.fn(),
    useUpdateContactsArchivedMutation: jest.fn(),
  })
);

const mockUpdateViewedMutation = jest.fn();
const mockUpdateArchivedMutation = jest.fn();
const mockUpdateContactsArchivedMutation = jest.fn();

let store;
let renderHookResult;
const actAndRenderHook = async (
  row = inboundData.data,
  selectedMenuItem = MENU_ITEM.inbox
) => {
  store = storeFake({
    sidebarSlice: {
      selectedMenuItem,
    },
  });
  await act(async () => {
    renderHookResult = renderHook(() => useRowActions({ row }), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    }).result;
  });
};

describe('useRowActions', () => {
  beforeEach(() => {
    useUpdateViewedMutation.mockReturnValue([mockUpdateViewedMutation], {
      isLoading: false,
    });
    useUpdateArchivedMutation.mockReturnValue([mockUpdateArchivedMutation], {
      isLoading: false,
    });
    useUpdateContactsArchivedMutation.mockReturnValue(
      [mockUpdateContactsArchivedMutation],
      {
        isLoading: false,
      }
    );
  });

  it('returns an array with the correct row actions', async () => {
    await actAndRenderHook();

    expect(renderHookResult.current.rowActionComponents).toHaveLength(2);

    renderHookResult.current.rowActions
      .filter((rowAction) => !rowAction.hidden)
      .forEach((rowAction, index) => {
        expect(
          renderHookResult.current.rowActionComponents[index].props.label
        ).toEqual(rowAction.label);
      });
  });

  it('returns only toggleArchived action when the electronicFile is archived', async () => {
    await actAndRenderHook({
      ...inboundData.data,
      archived: true,
    });

    expect(renderHookResult.current.rowActions[0].label).toEqual(
      'Mark as read'
    );
    expect(renderHookResult.current.rowActions[0].hidden).toEqual(true);
    expect(renderHookResult.current.rowActions[1].label).toEqual('Unarchive');
    expect(renderHookResult.current.rowActions[1].hidden).toEqual(false);

    expect(renderHookResult.current.rowActionComponents).toHaveLength(1);
    expect(renderHookResult.current.rowActionComponents[0].props.label).toEqual(
      'Unarchive'
    );
  });

  it('returns only updateContact, and onToggleContactsArchived actions when selectedMenuItem is contacts', async () => {
    await actAndRenderHook(contactsData.data[0], MENU_ITEM.contacts);

    expect(renderHookResult.current.rowActions[2].label).toEqual('Edit');
    expect(renderHookResult.current.rowActions[2].hidden).toEqual(false);

    expect(renderHookResult.current.rowActions[3].label).toEqual('Archive');
    expect(renderHookResult.current.rowActions[3].hidden).toEqual(false);

    expect(renderHookResult.current.rowActionComponents).toHaveLength(2);
    expect(renderHookResult.current.rowActionComponents[0].props.label).toEqual(
      'Edit'
    );
    expect(renderHookResult.current.rowActionComponents[1].props.label).toEqual(
      'Archive'
    );
  });

  it('returns a disabled action when the contact is global', async () => {
    await actAndRenderHook(
      { ...contactsData.data[0], global: true },
      MENU_ITEM.contacts
    );

    expect(renderHookResult.current.rowActions).toHaveLength(0);
    expect(renderHookResult.current.rowActionComponents).toHaveLength(1);
    expect(renderHookResult.current.rowActionComponents[0].props.title).toEqual(
      'This contact is not editable'
    );
  });

  it('calls updateViewed on click', async () => {
    await actAndRenderHook();

    act(() => {
      renderHookResult.current.rowActionComponents[0].props.onClick();
    });

    expect(mockUpdateViewedMutation).toHaveBeenCalledTimes(1);
    expect(mockUpdateViewedMutation).toHaveBeenCalledWith({
      viewed: true,
      inboundElectronicFileIds: [1],
    });
  });

  it('calls updateArchived on click', async () => {
    await actAndRenderHook();

    act(() => {
      renderHookResult.current.rowActionComponents[1].props.onClick();
    });

    expect(mockUpdateArchivedMutation).toHaveBeenCalledTimes(1);
    expect(mockUpdateArchivedMutation).toHaveBeenCalledWith({
      archived: true,
      inboundElectronicFileIds: [1],
    });
  });

  it('calls updateContactsArchived on click', async () => {
    await actAndRenderHook(contactsData.data[0], MENU_ITEM.contacts);

    act(() => {
      renderHookResult.current.rowActionComponents[1].props.onClick();
    });

    expect(mockUpdateContactsArchivedMutation).toHaveBeenCalledTimes(1);
    expect(mockUpdateContactsArchivedMutation).toHaveBeenCalledWith({
      archived: true,
      contactIds: [1],
    });
  });

  it('calls dispatch updateData from contactDrawerSlice on click', async () => {
    await actAndRenderHook(contactsData.data[0], MENU_ITEM.contacts);

    act(() => {
      renderHookResult.current.rowActionComponents[0].props.onClick();
    });

    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(store.dispatch).toHaveBeenNthCalledWith(1, {
      payload: {
        contact: contactsData.data[0],
      },
      type: 'contactDrawerSlice/updateData',
    });
    expect(store.dispatch).toHaveBeenNthCalledWith(2, {
      payload: true,
      type: 'contactDrawerSlice/updateOpen',
    });
  });
});
