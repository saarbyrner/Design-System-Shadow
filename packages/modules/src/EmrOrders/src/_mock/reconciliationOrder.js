// @flow

const reconciliationOrder = {
  id: 'AD15679',
  is_draft: 'false',
  athlete: {
    id: 47299,
    fullname: 'Jack Cichy',
    date_of_birth: '1996-05-05',
  },
  creation_date: '2020-12-19T19:23:05+00:00',
  user: { fullname: 'Dr John Jones' },
  approval: 'Approved',
  status: 'Complete',
  items: [
    {
      id: 1,
      provider: { name: 'Stanford Health' },
      injuries: [{ name: 'ACL rupture (Knee Left)' }],
      illnesses: [{ name: 'ACL rupture (Knee Left)' }],
    },
  ],
  report: {
    provider: 'Stanford Health',
    dicom: {
      link: 'https://viewer.ohif.org/viewer/1.3.6.1.4.1.14519.5.2.1.7009.2403.194158539675615867024676990849',
      name: 'DICOM 09702958/65470000',
    },
    practitioner: 'John Jones',
    dateRecieved: 'March 8, 2021',
    area: 'Chest/Abdomen',
    diagnostic: 'Imaging',
    diagnosticType: 'PET/CT Scan',
    reason:
      'Evaluate left-sided chest pain following blunt trauma to left ribcage. Query # ribs 6-8, no sx of haemothorax or pneumothorax on inital exam.',
    clinicalNotes: 'None',
    internalNotes: 'None',
    findings: {
      attachements: '/blank/link',
      notes: [
        {
          heading: '',
          content: [
            'Lungs and Airways.',
            'Normal with no focal abnormality or signs of internal trauma.',
          ],
        },
        {
          heading: 'PLEURA',
          content: ['The pleural spaces are clear.'],
        },
        {
          heading: 'SOFT TISSUES',
          content: [
            'Left Lat dorsi showing no abnormality. Left Serratus ant showing effusion & mild ecchymosis. Intercostal muslces of ribs 6-9 showing moderate to severe scchymosis.',
          ],
        },
        {
          heading: 'BONES',
          content: [
            'No visible # to sternum, clavicle or ribcage. Notable ecchymosis to periosteum of ribs 6-8.',
          ],
        },
        {
          heading: 'ABDOMEN',
          content: ['No abnormal observations.'],
        },
        {
          heading: 'IMPRESSION',
          content: [
            '1. Moderate effusion to left ribcage.',
            '2. Notable ecchymosis to left sided ribs and intercostal spaces.',
            '3. No visible # to Sternum, Clavicle or Ribcage.',
            '4. No notable injury to Respiratory organs.',
          ],
        },
      ],
    },
  },
};

export default reconciliationOrder;
