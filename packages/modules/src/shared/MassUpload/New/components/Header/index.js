// @flow
import { useDispatch } from 'react-redux';

import { Stack, Typography, Button } from '@kitman/playbook/components';
import i18n from '@kitman/common/src/utils/i18n';
import {
  openMassUploadModal,
  onOpenAddAthletesSidePanel,
} from '@kitman/modules/src/shared/MassUpload/redux/massUploadSlice';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import {
  IMPORT_TYPES,
  IMPORT_TYPES_WITH_TEMPLATE,
  IMPORT_TYPES_WITH_BACK_BUTTON,
} from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import useImportConfig from '@kitman/modules/src/shared/MassUpload/New/utils/useImportConfig';
import { getTitleLabels } from '@kitman/modules/src/shared/MassUpload/New/utils';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { AppStatus } from '@kitman/components';
import useHistoryGo from '@kitman/common/src/hooks/useHistoryGo';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { getFormType } from '@kitman/modules/src/shared/MassUpload/utils/eventTracking';

import style from './style';

export default ({
  importType,
  downloadCSV,
}: {
  importType: $Values<typeof IMPORT_TYPES>,
  downloadCSV?: () => ?File,
}) => {
  const { trackEvent } = useEventTracking();

  const { data: permissions, isLoading, isError } = useGetPermissionsQuery();

  const importConfig = useImportConfig({ importType, permissions });

  const dispatch = useDispatch();
  const locationAssign = useLocationAssign();
  const historyGo = useHistoryGo();

  const hasBackButton = IMPORT_TYPES_WITH_BACK_BUTTON.includes(importType);

  if (isLoading) {
    return <AppStatus message={i18n.t('Loading...')} status="loading" />;
  }

  if (isError) {
    return <AppStatus status="error" />;
  }

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      flexDirection={hasBackButton ? 'column' : 'row-reverse'}
      sx={style.wrapper}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {hasBackButton && (
          <Button
            variant="textOnly"
            sx={style.backButton}
            onClick={() => historyGo(-1)}
          >
            <i className="icon-next-left" />
            {i18n.t('Back')}
          </Button>
        )}

        <Stack direction="row" sx={style.actionButtons}>
          {importType === IMPORT_TYPES.TrainingVariablesAnswer && (
            <Button onClick={downloadCSV} color="secondary" sx={style.button}>
              {i18n.t('Export variable list')}
            </Button>
          )}
          {IMPORT_TYPES_WITH_TEMPLATE.includes(importType) && (
            <Button
              sx={style.button}
              color="secondary"
              onClick={() => dispatch(onOpenAddAthletesSidePanel())}
            >
              {i18n.t('Create a CSV file template')}
            </Button>
          )}
          {permissions?.settings.canCreateImports && (
            <Button
              sx={style.button}
              onClick={() => {
                if (importConfig?.enabled) {
                  locationAssign(`/mass_upload/${importType}`);
                } else dispatch(openMassUploadModal());
                trackEvent(
                  `Forms — ${getFormType(
                    importType
                  )} — Import a CSV file (start file import)`
                );
              }}
            >
              {i18n.t('Import a CSV file')}
            </Button>
          )}
        </Stack>
      </Stack>

      <Typography variant="h5" component="h1" sx={style.title}>
        {getTitleLabels()[importType]}
      </Typography>
    </Stack>
  );
};
