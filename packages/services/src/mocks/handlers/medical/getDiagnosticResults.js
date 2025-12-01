const labResultsData = {
  results: [
    {
      order_id: 1,
      type: 'lab',
      reviewed: 'true',
      result_group_id: 'UUID_FROM_BE',
      results: [
        {
          application_order_id: 123456789,
          reference_id: 987654321,
          status: 'Final',
          redox_order_id: 1,
          index: 1,
          athlete_id: 1,
          description: 'G-6-PD, QN, RBC',
          code: 'X5068C',
          code_set: 'L',
          value: '260',
          value_type: 'Numeric',
          abnormal_flag: 'abnormal',
          specimen_source: null,
          specimen_body_site: null,
          formatted_text: [],
          reference: '127-427',
          units: 'U/10E12 RBC',
          notes: 'This is a mock comment for lab report.',
          created_at: '2022-03-15T',
        },
        {
          redox_order_id: 1,
          index: 8,
          athlete_id: 1,
          description: 'Calcium, Ionized',
          code: '15521',
          code_set: null,
          value: '4.29',
          value_type: 'Numeric',
          status: 'Final',
          abnormal_flag: 'Low',
          specimen_source: null,
          specimen_body_site: null,
          formatted_text: [],
          reference: '4.60-5.30',
          units: 'mg/dL',
        },
      ],
    },
  ],
};

const labData = labResultsData.results;

const radiologyResultsData = {
  results: [
    {
      order_id: 1,
      type: 'report',
      reviewed: 'true',
      result_group_id: 'UUID_FROM_BE',
      results: [
        {
          redox_order_id: 1,
          index: 1,
          athlete_id: 1,
          description: null,
          code: 'IMG315',
          code_set: null,
          value:
            'CLINICAL HISTORY:  Evaluate fracture; . TECHNIQUE:  Contiguous axial images of the left foot were obtained without intravenous contrast. Coronal and sagittal',
          value_type: 'String',
          status: null,
          abnormal_flag: null,
          specimen_source: null,
          specimen_body_site: null,
          formatted_text: [
            {
              head: 'SERVED! Clinical History',
              body: 'Evaluate fracture; .',
            },
            {
              head: ' Technique',
              body: 'Contiguous axial images of the left foot were obtained without intravenous contrast. Coronal and sagittal',
            },
          ],
          reference: null,
          units: null,
        },
        {
          redox_order_id: 1,
          index: 8,
          athlete_id: 1,
          description: null,
          code: 'IMG314',
          code_set: null,
          value: 'COMPARISON:    It was determined... ',
          value_type: 'String',
          status: null,
          abnormal_flag: null,
          specimen_source: null,
          specimen_body_site: null,
          formatted_text: [
            {
              head: 'Comparison',
              body: 'It was determined... ',
            },
          ],
          reference: null,
          units: null,
        },
      ],
    },
  ],
};

const radiologyData = radiologyResultsData.results;

export { labData, radiologyData };
