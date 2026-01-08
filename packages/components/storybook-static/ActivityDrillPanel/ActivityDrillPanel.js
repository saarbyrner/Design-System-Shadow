// @flow
import { useRef, useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';

import {
  Checkbox,
  FileUploadField,
  InputText,
  RichTextEditor,
  Select,
  SlidingPanelResponsive,
  TextButton,
  SegmentedControl,
  TextTag,
  InputTextField,
  FileUploadArea,
  Accordion,
} from '@kitman/components';
import { fitContentMenuCustomStyles } from '@kitman/components/src/Select';
import { imageFileTypes } from '@kitman/common/src/utils/mediaHelper';
import {
  intensities,
  type Event,
  type EventActivityDrillV2,
  type EventActivityDrillLinkV2,
} from '@kitman/common/src/types/Event';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { errors, colors } from '@kitman/common/src/variables';
import {
  eventIntensityStyles,
  getIntensityTranslation,
} from '@kitman/common/src/utils/eventIntensity';
import type { Squad } from '@kitman/services/src/services/getSquads';
import type { Principle } from '@kitman/common/src/types/Principles';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import getDrillLabels from '@kitman/modules/src/PlanningHub/src/services/getDrillLabels';
import {
  searchLabels,
  searchPrinciples,
  type Label,
} from '@kitman/services/src/services/planning';
import type { ActivityType } from '@kitman/modules/src/PlanningHub/src/services/getActivityTypes';
import type { LibraryDrillToUpdate } from '@kitman/modules/src/PlanningEvent/types';
import { getPrincipleNameWithItems } from '@kitman/common/src/utils/planningEvent';

import style from './style';

type Props = {
  areCoachingPrinciplesEnabled: boolean,
  drill: EventActivityDrillV2,
  initialDrillState: EventActivityDrillV2,
  drillPrinciples: Array<Principle>,
  eventActivityTypes: Array<ActivityType>,
  event: Event,
  activityNameInputInvalidityReason: string,
  canRestoreFromArchive: boolean,
  isOpen: boolean,
  onClose: () => void,
  onComposeActivityDrill: (LibraryDrillToUpdate) => void,
  setLibraryDrillToUpdate: (LibraryDrillToUpdate) => void,
  setSelectedDrill: (drill: EventActivityDrillV2) => void,
};

export const INITIAL_DRILL_ATTRIBUTES = {
  id: -1,
  name: '',
  sets: null,
  reps: null,
  rest_duration: null,
  pitch_width: null,
  pitch_length: null,
  notes: '<p><br></p>',
  diagram: null,
  links: [],
  event_activity_drill_labels: [],
  event_activity_drill_label_ids: [],
  event_activity_type: {
    id: -1,
    name: '',
    squads: [],
  },
  event_activity_type_id: '',
  principle_ids: [],
  intensity: '',
  library: false,
};

const INITIAL_LINK = {
  uri: '',
  title: '',
};

const ActivityDrillPanel = (props: I18nProps<Props>) => {
  const isMounted = useRef<boolean>(false);

  const [requestStatus, setRequestStatus] = useState<
    'LOADING' | 'SUCCESS' | 'FAILED'
  >('LOADING');
  const [diagram, setDiagram] = useState<?AttachedFile>(null);
  const [allLabels, setAllLabels] = useState<Array<Label>>([]);
  const [allPrinciples, setAllPrinciples] = useState<Array<Principle>>([]);
  const [isEditingDescription, setIsEditingDescription] =
    useState<boolean>(false);
  const [isActivityNameInputValid, setActivityNameInputValid] =
    useState<boolean>(true);
  const [isActivityTypeInputValid, setActivityTypeInputValid] =
    useState<boolean>(true);
  const [isSquadsInputValid, setSquadsInputValid] = useState<boolean>(true);
  const [link, setLink] = useState<EventActivityDrillLinkV2>(INITIAL_LINK);
  const [attachments, setAttachments] = useState<Array<AttachedFile>>([]);

  const getInitialActivityTypeSquads = (): Array<Squad> =>
    props.eventActivityTypes.find(
      ({ id }) => id === props.initialDrillState?.event_activity_type?.id
    )?.squads ?? [];

  const [activityTypeSquads, setActivityTypeSquads] = useState<Array<Squad>>(
    getInitialActivityTypeSquads()
  );

  useEffect(() => {
    setActivityTypeSquads(getInitialActivityTypeSquads());
  }, [props.drill.event_activity_type?.id]);

  useEffect(() => {
    // squad_ids is the field which is used for requests and not available in
    // back-end responses, so its presence means that the code in this
    // callback has been run already and there is no need to run it again.
    if (props.drill.squad_ids) return;
    // $FlowIgnore[incompatible-call] values are present in `d` as it’s a previous state.
    props.setSelectedDrill((d) => ({
      ...d,
      squad_ids:
        props.initialDrillState.squads?.map(({ id }) => id) ??
        activityTypeSquads.map(({ id }) => id),
      principle_ids:
        props.initialDrillState.principles?.map(({ id }) => id) ?? [],
      event_activity_drill_labels:
        props.initialDrillState.event_activity_drill_labels,
    }));
  }, [props.drill.squad_ids, props.initialDrillState]);

  useEffect(() => {
    const getNewPrincipleIds = () => {
      if (
        props.drill.event_activity_type?.id &&
        !props.drill?.event_activity_type_id
      ) {
        return props.initialDrillState.principles?.map(({ id }) => id) ?? [];
      }
      return [];
    };

    const getNewLabels = () => {
      if (
        props.drill.event_activity_type?.id &&
        !props.drill?.event_activity_type_id
      ) {
        return props.initialDrillState.event_activity_drill_labels;
      }
      return [];
    };

    // $FlowIgnore[incompatible-call] values are present in `d` as it’s a previous state.
    props.setSelectedDrill((d) => ({
      ...d,
      // Truthines of d.event_activity_type_id means that the chosen activity
      // type has been changed which means the default squad selection must be
      // all the squads available to the chosen type; otherwise the initial
      // (previous) squad selection must be taken.
      squad_ids: d?.event_activity_type_id
        ? activityTypeSquads.map(({ id }) => id)
        : d?.squad_ids,
      principle_ids: getNewPrincipleIds(),
      event_activity_drill_labels: getNewLabels(),
    }));
  }, [activityTypeSquads]);

  const getSquadsLabel = (): string =>
    activityTypeSquads
      .filter((squad) => props.drill.squad_ids?.some((id) => squad.id === id))
      .map(({ name }) => name)
      .join(', ');

  useEffect(() => {
    isMounted.current = true;

    const fetchAndSetLabels = async () => {
      let labels;

      let didRequestFail = false;
      try {
        if (window.getFlag('drill-assignment-by-squad')) {
          labels = await searchLabels({
            squadIds: props.drill.squad_ids,
          });
        } else {
          labels = await getDrillLabels(true);
        }
      } catch {
        didRequestFail = true;
      }

      if (!isMounted.current) {
        return;
      }

      if (didRequestFail) {
        setRequestStatus('FAILED');
        return;
      }

      setRequestStatus('SUCCESS');
      setAllLabels(labels ?? []);
    };

    const fetchAndSetPrinciples = async () => {
      let principles;

      let didRequestFail = false;
      try {
        principles = await searchPrinciples({
          squadIds: props.drill.squad_ids,
        });
      } catch {
        didRequestFail = true;
      }

      if (!isMounted.current) {
        return;
      }

      if (didRequestFail) {
        setRequestStatus('FAILED');
        return;
      }

      setRequestStatus('SUCCESS');
      setAllPrinciples(principles ?? []);
    };

    fetchAndSetLabels();
    if (props.areCoachingPrinciplesEnabled) fetchAndSetPrinciples();

    return () => {
      isMounted.current = false;
    };
  }, [props.drill.squad_ids]);

  useEffect(() => {
    if (requestStatus !== 'FAILED') {
      setRequestStatus('SUCCESS');
    }
  }, [props.isOpen]);

  useEffect(() => {
    setRequestStatus('SUCCESS');
    setActivityNameInputValid(Boolean(props.activityNameInputInvalidityReason));
  }, [props.activityNameInputInvalidityReason]);

  const getActivityNameInputInvalidityMessage = () => {
    if (
      props.activityNameInputInvalidityReason ===
      errors.NAME_HAS_BEEN_TAKEN_ERROR.message
    ) {
      return 'A drill with the same name already exists in the library. Please enter a different name';
    }
    return '';
  };

  const onClosePanel = () => {
    setIsEditingDescription(false);
    setLink(INITIAL_LINK);
    props.setSelectedDrill(INITIAL_DRILL_ATTRIBUTES);
    props.onClose();
  };

  const isActivityNameRequired =
    !props.initialDrillState.archived &&
    props.drill.library &&
    window.getFlag('coaching-library');

  const onCheckDrillValidity = async () => {
    let isValid = true;

    if (
      (isActivityNameRequired && props.drill.name) ||
      !isActivityNameRequired
    ) {
      setActivityNameInputValid(true);
    } else {
      setActivityNameInputValid(false);
      isValid = false;
    }

    const eventActivityTypeId = Number.parseInt(
      String(props.drill?.event_activity_type_id),
      10
    );
    if (
      (props.drill?.event_activity_type?.id &&
        props.drill?.event_activity_type?.id >
          INITIAL_DRILL_ATTRIBUTES.event_activity_type.id) ||
      eventActivityTypeId > INITIAL_DRILL_ATTRIBUTES.event_activity_type.id
    ) {
      setActivityTypeInputValid(true);
    } else {
      setActivityTypeInputValid(false);
      isValid = false;
    }

    if (
      !window.getFlag('drill-assignment-by-squad') ||
      (props.drill.squad_ids && props.drill.squad_ids.length > 0)
    ) {
      setSquadsInputValid(true);
    } else {
      setSquadsInputValid(false);
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    setIsEditingDescription(false);
    const drill = {
      ...props.drill,
      links: props.drill.links.map((drillLink) => {
        if (drillLink.isIdLocal) {
          /* eslint-disable-next-line no-param-reassign */
          delete drillLink.id;
          /* eslint-disable-next-line no-param-reassign */
          delete drillLink.isIdLocal;
        }
        return drillLink;
      }),
    };
    if (
      props.initialDrillState.library &&
      props.initialDrillState.id !== INITIAL_DRILL_ATTRIBUTES.id
    ) {
      props.setLibraryDrillToUpdate({
        drill,
        diagram,
        attachments,
      });
    } else if (props.initialDrillState.archived) {
      setRequestStatus('LOADING');
      props.onComposeActivityDrill({ drill, diagram, attachments });
    } else {
      setRequestStatus('LOADING');
      const error = await props.onComposeActivityDrill({
        drill,
        diagram,
        attachments,
      });
      if (!error) props.setSelectedDrill(INITIAL_DRILL_ATTRIBUTES);
    }
  };

  const getTitleLabelText = (): string => {
    if (!window.getFlag('coaching-library')) return '';
    if (props.initialDrillState.library) return props.t('In library');
    if (props.initialDrillState.archived && !props.canRestoreFromArchive) {
      return props.t('Archived');
    }
    if (props.initialDrillState.archived && props.canRestoreFromArchive) {
      return props.t('');
    }
    return props.t('Not in library');
  };

  const getMainActionButtonText = (): string => {
    if (props.drill.id === INITIAL_DRILL_ATTRIBUTES.id) {
      return props.t('Add');
    }
    if (props.drill?.archived && props.canRestoreFromArchive) {
      return props.t('Restore');
    }
    if (props.drill?.archived && !props.canRestoreFromArchive) {
      return '';
    }
    return props.t('Update');
  };

  const getPrinciplesAndLabelsSelectors = () => (
    <>
      <div css={style.row}>
        <Select
          label={props.t('Default principle(s)')}
          options={props.drillPrinciples}
          isMulti
          isSearchable
          appendToBody
          placeholder={props.t('Select')}
          customSelectStyles={fitContentMenuCustomStyles}
          isDisabled={
            props.initialDrillState.archived || requestStatus !== 'SUCCESS'
          }
          onChange={(selectedPrinciplesIds) =>
            // $FlowIgnore[incompatible-call] values are present in `d` as it’s a previous state.
            props.setSelectedDrill((d) => ({
              ...d,
              principle_ids: selectedPrinciplesIds,
            }))
          }
          value={props.drill.principle_ids}
        />
      </div>
      <hr />
      <div css={style.row}>
        <Select
          label={props.t('Drill label(s)')}
          options={allLabels.map((label) => ({
            label: label.name,
            value: label.id,
          }))}
          isMulti
          isSearchable
          appendToBody
          isDisabled={
            props.initialDrillState.archived || requestStatus !== 'SUCCESS'
          }
          onChange={(selectedLabelsIds) =>
            // $FlowIgnore[incompatible-call] values are present in `d` as it’s a previous state.
            props.setSelectedDrill((d) => ({
              ...d,
              event_activity_drill_labels: selectedLabelsIds.map((id) =>
                // $FlowFixMe allLabels.find always returns a label.
                allLabels.find((label) => label.id === id)
              ),
            }))
          }
          value={
            props.drill.event_activity_drill_labels?.map((label) => label.id) ??
            []
          }
          valueContainerContent={props.t('{{count}} selected', {
            count: props.drill.event_activity_drill_labels.length,
          })}
          placeholder={props.t('Select')}
          customSelectStyles={fitContentMenuCustomStyles}
        />
        <div css={style.tags}>
          {props.drill.event_activity_drill_labels.map((label) => (
            <div css={style.tag} key={label.id}>
              <TextTag
                content={label.name}
                closeable
                onClose={() =>
                  // $FlowIgnore[incompatible-call] values are present in `d` as it’s a previous state.
                  props.setSelectedDrill((d) => ({
                    ...d,
                    event_activity_drill_labels:
                      props.drill.event_activity_drill_labels.filter(
                        (dLabel) => dLabel.id !== label.id
                      ),
                  }))
                }
                displayEllipsisWidth={200}
              />
            </div>
          ))}
        </div>
      </div>
      <hr />
    </>
  );

  const areActivityBasedOptionsVisible =
    window.getFlag('drill-assignment-by-squad') &&
    (props.drill.event_activity_type?.id !==
      INITIAL_DRILL_ATTRIBUTES.event_activity_type.id ||
      props.drill?.event_activity_type_id);

  const getActivityBasedOptions = () =>
    areActivityBasedOptionsVisible && (
      <>
        <div css={style.activityBasedOptions}>
          {props.areCoachingPrinciplesEnabled && (
            <>
              <hr />
              <Accordion
                titleColour={colors.grey_100}
                title={props.t('Available principle(s)')}
                isRightArrowIcon
                // $FlowIgnore[prop-missing]
                overrideStyles={style.accordion}
                icon="icon-chevron-down"
                iconAlign="left"
                content={
                  <>
                    <Select
                      options={allPrinciples.map((principle) => ({
                        label: principle.name,
                        value: principle.id,
                      }))}
                      isMulti
                      isSearchable
                      appendToBody
                      isDisabled={
                        props.initialDrillState.archived ||
                        requestStatus !== 'SUCCESS'
                      }
                      onChange={(selectedPrinciplesIds) =>
                        // $FlowIgnore[incompatible-call] values are present in `d` as it’s a previous state.
                        props.setSelectedDrill((d) => ({
                          ...d,
                          principle_ids: selectedPrinciplesIds,
                        }))
                      }
                      value={props.drill.principle_ids}
                      valueContainerContent={props.t('{{count}} selected', {
                        count: props.drill.principle_ids?.length,
                      })}
                      placeholder={props.t('Select')}
                      customSelectStyles={fitContentMenuCustomStyles}
                    />
                    <div css={style.tags}>
                      {props.drill.principle_ids?.map((id) => {
                        const principle = allPrinciples.find(
                          (p) => p.id === id
                        );
                        return (
                          principle && (
                            <div css={style.tag} key={principle.id}>
                              <TextTag
                                content={getPrincipleNameWithItems(principle)}
                                closeable
                                onClose={() =>
                                  // $FlowIgnore[incompatible-call] values are present in `d` as it’s a previous state.
                                  props.setSelectedDrill((d) => ({
                                    ...d,
                                    principle_ids: d.principle_ids.filter(
                                      (principleId) =>
                                        principleId !== principle.id
                                    ),
                                  }))
                                }
                                displayEllipsisWidth={200}
                              />
                            </div>
                          )
                        );
                      })}
                    </div>
                  </>
                }
              />
            </>
          )}
          <hr />
          <Accordion
            titleColour={colors.grey_100}
            title={props.t('Available drill label(s)')}
            isRightArrowIcon
            overrideStyles={style.accordion}
            icon="icon-chevron-down"
            iconAlign="left"
            content={
              <>
                <Select
                  options={allLabels.map((label) => ({
                    label: label.name,
                    value: label.id,
                  }))}
                  isMulti
                  isSearchable
                  appendToBody
                  isDisabled={
                    props.initialDrillState.archived ||
                    requestStatus !== 'SUCCESS'
                  }
                  onChange={(selectedLabelsIds) =>
                    // $FlowIgnore[incompatible-call] values are present in `d` as it’s a previous state.
                    props.setSelectedDrill((d) => ({
                      ...d,
                      event_activity_drill_labels: selectedLabelsIds.map((id) =>
                        // $FlowFixMe allLabels.find always returns a label.
                        allLabels.find((label) => label.id === id)
                      ),
                    }))
                  }
                  value={
                    props.drill.event_activity_drill_labels?.map(
                      (label) => label.id
                    ) ?? []
                  }
                  valueContainerContent={props.t('{{count}} selected', {
                    count: props.drill.event_activity_drill_labels?.length,
                  })}
                  placeholder={props.t('Select')}
                  customSelectStyles={fitContentMenuCustomStyles}
                />
                <div css={style.tags}>
                  {props.drill.event_activity_drill_labels?.map((label) => (
                    <div css={style.tag} key={label.id}>
                      <TextTag
                        content={label.name}
                        closeable
                        onClose={() =>
                          // $FlowIgnore[incompatible-call] values are present in `d` as it’s a previous state.
                          props.setSelectedDrill((d) => ({
                            ...d,
                            event_activity_drill_labels:
                              d.event_activity_drill_labels.filter(
                                (dLabel) => dLabel.id !== label.id
                              ),
                          }))
                        }
                        displayEllipsisWidth={200}
                      />
                    </div>
                  ))}
                </div>
              </>
            }
          />
          <hr />
          <Accordion
            titleColour={colors.grey_100}
            title={`${props.t('Drill visible to the following squads')}...`}
            isRightArrowIcon
            overrideStyles={style.accordion}
            icon="icon-chevron-down"
            iconAlign="left"
            content={
              <Select
                options={activityTypeSquads.map((s) => ({
                  label: s.name,
                  value: s.id,
                }))}
                isMulti
                isSearchable
                appendToBody
                isDisabled={
                  props.initialDrillState.archived ||
                  requestStatus !== 'SUCCESS'
                }
                onChange={(squadIds) => {
                  setSquadsInputValid(true);
                  // $FlowIgnore[incompatible-call] values are present in `d` as it’s a previous state.
                  props.setSelectedDrill((d) => ({
                    ...d,
                    squad_ids: squadIds,
                    principle_ids: d.principle_ids
                      .map((id) =>
                        props.drillPrinciples.find(
                          (principle) => id === principle.id
                        )
                      )
                      // Filter out principles which aren’t accessible to the
                      // current squads selection.
                      .filter(({ squads }) =>
                        squads.some(({ id }) =>
                          /* eslint-disable-next-line max-nested-callbacks */
                          squadIds.some((squadId) => squadId === id)
                        )
                      )
                      .map(({ id }) => id),
                    event_activity_drill_labels: d.event_activity_drill_labels
                      .map(({ id }) =>
                        allLabels.find((label) => id === label.id)
                      )
                      // Filter out labels which aren’t accessible to the
                      // current squads selection.
                      .filter((label) =>
                        label.squads?.some(({ id }) =>
                          /* eslint-disable-next-line max-nested-callbacks */
                          squadIds.some((squadId) => squadId === id)
                        )
                      ),
                  }));
                }}
                value={props.drill.squad_ids}
                valueContainerContent={props.t('{{count}} selected', {
                  count: props.drill.squad_ids?.length,
                })}
                placeholder={props.t('Select')}
                customSelectStyles={fitContentMenuCustomStyles}
                invalid={!isSquadsInputValid}
              />
            }
          />
          {!isSquadsInputValid && (
            <div css={style.error}>
              {props.t('At least one squad needs to be selected')}
            </div>
          )}
        </div>
        <hr css={style.activityBasedOptionsLastSeparator} />
      </>
    );

  return (
    <div className="activityDrillPanel">
      <SlidingPanelResponsive
        isOpen={props.isOpen}
        kitmanDesignSystem
        title={
          props.drill.id === INITIAL_DRILL_ATTRIBUTES.id ? (
            props.t('Create new drill')
          ) : (
            <div>
              <span css={style.sidePanelTitle}>{props.t('Drill detail')}</span>
              {getTitleLabelText() && (
                <TextTag
                  content={getTitleLabelText()}
                  displayEllipsisWidth={200}
                  fontSize={14}
                />
              )}
            </div>
          )
        }
        onClose={onClosePanel}
      >
        {requestStatus === 'SUCCESS' ? (
          <div css={style.content}>
            <div css={style.row}>
              <FileUploadField
                updateFiles={(files) =>
                  setDiagram(files.length > 0 ? files[0] : null)
                }
                files={props.drill.diagram ? [props.drill.diagram] : []}
                removeFiles={!props.isOpen}
                removeUploadedFile={() => {
                  // $FlowIgnore[incompatible-call] values are present in `d` as it’s a previous state.
                  props.setSelectedDrill((d) => ({
                    ...d,
                    diagram: null,
                  }));
                }}
                allowMultiple={false}
                maxFiles={1}
                labelIdleText={props.t(
                  'Drag and drop drill diagram or click here to browse.'
                )}
                allowImagePreview
                allowUploadedImagePreview
                acceptedFileTypes={imageFileTypes.slice()}
                kitmanDesignSystem
                isDeletableFileNameShownUnderPreview
              />
            </div>
            <div css={style.row}>
              <div css={[style.rowHeader, style.requiredRowHeader]}>
                <div>{props.t('Drill name')}</div>
                <div css={style.requiredLabel}>
                  {isActivityNameRequired && props.t('Required')}
                </div>
              </div>
              <InputText
                name="drill_name"
                value={props.drill.name ?? ''}
                invalid={!isActivityNameInputValid && isActivityNameRequired}
                onValidation={({ value }) => {
                  setActivityNameInputValid(true);
                  // $FlowIgnore[incompatible-call] values are present in `d` as it’s a previous state.
                  props.setSelectedDrill((d) => ({
                    ...d,
                    name: value,
                  }));
                }}
                kitmanDesignSystem
              />
              <div css={style.error}>
                {getActivityNameInputInvalidityMessage()}
              </div>
            </div>
            <div
              css={[
                style.row,
                areActivityBasedOptionsVisible && style.activityRow,
              ]}
            >
              <div css={[style.rowHeader, style.requiredRowHeader]}>
                <div>{props.t('Activity')}</div>
                <div css={style.requiredLabel}>
                  {!props.initialDrillState.archived && props.t('Required')}
                </div>
              </div>
              <Select
                options={props.eventActivityTypes}
                isSearchable
                appendToBody
                placeholder={props.t('Select')}
                customSelectStyles={fitContentMenuCustomStyles}
                isDisabled={
                  props.initialDrillState.archived ||
                  requestStatus !== 'SUCCESS'
                }
                onChange={(eventActivityTypeId) => {
                  setActivityTypeInputValid(true);
                  setSquadsInputValid(true);
                  // $FlowIgnore[incompatible-call] values are present in `d` as it’s a previous state.
                  props.setSelectedDrill((d) => ({
                    ...d,
                    event_activity_type_id: eventActivityTypeId,
                  }));
                  setActivityTypeSquads(
                    props.eventActivityTypes.find(
                      ({ id }) => id === eventActivityTypeId
                    )?.squads ?? []
                  );
                }}
                value={
                  // event_activity_type_id must be checked before
                  // event_activity_type.id because if event_activity_type_id is
                  // set, it means the activity type was changed by a user,
                  // hence event_activity_type_id contains the currently chosen
                  // activity type’s id.
                  props.drill?.event_activity_type_id ||
                  props.drill?.event_activity_type?.id
                }
                invalid={!isActivityTypeInputValid}
              />
              {areActivityBasedOptionsVisible && (
                <div css={style.associatedSquadsLabel}>
                  {`${props.t('Associated squads')}: ${getSquadsLabel()}`}
                </div>
              )}
            </div>
            {window.getFlag('drill-assignment-by-squad') &&
              getActivityBasedOptions()}
            <div css={style.row}>
              <RichTextEditor
                isDisabled={props.initialDrillState.archived}
                label={props.t('Description')}
                onChange={(description) => {
                  setIsEditingDescription(true);
                  // $FlowIgnore[incompatible-call] values are present in `d` as it’s a previous state.
                  props.setSelectedDrill((d) => ({
                    ...d,
                    notes: description,
                  }));
                }}
                value={props.drill.notes}
                kitmanDesignSystem
                canSetExternally={!isEditingDescription}
              />
            </div>
            {!window.getFlag('drill-assignment-by-squad') &&
              props.areCoachingPrinciplesEnabled &&
              getPrinciplesAndLabelsSelectors()}
            <div css={style.row}>
              <div css={style.rowHeader}>{props.t('Estimated intensity')}</div>
              <SegmentedControl
                isDisabled={Boolean(props.initialDrillState.archived)}
                buttons={Object.keys(eventIntensityStyles).map((intensity) => ({
                  ...eventIntensityStyles[intensity],
                  value: intensity,
                  name: getIntensityTranslation(intensity, props.t),
                }))}
                selectedButton={props.drill.intensity}
                onClickButton={(intensity) => {
                  // $FlowIgnore[incompatible-call] values are present in `d` as it’s a previous state.
                  props.setSelectedDrill((d) => ({
                    ...d,
                    intensity,
                  }));
                }}
                width="full"
                color={
                  eventIntensityStyles[
                    props.drill.intensity || intensities.Moderate
                  ].backgroundColor
                }
              />
            </div>
            <hr />
            <div css={style.row}>
              <div css={style.linkContainer}>
                <div css={style.rowHeader}>{props.t('Web link(s)')}</div>
                {!props.initialDrillState.archived && (
                  <>
                    <div css={style.linkTitle}>
                      <InputTextField
                        name="link-title"
                        label={props.t('Title')}
                        value={link.title ?? ''}
                        onChange={(e) =>
                          setLink({
                            ...link,
                            title: e.target.value,
                          })
                        }
                        invalid={false}
                        kitmanDesignSystem
                      />
                    </div>
                    <div css={style.linkUri}>
                      <InputTextField
                        name="link-uri"
                        label={props.t('URL')}
                        value={link.uri ?? ''}
                        onChange={(e) => {
                          setLink({
                            ...link,
                            uri: e.target.value,
                          });
                        }}
                        disabled={requestStatus === 'LOADING'}
                        invalid={false}
                        kitmanDesignSystem
                      />
                    </div>
                    <div css={style.linkAddButton}>
                      <TextButton
                        text={props.t('Add')}
                        type="secondary"
                        onClick={() => {
                          // $FlowIgnore[incompatible-call] values are present in `d` as it’s a previous state.
                          props.setSelectedDrill((d) => {
                            const drillLinksIds = d.links.map(
                              ({ id }) => id ?? -1
                            );
                            // Create a local ID equal to the current highest ID + 1.
                            const id = Math.max(...drillLinksIds, -1) + 1;
                            const newLink = {
                              ...link,
                              id,
                              isIdLocal: true,
                            };
                            return {
                              ...d,
                              links: [newLink, ...d.links],
                            };
                          });
                          setLink(INITIAL_LINK);
                        }}
                        isLoading={requestStatus === 'LOADING'}
                        kitmanDesignSystem
                      />
                    </div>{' '}
                  </>
                )}
                <div css={style.links}>
                  {props.drill.links?.map((drillLink) => (
                    <div
                      css={style.linkRender}
                      key={drillLink.id ?? drillLink.uri}
                    >
                      <TextButton
                        onClick={() =>
                          // $FlowIgnore[incompatible-call] values are present in `d` as it’s a previous state.
                          props.setSelectedDrill((d) => ({
                            ...d,
                            links: d.links.filter(
                              (dLink) => dLink.id !== drillLink.id
                            ),
                          }))
                        }
                        iconBefore="icon-bin"
                        type="subtle"
                        kitmanDesignSystem
                      />
                      {drillLink.title}
                      <span css={style.titleUriSeparator}>–</span>
                      <a
                        href={drillLink.uri}
                        css={style.attachmentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {drillLink.uri}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <hr />
            <div
              css={[
                style.row,
                props.initialDrillState.archived &&
                  style.disabledFileUploadArea,
              ]}
            >
              <FileUploadArea
                disabled={props.initialDrillState.archived}
                showActionButton={false}
                testIdPrefix="ActivityDrill"
                isFileError={false}
                areaTitle={
                  props.initialDrillState.archived
                    ? props.t('File(s)')
                    : props.t('Attach file(s)')
                }
                areaTitleSubtext={
                  props.initialDrillState.archived
                    ? ''
                    : props.t(
                        'Accepted files: jpg, gif, png, pdf, mp4, mp3, mov, m4v'
                      )
                }
                updateFiles={setAttachments}
                files={props.drill?.attachments ?? []}
                attachedFiles={attachments}
                removeUploadedFile={(id: number) => {
                  // $FlowIgnore[incompatible-call] values are present in `d` as it’s a previous state.
                  props.setSelectedDrill((d) => ({
                    ...d,
                    attachments: d.attachments.filter((file) => file.id !== id),
                  }));
                }}
                allowMultiple
                removeFiles={!props.isOpen}
                labelIdleText={props.t(
                  'Drag and drop files or click here to browse.'
                )}
                acceptedFileTypeCode="imageVideo"
                allowOpenUploadedFile
              />
            </div>
            <div css={style.actions}>
              {!(
                props.initialDrillState.library ||
                props.initialDrillState.archived
              ) &&
                window.getFlag('coaching-library') && (
                  <div css={style.mainLibraryAction}>
                    <Checkbox.New
                      id="saveToLibrary_id"
                      checked={props.drill.library || false}
                      onClick={() =>
                        // $FlowIgnore[incompatible-call] values are present in `d` as it’s a previous state.
                        props.setSelectedDrill((d) => ({
                          ...d,
                          library: !props.drill.library,
                        }))
                      }
                    />
                    <span id="saveToLibrary_id_label" css={style.checkboxLabel}>
                      {props.t('Save to drill library')}
                    </span>
                  </div>
                )}
              <div
                css={
                  !props.initialDrillState.library
                    ? style.actionButtons
                    : style.actionButtonsSpread
                }
              >
                {props.drill.id !== INITIAL_DRILL_ATTRIBUTES.id &&
                  !props.initialDrillState.archived && (
                    <TextButton
                      text={props.t('Cancel')}
                      type="secondary"
                      onClick={onClosePanel}
                      kitmanDesignSystem
                    />
                  )}
                {getMainActionButtonText() && (
                  <TextButton
                    text={getMainActionButtonText()}
                    type="primary"
                    kitmanDesignSystem
                    onClick={onCheckDrillValidity}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div css={style.loadingText}>{props.t('Loading ...')}</div>
        )}
      </SlidingPanelResponsive>
    </div>
  );
};
ActivityDrillPanel.INITIAL_DRILL_ATTRIBUTES = INITIAL_DRILL_ATTRIBUTES;

export const ActivityDrillPanelTranslated =
  withNamespaces()(ActivityDrillPanel);
export default ActivityDrillPanel;
