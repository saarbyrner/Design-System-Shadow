// @flow
import { useState } from 'react';
import moment from 'moment';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { DataGrid, Link } from '@kitman/components';
import OrderSummary from '../../../OrderSummary';
import orders from '../_mock/orders';
import TitleFilters from './TitleFilters';

const savedOrders = localStorage.getItem('orders')
  ? // $FlowFixMe
    JSON.parse(localStorage.getItem('orders'))
  : [];

const columnsConfig = [
  {
    id: 'id',
    content: 'Order ID',
  },
  {
    id: 'athlete',
    content: 'Athlete',
  },
  {
    id: 'date',
    content: 'Date ordered',
  },
  {
    id: 'provider',
    content: 'Provider',
  },
  {
    id: 'staff',
    content: 'Staff',
  },
  {
    id: 'approval',
    content: 'Approval',
  },
  {
    id: 'status',
    content: 'Status',
  },
  {
    id: 'dateRecieved',
    content: 'Received',
  },
  {
    id: 'report',
    content: '',
  },
];

type Column = {
  id: string,
};

type Props = {
  onReportClick: Function,
};

function OrderTable(props: Props) {
  const [orderModal, setOrderModal] = useState({ visible: false, order: null });

  const getReportCellContent = (order) => {
    if (!order.report) {
      return ' - ';
    }

    return (
      <div
        className="emrOrders__linkToReport"
        onClick={() => {
          window.location.hash = `#order_${order.id}`;
          props.onReportClick(order);
        }}
      >
        Report
      </div>
    );
  };

  const rows = [...savedOrders.filter((order) => !order.is_draft), ...orders]
    .sort((orderA, orderB) => orderB.id - orderA.id)
    .map((order) => {
      return {
        id: order.id,
        cells: columnsConfig.map((column: Column, i: number) => {
          switch (column.id) {
            case 'id':
              return {
                id: i,
                content: (
                  <span
                    className="emrOrders__linkColumn"
                    onClick={() => setOrderModal({ visible: true, order })}
                  >
                    {order.id}
                  </span>
                ),
              };
            case 'athlete':
              return {
                id: i,
                content: (
                  <Link
                    href={`/athletes/${order.athlete.id}`}
                    className="emrOrders__linkColumn"
                  >
                    {order.athlete.fullname}
                  </Link>
                ),
              };
            case 'date':
              return {
                id: i,
                content: DateFormatter.formatStandard({
                  date: moment(
                    order.creation_date,
                    DateFormatter.dateTransferFormat
                  ),
                  displayLongDate: true,
                }),
              };
            case 'provider':
              return {
                id: i,
                content: order.items[0]?.provider?.name || '',
              };
            case 'staff':
              return {
                id: i,
                content: order.user.fullname,
              };
            case 'approval':
              return {
                id: i,
                content: order.approval || 'No Approval required',
              };
            case 'status':
              return {
                id: i,
                content: order.status || 'Error',
              };
            case 'dateRecieved':
              return {
                id: i,
                content: order.report?.dateRecieved || '-',
              };
            case 'report':
              return {
                id: i,
                content: getReportCellContent(order),
              };
            default:
              return {
                id: i,
                content: order[column.id],
              };
          }
        }),
      };
    });

  return (
    <div className="emrOrders__container">
      <TitleFilters title="Order management" firstFilterName="Ordered by" />
      <DataGrid columns={columnsConfig} rows={rows} />
      {orderModal.visible && (
        <OrderSummary
          // $FlowFixMe
          orderDraft={orderModal.order}
          onClickClose={() => setOrderModal({ visible: false, order: null })}
          onClickSave={() => {}}
          isOnManagementView
        />
      )}
    </div>
  );
}

export default OrderTable;
