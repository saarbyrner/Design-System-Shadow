// @flow
import { useRef, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import uuid from 'uuid';

import { TextCell } from '@kitman/components/src/TableCells';
import getStyles from '@kitman/common/src/styles/FileTable.styles';
import type { CustomEvent } from '@kitman/common/src/types/Event';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import PlanningTab from '@kitman/modules/src/PlanningEvent/src/components/PlanningTabLayout/index';

import { SharedTable } from '../SharedTable';
import { createHeaderFunction } from '../../helpers/tableComponents';
import { StaffTabHeaderTranslated as StaffTabHeader } from './components/StaffTabHeader';

type Props = {
  event: CustomEvent,
  onUpdateEvent: Function,
  canEditEvent: boolean,
};

const style = getStyles();

const createTextCell = (value: any, dataTestIdSuffix: string) => (
  <TextCell
    key={uuid()}
    data-testid={`Staff|${dataTestIdSuffix}`}
    value={value}
  />
);

const StaffTab = (props: I18nProps<Props>) => {
  const staffTableRef = useRef(null);

  const { t, event } = props;
  const columns = [
    {
      Header: createHeaderFunction(t, 'Participants'),
      accessor: 'participant',
      width: 200,
      Cell: ({ cell: { value } }) => createTextCell(value, 'Name'),
    },
    {
      Header: createHeaderFunction(t, 'Email'),
      accessor: 'email',
      width: 200,
      Cell: ({ cell: { value } }) => createTextCell(value, 'Email'),
    },
  ];

  const buildData = () => {
    return event.event_users?.map((eventUser) => {
      return {
        participant: eventUser?.user?.fullname || '',
        email: eventUser?.user?.email || '',
      };
    });
  };

  return (
    <PlanningTab>
      <StaffTabHeader {...props} />
      <SharedTable
        id="StaffTable"
        rows={buildData()}
        columns={columns}
        tableRef={staffTableRef}
        style={style}
      />
    </PlanningTab>
  );
};

export const StaffTabTranslated: ComponentType<Props> =
  withNamespaces()(StaffTab);
export default StaffTab;
