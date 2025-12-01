// @flow
import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import { getOrganisation, getPositionGroups } from '@kitman/services';
import { AppStatus } from '@kitman/components';
import _xor from 'lodash/xor';
import _flatten from 'lodash/flatten';
import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useIssue } from '../../contexts/IssueContext';
import AllergiesFilter from '../../containers/AllergiesFilter';
import AddAllergySidePanel from '../../containers/AddAllergySidePanel';
import AddMedicalAlertSidePanel from '../../containers/AddMedicalAlertSidePanel';

import { getDefaultAllergiesFilters } from '../../utils';
import useAllergies from '../../hooks/useAllergies';
import useCurrentUser from '../../hooks/useGetCurrentUser';
import { AllergiesCardListTranslated as AllergiesCardList } from './components/AllergiesCardList';
import type { RequestStatus } from '../../types';
import useSessionMedicalFilters from '../../hooks/useSessionMedicalFilters';
import useAthleteMedicalAlerts from '../../hooks/useAthleteMedicalAlerts';

type Props = {
  reloadData: boolean,
  setReloadData?: Function,
  athleteId?: number,
  openAddMedicalAlertSidePanel: Function,
  openAddAllergySidePanel: Function,
  showAvatar?: boolean,
  hiddenFilters?: Array<string>,
};

type ConditionalFetchDataParams = {
  categories: string[],
  type: string,
  canView: boolean,
  resetList: boolean,
};

const style = {
  wrapper: css`
    min-height: 100%;
  `,
  noAllergiesText: css`
    color: ${colors.grey_200};
    font-size: 14px;
    font-weight: normal;
    min-height: 500px;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: center;
  `,
};

