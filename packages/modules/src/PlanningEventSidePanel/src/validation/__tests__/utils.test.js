import { validateStaffVisibility } from '../utils';
import { StaffVisibilityOptions } from '../../components/custom/utils';

describe('utils', () => {
  describe('validateStaffVisibility', () => {
    const emptyArray = [];
    const filledArray = [1, 2, 3, 4];

    const validResult = { isInvalid: false };
    const invalidResult = { isInvalid: true };

    const allValid = {
      user_ids: validResult,
      visibility_ids: validResult,
    };

    const allInvalid = {
      user_ids: invalidResult,
      visibility_ids: invalidResult,
    };

    describe('when the staff visibility custom events FF is off', () => {
      it('should return valid even if staff is empty', () => {
        const result = validateStaffVisibility({
          user_ids: emptyArray,
          visibility_ids: emptyArray,
        });

        expect(result).toEqual(allValid);
      });
    });

    describe('when the staff visibility custom events FF is on', () => {
      beforeEach(() => {
        window.featureFlags['staff-visibility-custom-events'] = true;
      });

      afterEach(() => {
        window.featureFlags['staff-visibility-custom-events'] = false;
      });

      describe('all staff option', () => {
        it('user ids and visibility ids can be empty', () => {
          const result = validateStaffVisibility({
            user_ids: emptyArray,
            visibility_ids: emptyArray,
            staff_visibility: StaffVisibilityOptions.allStaff,
          });

          expect(result).toEqual(allValid);
        });

        it('user ids and visibility ids can be filled', () => {
          const result = validateStaffVisibility({
            user_ids: filledArray,
            visibility_ids: filledArray,
            staff_visibility: StaffVisibilityOptions.allStaff,
          });

          expect(result).toEqual(allValid);
        });
      });

      describe('only selected staff option', () => {
        it('user ids cannot be empty with visibility ids', () => {
          const result = validateStaffVisibility({
            user_ids: emptyArray,
            visibility_ids: emptyArray,
            staff_visibility: StaffVisibilityOptions.onlySelectedStaff,
          });

          expect(result).toEqual({
            user_ids: invalidResult,
            visibility_ids: validResult,
          });
        });

        it('user ids cannot be empty without visibility ids', () => {
          const result = validateStaffVisibility({
            user_ids: emptyArray,
            visibility_ids: emptyArray,
            staff_visibility: StaffVisibilityOptions.onlySelectedStaff,
          });

          expect(result).toEqual({
            user_ids: invalidResult,
            visibility_ids: validResult,
          });
        });
      });

      describe('selected and additional staff option', () => {
        it('user ids can be empty if visibility ids exist', () => {
          const result = validateStaffVisibility({
            user_ids: emptyArray,
            visibility_ids: filledArray,
            staff_visibility: StaffVisibilityOptions.selectedStaffAndAdditional,
          });

          expect(result).toEqual(allValid);
        });

        it('user ids cannot be empty if visibility ids are empty', () => {
          const result = validateStaffVisibility({
            user_ids: emptyArray,
            visibility_ids: emptyArray,
            staff_visibility: StaffVisibilityOptions.selectedStaffAndAdditional,
          });

          expect(result).toEqual(allInvalid);
        });

        it('visibility ids cannot be empty even if user ids are filled', () => {
          const result = validateStaffVisibility({
            user_ids: filledArray,
            visibility_ids: emptyArray,
            staff_visibility: StaffVisibilityOptions.selectedStaffAndAdditional,
          });

          expect(result).toEqual({
            user_ids: validResult,
            visibility_ids: invalidResult,
          });
        });
      });
    });
  });
});
