// @flow
import { useContext, useMemo, useRef } from 'react';
import { css } from '@emotion/react';
import useResponsivePitchView from '@kitman/modules/src/PlanningEvent/src/hooks/useResponsivePitchView';
import FormationEditorContext from '@kitman/modules/src/PlanningEvent/src/contexts/FormationEditorContext';
import EditablePitchPosition from '../EditablePitchPosition';
import styles from './style';
import sportsSettings from '../sportsSettings';
import { actionTypes } from '../reducer';

type Props = {
  sport: 'soccer',
};

const Pitch = ({ sport }: Props) => {
  const { state, dispatch } = useContext(FormationEditorContext);
  const selectedSportSettings = sportsSettings[sport];
  const columns = useMemo(
    () => [...Array(state.field.columns).keys()],
    [state.field.columns]
  );
  const rows = useMemo(
    () => [...Array(state.field.rows).keys()],
    [state.field.rows]
  );
  const pitchRef = useRef(null);
  useResponsivePitchView({
    initialWidth: selectedSportSettings.pitchWidth,
    initialHeight: selectedSportSettings.pitchHeight,
    columns: state.field.columns,
    rows: state.field.rows,
    pitchId: 'pitch',
    pitchRef,
    setField: (payload) => dispatch({ type: actionTypes.SET_FIELD, payload }),
  });

  return (
    <div
      id="pitch"
      ref={pitchRef}
      data-testid="Pitch"
      css={[
        styles.pitchWrapper,
        css`
          height: ${state.field.height}px;
        `,
      ]}
    >
      {state.selectedFormation &&
        rows.map((rowX) => {
          return (
            <div key={rowX} css={styles.inFieldPositionsWrapper}>
              {columns.map((columnY) => {
                const id = `${rowX}_${columnY}`;
                const data = state.formationCoordinatesCopy?.[id];

                return (
                  <EditablePitchPosition
                    key={id}
                    cellId={id}
                    positionData={data}
                  />
                );
              })}
            </div>
          );
        })}
    </div>
  );
};

export default Pitch;
