import validateSession from '../validateSession';
import validateCommon from '../validateCommon';
import validateEventConditions from '../validateEventConditions';
import validateOrgCustomFields from '../validateOrgCustomFields';

jest.mock('../validateCommon', () => jest.fn());
jest.mock('../validateEventConditions', () => jest.fn());
jest.mock('../validateOrgCustomFields', () => jest.fn());

describe('validateSession', () => {
  const invalidResult = {
    isInvalid: true,
  };

  const validResult = {
    isInvalid: false,
  };

  const baseData = {
    start_time: '2010-04-20T07:00:48Z',
    local_timezone: 'Europe/Dublin',
    duration: '10',
    session_type_id: undefined,
  };

  beforeEach(() => {
    validateCommon.mockReturnValue({});
    validateEventConditions.mockReturnValue({});
    validateOrgCustomFields.mockReturnValue({});
  });

  it('validates correct data without issues', () => {
    const data = {
      ...baseData,
      session_type_id: 1,
      workload_type: 2,
    };
    const { isValid, validation } = validateSession(data);
    expect(isValid).toBe(true);
    expect(validation.session_type_id).toEqual(validResult);
    expect(validation.workload_type).toEqual(validResult);
  });

  it('validates required values are present', () => {
    const { isValid, validation } = validateSession(baseData);
    expect(isValid).toBe(false);
    expect(validation.session_type_id).toEqual(invalidResult);
    expect(validation.workload_type).toEqual(invalidResult);
  });

  describe('when planning-custom-org-details is true', () => {
    beforeEach(() => {
      window.setFlag('planning-custom-org-event-details', true);
    });

    it('validates an opposing team is needed when there is a joint session type', () => {
      const needsOpposingTeam = {
        ...baseData,
        session_type_id: 1,
        workload_type: 2,
        session_type: { isJointSessionType: true },
        team_id: null,
      };

      const { isValid, validation } = validateSession(needsOpposingTeam);
      expect(isValid).toBe(false);
      expect(validation.team_id).toEqual(invalidResult);
    });

    it('validates an opposing team is set when there is a joint session type', () => {
      const needsOpposingTeam = {
        ...baseData,
        session_type_id: 1,
        workload_type: 2,
        session_type: { isJointSessionType: true },
        team_id: 56483,
        nfl_equipment_id: 3847,
      };

      const { isValid, validation } = validateSession(needsOpposingTeam);
      expect(isValid).toBe(true);
      expect(validation.team_id).toEqual(validResult);
    });
  });

  describe('when "surface-type-mandatory-sessions" is true', () => {
    beforeEach(() => {
      window.setFlag('surface-type-mandatory-sessions', true);
    });

    it('validates a surface type is needed', () => {
      const { isValid, validation } = validateSession(baseData);
      expect(isValid).toBe(false);
      expect(validation.surface_type).toEqual(invalidResult);
    });

    it('validates when surface type is selected', () => {
      const data = { ...baseData, surface_type: 1 };
      const { validation } = validateSession(data);
      expect(validation.surface_type).toEqual(validResult);
    });
  });
});
