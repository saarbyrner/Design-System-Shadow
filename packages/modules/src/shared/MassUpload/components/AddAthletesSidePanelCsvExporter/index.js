// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import { type SquadData } from '@kitman/components/src/AthleteAndStaffSelector/types';
import { AthletesAndStaffSelectorMUITranslated as AthletesAndStaffSelectorMUI } from '@kitman/components/src/AthletesAndStaffSelectorMUI';
import useCSVExport from '@kitman/common/src/hooks/useCSVExport';
import type { RequestStatus } from '@kitman/common/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  useGetSquadAthletesQuery,
  useGetPermissionsQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import {
  openMassUploadModal,
  onCloseAddAthletesSidePanel,
} from '@kitman/modules/src/shared/MassUpload/redux/massUploadSlice';
import useImportConfig from '@kitman/modules/src/shared/MassUpload/New/utils/useImportConfig';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { getFormType } from '@kitman/modules/src/shared/MassUpload/utils/eventTracking';
import {
  growthAndMaturationTemplateColumns,
  baselinesTemplateColumns,
  benchmarkingTemplateColumns,
} from '@kitman/modules/src/shared/MassUpload/utils';

type Props = {
  isOpen?: boolean,
  onClose: () => void,
  importType: $Values<typeof IMPORT_TYPES>,
};

export type AthleteWithAdditionalData = {
  id: string,
  firstname: string,
  lastname: string,
  squad: string,
};

type AthleteSelection = Array<AthleteWithAdditionalData>;

const AddAthletesSidePanelCsvExporter = (props: I18nProps<Props>) => {
  const { trackEvent } = useEventTracking();

  const [squads, setSquads] = useState<Array<SquadData>>([]);
  const [selectedAthletes, setSelectedAthletes] = useState<AthleteSelection>(
    []
  );
  const [initialDataRequestStatus, setInitialDataRequestStatus] =
    useState<RequestStatus>('PENDING');
  const [data, setData] = useState<
    Array<{
      squad?: string,
      last_name?: string,
      athlete_last_name?: string,
    }>
  >([]);

  const dispatch = useDispatch();
  const {
    data: responseData,
    isError,
    isLoading,
    isSuccess,
  } = useGetSquadAthletesQuery(undefined, { skip: !props.isOpen });
  const { data: permissions } = useGetPermissionsQuery();

  const locationAssign = useLocationAssign();

  const todaysDate = moment().format('YYYY/MM/DD');

  const getFileName = () => {
    switch (props.importType) {
      case IMPORT_TYPES.GrowthAndMaturation:
        return `Growth-and-maturation-template-${todaysDate}`;
      case IMPORT_TYPES.Baselines:
        return `KR-baseline-template-${todaysDate}`;
      case IMPORT_TYPES.TrainingVariablesAnswer:
        return `Data-importer-template-${todaysDate}`;
      default:
        return `League-benchmarking-template-${todaysDate}`;
    }
  };

  const downloadCSV = useCSVExport(
    getFileName(),
    data.sort((a, b) => {
      if (a.squad && b.squad) {
        return (
          a.squad.localeCompare(b.squad) ||
          // $FlowIgnore[incompatible-call]
          // $FlowIgnore[incompatible-use] string comparison will not be undefined
          a.athlete_last_name.localeCompare(b.athlete_last_name)
        );
      }
      if (a.last_name && b.last_name) {
        return a.last_name.localeCompare(b.last_name);
      }
      // $FlowIgnore[incompatible-call]
      // $FlowIgnore[incompatible-use] string comparison will not be undefined
      return a.athlete_last_name.localeCompare(b.athlete_last_name);
    })
  );

  useEffect(() => {
    if (isLoading) setInitialDataRequestStatus('PENDING');
    if (isError) setInitialDataRequestStatus('FAILURE');

    if (isSuccess) {
      setSquads(responseData.squads ?? []);
      setInitialDataRequestStatus('SUCCESS');
    }
  }, [responseData, isError, isLoading, isSuccess]);

  const importConfig = useImportConfig({
    importType: props.importType,
    permissions,
  });
  useEffect(() => {
    if (data.length) {
      downloadCSV();
      if (importConfig?.enabled) {
        locationAssign(`/mass_upload/${props.importType}`);
      } else {
        dispatch(openMassUploadModal());
      }
    }
  }, [data]);

  const processCSV = (athletes: AthleteSelection) => {
    setData(
      athletes.map((athlete) => {
        switch (props.importType) {
          case IMPORT_TYPES.GrowthAndMaturation:
            return {
              athlete_id: athlete.id,
              athlete_first_name: athlete.firstname,
              athlete_last_name: athlete.lastname,
              date_measured: todaysDate,
              ...growthAndMaturationTemplateColumns,
            };
          case IMPORT_TYPES.Baselines:
            return {
              athlete_id: athlete.id,
              athlete_first_name: athlete.firstname,
              athlete_last_name: athlete.lastname,
              ...baselinesTemplateColumns,
            };
          case IMPORT_TYPES.TrainingVariablesAnswer:
            // Purposely inexact as training variables will differ between orgs
            // $FlowIgnore[cannot-spread-inexact]
            return {
              id: athlete.id,
              first_name: athlete.firstname,
              last_name: athlete.lastname,
              time_measured: null,
              micro_cycle: null,
            };
          case IMPORT_TYPES.LeagueBenchmarking:
          default:
            return {
              athlete_id: athlete.id,
              athlete_first_name: athlete.firstname,
              athlete_last_name: athlete.lastname,
              squad: athlete.squad,
              date_of_test: todaysDate,
              ...benchmarkingTemplateColumns,
            };
        }
      })
    );
    dispatch(onCloseAddAthletesSidePanel());
    setSelectedAthletes([]);
  };

  const onClose = () => {
    props.onClose();
    setSelectedAthletes([]);
  };

  const onConfirm = (athletes) => {
    processCSV(athletes);
    trackEvent(
      `Forms — ${getFormType(
        props.importType
      )} — Create a CSV file template — Download (template file)`
    );
  };

  return (
    <AthletesAndStaffSelectorMUI
      isLoading={initialDataRequestStatus === 'PENDING'}
      isError={initialDataRequestStatus === 'FAILURE'}
      isOpen={props.isOpen}
      title={props.t('Select athletes for template')}
      onCancel={onClose}
      confirmLabel={props.t('Download')}
      onConfirm={onConfirm}
      squads={squads}
      initialSelection={selectedAthletes.map(({ id }) => id)}
    />
  );
};

export const AddAthletesSidePanelCsvExporterTranslated = withNamespaces()(
  AddAthletesSidePanelCsvExporter
);
export default AddAthletesSidePanelCsvExporter;
