import { Provider } from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';

import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { useGetConditionalFieldsFormQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { data } from '@kitman/services/src/mocks/handlers/medical/getConditionalFieldsForm';

import { mockedIssue } from '../../services/getAthleteIssue';
import useIssueConditionalQuestionsV2 from '../useIssueConditionalQuestionsV2';

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical');

jest.useFakeTimers();

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  medicalApi: {
    useGetConditionalFieldsFormQuery: jest.fn(),
  },
});

const wrapper = ({ children }) => {
  return <Provider store={defaultStore}>{children}</Provider>;
};

describe('useIssueConditionalQuestionsV2', () => {
  beforeEach(() => {
    window.featureFlags = {
      'conditional-fields-showing-in-ip': true,
      'conditional-fields-v1-stop': true,
    };
    useGetConditionalFieldsFormQuery.mockReturnValue({
      data: [],
      isLoading: true,
    });
  });
  afterEach(() => {
    window.featureFlags = {
      'conditional-fields-showing-in-ip': false,
      'conditional-fields-v1-stop': false,
    };
  });
  describe('[initial data]', () => {
    let renderHookResult;

    it('returns initial data', () => {
      renderHookResult = renderHook(() => useIssueConditionalQuestionsV2({}), {
        wrapper,
      }).result;

      expect(renderHookResult.current).toHaveProperty('conditions');
      expect(renderHookResult.current).toHaveProperty('issueConditionsError');
      expect(renderHookResult.current).toHaveProperty('issueConditionsLoading');
    });
  });

  describe('[computed data]', () => {
    let renderHookResult;
    describe('isLoading true', () => {
      beforeEach(() => {
        useGetConditionalFieldsFormQuery.mockReturnValue({
          data: { conditions: [] },
          isLoading: true,
          isError: false,
        });
      });
      afterEach(() => {
        jest.clearAllTimers();
      });

      it('responds with loading when expected', () => {
        renderHookResult = renderHook(
          () =>
            useIssueConditionalQuestionsV2({
              mockedIssue,
              coding: {
                [codingSystemKeys.OSICS_10]: {},
              },
              osics: {
                activity_id: 1,
                activity_group_id: 2,
                osics_classification_id: 3,
                osics_pathology_id: 4,
                osics_body_area_id: 5,
                event_type_id: 6,
                illness_onset_id: 7,
              },
            }),
          {
            wrapper,
          }
        ).result;

        expect(renderHookResult.current.issueConditionsLoading).toBeTruthy();
        expect(renderHookResult.current.issueConditionsError).toBeFalsy();
        expect(renderHookResult.current.conditions).toStrictEqual([]);
      });
    });
    describe('isError true', () => {
      beforeEach(() => {
        useGetConditionalFieldsFormQuery.mockReturnValue({
          data: { conditions: [] },
          isLoading: false,
          isError: true,
        });
      });
      afterEach(() => {
        jest.clearAllTimers();
      });

      it('responds with error when expected', () => {
        renderHookResult = renderHook(
          () =>
            useIssueConditionalQuestionsV2({
              mockedIssue,
              coding: {
                [codingSystemKeys.OSICS_10]: {},
              },
              osics: {
                activity_id: 1,
                activity_group_id: 2,
                osics_classification_id: 3,
                osics_pathology_id: 4,
                osics_body_area_id: 5,
                event_type_id: 6,
                illness_onset_id: 7,
              },
            }),
          {
            wrapper,
          }
        ).result;

        expect(renderHookResult.current.issueConditionsError).toBeTruthy();
        expect(renderHookResult.current.issueConditionsLoading).toBeFalsy();
        expect(renderHookResult.current.conditions).toStrictEqual([]);
      });
    });
    describe('successful response', () => {
      beforeEach(() => {
        useGetConditionalFieldsFormQuery.mockReturnValue({
          data,
          isLoading: false,
          isError: false,
        });
      });
      afterEach(() => {
        jest.clearAllTimers();
      });

      it('responds with data when expected', () => {
        const { conditions } = data;
        renderHookResult = renderHook(
          () =>
            useIssueConditionalQuestionsV2({
              mockedIssue,
              coding: {
                [codingSystemKeys.OSICS_10]: {},
              },
              osics: {
                activity_id: 1,
                activity_group_id: 2,
                osics_classification_id: 3,
                osics_pathology_id: 4,
                osics_body_area_id: 5,
                event_type_id: 6,
                illness_onset_id: 7,
              },
            }),
          {
            wrapper,
          }
        ).result;

        expect(renderHookResult.current.issueConditionsError).toBeFalsy();
        expect(renderHookResult.current.issueConditionsLoading).toBeFalsy();
        expect(renderHookResult.current.conditions).toStrictEqual(conditions);
      });
    });
  });
});
