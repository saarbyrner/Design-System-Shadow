// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';

import type { SquadAthletesSelection } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  ActionCheckbox,
  AppStatus,
  DataGrid,
  DelayedLoadingFeedback,
} from '@kitman/components';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type {
  Actions,
  User,
  ContainerType,
  ActionsTableColumn,
} from '../../types';
import WidgetMenu from './components/WidgetMenu';
import { ActionsFilterTranslated as ActionsFilter } from './components/ActionsFilter';
import WidgetCard from '../WidgetCard';

type Props = {
  widgetId: number,
  widgetSettings: {
    population: SquadAthletesSelection,
    completed: boolean,
    organisation_annotation_type_ids: Array<number>,
    hidden_columns: Array<ActionsTableColumn>,
  },
  actions: Array<Actions>,
  isLoading?: boolean,
  nextId?: number,
  annotationTypes: Array<Object>,
  currentUser: User,
  onClickWidgetSettings: Function,
  onClickRemoveWidget: Function,
  onClickDuplicateWidget: Function,
  onClickActionCheckbox: Function,
  onClickActionText: Function,
  fetchActions: Function,
  canEditNotes: boolean,
  canManageDashboard: boolean,
  containerType: ContainerType,
};

const ActionsWidget = (props: I18nProps<Props>) => {
  const [feedbackModalStatus, setFeebackModalStatus] = useState(null);
  const [feedbackModalMessage, setFeebackModalMessage] = useState(null);
  const [filteredPopulation, setFilteredPopulation] = useState(
    props.widgetSettings.population
  );
  const [filteredCompletion, setFilteredCompletion] = useState(
    props.widgetSettings.completed ? 'completed' : 'uncompleted'
  );
  const [filteredAnnotationTypes, setFilteredAnnotationTypes] = useState(
    props.widgetSettings.organisation_annotation_type_ids
  );

  const isContentFullyLoaded = !props.nextId;
  const visibleActions = props.actions.filter(
    (action) =>
      (filteredCompletion === 'uncompleted' && !action.completed) ||
      (filteredCompletion === 'completed' && action.completed)
  );

  useEffect(() => {
    props.fetchActions(
      props.widgetId,
      {
        next_id: null,
        population: filteredPopulation,
        completed: filteredCompletion === 'completed' || false,
        organisation_annotation_type_ids: filteredAnnotationTypes,
      },
      true
    );
  }, [filteredPopulation, filteredCompletion, filteredAnnotationTypes]);

  useEffect(() => {
    // When the user changes the widget settings, set the
    // filters to the new widget settings
    setFilteredPopulation(props.widgetSettings.population);
    setFilteredCompletion(
      props.widgetSettings.completed ? 'completed' : 'uncompleted'
    );
    setFilteredAnnotationTypes(
      props.widgetSettings.organisation_annotation_type_ids
    );
  }, [props.widgetSettings]);

  const onClickActionCheckbox = (action) => {
    props.onClickActionCheckbox(action);

    // When the user marks actions as complete, the actions disappear but
    // onScroll is not triggered. This can result in the next actions not
    // being fetched. This is why we need to fetch the actions manually
    // when there are more actions to fetch but only a few are visible.
    if (
      visibleActions.length < 15 &&
      !props.isLoading &&
      !isContentFullyLoaded
    ) {
      props.fetchActions(props.widgetId, {
        next_id: props.nextId,
        population: filteredPopulation,
        completed: filteredCompletion === 'completed' || false,
        organisation_annotation_type_ids: filteredAnnotationTypes,
      });
    }
  };

  const getTableColumns = () => {
    const columns = [
      {
        id: 'action_column',
        content: (
          <div className="actionsWidget__actionColumnTitle">
            {props.t('Action')}
          </div>
        ),
        isHeader: true,
      },
    ];

    if (!props.widgetSettings.hidden_columns.includes('due_date')) {
      columns.push({
        id: 'due_date_column',
        content: props.t('Due date'),
        isHeader: true,
      });
    }

    if (!props.widgetSettings.hidden_columns.includes('time_remaining')) {
      columns.push({
        id: 'time_remaining_column',
        content: props.t('Time remaining'),
        isHeader: true,
      });
    }

    columns.push({
      id: 'athlete_column',
      content: props.t('#sport_specific__Athlete'),
      isHeader: true,
    });

    if (!props.widgetSettings.hidden_columns.includes('assignment')) {
      columns.push({
        id: 'assign_column',
        content: props.t('Also assigned'),
        isHeader: true,
      });
    }

    return columns;
  };

  const getActionDueDateFormatted = (dueDate: string): string => {
    if (window.featureFlags['standard-date-formatting']) {
      return DateFormatter.formatStandard({ date: moment(dueDate) });
    }
    return moment(dueDate).format('dddd, Do MMMM, YYYY');
  };

  const getActionDueDateRelativeFormatted = (dueDate: string): string => {
    if (window.featureFlags['standard-date-formatting']) {
      return DateFormatter.formatRelativeToNow(moment(dueDate));
    }
    return moment(dueDate).fromNow();
  };

  const getActionCells = (action) => {
    const cells = [
      {
        id: 'actionNameCell',
        content: (
          <div className="actionsWidget__bodyCell actionsWidget__actionCell">
            <ActionCheckbox
              id={`action_${action.id}`}
              isChecked={action.completed}
              onToggle={() => onClickActionCheckbox(action)}
              isDisabled={!props.canEditNotes}
            />
            <button
              className="actionsWidget__actionText"
              type="button"
              onClick={() => props.onClickActionText(action.annotation.id)}
            >
              {action.content}
            </button>
          </div>
        ),
      },
    ];

    if (!props.widgetSettings.hidden_columns.includes('due_date')) {
      cells.push({
        id: 'dueDateCell',
        content: (
          <div className="actionsWidget__bodyCell">
            <span className="actionsWidget__cellText">
              {action.due_date && getActionDueDateFormatted(action.due_date)}
            </span>
          </div>
        ),
      });
    }

    if (!props.widgetSettings.hidden_columns.includes('time_remaining')) {
      cells.push({
        id: 'timeRemainingCell',
        content: (
          <div className="actionsWidget__bodyCell">
            <span className="actionsWidget__cellText">
              {action.due_date &&
                getActionDueDateRelativeFormatted(action.due_date)}
            </span>
          </div>
        ),
      });
    }

    cells.push({
      id: 'athleteCell',
      content: (
        <div className="actionsWidget__bodyCell actionsWidget__annotationableInfo">
          <img
            src={action.annotation.annotationable.avatar_url}
            alt={`${action.annotation.annotationable.fullname} avatar`}
          />
          <span className="actionsWidget__cellText">
            {action.annotation.annotationable.fullname}
          </span>
        </div>
      ),
    });

    if (!props.widgetSettings.hidden_columns.includes('assignment')) {
      cells.push({
        id: 'assignCell',
        content: (
          <div className="actionsWidget__bodyCell">
            <span className="actionsWidget__cellText">
              {action.users
                .filter((user) => user.id !== props.currentUser.id)
                .map((user) => user.fullname)
                .join(', ')}
            </span>
          </div>
        ),
      });
    }

    return cells;
  };

  const getActionsRows = () => {
    const rows = props.actions.map((action) => ({
      id: action.id,
      cells: getActionCells(action),
      classnames: {
        actionsWidget__row: true,
        'actionsWidget__row--transitionToComplete':
          action.completed && filteredCompletion === 'uncompleted',
        'actionsWidget__row--transitionToUncomplete':
          !action.completed && filteredCompletion === 'completed',
      },
    }));

    return rows;
  };

  return (
    <WidgetCard className="actionsWidget">
      <WidgetCard.Header className="actionsWidget__header">
        <WidgetCard.Title className="actionsWidget__title">
          <h6 className="actionsWidget__titleText">{props.t('Actions')}</h6>
        </WidgetCard.Title>
        {props.canManageDashboard && (
          <div className="actionsWidget__headerRightDetails">
            <WidgetMenu
              onClickDuplicateWidget={() => props.onClickDuplicateWidget()}
              onClickWidgetSettings={() => {
                props.onClickWidgetSettings(
                  props.widgetId,
                  props.widgetSettings.organisation_annotation_type_ids,
                  props.widgetSettings.population,
                  props.widgetSettings.hidden_columns
                );
              }}
              onClickRemoveWidget={() => {
                setFeebackModalStatus('confirm');
                setFeebackModalMessage(props.t('Delete Actions widget?'));
              }}
              containerType={props.containerType}
            />
          </div>
        )}
      </WidgetCard.Header>

      <div className="actionsWidget__content">
        <ActionsFilter
          filteredPopulation={filteredPopulation}
          filteredCompletion={filteredCompletion}
          filteredAnnotationTypes={filteredAnnotationTypes}
          onFilteredPopulationChange={(newFilteredPopulation) =>
            setFilteredPopulation(newFilteredPopulation)
          }
          onFilteredCompletionChange={(newFilteredCompletion) =>
            setFilteredCompletion(newFilteredCompletion)
          }
          onFilteredAnnotationTypesChange={(newFilteredAnnotationTypes) =>
            setFilteredAnnotationTypes(newFilteredAnnotationTypes)
          }
          widgetSettings={props.widgetSettings}
          annotationTypes={props.annotationTypes}
        />

        {props.isLoading ? (
          <DelayedLoadingFeedback />
        ) : (
          <DataGrid
            columns={getTableColumns()}
            rows={getActionsRows()}
            isFullyLoaded={isContentFullyLoaded}
            isLoading={props.isLoading}
            fetchMoreData={() =>
              props.fetchActions(props.widgetId, {
                next_id: props.nextId,
                population: filteredPopulation,
                completed: filteredCompletion === 'completed' || false,
                organisation_annotation_type_ids: filteredAnnotationTypes,
              })
            }
            emptyTableText={props.t('There are no actions')}
            isTableEmpty={visibleActions.length === 0}
            maxHeight="500px"
          />
        )}
      </div>

      <AppStatus
        status={feedbackModalStatus}
        message={feedbackModalMessage}
        confirmButtonText={props.t('Delete')}
        hideConfirmation={() => {
          setFeebackModalStatus(null);
          setFeebackModalMessage(null);
        }}
        close={() => {
          setFeebackModalStatus(null);
          setFeebackModalMessage(null);
        }}
        confirmAction={() => {
          props.onClickRemoveWidget();
        }}
      />
    </WidgetCard>
  );
};

ActionsWidget.defaultProps = {
  actions: [],
};

export const ActionsWidgetTranslated = withNamespaces()(ActionsWidget);
export default ActionsWidget;
