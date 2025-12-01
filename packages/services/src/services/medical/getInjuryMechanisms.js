// @flow
import $ from 'jquery';

export const mockData = [
  {
    id: 1,
    name: 'Blocked',
    parent_id: null,
    require_additional_input: false,
  },
  {
    id: 2,
    name: 'Blocking',
    parent_id: null,
    require_additional_input: false,
  },
  {
    id: 3,
    name: 'Catching',
    parent_id: null,
    require_additional_input: false,
  },
  {
    id: 4,
    name: 'Cut/Change Direction',
    parent_id: null,
    require_additional_input: false,
  },
  {
    id: 5,
    name: 'Fighting/Horseplay',
    parent_id: null,
    require_additional_input: false,
  },
  {
    id: 6,
    name: 'Jumping',
    parent_id: null,
    require_additional_input: false,
  },
  {
    id: 7,
    name: 'Kicking/Punting',
    parent_id: null,
    require_additional_input: false,
  },
  {
    id: 8,
    name: 'Landing',
    parent_id: null,
    require_additional_input: false,
  },
  {
    id: 9,
    name: 'Sprinting/Running',
    parent_id: null,
    require_additional_input: false,
  },
  {
    id: 10,
    name: 'Tackled',
    parent_id: null,
    require_additional_input: false,
  },
  {
    id: 11,
    name: 'Tackling',
    parent_id: null,
    require_additional_input: false,
  },
  {
    id: 12,
    name: 'Throwing',
    parent_id: null,
    require_additional_input: false,
  },
  {
    id: 13,
    name: 'Weightlifting',
    parent_id: null,
    require_additional_input: false,
  },
  {
    id: 14,
    name: 'Other ',
    parent_id: null,
    require_additional_input: false,
  },
  {
    id: 15,
    name: 'Unknown',
    parent_id: null,
    require_additional_input: false,
  },
  {
    id: 16,
    name: 'Above Waist',
    parent_id: 1,
    require_additional_input: false,
  },
  {
    id: 17,
    name: 'Below Waist',
    parent_id: 1,
    require_additional_input: false,
  },
  {
    id: 18,
    name: 'Pile-On',
    parent_id: 1,
    require_additional_input: false,
  },
  {
    id: 19,
    name: 'Above Waist',
    parent_id: 2,
    require_additional_input: false,
  },
  {
    id: 20,
    name: 'Below Waist',
    parent_id: 2,
    require_additional_input: false,
  },
  {
    id: 21,
    name: 'Pile-On',
    parent_id: 2,
    require_additional_input: false,
  },
  {
    id: 22,
    name: 'Above Waist',
    parent_id: 11,
    require_additional_input: false,
  },
  {
    id: 23,
    name: 'Below Waist',
    parent_id: 11,
    require_additional_input: false,
  },
  {
    id: 24,
    name: 'Pile-On',
    parent_id: 11,
    require_additional_input: false,
  },
  {
    id: 25,
    name: 'As Carrier',
    parent_id: 10,
    require_additional_input: false,
  },
  {
    id: 26,
    name: 'As Receiver',
    parent_id: 10,
    require_additional_input: false,
  },
  {
    id: 27,
    name: 'As Decoy',
    parent_id: 10,
    require_additional_input: false,
  },
  {
    id: 28,
    name: 'As Passer',
    parent_id: 10,
    require_additional_input: false,
  },
  {
    id: 29,
    name: 'After Pass',
    parent_id: 10,
    require_additional_input: false,
  },
];

export type InjuryMechanism = {
  id: number,
  name: string,
  parent_id: null | number,
  require_additional_input: boolean,
};

export type InjuryMechanisms = InjuryMechanism[];

const getInjuryMechanisms = (): Promise<InjuryMechanisms> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/medical/injury_mechanisms',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getInjuryMechanisms;
