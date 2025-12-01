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
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { RequestResponse as AthleteMedicalAlertResponse } from '@kitman/modules/src/Medical/shared/types/medical/MedicalAlertData';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from './style';

type Props = {
  athleteData: AthleteData,
  onExportAthleteIssuesData: Function,
  openInjuryExportSidePanel: Function,
  openAncillaryRangeSidePanel: () => void,
  athleteMedicalAlerts: Array<AthleteMedicalAlertResponse>,
  openAncillaryRangeSidePanel: () => void,
};

const noDataContent = <span css={style.noDataContent}>-</span>;

const AppHeader = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();

  const isPastAthlete = !!props.athleteData?.org_last_transfer_record?.left_at;

  const getSquadNames = () => {
    const squadNamesArr = props.athleteData.squad_names.map((squad) => {
      return squad.name;
    });

    return squadNamesArr.join(', ');
  };

  const exportAction = () => {
    if (window.featureFlags['injury-export-side-panel']) {
      props.openInjuryExportSidePanel();
    } else {
      props.onExportAthleteIssuesData();
    }
  };

  const ancillaryRangeAction = () => {
    if (window.featureFlags['nfl-ancillary-data']) {
      props.openAncillaryRangeSidePanel();
    }
  };
  return (
    <header data-testid="AppHeader" css={style.header}>
      <div css={style.flex}>
        <Link
          css={style.rosterLink}
          href={
            isPastAthlete
              ? '/medical/rosters#past_athletes'
              : '/medical/rosters'
          }
        >
          <i className="icon-next-left" />
          {props.t('Team')}
        </Link>
        <div css={style.gap}>
          {permissions.general.ancillaryRange.canManage && (
            <TextButton
              text={props.t('Ancillary range')}
              type="secondary"
              onClick={ancillaryRangeAction}
              kitmanDesignSystem
            />
          )}
          {permissions.medical.issues.canExport && (
            <TextButton
              text={props.t('Export')}
              type="secondary"
              onClick={exportAction}
              kitmanDesignSystem
            />
          )}
        </div>
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
              {permissions.medical.alerts.canView &&
                window.featureFlags['medical-alerts-side-panel'] &&
                props.athleteMedicalAlerts?.length > 0 && (
                  // $FlowIgnore[incompatible-use]
                  // $FlowIgnore[invalid-compare]
                  <>
                    {props.athleteMedicalAlerts?.map((alert) => (
                      <div key={alert.id} css={style.athleteAllergy}>
                        <TextTag
                          content={
                            alert.alert_title || alert.medical_alert.name
                          }
                          backgroundColor={severityLabelColour(alert.severity)}
                          textColor={
                            alert.severity === 'severe'
                              ? colors.white
                              : colors.grey_400
                          }
                          fontSize={12}
                        />
                      </div>
                    ))}
                  </>
                )}
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
