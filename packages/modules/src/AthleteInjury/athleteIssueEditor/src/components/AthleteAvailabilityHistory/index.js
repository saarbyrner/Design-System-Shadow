// @flow
import { withNamespaces } from 'react-i18next';
import { DatePicker, IconButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { IssueStatusSelectTranslated as IssueStatusSelect } from '../IssueStatusSelect';

import type {
  IssueStatusOption,
  IssueStatusEvent,
} from '../../../../types/_common';

type Props = {
  injuryStatusOptions: Array<IssueStatusOption>,
  initialEventsOrder: Array<string>,
  updatedEventsOrder: Array<string>,
  events: {
    string: IssueStatusEvent,
  },
  onInjuryStatusEventDateChange: (string, string) => void,
  onInjuryStatusChange: (string, string) => void,
  addInjuryStatusEvent: () => void,
  removeInjuryStatusEvent: (string) => void,
  isDisabled: boolean,
};

const AthleteAvailabilityHistory = (props: I18nProps<Props>) => {
  const getDateField = (injuryStatusEventId) => {
    const isFirstInjuryStatusEvent =
      props.updatedEventsOrder.indexOf(injuryStatusEventId) === 0;
    const isPreexistingInjuryStatusEvent =
      props.initialEventsOrder.indexOf(injuryStatusEventId) !== -1;

    return (
      <div
        className="js-injuryStatusEventDate js-validationSection formValidator__section"
        data-injurystatuseventid={injuryStatusEventId}
      >
        <DatePicker
          name="athleteAvailabilityHistory_event_date"
          value={
            props.events[injuryStatusEventId]
              ? props.events[injuryStatusEventId].date
              : null
          }
          onDateChange={(newDate) =>
            props.onInjuryStatusEventDateChange(newDate, injuryStatusEventId)
          }
          disabled={isFirstInjuryStatusEvent || isPreexistingInjuryStatusEvent}
          disableFutureDates
          customClassName="athleteAvailabilityHistory__datePicker"
        />
        <span className="formValidator__errorMsg">
          {props.t('This date conflicts with preceding date')}
        </span>
      </div>
    );
  };

  const getDeleteButton = (hideDeleteButton, injuryStatusEventId) => {
    if (!hideDeleteButton) {
      return (
        <IconButton
          icon="icon-close"
          onClick={() => props.removeInjuryStatusEvent(injuryStatusEventId)}
          isTransparent
        />
      );
    }
    return null;
  };

  const getInjuryStatusOptions = (injuryStatusEventId: string) => {
    // we assume the sorting of status options by their "order" property
    // already happened on the backend
    const updatedStatusOptions = props.injuryStatusOptions.slice(0, -1);
    return injuryStatusEventId === 'new_status'
      ? updatedStatusOptions
      : props.injuryStatusOptions;
  };

  const buildInjuryStatusEvents = () =>
    props.updatedEventsOrder.map((injuryStatusEventId, index) => {
      const isDisabled =
        props.initialEventsOrder.indexOf(injuryStatusEventId) !== -1 &&
        injuryStatusEventId !== 'new_status';
      const isFirstEvent = index === 0;
      const hideDeleteButton = isDisabled || isFirstEvent;
      return (
        <div
          className={`athleteAvailabilityHistory__row ${
            index === 0 ? 'athleteAvailabilityHistory__row--first' : ''
          }`}
          key={injuryStatusEventId}
        >
          <span className="athleteAvailabilityHistory__index">{index + 1}</span>
          <div className="athleteAvailabilityHistory__statusSelect">
            <IssueStatusSelect
              injuryStatusOptions={getInjuryStatusOptions(injuryStatusEventId)}
              injuryStatusEventId={injuryStatusEventId}
              value={
                props.events[injuryStatusEventId]
                  ? props.events[injuryStatusEventId].injury_status_id
                  : ''
              }
              onChange={props.onInjuryStatusChange}
              disabled={isDisabled}
              name="athleteAvailabilityHistory_event_status"
            />
          </div>
          <div className="athleteAvailabilityHistory__date">
            {getDateField(injuryStatusEventId)}
          </div>
          {getDeleteButton(hideDeleteButton, injuryStatusEventId)}
        </div>
      );
    });

  const titleClass = `
    athleteIssueEditor__sectionTitle
    ${props.isDisabled ? 'athleteIssueEditor__sectionTitle--disabled' : ''}
  `;

  return (
    <div
      className={`athleteAvailabilityHistory ${
        props.isDisabled ? 'athleteAvailabilityHistory--disabled' : ''
      }`}
    >
      <h5 className={titleClass}>{props.t('Availability History')}</h5>
      <span className="km-form-label athleteAvailabilityHistory__label">
        {props.t('Status')}
      </span>
      {buildInjuryStatusEvents()}
      <div className="athleteAvailabilityHistory__buttonContainer">
        <IconButton
          icon="icon-add"
          onClick={() => props.addInjuryStatusEvent()}
          isDisabled={props.isDisabled}
        />
      </div>
    </div>
  );
};

export const AthleteAvailabilityHistoryTranslated = withNamespaces()(
  AthleteAvailabilityHistory
);
export default AthleteAvailabilityHistory;
