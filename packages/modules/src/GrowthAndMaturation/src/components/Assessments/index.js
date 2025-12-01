// @flow
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { AddAthletesSidePanelCsvExporterTranslated as AddAthletesSidePanelCsvExporter } from '@kitman/modules/src/shared/MassUpload/components/AddAthletesSidePanelCsvExporter';
import {
  onOpenAddAthletesSidePanel,
  onCloseAddAthletesSidePanel,
} from '@kitman/modules/src/shared/MassUpload/redux/massUploadSlice';
import SubmissionsTable from '@kitman/modules/src/shared/SubmissionsTable';
import Header from '@kitman/modules/src/shared/MassUpload/New/components/Header';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';

import { CSVImporterTranslated as CSVImporter } from '../CSVImporter';

type Props = {
  type: $Values<typeof IMPORT_TYPES>,
};

const Assessments = (props: I18nProps<Props>) => {
  const [hasOpened, setHasOpened] = useState<boolean>(false);

  const urlParams = useLocationSearch();

  const dispatch = useDispatch();
  const { isOpen } = useSelector(
    (state) => state.massUploadSlice.addAthletesSidePanel
  );

  useEffect(() => {
    if (urlParams?.get('action') === 'open-side-panel' && !hasOpened) {
      dispatch(onOpenAddAthletesSidePanel());
      setHasOpened(true);
    }
  }, [urlParams, hasOpened]);

  return (
    <>
      <Header importType={props.type} />
      <AddAthletesSidePanelCsvExporter
        isOpen={isOpen}
        onClose={() => dispatch(onCloseAddAthletesSidePanel())}
        importType={props.type}
      />
      {(props.type === IMPORT_TYPES.GrowthAndMaturation ||
        props.type === IMPORT_TYPES.Baselines) && (
        <CSVImporter type={props.type} />
      )}
      <SubmissionsTable importType={props.type} />
    </>
  );
};

// Exporting translated as default for use in Router
export default withNamespaces()(Assessments);
