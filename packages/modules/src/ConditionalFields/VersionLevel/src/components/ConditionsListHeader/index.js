// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import { useDispatch } from 'react-redux';

import { TextButton } from '@kitman/components';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import { onAddCondition } from '../../../../shared/redux/slices/conditionBuildViewSlice';
import styles from '../VersionBuildViewTab/styles';

type Props = { isPublished: boolean };

const ConditionsListHeaderComponent = ({
  isPublished,
  t,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();

  return (
    <div css={styles.conditionHeader}>
      <h3 css={styles.conditionHeaderTitle}>{t('Rules')}</h3>
      {!isPublished && (
        <TextButton
          text={t('Add')}
          onClick={() => {
            dispatch(onAddCondition());
          }}
          disabled={false} // TODO: add logic to disable -- only on unsaved condition at a time
          type="secondary"
          kitmanDesignSystem
        />
      )}
    </div>
  );
};

export const ConditionsListHeaderComponentTranslated: ComponentType<Props> =
  withNamespaces()(ConditionsListHeaderComponent);

export default ConditionsListHeaderComponent;
