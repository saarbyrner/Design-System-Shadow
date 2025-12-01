// @flow
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useIssue } from '../../../../shared/contexts/IssueContext';
import { useIssueTabRequestStatus } from '../../hooks/useIssueTabRequestStatus';
import type { ViewType } from '../../types';

type Props = {
  viewType: ViewType,
  onEdit: () => void,
  onDiscardChanges: () => void,
  onSave: () => void,
  isRequestPending: boolean,
  editActionDisabled?: boolean,
};

const style = {
  header: css`
    display: flex;
    justify-content: space-between;
    ${!window.featureFlags['update-perf-med-headers'] && `margin-bottom: 24px;`}
    ${window.featureFlags['update-perf-med-headers'] && `margin-bottom: 16px;`}
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
  const { isChronicIssue, isReadOnly, isContinuationIssue } = useIssue();

  const { isIssueTabLoading } = useIssueTabRequestStatus();

  const getActionButtons = () => {
    if (isReadOnly) {
      return null;
    }
    if (
      !permissions.medical.issues.canEdit ||
      (isChronicIssue && !window.featureFlags['editable-chronic-conditions']) ||
      isContinuationIssue
    ) {
      return null;
    }

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
      <h2 className="kitmanHeading--L2">{props.t('Event details')}</h2>
      {getActionButtons()}
    </header>
  );
};

export const HeaderTranslated = withNamespaces()(Header);
export default Header;
