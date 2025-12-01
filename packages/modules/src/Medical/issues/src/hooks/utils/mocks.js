// @flow
import type { Node } from 'react';
import IssueTabRequestStatusContext from '../useIssueTabRequestStatus';
import type { IssueTabRequestStatusContextType } from '../useIssueTabRequestStatus';

type MockedIssueTabRequestStatusContextProviderType = {
  issueTabRequestStatusContext: IssueTabRequestStatusContextType,
  children: Node,
};

const MockedIssueTabRequestStatusContextProvider = ({
  issueTabRequestStatusContext,
  children,
}: MockedIssueTabRequestStatusContextProviderType) => (
  <IssueTabRequestStatusContext.Provider value={issueTabRequestStatusContext}>
    {children}
  </IssueTabRequestStatusContext.Provider>
);

export default MockedIssueTabRequestStatusContextProvider;
