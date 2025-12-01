// @flow

import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';

export type CustomHookReturnType = {
  isLoading: boolean,
  isError: boolean,
  isSuccess: boolean,
};

const defaultHookResult: CustomHookReturnType = {
  isLoading: false,
  isError: false,
  isSuccess: true,
};

// This generic hook receives up to 10 (can be extended) custom hooks, that will run and return the
// required result (as mentioned in the type), and will be used together with permissions and
// organisations at the root of an app
export const useGlobalAppBasicLoader = (
  customHooks: Array<() => CustomHookReturnType>
) => {
  const {
    isLoading: isGlobalLoading,
    hasFailed: isGlobalError,
    isSuccess: isGlobalSuccess,
  } = useGlobal();

  const {
    isLoading: isCustomHook1Loading,
    isError: isCustomHook1Error,
    isSuccess: isCustomHook1Success,
  } = customHooks[0]?.() ?? defaultHookResult;
  const {
    isLoading: isCustomHook2Loading,
    isError: isCustomHook2Error,
    isSuccess: isCustomHook2Success,
  } = customHooks[1]?.() ?? defaultHookResult;

  const {
    isLoading: isCustomHook3Loading,
    isError: isCustomHook3Error,
    isSuccess: isCustomHook3Success,
  } = customHooks[2]?.() ?? defaultHookResult;
  const {
    isLoading: isCustomHook4Loading,
    isError: isCustomHook4Error,
    isSuccess: isCustomHook4Success,
  } = customHooks[3]?.() ?? defaultHookResult;
  const {
    isLoading: isCustomHook5Loading,
    isError: isCustomHook5Error,
    isSuccess: isCustomHook5Success,
  } = customHooks[4]?.() ?? defaultHookResult;
  const {
    isLoading: isCustomHook6Loading,
    isError: isCustomHook6Error,
    isSuccess: isCustomHook6Success,
  } = customHooks[5]?.() ?? defaultHookResult;
  const {
    isLoading: isCustomHook7Loading,
    isError: isCustomHook7Error,
    isSuccess: isCustomHook7Success,
  } = customHooks[6]?.() ?? defaultHookResult;
  const {
    isLoading: isCustomHook8Loading,
    isError: isCustomHook8Error,
    isSuccess: isCustomHook8Success,
  } = customHooks[7]?.() ?? defaultHookResult;
  const {
    isLoading: isCustomHook9Loading,
    isError: isCustomHook9Error,
    isSuccess: isCustomHook9Success,
  } = customHooks[8]?.() ?? defaultHookResult;
  const {
    isLoading: isCustomHook10Loading,
    isError: isCustomHook10Error,
    isSuccess: isCustomHook10Success,
  } = customHooks[9]?.() ?? defaultHookResult;

  const isLoading = [
    isCustomHook1Loading,
    isCustomHook2Loading,
    isCustomHook3Loading,
    isCustomHook4Loading,
    isCustomHook5Loading,
    isCustomHook6Loading,
    isCustomHook7Loading,
    isCustomHook8Loading,
    isCustomHook9Loading,
    isCustomHook10Loading,
    isGlobalLoading,
  ].includes(true);

  const isError = [
    isCustomHook1Error,
    isCustomHook2Error,
    isCustomHook3Error,
    isCustomHook4Error,
    isCustomHook5Error,
    isCustomHook6Error,
    isCustomHook7Error,
    isCustomHook8Error,
    isCustomHook9Error,
    isCustomHook10Error,
    isGlobalError,
  ].includes(true);

  const isSuccess = [
    isCustomHook1Success,
    isCustomHook2Success,
    isCustomHook3Success,
    isCustomHook4Success,
    isCustomHook5Success,
    isCustomHook6Success,
    isCustomHook7Success,
    isCustomHook8Success,
    isCustomHook9Success,
    isCustomHook10Success,
    isGlobalSuccess,
  ].every((value) => value);

  return {
    isLoading,
    isError,
    isSuccess,
  };
};
