import {
  MODES,
  LAYOUT_ELEMENTS,
} from '@kitman/modules/src/HumanInput/shared/constants';
import { data } from '@kitman/modules/src/Scouts/shared/redux/services/mocks/data/mock_form_structure';

import {
  getFormState,
  getFieldValueFactory,
  getElementState,
  getElementFactory,
  getModeFactory,
  getOriginalFormFactory,
  getAthleteFactory,
  getUserFactory,
  isConditionSatisfied,
  isInEditableMode,
  getFormTitleFactory,
  getShouldShowMenuFactory,
  getFormMenuGroups,
  getFormMenuGroupFactory,
  getFormElementsByTypeFactory,
  getElementByIdFactory,
  getFormStatusFactory,
  getFormBrandingHeaderConfigFactory,
  getOrganisationFactory,
  getShouldShowRecoveryModalFactory,
  getLocalDraftFactory,
} from '../formStateSelectors';

const MOCK_STATE = {
  registrationFormApi: {},
  registrationApi: {},
  formStateSlice: {
    form: {
      1: 'my_value',
    },
    originalForm: {},
    config: {
      mode: MODES.VIEW,
    },
    elements: {
      my_field: {
        config: {
          data_point: false,
          element_id: 'my_value',
          optional: true,
          text: 'My value',
        },
        element_type: 'Forms::Elements::Inputs::Text',
        form_elements: [],
        id: 1,
        order: 1,
        visible: true,
      },
      my_conditional_field: {
        config: {
          data_point: false,
          element_id: 'my_conditional_field',
          optional: true,
          text: 'My value',
          condition: {
            element_id: 'my_value',
            type: '==',
            value_type: 'boolean',
            value: true,
          },
        },
        element_type: 'Forms::Elements::Inputs::Text',
        form_elements: [],
        id: 1,
        order: 1,
        visible: true,
      },
    },
    structure: {
      id: 9675,
      athlete: {},
      user: {
        fullname: 'John Smith',
      },
      status: 'complete',
      organisation_id: 6,
    },
  },
  config: {
    shouldShowMenu: true,
  },
};

