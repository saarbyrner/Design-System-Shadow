// @flow
import { useEffect, useState } from 'react';
import {
  getPersistedMedicalFilters,
  setPersistedMedicalFilters,
} from '../utils/filters';

function useFilters<T>(
  getDefaultValues: Function,
  fieldsToPersist: Array<string>,
  scopeToLevel?: string
): [T, (T | Function) => void] {
  const [filters, setFilters] = useState<T>(
    getPersistedMedicalFilters(
      getDefaultValues(),
      fieldsToPersist,
      scopeToLevel
    )
  );

  useEffect(() => {
    if (scopeToLevel) {
      setPersistedMedicalFilters(fieldsToPersist, filters, scopeToLevel);
    } else {
      setPersistedMedicalFilters(fieldsToPersist, filters);
    }
  }, [filters, fieldsToPersist]);

  return [filters, setFilters];
}

export default useFilters;
