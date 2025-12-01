// @flow
/* eslint-disable camelcase */
import {
  type RequirementSection,
  type SectionFormElement,
  type RegistrationStatus,
  type RegistrationSystemStatus,
  RegistrationStatusEnum,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { RequirementSectionRow } from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';

export const isSectionActionable = ({
  registrationSystemStatus,
}: {
  registrationSystemStatus: ?RegistrationSystemStatus,
}): boolean => {
  if (!registrationSystemStatus) return false;
  return ![
    RegistrationStatusEnum.APPROVED,
    RegistrationStatusEnum.INCOMPLETE,
  ].includes(registrationSystemStatus.type);
};

export default (
  rawRowData: Array<RequirementSection>,
  onRowClickCallback: ({
    form_element: SectionFormElement,
    status: RegistrationStatus,
    registrationSystemStatus: ?RegistrationSystemStatus,
    sectionId: number,
  }) => void
): Array<RequirementSectionRow> => {
  return (
    rawRowData?.map(
      ({ id, form_element, status, registration_system_status }) => {
        return {
          id,
          requirement: {
            text: form_element.title,
            isActionable: true,
          },
          registration_status: status,
          registration_system_status,
          onRowClick: () =>
            onRowClickCallback({
              form_element,
              status,
              registrationSystemStatus: registration_system_status,
              sectionId: id,
            }),
        };
      }
    ) || []
  );
};