const AllergiesTab = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();

  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const { currentUser, fetchCurrentUser } = useCurrentUser();
  const isMountedCheck = useIsMountedCheck();
  const { issue, issueType } = useIssue();
  const { id: issueId } = issue;
  const [organisation, setOrganisation] = useState<any>(null);
  const [isFullyLoaded, setIsFullyLoaded] = useState<any>(false);
  const [positionGroups, setPositionGroups] = useState<any>(null);
  const persistedFilters = _xor(
    ['date_range', 'squad_ids'],
    props.hiddenFilters
  );

  const [filters, setFilters] = useSessionMedicalFilters(
    () =>
      getDefaultAllergiesFilters({
        athleteId: props.athleteId || null,
        issueType: issueType || null,
        issueId: issueId || null,
      }),
    persistedFilters
  );

  const {
    allergies,
    fetchAllergies,
    resetAllergies,
    resetNextPage,
    nextAllergiesPage,
  } = useAllergies();

  const {
    athleteMedicalAlerts,
    fetchAthleteMedicalAlerts,
    resetMedicalAlertsNextPage,
    resetAthleteMedicalAlerts,
    nextMedicalAlertsPage,
  } = useAthleteMedicalAlerts();

  useEffect(() => {
    fetchCurrentUser();
    getOrganisation()
      .then((currentOrg) => {
        setOrganisation(currentOrg);
        setRequestStatus('SUCCESS');
      })
      .catch(() => setRequestStatus('FAILURE'));
  }, []);

  useEffect(() => {
    setIsFullyLoaded(
      nextAllergiesPage === null && nextMedicalAlertsPage === null
    );
  }, [nextAllergiesPage, nextMedicalAlertsPage]);

  useEffect(() => {
    getPositionGroups().then((positionGroupsData) => {
      if (!isMountedCheck()) return;
      setPositionGroups(
        _flatten(
          positionGroupsData.map((positionGroup) => positionGroup.positions)
        ).map((position) => ({
          value: position.id,
          label: position.name,
        }))
      );
    });
  }, [organisation, isMountedCheck]);

  const conditionalFetchData = ({
    categories,
    type,
    canView,
    resetList,
  }: ConditionalFetchDataParams) => {
    if (!categories.length || categories.includes(type)) {
      if (canView) {
        return type === 'allergy'
          ? fetchAllergies({ filters, resetList })
          : fetchAthleteMedicalAlerts({ filters, resetList });
      }
    }
    return Promise.resolve();
  };

  const getNextMedicalFlags = useDebouncedCallback(
    ({ resetList = false } = {}) => {
      if (resetList) {
        resetAllergies();
        resetAthleteMedicalAlerts();
      }
      setRequestStatus('PENDING');

      const fetchAllergiesPromise = conditionalFetchData({
        categories: filters.categories,
        type: 'allergy',
        canView: permissions.medical.allergies.canViewNewAllergy,
        resetList,
      });

      const fetchAthleteMedicalAlertsPromise = conditionalFetchData({
        categories: filters.categories,
        type: 'medicalAlert',
        canView: permissions.medical.alerts.canView,
        resetList,
      });

      Promise.all([fetchAllergiesPromise, fetchAthleteMedicalAlertsPromise])
        .then(() => {
          setRequestStatus('SUCCESS');
        })
        .catch(() => {
          setRequestStatus('FAILURE');
        });
    },
    400
  );

  const buildMedicalFlags = () => {
    resetAllergies();
    resetAthleteMedicalAlerts();
    resetNextPage();
    resetMedicalAlertsNextPage();
    getNextMedicalFlags({ resetList: true });
  };

  useEffect(() => {
    buildMedicalFlags();
  }, [filters]);

  useEffect(() => {
    if (!props.reloadData) {
      return;
    }
    buildMedicalFlags();
  }, [props.reloadData]);

  useEffect(() => {
    // This is needed for when using PlayerSelector as filters don't update with change of athlete
    // or issue. Still persisting filters, so only athlete & issue needs changing.
    // $FlowIgnore Constructing object to match initial filter
    setFilters((prevFilters) => ({
      ...prevFilters,
      athlete_id: props.athleteId,
      ...(issueId &&
        issueType && {
          issue_occurrence: {
            id: issueId,
            type: issueType.toLowerCase(),
          },
        }),
    }));
  }, [props.athleteId, issue]);

  return (
    <div css={style.wrapper}>
      <AllergiesFilter
        athleteId={props.athleteId || null}
        currentUser={currentUser}
        currentOrganisation={organisation}
        filters={filters}
        hiddenFilters={props.hiddenFilters}
        positionGroups={positionGroups}
        onChangeFilter={(updatedFilter) => setFilters(updatedFilter)}
        allergies={allergies}
      />
      <AddAllergySidePanel
        athleteId={props.athleteId}
        enableReloadData={props.setReloadData}
        onSaveAllergy={() => buildMedicalFlags()}
      />
      <AddMedicalAlertSidePanel
        athleteId={props.athleteId}
        enableReloadData={props.setReloadData}
        onSaveMedicalAlert={() => buildMedicalFlags()}
      />
      <AllergiesCardList
        allergies={allergies}
        athleteMedicalAlerts={athleteMedicalAlerts}
        currentUser={currentUser}
        onReachingEnd={getNextMedicalFlags}
        isFullyLoaded={isFullyLoaded}
        isLoading={requestStatus === 'PENDING'}
        showAthleteInformation={!props.athleteId}
        openAddAllergySidePanel={(isAthleteSelectable, allergyInfo) =>
          props.openAddAllergySidePanel(isAthleteSelectable, allergyInfo)
        }
        openAddMedicalAlertSidePanel={(isAthleteSelectable, medicalAlert) =>
          props.openAddMedicalAlertSidePanel(isAthleteSelectable, medicalAlert)
        }
        showAvatar={props.showAvatar}
        setRequestStatus={setRequestStatus}
        enableReloadData={props.setReloadData}
      />
      {requestStatus === 'SUCCESS' &&
        !allergies.length &&
        !athleteMedicalAlerts.length && (
          <div css={style.noAllergiesText}>
            {props.t('No medical flags for this period')}
          </div>
        )}
      {requestStatus === 'FAILURE' && <AppStatus status="error" />}
    </div>
  );
};

export const AllergiesTabTranslated: ComponentType<Props> =
  withNamespaces()(AllergiesTab);
export default AllergiesTab;
