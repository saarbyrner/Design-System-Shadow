// @flow
import type { Node } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import useCSVExport from '@kitman/common/src/hooks/useCSVExport';

type ExportDataType = Array<Object>;

type ExportContextType = {
  data: ExportDataType,
  setData: (ExportDataType) => any,
  setOptions: (Object) => any,
  exportData: Function,
};

type ProviderProps = {
  filename: string,
  initialData?: ExportDataType,
  children: Node,
};

type ExportDataProps = {
  data: ExportDataType,
  options?: Object,
};

export const ExportContext = createContext<ExportContextType>({
  data: [],
  setData: () => {},
  exportData: () => {},
  setOptions: () => {},
});

export const useExport = () => useContext(ExportContext);

export function ExportProvider({
  filename,
  initialData = [],
  children,
}: ProviderProps) {
  const [data, setData] = useState(initialData);
  const [options, setOptions] = useState({});
  const exportData = useCSVExport(filename, data, options);

  const initialContextValue: ExportContextType = {
    data,
    setData,
    exportData,
    setOptions,
  };

  return (
    <ExportContext.Provider value={initialContextValue}>
      {children}
    </ExportContext.Provider>
  );
}

export function ExportData({ data, options }: ExportDataProps) {
  const { setData, setOptions } = useExport();

  useEffect(() => {
    setData(data);
  }, [data]);

  useEffect(() => {
    if (options) {
      setOptions(options);
    }
  }, [options]);

  return null;
}
