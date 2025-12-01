/* eslint-disable react/jsx-no-target-blank */
// @flow
import { useState } from 'react';
import type { ComponentType } from 'react';
import moment from 'moment-timezone';
import { withNamespaces } from 'react-i18next';
import {
  RichTextDisplay,
  TextButton,
  TextLink,
  TooltipMenu,
} from '@kitman/components';
import { getContentTypeIcon } from '@kitman/common/src/utils/mediaHelper';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { LinkTooltipCell } from '@kitman/components/src/TableCells';
import {
  formatStandard,
  formatRange,
} from '@kitman/common/src/utils/dateFormatter';
import type { TooltipItem } from '@kitman/components/src/TooltipMenu/index';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { TreatmentSession, RequestStatus } from '../../../../types';
import { CptCodeTranslated as CptCode } from './CptCodeField';
import { IcdCodeTranslated as IcdCode } from './IcdCodeField';
import { BillableTranslated as Billable } from './BillableField';
import { AmountPaidTranslated as AmountPaid } from './AmountPaidField';
import { DateFieldTranslated as DateField } from './DateField';
import { TextHeader, TextCell, TooltipCell } from '../TreatmentTableCells';
import DataTable from '../../../DataTable';
import getStyles from './styles';

type Props = {
  treatment: TreatmentSession,
  isEditing: boolean,
  setIsEditing: Function,
  showAthleteInformation: boolean,
  requestStatus: RequestStatus,
  onClickReplicateTreatment: Function,
  onClickDuplicateTreatment: Function,
  onClickSaveTreatment: Function,
};

