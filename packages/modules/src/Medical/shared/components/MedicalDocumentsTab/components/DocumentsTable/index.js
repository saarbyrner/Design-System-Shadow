// @flow
import type { ComponentType } from 'react';
import { useMemo, useRef } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import uuid from 'uuid';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useFlexLayout } from 'react-table';

import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';
import {
  EllipsisTooltipText,
  TextButton,
  TextLink,
  TooltipMenu,
  UserAvatar,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import { CircularProgress } from '@kitman/playbook/components';
import DataTable from '../../../DataTable';
import { TextCell, TextHeader } from '../DocumentsTableCells';
import getStyles from './styles';

type Props = {
  onReachingEnd: Function,
  documents: MedicalNote[],
  isLoading: boolean,
  issueId: string | number | null,
  showPlayerColumn: boolean,
};

const DocumentsTable = (props: I18nProps<Props>) => {
  const documentsTableRef = useRef();

  const dataTableStyle = {
    DocumentsTable: {
      height: `calc(100vh - ${
        documentsTableRef.current?.getBoundingClientRect().y ?? 0
      }px - 20px)`,
      overflowY: 'scroll',
    },
    DocumentsTableEmpty: { height: 'auto' },
  };

  const style = getStyles();

  const returnActions = () => {
    return (
      <div css={style.actions} key={uuid()}>
        <TooltipMenu
          placement="bottom-end"
          menuItems={[
            {
              description: 'Archive',
              onClick: () => {},
            },
          ]}
          tooltipTriggerElement={
            <TextButton
              iconAfter="icon-more"
              type="subtle"
              kitmanDesignSystem
            />
          }
          kitmanDesignSystem
        />
      </div>
    );
  };

  const buildColumns = useMemo(() => {
    const columns = [
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Title name')} />,
        accessor: 'titlename',
        width: 100,
        Cell: ({ row }) => {
          return (
            <div css={style.link}>
              <TextCell key={uuid()} value={row.original.document?.titleName} />
            </div>
          );
        },
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('File name')} />,
        accessor: 'filename',
        width: 100,
        Cell: ({ row }) => {
          return (
            <div css={style.link}>
              <a
                target="_blank"
                href={row.original.document.url}
                css={style.attachmentLink}
                rel="noreferrer"
              >
                {row.original.document.filename}
              </a>
            </div>
          );
        },
      },
      {
        Header: () => (
          <TextHeader key={uuid()} value={props.t('Upload date')} />
        ),
        accessor: 'date_uploaded',
        width: 100,
        Cell: ({ cell: { value } }) => (
          <TextCell
            key={uuid()}
            value={moment(value).format('MMMM DD, YYYY')}
          />
        ),
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Categories')} />,
        accessor: 'categories',
        width: 100,
        Cell: ({ row }) => {
          const injuries = row.original.categories.map((category) => {
            return <TextCell key={uuid()} value={category.name} />;
          });
          return <>{injuries}</>;
        },
      },
    ];

    if (props.showPlayerColumn) {
      columns.unshift({
        Header: () => <TextHeader key={uuid()} value={props.t('Player')} />,
        accessor: 'fullname',
        width: 100,
        Cell: ({ row }) => {
          return (
            <div css={style.athleteCell}>
              <div css={style.imageContainer}>
                <UserAvatar
                  url={row.values.athlete_avatar}
                  firstname={row.values.fullname}
                  displayInitialsAsFallback
                  availability={undefined}
                  size="MEDIUM"
                />
              </div>
              <div css={style.detailsContainer}>
                <TextLink
                  text={row.values.fullname}
                  href={`/medical/athletes/${row.original.athlete_id}`}
                  kitmanDesignSystem
                />
                <span css={style.position}>
                  {row.original.athlete_position}
                </span>
              </div>
            </div>
          );
        },
      });
    }

    if (props.issueId === null) {
      columns.push({
        Header: () => (
          <TextHeader
            key={uuid()}
            value={props.t('Associated injury/illness')}
          />
        ),
        accessor: 'injury',
        width: 100,
        Cell: ({ row }) => {
          const injuries = row.original.injuries.map((injury) => {
            return (
              <div css={style.link}>
                <TextLink
                  text={
                    injury.issue_occurrence_title
                      ? injury.issue_occurrence_title
                      : injury.full_pathology
                  }
                  href={`/medical/athletes/${row.original.athlete_id}/injuries/${injury.id}`}
                  kitmanDesignSystem
                />
              </div>
            );
          });
          return <>{injuries}</>;
        },
      });
    }

    columns.push({
      Header: () => <TextHeader key={uuid()} value={props.t('Note')} />,
      accessor: 'note',
      width: 150,
      Cell: ({ cell: { value } }) => (
        <div css={style.note}>
          <EllipsisTooltipText content={value} displayEllipsisWidth={280} />
        </div>
      ),
    });

    return columns;
  });

  const buildData = () => {
    const rows = [];
    props.documents.forEach((note) => {
      note.attachments.forEach((document) => {
        rows.push({
          fullname: note.annotationable.fullname,
          document: {
            titleName: document.name,
            filename: document.filename,
            filetype: document.filetype,
            url: document.url,
          },
          date_uploaded: note?.annotation_date,
          categories: note.document_note_categories,
          injuries: [...note.illness_occurrences, ...note.injury_occurrences],
          note: note.note_summary,
          athlete_avatar: note.annotationable.avatar_url,
          athlete_id: note.annotationable.id,
          athlete_position: note.annotationable.position,
          actions: returnActions(),
        });
      });
    });

    return rows;
  };

  const renderTable = () => {
    return (
      <InfiniteScroll
        dataLength={props.documents.length}
        next={props.onReachingEnd}
        hasMore={props.isLoading}
        scrollThreshold={
          window.featureFlags['fix-lazy-load-debounce'] ? 0.3 : 0.8
        }
        loader={
          <div
            css={style.loadingText}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: '12px 0',
            }}
          >
            <CircularProgress
              size={20}
              thickness={5}
              aria-label={props.t('Loading')}
            />
            <span>{props.t('Loading')}…</span>
          </div>
        }
        scrollableTarget="DocumentsTable"
      >
        <DataTable
          columns={buildColumns}
          data={buildData()}
          useLayout={useFlexLayout}
          isTableEmpty={props.documents.length === 0}
        />
      </InfiniteScroll>
    );
  };

  return (
    <div
      id="DocumentsTable"
      // $FlowFixMe .getBoundingClientRect().y is a valid property
      ref={documentsTableRef}
      css={
        props.documents.length
          ? dataTableStyle.DocumentsTable
          : dataTableStyle.DocumentsTableEmpty
      }
    >
      <div css={style.content}>
        <div css={style.documentsTable}>{renderTable()}</div>
      </div>
    </div>
  );
};

export const DocumentsTableTranslated: ComponentType<Props> =
  withNamespaces()(DocumentsTable);
export default DocumentsTable;
