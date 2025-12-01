// @flow
import { useContext } from 'react';
import { css } from '@emotion/react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { LineLoader } from '@kitman/components';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import PermissionsContext from '../../../../../../common/src/contexts/PermissionsContext';
import SideBar from './SideBar';
import AthleteSection from './AthleteSection';
import type { EmergencyContact } from '../../../../../../services/src/services/getAthleteData';
import type { RequestStatus } from '../../types';

type Props = {
  athleteId?: number,
  athleteData: AthleteData,
  athleteDataRequestStatus: RequestStatus,
  country: string,
  height: string,
  weight: string,
  emergencyContacts?: Array<EmergencyContact>,
};

const style = {
  athleteWrapper: css`
    & section:first-of-type {
      margin: 0 !important;
      margin: unset !important;
    }
    & section:last-of-type {
      padding-bottom: 24px;
    }
    margin-top: 16px;
    border: 1px solid #e8eaed;
  `,
  tab: css`
    border-radius: 3px;
    display: flex;
  `,
  sectionLoader: css`
    bottom: 0;
    height: 4px;
    left: 0;
    overflow: hidden;
    position: absolute;
    width: 100%;
  `,
  mainContent: css`
    flex: 1;
    margin-right: 16px;
    padding-bottom: 24px;
    & div:first-of-type {
      margin-top: 0;
    }
  `,
  sidebar: css`
    max-width: 434px;
    min-width: 434px;
  `,
};

const AthleteDetailsTab = (props: I18nProps<Props>) => {
  const permissions = useContext(PermissionsContext);
  const {
    permissions: {
      settings: { canViewSettingsEmergencyContacts } = {},
      settings: { canViewSettingsInsurancePolicies } = {},
    } = {},
  } = permissions;

  if (props.athleteDataRequestStatus === 'PENDING') {
    return (
      <div
        css={style.sectionLoader}
        data-testid="AthleteDetailsLoader|lineLoader"
      >
        <LineLoader />
      </div>
    );
  }

  return (
    <div css={style.tab} data-testid="AthleteDetailsTab">
      <div css={style.mainContent}>
        <div css={style.athleteWrapper}>
          <AthleteSection
            {...props}
            title={props.t('Athlete details')}
            subTitle={props.t('Demographics')}
            addressList={
              props?.athleteData?.addresses?.length > 0
                ? props?.athleteData?.addresses
                : []
            }
            items={[
              {
                label: props.t('First name'),
                value: props.athleteData?.firstname,
              },
              {
                label: props.t('Last name'),
                value: props.athleteData?.lastname,
              },
              {
                label: props.t('Date of birth'),
                value: props.athleteData?.date_of_birth,
              },
              { label: props.t('Country'), value: props.athleteData?.country },
              {
                label: props.t('Height'),
                value: props.athleteData?.height ?? '',
              },
            ]}
            emergencyContacts={[]}
            squads={[]}
          />
          <AthleteSection
            {...props}
            title=""
            subTitle={props.t('Sport details')}
            items={[
              {
                label: props.t('position'),
                value: props.athleteData?.position,
              },
            ]}
            emergencyContacts={[]}
            squads={props.athleteData?.squad_names}
          />
        </div>
        <div css={style.athleteWrapper}>
          <AthleteSection
            {...props}
            title={props.t('Contact details')}
            subTitle={props.t('Player contact information')}
            items={[
              { label: props.t('Email'), value: props.athleteData?.email },
              {
                label: props.t('Phone number'),
                value: props.athleteData?.mobile_number,
              },
            ]}
            emergencyContacts={[]}
            squads={[]}
          />
          {canViewSettingsEmergencyContacts &&
            props.athleteData?.emergency_contacts?.length > 0 && (
              <AthleteSection
                {...props}
                title=""
                subTitle={props.t('Emergency contact information')}
                emergencyContacts={props.athleteData?.emergency_contacts}
                items={[]}
                squads={[]}
              />
            )}
        </div>
      </div>
      {window.featureFlags['athlete-insurance-details'] &&
        canViewSettingsInsurancePolicies &&
        props?.athleteData?.insurance_policies?.length > 0 && (
          <div css={style.sidebar}>
            <SideBar {...props} />
          </div>
        )}
    </div>
  );
};

export const AthleteDetailsTabTranslated: ComponentType<Props> =
  withNamespaces()(AthleteDetailsTab);
export default AthleteDetailsTab;
