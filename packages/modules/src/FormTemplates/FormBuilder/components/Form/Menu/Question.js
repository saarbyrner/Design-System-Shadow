// @flow
import { Box } from '@kitman/playbook/components';
import ItemDetailsStart from './components/ItemDetailsStart';
import { levelEnumLike } from './utils/enum-likes';

type Props = {
  id: number,
  name: string,
  isChildOfGroup?: boolean,
};

const Question = ({ name, id, isChildOfGroup }: Props) => {
  return (
    <Box
      sx={{
        ...(isChildOfGroup ? { pl: '1rem' } : {}),
      }}
    >
      <ItemDetailsStart id={id} name={name} level={levelEnumLike.question} />
    </Box>
  );
};

export default Question;
