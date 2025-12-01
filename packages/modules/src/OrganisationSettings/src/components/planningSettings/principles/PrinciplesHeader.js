// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { TextButton, TooltipMenu } from '@kitman/components';
import { TrackEvent } from '@kitman/common/src/utils';
import type { PrinciplesView } from '@kitman/common/src/types/Principles';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import styles from '../styles/sections';

type Props = {
  view: PrinciplesView,
  isSavingAllowed: boolean,
  onCreatePrinciple: Function,
  onSavePrinciples: Function,
  onCancelEdit: Function,
  showCategoriesSidePanel: Function,
  onChangeView: Function,
};

const PrinciplesHeader = (props: I18nProps<Props>) => {
  const isPresentationView = props.view === 'PRESENTATION';

  const firstActionText = isPresentationView
    ? props.t('Add principle')
    : props.t('Save');

  const onClickFirstAction = () => {
    if (isPresentationView) {
      TrackEvent('Org Settings Planning', 'Create', 'Principles');
      props.onCreatePrinciple();
      return;
    }
    TrackEvent('Org Settings Planning', 'Save', 'Principles');
    props.onSavePrinciples();
  };

  const secondActionText = isPresentationView
    ? props.t('Edit values')
    : props.t('Cancel');

  const onClickSecondAction = () => {
    if (isPresentationView) {
      TrackEvent('Org Settings Planning', 'Edit values', 'Principles');
      props.onChangeView('EDIT');
    } else {
      props.onCancelEdit();
      props.onChangeView('PRESENTATION');
    }
  };

  const thirdActionText = props.t('Manage categories');

  const isFirstActionAllowed = isPresentationView || props.isSavingAllowed;

  return (
    <header
      css={styles.sectionHeader}
      className="organisationPlanningSettings__sectionHeader--principles"
    >
      <h6
        css={styles.sectionHeaderTitle}
        className="organisationPlanningSettings__sectionHeaderTitle"
      >
        {props.t('Principles')}
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
        <TextButton
          type="secondary"
          text={thirdActionText}
          onClick={props.showCategoriesSidePanel}
          isDisabled={!isPresentationView}
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
              onClick: props.showCategoriesSidePanel,
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

export const PrinciplesHeaderTranslated: ComponentType<Props> =
  withNamespaces()(PrinciplesHeader);
export default PrinciplesHeader;
