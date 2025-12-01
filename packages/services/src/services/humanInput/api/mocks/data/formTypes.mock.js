// @flow

import type { FormType } from '@kitman/services/src/services/humanInput/api/types';

const data: Array<FormType> = [
  {
    id: 22,
    category: 'medical',
    group: 'pac_12',
    key: 'concussion_history',
    name: 'Concussion history',
    fullname: null,
    form_type: 'history',
    config: {},
    enabled: true,
    created_at: '2022-08-09T14:28:02Z',
    updated_at: '2022-08-18T10:55:19Z',
  },
  {
    id: 48,
    category: 'medical',
    group: 'pac_12',
    key: 'concussion_incident',
    name: 'Concussion incident',
    fullname: 'PAC-12 - Concussion incident',
    form_type: 'incident',
    config: null,
    enabled: true,
    created_at: '2022-09-21T18:23:20Z',
    updated_at: '2022-09-21T18:23:20Z',
  },
  {
    id: 49,
    category: 'medical',
    group: 'pac_12',
    key: 'concussion_rtp',
    name: 'Concussion RTP',
    fullname: 'PAC-12 - Concussion RTP',
    form_type: 'return_to_play',
    config: null,
    enabled: true,
    created_at: '2022-09-21T18:23:20Z',
    updated_at: '2022-09-21T18:23:20Z',
  },
];

export default data;
