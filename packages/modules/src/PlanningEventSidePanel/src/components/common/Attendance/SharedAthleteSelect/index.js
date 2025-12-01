// @flow
import type { ID } from '@kitman/components/src/Athletes/types';
import AthleteSelector from '@kitman/playbook/components/wrappers/AthleteSelector';
import { useAssociationAthletes } from '@kitman/playbook/components/wrappers/AthleteSelector/dataSources';
import { Box } from '@mui/material';
import type { OnUpdateEventDetails } from '../../../../types';
import Trigger from './SelectTrigger';

type Props = {
  onUpdateEventDetails: OnUpdateEventDetails,
  athleteIds: Array<ID>,
};

const SharedAthleteSelect = ({ athleteIds, onUpdateEventDetails }: Props) => {
  const handleUpdate = (ids: number[]) => {
    onUpdateEventDetails({
      athlete_ids: ids,
    });
  };

  const mappedIds = (athleteIds ?? []).map(Number);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        marginBottom: '16px',
        '& > div:first-of-type': {
          gridColumn: '1 / span 3',
        },
      }}
    >
      <AthleteSelector
        initialIds={mappedIds}
        useData={useAssociationAthletes}
        onDone={handleUpdate}
        variant="dropdown"
        Trigger={Trigger}
      />
    </Box>
  );
};

export default SharedAthleteSelect;
