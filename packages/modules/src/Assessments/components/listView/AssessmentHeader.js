// @flow
import { useContext, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import classnames from 'classnames';
import { TrackEvent } from '@kitman/common/src/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { AppStatus, TooltipMenu } from '@kitman/components';
import ReorderHandle from './SortHandle';
import { HeaderFormTranslated as HeaderForm } from '../HeaderForm';
import PermissionsContext from '../../contexts/PermissionsContext';
import type { AssessmentHeader as AssessmentHeaderType } from '../../types';

type Props = {
  assessmentHeader: AssessmentHeaderType,
  showReordering: boolean,
  isCurrentSquad: boolean,
  onClickSave: Function,
  onClickDelete: Function,
};

const AssessmentHeader = (props: I18nProps<Props>) => {
  const permissions = useContext(PermissionsContext);
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false);
  const [showEditHeaderForm, setShowEditHeaderForm] = useState(false);

  return (
    <div className="assessmentHeader">
      {props.showReordering && <ReorderHandle />}
      <h2 className="assessmentHeader__title">{props.assessmentHeader.name}</h2>
      {props.isCurrentSquad && (
        <TooltipMenu
          placement="bottom-start"
          offset={[0, 0]}
          menuItems={[
            {
              description: props.t('Edit'),
              onClick: () => {
                setShowEditHeaderForm(true);
                TrackEvent('assessments', 'click', 'edit section');
              },
              isDisabled: !permissions.editAssessment,
            },
            {
              description: props.t('Delete'),
              onClick: () => {
                setShowConfirmDeletion(true);
                TrackEvent('assessments', 'click', 'delete section');
              },
              isDestructive: true,
              isDisabled: !permissions.deleteAssessment,
            },
          ]}
          tooltipTriggerElement={
            <button
              type="button"
              className={classnames('assessmentHeader__dropdownMenuBtn', {
                'assessmentHeader__dropdownMenuBtn--disabled':
                  props.showReordering,
              })}
            >
              <i className="icon-more" />
            </button>
          }
          disabled={props.showReordering}
          kitmanDesignSystem
        />
      )}

      {showConfirmDeletion && (
        <AppStatus
          status="warning"
          message={props.t('Delete section?')}
          deleteAllButtonText={props.t('Delete')}
          hideConfirmation={() => {
            setShowConfirmDeletion(false);
          }}
          confirmAction={() => {
            setShowConfirmDeletion(false);
            props.onClickDelete();
          }}
        />
      )}

      {showEditHeaderForm && (
        <HeaderForm
          initialValue={props.assessmentHeader.name}
          onClickSave={(sectionName) => {
            setShowEditHeaderForm(false);
            props.onClickSave({
              ...props.assessmentHeader,
              name: sectionName,
            });
          }}
          onClickCloseModal={() => {
            setShowEditHeaderForm(false);
          }}
        />
      )}
    </div>
  );
};

export default AssessmentHeader;
export const AssessmentHeaderTranslated = withNamespaces()(AssessmentHeader);
