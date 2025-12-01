/* eslint-disable flowtype/require-valid-file-annotation */
import injuryResponse from './dummyInjuryResponse';
import illnessResponse from './dummyIllnessResponse';
import absenceResponse from './dummyAbsenceResponse';

const athleteData = () => [
  {
    availability: 'unavailable',
    full_name: 'Rod Athlete',
    firstname: 'Rod',
    id: 1644,
    lastname: 'Athlete',
    injuries: injuryResponse(),
    illnesses: illnessResponse(),
    absences: absenceResponse(),
    modification_info: 'New Test',
    position: 'Hooker',
    positionId: 71,
    positionGroup: 'Forward',
    positionGroupId: 2,
    position_group: 'Forward',
    position_group_id: 2,
    position_id: 71,
    rtp: '2017-07-20T00:00:00.000+01:00',
    unavailable_since: '6 months',
    updated: '2018-09-12T15:19:06.000+01:00',
  },
  {
    id: 1941,
    availability: 'available',
    unavailable_since: null,
    full_name: 'Roland Calabash',
    firstname: 'Roland',
    lastname: 'Calabash',
    modification_info: '',
    position: 'Loose-head Prop',
    positionId: 72,
    positionGroup: 'Back',
    positionGroupId: 1,
    position_group: 'Back',
    position_group_id: 1,
    position_id: 72,
    rtp: '2015-08-31T01:00:00.000+01:00',
    updated: '2016-06-28T14:11:35.000+01:00',
    injuries: [],
    illnesses: [],
    absences: [],
  },
];

export default athleteData;
