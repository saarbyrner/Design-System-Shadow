// @flow
import { withNamespaces } from 'react-i18next';
import { TextButton, TooltipMenu } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isEditMode: boolean,
  onCancelEdit: Function,
  onClickEditValues: Function,
  onClickSave: Function,
  title: string,
};

const Header = (props: I18nProps<Props>) => {
  return (
    <header className="planningSettings__sectionHeader">
      <div className="planningSettings__sectionHeaderContent">
        <h6 className="planningSettings__sectionHeaderTitle">{props.title}</h6>
      </div>
      <div className="planningSettings__sectionHeaderActions planningSettings__sectionHeaderActions--desktop">
        {props.isEditMode ? (
          <>
            <TextButton
              type="primary"
              text={props.t('Save')}
              onClick={props.onClickSave}
              kitmanDesignSystem
            />
            <TextButton
              type="secondary"
              text={props.t('Cancel')}
              onClick={props.onCancelEdit}
              kitmanDesignSystem
            />
          </>
        ) : (
          <TextButton
            type="secondary"
            text={props.t('Edit values')}
            onClick={props.onClickEditValues}
            kitmanDesignSystem
          />
        )}
      </div>
      <div className="planningSettings__sectionHeaderActions planningSettings__sectionHeaderActions--mobile">
        <TooltipMenu
          placement="bottom-end"
          menuItems={
            props.isEditMode
              ? [
                  {
                    description: props.t('Save'),
                    onClick: props.onClickSave,
                  },
                  {
                    description: props.t('Cancel'),
                    onClick: props.onCancelEdit,
                  },
                ]
              : [
                  {
                    description: props.t('Edit values'),
                    onClick: props.onClickEditValues,
                  },
                ]
          }
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

export const HeaderTranslated = withNamespaces()(Header);
export default Header;
