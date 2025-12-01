// @flow
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { TextButton } from '@kitman/components';
import { convertPixelsToREM } from '@kitman/common/src/utils/css';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
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

const styles = {
  header: {
    marginBottom: convertPixelsToREM(24),
  },
  main: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: convertPixelsToREM(16),
  },
  actions: {
    display: 'flex',
    button: {
      '&:not(:last-of-type)': {
        marginRight: convertPixelsToREM(5),
      },
    },
  },
};

const HeaderTitle = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const { issueType, isChronicIssue, isReadOnly } = useIssue();

  const { isIssueTabLoading } = useIssueTabRequestStatus();

  const getTitle = () => {
    if (issueType === 'Illness') {
      return props.t('Illness details');
    }

    return isChronicIssue
      ? props.t('Chronic condition details')
      : props.t('Injury details');
  };

  const getActionButtons = () => {
    if (isReadOnly) {
      return null;
    }
    if (!permissions.medical.issues.canEdit || isChronicIssue) {
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
      <div style={styles.actions}>
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
    <header style={styles.header}>
      <div style={styles.main}>
        <h2 className="kitmanHeading--L2">{getTitle()}</h2>
        {getActionButtons()}
      </div>
    </header>
  );
};

export const HeaderTitleTranslated = withNamespaces()(HeaderTitle);
export default HeaderTitle;
