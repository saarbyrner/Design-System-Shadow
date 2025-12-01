// @flow
import type { AthleteWithSqauds } from '@kitman/common/src/types/Event';
import type { TextContent } from '../../../types/table';

export type TableColumn = {
  Header: () => TextContent,
  accessor: 'participant' | 'squads',
  width: number,
  Cell: (cellData: {
    row: { original: AthleteWithSqauds },
    value: any,
  }) => TextContent | React$Element<'div'>,
};
