// @flow
import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { TextButton, ReactDataGrid } from '@kitman/components';
import { getAthleteConcussionAssessmentResults } from '@kitman/services/src/index';
import type { ConcussionAssessmentResultType } from '@kitman/modules/src/Medical/shared/types/medical/ConcussionAssessmentResult';
import type { ConcussionPermissions } from '@kitman/common/src/contexts/PermissionsContext/concussion/types';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useIssue } from '../../../../shared/contexts/IssueContext';
import buildDataTableHeaderData from './utils';
import AddConcussionAssessmentSidePanel from '../../../../shared/containers/AddConcussionAssessmentSidePanel';
import AddConcussionTestResultSidePanel from '../../../../shared/containers/AddConcussionTestResultSidePanel';
import MedicalSidePanels from '../../../../shared/containers/MedicalSidePanels';
import type { RequestStatus } from '../../../../shared/types';
import style from './style';

type Props = {
  onAddConcussionAssessment: Function,
  onOpenAddConcussionTestResultSidePanel: Function,
  athleteId: number,
  athleteData: AthleteData,
  issueId?: string | null,
  reloadDataByType: Array<ConcussionAssessmentResultType>,
  onReloadInitiated: Function,
  permissions: ConcussionPermissions,
  reloadAthleteData?: (boolean) => void,
  scopeToLevel?: string,
  isMedicalDocumentPanelOpen?: boolean,
  setIsMedicalDocumentPanelOpen?: (boolean) => void,
  isMedicalFilePanelOpen?: boolean,
  setIsMedicalFilePanelOpen?: (boolean) => void,
};

