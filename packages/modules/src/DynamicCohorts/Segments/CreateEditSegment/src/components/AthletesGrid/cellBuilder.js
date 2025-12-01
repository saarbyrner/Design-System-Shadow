// @flow
import type { Node } from 'react';
import type { AthleteInfo } from '@kitman/services/src/services/dynamicCohorts/Segments/searchAthletes';
import style from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/src/styles';
import { TextLink } from '@kitman/components';
import type { RowKeyType } from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/src/components/AthletesGrid/types';

export const ROW_KEY = {
  athlete: 'athlete',
};

export const buildCellContent = ({
  row_key: rowKey,
  athlete,
}: {
  row_key: RowKeyType,
  athlete: AthleteInfo,
}): Node => {
  switch (rowKey) {
    case ROW_KEY.athlete:
      return (
        <div css={style.athleteCell}>
          <img
            css={style.athleteAvatar}
            src={athlete.avatar}
            alt={athlete.name}
          />
          <TextLink
            text={athlete.name}
            href={`/athletes/${athlete.id}`}
            kitmanDesignSystem
          />
        </div>
      );
    default:
      return <></>;
  }
};
