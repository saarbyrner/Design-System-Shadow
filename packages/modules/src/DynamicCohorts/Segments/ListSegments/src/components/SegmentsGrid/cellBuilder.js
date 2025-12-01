// @flow
import type { Node } from 'react';
import type { SegmentResponse } from '@kitman/services/src/services/dynamicCohorts/Segments/searchSegments';
import { buildGenericTextCell } from '@kitman/modules/src/DynamicCohorts/shared/gridHelpers/cellBuilderCommon';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment-timezone';
import type { RowKeyType } from './types';

export const ROW_KEY = {
  name: 'name',
  createdBy: 'createdBy',
  createdOn: 'createdOn',
};

export const buildCellContent = ({
  row_key: rowKey,
  segment,
}: {
  row_key: RowKeyType,
  segment: SegmentResponse,
}): Node => {
  switch (rowKey) {
    case ROW_KEY.name:
      return buildGenericTextCell(segment.name);
    case ROW_KEY.createdBy:
      // this will be removed once the BE updates the serializer to include the created_by prop
      return segment.created_by
        ? buildGenericTextCell(segment.created_by.fullname)
        : '';
    case ROW_KEY.createdOn:
      return buildGenericTextCell(
        formatStandard({ date: moment(segment.created_on) })
      );
    default:
      return <></>;
  }
};
