// @flow
import type { ObjectStyle } from '@kitman/common/src/types/styles';
import { colors } from '@kitman/common/src/variables';

export default ({
    wrapper: {
      margin: '0 1rem',
      paddingBottom: '1rem'
    },
    border: {
      borderBottom: `1px solid  ${colors.cool_light_grey}`
    },
    title: {
        fontSize: '1rem'
    },
    binIcon: {
      button: {
        color: `${colors.grey_200}!important`
      }
    },
    header: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
  }: ObjectStyle);