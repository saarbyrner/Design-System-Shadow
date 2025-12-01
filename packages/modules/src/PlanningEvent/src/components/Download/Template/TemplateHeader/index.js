// @flow
import { withNamespaces } from 'react-i18next';
import moment from 'moment-timezone';
import { useMemo } from 'react';
import type { Event } from '@kitman/common/src/types/Event';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import {
  getEventName,
  formatGameDayPlusMinus,
} from '@kitman/common/src/utils/workload';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  event: Event,
  orgTimezone: string,
  orgLogoPath: string,
  orgName: string,
  squadName: string,
};

const TemplateHeader = (props: I18nProps<Props>) => {
  const gameDayPlusMinus = useMemo(
    () => formatGameDayPlusMinus(props.event),
    [props.event]
  );

  const formatDate = (date: moment): string => {
    if (window.featureFlags['standard-date-formatting']) {
      return DateFormatter.formatStandard({ date, displayLongDate: true });
    }

    return date.format('Do MMM YY');
  };

  const formatTime = (date: moment): string => {
    if (window.featureFlags['standard-date-formatting']) {
      return DateFormatter.formatJustTime(date);
    }

    return date.format('h:mm a');
  };

  return (
    <div className="templateHeader">
      <div className="templateHeader__logo">
        <img src={props.orgLogoPath} alt={props.orgName} />
      </div>

      <div className="templateHeader__right">
        <div className="templateHeader__org">{props.orgName}</div>

        <div className="templateHeader__meta">
          <div>
            <div className="templateHeader__metaTitle">{props.t('Squad')}</div>
            <div className="templateHeader__metaInfo">{props.squadName}</div>
          </div>
          {gameDayPlusMinus && (
            <div className="templateHeader__metaBox">
              <div className="templateHeader__metaTitle">
                {props.t('Game day')}
              </div>
              <div className="templateHeader__metaInfo">{gameDayPlusMinus}</div>
            </div>
          )}
          <div className="templateHeader__metaBox">
            <div className="templateHeader__metaTitle">
              {props.t('Session type')}
            </div>
            <div className="templateHeader__metaInfo templateHeader__metaInfoTitle">
              {getEventName(props.event)}
            </div>
          </div>
          {props.event.type === 'session_event' && props.event.theme?.name && (
            <div className="templateHeader__metaBox">
              <div className="templateHeader__metaTitle">
                {props.t('Theme')}
              </div>
              <div className="templateHeader__metaInfo templateHeader__metaInfoTitle">
                {/* $FlowIgnore props.event.type === 'session_event'
                    check ensures props.event.theme may exist. */}
                {props.event.theme.name}
              </div>
            </div>
          )}
          {props.event.surface_type && (
            <div className="templateHeader__metaBox">
              <div className="templateHeader__metaTitle">
                {props.t('Surface type')}
              </div>
              <div className="templateHeader__metaInfo">
                {props.event.surface_type?.name}
              </div>
            </div>
          )}
          {props.event.weather && (
            <div className="templateHeader__metaBox">
              <div className="templateHeader__metaTitle">
                {props.t('Weather')}
              </div>
              <div className="templateHeader__metaInfo">
                {props.event.weather?.title}
              </div>
            </div>
          )}
          <div className="templateHeader__metaBox">
            <div className="templateHeader__metaTitle">{props.t('Date')}</div>
            <div className="templateHeader__metaInfo templateHeader__metaInfoEventDate">
              {formatDate(moment.tz(props.event.start_date, props.orgTimezone))}
            </div>
          </div>
          <div className="templateHeader__metaBox">
            <div className="templateHeader__metaTitle">{props.t('Time')}</div>
            <div className="templateHeader__metaInfo templateHeader__meta_InfoEventTime">
              {formatTime(
                moment.tz(props.event.start_date, props.event.local_timezone)
              )}{' '}
              ({props.event.local_timezone})
            </div>
          </div>
          {props.event.duration && (
            <div className="templateHeader__metaBox">
              <div className="templateHeader__metaTitle">
                {props.t('Duration')}
              </div>
              <div className="templateHeader__metaInfo">
                {props.event.duration} min
              </div>
            </div>
          )}
          {props.event.description && (
            <div className="templateHeader__metaBox">
              <div className="templateHeader__metaTitle">
                {props.t('Description')}
              </div>
              <div className="templateHeader__metaInfo">
                {props.event.description}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const TemplateHeaderTranslated = withNamespaces()(TemplateHeader);
export default TemplateHeader;
