// @flow
import $ from 'jquery';
import type {
  IssueFieldConstraint,
  IssueFieldCommonKey,
  IssueFieldInjuryKey,
  IssueFieldIllnessKey,
} from '../types/medical/IssueFormField';
import MOCK_RESPONSE from './__mocks__/fieldsConfig.mock';

type ResponseFieldConfig = {
  constraint: IssueFieldConstraint,
};

export type IssueFieldsConfigResponse = {
  common_fields: {
    [IssueFieldCommonKey]: ResponseFieldConfig,
  },
  injury_fields: {
    [IssueFieldInjuryKey]: ResponseFieldConfig,
  },
  illness_fields: {
    [IssueFieldIllnessKey]: ResponseFieldConfig,
  },
};

export { MOCK_RESPONSE };

const getIssueFieldsConfig = (): Promise<IssueFieldsConfigResponse> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/fields/medical/issues/create_params',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getIssueFieldsConfig;
