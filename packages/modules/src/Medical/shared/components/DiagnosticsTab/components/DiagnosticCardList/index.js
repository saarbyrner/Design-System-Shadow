// @flow
import { useMemo, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import uuid from 'uuid';
import moment from 'moment';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { colors } from '@kitman/common/src/variables';

import { withNamespaces } from 'react-i18next';
import {
  TextLink,
  TextButton,
  TooltipMenu,
  InfoTooltip,
} from '@kitman/components';
import { getIssueTitle } from '@kitman/modules/src/Medical/shared/utils';
import { useFlexLayout } from 'react-table';
import {
  TextHeader,
  TextCell,
  LinkTooltipCell,
  TextCellTooltip,
} from '@kitman/components/src/TableCells';
import type { Organisation } from '@kitman/services/src/services/getOrganisation';
import { saveReviewedDiagnostics } from '@kitman/services';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import {
  ToastDialog,
  useToasts,
} from '@kitman/components/src/Toast/KitmanDesignSystem';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { InfiniteScrollLayoutTranslated as InfiniteScrollLayout } from '../../../InfiniteScrollLayout';
import { getIssueTypePath } from '../../../../utils';
import DataTable from '../../../DataTable';
import getStyles from './styles';
import DiagnosticReason from '../DiagnosticReason';
import DiagnosticReasonHeader from '../DiagnosticReasonHeader';
import ReconcilePlayer from '../ReconcilePlayer';
import ReconcilePlayerHeader from '../ReconcilePlayerHeader';
import type { Diagnostic } from '../../../../types';
import { getStatusValue } from '../../utils/getStatusValue';
import { useBulkActions } from '../../contexts/BulkActions';
import BulkActionsCheckbox from './BulkActionsCheckbox';

type SetRequestStatusFunction = (
  status: 'PENDING' | 'SUCCESS' | 'FAILURE'
) => void;

type Props = {
  onReachingEnd: Function,
  openAddDiagnosticAttachmentSidePanel: Function,
  openAddDiagnosticLinkSidePanel: Function,
  onOpenArchiveDiagnosticModal: Function,
  showAvatar?: boolean,
  diagnostics: Array<Diagnostic>,
  currentUser: any,
  diagnosticReasons: any,
  athleteId?: number,
  currentOrganisation: Organisation,
  nextPage: number | null,
  onCheckedReviewDiagnostics: () => void,
  setRequestStatus: SetRequestStatusFunction,
  openAddDiagnosticSidePanel: (opts: {
    diagnosticId: number,
    isAthleteSelectable: boolean,
    athleteId: number,
  }) => void,
};

const DiagnosticsCardList = (props: I18nProps<Props>) => {
  const diagnosticCardListRef = useRef();
  const { permissions } = usePermissions();
  const { toasts, toastDispatch } = useToasts();
  const { bulkActionsState, updateSingleDiagnostic, updateAllDiagnostics } =
    useBulkActions();

  const [saveRequestStatus, setSaveRequestStatus] = useState<
    'DORMANT' | 'PENDING'
  >('DORMANT');

  const loadingStyle = {
    loadingText: {
      color: colors.grey_300,
      fontSize: '14px',
      fontWeight: 'normal',
      lineHeight: '20px',
      marginTop: '24px',
      textAlign: 'center',
    },
    diagnosticCardList: {
      height: `calc(100vh - ${
        diagnosticCardListRef.current?.getBoundingClientRect().y ?? 0
      }px - 20px)`,
      overflowY: 'scroll',
    },
    diagnosticCardListEmpty: {
      height: 'auto',
    },
  };

  const style = getStyles();

  const isRedoxEnabled =
    window.getFlag('redox') && window.getFlag('redox-iteration-1');

  const selectedRowsUnreconciledPlayer =
    props.diagnostics.filter(
      (item) =>
        bulkActionsState.bulkActionsDiagnostics.includes(item.id) &&
        !item.athlete
    ).length !== 0;

  const selectedRowsSamePlayer = [
    ...new Set(
      props.diagnostics
        .filter((item) =>
          bulkActionsState.bulkActionsDiagnostics.includes(item.id)
        )
        .map((item) => item.athlete?.id)
    ),
  ].filter((item) => item);

  const returnActions = (diagnosticId, athleteId) => (
    <div css={style.actions} key={uuid()}>
      <TooltipMenu
        data-testid="DiagnosticCardList|Actions"
        placement="bottom-end"
        menuItems={[
          {
            description: props.t('Edit diagnostic'),
            id: 'editDiagnostic',
            onClick: () =>
              props.openAddDiagnosticSidePanel({
                diagnosticId,
                isAthleteSelectable: false,
                athleteId,
              }),
            isVisible:
              !isRedoxEnabled && window.getFlag('pm-diagnostic-ga-enhancement'),
          },
          {
            description: props.t('Add attachment'),
            id: 'addAttachment',
            onClick: () =>
              props.openAddDiagnosticAttachmentSidePanel(
                diagnosticId,
                athleteId
              ),
            isVisible: true,
          },
          {
            id: 'link',
            description: props.t('Link'),
            onClick: () =>
              props.openAddDiagnosticLinkSidePanel(diagnosticId, athleteId),
            isVisible: true,
          },
          {
            id: 'archive',
            description: props.t('Archive'),
            onClick: () =>
              props.onOpenArchiveDiagnosticModal(diagnosticId, athleteId),
            isVisible:
              permissions.medical.diagnostics.canArchive &&
              window.getFlag('archive-diagnostic-redox'),
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
          <TextButton iconAfter="icon-more" type="subtle" kitmanDesignSystem />
        }
        kitmanDesignSystem
      />
    </div>
  );

  const buildColumns = useMemo(() => {
    const columns = [
      {
        Header: () => (
          <TextHeader
            key={uuid()}
            value={isRedoxEnabled ? props.t('Type - Name') : props.t('Type')}
          />
        ),
        accessor: 'type',
        width: 210,
        Cell: ({ cell: { value } }) => (
          <TextCell
            key={uuid()}
            data-testid="DiagnosticCardList|Type"
            value={value}
          />
        ),
      },
    ];
    if (props.showAvatar)
      columns.unshift({
        Header: () =>
          window.getFlag('diagnostics-tab-bulk-actions') &&
          bulkActionsState.bulkActionsMode ? (
            <ReconcilePlayerHeader
              {...props}
              diagnostics={props.diagnostics}
              selectedRowsUnreconciledPlayer={selectedRowsUnreconciledPlayer}
            />
          ) : (
            <TextHeader key={uuid()} value={props.t('Player')} />
          ),
        accessor: 'avatar',
        show: true,
        width: 210,
        Cell: ({ cell: { value } }) => value,
      });
    if (isRedoxEnabled) {
      columns.push(
        {
          Header: () =>
            window.getFlag('diagnostics-tab-bulk-actions') &&
            bulkActionsState.bulkActionsMode ? (
              <DiagnosticReasonHeader
                {...props}
                diagnostics={props.diagnostics}
                diagnosticReasons={props.diagnosticReasons}
                selectedRowsUnreconciledPlayer={selectedRowsUnreconciledPlayer}
                selectedRowsSamePlayer={
                  selectedRowsSamePlayer.length === 1
                    ? selectedRowsSamePlayer[0]
                    : null
                }
              />
            ) : (
              <TextHeader key={uuid()} value={props.t('Reason')} />
            ),
          accessor: 'reason',
          width: 180,
          Cell: ({ cell: { value } }) =>
            typeof value === 'string' ? (
              <TextCellTooltip key={uuid()} longText={value} valueLimit={18} />
            ) : (
              value
            ),
        },
        {
          Header: () => <TextHeader key={uuid()} value={props.t('Company')} />,
          accessor: 'location',
          width: 150,
          Cell: ({ cell: { value } }) => (
            <TextCellTooltip key={uuid()} longText={value} valueLimit={18} />
          ),
        },
        {
          Header: () => (
            <TextHeader key={uuid()} value={props.t('Order provider')} />
          ),
          accessor: 'prescriber',
          width: 150,
          Cell: ({ cell: { value } }) => (
            <TextCell key={uuid()} value={value} />
          ),
        },
        {
          Header: () => (
            <TextHeader key={uuid()} value={props.t('Attachments')} />
          ),
          accessor: 'attachments',
          width: 120,
          Cell: ({ cell: { value } }) =>
            value === 'N/A' ? <TextCell key={uuid()} value={value} /> : value,
        },
        {
          Header: () => <TextHeader key={uuid()} value={props.t('Date')} />,
          accessor: 'date',
          width: 110,
          Cell: ({ cell: { value } }) => (
            <TextCell
              key={uuid()}
              data-testid="DiagnosticCardList|Date"
              value={value}
            />
          ),
        },
        {
          Header: () => <TextHeader key={uuid()} value={props.t('Status')} />,
          accessor: 'status',
          width: 105,
          Cell: ({ cell: { value } }) =>
            value === '--' ? <TextCell key={uuid()} value={value} /> : value,
        },
        {
          Header: () => <TextHeader key={uuid()} value={props.t('Reviewed')} />,
          accessor: 'reviewed',
          width: 80,
          Cell: ({ cell: { value } }) =>
            value === '--' ? <TextCell key={uuid()} value={value} /> : value,
        }
      );
    }
    if (!isRedoxEnabled) {
      columns.push(
        {
          Header: () => <TextHeader key={uuid()} value={props.t('Date')} />,
          accessor: 'date',
          width: 150,
          Cell: ({ cell: { value } }) => (
            <TextCell
              key={uuid()}
              data-testid="DiagnosticCardList|Date"
              value={value}
            />
          ),
        },
        {
          Header: () => (
            <TextHeader
              key={uuid()}
              value={props.t('Link to an Injury/Illness')}
            />
          ),
          accessor: 'link_to_issue',
          width: 310,
          Cell: ({ cell: { value } }) =>
            value === '--' ? <TextCell key={uuid()} value={value} /> : value,
        },
        {
          Header: () => (
            <TextHeader key={uuid()} value={props.t('Attachments')} />
          ),
          accessor: 'attachments',
          width: 170,
          Cell: ({ cell: { value } }) =>
            value === 'N/A' ? <TextCell key={uuid()} value={value} /> : value,
        },
        {
          Header: () => (
            <TextHeader key={uuid()} value={props.t('Practitioner')} />
          ),
          accessor: 'prescriber',
          width: 210,
          Cell: ({ cell: { value } }) => (
            <TextCell key={uuid()} value={value} />
          ),
        },
        {
          Header: () => <TextHeader key={uuid()} value={props.t('Reason')} />,
          accessor: 'reason',
          width: 210,
          Cell: ({ cell: { value } }) => (
            <TextCell key={uuid()} value={value} />
          ),
        },
        {
          Header: () => <TextHeader key={uuid()} value={props.t('Location')} />,
          accessor: 'location',
          width: 210,
          Cell: ({ cell: { value } }) => (
            <TextCell key={uuid()} value={value} />
          ),
        }
      );
    }

    if (
      window.getFlag('referring-physician-treatments-diagnostics') &&
      !isRedoxEnabled
    ) {
      columns.push({
        Header: () => (
          <TextHeader key={uuid()} value={props.t('Referring physician')} />
        ),
        accessor: 'referringPhysician',
        width: 210,
        Cell: ({ cell: { value } }) => <TextCell key={uuid()} value={value} />,
      });
    }
    if (
      window.getFlag('medical-diagnostics-iteration-3-billing-cpt') &&
      !isRedoxEnabled
    ) {
      if (!window.getFlag('diagnostics-billing-extra-fields')) {
        columns.push(
          {
            Header: () => (
              <TextHeader key={uuid()} value={props.t('CPT code')} />
            ),
            accessor: 'cptCode',
            width: 210,
            Cell: ({ cell: { value } }) => (
              <TextCell key={uuid()} value={value} />
            ),
          },
          {
            Header: () => (
              <TextHeader key={uuid()} value={props.t('Billable')} />
            ),
            accessor: 'isBillable',
            width: 210,
            Cell: ({ cell: { value } }) => (
              <TextCell key={uuid()} value={value} />
            ),
          },
          {
            Header: () => (
              <TextHeader
                key={uuid()}
                value={props.t('Amount paid by insurance')}
              />
            ),
            accessor: 'amountPaidInsurance',
            width: 210,
            Cell: ({ cell: { value } }) => (
              <TextCell key={uuid()} value={value} />
            ),
          },
          {
            Header: () => (
              <TextHeader
                key={uuid()}
                value={props.t('Amount paid by athlete')}
              />
            ),
            accessor: 'amountPaidAthlete',
            width: 210,
            Cell: ({ cell: { value } }) => (
              <TextCell key={uuid()} value={value} />
            ),
          }
        );
      } else if (window.getFlag('diagnostics-billing-extra-fields')) {
        columns.push(
          {
            Header: () => (
              <TextHeader key={uuid()} value={props.t('CPT code')} />
            ),
            accessor: 'cptCode',
            width: 210,
            Cell: ({ cell: { value } }) => (
              <TextCell key={uuid()} value={value} />
            ),
          },
          {
            Header: () => (
              <TextHeader key={uuid()} value={props.t('Billable')} />
            ),
            accessor: 'isBillable',
            width: 210,
            Cell: ({ cell: { value } }) => (
              <TextCell key={uuid()} value={value} />
            ),
          },
          {
            Header: () => (
              <TextHeader key={uuid()} value={props.t('Amount charged')} />
            ),
            accessor: 'amountCharged',
            width: 210,
            Cell: ({ cell: { value } }) => (
              <TextCell key={uuid()} value={value} />
            ),
          },
          {
            Header: () => (
              <TextHeader key={uuid()} value={props.t('Discount/ reduction')} />
            ),
            accessor: 'discountOrReduction',
            width: 210,
            Cell: ({ cell: { value } }) => (
              <TextCell key={uuid()} value={value} />
            ),
          },
          {
            Header: () => (
              <TextHeader
                key={uuid()}
                value={props.t('Amount insurance paid')}
              />
            ),
            accessor: 'amountPaidInsurance',
            width: 210,
            Cell: ({ cell: { value } }) => (
              <TextCell key={uuid()} value={value} />
            ),
          },
          {
            Header: () => (
              <TextHeader key={uuid()} value={props.t('Amount due')} />
            ),
            accessor: 'amountDue',
            width: 210,
            Cell: ({ cell: { value } }) => (
              <TextCell key={uuid()} value={value} />
            ),
          },
          {
            Header: () => (
              <TextHeader key={uuid()} value={props.t('Amount athlete paid')} />
            ),
            accessor: 'amountPaidAthlete',
            width: 210,
            Cell: ({ cell: { value } }) => (
              <TextCell key={uuid()} value={value} />
            ),
          },
          {
            Header: () => (
              <TextHeader key={uuid()} value={props.t('Date paid')} />
            ),
            accessor: 'datePaidDate',
            width: 210,
            Cell: ({ cell: { value } }) => (
              <TextCell key={uuid()} value={value} />
            ),
          }
        );
      }
    }

    columns.push({
      Header: () => <TextHeader key={uuid()} value={props.t('')} />,
      accessor: 'actions',
      width: 40,
      Cell: ({ cell: { value } }) => <TextCell key={uuid()} value={value} />,
    });

    if (window.getFlag('diagnostics-tab-bulk-actions')) {
      columns.unshift({
        Header: () => (
          <div css={style.checkbox}>
            <BulkActionsCheckbox
              {...props}
              id={uuid()}
              isChecked={bulkActionsState.allDiagnosticsChecked || false}
              onToggle={(checked) => {
                updateAllDiagnostics({
                  checked,
                  diagnostics: props.diagnostics,
                });
              }}
            />
          </div>
        ),
        accessor: 'bulk-actions',
        width: 25,
        Cell: ({ row }) => {
          return (
            <div css={style.checkbox}>
              <BulkActionsCheckbox
                id={uuid()}
                diagnosticId={row.original.diagnosticId}
                isChecked={
                  !!bulkActionsState.bulkActionsDiagnostics?.find(
                    (item) => item === row.original.diagnosticId
                  )
                }
                onToggle={(checked) => {
                  updateSingleDiagnostic({
                    diagnosticId: row.original.diagnosticId,
                    checked,
                    diagnosticCount: props.diagnostics.length,
                  });
                }}
              />
            </div>
          );
        },
      });
    }

    return columns;
  });

  const renderType = (diagnostic: Diagnostic) => {
    if (diagnostic.type && diagnostic.athlete) {
      return (
        <LinkTooltipCell
          key={uuid()}
          data-testid="DiagnosticCardList|TypeLink"
          valueLimit={25}
          url={`/medical/athletes/${diagnostic.athlete.id}/diagnostics/${diagnostic.id}`}
          longText={diagnostic.type}
        />
      );
    }

    if (diagnostic.type && !diagnostic.athlete) {
      return (
        <TextCellTooltip
          key={uuid()}
          data-testid="DiagnosticCardList|TypeLink"
          valueLimit={25}
          longText={diagnostic.type}
        />
      );
    }

    return '--';
  };

  const renderStatus = (diagnostic: Diagnostic) => {
    const diagnosticStatus = getStatusValue(diagnostic.status?.value);

    return (
      <div css={[style.diagnosticStatus, diagnosticStatus.style]}>
        <span>{diagnosticStatus.status}</span>
      </div>
    );
  };

  const renderReviewed = (diagnostic: Diagnostic) => {
    const isReviewed = diagnostic.reviewed;

    const handleCheckboxChange = () => {
      props.setRequestStatus('PENDING');
      setSaveRequestStatus('PENDING');

      if (
        diagnostic.athlete &&
        diagnostic.diagnostic_reason &&
        diagnostic.reviewed !== null
      ) {
        const updatedReviewStatus = !isReviewed;

        const redoxResults = [
          {
            diagnostic_id: diagnostic.id,
            reviewed: updatedReviewStatus,
          },
        ];
        saveReviewedDiagnostics(redoxResults)
          .then(() => {
            props.setRequestStatus('SUCCESS');
            props.onCheckedReviewDiagnostics();
            setSaveRequestStatus('DORMANT');
          })
          .catch(() => {
            toastDispatch({
              type: 'UPDATE_TOAST',
              toast: {
                id: 'checkedDiagnosticsError',
                title: props.t('Diagnostic were not updated'),
                description: props.t(
                  'There was an error while updating diagnostic'
                ),
                status: 'ERROR',
                links: [
                  {
                    id: 1,
                    text: props.t('Try again'),
                    link: '#',
                    withHashParam: true,
                    metadata: {
                      action: 'RETRY_CHECKED_REQUEST',
                    },
                  },
                ],
              },
            });
            setSaveRequestStatus('DORMANT');
          });
      }
    };
    const closeToast = (id) => {
      toastDispatch({
        type: 'REMOVE_TOAST_BY_ID',
        id,
      });
    };

    const onClickToastLink = (toastLink) => {
      if (toastLink?.metadata?.action === 'RETRY_CHECKED_REQUEST') {
        closeToast('reconcileDiagnosticsError');
        handleCheckboxChange();
      }
    };
    const isDisabled =
      !(diagnostic.athlete && diagnostic.diagnostic_reason) ||
      diagnostic.reviewed === null;

    let buttonContent;
    if (isReviewed === null && isDisabled) {
      buttonContent = (
        <InfoTooltip
          content={props.t(
            'This diagnostic does not have results to be reviewed'
          )}
        >
          <button type="button">
            <KitmanIcon
              name={KITMAN_ICON_NAMES.NotAllowed}
              style={{ fill: colors.neutral_400 }}
            />
          </button>
        </InfoTooltip>
      );
    } else if (isReviewed) {
      buttonContent = (
        <InfoTooltip content={props.t('Click to unreview')}>
          <button
            type="button"
            onClick={handleCheckboxChange}
            disabled={isDisabled || saveRequestStatus === 'PENDING'}
          >
            <KitmanIcon
              name={KITMAN_ICON_NAMES.CheckCircle}
              style={{ fill: colors.green_100 }}
            />
          </button>
        </InfoTooltip>
      );
    } else {
      buttonContent = (
        <InfoTooltip content={props.t('Click to review')}>
          <button
            type="button"
            id={`checkbox_${diagnostic.id}`}
            disabled={isDisabled || saveRequestStatus === 'PENDING'}
            onClick={handleCheckboxChange}
          >
            <KitmanIcon name={KITMAN_ICON_NAMES.RadioBtnUnchecked} />
          </button>
        </InfoTooltip>
      );
    }
    return (
      <>
        <div css={style.diagnosticCheckboxContainer}>{buttonContent}</div>
        <ToastDialog
          toasts={toasts}
          onClickToastLink={onClickToastLink}
          onCloseToast={closeToast}
        />
      </>
    );
  };

  const renderMultiCellsWithCPT = (diagnostic, key) => {
    if (diagnostic.billable_items.length > 0) {
      return (
        <div key={uuid()}>
          {diagnostic.billable_items.map((billableItem) =>
            key === 'cpt_code' ? (
              <div key={uuid()}>
                <TextCell
                  value={billableItem[key] ? billableItem[key] : '--'}
                />
              </div>
            ) : (
              <div key={uuid()}>
                <TextCell
                  value={billableItem[key] ? `$${billableItem[key]}` : '--'}
                />
              </div>
            )
          )}
        </div>
      );
    }
    return '--';
  };

  const renderMultiDatePaid = (diagnostic) => {
    if (diagnostic.billable_items.length > 0) {
      return (
        <div key={uuid()}>
          {diagnostic.billable_items.map((billableItem) => (
            <div key={uuid()}>
              <TextCell
                value={
                  billableItem?.date_paid
                    ? moment(billableItem?.date_paid).format('MMM D YYYY')
                    : '--'
                }
              />
            </div>
          ))}
        </div>
      );
    }
    return '--';
  };
  const renderIsBillable = (diagnostic) => {
    if (diagnostic.billable_items.length > 0) {
      return (
        <div key={uuid()}>
          {diagnostic.billable_items.map((billableItem) => (
            <div key={uuid()}>
              <TextCell
                value={
                  billableItem.is_billable ? props.t('Yes') : props.t('No')
                }
              />
            </div>
          ))}
        </div>
      );
    }
    return diagnostic.is_billable ? props.t('Yes') : props.t('No');
  };

  const getPDFsToRender = (diagnostic) =>
    diagnostic.redox_pdf_results.map((pdfLink) => {
      return (
        <LinkTooltipCell
          key={`${pdfLink.value}`}
          data-testid="DiagnosticCardList|Link"
          fileType="link-icon"
          valueLimit={18}
          url={`data:application/octet-stream;base64,${pdfLink.value}`}
          longText={
            pdfLink?.created_at
              ? `${moment(pdfLink.created_at).format('YYYY-MM-DD-HH:MM')}-${
                  pdfLink.description
                }`
              : pdfLink?.description
          }
          includeIcon
          onlyShowIcon={isRedoxEnabled}
          downloadTitle={
            pdfLink?.created_at
              ? `${moment(pdfLink.created_at).format('YYYY-MM-DD-HH:MM')}-${
                  pdfLink.description
                }`
              : pdfLink?.description
          }
        />
      );
    });

  const getLinksToRender = (diagnostic) =>
    diagnostic.attached_links.map((link) => {
      const isAmbraLink = link.uri_type === 'ambra';
      const { firstname: givenname, lastname, email } = props.currentUser;
      const linkURI =
        isAmbraLink && props.currentUser
          ? encodeURI(
              `${link.uri}&first=${givenname}&last=${lastname}&email=${email}`
            )
          : link.uri;

      return (
        <LinkTooltipCell
          key={`${link.uri}_${link.id}`}
          data-testid="DiagnosticCardList|Link"
          fileType="link-icon"
          valueLimit={18}
          url={linkURI}
          longText={link.title}
          isExternalLink
          isLink
          includeIcon
          target="_blank"
          onlyShowIcon={isRedoxEnabled}
        />
      );
    });

  const getAttachmentsToRender = (diagnostic) => {
    return diagnostic.attachments.map((attachment) => (
      <LinkTooltipCell
        key={`${attachment.filename}_${attachment.id}`}
        data-testid="DiagnosticCardList|AttachmentLink"
        fileType={attachment.filetype}
        valueLimit={18}
        url={attachment.url}
        longText={attachment.filename}
        isExternalLink
        includeIcon
        target="_blank"
        onlyShowIcon={isRedoxEnabled}
      />
    ));
  };
  const getIssuesToRender = (diagnostic, options?: any) => {
    return diagnostic.issue_occurrences.length > 0 ||
      diagnostic.chronic_issues.length > 0 ? (
      <>
        {diagnostic.issue_occurrences.map((issue) => {
          return (
            <LinkTooltipCell
              key={uuid()}
              data-testid="DiagnosticCardList|IssueLink"
              valueLimit={options?.valueLimit || 20}
              url={`/medical/athletes/${
                diagnostic.athlete.id
              }/${getIssueTypePath(issue.issue_type)}/${issue.id}`}
              longText={getIssueTitle(issue, false)}
            />
          );
        })}
        {diagnostic.chronic_issues.map((issue) => {
          return (
            <LinkTooltipCell
              key={uuid()}
              data-testid="DiagnosticCardList|ChronicIssueLink"
              valueLimit={options?.valueLimit || 20}
              url={`/medical/athletes/${diagnostic.athlete.id}/chronic_issues/${issue.id}`}
              longText={issue.full_pathology}
            />
          );
        })}
      </>
    ) : (
      options?.noIssueText || 'Injury/ Illness with no associated ISSUE'
    );
  };

  const renderReason = (diagnostic, index) => {
    if (!diagnostic.diagnostic_reason && isRedoxEnabled)
      return (
        <DiagnosticReason
          {...props}
          index={index}
          diagnostic={diagnostic}
          diagnosticReasons={props.diagnosticReasons}
        />
      );

    if (diagnostic.diagnostic_reason?.name === 'Injury/ Illness')
      return getIssuesToRender(diagnostic);

    return diagnostic?.diagnostic_reason?.name
      ? // <TooltipCell value={diagnostic.diagnostic_reason.name} />
        diagnostic.diagnostic_reason.name
      : '--';
  };

  const wasCreatedWithinCurrentOrganisation = (diagnosticOrgId: number) => {
    return props.currentOrganisation.id === diagnosticOrgId;
  };

  const buildActions = (diagnostic: Diagnostic) => {
    return wasCreatedWithinCurrentOrganisation(diagnostic.organisation_id)
      ? returnActions(diagnostic.id, diagnostic.athlete.id)
      : '';
  };

  const buildData = () => {
    return props.diagnostics
      .filter((diagnostic) =>
        props.athleteId ? diagnostic.athlete !== null : diagnostic
      )
      ?.map((diagnostic, index) => {
        return {
          diagnosticId: diagnostic.id,
          avatar:
            diagnostic.athlete === null ? (
              <ReconcilePlayer diagnostic={diagnostic} index={index} />
            ) : (
              <div
                key={uuid()}
                css={style.athleteDetails}
                data-testid="DiagnosticCardList|Avatar"
              >
                <img
                  css={style.athleteAvatar}
                  src={diagnostic.athlete.avatar_url}
                  alt={`${diagnostic.athlete.fullname}'s avatar`}
                />
                <div css={style.athleteInfo}>
                  <TextLink
                    text={diagnostic.athlete.fullname}
                    href={`/medical/athletes/${diagnostic.athlete.id}`}
                    kitmanDesignSystem
                  />
                  <p css={style.athletePosition}>
                    {diagnostic.athlete.position}
                  </p>
                </div>
              </div>
            ),
          type: renderType(diagnostic),
          status: renderStatus(diagnostic),
          reviewed: renderReviewed(diagnostic),
          prescriber: isRedoxEnabled
            ? diagnostic?.provider?.fullname || '--'
            : diagnostic?.prescriber?.fullname || '--',
          location: diagnostic?.location?.name || '--',
          referringPhysician: diagnostic?.referring_physician || '--',
          cptCode: renderMultiCellsWithCPT(diagnostic, 'cpt_code'),
          isBillable: renderIsBillable(diagnostic),

          amountCharged: renderMultiCellsWithCPT(diagnostic, 'amount_charged'),
          discountOrReduction: renderMultiCellsWithCPT(diagnostic, 'discount'),
          amountPaidInsurance: renderMultiCellsWithCPT(
            diagnostic,
            'amount_paid_insurance'
          ),
          amountDue: renderMultiCellsWithCPT(diagnostic, 'amount_due'),
          amountPaidAthlete: renderMultiCellsWithCPT(
            diagnostic,
            'amount_paid_athlete'
          ),
          datePaidDate: renderMultiDatePaid(diagnostic),
          reason: renderReason(diagnostic, index),
          date:
            moment(diagnostic.diagnostic_date).format('MMM D, YYYY') || '--',
          link_to_issue: getIssuesToRender(diagnostic, {
            noIssueText: '--',
            valueLimit: 40,
          }),
          attachments: (
            <div css={style.attachmentsContainer}>
              <div>{getAttachmentsToRender(diagnostic)}</div>
              <div>{getLinksToRender(diagnostic)}</div>
              <div>{getPDFsToRender(diagnostic)}</div>
            </div>
          ),
          actions: diagnostic.athlete === null ? '' : buildActions(diagnostic),
          selected: bulkActionsState.bulkActionsDiagnostics.includes(
            diagnostic.id
          ),
        };
      });
  };

  const renderTable = () => {
    return (
      <InfiniteScrollLayout
        itemsLength={props.diagnostics.length}
        onReachingEnd={props.onReachingEnd}
        hasMore={!!props.nextPage}
        nextPage={props.nextPage}
        scrollableTarget="diagnosticCardList"
      >
        <DataTable
          columns={buildColumns}
          data={buildData()}
          useLayout={useFlexLayout}
          isTableEmpty={props.diagnostics.length === 0}
        />
      </InfiniteScrollLayout>
    );
  };
  return (
    <div
      id="diagnosticCardList"
      data-testid="DiagnosticCardList|Container"
      // $FlowFixMe .getBoundingClientRect().y is a valid property
      ref={diagnosticCardListRef}
      css={
        props.diagnostics.length
          ? loadingStyle.diagnosticCardList
          : loadingStyle.diagnosticCardListEmpty
      }
    >
      <div css={style.content}>
        <div css={style.diagnosticTable}>{renderTable()}</div>
      </div>
    </div>
  );
};

export const DiagnosticsCardListTranslated: ComponentType<Props> =
  withNamespaces()(DiagnosticsCardList);
export default DiagnosticsCardList;
