// @flow
import { createContext, useContext } from 'react';
import type { TransferRecord } from '@kitman/services/src/services/getAthleteData';
import type { Node } from 'react';

const TransferRecordContext = createContext<?TransferRecord>(null);
type Props = {
  children: Node,
  playerTransferRecord: ?TransferRecord,
};
const TransferRecordContextProvider = (props: Props) => {
  return (
    <TransferRecordContext.Provider value={props.playerTransferRecord}>
      {props.children}
    </TransferRecordContext.Provider>
  );
};

const useTransferRecord = () => useContext(TransferRecordContext);

export { TransferRecordContextProvider, useTransferRecord };
export default TransferRecordContext;
