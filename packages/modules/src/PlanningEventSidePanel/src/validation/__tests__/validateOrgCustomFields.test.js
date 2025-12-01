import validateOrgCustomFields from '../validateOrgCustomFields';

describe('validateOrgCustomFields', () => {
  it('validates correct data without issues', () => {
    const data = {
      nfl_location_id: 3,
      season_type_id: 1,
      nfl_surface_type_id: 6,
      nfl_equipment_id: 1,
      field_condition: 2,
      nfl_surface_composition_id: 3,
    };

    const expectedResult = {
      nfl_location_id: {
        isInvalid: false,
      },
      season_type_id: {
        isInvalid: false,
      },
      nfl_surface_type_id: {
        isInvalid: false,
      },
      nfl_equipment_id: {
        isInvalid: false,
      },
      field_condition: {
        isInvalid: false,
      },
      nfl_surface_composition_id: {
        isInvalid: false,
      },
    };

    const result = validateOrgCustomFields(data);
    expect(result).toEqual(expectedResult);
  });

  it('validates optional fields can be null when feature flag is off', () => {
    const data = {
      nfl_location_id: null,
      season_type_id: null,
      nfl_surface_type_id: null,
      nfl_equipment_id: null,
      field_condition: null,
      nfl_surface_composition_id: null,
    };

    const expectedResult = {
      nfl_location_id: {
        isInvalid: false,
      },
      season_type_id: {
        isInvalid: false,
      },
      nfl_surface_type_id: {
        isInvalid: false,
      },
      nfl_equipment_id: {
        isInvalid: false,
      },
      field_condition: {
        isInvalid: false,
      },
      nfl_surface_composition_id: {
        isInvalid: false,
      },
    };

    const result = validateOrgCustomFields(data);
    expect(result).toEqual(expectedResult);
  });

  describe('when planning-custom-org-event-details is true', () => {
    beforeEach(() => {
      window.setFlag('planning-custom-org-event-details', true);
    });

    const gameData = {
      type: 'game_event',
    };

    const sessionData = {
      type: 'session_event',
    };

    const practiceSessionType = {
      ...sessionData,
      session_type: {
        sessionTypeCategoryName: 'Practice',
      },
    };

    const otherSessionType = {
      ...sessionData,
      session_type: {
        sessionTypeCategoryName: 'Other',
      },
    };

    const allValidFieldsExpected = {
      nfl_location_id: {
        isInvalid: false,
      },
      season_type_id: {
        isInvalid: false,
      },
      nfl_surface_type_id: {
        isInvalid: false,
      },
      nfl_equipment_id: {
        isInvalid: false,
      },
      field_condition: {
        isInvalid: false,
      },
      nfl_surface_composition_id: {
        isInvalid: false,
      },
    };

    describe('equipment id', () => {
      const nullEquipment = {
        nfl_location_id: 3,
        season_type_id: 1,
        nfl_surface_type_id: 6,
        nfl_equipment_id: null,
        field_condition: 2,
        nfl_surface_composition_id: 3,
      };

      const expectedInvalidResult = {
        ...allValidFieldsExpected,
        nfl_equipment_id: {
          isInvalid: true,
        },
      };

      it('IS mandatory for game', () => {
        const game = {
          ...nullEquipment,
          ...gameData,
        };

        const result = validateOrgCustomFields(game);
        expect(result).toEqual(expectedInvalidResult);
      });

      it('IS mandatory for Practice session categories', () => {
        const practice = {
          ...nullEquipment,
          ...practiceSessionType,
        };

        const result = validateOrgCustomFields(practice);
        expect(result).toEqual(expectedInvalidResult);
      });

      it('is NOT mandatory for Other session categories', () => {
        const other = {
          ...nullEquipment,
          ...otherSessionType,
        };

        const result = validateOrgCustomFields(other);
        expect(result).toEqual(allValidFieldsExpected);
      });
    });

    describe('location id', () => {
      const nullLocationData = {
        nfl_location_id: null,
        season_type_id: 1,
        nfl_surface_type_id: 6,
        nfl_equipment_id: 2,
        field_condition: 2,
        nfl_surface_composition_id: 3,
      };

      const expectedInvalidResult = {
        ...allValidFieldsExpected,
        nfl_location_id: {
          isInvalid: true,
        },
      };
      it('IS mandatory for games', () => {
        const game = {
          ...nullLocationData,
          ...gameData,
        };

        const result = validateOrgCustomFields(game);
        expect(result).toEqual(expectedInvalidResult);
      });

      it('IS mandatory for Practice session categories', () => {
        const practice = {
          ...nullLocationData,
          ...practiceSessionType,
        };

        const result = validateOrgCustomFields(practice);
        expect(result).toEqual(expectedInvalidResult);
      });
      it('is NOT mandatory for session types Other', () => {
        const other = {
          ...nullLocationData,
          ...otherSessionType,
        };
        const result = validateOrgCustomFields(other);
        expect(result).toEqual(allValidFieldsExpected);
      });
    });

    describe('season type id', () => {
      it('IS mandatory for ALL sessions', () => {
        const data = {
          nfl_location_id: 4,
          season_type_id: null,
          nfl_surface_type_id: 6,
          nfl_equipment_id: 2,
          field_condition: 2,
          nfl_surface_composition_id: 3,
          type: 'session_event',
        };

        const expectedResult = {
          ...allValidFieldsExpected,
          season_type_id: {
            isInvalid: true,
          },
        };

        const result = validateOrgCustomFields(data);
        expect(result).toEqual(expectedResult);
      });
    });

    describe('surface type id', () => {
      const nullSurfaceType = {
        nfl_location_id: 2,
        season_type_id: 1,
        nfl_surface_type_id: null,
        nfl_equipment_id: 2,
        field_condition: 2,
        nfl_surface_composition_id: 3,
      };

      const invalidSurfaceTypeExpected = {
        ...allValidFieldsExpected,
        nfl_surface_type_id: {
          isInvalid: true,
        },
      };
      it('IS mandatory for games', () => {
        const game = {
          ...nullSurfaceType,
          ...gameData,
        };
        const result = validateOrgCustomFields(game);
        expect(result).toEqual(invalidSurfaceTypeExpected);
      });

      it('IS mandatory for Practice session categories', () => {
        const practiceSession = {
          ...nullSurfaceType,
          ...practiceSessionType,
        };

        const result = validateOrgCustomFields(practiceSession);
        expect(result).toEqual(invalidSurfaceTypeExpected);
      });
      it('is NOT mandatory for session types Other', () => {
        const otherSession = {
          ...nullSurfaceType,
          ...otherSessionType,
        };

        const result = validateOrgCustomFields(otherSession);
        expect(result).toEqual(allValidFieldsExpected);
      });
    });

    describe('surface type id with FF - nfl-hide-surface-type', () => {
      const nullSurfaceType = {
        nfl_location_id: 2,
        season_type_id: 1,
        nfl_surface_type_id: null,
        nfl_equipment_id: 2,
        field_condition: 2,
        nfl_surface_composition_id: 3,
      };

      beforeEach(() => {
        window.setFlag('nfl-hide-surface-type', true);
      });

      it('IS NOT mandatory for games', () => {
        const game = {
          ...nullSurfaceType,
          ...gameData,
        };
        const result = validateOrgCustomFields(game);
        expect(result).toEqual(allValidFieldsExpected);
      });

      it('IS NOT mandatory for Practice session categories', () => {
        const practiceSession = {
          ...nullSurfaceType,
          ...practiceSessionType,
        };

        const result = validateOrgCustomFields(practiceSession);
        expect(result).toEqual(allValidFieldsExpected);
      });
      it('is NOT mandatory for session types Other', () => {
        const otherSession = {
          ...nullSurfaceType,
          ...otherSessionType,
        };

        const result = validateOrgCustomFields(otherSession);
        expect(result).toEqual(allValidFieldsExpected);
      });
    });

    describe('field condition id', () => {
      const nullFieldCondition = {
        nfl_location_id: 2,
        season_type_id: 1,
        nfl_surface_type_id: 3,
        nfl_equipment_id: 2,
        field_condition: null,
        nfl_surface_composition_id: 3,
      };

      it('is NOT mandatory for games', () => {
        const game = {
          ...nullFieldCondition,
          ...gameData,
        };
        const result = validateOrgCustomFields(game);
        expect(result).toEqual(allValidFieldsExpected);
      });

      it('is NOT mandatory for sessions', () => {
        const session = {
          ...nullFieldCondition,
          ...sessionData,
        };
        const result = validateOrgCustomFields(session);
        expect(result).toEqual(allValidFieldsExpected);
      });
    });

    describe('location feed id FF', () => {
      const nullLocationData = {
        nfl_location_feed_id: null,
        season_type_id: 1,
        nfl_surface_type_id: 6,
        nfl_equipment_id: 2,
        field_condition: 2,
        nfl_surface_composition_id: 3,
      };

      const validData = {
        nfl_location_feed_id: {
          isInvalid: false,
        },
        season_type_id: {
          isInvalid: false,
        },
        nfl_surface_type_id: {
          isInvalid: false,
        },
        nfl_equipment_id: {
          isInvalid: false,
        },
        field_condition: {
          isInvalid: false,
        },
        nfl_surface_composition_id: {
          isInvalid: false,
        },
      };

      const expectedInvalidResult = {
        ...validData,
        nfl_location_feed_id: {
          isInvalid: true,
        },
      };

      beforeEach(() => {
        window.featureFlags['nfl-location-feed'] = true;
      });

      it('IS mandatory for games', () => {
        const game = {
          ...nullLocationData,
          ...gameData,
        };

        const result = validateOrgCustomFields(game);
        expect(result).toEqual(expectedInvalidResult);
      });

      it('IS mandatory for Practice session categories', () => {
        const practice = {
          ...nullLocationData,
          ...practiceSessionType,
        };

        const result = validateOrgCustomFields(practice);
        expect(result).toEqual(expectedInvalidResult);
      });
      it('is NOT mandatory for session types Other', () => {
        const other = {
          ...nullLocationData,
          ...otherSessionType,
        };
        const result = validateOrgCustomFields(other);
        expect(result).toEqual(validData);
      });
    });
  });
});
