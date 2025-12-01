// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { useEffect, useState } from 'react';
import { Select } from '@kitman/components';
import getAthleteIssues from '@kitman/services/src/services/medical/getAthleteIssues';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useDiagnosticTabForm } from '../../contexts/DiagnosticTabFormContext';
import { useBulkActions } from '../../contexts/BulkActions';
import type { Diagnostic } from '../../../../types';
import { mapIssuesToSelect } from '../../utils/mapIssuesToSelect';
import { getReasonPayload } from '../../utils/getReconcilePayload';

type DiagnosticReasonOption = Option & {
  isInjuryIllness: boolean,
};
type Props = {
  index: number,
  diagnostic: Diagnostic,
  diagnosticReasons: Array<DiagnosticReasonOption>,
};

const styles = {
  unreconciledReason: css`
    display: flex;
    align-items: center;
    line-height: 16px;

    > div {
      color: ${colors.red_200};
    }

    i.icon-error-active {
      color: ${colors.red_200};
      font-size: 20px;
      margin-right: 8px;
    }

    i.icon-edit {
      opacity: 0;
      cursor: pointer;
      font-size: 20px;
      margin-left: 5px;
    }

    &:hover {
      i.icon-edit {
        opacity: 1;
      }
    }

    &:disabled {
      i.icon-edit {
        opacity: 0.5;
      }
    }
  `,
};

const DiagnosticReason = (props: I18nProps<Props>) => {
  const {
    diagnosticTabFormState,
    updateQueuedReconciledDiagnostics,
    updateRowsToReconcile,
    updatePlayerInjuryIllnessOpts,
  } = useDiagnosticTabForm();

  const { bulkActionsState } = useBulkActions();

  const stateReasonId =
    diagnosticTabFormState.queuedReconciledDiagnostics[props.index]?.reasonId ||
    null;
  const stateIssue =
    diagnosticTabFormState.queuedReconciledDiagnostics[props.index]?.issue ||
    null;

  const [reasonValue, setReasonValue] = useState<?string | ?number>(
    stateIssue ? `${stateIssue.type}_${stateIssue.id}` : stateReasonId
  );
  const [readOnly, setReadOnly] = useState<boolean>(
    window.featureFlags['diagnostics-tab-bulk-actions']
  );
  const [allowEdit, setAllowEdit] = useState<boolean>(true);
  const [playerInjuryIllnessOpts, setPlayerInjuryIllnessOpts] = useState<
    Array<Option>
  >([]);

  const diagnosticPlayerId = props.diagnostic.athlete?.id;
  const reconcilePlayerId =
    diagnosticTabFormState.queuedReconciledDiagnostics[props.index]?.athleteId;

  const playerId = diagnosticPlayerId || reconcilePlayerId;

  useEffect(() => {
    if (window.featureFlags['diagnostics-tab-bulk-actions']) {
      if (
        diagnosticTabFormState.rowsToReconcile.includes(props.diagnostic.id)
      ) {
        setReadOnly(false);
      } else if (
        !diagnosticTabFormState.rowsToReconcile.includes(props.diagnostic.id) &&
        !bulkActionsState.bulkActionsMode
      ) {
        setReadOnly(true);
      }
      if (!diagnosticTabFormState.queuedReconciledDiagnostics[props.index]) {
        setReasonValue(null);
      }
    }
  }, [diagnosticTabFormState]);

  useEffect(() => {
    if (window.featureFlags['diagnostics-tab-bulk-actions']) {
      if (
        bulkActionsState.bulkActionsMode ||
        bulkActionsState.bulkActionsDiagnostics.includes(props.diagnostic.id)
      ) {
        setAllowEdit(false);
      }
      if (
        bulkActionsState.bulkActionsMode &&
        bulkActionsState.bulkActionsDiagnostics.includes(props.diagnostic.id)
      ) {
        setReadOnly(false);
      }
      if (bulkActionsState.reasonHeader) {
        setReasonValue(bulkActionsState.reasonHeader);
      }
    }
  }, [bulkActionsState]);

  const reasonsWithSubmenu = props.diagnosticReasons.map(
    ({ value, label, isInjuryIllness }) => {
      const opt = { value, label };
      if (isInjuryIllness) {
        if (bulkActionsState.injuryIllnessOpts.length) {
          return {
            ...opt,
            options: bulkActionsState.injuryIllnessOpts,
          };
        }
        if (diagnosticTabFormState.playerInjuryIllnessOpts[playerId]) {
          return {
            ...opt,
            options: diagnosticTabFormState.playerInjuryIllnessOpts[playerId],
          };
        }
        return {
          ...opt,
          loadAsyncOptions: {
            fetchOptions: getAthleteIssues,
            fetchOptionsArgs: {
              athleteId: playerId,
              grouped: true,
              includeIssue: true,
              includeDetailedIssue: true,
            },
            mapping: {
              callback: (issues) => {
                const opts = mapIssuesToSelect(issues);
                setPlayerInjuryIllnessOpts(opts);
                return opts;
              },
            },
          },
        };
      }

      return opt;
    }
  );

  const handleChange = (reasonId) => {
    setReasonValue(reasonId);

    if (typeof reasonId === 'string') {
      updatePlayerInjuryIllnessOpts({
        id: playerId,
        opts: playerInjuryIllnessOpts,
      });
    }

    const payload = getReasonPayload(
      props.index,
      playerId,
      props.diagnostic.id,
      reasonId,
      props.diagnosticReasons
    );
    updateQueuedReconciledDiagnostics(payload);
  };

  return (
    <>
      {readOnly ? (
        <div css={styles.unreconciledReason}>
          <i className="icon-error-active" />
          <div>{props.t('Outstanding')}</div>
          {allowEdit && (
            <i
              className="icon-edit"
              onClick={() => {
                setReadOnly(false);
                updateRowsToReconcile({ diagnosticId: props.diagnostic.id });
              }}
            />
          )}
        </div>
      ) : (
        <Select
          placeholder={
            playerId ? props.t('Select') : props.t('Select player first')
          }
          options={reasonsWithSubmenu || []}
          onChange={(reasonId) => {
            handleChange(reasonId);
          }}
          value={reasonValue}
          appendToBody
          groupBy="submenu"
          isDisabled={!playerId}
          asyncSubmenu={!bulkActionsState.injuryIllnessOpts.length}
        />
      )}
    </>
  );
};

export default DiagnosticReason;
