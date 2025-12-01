// @flow

import { AccordionSummary } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import i18n from '@kitman/common/src/utils/i18n';

import { colors } from '@kitman/common/src/variables';
import type { SetState } from '@kitman/common/src/types/react';
import { ELEMENT_TYPE } from '@kitman/modules/src/FormTemplates/FormBuilder/components/Form/Menu/utils/hooks';
import ItemDetailsStart from '../components/ItemDetailsStart';
import ItemDetailsContainer from '../components/ItemDetailsContainer';
import { levelEnumLike } from '../utils/enum-likes';
import { menuWidth } from '../utils/consts';
import { useActionMenu, useDeleteMenuItem } from '../utils/hooks';

type Props = {
  id: number,
  setIsAccordionExpanded: SetState<boolean>,
  isAccordionExpanded: boolean,
  isCurrentMenuItem: boolean,
  onClickAccordionSummary: () => void,
  elementId: string,
  numberOfQuestions: number,
  name: string,
  menuGroupIndex: number,
  menuItemIndex: number,
};

const MenuItemAccordionSummary = ({
  id,
  isAccordionExpanded,
  setIsAccordionExpanded,
  onClickAccordionSummary,
  elementId,
  isCurrentMenuItem,
  numberOfQuestions,
  name,
  menuGroupIndex,
  menuItemIndex,
}: Props) => {
  const { confirmationModal, openModal } = useDeleteMenuItem({
    menuGroupIndex,
    menuItemIndex,
  });
  const { buttonAriaLabel, menuComponent, onClickMenuTriggerButton } =
    useActionMenu({
      actions: { onDelete: openModal },
      menuGroupIndex,
      menuItemIndex,
      elementType: ELEMENT_TYPE.MENU_ITEM,
    });

  const expandIcon = (
    <KitmanIcon
      name={KITMAN_ICON_NAMES.ExpandMore}
      onClick={(event) => {
        event.stopPropagation();
        setIsAccordionExpanded(!isAccordionExpanded);
      }}
    />
  );
  return (
    <>
      {confirmationModal}
      <AccordionSummary
        sx={{
          padding: '0 1.5rem 0 0',
          ...(isCurrentMenuItem ? { backgroundColor: colors.background } : {}),
          width: menuWidth,
        }}
        expandIcon={expandIcon}
        aria-controls={`menuItem-${elementId}-content`}
        id={`menuItem-${elementId}-header`}
        onClick={onClickAccordionSummary}
      >
        <ItemDetailsContainer>
          <ItemDetailsStart
            id={id}
            name={name}
            level={levelEnumLike.menuItem}
            numberOfChildrenText={i18n.t('{{numberOfQuestions}} {{child}}', {
              numberOfQuestions,
              child:
                numberOfQuestions === 1
                  ? i18n.t('question')
                  : i18n.t('questions'),
            })}
          />
          <KitmanIcon
            name={KITMAN_ICON_NAMES.MoreVert}
            onClick={(event) => {
              event.stopPropagation();
              onClickMenuTriggerButton(event);
            }}
            aria-label={buttonAriaLabel}
          />
        </ItemDetailsContainer>
      </AccordionSummary>
      {menuComponent}
    </>
  );
};

export default MenuItemAccordionSummary;
