// @flow
import { FavoriteAsyncSelect } from '@kitman/components';
import { searchProcedureTypes } from '@kitman/services';
import type { SelectOption } from '@kitman/components/src/FavoriteAsyncSelect';
import useFavorites from '@kitman/common/src/hooks/useFavorites';
import type {
  FormState,
  FormStateProcedureType,
} from '../../hooks/useProcedureForm';

const ProcedureTypeSelect = ({
  procedureIndex,
  placeholder,
  label,
  value,
  formState,
  invalid,
  isMulti,
  onTypeChange,
}: {
  procedureIndex: number,
  placeholder: string,
  label: string,
  value: SelectOption | Array<Object>,
  invalid: boolean,
  formState: FormState,
  isMulti: boolean,
  onTypeChange: (FormStateProcedureType) => SelectOption | Array<Object>,
}) => {
  const { favorites, toggleFavorite } = useFavorites(
    'procedure_types',
    true,
    { location_id: formState.locationId },
    true
  );

  const arrayOfFavorites = favorites.get('procedure_types')?.map((favorite) =>
    // $FlowFixMe
    ({
      ...favorite,
      label: favorite.select_name || favorite.name,
      value: favorite.id,
    })
  );
  const checkIsFavorite = (id: number) => {
    const groupFavourites = favorites.get('procedure_types');

    if (groupFavourites) {
      return !!groupFavourites.find((element) => element.id === id);
    }

    if (arrayOfFavorites && arrayOfFavorites?.length > 0) {
      return !!arrayOfFavorites.find((element) => element.value === id);
    }
    return false;
  };

  const handleToggle = (id) => {
    const isFavourite = checkIsFavorite(id);
    toggleFavorite(!!isFavourite, id, 'procedure_types', {
      location_id: formState.locationId,
    });
  };

  return (
    <div key={`procedure_type_select_${procedureIndex}`}>
      <FavoriteAsyncSelect
        label={label}
        isMulti={isMulti}
        arrayOfFavorites={arrayOfFavorites || []}
        handleToggle={handleToggle}
        checkIsFavourite={checkIsFavorite}
        onChange={onTypeChange}
        value={value}
        invalid={invalid}
        loadOptions={(searchValue, callback) => {
          if (!formState.locationId) return;

          searchProcedureTypes(formState.locationId, searchValue).then(
            (data) => {
              callback([
                {
                  label: 'Procedure types',
                  options: data.map((remainderOption) => {
                    return {
                      ...remainderOption,
                      value: remainderOption.id,
                      label: `${remainderOption.code} - ${remainderOption.name}`,
                      ...(window.featureFlags['multi-fave-select'] && {
                        isChecked: formState.queuedProcedures?.[
                          procedureIndex
                        ]?.procedureTypes?.find(
                          (type) => type.id === remainderOption.id
                        ),
                      }),
                    };
                  }),
                },
              ]);
            }
          );
        }}
        cacheOptions
        kitmanDesignSystem
        appendToBody
        placeholder={placeholder}
      />
    </div>
  );
};

export default ProcedureTypeSelect;
