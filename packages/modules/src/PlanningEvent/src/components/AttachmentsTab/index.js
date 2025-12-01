// @flow
import { useRef, useMemo, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';

import getStyles from '@kitman/common/src/styles/FileTable.styles';
import type {
  DataTableData,
  DataTableColumns,
} from '@kitman/modules/src/Medical/shared/components/DataTable';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { EventAttachment } from '@kitman/common/src/types/Event';
import PlanningTab from '@kitman/modules/src/PlanningEvent/src/components/PlanningTabLayout/index';
import type { SetState } from '@kitman/common/src/types/react';

import { SharedTable } from '../SharedTable';
import { createColumns, createRows } from './utils/helpers';
import type { CreateActions } from './utils/types';

export type Props = {
  attachments: EventAttachment[],
  canDownload: boolean,
  canDeleteAttachments: boolean,
  setChosenAttachment: SetState<EventAttachment | null>,
  setIsDeleteAttachmentModalOpen: SetState<boolean>,
};

const style = getStyles();

const AttachmentsTab = (props: I18nProps<Props>) => {
  const { t } = props;

  const tableRef = useRef();

  const columns: DataTableColumns[] = useMemo(
    () => (createColumns({ t, style }): any),
    [t]
  );

  const rows: DataTableData[] = useMemo(() => {
    const {
      attachments: attachmentsForRows,
      canDeleteAttachments,
      canDownload,
      setChosenAttachment,
      setIsDeleteAttachmentModalOpen,
    } = props;
    const createActionsParams: CreateActions = {
      canDeleteAttachments,
      canDownload,
      onClickDelete: (attachment: EventAttachment) => {
        setChosenAttachment(attachment);
        setIsDeleteAttachmentModalOpen(true);
      },
      style,
    };
    return (createRows({
      attachments: attachmentsForRows,
      createActionsParams,
    }): any);
  }, [props]);

  return (
    <PlanningTab>
      <SharedTable
        id="AttachmentsTable"
        rows={rows}
        columns={columns}
        tableRef={tableRef}
        style={style}
      />
    </PlanningTab>
  );
};

export const AttachmentsTabTranslated: ComponentType<Props> =
  withNamespaces()(AttachmentsTab);

export default AttachmentsTab;
