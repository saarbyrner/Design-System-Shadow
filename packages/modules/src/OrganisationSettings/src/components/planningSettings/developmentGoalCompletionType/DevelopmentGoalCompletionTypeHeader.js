// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import { TextButton, TooltipMenu } from '@kitman/components';
import { TrackEvent } from '@kitman/common/src/utils';
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
  showArchiveModal: Function,
};

const DevelopmentGoalCompletionTypeHeader = (props: I18nProps<Props>) => {
  const isPresentationView = props.view === 'PRESENTATION';

  const firstActionText = isPresentationView
    ? props.t('Add type')
    : props.t('Save');

  const secondActionText = isPresentationView
    ? props.t('Edit values')
    : props.t('Cancel');

  const thirdActionText = props.t('View archived');

  const onClickFirstAction = () => {
    if (isPresentationView) {
      TrackEvent(
        'Org Settings Planning',
        'Create',
        'Development goal completion type'
      );
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
        {props.t('Development goal completion type')}
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
        <TooltipMenu
          placement="bottom-end"
          menuItems={[
            {
              description: thirdActionText,
              onClick: props.showArchiveModal,
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
            {
              description: thirdActionText,
              onClick: props.showArchiveModal,
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

export default DevelopmentGoalCompletionTypeHeader;
export const DevelopmentGoalCompletionTypeHeaderTranslated: ComponentType<Props> =
  withNamespaces()(DevelopmentGoalCompletionTypeHeader);
