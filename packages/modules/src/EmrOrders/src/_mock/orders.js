// @flow

const orderList = [
  {
    id: 764121,
    is_draft: 'false',
    athlete: {
      id: 47296,
      fullname: 'Shaquil Barrett',
      date_of_birth: '1992-11-17',
    },
    creation_date: '2021-01-19T19:23:05+00:00',
    user: { fullname: 'John Jones' },
    approval: 'Approved',
    status: 'Complete',
    items: [
      {
        id: 1,
        area: 'Left knee',
        provider: { name: 'Stanford Health' },
        diagnostic_type: { name: 'MRI' },
        order_type: { name: 'Imaging' },
        injuries: [{ id: 1, name: 'ACL rupture (Knee Left)' }],
        illnesses: [],
        reason:
          'Evaluate medial left knee pain. Injured during football training 1 day ago. Positive Lachman test. Evaluate ACL tear.',
      },
    ],
    report: {
      provider: 'Stanford Health',
      dicom: {
        link: 'https://viewer.ohif.org/viewer/1.3.6.1.4.1.14519.5.2.1.7009.2403.871108593056125491804754960339',
        name: 'DICOM 09102908/56240000',
      },
      practitioner: 'John Jones',
      dateRecieved: 'January 21, 2021',
      area: 'Left knee',
      diagnostic: 'Imaging',
      diagnosticType: 'MRI',
      reason:
        'Evaluate medial left knee pain. Injured during football training 1 day ago. Positive Lachman test. Evaluate ACL tear.',
      clinicalNotes: 'None',
      internalNotes: 'None',
      findings: {
        attachements: '/blank/link',
        notes: [
          {
            heading: 'FLUID',
            content: ['Moderate effusion.'],
          },
          {
            heading: 'MENISCI',
            content: [
              'Medial: No evidence of a tear.',
              'Lateral: Peripheral vertical tear in the posterior horn of the lateral meniscus at the ligament of Wrisberg attachment.',
            ],
          },
          {
            heading: 'CRUCIATE LIGAMENTS',
            content: [
              'Complete tear of the ACL, which is torn in the mid substance. The posterior cruciate ligament is intact.',
            ],
          },
          {
            heading: 'COLLATERAL LIGAMENTS',
            content: [
              'Grade 1 to grade 2 MCL sprain. There is edema in the deep fibers, as well as some in the superficial fibers and in the adjacent soft tissues. Edema extends anteriorly to the region of the medial patellofemoral ligament attachment to the adductor tubercle where the injury is intermediate grade in character. The lateral collateral ligament complex is intact. Edema is noted in the popliteus muscle belly and muscle-tendon junction as well as the popliteal fibular ligament region also reflective of an intermediate grade injury.',
            ],
          },
          {
            heading: 'EXTENSOR MECHANISM',
            content: ['Intact.'],
          },
          {
            heading: 'CARTILAGE',
            content: [
              'Patellofemoral compartment: No chondral defect or area of high-grade chondral loss.',
              'Medial tibiofemoral compartment: No chondral defect or area of high-grade chondral loss.',
              'Lateral tibiofemoral compartment: No chondral defect or area of high-grade chondral loss. ',
            ],
          },
          {
            heading: 'BONE MARROW',
            content: [
              'Bone marrow contusions are seen in the posterior medial and lateral proximal tibia as well as the mid lateral femoral condyle extending anteriorly. There is a contusion in the anterior lateral proximal tibia and as well in the proximal fibula. There is an additional contusion along the inferior pole of the patella.',
            ],
          },
          {
            heading: 'IMPRESSION',
            content: [
              '1. Moderate effusion.',
              '2. Peripheral vertical tear in the posterior horn of the lateral meniscus at the ligament of Wrisberg attachment.',
              '3. Complete tear of the ACL.',
              '4. Grade 1 to grade 2 MCL complex sprain as described above.',
              '5. Edema extends anteriorly to the region of the medial patellofemoral ligament attachment to the adductor tubercle where the injury is intermediate grade in character. Edema is noted in the popliteus muscle belly and muscle tendon junction as well as the popliteal fibular ligament region also reflective of an intermediate grade injury.',
              '6. Bone marrow contusions are seen in the posterior medial and lateral proximal tibia as well as the mid lateral femoral condyle extending anteriorly. There is a contusion in the anterior lateral proximal tibia and as well in the proximal fibula. There is an additional contusion along the inferior pole of the patella.',
            ],
          },
        ],
      },
    },
  },
];

export default orderList;
