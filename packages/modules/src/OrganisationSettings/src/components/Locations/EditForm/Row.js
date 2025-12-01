// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { IconButton, InputText, Select } from '@kitman/components';
import type { Option } from '@kitman/components/src/Select';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { NEW_LOCATION_ID_PREFIX } from '../utils/consts';
import { customSelectStyles } from '../utils/styles';
import styles, { createRowEndContainerStyle } from './utils/styles';
import type {
  RowData,
  BoundDuplicateNameCustomValidation,
  OnRemovingLocationBound,
  OnChangingLocationFieldBound,
} from './utils/types';

type Props = {
  rowData: RowData,
  duplicateNameCustomValidation: BoundDuplicateNameCustomValidation,
  onChangingLocationField: OnChangingLocationFieldBound,
  onRemovingLocation: OnRemovingLocationBound,
  shouldAutoFocus: boolean,
  locationTypeOptions: Array<Option>,
  eventTypeOptions: Array<Option>,
};

const Row = ({
  t,
  onChangingLocationField,
  onRemovingLocation,
  duplicateNameCustomValidation,
  shouldAutoFocus,
  rowData: { event_types: eventTypes, location_type: locationType, name, id },
  eventTypeOptions,
  locationTypeOptions,
}: I18nProps<Props>) => {
  const isNewRow = id.includes(NEW_LOCATION_ID_PREFIX);

  const rowEndContainerStyle = createRowEndContainerStyle({ isNewRow });
  return (
    <div css={styles.singleRowContainer}>
      <InputText
        value={name}
        kitmanDesignSystem
        autoFocus={shouldAutoFocus}
        onValidation={({ value }) => {
          if (value !== name) {
            onChangingLocationField('name', value.trim());
          }
        }}
        customValidations={[duplicateNameCustomValidation.bind(null, name)]}
        required
      />
      <Select
        placeholder={t('Location type')}
        options={locationTypeOptions}
        onChange={(values) => onChangingLocationField('location_type', values)}
        value={locationType}
        customSelectStyles={customSelectStyles}
      />
      <div css={rowEndContainerStyle}>
        <Select
          placeholder={t('Related event')}
          options={eventTypeOptions}
          onChange={(values) => onChangingLocationField('event_types', values)}
          value={eventTypes}
          isMulti
          customSelectStyles={customSelectStyles}
        />
        {isNewRow && (
          <IconButton
            icon="icon-close"
            isBorderless
            isTransparent
            onClick={onRemovingLocation}
          />
        )}
      </div>
    </div>
  );
};

export const RowTranslated: ComponentType<Props> = withNamespaces()(Row);
export default Row;
