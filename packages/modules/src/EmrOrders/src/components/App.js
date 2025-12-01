// @flow
import { useState, useEffect } from 'react';
import _isNull from 'lodash/isNull';
import { DataGrid, Link } from '@kitman/components';
import reconciliationOrder from '../_mock/reconciliationOrder';
import mockOrders from '../_mock/orders';
import OrderTable from './OrderTable';
import OrderReport from './OrderReport';
import TitleFilters from './TitleFilters';

const App = ({
  athletes,
}: {
  athletes: Array<{
    value: any,
    label: string,
  }>,
}) => {
  const [reconciledOrder, setReconciledOrder] = useState(
    localStorage.getItem('reconciledOrder')
      ? // $FlowFixMe
        JSON.parse(localStorage.getItem('reconciledOrder'))
      : null
  );
  const [orderReport, setOrderReport] = useState(null);
  const [showReconciliationReport, setShowReconciliationReport] =
    useState(false);

  useEffect(() => {
    if (window.location.hash.includes('orderToReconcile_')) {
      setShowReconciliationReport(true);
    }
    if (window.location.hash.includes('order_')) {
      setOrderReport(mockOrders[0]);
    }
  }, []);

  const onReportClick = (order) => setOrderReport(order);
  const onClickBack = () => setOrderReport(null);

  if (!_isNull(orderReport)) {
    return (
      <div className="emrOrders">
        <OrderReport
          order={orderReport}
          onClickBack={onClickBack}
          athletes={athletes}
          onReconcileOrder={() => {}}
        />
      </div>
    );
  }

  if (showReconciliationReport) {
    return (
      <div className="emrOrders">
        <OrderReport
          order={reconciliationOrder}
          onClickBack={() => setShowReconciliationReport(false)}
          onReconcileOrder={(newReconciledOrder) => {
            window.localStorage.setItem(
              'reconciledOrder',
              JSON.stringify(newReconciledOrder)
            );
            setReconciledOrder(newReconciledOrder);
          }}
          athletes={athletes}
          needReconciliation={!reconciledOrder}
          reconciledOrder={reconciledOrder}
        />
      </div>
    );
  }

  return (
    <>
      <div className="emrOrders">
        <OrderTable onReportClick={onReportClick} />
      </div>
      {window.featureFlags['emr-orders-reconciliation'] && (
        <div className="emrOrders">
          <div className="emrOrders__container">
            <TitleFilters
              title="Order reconciliation"
              firstFilterName="Provider"
            />
            <DataGrid
              columns={[
                {
                  id: 'id',
                  content: 'Return ID',
                },
                {
                  id: 'athlete',
                  content: 'Athlete',
                },
                {
                  id: 'provider',
                  content: 'Provider',
                },
                {
                  id: 'type',
                  content: 'Type',
                },
                {
                  id: 'status',
                  content: 'Status',
                },
                {
                  id: 'reason',
                  content: 'Reason',
                },
                {
                  id: 'received',
                  content: 'Received',
                },
                {
                  id: 'report',
                  content: '',
                },
              ]}
              rows={[
                {
                  id: 1,
                  cells: [
                    {
                      id: 'id',
                      content: <span>{reconciliationOrder.id}</span>,
                    },
                    // TO UPDATE
                    {
                      id: 'athlete',
                      content: reconciledOrder ? (
                        <Link
                          href={`/athletes/${reconciledOrder.athlete_id}`}
                          className="emrOrders__linkColumn"
                        >
                          {
                            athletes.find(
                              (athlete) =>
                                athlete.value === reconciledOrder.athlete_id
                            )?.label
                          }
                        </Link>
                      ) : (
                        '-'
                      ),
                    },
                    {
                      id: 'provider',
                      content:
                        reconciliationOrder.items[0]?.provider?.name || '',
                    },
                    {
                      id: 'type',
                      content: reconciliationOrder.report.diagnosticType,
                    },
                    {
                      id: 'status',
                      content: reconciledOrder
                        ? 'Reconciled'
                        : 'Unassigned order',
                    },
                    {
                      id: 'reason',
                      content: reconciledOrder ? '-' : 'Invalid athlete ID',
                    },
                    {
                      id: 'received',
                      content: reconciliationOrder.report.dateRecieved,
                    },
                    {
                      id: 'report',
                      content: (
                        <div
                          className="emrOrders__linkToReport"
                          onClick={() => {
                            window.location.hash = `#orderToReconcile_${reconciliationOrder.id}`;
                            setShowReconciliationReport(true);
                          }}
                        >
                          Report
                        </div>
                      ),
                    },
                  ],
                },
              ]}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default App;
