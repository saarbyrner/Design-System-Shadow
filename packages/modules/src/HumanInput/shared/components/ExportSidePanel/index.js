// @flow
import moment from 'moment';
import { useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { useTheme } from '@kitman/playbook/hooks';
import { useSelector, useDispatch } from 'react-redux';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import SideDrawerLayout from '@kitman/modules/src/HumanInput/shared/components/SideDrawerLayout';
import { drawerMixin } from '@kitman/modules/src/HumanInput/shared/components/SideDrawerLayout/mixins';
import { Button, Drawer, Grid } from '@kitman/playbook/components';
import { add, remove } from '@kitman/modules/src/Toasts/toastsSlice';
import downloadCSV from '@kitman/common/src/utils/downloadCSV';
import { useFetchExportableElementsQuery } from '@kitman/services/src/services/exports/generic';
import { ExportTypeValues } from '@kitman/services/src/services/exports/generic/redux/services/types';
import { onBuildExportableFieldsState } from '@kitman/services/src/services/exports/generic/redux/slices/genericExportsSlice';
import { onUpdateExportForm } from '@kitman/modules/src/HumanInput/shared/redux/slices/humanInputSlice';
import { ExportFileNameTranslated as ExportFileName } from '@kitman/modules/src/HumanInput/shared/components/ExportSidePanel/components/ExportFileName';
import { ExportColumnsTranslated as ExportColumns } from '@kitman/modules/src/HumanInput/shared/components/ExportSidePanel/components/ExportColumns';
import { getExportFormFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/humanInputSelectors';
import { useExportAthleteProfileMutation } from '@kitman/services/src/services/humanInput/humanInput';
import { SquadSelectTranslated as SquadSelect } from '@kitman/modules/src/HumanInput/shared/components/ExportSidePanel/components/SquadSelect';
import type { ExportFormState } from '@kitman/modules/src/HumanInput/shared/redux/slices/humanInputSlice';

type Props = {
  isOpen: boolean,
  onClose: Function,
};

export const EXPORT_PROFILE_ERROR_TOAST_ID = 'EXPORT_PROFILE_ERROR_TOAST';
export const EXPORT_PROFILE_SUCCESS_TOAST_ID = 'EXPORT_PROFILE_SUCCESS_TOAST';
export const EXPORT_PROFILE_LOADING_TOAST_ID =
  'EXPORT_PROFILE_LOADING_TOAST_ID';

const ExportSidePanel = ({ isOpen, t, onClose }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { data: exportFields } = useFetchExportableElementsQuery(
    ExportTypeValues.ATHLETE_PROFILE
  );
  const { ids, filename, fields } = useSelector(getExportFormFactory());

  const handleUpdateForm = (partialForm: $Shape<ExportFormState>) => {
    dispatch(onUpdateExportForm(partialForm));
  };
  const [exportAthleteProfile, { isLoading: isExportLoading }] =
    useExportAthleteProfileMutation();

  useEffect(() => {
    dispatch(onBuildExportableFieldsState(exportFields));
  }, [exportFields, dispatch]);

  useEffect(() => {
    if (isExportLoading) {
      dispatch(
        add({
          id: EXPORT_PROFILE_LOADING_TOAST_ID,
          status: 'LOADING',
          title: t('Loading'),
          description: t('Loading export data'),
        })
      );
    }
  }, [isExportLoading, dispatch, t]);

  const clearAnyExistingExportProfileToast = () => {
    dispatch(remove(EXPORT_PROFILE_LOADING_TOAST_ID));
    dispatch(remove(EXPORT_PROFILE_ERROR_TOAST_ID));
    dispatch(remove(EXPORT_PROFILE_SUCCESS_TOAST_ID));
  };

  const onExportSuccess = () => {
    clearAnyExistingExportProfileToast();
    dispatch(
      add({
        id: EXPORT_PROFILE_SUCCESS_TOAST_ID,
        status: 'SUCCESS',
        title: t('Player data exported successfully'),
      })
    );
  };

  const onExportError = () => {
    clearAnyExistingExportProfileToast();
    dispatch(
      add({
        id: EXPORT_PROFILE_ERROR_TOAST_ID,
        status: 'ERROR',
        title: t('Unable to export data. Try again'),
      })
    );
  };

  const handleExportClick = () => {
    clearAnyExistingExportProfileToast();
    exportAthleteProfile({
      ids,
      filename,
      export_type: ExportTypeValues.ATHLETE_PROFILE,
      fields: fields.map(({ object, field, address }) => ({
        object,
        field,
        address,
      })),
    })
      .unwrap()
      .then((data) => {
        if (data) {
          downloadCSV(
            filename ||
              `athlete_profile_export_${moment().format('MMMM_DD_YYYY')}`,
            data,
            {},
            onExportError,
            onExportSuccess
          );
        }
      })
      .catch(() => {
        onExportError();
      });
  };

  const hasSelectedFilters = ids?.length && fields?.length;

  const isExportButtonDisabled =
    !window.featureFlags['form-based-athlete-profile'] ||
    isExportLoading ||
    !hasSelectedFilters;

  return (
    <Drawer open={isOpen} anchor="right" sx={drawerMixin({ theme, isOpen })}>
      <SideDrawerLayout>
        <SideDrawerLayout.Title title={t('Export')} onClose={onClose} />
        <SideDrawerLayout.Body>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <SquadSelect value={ids} onUpdate={handleUpdateForm} />
            </Grid>
            <Grid item xs={12}>
              <ExportFileName
                value={filename}
                onUpdate={(value) => handleUpdateForm({ filename: value })}
              />
            </Grid>
            <Grid item xs={12}>
              <ExportColumns
                value={fields}
                onUpdate={(value) => handleUpdateForm({ fields: value })}
              />
            </Grid>
          </Grid>
        </SideDrawerLayout.Body>
        <SideDrawerLayout.Actions>
          <Button
            variant="contained"
            disabled={isExportButtonDisabled}
            onClick={handleExportClick}
          >
            {t('Export')}
          </Button>
        </SideDrawerLayout.Actions>
      </SideDrawerLayout>
    </Drawer>
  );
};

export const ExportSidePanelTranslated = withNamespaces()(ExportSidePanel);
export default ExportSidePanel;
