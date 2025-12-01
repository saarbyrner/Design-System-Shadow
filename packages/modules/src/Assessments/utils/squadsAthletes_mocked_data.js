/* eslint-disable */

const getRandomId = () => Math.floor(Math.random() * 10000);
const getRandomInt = (max: number) =>
  Math.floor(Math.random() * Math.floor(max));

const NB_OF_SQUAD_ATHLETES = 12;
const POSITION_GROUPS = ['Goalkeeper', 'Defenders', 'Midfielders'];
const SQUAD_ATHLETE_NAMES = [
  'John Doe',
  'Peter Grant',
  'Paul Smith',
  'Robert Nash',
  'Norman Peterson',
  'Robert Kent',
  'Peter Maccao',
  'John Deloi',
  'Frank Cosmin',
];

const getSquadAthletes = () =>
  [...Array(NB_OF_SQUAD_ATHLETES).keys()].map(() => ({
    id: getRandomId(),
    fullname: SQUAD_ATHLETE_NAMES[getRandomInt(SQUAD_ATHLETE_NAMES.length)],
    avatar_url:
      'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?markalign=left,bottom&markpad=0&markfit=max&mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0P3R4dGNscj1mZmYmdHh0c2l6ZT0xNiZ0eHRzaGFkPTImYmc9OTUyNDJmMzgmdHh0Zm9udD1BdmVuaXIgTmV4dCBDb25kZW5zZWQgTWVkaXVtJnR4dGFsaWduPWNlbnRlciZ0eHRwYWQ9NSZ3PTM2JnR4dDY0PU56YzM&?ixlib=rails-3.1.0&auto=enhance&crop=faces&fit=crop&w=100&h=100',
    position_group: POSITION_GROUPS[getRandomInt(POSITION_GROUPS.length)],
  }));

export const mockedSquadAthletes = {
  position_groups: POSITION_GROUPS.map(() => ({
    id: getRandomId(),
    name: POSITION_GROUPS[getRandomInt(POSITION_GROUPS.length)],
    positions: [
      {
        id: getRandomId(),
        name: 'Fake position',
        athletes: getSquadAthletes(),
      },
    ],
  })),
};
