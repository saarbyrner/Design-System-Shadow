// @flow
import { withNamespaces } from 'react-i18next';
import { type ComponentType } from 'react';
import { useSelector } from 'react-redux';

import { getFormElementsMap } from '@kitman/modules/src/FormTemplates/redux/selectors/formBuilderSelectors';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { IconButton } from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  element: HumanInputFormElement,
  openModal: () => void,
};

const EditCondition = ({ t, element, openModal }: I18nProps<Props>) => {
  const formElementsMap = useSelector(getFormElementsMap);
  const condition = element.config?.condition;

  const isLogicalCondition =
    condition?.type === 'and' || condition?.type === 'or';

  const initialQuestionElementId = isLogicalCondition
    ? condition?.conditions?.[0].element_id
    : condition?.element_id;

  const parentConditionalQuestion =
    formElementsMap[initialQuestionElementId] || {};

  return (
    <>
      {`${t('Initial question')}: ${
        parentConditionalQuestion.config?.text || '-'
      }`}
      <IconButton aria-label="edit" onClick={openModal} size="small">
        <KitmanIcon name={KITMAN_ICON_NAMES.Edit} fontSize="inherit" />
      </IconButton>
    </>
  );
};

export const EditConditionTranslated: ComponentType<Props> =
  withNamespaces()(EditCondition);
export default EditCondition;
