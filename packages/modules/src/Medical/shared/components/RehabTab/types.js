// @flow
import type { Annotation } from '@kitman/common/src/types/Annotation';

export type RehabMode =
  | 'DEFAULT'
  | 'COPY_TO_MODE'
  | 'LINK_TO_MODE'
  | 'GROUP_MODE'
  | 'ADDING_TO_FIRST_SESSION';

export type RehabDayMode = '1_DAY' | '3_DAY' | '5_DAY' | '7_DAY' | 'MONTH_VIEW';
type OrganisationKey = 'parameter1' | 'parameter2' | 'parameter3';
export type RehabGroup = {
  scope?: 'Athlete' | 'Squad' | 'Injury' | 'Default',
  theme_colour: string,
  name: string,
  id: number,
  tagging_count: ?number,
};
export type CreateRehabGroup = {
  scope?: string,
  theme_colour: string,
  name: string,
};

export type RehabGroupHeading = {
  id: number,
  name: string,
  theme_colour: string,
};

export type exerciseVariationTemp = {
  key: string,
  param_key: OrganisationKey,
  type: string,
  label: string,
  value: string,
  unit?: string,
  variations_default: {
    parameters: Array<exerciseVariationTemp>,
  },
};
export type ExerciseVariation = {
  parameters: Array<exerciseVariationTemp>,
};

export type VariationParameters = {
  ...exerciseVariationTemp,
};
// (previous_session_id, previous_section_id, session_id and section_id) these are all values we don't receive via BE but it is require for the service call when moving exercise between sessions/sections
export type Exercise = {
  id: number | string,
  exercise_instance_id?: number,
  exercise_template_id: number,
  exercise_name: string,
  reason: ?string,
  comment: ?string,
  previous_session_id?: number,
  previous_section_id?: number,
  session_id?: number,
  section_id?: number,
  order_index?: number, // order_index is used to pass the correct order to the BE service when dragging between sessions/sections
  variations: Array<ExerciseVariation>,
  type: 'exercise',
  defaultVariations: ExerciseVariation,
  maintenance?: boolean, // TRUE if exercise is a maintenance
  tags?: Array<RehabGroup>,
};

export type ExerciseTemplate = {
  ...Exercise,
  type: 'exerciseTemplate',
  exerciseId: number,
};

export type ExerciseVariationsFormat = {
  [string]: Array<VariationParameters>,
};

export type ActiveDraggingExercise = Exercise | ExerciseTemplate;

export type RehabSection = {
  id: number,
  title?: ?string,
  theme_color?: ?string,
  order_index: number,
  exercise_instances: Array<Exercise>,
  isPlaceholderSection?: boolean,
};

export type RehabMultipleDayView = {
  id: number,
  startDate: string,
  exercises: Array<Exercise>,
};

export type ExerciseCreationStructure = {
  exercise_template_id?: number,
  order_index: number,
  variations?: Array<ExerciseVariation>,
  comment: ?string,
  reason?: string,
};

export type RehabSession = {
  id: number,
  start_time: string,
  end_time: string,
  timezone?: string,
  title?: string,
  sections: Array<RehabSection>,
  annotations: Array<Annotation>,
  constraints?: {
    read_only: boolean,
  },
  isPlaceholderSession?: boolean, // If false this session is present on the backend
};

export type CommonUpdateDetails = {
  athlete_id: number,
  exercise_instance_id: ?(number | string),
  session_id: ?number,
  section_id: ?number,
  order_index: ?number,
  previous_section_id: ?number,
  previous_session_id: ?number,
  session_date?: string,
};

export type ExerciseUpdateDetails = CommonUpdateDetails & {
  exercise_template_id: ?number,
  variations: ?Array<ExerciseVariation>,
  comment: ?string,
};
export type ExerciseReasonUpdateDetails = CommonUpdateDetails & {
  reason: string,
};

export type OrganisationVariations = {
  [OrganisationKey]: Array<VariationParameters>,
};

export type UpdateRehabExercise = {
  issue_type?: string,
  issue_id?: number,
  maintenance: boolean,
  exercise_instances: Array<
    ExerciseUpdateDetails | ExerciseReasonUpdateDetails
  >,
};

export type ClickModeTargetDetails = {
  targetSessionId: number,
  targetSectionId: number,
};
