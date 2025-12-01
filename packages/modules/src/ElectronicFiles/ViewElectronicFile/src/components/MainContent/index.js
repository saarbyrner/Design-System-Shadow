// @flow
import { useEffect, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Divider,
  Paper,
  Alert,
  AlertTitle,
  CircularProgress,
} from '@kitman/playbook/components';
import {
  MENU_ITEM,
  selectSelectedMenuItem,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import { resetStateFilters } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/gridSlice';
import useFetchData from '@kitman/modules/src/ElectronicFiles/ViewElectronicFile/src/hooks/useFetchData';
import { TopNavTranslated as TopNav } from '@kitman/modules/src/ElectronicFiles/ViewElectronicFile/src/components/TopNav';
import { ElectronicFileDetailsTranslated as ElectronicFileDetails } from '@kitman/modules/src/ElectronicFiles/ViewElectronicFile/src/components/ElectronicFileDetails';
import { InboundContentTranslated as InboundContent } from '@kitman/modules/src/ElectronicFiles/ViewElectronicFile/src/components/InboundContent';
import { OutboundContentTranslated as OutboundContent } from '@kitman/modules/src/ElectronicFiles/ViewElectronicFile/src/components/OutboundContent';

type Props = {
  id: number,
};

const MainContent = ({ id, t }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const selectedMenuItem = useSelector(selectSelectedMenuItem);

  // reset state filters on unmount
  useEffect(() => () => dispatch(resetStateFilters()), []);

  const {
    isFileFetching,
    isFileLoading,
    isFileSuccess,
    isFileError,
    file,
    error,
  } = useFetchData({ id });

  return (
    <Paper variant="outlined" sx={{ width: '100%', p: 2 }} square>
      {!isFileFetching && !isFileLoading && (
        <>
          <TopNav electronicFile={!error ? file.data : null} meta={file.meta} />
          <Divider
            sx={{ mt: 1, mb: selectedMenuItem === MENU_ITEM.inbox ? 1 : 2 }}
          />
        </>
      )}
      {error && isFileError && (
        <Box display="flex" justifyContent="center">
          <Alert variant="outlined" severity="error">
            <AlertTitle>{t('Error')}</AlertTitle>
            {error.status === 404
              ? t('eFile not found.')
              : t('Something went wrong.')}
          </Alert>
        </Box>
      )}
      {(isFileFetching || isFileLoading) && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      )}
      {!isFileFetching && !isFileLoading && file.data && isFileSuccess && (
        <>
          <ElectronicFileDetails
            selectedMenuItem={selectedMenuItem}
            electronicFile={file.data}
          />
          <Divider sx={{ my: 1 }} />
          {selectedMenuItem === MENU_ITEM.inbox && (
            <InboundContent electronicFile={file.data} />
          )}
          {selectedMenuItem === MENU_ITEM.sent && (
            <OutboundContent electronicFile={file.data} />
          )}
        </>
      )}
    </Paper>
  );
};

export const MainContentTranslated: ComponentType<Props> =
  withNamespaces()(MainContent);
export default MainContent;
