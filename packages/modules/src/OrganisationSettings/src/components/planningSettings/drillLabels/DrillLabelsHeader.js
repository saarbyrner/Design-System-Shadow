// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import { TextButton, TooltipMenu } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { SettingsView } from '../types';
import styles from '../styles/sections';

type Props = {
  view: SettingsView,
  isSavingAllowed: boolean,
  onEditMode: Function,
  onCancelEdit: Function,
  onSaveEdit: Function,
  onAddNew: Function,
};

const DrillLabelsHeader = (props: I18nProps<Props>) => {
  const isPresentationView = props.view === 'PRESENTATION';

  const firstActionText = isPresentationView
    ? props.t('Add label')
    : props.t('Save');

  const secondActionText = isPresentationView
    ? props.t('Edit values')
    : props.t('Cancel');

  const onClickFirstAction = () => {
    if (isPresentationView) {
      props.onAddNew();
      return;
    }

    props.onSaveEdit();
  };

  const onClickSecondAction = () => {
    if (isPresentationView) {
      props.onEditMode();
      return;
    }

    props.onCancelEdit();
  };

  const isFirstActionAllowed = isPresentationView || props.isSavingAllowed;

  return (
    <header css={styles.sectionHeader}>
      <h6
        css={styles.sectionHeaderTitle}
        className="organisationPlanningSettings__sectionHeaderTitle"
      >
        {props.t('Drill Labels')}
      </h6>
      <div
        css={styles.sectionHeaderActions}
        className="organisationPlanningSettings__sectionHeaderActions--desktop"
      >
        <TextButton
          type="primary"
          text={firstActionText}
          onClick={onClickFirstAction}
          isDisabled={!isFirstActionAllowed}
          kitmanDesignSystem
        />
        <TextButton
          type="secondary"
          text={secondActionText}
          onClick={onClickSecondAction}
          kitmanDesignSystem
        />
      </div>
      <div
        css={styles.sectionHeaderMobileActions}
        className="organisationPlanningSettings__sectionHeaderActions--mobile"
      >
        <TooltipMenu
          placement="bottom-end"
          menuItems={[
            {
              description: firstActionText,
              onClick: onClickFirstAction,
              isDisabled: !isFirstActionAllowed,
            },
            {
              description: secondActionText,
              onClick: onClickSecondAction,
            },
          ]}
          tooltipTriggerElement={
            <TextButton
              iconAfter="icon-more"
              type="secondary"
              kitmanDesignSystem
            />
          }
          kitmanDesignSystem
        />
      </div>
    </header>
  );
};

export const DrillLabelsHeaderTranslated: ComponentType<Props> =
  withNamespaces()(DrillLabelsHeader);
export default DrillLabelsHeader;
