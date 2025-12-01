// @flow
import { useMemo, useRef } from 'react';
import type { ComponentType } from 'react';
import uuid from 'uuid';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import { css } from '@emotion/react';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TextButton, TextLink, TooltipMenu } from '@kitman/components';
import {
  TextHeader,
  TextCell,
  LinkTooltipCell,
} from '@kitman/components/src/TableCells';
import { useFlexLayout } from 'react-table';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { Organisation } from '@kitman/services/src/services/getOrganisation';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { ProcedureResponseData as Procedure } from '../../../../types/medical';

import { getIssueTypePath, getIssueTitle } from '../../../../utils';
import DataTable from '../../../DataTable';
import style from '../../style';

type Props = {
  athleteId?: number | null,
  procedures: Array<Procedure>,
  currentOrganisation: Organisation,
  isLoading: boolean,
  onOpenArchiveProcedureModal: Function,
  onReachingEnd: Function,
  athleteOnTrial: boolean,
};

const ProceduresList = (props: I18nProps<Props>) => {
  const procedureCardListRef = useRef();
  const { permissions } = usePermissions();

  const loadingStyle = {
    loadingText: css`
      color: ${colors.grey_300};
      font-size: 14px;
      font-weight: normal;
      line-height: 20px;
      margin-top: 24px;
      text-align: center;
    `,
    procedureCardList: css`
      height: calc(
        100vh - ${procedureCardListRef.current?.getBoundingClientRect().y}px -
          20px
      );
      overflow-y: scroll;
    `,
    procedureCardListEmpty: css`
      height: auto;
    `,
  };

  // Actions contain 'Archive' option for now; this will likely expand in future
  const returnActions = (procedureId: number) => {
    return (
      <div css={style.actions} key={uuid()}>
        {permissions.medical.procedures.canArchive && !props.athleteOnTrial && (
          <TooltipMenu
            data-testid="ProcedureCardList|Actions"
            placement="bottom-end"
            menuItems={[
              {
                id: 'archive',
                description: props.t('Archive'),
                onClick: () => props.onOpenArchiveProcedureModal(procedureId),
                isVisible: permissions.medical.procedures.canArchive,
              },
            ]
              .filter((i) => i.isVisible)
              .map((i) => {
                return {
                  id: i.id,
                  description: i.description,
                  onClick: i.onClick,
                  isVisible: i.isVisible,
                };
              })}
            tooltipTriggerElement={
              <TextButton
                iconAfter="icon-more"
                type="subtle"
                kitmanDesignSystem
              />
            }
            kitmanDesignSystem
          />
        )}
      </div>
    );
  };

  const buildColumns = useMemo(() => {
    const columns = [
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Procedure')} />,
        accessor: 'procedure',
        width: 190,
        Cell: ({ cell: { value } }) => (
          <LinkTooltipCell
            key={uuid()}
            data-testid="ProceduresList|Procedure"
            valueLimit={25}
            url={`/medical/procedures/${value?.id}`}
            longText={value?.procedure_type.name}
          />
        ),
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Reason')} />,
        accessor: 'reason',
        width: 190,
        Cell: ({ cell: { value } }) => (
          <TextCell
            key={uuid()}
            data-testid="ProceduresList|Reason"
            value={value}
          />
        ),
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Company')} />,
        accessor: 'company',
        width: 230,
        Cell: ({ cell: { value } }) => (
          <TextCell
            key={uuid()}
            data-testid="ProceduresList|Company"
            value={value}
          />
        ),
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Date')} />,
        accessor: 'date',
        width: 120,
        Cell: ({ cell: { value } }) => (
          <TextCell
            key={uuid()}
            data-testid="ProceduresList|Date"
            value={value}
          />
        ),
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Provider')} />,
        accessor: 'provider',
        width: 130,
        Cell: ({ cell: { value } }) => (
          <TextCell
            key={uuid()}
            data-testid="ProceduresList|Provider"
            value={value}
          />
        ),
      },
      {
        Header: () => (
          <TextHeader key={uuid()} value={props.t('Attachments')} />
        ),
        accessor: 'attachments',
        width: 80,
        Cell: ({ cell: { value } }) => (
          <TextCell
            key={uuid()}
            data-testid="ProceduresList|Attachments"
            value={value}
          />
        ),
      },
    ];
    if (!props.athleteId) {
      columns.unshift({
        Header: () => <TextHeader key={uuid()} value={props.t('Player')} />,
        accessor: 'player',
        width: 190,
        Cell: ({ cell: { value } }) => value,
      });
    }

    columns.push({
      Header: () => <TextHeader key={uuid()} value="" />,
      accessor: 'actions',
      width: 30,
      Cell: ({ cell: { value } }) => <TextCell key={uuid()} value={value} />,
    });

    return columns;
  }, []);

  const getIssuesToRender = (procedure) => {
    if (
      procedure?.issue_occurrences?.length === 0 &&
      procedure?.chronic_issues?.length === 0
    ) {
      return 'Injury/ Illness with no associated ISSUE';
    }

    return (
      <div css={style.issueLinks}>
        {procedure?.issue_occurrences?.map((issue) => {
          return (
            <LinkTooltipCell
              key={uuid()}
              data-testid="ProcedureCardList|IssueLink"
              valueLimit={20}
              url={`/medical/athletes/${
                procedure.athlete.id
              }/${getIssueTypePath(issue.issue_type)}/${issue.id}`}
              longText={getIssueTitle(issue, false)}
            />
          );
        })}
        {procedure?.chronic_issues?.map((issue) => {
          return (
            <LinkTooltipCell
              key={uuid()}
              data-testid="ProcedureCardList|ChronicIssueLink"
              valueLimit={20}
              url={`/medical/athletes/${procedure.athlete.id}/chronic_issues/${issue.id}`}
              longText={issue.pathology}
            />
          );
        })}
      </div>
    );
  };

  const getReasonCellContent = (procedure) => {
    const reasonText =
      procedure?.procedure_reason?.name || procedure?.other_reason || '--';
    const isLinks = !!(
      procedure?.issue_occurrences?.length || procedure?.chronic_issues?.length
    );
    return (
      <div data-testid="ProcedureOverviewTab|ReasonContent">
        {isLinks ? getIssuesToRender(procedure) : reasonText}
      </div>
    );
  };

  const getAttachmentsToRender = (procedure) => {
    return (
      procedure.attachments?.map((attachment) => (
        <LinkTooltipCell
          key={`${attachment.filename}_${attachment.id}`}
          data-testid="ProcedureCardList|AttachmentLink"
          fileType={attachment.filetype}
          valueLimit={18}
          url={attachment.url}
          longText={attachment.filename}
          isExternalLink
          includeIcon
          target="_blank"
          onlyShowIcon
        />
      )) || '--'
    );
  };

  const getLinksToRender = (procedure) =>
    procedure.attached_links?.map((link) => {
      return (
        <div
          data-testid="ProcedureCardList|Link"
          key={`${link.uri}_${link.id}`}
        >
          <LinkTooltipCell
            fileType="link-icon"
            valueLimit={18}
            url={link.uri}
            longText={link.title}
            isExternalLink
            isLink
            includeIcon
            target="_blank"
            onlyShowIcon
          />
        </div>
      );
    });

  const wasCreatedWithinCurrentOrganisation = (procedureOrgId: number) => {
    return props.currentOrganisation.id === procedureOrgId;
  };

  const buildActions = (procedure: Procedure) => {
    return wasCreatedWithinCurrentOrganisation(procedure.organisation_id)
      ? returnActions(procedure.id)
      : '';
  };

  const buildData = () => {
    return props.procedures.map((procedure) => {
      return {
        player: (
          <div
            key={uuid()}
            css={style.athleteDetails}
            data-testid="ProcedureCardList|Avatar"
          >
            <img
              css={style.athleteAvatar}
              src={procedure.athlete.avatar_url}
              alt={`${procedure.athlete.fullname}'s avatar`}
            />
            <div css={style.athleteInfo}>
              <TextLink
                text={procedure.athlete.fullname}
                href={`/medical/athletes/${procedure.athlete.id}`}
                kitmanDesignSystem
              />
              <p css={style.athletePosition}>{procedure.athlete.position}</p>
            </div>
          </div>
        ),
        procedure: procedure || '--',
        provider:
          procedure?.provider?.fullname || procedure?.other_provider || '--',
        company: procedure?.location?.name || '--',
        reason: getReasonCellContent(procedure) || '--',
        date: moment(procedure.procedure_date).format('MMM D, YYYY') || '--',
        attachments: (
          <div css={style.attachmentsContainer}>
            {getAttachmentsToRender(procedure)}
            {getLinksToRender(procedure)}
          </div>
        ),
        actions: !props.procedures.length ? '' : buildActions(procedure),
      };
    });
  };

  const renderTable = () => {
    return (
      <InfiniteScroll
        dataLength={props.procedures.length}
        next={props.onReachingEnd}
        hasMore={props.isLoading}
        loader={
          <div css={loadingStyle.loadingText}>{props.t('Loading')} ...</div>
        }
        scrollableTarget="procedureCardList"
      >
        <DataTable
          columns={buildColumns}
          data={buildData()}
          useLayout={useFlexLayout}
        />
      </InfiniteScroll>
    );
  };

  return (
    <div
      data-testid="ProcedureOverviewTab|ProceduresList"
      id="procedureCardList"
      // $FlowFixMe .getBoundingClientRect().y is a valid property
      ref={procedureCardListRef}
      css={
        props.procedures.length
          ? loadingStyle.procedureCardList
          : loadingStyle.procedureCardListEmpty
      }
    >
      <div css={style.content}>
        <div css={style.procedureTable}>{renderTable()}</div>
      </div>
    </div>
  );
};

export const ProceduresListTranslated: ComponentType<Props> =
  withNamespaces()(ProceduresList);
export default ProceduresList;
