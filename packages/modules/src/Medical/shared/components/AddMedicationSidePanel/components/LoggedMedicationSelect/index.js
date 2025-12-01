// @flow
import { useMemo } from 'react';
import { FavoriteAsyncSelect } from '@kitman/components';
import {
  searchDispensableDrugs,
  searchDrugs,
} from '@kitman/services/src/services/medical';
import useFavorites from '@kitman/common/src/hooks/useFavorites';
import { drugTypesEnum } from '@kitman/modules/src/Medical/shared/types/medical/Medications';

// Types:
import type { MedicationSourceListName } from '@kitman/modules/src/Medical/shared/types/medical';

const customDrugsSourceListName = 'custom_drugs';
export const customDrugPrefix = 'customDrug_';

type Props = {
  medicationSourceListName: MedicationSourceListName,
  label: string,
  placeholder: string,
  onChange: Function,
  value: any,
  invalid: any,
  isDisabled: boolean,
};

const LoggedMedicationSelect = (props: Props) => {
  const { favorites, toggleFavorite } = useFavorites(
    props.medicationSourceListName,
    true
  );
  const { favorites: customFavorites, toggleFavorite: toggleCustomFavorite } =
    useFavorites(customDrugsSourceListName, true);

  const isGeneralAvailabilityOn =
    window.featureFlags['medications-general-availability'];
  const showUnlistedMeds = window.featureFlags['medical-unlisted-meds'];

  const arrayOfFavorites = useMemo(() => {
    const favoritesResults = [];
    const sourceListFavorites = favorites
      .get(props.medicationSourceListName)
      ?.map((favorite) => ({
        ...favorite,
        label: favorite.display_name || favorite.name,
        value: favorite.id,
      }));

    if (sourceListFavorites) {
      favoritesResults.push(...sourceListFavorites);
    }

    const customFavoritesWithPrefix = customFavorites
      .get(customDrugsSourceListName)
      ?.map((favorite) => ({
        ...favorite,
        // $FlowIgnore
        label: favorite.display_name || favorite.name,
        value: `${customDrugPrefix}${favorite.id}`,
        id: `${customDrugPrefix}${favorite.id}`,
        drug_type: drugTypesEnum.CustomDrug,
      }));

    if (customFavoritesWithPrefix) {
      favoritesResults.push(...customFavoritesWithPrefix);
    }

    return favoritesResults;
  }, [favorites, props.medicationSourceListName, customFavorites]);

  const checkIsFavorite = (id: number | string) => {
    if (arrayOfFavorites?.length > 0) {
      return !!arrayOfFavorites.find((element) => element.value === id);
    }
    return false;
  };

  const handleToggle = (id: string | number) => {
    const isFavorite = checkIsFavorite(id);
    const isCustomDrug =
      typeof id === 'string' && id.startsWith(customDrugPrefix);
    if (isCustomDrug && typeof id === 'string') {
      const numberId = parseInt(id.slice(customDrugPrefix.length), 10);
      toggleCustomFavorite(!!isFavorite, numberId, customDrugsSourceListName);
    } else {
      toggleFavorite(!!isFavorite, id, props.medicationSourceListName);
    }
  };

  return (
    <div key="logged_medication_select">
      <FavoriteAsyncSelect
        label={props.label}
        arrayOfFavorites={arrayOfFavorites || []}
        checkIsFavourite={checkIsFavorite}
        handleToggle={handleToggle}
        onChange={props.onChange}
        value={props.value}
        invalid={props.invalid}
        loadOptions={(searchValue, callback) => {
          if (isGeneralAvailabilityOn) {
            Promise.all([
              // $FlowIgnore[incompatible-call]
              searchDrugs(props.medicationSourceListName, searchValue),
              showUnlistedMeds
                ? searchDrugs('custom_drugs', searchValue)
                : Promise.resolve(null),
            ]).then(([drugData, unlistedMeds]) => {
              let options = [];
              if (
                drugData.drug_type ===
                  'Emr::Private::Models::FdbDispensableDrug' ||
                drugData.drug_type === 'Emr::Private::Models::NhsDmdDrug'
              ) {
                const drugs = drugData.drugs;
                options = drugs.map((drug) => {
                  // $FlowIgnore
                  const label: string = drug.display_name || drug.name;
                  return {
                    id: drug.id,
                    label,
                    value: drug.id,
                    drug_type: drugData.drug_type,
                  };
                });
              }
              if (
                unlistedMeds?.drug_type === 'Emr::Private::Models::CustomDrug'
              ) {
                options = options.concat(
                  unlistedMeds.drugs.map((drug) => ({
                    id: `${customDrugPrefix}${drug.id}`,
                    label: drug.display_name || drug.name,
                    value: drug.id,
                    drug_type: drugTypesEnum.CustomDrug,
                  }))
                );
              }

              options.sort((a, b) => {
                const isFavA = checkIsFavorite(a.id);
                const isFavB = checkIsFavorite(b.id);
                if (isFavA === isFavB) {
                  return a.label.localeCompare(b.label);
                }
                return isFavA ? -1 : 1;
              });

              callback([
                {
                  label: 'Medications',
                  options,
                },
              ]);
            });
          } else {
            searchDispensableDrugs(searchValue).then((drugData) => {
              callback([
                {
                  label: 'Medications',
                  options: drugData.map((drug) => ({
                    ...drug,
                    value: drug.dispensable_drug_id, // NOTE: FavoriteAsyncSelect will use id as the value
                    label: drug.name,
                  })),
                },
              ]);
            });
          }
        }}
        placeholder={props.placeholder}
        isDisabled={props.isDisabled}
        kitmanDesignSystem
        appendToBody
        cacheOptions={false}
      />
    </div>
  );
};

export default LoggedMedicationSelect;
