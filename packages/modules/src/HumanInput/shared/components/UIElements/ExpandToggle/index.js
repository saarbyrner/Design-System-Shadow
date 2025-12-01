// @flow
import { styled } from '@mui/material/styles';
import { IconButton } from '@kitman/playbook/components';

export default styled((props) => {
  const { isActive, ...other } = props;
  return <IconButton {...other} disableRipple />;
})(({ theme, isActive }) => ({
  transform: !isActive ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));
