// @flow

import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';

import {
  useFetchImportTypeOptionsQuery,
  useFetchImportCreatorOptionsQuery,
} from '../services/imports';

import { ImportsGridTranslated as ImportsGrid } from './src/components/ImportsGrid';

export default () => {
  const { permissionsRequestStatus } = usePermissions();
  const { organisationRequestStatus } = useOrganisation();

  const {
    isLoading: isImportTypeLoading,
    isError: isImportTypeError,
    isSuccess: isImportTypeSuccess,
  } = useFetchImportTypeOptionsQuery();

  const {
    isLoading: isImportCreatorOptionsLoading,
    isError: isImportCreatorOptionsError,
    isSuccess: isImportCreatorOptionsSuccess,
  } = useFetchImportCreatorOptionsQuery();

  const isLoading = [
    isImportTypeLoading,
    isImportCreatorOptionsLoading,
    permissionsRequestStatus === 'PENDING',
    organisationRequestStatus === 'PENDING',
  ].includes(true);

  const hasFailed = [
    isImportTypeError,
    isImportCreatorOptionsError,
    permissionsRequestStatus === 'FAILURE',
    organisationRequestStatus === 'FAILURE',
  ].includes(true);

  const isSuccess = [
    isImportTypeSuccess,
    isImportCreatorOptionsSuccess,
    permissionsRequestStatus === 'SUCCESS',
    organisationRequestStatus === 'SUCCESS',
  ].every((v) => v === true);

  if (hasFailed) {
    return <AppStatus status="error" isEmbed />;
  }

  if (isLoading) {
    return <DelayedLoadingFeedback />;
  }

  if (isSuccess) {
    return <ImportsGrid />;
  }

  return null;
};
