// @flow
import type { Node } from 'react';
import type { FullLabelResponse } from '@kitman/services/src/services/OrganisationSettings/DynamicCohorts/Labels/createLabel';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment-timezone';
import { TextTag } from '@kitman/components';
import { buildGenericTextCell } from '@kitman/modules/src/DynamicCohorts/shared/gridHelpers/cellBuilderCommon';

export const ROW_KEY = {
  name: 'name',
  description: 'description',
  createdBy: 'createdBy',
  createdOn: 'createdOn',
};

export const buildCellContent = ({
  row_key: rowKey,
  label,
}: {
  row_key: $Keys<typeof ROW_KEY>,
  label: FullLabelResponse,
}): Node => {
  switch (rowKey) {
    case ROW_KEY.name:
      return (
        <TextTag
          content={label.name || ''}
          backgroundColor={label.color || ''}
          textColor="#ffffff"
          fontSize={12}
        />
      );
    case ROW_KEY.description:
      return buildGenericTextCell(label.description);
    case ROW_KEY.createdBy:
      return buildGenericTextCell(label.created_by.fullname);
    case ROW_KEY.createdOn:
      return buildGenericTextCell(
        formatStandard({ date: moment(label.created_on) })
      );
    default:
      return <></>;
  }
};
