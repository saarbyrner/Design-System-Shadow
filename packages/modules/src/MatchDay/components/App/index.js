// @flow
import { Stack } from '@kitman/playbook/components';
import MatchNotice from '@kitman/modules/src/MatchDay/components/MatchNotice';

const App = () => {
  return (
    <Stack direction="column" gap={3} pt="24px">
      <MatchNotice />
    </Stack>
  );
};

export default App;
