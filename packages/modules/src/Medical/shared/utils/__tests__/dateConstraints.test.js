import {
  isDateAfterAllowedCreationDate,
  isDateBeforeAllowedCreationDate,
} from '../dateConstraints';

window.featureFlags = {
  'player-movement-aware-datepicker': true,
};

const showPlayerMovementDatePicker = () => {
  return window.featureFlags['player-movement-aware-datepicker'];
};

const mockTransferRecord = {
  joined_at: '2022-01-01',
  left_at: '2023-01-01',
};

const mockConstraints = {
  active_periods: [
    {
      start: '2022-01-01',
      end: '2022-12-31',
    },
    {
      start: null,
      end: null,
    },
  ],
};

describe('isDateAfterAllowedCreationDate', () => {
  it('returns false if constraints or constraints.active_periods are not defined', () => {
    window.featureFlags['player-movement-aware-datepicker'] = true;
    const startTime = '2023-02-01';
    const result = isDateAfterAllowedCreationDate(
      startTime,
      mockTransferRecord,
      undefined,
      showPlayerMovementDatePicker
    );
    expect(result).toBe(false);
  });

  it('returns false if there is an unrestricted period with start or end as null', () => {
    window.featureFlags['player-movement-aware-datepicker'] = true;
    const startTime = '2023-02-01';
    const result = isDateAfterAllowedCreationDate(
      startTime,
      mockTransferRecord,
      mockConstraints,
      showPlayerMovementDatePicker
    );
    expect(result).toBe(false);
  });

  it('returns false if startTime is within any active period', () => {
    window.featureFlags['player-movement-aware-datepicker'] = true;
    const startTime = '2022-06-01';
    const result = isDateAfterAllowedCreationDate(
      startTime,
      mockTransferRecord,
      mockConstraints,
      showPlayerMovementDatePicker
    );
    expect(result).toBe(false);
  });
});

describe('isDateBeforeAllowedCreationDate', () => {
  it('returns false if transferRecord.joined_at is before or same as startTime', () => {
    const startTime = '2022-06-01';
    const result = isDateBeforeAllowedCreationDate(
      startTime,
      mockTransferRecord
    );
    expect(result).toBe(false);
  });

  it('returns true if transferRecord.joined_at is after startTime', () => {
    const startTime = '2021-01-01';
    const result = isDateBeforeAllowedCreationDate(
      startTime,
      mockTransferRecord
    );
    expect(result).toBe(true);
  });

  it('returns false if transferRecord.joined_at is null or undefined', () => {
    const startTime = '2022-06-01';
    const result = isDateBeforeAllowedCreationDate(startTime, {
      joined_at: null,
      left_at: null,
    });
    expect(result).toBe(false);
  });
});
