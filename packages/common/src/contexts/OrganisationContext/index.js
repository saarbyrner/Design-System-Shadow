// @flow
import {
  type Node,
  createContext,
  useEffect,
  useContext,
  useState,
} from 'react';
import type { Organisation } from '@kitman/services/src/services/getOrganisation';
import getOrganisation from '@kitman/services/src/services/getOrganisation';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';

import type { OrganisationContextType } from './types';

export const DEFAULT_CONTEXT_VALUE = {
  organisation: {
    coding_system_id: 2, // default to osics 10 id
    coding_system_key: codingSystemKeys.OSICS_10,
    id: -1,
    logo_full_path: '',
    ip_for_government: false,
  },
  organisationRequestStatus: 'PENDING',
  setOrganisationPHIWarning: () => {},
  organisationPHIWarning: true,
};

const OrganisationContext = createContext<OrganisationContextType>(
  DEFAULT_CONTEXT_VALUE
);

type ProviderProps = {
  children: Node,
};

const OrganisationProvider = ({ children }: ProviderProps) => {
  const checkIsMounted = useIsMountedCheck();

  const [organisation, setOrganisation] = useState<Organisation>({});
  const [organisationPHIWarning, setOrganisationPHIWarning] =
    useState<boolean>(true);

  const [organisationRequestStatus, setOrganisationRequestStatus] =
    useState('PENDING');

  useEffect(() => {
    getOrganisation().then(
      (data) => {
        if (!checkIsMounted()) return;
        setOrganisation({
          ...data,
          association_admin: data.association_admin || false,
          coding_system_key: window.featureFlags['emr-multiple-coding-systems']
            ? data.coding_system_key
            : codingSystemKeys.OSICS_10,
        });
        setOrganisationRequestStatus('SUCCESS');
      },
      () => {
        if (!checkIsMounted()) return;
        setOrganisationRequestStatus('FAILURE');
      }
    );
  }, []);

  const organisationValue = {
    organisation,
    organisationRequestStatus,
    organisationPHIWarning,
    setOrganisationPHIWarning: (value) => {
      if (!checkIsMounted()) return;
      setOrganisationPHIWarning(value);
    },
  };

  return (
    <OrganisationContext.Provider value={organisationValue}>
      {children}
    </OrganisationContext.Provider>
  );
};

export const useOrganisation = () => useContext(OrganisationContext);

export { OrganisationProvider };
export default OrganisationContext;
