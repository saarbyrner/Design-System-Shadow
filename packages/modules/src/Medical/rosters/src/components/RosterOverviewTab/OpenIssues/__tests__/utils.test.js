import {
  getStatusOptions,
  getDefaultStatusId,
  checkAllUpdatesCompleted,
} from '../utils';

describe('utils', () => {
  describe('getStatusOptions', () => {
    it('should convert injury statuses to select options format', () => {
      const injuryStatuses = [
        { id: 1, description: 'Active' },
        { id: 2, description: 'Recovered' },
        { id: 3, description: 'Under Treatment' },
      ];

      const result = getStatusOptions(injuryStatuses);

      expect(result).toEqual([
        { value: 1, label: 'Active' },
        { value: 2, label: 'Recovered' },
        { value: 3, label: 'Under Treatment' },
      ]);
    });

    it('should return empty array when no statuses provided', () => {
      const result = getStatusOptions([]);
      expect(result).toEqual([]);
    });
  });

  describe('getDefaultStatusId', () => {
    const injuryStatuses = [{ id: 1 }, { id: 2 }, { id: 3 }];

    it('should return status id when matching status_id is found', () => {
      const openIssue = { status_id: 1 };
      const result = getDefaultStatusId(openIssue, injuryStatuses);

      expect(result).toBe(1);
    });

    it('should return null when no matching status_id is found', () => {
      const openIssue = { status_id: 999 };
      const result = getDefaultStatusId(openIssue, injuryStatuses);

      expect(result).toBeNull();
    });

    it('should return null when status_id is null', () => {
      const openIssue = { status_id: null };
      const result = getDefaultStatusId(openIssue, injuryStatuses);

      expect(result).toBeNull();
    });

    it('should return null when status_id is undefined', () => {
      const openIssue = { status_id: undefined };
      const result = getDefaultStatusId(openIssue, injuryStatuses);

      expect(result).toBeNull();
    });

    it('should handle empty injury statuses array', () => {
      const openIssue = { status_id: 1 };
      const result = getDefaultStatusId(openIssue, []);

      expect(result).toBeNull();
    });
  });

  describe('checkAllUpdatesCompleted', () => {
    it('should return false for empty change statuses', () => {
      const result = checkAllUpdatesCompleted({});
      expect(result).toBe(false);
    });

    it('should return true when all statuses are success', () => {
      const changeStatuses = {
        1: 'SUCCESS',
        2: 'SUCCESS',
        3: 'SUCCESS',
      };

      const result = checkAllUpdatesCompleted(changeStatuses);
      expect(result).toBe(true);
    });

    it('should return true when all statuses are error', () => {
      const changeStatuses = {
        1: 'FAILURE',
        2: 'FAILURE',
      };

      const result = checkAllUpdatesCompleted(changeStatuses);
      expect(result).toBe(true);
    });

    it('should return true when statuses are mix of success and error', () => {
      const changeStatuses = {
        1: 'SUCCESS',
        2: 'FAILURE',
        3: 'SUCCESS',
      };

      const result = checkAllUpdatesCompleted(changeStatuses);
      expect(result).toBe(true);
    });

    it('should return false when some statuses are still loading', () => {
      const changeStatuses = {
        1: 'SUCCESS',
        2: 'PENDING',
        3: 'FAILURE',
      };

      const result = checkAllUpdatesCompleted(changeStatuses);
      expect(result).toBe(false);
    });

    it('should return false when all statuses are loading', () => {
      const changeStatuses = {
        1: 'PENDING',
        2: 'PENDING',
      };

      const result = checkAllUpdatesCompleted(changeStatuses);
      expect(result).toBe(false);
    });

    it('should return false when some statuses have unexpected values', () => {
      const changeStatuses = {
        1: 'SUCCESS',
        2: 'PENDING',
        3: 'FAILURE',
      };

      const result = checkAllUpdatesCompleted(changeStatuses);
      expect(result).toBe(false);
    });

    it('should handle single status object', () => {
      const changeStatuses = { 1: 'SUCCESS' };

      const result = checkAllUpdatesCompleted(changeStatuses);
      expect(result).toBe(true);
    });
  });
});
