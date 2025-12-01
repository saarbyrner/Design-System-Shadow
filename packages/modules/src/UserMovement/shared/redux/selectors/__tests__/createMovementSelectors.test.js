import moment from 'moment';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';

import { response as MOCK_ORG_LIST } from '@kitman/modules/src/UserMovement/shared/redux/services/mocks/data/mock_search_movement_organisation_list';
import { data as MOCK_ATHLETE_LIST } from '@kitman/modules/src/UserMovement/shared/redux/services/mocks/data/mock_search_athletes';

import { REDUCER_KEY } from '../../slices/createMovementSlice';

import {
  getDrawerState,
  getFormState,
  getModalState,
  getFieldValidationFactory,
  getMovingToOrganisationFactory,
} from '../createMovementSelectors';

const MOCK_STATE = {
  [REDUCER_KEY]: {
    drawer: {
      isOpen: false,
    },
    modal: {
      isOpen: false,
    },
    form: {
      user_id: null,
      transfer_type: null,
      join_organisation_ids: [115],
      leave_organisation_ids: [],
      joined_date: moment().format(dateTransferFormat),
    },
    validation: {
      user_id: {
        status: 'PENDING',
        message: 'A message',
      },
    },
  },
  registrationApi: {
    queries: {
      'fetchAthlete(1)': { data: MOCK_ATHLETE_LIST[0] },
    },
  },
  'UserMovement.services': {
    queries: {
      'searchMovementOrganisationsList({"user_id":1})': {
        data: MOCK_ORG_LIST,
      },
    },
  },
};

describe('[createMovementSelectors] - selectors', () => {
  test('getDrawerState()', () => {
    expect(getDrawerState(MOCK_STATE)).toBe(MOCK_STATE[REDUCER_KEY].drawer);
  });
  test('getFormState()', () => {
    expect(getFormState(MOCK_STATE)).toBe(MOCK_STATE[REDUCER_KEY].form);
  });
  test('getModalState()', () => {
    expect(getModalState(MOCK_STATE)).toBe(MOCK_STATE[REDUCER_KEY].modal);
  });
  test('getFieldValidationFactory()', () => {
    const selector = getFieldValidationFactory('user_id');
    expect(selector(MOCK_STATE)).toStrictEqual({
      status: 'PENDING',
      message: 'A message',
    });
  });
  test('getMovingToOrganisationFactory()', () => {
    const selector = getMovingToOrganisationFactory(MOCK_ORG_LIST);
    expect(selector(MOCK_STATE)).toStrictEqual(MOCK_ORG_LIST[0]);
  });
});
