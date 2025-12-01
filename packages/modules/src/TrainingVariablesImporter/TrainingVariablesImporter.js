// @flow
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import { AddAthletesSidePanelCsvExporterTranslated as AddAthletesSidePanelCsvExporter } from '@kitman/modules/src/shared/MassUpload/components/AddAthletesSidePanelCsvExporter';
import {
  onOpenAddAthletesSidePanel,
  onCloseAddAthletesSidePanel,
} from '@kitman/modules/src/shared/MassUpload/redux/massUploadSlice';
import i18n from '@kitman/common/src/utils/i18n';
import { useBrowserTabTitle } from '@kitman/common/src/hooks';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import Header from '@kitman/modules/src/shared/MassUpload/New/components/Header';
import SubmissionsTable from '@kitman/modules/src/shared/SubmissionsTable';
import useCSVExport from '@kitman/common/src/hooks/useCSVExport';
import { useGetTrainingVariablesQuery } from '@kitman/common/src/redux/global/services/globalApi';

export default () => {
  useBrowserTabTitle(i18n.t('Training data import'));

  const todaysDate = moment().format('YYYY/MM/DD');

  const [hasOpened, setHasOpened] = useState<boolean>(false);

  const urlParams = useLocationSearch();

  const dispatch = useDispatch();
  const { isOpen } = useSelector(
    (state) => state.massUploadSlice.addAthletesSidePanel
  );

  const {
    data: { training_variables: trainingVariables } = {
      training_variables: [],
    },
  } = useGetTrainingVariablesQuery();

  const downloadCSV = useCSVExport(
    `Variables list ${todaysDate}`,
    trainingVariables
  );

  useEffect(() => {
    if (urlParams?.get('action') === 'open-side-panel' && !hasOpened) {
      dispatch(onOpenAddAthletesSidePanel());
      setHasOpened(true);
    }
  }, [urlParams, hasOpened, dispatch]);

  return (
    <>
      <Header
        importType={IMPORT_TYPES.TrainingVariablesAnswer}
        downloadCSV={downloadCSV}
      />
      <AddAthletesSidePanelCsvExporter
        isOpen={isOpen}
        onClose={() => dispatch(onCloseAddAthletesSidePanel())}
        importType={IMPORT_TYPES.TrainingVariablesAnswer}
      />
      <SubmissionsTable importType={IMPORT_TYPES.TrainingVariablesAnswer} />
    </>
  );
};
