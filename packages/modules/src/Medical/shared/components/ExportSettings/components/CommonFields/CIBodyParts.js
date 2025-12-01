// @flow
import { Select } from '@kitman/components';
import withServiceSuppliedOptions from '@kitman/components/src/Select/hoc/withServiceSuppliedOptions';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import { getClinicalImpressionsBodyAreas } from '@kitman/services';
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

const CIBodyPartSelect = withServiceSuppliedOptions(
  Select,
  getClinicalImpressionsBodyAreas,
  {
    dataId: 'CI_pathologies',
    mapToOptions: defaultMapToOptions,
  }
);

function CIBodyPartsField(props: I18nProps<Props>) {
  const { t: translate, label, ...commonProps } = props;
  const defaultLabel = translate('Body Part');

  return (
    <Field {...commonProps}>
      {({ onChange, value }) => (
        <CIBodyPartSelect
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

export const CIBodyPartsFieldTranslated: ComponentType<Props> =
  withNamespaces()(CIBodyPartsField);
export default CIBodyPartsField;
