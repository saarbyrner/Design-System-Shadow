import moment from 'moment';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';

import { response as MOCK_ORG_LIST } from '@kitman/modules/src/UserMovement/shared/redux/services/mocks/data/mock_search_movement_organisation_list';
import { data as MOCK_ATHLETE_LIST } from '@kitman/modules/src/UserMovement/shared/redux/services/mocks/data/mock_search_athletes';

import {
  getDrawerState,
  getFormState,
  getStep,
  getIsNextDisabledFactory,
  getAthleteProfile,
} from '../userMovementDrawerSelectors';

const MOCK_STATE = {
  userMovementDrawerSlice: {
    drawer: {
      isOpen: false,
    },
    step: 0,
    form: {
      user_id: null,
      transfer_type: null,
      join_organisation_ids: [],
      leave_organisation_ids: [],
      joined_date: moment().format(dateTransferFormat),
    },
    profile: MOCK_ATHLETE_LIST[0],
  },
  registrationApi: {
    queries: {
      'fetchAthlete(1)': { data: MOCK_ATHLETE_LIST[0] },
    },
  },
  'UserMovement.services': {
    queries: {
      'searchMovementOrganisationsList({"user_id":1})': {
        data: {
          data: MOCK_ORG_LIST,
        },
      },
    },
  },
};

describe('[userMovementDrawerSelectors] - selectors', () => {
  test('getDrawerState()', () => {
    expect(getDrawerState(MOCK_STATE)).toBe(
      MOCK_STATE.userMovementDrawerSlice.drawer
    );
  });
  test('getFormState()', () => {
    expect(getFormState(MOCK_STATE)).toBe(
      MOCK_STATE.userMovementDrawerSlice.form
    );
  });
  test('getStep()', () => {
    expect(getStep(MOCK_STATE)).toBe(MOCK_STATE.userMovementDrawerSlice.step);
  });
  test('getIsNextDisabledFactory() when is medical_trial', () => {
    const selector = getIsNextDisabledFactory();
    expect(
      selector({
        ...MOCK_STATE,
        userMovementDrawerSlice: {
          drawer: {
            isOpen: false,
          },
          step: 0,
          form: {
            user_id: 1,
            transfer_type: 'medical_trial',
            join_organisation_ids: [11],
            leave_organisation_ids: [11],
            joined_date: moment().format(dateTransferFormat),
          },
        },
      })
    ).toBe(false);
  });

  test('getIsNextDisabledFactory() when is not medical_trial', () => {
    const selector = getIsNextDisabledFactory();
    expect(
      selector({
        ...MOCK_STATE,
        userMovementDrawerSlice: {
          drawer: {
            isOpen: false,
          },
          step: 0,
          form: {
            user_id: 1,
            transfer_type: 'something_else',
            join_organisation_ids: [11],
            leave_organisation_ids: [11],
            joined_date: moment().format(dateTransferFormat),
          },
        },
      })
    ).toBe(true);
  });

  test('getIsNextDisabledFactory() with incomplete data', () => {
    const selector = getIsNextDisabledFactory();
    expect(
      selector({
        ...MOCK_STATE,
        userMovementDrawerSlice: {
          drawer: {
            isOpen: false,
          },
          step: 0,
          form: {
            user_id: 1,
            transfer_type: 'medical_trial',
            join_organisation_ids: [],
            leave_organisation_ids: [11],
            joined_date: moment().format(dateTransferFormat),
          },
        },
      })
    ).toBe(true);
  });

  test('getAthleteProfile()', () => {
    expect(getAthleteProfile(MOCK_STATE)).toBe(MOCK_ATHLETE_LIST[0]);
  });
});
