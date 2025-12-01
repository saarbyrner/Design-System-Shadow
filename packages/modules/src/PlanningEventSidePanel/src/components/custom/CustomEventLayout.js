// @flow
import { withNamespaces } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import type { ComponentType } from 'react';

import { useGetActiveSquadQuery } from '@kitman/common/src/redux/global/services/globalApi';
import getCustomEventTypes, {
  type CustomEventTypeFull,
} from '@kitman/services/src/services/planning/getCustomEventTypes';
import type { StatusChangedCallback } from '@kitman/components/src/Select/hoc/withServiceSuppliedOptions';
import { Select, InputTextField } from '@kitman/components';
import getStaffUsers, {
  type StaffUserTypes,
} from '@kitman/services/src/services/medical/getStaffUsers';
import getSquadAthletes from '@kitman/services/src/services/getSquadAthletes';
import getCurrentUser from '@kitman/services/src/services/getCurrentUser';
import type { SquadAthletes } from '@kitman/components/src/Athletes/types';
import type { Option } from '@kitman/components/src/Select';
import { type Squad } from '@kitman/services/src/services/getActiveSquad';
import type { RequestStatus } from '@kitman/modules/src/PlanningEvent/types';
import { REQUEST_STATUS } from '@kitman/modules/src/PlanningEvent/src/constants';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';

import { isEventShared } from '@kitman/common/src/utils/events';
import Attendance from '../common/Attendance/Attendance';
import { StaffVisibilityTranslated as StaffVisibility } from './components/StaffVisibility';
import {
  CommonFieldsTranslated as CommonFields,
  Separator,
} from '../common/CommonFields';
import { DescriptionFieldTranslated as DescriptionField } from '../common/DescriptionField';
import style from '../../style';
import {
  mapToEventTypes,
  StaffVisibilityOptions,
  filterSquads,
  type AllEventTypeOptions,
  type EventTypeOption,
} from './utils';
import type {
  EditEventPanelMode,
  CustomEventFormData,
  CustomEventFormValidity,
  OnUpdateEventStartTime,
  OnUpdateEventDuration,
  OnUpdateEventDate,
  OnUpdateEventTimezone,
  OnUpdateEventTitle,
  OnUpdateEventDetails,
} from '../../types';

export const mapStaffToOptions = (serviceData: StaffUserTypes) => {
  const options: Array<Option> = serviceData.map((staff) => ({
    value: staff.id,
    label: staff.fullname,
  }));
  return options;
};

type Props = $Exact<{
  event: CustomEventFormData,
  panelMode: EditEventPanelMode,
  eventValidity: CustomEventFormValidity,
  onUpdateEventStartTime: OnUpdateEventStartTime,
  onUpdateEventDuration: OnUpdateEventDuration,
  onUpdateEventDate: OnUpdateEventDate,
  onUpdateEventTimezone: OnUpdateEventTimezone,
  onUpdateEventTitle: OnUpdateEventTitle,
  onUpdateEventDetails: OnUpdateEventDetails,
  onDataLoadingStatusChanged: StatusChangedCallback,
}>;

// defining this here because otherwise, the value of athleteIds will be different
// every render, thus causing infinite renders
const emptyAthleteIdsArrayDefaultValue = [];

