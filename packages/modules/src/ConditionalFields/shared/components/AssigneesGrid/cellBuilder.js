// @flow
import type { Node } from 'react';
import moment from 'moment';

import { Checkbox } from '@kitman/playbook/components';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';

import { TextCell } from '../Cells';
import type { ShortAssignment, Assignment } from '../../types';

import { ROW_KEY } from '../../types';

import { cellStyle } from '../CommonGridStyle';

const buildCellContent = (
  { row_key: rowKey }: { row_key: $Keys<typeof ROW_KEY> },
  {
    editMode,
    assignment,
    assignments,
    onChange,
  }: {
    editMode: boolean,
    assignment: ShortAssignment,
    assignments: Array<Assignment>,
    onChange: Function,
  }
): Node | Array<Node> => {
  switch (rowKey) {
    case ROW_KEY.squad:
      return <TextCell text={assignment.assignee.name} />;
    case ROW_KEY.active_players:
      return <TextCell text={assignment.assignee.active_athlete_count || 0} />;
    case ROW_KEY.assigned:
      return (
        <Checkbox
          checked={
            assignments.findIndex(
              (asgmt) =>
                asgmt.squad_id === assignment.assignee.id && asgmt.active
            ) !== -1
          }
          disabled={!editMode}
          onChange={(event) => onChange(event, assignment.assignee.id)}
          color="primary"
          size="small"
          sx={{
            padding: 0,
          }}
        />
      );
    case ROW_KEY.assigned_date:
      return (
        <TextCell
          text={
            assignment.id && assignment.active
              ? formatStandard({ date: moment(assignment.updated_at) })
              : '-'
          }
        />
      );
    default:
      // $FlowIgnoreMe[prop-missing]
      return <span css={cellStyle.textCell}>{assignment[rowKey]}</span>;
  }
};

export default buildCellContent;
