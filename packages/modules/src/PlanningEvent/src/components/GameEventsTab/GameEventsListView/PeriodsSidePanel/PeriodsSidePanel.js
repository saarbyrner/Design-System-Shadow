// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  SortableElement,
  SortableContainer,
  arrayMove,
} from 'react-sortable-hoc';

import type { Event } from '@kitman/common/src/types/Event';
import type {
  GameActivity,
  GamePeriod,
} from '@kitman/common/src/types/GameEvent';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from './styles';

type Props = {
  event: Event,
  setIsPeriodsPanelOpen: Function,
  onSelectPeriod: Function,
  onSelectSummary: Function,
  periods: Array<GamePeriod>,
  onClickAddPeriod: Function,
  formationChanges: Array<GameActivity>,
  onOrderChanged: Function,
  onDuplicate: Function,
  selectedPeriod: ?GamePeriod,
  pitchViewEnabled: boolean,
};

const PeriodsSidePanel = (props: I18nProps<Props>) => {
  const [periods, setPeriods] = useState([]);

  useEffect(() => setPeriods(props.periods), [props.periods]);

  const getTotalMinutes = () => {
    return props.periods.reduce(
      (a, b) => a + (parseInt(b.duration, 10) || 0),
      0
    );
  };

  const formationList = (periodId) => {
    const formations = props.formationChanges
      .filter((gameActivity) => gameActivity.game_period_id === periodId)
      .map(({ relation }) => relation?.name)
      .join(' | ');
    return formations ? ` | ${formations}` : '';
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const arr = arrayMove(periods, oldIndex, newIndex);
    for (let i = 0; i < arr.length; i++) {
      arr[i].order = i;
    }
    setPeriods(arr);
    props.onOrderChanged(arr);
  };

  const isSelected = (periodId: number) =>
    (props.selectedPeriod?.localId || props.selectedPeriod?.id) === periodId;

  const SortableItem = SortableElement(({ period }) => (
    <div
      onClick={() => {
        props.onSelectPeriod(period);
      }}
      key={period.id}
      index={period.id} // eslint-disable-line react/no-unknown-property
      css={[
        style.item,
        isSelected(period.localId || period.id) && style.selected,
      ]}
      style={{ zIndex: 9999999 }}
    >
      <div
        data-testid="PeriodsSidePanel|PeriodItem"
        data-isselected={isSelected(period.id)}
      >
        <div>
          <span data-testid="PeriodsSidePanel|PeriodTitle">
            {/*  <span className="icon-drag-handle" /> */} {period.name}
          </span>
          {!props.pitchViewEnabled && (
            <span
              css={style.duplicateIcon}
              className="duplicateIcon icon-duplicate"
              onClick={() => {
                props.onDuplicate(period);
              }}
              data-testid={`duplicate-icon-${period.id}`}
            />
          )}
        </div>
        <div>
          {period.duration}
          {period.additional_duration
            ? ` (+ ${period.additional_duration}) `
            : ' '}
          {props.t('mins')}
          <span data-testid="PeriodsSidePanel|PeriodFormations">
            {formationList(period.id)}
          </span>
        </div>
      </div>
    </div>
  ));

  const SortableList = SortableContainer(({ items }) => (
    <div className="list">
      {items
        .sort((a, b) => a.order - b.order)
        .map((period, index) => (
          <SortableItem
            period={period}
            index={index}
            key={period.id}
            disabled // disabled sorting functionality for now based on recent meetings. 22/7/2022
          />
        ))}
    </div>
  ));

  return (
    <div css={style.periodPanelContainer}>
      <div
        data-testid="PeriodsSidePanel|SummaryItem"
        key="sidePanelPeriod_summary"
        css={[style.summary, !props.selectedPeriod && style.selected]}
        onClick={() => {
          props.onSelectSummary();
        }}
        data-isselected={!props.selectedPeriod}
      >
        <div className="summary-info">
          <div css={style.summaryTitle}>{props.t('Game summary')}</div>
          <div data-testid="PeriodsSidePanel|DurationTotal">{`${getTotalMinutes()} ${props.t(
            'mins'
          )}`}</div>
        </div>
        <button
          type="button"
          data-testid="periods-side-panel-close-icon"
          onClick={() => props.setIsPeriodsPanelOpen(false)}
          css={style.closeButton}
          className="reactModal__closeBtn icon-close"
        />
      </div>

      <SortableList
        {...props}
        items={periods}
        onSortEnd={onSortEnd}
        axis="xy"
        distance={1}
      />

      {!props.pitchViewEnabled && (
        <div css={style.add} onClick={() => props.onClickAddPeriod()}>
          {props.t('Add Period')}
        </div>
      )}
    </div>
  );
};

export const PeriodsSidePanelTranslated = withNamespaces()(PeriodsSidePanel);
export default PeriodsSidePanel;
