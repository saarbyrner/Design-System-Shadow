// @flow
import { memo, useContext } from 'react';
import { css } from '@emotion/react';
import { LineLoader } from '@kitman/components';
import PermissionsContext from '@kitman/common/src/contexts/PermissionsContext';
import VaccinationsHistory from './VaccinationsHistory';
import TUEHistory from './TUEHistory';
import useMedicalHistory from '../../hooks/useMedicalHistory';

const styles = {
  lineLoader: css`
    bottom: 0;
    height: 4px;
    left: 0;
    overflow: hidden;
    position: absolute;
    width: 100%;
  `,
};

type MedicalHistoryTabProps = {
  athleteId: number,
  hiddenFilters: Array<string>,
};

const MedicalHistoryTab = (props: MedicalHistoryTabProps) => {
  const permissions = useContext(PermissionsContext);
  const medicalPermissions = permissions.permissions.medical;
  const { isLoading, data } = useMedicalHistory({
    athleteId: props.athleteId,
    initialFetch: true,
  });

  if (isLoading) {
    return (
      <div css={styles.lineLoader}>
        <LineLoader />
      </div>
    );
  }

  return (
    <div data-testid="MedicalHistoryTab">
      <VaccinationsHistory
        data={data.vaccinations}
        permissions={medicalPermissions.vaccinations}
        athleteId={props.athleteId}
        hiddenFilters={props.hiddenFilters}
      />
      {window.getFlag('pm-show-tue') && (
        <TUEHistory
          data={data.tue}
          permissions={medicalPermissions.tue}
          athleteId={props.athleteId}
          hiddenFilters={props.hiddenFilters}
        />
      )}
    </div>
  );
};

export default memo<MedicalHistoryTabProps>(MedicalHistoryTab);
