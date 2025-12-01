// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';

import {
  InputRadio,
  LegacyModal as Modal,
  TextButton,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import getTableType from '@kitman/common/src/utils/TrackingData/src/data/analysis/getTableEventData';
import reportingEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/reporting';

type Props = {
  onClickCloseModal: Function,
  onClickCreateTable: Function,
  isOpen: boolean,
};

function TableWidgetModal(props: I18nProps<Props>) {
  const [tableType, setTableType] = useState('COMPARISON');
  const { trackEvent } = useEventTracking();

  const onCreateTable = () => {
    trackEvent(reportingEventNames.addTable, getTableType({ tableType }));
    props.onClickCreateTable(tableType);
  };

  return (
    <Modal
      title={props.t('Create Table')}
      isOpen={props.isOpen}
      close={() => props.onClickCloseModal()}
      style={{ overflow: 'visible', height: '410px' }}
      width={740}
    >
      <div className="tableWidgetModal">
        <div className="tableWidgetModal__preview">
          <label className="tableWidgetModal__label">
            {props.t('Preview')}
          </label>
          <table className="tableWidgetModal__previewTable">
            <tbody>
              <tr>
                <td />
                <td className="tableWidgetModal__previewTable--header">
                  <span className="tableWidgetModal__previewTable--secondaryHeaderText">
                    {tableType === 'COMPARISON' || tableType === 'SCORECARD'
                      ? props.t('Date Range')
                      : props.t('Athlete A')}
                  </span>
                  <span className="tableWidgetModal__previewTable--primaryHeaderText">
                    {tableType === 'COMPARISON' || tableType === 'LONGITUDINAL'
                      ? props.t('Metric 1')
                      : props.t('Athlete A')}
                  </span>
                </td>
                <td>
                  <span className="tableWidgetModal__previewTable--secondaryHeaderText">
                    {tableType === 'COMPARISON' || tableType === 'SCORECARD'
                      ? props.t('Date Range')
                      : props.t('Athlete B')}
                  </span>
                  <span className="tableWidgetModal__previewTable--primaryHeaderText">
                    {tableType === 'COMPARISON' || tableType === 'LONGITUDINAL'
                      ? props.t('Metric 2')
                      : props.t('Athlete B')}
                  </span>
                </td>
                <td />
              </tr>
              <tr>
                <td>
                  <span className="tableWidgetModal__previewTable--rowHeaderText">
                    {tableType === 'COMPARISON' ? props.t('Athlete A') : null}
                    {tableType === 'SCORECARD' ? props.t('Metric 1') : null}
                    {tableType === 'LONGITUDINAL'
                      ? props.t('Date Range')
                      : null}
                  </span>
                </td>
                <td>57.2</td>
                <td>113.6</td>
                <td />
              </tr>
              <tr>
                <td>
                  <span className="tableWidgetModal__previewTable--rowHeaderText">
                    {tableType === 'COMPARISON' ? props.t('Athlete B') : null}
                    {tableType === 'SCORECARD' ? props.t('Metric 2') : null}
                    {tableType === 'LONGITUDINAL'
                      ? props.t('Date Range')
                      : null}
                  </span>
                </td>
                <td>61.4</td>
                <td>98.5</td>
                <td />
              </tr>
              <tr>
                <td />
                <td />
                <td />
                <td />
              </tr>
            </tbody>
          </table>
        </div>
        <div className="tableWidgetModal__tableType">
          <label className="tableWidgetModal__label">
            {props.t('Type of table')}
          </label>
          <div className="tableWidgetModal__type">
            <InputRadio
              inputName="ComparisonType"
              index={0}
              option={{ value: 'COMPARISON', name: 'Comparison' }}
              change={() => {
                setTableType('COMPARISON');
              }}
              value={tableType}
            />
            <p className="tableWidgetModal__typeDescription">
              {props.t(
                'Gather insights by comparing multiple athletes across a variety of metrics'
              )}
            </p>
          </div>
          <div className="tableWidgetModal__type">
            <InputRadio
              inputName="ScorecardType"
              index={1}
              option={{ value: 'SCORECARD', name: 'Scorecard' }}
              change={() => {
                setTableType('SCORECARD');
              }}
              value={tableType}
            />
            <p className="tableWidgetModal__typeDescription">
              {props.t(
                'Monitor performance by comparing athletes against their own historical data or those of their peers'
              )}
            </p>
          </div>

          <div className="tableWidgetModal__type">
            <InputRadio
              inputName="LongitudinalType"
              index={2}
              option={{ value: 'LONGITUDINAL', name: 'Longitudinal' }}
              change={() => {
                setTableType('LONGITUDINAL');
              }}
              value={tableType}
            />
            <p className="tableWidgetModal__typeDescription">
              {props.t('Track changes across a variety of time frames')}
            </p>
          </div>
        </div>
        <div className="tableWidgetModal__create">
          <TextButton
            text={props.t('Create table')}
            type="primary"
            onClick={onCreateTable}
          />
        </div>
      </div>
    </Modal>
  );
}

export default TableWidgetModal;
export const TableWidgetModalTranslated = withNamespaces()(TableWidgetModal);
