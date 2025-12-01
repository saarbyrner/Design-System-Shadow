// @flow
import { withNamespaces } from 'react-i18next';

import { TooltipMenu } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { TooltipItem } from '@kitman/components/src/TooltipMenu/index';
import styles from '../styles';
import { SortingOrders } from '../utils';

type Props = {
  column: {
    label: string,
    subheading?: string,
    id: string,
  },
  sortOrder: 'ASC' | 'DESC',
  sortId: string,
  setSortOrder: (string) => void,
  setSortId: (string) => void,
  handleSortData: (sortBy: string, sortColumn: string) => void,
};

function ColumnHeader(props: I18nProps<Props>) {
  const getMenuItems = () => {
    const menuItems: Array<TooltipItem> = [];

    const sortAscending = {
      description: props.t('Sort by Asc'),
      icon: 'icon-arrows-up-down',
      isSelected:
        props.sortOrder === SortingOrders.asc &&
        props.sortId === props.column.id,
      onClick: () => {
        props.setSortId(props.column.id);
        props.setSortOrder(SortingOrders.asc);
        props.handleSortData(SortingOrders.asc, props.column.id);
      },
    };

    const sortDescending = {
      description: props.t('Sort by Desc'),
      icon: 'icon-arrows-up-down',
      isSelected:
        props.sortOrder === SortingOrders.desc &&
        props.sortId === props.column.id,
      onClick: () => {
        props.setSortId(props.column.id);
        props.setSortOrder(SortingOrders.desc);
        props.handleSortData(SortingOrders.desc, props.column.id);
      },
    };

    menuItems.push(sortAscending);
    menuItems.push(sortDescending);

    return menuItems;
  };

  return (
    <TooltipMenu
      placement="bottom-end"
      menuItems={getMenuItems()}
      tooltipTriggerElement={
        <th
          key={`${props.column.id}`}
          css={[
            props.column.id === 'athlete_id'
              ? styles.athleteHeader
              : styles.heading,
            props.column.id === props.sortId && styles.sorted,
          ]}
        >
          {props.sortId === props.column.id && (
            <i
              className={
                props.sortOrder === SortingOrders.asc
                  ? 'icon-arrow-up'
                  : 'icon-arrow-down'
              }
              css={styles.arrowIcon}
            />
          )}
          {props.column.label} <i className="icon-more" css={styles.icon} />
          {props.column?.subheading && (
            <div css={{ fontWeight: 300 }}> {props.column.subheading} </div>
          )}
        </th>
      }
      kitmanDesignSystem
    />
  );
}

export const ColumnHeaderTranslated = withNamespaces()(ColumnHeader);
export default ColumnHeader;
