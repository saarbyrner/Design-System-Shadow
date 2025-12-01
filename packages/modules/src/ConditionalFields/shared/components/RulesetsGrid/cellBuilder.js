// @flow
import moment from 'moment';
import type { Node } from 'react';
import i18n from '@kitman/common/src/utils/i18n';

import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { LinkTooltipCell } from '@kitman/components/src/TableCells';

import { TextCell, StatusCell } from '../Cells';
import type { Ruleset } from '../../types';

import { ROW_KEY } from '../../types';

import { cellStyle } from '../CommonGridStyle';

const buildCellContent = (
  { row_key: rowKey }: { row_key: $Keys<typeof ROW_KEY> },
  {
    ruleset,
    organisationId,
  }: { ruleset: Ruleset, organisationId: number | string }
): Node | Array<Node> => {
  const publishedVersion = ruleset.versions.find(
    ({ published_at: publishedAt }) => publishedAt
  );
  const assignedSquads = ruleset.versions[0]?.assigned_squads;

  switch (rowKey) {
    case ROW_KEY.name:
      return (
        <LinkTooltipCell
          valueLimit={25}
          url={`/administration/conditional_fields/organisations/${organisationId}/rulesets/${
            ruleset.id
          }${ruleset.name ? `?title=${ruleset.name} ` : ''}`}
          longText={ruleset.name || '--'}
        />
      );
    case ROW_KEY.published_at: {
      return (
        <TextCell
          text={
            publishedVersion
              ? DateFormatter.formatStandard({
                  date: moment(publishedVersion.published_at),
                })
              : '-'
          }
        />
      );
    }
    case ROW_KEY.version:
      return <TextCell text={ruleset.versions?.length} />;
    case 'status':
      return publishedVersion ? (
        <StatusCell status="active" statusText={i18n.t('Active')} />
      ) : (
        <StatusCell status="inactive" statusText={i18n.t('Inactive')} />
      );
    case ROW_KEY.squads:
      return (
        <TextCell
          text={
            assignedSquads.length
              ? assignedSquads.map((squad) => squad.name).join(', ')
              : '-'
          }
        />
      );

    default:
      // $FlowIgnoreMe[prop-missing]
      return <span css={cellStyle.textCell}>{ruleset[rowKey]}</span>;
  }
};

export default buildCellContent;
