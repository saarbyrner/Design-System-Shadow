// @flow
import type { PreliminarySchema } from '@kitman/modules/src/Medical/rosters/types';

// Transform BE schema to a flat structure ie { athlete: { id: 'mandatory' } } -> { athlete_id: { constraint: 'mandatory' } }
const normalizePreliminarySchema = (
  serverConfig: PreliminarySchema,
  clientConfig: Object
) => {
  const clientConfigKeys = Object.keys(clientConfig);

  return Object.keys(serverConfig).reduce((acc, key) => {
    const value = serverConfig[key];
    const newKeyWithId = `${key}_id`;
    let newKey = key;

    // Find the key in the client config
    if (clientConfigKeys.includes(newKeyWithId)) {
      newKey = newKeyWithId;
    }

    if (typeof value === 'object' && value !== null && value.id) {
      acc[newKey] = { constraint: value.id };
    } else if (typeof value === 'string') {
      acc[newKey] = { constraint: value };
    } else {
      acc[newKey] = { constraint: value };
    }

    return acc;
  }, {});
};

export { normalizePreliminarySchema };
