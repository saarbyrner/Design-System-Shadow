// @flow
import type { Node } from 'react';
import data from '@kitman/services/src/mocks/handlers/getAdministrationAthleteData/data.mock';
import ManageAthletesContext from './manageAthletesContext';
import type { ManageAthletesContextType } from './manageAthletesContext';

type MockedManageAthletesContextProviderType = {
  manageAthletesContext: ManageAthletesContextType,
  children: Node,
};

export const mockedManageAthletesContextValue = {
  requestStatus: null,
  athletes: data.activeAthletes.athletes,
  nonCompliantAthletes: {
    wellbeing: [],
    session: [],
  },
  searchQuery: '',
  isActivityTypeCategoryEnabled: false,
  hideCreateAthleteButton: false,
  viewType: 'ACTIVE',
  changeViewType: () => {},
  updateSearchQuery: () => {},
};

export const MockedManageAthletesContextProvider = ({
  manageAthletesContext,
  children,
}: MockedManageAthletesContextProviderType) => (
  <ManageAthletesContext.Provider value={manageAthletesContext}>
    {children}
  </ManageAthletesContext.Provider>
);
