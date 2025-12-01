// @flow

import type { Cells, Rows } from '@kitman/components/src/DataGrid/index';

import type { NewEventAttachmentCategory } from '@kitman/services/src/services/OrganisationSettings/CalendarSettings/EventAttachmentCategories/utils/types';
import { createTextCell } from '../../utils/helpers';
import type { TableCategory } from './types';
import { NEW_CATEGORY_ID_PREFIX } from './consts';

type CreateRows = {
  attachmentCategories: Array<TableCategory>,
  onChangingArchiveStatus: (category: TableCategory) => Promise<void>,
  actionText: string,
};

export const createAttachmentCategoryRows = ({
  attachmentCategories,
  actionText,
  onChangingArchiveStatus,
}: CreateRows): Rows => {
  return attachmentCategories.map((category) => {
    return {
      id: category.name,
      cells: [
        createTextCell({
          rowId: category.id.toString(),
          text: category.name,
        }),
      ],
      rowActions: [
        {
          id: 'archiveCategory',
          onCallAction: () => onChangingArchiveStatus(category),
          text: actionText,
        },
      ],
    };
  });
};

export const createAttachmentCategoryColumns = (title: string): Cells => {
  return [
    {
      id: 'eventAttachmentCategories',
      content: <div>{title}</div>,
      isHeader: true,
    },
  ];
};

type UpdatedCategoriesInfo = {
  categoriesToCreate: Array<NewEventAttachmentCategory>,
  categoriesToUpdate: Array<TableCategory>,
};

type FindCategoriesToUpdateOrCreate = {
  formData: Array<TableCategory>,
  originalCategories: Array<TableCategory>,
};

export const findCategoriesToUpdateOrCreate = ({
  formData,
  originalCategories,
}: FindCategoriesToUpdateOrCreate): UpdatedCategoriesInfo => {
  const categoriesToCreate: Array<NewEventAttachmentCategory> = [];
  const categoriesToUpdate: Array<TableCategory> = [];
  formData.forEach((categoryFormRow, index) => {
    if (categoryFormRow.id.startsWith(NEW_CATEGORY_ID_PREFIX)) {
      categoriesToCreate.push({ name: categoryFormRow.name });
    } else if (categoryFormRow.name !== originalCategories[index].name) {
      categoriesToUpdate.push(categoryFormRow);
    }
  });
  return {
    categoriesToCreate,
    categoriesToUpdate,
  };
};

export const mapCategoriesToActiveAndArchived = (
  categories: Array<TableCategory>
) => {
  const activeCategories: Array<TableCategory> = [];
  const archivedCategories: Array<TableCategory> = [];

  categories.forEach((category) => {
    if (category.archived) {
      archivedCategories.push(category);
    } else {
      activeCategories.push(category);
    }
  });
  return { archivedCategories, activeCategories };
};
