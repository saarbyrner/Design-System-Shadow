import moment from 'moment';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import userMovementDrawerSlice, {
  onReset,
  onToggleDrawer,
  onUpdateMovementForm,
  onSetDrawerStep,
  onSetProfile,
} from '../userMovementDrawerSlice';

import { data } from '../../services/mocks/data/mock_search_athletes';

const getInitialState = () => ({
  profile: null,
  drawer: {
    isOpen: false,
  },
  step: 0,
  form: {
    user_id: null,
    transfer_type: null,
    join_organisation_ids: [],
    leave_organisation_ids: [],
    joined_at: moment().format(dateTransferFormat),
  },
});

describe('[userMovementDrawerSlice]', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-05-12T10:00:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const initialState = getInitialState();
    const expectedState = getInitialState();

    expect(userMovementDrawerSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  it('should correctly reset', () => {
    const action = onReset();
    const initialState = getInitialState();
    const expectedState = getInitialState();
    const updatedState = userMovementDrawerSlice.reducer(initialState, action);
    expect(updatedState).toEqual(expectedState);
  });

  it('should onSetPanelState', () => {
    const action = onToggleDrawer();
    const initialState = getInitialState();
    const updatedState = userMovementDrawerSlice.reducer(initialState, action);
    expect(updatedState.drawer).toEqual({
      isOpen: true,
    });
  });

  it('should onUpdateMovementForm', () => {
    const action = onUpdateMovementForm({ transfer_type: 'medical_trial' });
    const initialState = getInitialState();
    const updatedState = userMovementDrawerSlice.reducer(initialState, action);
    expect(updatedState.form).toEqual({
      ...initialState.form,
      transfer_type: 'medical_trial',
    });
  });

  it('should onSetDrawerStep', () => {
    const action = onSetDrawerStep({ step: 42 });
    const initialState = getInitialState();
    const updatedState = userMovementDrawerSlice.reducer(initialState, action);
    expect(updatedState.step).toEqual(42);
  });
  it('should onSetProfile', () => {
    const action = onSetProfile({ profile: data[0] });
    const initialState = getInitialState();
    const updatedState = userMovementDrawerSlice.reducer(initialState, action);
    expect(updatedState.profile).toStrictEqual(data[0]);
  });
});
