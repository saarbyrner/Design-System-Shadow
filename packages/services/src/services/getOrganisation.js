// @flow
import $ from 'jquery';
import type { CodingSystemKey } from '@kitman/common/src/types/Coding';

import type { Attachment } from '@kitman/modules/src/Medical/shared/types';

export type OrganisationCodingSystem = {
  id: number,
  key: string,
  name: string,
};
export type Organisation = {
  association_admin?: boolean,
  coding_system?: OrganisationCodingSystem,
  coding_system_id?: number,
  coding_system_key: CodingSystemKey,
  logo_full_path: string,
  id: number,
  address?: {
    id: number,
    line1: string,
    line2: string,
    line3: string,
    city: string,
    state: string,
    zipcode: string,
    primary: number,
    country_id: number,
    user_id: number,
    created_at: string,
    updated_at: string,
    organisation_id: string,
  },
  ambra_configurations?: Array<{
    team_name: string,
    namespace: string,
    organisation_id: number,
    upload_uuid: string,
    tryout: boolean,
  }>,
  attachments?: ?Array<Attachment>,
  benchmark_reporting?: boolean,
  extended_attributes?: {
    berkley_policy_number?: string,
  },
  handle?: ?string,
  last_privacy_policy?: ?any,
  locale?: ?string,
  localisation_id?: ?number,
  logo?: ?string,
  logo_path?: ?string,
  name?: ?string,
  redox_orderable?: ?boolean,
  shortname?: ?string,
  sport_id?: ?number,
  timezone?: ?string,
  tso_application?: {
    api_app_name: string,
    base_api_url: string,
    base_web_url: string,
    id: number,
    name: string,
  },
  supervised_by?: {
    id: number,
    handle: string,
  },
  ip_for_government?: boolean,
  organisation_type?: string,
  association_name?: string,
};

const getOrganisation = (organisationId?: number): Promise<Organisation> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: organisationId
        ? `/ui/organisation/organisations/${organisationId}`
        : '/ui/organisation/organisations/current',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getOrganisation;
