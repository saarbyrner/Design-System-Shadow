// @flow
import { createContext, useState, useContext } from 'react';
import type { Node } from 'react';
import type { RequestStatus } from '@kitman/modules/src/Medical/shared/components/AthleteRosterTab/types';

type ProviderProps = {
  children: Node,
};

export type IssueTabRequestStatusContextType = {
  issueTabRequestStatus: RequestStatus,
  isIssueTabLoading: boolean,
  updateIssueTabRequestStatus: Function,
};
export const DEFAULT_CONTEXT_VALUE = {
  issueTabRequestStatus: 'DORMANT',
  isIssueTabLoading: false,
  updateIssueTabRequestStatus: () => {},
};
const IssueTabRequestStatusContext =
  createContext<IssueTabRequestStatusContextType>(DEFAULT_CONTEXT_VALUE);

const IssueTabRequestStatusContextProvider = ({ children }: ProviderProps) => {
  const [issueTabRequestStatus, setIssueTabRequestStatus] =
    useState<RequestStatus>('DORMANT');

  const isIssueTabLoading = issueTabRequestStatus === 'PENDING';

  const updateIssueTabRequestStatus = (status: RequestStatus): void => {
    setIssueTabRequestStatus(() => status);
  };

  const issueTabRequestStatusValue = {
    issueTabRequestStatus,
    isIssueTabLoading,
    updateIssueTabRequestStatus,
  };

  return (
    <IssueTabRequestStatusContext.Provider value={issueTabRequestStatusValue}>
      {children}
    </IssueTabRequestStatusContext.Provider>
  );
};

const useIssueTabRequestStatus = () => useContext(IssueTabRequestStatusContext);
export { IssueTabRequestStatusContextProvider, useIssueTabRequestStatus };
export default IssueTabRequestStatusContext;
