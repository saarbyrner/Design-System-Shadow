import { data } from '@kitman/modules/src/Scouts/shared/redux/services/mocks/data/mock_form_structure';

import formValidationSlice, {
  onBuildValidationState,
  onUpdateValidation,
  onResetValidation,
} from '../formValidationSlice';

const SUBSET =
  data[61].form_template_version.form_elements[0].form_elements[0].form_elements.slice(
    0,
    1
  );

const initialState = {
  validation: {},
};

describe('[formValidationSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(formValidationSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  describe('build state', () => {
    let action;
    beforeEach(() => {
      action = onBuildValidationState({
        elements: SUBSET,
      });
    });
    it('should correctly build the validation state', () => {
      const updatedState = formValidationSlice.reducer(initialState, action);
      const expectedState = {
        2692: {
          message: null,
          status: 'PENDING',
        },
        2693: {
          message: null,
          status: 'VALID',
        },
        2694: {
          message: null,
          status: 'PENDING',
        },
        2696: {
          message: null,
          status: 'PENDING',
        },
        2697: {
          message: null,
          status: 'PENDING',
        },

        2698: {
          message: null,
          status: 'PENDING',
        },
        2699: {
          message: null,
          status: 'PENDING',
        },
        2700: {
          message: null,
          status: 'PENDING',
        },
        2701: {
          message: null,
          status: 'PENDING',
        },
        2702: {
          message: null,
          status: 'PENDING',
        },
        2703: {
          message: null,
          status: 'PENDING',
        },
        2704: {
          message: null,
          status: 'PENDING',
        },
        2706: {
          message: null,
          status: 'PENDING',
        },
        2707: {
          message: null,
          status: 'PENDING',
        },
        2708: {
          message: null,
          status: 'PENDING',
        },
        2709: {
          message: null,
          status: 'PENDING',
        },
        2711: {
          message: null,
          status: 'PENDING',
        },
        2712: {
          message: null,
          status: 'VALID',
        },
        2713: {
          message: null,
          status: 'PENDING',
        },
        2714: {
          message: null,
          status: 'PENDING',
        },
        2715: {
          message: null,
          status: 'PENDING',
        },
        2716: {
          message: null,
          status: 'PENDING',
        },
        2717: {
          message: null,
          status: 'PENDING',
        },
        2719: {
          message: null,
          status: 'VALID',
        },
        2720: {
          message: null,
          status: 'VALID',
        },
        2721: {
          message: null,
          status: 'VALID',
        },
        2722: {
          message: null,
          status: 'VALID',
        },
        2723: {
          message: null,
          status: 'VALID',
        },
        2724: {
          message: null,
          status: 'VALID',
        },
      };
      expect(updatedState.validation).toEqual(expectedState);
    });

    it('should correctly update a validation value', () => {
      const updateAction = onUpdateValidation({
        2692: {
          status: 'VALID',
          message: null,
        },
      });
      const updatedState = formValidationSlice.reducer(
        initialState,
        updateAction
      );

      expect(updatedState.validation[2692]).toEqual({
        status: 'VALID',
        message: null,
      });
    });
    it('should correctly reset the validation state', () => {
      const resetAction = onResetValidation();
      const resetState = formValidationSlice.reducer(initialState, resetAction);

      expect(resetState.validation).toEqual({});
    });
  });
});
