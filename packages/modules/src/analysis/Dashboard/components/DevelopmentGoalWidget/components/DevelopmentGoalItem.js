// @flow
import { useState, useMemo } from 'react';
import moment from 'moment';
import { TrackEvent } from '@kitman/common/src/utils';
import { colors } from '@kitman/common/src/variables';
import { withNamespaces } from 'react-i18next';
import type { DevelopmentGoal } from '@kitman/modules/src/PlanningHub/src/services/getDevelopmentGoals';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import deleteDevelopmentGoal from '@kitman/modules/src/PlanningHub/src/services/deleteDevelopmentGoal';
import {
  AppStatus,
  Modal,
  TextButton,
  TextTag,
  TooltipMenu,
} from '@kitman/components';
import saveDevelopmentGoal from '@kitman/modules/src/PlanningHub/src/services/saveDevelopmentGoal';
import { getPrincipleNameWithItems } from '@kitman/common/src/utils/planningEvent';
import {
  dateTransferFormat,
  formatStandard,
} from '@kitman/common/src/utils/dateFormatter';
import type { TooltipItem } from '@kitman/components/src/TooltipMenu/index';
import style from '../style';

type Props = {
  developmentGoal: DevelopmentGoal,
  onDeleteDevelopmentGoalSuccess: Function,
  onClickEditDevelopmentGoal: Function,
  onCloseDevelopmentGoalSuccess: Function,
  canEditDevelopmentGoals: boolean,
  canDeleteDevelopmentGoals: boolean,
  areCoachingPrinciplesEnabled: boolean,
};

type RequestStatus = 'PENDING' | 'FAILURE' | null;

function DevelopmentGoalItem(props: I18nProps<Props>) {
  const [
    showConfirmDevelopmentGoalRemoval,
    setShowConfirmDevelopmentGoalRemoval,
  ] = useState(false);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);

  const onConfirmDeleteDevelopmentGoal = () => {
    setRequestStatus('PENDING');
    deleteDevelopmentGoal(props.developmentGoal.id)
      .then(() => {
        setShowConfirmDevelopmentGoalRemoval(false);
        setRequestStatus(null);
        props.onDeleteDevelopmentGoalSuccess(props.developmentGoal.id);
      })
      .catch(() => setRequestStatus('FAILURE'));
  };

  const onClickCloseDevelopmentGoal = () => {
    setRequestStatus('PENDING');
    saveDevelopmentGoal({
      id: props.developmentGoal.id,
      close_time: moment().format(dateTransferFormat),
    }).then(
      (developmentGoal) => {
        setRequestStatus(null);
        props.onCloseDevelopmentGoalSuccess(developmentGoal);
      },
      () => setRequestStatus('FAILURE')
    );
  };
  const isGoalClosed =
    Boolean(props.developmentGoal.close_time) &&
    moment(props.developmentGoal.close_time).isBefore(moment());

  const menuItems = useMemo(() => {
    const items: Array<TooltipItem> = [];
    if (props.canEditDevelopmentGoals) {
      items.push(
        {
          description: props.t('Edit'),
          onClick: () => {
            props.onClickEditDevelopmentGoal(props.developmentGoal);
            TrackEvent('Analysis Dahsboard', 'Edit', 'Development Goal');
          },
        },
        {
          description: props.t('Close'),
          onClick: () => {
            onClickCloseDevelopmentGoal();
            TrackEvent('Analysis Dahsboard', 'Close', 'Development Goal');
          },
          isDisabled:
            moment(props.developmentGoal.start_time).isAfter(moment()) ||
            isGoalClosed,
        }
      );
    }

    if (props.canDeleteDevelopmentGoals) {
      items.push({
        description: props.t('Delete'),
        onClick: () => {
          setShowConfirmDevelopmentGoalRemoval(true);
          TrackEvent('Analysis Dahsboard', 'Delete', 'Development Goal');
        },
      });
    }

    return items;
  }, [
    props.canEditDevelopmentGoals,
    props.canDeleteDevelopmentGoals,
    props.developmentGoal,
  ]);

  return (
    <div css={style.developmentGoalsListItem}>
      <div>
        <p css={style.developmentGoalDescription}>
          {props.developmentGoal.description}
        </p>

        <div css={style.developmentGoalDateRange}>
          {formatStandard({ date: moment(props.developmentGoal.start_time) })}{' '}
          {props.developmentGoal.close_time &&
            `- ${formatStandard({
              date: moment(props.developmentGoal.close_time),
            })}`}
        </div>

        <ul css={style.developmentGoalsTagList}>
          {isGoalClosed && (
            <li>
              <TextTag
                content={props.t('Closed')}
                backgroundColor={colors.red_100_20}
              />
            </li>
          )}
          {props.areCoachingPrinciplesEnabled &&
            props.developmentGoal.principles.map((principle) => (
              <li key={`principle_${principle.id}`}>
                <TextTag content={getPrincipleNameWithItems(principle)} />
              </li>
            ))}
          {props.developmentGoal.development_goal_types.map(
            (developmentGoalType) => (
              <li key={`development_goal_types_${developmentGoalType.id}`}>
                <TextTag content={developmentGoalType.name} />
              </li>
            )
          )}
        </ul>
      </div>
      {menuItems.length > 0 && (
        <div css={style.developmentGoalTooltip}>
          <TooltipMenu
            placement="bottom-end"
            offset={[10, 10]}
            menuItems={menuItems}
            tooltipTriggerElement={
              <button
                type="button"
                css={style.tooltipBtn}
                disabled={requestStatus === 'PENDING'}
                data-testid="DevelopmentGoalItem|TooltipButton"
              >
                <i className="icon-more" />
              </button>
            }
            disabled={requestStatus === 'PENDING'}
            kitmanDesignSystem
          />
        </div>
      )}

      <Modal
        isOpen={showConfirmDevelopmentGoalRemoval}
        onPressEscape={() => setShowConfirmDevelopmentGoalRemoval(false)}
        close={() => setShowConfirmDevelopmentGoalRemoval(false)}
      >
        <Modal.Header>
          <Modal.Title>{props.t('Delete Development Goal')}</Modal.Title>
        </Modal.Header>
        <Modal.Content>{props.t('This action cannot be undone')}</Modal.Content>

        <Modal.Footer>
          <TextButton
            text={props.t('Cancel')}
            onClick={() => setShowConfirmDevelopmentGoalRemoval(false)}
            isDisabled={requestStatus === 'PENDING'}
            kitmanDesignSystem
          />
          <TextButton
            text={props.t('Delete')}
            type="primaryDestruct"
            onClick={() => onConfirmDeleteDevelopmentGoal()}
            isDisabled={requestStatus === 'PENDING'}
            kitmanDesignSystem
          />
        </Modal.Footer>
      </Modal>
      {requestStatus === 'FAILURE' && <AppStatus status="error" />}
    </div>
  );
}

export default DevelopmentGoalItem;
export const DevelopmentGoalItemTranslated =
  withNamespaces()(DevelopmentGoalItem);
