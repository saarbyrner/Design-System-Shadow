// @flow
import $ from 'jquery';
import classNames from 'classnames';
import { withNamespaces } from 'react-i18next';
import type { Alarm } from '@kitman/common/src/types/Alarm';
import type { Status } from '@kitman/common/src/types/Status';
import {
  TextButton,
  FormValidator,
  MultipleCheckboxChecker,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import AlarmForm from '../../containers/AlarmForm';

type Props = {
  statusId: string,
  alarms: Array<Alarm>,
  status: Status,
  closeModal: () => void,
  createNewAlarm: () => void,
  saveAlarmDefinitions: (string, Array<Alarm>) => void,
  toggleSelectAllForMobile: (Array<$PropertyType<Alarm, 'alarm_id'>>) => void,
  confirmDeleteAllAlarms: () => void,
};
const ModalContent = (props: I18nProps<Props>) => {
  const emptyMessage = (
    <p className="modalContent--alarmEditor__emptyMessage">
      {props.t('No alarms defined for this status')}
    </p>
  );

  const unitText = `${
    props.status.localised_unit ? `(${props.status.localised_unit})` : ''
  }`;

  const getAlarmsDefinedText = () =>
    props.alarms.length < 1
      ? props.t('No alarms defined')
      : props.t('{{alarmsCount}} Alarms defined', {
          alarmsCount: props.alarms.length,
        });

  const descriptionText = `${unitText} - ${
    props.status.description
  } - ${getAlarmsDefinedText()}`;

  const validateCallback = (valid) => {
    if (valid) {
      props.saveAlarmDefinitions(props.statusId, props.alarms);
    } else {
      // multiple classes used to indicate error :/
      const errorClasses =
        '.modalContent .km-error, .hasError, .multiSelect--error';
      $(errorClasses).first().closest('.alarmForm')[0].scrollIntoView();
    }
  };

  const fireEventTracking = () => {
    // $FlowFixMe: third party library not imported (Google analytics)
    if (typeof ga === 'function') {
      // eslint-disable-next-line no-undef
      ga(
        'send',
        'event',
        'Dashboard',
        'trigger_cancel_add_alarm',
        'Cancel Add Alarm'
      );
    }
  };

  const getAlarmIdList = () => props.alarms.map((alarm) => alarm.alarm_id);

  const getAlarmIdsWithShowOnMobile = () => {
    const alarmIdList = getAlarmIdList();
    const alarmsById = props.alarms.reduce((hash, alarm) => {
      Object.assign(hash, { [alarm.alarm_id]: alarm });
      return hash;
    }, {});
    return alarmIdList.filter(
      (alarmId) => alarmsById[alarmId].show_on_mobile === true
    );
  };

  const getCheckboxType = () => {
    const alarmIdList = getAlarmIdList();
    const alarmIdsWithShowOnMobile = getAlarmIdsWithShowOnMobile();

    if (alarmIdsWithShowOnMobile.length === alarmIdList.length) {
      return 'ALL_CHECKED';
    }
    if (alarmIdsWithShowOnMobile.length > 0) {
      return 'PARTIALLY_CHECKED';
    }
    return 'EMPTY';
  };

  const renderShowAllMobileCheckbox = () => {
    const alarmIdsWithShowOnMobile = getAlarmIdsWithShowOnMobile();
    return props.alarms.length > 0 ? (
      <div className="modalContent--alarmEditor__selectAllForMobile">
        <MultipleCheckboxChecker
          type={getCheckboxType()}
          onClick={() => {
            props.toggleSelectAllForMobile(alarmIdsWithShowOnMobile);
          }}
        />
        <span>{props.t('Select All "Show On Coach App"')}</span>
      </div>
    ) : null;
  };

  const renderDeleteAllAlarms = () =>
    props.alarms.length > 0 && (
      <TextButton
        type="textOnly"
        onClick={() => props.confirmDeleteAllAlarms()}
        text={props.t('Delete All Alarms')}
      />
    );

  const buttonContainerClassNames = classNames(
    'modalContent--alarmEditor__buttonContainer',
    {
      'modalContent--alarmEditor__buttonContainer--withAlarms':
        props.alarms.length > 1,
    }
  );

  const validatePercentageValue = (input: Object) => {
    let isPercentageValid = true;
    const $currentInput = input[0];
    if ($currentInput.name === 'percentageValue') {
      const value = $currentInput.value;

      const isValueInCharacterLimit = value.length >= 1 && value.length <= 4;
      const isValueNumber = !isNaN(parseFloat(value)) && isFinite(value); // eslint-disable-line no-restricted-globals
      const isValuePositive = parseInt(value, 10) >= 0;

      // we need to pass these rules in a custom validation
      // to display the custom error message for the field
      isPercentageValid =
        isValueInCharacterLimit && isValueNumber && isValuePositive;
    }

    return isPercentageValid;
  };

  return (
    <div className="row-fluid">
      <FormValidator
        validate={validateCallback}
        customValidation={validatePercentageValue}
        inputNamesToIgnore={['alarmForm__showOnMobile']}
      >
        <div className="modalContent modalContent--alarmEditor">
          <h5 className="modalContent--alarmEditor__modalTitle">
            {props.t('Alarms')}
          </h5>
          <p className="modalContent--alarmEditor__statusName">
            {props.status.name}
            <span>{descriptionText}</span>
          </p>
          {props.status.injury_risk_threshold && (
            <p className="modalContent--alarmEditor__suggestedThreshold">
              {props.t('Suggested threshold:')}{' '}
              {props.status.injury_risk_threshold}%
            </p>
          )}

          {renderShowAllMobileCheckbox()}

          <div className="modalContent--alarmEditor__alarms">
            {props.alarms.length > 0
              ? props.alarms.map((alarm, index) => (
                  // $FlowFixMe
                  <AlarmForm
                    key={alarm.alarm_id}
                    position={index}
                    {...alarm}
                    unit={props.status.localised_unit}
                    type={props.status.type}
                    summary={props.status.summary}
                  />
                ))
              : emptyMessage}
          </div>

          {props.alarms.length > 1 ? (
            <p className="modalContent__disclaimer">
              <span className="modalContent__disclaimerIcon icon-info" />
              {props.t(
                'Alarms are listed in priority order, if more than one alarm threshold is reached the first will be shown on the dashboard'
              )}
            </p>
          ) : null}

          <div className={buttonContainerClassNames}>
            <div className="modalContent--alarmEditor__addBtn">
              <TextButton
                type="secondary"
                iconBefore="icon-add"
                onClick={props.createNewAlarm}
                text={props.t('Add Alarm')}
                size="small"
              />
            </div>
          </div>

          <div className="km-datagrid-modalFooter modalContent--alarmEditor__footer">
            {renderDeleteAllAlarms()}
            <div className="modalContent--alarmEditor__footerBtnContainer">
              <button
                type="button"
                className="btn km-btn-secondary"
                onClick={props.closeModal}
              >
                {props.t('Cancel')}
              </button>
              <button
                className="btn km-btn-primary"
                onClick={fireEventTracking()}
                type="submit"
              >
                {props.t('Save')}
              </button>
            </div>
          </div>
        </div>
      </FormValidator>
    </div>
  );
};

export default ModalContent;
export const ModalContentTranslated = withNamespaces()(ModalContent);
