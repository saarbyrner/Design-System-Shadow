// @flow

import { axios } from '@kitman/common/src/utils/services';
import type { BrandingHeaderConfig } from '@kitman/modules/src/HumanInput/types/forms';

export const GET_FORM_HEADER_DEFAULTS_ROUTE = '/ui/forms/form_header_defaults';

const getFormHeaderDefaults = async (): Promise<{
  questions: { header: BrandingHeaderConfig },
}> => {
  const { data } = await axios.get(GET_FORM_HEADER_DEFAULTS_ROUTE);

  return data;
};

export default getFormHeaderDefaults;
