// @flow
import { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import type { Translation } from '@kitman/common/src/types/i18n';
import { DataGrid } from '@kitman/components';
import {
  getEventAttachmentCategories,
  updateEventAttachmentCategory,
  createEventAttachmentCategory,
} from '@kitman/services/src/services/OrganisationSettings';
import type { PageMode } from '@kitman/modules/src/OrganisationSettings/src/components/CalendarSettings/utils/types';
import { pageModeEnumLike } from '@kitman/modules/src/OrganisationSettings/src/components/CalendarSettings/utils/enum-likes';
import { createTableStyles } from '../utils/styles';
import {
  createAttachmentCategoryRows,
  createAttachmentCategoryColumns,
  findCategoriesToUpdateOrCreate,
  mapCategoriesToActiveAndArchived,
} from './utils/helpers';
import { blurButton } from '../utils/helpers';
import { EditFormTranslated as EditForm } from './EditForm';
import { HeaderTranslated as Header } from './Header';
import SkeletonTable from '../EventTypes/Skeletons/SkeletonTable';
import type { TableCategory } from './utils/types';

const tableStyles = createTableStyles({ includeCheckboxes: false });

const EventAttachmentCategories = ({ t }: { t: Translation }) => {
  const [pageMode, setPageMode] = useState<PageMode>(pageModeEnumLike.View);
  const [activeCategories, setActiveCategories] = useState<
    Array<TableCategory>
  >([]);
  const [archivedCategories, setArchivedCategories] = useState<
    Array<TableCategory>
  >([]);
  const [formData, setFormData] = useState<Array<TableCategory>>([]);
  const [shouldFetchData, setShouldRefetchData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [doesFormHaveDuplicateNames, setDoesFormHaveDuplicateNames] =
    useState(false);
  const [uniqueNames, setUniqueNames] = useState<Set<string>>(new Set());

  const resetForm = () =>
    setFormData(activeCategories.filter(({ archived }) => !archived));

  const reduceCategoriesToSet = (categories: Array<TableCategory>) =>
    new Set(categories.map((category) => category.name.toLocaleLowerCase()));

  useEffect(() => {
    if (shouldFetchData) {
      setIsLoading(true);
      getEventAttachmentCategories()
        .then((categories) => {
          if (categories) {
            const mappedCategories: Array<TableCategory> = categories.map(
              ({ id, ...restCategory }) => ({
                ...restCategory,
                // mapping to string to facilitate using a string ID for the newly created categories in the form
                id: id.toString(),
              })
            );
            setUniqueNames(reduceCategoriesToSet(mappedCategories));

            const {
              activeCategories: activeCategoriesLocal,
              archivedCategories: archivedCategoriesLocal,
            } = mapCategoriesToActiveAndArchived(mappedCategories);
            setArchivedCategories(archivedCategoriesLocal);
            setActiveCategories(activeCategoriesLocal);
            setFormData(activeCategoriesLocal);
          }
          setShouldRefetchData(false);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [shouldFetchData]);

  const changeMode = (
    pageModeToChangeTo: PageMode,
    event: SyntheticEvent<HTMLButtonElement>
  ) => {
    setPageMode(pageModeToChangeTo);
    blurButton(event);
  };

  const onSavingForm = async () => {
    setIsLoading(true);
    const { categoriesToCreate, categoriesToUpdate } =
      findCategoriesToUpdateOrCreate({
        formData,
        originalCategories: activeCategories,
      });

    const newCategoriesPromises = categoriesToCreate.map((category) =>
      createEventAttachmentCategory(category)
    );

    const updatedCategoriesPromises = categoriesToUpdate.map(
      ({ id, ...restCategory }) =>
        updateEventAttachmentCategory({ id: +id, ...restCategory })
    );

    // does not set loading as false since it will be set to false after fetching the data is finished.
    // setting it as false here and then true in the useEffect will cause a (very short) UI flick of skeleton/no skeleton
    await Promise.all([...newCategoriesPromises, ...updatedCategoriesPromises]);
  };

  const isSaveButtonDisabled =
    doesFormHaveDuplicateNames || uniqueNames.has('');

  const renderHeader = () => {
    return (
      <Header
        isSaveButtonDisabled={isSaveButtonDisabled}
        isLoading={isLoading}
        pageMode={pageMode}
        onSave={async (event) => {
          changeMode(pageModeEnumLike.View, event);
          await onSavingForm();
          resetForm();
          setShouldRefetchData(true);
        }}
        onCancel={(event) => {
          resetForm();
          changeMode(pageModeEnumLike.View, event);
        }}
        onEdit={(event) => {
          changeMode(pageModeEnumLike.Edit, event);
        }}
        onViewArchive={(event) => {
          changeMode(pageModeEnumLike.Archive, event);
        }}
        onExitArchive={(event) => changeMode(pageModeEnumLike.View, event)}
      />
    );
  };

  const renderContent = () => {
    switch (pageMode) {
      case pageModeEnumLike.Edit:
        return (
          <EditForm
            formData={formData}
            onFormChange={(categories) => {
              const numberOfCategories =
                categories.length + archivedCategories.length;
              const categoryNamesSet = reduceCategoriesToSet(
                categories.concat(archivedCategories)
              );
              setDoesFormHaveDuplicateNames(
                categoryNamesSet.size < numberOfCategories
              );
              setUniqueNames(categoryNamesSet);
              setFormData(categories);
            }}
            uniqueNames={uniqueNames}
          />
        );
      default: {
        const isArchiveMode = pageMode === pageModeEnumLike.Archive;
        const categoriesToShow = isArchiveMode
          ? archivedCategories
          : activeCategories;

        const columnTitle = isArchiveMode
          ? t('Archived Category Name')
          : t('Category Name');
        return isLoading ? (
          <SkeletonTable />
        ) : (
          <main css={tableStyles}>
            <DataGrid
              columns={createAttachmentCategoryColumns(columnTitle)}
              rows={createAttachmentCategoryRows({
                actionText: isArchiveMode ? t('Unarchive') : t('Archive'),
                attachmentCategories: categoriesToShow,
                onChangingArchiveStatus: async (category: TableCategory) => {
                  const { archived, id, ...restCategory } = category;
                  setIsLoading(true);
                  await updateEventAttachmentCategory({
                    ...restCategory,
                    id: +id,
                    archived: !archived,
                  });
                  setShouldRefetchData(true);
                },
              })}
            />
          </main>
        );
      }
    }
  };

  return (
    <>
      {renderHeader()}
      {renderContent()}
    </>
  );
};

export const EventAttachmentCategoriesTranslated = withNamespaces()(
  EventAttachmentCategories
);

export default EventAttachmentCategories;
