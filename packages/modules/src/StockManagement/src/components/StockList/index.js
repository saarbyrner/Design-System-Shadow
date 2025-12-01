// @flow
import { useMemo, useRef } from 'react';
import type { ComponentType } from 'react';
import uuid from 'uuid';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import { css } from '@emotion/react';
import moment from 'moment';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TextHeader, TextCell } from '@kitman/components/src/TableCells';
import { TooltipMenu, TextButton } from '@kitman/components';
import { useFlexLayout } from 'react-table';
import type { DrugLot } from '@kitman/modules/src/Medical/shared/types/medical';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useStockList } from '../../contexts/StockListContextProvider';
import DataTable from '../../../../Medical/shared/components/DataTable';
import { PrintViewTranslated as PrintView } from './PrintView';
import style from './styles';

type Props = {
  drugStocks: Array<DrugLot>,
  hasMore: boolean,
  onReachingEnd: Function,
  isTableEmpty: boolean,
};

const StockList = (props: I18nProps<Props>) => {
  const { data: permissions } = useGetPermissionsQuery();
  const { toggleRemoveStockSidePanel } = useStockList();

  const stockCardListRef = useRef();

  const loadingStyle = {
    loadingText: css`
      color: ${colors.neutral_300};
      font-size: 14px;
      font-weight: normal;
      line-height: 20px;
      margin-top: 24px;
      text-align: center;
    `,
    stockCardList: css`
      height: calc(
        100vh - ${stockCardListRef.current?.getBoundingClientRect().y}px - 20px
      );
      overflow-y: scroll;
    `,
    stockCardListEmpty: css`
      height: auto;
    `,
  };

  const returnActions = (stock) => (
    <div css={style.actions} key={uuid()} data-testid="StockList|Actions">
      <TooltipMenu
        placement="bottom-end"
        menuItems={[
          {
            description: props.t('Remove Stock'),
            id: 'removeStock',
            onClick: () => toggleRemoveStockSidePanel(stock),
            isVisible: true,
          },
        ]}
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
        Header: () => <TextHeader key={uuid()} value={props.t('Name')} />,
        accessor: 'drugName',
        width: 190,
        Cell: ({ cell: { value } }) => (
          <div style={{ textAlign: 'left' }}>
            <TextCell key={uuid()} data-testid="StockList|Name" value={value} />
          </div>
        ),
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Strength')} />,
        accessor: 'strength',
        width: 120,
        Cell: ({ cell: { value } }) => (
          <TextCell
            key={uuid()}
            data-testid="StockList|Strength"
            value={value}
          />
        ),
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Type')} />,
        accessor: 'type',
        width: 120,
        Cell: ({ cell: { value } }) => (
          <div style={{ textTransform: 'capitalize', textAlign: 'left' }}>
            <TextCell key={uuid()} data-testid="StockList|Type" value={value} />
          </div>
        ),
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Lot no.')} />,
        accessor: 'lotNumber',
        width: 120,
        Cell: ({ cell: { value } }) => (
          <TextCell
            key={uuid()}
            data-testid="StockList|LotNumber"
            value={value}
          />
        ),
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Exp. date')} />,
        accessor: 'expirationDate',
        width: 120,
        Cell: ({ cell: { value } }) => (
          <TextCell
            key={uuid()}
            data-testid="StockList|ExpirationDate"
            value={value}
          />
        ),
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('Dispensed')} />,
        accessor: 'dispensedCount',
        width: 100,
        Cell: ({ cell: { value } }) => (
          <TextCell
            key={uuid()}
            data-testid="StockList|DispensedCount"
            value={value}
          />
        ),
      },
      {
        Header: () => <TextHeader key={uuid()} value={props.t('On hand')} />,
        accessor: 'quantityCount',
        width: 100,
        Cell: ({ cell: { value } }) => (
          <TextCell
            key={uuid()}
            data-testid="StockList|QuantityCount"
            value={value}
          />
        ),
      },
    ];

    if (permissions.medical.stockManagement.canRemove) {
      columns.push({
        Header: () => '',
        accessor: 'moreActions',
        width: 20,
        Cell: ({ cell: { value } }) => value,
      });
    }
    return columns;
  }, [props, permissions]);

  const buildData = () => {
    return props.drugStocks?.map((stock) => {
      const doseType = stock.drug?.dose_form_desc || stock.drug?.dose_form;
      return {
        drugName: stock.drug?.drug_name_desc || stock.drug?.name || '--',
        strength:
          stock.drug?.med_strength + stock?.drug.med_strength_unit || '--',
        type: doseType?.split(',').join(', ') || '--',
        lotNumber: stock.lot_number || '--',
        expirationDate:
          moment(stock.expiration_date).format('MMM D, YYYY') || '--',
        dispensedCount: stock.dispensed_quantity || '--',
        quantityCount: stock.quantity || '--',
        moreActions: returnActions(stock),
      };
    });
  };

  const renderTable = () => {
    return (
      <InfiniteScroll
        dataLength={props.drugStocks.length}
        hasMore={props.hasMore}
        next={props.onReachingEnd}
        loader={
          <div css={loadingStyle.loadingText}>{props.t('Loading')} ...</div>
        }
        scrollableTarget="stockCardList"
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
    <>
      <div
        id="stockCardList"
        // $FlowFixMe .getBoundingClientRect().y is a valid property
        ref={stockCardListRef}
        css={
          props.drugStocks.length
            ? loadingStyle.stockCardList
            : loadingStyle.stockCardListEmpty
        }
      >
        <div css={style.content}>
          <div css={style.stockTable}>{renderTable()}</div>
          {props.isTableEmpty && (
            <div css={style.noStockLots}>
              {props.t('No Stock Lots for this period')}
            </div>
          )}
        </div>
      </div>
      <PrintView stockList={props.drugStocks} />
    </>
  );
};

export const StockListTranslated: ComponentType<Props> =
  withNamespaces()(StockList);

export default StockList;
