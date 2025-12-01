// @flow
import style from '../style';
import { StaffVisibilityOptions } from '../components/custom/utils';
import type { CustomEventFormData } from '../types';

export const displayValidationMessages = (messages: Array<string>) => {
  return messages ? (
    <>
      {messages.map((message: string, index: number) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={`errorMessage_${index}`} css={style.invalidLabel}>
          {message}
        </div>
      ))}
    </>
  ) : undefined;
};

export const validateStaffVisibility = (formData: CustomEventFormData) => {
  const defaultValidation = {
    user_ids: { isInvalid: false },
    visibility_ids: { isInvalid: false },
  };

  const isEmptyStaff = formData.user_ids?.length === 0;
  const isEmptyVisibleStaff = formData.visibility_ids?.length === 0;

  if (window.featureFlags['staff-visibility-custom-events']) {
    switch (formData.staff_visibility) {
      case StaffVisibilityOptions.allStaff: {
        return defaultValidation;
      }
      case StaffVisibilityOptions.onlySelectedStaff: {
        return {
          ...defaultValidation,
          user_ids: { isInvalid: isEmptyStaff },
        };
      }
      case StaffVisibilityOptions.selectedStaffAndAdditional: {
        return {
          user_ids: {
            isInvalid: isEmptyStaff && isEmptyVisibleStaff,
          },
          visibility_ids: { isInvalid: isEmptyVisibleStaff },
        };
      }
      default: {
        return defaultValidation;
      }
    }
  } else {
    return defaultValidation;
  }
};
