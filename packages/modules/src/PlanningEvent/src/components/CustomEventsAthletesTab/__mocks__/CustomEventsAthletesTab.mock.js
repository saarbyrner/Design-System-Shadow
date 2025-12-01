// @flow
import type { AthleteWithSqauds } from '@kitman/common/src/types/Event';

export const athleteMock: AthleteWithSqauds = {
  athlete_squads: [
    { id: '1', name: 'U18' },
    { id: '2', name: 'U17' },
  ],
  availability: 'available',
  firstname: 'Athlete',
  id: 15642,
  lastname: 'Mock',
  fullname: 'Athlete Mock',
  shortname: 'AMock',
  user_id: 2,
  avatar_url:
    'https://kitman-staging.imgix.net/kitman/1eca5e06bc1638e915c1ecebbdca0ff5_2.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0P2JnPTk1MjQyZjM4JnR4dDY0PU1nJnR4dGFsaWduPWNlbnRlciZ0eHRjbHI9ZmZmJnR4dGZvbnQ9QXZlbmlyK05leHQrQ29uZGVuc2VkK01lZGl1bSZ0eHRwYWQ9NSZ0eHRzaGFkPTImdHh0c2l6ZT0xNiZ3PTM2&markalign=left%2Cbottom&markfit=max&markpad=0&w=100',
  position: {
    id: 3,
    name: 'String',
    abbreviation: 's',
  },
};

export default {};
