// @flow
import type {
  InjurySurveillancePermissions,
  LogicBuilderPermissions,
} from './types';

export const defaultInjurySurveillancePermissions: InjurySurveillancePermissions =
  {
    canAdmin: false,
  };

export const setInjurySurveillancePermissions = (
  permissions: Array<string>
): InjurySurveillancePermissions => {
  return {
    canAdmin: permissions?.includes('injury-surveillance-admin') || false,
  };
};

export const defaultLogicBuilderPermissions: LogicBuilderPermissions = {
  canAdmin: false,
};

export const setLogicBuilderPermissions = (
  permissions: Array<string>
): LogicBuilderPermissions => {
  return {
    canAdmin: permissions?.includes('logic-builder-medical-admin') || false,
  };
};
