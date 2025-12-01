// @flow
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { TextButton } from '@kitman/components';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import type { RequestStatus } from '@kitman/common/src/types';

import {
  parseVersionIdFromLocation,
  parseRulesetIdFromLocation,
} from '@kitman/modules/src/ConditionalFields/shared/routes/utils';
import {
  selectActiveCondition,
  selectAllConditions,
  selectRequestStatus,
} from '@kitman/modules/src/ConditionalFields/shared/redux/selectors/conditionBuildView';
import { useSaveVersionMutation } from '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields';
import {
  onSetActiveCondition,
  onResetFormState,
  onSetRequestStatus,
  onSetValidationStatus,
  onSetFlattenedNames,
} from '@kitman/modules/src/ConditionalFields/shared/redux/slices/conditionBuildViewSlice';
import {
  transformConditionForPayload,
  validateData,
} from '@kitman/modules/src/ConditionalFields/shared/utils';
import styles from '@kitman/modules/src/ConditionalFields/VersionLevel/src/components/VersionBuildViewTab/styles';

import type { ActiveCondition } from '@kitman/modules/src/ConditionalFields/shared/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = { isPublished: boolean };

const ActiveConditionHeader = ({ isPublished, t }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const locationPathname: string = useLocationPathname();

  const rulesetId: string = parseRulesetIdFromLocation(locationPathname);
  const versionId: string = parseVersionIdFromLocation(locationPathname);

  const activeCondition: ActiveCondition = useSelector(selectActiveCondition);
  const activeConditionRequestStatus: RequestStatus =
    useSelector(selectRequestStatus);
  const allConditions: Array<ActiveCondition> =
    useSelector(selectAllConditions);

  const [saveVersion] = useSaveVersionMutation();

  const handleSaveCondition = () => {
    dispatch(onSetValidationStatus({ validationStatus: 'PENDING' }));

    const transformedActiveCondition =
      transformConditionForPayload(activeCondition);

    const { passedValidation, flattenedNames } = validateData({
      data: transformedActiveCondition,
    });

    if (!passedValidation) {
      dispatch(onSetRequestStatus({ requestStatus: 'SUCCESS' }));
      dispatch(onSetFlattenedNames({ flattenedNames }));
      return;
    }

    dispatch(onSetValidationStatus({ validationStatus: 'DORMANT' }));
    dispatch(onSetRequestStatus({ requestStatus: 'PENDING' }));
    saveVersion({
      rulesetId,
      versionId,
      conditions: allConditions.map((cond) =>
        cond.id === activeCondition.id
          ? transformedActiveCondition
          : transformConditionForPayload(cond)
      ),
      versionName: null,
    })
      .then(() => {
        dispatch(onSetRequestStatus({ requestStatus: 'SUCCESS' }));
        dispatch(onResetFormState());
      })
      .catch(() => {
        dispatch(onSetRequestStatus({ requestStatus: 'ERROR' }));
      });
  };
  return (
    <div>
      <div css={styles.conditionHeader}>
        <h3 css={styles.conditionHeaderTitle}>
          {t('Rule {{count}}', { count: activeCondition.order })}
        </h3>
        {!isPublished && (
          <div css={styles.conditionHeaderActions}>
            <TextButton
              text={t('Save')}
              onClick={() => {
                return handleSaveCondition();
              }}
              disabled={false} // TODO: disable when there are no unsaved changes
              type="primary"
              kitmanDesignSystem
              isLoading={activeConditionRequestStatus === 'PENDING'}
            />
            <TextButton
              text={t('Discard changes')}
              onClick={() => {
                dispatch(
                  onSetActiveCondition({
                    activeCondition,
                  })
                );
              }}
              disabled={false} // TODO: disable when there are no unsaved changes
              type="secondary"
              kitmanDesignSystem
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const ActiveConditionHeaderTranslated: ComponentType<Props> =
  withNamespaces()(ActiveConditionHeader);

export default ActiveConditionHeader;
