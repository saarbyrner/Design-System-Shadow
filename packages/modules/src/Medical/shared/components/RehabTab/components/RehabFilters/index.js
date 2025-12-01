// @flow
import type { ComponentType } from 'react';
import moment from 'moment-timezone';
import { withNamespaces } from 'react-i18next';
import {
  DatePicker,
  TooltipMenu,
  TextButton,
  Select,
  IconButton,
} from '@kitman/components';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';
import style from './style';
import type { RehabDayMode, RehabMode } from '../../types';
import { useTransferRecord } from '../../../../contexts/TransferRecordContext';
import { ADD_REHAB_BUTTON } from '../../../../constants/elementTags';

type Props = {
  dayMode: RehabDayMode,
  rehabMode: RehabMode,
  sidePanelIsOpen: boolean,
  inMaintenance: boolean,
  athleteId?: number | string,
  rehabDate: moment,
  numberOfSelections: number,
  numberOfEditedExercises: number,
  displayEditAll: boolean,
  canViewNotes: boolean,
  viewNotesToggledOn: boolean,
  onToggleViewNotes: () => void,
  onClickCloseAll: () => void,
  onClickAddRehab: () => void,
  onClickEditAllRehab: () => void,
  onSelectMode: (mode: RehabDayMode) => void,
  onSelectRehabDate: (date: moment) => void,
  onClickCopyMode: () => void,
  onClickLinkToMode: () => void,
  onClickGroupMode: () => void,
  onClickSidePanelDone: () => void,
  onChangeDateRight: () => void,
  onChangeDateLeft: () => void,
  onClickToday: () => void,
  hiddenFilters?: ?Array<string>,
};

