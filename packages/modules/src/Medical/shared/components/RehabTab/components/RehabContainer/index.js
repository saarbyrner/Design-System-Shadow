// @flow
import moment from 'moment-timezone';
import type { ComponentType } from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { withNamespaces } from 'react-i18next';
import { useEffect, useState, useRef, useMemo } from 'react';
import {
  Checkbox,
  IconButton,
  TextButton,
  RichTextDisplay,
  RichTextEditor,
} from '@kitman/components';
import { updateAnnotation } from '@kitman/services';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { isDateInRange } from '@kitman/common/src/utils/dateRange';
import useMatchMediaQuery from '@kitman/common/src/hooks/useMatchMediaQuery';
import type { Annotation } from '@kitman/common/src/types/Annotation';
import type { RequestStatus } from '@kitman/common/src/types';
import type { NotesPermissions } from '@kitman/common/src/contexts/PermissionsContext/medical/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useGetAthleteDataQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';

import style from './style';
import ExerciseContainer from '../ExerciseContainer';
import RehabGroupHeaderPill from '../RehabGroupHeaderPill';

import type {
  RehabSection,
  RehabDayMode,
  RehabGroupHeading,
} from '../../types';
import type { IssueType } from '../../../../types';
import { useRehabDispatch } from '../../RehabContext';
import {
  ADD_REHAB_BUTTON,
  DELETE_REHAB_BUTTON,
  ADD_MEDICAL_NOTE_BUTTON,
} from '../../../../constants/elementTags';

type Props = {
  id: number,
  sections: Array<RehabSection>,
  startTime: string,
  issueOccurrenceDate: ?string,
  issueOccurrenceId?: number,
  issueType?: IssueType,
  rehabCopyMode: boolean,
  rehabGroupMode: boolean,
  linkToMode: boolean,
  rehabDayMode: RehabDayMode,
  athleteId: number,
  inMaintenance: boolean,
  highlightSession: boolean,
  notesPermissions: NotesPermissions,
  viewNotesToggledOn: boolean,
  readOnly: boolean,
  disabled: boolean,
  activeItem: ?number | ?string,
  annotations: Array<Annotation>,
  isPlaceholderSession: ?boolean,
  isEmptySession: boolean,
  hasManagePermission: boolean,
  onAddNoteClicked: Function,
  onNoteUpdated: Function,
  onAddRehabToSectionClicked: Function,
  callDeleteExercise: Function,
  callDeleteWholeSession: Function,
  hiddenFilters?: ?Array<string>,
};

