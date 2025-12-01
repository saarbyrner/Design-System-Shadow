// @flow
import { TextTag } from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import severityLabelColour from '@kitman/common/src/utils/severityLabelColour';
import uuid from 'uuid';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { ComponentType } from 'react';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import { css } from '@emotion/react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from './styles';

type Props = {
  athleteData: AthleteData,
};

const AllergyAlertSection = (props: I18nProps<Props>) => {
  const styles = {
    firstHalf: css`
      grid-column: 1 / 5;
      margin-bottom: 16px;
    `,
    secondHalf: css`
      grid-column: 5 / 9;
    `,
  };
  const { permissions } = usePermissions();

  const hasNewAllergyFlowAllergies =
    permissions.medical.allergies?.canViewNewAllergy &&
    props.athleteData?.allergies;

  const hasMedicalAlerts =
    window.featureFlags['medical-alerts-side-panel'] &&
    permissions.medical.alerts?.canView &&
    props.athleteData?.athlete_medical_alerts;

  return (
    <>
      {permissions.medical.allergies?.canViewNewAllergy && (
        <div
          css={
            hasNewAllergyFlowAllergies && hasMedicalAlerts
              ? styles.firstHalf
              : styles.secondHalf
          }
        >
          <label css={style.label}>{props.t('Allergies')}</label>
          {!props.athleteData?.allergies?.length && (
            <div css={style.textField}>None</div>
          )}
          <div
            data-testid="AddMedicationSidePanel|AllergiesSection"
            css={style.allergySection}
          >
            {hasNewAllergyFlowAllergies
              ? props.athleteData.allergies?.map((allergy) => (
                  <div key={uuid()} css={style.athleteAllergy}>
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
                ))
              : null}
          </div>
        </div>
      )}
      {window.featureFlags['medical-alerts-side-panel'] &&
        permissions.medical.alerts?.canView && (
          <div css={styles.secondHalf}>
            <label css={style.label}>{props.t('Medical Alerts')}</label>
            {!props.athleteData?.athlete_medical_alerts?.length && (
              <div css={style.textField}>None</div>
            )}
            <div
              data-testid="AddMedicationSidePanel|AlertsSection"
              css={style.allergySection}
            >
              {hasMedicalAlerts
                ? props.athleteData.athlete_medical_alerts?.map((alert) => (
                    <div key={uuid()} css={style.athleteAllergy}>
                      <TextTag
                        content={alert.display_name}
                        backgroundColor={severityLabelColour(alert.severity)}
                        textColor={
                          alert.severity === 'severe'
                            ? colors.white
                            : colors.grey_400
                        }
                        fontSize={12}
                      />
                    </div>
                  ))
                : null}
            </div>
          </div>
        )}
    </>
  );
};

export const AllergyAlertSectionTranslated: ComponentType<Props> =
  withNamespaces()(AllergyAlertSection);
export default AllergyAlertSection;
