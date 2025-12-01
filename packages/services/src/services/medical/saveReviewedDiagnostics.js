// @flow
import { axios } from '@kitman/common/src/utils/services';

type RedoxResult = {
  diagnostic_id: number,
  reviewed: boolean,
  result_group_id?: number,
};

const saveReviewedDiagnostics = (
  redoxResults: Array<RedoxResult>
): Promise<any> => {
  const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
  const csrfToken = csrfTokenMeta ? csrfTokenMeta.getAttribute('content') : '';

  return new Promise((resolve, reject) => {
    axios
      .post(
        '/medical/diagnostics/redox-results/bulk_reviewed',
        {
          redox_results: redoxResults,
        },
        {
          headers: {
            'X-CSRF-Token': csrfToken,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => resolve(response.data))
      .catch(reject);
  });
};

export default saveReviewedDiagnostics;
