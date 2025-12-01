// @flow
import { useState, useEffect } from 'react';
import uuid from 'uuid';
import { css } from '@emotion/react';
import { ActionTooltip, AsyncSelect } from '@kitman/components';
import { TextHeader } from '@kitman/components/src/TableCells';
import { searchOrgAthletes } from '@kitman/services';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Diagnostic } from '../../../../types';
import { useDiagnosticTabForm } from '../../contexts/DiagnosticTabFormContext';
import { useBulkActions } from '../../contexts/BulkActions';
import { getPlayerPayload } from '../../utils/getReconcilePayload';

type Props = {
  diagnostics: Array<Diagnostic>,
  selectedRowsUnreconciledPlayer: boolean,
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
  reconcileAthleteSelect: css`
    font-size: 14px;
    min-width: 250px;

    .kitmanReactSelect__option {
      line-height: 1.3em;
      white-space: pre-line;
    }
  `,
  tooltipDisabled: css`
    opacity: 0.5;
    pointer-events: none;
  `,
};

const ReconcilePlayerHeader = (props: I18nProps<Props>) => {
  const { updateQueuedReconciledDiagnostics } = useDiagnosticTabForm();
  const { bulkActionsState, updatePlayerHeader } = useBulkActions();

  const [playerValue, setPlayerValue] = useState<?Option>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (props.selectedRowsUnreconciledPlayer) {
      setIsDisabled(false);
    }
  }, [props.selectedRowsUnreconciledPlayer]);

  const handleSetAll = () => {
    if (!playerValue) {
      return;
    }
    updatePlayerHeader({ player: playerValue });
    props.diagnostics.forEach((diagnostic, index) => {
      if (bulkActionsState.bulkActionsDiagnostics.includes(diagnostic.id)) {
        const payload = getPlayerPayload(
          index,
          parseInt(playerValue.value, 10),
          diagnostic.id
        );
        updateQueuedReconciledDiagnostics(payload);
      }
    });
  };

  return (
    <div css={isDisabled ? style.tooltipDisabled : null}>
      <ActionTooltip
        content={
          <div css={style.reconcileAthleteSelect}>
            <AsyncSelect
              label=""
              value={playerValue}
              onChange={(athlete) => setPlayerValue(athlete)}
              loadOptions={(searchValue, callback) => {
                searchOrgAthletes(searchValue).then((data) => {
                  callback(
                    data.athletes.map((athlete) => {
                      return {
                        value: athlete.id,
                        label: `${athlete.fullname} - \n ${athlete.date_of_birth}`,
                      };
                    })
                  );
                });
              }}
              minimumLetters={3}
              kitmanDesignSystem
              placeholder={props.t('Search')}
              isDisabled={isDisabled}
            />
          </div>
        }
        actionSettings={{
          text: props.t('Set all'),
          onCallAction: () => handleSetAll(),
        }}
        triggerElement={
          <div css={style.bulkCTA}>
            <TextHeader key={uuid()} value={props.t('Player')} />
            <div>
              <span>{props.t('Set all')}</span>
              <i className="icon-chevron-down" />
            </div>
          </div>
        }
        kitmanDesignSystem
      />
    </div>
  );
};

export default ReconcilePlayerHeader;
