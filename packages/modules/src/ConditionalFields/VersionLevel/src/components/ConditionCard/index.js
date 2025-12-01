// @flow
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { onSetActiveCondition } from '@kitman/modules/src/ConditionalFields/shared/redux/slices/conditionBuildViewSlice';
import { selectActiveCondition } from '@kitman/modules/src/ConditionalFields/shared/redux/selectors/conditionBuildView';
import {
  IconButton,
  ConfirmationModal,
  DialogContentText,
} from '@kitman/playbook/components';
import type { ActiveCondition } from '@kitman/modules/src/ConditionalFields/shared/types';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { useDeleteConditionMutation } from '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields';
import {
  parseRulesetIdFromLocation,
  parseVersionIdFromLocation,
} from '@kitman/modules/src/ConditionalFields/shared/routes/utils';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';

import styles from '../VersionBuildViewTab/styles';

type Props = {
  condition: ActiveCondition,
  index: number,
  isPublished: boolean,
};

const ConditionCardComponent = ({
  condition,
  index,
  isPublished,
  t,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const activeCondition: ActiveCondition = useSelector(selectActiveCondition);

  const isActive = activeCondition.index === index;

  const [
    deleteCondition,
    { isLoading: isDeleting }, // This is the destructured mutation result
  ] = useDeleteConditionMutation();

  const locationPathname = useLocationPathname();

  const rulesetId = parseRulesetIdFromLocation(locationPathname);

  const versionId = parseVersionIdFromLocation(locationPathname);

  const handleDeleteCondition = () => {
    return deleteCondition({
      rulesetId,
      versionId,
      conditionId: condition.id,
    })
      .unwrap()
      .then((response) =>
        dispatch(
          add({
            id: 'delete-condition-success',
            title: response.message,
            status: 'SUCCESS',
          })
        )
      )
      .catch((error) => {
        dispatch(
          add({
            id: 'delete-condition-error',
            title: error.message,
            status: 'ERROR',
          })
        );
      });
  };

  return (
    <div
      onClick={() => {
        if (!isActive) {
          dispatch(onSetActiveCondition({ activeCondition: condition }));
        }
      }}
      css={[
        styles.conditionCard,
        isActive ? styles.activeConditionCard : styles.notActiveConditionCard,
      ]}
    >
      <div>
        <p css={styles.conditionCardTitle}>{`Rule ${index + 1}`}</p>
        <p css={styles.conditionCardName}> {condition.name}</p>
      </div>
      {condition.name && !isPublished && (
        <div>
          <IconButton onClick={() => setConfirmationModalOpen(true)}>
            <KitmanIcon name={KITMAN_ICON_NAMES.DeleteOutline} />
          </IconButton>
          <ConfirmationModal
            isModalOpen={isConfirmationModalOpen}
            dialogContent={
              <DialogContentText>
                {t(
                  'Deleting a rule will delete all the questions and related followup questions.'
                )}
              </DialogContentText>
            }
            translatedText={{
              title: 'Delete Rule',
              actions: { ctaButton: 'Confirm delete', cancelButton: 'Cancel' },
            }}
            onConfirm={handleDeleteCondition}
            onCancel={() => setConfirmationModalOpen(false)}
            onClose={() => setConfirmationModalOpen(false)}
            isLoading={isDeleting}
          />
        </div>
      )}
    </div>
  );
};
export const ConditionCardComponentTranslated = withNamespaces()(
  ConditionCardComponent
);

export default ConditionCardComponent;
