// @flow
import { createContext, useState, useContext, useEffect } from 'react';
import type { Node } from 'react';
import type { RequestStatus } from '@kitman/common/src/types';
import type { AdministrationAthlete } from '@kitman/common/src/types/Athlete';
import { getActiveSquad, getAdministrationAthleteData } from '@kitman/services';
import { bulkUpdateAthleteLabels } from '@kitman/services/src/services/dynamicCohorts';
import type { Squad } from '@kitman/services/src/services/getActiveSquad';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import getIsActivityTypeCategoryEnabled from '@kitman/modules/src/AthleteManagement/shared/redux/services/api/getIsActivityTypeCategoryEnabled';
import getNonCompliantAthletes from '@kitman/modules/src/AthleteManagement/shared/redux/services/api/getNonCompliantAthletes';
import type { NonCompliantAthletes } from '@kitman/modules/src/AthleteManagement/shared/redux/services/api/getNonCompliantAthletes';
import { useFetchOrganisationPreferenceQuery } from '@kitman/common/src/redux/global/services/globalApi';
import type { ViewType } from '../types';
import { INITIAL_ATHLETES_PAGE, ATHLETES_PER_PAGE } from '../utils';
import useAthleteSelection from '../hooks/useAthleteSelection';

export type ManageAthletesContextType = {
  requestStatus: RequestStatus,
  activeSquad: Squad,
  athletes: AdministrationAthlete[],
  athletesPage: ?number,
  searchQuery: string,
  selectedLabels: Array<number>,
  viewType: ViewType,
  isActivityTypeCategoryEnabled: boolean,
  hideCreateAthleteButton: boolean,
  nonCompliantAthletes: NonCompliantAthletes,
  fetchMoreAthletes: () => void,
  changeViewType: (viewType: ViewType) => void,
  updateSearchQuery: (searchQuery: string) => void,
  updateSelectedLabels: (selection: Array<number>) => void,
  updateRequestStatus: (status: RequestStatus) => void,
  selectedAthleteIds: Array<number>,
  toggleSingleAthleteSelection: (athleteId: number, checked: boolean) => void,
  bulkUpdateLabels: (
    labelsToAdd: Array<number>,
    labelsToRemove: Array<number>
  ) => void,
};

export const DEFAULT_CONTEXT_VALUE = {
  requestStatus: null,
  activeSquad: {},
  athletes: [],
  athletesPage: 1,
  searchQuery: '',
  selectedLabels: [],
  viewType: 'ACTIVE',
  isActivityTypeCategoryEnabled: false,
  hideCreateAthleteButton: false,
  nonCompliantAthletes: {
    wellbeing: [],
    session: [],
  },
  fetchMoreAthletes: () => {},
  changeViewType: () => {},
  updateSearchQuery: () => {},
  updateSelectedLabels: () => {},
  updateRequestStatus: () => {},
  selectedAthleteIds: [],
  toggleSingleAthleteSelection: () => {},
  bulkUpdateLabels: () => {},
};

const ManageAthletesContext = createContext<ManageAthletesContextType>(
  DEFAULT_CONTEXT_VALUE
);

type Props = {
  children: Node,
};