const RehabContainer = (props: I18nProps<Props>) => {
  const editorRef = useRef(null);
  const wrapperElement = useRef(null);
  const [showMore, setShowMore] = useState(true);
  const [displayShowMore, setDisplayShowMore] = useState(false);
  const [rehabGroupsPresent, setRehabGroupsPresent] = useState<
    Array<RehabGroupHeading>
  >([]);
  const [localNote, setLocalNote] = useState<?string>(null);
  const [displayReasonInput, setDisplayReasonInput] = useState<boolean>(false);
  const isTouchInput = useMatchMediaQuery();
  const [updateNoteRequestStatus, setUpdateNoteRequestStatus] =
    useState<RequestStatus>(null);
  const [editNote, setEditNote] = useState(false);

  const { id, sections } = props;
  const [dateInformation, setDateInformation] = useState({
    formattedDate: '',
    day: '',
    dayOfInjury: null,
  });

  const { organisation } = useOrganisation();
  const isToday = moment(props.startTime).isSame(moment(), 'day');
  const { data: athleteData } = useGetAthleteDataQuery(props.athleteId, {
    skip: !props.athleteId,
  });
  const constraints = athleteData?.constraints;

  const dateIsAfterAllowedCreationDate = useMemo(() => {
    if (constraints) {
      return !isDateInRange(
        moment(props.startTime),
        constraints.active_periods
      );
    }
    return false;
  }, [props.startTime, constraints]);

  const dateIsBeforeAllowedCreationDate = useMemo(() => {
    if (constraints) {
      return !isDateInRange(
        moment(props.startTime),
        constraints.active_periods
      );
    }
    return false;
  }, [props.startTime, constraints]);

  const getLatestAnnotation = (annotations: Array<Annotation>): ?Annotation => {
    if (annotations.length < 1) {
      return null;
    }

    annotations.sort((a, b) => moment(b.updated_at).diff(a.updated_at));

    return annotations.find((annotation) => annotation.archived === false);
  };

  const [latestAnnotation, setLatestAnnotation] = useState(
    getLatestAnnotation(props.annotations.slice())
  );

  // Obtain the list of groups used in session column (only one group/tag associated with an exercise)
  useEffect(() => {
    const rehabGroups = [];
    sections[0]?.exercise_instances.forEach((exercise) => {
      if (exercise.tags && exercise.tags[0]) {
        rehabGroups.push({
          id: exercise.tags[0].id,
          name: exercise.tags[0].name,
          theme_colour: exercise.tags[0].theme_colour,
        });
      }
    });

    // Remove duplicates
    const rehabGroupsUnique: Object = Object.values(
      rehabGroups.reduce(
        (acc: RehabGroupHeading, obj: RehabGroupHeading) => ({
          ...acc,
          [obj?.name]: obj,
        }),
        {}
      )
    );

    setRehabGroupsPresent(rehabGroupsUnique);
  }, []);

  useEffect(() => {
    const dayIndexOffset = window.featureFlags['rehab-post-injury-day-index']
      ? 1
      : 0;

    setDateInformation({
      formattedDate: DateFormatter.formatShortOrgLocale(
        moment(props.startTime),
        organisation.locale,
        false
      ),
      day: moment(props.startTime).format('dddd'),
      dayOfInjury: props.issueOccurrenceDate
        ? moment(props.startTime)
            .startOf('day')
            .diff(moment(props.issueOccurrenceDate).startOf('day'), 'days') +
          dayIndexOffset
        : null,
    });
  }, [id, props.startTime, props.issueOccurrenceDate, organisation.locale]);

  useEffect(() => {
    if (wrapperElement.current) {
      // Only display the show more button when the rich text is abbreviated, copying the ref from the RichTextDisplay component
      setDisplayShowMore(wrapperElement.current.offsetHeight > 50);
    }
  }, [props.annotations, localNote]);

  useEffect(() => {
    const latest = getLatestAnnotation(props.annotations.slice());
    setLatestAnnotation(latest);
    setLocalNote(latest?.content);
  }, [props.annotations]);

  const checkSectionHasAnExercise = sections.find(
    (section) => section.exercise_instances.length > 0
  );

  const { dispatch, copyExerciseIds, linkExerciseIds } = useRehabDispatch();

  const allItemsChecked = sections.every((section) =>
    section.exercise_instances.every((exercise) =>
      props.rehabCopyMode
        ? copyExerciseIds.includes(exercise.id)
        : linkExerciseIds.includes(exercise.id)
    )
  );

  const cancelEditDayNote = () => {
    setLocalNote(latestAnnotation?.content);
    setEditNote(false);
  };

  const editDayNote = () => {
    setEditNote(true);
  };

  const saveDayNote = () => {
    if (!latestAnnotation) {
      return;
    }

    if (localNote) {
      setUpdateNoteRequestStatus('PENDING');
      if (latestAnnotation.id != null) {
        updateAnnotation(
          {
            content: localNote || '',
            rehab_session_ids: props.isPlaceholderSession ? [] : [props.id],
          },
          latestAnnotation.id
        )
          .then(() => {
            setEditNote(false);
            props.onNoteUpdated();
            setUpdateNoteRequestStatus('SUCCESS');
          })
          .catch(() => {
            setUpdateNoteRequestStatus('FAILURE');
          });
      }
    }
  };

  const getCustomFooterContent = () => {
    if (dateIsBeforeAllowedCreationDate || props.readOnly) {
      return (
        <div
          css={style.transferMessage}
          data-testid="RehabSection|TransferMessage"
        >
          {props.t(
            dateIsBeforeAllowedCreationDate
              ? 'Rehab sessions cannot be edited until after the date of transfer'
              : 'Read-only rehab session'
          )}
        </div>
      );
    }
    return undefined;
  };

  const showDayOfInjury =
    dateInformation.dayOfInjury != null &&
    dateInformation.dayOfInjury >
      (window.featureFlags['rehab-post-injury-day-index'] ? 0 : -1);

  // TODO: Check box isn't accessible
  return (
    <div
      css={
        props.highlightSession
          ? [style.dayDisplay, style.hoverColumn]
          : style.dayDisplay
      }
    >
      <div
        css={
          props.highlightSession
            ? [style.dayInformationHeader, style.hoverColumn]
            : style.dayInformationHeader
        }
        data-testid="RehabSection|SessionHeader"
      >
        <div css={style.dayActionButtons}>
          {props.hasManagePermission &&
            !dateIsBeforeAllowedCreationDate &&
            !dateIsAfterAllowedCreationDate &&
            !props.rehabCopyMode &&
            !props.rehabGroupMode &&
            !props.linkToMode &&
            !props.hiddenFilters?.includes(ADD_REHAB_BUTTON) && (
              <div
                css={style.headerActionButton}
                data-testid="RehabSection|AddRehab"
                className="headerActionButton"
              >
                <IconButton
                  onClick={() => {
                    props.onAddRehabToSectionClicked({
                      targetSessionId: props.id,
                      targetSectionId: props.sections[0].id,
                    });
                  }}
                  icon="icon-add"
                  isSmall
                  tabIndex={-1}
                  isBorderless
                  isTransparent
                  isDarkIcon
                  isDisabled={!(props?.sections?.length > 0)}
                />

                {window.featureFlags['rehab-maintenance-reason'] &&
                  !!sections[0]?.exercise_instances.length && (
                    <IconButton
                      onClick={() => {
                        setDisplayReasonInput(true);
                      }}
                      icon="icon-add-reason-exercise"
                      isSmall
                      tabIndex={-1}
                      isBorderless
                      isTransparent
                      isDarkIcon
                      isDisabled={!(props.sections?.length > 0)}
                    />
                  )}
              </div>
            )}

          {!dateIsBeforeAllowedCreationDate &&
            !dateIsAfterAllowedCreationDate &&
            window.featureFlags['rehab-note'] &&
            props.notesPermissions.canCreate &&
            !props.rehabCopyMode &&
            !props.rehabGroupMode &&
            !props.linkToMode &&
            !props.hiddenFilters?.includes(ADD_MEDICAL_NOTE_BUTTON) && (
              <div
                css={style.headerActionButton}
                data-testid="RehabSection|CreateNote"
                className="headerActionButton"
              >
                <IconButton
                  icon="icon-note"
                  isSmall
                  isBorderless
                  isTransparent
                  isDarkIcon
                  tabIndex={-1}
                  onClick={props.onAddNoteClicked}
                  isDisabled={updateNoteRequestStatus === 'PENDING'}
                />
              </div>
            )}
          {props.hasManagePermission &&
            !dateIsBeforeAllowedCreationDate &&
            !dateIsAfterAllowedCreationDate &&
            !props.isEmptySession &&
            !props.rehabCopyMode &&
            !props.rehabGroupMode &&
            !props.linkToMode &&
            !props.isPlaceholderSession &&
            !props.hiddenFilters?.includes(DELETE_REHAB_BUTTON) && (
              <div
                css={style.headerActionButton}
                data-testid="RehabSection|DeleteDay"
                className="headerActionButton"
              >
                <IconButton
                  onClick={() => {
                    props.callDeleteWholeSession(id, dateInformation.day);
                  }}
                  icon="icon-bin"
                  isSmall
                  isBorderless
                  tabIndex={-1}
                  isTransparent
                  isDarkIcon
                />
              </div>
            )}
          {!dateIsAfterAllowedCreationDate &&
            (props.rehabCopyMode || props.linkToMode) &&
            checkSectionHasAnExercise && (
              <div css={style.selectAll} data-testid="RehabSection|CopySection">
                <Checkbox
                  id="copy-section"
                  name="copy-section"
                  isChecked={allItemsChecked}
                  toggle={({ checked }) => {
                    // eslint-disable-next-line no-unused-expressions
                    props.rehabCopyMode
                      ? dispatch?.({
                          type: 'ADD_EXERCISE_SESSION_TO_COPY_ARRAY',
                          sessionId: props.id,
                          exercisesSelected: checked,
                        })
                      : dispatch?.({
                          type: 'ADD_EXERCISE_SESSION_TO_LIST_ARRAY',
                          sessionId: props.id,
                          exercisesSelected: checked,
                        });
                  }}
                  kitmanDesignSystem
                />
              </div>
            )}
        </div>
        <div css={style.dayInformation}>
          {showDayOfInjury && dateInformation.dayOfInjury != null && (
            <p css={style.dayOfInjury} data-testid="RehabSection|DayOfInjury">
              {props.t('Day {{dayNumber}}', {
                dayNumber: dateInformation.dayOfInjury,
              })}
            </p>
          )}
          <h6
            css={isToday ? style.dayHeaderToday : style.dayHeader}
            data-testid="RehabSection|Day"
          >
            {dateInformation.formattedDate}
          </h6>

          {window.featureFlags['rehab-groups'] &&
            rehabGroupsPresent?.map(
              (section) =>
                section.name && <RehabGroupHeaderPill section={section} />
            )}
        </div>
      </div>
      {window.featureFlags['rehab-note'] && latestAnnotation != null && (
        <div data-testid="RehabSection|DayNote">
          {props.notesPermissions.canView &&
            props.viewNotesToggledOn &&
            !editNote && (
              <div css={style.noteDisplay}>
                {localNote !== null && (
                  <div>
                    <section css={style.noteWrapper} ref={wrapperElement}>
                      <RichTextDisplay
                        value={localNote}
                        isAbbreviated={showMore}
                      />
                    </section>
                    {displayShowMore && (
                      <div>
                        <TextButton
                          type="textOnly"
                          text={props.t('Show {{value}}', {
                            value: showMore ? 'more' : 'less',
                          })}
                          onClick={() => setShowMore(!showMore)}
                          kitmanDesignSystem
                        />
                      </div>
                    )}
                  </div>
                )}
                {!dateIsBeforeAllowedCreationDate &&
                  props.notesPermissions.canEdit && (
                    <IconButton
                      onClick={editDayNote}
                      icon="icon-edit"
                      isSmall
                      isTransparent
                    />
                  )}
              </div>
            )}

          {props.notesPermissions.canEdit &&
            props.viewNotesToggledOn &&
            editNote &&
            !dateIsBeforeAllowedCreationDate && (
              <>
                <div css={style.editNoteButtons}>
                  <TextButton
                    text={props.t('Cancel')}
                    type="secondary"
                    kitmanDesignSystem
                    onClick={cancelEditDayNote}
                    isDisabled={updateNoteRequestStatus === 'PENDING'}
                  />
                  <TextButton
                    text={props.t('Save')}
                    type="primary"
                    kitmanDesignSystem
                    onClick={saveDayNote}
                    isDisabled={updateNoteRequestStatus === 'PENDING'}
                  />
                </div>
                <RichTextEditor
                  onChange={(content) => {
                    setLocalNote(content);
                  }}
                  value={localNote || ''}
                  isDisabled={props.disabled}
                  forwardedRef={editorRef}
                  kitmanDesignSystem
                />
              </>
            )}
        </div>
      )}
      <div
        css={style.AllDroppableContainers}
        data-rehab_container_type="sections_container"
        data-testid={
          props.disabled
            ? 'sections_container|disabled'
            : 'sections_container|active'
        }
      >
        {sections.map((section) => (
          <SortableContext
            id={section.id}
            key={section.id}
            items={section.exercise_instances}
            strategy={verticalListSortingStrategy}
            disabled={{
              draggable: props.disabled,
              droppable: props.disabled,
            }}
          >
            <ExerciseContainer
              id={section.id}
              sessionStartTime={props.startTime}
              displayReasonInput={displayReasonInput}
              onDoneAddingReason={() => {
                setDisplayReasonInput(false);
              }}
              sessionId={props.id}
              issueOccurrenceId={props.issueOccurrenceId}
              issueType={props.issueType}
              activeItem={props.activeItem}
              exercises={section.exercise_instances}
              inMaintenance={props.inMaintenance}
              athleteId={props.athleteId}
              disabled={
                props.disabled ||
                dateIsBeforeAllowedCreationDate ||
                dateIsAfterAllowedCreationDate
              }
              readOnlyExercises={
                props.readOnly ||
                dateIsBeforeAllowedCreationDate ||
                dateIsAfterAllowedCreationDate
              }
              customFooter={getCustomFooterContent()}
              rehabCopyMode={props.rehabCopyMode}
              rehabGroupMode={props.rehabGroupMode}
              linkToMode={props.linkToMode}
              rehabDayMode={props.rehabDayMode}
              callDeleteExercise={props.callDeleteExercise}
              hasManagePermission={props.hasManagePermission}
              isTouchInput={isTouchInput}
              hiddenFilters={props.hiddenFilters}
            />
          </SortableContext>
        ))}
      </div>
    </div>
  );
};

export const RehabContainerTranslated: ComponentType<Props> =
  withNamespaces()(RehabContainer);
export default RehabContainer;
