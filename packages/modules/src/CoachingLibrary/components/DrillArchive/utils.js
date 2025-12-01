// @flow
import { useEffect, useRef } from 'react';

import { type EventActivityDrillV2 } from '@kitman/common/src/types/Event';
import type { HeaderData } from '@kitman/components/src/ReactDataGrid';
import type { Squads } from '@kitman/services/src/services/getSquads';
import { TooltipMenu, TextButton } from '@kitman/components';
import { getIntensityTranslation } from '@kitman/common/src/utils/eventIntensity';
import type { Translation } from '@kitman/common/src/types/i18n';

import style from './style';

export type Row = EventActivityDrillV2 & {
  selected: boolean,
  squads?: Squads,
};

const EMPTY_TAGS_REGEXP: RegExp = /(((<\w+>)+[ \n(<br>)]*(<\/\w+>)+)+)|<br>/g;

const DescriptionFormatter = ({ row }: { row: Row }) => {
  const ref: { current: ?HTMLSpanElement } = useRef<?HTMLSpanElement>(null);
  let description: string = 'N/A';
  if (row.notes?.replace(EMPTY_TAGS_REGEXP, '')) {
    description = row.notes ?? '';
  }
  useEffect(() => {
    const descriptionElement: ?HTMLSpanElement = ref?.current;
    if (descriptionElement && descriptionElement.innerHTML !== description) {
      // description is rich text.
      descriptionElement.innerHTML = description;
    }
  }, [description]);
  return <span ref={ref} />;
};

export default ({
  t,
  numberOfSquads,
  setViewedDrill,
  onRestore,
}: {
  t: Translation,
  numberOfSquads: number,
  setViewedDrill: (Row) => void,
  onRestore: (Row) => void,
}): Array<HeaderData> => [
  {
    key: 'name',
    name: t('Drill name'),
    formatter: ({ row }: { row: Row }) => (
      <span css={style.name} onClick={() => setViewedDrill(row)}>
        {row.name}
      </span>
    ),
    resizable: true,
    width: 190,
  },
  {
    key: 'description',
    name: t('Description'),
    formatter: DescriptionFormatter,
    resizable: true,
    width: 230,
  },
  {
    key: 'intensity',
    name: t('Intensity'),
    formatter: ({ row }: { row: Row }) => (
      <span css={style.intensity}>
        {getIntensityTranslation(row.intensity, t)}
      </span>
    ),
    resizable: true,
    width: 110,
  },
  {
    key: 'type',
    name: t('Activity type'),
    formatter: ({ row }: { row: Row }) =>
      row.event_activity_type?.name || t('N/A'),
    resizable: true,
    width: 150,
  },
  {
    key: 'principles',
    name: t('Principle(s)'),
    formatter: ({ row }: { row: Row }) =>
      row.principles?.map(({ name }) => name).join(', ') || t('N/A'),
    resizable: true,
    width: 150,
  },
  {
    key: 'creator',
    name: t('Creator'),
    formatter: ({ row }: { row: Row }) => row.created_by?.fullname,
    resizable: true,
    width: 150,
  },
  {
    key: 'squads',
    name: t('Squads'),
    formatter: ({ row }: { row: Row }) => {
      if (row.squads?.length === numberOfSquads) {
        return t('All');
      }
      return row.squads?.map(({ name }) => name).join(', ') || t('N/A');
    },
    resizable: false,
    minWidth: 150,
    width: 'max-content',
  },
  {
    key: 'tooltip-menu',
    name: '',
    formatter: ({ row }: { row: Row }) => (
      <div css={style.gridTooltipMenu}>
        <div
          css={style.tooltipMenu}
          data-testid={`${row.id}-drill-tooltip-menu`}
        >
          <TooltipMenu
            placement="bottom-end"
            menuItems={[
              {
                description: t('Restore drill'),
                onClick: () => onRestore(row),
              },
            ]}
            tooltipTriggerElement={
              <TextButton
                kitmanDesignSystem
                iconBefore="icon-menu"
                type="secondary"
              />
            }
            kitmanDesignSystem
          />
        </div>
      </div>
    ),
    resizable: false,
    minWidth: 48,
    maxWidth: 48,
    width: 48,
  },
];
