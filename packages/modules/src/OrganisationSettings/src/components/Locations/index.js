/* eslint-disable max-nested-callbacks */
// @flow
import { useEffect, useMemo, useState } from 'react';
import { withNamespaces } from 'react-i18next';

import commonStyles from '@kitman/modules/src/OrganisationSettings/src/components/CalendarSettings/utils/styles';
import { blurButton } from '@kitman/modules/src/OrganisationSettings/src/components/CalendarSettings/utils/helpers';
import { pageModeEnumLike } from '@kitman/modules/src/OrganisationSettings/src/components/CalendarSettings/utils/enum-likes';
import type { PageMode } from '@kitman/modules/src/OrganisationSettings/src/components/CalendarSettings/utils/types';
import {
  getEventLocations,
  updateEventLocation,
  createEventLocation,
} from '@kitman/services/src/services/OrganisationSettings';
import SkeletonTable from '../CalendarSettings/EventTypes/Skeletons/SkeletonTable';
import { TableTranslated as Table } from './Table';
import { EditFormTranslated as EditForm } from './EditForm';
import { HeaderTranslated as Header } from './Header';
import { FiltersTranslated as Filters } from './Filters';
import {
  reduceLocationsIntoLocationNames,
  findLocationsToUpdateOrCreate,
} from './utils/helpers';
import { initialFilters } from './utils/filters';
import type {
  Locations as LocationsType,
  Location as LocationType,
  Filters as FiltersType,
  OnFiltersChange,
} from './utils/types';

const Locations = () => {
  const [pageMode, setPageMode] = useState<PageMode>('View');
  const [locations, setLocations] = useState<LocationsType>([]);
  const [formData, setFormData] = useState<LocationsType>([]);
  const [filters, setFilters] = useState<FiltersType>(initialFilters);
  const [shouldFetchData, setShouldRefetchData] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [locationNamesSet, setLocationNamesSet] = useState<Set<string>>(
    reduceLocationsIntoLocationNames([]).locationNamesSet
  );

  const [formHasDuplicateNames, setFormHasDuplicateNames] = useState(false);

  useEffect(() => {
    if (shouldFetchData) {
      setIsLoading(true);
      getEventLocations({
        isActive: pageMode !== pageModeEnumLike.Archive,
        name: filters.searchValue ? filters.searchValue : undefined,
        eventTypes: filters.eventTypes ? filters.eventTypes : undefined,
        locationTypes: filters.locationTypes
          ? filters.locationTypes
          : undefined,
      })
        .then((locationData) => {
          const translatedLocationsData = locationData.map((location) => ({
            id: location.id.toString(),
            name: location.name,
            location_type: location.location_type,
            event_types: location.event_types.map(
              (eventType) => eventType.perma_id
            ),
            active: location.active,
          }));
          setLocations(translatedLocationsData);
          setFormData(translatedLocationsData);
          setShouldRefetchData(false);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [pageMode, filters, shouldFetchData]);

  const HeaderMemoized = useMemo(() => {
    const onSavingForm = async () => {
      const { locationsToCreate, locationsToUpdate } =
        findLocationsToUpdateOrCreate(formData);

      const newLocationsPromises = locationsToCreate.map(
        ({ id, ...restLocation }) =>
          createEventLocation({ ...restLocation, active: true, public: false })
      );
      const updatedLocationsPromises = locationsToUpdate.map((location) =>
        updateEventLocation(location)
      );

      // does not set loading as false since it will be set to false after fetching the data is finished.
      // setting it as false here and then true in the useEffect will cause a (very short) UI flick of skeleton/no skeleton
      await Promise.all([...newLocationsPromises, ...updatedLocationsPromises]);
    };

    const resetForm = () => setFormData(locations);

    const changeMode = (
      pageModeToChangeTo: PageMode,
      event: SyntheticEvent<HTMLButtonElement>
    ) => {
      setPageMode(pageModeToChangeTo);
      blurButton(event);
    };

    const isSaveButtonDisabled =
      locationNamesSet.has('') || formHasDuplicateNames;

    return (
      <Header
        isSaveButtonDisabled={isSaveButtonDisabled}
        pageMode={pageMode}
        isLoading={isLoading}
        onSave={async (event) => {
          setIsLoading(true);
          changeMode(pageModeEnumLike.View, event);
          await onSavingForm();
          resetForm();
          setShouldRefetchData(true);
        }}
        onCancel={(event) => {
          resetForm();
          changeMode(pageModeEnumLike.View, event);
        }}
        onEdit={(event) => changeMode(pageModeEnumLike.Edit, event)}
        onViewArchive={(event) => {
          changeMode(pageModeEnumLike.Archive, event);
          setShouldRefetchData(true);
        }}
        onExitArchive={(event) => {
          changeMode(pageModeEnumLike.View, event);
          setShouldRefetchData(true);
        }}
      />
    );
  }, [
    pageMode,
    formData,
    formHasDuplicateNames,
    locationNamesSet,
    isLoading,
    locations,
  ]);

  const onFiltersChange: OnFiltersChange = (key, value) => {
    setFilters((prev) => {
      const localPrev = { ...prev };
      localPrev[key] = value;
      return localPrev;
    });
    setShouldRefetchData(true);
  };

  const renderContent = () => {
    switch (pageMode) {
      case pageModeEnumLike.Edit:
        return (
          <EditForm
            formData={formData}
            onFormChange={(newLocations) => {
              const {
                locationNamesSet: reducedLocationNamesSet,
                duplicatesExist,
              } = reduceLocationsIntoLocationNames(newLocations);
              setFormHasDuplicateNames(duplicatesExist);
              setLocationNamesSet(reducedLocationNamesSet);
              setFormData(newLocations);
            }}
            locationNamesSet={locationNamesSet}
          />
        );
      default:
        return isLoading ? (
          <SkeletonTable />
        ) : (
          <Table
            data={locations}
            pageMode={pageMode}
            onChangingArchiveStatus={async (locationToSend: LocationType) => {
              setIsLoading(true);
              await updateEventLocation(locationToSend);
              setShouldRefetchData(true);
            }}
          />
        );
    }
  };

  return (
    <div css={commonStyles.pageContainer}>
      {HeaderMemoized}
      {pageMode !== pageModeEnumLike.Edit && (
        <Filters filters={filters} onFiltersChange={onFiltersChange} />
      )}
      {renderContent()}
    </div>
  );
};

export const LocationsTranslated = withNamespaces()(Locations);
export default Locations;
