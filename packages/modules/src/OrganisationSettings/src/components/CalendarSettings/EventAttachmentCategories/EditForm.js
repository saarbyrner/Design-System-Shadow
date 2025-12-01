// @flow
import { css } from '@emotion/react';
import structuredClone from 'core-js/stable/structured-clone';
import uuid from 'uuid';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { TextButton, InputText, IconButton } from '@kitman/components';
import commonStyles from '@kitman/modules/src/OrganisationSettings/src/components/CalendarSettings/utils/styles';
import { duplicateNameCustomValidation } from '@kitman/modules/src/OrganisationSettings/src/components/CalendarSettings/utils/helpers';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { NEW_CATEGORY_ID_PREFIX } from './utils/consts';
import styles from './utils/styles';
import type { OnChangingName, TableCategory } from './utils/types';

const rowContainerCSS = css([commonStyles.tableContentContainer, styles.rows]);

type Props = {
  formData: Array<TableCategory>,
  onFormChange: (Array<TableCategory>) => void,
  uniqueNames: Set<string>,
};

const EditForm = ({
  t,
  formData,
  onFormChange,
  uniqueNames,
}: I18nProps<Props>) => {
  const getNewItemId = () => `${NEW_CATEGORY_ID_PREFIX}${uuid.v4()}`;

  const updateCategoryName: OnChangingName = ({
    categoryIndex,
    newName,
  }): void => {
    const currentCategories = structuredClone(formData);
    currentCategories[categoryIndex].name = newName.trim();
    onFormChange(currentCategories);
  };

  const removeCategory = (index: number): void => {
    const currentCategories = structuredClone(formData);
    currentCategories.splice(index, 1);
    onFormChange(currentCategories);
  };

  const addNewAttachmentCategory = (): void => {
    const currentCategories = structuredClone(formData);
    currentCategories.push({
      id: getNewItemId(),
      name: '',
    });
    onFormChange(currentCategories);
  };

  return (
    <div css={rowContainerCSS}>
      <label>{t('Category Name')}</label>
      {formData.map(({ id, name }, index) => {
        return (
          <div css={commonStyles.editTableContainer} key={id}>
            <InputText
              value={name}
              kitmanDesignSystem
              autoFocus={index === formData.length - 1}
              onValidation={({ value: newName }) => {
                if (newName !== name) {
                  updateCategoryName({ categoryIndex: index, newName });
                }
              }}
              customValidations={[
                duplicateNameCustomValidation.bind(null, t, uniqueNames, name),
              ]}
              required
            />
            {id.toString().includes(NEW_CATEGORY_ID_PREFIX) && (
              <IconButton
                icon="icon-close"
                isBorderless
                isTransparent
                onClick={() => removeCategory(index)}
              />
            )}
          </div>
        );
      })}
      <div>
        <TextButton
          onClick={addNewAttachmentCategory}
          text={t('Add new category')}
          kitmanDesignSystem
          size="large"
          type="subtle"
        />
      </div>
    </div>
  );
};

export const EditFormTranslated: ComponentType<Props> =
  withNamespaces()(EditForm);

export default EditForm;
