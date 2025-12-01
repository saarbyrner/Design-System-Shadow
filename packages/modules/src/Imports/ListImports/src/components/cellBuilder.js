// @flow
import i18n from '@kitman/common/src/utils/i18n';
import moment from 'moment';
import type { Node } from 'react';
import { TextCell } from '@kitman/modules/src/LeagueOperations/technicalDebt/components/Cells';
import { Link } from '@kitman/components';

import { formatStandard } from '@kitman/common/src/utils/dateFormatter';

import { cellStyle } from '@kitman/modules/src/LeagueOperations/technicalDebt/components/CommonGridStyle';
// object-styles-always ESLint rule is run in the pipeline.
import { css } from '@emotion/react';
/* eslint-enable */

import type { ImportsItem, ImportType } from '@kitman/common/src/types/Imports';

import style from '@kitman/modules/src/Imports/styles';
import { uniqueId } from 'lodash';

const getImportTypeText = (importType: ImportType) => {
  switch (importType) {
    case 'athlete_import': {
      return i18n.t('Athlete Import');
    }
    case 'user_import': {
      return i18n.t('Staff Import');
    }
    case 'official_import': {
      return i18n.t('Official Import');
    }
    case 'scout_import': {
      return i18n.t('Scout Import');
    }
    default: {
      return '';
    }
  }
};

const getStatusIndicator = (
  itemStatus: $PropertyType<ImportsItem, 'status'>
) => {
  // object-styles-always ESLint rule is run in the pipeline.
  if (itemStatus === 'pending' || itemStatus === 'running') {
    return (
      <span
        css={css`
          ${style.statusIndicator} ${style.inProgressStatus}
        `}
      >
        {i18n.t('In progress')}
      </span>
    );
  }
  if (itemStatus === 'completed') {
    return (
      <span
        css={css`
          ${style.statusIndicator} ${style.successStatus}
        `}
      >
        {i18n.t('Completed')}
      </span>
    );
  }
  if (itemStatus === 'errored') {
    return (
      <span
        css={css`
          ${style.statusIndicator} ${style.errorStatus}
        `}
      >
        {i18n.t('Error')}
      </span>
    );
  }
  /* eslint-enable */

  return null;
};

const buildCellContent = (
  { row_key: rowKey }: { row_key: string },
  importsItem: ImportsItem
): Node | Array<Node> => {
  switch (rowKey) {
    case 'name':
      return importsItem.attachments?.length ? (
        importsItem.attachments.map((attachment) => (
          <TextCell text={attachment?.filename} />
        ))
      ) : (
        <TextCell text="--" />
      );
    case 'import_type':
      return getImportTypeText(importsItem.import_type);
    case 'download_link':
      return importsItem.status === 'completed' ? (
        <Link
          href={importsItem.attachments[0]?.url || ''}
          title={importsItem.name}
        >
          <i className="icon-link" /> {i18n.t('Link')}
        </Link>
      ) : (
        <TextCell text="--" />
      );
    case 'created_at':
      return (
        <TextCell
          text={formatStandard({
            date: moment(importsItem.created_at),
            showTime: true,
          })}
        />
      );
    case 'creator': {
      return <TextCell text={importsItem.created_by?.fullname} />;
    }
    case 'status': {
      return getStatusIndicator(importsItem.status);
    }
    case 'errors': {
      if (importsItem.import_errors?.length === 0)
        return <TextCell text="--" />;

      return (
        <ul css={style.errorList}>
          {importsItem.import_errors?.map((error) => (
            <li key={uniqueId()}>{error.error}</li>
          ))}
        </ul>
      );
    }
    default:
      return <span css={cellStyle.textCell}>{importsItem[rowKey]}</span>;
  }
};

export default buildCellContent;
