// @flow
import { CheckboxList } from '@kitman/components';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import type {
  CheckboxListItem,
  Props as CheckboxListProps,
} from '@kitman/components/src/CheckboxList';
import Field from '../Field';
import type { CommonFieldProps } from '../Field';

type Props = {
  ...CommonFieldProps,
  fieldKey: string,
  label?: string,
  defaultValue: Array<$PropertyType<CheckboxListItem, 'value'>>,
  items: $PropertyType<CheckboxListProps, 'items'>,
  singleSelection?: $PropertyType<CheckboxListProps, 'singleSelection'>,
};

function CheckboxListField(props: Props) {
  return (
    <Field
      fieldKey={props.fieldKey}
      defaultValue={props.defaultValue}
      isCached={props.isCached}
    >
      {({ value, onChange }) => (
        <>
          {props.label && (
            <label
              css={css`
                margin-bottom: 4px;
                font-weight: 600;
                font-size: 12px;
                color: ${colors.grey_100};
              `}
            >
              {props.label}
            </label>
          )}
          <CheckboxList
            items={props.items}
            singleSelection={props.singleSelection}
            values={value}
            onChange={onChange}
            kitmanDesignSystem
          />
        </>
      )}
    </Field>
  );
}

export default CheckboxListField;
