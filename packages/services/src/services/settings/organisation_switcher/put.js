// @flow
import { axios } from '@kitman/common/src/utils/services';

export default async (organisationId: number): Promise<void> => {
  await axios.put(
    '/settings/organisation_switcher',
    { organisationId, isInCamelCase: true },
    { headers: { Accept: 'application/json' } }
  );
};
