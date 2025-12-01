// @flow
import { withNamespaces } from 'react-i18next';
import { RichTextDisplay } from '@kitman/components';
import type { DownloadTemplateEventActivity } from '@kitman/common/src/types/Event';
import classNames from 'classnames';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import Athletes from '../Athletes';

type Props = {
  template: string,
  activities: Array<DownloadTemplateEventActivity>,
  showParticipants: boolean,
  showNotes: boolean,
};

const Activities = (props: I18nProps<Props>) => {
  const templateClass = classNames({
    'templateType--activities': props.template === 'default',
    'templateType--activities_stacked': props.template === 'stacked',
  });

  const renderMetaInfo = (activity: DownloadTemplateEventActivity) => {
    return (
      <div className={`${templateClass}__activity`} key={`meta_${activity.id}`}>
        <div className={`${templateClass}__activityTitle`}>
          {activity.activityname}
        </div>
        <div className={`${templateClass}__activityMetaInfos`}>
          {activity.drillname && (
            <div className={`${templateClass}__activityMetaInfo`}>
              <div className={`${templateClass}__activityMetaInfoTitle`}>
                {props.t('Drill name')}
              </div>
              <div className={`${templateClass}__activityMetaInfoValue`}>
                {activity.drillname}
              </div>
            </div>
          )}
          {activity.duration && (
            <div className={`${templateClass}__activityMetaInfo`}>
              <div className={`${templateClass}__activityMetaInfoTitle`}>
                {props.t('Duration')}
              </div>
              <div className={`${templateClass}__activityMetaInfoValue`}>
                {activity.duration} {props.t('mins')}
              </div>
            </div>
          )}
          {activity.principles && activity.principles.length > 0 && (
            <div className={`${templateClass}__activityMetaInfo`}>
              <div className={`${templateClass}__activityMetaInfoTitle`}>
                {props.t('Principle(s)')}
              </div>
              <div className={`${templateClass}__activityMetaInfoValue`}>
                {activity.principles.map((p) => p.name).join('; ')}
              </div>
            </div>
          )}
          {activity.event_activity_drill_labels && (
            <div className={`${templateClass}__activityMetaInfo`}>
              <div className={`${templateClass}__activityMetaInfoTitle`}>
                {props.t('Drill label(s)')}
              </div>
              <div className={`${templateClass}__activityMetaInfoValue`}>
                {activity.event_activity_drill_labels
                  ?.map((p) => p.name)
                  .join('; ')}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderNotes = (activity: DownloadTemplateEventActivity) => {
    return (
      <div className={`${templateClass}__notes`} key={`notes_${activity.id}`}>
        <div className={`${templateClass}__notesTitle`}>{props.t('Notes')}</div>
        <RichTextDisplay value={activity.notes} isAbbreviated={false} />
      </div>
    );
  };

  const renderAthletes = (activity: DownloadTemplateEventActivity) => {
    return (
      <div
        className={`${templateClass}__athletes`}
        key={`athletes_${activity.id}`}
      >
        <div className={`${templateClass}__athletesTitle`}>
          {props.t('Participants')} ({activity.participants.length})
        </div>
        <Athletes athletes={activity.participants} />
      </div>
    );
  };

  const renderActivity = (activity: DownloadTemplateEventActivity) => {
    return (
      <div
        className={`${templateClass}__activityHolder`}
        key={`activity_${activity.id}`}
      >
        <div className={`${templateClass}__activityHolderInfo`}>
          {renderMetaInfo(activity)}
          {props.showNotes && activity.notes && renderNotes(activity)}
          {props.showParticipants && renderAthletes(activity)}
        </div>
        <div className={`${templateClass}__activityHolderDiagram`}>
          {activity.attachment && (
            <img
              crossOrigin="true"
              /* $FlowFixMe filename must exist */
              alt={activity.attachment?.filename}
              /* $FlowFixMe url must exist */
              src={activity.attachment?.url}
            />
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    return props.activities.map((activity) => {
      return renderActivity(activity);
    });
  };

  return <div className={templateClass}>{renderContent()}</div>;
};

export const ActivitiesTranslated = withNamespaces()(Activities);
export default Activities;
