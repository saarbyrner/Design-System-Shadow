// @flow
import { Select } from '@kitman/components';
import withServiceSuppliedOptions from '@kitman/components/src/Select/hoc/withServiceSuppliedOptions';
import { getSquads } from '@kitman/services';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { CommonFieldProps } from '../Field';
import Field from '../Field';

type Props = {
  ...CommonFieldProps,
  label?: string,
  isMulti?: boolean,
};

const SquadSelect = withServiceSuppliedOptions(Select, getSquads, {
  dataId: 'id',
  mapToOptions: (squadOptions) =>
    squadOptions.map((squad) => ({ label: squad.name, value: squad.id })),
});

function SquadField(props: I18nProps<Props>) {
  const { t: translate, label, ...commonProps } = props;
  const defaultLabel = translate('Squads');

  return (
    <Field {...commonProps}>
      {({ onChange, value }) => (
        <SquadSelect
          label={label || defaultLabel}
          value={value}
          onChange={onChange}
          isMulti={props.isMulti}
          invalid={false}
          isLoading
        />
      )}
    </Field>
  );
}

export const SquadFieldTranslated: ComponentType<Props> =
  withNamespaces()(SquadField);
export default SquadField;
