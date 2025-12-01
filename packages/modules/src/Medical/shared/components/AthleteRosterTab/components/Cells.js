// @flow
import type { Node } from 'react';
import uuid from 'uuid';
import {
  TextLink,
  UserAvatar,
  AvailabilityLabel,
  EllipsisTooltipText,
  TextTag,
} from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import severityLabelColour from '@kitman/common/src/utils/severityLabelColour';

import { LatestNoteTranslated as LatestNote } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/LatestNote';
import { OpenIssuesTranslated as OpenIssues } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/OpenIssues';

import type { RosterAthlete, Allergy } from '../types';

import { cellStyle, headerStyle } from '../../CommonGridStyle';

type Props = {
  athlete: RosterAthlete,
};

export const AthleteCell = (props: Props): Node => {
  return (
    <div css={headerStyle.athleteCell}>
      <div css={headerStyle.imageContainer}>
        <UserAvatar
          url={props.athlete.athlete.avatar_url}
          firstname={props.athlete.athlete.fullname}
          displayInitialsAsFallback
          size="MEDIUM"
        />
      </div>
      <div css={headerStyle.detailsContainer}>
        <TextLink
          text={props.athlete.athlete.fullname}
          href={`/medical/athletes/${props.athlete.id}`}
          kitmanDesignSystem
        />
      </div>
    </div>
  );
};

export const AvailabilityStatusCell = (props: Props): Node => {
  return (
    <div css={headerStyle.availabilityStatus}>
      <AvailabilityLabel
        status={props.athlete.availability_status.availability}
      />
      {props.athlete.availability_status.availability !== 'available' ? (
        <span css={headerStyle.unavailableSince}>
          {props.athlete.availability_status.unavailable_since}
        </span>
      ) : null}
    </div>
  );
};

export const LatestNoteCell = (props: Props): Node => {
  return props.athlete.latest_note ? (
    <LatestNote latestNote={props.athlete.latest_note} />
  ) : null;
};

export const OpenIssuesCell = (props: Props): Node => {
  return (
    <OpenIssues
      athleteId={props.athlete.id}
      hasMore={props.athlete.open_injuries_illnesses.has_more}
      openIssues={props.athlete.open_injuries_illnesses.issues}
    />
  );
};

export const SquadCell = (props: Props): Node => {
  const squadNames = props.athlete.squad
    .map((squad) => (squad.primary ? `${squad.name}*` : squad.name))
    .join(', ');
  return (
    <div css={cellStyle.squads}>
      <EllipsisTooltipText content={squadNames} displayEllipsisWidth={280} />
    </div>
  );
};

export const AlergiesCell = (props: Props): Node => {
  const allergyObjectType = (allergy: Allergy) => (
    <div key={allergy.id} css={cellStyle.athleteAllergy}>
      <TextTag
        content={allergy.display_name}
        backgroundColor={severityLabelColour(allergy.severity)}
        textColor={
          allergy.severity === 'severe' ? colors.white : colors.grey_400
        }
        fontSize={12}
      />
    </div>
  );

  const allergyStringType = (allergy: string) => {
    return (
      <div key={uuid()} css={cellStyle.athleteAllergy}>
        <TextTag
          content={allergy}
          backgroundColor={colors.red_300}
          textColor={colors.white}
        />
      </div>
    );
  };

  return props.athlete.allergies && props.athlete.allergies.length > 0 ? (
    <div css={cellStyle.athleteAllergies}>
      {props.athlete.allergies.map((allergy) => {
        if (typeof allergy === 'object') {
          return allergyObjectType(allergy);
        }
        if (typeof allergy === 'string') {
          return allergyStringType(allergy);
        }
        return null;
      })}
    </div>
  ) : null;
};

type HeaderProps = {
  title: string,
};

export const DefaultHeaderCell = (props: HeaderProps): Node => {
  return (
    <div css={headerStyle.headerCell}>
      <span>{props.title}</span>
    </div>
  );
};
