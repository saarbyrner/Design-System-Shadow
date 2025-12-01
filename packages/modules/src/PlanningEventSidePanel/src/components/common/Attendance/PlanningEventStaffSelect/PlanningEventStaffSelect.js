// @flow
import { useState, useEffect, useMemo } from 'react';
import { startCase } from 'lodash';
import { withNamespaces } from 'react-i18next';

import type { Option } from '@kitman/components/src/Select';
import type {
  OnUpdateEventDetails,
  EventGameFormValidity,
  EventFormData,
} from '@kitman/modules/src/PlanningEventSidePanel/src/types';
import { Select } from '@kitman/components';
import getStaffUsers from '@kitman/services/src/services/medical/getStaffUsers';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '@kitman/modules/src/PlanningEventSidePanel/src/style';
import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';

type Props = {
  event: { ...EventFormData, mls_game_key?: string },
  eventValidity: EventGameFormValidity,
  onUpdateEventDetails: OnUpdateEventDetails,
};

export const PlanningEventStaffSelect = (props: I18nProps<Props>) => {
  const checkIsMounted = useIsMountedCheck();
  const [staff, setStaff] = useState<Option[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<number[]>(
    props.event.user_ids || []
  );

  const isMLS = useMemo(
    () => !!props.event.mls_game_key,
    [props.event.mls_game_key]
  );

  const getPlaceholder = () => {
    if (isMLS) {
      return props.t('Select up to 5 staff');
    }
    return props.t('No staff selected');
  };

  useEffect(() => {
    getStaffUsers().then((staffData) => {
      if (checkIsMounted()) {
        const updateStaffData = staffData.map(({ id, fullname }) => ({
          label: startCase(fullname),
          value: id,
        }));
        setStaff(updateStaffData);
      }
    });
  }, []);

  const hasReachedMlsLimit = useMemo(
    () => selectedStaff.length >= 5,
    [selectedStaff]
  );

  const staffOpts = useMemo(() => {
    if (!isMLS) {
      return staff;
    }
    return staff.map((i) => ({
      ...i,
      isDisabled: hasReachedMlsLimit && !selectedStaff.includes(i.value),
    }));
  }, [staff, selectedStaff, isMLS, hasReachedMlsLimit]);

  return (
    <div css={style.staffRow} data-testid="PlanningEventSelectStaff">
      <Select
        label={props.t('Staff')}
        onChange={(value) => {
          setSelectedStaff(value);
          props.onUpdateEventDetails({ user_ids: value });
        }}
        value={props.event.user_ids}
        options={staffOpts}
        isValid={
          isMLS
            ? !props.eventValidity.staff_id?.isInvalid && !hasReachedMlsLimit
            : !props.eventValidity.staff_id?.isInvalid
        }
        minMenuHeight={300}
        inlineShownSelection
        inlineShownSelectionMaxWidth={80}
        isMulti
        allowSelectAll={!isMLS}
        allowClearAll
        placeholder={getPlaceholder()}
        customPlaceholderRenderer={() =>
          // Handle use case where current user does not exist in list of
          // staff users. Overwrites default behaviour of not rendering
          // placeholder when there is a value
          !staff.some((staffSelection) =>
            props.event.user_ids?.includes(staffSelection.value)
          )
        }
      />
    </div>
  );
};

export const PlanningEventStaffSelectTranslated = withNamespaces()(
  PlanningEventStaffSelect
);
export default PlanningEventStaffSelect;
