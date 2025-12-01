// @flow
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { CurrentUserData } from '@kitman/services/src/services/getCurrentUser';
import type { IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';
import type { Organisation } from '@kitman/services/src/services/getOrganisation';
import type { OrderProviderType } from '@kitman/services/src/services/medical/getOrderProviders';

const getEnvironmentSubdomain = (): string => {
  const ambraLinkEnvironment = window.location.hostname.includes('staging')
    ? 'staging'
    : 'production';
  return ambraLinkEnvironment === 'staging' ? 'nfl-uat' : 'nfl';
};

/*
    in order to ensure the ambra_configuration is mapped
    to the correct organisation, checking the org ids
    match for both API calls
  */
const orgNamespace = (currentOrganisation: Organisation): string => {
  if (Array.isArray(currentOrganisation?.ambra_configurations)) {
    const orgAmbraNamespace =
      currentOrganisation.ambra_configurations.find(
        (org) => currentOrganisation.id === org.organisation_id && !org.tryout
      )?.namespace || '';
    return orgAmbraNamespace;
  }

  return '';
};

const tryoutUploadNamespace = (currentOrganisation: Organisation): string => {
  if (Array.isArray(currentOrganisation?.ambra_configurations)) {
    return (
      currentOrganisation.ambra_configurations.find((org) => org.tryout)
        ?.upload_uuid || ''
    );
  }

  return '';
};

const orgUploadNamespace = (currentOrganisation: Organisation): string => {
  if (Array.isArray(currentOrganisation?.ambra_configurations)) {
    const orgAmbraUploadNamespace =
      currentOrganisation.ambra_configurations.find(
        (org) => currentOrganisation.id === org.organisation_id && !org.tryout
      )?.upload_uuid || '';
    return orgAmbraUploadNamespace;
  }

  return '';
};

/*
        tryout namespace has no org_id so only way to ensure
        we're grabbing the the correct namespace is to
        check for the team_name
       */

const tryoutNamespace = (currentOrganisation: Organisation): string => {
  if (Array.isArray(currentOrganisation?.ambra_configurations)) {
    const tryoutAmbraNamespace =
      currentOrganisation.ambra_configurations.find((org) => org.tryout)
        ?.namespace || '';
    return tryoutAmbraNamespace;
  }
  return '';
};

const getNamespace = ({
  athleteData,
  currentOrganisation,
  athleteExternalId,
  isUploader,
}: {
  athleteData: AthleteData | null,
  currentOrganisation: Organisation,
  athleteExternalId: string | null,
  isUploader: boolean,
}): string => {
  /**
   *     the athlete is a 'trial' player if:
   *      1) transfer type is 'trial
   *      2) the current date is after the "joined at" date
   *      3) the current date is before the "left at" date
   *
   *       confusing thing to know is that the "left at" date is
   *        set when the athlete becomes a 'trial' player.
   *
   */

  const athleteIsTrialPlayer =
    athleteData?.org_last_transfer_record?.transfer_type.toLowerCase() ===
      'trial' &&
    athleteData?.org_last_transfer_record?.joined_at &&
    new Date(athleteData.org_last_transfer_record.joined_at).valueOf() <
      new Date().valueOf() &&
    athleteData?.org_last_transfer_record?.left_at &&
    new Date(athleteData.org_last_transfer_record.left_at).valueOf() >
      new Date().valueOf();

  if (athleteExternalId && athleteIsTrialPlayer) {
    if (isUploader) {
      return tryoutUploadNamespace(currentOrganisation);
    }
    return tryoutNamespace(currentOrganisation);
  }

  if (isUploader) {
    return orgUploadNamespace(currentOrganisation);
  }

  return orgNamespace(currentOrganisation);
};

export const getPACSUploaderLink = (
  athleteData: AthleteData | null,
  athleteExternalId: string | null,
  currentOrganisation: Organisation,
  currentUser: CurrentUserData
): string => {
  const getUploaderEndingPath = () => {
    if (athleteData && athleteExternalId) {
      // if athlete data exists we know
      // we're on athlete or issue level
      const { lastname, firstname, date_of_birth: dateOfBirth } = athleteData;

      const transformedDate = new Date(dateOfBirth)
        .toISOString()
        .replace(/T.*/, '')
        .split('-')
        .join('');

      return `&integration_key=${lastname.toUpperCase()}^${firstname.toUpperCase()}:${athleteExternalId}:${transformedDate}`;
    }

    return '';
  };

  if (currentUser) {
    // can only use these links if current user exists. otherwise default to org level
    const { email } = currentUser;

    return encodeURI(
      `https://${getEnvironmentSubdomain()}.ambrahealth.com/api/v3/link/redirect?uuid=${getNamespace(
        {
          athleteData,
          currentOrganisation,
          athleteExternalId,
          isUploader: true,
        }
      )}&email_address=${email}&suppress_notification=1${getUploaderEndingPath()}`
    );
  }

  // this is the default org level Ambra link
  return `https://${getEnvironmentSubdomain()}.ambrahealth.com/api/v3/link/redirect?uuid=${getNamespace(
    { athleteData, currentOrganisation, athleteExternalId, isUploader: true }
  )}&suppress_notification=1`;
};

export const getPACSViewerLink = (
  issue: IssueOccurrenceRequested,
  athleteData: AthleteData | null,
  athleteExternalId: string | null,
  currentOrganisation: Organisation
) => {
  /**
   * if we're on the ISSUE level (issue exists), we want to ensure
   * Ambra configuration UUIDs exist before constructing the link
   * for both the external identified and the custom_field
   * otherwise default to org/athlete level link (line 255)
   */
  const customField: string = issue?.ambra_reason_link?.custom_field
    ? issue.ambra_reason_link.custom_field
    : '';

  if (issue && customField && issue.external_identifier && athleteData) {
    return `https://${getEnvironmentSubdomain()}.ambrahealth.com/api/v3/session/sso/start?namespace_id=${getNamespace(
      { athleteData, currentOrganisation, athleteExternalId, isUploader: false }
    )}&customfield-${customField}=${issue.external_identifier}`;
  }

  // viewer link is the same for issue and athlete level
  const endingPath = athleteExternalId
    ? `&patient_id=${athleteExternalId}`
    : '';

  return `https://${getEnvironmentSubdomain()}.ambrahealth.com/api/v3/session/sso/start?namespace_id=${getNamespace(
    { athleteData, currentOrganisation, athleteExternalId, isUploader: false }
  )}${endingPath}`;
};
export const getProviderOptions = (
  orderProviders: OrderProviderType
): Array<{ value: number, label: string }> => {
  return orderProviders?.staff_providers && orderProviders?.location_providers
    ? [
        ...orderProviders.staff_providers,
        ...orderProviders.location_providers,
      ].map(({ fullname, sgid }) => {
        return { value: sgid, label: fullname };
      })
    : [];
};
