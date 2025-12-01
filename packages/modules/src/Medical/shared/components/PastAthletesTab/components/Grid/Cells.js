// @flow
import moment from 'moment';
import type { Node } from 'react';
import type { GridRow } from '@kitman/modules/src/Medical/shared/types';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import { Box } from '@kitman/playbook/components';
import { UserAvatar, TextLink } from '@kitman/components';
import { OpenIssuesTranslated as OpenIssues } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/OpenIssues';
import { FIELD_KEY } from '@kitman/modules/src/Medical/shared/components/PastAthletesTab/components/Grid/Columns';

const buildCellContent = ({
  field,
  row,
}: {
  field: string,
  row: GridRow,
}): Node | Array<Node> => {
  const renderAlignedCell = (children: Node) => (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: row.open_issue_occurrences?.length ? 'start' : 'center',
      }}
    >
      {children}
    </Box>
  );

  switch (field) {
    case FIELD_KEY.player:
      return renderAlignedCell(
        <Box
          display="flex"
          alignItems="center"
          width="11.25rem"
          minHeight="32px"
        >
          {row.avatar_url && (
            <Box>
              <UserAvatar
                url={row.avatar_url}
                firstname={row.fullname}
                size="MEDIUM"
                displayInitialsAsFallback={false}
              />
            </Box>
          )}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              marginLeft: '.75rem',
              alignItems: 'center',
            }}
          >
            <TextLink
              text={row.fullname}
              href={`/medical/athletes/${row.id}`}
              maxTextLength={25}
            />
          </Box>
        </Box>
      );
    case FIELD_KEY.player_id:
      return renderAlignedCell(row.player_id || '-');
    case FIELD_KEY.departed_date:
      return renderAlignedCell(
        row.org_last_transfer_record?.left_at
          ? formatStandard({
              date: moment(row.org_last_transfer_record?.left_at),
            })
          : '-'
      );
    case FIELD_KEY.open_injury_illness:
      return row.open_issue_occurrences?.length ? (
        <OpenIssues
          athleteId={row.id}
          hasMore={false}
          openIssues={row.open_issue_occurrences}
        />
      ) : (
        '-'
      );
    default:
      return row[field];
  }
};

export default buildCellContent;
