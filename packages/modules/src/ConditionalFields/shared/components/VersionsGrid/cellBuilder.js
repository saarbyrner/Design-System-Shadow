// @flow
import moment from 'moment';
import type { Node } from 'react';
import i18n from '@kitman/common/src/utils/i18n';

import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { LinkTooltipCell } from '@kitman/components/src/TableCells';

import { TextCell, StatusCell } from '../Cells';

import { ROW_KEY, type ShortVersion } from '../../types';

import { cellStyle } from '../CommonGridStyle';

const buildCellContent = (
  { row_key: rowKey }: { row_key: $Keys<typeof ROW_KEY> },
  {
    organisationId,
    rulesetId,
    version,
    versions,
  }: {
    organisationId: string,
    rulesetId: string,
    version: ShortVersion,
    versions: Array<ShortVersion>,
  }
): Node | Array<Node> => {
  const isInactive = versions.some(
    (rulesetVersion) =>
      rulesetVersion.version === version.version + 1 &&
      rulesetVersion.published_at
  );
  const assignedSquads = version?.assigned_squads;

  switch (rowKey) {
    case ROW_KEY.name:
      return (
        <LinkTooltipCell
          valueLimit={25}
          url={`/administration/conditional_fields/organisations/${organisationId}/rulesets/${rulesetId}/versions/${
            version.version
          }${version.name ? `?title=${version.name} ` : ''}`}
          longText={`${version.name || '--'}_v${version.version}`}
        />
      );
    case ROW_KEY.published_at: {
      return (
        <TextCell
          text={
            version.published_at
              ? DateFormatter.formatStandard({
                  date: moment(version.published_at),
                })
              : '-'
          }
        />
      );
    }
    case ROW_KEY.version:
      return <TextCell text={version.version} />;
    case ROW_KEY.status:
      if (isInactive) {
        return <StatusCell status="inactive" statusText={i18n.t('Inactive')} />;
      }
      if (version.published_at) {
        return <StatusCell status="active" statusText={i18n.t('Active')} />;
      }
      return <StatusCell status="draft" statusText={i18n.t('Draft')} />;
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
      return <span css={cellStyle.textCell}>{version[rowKey]}</span>;
  }
};

export default buildCellContent;
