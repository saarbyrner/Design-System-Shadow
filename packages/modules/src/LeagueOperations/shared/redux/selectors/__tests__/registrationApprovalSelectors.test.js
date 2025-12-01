import { submitAssertions } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import { REDUCER_KEY as registrationApprovalSlice } from '../../slices/registrationApprovalSlice';

import {
  getIsPanelOpen,
  getIsSubmitStatusDisabled,
  getSelectedApprovalStatus,
  getSelectedApprovalAnnotation,
  getIsSubmitDisabledFactory,
} from '../registrationApprovalSelectors';

const MOCK_STATE = {
  [registrationApprovalSlice]: {
    panel: {
      isOpen: false,
    },
    approval: {
      status: null,
      annotation: 'an annotation',
    },
  },
};

describe('[registrationApprovalSelectors] - selectors', () => {
  test('getIsPanelOpen()', () => {
    expect(getIsPanelOpen(MOCK_STATE)).toStrictEqual(false);
  });

  test('getIsSubmitStatusDisabled()', () => {
    expect(getIsSubmitStatusDisabled(MOCK_STATE)).toStrictEqual(true);
  });
  test('getSelectedApprovalStatus()', () => {
    expect(
      getSelectedApprovalStatus({
        [registrationApprovalSlice]: {
          approval: {
            status: 'pending_organisation',
            annotation: 'an annotation',
          },
        },
      })
    ).toStrictEqual('pending_organisation');
  });
  test('getSelectedApprovalAnnotation()', () => {
    expect(getSelectedApprovalAnnotation(MOCK_STATE)).toStrictEqual(
      'an annotation'
    );
  });
  describe('getIsSubmitDisabledFactory() without an annotation', () => {
    test.each(submitAssertions.sansAnotation)(
      'it resolves correctly as $expected when $status without an annotation',
      ({ status, expected }) => {
        const localState = {
          [registrationApprovalSlice]: {
            approval: {
              status,
              annotation: '',
            },
          },
        };
        const selector = getIsSubmitDisabledFactory();
        expect(selector(localState)).toBe(expected);
      }
    );
    test.each(submitAssertions.withAnnotation)(
      'it resolves correctly as $expected when $status with an annotation',
      ({ status, expected, annotation }) => {
        const localState = {
          [registrationApprovalSlice]: {
            approval: {
              status,
              annotation,
            },
          },
        };
        const selector = getIsSubmitDisabledFactory();
        expect(selector(localState)).toBe(expected);
      }
    );
  });
});
