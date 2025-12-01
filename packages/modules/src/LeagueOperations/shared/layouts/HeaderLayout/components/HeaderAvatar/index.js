// @flow
import { Avatar } from '@kitman/playbook/components';

type Props = {
  alt: ?string,
  src: ?string,
  variant: 'small' | 'large',
};

const HeaderAvatar = (props: Props) => {
  const getDimensions = () => {
    if (props.variant === 'small') {
      return 40;
    }
    return { xs: 50, sm: 80 };
  };

  return (
    <Avatar
      alt={props.alt}
      src={props.src}
      sx={{
        height: getDimensions(),
        width: getDimensions(),
        '.MuiAvatar-img': {
          objectFit: 'contain',
        },
      }}
    />
  );
};

export default HeaderAvatar;
