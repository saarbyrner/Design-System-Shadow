// @flow
import type { ComponentType } from 'react';
import {
  useState,
  useLayoutEffect,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import ReactDOM from 'react-dom';
import { withNamespaces } from 'react-i18next';
import {
  Select,
  ExpandingPanel,
  AppStatus,
  InputTextField,
} from '@kitman/components';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import useFavorites from '@kitman/common/src/hooks/useFavorites';
import type { FavoriteItem } from '@kitman/common/src/hooks/useFavorites';
import { Virtuoso } from 'react-virtuoso';
import type {
  Exercise,
  SearchMode,
} from '@kitman/services/src/services/rehab/getExercises';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { ExerciseTemplateTranslated as ExerciseTemplate } from '../ExerciseTemplate';

import useExerciseList from '../../hooks/useExerciseList';
import style from './style';
import keyboardKeyActions from '../../keyboardKeyActions';
import type { ExerciseTemplate as ExerciseTemplateType } from '../../types';

import filterFavourites from './searchUtils';

export type Props = {
  organisationId: number,
  onClose: Function,
  onClickedExerciseTemplate: Function,
  isOpen: boolean,
  disabled: boolean,
};

const ExerciseListPanel = (props: I18nProps<Props>) => {
  const [searchTerm, setSearchTerm] = useState(null);
  const [searchMode, setSearchMode] = useState<SearchMode>('contains');

  const [exerciseSearchParams, setExerciseSearchParams] = useState({
    rehabExerciseName: '',
    rehabExerciseCategory: null,
    organisationId: props.organisationId,
    searchMode,
    page: 1,
    resultsPerPage: 60,
  });
  const {
    favorites,
    // eslint-disable-next-line no-unused-vars
    initialRequestStatus: favouritesRequestStatus,
    toggleFavorite,
  } = useFavorites('rehab_exercises');

  const { loadedExercises, nextPage, initialRequestStatus } = useExerciseList(
    exerciseSearchParams,
    true
  );

  const [favouriteIds, setFavouriteIds] = useState([]);
  const inputRef = useRef(null);

  const [displayExercises, setDisplayExercises] = useState<
    Array<Exercise | FavoriteItem>
  >([]);

  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  const virtuosoRef = useRef(null);
  const listRef = useRef(null);

  const keyDownCallback = useCallback(
    (e: KeyboardEvent) => {
      let nextIndex = null;

      if (keyboardKeyActions.Enter.includes(e.code)) {
        if (
          currentItemIndex != null &&
          displayExercises &&
          currentItemIndex >= 0 &&
          currentItemIndex < displayExercises.length
        ) {
          const exercise = displayExercises[currentItemIndex];
          const exerciseId = typeof exercise.id === 'number' ? exercise.id : -1; // -1 just to make flow happy

          if (exerciseId === -1) {
            return;
          }
          if (!e.shiftKey) {
            // this line is to ensure user is focused on the search bar or search dropdown before clicking to add
            // eslint-disable-next-line max-depth
            if (
              // $FlowIgnore[prop-missing] placeholder is added by us
              document.activeElement?.placeholder !== 'Search' ||
              document.activeElement?.className.includes(
                '-dummyInput-DummyInput-'
              )
            ) {
              return;
            }
            props.onClickedExerciseTemplate(
              ({
                exercise_template_id: exerciseId,
                exercise_name: exercise.name,
                defaultVariationsType: exercise.variations_type || '',
                variations: [],
                defaultVariations: exercise.variations_default,
                type: 'exerciseTemplate',
                exerciseId,
                comment: null,
                id: exercise.id,
                reason: null,
              }: ExerciseTemplateType)
            );
          } else {
            toggleFavorite(
              favouriteIds.includes(exercise.id),
              exerciseId,
              'rehab_exercises'
            );
          }
          e.preventDefault();
        }
        return;
      }

      if (keyboardKeyActions.Tab.includes(e.code)) {
        // Block tabbing out of the search entry
        if (e.shiftKey && document.activeElement === inputRef.current) {
          e.preventDefault();
        }
        return;
      }

      if (keyboardKeyActions.Up.includes(e.code)) {
        if (
          (!document.activeElement ||
            document.activeElement === inputRef.current) &&
          currentItemIndex > 0
        ) {
          nextIndex = currentItemIndex - 1;
        }
      } else if (keyboardKeyActions.Down.includes(e.code)) {
        if (
          !document.activeElement ||
          document.activeElement === inputRef.current
        ) {
          nextIndex = Math.min(
            displayExercises.length - 1,
            currentItemIndex + 1
          );
        }
      }

      if (
        nextIndex !== null &&
        displayExercises &&
        nextIndex < displayExercises.length
      ) {
        virtuosoRef.current?.scrollIntoView({
          index: nextIndex,
          behavior: 'auto',
          done: () => {
            // $FlowIgnore[incompatible-call]
            setCurrentItemIndex(nextIndex);
          },
        });
        e.preventDefault();
      }
    },
    [currentItemIndex, virtuosoRef, setCurrentItemIndex, displayExercises]
  );

  useEffect(() => {
    if (props.isOpen) {
      document.addEventListener('keydown', keyDownCallback, false);
    } else {
      document.removeEventListener('keydown', keyDownCallback, false);
    }

    return function cleanup() {
      document.removeEventListener('keydown', keyDownCallback, false);
    };
  }, [props.isOpen, keyDownCallback]);

  const scrollerRef = useCallback((element) => {
    if (element) {
      listRef.current = element;
    }
  }, []);

  useLayoutEffect(() => {
    // Reset any selection of exercise templates
    setCurrentItemIndex(0);

    // Focus on the search bar when the panel is opened
    // re-focus search bar when it is being enabled

    if (props.isOpen && inputRef.current !== null) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [props.isOpen]);

  const delaySearchTermRequest = useDebouncedCallback((enteredText) => {
    setExerciseSearchParams((prev) => {
      return {
        ...prev,
        page: 1,
        rehabExerciseName: enteredText,
      };
    });
  }, 600);

  // Cleanup debounce on demount
  useEffect(() => {
    return () => {
      delaySearchTermRequest?.cancel?.();
    };
  }, [delaySearchTermRequest]);

  const groupFavourites = favorites.get('rehab_exercises');

  const toggleFavouriteAction = (
    currentlyFavourite: boolean,
    id: number | string
  ) => {
    toggleFavorite(currentlyFavourite, id, 'rehab_exercises');
  };

  useEffect(() => {
    let filteredGroupFav = groupFavourites || [];
    const favIds = groupFavourites ? groupFavourites.map((fav) => fav.id) : [];
    setFavouriteIds(favIds);

    const filteredExercises = loadedExercises.filter(
      (exercise) => !favIds.includes(exercise.id)
    );
    const requestSearchTerm = exerciseSearchParams.rehabExerciseName;
    if (requestSearchTerm && requestSearchTerm.length > 1) {
      filteredGroupFav = filteredGroupFav.filter((favExercise) =>
        filterFavourites(requestSearchTerm, favExercise.name, searchMode)
      );
    }
    const combinedExercises = [].concat(filteredGroupFav, filteredExercises);
    setDisplayExercises(combinedExercises);
  }, [loadedExercises]);

  useEffect(() => {
    let filteredGroupFav = groupFavourites || [];
    const favIds = groupFavourites ? groupFavourites.map((fav) => fav.id) : [];
    setFavouriteIds(favIds);

    const filteredExercises = loadedExercises.filter(
      (exer) => !favIds.includes(exer.id)
    );
    const requestSearchTerm = exerciseSearchParams.rehabExerciseName;
    if (requestSearchTerm && requestSearchTerm.length > 1) {
      filteredGroupFav = filteredGroupFav.filter((favExercise) =>
        filterFavourites(requestSearchTerm, favExercise.name, searchMode)
      );
    }
    const combinedExercises = [].concat(filteredGroupFav, filteredExercises);
    setDisplayExercises(combinedExercises);
  }, [favorites]);

  const searchModeOptions = [
    {
      label: props.t('Contains'),
      value: 'contains',
    },
    {
      label: props.t('Starts with'),
      value: 'starts_with',
    },
  ];

  const changeSearchMode = (mode: SearchMode) => {
    setSearchMode(mode);
    setExerciseSearchParams((prev) => {
      return {
        ...prev,
        searchMode: mode,
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

  const Footer = () => {
    if (initialRequestStatus !== 'PENDING') {
      return null;
    }
    return (
      <div
        style={{
          padding: '2rem',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {props.t('Loading...')}
      </div>
    );
  };

  const getInnerContent = () => {
    // eslint-disable-next-line default-case
    switch (initialRequestStatus) {
      case 'FAILURE':
        return <AppStatus status="error" isEmbed />;
      case 'SUCCESS':
      case 'PENDING':
        return (
          <>
            <div css={style.searchInputs}>
              <div css={style.searchBar} data-testid="ExerciseListPanel|Search">
                <InputTextField
                  onChange={(e) => {
                    setCurrentItemIndex(0);
                    setSearchTerm(e.target.value);
                    delaySearchTermRequest(e.target.value);
                  }}
                  focused
                  autoFocus
                  onFocus={(e) => e.currentTarget.select()}
                  value={searchTerm || ''}
                  isClearable={!!(searchTerm && searchTerm.length > 0)}
                  kitmanDesignSystem
                  placeholder={props.t('Search')}
                  inputRef={inputRef}
                />
              </div>
              {window.featureFlags['rehab-search-mode-options'] && (
                <div
                  css={style.searchOptions}
                  data-testid="ExerciseListPanel|SearchOptions"
                >
                  <Select
                    appendToBody
                    value={searchMode}
                    options={searchModeOptions}
                    onChange={(searchModeValue) =>
                      changeSearchMode(searchModeValue)
                    }
                    onBlur={() => {
                      inputRef?.current?.focus();
                    }}
                  />
                </div>
              )}
            </div>
            {displayExercises && (
              <Virtuoso
                ref={virtuosoRef}
                scrollerRef={scrollerRef}
                style={{ width: '100%', height: '100%' }}
                totalCount={displayExercises.length}
                endReached={loadMore}
                itemContent={(index) => {
                  const exercise = displayExercises[index];
                  return (
                    <ExerciseTemplate
                      title={exercise.name}
                      templateId={exercise.id}
                      defaultVariation={exercise.variations_default}
                      isFavourite={favouriteIds.includes(exercise.id)}
                      onToggleFavourite={toggleFavouriteAction}
                      disabled={props.disabled}
                      isSelected={index === currentItemIndex}
                      onClicked={() => {
                        const exerciseId =
                          typeof exercise.id === 'number' ? exercise.id : -1; // -1 just to make flow happy
                        props.onClickedExerciseTemplate(
                          ({
                            exercise_template_id: exerciseId,
                            exercise_name: exercise.name,
                            defaultVariations: exercise.variations_default,
                            variations: [exercise.variations_default],
                            type: 'exerciseTemplate',
                            exerciseId,
                            comment: null,
                            id: exercise.id,
                            reason: null,
                          }: ExerciseTemplateType)
                        );
                        inputRef?.current?.focus();
                      }}
                    />
                  );
                }}
                components={{ Footer }}
              />
            )}
          </>
        );
    }
    return undefined;
  };

  const parentOnCloseCallback = props.onClose;

  const onCloseExpandingPanelCallback = useCallback(() => {
    setSearchTerm('');
    setExerciseSearchParams((prev) => {
      if (prev.page === 1 && prev?.rehabExerciseName === '') {
        return prev;
      }

      setDisplayExercises([]);
      return {
        ...prev,
        page: 1,
        rehabExerciseName: '',
      };
    });
    parentOnCloseCallback();
  }, [parentOnCloseCallback]);

  return ReactDOM.createPortal(
    <div css={style.exerciseListPanel} data-testid="Rehab|ExerciseListPanel">
      <ExpandingPanel
        width={436}
        isOpen={props.isOpen}
        onClose={onCloseExpandingPanelCallback}
        title={props.t('Exercises')}
      >
        {getInnerContent()}
      </ExpandingPanel>
    </div>,
    document.getElementById('issueMedicalProfile-Slideout')
  );
};

export const ExerciseListPanelTranslated: ComponentType<Props> =
  withNamespaces()(ExerciseListPanel);
export default ExerciseListPanel;
