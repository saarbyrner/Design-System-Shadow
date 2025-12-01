// @flow
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  onBuildFormState,
  onSetFormStructure,
  onUpdateField,
  onSetMode,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import {
  onBuildValidationState,
  onUpdateValidation,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/formValidationSlice';

import { onBuildFormMenu } from '@kitman/modules/src/HumanInput/shared/redux/slices/formMenuSlice';
import { TECHNICAL_DEBT_ID_MAP } from '@kitman/modules/src/Scouts/CreateEditScout/src/constants';

import { MODES } from '@kitman/modules/src/HumanInput/shared/constants/index';
import {
  useFetchScoutQuery,
  useFetchFormStructureQuery,
} from '../../../shared/redux/services';
import type { Mode } from '../..';

type ReturnType = {
  isLoading: boolean,
  hasFailed: boolean,
  isSuccess: boolean,
};

const useInitialiseForm = ({
  mode,
  id = null,
  userType,
}: {
  mode: Mode,
  id: ?string,
  userType: string,
}): ReturnType => {
  const dispatch = useDispatch();
  const {
    data: scoutData,
    isLoading: isScoutLoading,
    isError: isScoutError,
    isSuccess: isScoutSuccess,
  } = useFetchScoutQuery(id, {
    skip: !id || mode === MODES.CREATE,
  });

  const {
    isLoading: isFormStructureLoading,
    isError: isFormStructureError,
    isSuccess: isFormStructureSuccess,
    data: formStructure,
  } = useFetchFormStructureQuery(TECHNICAL_DEBT_ID_MAP[userType], {
    skip: id === null || !userType,
  });

  useEffect(() => {
    if (formStructure?.form_template_version?.form_elements) {
      dispatch(
        onSetFormStructure({
          structure: formStructure,
        })
      );
      const elements = formStructure.form_template_version.form_elements;
      dispatch(
        onBuildFormState({
          elements,
        })
      );
      dispatch(
        onBuildFormMenu({
          elements,
        })
      );
      dispatch(
        onBuildValidationState({
          elements,
        })
      );
      dispatch(onSetMode({ mode }));
    }
  }, [formStructure, dispatch]);

  useEffect(() => {
    if (id && scoutData) {
      dispatch(
        onUpdateField({
          firstname: scoutData.firstname,
          lastname: scoutData.lastname,
          email: scoutData.email,
          date_of_birth: scoutData.date_of_birth,
          locale: scoutData.locale,
          type: scoutData.user_type,
          division: scoutData.division,
          third_party_scout_organisation:
            scoutData.third_party_scout_organisation,
          is_active: scoutData.is_active.toString(),
        })
      );

      dispatch(
        onUpdateValidation({
          firstname: { status: 'VALID', message: null },
          lastname: { status: 'VALID', message: null },
          email: { status: 'VALID', message: null },
          date_of_birth: { status: 'VALID', message: null },
          locale: { status: 'VALID', message: null },
          type: { status: 'VALID', message: null },
          division: { status: 'VALID', message: null },
        })
      );
    }
  }, [id, scoutData, dispatch]);

  const isLoading = [isScoutLoading, isFormStructureLoading].includes(true);

  const hasFailed = [isScoutError, isFormStructureError].includes(true);

  const isSuccess = [
    mode === MODES.EDIT ? isScoutSuccess : true,
    isFormStructureSuccess,
  ].every((v) => v === true);

  return {
    isLoading,
    hasFailed,
    isSuccess,
  };
};

export default useInitialiseForm;
