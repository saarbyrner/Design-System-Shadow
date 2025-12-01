// @flow

import { AccordionSummary } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import i18n from '@kitman/common/src/utils/i18n';
import { colors } from '@kitman/common/src/variables';
import { ELEMENT_TYPE } from '@kitman/modules/src/FormTemplates/FormBuilder/components/Form/Menu/utils/hooks';
import { levelEnumLike } from '../utils/enum-likes';
import ItemDetailsStart from '../components/ItemDetailsStart';
import ItemDetailsContainer from '../components/ItemDetailsContainer';
import { menuWidth } from '../utils/consts';
import { useActionMenu, useDeleteMenuGroup } from '../utils/hooks';

type Props = {
  id: number,
  name: string,
  elementId: string,
  numberOfMenuItems: number,
  menuGroupIndex: number,
};

const MenuGroupAccordionSummary = ({
  id,
  elementId,
  name,
  numberOfMenuItems,
  menuGroupIndex,
}: Props) => {
  const { confirmationModal, openModal } = useDeleteMenuGroup(menuGroupIndex);
  const { buttonAriaLabel, menuComponent, onClickMenuTriggerButton } =
    useActionMenu({
      actions: {
        onDelete: openModal,
      },
      menuGroupIndex,
      elementType: ELEMENT_TYPE.MENU_GROUP,
    });

  return (
    <>
      {confirmationModal}
      <AccordionSummary
        sx={{
          padding: '0 1.5rem 0 0',
          borderLeft: `4px solid ${colors.grey_200}`,
          backgroundColor: colors.neutral_200,
          width: menuWidth,
        }}
        expandIcon={<KitmanIcon name={KITMAN_ICON_NAMES.ExpandMore} />}
        aria-controls={`menuGroup-${elementId}-content`}
        id={`menuGroup-${elementId}-header`}
      >
        <ItemDetailsContainer>
          <ItemDetailsStart
            name={name}
            id={id}
            level={levelEnumLike.menuGroup}
            numberOfChildrenText={i18n.t('{{numberOfMenuItems}} {{child}}', {
              numberOfMenuItems,
              child:
                numberOfMenuItems === 1
                  ? i18n.t('menu item')
                  : i18n.t('menu items'),
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

export default MenuGroupAccordionSummary;
