// @flow
import { withNamespaces } from 'react-i18next';
import { TextButton } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';

import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
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
  editActionDisabled?: boolean,
};

const style = {
  header: {
    marginBottom: '24px',
  },
  main: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  actions: {
    display: 'flex',
    button: {
      '&:not(:last-of-type)': {
        marginRight: '5px',
      },
    },
  },
  details: {
    color: colors.grey_200,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '20px',
    listStyle: 'none',
    lineHeight: '16px',
    padding: 0,
    marginBottom: 0,

    li: {
      lineHeight: '16px',
    },
  },
  detailLabel: {
    fontWeight: 600,
  },
};

const Header = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const { isChronicIssue, isReadOnly } = useIssue();

  const { isIssueTabLoading } = useIssueTabRequestStatus();

  const getActionButtons = () => {
    if (isReadOnly) {
      return null;
    }
    if (
      !permissions.medical.issues.canEdit ||
      (isChronicIssue && !window.featureFlags['editable-chronic-conditions'])
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
      <div css={style.main}>
        <h2 className="kitmanHeading--L2">{props.t('Primary Pathology')}</h2>
        {getActionButtons()}
      </div>
    </header>
  );
};

export const HeaderTranslated = withNamespaces()(Header);
export default Header;
