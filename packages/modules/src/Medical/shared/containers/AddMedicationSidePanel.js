/* eslint-disable no-nested-ternary */
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AthleteConstraints from '@kitman/modules/src/Medical/shared/components/AthleteConstraints';
import {
  useGetAthleteDataQuery,
  useGetMedicationListSourcesQuery,
  useGetDocumentNoteCategoriesQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import {
  addToast,
  updateToast,
  removeToast,
  closeAddMedicationSidePanel,
} from '../redux/actions';
import { AddMedicationSidePanelTranslated as AddMedicationSidePanel } from '../components/AddMedicationSidePanel';
import {
  useGetSquadAthletesQuery,
  useGetStockMedicationsQuery,
  useGetOrderProvidersQuery,
} from '../redux/services/medical';
import useSquadAthletesSelectOptions from '../hooks/useSquadAthletesSelectOptions';

const AddMedicationSidePanelContainer = (props) => {
  const dispatch = useDispatch();
  const [athleteId, setAthleteId] = useState(props.athleteId || null);
  const isOpen = useSelector((state) => state.addMedicationSidePanel?.isOpen);
  const isAthleteSelectable = useSelector(
    (state) => state.addMedicationSidePanel?.initialInfo.isAthleteSelectable
  );

  const {
    data: squadAthletes = { squads: [] },
    error: squadAthletesError,
    isLoading: isSquadAthletesLoading,
  } = useGetSquadAthletesQuery({ skip: !isOpen }); // Can use minimal athlete data

  const {
    data: athleteData,
    error: getAthleteDataError,
    isLoading: isAthleteDataLoading,
  } = useGetAthleteDataQuery(props.athleteId, {
    skip: !props.athleteId,
  });

  const {
    data: orderProviders = [],
    error: orderProvidersError,
    isLoading: isOrderProvidersLoading,
  } = useGetOrderProvidersQuery(
    { activeUsersOnly: true, npi: true, onlyDefaultLocation: true },
    { skip: !isOpen }
  );

  const staffProviders =
    orderProviders?.staff_providers?.map(({ fullname, sgid }) => ({
      label: fullname,
      value: sgid,
    })) || [];

  const locationProviders =
    orderProviders?.location_providers?.map(({ fullname, sgid }) => ({
      label: fullname,
      value: sgid,
    })) || [];

  const otherProviders =
    orderProviders?.other_providers?.map(
      ({ fullname, optional_text: requiresText }) => ({
        label: fullname,
        requiresText,
        value: 'other',
      })
    ) || [];

  const medicationProviders = {
    staffProviders,
    locationProviders,
    otherProviders,
  };

  const {
    data: medicationListSources = null,
    error: medicationListSourcesError,
    isLoading: isMedicationListSourcesLoading,
  } = useGetMedicationListSourcesQuery(null, { skip: !isOpen });

  const {
    data: medicalAttachmentCategories = [],
    error: medicalAttachmentCategoriesError,
    isLoading: isMedicalAttachmentCategoriesLoading,
  } = useGetDocumentNoteCategoriesQuery(null, { skip: !isOpen });

  const {
    data: stockMedications = [],
    error: stockMedicationsError,
    isLoading: isStockMedicationsLoading,
  } = useGetStockMedicationsQuery(null, { skip: !isOpen });

  const athletesSelectOptions = useSquadAthletesSelectOptions({
    isAthleteSelectable,
    squadAthletes,
  });

  const sortedStockMedications =
    stockMedications &&
    stockMedications.stock_drugs &&
    stockMedications.stock_drugs.map((drug) => ({
      value: drug.drug?.id,
      stockId: drug.id,
      label: drug.drug?.name,
      dispensable_drug_id: drug.drug?.dispensable_drug_id,
      drug_type: drug.drug_type,
    }));

  const getInitialDataRequestStatus = () => {
    if (
      squadAthletesError ||
      getAthleteDataError ||
      orderProvidersError ||
      stockMedicationsError ||
      medicationListSourcesError ||
      medicalAttachmentCategoriesError
    ) {
      return 'FAILURE';
    }
    if (
      isSquadAthletesLoading ||
      isAthleteDataLoading ||
      isOrderProvidersLoading ||
      isStockMedicationsLoading ||
      isMedicationListSourcesLoading ||
      isMedicalAttachmentCategoriesLoading
    ) {
      return 'PENDING';
    }
    return 'SUCCESS';
  };

  const prescriptionsCategory = medicalAttachmentCategories.find(
    (entry) => entry.name === 'Prescriptions'
  );
  const defaultAttachmentCategoryIds = prescriptionsCategory
    ? [prescriptionsCategory.id]
    : [];

  return (
    <AthleteConstraints athleteId={athleteId}>
      {({ organisationStatus }) => (
        <AddMedicationSidePanel
          {...props}
          athleteConstraints={{
            organisationStatus,
          }}
          isOpen={isOpen}
          isPastAthlete={!!athleteData?.org_last_transfer_record?.left_at}
          athleteData={athleteData}
          isAthleteSelectable={isAthleteSelectable}
          squadAthletes={athletesSelectOptions}
          stockMedications={sortedStockMedications || []}
          medicationListSources={medicationListSources}
          defaultAttachmentCategoryIds={defaultAttachmentCategoryIds}
          medicationProviders={medicationProviders}
          initialDataRequestStatus={getInitialDataRequestStatus()}
          onSaveMedicationStart={(alertId) => {
            dispatch(
              addToast({
                title: props.isEditing
                  ? props.t('Updating medication...')
                  : props.actionType === 'Dispense'
                  ? props.t('Dispensing medication...')
                  : props.t('Logging medication'),
                status: 'LOADING',
                id: alertId,
              })
            );
            setTimeout(() => dispatch(removeToast(alertId)), 2000);
          }}
          onSaveMedicationSuccess={(alertId, links) => {
            dispatch(
              updateToast(alertId, {
                title: props.isEditing
                  ? props.t('Medication updated successfully')
                  : props.actionType === 'Dispense'
                  ? props.t('Medication dispensed successfully')
                  : props.t('Medication logged successfully'),
                status: 'SUCCESS',
                links: links || undefined,
              })
            );
            setTimeout(() => dispatch(removeToast(alertId)), 3000);
          }}
          onDeleteMedicationConfigStart={(alertId) => {
            dispatch(
              addToast({
                title: props.t('Deleting medication configuration...'),
                status: 'LOADING',
                id: alertId,
              })
            );
            setTimeout(() => dispatch(removeToast(alertId)), 2000);
          }}
          onDeleteMedicationConfigSuccess={(alertId) => {
            dispatch(
              updateToast(alertId, {
                title: `${props.t(
                  'Medication configuration deleted successfully'
                )}`,
                status: 'SUCCESS',
              })
            );
            setTimeout(() => dispatch(removeToast(alertId)), 3000);
          }}
          onDeleteMedicationConfigFailure={(alertId) => {
            dispatch(
              updateToast(alertId, {
                title: `${props.t(
                  'Medication configuration favorite failed to delete'
                )}`,
                status: 'ERROR',
              })
            );
            setTimeout(() => dispatch(removeToast(alertId)), 3000);
          }}
          onClose={() => {
            dispatch(closeAddMedicationSidePanel());
          }}
          setAthleteId={setAthleteId}
        />
      )}
    </AthleteConstraints>
  );
};

export default AddMedicationSidePanelContainer;
