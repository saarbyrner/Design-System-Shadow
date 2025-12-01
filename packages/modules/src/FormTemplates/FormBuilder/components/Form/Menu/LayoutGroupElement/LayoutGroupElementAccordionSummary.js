// @flow
import { AccordionSummary, Box } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import i18n from '@kitman/common/src/utils/i18n';

import type { SetState } from '@kitman/common/src/types/react';
import { ConditionalIndicatorTranslated as ConditionalIndicator } from '@kitman/modules/src/FormTemplates/FormBuilder/components/Form/Menu/components/ConditionalIndicator';
import { ELEMENT_TYPE } from '@kitman/modules/src/FormTemplates/FormBuilder/components/Form/Menu/utils/hooks';
import ItemDetailsStart from '../components/ItemDetailsStart';
import ItemDetailsContainer from '../components/ItemDetailsContainer';
import { levelEnumLike } from '../utils/enum-likes';
import { menuWidth } from '../utils/consts';
import { useActionMenu, useDeleteLayoutGroup } from '../utils/hooks';

type Props = {
  id: number,
  setIsAccordionExpanded: SetState<boolean>,
  isAccordionExpanded: boolean,
  onClickAccordionSummary: () => void,
  elementId: string,
  numberOfQuestions: number,
  name: string,
  menuGroupIndex: number,
  menuItemIndex: number,
  groupIndex: number,
  isConditional: boolean,
};

const LayoutGroupAccordionSummary = ({
  id,
  isAccordionExpanded,
  setIsAccordionExpanded,
  onClickAccordionSummary,
  elementId,
  numberOfQuestions,
  name,
  menuGroupIndex,
  menuItemIndex,
  groupIndex,
  isConditional,
}: Props) => {
  const { confirmationModal, openModal } = useDeleteLayoutGroup({
    menuGroupIndex,
    menuItemIndex,
    groupIndex,
  });
  const { buttonAriaLabel, menuComponent, onClickMenuTriggerButton } =
    useActionMenu({
      actions: { onDelete: openModal },
      menuGroupIndex,
      menuItemIndex,
      layoutGroupIndex: groupIndex,
      elementType: ELEMENT_TYPE.LAYOUT_GROUP,
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
          padding: '0 1.5rem 0 0.6rem',
          width: menuWidth,
        }}
        expandIcon={expandIcon}
        aria-controls={`layoutGroup-${elementId}-content`}
        id={`layoutGroup-${elementId}-header`}
        onClick={onClickAccordionSummary}
      >
        <ItemDetailsContainer>
          <ItemDetailsStart
            id={id}
            name={name}
            level={levelEnumLike.group}
            numberOfChildrenText={i18n.t('{{numberOfQuestions}} {{child}}', {
              numberOfQuestions,
              child:
                numberOfQuestions === 1
                  ? i18n.t('question')
                  : i18n.t('questions'),
            })}
          />
          <Box>
            {isConditional && <ConditionalIndicator marginRight="1rem" />}
            <KitmanIcon
              name={KITMAN_ICON_NAMES.MoreVert}
              onClick={(event) => {
                event.stopPropagation();
                onClickMenuTriggerButton(event);
              }}
              aria-label={buttonAriaLabel}
            />
          </Box>
        </ItemDetailsContainer>
      </AccordionSummary>
      {menuComponent}
    </>
  );
};

export default LayoutGroupAccordionSummary;
