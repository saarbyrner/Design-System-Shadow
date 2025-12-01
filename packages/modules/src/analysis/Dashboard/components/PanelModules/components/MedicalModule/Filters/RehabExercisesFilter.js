// @flow
import { useState, useEffect, useMemo, useRef } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import _uniqBy from 'lodash/uniqBy';
import {
  Autocomplete,
  SelectWrapper,
  IconButton,
  Grid2 as Grid,
} from '@kitman/playbook/components';
import { AppStatus, IconButton as IconButtonLegacy } from '@kitman/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { colors } from '@kitman/common/src/variables';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel/index';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import { renderInput } from '@kitman/playbook/utils/Autocomplete';
import useExerciseList from '@kitman/modules/src/Medical/shared/components/RehabTab/hooks/useExerciseList';
import { useGetExercisesByIdQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';

// Types
import type { I18nProps } from '@kitman/common/src/types/i18n';

export type Props = {
  organisationId: number,
  value: Array<number>,
  onChange: (Array<number>) => void,
  onClickRemove: () => void,
};

type ExerciseOption = {
  id: number,
  label: string,
};
const RehabExercisesFilter = ({
  t,
  value: exerciseIds,
  ...props
}: I18nProps<Props>) => {
  const [, setFilterOpen] = useState<boolean>(false);
  const [selectedExerciseOptions, setSelectedExerciseOptions] = useState<
    Array<ExerciseOption>
  >([]);
  const [exerciseSearchParams, setExerciseSearchParams] = useState({
    rehabExerciseName: '',
    rehabExerciseCategory: null,
    organisationId: props.organisationId,
    searchMode: 'contains',
    page: 1,
    resultsPerPage: 10,
  });

  const {
    loadedExercises,
    nextPage,
    initialRequestStatus: searchExercisesStatus,
  } = useExerciseList(exerciseSearchParams, true);

  const {
    data: matchedExercisesToIds,
    isFetching: isFetchingSelectedExercises,
    isError: isFetchingSelectedExercisesError,
  } = useGetExercisesByIdQuery(exerciseIds, {
    skip:
      selectedExerciseOptions.length > 0 ||
      !exerciseIds ||
      exerciseIds.length < 1,
  });

  const exerciseOptions = useMemo(() => {
    return (
      loadedExercises?.map((exercise) => ({
        id: exercise.id,
        label: exercise.name,
      })) || []
    );
  }, [loadedExercises]);

  useEffect(() => {
    setSelectedExerciseOptions(
      matchedExercisesToIds?.map((exercise) => ({
        id: exercise.id,
        label: exercise.name,
      })) || []
    );
  }, [matchedExercisesToIds]);

  /*
    When getting next items, the list scrolls to the top.
    The below fixes the scroll as per: https://github.com/mui/material-ui/issues/18450#issuecomment-1833700978
  */
  const persistedListBox = useRef();
  const persistedScrollTop = useRef();
  useEffect(() => {
    if (persistedListBox.current) {
      setTimeout(() => {
        persistedListBox.current.scrollTo({
          top: persistedScrollTop.current,
        });
        persistedListBox.current = null;
      }, 1);
    }
  }, [loadedExercises]);

  const onSearch = (newInputValue) => {
    setExerciseSearchParams((prev) => ({
      ...prev,
      page: 1,
      rehabExerciseName: newInputValue,
    }));
  };

  const onSearchDebounced = useDebouncedCallback(onSearch, 500);

  useEffect(() => {
    return () => {
      onSearchDebounced?.cancel?.();
    };
  }, [onSearchDebounced]);

  const searchModeOptions = [
    {
      label: t('Contains'),
      value: 'contains',
    },
    {
      label: t('Starts with'),
      value: 'starts_with',
    },
  ];

  const changeSearchMode = (e) => {
    const option = e.target.value;
    setExerciseSearchParams((prev) => {
      return {
        ...prev,
        searchMode: option,
      };
    });
  };

  const loadMore = () => {
    if (nextPage != null) {
      setExerciseSearchParams((prev) => {
        return {
          ...prev,
          page: prev.page + 1,
        };
      });
    }
  };

  if (searchExercisesStatus === 'FAILURE' || isFetchingSelectedExercisesError) {
    return <AppStatus status="error" isEmbed />;
  }

  return (
    <Panel.Field>
      <Panel.FieldTitle
        styles={{
          display: 'flex',
          justifyContent: 'space-between',
          '.iconButton': {
            padding: 0,
            minWidth: 'auto',
            width: '20px',
            height: '20px',
            fontWeight: 'bold',
            color: colors.grey_100,
            '&::before': {
              fontSize: '16px',
            },
          },
        }}
      >
        <span>{t('Exercises')}</span>
        <IconButtonLegacy
          onClick={props.onClickRemove}
          icon="icon-close"
          isSmall
          isBorderless
        />
      </Panel.FieldTitle>
      <Grid container spacing={1}>
        <Grid xs={8}>
          <Autocomplete
            multiple
            size="small"
            disablePortal
            disableCloseOnSelect
            freeSolo
            loading={searchExercisesStatus === 'PENDING'}
            disabled={isFetchingSelectedExercises}
            onOpen={() => setFilterOpen(true)}
            onClose={() => setFilterOpen(false)}
            value={selectedExerciseOptions}
            onChange={(e, selectedOptions) => {
              const uniqueOptions = _uniqBy(selectedOptions, 'id');
              setSelectedExerciseOptions(uniqueOptions);
              props.onChange(uniqueOptions.map((option) => option.id));
            }}
            onInputChange={(event, newInputValue) => {
              onSearchDebounced(newInputValue);
            }}
            options={exerciseOptions}
            getOptionDisabled={(option) =>
              selectedExerciseOptions.find(
                (selected) => selected.id === option.id
              ) !== undefined
            }
            isOptionEqualToValue={(option, valueToCheck) =>
              option.id === valueToCheck
            }
            renderInput={(params) =>
              renderInput({
                params,
                label: t('Search Exercises'),
                loading: searchExercisesStatus === 'PENDING',
              })
            }
            renderOption={(properties, option, { selected }) => (
              <li {...properties} key={option.id}>
                <IconButton sx={{ mr: 1 }} size="small">
                  <KitmanIcon
                    name={
                      selected ? KITMAN_ICON_NAMES.Done : KITMAN_ICON_NAMES.Add
                    }
                    fontSize="small"
                  />
                </IconButton>
                {option.label || 'Test'}
              </li>
            )}
            noOptionsText={t('No Exercises')}
            // MUI Autocomplete pagination: https://github.com/mui/material-ui/issues/18450
            ListboxProps={{
              onScroll: (event) => {
                const listboxNode = event.currentTarget;
                if (
                  listboxNode.scrollTop + listboxNode.clientHeight ===
                  listboxNode.scrollHeight
                ) {
                  persistedListBox.current = listboxNode;
                  persistedScrollTop.current = listboxNode.scrollTop;
                  loadMore();
                }
              },
            }}
          />
        </Grid>
        <Grid xs={4}>
          <SelectWrapper
            value={exerciseSearchParams.searchMode}
            onChange={changeSearchMode}
            multiple={false}
            options={searchModeOptions}
            label={t('Mode')}
            minWidth={0}
          />
        </Grid>
      </Grid>
    </Panel.Field>
  );
};

export const RehabExercisesFilterTranslated: ComponentType<Props> =
  withNamespaces()(RehabExercisesFilter);
export default RehabExercisesFilter;
