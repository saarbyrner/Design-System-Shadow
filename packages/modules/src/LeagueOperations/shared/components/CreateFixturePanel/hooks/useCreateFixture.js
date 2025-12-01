// @flow
import { useDispatch } from 'react-redux';
import { onTogglePanel } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/createFixtureSlice';
import i18n from '@kitman/common/src/utils/i18n';
import { Button } from '@kitman/playbook/components';

const useCreateFixture = () => {
  const dispatch = useDispatch();

  const handleOnToggle = (val: boolean) => {
    dispatch(onTogglePanel({ isOpen: val }));
  };

  const menuItem = {
    description: i18n.t('Create Fixture'),
    onClick: () => {
      handleOnToggle(true);
    },
  };

  const buttonTrigger = (
    <Button onClick={() => {}}>{i18n.t('Create Fixture')}</Button>
  );

  return {
    handleOnToggle,
    buttonTrigger,
    menuItem,
  };
};

export default useCreateFixture;
