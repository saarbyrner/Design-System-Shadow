// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  DrugType,
  DrugStockResponse,
} from '@kitman/modules/src/Medical/shared/types/medical';
import type { FormState as StockDetails } from '@kitman/modules/src/StockManagement/src/hooks/useStockManagementForm';

const saveDrugStock = async (
  stockDetails: StockDetails,
  drugType: ?(DrugType | 'FdbDispensableDrug')
): Promise<DrugStockResponse> => {
  const { data } = await axios.post('/medical/stocks/add', {
    drug: {
      type: drugType || 'FdbDispensableDrug',
      id: stockDetails.drug.value,
    },
    lot_number: stockDetails.lotNumber,
    expiration_date: stockDetails.expirationDate,
    quantity: stockDetails.quantity,
  });
  return data;
};

export default saveDrugStock;
