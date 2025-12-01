// @flow
import { useDispatch } from 'react-redux';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { CurrentUserData } from '@kitman/services/src/services/getCurrentUser';
import type { Organisation } from '@kitman/services/src/services/getOrganisation';
import type { IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';
import { useToasts } from '@kitman/components/src/Toast/KitmanDesignSystem';

import type { RequestStatus, DiagnosticFilter, IssueType } from '../types';

import { DiagnosticFiltersTranslated as DiagnosticFilters } from '../components/DiagnosticsTab/components/DiagnosticFilters';
import {
  openAddDiagnosticSidePanel,
  exportRosterBilling,
} from '../redux/actions/index';
import {
  useGetSquadsQuery,
  useGetDiagnosticStatusesQuery,
  useGetDiagnosticResultTypesQuery,
  useGetDiagnosticReasonsQuery,
  useGetMedicalLocationsQuery,
  useGetOrderProvidersQuery,
} from '../redux/services/medical';

type Props = {
  filters: DiagnosticFilter,
  showDownloadDiagnostics: boolean,
  onSaveReconciledDiagnostics: Function,
  issueType: IssueType,
  issue: IssueOccurrenceRequested,
  isExporting: boolean,
  diagnostics: any,
  currentUser: CurrentUserData,
  currentOrganisation: Organisation,
  contentLoaded: boolean,
  athleteExternalId?: string,
  athleteData?: AthleteData,
  onSavedReviewDiagnostics: () => void,
  exportDiagnosticBilling: () => void,
  onClickDownloadDiagnostics: () => void,

  onChangeFilter: (filter: DiagnosticFilter) => void,
  setRequestStatus: (requestStatus: RequestStatus) => void,
};

const DiagnosticFiltersContainer = (props: Props) => {
  const dispatch = useDispatch();
  const isDiagnosticsTab = window.location.hash === '#diagnostics';

  const { toasts, toastDispatch } = useToasts();

  const isRedoxOrg =
    // eslint-disable-next-line dot-notation
    window.featureFlags['redox'] && window.featureFlags['redox-iteration-1'];

  const {
    data: squads = [],
    error: getSquadsError,
    isLoading: areSquadsLoading,
  } = useGetSquadsQuery({
    skip: !isDiagnosticsTab || !props.contentLoaded,
  });

  const {
    data: statuses = { statuses: [] },
    error: getDiagnosticStatusesError,
    isLoading: areDiagnosticStatusesLoading,
  } = useGetDiagnosticStatusesQuery({
    skip: !isDiagnosticsTab || !props.contentLoaded,
  });

  const {
    data: diagnosticResultTypes = [],
    error: getDiagnosticResultTypesError,
    isLoading: areDiagnosticResultTypesLoading,
  } = useGetDiagnosticResultTypesQuery(null, {
    skip: !isDiagnosticsTab || !props.contentLoaded,
  });

  const {
    data: diagnosticReasons = { diagnostic_reasons: [] },
    error: diagnosticReasonsError,
    isLoading: diagnosticReasonsLoading,
  } = useGetDiagnosticReasonsQuery('diagnostic', {
    skip: !isDiagnosticsTab || !props.contentLoaded,
  });

  const sortedReasons: Array<{
    value: number,
    label: string,
    isInjuryIllness: boolean,
  }> = diagnosticReasons?.diagnostic_reasons
    ?.map(({ id, name, injury_illness_required: isInjuryIllness }) => ({
      value: id,
      label: name,
      isInjuryIllness,
    }))
    .sort((a, b) => {
      const lowercaseA = a.label.toLowerCase();
      const lowercaseB = b.label.toLowerCase();
      return lowercaseA.localeCompare(lowercaseB);
    });

  const {
    data: orderProviders = { location_providers: [], staff_providers: [] },
    error: orderProvidersError,
    isLoading: orderProvidersLoading,
  } = useGetOrderProvidersQuery(
    { activeUsersOnly: true, npi: true },
    {
      skip: !isDiagnosticsTab || !props.contentLoaded,
    }
  );

  const {
    data: medicalLocations = { organisation_locations: [] },
    error: medicalLocationsError,
    isLoading: isMedicalLocationsLoading,
  } = useGetMedicalLocationsQuery(isRedoxOrg ? 'order' : 'diagnostic', {
    skip: !isDiagnosticsTab || !props.contentLoaded,
  });

  const sortedLocations: Array<Option> =
    medicalLocations?.organisation_locations
      ?.map(({ id, name }) => ({
        value: id,
        label: name,
      }))
      .sort((a, b) => {
        const lowercaseA = a.label.toLowerCase();
        const lowercaseB = b.label.toLowerCase();
        return lowercaseA.localeCompare(lowercaseB);
      });

  const getInitialDataRequestStatus = () => {
    if (
      getSquadsError ||
      getDiagnosticStatusesError ||
      getDiagnosticResultTypesError ||
      diagnosticReasonsError ||
      medicalLocationsError ||
      orderProvidersError
    ) {
      return 'FAILURE';
    }
    if (
      areSquadsLoading ||
      areDiagnosticStatusesLoading ||
      areDiagnosticResultTypesLoading ||
      isMedicalLocationsLoading ||
      diagnosticReasonsLoading ||
      orderProvidersLoading
    ) {
      return 'PENDING';
    }
    return null;
  };

  return (
    <DiagnosticFilters
      {...props}
      isRedoxOrg={isRedoxOrg}
      initialDataRequest={getInitialDataRequestStatus()}
      medicalLocations={sortedLocations}
      diagnosticReasons={sortedReasons}
      orderProviders={orderProviders}
      diagnosticResultTypes={diagnosticResultTypes}
      squads={squads.map(({ id, name }) => ({
        value: id,
        label: name,
      }))}
      statuses={statuses?.statuses?.map(({ text, value }) => ({
        value,
        label: text,
      }))}
      onClickAddDiagnostic={() =>
        dispatch(openAddDiagnosticSidePanel({ isAthleteSelectable: false }))
      }
      onClickExportRosterBilling={() => {
        props.exportDiagnosticBilling();
        dispatch(exportRosterBilling());
      }}
      toasts={toasts}
      toastAction={toastDispatch}
    />
  );
};

export default DiagnosticFiltersContainer;
