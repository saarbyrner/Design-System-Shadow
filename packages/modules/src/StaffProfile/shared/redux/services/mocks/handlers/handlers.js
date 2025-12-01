import { handler as fetchStaffProfileHandler } from '@kitman/modules/src/StaffProfile/shared/redux/services/mocks/handlers/fetchStaffProfile';
import { handler as fetchExistingStaffProfileHandler } from '@kitman/modules/src/StaffProfile/shared/redux/services/mocks/handlers/fetchExistingStaffProfile';
import { handler as createStaffProfileHandler } from '@kitman/modules/src/StaffProfile/shared/redux/services/mocks/handlers/createStaffProfile';
import { handler as updateStaffProfileHandler } from '@kitman/modules/src/StaffProfile/shared/redux/services/mocks/handlers/updateStaffProfile';
import { handler as updateUserStatusHandler } from '@kitman/modules/src/StaffProfile/shared/redux/services/mocks/handlers/updateUserStatus';

export default [
  fetchStaffProfileHandler,
  fetchExistingStaffProfileHandler,
  createStaffProfileHandler,
  updateStaffProfileHandler,
  updateUserStatusHandler,
];
