// @flow
import { css } from '@emotion/react';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { withNamespaces } from 'react-i18next';
import { TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useIssue } from '../../../../shared/contexts/IssueContext';
import { useIssueTabRequestStatus } from '../../hooks/useIssueTabRequestStatus';
import type { ViewType } from '../../types';

type Props = {
  viewType: ViewType,
  isRequestPending: boolean,
  onSave: () => void,
  onEdit: () => void,
  onDiscardChanges: () => void,
  editActionDisabled: boolean
};

const style = {
  header: css`
    margin-bottom: 24px;
  `,
  main: css`
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  `,
  actions: css`
    display: flex;
    button {
      &:not(:last-of-type) {
        margin-right: 5px;
      }
    }
  `,
};

const Header = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const { isReadOnly } = useIssue();

  const { isIssueTabLoading } = useIssueTabRequestStatus();

  const getActionButtons = () => {
    if (isReadOnly) return null;
    if (!permissions.medical.issues.canEdit) return null;

    return props.viewType === 'PRESENTATION' ? (
      <TextButton
        text={props.t('Edit')}
        type="secondary"
        onClick={props.onEdit}
        isDisabled={props.isRequestPending || props.editActionDisabled}
        kitmanDesignSystem
      />
    ) : (
      <div css={style.actions}>
        <TextButton
          text={props.t('Discard changes')}
          type="subtle"
          onClick={props.onDiscardChanges}
          isDisabled={props.isRequestPending}
          kitmanDesignSystem
        />
        <TextButton
          text={props.t('Save')}
          type="primary"
          onClick={props.onSave}
          isDisabled={
            window.featureFlags['disable-parallel-injury-edits']
              ? props.isRequestPending || isIssueTabLoading
              : props.isRequestPending
          }
          kitmanDesignSystem
        />
      </div>
    );
  };
  return (
    <header css={style.header}>
      <div css={style.main}>
        <h2 className="kitmanHeading--L2">
          {props.t('Additional information')}
        </h2>
        {getActionButtons()}
      </div>
    </header>
  );
};

export const HeaderTranslated = withNamespaces()(Header);
export default Header;
