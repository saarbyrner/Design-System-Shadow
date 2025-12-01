// @flow
import React, { useMemo, useEffect, useState, useRef } from 'react';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import {
  Select,
  SelectAndFreetext,
  InputNumeric,
  InputText,
  TextButton,
  withSelectServiceSuppliedOptions,
  CustomPeriod,
} from '@kitman/components';
import type { Option } from '@kitman/components/src/Select';
import type { Game } from '@kitman/common/src/types/Event';
import {
  getVenueTypes,
  getOrganisationFormats,
  getFixtureRatings,
  getTeams,
} from '@kitman/services';
import { getSelectOptions } from '@kitman/components/src/SelectAndFreetext';
import { getCompetitionsV2 } from '@kitman/services/src/services/getCompetitions';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { updateAllCustomPeriodsNewDurationRanges } from '@kitman/common/src/utils/planningEvent/gamePeriodUtils';
import type { StatusChangedCallback } from '@kitman/components/src/Select/hoc/withServiceSuppliedOptions';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { SquadData } from './GameLayoutV2';
import { isEventDateInFuture } from '../game/GameFields';
import {
  extractDataBasedOnGameKey,
  getFeedOppositionOptions,
  getFormatValue,
} from './utils';
import type {
  EventGameFormData,
  EventFormData,
  EventGameFormValidity,
  EventSessionFormData,
  OnUpdateEventDetails,
} from '../../types';
import { DescriptionFieldTranslated as DescriptionField } from '../common/DescriptionField';
import { EventConditionFieldsV2Translated as EventConditionFieldsV2 } from './EventConditionFieldsV2';
import style from './style';
import {
  generateCustomPeriodsAndSplitTimes,
  removeCustomPeriods,
  addCustomPeriods,
  LOCAL_CUSTOM_OPPOSITION_OPTION_ID,
  MAX_CUSTOM_PERIOD_LIMIT,
} from './gameFieldsUtils';

type CompetitionOption = {
  ...Option,
  competition_categories: Array<Option>,
};

export type GameFieldEvent = Game &
  EventGameFormData &
  EventFormData &
  EventSessionFormData;
type Props = {
  event: GameFieldEvent,
  eventValidity: EventGameFormValidity,
  onUpdateEventDetails: OnUpdateEventDetails,
  onDataLoadingStatusChanged: StatusChangedCallback,
  squad: SquadData,
};

export type Team = {
  id: number,
  name: string,
};
export type Teams = Array<Team>;

