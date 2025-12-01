// @flow
import $ from 'jquery';
import type { OrganisationVariations } from '@kitman/modules/src/Medical/shared/components/RehabTab/types';

const getOrganisationVariations = (): Promise<OrganisationVariations> =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/ui/organisation_exercise_variations`,
      contentType: 'application/json',
    })
      .done(resolve)
      .fail(reject);
  });

export default getOrganisationVariations;
