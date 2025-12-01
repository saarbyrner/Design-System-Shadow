// @flow
import { useState } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type {
  PrincipleSelectItems,
  PrinciplesView,
  PrincipleItemId,
} from '@kitman/common/src/types/Principles';
import { ActionTooltip, CheckboxList } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import styles from '../styles/table';

type Props = {
  view: PrinciplesView,
  title: string,
  principleSelectItems: PrincipleSelectItems,
  withSingleSelection?: boolean,
  updatePrincipleItems: (principleItemIds: PrincipleItemId[]) => void,
};

const InteractiveColumnHeader = (props: I18nProps<Props>) => {
  const [itemIds, setItemIds] = useState<PrincipleItemId[]>([]);

  return (
    <div className="planningSettingsTable__columnCell">
      {props.view === 'PRESENTATION' ||
      props.principleSelectItems.length === 0 ? (
        props.title
      ) : (
        <ActionTooltip
          placement="bottom-start"
          actionSettings={{
            text: props.t('Set'),
            onCallAction: () => props.updatePrincipleItems(itemIds),
          }}
          content={
            <div
              css={styles.bulkList}
              className="planningSettingsTable__checkboxList"
            >
              <CheckboxList
                items={props.principleSelectItems}
                onChange={(selectedItemIds) => setItemIds(selectedItemIds)}
                singleSelection={props.withSingleSelection || false}
                kitmanDesignSystem
              />
            </div>
          }
          triggerElement={
            <div
              css={styles.bulkCta}
              className="planningSettingsTable__bulkEditCTA"
            >
              {props.title}
              <i className="icon-chevron-down" />
            </div>
          }
          triggerFullWidth
          scrollable
          kitmanDesignSystem
        />
      )}
    </div>
  );
};

export default InteractiveColumnHeader;
export const InteractiveColumnHeaderTranslated: ComponentType<Props> =
  withNamespaces()(InteractiveColumnHeader);