const ManageAthletesContextProvider = (props: Props) => {
  const { data: shouldHideAthleteCreateButton } =
    useFetchOrganisationPreferenceQuery('hide_athlete_create_button');
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const { permissionsRequestStatus } = usePermissions();
  const [activeSquad, setActiveSquad] = useState<Squad>({});
  const [isActivityTypeCategoryEnabled, setIsActivityTypeCategoryEnabled] =
    useState(false);
  const [nonCompliantAthletes, setNonCompliantAthletes] = useState(
    DEFAULT_CONTEXT_VALUE.nonCompliantAthletes
  );
  const [athletes, setAthletes] = useState<AdministrationAthlete[]>([]);
  const [athletesPage, setAthletesPage] = useState<number | null>(
    INITIAL_ATHLETES_PAGE
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [viewType, setViewType] = useState<ViewType>(() =>
    window.location.hash === '#inactive' ? 'INACTIVE' : 'ACTIVE'
  );
  const [hideCreateAthleteButton, setHideCreateAthleteButton] =
    useState<boolean>(false);
  const {
    selectedAthleteIds,
    setSelectedAthleteIds,
    toggleSingleAthleteSelection,
  } = useAthleteSelection();

  const updateRequestStatus = (newRequestStatus: RequestStatus) =>
    setRequestStatus((prevRequestStatus) =>
      prevRequestStatus === 'FAILURE' ? 'FAILURE' : newRequestStatus
    );

  const fetchInitialAthletes = () => {
    updateRequestStatus('PENDING');

    getAdministrationAthleteData({
      active: viewType === 'ACTIVE',
      search: searchQuery,
      labels: selectedLabels,
      athletesPage: INITIAL_ATHLETES_PAGE,
      athletesPerPage: ATHLETES_PER_PAGE,
    })
      .then((fetchedAthleteData) => {
        setAthletes(fetchedAthleteData.athletes);
        setAthletesPage(fetchedAthleteData.meta.next_page || null);
        updateRequestStatus('SUCCESS');
      })
      .catch((request) => {
        if (request.statusText === 'abort') return;
        updateRequestStatus('FAILURE');
      });
  };

  const fetchMoreAthletes = () => {
    if (!athletesPage) {
      return;
    }

    updateRequestStatus('PENDING');

    getAdministrationAthleteData({
      active: viewType === 'ACTIVE',
      search: searchQuery,
      labels: selectedLabels,
      ...(athletesPage && { athletesPage }),
      athletesPerPage: ATHLETES_PER_PAGE,
    })
      .then((fetchedAthleteData) => {
        setAthletes((prevAthletes) => [
          ...prevAthletes,
          ...fetchedAthleteData.athletes,
        ]);
        setAthletesPage(fetchedAthleteData.meta.next_page || null);
        updateRequestStatus('SUCCESS');
      })
      .catch((request) => {
        if (request.statusText === 'abort') return;
        updateRequestStatus('FAILURE');
      });
  };

  useEffect(() => {
    updateRequestStatus('PENDING');

    /*
     * Those requests failure handling used to be broken. The fix is wrapped in a feature flag as it made a Capybara test fail:
     * https://app.circleci.com/pipelines/github/KitmanLabs/medinah/79185/workflows/e99a20bc-dea6-4ed0-9f6d-8416de73b8d7/jobs/535635/tests#failed-test-0
     * We suspect a misconfiguration of the test. It is hard to investigate on our machine as Capybara does not work with LDE
     * We mofified the test in a way that it still tests the same flow but does not fail anymore
     * We are going to test manually to make sure that this change does not introduce issues
     */
    getActiveSquad()
      .then((fetchedSquad) => {
        updateRequestStatus('SUCCESS');
        setActiveSquad(fetchedSquad);
      })
      .catch(() => updateRequestStatus('FAILURE'));

    getIsActivityTypeCategoryEnabled()
      .then((data) => {
        updateRequestStatus('SUCCESS');
        setIsActivityTypeCategoryEnabled(data.value);
      })
      .catch(() => updateRequestStatus('FAILURE'));

    getNonCompliantAthletes()
      .then((data) => {
        updateRequestStatus('SUCCESS');
        setNonCompliantAthletes(data);
      })
      .catch(() => updateRequestStatus('FAILURE'));
  }, []);

  useEffect(() => {
    setAthletes([]);
    fetchInitialAthletes();
  }, [viewType, searchQuery, selectedLabels]);

  useEffect(
    () => updateRequestStatus(permissionsRequestStatus),
    [permissionsRequestStatus]
  );

  useEffect(() => {
    setHideCreateAthleteButton(shouldHideAthleteCreateButton?.value || false);
  }, [shouldHideAthleteCreateButton]);

  const changeViewType = (selectedTab: string) => {
    if (selectedTab === '0') setViewType('ACTIVE');
    if (selectedTab === '1') setViewType('INACTIVE');
  };

  const updateSearchQuery = (query: string) => setSearchQuery(query);
  const updateSelectedLabels = (selection: Array<number>) =>
    setSelectedLabels(selection);

  const bulkUpdateLabels = (labelsToAdd, labelsToRemove) => {
    updateRequestStatus('PENDING');
    bulkUpdateAthleteLabels({
      athleteIds: selectedAthleteIds,
      labelsToAdd,
      labelsToRemove,
    })
      .then(() => {
        updateRequestStatus('SUCCESS');
        setSelectedAthleteIds([]);
        setAthletes([]);
        fetchInitialAthletes();
      })
      .catch(() => {
        updateRequestStatus('FAILURE');
      });
  };

  const manageAthletesValue = {
    requestStatus,
    activeSquad,
    athletes,
    athletesPage,
    searchQuery,
    selectedLabels,
    viewType,
    isActivityTypeCategoryEnabled,
    hideCreateAthleteButton,
    nonCompliantAthletes,
    fetchMoreAthletes,
    changeViewType,
    updateSearchQuery,
    updateSelectedLabels,
    updateRequestStatus,
    selectedAthleteIds,
    toggleSingleAthleteSelection,
    bulkUpdateLabels,
  };

  return (
    <ManageAthletesContext.Provider value={manageAthletesValue}>
      {props.children}
    </ManageAthletesContext.Provider>
  );
};

const useManageAthletes = () => useContext(ManageAthletesContext);

export { ManageAthletesContextProvider, useManageAthletes };

export default ManageAthletesContext;
