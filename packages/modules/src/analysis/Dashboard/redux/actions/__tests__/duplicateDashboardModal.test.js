import $ from 'jquery';
import {
  fakeAjaxSuccess,
  fakeAjaxFailure,
} from '@kitman/modules/src/analysis/Dashboard/utils/ajaxMocks';
import {
  openDuplicateDashboardModal,
  changeDuplicateDashboardName,
  changeDuplicateDashboardSelectedSquad,
  closeDuplicateDashboardAppStatus,
  closeDuplicateDashboardModal,
  duplicateDashboardLoading,
  duplicateDashboardSuccess,
  duplicateDashboardFailure,
  saveDuplicateDashboard,
} from '../duplicateDashboardModal';

jest.useFakeTimers();

describe('duplicateDashboard actions', () => {
  it('openDuplicateDashboardModal creates correct action', () => {
    const action = openDuplicateDashboardModal('Test Dashboard');
    expect(action).toEqual({
      type: 'OPEN_DUPLICATE_DASHBOARD_MODAL',
      payload: { dashboardName: 'Test Dashboard' },
    });
  });

  it('changeDuplicateDashboardName creates correct action', () => {
    const action = changeDuplicateDashboardName('New Name');
    expect(action).toEqual({
      type: 'CHANGE_DUPLICATE_DASHBOARD_NAME',
      payload: { dashboardName: 'New Name' },
    });
  });

  it('changeDuplicateDashboardSelectedSquad creates correct action', () => {
    const squad = { id: 1, name: 'Squad A' };
    const action = changeDuplicateDashboardSelectedSquad(squad);
    expect(action).toEqual({
      type: 'CHANGE_DUPLICATE_DASHBOARD_SELECTED_SQUAD',
      payload: { selectedSquad: squad },
    });
  });

  it('closeDuplicateDashboardAppStatus creates correct action', () => {
    expect(closeDuplicateDashboardAppStatus()).toEqual({
      type: 'CLOSE_DUPLICATE_DASHBOARD_APP_STATUS',
    });
  });

  it('closeDuplicateDashboardModal creates correct action', () => {
    expect(closeDuplicateDashboardModal()).toEqual({
      type: 'CLOSE_DUPLICATE_DASHBOARD_MODAL',
    });
  });

  it('duplicateDashboardLoading creates correct action', () => {
    expect(duplicateDashboardLoading()).toEqual({
      type: 'DUPLICATE_DASHBOARD_LOADING',
    });
  });

  it('duplicateDashboardSuccess creates correct action', () => {
    expect(duplicateDashboardSuccess()).toEqual({
      type: 'DUPLICATE_DASHBOARD_SUCCESS',
    });
  });

  it('duplicateDashboardFailure creates correct action', () => {
    expect(duplicateDashboardFailure()).toEqual({
      type: 'DUPLICATE_DASHBOARD_FAILURE',
    });
  });
});

describe('saveDuplicateDashboard thunk', () => {
  const getStateBase = {
    dashboard: {
      activeDashboard: {
        id: 123,
        name: 'Dashboard',
      },
    },
    duplicateDashboardModal: {
      dashboardName: 'Dashboard copy',
    },
  };

  let dispatch;
  const originalLocation = window.location;

  beforeEach(() => {
    dispatch = jest.fn();
    delete window.location;
    window.location = {
      ...originalLocation,
      assign: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
    window.location = originalLocation;
  });

  it('dispatches success and redirects when targetSquadId !== activeSquadId', () => {
    const getState = () => ({
      ...getStateBase,
      duplicateDashboardModal: {
        ...getStateBase.duplicateDashboardModal,
        activeSquad: { id: 123 },
        selectedSquad: { id: 456 },
      },
    });

    $.ajax = jest
      .fn()
      .mockImplementationOnce(() => fakeAjaxSuccess({ id: 456 }))
      .mockImplementationOnce(() => fakeAjaxSuccess({}));

    const thunk = saveDuplicateDashboard();
    thunk(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(duplicateDashboardLoading());
    expect(window.location.assign).toHaveBeenCalledWith(
      '/analysis/dashboard/456'
    );

    jest.advanceTimersByTime(1000);
    expect(dispatch).toHaveBeenCalledWith(closeDuplicateDashboardAppStatus());
  });

  it('dispatches success and redirects when targetSquadId === activeSquadId', () => {
    const getState = () => ({
      ...getStateBase,
      duplicateDashboardModal: {
        ...getStateBase.duplicateDashboardModal,
        activeSquad: { id: 789 },
        selectedSquad: { id: 789 },
      },
    });

    $.ajax = jest.fn(() => fakeAjaxSuccess({ id: 789 }));

    const thunk = saveDuplicateDashboard();
    thunk(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(duplicateDashboardLoading());
    expect(dispatch).toHaveBeenCalledWith(duplicateDashboardSuccess());
    expect(window.location.assign).toHaveBeenCalledWith(
      '/analysis/dashboard/789'
    );

    jest.advanceTimersByTime(1000);
    expect(dispatch).toHaveBeenCalledWith(closeDuplicateDashboardAppStatus());
  });

  it('dispatches failure on ajax failure', () => {
    const getState = () => ({
      ...getStateBase,
      duplicateDashboardModal: {
        ...getStateBase.duplicateDashboardModal,
        activeSquad: { id: 123 },
        selectedSquad: { id: 123 },
      },
    });

    $.ajax = jest.fn(() => fakeAjaxFailure());

    const thunk = saveDuplicateDashboard();
    thunk(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(duplicateDashboardLoading());
    expect(dispatch).toHaveBeenCalledWith(duplicateDashboardFailure());
  });
});
