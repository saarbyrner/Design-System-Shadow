// @flow
import { useEffect, useState, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import i18n from '@kitman/common/src/utils/i18n';
import {
  Select,
  SegmentedControl,
  FavoriteSelect,
  withSelectServiceSuppliedOptions,
  ToggleSwitch,
} from '@kitman/components';
import { getSessionTypes } from '@kitman/services';
import {
  getEventActivities,
  getPrincipleTypes,
  getPrincipleCategories,
  getPhases,
} from '@kitman/services/src/services/planning';
import useFavorites from '@kitman/common/src/hooks/useFavorites';
import type {
  SessionType,
  SessionTypes,
} from '@kitman/services/src/services/getSessionTypes';
import type { StatusChangedCallback } from '@kitman/components/src/Select/hoc/withServiceSuppliedOptions';
import type { Option } from '@kitman/components/src/Select';
import {
  sessionThemeOptionTypes,
  type SessionThemeOptionTypes,
} from '@kitman//common/src/types/Event';
import type {
  EventSessionFormData,
  SessionAttributesValidity,
  EditEventPanelMode,
  OnUpdateEventTitle,
  OnUpdateEventDetails,
} from '@kitman/modules/src/PlanningEventSidePanel/src/types';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import style from '@kitman/modules/src/PlanningEventSidePanel/src/style';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';
import type { SetState } from '@kitman/common/src/types/react';
import type { AdditionalMixpanelSessionData } from '@kitman/common/src/utils/TrackingData/src/types/calendar';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import {
  getSessionThemeSubOptions,
  stringifySessionTypeAndOption,
} from './utils';
import { sessionTypeAndOptionSeparator } from './constants';

export type Props = {
  event: EventSessionFormData,
  eventValidity: SessionAttributesValidity,
  panelMode: EditEventPanelMode,
  canManageWorkload: boolean,
  onUpdateEventTitle: OnUpdateEventTitle,
  onUpdateEventDetails: OnUpdateEventDetails,
  onDataLoadingStatusChanged: StatusChangedCallback,
  setAdditionalMixpanelSessionData: SetState<AdditionalMixpanelSessionData>,
};

const mapToOptionsWithCategories = (
  rawSessionTypes: Array<SessionType>
): Array<Option> => {
  const sessionTypeCategories = rawSessionTypes.reduce((result, type) => {
    if (type.category) result.push(type.category);
    return result;
  }, []);
  const uniqueSessionTypeCategoryIds = [
    ...new Set(sessionTypeCategories.map((category) => category.id)),
    // `undefined` and `null` are used to group session types without categories.
    undefined,
    null,
  ];
  const categorizedSessionTypes = uniqueSessionTypeCategoryIds
    .sort()
    .map((id) => {
      const categoryName = sessionTypeCategories.find(
        (category) => category.id === id
      )?.name;
      return {
        label: categoryName ?? '',
        options: rawSessionTypes
          .filter((type) => type.category?.id === id)
          .map((type) => ({
            name: type.name,
            label: type.name,
            id: type.id,
            value: type.id,
            isJointSessionType: type.is_joint_practice,
            sessionTypeCategoryName: type.category?.name,
          })),
      };
    });
  return categorizedSessionTypes;
};

type SessionTypeSelectWithFavoritesProps = {
  event: EventSessionFormData,
  eventValidity: SessionAttributesValidity,
  onUpdateEventTitle: OnUpdateEventTitle,
  onUpdateEventDetails: OnUpdateEventDetails,
  onDataLoadingStatusChanged: StatusChangedCallback,
};

const getSessionTypeSelectLabel = () => i18n.t('Session type');
const GROUP_NAME_FOR_FAVORITES = 'session_types';

const SessionTypeSelectWithFavorites = (
  props: SessionTypeSelectWithFavoritesProps
) => {
  const { onDataLoadingStatusChanged } = props;
  const [sessionTypes, setSessionTypes] = useState<Array<Option>>([]);

  useEffect(() => {
    getSessionTypes().then(
      (rawSessionTypes: SessionTypes) => {
        const mapper = window.getFlag('planning-custom-org-event-details')
          ? mapToOptionsWithCategories
          : defaultMapToOptions;
        setSessionTypes(mapper(rawSessionTypes));
        onDataLoadingStatusChanged('SUCCESS', 'session_type_id', null);
      },
      (rejectionReason: string) => {
        onDataLoadingStatusChanged(
          'FAILURE',
          'session_type_id',
          rejectionReason
        );
      }
    );
  }, [onDataLoadingStatusChanged]);

  const { favorites, toggleFavorite } = useFavorites(GROUP_NAME_FOR_FAVORITES);

  const favoriteSessionTypes = favorites
    .get(GROUP_NAME_FOR_FAVORITES)
    ?.map(({ id, name }) => ({
      name,
      label: name,
      id,
      value: id,
      isFavorite: true,
    }));

  const handleToggle = (id: number) => {
    const isFavorite =
      !!favoriteSessionTypes &&
      favoriteSessionTypes.some((type) => type.id === id);
    toggleFavorite(isFavorite, id, GROUP_NAME_FOR_FAVORITES);
  };

  const nonFavoriteSessionTypes = sessionTypes
    // This `filter` always returns sessionTypes unmodified if sessionTypes are
    // categorised.
    .filter(
      (sessionType) =>
        !favoriteSessionTypes?.some(
          (favoriteSessionType) => favoriteSessionType.id === sessionType.id
        )
    );

  const areRemainderOptionsCategorised = sessionTypes.some(
    (type) => type.options && type.options.length > 0
  );
  return (
    sessionTypes.length > 0 && (
      <FavoriteSelect
        value={props.event.session_type_id}
        label={getSessionTypeSelectLabel()}
        onChange={(selectedOption) => {
          props.onUpdateEventTitle('', false);
          props.onUpdateEventDetails({
            session_type_id: selectedOption.value,
            session_type: {
              isJointSessionType: selectedOption.isJointSessionType,
              sessionTypeCategoryName: selectedOption.sessionTypeCategoryName,
            },
            team_id: null,
            title: null,
          });
        }}
        customHandleToggle={handleToggle}
        returnObject
        invalid={props.eventValidity.session_type_id?.isInvalid}
        arrayOfFavoriteOptions={favoriteSessionTypes ?? []}
        arrayOfRemainderOptions={
          areRemainderOptionsCategorised ? [] : nonFavoriteSessionTypes
        }
        arrayOfCategorisedRemainderOptions={
          areRemainderOptionsCategorised ? nonFavoriteSessionTypes : []
        }
        fullSelectOptions={sessionTypes ?? []}
      />
    )
  );
};

const SQUAD_LOADING_INDEX = 1;
const INDIVIDUAL_LOADING_INDEX = 2;

const SessionFields = (props: I18nProps<Props>) => {
  const checkIsMounted = useIsMountedCheck();
  const { trackEvent } = useEventTracking();

  const { onDataLoadingStatusChanged } = props;
  const [areParticipantsDuplicated, setAreParticipantsDuplicated] =
    useState<boolean>(false);
  const [isSessionPlanDuplicated, setIsSessionPlanDuplicated] =
    useState<boolean>(false);

  const [drillsCount, setDrillsCount] = useState<number>(0);
  const [isDrillsCountLoading, setIsDrillsCountLoading] =
    useState<boolean>(false);

  const [sessionThemeOptions, setSessionThemeOptions] = useState<
    Array<{
      ...Option,
      value: SessionThemeOptionTypes,
      options: Array<Option>,
    }>
  >([]);

  const SessionTypeSelect = useMemo(
    () =>
      withSelectServiceSuppliedOptions(Select, getSessionTypes, {
        dataId: 'session_type_id',
        onStatusChangedCallback: onDataLoadingStatusChanged,
        ...(window.getFlag('planning-custom-org-event-details') && {
          mapToOptions: mapToOptionsWithCategories,
        }),
      }),
    [onDataLoadingStatusChanged]
  );

  const getParticipantListConfiguratorLabel = () => {
    let label = '';

    const areAnyAthletesInEvent =
      props.event.athlete_events_count && props.event.athlete_events_count > 0;
    const areAnyStaffInEvent =
      props.event.user_ids && props.event.user_ids.length > 0;

    if (!(areAnyAthletesInEvent || areAnyStaffInEvent)) {
      return label;
    }

    label += '(';

    if (areAnyAthletesInEvent) {
      // $FlowIgnore props.event.athlete_events_count exists at this point.
      label += `${props.event.athlete_events_count} ${props.t('athletes')}`;
    }

    if (areAnyAthletesInEvent && areAnyStaffInEvent) {
      label += ', ';
    }

    if (areAnyStaffInEvent) {
      // $FlowIgnore props.event.user_ids.length exists at this point.
      label += `${props.event.user_ids.length} ${props.t('staff')}`;
    }

    label += ')';

    return label;
  };

  const isPlanDuplicationAllowed =
    window.getFlag('planning-tab-sessions') &&
    window.getFlag('selection-tab-displaying-in-session') &&
    props.panelMode === 'DUPLICATE';

  useEffect(() => {
    if (!(isPlanDuplicationAllowed && props.event.id)) return;

    const getAndSetEventActivities = async () => {
      const activities = await getEventActivities({
        // $FlowIgnore props.event.id exists at this point.
        eventId: props.event.id,
        params: {
          excludeAthletes: true,
          excludeSquads: true,
        },
      });
      setIsDrillsCountLoading(false);
      if (!activities) {
        return;
      }
      setDrillsCount(activities.length);
      props.setAdditionalMixpanelSessionData((prev) => ({
        ...prev,
        drillsCount: activities.length,
      }));
    };
    setIsDrillsCountLoading(true);
    getAndSetEventActivities();
  }, [isPlanDuplicationAllowed, props.event.id]);

  useEffect(() => {
    const getAndSetSessionThemeOptions = async () => {
      const [principleTypes, principleCategories, phases] = await Promise.all([
        getPrincipleTypes(),
        getPrincipleCategories(),
        getPhases(),
      ]);
      if (!checkIsMounted()) return;
      setSessionThemeOptions([
        {
          value: sessionThemeOptionTypes.PrincipleType,
          label: props.t('Principle type'),
          options: getSessionThemeSubOptions(
            principleTypes,
            sessionThemeOptionTypes.PrincipleType
          ),
        },
        {
          value: sessionThemeOptionTypes.PrincipleCategory,
          label: props.t('Principle category'),
          options: getSessionThemeSubOptions(
            principleCategories,
            sessionThemeOptionTypes.PrincipleCategory
          ),
        },
        {
          value: sessionThemeOptionTypes.PhaseOfPlay,
          label: props.t('Phase of play'),
          options: getSessionThemeSubOptions(
            phases,
            sessionThemeOptionTypes.PhaseOfPlay
          ),
        },
      ]);
    };
    getAndSetSessionThemeOptions();
  }, []);

  return (
    <>
      {isPlanDuplicationAllowed && (
        <div css={style.duplicationConfigurators}>
          {!window.getFlag(
            'pac-event-sidepanel-sessions-games-show-athlete-dropdown'
          ) && (
            <div css={style.duplicationConfigurator}>
              {props.t('Duplicate participant list')}{' '}
              {getParticipantListConfiguratorLabel()}
              <ToggleSwitch
                isSwitchedOn={areParticipantsDuplicated}
                toggle={() =>
                  setAreParticipantsDuplicated((previousValue) => {
                    const newValue = !previousValue;
                    props.onUpdateEventDetails({
                      are_participants_duplicated: newValue,
                      duplicate_event_activities: isSessionPlanDuplicated,
                    });
                    props.setAdditionalMixpanelSessionData((prev) => ({
                      ...prev,
                      areParticipantsDuplicated: newValue,
                    }));
                    return newValue;
                  })
                }
              />
            </div>
          )}
          <div css={style.duplicationConfigurator}>
            {props.t('Duplicate session plan')}{' '}
            {isDrillsCountLoading
              ? `(${props.t('loading...')})`
              : drillsCount > 0 && `(${drillsCount} ${props.t('drills')})`}
            <ToggleSwitch
              isSwitchedOn={isSessionPlanDuplicated}
              toggle={() =>
                setIsSessionPlanDuplicated((previousValue) => {
                  const newValue = !previousValue;
                  props.onUpdateEventDetails({
                    are_participants_duplicated: areParticipantsDuplicated,
                    duplicate_event_activities: newValue,
                  });
                  props.setAdditionalMixpanelSessionData((prev) => ({
                    ...prev,
                    isSessionPlanDuplicated: newValue,
                  }));
                  return newValue;
                })
              }
            />
          </div>
        </div>
      )}
      {props.canManageWorkload && (
        <>
          <SegmentedControl
            label={props.t('Workload')}
            width="inline"
            buttons={[
              {
                name: props.t('Squad loading'),
                value: SQUAD_LOADING_INDEX,
              },
              {
                name: props.t('Individual loading'),
                value: INDIVIDUAL_LOADING_INDEX,
              },
            ]}
            selectedButton={props.event.workload_type}
            onClickButton={(value: number) => {
              props.onUpdateEventDetails({ workload_type: value });
              trackEvent(
                `Calendar — ${
                  isPlanDuplicationAllowed ? 'Duplicate' : 'New'
                } Session — Workload — ${
                  value === SQUAD_LOADING_INDEX ? 'Squad' : 'Individual'
                } loading was selected (clicked)`
              );
            }}
          />
          <div css={style.separator} />
        </>
      )}
      {window.getFlag('session-type-favourite') ? (
        <SessionTypeSelectWithFavorites
          {...props}
          data-testid="SessionFields|SessionTypeWithFavorites"
        />
      ) : (
        <SessionTypeSelect
          value={props.event.session_type_id}
          label={getSessionTypeSelectLabel()}
          onChange={(selectedOption) => {
            props.onUpdateEventTitle('', false);
            props.onUpdateEventDetails({
              session_type_id: selectedOption.value,
              session_type: {
                isJointSessionType: selectedOption.isJointSessionType,
                sessionTypeCategoryName: selectedOption.sessionTypeCategoryName,
              },
              team_id: null,
              title: null,
            });
          }}
          returnObject
          invalid={props.eventValidity.session_type_id?.isInvalid}
          data-testid="SessionFields|SessionType"
        />
      )}
      {window.getFlag('session-theme') && sessionThemeOptions.length > 0 && (
        <Select
          value={stringifySessionTypeAndOption(
            props.event?.theme_type,
            props.event?.theme_id ?? props.event?.theme?.id
          )}
          options={sessionThemeOptions}
          label={props.t('Session theme')}
          onChange={(typeAndOption) => {
            const [type, option] = typeAndOption.split(
              sessionTypeAndOptionSeparator
            );
            props.onUpdateEventDetails({
              theme_type: type,
              theme_id: +option,
            });
          }}
          isSearchable
        />
      )}
    </>
  );
};

export const SessionFieldsTranslated: ComponentType<Props> =
  withNamespaces()(SessionFields);
export default SessionFields;
