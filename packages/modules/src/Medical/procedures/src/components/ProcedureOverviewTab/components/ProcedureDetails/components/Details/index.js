// @flow
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { ComponentType } from 'react';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';

import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { TextButton } from '@kitman/components';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import AddProcedureSidePanel from '@kitman/modules/src/Medical/shared/containers/AddProcedureSidePanel';
import { useProcedure } from '@kitman/modules/src/Medical/shared/contexts/ProcedureContext';
import { useGetProceduresFormDataQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { openAddProcedureSidePanel } from '@kitman/modules/src/Medical/shared/redux/actions';
import AddProcedureAttachmentSidePanel from '@kitman/modules/src/Medical/shared/containers/AddProcedureAttachmentSidePanel';
import style from '@kitman/modules/src/Medical/procedures/src/components/ProcedureOverviewTab/components/ProcedureDetails/styles';

type Props = {};

const Details = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const [isEditing, setIsEditing] = useState(false);
  const { permissions } = usePermissions();
  const { organisation } = useOrganisation();
  const { proceduresFormData } = useGetProceduresFormDataQuery(
    { onlyDefaultLocations: true },
    { skip: false }
  );
  const { procedure, updateProcedure } = useProcedure();

  // Combine arr of procedure_complications with 'other_complication', if not empty
  const renderProcedureComplications = () => {
    const complications = procedure?.procedure_complications.map(
      ({ name }) => name
    );

    if (procedure?.other_complication) {
      complications.push(procedure?.other_complication);
    }

    return complications.join(', ');
  };

  const canEditProcedure = () => {
    if (!permissions.medical.procedures.canEdit) return false;
    if (procedure.organisation_id !== organisation.id) return false;
    return true;
  };

  return (
    <section data-testid="ProcedureDetails|Container">
      <div css={style.main}>
        <h2 css={style.sectionHeading}>{props.t('Procedure details')}</h2>

        {canEditProcedure() && (
          <TextButton
            data-testid="ProcedureActions|Edit"
            text="Edit"
            type="secondary"
            onClick={() => {
              setIsEditing(true);

              dispatch(
                openAddProcedureSidePanel({
                  isAthleteSelectable: false,
                  isOpen: true,
                })
              );
            }}
            kitmanDesignSystem
          />
        )}
      </div>
      <div css={style.detailsMain}>
        {procedure.procedure_type.name && (
          <div css={style.procedureType} data-testid="ProcedureDetails|Type">
            <span css={style.detailLabel}>{props.t('Procedure')}:</span>
            {procedure.procedure_type.name}
          </div>
        )}

        {procedure?.procedure_type_description && (
          <div>
            <span css={style.detailLabel}>
              {props.t('Procedure description')}:
            </span>
            {procedure.procedure_type_description ?? '--'}
          </div>
        )}

        {procedure.procedure_type.code && (
          <div data-testid="ProcedureDetails|Code">
            <span css={style.detailLabel}>{props.t('CPT')}:</span>
            {procedure.procedure_type.code}
          </div>
        )}
      </div>
      <h2 css={style.sectionHeading}>{props.t('Additional info')}</h2>
      <div css={style.detailsMain}>
        {(procedure?.provider?.fullname || procedure?.other_provider) && (
          <div data-testid="ProcedureDetails|Provider">
            <span css={style.detailLabel}>{props.t('Provider')}:</span>
            {props.t('{{provider}}', {
              provider:
                procedure?.provider?.fullname ||
                procedure?.other_provider ||
                '----',
            })}
          </div>
        )}

        {procedure?.procedure_date && (
          <div data-testid="ProcedureDetails|ProcedureDate">
            <span css={style.detailLabel}>{props.t('Procedure date')}:</span>
            {formatStandard({
              date: moment(procedure.procedure_date),
            })}
          </div>
        )}

        {procedure?.body_area && (
          <div>
            <span css={style.detailLabel}>{props.t('Body area')}:</span>
            {procedure.body_area.name ?? '----'}
          </div>
        )}

        {procedure?.timing && (
          <div data-testid="ProcedureDetails|Timing">
            <span css={style.detailLabel}>{props.t('Timing')}:</span>
            <span css={style.timing}>
              {procedure.timing.split('_').join(' ')}
            </span>
          </div>
        )}

        {procedure?.timing && (
          <div>
            <span css={style.detailLabel}>{props.t('Start time')}:</span>
            {formatStandard({
              date: moment(procedure.procedure_date),
            })}
          </div>
        )}

        {procedure?.total_amount && (
          <div>
            <span css={style.detailLabel}>{props.t('Total amount')}:</span>{' '}
            {procedure.total_amount}
            {procedure.total_amount_unit}
          </div>
        )}

        {procedure?.amount_used && (
          <div>
            <span css={style.detailLabel}>{props.t('Amount used')}:</span>{' '}
            {procedure.amount_used}
            {procedure.amount_used_unit}
          </div>
        )}

        {procedure?.urine_specific_gravity && (
          <div>
            <span css={style.detailLabel}>
              {props.t('Urine specific gravity')}:
            </span>
            {procedure.urine_specific_gravity}
          </div>
        )}

        {(procedure?.procedure_complications?.length ||
          procedure?.other_complication) && (
          <div>
            <span css={style.detailLabel}>{props.t('Complications')}:</span>
            {renderProcedureComplications()}
          </div>
        )}
      </div>
      <hr css={style.hr} />
      {procedure?.created_by && (
        <div css={style.authorDetails} data-testid="ProcedureDetails|Author">
          {props.t('Created {{creationDate}} by {{userName}}', {
            userName: procedure?.created_by?.fullname,
            creationDate: moment(procedure.created_at).format('LLL'),
            interpolation: { escapeValue: false },
          })}
        </div>
      )}
      <AddProcedureSidePanel
        athleteId={procedure.athlete.id}
        procedureToUpdate={procedure}
        proceduresFormData={proceduresFormData}
      />
      <AddProcedureAttachmentSidePanel
        procedureId={procedure.id}
        athleteId={procedure.athlete.id}
        onSaveAttachment={(confirmedUpload) =>
          updateProcedure({
            ...procedure,
            attachments: [...procedure.attachments, ...confirmedUpload],
          })
        }
      />
    </section>
  );
};

export const DetailsTranslated: ComponentType<Props> =
  withNamespaces()(Details);
export default Details;
