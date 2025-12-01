// @flow
import { FavoriteAsyncSelect } from '@kitman/components';
import { searchDiagnosticTypes } from '@kitman/services';
import type {
  SelectOption,
  AdditionalGroupPayload,
} from '@kitman/components/src/FavoriteAsyncSelect';
import useFavorites from '@kitman/common/src/hooks/useFavorites';
import type {
  FormState,
  DiagnosticSelectType,
} from '../../hooks/useDiagnosticForm';

const DiagnosticTypeSelect = ({
  diagnosticIndex,
  label,
  additionalGroupPayload,
  onTypeChange,
  value,
  formState,
  shouldDisableEditing,
  invalid,
  isMulti,
}: {
  diagnosticIndex: number,
  label: string,
  additionalGroupPayload: AdditionalGroupPayload,
  value: SelectOption | Array<Object>,
  formState: FormState,
  invalid: boolean,
  isMulti: boolean,
  onTypeChange: (
    DiagnosticSelectType | Array<DiagnosticSelectType>
  ) => SelectOption | Array<Object>,
  shouldDisableEditing: () => boolean,
}) => {
  const { favorites, toggleFavorite } = useFavorites(
    'diagnostic_types',
    true,
    { location_id: formState.locationId },
    true
  );

  const arrayOfFavorites = favorites
    .get('diagnostic_types')
    ?.map((favorite) => ({
      ...favorite,
      label: favorite.select_name || favorite.name,
      value: favorite.id,
    }));

  const checkIsFavorite = (id: number) => {
    const groupFavourites = favorites.get('diagnostic_types');

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
    toggleFavorite(!!isFavourite, id, 'diagnostic_types', {
      location_id: formState.locationId,
    });
  };

  return (
    <div key={`diagnostic_type_select_${diagnosticIndex}`}>
      <FavoriteAsyncSelect
        label={label}
        isMulti={isMulti}
        arrayOfFavorites={arrayOfFavorites || []}
        checkIsFavourite={checkIsFavorite}
        handleToggle={handleToggle}
        additionalGroupPayload={additionalGroupPayload}
        onChange={onTypeChange}
        value={value}
        invalid={invalid}
        loadOptions={(searchValue, callback) => {
          if (!formState.locationId) return;

          searchDiagnosticTypes(formState.locationId, searchValue).then(
            (data) => {
              callback([
                {
                  label: 'Diagnostic types',
                  options: data.map((remainderOption) => {
                    return {
                      ...remainderOption,
                      value: remainderOption.id,
                      label: `${remainderOption.cpt_code} - ${remainderOption.name}`,
                      ...(window.featureFlags['multi-fave-select'] && {
                        isChecked: formState.queuedDiagnostics?.[
                          diagnosticIndex
                        ]?.diagnosticTypes?.find(
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
        placeholder={
          !formState.locationId ||
          formState.queuedDiagnostics[diagnosticIndex]?.diagnosticType?.type ===
            'order set' ||
          shouldDisableEditing()
            ? 'Select a location to search'
            : 'Search diagnostic types ...'
        }
        isDisabled={
          !formState.locationId ||
          (formState.queuedDiagnostics[diagnosticIndex]?.diagnosticType
            ?.type === 'order set' &&
            !isMulti) ||
          shouldDisableEditing()
        }
        kitmanDesignSystem
        appendToBody
        cacheOptions={false}
      />
    </div>
  );
};

export default DiagnosticTypeSelect;
