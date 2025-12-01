// @flow
import { useEffect, useState, useMemo } from 'react';
import { FavoriteSelect } from '@kitman/components';
import type { MedicationSourceListName } from '@kitman/modules/src/Medical/shared/types/medical';
import useFavorites from '@kitman/common/src/hooks/useFavorites';

type Props = {
  medicationSourceListName: MedicationSourceListName,
  label: string,
  placeholder: string,
  onChange: Function,
  value: any,
  invalid: boolean,
  isDisabled: boolean,
  stockMedicationOptions: Array<any>,
};

const DispensedMedicationSelect = (props: Props) => {
  const { favorites, toggleFavorite } = useFavorites(
    props.medicationSourceListName,
    true
  );
  const [arrayOfRemainders, setArrayOfRemainders] = useState([]);

  const arrayOfFavorites = useMemo(
    () =>
      favorites
        .get(props.medicationSourceListName)
        ?.filter((favorite) =>
          props.stockMedicationOptions?.some(
            (option) => option.value === favorite.id
          )
        )
        ?.map((favorite) => ({
          isFavorite: true,
          label: favorite.name,
          value: favorite.id,
          ...favorite,
        })),
    [favorites, props.medicationSourceListName, props.stockMedicationOptions]
  );

  useEffect(() => {
    const remainders = [];
    if (arrayOfFavorites?.length) {
      remainders.push(
        ...props.stockMedicationOptions?.filter((option) => {
          return !arrayOfFavorites?.some(
            (favorite) => option.value === favorite.id
          );
        })
      );
    } else {
      remainders.push(...props.stockMedicationOptions);
    }

    setArrayOfRemainders(
      remainders?.map((remainder) => ({
        isFavorite: false,
        name: remainder.label,
        id: remainder.value,
        ...remainder,
      }))
    );
  }, [favorites]);

  const checkIsFavorite = (id: number) => {
    if (arrayOfFavorites && arrayOfFavorites?.length > 0) {
      return arrayOfFavorites.find((element) => element.value === id);
    }
    return false;
  };

  const handleToggle = (id) => {
    const isFavourite = checkIsFavorite(id);
    toggleFavorite(!!isFavourite, id, props.medicationSourceListName);
  };

  return (
    <div key="dispensed_medication_select">
      <FavoriteSelect
        returnObject
        label={props.label}
        arrayOfFavoriteOptions={arrayOfFavorites || []}
        arrayOfRemainderOptions={arrayOfRemainders || []}
        fullSelectOptions={[
          ...(arrayOfFavorites || []),
          ...(arrayOfRemainders || []),
        ]}
        customHandleToggle={handleToggle}
        onChange={props.onChange}
        value={props.value}
        invalid={props.invalid}
        placeholder={props.placeholder}
        isDisabled={props.isDisabled}
        kitmanDesignSystem
        appendToBody
        cacheOptions={false}
      />
    </div>
  );
};

export default DispensedMedicationSelect;
