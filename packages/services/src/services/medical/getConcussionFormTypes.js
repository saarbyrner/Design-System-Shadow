// @flow
import $ from 'jquery';
import type { FormFilter } from '@kitman/modules/src/Medical/shared/types';
import type { ConcussionFormType } from '@kitman/modules/src/Medical/shared/types/medical/ConcussionFormType';

const getConcussionFormTypes = (
  filter?: FormFilter
): Promise<Array<ConcussionFormType>> => {
  let url = '/ui/concussion/forms?';
  let firstParamAdded = false;

  if (filter && filter.group) {
    url += `${firstParamAdded ? '&' : ''}group=${filter.group}`;
    firstParamAdded = true;
  }

  if (filter && filter.category) {
    url += `${firstParamAdded ? '&' : ''}category=${filter.category}`;
    firstParamAdded = true;
  }

  if (filter && filter.formType) {
    url += `${firstParamAdded ? '&' : ''}form_type=${filter.formType}`;
    firstParamAdded = true;
  }

  if (filter && filter.key) {
    url += `${firstParamAdded ? '&' : ''}key=${filter.key}`;
    firstParamAdded = true;
  }

  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url,
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getConcussionFormTypes;
