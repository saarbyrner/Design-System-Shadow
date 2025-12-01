// @flow
import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { withNamespaces } from 'react-i18next';
import _xor from 'lodash/xor';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import { AppStatus } from '@kitman/components';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import ProceduresFilters from '../../containers/ProceduresFilters';
import useProcedures from '../../hooks/useProcedures';
import { useIssue } from '../../contexts/IssueContext';
import { ProceduresListTranslated as ProceduresList } from './components/ProceduresList/ProceduresList';
import { ArchiveProcedureModalContainerTranslated as ArchiveProcedureModalContainer } from './components/ArchiveProcedureModal/ArchiveProcedureModalContainer';
import AddProcedureSidePanel from '../../containers/AddProcedureSidePanel';
import MedicalSidePanels from '../../containers/MedicalSidePanels';
import useSessionMedicalFilters from '../../hooks/useSessionMedicalFilters';
import { getDefaultProceduresFilters } from '../../utils';
import type { RequestStatus } from '../../types';

type Props = {
  athleteId?: number,
  athleteData?: AthleteData,
  issueId?: string | null,
  reloadData: boolean,
  reloadAthleteData?: (boolean) => void,
  hiddenFilters?: Array<string>,
  scopeToLevel?: string,
  isMedicalDocumentPanelOpen?: boolean,
  setIsMedicalDocumentPanelOpen?: (boolean) => void,
  isMedicalFilePanelOpen?: boolean,
  setIsMedicalFilePanelOpen?: (boolean) => void,
};

const style = {
  wrapper: css`
    min-height: 540px;
  `,
  noProceduresText: css`
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

const ProceduresTab = (props: I18nProps<Props>) => {
  const { issue, issueType, isChronicIssue } = useIssue();
  const { id: issueId } = issue;
  const { organisation } = useOrganisation();
  const [archiveModalOpen, setArchiveModalOpen] = useState<boolean>(false);
  const [archiveProcedureId, setArchiveProcedureId] = useState<number | null>(
    null
  );
  const athleteOnTrial =
    props.athleteData?.constraints?.organisation_status === 'TRIAL_ATHLETE';

  const [proceduresTabRequestStatus, setProceduresTabRequestStatus] =
    useState<RequestStatus>(null);
  const persistedFilters = _xor(
    ['date_range', 'procedure_reason_ids', 'procedure_location_ids', 'squads'],
    props.hiddenFilters
  );
  const [filters, setFilters] = useSessionMedicalFilters<ProceduresFilters>(
    () => {
      const filterOptions = {
        athleteId: props.athleteId || null,
        issueType: issueType || null,
        issueId: issueId || null,
      };
      if (isChronicIssue) {
        filterOptions.issueType = 'Emr::Private::Models::ChronicIssue';
      }
      return getDefaultProceduresFilters(filterOptions);
    },
    persistedFilters,
    props.scopeToLevel
  );

  const { procedures, fetchProcedures, resetProcedures, resetNextPage } =
    useProcedures();

  const getNextProcedures = useDebouncedCallback(
    ({ resetList = false } = {}) => {
      if (resetList) {
        resetProcedures();
      }
      setProceduresTabRequestStatus('PENDING');
      fetchProcedures(filters, resetList)
        .then(() => setProceduresTabRequestStatus('SUCCESS'))
        .catch(() => {
          setProceduresTabRequestStatus('FAILURE');
        });
    },
    400
  );

  const buildProcedures = () => {
    resetProcedures();
    resetNextPage();
    getNextProcedures({ resetList: true });
  };

  useEffect(() => {
    buildProcedures();
  }, [filters]);

  useEffect(() => {
    if (!props.reloadData) {
      return;
    }
    buildProcedures();
  }, [props.reloadData]);

  useEffect(() => {
    // This is needed for when using PlayerSelector as filters don't update with change of athlete
    // or issue. Still persisting filters, so only athlete & issue needs changing.
    // $FlowIgnore Constructing object to match initial filter
    setFilters((prevFilters) => ({
      ...prevFilters,
      athlete_ids: [props.athleteId],
      ...(issueId &&
        issueType && {
          issue_occurrence: {
            id: issueId,
            type: isChronicIssue
              ? 'Emr::Private::Models::ChronicIssue'
              : issueType,
          },
        }),
    }));
  }, [props.athleteId, issue]);

  return (
    <div css={style.wrapper} data-testid="ProceduresTab|Tab">
      <ProceduresFilters
        {...props}
        filters={filters}
        onChangeFilter={(updatedFilter) => setFilters(updatedFilter)}
      />
      <ProceduresList
        athleteId={props.athleteId || null}
        currentOrganisation={organisation}
        procedures={procedures}
        proceduresTabRequestStatus={proceduresTabRequestStatus}
        isLoading={proceduresTabRequestStatus === 'PENDING'}
        onReachingEnd={getNextProcedures}
        onOpenArchiveProcedureModal={(procedureId) => {
          setArchiveProcedureId(procedureId);
          setArchiveModalOpen(true);
        }}
        athleteOnTrial={athleteOnTrial}
      />

      {archiveModalOpen && (
        <ArchiveProcedureModalContainer
          isOpen={archiveModalOpen}
          procedureId={archiveProcedureId}
          onClose={() => setArchiveModalOpen(false)}
          onPressEscape={() => setArchiveModalOpen(false)}
          onReloadData={buildProcedures}
        />
      )}
      {proceduresTabRequestStatus === 'SUCCESS' && procedures.length === 0 && (
        <div css={style.noProceduresText}>
          {props.t('No Procedures for this period')}
        </div>
      )}
      {proceduresTabRequestStatus === 'FAILURE' && <AppStatus status="error" />}
      {window.featureFlags['medical-global-add-button-fix'] &&
      props.scopeToLevel === 'issue' ? (
        <MedicalSidePanels
          athleteId={props.athleteId}
          athleteData={props.athleteData}
          issueId={props.issueId}
          reloadAthleteData={props.reloadAthleteData}
          isMedicalDocumentPanelOpen={props.isMedicalDocumentPanelOpen}
          setIsMedicalDocumentPanelOpen={props.setIsMedicalDocumentPanelOpen}
          isMedicalFilePanelOpen={props.isMedicalFilePanelOpen}
          setIsMedicalFilePanelOpen={props.setIsMedicalFilePanelOpen}
          onSidePanelAction={buildProcedures}
        />
      ) : (
        <AddProcedureSidePanel
          athleteId={props.athleteId}
          onSaveProcedure={buildProcedures}
        />
      )}
    </div>
  );
};

export const ProceduresTabTranslated: ComponentType<Props> =
  withNamespaces()(ProceduresTab);
export default ProceduresTab;
