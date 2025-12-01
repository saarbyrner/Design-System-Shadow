// @flow
import { Select } from '@kitman/components';
import withServiceSuppliedOptions from '@kitman/components/src/Select/hoc/withServiceSuppliedOptions';
import { getMedicalIssues } from '@kitman/services';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { CommonFieldProps } from '../Field';
import Field from '../Field';

type Props = {
  ...CommonFieldProps,
  label?: string,
  isMulti?: boolean,
  performServiceCall: boolean,
};

const PathologySelect = withServiceSuppliedOptions(
  Select,
  () =>
    getMedicalIssues({
      codingSystem: 'Clinical Impressions',
      onlyActiveCodes: false,
    }),
  {
    dataId: 'CI_pathologies',
    mapToOptions: (pathologyOptions) => {
      return pathologyOptions.map((pathologyData) => ({
        label: `${pathologyData.code} ${pathologyData.pathology}`,
        value: pathologyData.code,
      }));
    },
  }
);

function CIPathologiesField(props: I18nProps<Props>) {
  const { t: translate, label, ...commonProps } = props;
  const defaultLabel = translate('CI Code');

  return (
    <Field {...commonProps}>
      {({ onChange, value }) => (
        <PathologySelect
          label={label || defaultLabel}
          value={value}
          onChange={onChange}
          isMulti={props.isMulti}
          invalid={false}
          isLoading
          performServiceCall={props.performServiceCall}
        />
      )}
    </Field>
  );
}

export const CIPathologiesFieldTranslated: ComponentType<Props> =
  withNamespaces()(CIPathologiesField);
export default CIPathologiesField;
