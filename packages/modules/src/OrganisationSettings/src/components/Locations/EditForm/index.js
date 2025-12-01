/* eslint-disable react/jsx-no-bind */
// @flow
import structuredClone from 'core-js/stable/structured-clone';
import uuid from 'uuid';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import { TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { NEW_LOCATION_ID_PREFIX } from '../utils/consts';
import styles from './utils/styles';
import { RowTranslated as Row } from './Row';
import { FormHeaderTranslated as FormHeader } from './FormHeader';
import {
  createEventTypeOptions,
  createLocationTypeOptions,
} from '../utils/helpers';
import { singleRowClassname } from './utils/consts';
import type { Locations } from '../utils/types';
import { duplicateNameCustomValidation } from '../../CalendarSettings/utils/helpers';

type Props = {
  formData: Locations,
  onFormChange: (newFormData: Locations) => void,
  locationNamesSet: Set<string>,
};

const EditForm = ({
  formData,
  onFormChange,
  locationNamesSet,
  t,
}: I18nProps<Props>) => {
  const { data: permissions } = useGetPermissionsQuery();
  const getNewItemId = () => `${NEW_LOCATION_ID_PREFIX}${uuid.v4()}`;

  const addLocation = () => {
    const clonedFormData = structuredClone(formData);
    clonedFormData.push({
      name: '',
      id: getNewItemId(),
      event_types: [],
      location_type: null,
      modified: true,
    });
    onFormChange(clonedFormData);
  };

  const changeLocationField = (
    locationIndex: number,
    fieldName: string,
    newName: string | Array<string>
  ) => {
    const clonedFormData = structuredClone(formData);
    clonedFormData[locationIndex][fieldName] = newName;
    clonedFormData[locationIndex].modified = true;
    onFormChange(clonedFormData);
  };

  const removeNewLocation = (index: number) => {
    const clonedFormData = structuredClone(formData);
    clonedFormData.splice(index, 1);
    onFormChange(clonedFormData);
  };

  const eventTypeOptions = createEventTypeOptions(t);
  const locationTypeOptions = createLocationTypeOptions(t);

  const boundDuplicateNameCustomValidation = duplicateNameCustomValidation.bind(
    null,
    t,
    locationNamesSet
  );

  return (
    <div css={styles.rowsContainer}>
      <FormHeader />
      {formData.map((location, index) => {
        const locationId = location.id;
        return (
          <div key={locationId} className={singleRowClassname}>
            <Row
              rowData={location}
              duplicateNameCustomValidation={boundDuplicateNameCustomValidation}
              shouldAutoFocus={
                locationId.startsWith(NEW_LOCATION_ID_PREFIX) &&
                index === formData.length - 1
              }
              onChangingLocationField={changeLocationField.bind(null, index)}
              onRemovingLocation={removeNewLocation.bind(null, index)}
              eventTypeOptions={eventTypeOptions}
              locationTypeOptions={locationTypeOptions}
            />
          </div>
        );
      })}
      <div>
        {permissions.eventLocationSettings.canCreateEventLocations && (
          <TextButton
            size="large"
            type="subtle"
            text={t('Add New Location')}
            kitmanDesignSystem
            onClick={addLocation}
          />
        )}
      </div>
    </div>
  );
};

export const EditFormTranslated: ComponentType<Props> =
  withNamespaces()(EditForm);
export default EditForm;
