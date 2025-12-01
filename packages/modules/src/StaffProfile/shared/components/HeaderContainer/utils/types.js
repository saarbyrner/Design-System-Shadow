// @flow
import type {
  UpdateUserStatusRequestBody,
  UpdateUserStatusReturnType,
} from '@kitman/modules/src/StaffProfile/shared/redux/services/api/updateUserStatus';

export type UpdateUserStatus = ({
  userId: number | void,
  requestBody: UpdateUserStatusRequestBody,
}) => {
  unwrap: () => Promise<UpdateUserStatusReturnType>,
};
