// @flow
import { useState, useEffect } from 'react';
import uuid from 'uuid';
import { css } from '@emotion/react';
import { ActionTooltip, Select } from '@kitman/components';
import getAthleteIssues from '@kitman/services/src/services/medical/getAthleteIssues';
import { TextHeader } from '@kitman/components/src/TableCells';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Diagnostic } from '../../../../types';
import { useDiagnosticTabForm } from '../../contexts/DiagnosticTabFormContext';
import { useBulkActions } from '../../contexts/BulkActions';
import { mapIssuesToSelect } from '../../utils/mapIssuesToSelect';
import { getReasonPayload } from '../../utils/getReconcilePayload';

type DiagnosticReasonOption = Option & {
  isInjuryIllness: boolean,
};

type Props = {
  diagnostics: Array<Diagnostic>,
  diagnosticReasons: Array<DiagnosticReasonOption>,
  selectedRowsUnreconciledPlayer: boolean,
  selectedRowsSamePlayer: ?number,
};

const style = {
  bulkCTA: css`
    align-items: center;
    display: flex;
    justify-content: space-between;

    i {
      font-size: 11px;
      margin-left: 5px;
    }
  `,
  reconciledReasonSelect: css`
    font-size: 14px;
    min-width: 200px;
  `,
  tooltipDisabled: css`
    opacity: 0.5;
    pointer-events: none;
  `,
};

const DiagnosticReasonHeader = (props: I18nProps<Props>) => {
  const { updateQueuedReconciledDiagnostics } = useDiagnosticTabForm();
  const { bulkActionsState, updateReasonHeader, updateInjuryIllnessOpts } =
    useBulkActions();

  const [playerValue, setPlayerValue] = useState<?Option>(null);
  const [reasonValue, setReasonValue] = useState<?string>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [injuryIllnessOpts, setInjuryIllnessOpts] = useState<Array<Option>>([]);

  const reasonsWithSubmenu = props.diagnosticReasons
    .filter(
      ({ isInjuryIllness }) =>
        (isInjuryIllness && (playerValue || props.selectedRowsSamePlayer)) ||
        !isInjuryIllness
    )
    .map(({ value, label, isInjuryIllness }) => {
      const opt = { value, label };
      if (isInjuryIllness) {
        return {
          ...opt,
          options: injuryIllnessOpts,
        };
      }

      return opt;
    });

  useEffect(() => {
    if (bulkActionsState.playerHeader) {
      setIsDisabled(false);
      setPlayerValue(bulkActionsState.playerHeader);
    }
    if (!props.selectedRowsUnreconciledPlayer) {
      setIsDisabled(false);
    }
  }, [bulkActionsState, props.selectedRowsUnreconciledPlayer]);

  useEffect(() => {
    if (bulkActionsState.injuryIllnessOpts.length !== 0) {
      return;
    }
    if (!playerValue && !props.selectedRowsSamePlayer) {
      return;
    }
    getAthleteIssues({
      // $FlowFixMe[incompatible-call] both playerValue and preloadOptsPlayerId will not be null/undefined
      athleteId: playerValue?.value || props.selectedRowsSamePlayer,
      grouped: true,
      includeIssue: true,
      includeDetailedIssue: true,
    }).then((result) => {
      setInjuryIllnessOpts(mapIssuesToSelect(result));
    });
  }, [bulkActionsState, playerValue, props.selectedRowsSamePlayer]);

  const handleSetAll = () => {
    if (!reasonValue) {
      return;
    }
    updateReasonHeader({ reasonId: reasonValue });

    props.diagnostics.forEach((diagnostic, index) => {
      if (bulkActionsState.bulkActionsDiagnostics.includes(diagnostic.id)) {
        const payload = getReasonPayload(
          index,
          playerValue ? parseInt(playerValue.value, 10) : diagnostic.athlete.id,
          diagnostic.id,
          reasonValue,
          props.diagnosticReasons
        );
        updateQueuedReconciledDiagnostics(payload);
      }
    });

    if (
      reasonValue.startsWith('Injury_') ||
      reasonValue.startsWith('Illness_')
    ) {
      updateInjuryIllnessOpts({ injuryIllnessOpts });
    }
  };

  const handleClickOutside = (instance, e) => {
    setTimeout(() => {
      if (e.srcElement.closest('.kitmanReactSelect__menu-portal')) {
        instance.show();
      }
    }, 0);
  };

  return (
    <div css={isDisabled ? style.tooltipDisabled : null}>
      <ActionTooltip
        content={
          <Select
            css={style.reconciledReasonSelect}
            placeholder={
              playerValue || !props.selectedRowsUnreconciledPlayer
                ? props.t('Select')
                : props.t('Select player first')
            }
            options={reasonsWithSubmenu || []}
            onChange={(reasonId) => setReasonValue(reasonId)}
            value={reasonValue}
            groupBy="submenu"
            isDisabled={isDisabled}
            appendToBody
          />
        }
        actionSettings={{
          text: props.t('Set all'),
          onCallAction: () => handleSetAll(),
        }}
        triggerElement={
          <div css={style.bulkCTA}>
            <TextHeader key={uuid()} value={props.t('Reason')} />
            <div>
              <span>{props.t('Set all')}</span>
              <i className="icon-chevron-down" />
            </div>
          </div>
        }
        onClickOutside={handleClickOutside}
        kitmanDesignSystem
      />
    </div>
  );
};

export default DiagnosticReasonHeader;
