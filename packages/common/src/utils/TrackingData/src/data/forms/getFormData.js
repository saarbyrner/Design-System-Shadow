// @flow

import type { HumanInputForm } from '@kitman/modules/src/HumanInput/types/forms';
import type { FormData } from '@kitman/common/src/utils/TrackingData/src/types/forms';

export const getFormData = ({
  form,
  editor,
  athlete,
}: HumanInputForm): FormData => {
  return {
    formId: form.id,
    name: form.fullname || form.name,
    type: form.form_type,
    category: form.category,
    editorId: editor.id,
    athleteId: athlete?.id,
  };
};

export default getFormData;
