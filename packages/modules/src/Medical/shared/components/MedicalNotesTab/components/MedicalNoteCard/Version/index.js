// @flow
import moment from 'moment';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';

import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { VersionHistory } from '@kitman/modules/src/Medical/shared/types/medical';
import { colors } from '@kitman/common/src/variables';
import { RichTextDisplay } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  version: VersionHistory,
  versionNumber: number,
};

const style = {
  version: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  title: {
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '16px',
    color: colors.grey_200,
    margin: '8px 0',
  },
  changeset: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '12px',
  },
  changes: {
    fontSize: '11px',
    fontWeight: 400,
    lineHeight: '14px',
    color: colors.grey_200,
    strong: {
      fontWeight: 600,
    },
    ul: {
      marginBlockEnd: 0,
      paddingInlineStart: '12px',
    },
  },
};

const Version = (props: I18nProps<Props>) => {
  const renderChangeset = () => {
    const changedKeys = Object.keys(props.version.changeset);

    return changedKeys.map((key) => {
      switch (key) {
        case 'title':
          return (
            <div
              css={style.changes}
              data-testid="Version|title"
              key={`title_${props.versionNumber}`}
            >
              {props.t('Title')} {props.t('updated from')}{' '}
              <strong>{props.version.changeset?.title?.[0]}</strong>{' '}
              {props.t('to')}{' '}
              <strong>{props.version.changeset?.title?.[1]}</strong>
            </div>
          );
        case 'annotation_date':
          return (
            <div
              css={style.changes}
              data-testid="Version|annotation_date"
              key={`annotation_date_${props.versionNumber}`}
            >
              {props.t('Date')} {props.t('updated from')}{' '}
              <strong>
                {props.version.changeset?.annotation_date?.[0] &&
                  DateFormatter.formatStandard({
                    date: moment(props.version.changeset.annotation_date[0]),
                  })}
              </strong>{' '}
              {props.t('to')}{' '}
              <strong>
                {props.version.changeset?.annotation_date?.[1] &&
                  DateFormatter.formatStandard({
                    date: moment(props.version.changeset.annotation_date[1]),
                  })}
              </strong>
            </div>
          );
        case 'squads':
          return (
            <div
              css={style.changes}
              data-testid="Version|squads"
              key={`squads_${props.versionNumber}`}
            >
              {props.t('Squad')} {props.t('updated from')}{' '}
              <strong>{props.version.changeset?.squads?.[0]?.name}</strong>{' '}
              {props.t('to')}{' '}
              <strong>{props.version.changeset?.squads?.[1]?.name}</strong>
            </div>
          );

        case 'content':
          return (
            <div
              css={style.changes}
              key={`content_${props.versionNumber}`}
              data-testid="Version|content"
            >
              {props.versionNumber === 1 && (
                <>
                  {props.t('Note content')} {props.t('updated from')}{' '}
                  {props.version.changeset?.content?.[0] && (
                    <RichTextDisplay
                      value={props.version.changeset.content[0]}
                      isAbbreviated={false}
                    />
                  )}
                </>
              )}
              {props.t('Note content')} {props.t('updated to')}{' '}
              {props.version.changeset?.content?.[1] && (
                <RichTextDisplay
                  value={props.version.changeset.content[1]}
                  isAbbreviated={false}
                />
              )}
            </div>
          );
        case 'visibility':
          return (
            <div
              css={style.changes}
              data-testid="Version|visibility"
              key={`visibility_${props.versionNumber}`}
            >
              {props.t('Visibility')} {props.t('updated from')}{' '}
              <strong>{props.version.changeset?.visibility?.[0]}</strong>{' '}
              {props.t('to')}{' '}
              <strong>{props.version.changeset?.visibility?.[1]}</strong>
            </div>
          );
        default:
          return '';
      }
    });
  };

  return (
    <div css={style.version}>
      <div css={style.title} data-testid="Version|author">
        {`${props.t('Edit {{version}}:', {
          version: props.versionNumber,
        })} ${props.t('{{date}} by {{author}}', {
          date: DateFormatter.formatStandard({
            date: moment(props.version.updated_at),
          }),
          author: props.version.updated_by?.fullname || props.t('Unknown'),
          interpolation: { escapeValue: false },
        })}`}
      </div>
      <div css={style.changeset} data-testid="Version|changeset">
        {renderChangeset()}
      </div>
    </div>
  );
};

export const VersionTranslated: ComponentType<Props> =
  withNamespaces()(Version);
export default Version;