const RehabFilters = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();

  const transferRecord = useTransferRecord();

  const maxDate = transferRecord?.left_at
    ? moment(transferRecord.left_at)
    : undefined;

  const minDate = transferRecord?.joined_at
    ? moment(transferRecord.joined_at)
    : undefined;

  const canMoveDateForward = maxDate
    ? props.rehabDate.isBefore(maxDate, 'day')
    : true;

  const dayModeOptions = [
    {
      label: props.t('1 day'),
      value: '1_DAY',
    },
    {
      label: props.t('3 day'),
      value: '3_DAY',
    },
    {
      label: props.t('5 day'),
      value: '5_DAY',
    },
    {
      label: props.t('7 day'),
      value: '7_DAY',
    },
  ];

  const showPlayerMovementDatePicker = () => {
    return window.featureFlags['player-movement-aware-datepicker'];
  };

  const tooltipMenuOptions = [
    /* check if user has permission to print */
    ...(window.featureFlags['rehab-print-single'] &&
    ['1_DAY', '3_DAY', '5_DAY', '7_DAY'].includes(props.dayMode)
      ? [
          {
            key: 'print',
            description: props.t('Print'),
            icon: 'icon-print',
            onClick: () => window.print(),
          },
        ]
      : []),
    /* check if user has permission to view Rehab Notes */
    ...(window.featureFlags['rehab-note'] && props.canViewNotes
      ? [
          {
            key: 'notes',
            description: props.viewNotesToggledOn
              ? props.t('Hide Notes')
              : props.t('Show Notes'),
            icon: props.viewNotesToggledOn ? 'icon-hide' : 'icon-show',
            onClick: () => props.onToggleViewNotes(),
          },
        ]
      : []),
  ];

  const renderDatePickerNew = () => {
    return (
      <div css={style.marginRight8}>
        <MovementAwareDatePicker
          athleteId={props.athleteId}
          value={props.rehabDate}
          onChange={(selectedDate) => {
            props.onSelectRehabDate(selectedDate);
          }}
          name="rehabDate"
          kitmanDesignSystem
        />
      </div>
    );
  };

  return (
    <header css={style.header}>
      <div css={style.scrollContainer}>
        <div css={style.headerContainer}>
          <div css={style.filters}>
            <div
              css={style.dayModeSelect}
              data-testid="RehabFilters|DayModeSelect"
            >
              <Select
                appendToBody
                value={props.dayMode}
                options={dayModeOptions}
                onChange={(dayMode) => props.onSelectMode(dayMode)}
              />
            </div>
            {showPlayerMovementDatePicker() ? (
              renderDatePickerNew()
            ) : (
              <div css={style.datePicker}>
                <DatePicker
                  value={props.rehabDate}
                  onDateChange={(selectedDate) => {
                    props.onSelectRehabDate(selectedDate);
                  }}
                  clearBtn
                  orientation="vertical auto"
                  todayHighlight
                  kitmanDesignSystem
                  maxDate={maxDate}
                  minDate={
                    window.featureFlags[
                      'player-movement-entity-rehab-and-maintenance'
                    ] && minDate
                  }
                />
              </div>
            )}
            <TextButton
              text={props.t('Today')}
              isSmall
              type="secondary"
              kitmanDesignSystem
              onClick={props.onClickToday}
            />
            <div
              css={style.changeDayButtons}
              data-testid="RehabFilters|ChangeDate"
            >
              <IconButton
                icon="icon-next-left"
                isBorderless
                onClick={props.onChangeDateLeft}
                isSmall
              />
              <IconButton
                icon="icon-next-right"
                isBorderless
                onClick={props.onChangeDateRight}
                isSmall
                isDisabled={!canMoveDateForward}
              />
            </div>
          </div>
          <div css={style.actionButtons}>
            {permissions.rehab.canManage &&
              props.rehabMode === 'DEFAULT' &&
              !props.hiddenFilters?.includes(ADD_REHAB_BUTTON) && (
                <div
                  css={style.actions}
                  data-testid="RehabFilters|RehabOptions"
                >
                  <TextButton
                    text={props.t('Add')}
                    type="secondary"
                    kitmanDesignSystem
                    onClick={props.onClickAddRehab}
                  />
                  {props.displayEditAll && (
                    <TextButton
                      text={props.t('Edit')}
                      type="secondary"
                      kitmanDesignSystem
                      onClick={props.onClickEditAllRehab}
                    />
                  )}

                  {props.numberOfEditedExercises > 0 && (
                    <TextButton
                      text={props.t('Done')}
                      type="primary"
                      kitmanDesignSystem
                      onClick={props.onClickCloseAll}
                    />
                  )}
                  {window.featureFlags['rehab-groups'] &&
                    !props.numberOfEditedExercises && (
                      <TextButton
                        text={props.t('Add group')}
                        type="secondary"
                        kitmanDesignSystem
                        onClick={props.onClickGroupMode}
                      />
                    )}
                  {window.featureFlags['rehab-link-to-injury'] &&
                    props.inMaintenance && (
                      <TextButton
                        text={props.t('Link to')}
                        type="secondary"
                        kitmanDesignSystem
                        onClick={props.onClickLinkToMode}
                      />
                    )}
                  {!props.numberOfEditedExercises && (
                    <TextButton
                      text={props.t('Copy')}
                      type="secondary"
                      kitmanDesignSystem
                      onClick={props.onClickCopyMode}
                    />
                  )}

                  {tooltipMenuOptions.length > 0 && (
                    <TooltipMenu
                      placement="bottom-start"
                      offset={[10, 10]}
                      menuItems={tooltipMenuOptions}
                      tooltipTriggerElement={
                        <button
                          type="button"
                          css={style.burgerButton}
                          data-testid="RehabFilters|BurgerMenu"
                        >
                          <i className="icon-more" />
                        </button>
                      }
                      kitmanDesignSystem
                    />
                  )}
                </div>
              )}
            {permissions.rehab.canManage &&
              props.rehabMode !== 'DEFAULT' &&
              props.rehabMode !== 'ADDING_TO_FIRST_SESSION' && (
                <div css={style.actions} data-testid="RehabFilters|CopyRehab">
                  <div
                    css={style.actionText}
                    data-testid="RehabFilters|actionText"
                  >
                    {`${props.t('Selected')}: ${props.numberOfSelections}`}
                  </div>
                  {!props.sidePanelIsOpen && (
                    <TextButton
                      text={props.t('Done')}
                      type="primary"
                      kitmanDesignSystem
                      onClick={props.onClickSidePanelDone}
                    />
                  )}
                </div>
              )}
            <div
              css={
                props.sidePanelIsOpen
                  ? style.buttonMoverExpanded
                  : style.buttonMoverContracted
              }
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export const RehabFiltersTranslated: ComponentType<Props> =
  withNamespaces()(RehabFilters);
export default RehabFilters;