const AssessmentTab = (props: I18nProps<Props>) => {
  const [assessmentRequestStatus, setAssessmentRequestStatus] =
    useState<RequestStatus>('PENDING');
  const [npcRequestStatus, setNPCRequestStatus] =
    useState<RequestStatus>('PENDING');
  const [kingDevickRequestStatus, setKingDevickRequestStatus] =
    useState<RequestStatus>('PENDING');
  const [assessmentErrorMessage, setAssessmentErrorMessage] = useState<
    string | null
  >(null);
  const [npcErrorMessage, setNpcErrorMessage] = useState<string | null>(null);
  const [kingDevickErrorMessage, setKingDevickErrorMessage] = useState<
    string | null
  >(null);
  const [assessmentTableBodyData, setAssessmentTableBodyData] = useState([]);
  const [npcTableBodyData, setNpcTableBodyData] = useState([]);
  const [kingDevickTableBodyData, setKingDevickTableBodyData] = useState([]);
  const [assessmentTableHeaderData, setAssessmentTableHeaderData] = useState(
    []
  );
  const [npcTableHeaderData, setNpcTableHeaderData] = useState([]);
  const [kingDevickTableHeaderData, setKingDevickTableHeaderData] = useState(
    []
  );

  const { issue, issueType } = useIssue();
  const { id: issueId } = issue;

  const fetchAssessmentResults = () => {
    if (
      !(
        props.permissions.canManageConcussionAssessments ||
        props.permissions.canViewConcussionAssessments
      )
    ) {
      return;
    }
    setAssessmentRequestStatus('PENDING');
    getAthleteConcussionAssessmentResults(
      props.athleteId,
      issueId,
      issueType,
      'assessments'
    ).then(
      (response) => {
        /* add expanded value & type */
        const newAssessmentData = response.map((assesmentData) => ({
          ...assesmentData,
          expanded: false,
          type: 'MAIN',
        }));
        setAssessmentTableBodyData(newAssessmentData);
        setAssessmentTableHeaderData(
          buildDataTableHeaderData(newAssessmentData)
        );
        setAssessmentRequestStatus('SUCCESS');
      },
      (errorResponse) => {
        setAssessmentErrorMessage(errorResponse?.responseJSON?.message);
        setAssessmentRequestStatus('FAILURE');
      }
    );
  };

  const onAssessmentRowsChange = (rows, { indexes }) => {
    const row = rows[indexes[0]];
    if (row.type === 'MAIN') {
      if (!row.expanded) {
        rows.splice(indexes[0] + 1, row.sub_rows.length);
      } else {
        row.sub_rows.forEach((element, index) => {
          const obj = element;
          const baselineValue = parseInt(element.column_baseline, 10);
          let hasBeenAboveBaseline = false;
          /*
           * Adding flags to values that are above the baseline value.
           * If the current value is above baseline the row should be highlighted as 'red'
           * If the value was above baseline and has returned to equal/below baseline previous red values should be highlighted 'orange'
           */
          Object.entries(obj).forEach(([key, value]) => {
            /* if the value is of type object then we are dealing with a date value */
            if (typeof value === 'object' && value) {
              if (value.value === '-') return;
              /* if the value has been above baseline and has returned to below or equal */
              if (
                hasBeenAboveBaseline &&
                parseInt(value.value, 10) <= baselineValue
              ) {
                obj.backgroundAlert = 'orangeAlert';
                obj[key].backgroundAlert = 'belowOrEqualBaseline';
              } else if (parseInt(value.value, 10) > baselineValue) {
                obj.backgroundAlert = 'redAlert';
                hasBeenAboveBaseline = true;
              } else obj[key].backgroundAlert = 'belowOrEqualBaseline';
            }
          });

          if (index === 0) {
            obj.type = 'DETAIL_FIRST';
          } else if (row.sub_rows.length === index + 1) {
            obj.type = 'DETAIL_LAST';
          } else {
            obj.type = 'DETAIL';
          }
          rows.splice(indexes[0] + index + 1, 0, obj);
        });
      }
      setAssessmentTableBodyData(rows);
    }
  };

  const fetchNpcResults = () => {
    if (
      !(
        props.permissions.canManageConcussionAssessments ||
        props.permissions.canViewConcussionAssessments ||
        props.permissions.canViewNpcAssessments
      )
    ) {
      return;
    }
    setNPCRequestStatus('PENDING');
    getAthleteConcussionAssessmentResults(
      props.athleteId,
      issueId,
      issueType,
      'npc'
    ).then(
      (response) => {
        setNpcTableBodyData(response);
        setNpcTableHeaderData(buildDataTableHeaderData(response));
        setNPCRequestStatus('SUCCESS');
      },
      (errorResponse) => {
        setNpcErrorMessage(errorResponse?.responseJSON?.message);
        setNPCRequestStatus('FAILURE');
      }
    );
  };

  const fetchKingDevickResults = () => {
    if (
      !(
        props.permissions.canManageConcussionAssessments ||
        props.permissions.canViewConcussionAssessments ||
        props.permissions.canViewKingDevickAssessments
      )
    ) {
      return;
    }
    setKingDevickRequestStatus('PENDING');
    getAthleteConcussionAssessmentResults(
      props.athleteId,
      issueId,
      issueType,
      'king_devick'
    ).then(
      (response) => {
        setKingDevickTableBodyData(response);
        setKingDevickTableHeaderData(buildDataTableHeaderData(response));
        setKingDevickRequestStatus('SUCCESS');
      },
      (errorResponse) => {
        setKingDevickErrorMessage(errorResponse?.responseJSON?.message);
        setKingDevickRequestStatus('FAILURE');
      }
    );
  };

  useEffect(() => {
    fetchAssessmentResults();
    fetchNpcResults();
    fetchKingDevickResults();
  }, []);

  useEffect(() => {
    if (props.reloadDataByType.length === 0) {
      return;
    }

    if (props.reloadDataByType.includes('assessments')) {
      fetchAssessmentResults();
    }
    if (props.reloadDataByType.includes('npc')) {
      fetchNpcResults();
    }
    if (props.reloadDataByType.includes('king_devick')) {
      fetchKingDevickResults();
    }
    props.onReloadInitiated();
  }, [props.reloadDataByType]);

  const getAssessmentResultsTable = () => {
    return (
      <div
        data-testid="AssessmentTab|AssessmentTable"
        css={[style.dataGridTable, style.dataGridTableSubRows]}
      >
        {assessmentRequestStatus === 'PENDING' && (
          <div css={style.loader}>{props.t('Loading')} ...</div>
        )}
        {assessmentTableHeaderData.length > 0 &&
          assessmentTableBodyData.length > 0 && (
            <ReactDataGrid
              tableHeaderData={assessmentTableHeaderData}
              tableBodyData={assessmentTableBodyData}
              expandableSubRows
              onRowsChange={onAssessmentRowsChange}
              rowClass={(row) => row.backgroundAlert}
              tableGrow
              rowHeight={36}
            />
          )}
        {assessmentRequestStatus === 'FAILURE' && (
          <div css={style.requestErrorText}>
            {assessmentErrorMessage || props.t('Error')}
          </div>
        )}
      </div>
    );
  };

  const getNpcResultsTable = () => {
    return (
      <div
        data-testid="AssessmentTab|NPCTable"
        css={[style.dataGridTable, style.dataGridTableBasic]}
      >
        {npcRequestStatus === 'PENDING' && (
          <div css={style.loader}>{props.t('Loading')} ...</div>
        )}
        {npcTableHeaderData.length > 0 && npcTableBodyData.length > 0 && (
          <ReactDataGrid
            tableHeaderData={npcTableHeaderData}
            tableBodyData={npcTableBodyData}
            tableGrow
            rowHeight={36}
          />
        )}
        {npcRequestStatus === 'FAILURE' && (
          <div css={style.requestErrorText}>
            {npcErrorMessage || props.t('Error')}
          </div>
        )}
      </div>
    );
  };

  const getKingDevickResultsTable = () => {
    return (
      <div
        data-testid="AssessmentTab|KDTable"
        css={[style.dataGridTable, style.dataGridTableBasic]}
      >
        {kingDevickRequestStatus === 'PENDING' && (
          <div css={style.loader}>{props.t('Loading')} ...</div>
        )}
        {kingDevickTableHeaderData.length > 0 &&
          kingDevickTableBodyData.length > 0 && (
            <ReactDataGrid
              tableHeaderData={kingDevickTableHeaderData}
              tableBodyData={kingDevickTableBodyData}
              tableGrow
              rowHeight={36}
            />
          )}
        {kingDevickRequestStatus === 'FAILURE' && (
          <div css={style.requestErrorText}>
            {kingDevickErrorMessage || props.t('Error')}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {(props.permissions.canManageConcussionAssessments ||
        props.permissions.canViewConcussionAssessments) && (
        <div css={style.section} data-testid="AssessmentTab|AssessmentSection">
          <div css={style.sectionHeader}>
            <h2>{props.t('Concussion assessment results')}</h2>
            {(props.permissions.canManageConcussionAssessments ||
              props.permissions.canAttachConcussionAssessments) && (
              <TextButton
                text={props.t('Add concussion assessment')}
                type="secondary"
                onClick={props.onAddConcussionAssessment}
                kitmanDesignSystem
              />
            )}
          </div>
          {getAssessmentResultsTable()}
        </div>
      )}
      {(props.permissions.canManageConcussionAssessments ||
        props.permissions.canViewConcussionAssessments ||
        props.permissions.canViewNpcAssessments) && (
        <div
          css={style.section}
          data-testid="AssessmentTab|NPCAssessmentSection"
        >
          <div css={style.sectionHeader}>
            <h2>{props.t('Near Point of Convergence (NPC)')}</h2>

            {(props.permissions.canManageConcussionAssessments ||
              props.permissions.canManageNpcAssessments) && (
              <TextButton
                text={props.t('Add NPC')}
                type="secondary"
                onClick={() => {
                  props.onOpenAddConcussionTestResultSidePanel('NPC');
                }}
                kitmanDesignSystem
              />
            )}
          </div>
          {getNpcResultsTable()}
        </div>
      )}
      {(props.permissions.canManageConcussionAssessments ||
        props.permissions.canViewConcussionAssessments ||
        props.permissions.canViewKingDevickAssessments) && (
        <div
          css={style.section}
          data-testid="AssessmentTab|KingDevickAssessmentSection"
        >
          <div css={style.sectionHeader}>
            <h2>{props.t('King-Devick results')}</h2>
            {(props.permissions.canManageConcussionAssessments ||
              props.permissions.canManageKingDevickAssessments) && (
              <TextButton
                text={props.t('Add King-Devick')}
                type="secondary"
                onClick={() => {
                  props.onOpenAddConcussionTestResultSidePanel('KING-DEVICK');
                }}
                kitmanDesignSystem
              />
            )}
          </div>
          {getKingDevickResultsTable()}
        </div>
      )}
      {window.featureFlags['medical-global-add-button-fix'] &&
        props.scopeToLevel === 'issue' && (
          <MedicalSidePanels
            athleteId={props.athleteId}
            athleteData={props.athleteData}
            issueId={props.issueId}
            reloadAthleteData={props.reloadAthleteData}
            isMedicalDocumentPanelOpen={props.isMedicalDocumentPanelOpen}
            setIsMedicalDocumentPanelOpen={props.setIsMedicalDocumentPanelOpen}
            isMedicalFilePanelOpen={props.isMedicalFilePanelOpen}
            setIsMedicalFilePanelOpen={props.setIsMedicalFilePanelOpen}
            onSidePanelAction={() => {
              fetchAssessmentResults();
            }}
          />
        )}
      {(props.permissions.canManageConcussionAssessments ||
        props.permissions.canAttachConcussionAssessments) && (
        <AddConcussionAssessmentSidePanel
          athleteId={props.athleteId}
          onAssessmentAdded={() => {
            fetchAssessmentResults();
          }}
        />
      )}
      {(props.permissions.canManageConcussionAssessments ||
        props.permissions.canManageKingDevickAssessments ||
        props.permissions.canManageNpcAssessments) && (
        <AddConcussionTestResultSidePanel
          athleteId={props.athleteId}
          onAssessmentAdded={(resultType: ConcussionAssessmentResultType) => {
            switch (resultType) {
              case 'king_devick': {
                fetchKingDevickResults();
                break;
              }
              case 'npc': {
                fetchNpcResults();
                break;
              }
              default: {
                fetchAssessmentResults();
              }
            }
          }}
        />
      )}
    </>
  );
};

export const AssessmentTabTranslated: ComponentType<Props> =
  withNamespaces()(AssessmentTab);
export default AssessmentTab;