const GameFieldsV2 = (props: I18nProps<Props>) => {
  const isFormatFixtureFieldsHidden =
    window.featureFlags['hide-format-and-fixture-rating'];
  const customPeriodDurationFF =
    window.featureFlags['games-custom-duration-and-additional-time'];
  const customOppositionNameFF =
    window.featureFlags['manually-add-opposition-name'];

  const [competitions, setCompetitions] = useState<Array<CompetitionOption>>(
    []
  );
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [isCompetitionsLoading, setIsCompetitionsLoading] = useState(false);
  const [competitionTypes, setCompetitionTypes] = useState([]);
  const [oppositions, setOppositions] = useState([]);
  const [formats, setFormats] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState(
    props.event.organisation_format_id
  );
  const [splitDurationValue, setSplitDurationValue] = useState(0);

  const { isLeague, isOfficial } = useLeagueOperations();
  const isLeagueOps = isLeague || isOfficial;
  const extractDataBasedOnGameKeyTypes = extractDataBasedOnGameKey(props.event);
  const isFutureEvent = isEventDateInFuture(props.event);
  const lockedValues = useRef({
    format: competitionTypes[0]?.format,
    format_id: props.event.organisation_format_id,
  }).current;
  const formation =
    !props.event.organisation_format_id &&
    !lockedValues.format &&
    !lockedValues.format_id;

  const eventCompetitionId = extractDataBasedOnGameKeyTypes?.hasGameKey
    ? props.event.competition?.id
    : props.event.competition_id;

  useEffect(() => {
    if (customPeriodDurationFF) {
      generateCustomPeriodsAndSplitTimes(
        +props.event.duration,
        +props.event.number_of_periods,
        props.event.custom_periods,
        props.onUpdateEventDetails
      );
    }
  }, [props.event.custom_period_duration_enabled]);

  useEffect(() => {
    if (eventCompetitionId) {
      setSelectedCompetition(eventCompetitionId);
    }
  }, [eventCompetitionId]);

  useEffect(() => {
    if (customPeriodDurationFF) {
      const newSplitValue = Math.floor(
        +props.event.duration / +props.event.number_of_periods
      );
      setSplitDurationValue(newSplitValue);
    }
  }, [props.event.duration, props.event.number_of_periods]);

  useEffect(() => {
    if (props.event.competition_id) {
      getTeams().then((data) => {
        setOppositions(
          customOppositionNameFF ? data : defaultMapToOptions(data)
        );
      });
    }
  }, [props.event.competition_id]);

  const handleCompetitionUpdate = (
    updatedCompetitionId: number,
    competitionOptions: Array<CompetitionOption>
  ) => {
    const foundCompetition = competitionOptions.find(
      (competition) => competition.value === updatedCompetitionId
    );
    if (
      foundCompetition &&
      foundCompetition.competition_categories?.length > 0
    ) {
      setCompetitionTypes(
        defaultMapToOptions(foundCompetition.competition_categories)
      );

      props.onUpdateEventDetails({
        competition_id: foundCompetition.value,
        competition_category_id: foundCompetition.competition_categories[0].id,
      });
    } else {
      setCompetitionTypes([]);
      props.onUpdateEventDetails({
        competition_id: updatedCompetitionId,
        competition_category_id: null,
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    getOrganisationFormats().then((formatData) => {
      if (mounted) {
        setFormats(defaultMapToOptions(formatData));
        if (
          (formation && extractDataBasedOnGameKeyTypes.hasGameKey) ||
          extractDataBasedOnGameKeyTypes.isMLS
        ) {
          setSelectedFormat(
            getFormatValue('11 v 11', defaultMapToOptions(formatData))
          );
        }
      }
    });

    setIsCompetitionsLoading(true);
    getCompetitionsV2(props.event, !isLeagueOps)
      .then((results) => {
        if (mounted) {
          const competitionOptions = defaultMapToOptions(results);
          setCompetitions(competitionOptions);
          if (!eventCompetitionId) {
            handleCompetitionUpdate(results?.[0]?.id, competitionOptions);
          }
          props.onDataLoadingStatusChanged('SUCCESS', 'competition_id', null);
          setIsCompetitionsLoading(false);
        }
      })
      .catch((error) => {
        setIsCompetitionsLoading(false);
        props.onDataLoadingStatusChanged(
          'FAILURE',
          'competition_id',
          error.message
        );
      });

    return () => {
      mounted = false;
    };
  }, []);

  const VenueSelect = useMemo(
    () =>
      withSelectServiceSuppliedOptions(Select, getVenueTypes, {
        dataId: 'venue_type_id',
        onStatusChangedCallback: props.onDataLoadingStatusChanged,
      }),
    []
  );
  const FixtureRatingSelect = useMemo(
    () =>
      withSelectServiceSuppliedOptions(Select, getFixtureRatings, {
        dataId: 'venue_type_id',
        onStatusChangedCallback: props.onDataLoadingStatusChanged,
      }),
    []
  );

  const feedOppositionOptions = getFeedOppositionOptions(
    props.event,
    extractDataBasedOnGameKeyTypes
  );
  const getFeedOppositionValue =
    props.event?.opponent_squad?.id || props.event?.opponent_team?.id;

  const addAndRemoveCustomPeriods = (newNumOfPeriods) => {
    const periodDifference = +props.event.number_of_periods - newNumOfPeriods;

    if (periodDifference > 0) {
      removeCustomPeriods(
        props.event.custom_period_duration_enabled,
        newNumOfPeriods,
        props.event.custom_periods,
        props.onUpdateEventDetails
      );
    } else {
      addCustomPeriods(
        props.event.custom_period_duration_enabled,
        newNumOfPeriods,
        +props.event.number_of_periods,
        +props.event.duration,
        props.event.custom_periods,
        props.onUpdateEventDetails
      );
    }
  };

  const onUpdateNumberOfCustomPeriodsInput = (value: number) => {
    if (value <= MAX_CUSTOM_PERIOD_LIMIT && value >= 0) {
      props.onUpdateEventDetails({ number_of_periods: value });
      addAndRemoveCustomPeriods(value);
    }
  };

  const onUpdateCustomPeriodDuration = (value: number, index: number) => {
    const customPeriods = [...props.event.custom_periods];
    customPeriods[index] = {
      ...customPeriods[index],
      duration: value,
    };

    const { periodDurationSum, currentCustomPeriods } =
      updateAllCustomPeriodsNewDurationRanges(customPeriods);

    props.onUpdateEventDetails({
      duration: periodDurationSum,
      custom_periods: currentCustomPeriods,
    });
  };

  const formatOppositionSelectOptions = () => {
    const currentData = [
      {
        id: props.event?.opponent_team?.custom
          ? +props.event?.opponent_team?.id
          : LOCAL_CUSTOM_OPPOSITION_OPTION_ID,
        name: 'Custom',
        require_additional_input: true,
      },
      ...oppositions.map((team) => ({
        ...team,
        id: team.id,
        require_additional_input: false,
      })),
    ];
    return getSelectOptions(currentData);
  };

  const renderCustomPeriodDurationUI = () => {
    const renderCustomPeriods = () =>
      props.event.custom_periods
        .filter((period) => !period.delete)
        .map((period, index) => (
          <React.Fragment key={`Period ${index + 1}`}>
            <CustomPeriod
              labelText={props.t('Period {{periodNum}}', {
                periodNum: index + 1,
              })}
              period={period}
              onUpdateCustomPeriodDuration={onUpdateCustomPeriodDuration}
              descriptor={props.t('min')}
              periodIndex={index}
              eventValidity={props.eventValidity}
            />
          </React.Fragment>
        ));

    return (
      <>
        <div css={style.threeColumnGrid}>
          <InputNumeric
            label={props.t('Periods')}
            onChange={(value) => onUpdateNumberOfCustomPeriodsInput(value)}
            value={props.event.number_of_periods ?? undefined}
            kitmanDesignSystem
            data-testid="CommonFields|Periods"
          />
          {!props.event.custom_period_duration_enabled && (
            <InputNumeric
              label={props.t('Split Evenly')}
              name="splitEvenly"
              value={splitDurationValue ? +splitDurationValue : undefined}
              disabled
              descriptor={props.t('min')}
              kitmanDesignSystem
            />
          )}
          <TextButton
            text={
              props.event.custom_period_duration_enabled
                ? props.t('Split Evenly')
                : props.t('Custom')
            }
            type="secondary"
            kitmanDesignSystem
            onClick={() =>
              props.onUpdateEventDetails({
                custom_period_duration_enabled:
                  !props.event.custom_period_duration_enabled,
              })
            }
          />
        </div>
        {props.event.custom_period_duration_enabled && (
          <div css={style.threeColumnGrid}>{renderCustomPeriods()}</div>
        )}
      </>
    );
  };

  const renderOppositionNameField = () => {
    if (customOppositionNameFF)
      return (
        <div css={style.oppositionCustomOptionsContainer}>
          <SelectAndFreetext
            selectLabel={
              isLeagueOps ? props.t('Away Team') : props.t('Opposition')
            }
            selectedField={
              (extractDataBasedOnGameKeyTypes?.hasGameKey &&
                getFeedOppositionValue) ||
              props.event.team_id
            }
            onSelectedField={(value) => {
              props.onUpdateEventDetails({ team_id: value });
            }}
            options={feedOppositionOptions || formatOppositionSelectOptions()}
            invalidFields={!!props.eventValidity.team_id?.isInvalid}
            disabled={extractDataBasedOnGameKeyTypes?.hasGameKey}
            isSearchable
            allowClearAll
            appendToBody={false}
            currentFreeText={props.event?.custom_opposition_name || ''}
            onUpdateFreeText={(value) => {
              props.onUpdateEventDetails({ custom_opposition_name: value });
            }}
            featureFlag
            textareaLabel={props.t('Custom Opposition Name')}
            textAreaContainerStyle={style.oppositionCustomFreetextContainer}
            customMaxLimit={125}
            invalidText={
              !!props.eventValidity?.custom_opposition_name?.isInvalid
            }
          />
        </div>
      );

    return (
      <Select
        label={isLeagueOps ? props.t('Away Team') : props.t('Opposition')}
        onChange={(value) => {
          props.onUpdateEventDetails({ team_id: value });
        }}
        value={
          (extractDataBasedOnGameKeyTypes?.hasGameKey &&
            getFeedOppositionValue) ||
          props.event.team_id
        }
        options={feedOppositionOptions || oppositions}
        invalid={props.eventValidity.team_id?.isInvalid}
        isSearchable
        allowClearAll
        data-testid="GameFields|Opposition"
        isDisabled={extractDataBasedOnGameKeyTypes?.hasGameKey}
      />
    );
  };

  return (
    <div css={style.addTopMargin}>
      <div css={style.singleColumnGrid}>
        <Select
          label={props.t('Competition')}
          options={competitions}
          onChange={(updatedCompId) =>
            handleCompetitionUpdate(updatedCompId, competitions)
          }
          value={selectedCompetition}
          invalid={props.eventValidity.competition_id?.isInvalid}
          data-testid="GameFields|Competition"
          isDisabled={extractDataBasedOnGameKeyTypes?.hasGameKey}
          isLoading={isCompetitionsLoading}
        />
        <Select
          data-testid="CalculationModule|SecondDataSource"
          label={props.t('Competition type')}
          onChange={(value) => {
            props.onUpdateEventDetails({ competition_category_id: value });
          }}
          options={competitionTypes}
          value={props.event.competition_category_id}
          invalid={props.eventValidity?.competition_category_id?.isInvalid}
        />
      </div>
      <div css={style.teamScoreRow}>
        <InputText
          label={isLeagueOps ? props.t('Home Team') : props.t('Team')}
          name="team"
          value={props.squad[0]?.label}
          disabled
          kitmanDesignSystem
          data-testid="GameFields|Team"
        />
        <InputNumeric
          label={props.t('Score')}
          name="score"
          value={props.event.score ?? undefined}
          onChange={(value) => {
            props.onUpdateEventDetails({ score: value });
          }}
          disabled={isFutureEvent}
          kitmanDesignSystem
          isInvalid={props.eventValidity.score?.isInvalid}
          data-testid="GameFields|Score"
        />
      </div>
      <div css={style.teamScoreRow}>
        {renderOppositionNameField()}
        <InputNumeric
          label={props.t('Score')}
          name="score"
          value={props.event.opponent_score ?? undefined}
          onChange={(value) => {
            props.onUpdateEventDetails({
              opponent_score: value,
            });
          }}
          disabled={isFutureEvent}
          kitmanDesignSystem
          isInvalid={props.eventValidity.opponent_score?.isInvalid}
          data-testid="GameFields|OpponentScore"
        />
      </div>
      <div css={style.twoColumnGrid}>
        <InputNumeric
          name="roundNumber"
          label={props.t('Round')}
          onChange={(value) => {
            props.onUpdateEventDetails({ round_number: value });
          }}
          value={props.event.round_number ?? undefined}
          kitmanDesignSystem
          isInvalid={props.eventValidity.round_number?.isInvalid}
          data-testid="GameFields|RoundNumber"
        />
        <VenueSelect
          label={props.t('Venue')}
          onChange={(value) => {
            props.onUpdateEventDetails({ venue_type_id: value });
          }}
          value={
            extractDataBasedOnGameKeyTypes?.fasGameVenue
              ? extractDataBasedOnGameKeyTypes?.fasGameVenue[0].value
              : props.event.venue_type_id
          }
          invalid={props.eventValidity.venue_type_id?.isInvalid}
          data-testid="GameFields|Venue"
          isDisabled={extractDataBasedOnGameKeyTypes?.hasGameKey}
        />
      </div>
      <div css={style.twoColumnGrid}>
        <InputNumeric
          label={props.t('Duration')}
          name="duration"
          value={props.event.duration ?? undefined}
          onChange={(mins) => {
            props.onUpdateEventDetails({ duration: mins });
            if (
              customPeriodDurationFF &&
              props.event.custom_period_duration_enabled
            )
              generateCustomPeriodsAndSplitTimes(
                mins,
                +props.event.number_of_periods,
                props.event.custom_periods,
                props.onUpdateEventDetails
              );
          }}
          descriptor={props.t('min')}
          kitmanDesignSystem
        />
        {!customPeriodDurationFF && (
          <InputText
            label={props.t('Periods')}
            onValidation={({ value }) =>
              props.onUpdateEventDetails({ number_of_periods: value })
            }
            value={props.event.number_of_periods}
            showRemainingChars={false}
            showCharsLimitReached={false}
            maxLength={99}
            kitmanDesignSystem
            data-testid="CommonFields|Periods"
          />
        )}
      </div>
      {customPeriodDurationFF && renderCustomPeriodDurationUI()}
      <div css={style.twoColumnGrid}>
        {!isFormatFixtureFieldsHidden && (
          <>
            <Select
              label={props.t('Format')}
              onChange={(value) => {
                setSelectedFormat(value);
                props.onUpdateEventDetails({ organisation_format_id: value });
              }}
              value={selectedFormat}
              options={formats}
              data-testid="GameFields|Format"
              isValid={props.eventValidity.organisation_format_id?.isInvalid}
            />
            <FixtureRatingSelect
              label={props.t('Fixture rating')}
              onChange={(value) => {
                props.onUpdateEventDetails({
                  organisation_fixture_rating_id: value,
                });
              }}
              value={props.event.organisation_fixture_rating_id}
              invalid={
                props.eventValidity.organisation_fixture_rating_id?.isInvalid
              }
              nDataLoadingStatusChanged={props.onDataLoadingStatusChanged}
              data-testid="GameFields|FixtureRating"
              isDisabled={false}
            />
          </>
        )}
        <EventConditionFieldsV2
          event={props.event}
          eventValidity={props.eventValidity}
          onUpdateEventDetails={props.onUpdateEventDetails}
          onDataLoadingStatusChanged={props.onDataLoadingStatusChanged}
        />
      </div>
      <div
        css={style.singleColumnGrid}
        data-testid="GameFields|DescriptionField"
      >
        <DescriptionField
          description={props.event.description}
          onUpdateEventDetails={props.onUpdateEventDetails}
          maxLength={250}
        />
      </div>
    </div>
  );
};

export const GameFieldsV2Translated: ComponentType<Props> =
  withNamespaces()(GameFieldsV2);
export default GameFieldsV2;
