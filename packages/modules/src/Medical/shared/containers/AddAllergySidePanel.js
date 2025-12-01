// @flow
import { useSelector, useDispatch } from 'react-redux';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import {
  addToast,
  updateToast,
  removeToast,
  closeAddAllergySidePanel,
} from '../redux/actions';
import { AddAllergySidePanelTranslated as AddAllergySidePanel } from '../components/AddAllergySidePanel';
import {
  useGetSquadAthletesQuery,
  useGetNonMedicalAllergiesQuery,
} from '../redux/services/medical';
import useSquadAthletesSelectOptions from '../hooks/useSquadAthletesSelectOptions';

const AddAllergySidePanelContainer = (props: I18nProps<any>) => {
  const dispatch = useDispatch();
  const { permissions } = usePermissions();
  const isOpen = useSelector((state) => state.addAllergySidePanel.isOpen);
  const isAthleteSelectable = useSelector(
    (state) => state.addAllergySidePanel.initialInfo.isAthleteSelectable
  );
  const selectedAllergy = useSelector(
    (state) => state.addAllergySidePanel.selectedAllergy
  );

  const {
    data: squadAthletes = { squads: [] },
    error: squadAthletesError,
    isLoading: isSquadAthletesLoading,
  } = useGetSquadAthletesQuery(
    { athleteList: true }, // Can use minimal athlete data
    { skip: !isOpen }
  );

  const {
    data: nonMedicalAllergies = [],
    error: nonMedicalAllergiesError,
    isLoading: isNonMedicalAllergiesLoading,
  } = useGetNonMedicalAllergiesQuery(null, {
    skip: !permissions.medical.allergies.canViewNewAllergy,
  });

  const athletesSelectOptions = useSquadAthletesSelectOptions({
    isAthleteSelectable,
    squadAthletes,
  });

  const getInitialDataRequestStatus = () => {
    if (squadAthletesError || nonMedicalAllergiesError) {
      return 'FAILURE';
    }
    if (isSquadAthletesLoading || isNonMedicalAllergiesLoading) {
      return 'PENDING';
    }
    return 'SUCCESS';
  };

  return (
    <AddAllergySidePanel
      {...props}
      isOpen={isOpen}
      isAthleteSelectable={isAthleteSelectable}
      squadAthletes={athletesSelectOptions}
      selectedAllergy={selectedAllergy || null}
      nonMedicalAllergies={nonMedicalAllergies.map((allergy) => ({
        value: allergy.id,
        label: allergy.name,
        type: allergy.allergen_type,
      }))}
      initialDataRequestStatus={getInitialDataRequestStatus()}
      onSaveAllergyStart={(allergyId) => {
        dispatch(
          addToast({
            title: selectedAllergy
              ? props.t('Updating allergy..')
              : props.t('Adding allergy..'),
            status: 'LOADING',
            id: allergyId,
          })
        );
        setTimeout(() => dispatch(removeToast(allergyId)), 2000);
      }}
      onSaveAllergySuccess={(allergyId) => {
        dispatch(
          updateToast(allergyId, {
            title: selectedAllergy
              ? props.t('Allergy updated successfully')
              : props.t('Allergy added successfully'),
            status: 'SUCCESS',
          })
        );
        setTimeout(() => dispatch(removeToast(allergyId)), 3000);
      }}
      onClose={() => dispatch(closeAddAllergySidePanel())}
    />
  );
};

export default withNamespaces()(AddAllergySidePanelContainer);
