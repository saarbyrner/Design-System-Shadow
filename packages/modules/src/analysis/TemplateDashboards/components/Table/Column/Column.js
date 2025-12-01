// @flow
import { Fragment } from 'react';

import styles from '../styles';
import {
  getGrowthAndMaturationColumns,
  formatGrowthAndMaturationData,
  handlePHVCellColourCoding,
  handleHeightAndWeightVelocityColourCoding,
} from '../utils';
import type { RowData, Athlete } from './types';

const ATHLETE_ID = 'athlete_id';
const ADULT_HEIGHT_PERCENT_ID = 'g_and_m_percent_adult_height_att';
const HEIGHT_VELOCITY = 'g_and_m_height_velocity';
const WEIGHT_VELOCITY = 'g_and_m_weight_velocity';
const POSITION = 'position';
const MOST_RECENT_MEASUREMENT = 'most_recent_measurement';

type Props = {
  rowData: RowData,
  athlete?: Athlete,
};

const Column = (props: Props) => {
  const getColourCodedCell = (
    columnId: string,
    cellColours: { bg: string, txt: string },
    value: string
  ) => (
    <td
      key={columnId}
      css={[
        styles.cell,
        {
          backgroundColor: cellColours.bg,
          color: cellColours.txt,
        },
      ]}
    >
      {value}
    </td>
  );

  return (
    <tr>
      {getGrowthAndMaturationColumns().map((column) => {
        const value = formatGrowthAndMaturationData(props.rowData, column.id);

        switch (column.id) {
          case ATHLETE_ID:
            return (
              <Fragment key={column.id}>
                <td css={styles.athleteCell}>
                  {props.athlete && props.athlete?.fullname}
                </td>
                <td css={styles.printedAthleteCell}>
                  {props.athlete &&
                    `${props.athlete?.lastname} ${props.athlete?.firstname?.[0]}.`}
                </td>
              </Fragment>
            );
          case POSITION:
          case MOST_RECENT_MEASUREMENT:
            return (
              <Fragment key={column.id}>
                <td css={styles.rotatedCell}>{value}</td>
                <td css={styles.printedRotatedCell}>{value}</td>
              </Fragment>
            );
          case ADULT_HEIGHT_PERCENT_ID: {
            const cellColour = handlePHVCellColourCoding(value);
            return getColourCodedCell(column.id, cellColour, value);
          }
          case HEIGHT_VELOCITY:
          case WEIGHT_VELOCITY: {
            const cellColour = handleHeightAndWeightVelocityColourCoding(value);
            return getColourCodedCell(column.id, cellColour, value);
          }
          default:
            return (
              <td key={column.id} css={styles.cell}>
                {value}
              </td>
            );
        }
      })}
    </tr>
  );
};

export default Column;
