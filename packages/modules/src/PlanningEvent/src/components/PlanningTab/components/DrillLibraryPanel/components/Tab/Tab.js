// @flow
import type { EventActivityDrillV2 } from '@kitman/common/src/types/Event';
import { Virtuoso } from 'react-virtuoso';
import { withNamespaces } from 'react-i18next';

import DrillItem from '@kitman/modules/src/PlanningEvent/src/components/PlanningTab/components/DrillItem';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from './style';

export type Props = {
  sortableIdLowerBound?: number,
  drills: Array<EventActivityDrillV2>,
  activityTypeNames: Array<string>,
  getNextDrillLibraryItems: () => void,
  addActivity: (number) => void,
  emptyMessage: string,
  toggleFavorite?: (number) => void | Promise<void>,
};

export default withNamespaces()((props: I18nProps<Props>) =>
  props.drills.length === 0 ? (
    <div css={style.emptyDrillLibrary} data-testid="DrillLibraryPanel|Main">
      <span css={style.emptyDrillLibraryMessage}>{props.emptyMessage}</span>
    </div>
  ) : (
    <div css={style.virtuoso}>
      <Virtuoso
        totalCount={props.drills.length}
        endReached={props.getNextDrillLibraryItems}
        groupCounts={props.activityTypeNames.map(
          (name) =>
            props.drills.filter(
              ({ event_activity_type: type }) => type?.name === name
            ).length
        )}
        groupContent={(index) => {
          const name = props.activityTypeNames[index];
          return (
            <div data-testid={name} css={style.activityTypeName}>
              {name}
            </div>
          );
        }}
        itemContent={(index) => {
          const {
            id,
            name,
            event_activity_drill_library_id: libraryId,
            isFavorite,
          } = props.drills[index];
          return (
            <DrillItem
              id={id}
              libraryId={libraryId}
              name={name}
              sortableId={(props.sortableIdLowerBound ?? 1) + index}
              isFavorite={isFavorite}
              onAdd={() => props.addActivity(id)}
              onToggleFavorite={() => props.toggleFavorite?.(libraryId)}
            />
          );
        }}
      />
    </div>
  )
);
