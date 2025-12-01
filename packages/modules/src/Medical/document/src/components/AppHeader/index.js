// @flow
import { colors } from '@kitman/common/src/variables';
import severityLabelColour from '@kitman/common/src/utils/severityLabelColour';
import { withNamespaces } from 'react-i18next';
import {
  EllipsisTooltipText,
  Link,
  TextTag,
  TextButton,
} from '@kitman/components';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useHistoryGo from '@kitman/common/src/hooks/useHistoryGo';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import style from '@kitman/modules/src/Medical/document/src/components/AppHeader/style';

// Types:
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';

type Props = {
  athleteData: AthleteData,
};

const noDataContent = <span css={style.noDataContent}>-</span>;

const AppHeader = (props: I18nProps<Props>) => {
  const { trackEvent } = useEventTracking();
  const historyGo = useHistoryGo();
  const { permissions } = usePermissions();
  const getSquadNames = () => {
    const squadNamesArr = props.athleteData.squad_names.map((squad) => {
      return squad.name;
    });

    return squadNamesArr.join(', ');
  };

  return (
    <header data-testid="AppHeader" css={style.header}>
      <div css={style.flex}>
        <Link css={style.rosterLink} href="#" onClick={() => historyGo(-1)}>
          <i className="icon-next-left" />
          {props.t('Back')}
        </Link>
        {permissions.medical.issues.canExport && (
          <TextButton
            text={props.t('Print')}
            type="secondary"
            onClick={() => {
              window.print();
              trackEvent(
                performanceMedicineEventNames.clickPrintMedicalDocument
              );
            }}
            data-testid="DocumentEntity|Print"
            kitmanDesignSystem
          />
        )}
      </div>
      <div css={style.content}>
        <img
          css={style.athleteAvatar}
          src={props.athleteData.avatar_url}
          alt={props.athleteData.fullname}
        />
        <div css={style.athleteContent}>
          <div css={style.athleteNameWrapper}>
            <h2 css={style.athleteName}>{props.athleteData.fullname}</h2>
            <div css={style.athleteAllergies}>
              {permissions.medical.allergies.canView &&
                (props.athleteData.allergy_names?.length > 0 ||
                  // $FlowIgnore[incompatible-use]
                  // $FlowIgnore[invalid-compare]
                  props.athleteData.allergies?.length > 0) &&
                props.athleteData.allergies?.map((allergy) => (
                  <div key={allergy.id} css={style.athleteAllergy}>
                    <TextTag
                      content={allergy.display_name}
                      backgroundColor={severityLabelColour(allergy.severity)}
                      fontSize={12}
                      textColor={
                        allergy.severity === 'severe'
                          ? colors.white
                          : colors.grey_400
                      }
                    />
                  </div>
                ))}
            </div>
          </div>
          <div css={style.athleteDataWrapper}>
            {props.athleteData.extended_attributes?.nfl_player_id && (
              <div css={style.athleteData}>
                <h4 className="kitmanHeading--L4">
                  {props.t('NFL Player ID')}
                </h4>
                <p>
                  {props.athleteData.extended_attributes?.nfl_player_id ||
                    noDataContent}
                </p>
              </div>
            )}
            <div css={style.athleteData}>
              <h4 className="kitmanHeading--L4">{props.t('Date of birth')}</h4>
              <p>{props.athleteData.date_of_birth || noDataContent}</p>
            </div>
            <div css={style.athleteData}>
              <h4 className="kitmanHeading--L4">{props.t('Age')}</h4>
              <p>{props.athleteData.age || noDataContent}</p>
            </div>
            <div css={style.athleteData}>
              <h4 className="kitmanHeading--L4">{props.t('Country')}</h4>
              <p>{props.athleteData.country}</p>
            </div>
            <div css={style.athleteData}>
              <h4 className="kitmanHeading--L4">{props.t('Height')}</h4>
              <p>{props.athleteData.height || noDataContent}</p>
            </div>
            <div css={style.athleteData}>
              <h4 className="kitmanHeading--L4">{props.t('Status')}</h4>
              <p>{props.athleteData.availability}</p>
            </div>
            <div css={style.athleteData}>
              <h4 className="kitmanHeading--L4">{props.t('Positions')}</h4>
              <p>{props.athleteData.position_group}</p>
            </div>
            <div css={style.athleteData}>
              <h4 className="kitmanHeading--L4">{props.t('Team')}</h4>
              {props.athleteData.squad_names &&
                props.athleteData.squad_names.length > 0 && (
                  <EllipsisTooltipText
                    content={getSquadNames()}
                    displayEllipsisWidth={300}
                  />
                )}
            </div>
            <div css={style.athleteData}>
              <h4 className="kitmanHeading--L4">
                {props.t('Open injury/ illness')}
              </h4>
              <p>{props.athleteData.unresolved_issues_count}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export const AppHeaderTranslated = withNamespaces()(AppHeader);
export default AppHeader;
