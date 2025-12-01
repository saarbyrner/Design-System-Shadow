import $ from 'jquery';
import { renderHook } from '@testing-library/react-hooks';

import { preliminaryConfigurationFlowIsActive } from '@kitman/modules/src/Medical/shared/utils/isFeatureActive';
import { MOCK_RESPONSE } from '../../services/getIssueFieldsConfig';
import useIssueFields from '../useIssueFields';

jest.mock('@kitman/modules/src/Medical/shared/utils/isFeatureActive', () => ({
  preliminaryConfigurationFlowIsActive: jest.fn(),
}));

describe('useIssueFields', () => {
  let ajaxSpy;

  beforeEach(() => {
    ajaxSpy = jest.spyOn($, 'ajax').mockImplementation((options) => {
      const { url } = options || {};
      if (url === '/ui/fields/medical/issues/create_params') {
        return $.Deferred().resolveWith(null, [MOCK_RESPONSE]);
      }
      return $.Deferred().resolveWith(null, [{}]);
    });
    preliminaryConfigurationFlowIsActive.mockReturnValue(false);
  });

  afterEach(() => {
    ajaxSpy.mockRestore();
    preliminaryConfigurationFlowIsActive.mockRestore();
  });

  describe('when using the validate function', () => {
    it('will validate all fields that are marked as shouldValidate', async () => {
      const { result } = renderHook(() => useIssueFields('injury'));
      await Promise.resolve();

      expect(
        result.current.validate({
          annotations: [
            {
              attachmentContent: { filesQueue: ['abcd'], content: '' },
            },
          ],
        })
      ).toEqual(['annotations']);
    });

    it('will validate all mandatory fields when validation is preliminary', async () => {
      const { result } = renderHook(() => useIssueFields('injury'));
      await Promise.resolve();

      expect(
        result.current.validate(
          { athlete_id: null, primary_pathology_id: null },
          'preliminary'
        )
      ).toEqual(['athlete_id', 'primary_pathology_id']);
    });

    it('will validate all mandatory and must_have fields when validation is full', async () => {
      const { result } = renderHook(() => useIssueFields('injury'));
      await Promise.resolve();

      expect(
        result.current.validate(
          { athlete_id: null, primary_pathology_id: null },
          'full'
        )
      ).toEqual(['athlete_id', 'primary_pathology_id']);
    });

    it('returns empty if all fields are valid', async () => {
      const { result } = renderHook(() => useIssueFields('injury'));
      await Promise.resolve();

      expect(
        result.current.validate(
          { athlete_id: 123, primary_pathology_id: 246 },
          'full'
        ).length
      ).toBe(0);
    });

    describe('when validating events', () => {
      it('returns the index of the invalid status appended to key', async () => {
        const { result } = renderHook(() => useIssueFields('injury'));
        await Promise.resolve();

        expect(
          result.current.validate(
            {
              events: [
                { status: 'Resolved', date: '' },
                { status: '', date: '' },
              ],
            },
            'full'
          )
        ).toEqual(['events_1']);

        expect(
          result.current.validate(
            {
              events: [
                { status: 'Causing Unavailability', date: '' },
                { status: 'Causing Unavailability', date: '' },
                { status: 'Resolved', date: '' },
              ],
            },
            'full'
          )
        ).toEqual(['events_1']);
      });
    });
  });

  describe('when determining visible fields', () => {
    it('returns true if a field is returned in response', async () => {
      const { result } = renderHook(() => useIssueFields('injury'));
      await Promise.resolve();

      expect(result.current.isFieldVisible('athlete_id')).toBe(true);
    });

    it('returns false if a field is returned in response', async () => {
      const { result } = renderHook(() => useIssueFields('injury'));
      await Promise.resolve();

      expect(result.current.isFieldVisible('sports_selector')).toBe(false);
    });

    it('returns undefined for a non-existent field using getFieldConfig', async () => {
      const { result } = renderHook(() => useIssueFields('injury'));
      await Promise.resolve();

      expect(
        result.current.getFieldConfig('non_existent_field')
      ).toBeUndefined();
    });
  });

  describe('when using the getFieldLabel function', () => {
    it('returns the correct label when labelGetter is used with a true condition', async () => {
      const { result } = renderHook(() => useIssueFields('injury'));
      await Promise.resolve();

      expect(result.current.getFieldLabel('occurrence_date', true)).toBe(
        'New record date'
      );
    });

    it('returns the correct label when labelGetter is used with a false condition', async () => {
      const { result } = renderHook(() => useIssueFields('injury'));
      await Promise.resolve();

      expect(result.current.getFieldLabel('occurrence_date', false)).toBe(
        'Onset date'
      );
    });

    it('returns the direct label when labelGetter is not defined', async () => {
      const { result } = renderHook(() => useIssueFields('injury'));
      await Promise.resolve();

      expect(result.current.getFieldLabel('reported_date')).toBe(
        'Reported date'
      );
    });

    it('returns an empty string for a non-existent field', async () => {
      const { result } = renderHook(() => useIssueFields('injury'));
      await Promise.resolve();

      expect(result.current.getFieldLabel('non_existent_field')).toBe('');
    });
  });

  describe('when preliminaryConfigurationFlowIsActive is true', () => {
    beforeEach(() => {
      preliminaryConfigurationFlowIsActive.mockReturnValue(true);
    });

    it('fieldConfigRequestStatus remains null', async () => {
      const { result } = renderHook((props) => useIssueFields(props), {
        initialProps: {
          issueType: 'injury',
          skip: false,
          serverConfig: { common_fields: {}, injury_fields: {} },
        },
      });
      await Promise.resolve();

      expect(result.current.fieldConfigRequestStatus).toBe(null);
    });

    it('does not call getIssueFieldsConfig service', async () => {
      renderHook((props) => useIssueFields(props), {
        initialProps: {
          issueType: 'injury',
          skip: false,
          serverConfig: { common_fields: {}, injury_fields: {} },
        },
      });
      await Promise.resolve();

      expect(ajaxSpy).not.toHaveBeenCalled();
    });

    it('uses serverConfigFromProps for fieldConfig', async () => {
      const mockServerConfig = {
        athlete: { id: 'mandatory' },
        primary_pathology: 'must_have',
      };
      const { result } = renderHook((props) => useIssueFields(props), {
        initialProps: {
          issueType: 'injury',
          skip: false,
          serverConfig: mockServerConfig,
        },
      });
      await Promise.resolve();

      expect(result.current.isFieldVisible('athlete_id')).toBe(true);
      expect(result.current.isFieldVisible('primary_pathology_id')).toBe(true);
      expect(result.current.isFieldVisible('sports_selector')).toBe(false); // Not in mockServerConfig
    });

    it('merges clientConfig correctly with preliminaryServerConfig', async () => {
      const mockServerConfig = {
        athlete: { id: 'mandatory' },
        primary_pathology: 'must_have',
      };
      const { result } = renderHook((props) => useIssueFields(props), {
        initialProps: {
          issueType: 'injury',
          skip: false,
          serverConfig: mockServerConfig,
        },
      });
      await Promise.resolve();

      // athlete_id and primary_pathology_id are from serverConfigFromProps
      expect(result.current.getFieldConfig('athlete_id').constraint).toBe(
        'mandatory'
      );
      expect(
        result.current.getFieldConfig('primary_pathology_id').constraint
      ).toBe('must_have');
      // reported_date is from clientConfig
      expect(result.current.isFieldVisible('reported_date')).toBe(true);
    });
  });

  describe('when preliminaryConfigurationFlowIsActive is false', () => {
    beforeEach(() => {
      preliminaryConfigurationFlowIsActive.mockReturnValue(false);
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('fieldConfigRequestStatus remains null when skip is true', async () => {
      const { result } = renderHook((props) => useIssueFields(props), {
        initialProps: {
          issueType: 'injury',
          skip: true,
          serverConfig: {},
        },
      });
      await Promise.resolve();
      expect(result.current.fieldConfigRequestStatus).toBe(null);
      expect(ajaxSpy).not.toHaveBeenCalled();
    });

    it('fieldConfigRequestStatus is SUCCESS on successful API call when skip is false', async () => {
      const { result } = renderHook((props) => useIssueFields(props), {
        initialProps: {
          issueType: 'injury',
          skip: false,
          serverConfig: {},
        },
      });
      jest.advanceTimersByTime(0);
      await Promise.resolve();

      expect(result.current.fieldConfigRequestStatus).toBe('SUCCESS');
      expect(ajaxSpy).toHaveBeenCalledTimes(1);
    });

    it('fieldConfigRequestStatus is FAILURE on failed API call when skip is false', async () => {
      ajaxSpy.mockImplementationOnce(() => $.Deferred().reject());
      const { result, waitForNextUpdate } = renderHook(
        (props) => useIssueFields(props),
        {
          initialProps: {
            issueType: 'injury',
            skip: false,
            serverConfig: {},
          },
        }
      );
      jest.advanceTimersByTime(0);
      await waitForNextUpdate();

      expect(result.current.fieldConfigRequestStatus).toBe('FAILURE');
      expect(ajaxSpy).toHaveBeenCalledTimes(1);
    });

    it('fieldConfig uses configResponse (from API) when skip is false', async () => {
      const mockApiConfig = {
        common_fields: { athlete_id: { constraint: 'mandatory' } },
        injury_fields: { primary_pathology_id: { constraint: 'must_have' } },
        illness_fields: {},
      };
      ajaxSpy.mockImplementationOnce(() =>
        $.Deferred().resolveWith(null, [mockApiConfig])
      );

      const { result } = renderHook((props) => useIssueFields(props), {
        initialProps: {
          issueType: 'injury',
          skip: false,
          serverConfig: {},
        },
      });
      jest.advanceTimersByTime(0);
      await Promise.resolve();

      expect(result.current.getFieldConfig('athlete_id').constraint).toBe(
        'mandatory'
      );
      expect(
        result.current.getFieldConfig('primary_pathology_id').constraint
      ).toBe('must_have');
      expect(result.current.isFieldVisible('reported_date')).toBe(true);
      expect(result.current.isFieldVisible('illness_onset_id')).toBe(true);
    });
  });

  describe('when using isFieldVisibleByType and getFieldLabelByType with dynamic values', () => {
    it('returns false for a truly non-existent field for any issueType', async () => {
      const { result } = renderHook(() => useIssueFields('injury'));
      await Promise.resolve();
      expect(
        result.current.isFieldVisibleByType({
          injury: 'non_existent_field',
          illness: 'non_existent_field',
        })
      ).toBe(false);
    });

    it('returns "Previous injury" for recurrence_id when issueType is injury and selectedIssueType is INJURY_RECURRENCE', async () => {
      const { result } = renderHook(() => useIssueFields('injury'));
      await Promise.resolve();
      expect(
        result.current.getFieldLabelByType(
          { injury: 'reccurrence_id', illness: 'reccurrence_id' },
          'INJURY_RECURRENCE'
        )
      ).toBe('Previous injury');
    });

    it('returns "Previous illness" for recurrence_id when issueType is illness and selectedIssueType is ILLNESS_RECURRENCE', async () => {
      const { result } = renderHook(() => useIssueFields('illness'));
      await Promise.resolve();
      expect(
        result.current.getFieldLabelByType(
          { injury: 'reccurrence_id', illness: 'reccurrence_id' },
          'ILLNESS_RECURRENCE'
        )
      ).toBe('Previous illness');
    });

    it('returns "New record date" for occurrence_date when issueIsAContinuation is true', async () => {
      const { result } = renderHook(() => useIssueFields('injury'));
      await Promise.resolve();
      expect(
        result.current.getFieldLabelByType(
          { injury: 'occurrence_date', illness: 'occurrence_date' },
          true
        )
      ).toBe('New record date');
    });
  });
});
