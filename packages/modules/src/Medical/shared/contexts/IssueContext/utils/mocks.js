// @flow
import type { Node } from 'react';
import sinon from 'sinon';
import { data as mockIssueData } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssue';
import IssueContext from '..';
import * as IssueContextItems from '..';
import type { IssueContextType } from '..';

export const mockedChronicIssueContextValue = {
  issue: mockIssueData.chronicIssue,
  issueType: 'CHRONIC_INJURY',
  requestStatus: 'SUCCESS',
  updateIssue: sinon.spy(),
  isReadOnly: false,
};
export const mockedIssueContextValue = {
  issue: mockIssueData.issue,
  issueType: 'Injury',
  requestStatus: 'SUCCESS',
  updateIssue: sinon.spy(),
  isReadOnly: false,
};
export const mockedIssueWithICDContextValue = {
  issue: mockIssueData.issueWithICD,
  issueType: 'Injury',
  requestStatus: 'SUCCESS',
  updateIssue: sinon.spy(),
  isReadOnly: false,
};
export const mockedIssueWithConcussionICDCoding =
  mockIssueData.issueWithConcussionICDCoding;

export const mockedIssueWithDATALYSContextValue = {
  issue: mockIssueData.issueWithDATALYS,
  issueType: 'Injury',
  requestStatus: 'SUCCESS',
  updateIssue: sinon.spy(),
  isReadOnly: false,
};

type MockedIssueContextProviderType = {
  issueContext: IssueContextType,
  children: Node,
};

export const MockedIssueContextProvider = ({
  issueContext,
  children,
}: MockedIssueContextProviderType) => (
  <IssueContext.Provider value={issueContext}>{children}</IssueContext.Provider>
);

export const mockUseIssue = (issueContext: IssueContextType) => {
  sinon.stub(IssueContextItems, 'useIssue').returns(issueContext);
};

export const updateMockUseIssue = (issueContext: IssueContextType) => {
  // $FlowIgnore designed to be used on stub created above
  IssueContextItems.useIssue.returns(issueContext);
};

export const cleanUpMockIssue = () => {
  try {
    // $FlowIgnore designed to be used on stub created above
    IssueContextItems.useIssue.restore();
  } catch (e) {
    // Empty catch block as .restore() may not
    // be defined if there was an issue with the stub
    // so this catches that error. There is no need to do
    // anything with the error
  }
};
