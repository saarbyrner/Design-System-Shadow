// @flow
import { type ComponentType, Fragment, useMemo, useRef } from 'react';
import uuid from 'uuid';
import InfiniteScroll from 'react-infinite-scroll-component';
import { withNamespaces } from 'react-i18next';
import { useFlexLayout } from 'react-table';
import moment from 'moment';
import {
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';

import { colors } from '@kitman/common/src/variables';
import { TextButton, TextLink, TooltipMenu } from '@kitman/components';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { saveMedicationFavorite } from '@kitman/services/src/services/medical';
import DataTable from '@kitman/modules/src/Medical/shared/components/DataTable';
import {
  DirectionsCell,
  MedicationCell,
  RichTextCell,
  TextCell,
  TextHeader,
} from '@kitman/modules/src/Medical/shared/components/MedicationsTab/components/MedicationTableCells';
import {
  getIssueTitle,
  getIssueTypePath,
} from '@kitman/modules/src/Medical/shared/utils';
import { ADD_MEDICATION_BUTTON } from '@kitman/modules/src/Medical/shared/constants/elementTags';
import getStyles from '@kitman/modules/src/Medical/shared/components/MedicationsTab/components/MedicationCardList/styles';
import { drugTypesEnum } from '@kitman/modules/src/Medical/shared/types/medical/Medications';

// Types:
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { RequestStatus } from '@kitman/common/src/types';
import type { TooltipItem } from '@kitman/components/src/TooltipMenu/index';
import type { DrFirstMedicationsDataResponse } from '@kitman/modules/src/Medical/shared/types/medical';

export const favoritableDrugTypes = [
  'FdbDispensableDrug',
  drugTypesEnum.FdbDispensableDrug,
  drugTypesEnum.NhsDmdDrug,
];

type Props = {
  athleteId: number,
  medications: Array<DrFirstMedicationsDataResponse>,
  requestStatus: RequestStatus,
  playerLevel?: boolean,
  onReachingEnd: Function,
  hasMoreMedications: boolean,
  onOpenDispenseMedicationsSidePanel: Function,
  onViewSelectedMedicationAttachments: () => void,
  setSelectedMedication: Function,
  onFavoriteMedicationStart: Function,
  onFavoriteMedicationSuccess: Function,
  onFavoriteMedicationFailure: Function,
  onOpenArchiveMedicationModal: Function,
  hiddenFilters?: ?Array<string>,
};

const Pill = ({ status }) => {
  const getPillColor = (newStatus) => {
    let color;
    switch (newStatus) {
      case 'active':
        color = colors.blue_400;
        break;
      case 'paused':
        color = colors.orange_200;
        break;
      case 'inactive':
        color = colors.grey_300_50;
        break;
      default:
        color = colors.grey_300_50;
    }
    return color;
  };

  return (
    <div
      css={{
        color: 'white',
        padding: '2px 20px',
        fontSize: '12px',
        lineHeight: '16px',
        width: '100px',
        borderRadius: '30px',
        backgroundColor: getPillColor(status),
        textTransform: 'capitalize',
      }}
      key={uuid()}
    >
      {status}
    </div>
  );
};

const MedicationCardList = (props: I18nProps<Props>) => {
  const medicationsCardListRef = useRef();
  const { permissions } = usePermissions();

  const MedicationCardTable = {
    height: `calc(100vh - ${
      medicationsCardListRef.current?.getBoundingClientRect().y ?? 0
    }px - 20px)`,
    overflowY: 'scroll',
  };

  const style = getStyles();

  const isActionButtonVisible = (medication) =>
    (medication.type === 'InternalStock' &&
      permissions.medical.stockManagement.canDispense &&
      permissions.medical.medications.canEdit) ||
    (medication.type === 'InternallyLogged' &&
      permissions.medical.medications.canLog &&
      permissions.medical.medications.canEdit) ||
    (medication.source !== 'ePrescribed' &&
      permissions.medical.medications.canArchive) ||
    medication.drug_type === 'FdbDispensableDrug';

  const returnActions = (medication) => {
    const menuItems: Array<TooltipItem> = [];
    if (
      // prettier-ignore
      permissions.medical.medications.canEdit &&
      (
        medication.type === 'InternalStock' &&
        permissions.medical.stockManagement.canDispense
      ) ||
      (
        medication.type === 'InternallyLogged' &&
        permissions.medical.medications.canLog
      )
    ) {
      menuItems.push({
        description: props.t('Edit'),
        onClick: () => {
          props.setSelectedMedication(medication);
          props.onOpenDispenseMedicationsSidePanel();
        },
      });
    }
    if (
      medication.source !== 'ePrescribed' &&
      permissions.medical.medications.canArchive
    ) {
      menuItems.push({
        description: props.t('Archive'),
        onClick: () => {
          props.onOpenArchiveMedicationModal(medication.id);
        },
      });
    }

    if (
      medication.drug_type &&
      favoritableDrugTypes.includes(medication.drug_type)
    ) {
      menuItems.push({
        description: props.t('Favorite'),
        onClick: () => {
          props.onFavoriteMedicationStart(medication);

          const startDate = moment(medication.start_date);
          const endDate = moment(medication.end_date);
          const duration = endDate.diff(startDate, 'days') + 1;
          if (medication.drug_type) {
            saveMedicationFavorite({
              drug_type: medication.drug_type,
              drug_id: medication.drug.id,
              tapered: medication.tapered,
              directions: medication.directions,
              dose: medication.dose,
              dose_units: medication.dose_units,
              frequency: medication.frequency,
              route: medication.route,
              duration,
            })
              .then(() => {
                props.onFavoriteMedicationSuccess(medication);
              })
              .catch(() => {
                props.onFavoriteMedicationFailure(medication);
              });
          }
        },
      });
    }
    return (
      <div css={style.actions} key={uuid()} data-testid="MeatballMenu">
        <TooltipMenu
          placement="bottom-end"
          menuItems={menuItems}
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
        Header: () => <TextHeader key={uuid()} value={props.t('Medication')} />,
        accessor: 'medication_display',
        width: 150,
        Cell: ({ cell: { value } }) => {
          const attachments = value.medication.attachments?.filter(
            (attachment) =>
              attachment.confirmed && attachment.archived_at === null
          );
          let tooltipTitle;
          if (attachments) {
            tooltipTitle =
              attachments.length === 1
                ? attachments[0].name || attachments[0].filename
                : props.t('{{count}} files', { count: attachments.length });
          }
          return (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Box sx={{ minWidth: '40px', alignContent: 'center' }}>
                {attachments?.length > 0 && (
                  <Tooltip
                    title={tooltipTitle}
                    placement="right"
                    slotProps={{
                      popper: {
                        modifiers: [
                          {
                            name: 'offset',
                            options: {
                              offset: [32, -24],
                            },
                          },
                        ],
                      },
                    }}
                  >
                    <IconButton
                      onClick={() => {
                        props.setSelectedMedication(value.medication);
                        props.onViewSelectedMedicationAttachments();
                      }}
                    >
                      <KitmanIcon name={KITMAN_ICON_NAMES.AttachFileOutlined} />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              <Box>
                <MedicationCell
                  key={uuid()}
                  data-testid="MedicationCardList|Medication"
                  medication={value.display_name}
                />
                <DirectionsCell
                  key={uuid()}
                  data-testid="MedicationCardList|Directions"
                  value={value.medication.all_directions}
                />
              </Box>
            </Box>
          );
        },
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Quantity')} />,
        accessor: 'quantity',
        width: 80,
        Cell: ({ cell: { value } }) => (
          <TextCell
            key={uuid()}
            data-testid="MedicationCardList|Quantity"
            value={value === '0' ? '' : value}
          />
        ),
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Note')} />,
        accessor: 'note',
        width: 130,
        Cell: ({ cell: { value } }) => (
          <RichTextCell
            key={uuid()}
            data-testid="MedicationCardList|Note"
            value={value}
            abbreviatedHeight={60}
          />
        ),
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Prescriber')} />,
        accessor: 'prescriber',
        width: 100,
        Cell: ({ cell: { value } }) => (
          <div css={style.alignLeft}>
            <TextCell
              key={uuid()}
              data-testid="MedicationCardList|Prescriber"
              value={value}
            />
          </div>
        ),
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Source')} />,
        accessor: 'source',
        width: 100,
        Cell: ({ cell: { value } }) => {
          return (
            <div css={style.alignLeft}>
              <TextCell
                key={uuid()}
                data-testid="MedicationCardList|Source"
                value={value}
              />
            </div>
          );
        },
      },

      {
        Header: () => <TextHeader key={uuid()} value={props.t('Start Date')} />,
        accessor: 'startDate',
        width: 100,
        Cell: ({ cell: { value } }) => {
          return (
            <TextCell
              key={uuid()}
              data-testid="MedicationCardList|StartDate"
              value={value && moment(value).format('MMM DD, YYYY')}
            />
          );
        },
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('End Date')} />,
        accessor: 'endDate',
        width: 100,
        Cell: ({ cell: { value } }) => {
          return (
            <TextCell
              key={uuid()}
              data-testid="MedicationCardList|EndDate"
              value={value && moment(value).format('MMM DD, YYYY')}
            />
          );
        },
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Status')} />,
        accessor: 'status',
        width: 120,
        Cell: ({ cell: { value } }) => {
          return value && <Pill status={value} t={props.t} />;
        },
      },
      {
        Header: () => <TextHeader key={uuid()} value="" />,
        accessor: 'actions',
        width: 20,
        Cell: ({ cell: { value } }) => (
          <TextCell
            key={uuid()}
            data-testid="MedicationsTable|Actions"
            value={value}
          />
        ),
      },
    ];

    // conditionally adding reason column in if on player view
    if (props.playerLevel) {
      columns.splice(2, 0, {
        Header: () => <TextHeader key={uuid()} value={props.t('Reason')} />,
        accessor: 'reason',
        width: 130,
        Cell: ({ cell: { value } }) => {
          const chronicIssuesWithLink = [...value.chronic_issues].map(
            (chronicIssue) => {
              const link = `/medical/athletes/${props.athleteId}/chronic_issues/${chronicIssue.id}`;
              return {
                ...chronicIssue,
                link,
                issue_occurrence_title:
                  chronicIssue.pathology || chronicIssue.full_pathology,
              };
            }
          );
          const issuesWithLink = [...value.issues].map((issue) => {
            const link = `/medical/athletes/${
              props.athleteId
            }/${getIssueTypePath(issue.issue_type)}/${issue.id}`;
            return {
              ...issue,
              link,
            };
          });
          return (
            <>
              {[...issuesWithLink, ...chronicIssuesWithLink].map((issue) => {
                return (
                  <Fragment key={uuid()}>
                    {issue.link ? (
                      <div css={style.alignLeft}>
                        <TextLink
                          text={getIssueTitle(issue, false)}
                          href={issue.link}
                          kitmanDesignSystem
                          key={uuid()}
                        />
                      </div>
                    ) : (
                      <div css={style.alignLeft}>
                        <TextCell
                          key={uuid()}
                          value={getIssueTitle(issue, false)}
                        />
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </>
          );
        },
      });
    }

    return columns;
  });

  const buildData = () => {
    return (
      props.medications &&
      props.medications.length &&
      props.medications.map((medicationItem) => {
        const prescriberName = medicationItem.external_prescriber_name
          ? medicationItem.external_prescriber_name
          : medicationItem.prescriber?.fullname;
        return {
          medication: medicationItem,
          medication_display: {
            display_name:
              medicationItem.display_name || medicationItem.drug?.name,
            medication: medicationItem,
          },
          quantity: medicationItem.quantity || '',
          dose: medicationItem.dose || '',
          note: medicationItem.note || '',
          dose_units: medicationItem.dose_units || '',
          drug_type: medicationItem.drug_type || '',
          reason: medicationItem,
          prescriber: prescriberName,
          pharmacy: medicationItem.pharmacy || '',
          startDate: medicationItem.start_date || '',
          endDate: medicationItem.end_date || '',
          status: medicationItem.status || '',
          source: medicationItem.source || '',
          actions:
            isActionButtonVisible(medicationItem) &&
            !props.hiddenFilters?.includes(ADD_MEDICATION_BUTTON)
              ? returnActions(medicationItem)
              : '',
        };
      })
    );
  };

  const renderTable = () => {
    return (
      <InfiniteScroll
        dataLength={props.medications && props.medications.length}
        next={props.onReachingEnd}
        hasMore={props.hasMoreMedications}
        loader={
          <div
            css={style.loadingText}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
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
        scrollableTarget="medicationCardListContainer"
      >
        <DataTable
          columns={buildColumns}
          data={buildData() || []}
          useLayout={useFlexLayout}
          isTableEmpty={props.medications.length === 0}
        />
        {props.requestStatus === 'SUCCESS' && !props.medications.length && (
          <div css={style.noMedicationsText}>
            {props.t('No medications for this period')}
          </div>
        )}
      </InfiniteScroll>
    );
  };

  return (
    <div
      id="medicationCardListContainer"
      data-testid="MedicationCardList"
      // $FlowFixMe .getBoundingClientRect().y is a valid property
      ref={medicationsCardListRef}
      css={
        props.medications.length
          ? MedicationCardTable
          : style.MedicationCardListEmpty
      }
    >
      <div css={style.content}>
        <div css={style.medicationsTable}>{renderTable()}</div>
      </div>
    </div>
  );
};

export const MedicationCardListTranslated: ComponentType<Props> =
  withNamespaces()(MedicationCardList);
export default MedicationCardList;
