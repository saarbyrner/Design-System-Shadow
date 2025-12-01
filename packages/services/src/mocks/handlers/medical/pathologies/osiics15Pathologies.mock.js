const osiics15MockPathologies = [
  {
    id: 5842,
    code: 'GVI',
    pathology: 'Exercise-related iliac artery flow limitation',
    coding_system_version: {
      id: 5,
      coding_system: {
        id: 5,
        name: 'OSIICS-15',
        key: 'osiics_15',
      },
      name: 'OSIICS-15.1',
      order: null,
    },
    coding_system_body_region: {
      id: 26,
      coding_system_id: 5,
      name: 'Lower limb',
    },
    coding_system_body_part: {
      id: 56,
      coding_system_id: 5,
      coding_system_body_region: {
        id: 26,
        coding_system_id: 5,
        name: 'Lower limb',
      },
      name: 'Groin/Hip',
    },
    coding_system_tissue: {
      id: 35,
      coding_system_id: 5,
      name: 'Vessels',
    },
    coding_system_classification: {
      id: 233,
      coding_system_id: 5,
      name: 'Contusion/vascular',
    },
  },
  {
    id: 6162,
    code: 'MCCCA',
    pathology: 'Coronary artery disease',
    coding_system_version: {
      id: 5,
      coding_system: {
        id: 5,
        name: 'OSIICS-15',
        key: 'osiics_15',
      },
      name: 'OSIICS-15.1',
      order: null,
    },
    coding_system_body_region: null,
    coding_system_body_part: null,
    coding_system_tissue: null,
    coding_system_classification: null,
  },
  {
    id: 6185,
    code: 'MCJCA',
    pathology: 'Coronary artery anomaly',
    coding_system_version: {
      id: 5,
      coding_system: {
        id: 5,
        name: 'OSIICS-15',
        key: 'osiics_15',
      },
      name: 'OSIICS-15.1',
      order: null,
    },
    coding_system_body_region: null,
    coding_system_body_part: null,
    coding_system_tissue: null,
    coding_system_classification: null,
  },
  {
    id: 6784,
    code: 'QV4',
    pathology: 'Popliteal artery entrapment',
    coding_system_version: {
      id: 5,
      coding_system: {
        id: 5,
        name: 'OSIICS-15',
        key: 'osiics_15',
      },
      name: 'OSIICS-15.1',
      order: null,
    },
    coding_system_body_region: {
      id: 26,
      coding_system_id: 5,
      name: 'Lower limb',
    },
    coding_system_body_part: {
      id: 59,
      coding_system_id: 5,
      coding_system_body_region: {
        id: 26,
        coding_system_id: 5,
        name: 'Lower limb',
      },
      name: 'Lower leg',
    },
    coding_system_tissue: {
      id: 35,
      coding_system_id: 5,
      name: 'Vessels',
    },
    coding_system_classification: {
      id: 233,
      coding_system_id: 5,
      name: 'Contusion/vascular',
    },
  },
  {
    id: 6921,
    code: 'LMT2',
    pathology: 'Leg Muscle Tear',
    coding_system_body_area: 'Lower',
    coding_system_version: {
      id: 5,
      coding_system: {
        id: 5,
        name: 'OSIICS-15',
        key: 'osiics_15',
      },
      name: 'OSIICS-15.1',
      order: null,
    },
    coding_system_body_region: {
      id: 26,
      coding_system_id: 5,
      name: 'Leg Muscle Tear',
    },
    coding_system_body_part: {
      id: 59,
      coding_system_id: 5,
      coding_system_body_region: {
        id: 26,
        coding_system_id: 5,
        name: 'Leg Muscle Tear',
      },
      name: 'Leg Muscle Tear',
    },
    coding_system_tissue: {
      id: 35,
      coding_system_id: 5,
      name: 'Vessels',
    },
    coding_system_classification: {
      id: 233,
      coding_system_id: 5,
      name: 'Contusion/vascular1',
    },
  },
  {
    id: 69611,
    code: 'LMS1',
    pathology: 'Leg Muscle Strain',
    coding_system_body_area: 'Lower2',
    coding_system_version: {
      id: 5,
      coding_system: {
        id: 5,
        name: 'OSIICS-15',
        key: 'osiics_15',
      },
      name: 'OSIICS-15.1',
      order: null,
    },
    coding_system_body_region: {
      id: 26,
      coding_system_id: 5,
      name: 'Leg Muscle Strain',
    },
    coding_system_body_part: {
      id: 59,
      coding_system_id: 5,
      coding_system_body_region: {
        id: 26,
        coding_system_id: 5,
        name: 'Leg Muscle Strain',
      },
      name: 'Leg Muscle Strain',
    },
    coding_system_tissue: {
      id: 35,
      coding_system_id: 5,
      name: 'Vessels',
    },
    coding_system_classification: {
      id: 233,
      coding_system_id: 5,
      name: 'Contusion/vascular2',
    },
  },
];

export default osiics15MockPathologies;
