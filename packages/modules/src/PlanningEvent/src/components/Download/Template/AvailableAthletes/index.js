// @flow
import { withNamespaces } from 'react-i18next';
import type { DownloadTemplateAthlete } from '@kitman/common/src/types/Event';
import type { ParticipationLevel } from '@kitman/modules/src/OrganisationSettings/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import Athletes from '../Athletes';

type Props = {
  athletes: Array<DownloadTemplateAthlete>,
  gameParticipationLevels: Array<ParticipationLevel>,
};

const AvailableAthletes = (props: I18nProps<Props>) => {
  const displayKey = (): boolean => {
    const athletes = props.athletes.filter((ath) => {
      return (
        ath.participation_level === 'modified' ||
        ath.participation_level === 'partial'
      );
    });
    return athletes.length > 0;
  };

  const getParticipationLevel = (level: 'modified' | 'partial') => {
    const data = props.gameParticipationLevels.find(
      (a) => a.canonical_participation_level === level
    );
    return data?.name;
  };

  return (
    <div className="availableAthletes">
      <div className="availableAthletes__header">
        <div className="availableAthletes__title">
          {props.t('Available Athletes')} ({props.athletes.length})
        </div>

        {displayKey() && (
          <div className="availableAthletes__key">
            {props.t('Participation level: ')}
            <div className="availableAthletes__iconCircle" />
            <div>{getParticipationLevel('modified')}</div>
            <div className="availableAthletes__iconArrowUp" />
            <div>{getParticipationLevel('partial')}</div>
          </div>
        )}
      </div>
      <Athletes athletes={props.athletes} />
    </div>
  );
};

export const AvailableAthletesTranslated = withNamespaces()(AvailableAthletes);
export default AvailableAthletes;
