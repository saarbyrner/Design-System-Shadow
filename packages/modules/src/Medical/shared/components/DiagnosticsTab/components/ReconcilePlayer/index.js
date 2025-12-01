// @flow
import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { AsyncSelect } from '@kitman/components';
import { searchOrgAthletes } from '@kitman/services';
import type { SelectOption as Option } from '@kitman/components/src/types';
import { useDiagnosticTabForm } from '../../contexts/DiagnosticTabFormContext';
import type { Diagnostic } from '../../../../types';
import { useBulkActions } from '../../contexts/BulkActions';
import { getPlayerPayload } from '../../utils/getReconcilePayload';

type Props = {
  diagnostic: Diagnostic,
  index: number,
};

const styles = {
  unreconciledPlayer: css`
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
  reconcilePlayerSelect: css`
    .kitmanReactSelect__option {
      line-height: 1.3em;
      white-space: pre-line;
    }
  `,
};
const ReconcilePlayer = (props: Props) => {
  const {
    diagnosticTabFormState,
    updateQueuedReconciledDiagnostics,
    updateRowsToReconcile,
    updatePlayerOpts,
  } = useDiagnosticTabForm();

  const { bulkActionsState } = useBulkActions();

  const [readOnly, setReadOnly] = useState<boolean>(
    window.featureFlags['diagnostics-tab-bulk-actions']
  );

  const stateAthleteId =
    diagnosticTabFormState.queuedReconciledDiagnostics[props.index]?.athleteId;
  const stateAthlete = diagnosticTabFormState.playerOpts[stateAthleteId];

  const [allowEdit, setAllowEdit] = useState<boolean>(true);
  const [playerValue, setPlayerValue] = useState<Option | null>(
    stateAthlete || null
  );

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
        setPlayerValue(null);
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
      if (bulkActionsState.playerHeader) {
        setPlayerValue(bulkActionsState.playerHeader);
      }
    }
  }, [bulkActionsState]);

  const renderRawAthleteInfo = (rawAthleteInfo: string) => {
    const rawAthleteInfoSplit = rawAthleteInfo.split(' - ');
    return (
      <div>
        {rawAthleteInfoSplit[0]}
        <br />
        {rawAthleteInfoSplit[1]}
      </div>
    );
  };

  const handleChange = (athlete) => {
    setPlayerValue(athlete);

    updatePlayerOpts({ id: athlete.value, opt: athlete });

    const payload = getPlayerPayload(
      props.index,
      athlete.value,
      props.diagnostic.id
    );
    updateQueuedReconciledDiagnostics(payload);
  };

  return (
    <>
      {readOnly ? (
        <div css={styles.unreconciledPlayer}>
          <i className="icon-error-active" />
          {renderRawAthleteInfo(props.diagnostic.raw_athlete_info)}
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
        <div css={styles.reconcilePlayerSelect}>
          <AsyncSelect
            label=""
            value={playerValue}
            onChange={(athlete) => handleChange(athlete)}
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
            appendToBody
            placeholder={props.diagnostic.raw_athlete_info}
          />
        </div>
      )}
    </>
  );
};

export default ReconcilePlayer;
