// @flow
import $ from 'jquery';
import type { FormState as ModificationFormState } from '@kitman/modules/src/Medical/shared/components/AddModificationSidePanel/hooks/useModificationForm';
import type { Modification } from '@kitman/modules/src/Medical/shared/types/medical';

export type RequestResponse = {
  medical_notes: Array<Modification>,
  total_count: number,
  meta: {
    next_page: number,
  },
};

const saveModificationNote = (
  annotation: ModificationFormState
): Promise<RequestResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: '/medical/modifications',
      contentType: 'application/json',
      data: JSON.stringify(annotation),
    })
      .done(resolve)
      .fail(reject);
  });
};

export default saveModificationNote;