const TreatmentCard = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const { organisation } = useOrganisation();
  const originalTreatments = props.treatment.treatments.slice();

  const [treatments, setTreatments] = useState(props.treatment.treatments);
  const style = getStyles();

  const renderTreatmentApointmentInfo = () => {
    return (
      <div css={style.treatmentAppointment}>
        {props.showAthleteInformation && (
          <div data-testid="TreatmentCard|AthleteDetails">
            <h2
              css={style.athleteDetails}
              className="kitmanHeading--L3"
              data-testid="TreatmentCard|AthleteInformations"
            >
              <img
                css={style.athleteAvatar}
                src={props.treatment.athlete.avatar_url}
                alt={props.treatment.athlete.fullname}
                data-testid="TreatmentCard|AthleteAvatar"
              />
              <TextLink
                text={props.treatment.athlete.fullname}
                href={`/medical/athletes/${props.treatment.athlete.id}`}
              />
            </h2>
          </div>
        )}
        <div css={style.treatmentDate} data-testid="TreatmentCard|DateAndTime">
          {formatRange(
            moment(props.treatment.start_time),
            moment(props.treatment.end_time),
            true
          )}
        </div>
        <div
          css={style.treatmentPractitioner}
          data-testid="TreatmentCard|Practitioner"
        >
          {props.treatment.user.fullname}
        </div>
      </div>
    );
  };

  const renderAttachments = () => {
    const { attachments } = props.treatment.annotation;

    return (
      <div css={style.treatmentAttachments}>
        <h4
          css={style.sectionTitle}
          data-testid="TreatmentCard|AttachmentsHeader"
        >
          {props.t('Files ({{count}})', { count: attachments.length })}
        </h4>
        <ul css={style.attachmentsList} data-testid="TreatmentCard|Attachments">
          {attachments.map((attachment) => (
            <li key={attachment.id} css={style.attachmentItem}>
              <div>
                <a
                  data-testid="TreatmentCard|AttachmentLink"
                  target="_blank"
                  href={attachment.url}
                  css={style.attachmentLink}
                >
                  <i
                    css={style.attachmentIcon}
                    className={getContentTypeIcon(attachment.filetype)}
                  />{' '}
                  {attachment.filename}
                </a>
              </div>
              {attachment.created_by && (
                <h4 css={style.attachmentCreated}>
                  {props.t('Created by {{creator}}', {
                    creator: attachment.created_by.fullname,
                  })}
                </h4>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const canRenderActions = props.treatment.organisation_id === organisation.id;

  const renderActions = () => {
    const menuItems: Array<TooltipItem> = [];

    if (
      window.featureFlags['treatments-billing'] &&
      permissions.medical.treatments.canEdit
    ) {
      menuItems.push({
        description: props.t('Edit billing'),
        onClick: () =>
          props.setIsEditing((updateIsEditing) => !updateIsEditing),
      });
    }

    if (
      window.featureFlags['treatments-multi-modality'] &&
      window.featureFlags['replicate-treatments'] &&
      permissions.medical.treatments.canEdit
    ) {
      menuItems.push({
        description: props.t('Replicate treatment'),
        onClick: () => props.onClickReplicateTreatment(props.treatment),
      });
    }

    if (
      window.featureFlags['duplicate-treatment'] &&
      permissions.medical.treatments.canEdit
    ) {
      menuItems.push({
        description: props.t('Duplicate treatment'),
        onClick: () => {
          props.onClickDuplicateTreatment(props.treatment);
        },
      });
    }

    return (
      <div data-testid="TreatmentCard|Actions" css={style.actions}>
        {props.isEditing ? (
          <>
            <TextButton
              data-testid="TreatmentCard|Discard"
              text={props.t('Discard changes')}
              type="subtle"
              onClick={() => {
                setTreatments(originalTreatments);
                props.setIsEditing(false);
              }}
              isDisabled={props.requestStatus === 'PENDING'}
              kitmanDesignSystem
            />
            <TextButton
              data-testid="TreatmentCard|Save"
              text={props.t('Save')}
              isLoading={props.requestStatus === 'PENDING'}
              type="primary"
              onClick={() => {
                props.onClickSaveTreatment(
                  treatments.map((t) => {
                    return {
                      amount_charged:
                        t.billable_items[0]?.amount_charged || '0.0',
                      discount: t.billable_items[0]?.discount || '0.0',
                      amount_paid_insurance:
                        t.billable_items[0]?.amount_paid_insurance || '0.0',
                      amount_due: t.billable_items[0]?.amount_due || '0.0',
                      amount_paid_athlete:
                        t.billable_items[0]?.amount_paid_athlete || '0.0',
                      date_paid: t.billable_items[0]?.date_paid || '',
                      cpt_code: t.billable_items[0]?.cpt_code,
                      icd_code: t.billable_items[0]?.icd_code,
                      referring_physician:
                        t.billable_items[0]?.referring_physician || '',
                      is_billable: t.is_billable || false,
                      athlete_id: props.treatment.athlete.id,
                      id: t.id,
                    };
                  })
                );
              }}
              kitmanDesignSystem
            />
          </>
        ) : (
          menuItems.length > 0 && (
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
          )
        )}
      </div>
    );
  };

  const renderNote = () => {
    return (
      <div css={style.treatmentNote} data-testid="TreatmentCard|Annotation">
        <h4 css={style.sectionTitle}>{props.t('Treatment note')}</h4>
        <RichTextDisplay
          value={
            props.treatment.annotation?.content
              ? props.treatment.annotation.content
              : ''
          }
          isAbbreviated={false}
        />
      </div>
    );
  };

  const renderModality = (item) => {
    return (
      <div>
        <span> {item.treatment_modality?.name || ''}</span>
        <div css={style.createdAtDate}>
          {`${formatStandard({
            date: moment(props.treatment.created_at),
          })} by ${props.treatment.created_by.fullname}`}
        </div>
      </div>
    );
  };

  const getIssueTypePath = (issueType: string) =>
    issueType === 'InjuryOccurrence' ? 'injuries' : 'illnesses';

  const buildColumns = () => {
    const columns = [
      {
        Header: () => <TextHeader value={props.t('Modality')} />,
        accessor: 'modality',
        width: 280,
        sticky: 'left',
        Cell: ({ cell: { value } }) => <TextCell value={value} />,
      },
      {
        Header: () => <TextHeader value={props.t('Time')} />,
        accessor: 'time',
        width: 200,
        Cell: ({ cell: { value } }) => <TextCell value={value} />,
      },
      {
        Header: () => <TextHeader value={props.t('Body area')} />,
        accessor: 'body_areas',
        width: 240,
        Cell: ({ cell: { value } }) => <TooltipCell value={value} />,
      },
      {
        Header: () => <TextHeader value={props.t('Comment')} />,
        accessor: 'note',
        width: 240,
        Cell: ({ cell: { value } }) => <TooltipCell value={value} />,
      },
      {
        Header: () => <TextHeader value={props.t('Reason')} />,
        accessor: 'reason',
        width: 300,
        Cell: ({ cell: { value } }) => {
          return !value.issue ? (
            <TextCell value={value.text} />
          ) : (
            <LinkTooltipCell
              key={`${value.issueType}_${value.issue.id}`}
              valueLimit={36}
              url={`/medical/athletes/${
                // $FlowFixMe
                props.treatment.athlete.id
              }/${getIssueTypePath(value.issueType)}/${value.issue.id}`}
              longText={value.text}
            />
          );
        },
      },
    ];
    if (window.featureFlags['treatments-location']) {
      columns.push({
        Header: () => <TextHeader value={props.t('Location')} />,
        accessor: 'location',
        width: 200,
        Cell: ({ cell: { value } }) => <TextCell value={value} />,
      });
    }
    if (window.featureFlags['referring-physician-treatments-diagnostics']) {
      columns.push({
        Header: () => <TextHeader value={props.t('Referring physician')} />,
        accessor: 'referring_physician',
        width: 200,
        Cell: ({ cell: { value } }) => <TextCell value={value} />,
      });
    }

    // Setting up the Cell generation for now as these will be inline edit and / or <Select/> components
    if (
      window.featureFlags['treatments-billing'] &&
      window.featureFlags['treatments-billing-extra-fields'] &&
      permissions.medical.treatments.canEdit
    ) {
      columns.push(
        {
          Header: () => <TextHeader value={props.t('CPT code')} />,
          accessor: 'cpt_code',
          width: 200,
          Cell: ({ cell: { value } }) => <TextCell value={value} />,
        },
        {
          Header: () => <TextHeader value={props.t('ICD code')} />,
          accessor: 'icd_code',
          width: 200,
          Cell: ({ cell: { value } }) => <TextCell value={value} />,
        },
        {
          Header: () => <TextHeader value={props.t('Billable')} />,
          accessor: 'is_billable',
          width: 200,
          Cell: ({ cell: { value } }) => <TextCell value={value} />,
        },
        {
          Header: () => <TextHeader value={props.t('Amount charged')} />,
          accessor: 'amount_charged',
          width: 240,
          Cell: ({ cell: { value } }) => <TextCell value={value} />,
        },
        {
          Header: () => <TextHeader value={props.t('Discount/ reduction')} />,
          accessor: 'discount',
          width: 240,
          Cell: ({ cell: { value } }) => <TextCell value={value} />,
        },
        {
          Header: () => <TextHeader value={props.t('Amount insurance paid')} />,
          accessor: 'amount_paid_insurance',
          width: 240,
          Cell: ({ cell: { value } }) => <TextCell value={value} />,
        },
        {
          Header: () => <TextHeader value={props.t('Amount due')} />,
          accessor: 'amount_due',
          width: 240,
          Cell: ({ cell: { value } }) => <TextCell value={value} />,
        },
        {
          Header: () => <TextHeader value={props.t('Amount athlete paid')} />,
          accessor: 'amount_paid_athlete',
          width: 240,
          Cell: ({ cell: { value } }) => <TextCell value={value} />,
        },
        {
          Header: () => <TextHeader value={props.t('Date paid')} />,
          accessor: 'date_paid',
          width: 240,
          Cell: ({ cell: { value } }) => <TextCell value={value} />,
        }
      );
    } else if (
      window.featureFlags['treatments-billing'] &&
      !window.featureFlags['treatments-billing-extra-fields'] &&
      permissions.medical.treatments.canEdit
    ) {
      columns.push(
        {
          Header: () => <TextHeader value={props.t('CPT code')} />,
          accessor: 'cpt_code',
          width: 200,
          Cell: ({ cell: { value } }) => <TextCell value={value} />,
        },
        {
          Header: () => <TextHeader value={props.t('ICD code')} />,
          accessor: 'icd_code',
          width: 200,
          Cell: ({ cell: { value } }) => <TextCell value={value} />,
        },
        {
          Header: () => <TextHeader value={props.t('Billable')} />,
          accessor: 'is_billable',
          width: 200,
          Cell: ({ cell: { value } }) => <TextCell value={value} />,
        },
        {
          Header: () => (
            <TextHeader value={props.t('Amount paid by insurance')} />
          ),
          accessor: 'amount_paid_insurance',
          width: 240,
          Cell: ({ cell: { value } }) => <TextCell value={value} />,
        },
        {
          Header: () => (
            <TextHeader value={props.t('Amount paid by athlete')} />
          ),
          accessor: 'amount_paid_athlete',
          width: 240,
          Cell: ({ cell: { value } }) => <TextCell value={value} />,
        }
      );
    }
    return columns;
  };

  const mapReasonKeyToText = (key: string) => {
    switch (key) {
      case 'general': {
        return props.t('General Treatment');
      }
      case 'recovery': {
        return props.t('Recovery');
      }
      case 'preparation': {
        return props.t('Preparation');
      }
      default: {
        return '-';
      }
    }
  };

  const extractLinkedIssue = (item) => {
    if (!item.issue) {
      return {
        issue: null,
        text: mapReasonKeyToText(item.reason),
        issueType: null,
        athleteId: props.treatment.athlete.id,
      };
    }
    return {
      issue: item.issue,
      text: item.issue_name,
      issueType: item.issue_type,
      athleteId: props.treatment.athlete.id,
    };
  };

  const updateTreatment = (treatment, data) => {
    const newItems = treatments.map((t) => {
      if (t.id === treatment.id) {
        return {
          ...t,
          ...data,
        };
      }
      return t;
    });

    // $FlowFixMe supress warning about exceptionally large datasets. This won't be the case
    setTreatments(newItems);
  };

  const buildData = () => {
    return treatments.map((item, index) => {
      if (
        window.featureFlags['treatments-billing'] &&
        permissions.medical.treatments.canEdit
      ) {
        return {
          modality: renderModality(item),
          body_areas: item.treatment_body_areas.map((i) => i.name).join(', '),
          time: item.duration || '',
          note: item.note || '',
          location: props.treatment?.location?.name || '',
          reason: extractLinkedIssue(item),
          referring_physician: props.treatment?.referring_physician || '',
          cpt_code: (
            <CptCode
              isDisabled={props.requestStatus === 'PENDING'}
              isEditing={props.isEditing}
              initialCode={item.billable_items[0]?.cpt_code || ''}
              onUpdateCode={(code) => {
                updateTreatment(item, {
                  billable_items: [
                    { ...item.billable_items[0], cpt_code: code },
                  ],
                });
              }}
            />
          ),
          icd_code: (
            <IcdCode
              isDisabled={props.requestStatus === 'PENDING'}
              isEditing={props.isEditing}
              initialCode={item.billable_items[0]?.icd_code || ''}
              onUpdateCode={(code) => {
                updateTreatment(item, {
                  billable_items: [
                    { ...item.billable_items[0], icd_code: code },
                  ],
                });
              }}
            />
          ),
          is_billable: (
            <Billable
              isDisabled={props.requestStatus === 'PENDING'}
              isEditing={props.isEditing}
              billable={item.is_billable}
              onUpdateBillable={(isBillable) => {
                updateTreatment(item, {
                  is_billable: isBillable,
                  billable_items: [
                    {
                      ...item.billable_items[0],
                      amount_charged: isBillable
                        ? originalTreatments[index].billable_items[0]
                            ?.amount_charged
                        : '0',
                      discount: isBillable
                        ? originalTreatments[index].billable_items[0]?.discount
                        : '0',
                      amount_paid_insurance: isBillable
                        ? originalTreatments[index].billable_items[0]
                            ?.amount_paid_insurance
                        : '0',
                      amount_due: isBillable
                        ? originalTreatments[index].billable_items[0]
                            ?.amount_due
                        : '0',
                      amount_paid_athlete: isBillable
                        ? originalTreatments[index].billable_items[0]
                            ?.amount_paid_athlete
                        : '0',
                      date_paid: isBillable
                        ? originalTreatments[index].billable_items[0]?.date_paid
                        : null,
                    },
                  ],
                });
              }}
              t={props.t}
              style={style}
            />
          ),
          ...(window.featureFlags['treatments-billing-extra-fields'] && {
            amount_charged: (
              <AmountPaid
                isDisabled={
                  !item.is_billable || props.requestStatus === 'PENDING'
                }
                isEditing={props.isEditing}
                initialAmount={item.billable_items[0]?.amount_charged || '0.0'}
                onUpdateAmount={(amount) => {
                  updateTreatment(item, {
                    billable_items: [
                      { ...item.billable_items[0], amount_charged: amount },
                    ],
                  });
                }}
              />
            ),
            discount: (
              <AmountPaid
                isDisabled={
                  !item.is_billable || props.requestStatus === 'PENDING'
                }
                isEditing={props.isEditing}
                initialAmount={item.billable_items[0]?.discount || '0.0'}
                onUpdateAmount={(amount) => {
                  updateTreatment(item, {
                    billable_items: [
                      { ...item.billable_items[0], discount: amount },
                    ],
                  });
                }}
              />
            ),
          }),
          amount_paid_insurance: (
            <AmountPaid
              isDisabled={
                !item.is_billable || props.requestStatus === 'PENDING'
              }
              isEditing={props.isEditing}
              initialAmount={
                item.billable_items[0]?.amount_paid_insurance || '0.0'
              }
              onUpdateAmount={(amount) => {
                updateTreatment(item, {
                  billable_items: [
                    {
                      ...item.billable_items[0],
                      amount_paid_insurance: amount,
                    },
                  ],
                });
              }}
            />
          ),
          ...(window.featureFlags['treatments-billing-extra-fields'] && {
            amount_due: (
              <AmountPaid
                isDisabled={
                  !item.is_billable || props.requestStatus === 'PENDING'
                }
                isEditing={props.isEditing}
                initialAmount={item.billable_items[0]?.amount_due || '0.0'}
                onUpdateAmount={(amount) => {
                  updateTreatment(item, {
                    billable_items: [
                      { ...item.billable_items[0], amount_due: amount },
                    ],
                  });
                }}
              />
            ),
          }),
          amount_paid_athlete: (
            <AmountPaid
              isDisabled={
                !item.is_billable || props.requestStatus === 'PENDING'
              }
              isEditing={props.isEditing}
              initialAmount={
                item.billable_items[0]?.amount_paid_athlete || '0.0'
              }
              onUpdateAmount={(amount) => {
                updateTreatment(item, {
                  billable_items: [
                    { ...item.billable_items[0], amount_paid_athlete: amount },
                  ],
                });
              }}
            />
          ),
          ...(window.featureFlags['treatments-billing-extra-fields'] && {
            date_paid: (
              <DateField
                defaultString={props.t('Not paid yet')}
                isEditing={props.isEditing}
                isDisabled={
                  !item.is_billable || props.requestStatus === 'PENDING'
                }
                initialDate={
                  item.billable_items[0]?.date_paid
                    ? moment(item.billable_items[0]?.date_paid)
                    : null
                }
                onUpdateDate={(date) => {
                  updateTreatment(item, {
                    billable_items: [
                      { ...item.billable_items[0], date_paid: date },
                    ],
                  });
                }}
              />
            ),
          }),
        };
      }
      if (window.featureFlags['treatments-location']) {
        return {
          modality: renderModality(item),
          body_areas: item.treatment_body_areas.map((i) => i.name).join(', '),
          location: props.treatment?.location?.name || '',
          time: item.duration || '',
          note: item.note || '',
          reason: extractLinkedIssue(item),
        };
      }
      return {
        modality: renderModality(item),
        body_areas: item.treatment_body_areas.map((i) => i.name).join(', '),
        time: item.duration || '',
        note: item.note || '',
        reason: extractLinkedIssue(item),
      };
    });
  };

  const renderTable = () => {
    return <DataTable columns={buildColumns()} data={buildData()} />;
  };

  return (
    <div css={style.content}>
      <div data-testid="TreatmentCard|Header" css={style.header}>
        {renderTreatmentApointmentInfo()}
        {canRenderActions && renderActions()}
      </div>

      <div data-testid="TreatmentCard|Content" css={style.treatmentTable}>
        {renderTable()}
      </div>

      {props.treatment?.annotation && (
        <div data-testid="TreatmentCard|Footer" css={style.treatmentCardFooter}>
          {props.treatment?.annotation?.content && renderNote()}
          {props.treatment?.annotation?.attachments.length > 0 &&
            renderAttachments()}
        </div>
      )}
    </div>
  );
};

export const TreatmentCardTranslated: ComponentType<Props> =
  withNamespaces()(TreatmentCard);
export default TreatmentCard;