const CustomEventLayout = ({
  t,
  event,
  panelMode,
  onUpdateEventDetails,
  eventValidity,
  onUpdateEventTitle,
  onDataLoadingStatusChanged,
  ...restCommonFieldsProps
}: I18nProps<Props>) => {
  const checkIsMounted = useIsMountedCheck();

  const {
    custom_event_type: customEventType,
    athlete_ids: athleteIds = emptyAthleteIdsArrayDefaultValue,
    title,
    description,
  } = event;

  const [customEventTypeRequestStatus, setCustomEventTypeRequestStatus] =
    useState<RequestStatus>(REQUEST_STATUS.LOADING);
  const [customEventTypeOptions, setCustomEventTypeOptions] =
    useState<AllEventTypeOptions>([]);
  const [allCustomEventTypes, setAllCustomEventTypes] = useState<
    Array<CustomEventTypeFull>
  >([]);
  const [allAthletes, setAllAthletes] = useState<SquadAthletes>([]);
  const [filteredAthletes, setFilteredAthletes] = useState<SquadAthletes>([]);
  const [staffOptions, setStaffOptions] = useState<Array<Option>>([]);

  const scopeCustomEventToSquad = window.getFlag('squad-scoped-custom-events');

  const {
    data: userCurrentSquad,
    isSuccess: isSquadQuerySuccess,
  }: { data: Squad, isSuccess: boolean } = useGetActiveSquadQuery();

  const filterAthletes = useCallback(
    (allAthletesLocal: SquadAthletes) => {
      const isParentAssociationNull = allCustomEventTypes.some(
        ({ id, parent_association: parentAssociation }) =>
          id === customEventType?.id && parentAssociation === null
      );

      if (!checkIsMounted()) return;
      if (
        scopeCustomEventToSquad &&
        customEventType &&
        isParentAssociationNull
      ) {
        const filteredSquadAthletes = filterSquads(
          customEventType.squads,
          allAthletesLocal,
          athleteIds
        );
        setFilteredAthletes(filteredSquadAthletes);
      } else {
        setFilteredAthletes(allAthletesLocal);
      }
    },
    [customEventType, athleteIds, allCustomEventTypes, scopeCustomEventToSquad]
  );

  useEffect(() => {
    getSquadAthletes().then((squadAthletes: { squads: SquadAthletes }) => {
      if (squadAthletes && squadAthletes.squads && checkIsMounted()) {
        setAllAthletes(squadAthletes.squads);
        filterAthletes(squadAthletes.squads);
      }
    });
    getStaffUsers().then((staffUsers) => {
      if (!checkIsMounted()) return;
      const staffUsersMapped = mapStaffToOptions(staffUsers ?? []);
      setStaffOptions(staffUsersMapped);
    });
  }, []);

  useEffect(() => {
    if (window.getFlag('staff-visibility-custom-events')) {
      getCurrentUser().then((currentUser) => {
        if (panelMode === 'CREATE') {
          // Autofill the current user as an attendee on custom event create
          onUpdateEventDetails({
            user_ids: [currentUser.id],
            staff_visibility: StaffVisibilityOptions.allStaff,
          });
        }
      });
    }
  }, [panelMode]);

  useEffect(() => {
    if (scopeCustomEventToSquad) {
      filterAthletes(allAthletes);
    }
  }, [customEventType, allAthletes, filterAthletes, scopeCustomEventToSquad]);

  useEffect(() => {
    if (scopeCustomEventToSquad && !userCurrentSquad?.id) {
      return;
    }
    getCustomEventTypes({
      archived: false,
      selectable: true,
      // when the FF is on, pass through the current squad id
      ...(scopeCustomEventToSquad &&
        userCurrentSquad &&
        isSquadQuerySuccess && { squadIds: [userCurrentSquad.id] }),
    })
      .then((customEventTypes) => {
        if (!checkIsMounted()) return;
        if (
          customEventType &&
          !customEventTypes.find(
            (eventType) => eventType.id === customEventType?.id
          )
        ) {
          customEventTypes.push(customEventType);
        }
        setCustomEventTypeOptions(mapToEventTypes(customEventTypes));
        setAllCustomEventTypes(customEventTypes);
        setCustomEventTypeRequestStatus(REQUEST_STATUS.SUCCESS);
      })
      .catch(() => {
        if (!checkIsMounted()) return;
        setCustomEventTypeRequestStatus(REQUEST_STATUS.FAILURE);
      });
  }, [
    userCurrentSquad,
    isSquadQuerySuccess,
    customEventType,
    scopeCustomEventToSquad,
  ]);

  const onChangeEventType = (eventType: EventTypeOption) => {
    const isSharedEventEnabled = window.getFlag('shared-custom-events');
    const shouldResetSquadInternalFields =
      isSharedEventEnabled && eventType.shared;

    const overrides: {|
      title: string,
      athlete_ids?: Array<number>,
      recurrence?: null,
      staff_visibility?: null,
    |} = {
      title: eventType.label,
    };

    if (scopeCustomEventToSquad) {
      overrides.athlete_ids = [];
    }

    if (shouldResetSquadInternalFields) {
      overrides.recurrence = null;
      overrides.staff_visibility = null;
    }

    onUpdateEventDetails({
      custom_event_type: {
        id: eventType.value,
        ...(scopeCustomEventToSquad ? { squads: eventType.squads } : {}),
        shared: eventType.shared,
      },
      title: eventType.label,
      ...overrides,
    });
  };

  const shouldShowStaffVisibility = () => {
    if (!window.getFlag('staff-visibility-custom-events')) {
      return false;
    }

    return !isEventShared(event);
  };

  return (
    <>
      <Select
        label={t('Event Type')}
        value={customEventType?.id}
        options={customEventTypeOptions}
        onChange={onChangeEventType}
        returnObject
        isSearchable
        groupBy="paginated"
        isLoading={customEventTypeRequestStatus === REQUEST_STATUS.LOADING}
        isDisabled={customEventTypeRequestStatus === REQUEST_STATUS.LOADING}
        invalid={eventValidity?.custom_event_type?.isInvalid}
      />

      <div css={style.fullWidthRow}>
        <InputTextField
          label={t('Title')}
          onChange={(e) => onUpdateEventTitle(e.target.value, true)}
          value={title || ''}
          kitmanDesignSystem
          data-testid="CustomEventLayout|Title"
          invalid={eventValidity.title?.isInvalid}
        />
      </div>

      <div
        css={style.singleColumn}
        data-testid="CustomEventLayoutLayout|DescriptionField"
      >
        <DescriptionField
          description={description}
          onUpdateEventDetails={onUpdateEventDetails}
          maxLength={250}
        />
      </div>

      <Separator />

      <div css={style.threeColumnGridNoMarginBottom}>
        <CommonFields
          event={event}
          panelMode={panelMode}
          allowEditTitle={false}
          eventValidity={eventValidity}
          onUpdateEventTitle={onUpdateEventTitle}
          onUpdateEventDetails={onUpdateEventDetails}
          onDataLoadingStatusChanged={onDataLoadingStatusChanged}
          {...restCommonFieldsProps}
        />
      </div>

      <div css={style.fullWidthRow}>
        <Separator />
        <Attendance
          onUpdateEventDetails={onUpdateEventDetails}
          event={event}
          eventValidity={eventValidity}
          filteredAthletes={filteredAthletes}
        />
      </div>

      {shouldShowStaffVisibility() && (
        <>
          <Separator />
          <StaffVisibility
            event={event}
            eventValidity={eventValidity}
            staffOptions={staffOptions}
            onUpdateEventDetails={onUpdateEventDetails}
          />
        </>
      )}
    </>
  );
};

export default CustomEventLayout;
export const CustomEventLayoutTranslated: ComponentType<Props> =
  withNamespaces()(CustomEventLayout);