describe('[formStateSelectors] - selectors', () => {
  test('getFormState()', () => {
    expect(getFormState(MOCK_STATE)).toBe(MOCK_STATE.formStateSlice.form);
  });

  test('getFieldValueFactory()', () => {
    const fieldSelector = getFieldValueFactory('my_field');
    expect(fieldSelector(MOCK_STATE)).toBe(
      MOCK_STATE.formStateSlice.form.my_field
    );
  });

  test('getElementState()', () => {
    expect(getElementState(MOCK_STATE)).toBe(
      MOCK_STATE.formStateSlice.elements
    );
  });

  test('getElementFactory()', () => {
    const fieldSelector = getElementFactory('my_field');
    expect(fieldSelector(MOCK_STATE)).toBe(
      MOCK_STATE.formStateSlice.elements.my_field
    );
  });

  test('getModeFactory()', () => {
    const modeSelector = getModeFactory();
    expect(modeSelector(MOCK_STATE)).toBe(
      MOCK_STATE.formStateSlice.config.mode
    );
  });

  test('getOriginalFormFactory()', () => {
    const modeSelector = getOriginalFormFactory();
    expect(modeSelector(MOCK_STATE)).toBe(
      MOCK_STATE.formStateSlice.originalForm
    );
  });

  test('getAthleteFactory()', () => {
    const athleteSelector = getAthleteFactory();
    expect(athleteSelector(MOCK_STATE)).toBe(
      MOCK_STATE.formStateSlice.structure.athlete
    );
  });

  test('getUserFactory()', () => {
    const userSelector = getUserFactory();
    expect(userSelector(MOCK_STATE)).toBe(
      MOCK_STATE.formStateSlice.structure.user
    );
  });

  test('getOrganisationFactory()', () => {
    const userSelector = getOrganisationFactory();
    expect(userSelector(MOCK_STATE)).toBe(
      MOCK_STATE.formStateSlice.structure.organisation_id
    );
  });

  test('getFormBrandingHeaderConfigFactory()', () => {
    const formBrandingHeaderSelector = getFormBrandingHeaderConfigFactory();
    const customState = {
      ...MOCK_STATE,
      formStateSlice: {
        ...MOCK_STATE.formStateSlice,
        structure: {
          ...MOCK_STATE.formStateSlice.structure,
          form_template_version: {
            config: {
              header: { enabled: true },
            },
          },
        },
      },
    };

    expect(formBrandingHeaderSelector(customState)).toBe(
      customState.formStateSlice.structure.form_template_version.config.header
    );
  });

  describe('isConditionSatisfied()', () => {
    it('correctly evaluates as true', () => {
      const fieldSelector = isConditionSatisfied({
        element_id: 'my_field',
        type: '==',
        value_type: 'boolean',
        value: true,
      });
      expect(
        fieldSelector({
          formStateSlice: {
            form: {
              1: true,
            },
            elements: {
              my_field: {
                config: {
                  data_point: false,
                  element_id: 'my_field',
                  optional: true,
                  text: 'My value',
                },
                element_type: 'Forms::Elements::Inputs::Text',
                form_elements: [],
                id: 1,
                order: 1,
                visible: true,
              },
              my_conditional_field: {
                config: {
                  data_point: false,
                  element_id: 'my_conditional_field',
                  optional: true,
                  text: 'My value',
                  condition: {
                    element_id: 'my_field',
                    type: '==',
                    value_type: 'boolean',
                    value: true,
                  },
                },
                element_type: 'Forms::Elements::Inputs::Text',
                form_elements: [],
                id: 2,
                order: 1,
                visible: true,
              },
            },
          },
        })
      ).toBe(true);
    });
    it('correctly evaluates as false', () => {
      const fieldSelector = isConditionSatisfied({
        element_id: 'my_field',
        type: '==',
        value_type: 'boolean',
        value: true,
      });
      expect(
        fieldSelector({
          formStateSlice: {
            form: {
              1: false,
            },
            elements: {
              my_field: {
                config: {
                  data_point: false,
                  element_id: 'my_field',
                  optional: true,
                  text: 'My value',
                },
                element_type: 'Forms::Elements::Inputs::Text',
                form_elements: [],
                id: 1,
                order: 1,
                visible: true,
              },
              my_conditional_field: {
                config: {
                  data_point: false,
                  element_id: 'my_conditional_field',
                  optional: true,
                  text: 'My value',
                  condition: {
                    element_id: 'my_field',
                    type: '==',
                    value_type: 'boolean',
                    value: true,
                  },
                },
                element_type: 'Forms::Elements::Inputs::Text',
                form_elements: [],
                id: 2,
                order: 1,
                visible: true,
              },
            },
          },
        })
      ).toBe(false);
    });

    describe('multi conditional AND and OR operators', () => {
      const conditions = [
        {
          element_id: 'my_field_1',
          type: '==',
          value_type: 'string',
          value: '45',
        },
        {
          element_id: 'my_field_2',
          type: '==',
          value_type: 'integer',
          value: 236,
        },
      ];

      const AND_CONDITION = {
        type: 'and',
        conditions,
      };

      const OR_CONDITION = {
        type: 'or',
        conditions,
      };

      const defaultElementsState = {
        my_field_1: {
          config: {
            data_point: false,
            element_id: 'my_field_1',
            optional: true,
            text: 'My value',
          },
          element_type: 'Forms::Elements::Inputs::Text',
          form_elements: [],
          id: 1,
          order: 1,
          visible: true,
        },
        my_field_2: {
          config: {
            data_point: false,
            element_id: 'my_field_2',
            optional: true,
            text: 'My value 2',
          },
          element_type: 'Forms::Elements::Inputs::Text',
          form_elements: [],
          id: 2,
          order: 1,
          visible: true,
        },
        my_conditional_field: {
          config: {
            data_point: false,
            element_id: 'my_conditional_field',
            optional: true,
            text: 'My value',
            condition: AND_CONDITION,
          },
          element_type: 'Forms::Elements::Inputs::Text',
          form_elements: [],
          id: 2,
          order: 1,
          visible: true,
        },
      };

      const customElementsState = {
        ...defaultElementsState,
        my_conditional_field: {
          ...defaultElementsState.my_conditional_field,
          config: {
            ...defaultElementsState.my_conditional_field.config,
            condition: OR_CONDITION,
          },
        },
      };

      it('correctly evalues as true if both conditions are satisfied for AND operator', () => {
        const fieldSelector = isConditionSatisfied(AND_CONDITION);

        expect(
          fieldSelector({
            formStateSlice: {
              form: {
                1: '45',
                2: 236,
              },
              elements: defaultElementsState,
            },
          })
        ).toBe(true);
      });

      it('correctly evalues as false if one of the conditions is not satisfied  for AND operator', () => {
        const fieldSelector = isConditionSatisfied(AND_CONDITION);

        expect(
          fieldSelector({
            formStateSlice: {
              form: {
                1: '48',
                2: 236,
              },
              elements: defaultElementsState,
            },
          })
        ).toBe(false);
      });

      it('correctly evalues as true if one of the conditions is satisfied for OR operator', () => {
        const fieldSelector = isConditionSatisfied(OR_CONDITION);

        expect(
          fieldSelector({
            formStateSlice: {
              form: {
                1: '48',
                2: 236,
              },
              elements: customElementsState,
            },
          })
        ).toBe(true);
      });

      it('correctly evalues as false if both conditions are not satisfied for OR operator', () => {
        const fieldSelector = isConditionSatisfied(OR_CONDITION);

        expect(
          fieldSelector({
            formStateSlice: {
              form: {
                1: '48',
                2: 239,
              },
              elements: customElementsState,
            },
          })
        ).toBe(false);
      });

      describe('multi conditional AND and OR operators with new condition structure', () => {
        const PLAYER_UNAVAILABLE_CONDITION = {
          type: '==',
          value: false,
          element_id: 'player_unavailable',
          value_type: 'boolean',
        };

        const RECEIVED_ANKLE_TAPE_CONDITION = {
          type: 'or',
          conditions: [
            {
              type: '==',
              value: 'right',
              element_id: 'received_ankle_tape',
              value_type: 'string',
            },
            {
              type: '==',
              value: 'both',
              element_id: 'received_ankle_tape',
              value_type: 'string',
            },
          ],
        };

        const ANKLE_TAPE_CONDITION = {
          type: '==',
          value: 'both',
          element_id: 'received_ankle_tape',
          value_type: 'string',
        };

        const OR_WITH_NESTED_AND_CONDITION = {
          type: 'or',
          conditions: [
            {
              type: 'and',
              conditions: [
                PLAYER_UNAVAILABLE_CONDITION,
                RECEIVED_ANKLE_TAPE_CONDITION,
              ],
            },
            {
              type: 'and',
              conditions: [PLAYER_UNAVAILABLE_CONDITION, ANKLE_TAPE_CONDITION],
            },
          ],
        };

        const AND_WITH_NESTED_CONDITIONS = {
          type: 'and',
          conditions: [
            PLAYER_UNAVAILABLE_CONDITION,
            RECEIVED_ANKLE_TAPE_CONDITION,
          ],
        };

        const customNestedConditionsElementsState = {
          player_unavailable: {
            config: {
              data_point: false,
              element_id: 'player_unavailable',
              optional: true,
              text: 'Player Unavailable',
            },
            element_type: 'Forms::Elements::Inputs::Text',
            form_elements: [],
            id: 1,
            order: 1,
            visible: true,
          },
          received_ankle_tape: {
            config: {
              data_point: false,
              element_id: 'received_ankle_tape',
              optional: true,
              text: 'Received Ankle Tape',
            },
            element_type: 'Forms::Elements::Inputs::Text',
            form_elements: [],
            id: 2,
            order: 2,
            visible: true,
          },
        };

        it('correctly evaluates as true if both conditions are satisfied for AND operator', () => {
          const fieldSelector = isConditionSatisfied(
            AND_WITH_NESTED_CONDITIONS
          );

          expect(
            fieldSelector({
              formStateSlice: {
                form: {
                  1: false, // player_unavailable is false
                  2: 'right', // received_ankle_tape is 'right'
                },
                elements: customNestedConditionsElementsState,
              },
            })
          ).toBe(true);
        });

        it('correctly evaluates as false if one of the conditions is not satisfied for AND operator', () => {
          const fieldSelector = isConditionSatisfied(
            AND_WITH_NESTED_CONDITIONS
          );

          expect(
            fieldSelector({
              formStateSlice: {
                form: {
                  1: true, // player_unavailable is true (this should fail)
                  2: 'right', // received_ankle_tape is 'right' (this passes)
                },
                elements: customNestedConditionsElementsState,
              },
            })
          ).toBe(false);
        });

        it('correctly evaluates as true if the OR condition is satisfied for the OR operator', () => {
          const fieldSelector = isConditionSatisfied(
            AND_WITH_NESTED_CONDITIONS
          );

          expect(
            fieldSelector({
              formStateSlice: {
                form: {
                  1: false, // player_unavailable is false
                  2: 'both', // received_ankle_tape is 'both' (this passes the OR condition)
                },
                elements: customNestedConditionsElementsState,
              },
            })
          ).toBe(true);
        });

        it('correctly evaluates as false if the OR condition is not satisfied for the OR operator', () => {
          const fieldSelector = isConditionSatisfied(
            AND_WITH_NESTED_CONDITIONS
          );

          expect(
            fieldSelector({
              formStateSlice: {
                form: {
                  1: false, // player_unavailable is false
                  2: 'left', // received_ankle_tape is 'left' (this fails the OR condition)
                },
                elements: customNestedConditionsElementsState,
              },
            })
          ).toBe(false);
        });

        it('correctly evaluates AND with multiple OR conditions', () => {
          const fieldSelector = isConditionSatisfied({
            type: 'and',
            conditions: [
              {
                type: '==',
                value: false,
                element_id: 'player_unavailable',
                value_type: 'boolean',
              },
              {
                type: 'or',
                conditions: [
                  {
                    type: '==',
                    value: 'right',
                    element_id: 'received_ankle_tape',
                    value_type: 'string',
                  },
                  {
                    type: '==',
                    value: 'left',
                    element_id: 'received_ankle_tape',
                    value_type: 'string',
                  },
                ],
              },
            ],
          });

          expect(
            fieldSelector({
              formStateSlice: {
                form: {
                  1: false, // player_unavailable is false (this passes the AND)
                  2: 'right', // received_ankle_tape is 'right' (this passes the OR)
                },
                elements: customNestedConditionsElementsState,
              },
            })
          ).toBe(true);
        });

        it('correctly evaluates OR as false when no conditions are satisfied', () => {
          const fieldSelector = isConditionSatisfied(
            AND_WITH_NESTED_CONDITIONS
          );

          expect(
            fieldSelector({
              formStateSlice: {
                form: {
                  1: false, // player_unavailable is false (this passes the AND)
                  2: 'left', // received_ankle_tape is 'left' (this fails the OR condition)
                },
                elements: customNestedConditionsElementsState,
              },
            })
          ).toBe(false);
        });

        it('correctly evaluates AND as true when both conditions are satisfied', () => {
          const fieldSelector = isConditionSatisfied(
            AND_WITH_NESTED_CONDITIONS
          );

          expect(
            fieldSelector({
              formStateSlice: {
                form: {
                  1: false, // player_unavailable is false (this passes the AND)
                  2: 'right', // received_ankle_tape is 'right' (this passes the OR condition)
                },
                elements: customNestedConditionsElementsState,
              },
            })
          ).toBe(true);
        });

        it('correctly evaluates as true if the first AND condition inside the OR is satisfied', () => {
          const fieldSelector = isConditionSatisfied(
            OR_WITH_NESTED_AND_CONDITION
          );

          expect(
            fieldSelector({
              formStateSlice: {
                form: {
                  1: false, // player_unavailable is false
                  2: 'right', // received_ankle_tape is 'right'
                },
                elements: customNestedConditionsElementsState,
              },
            })
          ).toBe(true);
        });

        it('correctly evaluates as true if the second AND condition inside the OR is satisfied', () => {
          const fieldSelector = isConditionSatisfied(
            OR_WITH_NESTED_AND_CONDITION
          );

          expect(
            fieldSelector({
              formStateSlice: {
                form: {
                  1: false, // player_unavailable is false
                  2: 'both', // received_ankle_tape is 'both'
                },
                elements: customNestedConditionsElementsState,
              },
            })
          ).toBe(true);
        });

        it('correctly evaluates as false if neither of the AND conditions inside the OR is satisfied', () => {
          const fieldSelector = isConditionSatisfied(
            OR_WITH_NESTED_AND_CONDITION
          );

          expect(
            fieldSelector({
              formStateSlice: {
                form: {
                  1: true, // player_unavailable is true
                  2: 'left', // received_ankle_tape is 'left'
                },
                elements: customNestedConditionsElementsState,
              },
            })
          ).toBe(false);
        });

        it('correctly evaluates as false if the player_unavailable condition is true and both inner AND conditions fail', () => {
          const fieldSelector = isConditionSatisfied(
            OR_WITH_NESTED_AND_CONDITION
          );

          expect(
            fieldSelector({
              formStateSlice: {
                form: {
                  1: true, // player_unavailable is true
                  2: 'left', // received_ankle_tape is 'left'
                },
                elements: customNestedConditionsElementsState,
              },
            })
          ).toBe(false);
        });

        it('correctly evaluates as true if at least one nested AND condition within the OR is satisfied', () => {
          const fieldSelector = isConditionSatisfied(
            OR_WITH_NESTED_AND_CONDITION
          );

          expect(
            fieldSelector({
              formStateSlice: {
                form: {
                  1: false, // player_unavailable is false
                  2: 'right', // received_ankle_tape is 'right'
                },
                elements: customNestedConditionsElementsState,
              },
            })
          ).toBe(true);
        });

        it('correctly evaluates as false if both nested AND conditions inside the OR fail', () => {
          const fieldSelector = isConditionSatisfied(
            OR_WITH_NESTED_AND_CONDITION
          );

          expect(
            fieldSelector({
              formStateSlice: {
                form: {
                  1: true, // player_unavailable is true
                  2: 'none', // received_ankle_tape is 'none'
                },
                elements: customNestedConditionsElementsState,
              },
            })
          ).toBe(false);
        });

        it('correctly evaluates OR as true when one condition is satisfied', () => {
          const fieldSelector = isConditionSatisfied({
            type: 'or',
            conditions: [
              {
                type: '==',
                value: 'right',
                element_id: 'received_ankle_tape',
                value_type: 'string',
              },
              {
                type: '==',
                value: 'both',
                element_id: 'received_ankle_tape',
                value_type: 'string',
              },
            ],
          });

          expect(
            fieldSelector({
              formStateSlice: {
                form: {
                  2: 'right', // received_ankle_tape is 'right' (this satisfies the OR condition)
                },
                elements: customNestedConditionsElementsState,
              },
            })
          ).toBe(true);
        });
      });
    });
  });

  describe('Recovery Modal Selectors', () => {
    it('getShouldShowRecoveryModalFactory should return true when modal is shown', () => {
      const selector = getShouldShowRecoveryModalFactory();
      const stateWithModal = {
        ...MOCK_STATE,
        formStateSlice: {
          ...MOCK_STATE.formStateSlice,
          config: {
            ...MOCK_STATE.formStateSlice.config,
            showRecoveryModal: true,
          },
        },
      };
      expect(selector(stateWithModal)).toBe(true);
    });

    it('getLocalDraftFactory should return the local draft object', () => {
      const selector = getLocalDraftFactory();
      const mockDraft = {
        timestamp: '2025-10-29T12:00:00Z',
        data: { 1: 'draft value' },
      };
      const stateWithDraft = {
        ...MOCK_STATE,
        formStateSlice: {
          ...MOCK_STATE.formStateSlice,
          config: {
            ...MOCK_STATE.formStateSlice.config,
            localDraft: mockDraft,
          },
        },
      };
      expect(selector(stateWithDraft)).toEqual(mockDraft);
    });
  });

  describe('isInEditableMode()', () => {
    const editableModes = ['EDIT'];
    it('correctly evaluates as true', () => {
      const fieldSelector = isInEditableMode(editableModes);
      expect(
        fieldSelector({
          formStateSlice: {
            config: {
              mode: 'EDIT',
            },
          },
        })
      ).toBe(true);
    });
    it('correctly evaluates as false', () => {
      const fieldSelector = isInEditableMode(editableModes);
      expect(
        fieldSelector({
          formStateSlice: {
            config: {
              mode: 'CREATE',
            },
          },
        })
      ).toBe(false);
    });
  });

  describe('getFormTitleFactory()', () => {
    it('returns the title when at the root', () => {
      const formTitleSelector = getFormTitleFactory();
      expect(
        formTitleSelector({
          formStateSlice: {
            structure: {
              name: 'My root title',
            },
          },
        })
      ).toBe('My root title');
    });
    it('returns the title when in the form', () => {
      const formTitleSelector = getFormTitleFactory();
      expect(
        formTitleSelector({
          formStateSlice: {
            structure: {
              form: {
                name: 'My form title',
              },
            },
          },
        })
      ).toBe('My form title');
    });
  });
  describe('config factories', () => {
    it('should return the correct value for getShouldShowMenuFactory', () => {
      const selector = getShouldShowMenuFactory();
      expect(selector(MOCK_STATE)).toBe(MOCK_STATE.config.shouldShowMenu);
    });
  });
  describe('getFormMenuGroups()', () => {
    it('returns the for menu groups', () => {
      const formMenuSelector = getFormMenuGroups();
      expect(
        formMenuSelector({
          formStateSlice: {
            structure: data[61],
          },
        })
      ).toBe(
        data[61].form_template_version.form_elements[0].form_elements[0]
          .form_elements
      );
    });
  });
  describe('getFormMenuGroupFactory()', () => {
    it('returns the for menu groups', () => {
      const formMenuSelector = getFormMenuGroupFactory(2690);
      expect(
        formMenuSelector({
          formStateSlice: {
            structure: data[61],
          },
        })
      ).toBe(
        data[61].form_template_version.form_elements[0].form_elements[0]
          .form_elements[0]
      );
    });
  });

  describe('getFormElementsByTypeFactory()', () => {
    it('returns the requested items by element_type', () => {
      const selector = getFormElementsByTypeFactory(LAYOUT_ELEMENTS.MenuGroup);
      expect(
        selector({
          formStateSlice: {
            structure: data[61],
          },
        })
      ).toHaveLength(4);
    });
  });

  describe('getElementByIdFactory()', () => {
    it('returns the requested items by element_type', () => {
      const personalDetailsMenuGroup =
        data[61].form_template_version.form_elements[0].form_elements[0]
          .form_elements[0];
      const selector = getElementByIdFactory({
        type: LAYOUT_ELEMENTS.MenuGroup,
        id: personalDetailsMenuGroup.id,
      });

      expect(
        selector({
          formStateSlice: {
            structure: data[61],
          },
        })
      ).toBe(personalDetailsMenuGroup);
    });
  });

  describe('getFormStatusFactory()', () => {
    it('returns the status when at the root', () => {
      const formStatusSelector = getFormStatusFactory();
      expect(
        formStatusSelector({
          formStateSlice: {
            structure: {
              status: 'complete',
            },
          },
        })
      ).toBe('complete');
    });
  });
});
