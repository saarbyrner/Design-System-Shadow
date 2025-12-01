// @flow
import { colors } from '@kitman/common/src/variables';

const styles = {
  searchBar: {
    margin: '0 2rem 1rem',
    position: 'relative',
  },
  staffList: {
    height: 'calc(100% - 16rem)',
    listStyleType: 'none',
    overflow: 'auto',
  },
  staffListItem: {
    height: '2.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: '30px',
    marginBottom: '10px',
    gap: '.5rem',
  },
  staffCheckboxInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  staffInfoContainer: {
    lineHeight: '15px',
    marginLeft: '10px',
  },
  staffNameDisplay: {
    display: 'block',
    cursor: 'pointer',
  },
  staffRoleDisplay: {
    fontWeight: '400',
    fontSize: '11px',
    color: colors.grey_100,
  },
};

export default styles;
