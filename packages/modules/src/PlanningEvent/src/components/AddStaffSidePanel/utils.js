// @flow
import type { Staff } from './AddStaffSidePanel';

/**
 * Updates the staff count state based on the provided staff list.
 * This function iterates over the newStaff array and collects the IDs of
 * checked staff members. It sets the staffCount state to an array of these
 * IDs, ensuring that each ID is unique and only includes those that are checked.
 *
 * @param {Array<Staff>} newStaff - An array of staff members to evaluate for
 *                                   their checked status.
 * @param {Function} setStaffCount - A state updater function that modifies
 *                                    the staff count state with the new array
 *                                    of staff member IDs.
 */
export const checkAndSetInitStaffCount = (
  newStaff: Array<Staff>,
  setStaffCount: (((Array<number>) => Array<number>) | Array<number>) => void
) => {
  if (newStaff.length > 0) {
    const updatedStaffCount = [];

    newStaff.forEach((staffMember) => {
      if (staffMember.checked) {
        const staffMemberId = staffMember.id;
        if (!updatedStaffCount.includes(staffMemberId)) {
          updatedStaffCount.push(staffMemberId);
        }
      }
    });

    setStaffCount(updatedStaffCount);
  }
};

/**
 * This function updates the staff count state by adding or removing a staff member's ID.
 * It creates a new Set from the current state to manage unique staffMemberIds.
 * If the staffMemberId is already in the set, it removes it (uncheck).
 * Otherwise, it adds the staffMemberId to the set (check).
 * Finally, it converts the set back to an array and returns it as the new state.
 *
 * @param {string} staffMemberId - The ID of the staff member to add or remove.
 * @param {Function} setStaffCount - The function to update the staff count state.
 */
export const updateStaffCount = (
  staffMemberId: number,
  setStaffCount: (((Array<number>) => Array<number>) | Array<number>) => void
) => {
  setStaffCount((currentState) => {
    const newState = new Set(currentState);
    if (newState.has(staffMemberId)) {
      newState.delete(staffMemberId);
    } else {
      newState.add(staffMemberId);
    }
    return Array.from(newState);
  });
};
