// @flow
import { forwardRef, useRef, useEffect, useState } from 'react';

import { axios } from '@kitman/common/src/utils/services';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import {
  areaSize,
  type EventActivityV2,
  type SportType,
} from '@kitman/common/src/types/Event';
import { type Principle } from '@kitman/common/src/types/Principles';
import { TextTag, TextButton, TooltipMenu } from '@kitman/components';
import {
  eventIntensityStyles,
  getIntensityTranslation,
} from '@kitman/common/src/utils/eventIntensity';
import { getPrincipleNameWithItems } from '@kitman/common/src/utils/planningEvent';
import { KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import { Stack, Modal } from '@kitman/playbook/components';
import { useIsMountedCheck, useEventTracking } from '@kitman/common/src/hooks';

import { ParticipantsCount } from './ParticipantsCount';
import { EditableLabel } from './EditableLabel';
import { inputTypes } from './EditableLabel/utils';

import style from './style';
import {
  EMPTY_TAGS_REGEXP,
  getAreaSizeLabel,
  getDiagramPlaceholder,
} from './utils';

export type PlanningTabActivityProps = I18nProps<{
  // `attributes`, `listeners` and `style` are needed for dnd-kit only.
  attributes?: Object,
  style?: Object,
  listeners?: { [string]: Function },

  // Printing-related.
  isInPrintView?: boolean,
  isInStackView?: boolean,
  areParticipantsDisplayed?: boolean,
  areNotesDisplayed?: boolean,

  // Principle-related.
  areCoachingPrinciplesEnabled: boolean,
  arePrinciplesEdited?: boolean,
  panelOpenerId?: ?number,
  draggedPrinciple?: ?Principle,
  newPrinciple?: ?Principle,
  onOpenPrinciples?: () => void,
  onAlreadyAddedPrinciple?: (name: string) => void,

  // Activity- and drill-related.
  isDragged?: boolean,
  isLoading?: boolean,
  isNew?: boolean,
  activityIndex: number,
  activity?: ?EventActivityV2,
  organisationSport?: SportType,
  onOpenDrill?: () => void,
  onActivityUpdate?: (EventActivityV2) => void,
  onDeleteActivity?: () => void,

  // Athletes- and staff-related.
  onOpenTab?: (tabHash: string) => void,
}>;

const inputs = {
  OrderLabel: 'OrderLabel',
  Duration: 'Duration',
  Note: 'Notes',
  AreaSize: 'AreaSize',
  Principles: 'Principles',
};
type Inputs = $Values<typeof inputs>;

export const PlanningTabActivity = forwardRef<
  PlanningTabActivityProps,
  HTMLDivElement
>(
  (
    props: PlanningTabActivityProps,
    ref: { current: null | HTMLDivElement } | ((null | HTMLDivElement) => any)
  ) => {
    const { trackEvent } = useEventTracking();
    const checkIsMounted = useIsMountedCheck();

    const [activity, setActivity] = useState<?$Shape<EventActivityV2>>(
      props.activity
    );
    const drill = activity?.event_activity_drill;
    const drillIntensityStyles = eventIntensityStyles[drill?.intensity ?? ''];
    const orderLabel =
      activity?.order_label ??
      // + 1 so the minimal number in an auto-generated order label is 1.
      (props.activityIndex + 1).toString();

    const [isDurationEdited, setDurationEdited] = useState<boolean>(false);
    const isDurationSet = typeof activity?.duration === 'number';
    const canDurationBeAdded = !(isDurationSet || isDurationEdited);

    const [isAreaSizeEdited, setAreaSizeEdited] = useState<boolean>(false);
    const isAreaSizeSet = typeof activity?.area_size === 'string';
    const canAreaSizeBeAdded = !(isAreaSizeSet || isAreaSizeEdited);

    const [isNoteEdited, setNoteEdited] = useState<boolean>(false);
    const isNoteSet = typeof activity?.note === 'string';
    const canNoteBeAdded = !(isNoteSet || isNoteEdited);

    const arePrinciplesSet =
      Array.isArray(activity?.principles) && activity?.principles.length > 0;
    const canPrinciplesBeAdded =
      !(arePrinciplesSet || props.arePrinciplesEdited) &&
      props.areCoachingPrinciplesEnabled;
    const [isPrincipleTarget, setIsPrincipleTarget] = useState<boolean>(false);

    const [isNew, setIsNew] = useState<boolean>(false);
    useEffect(() => setIsNew(props.isNew ?? false), []);

    const canAddActivityInfo = [
      canDurationBeAdded,
      canAreaSizeBeAdded,
      canNoteBeAdded,
      canPrinciplesBeAdded,
    ].some(Boolean);

    const [drillDescriptionText, setDrillDescriptionText] =
      useState<string>('');

    useEffect(() => {
      const text = drill?.notes;
      if (!text) {
        return;
      }
      const textWithoutEmptyTags = text.replace(EMPTY_TAGS_REGEXP, '');
      const hasUserInput = textWithoutEmptyTags !== '';
      if (!hasUserInput) {
        return;
      }
      setDrillDescriptionText(text);
    }, [drill?.notes]);

    const drillDescriptionRef = useRef<?HTMLDivElement>(null);

    useEffect(() => {
      const el = drillDescriptionRef?.current;
      if (el && el.innerHTML !== drillDescriptionText) {
        // drillDescriptionText is rich text.
        el.innerHTML = drillDescriptionText;
      }
    }, [drillDescriptionText, props.areNotesDisplayed]);

    const [diagramSrc, setDiagramSrc] = useState<?(string | ArrayBuffer)>();
    const [isDiagramOpen, setIsDiagramOpen] = useState(false);

    useEffect(() => {
      const manageDiagramSrc = async () => {
        if (!(props.isInPrintView && drill?.diagram?.url) && checkIsMounted()) {
          setDiagramSrc(
            drill?.diagram?.url ??
              getDiagramPlaceholder(props.organisationSport ?? '')
          );
          return;
        }

        if (!drill?.diagram?.url) return;

        // If a drill is printed, its diagram must be fetched, encoded as
        // Base64, and put as `src` of <img />. Otherwise the diagram is
        // displayed in printing preview but isn’t actually printed.
        const reader = new FileReader();
        reader.onload = () => {
          if (!checkIsMounted()) return;

          setDiagramSrc(reader?.result);
        };
        let data;
        try {
          const response = await axios.get(drill.diagram.url, {
            responseType: 'blob',
          });
          data = response.data;
        } catch {
          return;
        }

        reader.readAsDataURL(data);
      };
      manageDiagramSrc();
    }, []);

    const onSubmit = (value: string, input: Inputs) => {
      setActivity((prev) => {
        const newActivity: $Shape<EventActivityV2> = { ...prev };

        let principles = newActivity.principles;
        const principleIndex = principles?.findIndex(
          ({ id }) => id === Number.parseInt(value, 10)
        );
        const isPrincipleAdded = principleIndex > -1;

        if (!props.onActivityUpdate) {
          return newActivity;
        }
        let inputType = '';
        switch (input) {
          case inputs.OrderLabel:
            newActivity.order_label = value || null;
            inputType = 'order label';
            break;
          case inputs.Duration:
            setDurationEdited(false);
            newActivity.duration = Number.parseInt(value, 10) || null;
            inputType = 'duration';
            break;
          case inputs.Note:
            setNoteEdited(false);
            newActivity.note = value || null;
            inputType = 'note';
            break;
          case inputs.AreaSize:
            setAreaSizeEdited(false);
            newActivity.area_size = value;
            inputType = 'area size';
            break;
          case inputs.Principles:
            if (isPrincipleAdded && !props.draggedPrinciple) {
              principles = principles.filter(
                ({ id }) => id !== Number.parseInt(value, 10)
              );
            }
            if (!isPrincipleAdded && props.draggedPrinciple) {
              principles.push(props.draggedPrinciple);
            }
            if (!isPrincipleAdded && props.newPrinciple) {
              principles.push(props.newPrinciple);
            }
            newActivity.principles = principles;
            inputType = 'principles';
            break;
          default:
            throw new Error('unknown input type');
        }
        props.onActivityUpdate(newActivity);
        const isInputTypePlural = inputType[inputType.length - 1] === 's';
        trackEvent(
          `Calendar — Session details — Planning tab — Change${
            isInputTypePlural ? '' : ' a'
          } drill’s ${inputType}`
        );
        return newActivity;
      });
    };

    useEffect(() => {
      const principles = activity?.principles;
      const newPrincipleId = props.newPrinciple?.id;
      if (
        newPrincipleId &&
        principles &&
        props.panelOpenerId === activity?.id
      ) {
        const principleIndex = principles.findIndex(
          ({ id }) => id === newPrincipleId
        );
        if (principleIndex > -1) {
          props.onAlreadyAddedPrinciple?.(principles[principleIndex].name);
          return;
        }
        onSubmit(newPrincipleId.toString(), inputs.Principles);
      }
    }, [props.newPrinciple]);

    const onPointerUp = () => {
      const draggedPrincipleId = props.draggedPrinciple?.id;
      const principles = activity?.principles;
      if (draggedPrincipleId && principles) {
        const principleIndex = principles.findIndex(
          ({ id }) => id === draggedPrincipleId
        );
        if (principleIndex > -1 && props.draggedPrinciple) {
          props.onAlreadyAddedPrinciple?.(props.draggedPrinciple.name);
        }
        onSubmit(draggedPrincipleId.toString(), inputs.Principles);
      }
    };

    const onPointerOver = () => {
      if (!props.draggedPrinciple) {
        return;
      }
      setIsPrincipleTarget(true);
    };

    const onPointerOut = () => setIsPrincipleTarget(false);

    const getPrintView = () => (
      <div
        ref={ref}
        style={{
          ...props.style,
          ...(typeof style.wrapper === 'function' && style.wrapper()),
        }}
        css={style.printedCardInStackView}
      >
        <img
          alt={props.t('Drill diagram')}
          src={diagramSrc}
          css={[
            style.drillDiagram,
            style.printedDrillDiagram,
            props.isInStackView && style.printedDrillDiagramInStackView,
          ]}
          onClick={props.onOpenDrill}
        />
        <div css={style.activityInfo}>
          <div
            css={[
              style.activityHeading,
              props.isInStackView && style.printedActivityHeadingInStackView,
            ]}
          >
            <span
              css={[
                style.drillName,
                props.isInStackView && style.printedDrillNameInStackView,
              ]}
              onClick={props.onOpenDrill}
            >
              {orderLabel && `${orderLabel} — `}
              {drill?.name || props.t('No drill name used')}
            </span>
            <span css={[style.drillTags, style.printedDrillTags]}>
              {drill?.intensity && (
                <TextTag
                  content={getIntensityTranslation(drill.intensity, props.t)}
                  displayEllipsisWidth={200}
                  fontSize={14}
                  textColor={drillIntensityStyles.color}
                  backgroundColor={drillIntensityStyles.backgroundColor}
                />
              )}
              <TextTag
                content={
                  activity?.event_activity_type?.name ||
                  props.t('No activity type selected')
                }
                displayEllipsisWidth={200}
                fontSize={14}
              />
            </span>
            <div css={style.printedDurationAndNotesLabels}>
              <span
                css={
                  !(activity?.duration && isDurationSet) && style.emptyDuration
                }
              >
                <b>{props.t('Duration')}</b>
                {activity?.duration && isDurationSet && (
                  <>
                    <b>: </b>
                    {activity.duration} {props.t('mins')}
                  </>
                )}
              </span>
              {!props.isInStackView && (
                <span>{props.t('Coachings notes')}</span>
              )}
            </div>
          </div>
          {props.areNotesDisplayed && (drillDescriptionText || isNoteSet) && (
            <div
              css={[
                style.printedDescriptionAndNote,
                props.isInStackView &&
                  style.printedDescriptionAndNoteInStackView,
              ]}
            >
              <div
                css={[
                  style.drillDescription,
                  style.printedDrillDescription,
                  props.isInStackView &&
                    style.printedDrillDescriptionInStackView,
                ]}
                ref={drillDescriptionRef}
              />
              {props.isInStackView && (
                <span css={style.printedNotesTitleInStackView}>
                  {props.t('Coachings notes')}
                </span>
              )}
              <div css={style.printedNote}>{activity?.note}</div>
            </div>
          )}
          {activity?.principles &&
            activity.principles.length > 0 &&
            props.areCoachingPrinciplesEnabled && (
              <div css={style.principles}>
                <b>
                  {activity.principles.length > 1
                    ? props.t('Principles')
                    : props.t('Principle')}
                  :
                </b>{' '}
                {activity?.principles.map(({ id, name }) => (
                  <div key={id}>{name}</div>
                ))}
              </div>
            )}
          {props.areParticipantsDisplayed &&
            activity?.athletes &&
            activity.athletes.length > 0 && (
              <>
                <hr css={style.hr} />
                <div css={style.athletes}>
                  <b>
                    {activity?.athletes
                      .map(({ shortname }) => shortname)
                      .join(', ')}
                  </b>
                </div>
              </>
            )}
          {activity?.users && activity.users.length > 0 && (
            <>
              <hr css={style.hr} />
              <div css={style.staff}>
                <b>
                  {props.t('Staff')}:{' '}
                  {activity?.users
                    .map(
                      ({ firstname, lastname }) =>
                        `${firstname[0]}. ${lastname}`
                    )
                    .join(', ')}
                </b>
              </div>
            </>
          )}
        </div>
        {window.getFlag(
          'pac-sessions-session-plan-see-staff-and-athlete-numbers'
        ) && (
          <Stack
            sx={style.printedActivityParticipantsCounts}
            direction="column"
          >
            <ParticipantsCount
              icon={KITMAN_ICON_NAMES.PeopleOutlinedIcon}
              tooltip={props.t('Athlete participants')}
              {...activity?.participants?.athletes}
            />
            {window.getFlag('planning-selection-tab') && (
              <ParticipantsCount
                icon={KITMAN_ICON_NAMES.RecordVoiceOverOutlinedIcon}
                tooltip={props.t('Staff participants')}
                {...activity?.participants?.staff}
              />
            )}
          </Stack>
        )}
      </div>
    );

    if (props.isInPrintView) return getPrintView();

    return (
      <>
        <div
          ref={ref}
          style={{
            ...props.style,
            // style.wrapper is a function.
            // $FlowIgnore[not-a-function]
            // $FlowIgnore[prop-missing]
            ...style.wrapper(
              window.getFlag(
                'pac-sessions-session-plan-see-staff-and-athlete-numbers'
              )
                ? activity?.participants
                : {},
              props.isDragged
            ),
          }}
          css={[
            style.card,
            isNew && style.newCard,
            props.panelOpenerId === activity?.id && style.selectedCard,
            isNew && props.isLoading && style.loadingCard,
            isPrincipleTarget && style.principleTargetCard,
          ]}
          onMouseUp={onPointerUp}
          onMouseOver={onPointerOver}
          onMouseOut={onPointerOut}
          onTouchEnd={onPointerUp}
          onTouchMove={onPointerOver}
          onTouchCancel={onPointerOut}
          onFocus={onPointerOver}
          onBlur={onPointerOut}
          onClick={(e) => {
            if (e.currentTarget !== e.target) return;
            props.onOpenDrill?.();
          }}
        >
          {isNew && props.isLoading ? (
            props.t('Loading')
          ) : (
            <>
              <div css={style.dragHandleWrapper}>
                <span
                  {...props.attributes}
                  {...props.listeners}
                  css={[
                    style.dragHandle,
                    props.isDragged && style.pressedDragHandle,
                  ]}
                  className="icon-drag-handle"
                />
              </div>
              <img
                alt={props.t('Drill diagram')}
                src={diagramSrc}
                css={style.drillDiagram}
                onClick={() => setIsDiagramOpen(true)}
              />
              <div css={style.activityInfo}>
                <div css={style.orderLabel}>
                  {typeof orderLabel === 'string' && (
                    <EditableLabel
                      inputType={inputTypes.Input}
                      label={orderLabel}
                      name="order-label"
                      value={orderLabel}
                      onSubmit={(label) => onSubmit(label, inputs.OrderLabel)}
                    />
                  )}
                </div>
                <div
                  css={style.activityHeading}
                  onClick={(e) => {
                    if (e.currentTarget !== e.target) return;
                    props.onOpenDrill?.();
                  }}
                >
                  <span css={style.drillName} onClick={props.onOpenDrill}>
                    {drill?.name || props.t('No drill name used')}
                  </span>
                  <span css={style.drillTags} onClick={props.onOpenDrill}>
                    {drill?.intensity && (
                      <TextTag
                        content={getIntensityTranslation(
                          drill.intensity,
                          props.t
                        )}
                        displayEllipsisWidth={200}
                        fontSize={14}
                        textColor={drillIntensityStyles.color}
                        backgroundColor={drillIntensityStyles.backgroundColor}
                      />
                    )}
                    <TextTag
                      content={
                        activity?.event_activity_type?.name ||
                        props.t('No activity type selected')
                      }
                      displayEllipsisWidth={200}
                      fontSize={14}
                    />
                  </span>
                </div>
                {drillDescriptionText && <div ref={drillDescriptionRef} />}
                {!canDurationBeAdded && (
                  <div css={style.marginTop1}>
                    <EditableLabel
                      inputType={inputTypes.Input}
                      label={`${activity?.duration ?? ''} ${props.t('mins')}`}
                      editLabel={props.t('Duration (mins):')}
                      name="activity-duration"
                      value={activity?.duration?.toString()}
                      isEdited={isDurationEdited}
                      onSubmit={(duration) =>
                        onSubmit(duration, inputs.Duration)
                      }
                      onCancel={() => setDurationEdited(false)}
                      onOpenDrill={props.onOpenDrill}
                    />
                  </div>
                )}
                {!canNoteBeAdded && (
                  <div css={style.marginTop1}>
                    <EditableLabel
                      inputType={inputTypes.Textarea}
                      editLabel={props.t('Note:')}
                      name="activity-note"
                      value={activity?.note}
                      isEdited={isNoteEdited}
                      onSubmit={(note) => onSubmit(note, inputs.Note)}
                      onCancel={() => setNoteEdited(false)}
                      onOpenDrill={props.onOpenDrill}
                    />
                  </div>
                )}
                {!canAreaSizeBeAdded && (
                  <div css={style.marginTop1}>
                    <EditableLabel
                      inputType={inputTypes.Select}
                      label={props.t('{{sizeLabel}} area size', {
                        // $FlowIgnore getAreaSizeLabel returns a string
                        sizeLabel: getAreaSizeLabel(activity?.area_size),
                      })}
                      editLabel={props.t('Area size:')}
                      name="activity-area-size"
                      value={activity?.area_size}
                      isEdited={isAreaSizeEdited}
                      options={Object.values(areaSize).map((size) => ({
                        value: size,
                        label: props.t('{{sizeLabel}} area size', {
                          // $FlowIgnore getAreaSizeLabel returns a string
                          sizeLabel: getAreaSizeLabel(size),
                        }),
                      }))}
                      onSubmit={(size) => onSubmit(size, inputs.AreaSize)}
                      onCancel={() => setAreaSizeEdited(false)}
                      onOpenDrill={props.onOpenDrill}
                    />
                  </div>
                )}
                {!canPrinciplesBeAdded &&
                  props.areCoachingPrinciplesEnabled && (
                    <div
                      css={style.marginTop1}
                      onClick={(e) => {
                        if (e.currentTarget !== e.target) return;
                        props.onOpenDrill?.();
                      }}
                    >
                      <button
                        css={style.editPrinciplesButton}
                        type="button"
                        onClick={props.onOpenPrinciples}
                      >
                        <span>{props.t('Principles')}</span>
                        {!props.arePrinciplesEdited && (
                          <span className="icon-edit" />
                        )}
                      </button>
                      <div
                        css={style.principleTags}
                        onClick={(e) => {
                          if (e.currentTarget !== e.target) return;
                          props.onOpenDrill?.();
                        }}
                      >
                        {activity?.principles.map((principle) => (
                          <div css={style.principleTag} key={principle.id}>
                            <TextTag
                              content={getPrincipleNameWithItems(principle)}
                              closeable
                              onClose={() =>
                                onSubmit(
                                  principle.id.toString(),
                                  inputs.Principles
                                )
                              }
                              displayEllipsisWidth={Infinity}
                              wrapperCustomStyles={{ padding: '0 .25rem' }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                {canAddActivityInfo && (
                  <div
                    css={style.addActivityInfoButtons}
                    onClick={(e) => {
                      if (e.currentTarget !== e.target) return;
                      props.onOpenDrill?.();
                    }}
                  >
                    {props.t('Add')}:
                    {canDurationBeAdded && (
                      <TextButton
                        text={props.t('Duration')}
                        kitmanDesignSystem
                        onClick={() => setDurationEdited(true)}
                      />
                    )}
                    {canAreaSizeBeAdded && (
                      <TextButton
                        text={props.t('Area size')}
                        kitmanDesignSystem
                        onClick={() => setAreaSizeEdited(true)}
                      />
                    )}
                    {canNoteBeAdded && (
                      <TextButton
                        text={props.t('Note')}
                        kitmanDesignSystem
                        onClick={() => setNoteEdited(true)}
                      />
                    )}
                    {canPrinciplesBeAdded && (
                      <TextButton
                        text={props.t('Principles')}
                        kitmanDesignSystem
                        onClick={props.onOpenPrinciples}
                      />
                    )}
                  </div>
                )}
                <div css={style.menu}>
                  <TooltipMenu
                    placement="bottom-end"
                    menuItems={[
                      {
                        description: props.t('Remove from plan'),
                        onClick: props.onDeleteActivity,
                      },
                    ]}
                    tooltipTriggerElement={
                      <TextButton
                        kitmanDesignSystem
                        iconBefore="icon-menu"
                        type="secondary"
                      />
                    }
                    kitmanDesignSystem
                  />
                </div>
                {window.getFlag(
                  'pac-sessions-session-plan-see-staff-and-athlete-numbers'
                ) && (
                  <div
                    style={
                      typeof style.activityParticipantsCounts === 'function' &&
                      style.activityParticipantsCounts(activity?.participants)
                    }
                  >
                    <Stack direction="column">
                      <ParticipantsCount
                        icon={KITMAN_ICON_NAMES.PeopleOutlinedIcon}
                        tooltip={props.t('Athlete participants')}
                        {...activity?.participants?.athletes}
                        onClick={() => {
                          props.onOpenTab?.('#athlete_selection');
                          trackEvent('The number of drill athletes clicked');
                        }}
                      />
                      {window.getFlag('planning-selection-tab') && (
                        <ParticipantsCount
                          icon={KITMAN_ICON_NAMES.RecordVoiceOverOutlinedIcon}
                          tooltip={props.t('Staff participants')}
                          {...activity?.participants?.staff}
                          onClick={() => {
                            props.onOpenTab?.('#staff_selection');
                            trackEvent('The number of drill staff clicked');
                          }}
                        />
                      )}
                    </Stack>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <Modal open={isDiagramOpen} onClose={() => setIsDiagramOpen(false)}>
          <div css={style.openedDrillDiagramWrapper}>
            <img
              alt={props.t('Drill diagram')}
              src={diagramSrc}
              css={style.openedDrillDiagram}
              onClick={() => setIsDiagramOpen(false)}
            />
          </div>
        </Modal>
      </>
    );
  }
);
