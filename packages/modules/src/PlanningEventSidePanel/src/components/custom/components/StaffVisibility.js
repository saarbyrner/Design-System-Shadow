// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import style from '@kitman/modules/src/PlanningEventSidePanel/src/style';
import { Select, RadioList } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Option } from '@kitman/components/src/Select';
import type {
  CustomEventFormValidity,
  CustomEventFormData,
  OnUpdateEventDetails,
} from '@kitman/modules/src/PlanningEventSidePanel/src/types';
import { excludeAttendees, StaffVisibilityOptions } from '../utils';

type Props = {
  event: CustomEventFormData,
  eventValidity: CustomEventFormValidity,
  staffOptions: Array<Option>,
  onUpdateEventDetails: OnUpdateEventDetails,
};

const StaffVisibility = (props: I18nProps<Props>) => {
  const { t } = props;

  return (
    <div css={style.noGap}>
      <div css={style.labelText}>{t('Staff visibility')}</div>
      <RadioList
        radioName="staff_visibility_radio"
        options={[
          {
            name: t('All Staff'),
            value: StaffVisibilityOptions.allStaff,
          },
          {
            name: t('Only Selected Staff'),
            value: StaffVisibilityOptions.onlySelectedStaff,
          },
          {
            name: t('Staff and Additional viewers'),
            value: StaffVisibilityOptions.selectedStaffAndAdditional,
          },
        ]}
        change={async (value) => {
          if (value !== StaffVisibilityOptions.selectedStaffAndAdditional) {
            props.onUpdateEventDetails({
              visibility_ids: [],
              staff_visibility: value,
            });
          } else {
            const visibilityUsers = excludeAttendees(
              props.event.visibility_ids || [],
              props.event.user_ids
            );
            props.onUpdateEventDetails({
              staff_visibility: value,
              visibility_ids: visibilityUsers,
            });
          }
        }}
        value={props.event.staff_visibility}
        direction="vertical"
        kitmanDesignSystem
      />
      {props.event.staff_visibility ===
        StaffVisibilityOptions.selectedStaffAndAdditional && (
        <Select
          label={t('Additional viewers')}
          options={props.staffOptions}
          value={props.event.visibility_ids}
          onChange={(visibilitySelections: number[]) => {
            const visibilityUsers = excludeAttendees(
              visibilitySelections,
              props.event.user_ids
            );
            props.onUpdateEventDetails({
              visibility_ids: visibilityUsers,
            });
          }}
          isMulti
          menuPlacement="top"
          invalid={props.eventValidity.visibility_ids?.isInvalid}
        />
      )}
    </div>
  );
};

export default StaffVisibility;
export const StaffVisibilityTranslated: ComponentType<Props> =
  withNamespaces()(StaffVisibility);
