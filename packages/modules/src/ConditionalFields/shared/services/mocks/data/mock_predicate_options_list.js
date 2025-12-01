export const data = {
  locations: [
    {
      label: 'Additional Questions',
      value: 'AdditionalQuestions',
    },
    {
      label: 'Event Information',
      value: 'EventInformation',
    },
    {
      label: 'Initial Information',
      value: 'InitialInformation',
    },
  ],
  predicate_options: [
    {
      label: 'Activity',
      operators: [
        {
          label: 'Is',
          value: 'eq',
        },
      ],
      options: [
        {
          label: ' Primary Mechanism of Injury - Accelerating',
          value: 37,
        },
        {
          label: ' Primary Mechanism of Injury - Aerial Challenge',
          value: 257,
        },
        {
          label: ' Primary Mechanism of Injury - Being Tackled',
          value: 991,
        },
        {
          label: ' Primary Mechanism of Injury - Blocked',
          value: 539,
        },
        {
          label: ' Primary Mechanism of Injury - Blocking',
          value: 925,
        },
        {
          label: ' Primary Mechanism of Injury - Change of Direction',
          value: 1806,
        },
        {
          label: ' Primary Mechanism of Injury - Collision',
          value: 231,
        },
        {
          label: ' Primary Mechanism of Injury - Collision',
          value: 124,
        },
        {
          label: 'Primary Mechanism of Injury - Accelerating',
          value: 45,
        },
        {
          label: 'Primary Mechanism of Injury - Aerial Challenge',
          value: 258,
        },
        {
          label: 'Primary Mechanism of Injury - Agility',
          value: 605,
        },
        {
          label: 'Primary Mechanism of Injury - Being Tackled',
          value: 992,
        },
        {
          label: 'Primary Mechanism of Injury - Blocked',
          value: 540,
        },
        {
          label: 'Primary Mechanism of Injury - Blocking',
          value: 937,
        },
        {
          label: 'Primary Mechanism of Injury - Change of Direction',
          value: 1807,
        },
      ],
      path: 'activity/id',
      deprecated: false,
    },
    {
      label: 'Activity Group',
      operators: [
        {
          label: 'Is',
          value: 'eq',
        },
      ],
      options: [
        {
          label: ' Primary Mechanism of Injury',
          value: 5,
        },
        {
          label: 'Primary Mechanism of Injury',
          value: 6,
        },
      ],
      path: 'activity_group/id',
      deprecated: false,
    },
    {
      label: 'Event Type',
      operators: [
        {
          label: 'Is',
          value: 'eq',
        },
      ],
      options: [
        {
          label: 'Game',
          value: 2,
        },
        {
          label: 'Lesson',
          value: 5,
        },
        {
          label: 'Medical',
          value: 3,
        },
        {
          label: 'Meeting',
          value: 4,
        },
        {
          label: 'Other',
          value: 7,
        },
        {
          label: 'Session',
          value: 1,
        },
        {
          label: 'Travel',
          value: 6,
        },
      ],
      path: 'event_type/id',
      deprecated: false,
    },
    {
      label: 'Clinical Impression Code',
      operators: [
        {
          label: 'Is',
          value: 'eq',
        },
      ],
      options: [
        {
          label: '000000 - No Clinical Impression Entered',
          value: '000000',
        },
        {
          label: '010100 - Head Abrasion',
          value: '010100',
        },
        {
          label: '010200 - Head Contusion',
          value: '010200',
        },
        {
          label: '010400 - Head Scalp Laceration',
          value: '010400',
        },
        {
          label: '011000 - Head Concussion',
          value: '011000',
        },
        {
          label: '011410 - Head Headaches Traumatic',
          value: '011410',
        },
        {
          label: '011420 - Head Epilepsy/Post Traumatic',
          value: '011420',
        },
        {
          label: '011430 - Head Subarachnoid Hemorrhage',
          value: '011430',
        },
        {
          label: '011450 - Head Epidural Hematoma',
          value: '011450',
        },
        {
          label: '011460 - Head Subdural Hematoma',
          value: '011460',
        },
        {
          label: '011470 - Head Intracerebral Hemorrhage',
          value: '011470',
        },
        {
          label: '011500 - Head Post Concussion Syndrome',
          value: '011500',
        },
        {
          label: '011510 - Head Brain Stem Contusion',
          value: '011510',
        },
        {
          label: '011511 - Occipital Neuralgia',
          value: '011511',
        },
        {
          label: '015000 - Head Skull Fracture',
          value: '015000',
        },
        {
          label: '015700 - Head Fracture/Osteochondral',
          value: '015700',
        },
        {
          label: '018100 - Head Nontraumatic Headaches',
          value: '018100',
        },
        {
          label: '018110 - Head Migraine Headaches',
          value: '018110',
        },
        {
          label: '018121 - Head Neurocardiogenic Syncope',
          value: '018121',
        },
        {
          label: '018122 - Syncope, Exertional',
          value: '018122',
        },
        {
          label: '018123 - Syncope, Non-exertional',
          value: '018123',
        },
        {
          label: '018130 - Head Epilepsy/Grand Mal',
          value: '018130',
        },
        {
          label: '018140 - Head General Seizure',
          value: '018140',
        },
        {
          label: '018160 - Head Epilepsy/Psychomotor',
          value: '018160',
        },
        {
          label: '018165 - Head Convulsive Disorder/Seizure',
          value: '018165',
        },
        {
          label: '018170 - Head Intermittent Blackouts',
          value: '018170',
        },
        {
          label: '018200 - Head Congenital Malformation',
          value: '018200',
        },
        {
          label: '018201 - Head Chiari Malformation/Type I',
          value: '018201',
        },
        {
          label: '018500 - Head Abscess',
          value: '018500',
        },
        {
          label: '018600 - Head Scalp Infection',
          value: '018600',
        },
        {
          label: '018610 - Head Encephalitis',
          value: '018610',
        },
        {
          label: '018620 - Head Sinusitis/Acute',
          value: '018620',
        },
        {
          label: '018710 - Head Bacterial Meningitis/Acute',
          value: '018710',
        },
        {
          label: '018810 - Head Hyperthyroidism',
          value: '018810',
        },
        {
          label: '018811 - Head Hypothyroidism',
          value: '018811',
        },
        {
          label: '018820 - Head Hydrocephalus',
          value: '018820',
        },
        {
          label: '018900 - Head Benign Tumor',
          value: '018900',
        },
        {
          label: '018901 - Head Benign Tumor/Extracranial',
          value: '018901',
        },
        {
          label: '018902 - Head Benign Tumor/Intracranial',
          value: '018902',
        },
        {
          label: '018903 - Head Pituitary Adenoma',
          value: '018903',
        },
        {
          label: '018910 - Head Mastoid/Benign Tumor',
          value: '018910',
        },
        {
          label:
            '019560 - Possible Concussion, Evaluation, Player Cleared to Return',
          value: '019560',
        },
        {
          label: '020110 - Face Forehead Abrasion',
          value: '020110',
        },
        {
          label: '020120 - Face Eyebrow Abrasion',
          value: '020120',
        },
        {
          label: '020130 - Face Cheek Abrasion',
          value: '020130',
        },
        {
          label: '020140 - Face Eyelid Abrasion',
          value: '020140',
        },
        {
          label: '020210 - Face Forehead Contusion',
          value: '020210',
        },
        {
          label: '020220 - Face Eyebrow Contusion',
          value: '020220',
        },
        {
          label: '020230 - Face Cheek Contusion',
          value: '020230',
        },
        {
          label: '020240 - Face Eyelid Contusion',
          value: '020240',
        },
        {
          label: '020310 - Face Forehead Puncture Wound',
          value: '020310',
        },
        {
          label: '020320 - Face Eyebrow Puncture Wound',
          value: '020320',
        },
        {
          label: '020330 - Face Cheek Puncture Wound',
          value: '020330',
        },
        {
          label: '020340 - Face Eyelid Puncture Wound',
          value: '020340',
        },
        {
          label: '020410 - Face Forehead Laceration',
          value: '020410',
        },
        {
          label: '020420 - Face Eyebrow Laceration',
          value: '020420',
        },
        {
          label: '020430 - Face Cheek Laceration',
          value: '020430',
        },
        {
          label: '020440 - Face Eyelid Laceration',
          value: '020440',
        },
        {
          label: '021510 - Face Supraorbital Nerve Contusion',
          value: '021510',
        },
        {
          label: '021630 - Face Nerve Disorder',
          value: '021630',
        },
        {
          label: "021631 - Face Bell's Palsy",
          value: '021631',
        },
        {
          label: '022100 - Face Burn 1 Deg',
          value: '022100',
        },
        {
          label: '022200 - Face Burn 2 Deg',
          value: '022200',
        },
        {
          label: '022300 - Face Burn 3 Deg',
          value: '022300',
        },
        {
          label: '025010 - Face Fracture/Zygoma',
          value: '025010',
        },
        {
          label: '025020 - Face Fracture/Zygomatic Arch',
          value: '025020',
        },
        {
          label: '028610 - Face Forehead Sinusitis',
          value: '028610',
        },
        {
          label: '028710 - Face Forehead Rash',
          value: '028710',
        },
        {
          label: '028751 - Face Forehead Staph Infection - MRSA',
          value: '028751',
        },
        {
          label: '028752 - Face Forehead Staph Infection - MSSA',
          value: '028752',
        },
        {
          label: '030030 - Eye Detached Retina',
          value: '030030',
        },
        {
          label: '030100 - Eye Abrasion',
          value: '030100',
        },
        {
          label: '030111 - Eye Corneal Abrasion',
          value: '030111',
        },
        {
          label: '030200 - Eye Contusion',
          value: '030200',
        },
        {
          label: '030210 - Eye Corneal Contusion',
          value: '030210',
        },
        {
          label: '030240 - Eye Iris Contusion',
          value: '030240',
        },
        {
          label: '030260 - Eye Globe Contusion',
          value: '030260',
        },
        {
          label: '030300 - Eye Puncture Wound',
          value: '030300',
        },
        {
          label: '030400 - Eye Laceration',
          value: '030400',
        },
        {
          label: '030410 - Eye Corneal Laceration',
          value: '030410',
        },
        {
          label: '030440 - Eye Iris Laceration/Rupture',
          value: '030440',
        },
        {
          label: '030470 - Eye Conjunctive Laceration',
          value: '030470',
        },
        {
          label: '030830 - Eye Retinal Vessel Rupture',
          value: '030830',
        },
        {
          label: '034000 - Eye Muscle Strain',
          value: '034000',
        },
        {
          label: '035100 - Eye Orbit/Fracture/Simple',
          value: '035100',
        },
        {
          label: '035600 - Eye Orbit/Fracture/Greenstick',
          value: '035600',
        },
        {
          label: '035810 - Eye Orbit/Fracture/Inferior/Comminuted',
          value: '035810',
        },
        {
          label: '035900 - Eye Orbit/Fracture/Blowout',
          value: '035900',
        },
        {
          label: '038300 - Eye Allergy Reaction/Non-drug',
          value: '038300',
        },
        {
          label: '038310 - Eye Hyphema',
          value: '038310',
        },
        {
          label: '038600 - Eye Inflammation',
          value: '038600',
        },
        {
          label: '038610 - Eye Uveitis',
          value: '038610',
        },
        {
          label: '038620 - Eye Iritis',
          value: '038620',
        },
        {
          label: '038680 - Eye Sty/External',
          value: '038680',
        },
        {
          label: '038710 - Eye Conjunctivitis/Viral',
          value: '038710',
        },
        {
          label: '038720 - Eye Conjunctivitis/Purulent',
          value: '038720',
        },
        {
          label: '038730 - Eye Conjunctivitis/Traumatic',
          value: '038730',
        },
        {
          label: '038740 - Eye Viral Infection',
          value: '038740',
        },
        {
          label: '038800 - Eye Non-disease/Atypical Condition',
          value: '038800',
        },
        {
          label: '038810 - Eye Corneal Opacity',
          value: '038810',
        },
        {
          label: '038820 - Eye Corneal Keratoconus',
          value: '038820',
        },
        {
          label: '038821 - Visual Disturbances',
          value: '038821',
        },
        {
          label: '040010 - Ear Tympanic Membrane Trauma',
          value: '040010',
        },
        {
          label: '040100 - Ear Abrasion',
          value: '040100',
        },
        {
          label: '040200 - Ear Contusion',
          value: '040200',
        },
        {
          label: '040210 - Ear Hematoma/Acute',
          value: '040210',
        },
        {
          label: '040220 - Ear Cauliflower',
          value: '040220',
        },
        {
          label: '040300 - Ear Puncture Wound',
          value: '040300',
        },
        {
          label: '040310 - Ear Drum Perforation/Traumatic',
          value: '040310',
        },
        {
          label: '040400 - Ear Laceration',
          value: '040400',
        },
        {
          label: '040800 - Ear Vascular Trauma',
          value: '040800',
        },
        {
          label: '041610 - Ear Nerve Disorder/Vertigo',
          value: '041610',
        },
        {
          label: '048110 - Ear Impacted Cerumen',
          value: '048110',
        },
        {
          label: '048500 - Ear Abscess',
          value: '048500',
        },
        {
          label: '048600 - Ear Infection',
          value: '048600',
        },
        {
          label: '048610 - Ear Otitis External',
          value: '048610',
        },
        {
          label: '048620 - Ear Otitis Medial',
          value: '048620',
        },
        {
          label: '048630 - Ear Cellulitis External',
          value: '048630',
        },
        {
          label: '048631 - Ear Labyrinthitis',
          value: '048631',
        },
        {
          label: '048751 - Ear Staph Infection - MRSA',
          value: '048751',
        },
        {
          label: '048752 - Ear Staph Infection - MSSA',
          value: '048752',
        },
        {
          label: '048800 - Ear Non-disease/Atypical Condition',
          value: '048800',
        },
        {
          label: '048810 - Ear Tinnitis',
          value: '048810',
        },
        {
          label: '050100 - Jaw/Chin Abrasion',
          value: '050100',
        },
        {
          label: '050110 - Jaw/Chin Mandible/Abrasion',
          value: '050110',
        },
        {
          label: '050120 - Jaw/Chin Maxilla/Abrasion',
          value: '050120',
        },
        {
          label: '050200 - Jaw/Chin Contusion',
          value: '050200',
        },
        {
          label: '050201 - Jaw TMJ Contusion',
          value: '050201',
        },
        {
          label: '050210 - Jaw/Chin Mandible/Contusion',
          value: '050210',
        },
        {
          label: '050220 - Jaw/Chin Maxilla/Contusion',
          value: '050220',
        },
        {
          label: '050300 - Jaw/Chin Puncture Wound',
          value: '050300',
        },
        {
          label: '050400 - Jaw/Chin Laceration',
          value: '050400',
        },
        {
          label: '050410 - Jaw/Chin Mandible/Laceration',
          value: '050410',
        },
        {
          label: '050420 - Jaw/Chin Maxilla/Laceration',
          value: '050420',
        },
        {
          label: '052001 - Jaw/Chin Burn 1 Deg',
          value: '052001',
        },
        {
          label: '052002 - Jaw/Chin Burn 2 Deg',
          value: '052002',
        },
        {
          label: '052003 - Jaw/Chin Burn 3 Deg',
          value: '052003',
        },
        {
          label: '052700 - Jaw/Chin Friction Blister',
          value: '052700',
        },
        {
          label: '053000 - Jaw TMJ Sprain',
          value: '053000',
        },
        {
          label: '053400 - Jaw TMJ Subluxation',
          value: '053400',
        },
        {
          label: '053500 - Jaw TMJ Subluxation/Recurrent',
          value: '053500',
        },
        {
          label: '053600 - Jaw TMJ Dislocation',
          value: '053600',
        },
        {
          label: '055010 - Jaw Fracture/Mandible',
          value: '055010',
        },
        {
          label: '055020 - Jaw Fracture/Maxilla',
          value: '055020',
        },
        {
          label: '055110 - Jaw Fracture/Mandible/Open',
          value: '055110',
        },
        {
          label: '055210 - Jaw Fracture/Mandible/Avulsion',
          value: '055210',
        },
        {
          label: '055310 - Jaw Fracture/Mandible/Dislocation',
          value: '055310',
        },
        {
          label: '055510 - Jaw Fracture/Mandible/Stress',
          value: '055510',
        },
        {
          label: '055520 - Jaw Fracture/Maxilla Tripod/Stress',
          value: '055520',
        },
        {
          label: '055910 - Jaw Fracture/Mandible/Other',
          value: '055910',
        },
        {
          label: '058500 - Jaw Mandible Abscess',
          value: '058500',
        },
        {
          label: '058610 - Jaw/Chin Sebaceous Cyst',
          value: '058610',
        },
        {
          label: '058900 - Jaw/Chin Benign Tumor',
          value: '058900',
        },
        {
          label: '060010 - Mouth Intruded Tooth',
          value: '060010',
        },
        {
          label: '060100 - Mouth Abrasion',
          value: '060100',
        },
        {
          label: '060200 - Mouth Contusion',
          value: '060200',
        },
        {
          label: '060300 - Mouth Puncture',
          value: '060300',
        },
        {
          label: '060310 - Mouth Extraoral Puncture',
          value: '060310',
        },
        {
          label: '060320 - Mouth Intraoral Puncture',
          value: '060320',
        },
        {
          label: '060400 - Mouth Laceration',
          value: '060400',
        },
        {
          label: '060410 - Mouth Extraoral Laceration',
          value: '060410',
        },
        {
          label: '060420 - Mouth Intraoral Laceration',
          value: '060420',
        },
        {
          label: '060421 - Mouth Tongue Laceration',
          value: '060421',
        },
        {
          label: '061600 - Mouth Tooth Nerve Disorder',
          value: '061600',
        },
        {
          label: '063000 - Mouth Tooth Injury',
          value: '063000',
        },
        {
          label: '063400 - Mouth Tooth Partial Luxation/Acute',
          value: '063400',
        },
        {
          label: '063600 - Mouth Tooth Complete Luxation/Acute',
          value: '063600',
        },
        {
          label: '065010 - Mouth Fracture Tooth/Break',
          value: '065010',
        },
        {
          label: '065020 - Mouth Fracture Tooth/Chip',
          value: '065020',
        },
        {
          label: '065030 - Mouth Fracture Tooth/Linear',
          value: '065030',
        },
        {
          label: '065040 - Mouth Fracture Tooth/Root',
          value: '065040',
        },
        {
          label: '065060 - Mouth Perm Dental Bridge Broken',
          value: '065060',
        },
        {
          label: '068100 - Mouth Tooth Ache',
          value: '068100',
        },
        {
          label: '068110 - Mouth Dental Caries',
          value: '068110',
        },
        {
          label: '068120 - Mouth Periodontitis',
          value: '068120',
        },
        {
          label: '068130 - Mouth Tooth Removal/Impacted',
          value: '068130',
        },
        {
          label: '068140 - Mouth Tooth Removal',
          value: '068140',
        },
        {
          label: '068500 - Mouth Tooth Abscess',
          value: '068500',
        },
        {
          label: '068520 - Mouth Intraoral Abscess',
          value: '068520',
        },
        {
          label: '068600 - Mouth Gingivitis',
          value: '068600',
        },
        {
          label: '068610 - Mouth Salivary Gland Infection',
          value: '068610',
        },
        {
          label: '068710 - Mouth Apthous/Stomatitis',
          value: '068710',
        },
        {
          label: '068810 - Mouth Tooth/Lost Filling',
          value: '068810',
        },
        {
          label: '070100 - Nose Abrasion',
          value: '070100',
        },
        {
          label: '070200 - Nose Contusion',
          value: '070200',
        },
        {
          label: '070300 - Nose Puncture Wound',
          value: '070300',
        },
        {
          label: '070400 - Nose Laceration',
          value: '070400',
        },
        {
          label: '070500 - Nose Bursitis',
          value: '070500',
        },
        {
          label: '070600 - Nasal Septum Deviation',
          value: '070600',
        },
        {
          label: '075000 - Nose Fracture',
          value: '075000',
        },
        {
          label: '078500 - Nose Abscess',
          value: '078500',
        },
        {
          label: '078600 - Nose Rhinitis/Acute',
          value: '078600',
        },
        {
          label: '078601 - Nose Staph Infection - MRSA',
          value: '078601',
        },
        {
          label: '078602 - Nose Staph Infection - MSSA',
          value: '078602',
        },
        {
          label: '080100 - Throat Abrasion',
          value: '080100',
        },
        {
          label: '080201 - Throat Contusion',
          value: '080201',
        },
        {
          label: '080300 - Throat Puncture',
          value: '080300',
        },
        {
          label: '080400 - Throat Laceration',
          value: '080400',
        },
        {
          label: '085000 - Throat Fracture Larynx',
          value: '085000',
        },
        {
          label: '088100 - Throat Pharyngeal Illness',
          value: '088100',
        },
        {
          label: '088600 - Throat Infection',
          value: '088600',
        },
        {
          label: '088610 - Throat Acute Laryngitis',
          value: '088610',
        },
        {
          label: '088620 - Throat Acute Tonsillitis',
          value: '088620',
        },
        {
          label: '088630 - Throat Viral Pharyngitis',
          value: '088630',
        },
        {
          label: '088710 - Throat Esophagial Irritation',
          value: '088710',
        },
        {
          label: '088740 - Throat Streptococcal Pharyngitis',
          value: '088740',
        },
        {
          label: '088750 - Throat Pharyngitis',
          value: '088750',
        },
        {
          label: '088810 - Throat Larynx Papilloma',
          value: '088810',
        },
        {
          label: '088910 - Throat Common Polyp on Vocal Cord',
          value: '088910',
        },
        {
          label: '088920 - Thyroid Nodule',
          value: '088920',
        },
        {
          label: '090100 - Neck Abrasion',
          value: '090100',
        },
        {
          label: '090200 - Neck Contusion',
          value: '090200',
        },
        {
          label: '090300 - Neck Puncture Wound',
          value: '090300',
        },
        {
          label: '090400 - Neck Laceration',
          value: '090400',
        },
        {
          label: '091010 - Neck Brachial Plexus Stretch',
          value: '091010',
        },
        {
          label: '091020 - Neck Brachial Plexus Compression',
          value: '091020',
        },
        {
          label: '093000 - Neck Cervical Sprain/Strain',
          value: '093000',
        },
        {
          label: '093010 - Neck Cervical Hyperextension Sprain',
          value: '093010',
        },
        {
          label: '093020 - Neck Cervical Hyperflexor Ion Sprain',
          value: '093020',
        },
        {
          label: '093612 - Neck Cervical C2-C3 Dislocation',
          value: '093612',
        },
        {
          label: '093613 - Neck Cervical C3-C4 Dislocation',
          value: '093613',
        },
        {
          label: '093614 - Neck Cervical C4-C5 Dislocation',
          value: '093614',
        },
        {
          label: '093615 - Neck Cervical C5-C6 Dislocation',
          value: '093615',
        },
        {
          label: '093616 - Neck Cervical C6-C7 Dislocation',
          value: '093616',
        },
        {
          label: '093617 - Neck Cervical C7-T1 Dislocation',
          value: '093617',
        },
        {
          label: '093620 - Neck Cervical Articular Process Dislocation',
          value: '093620',
        },
        {
          label: '095001 - Neck Cervical Fracture C1-C2',
          value: '095001',
        },
        {
          label: '095002 - Neck Cervical Fracture C3-C4',
          value: '095002',
        },
        {
          label: '095003 - Neck Cervical Fracture C5-C6',
          value: '095003',
        },
        {
          label: '095004 - Neck Cervical Fracture C7',
          value: '095004',
        },
        {
          label: '095222 - Neck Spinous Process Avulsion Fracture C3-C4',
          value: '095222',
        },
        {
          label: '095223 - Neck Spinous Process Avulsion Fracture C5-C6',
          value: '095223',
        },
        {
          label: '095224 - Neck Spinous Process Avulsion Fracture C7',
          value: '095224',
        },
        {
          label: '095230 - Neck Cervical Vertebral Body Fracture',
          value: '095230',
        },
        {
          label: '095301 - Neck Cervical Fracture/Dislocation C1-C2',
          value: '095301',
        },
        {
          label: '095302 - Neck Cervical Fracture/Dislocation C3-C4',
          value: '095302',
        },
        {
          label: '095303 - Neck Cervical Fracture/Dislocation C5-C6',
          value: '095303',
        },
        {
          label: '095304 - Neck Cervical Fracture/Dislocation C7',
          value: '095304',
        },
        {
          label: '095305 - Neck Cervical Fracture/Dislocation C2-C3',
          value: '095305',
        },
        {
          label: '095306 - Neck Cervical Fracture/Dislocation C6-C7',
          value: '095306',
        },
        {
          label: '095307 - Neck Cervical Fracture/Dislocation C7-T1',
          value: '095307',
        },
        {
          label: '096122 - Neck Cervical Disc Disorder W/Myelopathy',
          value: '096122',
        },
        {
          label: '096210 - Neck Cervical Spinal Stenosis',
          value: '096210',
        },
        {
          label: '096231 - Neck Cervical Cord Concussion',
          value: '096231',
        },
        {
          label: '096242 - Neck Cervical Disc Herniation C2-C3',
          value: '096242',
        },
        {
          label: '096243 - Neck Cervical Disc Herniation C3-C4',
          value: '096243',
        },
        {
          label: '096244 - Neck Cervical Disc Herniation C4-C5',
          value: '096244',
        },
        {
          label: '096245 - Neck Cervical Disc Herniation C5-C6',
          value: '096245',
        },
        {
          label: '096246 - Neck Cervical Disc Herniation C6-C7',
          value: '096246',
        },
        {
          label: '096247 - Neck Cervical Disc Herniation C7-T1',
          value: '096247',
        },
        {
          label: '098100 - Neck Cervical Disc Disease',
          value: '098100',
        },
        {
          label: '098110 - Neck Cervical Pain',
          value: '098110',
        },
        {
          label: '098210 - Neck Cervical Nevus',
          value: '098210',
        },
        {
          label: '098800 - Neck Cervical Disc Derangement',
          value: '098800',
        },
        {
          label: '098900 - Neck Cervical Benign Tumor',
          value: '098900',
        },
        {
          label: '098950 - Neck Staph Infection - MRSA',
          value: '098950',
        },
        {
          label: '098951 - Neck Staph Infection - MSSA',
          value: '098951',
        },
        {
          label: '100100 - Shoulder Abrasion',
          value: '100100',
        },
        {
          label: '100200 - Shoulder Contusion',
          value: '100200',
        },
        {
          label: '100300 - Shoulder Puncture Wound',
          value: '100300',
        },
        {
          label: '100400 - Shoulder Laceration',
          value: '100400',
        },
        {
          label: '100500 - Shoulder Bursitis',
          value: '100500',
        },
        {
          label: '100610 - Shoulder Rotator Cuff Tendinitis/Acute',
          value: '100610',
        },
        {
          label: '100614 - Shoulder Subscapularis Tendinitis/Acute',
          value: '100614',
        },
        {
          label: '100660 - Shoulder Biceps Tendinitis/Acute',
          value: '100660',
        },
        {
          label: '100700 - Shoulder Inflammation Synovitis-Capsulitis/Acute',
          value: '100700',
        },
        {
          label: '100800 - Shoulder Vascular Trauma',
          value: '100800',
        },
        {
          label: '100810 - Shoulder Thoracic Outlet Syndrome',
          value: '100810',
        },
        {
          label: '100900 - Shoulder Muscle Spasms',
          value: '100900',
        },
        {
          label: '101010 - Shoulder Axillary Nerve Compression',
          value: '101010',
        },
        {
          label: '101500 - Shoulder Nerve Contusion',
          value: '101500',
        },
        {
          label: '101600 - Shoulder Nerve Disorder',
          value: '101600',
        },
        {
          label: '101641 - Shoulder Ganglion Cyst',
          value: '101641',
        },
        {
          label: '101800 - Shoulder Nerve Laceration',
          value: '101800',
        },
        {
          label: '103000 - Shoulder Sprain (non-specific)',
          value: '103000',
        },
        {
          label: '103400 - Shoulder G-H Subluxation/Acute',
          value: '103400',
        },
        {
          label: '103410 - Shoulder G-H Anterior Subluxation/Acute',
          value: '103410',
        },
        {
          label: '103420 - Shoulder G-H Posterior Subluxation/Acute',
          value: '103420',
        },
        {
          label: '103430 - Shoulder G-H Inferior Subluxation/Acute',
          value: '103430',
        },
        {
          label: '103500 - Shoulder G-H Subluxation/Recurrent',
          value: '103500',
        },
        {
          label: '103510 - Shoulder G-H Anterior Subluxation/Recurrent',
          value: '103510',
        },
        {
          label: '103520 - Shoulder G-H Posterior Subluxation/Recurrent',
          value: '103520',
        },
        {
          label: '103530 - Shoulder G-H Inferior Subluxation/Recurrent',
          value: '103530',
        },
        {
          label: '103560 - Shoulder Biceps Tendon Subluxation/Recurrent',
          value: '103560',
        },
        {
          label: '103610 - Shoulder G-H Anterior Dislocation/Acute',
          value: '103610',
        },
        {
          label: '103620 - Shoulder G-H Posterior Dislocation/Acute',
          value: '103620',
        },
        {
          label: '103630 - Shoulder G-H Inferior Dislocation/Acute',
          value: '103630',
        },
        {
          label: '103710 - Shoulder G-H Anterior Dislocation/Recurrent',
          value: '103710',
        },
        {
          label: '103720 - Shoulder G-H Posterior Dislocation/Recurrent',
          value: '103720',
        },
        {
          label: '103730 - Shoulder G-H Dislocation/Inferior/Recurrent',
          value: '103730',
        },
        {
          label: '103900 - Shoulder Multi-directional Instability',
          value: '103900',
        },
        {
          label: '104000 - Shoulder Muscle Strain (non-specific)',
          value: '104000',
        },
        {
          label: '104050 - Shoulder Triceps Strain',
          value: '104050',
        },
        {
          label: '104060 - Shoulder Biceps Strain',
          value: '104060',
        },
        {
          label: '104110 - Shoulder Rotator Cuff Strain 1 Deg',
          value: '104110',
        },
        {
          label: '104111 - Shoulder Supraspinatus Strain 1 Deg',
          value: '104111',
        },
        {
          label: '104112 - Shoulder Infraspinatus Strain 1 Deg',
          value: '104112',
        },
        {
          label: '104113 - Shoulder Teres Minor Strain 1 Deg',
          value: '104113',
        },
        {
          label: '104114 - Shoulder Subscapularis Strain 1 Deg',
          value: '104114',
        },
        {
          label: '104120 - Shoulder Deltoid Strain 1 Deg',
          value: '104120',
        },
        {
          label: '104150 - Shoulder Proximal Triceps Strain 1 Deg',
          value: '104150',
        },
        {
          label: '104160 - Shoulder Proximal Biceps Strain 1 Deg',
          value: '104160',
        },
        {
          label: '104170 - Shoulder Serratus Anterior Strain 1 Deg',
          value: '104170',
        },
        {
          label: '104180 - Shoulder Trapezius Strain 1 Deg',
          value: '104180',
        },
        {
          label: '104190 - Shoulder Teres Major Strain 1 Deg',
          value: '104190',
        },
        {
          label: '104210 - Shoulder Rotator Cuff Strain 2 Deg',
          value: '104210',
        },
        {
          label: '104211 - Shoulder Supraspinatus Strain 2 Deg',
          value: '104211',
        },
        {
          label: '104212 - Shoulder Infraspinatus Strain 2 Deg',
          value: '104212',
        },
        {
          label: '104213 - Shoulder Teres Minor Strain 2 Deg',
          value: '104213',
        },
        {
          label: '104214 - Shoulder Subscapularis Strain 2 Deg',
          value: '104214',
        },
        {
          label: '104220 - Shoulder Deltoid Strain 2 Deg',
          value: '104220',
        },
        {
          label: '104250 - Shoulder Proximal Triceps Strain 2 Deg',
          value: '104250',
        },
        {
          label: '104260 - Shoulder Proximal Biceps Strain 2 Deg',
          value: '104260',
        },
        {
          label: '104270 - Shoulder Serratus Anterior Strain 2 Deg',
          value: '104270',
        },
        {
          label: '104280 - Shoulder Trapezius Strain 2 Deg',
          value: '104280',
        },
        {
          label: '104290 - Shoulder Teres Major Strain 2 Deg',
          value: '104290',
        },
        {
          label: '104310 - Shoulder Rotator Cuff Strain 3 Deg (Complete Tear)',
          value: '104310',
        },
        {
          label: '104311 - Shoulder Supraspinatus Strain 3 Deg',
          value: '104311',
        },
        {
          label: '104312 - Shoulder Infraspinatus Strain 3 Deg',
          value: '104312',
        },
        {
          label: '104313 - Shoulder Teres Minor Strain 3 Deg',
          value: '104313',
        },
        {
          label: '104314 - Shoulder Subscapularis Strain 3 Deg (Complete Tear)',
          value: '104314',
        },
        {
          label: '104320 - Shoulder Deltoid Strain 3 Deg (Complete Tear)',
          value: '104320',
        },
        {
          label:
            '104350 - Shoulder Proximal Triceps Strain 3 Deg (Complete Tear)',
          value: '104350',
        },
        {
          label:
            '104360 - Shoulder Proximal Biceps Strain 3 Deg (Complete Tear)',
          value: '104360',
        },
        {
          label:
            '104370 - Shoulder Serratus Anterior Strain 3 Deg (Complete Tear)',
          value: '104370',
        },
        {
          label: '104380 - Shoulder Trapezius Strain 3 Deg (Complete Tear)',
          value: '104380',
        },
        {
          label: '104390 - Shoulder Teres Major Strain 3 Deg (Complete Tear)',
          value: '104390',
        },
        {
          label: '104660 - Shoulder Acute Biceps Subluxation/Dislocation',
          value: '104660',
        },
        {
          label: '104760 - Shoulder Recurrent Biceps Subluxation/Dislocation',
          value: '104760',
        },
        {
          label: '104810 - Shoulder Rotator Cuff Tendinosis Chronic',
          value: '104810',
        },
        {
          label: '105010 - Shoulder Fracture/Scapula',
          value: '105010',
        },
        {
          label: '105020 - Shoulder Fracture/Humerus Proximal',
          value: '105020',
        },
        {
          label: '105050 - Shoulder Fracture/Glenoid',
          value: '105050',
        },
        {
          label: '105070 - Shoulder Fracture/Coracoid Process',
          value: '105070',
        },
        {
          label: '105230 - Shoulder Fracture/Humeral Shaft',
          value: '105230',
        },
        {
          label: '105510 - Shoulder Fracture/Scapula/Stress',
          value: '105510',
        },
        {
          label: '106171 - Shoulder Adhesive Capsulitis',
          value: '106171',
        },
        {
          label: '106190 - Shoulder Osteomyelitis',
          value: '106190',
        },
        {
          label: '106200 - Shoulder Chondral Defect / Glenoid',
          value: '106200',
        },
        {
          label: '106210 - Shoulder Osteochondritis Dissecans/AVN',
          value: '106210',
        },
        {
          label: '106230 - Shoulder DJD (Degenerative Joint Disease)',
          value: '106230',
        },
        {
          label: '106250 - Shoulder Rotator Cuff Calcification',
          value: '106250',
        },
        {
          label: '106270 - Shoulder Myositis Ossificans',
          value: '106270',
        },
        {
          label: '106310 - Shoulder Bone Cyst/Solitary',
          value: '106310',
        },
        {
          label: '106410 - Shoulder Joint Loose Bodies',
          value: '106410',
        },
        {
          label: '106471 - Shoulder Exertion Thrombosis',
          value: '106471',
        },
        {
          label: '106501 - Shoulder Glenoid Labrum Tear/Anterior',
          value: '106501',
        },
        {
          label: '106502 - Shoulder Glenoid Labrum Tear/Posterior',
          value: '106502',
        },
        {
          label: '106503 - Shoulder Glenoid Labrum Tear/Superior',
          value: '106503',
        },
        {
          label: '106504 - Shoulder Glenoid Labrum Tear/Inferior',
          value: '106504',
        },
        {
          label: '106507 - Shoulder Labral Tear (non-specific)',
          value: '106507',
        },
        {
          label: '108210 - Shoulder Congenital Defect',
          value: '108210',
        },
        {
          label: '108211 - Shoulder Os Acromiale',
          value: '108211',
        },
        {
          label: '108600 - Shoulder Infection',
          value: '108600',
        },
        {
          label: '108603 - Shoulder Joint Staph Infection - MRSA',
          value: '108603',
        },
        {
          label: '108604 - Shoulder Joint Staph Infection - MSSA',
          value: '108604',
        },
        {
          label: '108605 - Shoulder External Skin Staph Infection - MRSA',
          value: '108605',
        },
        {
          label: '108606 - Shoulder External Skin Staph Infection - MSSA',
          value: '108606',
        },
        {
          label: '108800 - Shoulder Non Disease/Atypical Condition',
          value: '108800',
        },
        {
          label: '108900 - Shoulder Benign Tumor',
          value: '108900',
        },
        {
          label: '109700 - Shoulder Burn 1 Deg',
          value: '109700',
        },
        {
          label: '109701 - Shoulder Burn 2 Deg',
          value: '109701',
        },
        {
          label: '109702 - Shoulder Burn 3 Deg',
          value: '109702',
        },
        {
          label: '109703 - Shoulder Friction Blister',
          value: '109703',
        },
        {
          label: '110200 - Clavicle Contusion',
          value: '110200',
        },
        {
          label: '110210 - Clavicle A-C Contusion',
          value: '110210',
        },
        {
          label: '110220 - Clavicle S-C Contusion',
          value: '110220',
        },
        {
          label: '110800 - Clavicle Vascular Trauma',
          value: '110800',
        },
        {
          label: '113120 - Clavicle S-C Sprain/Anterior 1 Deg',
          value: '113120',
        },
        {
          label: '113130 - Clavicle S-C Sprain/Posterior 1 Deg',
          value: '113130',
        },
        {
          label: '113150 - Clavicle A-C Sprain Type 1 (1 Deg)',
          value: '113150',
        },
        {
          label: '113220 - Clavicle S-C Sprain/Anterior 2 Deg',
          value: '113220',
        },
        {
          label: '113230 - Clavicle S-C Sprain/Posterior 2 Deg',
          value: '113230',
        },
        {
          label: '113250 - Clavicle A-C Sprain Type 2 (2 Deg)',
          value: '113250',
        },
        {
          label: '113320 - Clavicle S-C Sprain/Anterior 3 Deg',
          value: '113320',
        },
        {
          label: '113330 - Clavicle S-C Sprain/Posterior 3 Deg',
          value: '113330',
        },
        {
          label: '113350 - Clavicle A-C Sprain Type 3 (3 Deg)',
          value: '113350',
        },
        {
          label: '113450 - Clavicle A-C Sprain Type 4',
          value: '113450',
        },
        {
          label: '113560 - Clavicle A-C Sprain Type 5',
          value: '113560',
        },
        {
          label: '113660 - Clavicle A-C Sprain Type 6',
          value: '113660',
        },
        {
          label: '115000 - Clavicle Fracture',
          value: '115000',
        },
        {
          label: '115010 - Clavicle Fracture/Medial (Inner 3rd)',
          value: '115010',
        },
        {
          label: '115020 - Clavicle Fracture/Mid (Middle 3rd)',
          value: '115020',
        },
        {
          label: '115030 - Clavicle Fracture/Lateral (Outer 3rd)',
          value: '115030',
        },
        {
          label: '115500 - Clavicle Fracture/Stress',
          value: '115500',
        },
        {
          label: '116100 - Clavicle A-C Inflammation',
          value: '116100',
        },
        {
          label: '116130 - Clavicle Periostitis',
          value: '116130',
        },
        {
          label: '116230 - Clavicle A-C Arthritis',
          value: '116230',
        },
        {
          label: '116235 - Clavicle S-C Arthritis',
          value: '116235',
        },
        {
          label: '116240 - Clavicle Exostosis',
          value: '116240',
        },
        {
          label: '116250 - Clavicle Calcification',
          value: '116250',
        },
        {
          label: '116371 - Clavicle Osteolysis',
          value: '116371',
        },
        {
          label: '128500 - Axilla Abscess',
          value: '128500',
        },
        {
          label: '130100 - Arm Abrasion',
          value: '130100',
        },
        {
          label: '130200 - Arm Soft Tissue Contusion',
          value: '130200',
        },
        {
          label: '130205 - Arm Humeral Bone Contusion - Distal 3rd',
          value: '130205',
        },
        {
          label: '130206 - Arm Humeral Bone Contusion - Middle 3rd',
          value: '130206',
        },
        {
          label: '130207 - Arm Humeral Bone Contusion - Proximal 3rd',
          value: '130207',
        },
        {
          label: '130300 - Arm Puncture Wound',
          value: '130300',
        },
        {
          label: '130400 - Arm Laceration',
          value: '130400',
        },
        {
          label: '130800 - Arm Vascular Injury',
          value: '130800',
        },
        {
          label:
            '131504 - Arm Musculocutaneous Nerve Injury With Motor And Sensory Loss - Laceration',
          value: '131504',
        },
        {
          label:
            '131505 - Arm Radial Nerve Injury With Motor And Sensory Loss - Compression',
          value: '131505',
        },
        {
          label:
            '131506 - Arm Radial Nerve Injury With Motor And Sensory Loss - Contusion',
          value: '131506',
        },
        {
          label:
            '131507 - Arm Radial Nerve Injury With Motor And Sensory Loss - Laceration',
          value: '131507',
        },
        {
          label:
            '131511 - Arm Median Nerve Injury With Sensory Loss - Compression',
          value: '131511',
        },
        {
          label:
            '131512 - Arm Median Nerve Injury With Sensory Loss - Contusion',
          value: '131512',
        },
        {
          label:
            '131513 - Arm Median Nerve Injury With Sensory Loss - Laceration',
          value: '131513',
        },
        {
          label:
            '131514 - Arm Musculocutaneous Nerve Injury With Sensory Loss - Compression',
          value: '131514',
        },
        {
          label:
            '131515 - Arm Musculocutaneous Nerve Injury With Sensory Loss - Contusion',
          value: '131515',
        },
        {
          label:
            '131516 - Arm Musculocutaneous Nerve Injury With Sensory Loss - Laceration',
          value: '131516',
        },
        {
          label:
            '131517 - Arm Radial Nerve Injury With Sensory Loss - Compression',
          value: '131517',
        },
        {
          label:
            '131518 - Arm Radial Nerve Injury With Sensory Loss - Contusion',
          value: '131518',
        },
        {
          label:
            '131519 - Arm Radial Nerve Injury With Sensory Loss - Laceration',
          value: '131519',
        },
        {
          label:
            '131520 - Arm Ulnar Nerve Injury With Sensory Loss - Compression',
          value: '131520',
        },
        {
          label:
            '131521 - Arm Ulnar Nerve Injury With Sensory Loss - Contusion',
          value: '131521',
        },
        {
          label:
            '131522 - Arm Ulnar Nerve Injury With Sensory Loss - Laceration',
          value: '131522',
        },
        {
          label:
            '131523 - Arm Median Nerve Injury With Motor Loss - Compression',
          value: '131523',
        },
        {
          label: '131524 - Arm Median Nerve Injury With Motor Loss - Contusion',
          value: '131524',
        },
        {
          label:
            '131525 - Arm Median Nerve Injury With Motor Loss - Laceration',
          value: '131525',
        },
        {
          label:
            '131526 - Arm Musculocutaneous Nerve Injury With Motor Loss - Compression',
          value: '131526',
        },
        {
          label:
            '131527 - Arm Musculocutaneous Nerve Injury With Motor Loss - Contusion',
          value: '131527',
        },
        {
          label:
            '131528 - Arm Musculocutaneous Nerve Injury With Motor Loss - Laceration',
          value: '131528',
        },
        {
          label:
            '131529 - Arm Radial Nerve Injury With Motor Loss - Compression',
          value: '131529',
        },
        {
          label: '131530 - Arm Radial Nerve Injury With Motor Loss - Contusion',
          value: '131530',
        },
        {
          label:
            '131531 - Arm Radial Nerve Injury With Motor Loss - Laceration',
          value: '131531',
        },
        {
          label:
            '131532 - Arm Ulnar Nerve Injury With Motor Loss - Compression',
          value: '131532',
        },
        {
          label: '131533 - Arm Ulnar Nerve Injury With Motor Loss - Contusion',
          value: '131533',
        },
        {
          label: '131534 - Arm Ulnar Nerve Injury With Motor Loss - Laceration',
          value: '131534',
        },
        {
          label:
            '131535 - Arm Median Nerve Injury With Motor And Sensory Loss - Compression',
          value: '131535',
        },
        {
          label:
            '131536 - Arm Median Nerve Injury With Motor And Sensory Loss - Contusion',
          value: '131536',
        },
        {
          label:
            '131537 - Arm Median Nerve Injury With Motor And Sensory Loss - Laceration',
          value: '131537',
        },
        {
          label:
            '131538 - Arm Musculocutaneous Nerve Injury With Motor And Sensory Loss - Compression',
          value: '131538',
        },
        {
          label:
            '131539 - Arm Musculocutaneous Nerve Injury With Motor And Sensory Loss - Contusion',
          value: '131539',
        },
        {
          label:
            '131544 - Arm Ulnar Nerve Injury With Motor And Sensory Loss - Compression',
          value: '131544',
        },
        {
          label:
            '131545 - Arm Ulnar Nerve Injury With Motor And Sensory Loss - Contusion',
          value: '131545',
        },
        {
          label:
            '131546 - Arm Ulnar Nerve Injury With Motor And Sensory Loss - Laceration',
          value: '131546',
        },
        {
          label: '131547 - Wrist Nerve Injury With Sensory Loss - Contusion',
          value: '131547',
        },
        {
          label: '131548 - Wrist Nerve Injury With Sensory Loss - Laceration',
          value: '131548',
        },
        {
          label:
            '131573 - Forearm Median Nerve Injury With Motor Loss - Compression',
          value: '131573',
        },
        {
          label:
            '131574 - Forearm Median Nerve Injury With Motor Loss - Contusion',
          value: '131574',
        },
        {
          label:
            '131575 - Forearm Median Nerve Injury With Motor Loss - Laceration',
          value: '131575',
        },
        {
          label:
            '131576 - Forearm Musculoskeletal Nerve Injury With Motor Loss - Compression',
          value: '131576',
        },
        {
          label:
            '131577 - Forearm Musculoskeletal Nerve Injury With Motor Loss - Contusion',
          value: '131577',
        },
        {
          label:
            '131578 - Forearm Musculoskeletal Nerve Injury With Motor Loss - Laceration',
          value: '131578',
        },
        {
          label:
            '131579 - Forearm Radial Nerve Injury With Motor Loss - Compression',
          value: '131579',
        },
        {
          label:
            '131580 - Forearm Radial Nerve Injury With Motor Loss - Contusion',
          value: '131580',
        },
        {
          label:
            '131581 - Forearm Radial Nerve Injury With Motor Loss - Laceration',
          value: '131581',
        },
        {
          label:
            '131582 - Forearm Ulnar Nerve Injury With Motor Loss - Compression',
          value: '131582',
        },
        {
          label:
            '131583 - Forearm Ulnar Nerve Injury With Motor Loss - Contusion',
          value: '131583',
        },
        {
          label:
            '131584 - Forearm Ulnar Nerve Injury With Motor Loss - Laceration',
          value: '131584',
        },
        {
          label:
            '131585 - Thumb Radial Digital Nerve Injury With Motor Loss - Compression: 2nd digit (index)',
          value: '131585',
        },
        {
          label:
            '131586 - Thumb Radial Digital Nerve Injury With Motor Loss - Contusion: 2nd digit (index)',
          value: '131586',
        },
        {
          label:
            '131587 - Thumb Radial Digital Nerve Injury With Motor Loss - Lacerations: 2nd digit (index)',
          value: '131587',
        },
        {
          label:
            '131588 - Thumb Ulnar Digital Nerve Injury With Motor Loss - Compressions: 2nd digit (index)',
          value: '131588',
        },
        {
          label:
            '131589 - Thumb Ulnar Digital Nerve Injury With Motor Loss - Contusions: 2nd digit (index)',
          value: '131589',
        },
        {
          label:
            '131590 - Thumb Ulnar Digital Nerve Injury With Motor Loss - Lacerations: 2nd digit (index)',
          value: '131590',
        },
        {
          label:
            '131591 - Wrist Nerve Injury With Motor Loss - Compression/Entrapment',
          value: '131591',
        },
        {
          label: '131592 - Wrist Nerve Injury With Motor Loss - Contusion',
          value: '131592',
        },
        {
          label: '131593 - Wrist Nerve Injury With Motor Loss - Laceration',
          value: '131593',
        },
        {
          label:
            '131620 - Forearm Median Nerve Injury With Motor And Sensory Loss - Compression',
          value: '131620',
        },
        {
          label:
            '131621 - Forearm Median Nerve Injury With Motor And Sensory Loss - Contusion',
          value: '131621',
        },
        {
          label:
            '131622 - Forearm Median Nerve Injury With Motor And Sensory Loss - Laceration',
          value: '131622',
        },
        {
          label:
            '131623 - Forearm Musculoskeletal Nerve Injury With Motor And Sensory Loss - Compression',
          value: '131623',
        },
        {
          label:
            '131624 - Forearm Musculoskeletal Nerve Injury With Motor And Sensory Loss - Contusion',
          value: '131624',
        },
        {
          label:
            '131625 - Forearm Musculoskeletal Nerve Injury With Motor And Sensory Loss - Laceration',
          value: '131625',
        },
        {
          label:
            '131626 - Forearm Radial Nerve Injury With Motor And Sensory Loss - Compression',
          value: '131626',
        },
        {
          label:
            '131627 - Forearm Radial Nerve Injury With Motor And Sensory Loss - Contusion',
          value: '131627',
        },
        {
          label:
            '131628 - Forearm Radial Nerve Injury With Motor And Sensory Loss - Laceration',
          value: '131628',
        },
        {
          label:
            '131629 - Forearm Ulnar Nerve Injury With Motor And Sensory Loss - Compression',
          value: '131629',
        },
        {
          label:
            '131630 - Forearm Ulnar Nerve Injury With Motor And Sensory Loss - Contusion',
          value: '131630',
        },
        {
          label:
            '131631 - Forearm Ulnar Nerve Injury With Motor And Sensory Loss - Laceration',
          value: '131631',
        },
        {
          label:
            '131632 - Thumb Radial Digital Nerve Injury With Motor And Sensory Loss - Compression: 2nd digit (index)',
          value: '131632',
        },
        {
          label:
            '131633 - Thumb Radial Digital Nerve Injury With Motor And Sensory Loss - Contusion: 2nd digit (index)',
          value: '131633',
        },
        {
          label:
            '131634 - Thumb Radial Digital Nerve Injury With Motor And Sensory Loss - Laceration: 2nd digit (index)',
          value: '131634',
        },
        {
          label:
            '131635 - Thumb Ulnar Digital Nerve Injury With Motor And Sensory Loss - Compression: 2nd digit (index)',
          value: '131635',
        },
        {
          label:
            '131636 - Thumb Ulnar Digital Nerve Injury With Motor And Sensory Loss - Contusion: 2nd digit (index)',
          value: '131636',
        },
        {
          label:
            '131637 - Thumb Ulnar Digital Nerve Injury With Motor And Sensory Loss - Laceration: 2nd digit (index)',
          value: '131637',
        },
        {
          label:
            '131638 - Wrist Nerve Injury With Motor And Sensory Loss - Compression/Entrapment',
          value: '131638',
        },
        {
          label:
            '131639 - Wrist Nerve Injury With Motor And Sensory Loss - Contusion',
          value: '131639',
        },
        {
          label:
            '131641 - Wrist Nerve Injury With Motor And Sensory Loss - Laceration',
          value: '131641',
        },
        {
          label: '132110 - Arm Burn 1 Deg',
          value: '132110',
        },
        {
          label: '132210 - Arm Burn 2 Deg',
          value: '132210',
        },
        {
          label: '132310 - Arm Burn 3 Deg',
          value: '132310',
        },
        {
          label: '132400 - Arm Friction Blister',
          value: '132400',
        },
        {
          label: '134010 - Arm Pectoralis Major Strain - Tendon (Insertional)',
          value: '134010',
        },
        {
          label: '134011 - Arm Pectoralis Major Strain - Muscle (Belly)',
          value: '134011',
        },
        {
          label: '134021 - Arm Coracobrachialis Strain - Muscle (Belly)',
          value: '134021',
        },
        {
          label: '134022 - Arm Coracobrachialis Strain - Tendon (Insertional)',
          value: '134022',
        },
        {
          label: '134031 - Arm Brachialis Strain - Muscle (Belly)',
          value: '134031',
        },
        {
          label: '134032 - Arm Brachialis Strain - Tendon (Insertional)',
          value: '134032',
        },
        {
          label: '134040 - Arm Latissimus Dorsi Strain/Tendon (Insertional)',
          value: '134040',
        },
        {
          label: '134041 - Arm Latissimus Dorsi Strain - Muscle (Belly)',
          value: '134041',
        },
        {
          label: '134050 - Arm Triceps Strain - Muscle (Belly)',
          value: '134050',
        },
        {
          label: '134051 - Arm Triceps Strain - Tendon (Insertional)',
          value: '134051',
        },
        {
          label: '134060 - Arm Biceps Strain - Muscle (Belly)',
          value: '134060',
        },
        {
          label: '134440 - Arm Triceps Tendon Insertional Rupture',
          value: '134440',
        },
        {
          label: '135010 - Arm Fracture/Humerus/Shaft',
          value: '135010',
        },
        {
          label: '135021 - Arm Humeral Head - Hill-Sachs Lesion',
          value: '135021',
        },
        {
          label: '135022 - Arm Fracture/Humerus Proximal - Greater Tubersity',
          value: '135022',
        },
        {
          label: '135023 - Arm Fracture/Humerus Proximal - Humeral Head',
          value: '135023',
        },
        {
          label: '135024 - Arm Fracture/Humerus Proximal - Lesser Tuberosity',
          value: '135024',
        },
        {
          label: '135025 - Arm Fracture/Humerus Proximal - Surgical Neck',
          value: '135025',
        },
        {
          label: '135910 - Arm Fracture/Distal Shaft',
          value: '135910',
        },
        {
          label: '136161 - Arm Biceps Tendonitis',
          value: '136161',
        },
        {
          label: '136250 - Arm Brachial Myositis Ossificans',
          value: '136250',
        },
        {
          label: '136270 - Arm Deltoid Myositis Ossificans',
          value: '136270',
        },
        {
          label: '138500 - Arm Abscess',
          value: '138500',
        },
        {
          label: '138600 - Arm Infection',
          value: '138600',
        },
        {
          label: '138601 - Arm Staph Infection - MRSA',
          value: '138601',
        },
        {
          label: '138602 - Arm Staph Infection - MSSA',
          value: '138602',
        },
        {
          label: '140100 - Elbow Abrasion',
          value: '140100',
        },
        {
          label: '140200 - Elbow Contusion',
          value: '140200',
        },
        {
          label: '140220 - Elbow Epicondyle Contusion/Lateral',
          value: '140220',
        },
        {
          label: '140230 - Elbow Epicondyle Contusion/Medial',
          value: '140230',
        },
        {
          label: '140300 - Elbow Puncture Wound',
          value: '140300',
        },
        {
          label: '140400 - Elbow Laceration',
          value: '140400',
        },
        {
          label: '140510 - Elbow Olecranon Bursitis',
          value: '140510',
        },
        {
          label: '140600 - Elbow Tenosynovitis-Tendinitis/Acute',
          value: '140600',
        },
        {
          label: '140650 - Elbow Triceps Tendinitis/Acute',
          value: '140650',
        },
        {
          label: '140660 - Elbow Biceps Tendinitis/Acute',
          value: '140660',
        },
        {
          label: '140700 - Elbow Synovitis-Capsulitis/Acute',
          value: '140700',
        },
        {
          label: '140800 - Elbow Vascular Trauma',
          value: '140800',
        },
        {
          label: '141000 - Elbow Neurotrauma',
          value: '141000',
        },
        {
          label: '141500 - Elbow Nerve Contusion',
          value: '141500',
        },
        {
          label: '141540 - Elbow Radial Nerve Contusion',
          value: '141540',
        },
        {
          label: '141550 - Elbow Ulnar Nerve Contusion',
          value: '141550',
        },
        {
          label: '141611 - Elbow Ulnar Nerve Entrapment w/Sensory Loss',
          value: '141611',
        },
        {
          label: '141621 - Elbow Ulnar Nerve Entrapment w/Motor Loss',
          value: '141621',
        },
        {
          label: '141631 - Elbow Ulnar Nerve Entrapment w/S&M Loss',
          value: '141631',
        },
        {
          label: '141700 - Elbow Nerve Laceration',
          value: '141700',
        },
        {
          label: '141701 - Elbow Nerve Laceration w/Sensory Loss',
          value: '141701',
        },
        {
          label: '141702 - Elbow Nerve Laceration w/Motor Loss',
          value: '141702',
        },
        {
          label: '141703 - Elbow Nerve Laceration w/S&M Loss',
          value: '141703',
        },
        {
          label: '141800 - Elbow Nerve Dislocation',
          value: '141800',
        },
        {
          label: '142400 - Elbow Friction Blister',
          value: '142400',
        },
        {
          label: '142401 - Elbow Burn 1 Deg',
          value: '142401',
        },
        {
          label: '142402 - Elbow Burn 2 Deg',
          value: '142402',
        },
        {
          label: '142403 - Elbow Burn 3 Deg',
          value: '142403',
        },
        {
          label: '143000 - Elbow Sprain',
          value: '143000',
        },
        {
          label: '143101 - Elbow Sprain/Medial 1 Deg',
          value: '143101',
        },
        {
          label: '143102 - Elbow Sprain/Lateral 1 Deg',
          value: '143102',
        },
        {
          label: '143110 - Elbow Hyperextension Sprain 1 Deg',
          value: '143110',
        },
        {
          label: '143201 - Elbow Sprain/Medial 2 Deg',
          value: '143201',
        },
        {
          label: '143202 - Elbow Sprain/Lateral 2 Deg',
          value: '143202',
        },
        {
          label: '143210 - Elbow Hyperextension Sprain 2 Deg',
          value: '143210',
        },
        {
          label: '143301 - Elbow Sprain/Medial 3 Deg',
          value: '143301',
        },
        {
          label: '143302 - Elbow Sprain/Lateral 3 Deg',
          value: '143302',
        },
        {
          label: '143310 - Elbow Hyperextension Sprain 3 Deg',
          value: '143310',
        },
        {
          label: '143410 - Elbow Subluxation/Posterior',
          value: '143410',
        },
        {
          label: '143600 - Elbow Dislocation',
          value: '143600',
        },
        {
          label: '143610 - Elbow Dislocation/Anterior',
          value: '143610',
        },
        {
          label: '143620 - Elbow Dislocation/Posterior',
          value: '143620',
        },
        {
          label: '143630 - Elbow Dislocation/Radial Head',
          value: '143630',
        },
        {
          label: '143800 - Elbow Dislocation/Open',
          value: '143800',
        },
        {
          label: '144110 - Elbow Hyperextension Strain 1 Deg',
          value: '144110',
        },
        {
          label: '144150 - Elbow Triceps Strain/Distal 1 Deg',
          value: '144150',
        },
        {
          label: '144160 - Elbow Biceps Strain/Distal 1 Deg',
          value: '144160',
        },
        {
          label: '144210 - Elbow Hyperextension Strain 2 Deg',
          value: '144210',
        },
        {
          label: '144250 - Elbow Triceps Strain/Distal 2 Deg',
          value: '144250',
        },
        {
          label: '144260 - Elbow Biceps Strain/Distal 2 Deg',
          value: '144260',
        },
        {
          label: '144310 - Elbow Hyperextension Strain 3 Deg',
          value: '144310',
        },
        {
          label: '144350 - Elbow Triceps Strain/Distal 3 Deg (Complete Tear)',
          value: '144350',
        },
        {
          label: '144360 - Elbow Biceps Strain/Distal 3 Deg (Complete Tear)',
          value: '144360',
        },
        {
          label: '144440 - Elbow Biceps Tendon Avulsion',
          value: '144440',
        },
        {
          label: '144450 - Elbow Triceps Tendon Avulsion',
          value: '144450',
        },
        {
          label: '144520 - Elbow Tendon Severance',
          value: '144520',
        },
        {
          label: '144550 - Elbow Triceps Tendon Severance',
          value: '144550',
        },
        {
          label: '145000 - Elbow Fracture/Non-specific',
          value: '145000',
        },
        {
          label: '145010 - Elbow Fracture/Humeral/Condylar',
          value: '145010',
        },
        {
          label: '145020 - Elbow Fracture/Humerus/Lateral Epicondyle',
          value: '145020',
        },
        {
          label: '145030 - Elbow Fracture/Humerus/Medial Epicondyle',
          value: '145030',
        },
        {
          label: '145040 - Elbow Fracture/Humerus/Supracondylar',
          value: '145040',
        },
        {
          label: '145050 - Elbow Fracture/Radial Head/Neck',
          value: '145050',
        },
        {
          label: '145060 - Elbow Fracture/Olecranon',
          value: '145060',
        },
        {
          label: '145061 - Elbow Fracture/Olecrenon Chip',
          value: '145061',
        },
        {
          label: '145070 - Elbow Fracture/Coronoid Process',
          value: '145070',
        },
        {
          label: '145120 - Elbow Fracture/Humerus',
          value: '145120',
        },
        {
          label: '145210 - Elbow Fracture/Humeral/Condyle/Avulsion',
          value: '145210',
        },
        {
          label: '145220 - Elbow Fracture/Humerus/Lateral Epicondyle/Avulsion',
          value: '145220',
        },
        {
          label: '145230 - Elbow Fracture/Humerus/Medial Epicondyle/Avulsion',
          value: '145230',
        },
        {
          label: '145250 - Elbow Fracture/Radial Head/Neck/Avulsion',
          value: '145250',
        },
        {
          label: '145260 - Elbow Fracture/Olecranon/Avulsion',
          value: '145260',
        },
        {
          label: '145300 - Elbow Fracture/Dislocation',
          value: '145300',
        },
        {
          label: '145350 - Elbow Fracture/Radial Head/Neck/Dislocation',
          value: '145350',
        },
        {
          label: '145360 - Elbow Fracture/Olecranon/Dislocation',
          value: '145360',
        },
        {
          label: '145430 - Elbow Fracture/Humerus/Epiphyseal',
          value: '145430',
        },
        {
          label: '145850 - Elbow Fracture/Radial Head/Neck/Comminuted',
          value: '145850',
        },
        {
          label: '145860 - Elbow Fracture/Olecranon/Open',
          value: '145860',
        },
        {
          label: '145900 - Elbow Fracture/Other',
          value: '145900',
        },
        {
          label: '145950 - Elbow Fracture/Radial Head/Neck/Other',
          value: '145950',
        },
        {
          label: '145960 - Elbow Fracture/Olecranon/Other',
          value: '145960',
        },
        {
          label: '146100 - Elbow Inflammation',
          value: '146100',
        },
        {
          label: '146110 - Elbow Epiphysitis',
          value: '146110',
        },
        {
          label: '146140 - Elbow Spondylitis',
          value: '146140',
        },
        {
          label: '146150 - Elbow Humerus Epicondylitis',
          value: '146150',
        },
        {
          label: '146151 - Elbow Humerus Epicondylitis/Lateral',
          value: '146151',
        },
        {
          label: '146152 - Elbow Humerus Epicondylitis/Medial',
          value: '146152',
        },
        {
          label: '146170 - Elbow Synovitis/Capsulitis',
          value: '146170',
        },
        {
          label: '146200 - Elbow Complication',
          value: '146200',
        },
        {
          label: '146210 - Elbow Osteochondritis Dissecans',
          value: '146210',
        },
        {
          label: '146220 - Elbow Chondromalacia',
          value: '146220',
        },
        {
          label: '146230 - Elbow Osteoarthritis',
          value: '146230',
        },
        {
          label: '146250 - Elbow Calcification',
          value: '146250',
        },
        {
          label: '146410 - Elbow Joint Loose Bodies',
          value: '146410',
        },
        {
          label: '146472 - Elbow Impingement - Anterior',
          value: '146472',
        },
        {
          label: '146473 - Elbow Impingement - Posterior',
          value: '146473',
        },
        {
          label: '148500 - Elbow Abscess',
          value: '148500',
        },
        {
          label: '148620 - Elbow Cellulitis',
          value: '148620',
        },
        {
          label: '148700 - Elbow Infection',
          value: '148700',
        },
        {
          label: '148753 - Elbow Joint Staph Infection - MRSA',
          value: '148753',
        },
        {
          label: '148754 - Elbow Joint Staph Infection - MSSA',
          value: '148754',
        },
        {
          label: '148755 - Elbow External Skin Staph Infection - MRSA',
          value: '148755',
        },
        {
          label: '148756 - Elbow External Skin Staph Infection - MSSA',
          value: '148756',
        },
        {
          label: '150100 - Forearm Abrasion',
          value: '150100',
        },
        {
          label: '150200 - Forearm Soft Tissue Contusion',
          value: '150200',
        },
        {
          label: '150211 - Forearm Radius Bone Contusion - Distal 3rd',
          value: '150211',
        },
        {
          label: '150212 - Forearm Radius Bone Contusion - Middle 3rd',
          value: '150212',
        },
        {
          label: '150213 - Forearm Radius Bone Contusion - Proximal 3rd',
          value: '150213',
        },
        {
          label: '150221 - Forearm Ulna Bone Contusion - Middle 3rd',
          value: '150221',
        },
        {
          label: '150222 - Forearm Ulna Bone Contusion - Distal 3rd',
          value: '150222',
        },
        {
          label: '150223 - Forearm Ulna Bone Contusion - Proximal 3rd',
          value: '150223',
        },
        {
          label: '150300 - Forearm Puncture Wound',
          value: '150300',
        },
        {
          label: '150400 - Forearm Laceration',
          value: '150400',
        },
        {
          label: '150800 - Forearm Vascular Injury',
          value: '150800',
        },
        {
          label: '150810 - Forearm Compartment Syndrome',
          value: '150810',
        },
        {
          label: '150900 - Forearm Muscle Cramps',
          value: '150900',
        },
        {
          label:
            '151528 - Forearm Median Nerve Injury With Sensory Loss - Compression',
          value: '151528',
        },
        {
          label:
            '151529 - Forearm Median Nerve Injury With Sensory Loss - Contusion',
          value: '151529',
        },
        {
          label:
            '151530 - Forearm Median Nerve Injury With Sensory Loss - Laceration',
          value: '151530',
        },
        {
          label:
            '151531 - Forearm Musculoskeletal Nerve Injury With Sensory Loss - Compression',
          value: '151531',
        },
        {
          label:
            '151532 - Forearm Musculoskeletal Nerve Injury With Sensory Loss - Contusion',
          value: '151532',
        },
        {
          label:
            '151533 - Forearm Musculoskeletal Nerve Injury With Sensory Loss - Laceration',
          value: '151533',
        },
        {
          label:
            '151534 - Forearm Radial Nerve Injury With Sensory Loss - Compression',
          value: '151534',
        },
        {
          label:
            '151535 - Forearm Radial Nerve Injury With Sensory Loss - Contusion',
          value: '151535',
        },
        {
          label:
            '151536 - Forearm Radial Nerve Injury With Sensory Loss - Laceration',
          value: '151536',
        },
        {
          label:
            '151537 - Forearm Ulnar Nerve Injury With Sensory Loss - Compression',
          value: '151537',
        },
        {
          label:
            '151538 - Forearm Ulnar Nerve Injury With Sensory Loss - Contusion',
          value: '151538',
        },
        {
          label:
            '151539 - Forearm Ulnar Nerve Injury With Sensory Loss - Laceration',
          value: '151539',
        },
        {
          label: '152110 - Forearm Burn 1 Deg',
          value: '152110',
        },
        {
          label: '152210 - Forearm Burn 2 Deg',
          value: '152210',
        },
        {
          label: '152310 - Forearm Burn 3 Deg',
          value: '152310',
        },
        {
          label: '154010 - Forearm Flexor Muscle Strain',
          value: '154010',
        },
        {
          label: '154020 - Forearm Extensor Muscle Strain',
          value: '154020',
        },
        {
          label: '154090 - Forearm Rotators Muscle Strain',
          value: '154090',
        },
        {
          label:
            '154515 - Forearm Muscle Laceration - Extensor/Supinator Compartment',
          value: '154515',
        },
        {
          label:
            '154516 - Forearm Muscle Laceration - Flexor/Pronator Compartment',
          value: '154516',
        },
        {
          label: '154520 - Forearm Muscle Rupture',
          value: '154520',
        },
        {
          label: '155011 - Forearm Fracture/Radius/Shaft/Proximal 3rd',
          value: '155011',
        },
        {
          label: '155012 - Forearm Fracture/Radius/Shaft/Middle 3rd',
          value: '155012',
        },
        {
          label: '155013 - Forearm Fracture/Radius/Shaft/Distal 3rd',
          value: '155013',
        },
        {
          label: '155021 - Forearm Fracture/Ulna/Proximal 3rd/Extra-articular',
          value: '155021',
        },
        {
          label: '155022 - Forearm Fracture/Ulna/Middle 3rd',
          value: '155022',
        },
        {
          label: '155023 - Forearm Fracture/Ulna/Distal 3rd/Extra-articular',
          value: '155023',
        },
        {
          label: '155024 - Forearm Fracture/Ulna/Distal Styloid',
          value: '155024',
        },
        {
          label: '155025 - Forearm Fracture/Ulna/Shaft/Closed - Distal 3rd',
          value: '155025',
        },
        {
          label: '155026 - Forearm Fracture/Ulna/Shaft/Closed - Middle 3rd',
          value: '155026',
        },
        {
          label: '155027 - Forearm Fracture/Ulna/Shaft/Closed - Proximal 3rd',
          value: '155027',
        },
        {
          label: '155111 - Forearm Fracture/Radius/open/Proximal 3rd',
          value: '155111',
        },
        {
          label: '155112 - Forearm Fracture/Radius/Open/Middle 3rd',
          value: '155112',
        },
        {
          label: '155113 - Forearm Fracture/Radius/Open/Distal 3rd',
          value: '155113',
        },
        {
          label: '155114 - Forearm Fracture/Radius/Shaft/Closed - Distal 3rd',
          value: '155114',
        },
        {
          label: '155115 - Forearm Fracture/Radius/Shaft/Closed - Middle 3rd',
          value: '155115',
        },
        {
          label: '155116 - Forearm Fracture/Radius/Shaft/Closed - Proximal 3rd',
          value: '155116',
        },
        {
          label: '155117 - Forearm Fracture/Radius/Shaft/Open - Distal 3rd',
          value: '155117',
        },
        {
          label: '155118 - Forearm Fracture/Radius/Shaft/Open - Middle 3rd',
          value: '155118',
        },
        {
          label: '155119 - Forearm Fracture/Radius/Shaft/Open - Proximal 3rd',
          value: '155119',
        },
        {
          label: '155121 - Forearm Fracture/Ulna/Open/Proximal 3rd',
          value: '155121',
        },
        {
          label: '155122 - Forearm Fracture/Ulna/Open/Middle 3rd',
          value: '155122',
        },
        {
          label: '155123 - Forearm Fracture/Ulna/Open/Distal 3rd',
          value: '155123',
        },
        {
          label: '155124 - Forearm Fracture/Ulna/Shaft/Open - Distal 3rd',
          value: '155124',
        },
        {
          label: '155125 - Forearm Fracture/Ulna/Shaft/Open - Middle 3rd',
          value: '155125',
        },
        {
          label: '155126 - Forearm Fracture/Ulna/Shaft/Open - Proximal 3rd',
          value: '155126',
        },
        {
          label: '155213 - Forearm Fracture/Radius/Distal Styloid',
          value: '155213',
        },
        {
          label: '155501 - Forearm Fracture/Stress - Distal 3rd',
          value: '155501',
        },
        {
          label: '155502 - Forearm Fracture/Stress - Middle 3rd',
          value: '155502',
        },
        {
          label: '155503 - Forearm Fracture/Stress - Proximal 3rd',
          value: '155503',
        },
        {
          label: '155512 - Forearm Fracture/Radius/Stress/Middle 3rd',
          value: '155512',
        },
        {
          label: '155513 - Forearm Fracture/Radius/Stress/Distal 3rd',
          value: '155513',
        },
        {
          label:
            '155514 - Forearm Fracture/Radius/Stress/Proximal 3rd - Radius',
          value: '155514',
        },
        {
          label: '155515 - Forearm Fracture/Radius/Stress/Proximal 3rd - Ulna',
          value: '155515',
        },
        {
          label: '155521 - Forearm Fracture/Ulna/Stress/Proximal 3rd',
          value: '155521',
        },
        {
          label: '155522 - Forearm Fracture/Ulna/Stress/Middle 3rd',
          value: '155522',
        },
        {
          label: '155523 - Forearm Fracture/Ulna/Stress/Distal 3rd',
          value: '155523',
        },
        {
          label: '155811 - Forearm Fracture/Radius/Radial Head Intra-articular',
          value: '155811',
        },
        {
          label: '155813 - Forearm Fracture/Radius/Distal/Intra-articular',
          value: '155813',
        },
        {
          label: '155821 - Forearm Fracture/Ulna/Proximal/Intra-articular',
          value: '155821',
        },
        {
          label: '155823 - Forearm Fracture/Ulna/Distal/Intra-articular',
          value: '155823',
        },
        {
          label: '156100 - Forearm Cellulitis',
          value: '156100',
        },
        {
          label: '156162 - Forearm Extensor Tendonosis',
          value: '156162',
        },
        {
          label: '156163 - Forearm Tendinitis - Extensor/Supinator Compartment',
          value: '156163',
        },
        {
          label: '156164 - Forearm Tendinitis - Flexor/Pronator Compartment',
          value: '156164',
        },
        {
          label:
            '156190 - Forearm Extensor Origin Tendinosis - Lateral Epicondylitis',
          value: '156190',
        },
        {
          label:
            '156191 - Forearm Flexor/Pronator Origin Tendinosis - Medial Epicondylitis',
          value: '156191',
        },
        {
          label: '158500 - Forearm Abscess',
          value: '158500',
        },
        {
          label: '158700 - Forearm Infection',
          value: '158700',
        },
        {
          label: '158751 - Forearm Staph Infection - MRSA',
          value: '158751',
        },
        {
          label: '158752 - Forearm Staph Infection - MSSA',
          value: '158752',
        },
        {
          label: '160010 - Wrist TFCC (Triangular Fibrocartilage Complex) Tear',
          value: '160010',
        },
        {
          label: '160100 - Wrist Abrasion',
          value: '160100',
        },
        {
          label: '160200 - Wrist Soft Tissue Contusion',
          value: '160200',
        },
        {
          label: '160221 - Wrist Ganglion - Dorsal',
          value: '160221',
        },
        {
          label: '160222 - Wrist Ganglion - Volar',
          value: '160222',
        },
        {
          label: '160300 - Wrist Puncture',
          value: '160300',
        },
        {
          label: '160301 - Wrist Puncture Wound - Dorsal',
          value: '160301',
        },
        {
          label: '160302 - Wrist Puncture Wound - Volar',
          value: '160302',
        },
        {
          label: '160401 - Wrist Laceration - Dorsal',
          value: '160401',
        },
        {
          label: '160402 - Wrist Laceration - Volar',
          value: '160402',
        },
        {
          label: '160610 - Wrist Tenosynovitis-Tendinitis Flexor',
          value: '160610',
        },
        {
          label: '160620 - Wrist Tenosynovitis-Tendinitis Extensor',
          value: '160620',
        },
        {
          label:
            '160701 - Wrist Synovitis - Metabolic (eg: gout, rheumatoid arthritis, pseudogout)',
          value: '160701',
        },
        {
          label: '160702 - Wrist Synovitis - Traumatic',
          value: '160702',
        },
        {
          label: '160800 - Wrist Dorsal Rim Impaction Syndrome (DRIS)',
          value: '160800',
        },
        {
          label:
            '161546 - Wrist Nerve Injury With Sensory Loss - Compression/Entrapment',
          value: '161546',
        },
        {
          label: '161610 - Wrist Nerve Disorder w/Sensory Loss',
          value: '161610',
        },
        {
          label: '161611 - Wrist Ulnar Nerve Entrapment w/Sensory Loss',
          value: '161611',
        },
        {
          label: '161612 - Wrist Ulnar Nerve Injury w/Sensory Loss',
          value: '161612',
        },
        {
          label: '161613 - Wrist Median Nerve Injury w/Sensory Loss',
          value: '161613',
        },
        {
          label: '161620 - Wrist Nerve Injury with Sensory and Motor Loss',
          value: '161620',
        },
        {
          label: '161621 - Wrist Ulnar Nerve Entrapment w/Motor Loss',
          value: '161621',
        },
        {
          label: '161622 - Wrist Ulnar Nerve Injury with Sensory & Motor Loss',
          value: '161622',
        },
        {
          label: '161623 - Wrist Median Nerve Injury with Sensory & Motor Loss',
          value: '161623',
        },
        {
          label: '161630 - Wrist Nerve Disorder w/S&M Loss',
          value: '161630',
        },
        {
          label: '161631 - Wrist Ulnar Nerve Entrapment w/S&M Loss',
          value: '161631',
        },
        {
          label: '162100 - Wrist Burn 1 Deg',
          value: '162100',
        },
        {
          label: '162201 - Wrist Burn 2 Deg',
          value: '162201',
        },
        {
          label: '162300 - Wrist Burn 3 Deg',
          value: '162300',
        },
        {
          label: '163000 - Wrist Sprain',
          value: '163000',
        },
        {
          label: '163003 - Wrist Medial Sprain - Radiocarpal',
          value: '163003',
        },
        {
          label:
            '163004 - Wrist Medial Sprain - DRUJ (Distal Radioulnar Joint)',
          value: '163004',
        },
        {
          label: '163060 - Wrist DRUJ (Distal Radioulnar Joint) Sprain',
          value: '163060',
        },
        {
          label: '163430 - Wrist Subluxation/Carpometacarpal',
          value: '163430',
        },
        {
          label: '163460 - Wrist Subluxation/Radioulnar Distal',
          value: '163460',
        },
        {
          label:
            '163461 - Wrist DRUJ (Distal Radioulnar Joint) Instability - Dorsal',
          value: '163461',
        },
        {
          label:
            '163462 - Wrist DRUJ (Distal Radioulnar Joint) Instability - Volar',
          value: '163462',
        },
        {
          label: '163601 - Wrist Dislocation - Carpal',
          value: '163601',
        },
        {
          label: '163602 - Wrist Dislocation - Carpometacarpal',
          value: '163602',
        },
        {
          label: '163603 - Wrist Dislocation - Radiocarpal',
          value: '163603',
        },
        {
          label:
            '163641 - Wrist Scapholunate Interosseous Ligament Tear/Dissociation',
          value: '163641',
        },
        {
          label: '163650 - Wrist Perilunate Injury/Dislocation',
          value: '163650',
        },
        {
          label: '163661 - Wrist Perilunate Fracture Dislocation/Injury',
          value: '163661',
        },
        {
          label: '164500 - Wrist Tendon Rupture',
          value: '164500',
        },
        {
          label: '164501 - Wrist Tendon Rupture - Extensor',
          value: '164501',
        },
        {
          label: '164502 - Wrist Tendon Rupture - Flexor',
          value: '164502',
        },
        {
          label: '164601 - Wrist Tendon Acute Subluxation - Extensor',
          value: '164601',
        },
        {
          label: '164602 - Wrist Tendon Acute Subluxation - Flexor',
          value: '164602',
        },
        {
          label: '164701 - Wrist Tendon Recurrent Subluxation - Extensor',
          value: '164701',
        },
        {
          label: '164702 - Wrist Tendon Recurrent Subluxation - Flexor',
          value: '164702',
        },
        {
          label:
            '165020 - Wrist Fracture Distal Radius/Intra-articular (Closed)',
          value: '165020',
        },
        {
          label: '165030 - Wrist Fracture/Pisiform',
          value: '165030',
        },
        {
          label: '165040 - Wrist Fracture/Capitate',
          value: '165040',
        },
        {
          label: '165050 - Wrist Fracture/Triquetrium',
          value: '165050',
        },
        {
          label: '165060 - Wrist Fracture/Trapezium',
          value: '165060',
        },
        {
          label: '165070 - Wrist Fracture/Lunate',
          value: '165070',
        },
        {
          label: '165080 - Wrist Fracture/Trapezoid',
          value: '165080',
        },
        {
          label: '165120 - Wrist Fracture Distal Radius/Intra-articular (Open)',
          value: '165120',
        },
        {
          label: '165130 - Wrist Fracture Distal Ulna/Intra-articular (Open)',
          value: '165130',
        },
        {
          label: '165250 - Wrist Fracture/Triquetrium/Avulsion',
          value: '165250',
        },
        {
          label: '165311 - Wrist Fracture/Navicular (Scaphoid) - Distal Pole',
          value: '165311',
        },
        {
          label: '165312 - Wrist Fracture/Navicular (Scaphoid) - Proximal Pole',
          value: '165312',
        },
        {
          label: '165313 - Wrist Fracture/Navicular (Scaphoid) - Waist',
          value: '165313',
        },
        {
          label:
            '165314 - Wrist Fracture/Navicular/Non-Union (Scaphoid) - Distal Pole',
          value: '165314',
        },
        {
          label:
            '165315 - Wrist Fracture/Navicular/Non-Union (Scaphoid) - Proximal Pole',
          value: '165315',
        },
        {
          label:
            '165316 - Wrist Fracture/Navicular/Non-Union (Scaphoid) - Waist',
          value: '165316',
        },
        {
          label: '165570 - Lunate Avascular Necrosis (Kienbocks Disease)',
          value: '165570',
        },
        {
          label: '165951 - Wrist Fracture - Body of Hammate',
          value: '165951',
        },
        {
          label: '165952 - Wrist Fracture - Hook of Hammate',
          value: '165952',
        },
        {
          label: '166120 - Wrist Contracture/Stiffness',
          value: '166120',
        },
        {
          label: "166161 - Wrist De Quervain's Syndrome",
          value: '166161',
        },
        {
          label: '166162 - Wrist Carpal Tunnel Syndrome',
          value: '166162',
        },
        {
          label: '166201 - Wrist Navicular (Scaphoid) Avascular Necrosis',
          value: '166201',
        },
        {
          label: '166461 - Wrist Arthritis - Carpal',
          value: '166461',
        },
        {
          label: '166462 - Wrist Arthritis - Carpometacarpal',
          value: '166462',
        },
        {
          label: '166463 - Wrist Arthritis - DRUJ (Distal Radioulnar Joint)',
          value: '166463',
        },
        {
          label: '166464 - Wrist Arthritis - Radiocarpal',
          value: '166464',
        },
        {
          label: '168600 - Wrist Infection',
          value: '168600',
        },
        {
          label: '168620 - Wrist Cellulitis',
          value: '168620',
        },
        {
          label: '168623 - Wrist Joint Staph Infection - MRSA',
          value: '168623',
        },
        {
          label: '168624 - Wrist Joint Staph Infection - MSSA',
          value: '168624',
        },
        {
          label: '168625 - Wrist External Skin Staph Infection - MRSA',
          value: '168625',
        },
        {
          label: '168626 - Wrist External Skin Staph Infection - MSSA',
          value: '168626',
        },
        {
          label: '170100 - Hand Abrasion',
          value: '170100',
        },
        {
          label: '170200 - Hand Soft Tissue Contusion',
          value: '170200',
        },
        {
          label: '170231 - Hand Bone Contusion - Metacarpal - 1st',
          value: '170231',
        },
        {
          label: '170232 - Hand Bone Contusion - Metacarpal - 2nd',
          value: '170232',
        },
        {
          label: '170233 - Hand Bone Contusion - Metacarpal - 3rd',
          value: '170233',
        },
        {
          label: '170234 - Hand Bone Contusion - Metacarpal - 4th',
          value: '170234',
        },
        {
          label: '170235 - Hand Bone Contusion - Metacarpal - 5th',
          value: '170235',
        },
        {
          label: '170310 - Hand Puncture Wound',
          value: '170310',
        },
        {
          label: '170401 - Hand Laceration - Dorsal',
          value: '170401',
        },
        {
          label: '170402 - Hand Laceration - Volar',
          value: '170402',
        },
        {
          label: '170601 - Hand Tenosynovitis-Tendinitis - Extensor',
          value: '170601',
        },
        {
          label: '170602 - Hand Tenosynovitis-Tendinitis - Flexor',
          value: '170602',
        },
        {
          label: '170801 - Hand Hematoma - Dorsal',
          value: '170801',
        },
        {
          label: '170802 - Hand Hematoma - Volar',
          value: '170802',
        },
        {
          label: '172110 - Hand Burn 1 Deg',
          value: '172110',
        },
        {
          label: '172201 - Hand Burn 2 Deg',
          value: '172201',
        },
        {
          label: '172300 - Hand Burn 3 Deg',
          value: '172300',
        },
        {
          label: '172400 - Hand Friction Blister',
          value: '172400',
        },
        {
          label: '173010 - Hand M-P Joint Sprain',
          value: '173010',
        },
        {
          label: '173011 - Hand 1st M-P Joint Sprain',
          value: '173011',
        },
        {
          label: '173012 - Hand 2nd M-P Joint Sprain',
          value: '173012',
        },
        {
          label: '173013 - Hand 3rd M-P Joint Sprain',
          value: '173013',
        },
        {
          label: '173014 - Hand 4th M-P Joint Sprain',
          value: '173014',
        },
        {
          label: '173015 - Hand 5th M-P Joint Sprain',
          value: '173015',
        },
        {
          label: '174000 - Hand Muscle Strain',
          value: '174000',
        },
        {
          label: '174501 - Hand Tendon Laceration - Extensor',
          value: '174501',
        },
        {
          label: '174502 - Hand Tendon Laceration - Flexor',
          value: '174502',
        },
        {
          label: '174510 - Hand Tendon Rupture',
          value: '174510',
        },
        {
          label: '174701 - Hand Tendon Recurrent Subluxation - Extensor',
          value: '174701',
        },
        {
          label: '174702 - Hand Tendon Recurrent Subluxation - Flexor',
          value: '174702',
        },
        {
          label: '175006 - Hand 1st Metacarpal Fracture/Base/Closed',
          value: '175006',
        },
        {
          label: '175007 - Hand 1st Metacarpal Fracture/Base/Open',
          value: '175007',
        },
        {
          label: '175008 - Hand 1st Metacarpal Fracture/Neck/Closed',
          value: '175008',
        },
        {
          label: '175009 - Hand 1st Metacarpal Fracture/Neck/Open',
          value: '175009',
        },
        {
          label: '175011 - Hand 1st Metacarpal Fracture/Shaft/Closed',
          value: '175011',
        },
        {
          label: '175012 - Hand 1st Metacarpal Fracture/Shaft/Open',
          value: '175012',
        },
        {
          label: '175013 - Hand 2nd Metacarpal Fracture/Base/Closed',
          value: '175013',
        },
        {
          label: '175014 - Hand 2nd Metacarpal Fracture/Base/Open',
          value: '175014',
        },
        {
          label: '175015 - Hand 2nd Metacarpal Fracture/Neck/Closed',
          value: '175015',
        },
        {
          label: '175016 - Hand 2nd Metacarpal Fracture/Neck/Open',
          value: '175016',
        },
        {
          label: '175017 - Hand 2nd Metacarpal Fracture/Shaft/Closed',
          value: '175017',
        },
        {
          label: '175018 - Hand 2nd Metacarpal Fracture/Shaft/Open',
          value: '175018',
        },
        {
          label: '175019 - Hand 3rd Metacarpal Fracture/Base/Closed',
          value: '175019',
        },
        {
          label: '175021 - Hand 3rd Metacarpal Fracture/Base/Open',
          value: '175021',
        },
        {
          label: '175022 - Hand 3rd Metacarpal Fracture/Neck/Closed',
          value: '175022',
        },
        {
          label: '175023 - Hand 3rd Metacarpal Fracture/Neck/Open',
          value: '175023',
        },
        {
          label: '175024 - Hand 3rd Metacarpal Fracture/Shaft/Closed',
          value: '175024',
        },
        {
          label: '175025 - Hand 3rd Metacarpal Fracture/Shaft/Open',
          value: '175025',
        },
        {
          label: '175026 - Hand 4th Metacarpal Fracture/Base/Closed',
          value: '175026',
        },
        {
          label: '175027 - Hand 4th Metacarpal Fracture/Base/Open',
          value: '175027',
        },
        {
          label: '175028 - Hand 4th Metacarpal Fracture/Neck/Closed',
          value: '175028',
        },
        {
          label: '175029 - Hand 4th Metacarpal Fracture/Neck/Open',
          value: '175029',
        },
        {
          label: '175031 - Hand 4th Metacarpal Fracture/Shaft/Closed',
          value: '175031',
        },
        {
          label: '175032 - Hand 4th Metacarpal Fracture/Shaft/Open',
          value: '175032',
        },
        {
          label: '175033 - Hand 5th Metacarpal Fracture/Base/Closed',
          value: '175033',
        },
        {
          label: '175034 - Hand 5th Metacarpal Fracture/Base/Open',
          value: '175034',
        },
        {
          label: '175035 - Hand 5th Metacarpal Fracture/Neck/Closed',
          value: '175035',
        },
        {
          label: '175036 - Hand 5th Metacarpal Fracture/Neck/Open',
          value: '175036',
        },
        {
          label: '175037 - Hand 5th Metacarpal Fracture/Shaft/Closed',
          value: '175037',
        },
        {
          label: '175038 - Hand 5th Metacarpal Fracture/Shaft/Open',
          value: '175038',
        },
        {
          label:
            '175801 - Hand Metacarpal Fracture/Head/Intra-Articular - 1st digit (thumb)',
          value: '175801',
        },
        {
          label:
            '175802 - Hand Metacarpal Fracture/Head/Intra-Articular - 2nd digit (index)',
          value: '175802',
        },
        {
          label:
            '175803 - Hand Metacarpal Fracture/Head/Intra-Articular - 3rd digit (middle)',
          value: '175803',
        },
        {
          label:
            '175804 - Hand Metacarpal Fracture/Head/Intra-Articular - 4th digit (ring)',
          value: '175804',
        },
        {
          label:
            '175805 - Hand Metacarpal Fracture/Head/Intra-Articular - 5th digit (small)',
          value: '175805',
        },
        {
          label:
            '175811 - Hand Metacarpal Fracture/Base/Intra-Articular - 1st digit (thumb)',
          value: '175811',
        },
        {
          label:
            '175812 - Hand Metacarpal Fracture/Base/Intra-Articular - 2nd digit (index)',
          value: '175812',
        },
        {
          label:
            '175813 - Hand Metacarpal Fracture/Base/Intra-Articular - 3rd digit (middle)',
          value: '175813',
        },
        {
          label:
            '175814 - Hand Metacarpal Fracture/Base/Intra-Articular - 4th digit (ring)',
          value: '175814',
        },
        {
          label:
            '175815 - Hand Metacarpal Fracture/Base/Intra-Articular - 5th digit (small)',
          value: '175815',
        },
        {
          label: '176001 - Hand Removal of Internal Fixation',
          value: '176001',
        },
        {
          label: '178131 - Hand Vascular Aneurysm',
          value: '178131',
        },
        {
          label: '178511 - Hand Abscess - Dorsal',
          value: '178511',
        },
        {
          label: '178512 - Hand Abscess - Palmar',
          value: '178512',
        },
        {
          label: '178513 - Hand Abscess - Thenar',
          value: '178513',
        },
        {
          label: '178514 - Hand Abscess - Web',
          value: '178514',
        },
        {
          label: '178600 - Hand Cellulitis',
          value: '178600',
        },
        {
          label: '178601 - Hand Staph Infection - MRSA',
          value: '178601',
        },
        {
          label: '178602 - Hand Staph Infection - MSSA',
          value: '178602',
        },
        {
          label: '180100 - Thumb Abrasion',
          value: '180100',
        },
        {
          label: '180200 - Thumb Soft Tissue Contusion',
          value: '180200',
        },
        {
          label: '180210 - Thumb Bone Contusion - Distal Phalanx',
          value: '180210',
        },
        {
          label: '180211 - Thumb Bone Contusion - Proximal Phalanx',
          value: '180211',
        },
        {
          label: '180220 - Thumb M-P Joint Contusion',
          value: '180220',
        },
        {
          label: '180230 - Thumb Flexion Contracture',
          value: '180230',
        },
        {
          label: '180301 - Thumb Puncture Wound - Volar',
          value: '180301',
        },
        {
          label: '180302 - Thumb Puncture Wound - Dorsal',
          value: '180302',
        },
        {
          label: '180401 - Thumb Laceration - Dorsal',
          value: '180401',
        },
        {
          label: '180402 - Thumb Laceration - Volar',
          value: '180402',
        },
        {
          label:
            '181540 - Thumb Radial Digital Nerve Injury With Sensory Loss - Compression: 2nd digit (index)',
          value: '181540',
        },
        {
          label:
            '181541 - Thumb Radial Digital Nerve Injury With Sensory Loss - Contusion: 2nd digit (index)',
          value: '181541',
        },
        {
          label:
            '181542 - Thumb Radial Digital Nerve Injury With Sensory Loss - Laceration: 2nd digit (index)',
          value: '181542',
        },
        {
          label:
            '181543 - Thumb Ulnar Digital Nerve Injury With Sensory Loss - Compression: 2nd digit (index)',
          value: '181543',
        },
        {
          label:
            '181544 - Thumb Ulnar Digital Nerve Injury With Sensory Loss - Contusion: 2nd digit (index)',
          value: '181544',
        },
        {
          label:
            '181545 - Thumb Ulnar Digital Nerve Injury With Sensory Loss - Laceration: 2nd digit (index)',
          value: '181545',
        },
        {
          label: '182401 - Thumb Friction Blister - Dorsal',
          value: '182401',
        },
        {
          label: '182402 - Thumb Friction Blister - Volar',
          value: '182402',
        },
        {
          label: '182403 - Thumb Burn 1 Deg',
          value: '182403',
        },
        {
          label: '182404 - Thumb Burn 2 Deg',
          value: '182404',
        },
        {
          label: '182405 - Thumb Burn 3 Deg',
          value: '182405',
        },
        {
          label: '183010 - Thumb Carpo-Metacarpal Sprain',
          value: '183010',
        },
        {
          label: '183020 - Thumb I-P Joint Sprain',
          value: '183020',
        },
        {
          label: '183030 - Thumb M-c-p Joint Sprain',
          value: '183030',
        },
        {
          label: '183040 - Thumb MCP Joint Ulnar Collateral Ligament Sprain',
          value: '183040',
        },
        {
          label: '183050 - Thumb MCP Joint Radial Collateral Ligament Sprain',
          value: '183050',
        },
        {
          label: '183601 - Thumb Dorsal Dislocation/Closed - Distal I-P (DIP)',
          value: '183601',
        },
        {
          label: '183602 - Thumb Volar Dislocation/Closed - Distal I-P (DIP)',
          value: '183602',
        },
        {
          label: '183603 - Thumb Dorsal Dislocation/Closed - M-C-P (MP)',
          value: '183603',
        },
        {
          label: '183604 - Thumb Volar Dislocation/Closed - M-C-P (MP)',
          value: '183604',
        },
        {
          label:
            '183605 - Thumb Dorsal Dislocation/Closed - Proximal I-P (PIP)',
          value: '183605',
        },
        {
          label: '183606 - Thumb Volar Dislocation/Closed - Proximal I-P (PIP)',
          value: '183606',
        },
        {
          label: '183611 - Thumb Carpo-Metacarpal Dorsal Dislocation/Closed',
          value: '183611',
        },
        {
          label: '183612 - Thumb Carpo-Metacarpal Dorsal Dislocation/Open',
          value: '183612',
        },
        {
          label: '183613 - Thumb Carpo-Metacarpal Volar Dislocation/Closed',
          value: '183613',
        },
        {
          label: '183614 - Thumb Carpo-Metacarpal Volar Dislocation/Open',
          value: '183614',
        },
        {
          label: '183621 - Thumb I-P Joint Dorsal Dislocation /Open',
          value: '183621',
        },
        {
          label: '183622 - Thumb I-P Joint Dorsal Dislocation/Closed',
          value: '183622',
        },
        {
          label: '183623 - Thumb I-P Joint Volar Dislocation/Closed',
          value: '183623',
        },
        {
          label: '183624 - Thumb I-P Joint Volar Dislocation/Open',
          value: '183624',
        },
        {
          label: '183631 - Thumb M-C-P (MP) Dorsal Dislocation/Closed',
          value: '183631',
        },
        {
          label: '183632 - Thumb M-C-P (MP) Dorsal Dislocation/Open',
          value: '183632',
        },
        {
          label: '183633 - Thumb M-C-P (MP) Volar Dislocation/Closed',
          value: '183633',
        },
        {
          label: '183634 - Thumb M-C-P (MP) Volar Dislocation/Open',
          value: '183634',
        },
        {
          label: '183801 - Thumb Dorsal Dislocation/Open - Distal I-P (DIP)',
          value: '183801',
        },
        {
          label: '183802 - Thumb Volar Dislocation/Open - Distal I-P (DIP)',
          value: '183802',
        },
        {
          label: '183803 - Thumb Dorsal Dislocation/Open - M-C-P (MP)',
          value: '183803',
        },
        {
          label: '183804 - Thumb Volar Dislocation/Open - M-C-P (MP)',
          value: '183804',
        },
        {
          label: '183805 - Thumb Dorsal Dislocation/Open - Proximal I-P (PIP)',
          value: '183805',
        },
        {
          label: '183806 - Thumb Volar Dislocation/Open - Proximal I-P (PIP)',
          value: '183806',
        },
        {
          label: '183900 - Thumb Amputation, I-P',
          value: '183900',
        },
        {
          label: '183901 - Thumb Amputation, M-C-P (MP)',
          value: '183901',
        },
        {
          label: '184001 - Thumb Thenar Muscle Strain',
          value: '184001',
        },
        {
          label:
            '184410 - Thumb Extensor Tendon Rupture (Extensor Pollicis Longus)',
          value: '184410',
        },
        {
          label:
            '184411 - Thumb Extensor Tendon Partial Tear - Extensor Pollicis Longus',
          value: '184411',
        },
        {
          label:
            '184420 - Thumb Flexor Tendon Rupture (Flexor Pollicis Longus)',
          value: '184420',
        },
        {
          label: '185010 - Thumb Fracture/Distal Phalanx',
          value: '185010',
        },
        {
          label: '185020 - Thumb Fracture/Proximal Phalanx',
          value: '185020',
        },
        {
          label: '185030 - Thumb Fracture/Metacarpal',
          value: '185030',
        },
        {
          label: '185040 - Thumb Fracture/Bennetts',
          value: '185040',
        },
        {
          label: '185050 - Thumb Fracture/Sesmoid',
          value: '185050',
        },
        {
          label: '185110 - Thumb Fracture/Distal Phalanx/Open',
          value: '185110',
        },
        {
          label: '185120 - Thumb Fracture/Proximal Phalanx/Open',
          value: '185120',
        },
        {
          label: '185130 - Thumb Fracture/Metacarpal/Open',
          value: '185130',
        },
        {
          label: '185140 - Thumb Fracture/Bennetts/Open',
          value: '185140',
        },
        {
          label:
            '185311 - Thumb Fracture/Distal Phalanx/Dorsal/Dislocation/Closed',
          value: '185311',
        },
        {
          label:
            '185312 - Thumb Fracture/Distal Phalanx/Dorsal/Dislocation/Open',
          value: '185312',
        },
        {
          label:
            '185313 - Thumb Fracture/Distal Phalanx/Volar/Dislocation/Closed',
          value: '185313',
        },
        {
          label:
            '185314 - Thumb Fracture/Distal Phalanx/Volar/Dislocation/Open',
          value: '185314',
        },
        {
          label:
            '185321 - Thumb Fracture/Proximal Phalanx/Dorsal/Dislocation/Closed',
          value: '185321',
        },
        {
          label:
            '185322 - Thumb Fracture/Proximal Phalanx/Dorsal/Dislocation/Open',
          value: '185322',
        },
        {
          label:
            '185323 - Thumb Fracture/Proximal Phalanx/Volar/Dislocation/Closed',
          value: '185323',
        },
        {
          label:
            '185324 - Thumb Fracture/Proximal Phalanx/Volar/Dislocation/Open',
          value: '185324',
        },
        {
          label: '185331 - Thumb Fracture/Metacarpal/Dorsal/Dislocation/Closed',
          value: '185331',
        },
        {
          label: '185332 - Thumb Fracture/Metacarpal/Dorsal/Dislocation/Open',
          value: '185332',
        },
        {
          label: '185333 - Thumb Fracture/Metacarpal/Volar/Dislocation/Closed',
          value: '185333',
        },
        {
          label: '185334 - Thumb Fracture/Metacarpal/Volar/Dislocation/Open',
          value: '185334',
        },
        {
          label: '185341 - Thumb Fracture/Bennetts/Dorsal/Dislocation/Closed',
          value: '185341',
        },
        {
          label: '185342 - Thumb Fracture/Bennetts/Dorsal/Dislocation/Open',
          value: '185342',
        },
        {
          label: '185343 - Thumb Fracture/Bennetts/Volar/Dislocation/Closed',
          value: '185343',
        },
        {
          label: '185344 - Thumb Fracture/Bennetts/Volar/Dislocation/Open',
          value: '185344',
        },
        {
          label: '185810 - Thumb Fracture/Distal Phalanx/Intra-articular',
          value: '185810',
        },
        {
          label: '185820 - Thumb Fracture/Proximal Phalanx/Intra-articular',
          value: '185820',
        },
        {
          label: '185821 - Thumb Fracture/Proximal Phalanx/Volar Plate',
          value: '185821',
        },
        {
          label: '185830 - Thumb Fracture/Metacarpal/Intra-articular',
          value: '185830',
        },
        {
          label: '185840 - Thumb Fracture/Bennetts/Intra-articular',
          value: '185840',
        },
        {
          label: "185900 - Thumb Fracture/Rolando's/Comminuted Intra-articular",
          value: '185900',
        },
        {
          label: '188600 - Thumb Cellulitis',
          value: '188600',
        },
        {
          label: '188601 - Thumb Staph Infection - MRSA',
          value: '188601',
        },
        {
          label: '188602 - Thumb Staph Infection - MSSA',
          value: '188602',
        },
        {
          label: '188611 - Thumb Felon',
          value: '188611',
        },
        {
          label: '188621 - Thumb Paronychia',
          value: '188621',
        },
        {
          label: '188711 - Finger Staph Infection - MRSA: 2nd Digit (Index)',
          value: '188711',
        },
        {
          label: '188712 - Finger Staph Infection - MRSA: 3rd Digit (Middle)',
          value: '188712',
        },
        {
          label: '188713 - Finger Staph Infection - MRSA: 4th Digit (Ring)',
          value: '188713',
        },
        {
          label: '188714 - Finger Staph Infection - MRSA: 5th Digit (Small)',
          value: '188714',
        },
        {
          label: '188715 - Finger Staph Infection - MSSA: 2nd Digit (Index)',
          value: '188715',
        },
        {
          label: '188716 - Finger Staph Infection - MSSA: 3rd Digit (Middle)',
          value: '188716',
        },
        {
          label: '188717 - Finger Staph Infection - MSSA: 4th Digit (Ring)',
          value: '188717',
        },
        {
          label: '188718 - Finger Staph Infection - MSSA: 5th Digit (Small)',
          value: '188718',
        },
        {
          label: '190010 - Finger Nail Avulsion',
          value: '190010',
        },
        {
          label: '190020 - Finger Nail Subungual Hematoma',
          value: '190020',
        },
        {
          label: '190030 - Finger Flexion Contracture: 2nd Digit (Index)',
          value: '190030',
        },
        {
          label: '190031 - Finger Flexion Contracture: 3rd Digit (Middle)',
          value: '190031',
        },
        {
          label: '190032 - Finger Flexion Contracture: 4th Digit (Ring)',
          value: '190032',
        },
        {
          label: '190033 - Finger Flexion Contracture: 5th Digit (Small)',
          value: '190033',
        },
        {
          label: '190100 - Finger Abrasion',
          value: '190100',
        },
        {
          label: '190200 - Finger Soft Tissue Contusion',
          value: '190200',
        },
        {
          label: '190201 - Finger Soft Tissue Contusion - 2nd digit (index)',
          value: '190201',
        },
        {
          label: '190202 - Finger Soft Tissue Contusion - 3rd digit (middle)',
          value: '190202',
        },
        {
          label: '190203 - Finger Soft Tissue Contusion - 4th digit (ring)',
          value: '190203',
        },
        {
          label: '190204 - Finger Soft Tissue Contusion - 5th digit (small)',
          value: '190204',
        },
        {
          label:
            '190215 - Finger Bone Contusion/Middle Phalanx - 2nd digit (index)',
          value: '190215',
        },
        {
          label:
            '190216 - Finger Bone Contusion/Middle Phalanx - 3rd digit (middle)',
          value: '190216',
        },
        {
          label:
            '190217 - Finger Bone Contusion/Middle Phalanx - 4th digit (ring)',
          value: '190217',
        },
        {
          label:
            '190218 - Finger Bone Contusion/Middle Phalanx - 5th digit (small)',
          value: '190218',
        },
        {
          label:
            '190219 - Finger Bone Contusion/Proximal Phalanx - 2nd digit (index)',
          value: '190219',
        },
        {
          label:
            '190221 - Finger Bone Contusion/Proximal Phalanx - 3rd digit (middle)',
          value: '190221',
        },
        {
          label:
            '190222 - Finger Bone Contusion/Proximal Phalanx - 4th digit (ring)',
          value: '190222',
        },
        {
          label:
            '190223 - Finger Bone Contusion/Proximal Phalanx - 5th digit (small)',
          value: '190223',
        },
        {
          label:
            '190224 - Finger Bone Contusion/Distal Phalanx - 2nd digit (index)',
          value: '190224',
        },
        {
          label:
            '190225 - Finger Bone Contusion/Distal Phalanx - 3rd digit (middle)',
          value: '190225',
        },
        {
          label:
            '190226 - Finger Bone Contusion/Distal Phalanx - 4th digit (ring)',
          value: '190226',
        },
        {
          label:
            '190227 - Finger Bone Contusion/Distal Phalanx - 5th digit (small)',
          value: '190227',
        },
        {
          label: '190300 - Finger Puncture Wound',
          value: '190300',
        },
        {
          label: '190301 - Finger Puncture Wound - 2nd digit (index)',
          value: '190301',
        },
        {
          label: '190302 - Finger Puncture Wound - 3rd digit (middle)',
          value: '190302',
        },
        {
          label: '190303 - Finger Puncture Wound - 4th digit (ring)',
          value: '190303',
        },
        {
          label: '190304 - Finger Puncture Wound - 5th digit (small)',
          value: '190304',
        },
        {
          label: '190405 - Finger Laceration: Dorsal - 2nd digit (index)',
          value: '190405',
        },
        {
          label: '190406 - Finger Laceration: Dorsal - 3rd digit (middle)',
          value: '190406',
        },
        {
          label: '190407 - Finger Laceration: Dorsal - 4th digit (ring)',
          value: '190407',
        },
        {
          label: '190408 - Finger Laceration: Volar - 2nd digit (index)',
          value: '190408',
        },
        {
          label: '190409 - Finger Laceration: Volar - 3rd digit (middle)',
          value: '190409',
        },
        {
          label: '190421 - Finger Laceration: Volar - 4th digit (ring)',
          value: '190421',
        },
        {
          label: '190422 - Finger Laceration: Dorsal - 5th digit (small)',
          value: '190422',
        },
        {
          label: '190423 - Finger Laceration: Volar - 5th digit (small)',
          value: '190423',
        },
        {
          label:
            '190601 - Finger Extensor Tenosynovitis-Tendinitis - 2nd digit (index)',
          value: '190601',
        },
        {
          label:
            '190602 - Finger Extensor Tenosynovitis-Tendinitis - 3rd digit (middle)',
          value: '190602',
        },
        {
          label:
            '190603 - Finger Extensor Tenosynovitis-Tendinitis - 4th digit (ring)',
          value: '190603',
        },
        {
          label:
            '190604 - Finger Extensor Tenosynovitis-Tendinitis - 5th digit (small)',
          value: '190604',
        },
        {
          label:
            '190605 - Finger Flexor Tenosynovitis-Tendinitis - 2nd digit (index)',
          value: '190605',
        },
        {
          label:
            '190606 - Finger Flexor Tenosynovitis-Tendinitis - 3rd digit (middle)',
          value: '190606',
        },
        {
          label:
            '190607 - Finger Flexor Tenosynovitis-Tendinitis - 4th digit (ring)',
          value: '190607',
        },
        {
          label:
            '190608 - Finger Flexor Tenosynovitis-Tendinitis - 5th digit (small)',
          value: '190608',
        },
        {
          label:
            '190701 - Finger Synovitis, Distal I-P (DIP) - 2nd digit (index)',
          value: '190701',
        },
        {
          label:
            '190702 - Finger Synovitis, Distal I-P (DIP) - 3rd digit (middle)',
          value: '190702',
        },
        {
          label:
            '190703 - Finger Synovitis, Distal I-P (DIP) - 4th digit (ring)',
          value: '190703',
        },
        {
          label:
            '190704 - Finger Synovitis, Distal I-P (DIP) - 5th digit (small)',
          value: '190704',
        },
        {
          label: '190705 - Finger Synovitis, M-C-P (MP) - 2nd digit (index)',
          value: '190705',
        },
        {
          label: '190706 - Finger Synovitis, M-C-P (MP) - 3rd digit (middle)',
          value: '190706',
        },
        {
          label: '190707 - Finger Synovitis, M-C-P (MP) - 4th digit (ring)',
          value: '190707',
        },
        {
          label: '190708 - Finger Synovitis, M-C-P (MP) - 5th digit (small)',
          value: '190708',
        },
        {
          label:
            '190709 - Finger Synovitis, Proximal I-P (PIP) - 2nd digit (index)',
          value: '190709',
        },
        {
          label:
            '190710 - Finger Synovitis, Proximal I-P (PIP) - 3rd digit (middle)',
          value: '190710',
        },
        {
          label:
            '190711 - Finger Synovitis, Proximal I-P (PIP) - 4th digit (ring)',
          value: '190711',
        },
        {
          label:
            '190712 - Finger Synovitis, Proximal I-P (PIP) - 5th digit (small)',
          value: '190712',
        },
        {
          label:
            '191504 - Finger Radial Digital Nerve Injury With Sensory Loss - Compression: 2nd digit (index)',
          value: '191504',
        },
        {
          label:
            '191505 - Finger Radial Digital Nerve Injury With Sensory Loss - Compression: 3rd digit (middle)',
          value: '191505',
        },
        {
          label:
            '191506 - Finger Radial Digital Nerve Injury With Sensory Loss - Compression: 4th digit (ring)',
          value: '191506',
        },
        {
          label:
            '191507 - Finger Radial Digital Nerve Injury With Sensory Loss - Compression: 5th digit (small)',
          value: '191507',
        },
        {
          label:
            '191508 - Finger Radial Digital Nerve Injury With Sensory Loss - Contusion: 2nd digit (index)',
          value: '191508',
        },
        {
          label:
            '191509 - Finger Radial Digital Nerve Injury With Sensory Loss - Contusion: 3rd digit (middle)',
          value: '191509',
        },
        {
          label:
            '191510 - Finger Radial Digital Nerve Injury With Sensory Loss - Contusion: 4th digit (ring)',
          value: '191510',
        },
        {
          label:
            '191511 - Finger Radial Digital Nerve Injury With Sensory Loss - Contusion: 5th digit (small)',
          value: '191511',
        },
        {
          label:
            '191512 - Finger Radial Digital Nerve Injury With Sensory Loss - Laceration: 2nd digit (index)',
          value: '191512',
        },
        {
          label:
            '191514 - Finger Radial Digital Nerve Injury With Sensory Loss - Laceration: 4th digit (ring)',
          value: '191514',
        },
        {
          label:
            '191515 - Finger Radial Digital Nerve Injury With Sensory Loss - Laceration: 5th digit (small)',
          value: '191515',
        },
        {
          label:
            '191516 - Finger Ulnar Digital Nerve Injury With Sensory Loss - Compression: 2nd digit (index)',
          value: '191516',
        },
        {
          label:
            '191517 - Finger Ulnar Digital Nerve Injury With Sensory Loss - Compression: 3rd digit (middle)',
          value: '191517',
        },
        {
          label:
            '191518 - Finger Ulnar Digital Nerve Injury With Sensory Loss - Compression: 4th digit (ring)',
          value: '191518',
        },
        {
          label:
            '191519 - Finger Radial Digital Nerve Injury With Sensory Loss - Laceration: 3rd digit (middle)',
          value: '191519',
        },
        {
          label:
            '191520 - Finger Ulnar Digital Nerve Injury With Sensory Loss - Compression: 5th digit (small)',
          value: '191520',
        },
        {
          label:
            '191521 - Finger Ulnar Digital Nerve Injury With Sensory Loss - Contusion: 2nd digit (index)',
          value: '191521',
        },
        {
          label:
            '191522 - Finger Ulnar Digital Nerve Injury With Sensory Loss - Contusion: 3rd digit (middle)',
          value: '191522',
        },
        {
          label:
            '191523 - Finger Ulnar Digital Nerve Injury With Sensory Loss - Contusion: 4th digit (ring)',
          value: '191523',
        },
        {
          label:
            '191524 - Finger Ulnar Digital Nerve Injury With Sensory Loss - Contusion: 5th digit (small)',
          value: '191524',
        },
        {
          label:
            '191525 - Finger Ulnar Digital Nerve Injury With Sensory Loss - Laceration: 2nd digit (index)',
          value: '191525',
        },
        {
          label:
            '191526 - Finger Ulnar Digital Nerve Injury With Sensory Loss - Laceration: 3rd digit (middle)',
          value: '191526',
        },
        {
          label:
            '191527 - Finger Ulnar Digital Nerve Injury With Sensory Loss - Laceration: 4th digit (ring)',
          value: '191527',
        },
        {
          label:
            '191528 - Finger Ulnar Digital Nerve Injury With Sensory Loss - Laceration: 5th digit (small)',
          value: '191528',
        },
        {
          label:
            '191549 - Finger Radial Digital Nerve Injury With Motor Loss - Compression: 2nd digit (index)',
          value: '191549',
        },
        {
          label:
            '191550 - Finger Radial Digital Nerve Injury With Motor Loss - Compression: 3rd digit (middle)',
          value: '191550',
        },
        {
          label:
            '191551 - Finger Radial Digital Nerve Injury With Motor Loss - Compression: 4th digit (ring)',
          value: '191551',
        },
        {
          label:
            '191552 - Finger Radial Digital Nerve Injury With Motor Loss - Compression: 5th digit (small)',
          value: '191552',
        },
        {
          label:
            '191553 - Finger Radial Digital Nerve Injury With Motor Loss - Contusion: 2nd digit (index)',
          value: '191553',
        },
        {
          label:
            '191554 - Finger Radial Digital Nerve Injury With Motor Loss - Contusion: 3rd digit (middle)',
          value: '191554',
        },
        {
          label:
            '191555 - Finger Radial Digital Nerve Injury With Motor Loss - Contusion: 4th digit (ring)',
          value: '191555',
        },
        {
          label:
            '191556 - Finger Radial Digital Nerve Injury With Motor Loss - Contusion: 5th digit (small)',
          value: '191556',
        },
        {
          label:
            '191557 - Finger Radial Digital Nerve Injury With Motor Loss - Lacerations: 2nd digit (index)',
          value: '191557',
        },
        {
          label:
            '191558 - Finger Radial Digital Nerve Injury With Motor Loss - Lacerations: 3rd digit (middle)',
          value: '191558',
        },
        {
          label:
            '191559 - Finger Radial Digital Nerve Injury With Motor Loss - Lacerations: 4th digit (ring)',
          value: '191559',
        },
        {
          label:
            '191560 - Finger Radial Digital Nerve Injury With Motor Loss - Lacerations: 5th digit (small)',
          value: '191560',
        },
        {
          label:
            '191561 - Finger Ulnar Digital Nerve Injury With Motor Loss - Compressions: 2nd digit (index)',
          value: '191561',
        },
        {
          label:
            '191562 - Finger Ulnar Digital Nerve Injury With Motor Loss - Compressions: 3rd digit (middle)',
          value: '191562',
        },
        {
          label:
            '191563 - Finger Ulnar Digital Nerve Injury With Motor Loss - Compressions: 4th digit (ring)',
          value: '191563',
        },
        {
          label:
            '191564 - Finger Ulnar Digital Nerve Injury With Motor Loss - Compressions: 5th digit (small)',
          value: '191564',
        },
        {
          label:
            '191565 - Finger Ulnar Digital Nerve Injury With Motor Loss - Contusions: 2nd digit (index)',
          value: '191565',
        },
        {
          label:
            '191566 - Finger Ulnar Digital Nerve Injury With Motor Loss - Contusions: 3rd digit (middle)',
          value: '191566',
        },
        {
          label:
            '191567 - Finger Ulnar Digital Nerve Injury With Motor Loss - Contusions: 4th digit (ring)',
          value: '191567',
        },
        {
          label:
            '191568 - Finger Ulnar Digital Nerve Injury With Motor Loss - Contusions: 5th digit (small)',
          value: '191568',
        },
        {
          label:
            '191569 - Finger Ulnar Digital Nerve Injury With Motor Loss - Lacerations: 2nd digit (index)',
          value: '191569',
        },
        {
          label:
            '191570 - Finger Ulnar Digital Nerve Injury With Motor Loss - Lacerations: 3rd digit (middle)',
          value: '191570',
        },
        {
          label:
            '191571 - Finger Ulnar Digital Nerve Injury With Motor Loss - Lacerations: 4th digit (ring)',
          value: '191571',
        },
        {
          label:
            '191572 - Finger Ulnar Digital Nerve Injury With Motor Loss - Lacerations: 5th digit (small)',
          value: '191572',
        },
        {
          label:
            '191594 - Finger Radial Digital Nerve Injury With Motor And Sensory Loss - Compression: 2nd digit (index)',
          value: '191594',
        },
        {
          label:
            '191595 - Finger Radial Digital Nerve Injury With Motor And Sensory Loss - Compression: 3rd digit (middle)',
          value: '191595',
        },
        {
          label:
            '191596 - Finger Radial Digital Nerve Injury With Motor And Sensory Loss - Compression: 4th digit (ring)',
          value: '191596',
        },
        {
          label:
            '191597 - Finger Radial Digital Nerve Injury With Motor And Sensory Loss - Compression: 5th digit (small)',
          value: '191597',
        },
        {
          label:
            '191598 - Finger Radial Digital Nerve Injury With Motor And Sensory Loss - Contusion: 2nd digit (index)',
          value: '191598',
        },
        {
          label:
            '191599 - Finger Radial Digital Nerve Injury With Motor And Sensory Loss - Contusion: 3rd digit (middle)',
          value: '191599',
        },
        {
          label:
            '191600 - Finger Radial Digital Nerve Injury With Motor And Sensory Loss - Contusion: 4th digit (ring)',
          value: '191600',
        },
        {
          label:
            '191601 - Finger Radial Digital Nerve Injury With Motor And Sensory Loss - Contusion: 5th digit (small)',
          value: '191601',
        },
        {
          label:
            '191602 - Finger Radial Digital Nerve Injury With Motor And Sensory Loss - Laceration: 2nd digit (index)',
          value: '191602',
        },
        {
          label:
            '191603 - Finger Radial Digital Nerve Injury With Motor And Sensory Loss - Laceration: 3rd digit (middle)',
          value: '191603',
        },
        {
          label:
            '191604 - Finger Radial Digital Nerve Injury With Motor And Sensory Loss - Laceration: 4th digit (ring)',
          value: '191604',
        },
        {
          label:
            '191605 - Finger Radial Digital Nerve Injury With Motor And Sensory Loss - Laceration: 5th digit (small)',
          value: '191605',
        },
        {
          label:
            '191606 - Finger Ulnar Digital Nerve Injury With Motor And Sensory Loss - Compression: 2nd digit (index)',
          value: '191606',
        },
        {
          label:
            '191607 - Finger Ulnar Digital Nerve Injury With Motor And Sensory Loss - Compression: 3rd digit (middle)',
          value: '191607',
        },
        {
          label:
            '191608 - Finger Ulnar Digital Nerve Injury With Motor And Sensory Loss - Compression: 4th digit (ring)',
          value: '191608',
        },
        {
          label:
            '191609 - Finger Ulnar Digital Nerve Injury With Motor And Sensory Loss - Compression: 5th digit (small)',
          value: '191609',
        },
        {
          label:
            '191611 - Finger Ulnar Digital Nerve Injury With Motor And Sensory Loss - Contusion: 3rd digit (middle)',
          value: '191611',
        },
        {
          label:
            '191612 - Finger Ulnar Digital Nerve Injury With Motor And Sensory Loss - Contusion: 4th digit (ring)',
          value: '191612',
        },
        {
          label:
            '191613 - Finger Ulnar Digital Nerve Injury With Motor And Sensory Loss - Contusion: 2nd digit (index)',
          value: '191613',
        },
        {
          label:
            '191614 - Finger Ulnar Digital Nerve Injury With Motor And Sensory Loss - Laceration: 2nd digit (index)',
          value: '191614',
        },
        {
          label:
            '191615 - Finger Ulnar Digital Nerve Injury With Motor And Sensory Loss - Laceration: 3rd digit (middle)',
          value: '191615',
        },
        {
          label:
            '191616 - Finger Ulnar Digital Nerve Injury With Motor And Sensory Loss - Laceration: 4th digit (ring)',
          value: '191616',
        },
        {
          label:
            '191617 - Finger Ulnar Digital Nerve Injury With Motor And Sensory Loss - Laceration: 5th digit (small)',
          value: '191617',
        },
        {
          label:
            '191619 - Finger Ulnar Digital Nerve Injury With Motor And Sensory Loss - Contusion: 5th digit (small)',
          value: '191619',
        },
        {
          label: '192221 - Finger Burn 1 Deg - 2nd Digit (Index)',
          value: '192221',
        },
        {
          label: '192222 - Finger Burn 1 Deg - 3rd Digit (Middle)',
          value: '192222',
        },
        {
          label: '192223 - Finger Burn 1 Deg - 4th Digit (Ring)',
          value: '192223',
        },
        {
          label: '192224 - Finger Burn 1 Deg - 5th Digit (Small)',
          value: '192224',
        },
        {
          label: '192225 - Finger Burn 2 Deg - 2nd Digit (Index)',
          value: '192225',
        },
        {
          label: '192226 - Finger Burn 2 Deg - 3rd Digit (Middle)',
          value: '192226',
        },
        {
          label: '192227 - Finger Burn 2 Deg - 4th Digit (Ring)',
          value: '192227',
        },
        {
          label: '192228 - Finger Burn 2 Deg - 5th Digit (Small)',
          value: '192228',
        },
        {
          label: '192229 - Finger Burn 3 Deg - 2nd Digit (Index)',
          value: '192229',
        },
        {
          label: '192230 - Finger Burn 3 Deg - 3rd Digit (Middle)',
          value: '192230',
        },
        {
          label: '192231 - Finger Burn 3 Deg - 4th Digit (Ring)',
          value: '192231',
        },
        {
          label: '192232 - Finger Burn 3 Deg - 5th Digit (Small)',
          value: '192232',
        },
        {
          label: '192401 - Finger Friction Blister - 2nd Digit (Index)',
          value: '192401',
        },
        {
          label: '192402 - Finger Friction Blister - 3rd Digit (Middle)',
          value: '192402',
        },
        {
          label: '192403 - Finger Friction Blister - 4th Digit (Ring)',
          value: '192403',
        },
        {
          label: '192404 - Finger Friction Blister - 5th Digit (Small)',
          value: '192404',
        },
        {
          label: '193001 - Finger Sprain, Distal I-P (DIP) - 2nd digit (index)',
          value: '193001',
        },
        {
          label: '193002 - Finger Swan Neck Deformity - 2nd digit (index)',
          value: '193002',
        },
        {
          label:
            '193003 - Finger Sprain, Distal I-P (DIP) - 3rd digit (middle)',
          value: '193003',
        },
        {
          label: '193004 - Finger Swan Neck Deformity - 3rd digit (middle)',
          value: '193004',
        },
        {
          label: '193005 - Finger Sprain, Distal I-P (DIP) - 4th digit (ring)',
          value: '193005',
        },
        {
          label: '193006 - Finger Swan Neck Deformity - 4th digit (ring)',
          value: '193006',
        },
        {
          label: '193007 - Finger Sprain, Distal I-P (DIP) - 5th digit (small)',
          value: '193007',
        },
        {
          label: '193008 - Finger Swan Neck Deformity - 5th digit (small)',
          value: '193008',
        },
        {
          label: '193009 - Finger Sprain, M-C-P (MP) - 2nd digit (index)',
          value: '193009',
        },
        {
          label: '193015 - Finger Sprain, M-C-P (MP) - 3rd digit (middle)',
          value: '193015',
        },
        {
          label: '193016 - Finger Sprain, M-C-P (MP) - 4th digit (ring)',
          value: '193016',
        },
        {
          label: '193017 - Finger Sprain, M-C-P (MP) - 5th digit (small)',
          value: '193017',
        },
        {
          label:
            '193018 - Finger Sprain, Proximal I-P (PIP) - 2nd digit (index)',
          value: '193018',
        },
        {
          label:
            '193019 - Finger Sprain, Proximal I-P (PIP) - 3rd digit (middle)',
          value: '193019',
        },
        {
          label:
            '193025 - Finger Sprain, Proximal I-P (PIP) - 4th digit (ring)',
          value: '193025',
        },
        {
          label:
            '193026 - Finger Sprain, Proximal I-P (PIP) - 5th digit (small)',
          value: '193026',
        },
        {
          label:
            '193401 - Finger Dorsal Dislocation, Distal I-P (DIP) - 2nd digit (index)',
          value: '193401',
        },
        {
          label:
            '193402 - Finger Dorsal Dislocation, Distal I-P (DIP) - 3rd digit (middle)',
          value: '193402',
        },
        {
          label:
            '193403 - Finger Dorsal Dislocation, Distal I-P (DIP) - 4th digit (ring)',
          value: '193403',
        },
        {
          label:
            '193404 - Finger Dorsal Dislocation, Distal I-P (DIP) - 5th digit (small)',
          value: '193404',
        },
        {
          label:
            '193405 - Finger Dorsal Dislocation, M-C-P (MP) - 2nd digit (index)',
          value: '193405',
        },
        {
          label:
            '193406 - Finger Dorsal Dislocation, M-C-P (MP) - 3rd digit (middle)',
          value: '193406',
        },
        {
          label:
            '193407 - Finger Dorsal Dislocation, M-C-P (MP) - 4th digit (ring)',
          value: '193407',
        },
        {
          label:
            '193408 - Finger Dorsal Dislocation, M-C-P (MP) - 5th digit (small)',
          value: '193408',
        },
        {
          label:
            '193409 - Finger Dorsal Dislocation, Proximal I-P (PIP) - 2nd digit (index)',
          value: '193409',
        },
        {
          label:
            '193415 - Finger Dorsal Dislocation, Proximal I-P (PIP) - 3rd digit (middle)',
          value: '193415',
        },
        {
          label:
            '193416 - Finger Dorsal Dislocation, Proximal I-P (PIP) - 4th digit (ring)',
          value: '193416',
        },
        {
          label:
            '193417 - Finger Dorsal Dislocation, Proximal I-P (PIP) - 5th digit (small)',
          value: '193417',
        },
        {
          label:
            '193418 - Finger Volar Dislocation, Distal I-P (DIP) - 2nd digit (index)',
          value: '193418',
        },
        {
          label:
            '193419 - Finger Volar Dislocation, Distal I-P (DIP) - 3rd digit (middle)',
          value: '193419',
        },
        {
          label:
            '193425 - Finger Volar Dislocation, M-C-P (MP) - 5th digit (small)',
          value: '193425',
        },
        {
          label:
            '193426 - Finger Volar Dislocation, Proximal I-P (PIP) - 2nd digit (index)',
          value: '193426',
        },
        {
          label:
            '193427 - Finger Volar Dislocation, Proximal I-P (PIP) - 3rd digit (middle)',
          value: '193427',
        },
        {
          label:
            '193428 - Finger Volar Dislocation, Proximal I-P (PIP) - 4th digit (ring)',
          value: '193428',
        },
        {
          label:
            '193429 - Finger Volar Dislocation, Proximal I-P (PIP) - 5th digit (small)',
          value: '193429',
        },
        {
          label:
            '193435 - Finger Volar Dislocation, Distal I-P (DIP) - 4th digit (ring)',
          value: '193435',
        },
        {
          label:
            '193436 - Finger Volar Dislocation, Distal I-P (DIP) - 5th digit (small)',
          value: '193436',
        },
        {
          label:
            '193437 - Finger Volar Dislocation, M-C-P (MP) - 2nd digit (index)',
          value: '193437',
        },
        {
          label:
            '193438 - Finger Volar Dislocation, M-C-P (MP) - 3rd digit (middle)',
          value: '193438',
        },
        {
          label:
            '193439 - Finger Volar Dislocation, M-C-P (MP) - 4th digit (ring)',
          value: '193439',
        },
        {
          label:
            '193635 - Finger Distal I-P (DIP) Dorsal Dislocation/Closed - 2nd digit (index)',
          value: '193635',
        },
        {
          label:
            '193636 - Finger Distal I-P (DIP) Dorsal Dislocation/Open - 2nd digit (index)',
          value: '193636',
        },
        {
          label:
            '193637 - Finger Distal I-P (DIP) Volar Dislocation/Closed - 2nd digit (index)',
          value: '193637',
        },
        {
          label:
            '193638 - Finger Distal I-P (DIP) Volar Dislocation/Open - 2nd digit (index)',
          value: '193638',
        },
        {
          label:
            '193639 - Finger Distal I-P (DIP) Dorsal Dislocation/Closed - 3rd digit (middle)',
          value: '193639',
        },
        {
          label:
            '193646 - Finger Distal I-P (DIP) Dorsal Dislocation/Open - 3rd digit (middle)',
          value: '193646',
        },
        {
          label:
            '193647 - Finger Distal I-P (DIP) Volar Dislocation/Closed - 3rd digit (middle)',
          value: '193647',
        },
        {
          label:
            '193648 - Finger Distal I-P (DIP) Volar Dislocation/Open - 3rd digit (middle)',
          value: '193648',
        },
        {
          label:
            '193649 - Finger Distal I-P (DIP) Dorsal Dislocation/Closed - 4th digit (ring)',
          value: '193649',
        },
        {
          label:
            '193650 - Finger Distal I-P (DIP) Dorsal Dislocation/Open - 4th digit (ring)',
          value: '193650',
        },
        {
          label:
            '193651 - Finger Distal I-P (DIP) Volar Dislocation/Closed - 4th digit (ring)',
          value: '193651',
        },
        {
          label:
            '193652 - Finger Distal I-P (DIP) Volar Dislocation/Open - 4th digit (ring)',
          value: '193652',
        },
        {
          label:
            '193653 - Finger Distal I-P (DIP) Dorsal Dislocation/Closed - 5th digit (small)',
          value: '193653',
        },
        {
          label:
            '193654 - Finger Distal I-P (DIP) Dorsal Dislocation/Open - 5th digit (small)',
          value: '193654',
        },
        {
          label:
            '193655 - Finger Distal I-P (DIP) Volar Dislocation/Closed - 5th digit (small)',
          value: '193655',
        },
        {
          label:
            '193656 - Finger Distal I-P (DIP) Volar Dislocation/Open - 5th digit (small)',
          value: '193656',
        },
        {
          label:
            '193657 - Finger Proximal I-P (PIP) Dorsal Dislocation/Closed - 2nd digit (index)',
          value: '193657',
        },
        {
          label:
            '193658 - Finger Proximal I-P (PIP) Dorsal Dislocation/Open - 2nd digit (index)',
          value: '193658',
        },
        {
          label:
            '193659 - Finger Proximal I-P (PIP) Volar Dislocation/Closed - 2nd digit (index)',
          value: '193659',
        },
        {
          label:
            '193660 - Finger Proximal I-P (PIP) Volar Dislocation/Open - 2nd digit (index)',
          value: '193660',
        },
        {
          label:
            '193661 - Finger Proximal I-P (PIP) Dorsal Dislocation/Closed - 3rd digit (middle)',
          value: '193661',
        },
        {
          label:
            '193662 - Finger Proximal I-P (PIP) Dorsal Dislocation/Open - 3rd digit (middle)',
          value: '193662',
        },
        {
          label:
            '193663 - Finger Proximal I-P (PIP) Volar Dislocation/Closed - 3rd digit (middle)',
          value: '193663',
        },
        {
          label:
            '193664 - Finger Proximal I-P (PIP) Volar Dislocation/Open - 3rd digit (middle)',
          value: '193664',
        },
        {
          label:
            '193665 - Finger Proximal I-P (PIP) Dorsal Dislocation/Closed - 4th digit (ring)',
          value: '193665',
        },
        {
          label:
            '193666 - Finger Proximal I-P (PIP) Dorsal Dislocation/Open - 4th digit (ring)',
          value: '193666',
        },
        {
          label:
            '193667 - Finger Proximal I-P (PIP) Volar Dislocation/Closed - 4th digit (ring)',
          value: '193667',
        },
        {
          label:
            '193668 - Finger Proximal I-P (PIP) Volar Dislocation/Open - 4th digit (ring)',
          value: '193668',
        },
        {
          label:
            '193669 - Finger Proximal I-P (PIP) Dorsal Dislocation/Closed - 5th digit (small)',
          value: '193669',
        },
        {
          label:
            '193670 - Finger Proximal I-P (PIP) Dorsal Dislocation/Open - 5th digit (small)',
          value: '193670',
        },
        {
          label:
            '193671 - Finger Proximal I-P (PIP) Volar Dislocation/Closed - 5th digit (small)',
          value: '193671',
        },
        {
          label:
            '193672 - Finger Proximal I-P (PIP) Volar Dislocation/Open - 5th digit (small)',
          value: '193672',
        },
        {
          label:
            '193673 - Finger M-C-P (MP) Dorsal Dislocation/Closed - 2nd digit (index)',
          value: '193673',
        },
        {
          label:
            '193674 - Finger M-C-P (MP) Dorsal Dislocation/Open - 2nd digit (index)',
          value: '193674',
        },
        {
          label:
            '193675 - Finger M-C-P (MP) Volar Dislocation/Closed - 2nd digit (index)',
          value: '193675',
        },
        {
          label:
            '193676 - Finger M-C-P (MP) Volar Dislocation/Open - 2nd digit (index)',
          value: '193676',
        },
        {
          label:
            '193677 - Finger M-C-P (MP) Dorsal Dislocation/Closed - 3rd digit (middle)',
          value: '193677',
        },
        {
          label:
            '193678 - Finger M-C-P (MP) Dorsal Dislocation/Open - 3rd digit (middle)',
          value: '193678',
        },
        {
          label:
            '193679 - Finger M-C-P (MP) Volar Dislocation/Closed - 3rd digit (middle)',
          value: '193679',
        },
        {
          label:
            '193680 - Finger M-C-P (MP) Volar Dislocation/Open - 3rd digit (middle)',
          value: '193680',
        },
        {
          label:
            '193681 - Finger M-C-P (MP) Dorsal Dislocation/Closed - 4th digit (ring)',
          value: '193681',
        },
        {
          label:
            '193682 - Finger M-C-P (MP) Dorsal Dislocation/Open - 4th digit (ring)',
          value: '193682',
        },
        {
          label:
            '193683 - Finger M-C-P (MP) Volar Dislocation/Closed - 4th digit (ring)',
          value: '193683',
        },
        {
          label:
            '193684 - Finger M-C-P (MP) Volar Dislocation/Open - 4th digit (ring)',
          value: '193684',
        },
        {
          label:
            '193685 - Finger M-C-P (MP) Dorsal Dislocation/Closed - 5th digit (small)',
          value: '193685',
        },
        {
          label:
            '193686 - Finger M-C-P (MP) Dorsal Dislocation/Open - 5th digit (small)',
          value: '193686',
        },
        {
          label:
            '193687 - Finger M-C-P (MP) Volar Dislocation/Closed - 5th digit (small)',
          value: '193687',
        },
        {
          label:
            '193688 - Finger M-C-P (MP) Volar Dislocation/Open - 5th digit (small)',
          value: '193688',
        },
        {
          label: '193811 - Finger Index/Distal I-P (DIP) Dislocation/Open',
          value: '193811',
        },
        {
          label: '193812 - Finger Long/Distal I-P (DIP) Dislocation/Open',
          value: '193812',
        },
        {
          label: '193813 - Finger Ring/Distal I-P Dislocation/Open',
          value: '193813',
        },
        {
          label: '193814 - Finger Small/Distal I-P Dislocation/Open',
          value: '193814',
        },
        {
          label: '193821 - Finger Index/Proximal I-P (PIP) Dislocation/Open',
          value: '193821',
        },
        {
          label: '193822 - Finger Long/Proximal I-P (PIP) Dislocation/Open',
          value: '193822',
        },
        {
          label: '193823 - Finger Ring/Proximal I-P Dislocation/Open',
          value: '193823',
        },
        {
          label: '193824 - Finger Small/Proximal I-P Dislocation/Open',
          value: '193824',
        },
        {
          label: '193831 - Finger Index/M-C-P (MP) Dislocation/Open',
          value: '193831',
        },
        {
          label: '193832 - Finger Long/M-C-P (MP) Dislocation/Open',
          value: '193832',
        },
        {
          label: '193833 - Finger Ring/M-C-P Dislocation/Open',
          value: '193833',
        },
        {
          label: '193834 - Finger Small/M-C-P Dislocation/Open',
          value: '193834',
        },
        {
          label: '194011 - Finger Index Extensor Tendon Strain',
          value: '194011',
        },
        {
          label: '194012 - Finger Long Extensor Tendon Strain',
          value: '194012',
        },
        {
          label: '194013 - Finger Ring Extensor Tendon Strain',
          value: '194013',
        },
        {
          label: '194014 - Finger Small Extensor Tendon Strain',
          value: '194014',
        },
        {
          label: '194020 - Finger Flexor Tendon Strain',
          value: '194020',
        },
        {
          label: '194021 - Finger Flexor Tendon Strain - 2nd digit (index)',
          value: '194021',
        },
        {
          label: '194022 - Finger Flexor Tendon Strain - 3rd digit (middle)',
          value: '194022',
        },
        {
          label: '194024 - Finger Flexor Tendon Strain - 5th digit (small)',
          value: '194024',
        },
        {
          label: '194025 - Finger Flexor Tendon Strain - 4th digit (ring)',
          value: '194025',
        },
        {
          label:
            '194401 - Finger Extensor Terminal Tendon/Bony Avulsion (Bony Mallet Finger) - 2nd digit (index)',
          value: '194401',
        },
        {
          label:
            '194402 - Finger Extensor Terminal Tendon/Bony Avulsion (Bony Mallet Finger) - 3rd digit (middle)',
          value: '194402',
        },
        {
          label:
            '194403 - Finger Extensor Terminal Tendon/Bony Avulsion (Bony Mallet Finger) - 4th digit (ring)',
          value: '194403',
        },
        {
          label:
            '194404 - Finger Extensor Terminal Tendon/Bony Avulsion (Bony Mallet Finger) - 5th digit (small)',
          value: '194404',
        },
        {
          label:
            '194411 - Finger Extensor Terminal Tendon/Avulsion (Soft Tissue Mallet Finger) - 2nd digit (index)',
          value: '194411',
        },
        {
          label:
            '194412 - Finger Extensor Terminal Tendon/Avulsion (Soft Tissue Mallet Finger) - 3rd digit (middle)',
          value: '194412',
        },
        {
          label:
            '194413 - Finger Extensor Terminal Tendon/Avulsion (Soft Tissue Mallet Finger) - 4th digit (ring)',
          value: '194413',
        },
        {
          label:
            '194414 - Finger Extensor Terminal Tendon/Avulsion (Soft Tissue Mallet Finger) - 5th digit (small)',
          value: '194414',
        },
        {
          label:
            '194421 - Finger Flexor Terminal Tendon Avulsion (Jersey Finger) - 2nd digit (index)',
          value: '194421',
        },
        {
          label:
            '194422 - Finger Flexor Terminal Tendon Avulsion (Jersey Finger) - 3rd digit (middle)',
          value: '194422',
        },
        {
          label:
            '194423 - Finger Flexor Terminal Tendon Avulsion (Jersey Finger) - 4th digit (ring)',
          value: '194423',
        },
        {
          label:
            '194424 - Finger Flexor Terminal Tendon Avulsion (Jersey Finger) - 5th digit (small)',
          value: '194424',
        },
        {
          label: '194431 - Finger Boutonnierre Deformity - 2nd digit (index)',
          value: '194431',
        },
        {
          label: '194432 - Finger Boutonnierre Deformity - 3rd digit (middle)',
          value: '194432',
        },
        {
          label: '194433 - Finger Boutonnierre Deformity - 4th digit (ring)',
          value: '194433',
        },
        {
          label: '194434 - Finger Boutonnierre Deformity - 5th digit (small)',
          value: '194434',
        },
        {
          label:
            '194511 - Finger Extensor Tendon Laceration - 2nd digit (index): Zone 1',
          value: '194511',
        },
        {
          label:
            '194512 - Finger Extensor Tendon Laceration - 2nd digit (index): Zone 2',
          value: '194512',
        },
        {
          label:
            '194513 - Finger Extensor Tendon Laceration - 2nd digit (index): Zone 3',
          value: '194513',
        },
        {
          label:
            '194514 - Finger Extensor Tendon Laceration - 2nd digit (index): Zone 4',
          value: '194514',
        },
        {
          label:
            '194515 - Finger Extensor Tendon Laceration - 2nd digit (index): Zone 5',
          value: '194515',
        },
        {
          label:
            '194516 - Finger Extensor Tendon Laceration - 3rd digit (middle): Zone 1',
          value: '194516',
        },
        {
          label:
            '194517 - Finger Extensor Tendon Laceration - 3rd digit (middle): Zone 2',
          value: '194517',
        },
        {
          label:
            '194518 - Finger Extensor Tendon Laceration - 3rd digit (middle): Zone 3',
          value: '194518',
        },
        {
          label:
            '194519 - Finger Extensor Tendon Laceration - 3rd digit (middle): Zone 4',
          value: '194519',
        },
        {
          label:
            '194521 - Finger Extensor Tendon Laceration - 3rd digit (middle): Zone 5',
          value: '194521',
        },
        {
          label:
            '194522 - Finger Extensor Tendon Laceration - 4th digit (ring): Zone 1',
          value: '194522',
        },
        {
          label:
            '194523 - Finger Flexor Tendon Laceration - 2nd digit (index): Zone 1',
          value: '194523',
        },
        {
          label:
            '194524 - Finger Extensor Tendon Laceration - 4th digit (ring): Zone 2',
          value: '194524',
        },
        {
          label:
            '194525 - Finger Flexor Tendon Laceration - 2nd digit (index): Zone 2',
          value: '194525',
        },
        {
          label:
            '194526 - Finger Extensor Tendon Laceration - 4th digit (ring): Zone 3',
          value: '194526',
        },
        {
          label:
            '194527 - Finger Flexor Tendon Laceration - 3rd digit (middle): Zone 1',
          value: '194527',
        },
        {
          label:
            '194528 - Finger Extensor Tendon Laceration - 4th digit (ring): Zone 4',
          value: '194528',
        },
        {
          label:
            '194529 - Finger Flexor Tendon Laceration - 3rd digit (middle): Zone 2',
          value: '194529',
        },
        {
          label:
            '194530 - Finger Extensor Tendon Laceration - 4th digit (ring): Zone 5',
          value: '194530',
        },
        {
          label:
            '194531 - Finger Flexor Tendon Laceration - 4th digit (ring): Zone 1',
          value: '194531',
        },
        {
          label:
            '194532 - Finger Extensor Tendon Laceration - 5th digit (small): Zone 1',
          value: '194532',
        },
        {
          label:
            '194533 - Finger Flexor Tendon Laceration - 4th digit (ring): Zone 2',
          value: '194533',
        },
        {
          label:
            '194534 - Finger Extensor Tendon Laceration - 5th digit (small): Zone 2',
          value: '194534',
        },
        {
          label:
            '194535 - Finger Flexor Tendon Laceration - 5th digit (small): Zone 1',
          value: '194535',
        },
        {
          label:
            '194536 - Finger Extensor Tendon Laceration - 5th digit (small): Zone 3',
          value: '194536',
        },
        {
          label:
            '194537 - Finger Flexor Tendon Laceration - 5th digit (small): Zone 2',
          value: '194537',
        },
        {
          label:
            '194538 - Finger Extensor Tendon Laceration - 5th digit (small): Zone 4',
          value: '194538',
        },
        {
          label:
            '194539 - Finger Extensor Tendon Laceration - 5th digit (small): Zone 5',
          value: '194539',
        },
        {
          label:
            '195008 - Finger Fracture/Distal Phalanx/Open: Extra-Articular - 3rd digit (middle)',
          value: '195008',
        },
        {
          label:
            '195009 - Finger Fracture/Distal Phalanx/Closed: Extra-Articular - 5th digit (small)',
          value: '195009',
        },
        {
          label:
            '195011 - Finger Fracture/Distal Phalanx/Closed: Extra-Articular - 2nd digit (index)',
          value: '195011',
        },
        {
          label:
            '195012 - Finger Fracture/Distal Phalanx/Closed: Extra-Articular - 3rd digit (middle)',
          value: '195012',
        },
        {
          label:
            '195013 - Finger Fracture/Distal Phalanx/Closed: Extra-Articular - 4th digit (ring)',
          value: '195013',
        },
        {
          label:
            '195015 - Finger Fracture/Distal Phalanx/Closed: Intra-Articular - 2nd digit (index)',
          value: '195015',
        },
        {
          label:
            '195016 - Finger Fracture/Distal Phalanx/Closed: Intra-Articular - 3rd digit (middle)',
          value: '195016',
        },
        {
          label:
            '195017 - Finger Fracture/Distal Phalanx/Closed: Intra-Articular - 4th digit (ring)',
          value: '195017',
        },
        {
          label:
            '195018 - Finger Fracture/Distal Phalanx/Closed: Intra-Articular - 5th digit (small)',
          value: '195018',
        },
        {
          label:
            '195019 - Finger Fracture/Distal Phalanx/Open: Extra-Articular - 2nd digit (index)',
          value: '195019',
        },
        {
          label:
            '195025 - Finger Extra-articular Fracture/Proximal Phalanx/Open - 2nd digit (index)',
          value: '195025',
        },
        {
          label:
            '195026 - Finger Fracture/Distal Phalanx/Open: Intra-Articular - 4th digit (ring)',
          value: '195026',
        },
        {
          label:
            '195027 - Finger Extra-articular Fracture/Proximal Phalanx/Open - 3rd digit (middle)',
          value: '195027',
        },
        {
          label:
            '195028 - Finger Fracture/Distal Phalanx/Open: Intra-Articular - 5th digit (small)',
          value: '195028',
        },
        {
          label:
            '195029 - Finger Extra-articular Fracture/Proximal Phalanx/Open - 4th digit (ring)',
          value: '195029',
        },
        {
          label:
            '195035 - Finger Extra-articular Fracture/Proximal Phalanx/Open - 5th digit (small)',
          value: '195035',
        },
        {
          label:
            '195036 - Finger Extra-Articular Fracture/Middle Phalanx/Closed - 2nd digit (index)',
          value: '195036',
        },
        {
          label:
            '195037 - Finger Extra-Articular Fracture/Proximal Phalanx/Closed - 2nd digit (index)',
          value: '195037',
        },
        {
          label:
            '195038 - Finger Extra-Articular Fracture/Middle Phalanx/Closed - 3rd digit (middle)',
          value: '195038',
        },
        {
          label:
            '195039 - Finger Extra-Articular Fracture/Proximal Phalanx/Closed - 3rd digit (middle)',
          value: '195039',
        },
        {
          label:
            '195045 - Finger Extra-Articular Fracture/Middle Phalanx/Closed - 4th digit (ring)',
          value: '195045',
        },
        {
          label:
            '195046 - Finger Extra-Articular Fracture/Proximal Phalanx/Closed - 4th digit (ring)',
          value: '195046',
        },
        {
          label:
            '195047 - Finger Extra-Articular Fracture/Middle Phalanx/Closed - 5th digit (small)',
          value: '195047',
        },
        {
          label:
            '195048 - Finger Extra-Articular Fracture/Proximal Phalanx/Closed - 5th digit (small)',
          value: '195048',
        },
        {
          label:
            '195049 - Finger Intra-Articular Fracture/Middle Phalanx/Open - 2nd digit (index)',
          value: '195049',
        },
        {
          label:
            '195051 - Finger Intra-Articular Fracture/Middle Phalanx/Open - 3rd digit (middle)',
          value: '195051',
        },
        {
          label:
            '195052 - Finger Intra-Articular Fracture/Middle Phalanx/Open - 4th digit (ring)',
          value: '195052',
        },
        {
          label:
            '195053 - Finger Intra-Articular Fracture/Middle Phalanx/Open - 5th digit (small)',
          value: '195053',
        },
        {
          label:
            '195054 - Finger Fracture/Distal Phalanx/Open: Extra-Articular - 4th digit (ring)',
          value: '195054',
        },
        {
          label:
            '195055 - Finger Fracture/Distal Phalanx/Open: Extra-Articular - 5th digit (small)',
          value: '195055',
        },
        {
          label:
            '195056 - Finger Fracture/Distal Phalanx/Open: Intra-Articular - 2nd digit (index)',
          value: '195056',
        },
        {
          label:
            '195057 - Finger Fracture/Distal Phalanx/Open: Intra-Articular - 3rd digit (middle)',
          value: '195057',
        },
        {
          label:
            '195311 - Finger Fracture/Distal Phalanx/Dorsal/Dislocation/Closed - 2nd digit (index)',
          value: '195311',
        },
        {
          label:
            '195312 - Finger Fracture/Distal Phalanx/Dorsal/Dislocation/Closed - 3rd digit (middle)',
          value: '195312',
        },
        {
          label:
            '195313 - Finger Fracture/Distal Phalanx/Dorsal/Dislocation/Closed - 4th digit (ring)',
          value: '195313',
        },
        {
          label:
            '195314 - Finger Fracture/Distal Phalanx/Dorsal/Dislocation/Closed - 5th digit (small)',
          value: '195314',
        },
        {
          label:
            '195315 - Finger Fracture/Distal Phalanx/Dorsal/Dislocation/Open - 2nd digit (index)',
          value: '195315',
        },
        {
          label:
            '195316 - Finger Fracture/Distal Phalanx/Dorsal/Dislocation/Open - 3rd digit (middle)',
          value: '195316',
        },
        {
          label:
            '195317 - Finger Fracture/Distal Phalanx/Dorsal/Dislocation/Open - 4th digit (ring)',
          value: '195317',
        },
        {
          label:
            '195318 - Finger Fracture/Distal Phalanx/Dorsal/Dislocation/Open - 5th digit (small)',
          value: '195318',
        },
        {
          label:
            '195319 - Finger Fracture/Distal Phalanx/Volar/Dislocation/Closed - 2nd digit (index)',
          value: '195319',
        },
        {
          label:
            '195321 - Finger Fracture/Distal Phalanx/Volar/Dislocation/Closed - 3rd digit (middle)',
          value: '195321',
        },
        {
          label:
            '195322 - Finger Fracture/Distal Phalanx/Volar/Dislocation/Closed - 4th digit (ring)',
          value: '195322',
        },
        {
          label:
            '195323 - Finger Fracture/Proximal Phalanx/Dorsal/Dislocation/Closed - 2nd digit (index)',
          value: '195323',
        },
        {
          label:
            '195324 - Finger Fracture/Distal Phalanx/Volar/Dislocation/Closed - 5th digit (small)',
          value: '195324',
        },
        {
          label:
            '195325 - Finger Fracture/Proximal Phalanx/Dorsal/Dislocation/Closed - 3rd digit (middle)',
          value: '195325',
        },
        {
          label:
            '195326 - Finger Fracture/Distal Phalanx/Volar/Dislocation/Open - 2nd digit (index)',
          value: '195326',
        },
        {
          label:
            '195327 - Finger Fracture/Proximal Phalanx/Dorsal/Dislocation/Closed - 4th digit (ring)',
          value: '195327',
        },
        {
          label:
            '195328 - Finger Fracture/Distal Phalanx/Volar/Dislocation/Open - 3rd digit (middle)',
          value: '195328',
        },
        {
          label:
            '195329 - Finger Fracture/Proximal Phalanx/Dorsal/Dislocation/Closed - 5th digit (small)',
          value: '195329',
        },
        {
          label:
            '195331 - Finger Fracture/Distal Phalanx/Volar/Dislocation/Open - 4th digit (ring)',
          value: '195331',
        },
        {
          label:
            '195332 - Finger Fracture/Proximal Phalanx/Dorsal/Dislocation/Open - 2nd digit (index)',
          value: '195332',
        },
        {
          label:
            '195333 - Finger Fracture/Distal Phalanx/Volar/Dislocation/Open - 5th digit (small)',
          value: '195333',
        },
        {
          label:
            '195334 - Finger Fracture/Proximal Phalanx/Dorsal/Dislocation/Open - 3rd digit (middle)',
          value: '195334',
        },
        {
          label:
            '195335 - Finger Fracture/Proximal Phalanx/Dorsal/Dislocation/Open - 4th digit (ring)',
          value: '195335',
        },
        {
          label:
            '195336 - Finger Fracture/Proximal Phalanx/Dorsal/Dislocation/Open - 5th digit (small)',
          value: '195336',
        },
        {
          label:
            '195337 - Finger Fracture/Proximal Phalanx/Volar/Dislocation/Closed - 2nd digit (index)',
          value: '195337',
        },
        {
          label:
            '195338 - Finger Fracture/Proximal Phalanx/Volar/Dislocation/Closed - 3rd digit (middle)',
          value: '195338',
        },
        {
          label:
            '195339 - Finger Fracture/Middle Phalanx/Dorsal/Dislocation/Closed - 2nd digit (index)',
          value: '195339',
        },
        {
          label:
            '195340 - Finger Fracture/Proximal Phalanx/Volar/Dislocation/Closed - 4th digit (ring)',
          value: '195340',
        },
        {
          label:
            '195341 - Finger Fracture/Middle Phalanx/Dorsal/Dislocation/Closed - 3rd digit (middle)',
          value: '195341',
        },
        {
          label:
            '195342 - Finger Fracture/Proximal Phalanx/Volar/Dislocation/Closed - 5th digit (small)',
          value: '195342',
        },
        {
          label:
            '195343 - Finger Fracture/Middle Phalanx/Dorsal/Dislocation/Closed - 4th digit (ring)',
          value: '195343',
        },
        {
          label:
            '195344 - Finger Fracture/Proximal Phalanx/Volar/Dislocation/Open - 2nd digit (index)',
          value: '195344',
        },
        {
          label:
            '195345 - Finger Fracture/Middle Phalanx/Dorsal/Dislocation/Closed - 5th digit (small)',
          value: '195345',
        },
        {
          label:
            '195346 - Finger Fracture/Proximal Phalanx/Volar/Dislocation/Open - 3rd digit (middle)',
          value: '195346',
        },
        {
          label:
            '195347 - Finger Fracture/Middle Phalanx/Dorsal/Dislocation/Open - 2nd digit (index)',
          value: '195347',
        },
        {
          label:
            '195348 - Finger Fracture/Proximal Phalanx/Volar/Dislocation/Open - 4th digit (ring)',
          value: '195348',
        },
        {
          label:
            '195349 - Finger Fracture/Middle Phalanx/Dorsal/Dislocation/Open - 3rd digit (middle)',
          value: '195349',
        },
        {
          label:
            '195350 - Finger Fracture/Proximal Phalanx/Volar/Dislocation/Open - 5th digit (small)',
          value: '195350',
        },
        {
          label:
            '195351 - Finger Fracture/Middle Phalanx/Dorsal/Dislocation/Open - 4th digit (ring)',
          value: '195351',
        },
        {
          label:
            '195352 - Finger Fracture/Middle Phalanx/Dorsal/Dislocation/Open - 5th digit (small)',
          value: '195352',
        },
        {
          label:
            '195353 - Finger Fracture/Middle Phalanx/Volar/Dislocation/Closed - 2nd digit (index)',
          value: '195353',
        },
        {
          label:
            '195354 - Finger Fracture/Middle Phalanx/Volar/Dislocation/Closed - 3rd digit (middle)',
          value: '195354',
        },
        {
          label:
            '195355 - Finger Fracture/Middle Phalanx/Volar/Dislocation/Closed - 4th digit (ring)',
          value: '195355',
        },
        {
          label:
            '195356 - Finger Fracture/Middle Phalanx/Volar/Dislocation/Closed - 5th digit (small)',
          value: '195356',
        },
        {
          label:
            '195357 - Finger Fracture/Middle Phalanx/Volar/Dislocation/Open - 2nd digit (index)',
          value: '195357',
        },
        {
          label:
            '195358 - Finger Fracture/Middle Phalanx/Volar/Dislocation/Open - 3rd digit (middle)',
          value: '195358',
        },
        {
          label:
            '195359 - Finger Fracture/Middle Phalanx/Volar/Dislocation/Open - 4th digit (ring)',
          value: '195359',
        },
        {
          label:
            '195360 - Finger Fracture/Middle Phalanx/Volar/Dislocation/Open - 5th digit (small)',
          value: '195360',
        },
        {
          label:
            '195822 - Finger Intra-articular Fracture/Proximal Phalanx/Closed - 2nd digit (index)',
          value: '195822',
        },
        {
          label: '195823 - Finger Fracture/PIP Volar Plate - 2nd digit (index)',
          value: '195823',
        },
        {
          label:
            '195824 - Finger Intra-articular Fracture/Proximal Phalanx/Closed - 3rd digit (middle)',
          value: '195824',
        },
        {
          label:
            '195825 - Finger Fracture/PIP Volar Plate - 3rd digit (middle)',
          value: '195825',
        },
        {
          label:
            '195826 - Finger Intra-articular Fracture/Proximal Phalanx/Closed - 4th digit (ring)',
          value: '195826',
        },
        {
          label: '195827 - Finger Fracture/PIP Volar Plate - 4th digit (ring)',
          value: '195827',
        },
        {
          label:
            '195828 - Finger Intra-articular Fracture/Proximal Phalanx/Closed - 5th digit (small)',
          value: '195828',
        },
        {
          label: '195829 - Finger Fracture/PIP Volar Plate - 5th digit (small)',
          value: '195829',
        },
        {
          label:
            '195831 - Finger Intra-articular Fracture/Proximal Phalanx/Open - 2nd digit (index)',
          value: '195831',
        },
        {
          label:
            '195832 - Finger Intra-articular Fracture/Proximal Phalanx/Open - 3rd digit (middle)',
          value: '195832',
        },
        {
          label:
            '195833 - Finger Intra-articular Fracture/Proximal Phalanx/Open - 4th digit (ring)',
          value: '195833',
        },
        {
          label:
            '195834 - Finger Intra-articular Fracture/Proximal Phalanx/Open - 5th digit (small)',
          value: '195834',
        },
        {
          label:
            '195835 - Finger Fracture/Middle Phalanx/Intra-Articular/Closed - 2nd digit (index)',
          value: '195835',
        },
        {
          label:
            '195836 - Finger Fracture/Middle Phalanx/Intra-Articular/Closed - 3rd digit (middle)',
          value: '195836',
        },
        {
          label:
            '195837 - Finger Fracture/Middle Phalanx/Intra-Articular/Closed - 4th digit (ring)',
          value: '195837',
        },
        {
          label:
            '195838 - Finger Fracture/Middle Phalanx/Intra-Articular/Closed - 5th digit (small)',
          value: '195838',
        },
        {
          label:
            '195839 - Finger Fracture/Middle Phalanx/Intra-Articular/Open - 2nd digit (index)',
          value: '195839',
        },
        {
          label:
            '195840 - Finger Fracture/Middle Phalanx/Intra-Articular/Open - 3rd digit (middle)',
          value: '195840',
        },
        {
          label:
            '195841 - Finger Fracture/Middle Phalanx/Intra-Articular/Open - 4th digit (ring)',
          value: '195841',
        },
        {
          label:
            '195842 - Finger Fracture/Middle Phalanx/Intra-Articular/Open - 5th digit (small)',
          value: '195842',
        },
        {
          label:
            '196231 - Finger Traumatic Arthritis, Distal I-P (DIP) - 2nd digit (index)',
          value: '196231',
        },
        {
          label:
            '196232 - Finger Traumatic Arthritis, Distal I-P (DIP) - 3rd digit (middle)',
          value: '196232',
        },
        {
          label:
            '196233 - Finger Traumatic Arthritis, Distal I-P (DIP) - 4th digit (ring)',
          value: '196233',
        },
        {
          label:
            '196234 - Finger Traumatic Arthritis, Distal I-P (DIP) - 5th digit (small)',
          value: '196234',
        },
        {
          label:
            '196235 - Finger Traumatic Arthritis, M-C-P (MP) - 2nd digit (index)',
          value: '196235',
        },
        {
          label:
            '196236 - Finger Traumatic Arthritis, M-C-P (MP) - 3rd digit (middle)',
          value: '196236',
        },
        {
          label:
            '196237 - Finger Traumatic Arthritis, M-C-P (MP) - 4th digit (ring)',
          value: '196237',
        },
        {
          label:
            '196238 - Finger Traumatic Arthritis, M-C-P (MP) - 5th digit (small)',
          value: '196238',
        },
        {
          label:
            '196239 - Finger Traumatic Arthritis, Proximal I-P (PIP) - 2nd digit (index)',
          value: '196239',
        },
        {
          label:
            '196241 - Finger Traumatic Arthritis, Proximal I-P (PIP) - 4th digit (ring)',
          value: '196241',
        },
        {
          label:
            '196242 - Finger Traumatic Arthritis, Proximal I-P (PIP) - 5th digit (small)',
          value: '196242',
        },
        {
          label:
            '196243 - Finger Traumatic Arthritis, Proximal I-P (PIP) - 3rd digit (middle)',
          value: '196243',
        },
        {
          label: '198600 - Finger Infection',
          value: '198600',
        },
        {
          label: '198601 - Finger Cellulitis - 2nd digit (index)',
          value: '198601',
        },
        {
          label: '198602 - Finger Cellulitis - 3rd digit (middle)',
          value: '198602',
        },
        {
          label: '198603 - Finger Cellulitis - 4th digit (ring)',
          value: '198603',
        },
        {
          label: '198604 - Finger Cellulitis - 5th digit (small)',
          value: '198604',
        },
        {
          label: '198611 - Finger Felon - 2nd digit (index)',
          value: '198611',
        },
        {
          label: '198612 - Finger Felon - 3rd digit (middle)',
          value: '198612',
        },
        {
          label: '198613 - Finger Felon - 4th digit (ring)',
          value: '198613',
        },
        {
          label: '198614 - Finger Felon - 5th digit (small)',
          value: '198614',
        },
        {
          label: '198621 - Finger Paronychia - 2nd digit (index)',
          value: '198621',
        },
        {
          label: '198622 - Finger Paronychia - 3rd digit (middle)',
          value: '198622',
        },
        {
          label: '198623 - Finger Paronychia - 4th digit (ring)',
          value: '198623',
        },
        {
          label: '198624 - Finger Paronychia - 5th digit (small)',
          value: '198624',
        },
        {
          label:
            '199651 - Finger Amputation, Distal I-P (DIP) - 2nd Digit (Index)',
          value: '199651',
        },
        {
          label:
            '199652 - Finger Amputation, Distal I-P (DIP) - 3rd Digit (Middle)',
          value: '199652',
        },
        {
          label:
            '199653 - Finger Amputation, Distal I-P (DIP) - 4th Digit (Ring)',
          value: '199653',
        },
        {
          label:
            '199654 - Finger Amputation, Distal I-P (DIP) - 5th Digit (Small)',
          value: '199654',
        },
        {
          label: '199655 - Finger Amputation, M-C-P (MP) - 2nd Digit (Index)',
          value: '199655',
        },
        {
          label: '199656 - Finger Amputation, M-C-P (MP) - 3rd Digit (Middle)',
          value: '199656',
        },
        {
          label: '199657 - Finger Amputation, M-C-P (MP) - 4th Digit (Ring)',
          value: '199657',
        },
        {
          label: '199658 - Finger Amputation, M-C-P (MP) - 5th Digit (Small)',
          value: '199658',
        },
        {
          label:
            '199659 - Finger Amputation, Proximal I-P (PIP) - 2nd Digit (Index)',
          value: '199659',
        },
        {
          label:
            '199660 - Finger Amputation, Proximal I-P (PIP) - 3rd Digit (Middle)',
          value: '199660',
        },
        {
          label:
            '199661 - Finger Amputation, Proximal I-P (PIP) - 4th Digit (Ring)',
          value: '199661',
        },
        {
          label:
            '199662 - Finger Amputation, Proximal I-P (PIP) - 5th Digit (Small)',
          value: '199662',
        },
        {
          label: '199670 - Finger Pulley Rupture - 2nd digit (index)',
          value: '199670',
        },
        {
          label: '199671 - Finger Pulley Rupture - 3rd digit (middle)',
          value: '199671',
        },
        {
          label: '199672 - Finger Pulley Rupture - 4th digit (ring)',
          value: '199672',
        },
        {
          label: '199673 - Finger Pulley Rupture - 5th digit (small)',
          value: '199673',
        },
        {
          label: '200100 - Chest Abrasion',
          value: '200100',
        },
        {
          label: '200200 - Chest Contusion',
          value: '200200',
        },
        {
          label: '200210 - Chest Rib Contusion',
          value: '200210',
        },
        {
          label: '200211 - Chest Rib Contusion/Upper',
          value: '200211',
        },
        {
          label: '200212 - Chest Rib Contusion/Mid Cage',
          value: '200212',
        },
        {
          label: '200213 - Chest Rib Contusion/Lower',
          value: '200213',
        },
        {
          label: '200220 - Chest Sternum Contusion',
          value: '200220',
        },
        {
          label: '200240 - Chest Lung Contusion',
          value: '200240',
        },
        {
          label: '200310 - Chest Pneumothorax Traumatic',
          value: '200310',
        },
        {
          label: '200320 - Chest Hemothorax Traumatic',
          value: '200320',
        },
        {
          label: '200322 - Chest Hemothorax / Pneumothorax',
          value: '200322',
        },
        {
          label: '200400 - Chest Laceration',
          value: '200400',
        },
        {
          label: '200401 - Chest Lung Laceration',
          value: '200401',
        },
        {
          label: '200800 - Chest Vascular Trauma',
          value: '200800',
        },
        {
          label: '200920 - Chest Muscle Spasm/Sternal',
          value: '200920',
        },
        {
          label: '203010 - Chest Costochondral Sprain',
          value: '203010',
        },
        {
          label: '203020 - Chest Costovertebral Sprain',
          value: '203020',
        },
        {
          label: '203030 - Chest Costosternal Sprain',
          value: '203030',
        },
        {
          label: '203400 - Chest Rib Subluxation',
          value: '203400',
        },
        {
          label: '204000 - Chest Muscle Strain',
          value: '204000',
        },
        {
          label: '204020 - Chest Intercostal Muscle Strain',
          value: '204020',
        },
        {
          label: '204030 - Chest Diaphragm Strain',
          value: '204030',
        },
        {
          label: '204070 - Chest Serratus Anterior Strain',
          value: '204070',
        },
        {
          label: '204110 - Chest Pectoralis Major Strain 1 Deg',
          value: '204110',
        },
        {
          label: '204210 - Chest Pectoralis Major Strain 2 Deg',
          value: '204210',
        },
        {
          label: '204310 - Chest Pectoralis Major Strain 3 Deg (Complete Tear)',
          value: '204310',
        },
        {
          label: '204510 - Chest Pectoralis Tendon Severance',
          value: '204510',
        },
        {
          label: '205010 - Chest Fracture/Rib',
          value: '205010',
        },
        {
          label: '205020 - Chest Fracture/Sternum',
          value: '205020',
        },
        {
          label: '205030 - Chest Fracture/Xiphoid Process',
          value: '205030',
        },
        {
          label: '205510 - Chest Fracture/Rib/Stress',
          value: '205510',
        },
        {
          label: '205710 - Chest Fracture/Rib/Costochondral',
          value: '205710',
        },
        {
          label: '206100 - Chest Musculoskeletal Inflammation',
          value: '206100',
        },
        {
          label: '206180 - Chest Costochondritis',
          value: '206180',
        },
        {
          label: '206493 - Chest Rib Somatic Dysfunction',
          value: '206493',
        },
        {
          label: '208100 - Chest Pneumothorax Spontaneous',
          value: '208100',
        },
        {
          label: '208410 - Chest Malignancy/Breast',
          value: '208410',
        },
        {
          label: '208600 - Chest Infection',
          value: '208600',
        },
        {
          label: '208601 - Chest Staph Infection - MRSA',
          value: '208601',
        },
        {
          label: '208602 - Chest Staph Infection - MSSA',
          value: '208602',
        },
        {
          label: '208620 - Chest Sebaceous Cyst',
          value: '208620',
        },
        {
          label: '210200 - Heart Contusion',
          value: '210200',
        },
        {
          label: '210810 - Heart Myocardial Infarction',
          value: '210810',
        },
        {
          label: '218110 - Heart Cardiomyopathy',
          value: '218110',
        },
        {
          label: '218120 - Heart Tachycardia/Sinus',
          value: '218120',
        },
        {
          label: '218129 - Heart Palpitations',
          value: '218129',
        },
        {
          label: '218130 - Heart Arrhythmia/Atrial',
          value: '218130',
        },
        {
          label: '218132 - Heart Arrhythmia',
          value: '218132',
        },
        {
          label: '218133 - Heart Athletic Bradycardia',
          value: '218133',
        },
        {
          label: '218134 - Heart Arrhythmia/Ventricular',
          value: '218134',
        },
        {
          label: '218190 - Heart Chest Pain/Nonspecific',
          value: '218190',
        },
        {
          label: '218191 - Heart Valve Abnormality/Aortic Valve',
          value: '218191',
        },
        {
          label: '218192 - Heart Valve Abnormality/Mitral Valve',
          value: '218192',
        },
        {
          label: '218193 - Heart Valve Abnormality/Pulmonic Valve',
          value: '218193',
        },
        {
          label: '218200 - Heart Congenital Condition',
          value: '218200',
        },
        {
          label: '218201 - Heart Abnormal ECG - Long Q-T Syndrome',
          value: '218201',
        },
        {
          label: '218202 - Heart Abnormal ECG - T-Wave Inversion',
          value: '218202',
        },
        {
          label: '218205 - Heart Abnormal ECG - General',
          value: '218205',
        },
        {
          label: '218210 - Heart Aorta Valve Stenosis/Congenital',
          value: '218210',
        },
        {
          label: '218220 - Heart Coronary Artery Disease',
          value: '218220',
        },
        {
          label: '218230 - Heart Mitral Stenosis',
          value: '218230',
        },
        {
          label: '218250 - Heart Pulmonary Valve Stenosis',
          value: '218250',
        },
        {
          label: '218610 - Heart Aorta Valve Stenosis/Rheumatic',
          value: '218610',
        },
        {
          label: '218630 - Heart Mitral Valve Stenosis',
          value: '218630',
        },
        {
          label: '218660 - Heart Tachycardia/Paroxysmal',
          value: '218660',
        },
        {
          label: '218670 - Heart Pericarditis',
          value: '218670',
        },
        {
          label: '218671 - Heart Myocarditis',
          value: '218671',
        },
        {
          label: '218800 - Heart Murmur',
          value: '218800',
        },
        {
          label: '218900 - Heart Pericardial Cyst',
          value: '218900',
        },
        {
          label: '218901 - Wolff-Parkinson-White Syndrome (WPW)',
          value: '218901',
        },
        {
          label: '220100 - Thoracic Back Abrasion',
          value: '220100',
        },
        {
          label: '220200 - Thoracic Back Contusion',
          value: '220200',
        },
        {
          label: '220210 - Thoracic Back Rhomboid Contusion',
          value: '220210',
        },
        {
          label: '220400 - Thoracic Back Laceration',
          value: '220400',
        },
        {
          label: '223000 - Thoracic Back Sprain',
          value: '223000',
        },
        {
          label: '224010 - Thoracic Back Rhomboid Strain',
          value: '224010',
        },
        {
          label: '224020 - Thoracic Back Latissimus Dorsi Strain',
          value: '224020',
        },
        {
          label: '224030 - Thoracic Back Trapezius Strain',
          value: '224030',
        },
        {
          label: '224041 - Thoracic Back Erector Spinae Strain',
          value: '224041',
        },
        {
          label: '224410 - Thoracic Back Rhomboid Tendon Avulsion',
          value: '224410',
        },
        {
          label: '224420 - Thoracic Back Latissimus Tendon Avulsion',
          value: '224420',
        },
        {
          label: '224430 - Thoracic Back Trapezius Tendon Avulsion',
          value: '224430',
        },
        {
          label: '225010 - Thoracic Back Fracture/Vertebral Body',
          value: '225010',
        },
        {
          label: '225020 - Thoracic Back Fracture/Spinous Process',
          value: '225020',
        },
        {
          label: '225030 - Thoracic Back Fracture/Transverse Process',
          value: '225030',
        },
        {
          label: '225300 - Thoracic Back Fracture/Vertebral/Dislocation',
          value: '225300',
        },
        {
          label: '226450 - Thoracic Back Disc Herniation',
          value: '226450',
        },
        {
          label: '226471 - Thoracic Back Spinal Stenosis',
          value: '226471',
        },
        {
          label: '228100 - Thoracic Back Disc Disease',
          value: '228100',
        },
        {
          label: '228410 - Thoracic Back Melanoma/Malignant',
          value: '228410',
        },
        {
          label: '228900 - Thoracic Back Benign Tumor',
          value: '228900',
        },
        {
          label: '229400 - Thoracic Back Staph Infection - MRSA',
          value: '229400',
        },
        {
          label: '229401 - Thoracic Back Staph Infection - MSSA',
          value: '229401',
        },
        {
          label: '230100 - Lumbar Back Abrasion',
          value: '230100',
        },
        {
          label: '230200 - Lumbar Back Contusion',
          value: '230200',
        },
        {
          label: '230300 - Lumbar Back Puncture Wound',
          value: '230300',
        },
        {
          label: '230400 - Lumbar Back Laceration',
          value: '230400',
        },
        {
          label: '230900 - Lumbar Back Muscle Spasm',
          value: '230900',
        },
        {
          label: '233020 - Lumbar Back Sacroiliac Sprain',
          value: '233020',
        },
        {
          label: '234020 - Lumbar Back Muscle Sprain/Strain',
          value: '234020',
        },
        {
          label: '235010 - Lumbar Back Fracture/Vertebral Body',
          value: '235010',
        },
        {
          label: '235020 - Lumbar Back Fracture/Spinous Process',
          value: '235020',
        },
        {
          label: '235030 - Lumbar Back Fracture/Transverse Process',
          value: '235030',
        },
        {
          label: '236241 - Lumbar Back Disc Herniation L1-L2',
          value: '236241',
        },
        {
          label: '236242 - Lumbar Back Disc Herniation L2-L3',
          value: '236242',
        },
        {
          label: '236243 - Lumbar Back Disc Herniation L3-L4',
          value: '236243',
        },
        {
          label: '236244 - Lumbar Back Disc Herniation L4-L5',
          value: '236244',
        },
        {
          label: '236245 - Lumbar Back Disc Herniation L5-S1',
          value: '236245',
        },
        {
          label: '236246 - Lumbar Back Disc Herniation with Imaging Study',
          value: '236246',
        },
        {
          label: '236247 - Lumbar Back Disc Herniation with Radiculopathy',
          value: '236247',
        },
        {
          label: '236430 - Lumbar Back Spondylolysis',
          value: '236430',
        },
        {
          label: '236440 - Lumbar Back Spondylolysthesis',
          value: '236440',
        },
        {
          label: '236472 - Lumbar Back Spinal Stenosis/Radiographic Only',
          value: '236472',
        },
        {
          label: '236473 - Lumbar Back Spinal Stenosis/Symptomatic',
          value: '236473',
        },
        {
          label: '236491 - Lumbar Back Scoliosis',
          value: '236491',
        },
        {
          label: '238100 - Lumbar Back Disc Disease/Degeneration',
          value: '238100',
        },
        {
          label: '238110 - Lumbar Back Pain/Syndrome',
          value: '238110',
        },
        {
          label: '238220 - Lumbar Back Transitional Vertebra',
          value: '238220',
        },
        {
          label: '238600 - Lumbar Back Infection',
          value: '238600',
        },
        {
          label: '238900 - Lumbar Back Benign Tumor',
          value: '238900',
        },
        {
          label: '239910 - Lumbar Back Staph Infection - MRSA',
          value: '239910',
        },
        {
          label: '239911 - Lumbar Back Staph Infection - MSSA',
          value: '239911',
        },
        {
          label: '240200 - Sacrum Contusion',
          value: '240200',
        },
        {
          label: '240210 - Coccyx Contusion',
          value: '240210',
        },
        {
          label: '245010 - Coccyx Fracture',
          value: '245010',
        },
        {
          label: '245020 - Sacrum Fracture',
          value: '245020',
        },
        {
          label: '248200 - Sacrum-Coccyx Birth Defect',
          value: '248200',
        },
        {
          label: '248520 - Coccyx Pilonidal Cyst (non-specific)',
          value: '248520',
        },
        {
          label: '248610 - Coccyx Pilonidal Cyst/Infected',
          value: '248610',
        },
        {
          label: '250100 - Abdomen Abrasion',
          value: '250100',
        },
        {
          label: '250200 - Abdomen Contusion',
          value: '250200',
        },
        {
          label: '250203 - Abdomen Intestine Contusion',
          value: '250203',
        },
        {
          label: '250400 - Abdomen Wall Laceration',
          value: '250400',
        },
        {
          label: '250402 - Abdomen Intestine Laceration',
          value: '250402',
        },
        {
          label: '250910 - GI Colitis',
          value: '250910',
        },
        {
          label: '254000 - Abdomen Muscle Strain',
          value: '254000',
        },
        {
          label: '254010 - Abdomen Rectus Abdominus Strain',
          value: '254010',
        },
        {
          label: '254020 - Abdomen Oblique Strain',
          value: '254020',
        },
        {
          label: '254030 - Abdomen External Oblique Strain',
          value: '254030',
        },
        {
          label: '254040 - Abdomen Internal Oblique Strain',
          value: '254040',
        },
        {
          label: '254050 - Core Muscle Injury',
          value: '254050',
        },
        {
          label: '256280 - Abdomen Muscle Herniation',
          value: '256280',
        },
        {
          label: '256281 - Abdomen Sports Hernia',
          value: '256281',
        },
        {
          label: '258601 - GI Stomach Virus',
          value: '258601',
        },
        {
          label: '258602 - Abdomen Staph Infection - MRSA',
          value: '258602',
        },
        {
          label: '258603 - Abdomen Staph Infection - MSSA',
          value: '258603',
        },
        {
          label: '258610 - GI Appendicitis/Acute',
          value: '258610',
        },
        {
          label: '258620 - GI Gallbladder/Infection',
          value: '258620',
        },
        {
          label: '258621 - GI Gallbladder/Gallstones',
          value: '258621',
        },
        {
          label: '258800 - GI Non-disease/Atypical Condition',
          value: '258800',
        },
        {
          label: '258801 - Abdominal Pain',
          value: '258801',
        },
        {
          label: '258802 - Gastritis',
          value: '258802',
        },
        {
          label: '258900 - Abdomen Benign Tumor',
          value: '258900',
        },
        {
          label: '258901 - Abdomen Lipoma',
          value: '258901',
        },
        {
          label: '260200 - Spleen Contusion',
          value: '260200',
        },
        {
          label: '260401 - Spleen Laceration',
          value: '260401',
        },
        {
          label: '268110 - Spleen Enlarged / Splenomegaly',
          value: '268110',
        },
        {
          label: '270200 - Liver Contusion',
          value: '270200',
        },
        {
          label: '270300 - Liver Puncture',
          value: '270300',
        },
        {
          label: '270401 - Liver Laceration',
          value: '270401',
        },
        {
          label: '278110 - Liver Disease / Non-infectious',
          value: '278110',
        },
        {
          label: '278120 - Liver Gilberts Disease',
          value: '278120',
        },
        {
          label: '278600 - Liver Hepatitis',
          value: '278600',
        },
        {
          label: '278601 - Liver Hepatitis - A',
          value: '278601',
        },
        {
          label: '278602 - Liver Hepatitis - B',
          value: '278602',
        },
        {
          label: '278603 - Liver Hepatitis - C',
          value: '278603',
        },
        {
          label: '278700 - Liver Hepatitis/Infectious',
          value: '278700',
        },
        {
          label: '278750 - Liver Abscess',
          value: '278750',
        },
        {
          label: '278800 - Liver Enlarged',
          value: '278800',
        },
        {
          label: '288101 - Diabetes Mellitus Type 1',
          value: '288101',
        },
        {
          label: '288102 - Diabetes Mellitus Type 2',
          value: '288102',
        },
        {
          label: '288600 - Pancreas Pancreatitis',
          value: '288600',
        },
        {
          label: '290200 - Kidney Contusion',
          value: '290200',
        },
        {
          label: '290400 - Kidney Laceration',
          value: '290400',
        },
        {
          label: '296100 - Kidney Pyelonephritis',
          value: '296100',
        },
        {
          label: '298030 - Kidney Acute Renal Failure',
          value: '298030',
        },
        {
          label: '298100 - Kidney Stone',
          value: '298100',
        },
        {
          label: '298601 - Kidney Cyst',
          value: '298601',
        },
        {
          label: '308600 - Prostate/Prostatitis',
          value: '308600',
        },
        {
          label: '310400 - Bladder Rupture',
          value: '310400',
        },
        {
          label: '318200 - Bladder/Urethral Stone',
          value: '318200',
        },
        {
          label: '318600 - Bladder Infection',
          value: '318600',
        },
        {
          label: '318810 - Bladder Hematuria/Atypical Condition',
          value: '318810',
        },
        {
          label: '330010 - Gonad Hematocele',
          value: '330010',
        },
        {
          label: '330100 - Gonad Abrasion',
          value: '330100',
        },
        {
          label: '330210 - Gonad Testis Contusion',
          value: '330210',
        },
        {
          label: '330220 - Gonad Orchitis',
          value: '330220',
        },
        {
          label: '330310 - Gonad Puncture Wound',
          value: '330310',
        },
        {
          label: '330410 - Gonad Laceration',
          value: '330410',
        },
        {
          label: '338140 - Gonad Varicocele',
          value: '338140',
        },
        {
          label: '338200 - Gonad Congential Condition',
          value: '338200',
        },
        {
          label: '338201 - Gonad Undescended Testicle',
          value: '338201',
        },
        {
          label: '338400 - Gonad Malignancy',
          value: '338400',
        },
        {
          label: '338600 - Gonad Infection',
          value: '338600',
        },
        {
          label: '338610 - Gonad Epididymitis/Acute',
          value: '338610',
        },
        {
          label: '338900 - Gonad Benign Tumor',
          value: '338900',
        },
        {
          label: '339701 - Testicular Torsion',
          value: '339701',
        },
        {
          label: '340100 - Genitalia Abrasion',
          value: '340100',
        },
        {
          label: '340200 - Genitalia Contusion',
          value: '340200',
        },
        {
          label: '340310 - Genitalia Puncture Wound',
          value: '340310',
        },
        {
          label: '340400 - Genitalia Laceration',
          value: '340400',
        },
        {
          label: '348230 - Genitalia Congenital Fistula',
          value: '348230',
        },
        {
          label: '348500 - Genitalia Abscess',
          value: '348500',
        },
        {
          label: '348600 - Genitalia Infection',
          value: '348600',
        },
        {
          label: '348601 - Genitalia Urinary Tract Infection',
          value: '348601',
        },
        {
          label: '348620 - Genitalia Urethritis/non-specific',
          value: '348620',
        },
        {
          label: '348630 - Genitalia Urethral Blockage',
          value: '348630',
        },
        {
          label: '348710 - Sexually Transmitted Infection (STI)',
          value: '348710',
        },
        {
          label: '348711 - Genitalia Herpes Simplex (II) Viral',
          value: '348711',
        },
        {
          label: '358110 - Anus Fissure',
          value: '358110',
        },
        {
          label: '358120 - Anus Hemorrhoids/Thrombosed',
          value: '358120',
        },
        {
          label: '358130 - Anus Fistula Abscess',
          value: '358130',
        },
        {
          label: '358140 - Anus Proctitis',
          value: '358140',
        },
        {
          label: '358150 - Anus Diverticulitis',
          value: '358150',
        },
        {
          label: '358530 - Anus Peri-Rectal Abscess',
          value: '358530',
        },
        {
          label: '358600 - Anus Rectum Infection',
          value: '358600',
        },
        {
          label: '358800 - Anus Rectum/Atypical Condition',
          value: '358800',
        },
        {
          label: '360011 - Hip External Snapping',
          value: '360011',
        },
        {
          label: '360012 - Hip Internal Snapping',
          value: '360012',
        },
        {
          label: '360100 - Hip Abrasion',
          value: '360100',
        },
        {
          label: '360200 - Hip Contusion',
          value: '360200',
        },
        {
          label: '360201 - Hip Contusion/buttock',
          value: '360201',
        },
        {
          label: '360202 - Hip Gluteus Medius Strain/Tear',
          value: '360202',
        },
        {
          label: '360203 - Hip Femoral Head Chondral Injury',
          value: '360203',
        },
        {
          label: '360204 - Hip Acetabulum Chondral Injury',
          value: '360204',
        },
        {
          label: '360210 - Hip Pointer',
          value: '360210',
        },
        {
          label: '360211 - Hip Illiac Contusion /Posterior-Superior',
          value: '360211',
        },
        {
          label: '360212 - Hip Illiac Contusion /Posterior-Inferior',
          value: '360212',
        },
        {
          label: '360241 - Hip Gluteus Maximus Contusion',
          value: '360241',
        },
        {
          label: '360310 - Hip Puncture Wound',
          value: '360310',
        },
        {
          label: '360400 - Hip Laceration',
          value: '360400',
        },
        {
          label: '360500 - Hip Trochanteric Bursitis',
          value: '360500',
        },
        {
          label: '360510 - Hip Psoas Bursitis',
          value: '360510',
        },
        {
          label: '360600 - Hip Flexor Tendonitis',
          value: '360600',
        },
        {
          label: '360700 - Hip Synovitis/Capsulitis Acute',
          value: '360700',
        },
        {
          label: '361600 - Hip Nerve Disorder',
          value: '361600',
        },
        {
          label: '361610 - Hip Sciatic Nerve Disorder',
          value: '361610',
        },
        {
          label: '361620 - Hip Femoral Nerve Disorder',
          value: '361620',
        },
        {
          label: '363510 - Hip Subluxation/Anterior',
          value: '363510',
        },
        {
          label: '363520 - Hip Subluxation/Posterior',
          value: '363520',
        },
        {
          label: '363610 - Hip Dislocation/Anterior',
          value: '363610',
        },
        {
          label: '363620 - Hip Dislocation/Posterior',
          value: '363620',
        },
        {
          label: '364010 - Hip Abductor Strain',
          value: '364010',
        },
        {
          label: '364011 - Hip Gluteus Medius Strain',
          value: '364011',
        },
        {
          label: '364012 - Hip Tensor Fascia Latae Strain',
          value: '364012',
        },
        {
          label: '364020 - Hip Adductor Strain',
          value: '364020',
        },
        {
          label: '364030 - Hip Flexor Strain',
          value: '364030',
        },
        {
          label: '364031 - Hip Iliopsoas Strain',
          value: '364031',
        },
        {
          label: '364032 - Hip Quadratus Lumborum Strain',
          value: '364032',
        },
        {
          label: '364033 - Hip Sartorius Strain/Proximal',
          value: '364033',
        },
        {
          label: '364034 - Hip Rectus Femoris Strain/Proximal',
          value: '364034',
        },
        {
          label: '364041 - Hip Gluteus Maximus Strain',
          value: '364041',
        },
        {
          label: '364043 - Hamstring Strain / Proximal / Muscle Unknown',
          value: '364043',
        },
        {
          label: '364060 - Hip External Rotator Strain',
          value: '364060',
        },
        {
          label: '364061 - Hip Piriformis Strain',
          value: '364061',
        },
        {
          label:
            '364142 - Hamstring Strain / Proximal / Biceps Femoris / 1 Deg',
          value: '364142',
        },
        {
          label:
            '364242 - Hamstring Strain / Proximal / Biceps Femoris / 2 Deg',
          value: '364242',
        },
        {
          label:
            '364342 - Hamstring Strain / Proximal / Biceps Femoris / 3 Deg (Avulsion or Complete Tear)',
          value: '364342',
        },
        {
          label: '365000 - Hip Fracture (non-specific)',
          value: '365000',
        },
        {
          label: '365010 - Hip Fracture/Acetabulum',
          value: '365010',
        },
        {
          label: '365020 - Hip Fracture/Femur/Head',
          value: '365020',
        },
        {
          label: '365030 - Hip Fracture/Femur/Neck',
          value: '365030',
        },
        {
          label: '365120 - Hip Fracture/Femur/Head/Simple',
          value: '365120',
        },
        {
          label: '365130 - Hip Fracture/Femur/Neck/Open',
          value: '365130',
        },
        {
          label: '365150 - Hip Ilium Crest Fracture/Simple',
          value: '365150',
        },
        {
          label: '365210 - Hip Fracture/Acetabulum/Avulsion',
          value: '365210',
        },
        {
          label: '365250 - Hip Fracture/Ilium Crest Avulsion',
          value: '365250',
        },
        {
          label: '365260 - Hip Fracture/Ilium Spine/Avulsion',
          value: '365260',
        },
        {
          label: '365440 - Hip Fracture/Femur/Proximal/Epiphyseal Separation',
          value: '365440',
        },
        {
          label: '365450 - Hip Fracture/Iium Crest/Epiphyseal',
          value: '365450',
        },
        {
          label: '365530 - Hip Fracture/Femur/Neck/Stress',
          value: '365530',
        },
        {
          label: '365710 - Hip Fracture/Acetabulum/Chondral',
          value: '365710',
        },
        {
          label: '365810 - Hip Fracture/Acetabulum/Comminuted',
          value: '365810',
        },
        {
          label: '365830 - Hip Fracture/Femur/Neck/Comminuted',
          value: '365830',
        },
        {
          label: '365900 - Hip Fracture/Other',
          value: '365900',
        },
        {
          label: '366111 - Hip Impingement/Cam Lesion',
          value: '366111',
        },
        {
          label: '366112 - Hip Impingement/Rim Lesion',
          value: '366112',
        },
        {
          label: '366121 - Hip Seimtendinosus Apophysitis',
          value: '366121',
        },
        {
          label: '366160 - Hip Tensor Fascia Latae Fasciitis',
          value: '366160',
        },
        {
          label: '366161 - Hip Ilio-Tibial Band Syndrome (ITBS)',
          value: '366161',
        },
        {
          label: '366201 - Hip Avascular Necrosis',
          value: '366201',
        },
        {
          label: '366210 - Hip Osteochondritis Dissecans',
          value: '366210',
        },
        {
          label: '366230 - Hip Arthritis Traumatic',
          value: '366230',
        },
        {
          label: '366280 - Hip Muscle Herniation',
          value: '366280',
        },
        {
          label: '366310 - Hip Bone Cyst',
          value: '366310',
        },
        {
          label: '366460 - Hip Cartilage Degeneration/Arthritis',
          value: '366460',
        },
        {
          label: '366501 - Hip Acetabular Labral Tear',
          value: '366501',
        },
        {
          label: '368500 - Hip Inguinal Abscess',
          value: '368500',
        },
        {
          label: '368600 - Hip Infection',
          value: '368600',
        },
        {
          label: '368613 - Hip Joint Staph Infection - MRSA',
          value: '368613',
        },
        {
          label: '368614 - Hip Joint Staph Infection - MSSA',
          value: '368614',
        },
        {
          label: '368615 - Hip External Skin Staph Infection - MRSA',
          value: '368615',
        },
        {
          label: '368616 - Hip External Skin Staph Infection - MSSA',
          value: '368616',
        },
        {
          label: '368617 - Hip Joint Infection / Pilonidal Cyst',
          value: '368617',
        },
        {
          label: '368618 - Hip External Skin Infection / Pilonidal Cyst',
          value: '368618',
        },
        {
          label: '369700 - Hip Burn 1 Deg',
          value: '369700',
        },
        {
          label: '369701 - Hip Burn 2 Deg',
          value: '369701',
        },
        {
          label: '369702 - Hip Burn 3 Deg',
          value: '369702',
        },
        {
          label: '370100 - Groin Abrasion',
          value: '370100',
        },
        {
          label: '370200 - Groin Contusion',
          value: '370200',
        },
        {
          label: '370250 - Groin Pubis/Inferior Rami Contusion',
          value: '370250',
        },
        {
          label: '370310 - Groin Puncture Wound',
          value: '370310',
        },
        {
          label: '370410 - Groin Femoral Artery Laceration',
          value: '370410',
        },
        {
          label: '370620 - Groin Adductor Tendinitis',
          value: '370620',
        },
        {
          label: '373000 - Groin Sprain (non-specific)',
          value: '373000',
        },
        {
          label: '373600 - Groin Pubic Symphysis Dislocation',
          value: '373600',
        },
        {
          label: '374010 - Groin Quadriceps Strain/Proximal',
          value: '374010',
        },
        {
          label: '374020 - Groin Adductor Strain/Proximal',
          value: '374020',
        },
        {
          label: '374021 - Groin Gracilis Strain/Proximal',
          value: '374021',
        },
        {
          label: '374022 - Groin Adductor Magnus Strain/Proximal',
          value: '374022',
        },
        {
          label: '374023 - Groin Adductor Longus Strain/Proximal',
          value: '374023',
        },
        {
          label: '374024 - Groin Adductor Brevis Strain/Proximal',
          value: '374024',
        },
        {
          label:
            '374130 - Hamstring Strain / Proximal / Semitendinosus / 1 Deg',
          value: '374130',
        },
        {
          label:
            '374140 - Hamstring Strain / Proximal / Semimembranosus / 1 Deg',
          value: '374140',
        },
        {
          label:
            '374230 - Hamstring Strain / Proximal / Semitendinosus / 2 Deg',
          value: '374230',
        },
        {
          label:
            '374240 - Hamstring Strain / Proximal / Semimembranosus / 2 Deg',
          value: '374240',
        },
        {
          label:
            '374330 - Hamstring Strain / Proximal / Semitendinosus / 3 Deg (Avulsion or Complete Tear)',
          value: '374330',
        },
        {
          label:
            '374340 - Hamstring Strain / Proximal / Semimembranosus / 3 Deg (Avulsion or Complete Tear)',
          value: '374340',
        },
        {
          label: '375000 - Groin Fracture/Pelvis',
          value: '375000',
        },
        {
          label: '375010 - Groin Fracture/Ischiopubic Rami',
          value: '375010',
        },
        {
          label: '375200 - Groin Fracture/Pelvic/Avulsion',
          value: '375200',
        },
        {
          label: '375240 - Groin Fracture/Ischium Tuberosity/Avulsion',
          value: '375240',
        },
        {
          label: '376100 - Groin Pubic Symphysis Inflammation',
          value: '376100',
        },
        {
          label: '376110 - Groin Osteitis Pubis',
          value: '376110',
        },
        {
          label: '376120 - Groin Pubalgia',
          value: '376120',
        },
        {
          label: '378600 - Groin Infection',
          value: '378600',
        },
        {
          label: '378601 - Groin Staph Infection - MRSA',
          value: '378601',
        },
        {
          label: '378602 - Groin Staph Infection - MSSA',
          value: '378602',
        },
        {
          label: '378710 - Groin Tinea Cruris',
          value: '378710',
        },
        {
          label: '378711 - Inguinal Cyst',
          value: '378711',
        },
        {
          label: '380100 - Thigh Anterior Abrasion',
          value: '380100',
        },
        {
          label: '380200 - Thigh Anterior Contusion',
          value: '380200',
        },
        {
          label: '380201 - Thigh Rectus Femoris Contusion',
          value: '380201',
        },
        {
          label: '380210 - Thigh Posterior Contusion',
          value: '380210',
        },
        {
          label: '380211 - Thigh Medial Hamstring Contusion',
          value: '380211',
        },
        {
          label: '380212 - Thigh Lateral Hamstring Contusion',
          value: '380212',
        },
        {
          label: '380213 - Thigh Biceps Femoris Contusion',
          value: '380213',
        },
        {
          label: '380220 - Thigh Lateral Contusion',
          value: '380220',
        },
        {
          label: '380221 - Thigh Trochanteric Contusion',
          value: '380221',
        },
        {
          label: '380222 - Thigh Vastus Lateralis Contusion',
          value: '380222',
        },
        {
          label: '380230 - Thigh Medial Contusion',
          value: '380230',
        },
        {
          label: '380231 - Thigh Vastus Medialis Contusion',
          value: '380231',
        },
        {
          label: '380232 - Thigh Ilio-Tibial (I-T) Band Contusion',
          value: '380232',
        },
        {
          label: '380240 - Thigh Hamstring Contusion',
          value: '380240',
        },
        {
          label: '380300 - Thigh Puncture',
          value: '380300',
        },
        {
          label: '380400 - Thigh Laceration',
          value: '380400',
        },
        {
          label: '380800 - Thigh Vascular Trauma/Acute',
          value: '380800',
        },
        {
          label: '380900 - Thigh Cramps/Spasm',
          value: '380900',
        },
        {
          label: '380910 - Thigh Quadriceps Cramps/Spasm',
          value: '380910',
        },
        {
          label: '380920 - Thigh Adductor Cramps',
          value: '380920',
        },
        {
          label: '380921 - Thigh Adductor Longus Cramps',
          value: '380921',
        },
        {
          label: '380922 - Thigh Adductor Brevis Cramps',
          value: '380922',
        },
        {
          label: '380923 - Thigh Adductor Magnus Cramps',
          value: '380923',
        },
        {
          label: '380930 - Thigh Hamstring Cramps/Medial',
          value: '380930',
        },
        {
          label: '380931 - Thigh Semitendinosus Cramps',
          value: '380931',
        },
        {
          label: '380932 - Thigh Semimembranosus Cramps',
          value: '380932',
        },
        {
          label: '380940 - Thigh Hamstring Cramps/lateral',
          value: '380940',
        },
        {
          label: '380941 - Thigh Biceps Femoris Cramps/Medial',
          value: '380941',
        },
        {
          label: '381000 - Thigh Neurotrauma',
          value: '381000',
        },
        {
          label: '381600 - Thigh Nerve Disorder',
          value: '381600',
        },
        {
          label: '382100 - Thigh Burn 1 Deg',
          value: '382100',
        },
        {
          label: '382200 - Thigh Burn 2 Deg',
          value: '382200',
        },
        {
          label: '382300 - Thigh Burn 3 Deg',
          value: '382300',
        },
        {
          label: '384011 - Thigh Vastus Lateralis Strain',
          value: '384011',
        },
        {
          label: '384012 - Thigh Vastus Intermedius Strain',
          value: '384012',
        },
        {
          label: '384013 - Thigh Vastus Medialis Strain',
          value: '384013',
        },
        {
          label: '384014 - Thigh Rectus Femoris Strain',
          value: '384014',
        },
        {
          label: '384020 - Thigh Adductor Strain/Belly',
          value: '384020',
        },
        {
          label: '384021 - Thigh Adductor Longus Strain/Belly',
          value: '384021',
        },
        {
          label: '384022 - Thigh Adductor Brevis Strain/Belly',
          value: '384022',
        },
        {
          label: '384023 - Thigh Adductor Magnus Strain/Belly',
          value: '384023',
        },
        {
          label: '384030 - Hamstring Strain / Mid / Muscle Unknown',
          value: '384030',
        },
        {
          label: '384050 - Quadriceps Myofascial Strain / Muscle Unknown',
          value: '384050',
        },
        {
          label: '384051 - Quadriceps Myofascial Strain / Vastus Lateralis',
          value: '384051',
        },
        {
          label: '384052 - Quadriceps Myofascial Strain / Vastus Intermedius',
          value: '384052',
        },
        {
          label: '384053 - Quadriceps Myofascial Strain / Vastus Medialis',
          value: '384053',
        },
        {
          label: '384054 - Quadriceps Myofascial Strain / Rectus Femoris',
          value: '384054',
        },
        {
          label: '384060 - Hamstring Myofascial Strain / Muscle Unknown',
          value: '384060',
        },
        {
          label: '384061 - Hamstring Myofascial Strain / Semitendinosus',
          value: '384061',
        },
        {
          label: '384062 - Hamstring Myofascial Strain / Semimembranosus',
          value: '384062',
        },
        {
          label: '384063 - Hamstring Myofascial Strain / Biceps Femoris',
          value: '384063',
        },
        {
          label: '384070 - Adductor Soreness/Inflammation',
          value: '384070',
        },
        {
          label: '384071 - Hamstring Soreness/Inflammation',
          value: '384071',
        },
        {
          label: '384072 - Quadriceps Soreness/Inflammation',
          value: '384072',
        },
        {
          label: '384073 - Calf Soreness/Inflammation',
          value: '384073',
        },
        {
          label: '384131 - Hamstring Strain / Mid / Semitendinosus / 1 Deg',
          value: '384131',
        },
        {
          label: '384132 - Hamstring Strain / Mid / Semimembranosus / 1 Deg',
          value: '384132',
        },
        {
          label: '384141 - Hamstring Strain / Mid / Biceps Femoris / 1 Deg',
          value: '384141',
        },
        {
          label: '384231 - Hamstring Strain / Mid / Semitendinosus / 2 Deg',
          value: '384231',
        },
        {
          label: '384232 - Hamstring Strain / Mid / Semimembranosus / 2 Deg',
          value: '384232',
        },
        {
          label: '384241 - Hamstring Strain / Mid / Biceps Femoris / 2 Deg',
          value: '384241',
        },
        {
          label:
            '384331 - Hamstring Strain / Mid / Semitendinosus / 3 Deg (Avulsion or Complete Tear)',
          value: '384331',
        },
        {
          label:
            '384332 - Hamstring Strain / Mid / Semimembranosus / 3 Deg (Avulsion or Complete Tear)',
          value: '384332',
        },
        {
          label:
            '384341 - Hamstring Strain / Mid / Biceps Femoris / 3 Deg (Avulsion or Complete Tear)',
          value: '384341',
        },
        {
          label: '384505 - Knee Quadriceps Tendon Tear - Partial',
          value: '384505',
        },
        {
          label: '384510 - Knee Quadriceps Tendon Tear - Complete',
          value: '384510',
        },
        {
          label: '385000 - Thigh Fracture Femur',
          value: '385000',
        },
        {
          label: '385010 - Thigh Fracture/Femur/Greater Trochanteric',
          value: '385010',
        },
        {
          label: '385020 - Thigh Fracture/Femur/Lesser Trochanteric',
          value: '385020',
        },
        {
          label: '385030 - Thigh Fracture/Femur/Trochanteric',
          value: '385030',
        },
        {
          label: '385040 - Thigh Fracture/Femur/Shaft',
          value: '385040',
        },
        {
          label: '385050 - Thigh Fracture/Femur/Distal Chondral',
          value: '385050',
        },
        {
          label: '385100 - Thigh Fracture/Femur/Open',
          value: '385100',
        },
        {
          label: '385140 - Thigh Fracture/Femur/Shaft/Open',
          value: '385140',
        },
        {
          label:
            '385310 - Thigh Fracture/Femur/Greater Trochanteric/Dislocation',
          value: '385310',
        },
        {
          label: '385400 - Thigh Fracture/Femur/Epiphyseal Plate',
          value: '385400',
        },
        {
          label:
            '385410 - Thigh Fracture/Femur/Greater Trochanteric/Epiphyseal',
          value: '385410',
        },
        {
          label: '385520 - Thigh Fracture/Lesser Trochanteric/Stress',
          value: '385520',
        },
        {
          label: '385540 - Thigh Fracture/Femur/Shaft/Stress',
          value: '385540',
        },
        {
          label: '385541 - Thigh Fracture/Femur/Neck/Stress',
          value: '385541',
        },
        {
          label: '385640 - Thigh Fracture/Femur/Shaft/Greenstick',
          value: '385640',
        },
        {
          label: '385840 - Thigh Fracture/Femur/Shaft/Comminuted',
          value: '385840',
        },
        {
          label: '386131 - Thigh Lesser Trochanter Stress Reaction',
          value: '386131',
        },
        {
          label: '386132 - Thigh Femoral Neck Stress Reaction',
          value: '386132',
        },
        {
          label: '386180 - Thigh Femur Osteochondritis',
          value: '386180',
        },
        {
          label: '386201 - Thigh Femoral Avascular Necrosis',
          value: '386201',
        },
        {
          label: '386250 - Thigh Calcification',
          value: '386250',
        },
        {
          label: '386270 - Thigh Quad Myositis Ossificans',
          value: '386270',
        },
        {
          label: '386280 - Thigh Muscle Herniation',
          value: '386280',
        },
        {
          label: '386310 - Thigh Bone Cyst',
          value: '386310',
        },
        {
          label: '386320 - Thigh Hamstring Cyst',
          value: '386320',
        },
        {
          label: '386321 - Thigh Hamstring Cyst/Tendon',
          value: '386321',
        },
        {
          label: '386390 - Thigh Osteoid Osteoma',
          value: '386390',
        },
        {
          label: '388100 - Thigh Illness/Other',
          value: '388100',
        },
        {
          label: '388500 - Thigh Skin Abscess',
          value: '388500',
        },
        {
          label: '388600 - Thigh Infection',
          value: '388600',
        },
        {
          label: '388601 - Thigh Staph Infection - MRSA',
          value: '388601',
        },
        {
          label: '388602 - Thigh Staph Infection - MSSA',
          value: '388602',
        },
        {
          label: '390010 - Meniscus Lateral Tear',
          value: '390010',
        },
        {
          label: '390020 - Meniscus Medial Tear',
          value: '390020',
        },
        {
          label: '390110 - Meniscus Lateral Anterior Horn Tear',
          value: '390110',
        },
        {
          label: '390111 - Meniscus Lateral Anterior Horn/Undersurface',
          value: '390111',
        },
        {
          label: '390112 - Meniscus Lateral Anterior Horn/Undersurface/Degen',
          value: '390112',
        },
        {
          label: '390120 - Meniscus Medial Anterior Horn Tear',
          value: '390120',
        },
        {
          label: '390121 - Meniscus Medial Anterior Horn/Undersurface',
          value: '390121',
        },
        {
          label: '390200 - Meniscus Contusion',
          value: '390200',
        },
        {
          label: '390210 - Meniscus Lateral Posterior Horn Tear',
          value: '390210',
        },
        {
          label: '390211 - Meniscus Lateral Posterior Horn/Undersurface',
          value: '390211',
        },
        {
          label: '390212 - Meniscus Lateral Posterior Horn/Undersurface/Degen',
          value: '390212',
        },
        {
          label: '390220 - Meniscus Medial Posterior Horn Tear',
          value: '390220',
        },
        {
          label: '390221 - Meniscus Medial Posterior Horn/Undersurface',
          value: '390221',
        },
        {
          label: '390310 - Meniscus Lateral Bucket Handle Tear',
          value: '390310',
        },
        {
          label: '390311 - Meniscus Lateral Bucket Handle/Degen',
          value: '390311',
        },
        {
          label: '390320 - Meniscus Medial Bucket Handle Tear',
          value: '390320',
        },
        {
          label: '390410 - Meniscus Lateral Radial Tear',
          value: '390410',
        },
        {
          label: '390411 - Meniscus Lateral Radial Tear/Degen',
          value: '390411',
        },
        {
          label: '390420 - Meniscus Medial Radial Tear',
          value: '390420',
        },
        {
          label: '390510 - Meniscus Lateral Complex Tear',
          value: '390510',
        },
        {
          label: '390511 - Complex Lateral Meniscus Tear',
          value: '390511',
        },
        {
          label: '390520 - Meniscus Medial Complex Tear',
          value: '390520',
        },
        {
          label: '390521 - Complex Medial Meniscus Tear',
          value: '390521',
        },
        {
          label: '390610 - Meniscus Lateral Peripheral Tear',
          value: '390610',
        },
        {
          label: '390611 - Meniscus Lateral Peripheral Tear/Degen',
          value: '390611',
        },
        {
          label: '390620 - Meniscus Medial Peripheral Tear',
          value: '390620',
        },
        {
          label: '396100 - Meniscus Inflammation',
          value: '396100',
        },
        {
          label: '396211 - Lateral Meniscus Calcification',
          value: '396211',
        },
        {
          label: '396221 - Medial Meniscus Calcification',
          value: '396221',
        },
        {
          label: '396411 - Lateral Meniscus Cyst',
          value: '396411',
        },
        {
          label: '396412 - Lateral Meniscus Discoid',
          value: '396412',
        },
        {
          label: '396421 - Medial Meniscus Discoid',
          value: '396421',
        },
        {
          label: '396422 - Medial Meniscus Cyst',
          value: '396422',
        },
        {
          label: '400010 - Knee Iliotibial Band Syndrome',
          value: '400010',
        },
        {
          label: '400100 - Knee Abrasion',
          value: '400100',
        },
        {
          label: '400200 - Knee Contusion',
          value: '400200',
        },
        {
          label: '400210 - Knee Pes Anserine Bursitis',
          value: '400210',
        },
        {
          label: '400211 - Knee Medial Retinaculum Contusion',
          value: '400211',
        },
        {
          label: '400212 - Knee Medial Femoral Condyle Contusion',
          value: '400212',
        },
        {
          label: '400213 - Knee Tibial Plateau Contusion',
          value: '400213',
        },
        {
          label: '400214 - Lateral Knee Tibial Plateau Contusion',
          value: '400214',
        },
        {
          label: '400215 - Medial Knee Tibial Plateau Contusion',
          value: '400215',
        },
        {
          label: '400220 - Knee Infrapatellar Fat Pad Contusion',
          value: '400220',
        },
        {
          label: '400230 - Knee Lateral Knee Contusion',
          value: '400230',
        },
        {
          label: '400231 - Knee Lateral Femoral Condyle Contusion',
          value: '400231',
        },
        {
          label: '400240 - Knee Posterior Knee Contusion',
          value: '400240',
        },
        {
          label: '400300 - Knee Puncture Wound',
          value: '400300',
        },
        {
          label: '400400 - Knee Laceration',
          value: '400400',
        },
        {
          label: '400500 - Prepatellar Bursitis',
          value: '400500',
        },
        {
          label: '400510 - Knee Anserine Bursitis',
          value: '400510',
        },
        {
          label: '400600 - Knee Tenosynovitis-Tendinitis',
          value: '400600',
        },
        {
          label: '400601 - Knee Patellar Tenosynovitis-Tendinitis',
          value: '400601',
        },
        {
          label: '400620 - Knee Hamstring Tenosynovitis-Tendinitis',
          value: '400620',
        },
        {
          label: '400621 - Knee Semimembranosus Tendinitis',
          value: '400621',
        },
        {
          label: '400622 - Knee Semitendinosus Tendinitis',
          value: '400622',
        },
        {
          label: '400630 - Knee Gastrocnemius Tendinitis/Proximal',
          value: '400630',
        },
        {
          label: '400670 - Knee Iliotibial Band Tendinitis/Acute',
          value: '400670',
        },
        {
          label: '400700 - Knee Synovitis/Capsulitis/Acute',
          value: '400700',
        },
        {
          label: '400730 - Knee Medial Collateral Capsulitis',
          value: '400730',
        },
        {
          label: '400800 - Knee Vascular Trauma',
          value: '400800',
        },
        {
          label: '400920 - Knee Hamstring Muscle Spasm',
          value: '400920',
        },
        {
          label: '401510 - Knee Nerve Contusion w/Sensory Loss',
          value: '401510',
        },
        {
          label: '401520 - Knee Nerve Contusion w/Motor Loss',
          value: '401520',
        },
        {
          label: '401530 - Knee Nerve Contusion w/S&M Loss',
          value: '401530',
        },
        {
          label: '401640 - Knee Nerve Disorder/Neuroma',
          value: '401640',
        },
        {
          label: '401641 - Knee Nerve Ganglion Cyst',
          value: '401641',
        },
        {
          label: '401642 - Knee Peroneal Nerve Inflammation',
          value: '401642',
        },
        {
          label: '402101 - Knee Burn 1 Deg',
          value: '402101',
        },
        {
          label: '402102 - Knee Burn 2 Deg',
          value: '402102',
        },
        {
          label: '402103 - Knee Burn 3 Deg',
          value: '402103',
        },
        {
          label: '402400 - Knee Friction Blister',
          value: '402400',
        },
        {
          label: '403011 - Knee Anterior Cruciate Ligament Tear - Complete',
          value: '403011',
        },
        {
          label: '403012 - Knee Anterior Cruciate Ligament Tear - Partial',
          value: '403012',
        },
        {
          label: '403090 - Knee Patellofemoral Ligament (MPFL) Sprain',
          value: '403090',
        },
        {
          label: '403101 - Knee Hyperextension Sprain 1 Deg',
          value: '403101',
        },
        {
          label: '403102 - Knee Hyperflexion Sprain 1 Deg',
          value: '403102',
        },
        {
          label: '403120 - Knee Posterior Cruciate Sprain - Grade 1',
          value: '403120',
        },
        {
          label: '403130 - Knee Lateral Collateral Sprain - Grade 1',
          value: '403130',
        },
        {
          label: '403140 - Knee Medial Collateral Sprain - Grade 1',
          value: '403140',
        },
        {
          label: '403150 - Knee Anterior Capsule Sprain 1 Deg',
          value: '403150',
        },
        {
          label: '403151 - Knee Anterior-Medial Capsule Sprain 1 Deg',
          value: '403151',
        },
        {
          label: '403152 - Knee Anterior-Lateral Capsule Sprain 1 Deg',
          value: '403152',
        },
        {
          label: '403160 - Knee Posterior Capsule Sprain 1 Deg',
          value: '403160',
        },
        {
          label: '403161 - Knee Posterior-Medial Capsule Sprain 1 Deg',
          value: '403161',
        },
        {
          label: '403162 - Knee Posterior-Lateral Capsule Sprain 1 Deg',
          value: '403162',
        },
        {
          label: '403170 - Knee Medial Capsule Sprain 1 Deg',
          value: '403170',
        },
        {
          label: '403180 - Knee Lateral Capsule Sprain 1 Deg',
          value: '403180',
        },
        {
          label: '403201 - Knee Hyperextension Sprain 2 Deg',
          value: '403201',
        },
        {
          label: '403202 - Knee Hyperflexion Sprain 2 Deg',
          value: '403202',
        },
        {
          label: '403220 - Knee Posterior Cruciate Sprain - Grade 2',
          value: '403220',
        },
        {
          label: '403230 - Knee Lateral Collateral Sprain - Grade 2',
          value: '403230',
        },
        {
          label: '403240 - Knee Medial Collateral Sprain - Grade 2',
          value: '403240',
        },
        {
          label: '403250 - Knee Anterior Capsule Sprain 2 Deg',
          value: '403250',
        },
        {
          label: '403251 - Knee Anterior-Medial Capsule Sprain 2 Deg',
          value: '403251',
        },
        {
          label: '403252 - Knee Anterior-Lateral Capsule Sprain 2 Deg',
          value: '403252',
        },
        {
          label: '403260 - Knee Posterior Capsule Sprain 2 Deg',
          value: '403260',
        },
        {
          label: '403261 - Knee Posterior-Medial Capsule Sprain 2 Deg',
          value: '403261',
        },
        {
          label: '403262 - Knee Posterior-Lateral Capsule Sprain 2 Deg',
          value: '403262',
        },
        {
          label: '403270 - Knee Medial Capsule Sprain 2 Deg',
          value: '403270',
        },
        {
          label: '403280 - Knee Lateral Capsule Sprain 2 Deg',
          value: '403280',
        },
        {
          label: '403301 - Knee Hyperextension Sprain 3 Deg',
          value: '403301',
        },
        {
          label: '403302 - Knee Hyperflexion Sprain 3 Deg',
          value: '403302',
        },
        {
          label: '403320 - Knee Posterior Cruciate Sprain - Grade 3',
          value: '403320',
        },
        {
          label: '403330 - Knee Lateral Collateral Sprain - Grade 3',
          value: '403330',
        },
        {
          label: '403340 - Knee Medial Collateral Sprain - Grade 3',
          value: '403340',
        },
        {
          label: '403350 - Knee Anterior Capsule Sprain 3 Deg',
          value: '403350',
        },
        {
          label: '403351 - Knee Anterior-Medial Capsule Sprain 3 Deg',
          value: '403351',
        },
        {
          label: '403352 - Knee Anterior-Lateral Capsule Sprain 3 Deg',
          value: '403352',
        },
        {
          label: '403360 - Knee Posterior Capsule Sprain 3 Deg',
          value: '403360',
        },
        {
          label: '403361 - Knee Posterior-Medial Capsule Sprain 3 Deg',
          value: '403361',
        },
        {
          label: '403362 - Knee Posterior-Lateral Capsule Sprain 3 Deg',
          value: '403362',
        },
        {
          label: '403370 - Knee Medial Capsule Sprain 3 Deg',
          value: '403370',
        },
        {
          label: '403380 - Knee Lateral Capsule Sprain 3 Deg',
          value: '403380',
        },
        {
          label: '403400 - Knee Subluxation/Acute',
          value: '403400',
        },
        {
          label: '403600 - Knee Dislocation',
          value: '403600',
        },
        {
          label: '403800 - Knee Dislocation/Open',
          value: '403800',
        },
        {
          label: '403900 - Knee Joint Laxity',
          value: '403900',
        },
        {
          label: '404020 - Knee Adductor Strain/Distal',
          value: '404020',
        },
        {
          label: '404030 - Hamstring Strain / Distal / Muscle Unknown',
          value: '404030',
        },
        {
          label: '404070 - Knee Iliotibial Band Strain',
          value: '404070',
        },
        {
          label: '404100 - Knee Strain 1 Deg (non-specific)',
          value: '404100',
        },
        {
          label: '404143 - Hamstring Strain / Distal / Biceps Femoris / 1 Deg',
          value: '404143',
        },
        {
          label: '404144 - Hamstring Strain / Distal / Semitendinosus / 1 Deg',
          value: '404144',
        },
        {
          label: '404145 - Hamstring Strain / Distal / Semimembranosus / 1 Deg',
          value: '404145',
        },
        {
          label: '404150 - Knee Popliteus Strain 1 Deg',
          value: '404150',
        },
        {
          label: '404160 - Knee Sartorius Strain/Distal 1 Deg',
          value: '404160',
        },
        {
          label: '404200 - Knee Strain 2 Deg (non-specific)',
          value: '404200',
        },
        {
          label: '404250 - Knee Popliteus Strain 2 Deg',
          value: '404250',
        },
        {
          label: '404260 - Knee Sartorius Strain/Distal 2 Deg',
          value: '404260',
        },
        {
          label: '404280 - Hamstring Strain / Distal / Biceps Femoris / 2 Deg',
          value: '404280',
        },
        {
          label: '404281 - Hamstring Strain / Distal / Semitendinosus / 2 Deg',
          value: '404281',
        },
        {
          label: '404282 - Hamstring Strain / Distal / Semimembranosus / 2 Deg',
          value: '404282',
        },
        {
          label: '404300 - Knee Strain 3 Deg (non-specific)',
          value: '404300',
        },
        {
          label: '404310 - Knee Quadriceps Strain/Distal - Complete',
          value: '404310',
        },
        {
          label: '404350 - Knee Popliteus Strain 3 Deg (Complete Tear)',
          value: '404350',
        },
        {
          label: '404360 - Knee Sartorius Strain/Distal 3 Deg (Complete Tear)',
          value: '404360',
        },
        {
          label:
            '404380 - Hamstring Strain / Distal / Biceps Femoris / 3 Deg (Avulsion or Complete Tear)',
          value: '404380',
        },
        {
          label:
            '404381 - Hamstring Strain / Distal / Semitendinosus / 3 Deg (Avulsion or Complete Tear)',
          value: '404381',
        },
        {
          label:
            '404382 - Hamstring Strain / Distal / Semimembranosus / 3 Deg (Avulsion or Complete Tear)',
          value: '404382',
        },
        {
          label: '404420 - Knee Adductor Avulsion/Distal',
          value: '404420',
        },
        {
          label: '404450 - Knee Popliteus Tendon Avulsion',
          value: '404450',
        },
        {
          label: '404500 - Knee Tendon Severance',
          value: '404500',
        },
        {
          label: '405000 - Knee Fracture/Femur/Distal',
          value: '405000',
        },
        {
          label: '405010 - Knee Fracture/Femur/Intercondylar',
          value: '405010',
        },
        {
          label: '405020 - Knee Fracture/Femur/Medial Condyle',
          value: '405020',
        },
        {
          label: '405021 - Knee Femur/Medial Condylar Defect I',
          value: '405021',
        },
        {
          label: '405022 - Knee Femur/Medial Condylar Defect II',
          value: '405022',
        },
        {
          label: '405023 - Knee Femur/Medial Condylar Defect III',
          value: '405023',
        },
        {
          label: '405024 - Knee Femur/Medial Condylar Defect IV',
          value: '405024',
        },
        {
          label: '405025 - Knee Femur/Medial Condylar Defect IV<1.5cm',
          value: '405025',
        },
        {
          label: '405026 - Knee Femur/Medial Condylar Defect IV>1.5cm',
          value: '405026',
        },
        {
          label: '405030 - Knee Fracture/Femur/Lateral Condyle',
          value: '405030',
        },
        {
          label: '405031 - Knee Femur/Lateral Condylar Defect I',
          value: '405031',
        },
        {
          label: '405032 - Knee Femur/Lateral Condylar Defect II',
          value: '405032',
        },
        {
          label: '405033 - Knee Femur/Lateral Condylar Defect III',
          value: '405033',
        },
        {
          label: '405034 - Knee Femur/Lateral Condylar Defect IV',
          value: '405034',
        },
        {
          label: '405035 - Knee Femur/Lateral Condylar Defect IV<1.5cm',
          value: '405035',
        },
        {
          label: '405036 - Knee Femur/Lateral Condylar Defect IV>1.5cm',
          value: '405036',
        },
        {
          label: '405040 - Knee Fracture/Tibia/Medial Plateau',
          value: '405040',
        },
        {
          label: '405041 - Knee Tibia/Medial Plateau Defect I',
          value: '405041',
        },
        {
          label: '405042 - Knee Tibia/Medial Plateau Defect II',
          value: '405042',
        },
        {
          label: '405043 - Knee Tibia/Medial Plateau Defect III',
          value: '405043',
        },
        {
          label: '405044 - Knee Tibia/Medial Plateau Defect IV',
          value: '405044',
        },
        {
          label: '405045 - Knee Tibia/Medial Plateau Defect IV<1.5cm',
          value: '405045',
        },
        {
          label: '405046 - Knee Tibia/Medial Plateau Defect IV>1.5cm',
          value: '405046',
        },
        {
          label: '405050 - Knee Fracture/Tibia/Lateral Plateau',
          value: '405050',
        },
        {
          label: '405051 - Knee Tibia/Lateral Plateau Defect I',
          value: '405051',
        },
        {
          label: '405052 - Knee Tibia/Lateral Plateau Defect II',
          value: '405052',
        },
        {
          label: '405053 - Knee Tibia/Lateral Plateau Defect III',
          value: '405053',
        },
        {
          label: '405054 - Knee Tibia/Lateral Plateau Defect IV',
          value: '405054',
        },
        {
          label: '405055 - Knee Tibia/Lateral Plateau Defect IV<1.5cm',
          value: '405055',
        },
        {
          label: '405056 - Knee Tibia/Lateral Plateau Defect IV>1.5cm',
          value: '405056',
        },
        {
          label: '405061 - Knee Tibia/Trochlea Defect I',
          value: '405061',
        },
        {
          label: '405062 - Knee Tibia/Trochlea Defect II',
          value: '405062',
        },
        {
          label: '405063 - Knee Tibia/Trochlea Defect III',
          value: '405063',
        },
        {
          label: '405064 - Knee Tibia/Trochlea Defect IV',
          value: '405064',
        },
        {
          label: '405065 - Knee Tibia/Trochlea Defect IV<1.5cm',
          value: '405065',
        },
        {
          label: '405066 - Knee Tibia/Trochlea Defect IV>1.5cm',
          value: '405066',
        },
        {
          label: '405080 - Knee Fracture/Tibia/Spine',
          value: '405080',
        },
        {
          label: '405280 - Knee Fracture/Tibia/Spine/Avulsion',
          value: '405280',
        },
        {
          label: '405720 - Knee Fracture/Femur/Medial Condyle/Osteochondral',
          value: '405720',
        },
        {
          label: '405730 - Knee Fracture/Femur/Lateral Condyle/Osteochondral',
          value: '405730',
        },
        {
          label: '405740 - Knee Fracture/Tibia/Medial Plateau/Osteochondral',
          value: '405740',
        },
        {
          label: '405750 - Knee Fracture/Tibia/Lateral Plateau/Osteochondral',
          value: '405750',
        },
        {
          label: '406100 - Knee Inflammation',
          value: '406100',
        },
        {
          label: '406101 - Knee Medial Inflammation',
          value: '406101',
        },
        {
          label: '406102 - Knee Lateral Inflammation',
          value: '406102',
        },
        {
          label: '406103 - Knee Anterior Inflammation',
          value: '406103',
        },
        {
          label: '406104 - Knee Posterior Inflammation',
          value: '406104',
        },
        {
          label: '406105 - Knee Inflammation/Scar Tissue',
          value: '406105',
        },
        {
          label: '406120 - Knee Osteoarthritis',
          value: '406120',
        },
        {
          label: '406121 - Knee Arthritis/Traumatic',
          value: '406121',
        },
        {
          label: '406160 - Knee Fasci-Tendinitis/Chronic',
          value: '406160',
        },
        {
          label: '406162 - Knee Ilio-Tibial Band Syndrome (ITBS)',
          value: '406162',
        },
        {
          label: '406170 - Knee Synovitis/Chronic',
          value: '406170',
        },
        {
          label: '406180 - Knee Osteochondritis',
          value: '406180',
        },
        {
          label: '406181 - Knee Osteochondritis Dissecans',
          value: '406181',
        },
        {
          label: '406190 - Knee Osteomyelitis',
          value: '406190',
        },
        {
          label: '406210 - Knee Chondromalacia',
          value: '406210',
        },
        {
          label: '406211 - Knee Chondromalacia/MFC Grade I',
          value: '406211',
        },
        {
          label: '406212 - Knee Chondromalacia/MFC Grade II',
          value: '406212',
        },
        {
          label: '406213 - Knee Chondromalacia/MFC Grade III',
          value: '406213',
        },
        {
          label: '406214 - Knee Chondromalacia/MFC Grade IV',
          value: '406214',
        },
        {
          label: '406215 - Knee Chondromalacia/LFC Grade I',
          value: '406215',
        },
        {
          label: '406216 - Knee Chondromalacia/LFC Grade II',
          value: '406216',
        },
        {
          label: '406217 - Knee Chondromalacia/LFC Grade III',
          value: '406217',
        },
        {
          label: '406218 - Knee Chondromalacia/LFC Grade IV',
          value: '406218',
        },
        {
          label: '406221 - Knee Chondromalacia/MTP Grade I',
          value: '406221',
        },
        {
          label: '406222 - Knee Chondromalacia/MTP Grade II',
          value: '406222',
        },
        {
          label: '406223 - Knee Chondromalacia/MTP Grade III',
          value: '406223',
        },
        {
          label: '406224 - Knee Chondromalacia/MTP Grade IV',
          value: '406224',
        },
        {
          label: '406225 - Knee Chondromalacia/LTP Grade I',
          value: '406225',
        },
        {
          label: '406226 - Knee Chondromalacia/LTP Grade II',
          value: '406226',
        },
        {
          label: '406227 - Knee Chondromalacia/LTP Grade III',
          value: '406227',
        },
        {
          label: '406228 - Knee Chondromalacia/LTP Grade IV',
          value: '406228',
        },
        {
          label: '406231 - Knee Chondromalacia/Trochlea I',
          value: '406231',
        },
        {
          label: '406232 - Knee Chondromalacia/Trochlea II',
          value: '406232',
        },
        {
          label: '406233 - Knee Chondromalacia/Trochlea III',
          value: '406233',
        },
        {
          label: '406234 - Knee Chondromalacia/Trochlea IV',
          value: '406234',
        },
        {
          label: '406250 - Knee Calcification',
          value: '406250',
        },
        {
          label: '406251 - Knee Pellegrini-Stieda Syndrome (MCL)',
          value: '406251',
        },
        {
          label: '406290 - Knee Fascial Herniation',
          value: '406290',
        },
        {
          label: "406360 - Knee Popliteal Cyst (Baker's Cyst)",
          value: '406360',
        },
        {
          label: '406410 - Knee Joint Loose Bodies',
          value: '406410',
        },
        {
          label: '406420 - Knee Femoral Condylar Defect',
          value: '406420',
        },
        {
          label: '406421 - Knee Trochlear Osetochondral Defect',
          value: '406421',
        },
        {
          label: '406460 - Knee Degeneration',
          value: '406460',
        },
        {
          label: '406471 - Knee Fat Pad Impingement',
          value: '406471',
        },
        {
          label: '406473 - Knee Lateral Impingement',
          value: '406473',
        },
        {
          label: '406474 - Knee Impingement',
          value: '406474',
        },
        {
          label: '406491 - Knee Arthrofibrosis',
          value: '406491',
        },
        {
          label: '406492 - Knee Flexion Contracture',
          value: '406492',
        },
        {
          label: '406493 - Knee Hypertrophic Scar',
          value: '406493',
        },
        {
          label: '406510 - Knee Internal Derangement',
          value: '406510',
        },
        {
          label: '406570 - Knee Synovial Plica Syndrome',
          value: '406570',
        },
        {
          label: '406571 - Knee Medial Synovial Plica Syndrome',
          value: '406571',
        },
        {
          label: '406573 - Knee Pigmented Villonodular Synovitis',
          value: '406573',
        },
        {
          label: '408100 - Knee General Stress',
          value: '408100',
        },
        {
          label: '408200 - Knee Dysfunction/Congenital',
          value: '408200',
        },
        {
          label: '408500 - Knee Abscess',
          value: '408500',
        },
        {
          label: '408753 - Knee Joint Infection',
          value: '408753',
        },
        {
          label: '408754 - Knee External Skin Infection',
          value: '408754',
        },
        {
          label: '408755 - Knee Joint Staph Infection - MRSA',
          value: '408755',
        },
        {
          label: '408756 - Knee Joint Staph Infection - MSSA',
          value: '408756',
        },
        {
          label: '408757 - Knee External Skin Staph Infection - MRSA',
          value: '408757',
        },
        {
          label: '408758 - Knee External Skin Staph Infection - MSSA',
          value: '408758',
        },
        {
          label: '408800 - Knee Non-disease/Atypical Condition',
          value: '408800',
        },
        {
          label: '410000 - Patella General Trauma',
          value: '410000',
        },
        {
          label: '410100 - Patella Abrasion',
          value: '410100',
        },
        {
          label: '410200 - Patella Contusion',
          value: '410200',
        },
        {
          label: '410201 - Patella Anterior Contusion',
          value: '410201',
        },
        {
          label: '410202 - Patella Posterior Contusion',
          value: '410202',
        },
        {
          label: '410203 - Patella Medial Contusion',
          value: '410203',
        },
        {
          label: '410204 - Patella Lateral Contusion',
          value: '410204',
        },
        {
          label: '410205 - Patella Superior Contusion',
          value: '410205',
        },
        {
          label: '410210 - Patella Prepatellar Bursa Contusion',
          value: '410210',
        },
        {
          label: '410220 - Patella Suprapatllar Bursa Contusion',
          value: '410220',
        },
        {
          label: '410230 - Patella Tendon Contusion',
          value: '410230',
        },
        {
          label: '410240 - Patellofemoral Contusion',
          value: '410240',
        },
        {
          label: '410250 - Patella Chondral Defect',
          value: '410250',
        },
        {
          label: '410300 - Patella Puncture Wound',
          value: '410300',
        },
        {
          label: '410400 - Patella Laceration',
          value: '410400',
        },
        {
          label: '410500 - Patella Bursitis',
          value: '410500',
        },
        {
          label: '410510 - Patella Prepatellar Bursitis',
          value: '410510',
        },
        {
          label: '410520 - Patella Suprapatellar Bursitis',
          value: '410520',
        },
        {
          label: '410530 - Patella Infrapatellar Bursitis',
          value: '410530',
        },
        {
          label: '410600 - Patella Tenosynovitis-Tendinitis/Acute',
          value: '410600',
        },
        {
          label: '410601 - Patella Tendinitis/Inferior Pole',
          value: '410601',
        },
        {
          label: '410603 - Knee Quadriceps Tendonitis/Acute',
          value: '410603',
        },
        {
          label: '411610 - Patella Entrapment Syndrome',
          value: '411610',
        },
        {
          label: '413401 - Patella Subluxation/Acute - Lateral',
          value: '413401',
        },
        {
          label: '413402 - Patella Subluxation/Acute - Medial',
          value: '413402',
        },
        {
          label: '413501 - Patella Subluxation/Recurrent - Lateral',
          value: '413501',
        },
        {
          label: '413502 - Patella Subluxation/Recurrent - Medial',
          value: '413502',
        },
        {
          label: '413601 - Patella Dislocation/Acute - Lateral',
          value: '413601',
        },
        {
          label: '413602 - Patella Dislocation/Acute - Medial',
          value: '413602',
        },
        {
          label: '413701 - Patella Dislocation/Recurrent - Lateral',
          value: '413701',
        },
        {
          label: '413702 - Patella Dislocation/Recurrent - Medial',
          value: '413702',
        },
        {
          label: '414100 - Patella Tendon Strain 1 Deg',
          value: '414100',
        },
        {
          label: '414200 - Patella Tendon Strain 2 Deg',
          value: '414200',
        },
        {
          label: '414300 - Patella Tendon Strain 3 Deg (Complete Tear)',
          value: '414300',
        },
        {
          label: '414500 - Patellar Tendon Laceration',
          value: '414500',
        },
        {
          label: '415000 - Patella Fracture',
          value: '415000',
        },
        {
          label: '415100 - Patella Fracture/Open',
          value: '415100',
        },
        {
          label: '415210 - Patella Fracture/Inferior Pole/Avulsion',
          value: '415210',
        },
        {
          label: '415700 - Patella Fracture/Osteochondral',
          value: '415700',
        },
        {
          label: '415710 - Patella Fracture/Osteochondral/Medial Facet',
          value: '415710',
        },
        {
          label: '415720 - Patella Fracture/Osteochondral/Lateral Facet',
          value: '415720',
        },
        {
          label: '415901 - Patellar Facture/Comminuted',
          value: '415901',
        },
        {
          label: '416100 - Patella Inflammation',
          value: '416100',
        },
        {
          label: '416101 - Patella Femoral Inflammation',
          value: '416101',
        },
        {
          label: '416111 - Patella Osteochondritis Dissecans',
          value: '416111',
        },
        {
          label: '416131 - Patella Stress Reaction',
          value: '416131',
        },
        {
          label: '416160 - Patella Fasci/Tendinitis (Chronic)',
          value: '416160',
        },
        {
          label: '416161 - Patella Tendinitis (Chronic)',
          value: '416161',
        },
        {
          label: '416162 - Patella Tendinitis Inferior Pole (Chronic)',
          value: '416162',
        },
        {
          label: '416163 - Quadriceps Tendonitis/Chronic',
          value: '416163',
        },
        {
          label: '416164 - Patella Tendonosis/Inferior Pole',
          value: '416164',
        },
        {
          label: '416165 - Quadriceps Tendonosis',
          value: '416165',
        },
        {
          label: '416200 - Patella Femoral Syndrome',
          value: '416200',
        },
        {
          label: '416201 - Patella Femoral Compression Syndrome',
          value: '416201',
        },
        {
          label: '416210 - Patella Chondromalacia',
          value: '416210',
        },
        {
          label: '416211 - Patella Chondromalacia/Medial',
          value: '416211',
        },
        {
          label: '416221 - Patella Chondromalacia/Lateral',
          value: '416221',
        },
        {
          label: '416230 - Patella Femoral Arthritis',
          value: '416230',
        },
        {
          label: '416240 - Patella Exostosis',
          value: '416240',
        },
        {
          label: '416310 - Patella Bone Cyst/Solitary',
          value: '416310',
        },
        {
          label: '416410 - Patella Intra-articular Loose Body',
          value: '416410',
        },
        {
          label: '416411 - Patella Trochlear Dysplasia',
          value: '416411',
        },
        {
          label: '416471 - Patella Alta',
          value: '416471',
        },
        {
          label: '416472 - Patella Baja',
          value: '416472',
        },
        {
          label: '418600 - Patella Infection',
          value: '418600',
        },
        {
          label: '418800 - Patella Non-Disease/Atypical Condition',
          value: '418800',
        },
        {
          label: '419700 - Patella Patellectomy',
          value: '419700',
        },
        {
          label: '420010 - Shin Splints',
          value: '420010',
        },
        {
          label: '420220 - Tibia Bony Contusion',
          value: '420220',
        },
        {
          label: '420500 - Leg Bursitis',
          value: '420500',
        },
        {
          label: '420800 - Tibia Compartment Syndrome',
          value: '420800',
        },
        {
          label: '420810 - Tibia Anterior Compartment Seroma',
          value: '420810',
        },
        {
          label: '420910 - Tibia Lower Leg/Anterior Cramps',
          value: '420910',
        },
        {
          label: '421500 - Tibia Soft Tissue Nerve Contusion',
          value: '421500',
        },
        {
          label: '423000 - Leg Muscle Sprain (non-specific)',
          value: '423000',
        },
        {
          label: '423020 - Tibio-Fibular Sprain/Proximal',
          value: '423020',
        },
        {
          label: '424011 - Tibialis Anterior Strain',
          value: '424011',
        },
        {
          label: '424012 - Leg Extensor Digitorum Longus Strain',
          value: '424012',
        },
        {
          label: '424014 - Leg Extensor Hallucis Longus Strain',
          value: '424014',
        },
        {
          label: '424015 - Tibia Patellar Tendon Strain',
          value: '424015',
        },
        {
          label: '424021 - Peroneus Longus Strain',
          value: '424021',
        },
        {
          label: '424022 - Peroneus Brevis Strain',
          value: '424022',
        },
        {
          label: '424031 - Tibia Tibialis Posterior Strain',
          value: '424031',
        },
        {
          label: '424420 - Patellar Tendon Avulsion',
          value: '424420',
        },
        {
          label: '424521 - Patellar Tendon Rupture',
          value: '424521',
        },
        {
          label: '425110 - Tibia Fracture/Shaft/Open',
          value: '425110',
        },
        {
          label: '425120 - Tibia Fracture/Middle/Open',
          value: '425120',
        },
        {
          label: '425130 - Tibia Fracture/Proximal/Open',
          value: '425130',
        },
        {
          label: '425140 - Tibia Fracture/Distal/Open',
          value: '425140',
        },
        {
          label: '425231 - Tibia Fracture/Tubercle Avulsion',
          value: '425231',
        },
        {
          label: '425510 - Tibia Fracture/Shaft/Stress',
          value: '425510',
        },
        {
          label: '425530 - Tibia Fracture/Proximal/Stress',
          value: '425530',
        },
        {
          label: '425540 - Tibia Fracture/Distal/Stress',
          value: '425540',
        },
        {
          label: '425840 - Tibia Fracture/Distal (Intra-articular)',
          value: '425840',
        },
        {
          label: '425911 - Tibia Fracture/Shaft/Closed',
          value: '425911',
        },
        {
          label: '425920 - Tibia Fracture/Middle/Closed',
          value: '425920',
        },
        {
          label: '425930 - Tibia Fracture/Proximal/Closed',
          value: '425930',
        },
        {
          label: '425941 - Tibia Fracture/Distal/Closed',
          value: '425941',
        },
        {
          label: '426100 - Leg Musculoskeletal Inflammation/Pes Anserine',
          value: '426100',
        },
        {
          label: '426101 - Leg Cellulitis',
          value: '426101',
        },
        {
          label: '426120 - Leg Tubercle Apophysitis',
          value: '426120',
        },
        {
          label: "426121 - Leg Osgood/Schlatter's Syndrome",
          value: '426121',
        },
        {
          label: '426130 - Tibia Periostitis',
          value: '426130',
        },
        {
          label: '426131 - Tibial Stress Reaction',
          value: '426131',
        },
        {
          label: '426190 - Tibia Osteoid Osteoma',
          value: '426190',
        },
        {
          label: '426200 - Calf Herniated Muscle',
          value: '426200',
        },
        {
          label: '426240 - Tibia Exostosis',
          value: '426240',
        },
        {
          label: '426270 - Leg Soft Tissue Calcification',
          value: '426270',
        },
        {
          label: '426290 - Leg Fascial Herniation',
          value: '426290',
        },
        {
          label: '426310 - Tibia Bone Cyst/Solitary',
          value: '426310',
        },
        {
          label: '428700 - Tibia Infection',
          value: '428700',
        },
        {
          label: '430210 - Fibula Bony Contusion',
          value: '430210',
        },
        {
          label: '430214 - Calf Muscle Contusion',
          value: '430214',
        },
        {
          label: '430250 - Leg Soft Tissue Hematoma',
          value: '430250',
        },
        {
          label: '430604 - Posterior Tibialis Tendinitis',
          value: '430604',
        },
        {
          label: '430620 - Fibula Peroneus Tendinitis',
          value: '430620',
        },
        {
          label: '430800 - Leg Vascular Injury',
          value: '430800',
        },
        {
          label: '430910 - Calf Muscle Spasm',
          value: '430910',
        },
        {
          label: '431510 - Fibula Nerve Injury with Sensory Loss',
          value: '431510',
        },
        {
          label: '431520 - Fibula Nerve Injury with Motor Loss',
          value: '431520',
        },
        {
          label: '431530 - Fibula Nerve Injury with Motor and Sensory Loss',
          value: '431530',
        },
        {
          label: '432110 - Leg Burn 1 Deg',
          value: '432110',
        },
        {
          label: '432210 - Leg Burn 2 Deg',
          value: '432210',
        },
        {
          label: '432310 - Leg Burn 3 Deg',
          value: '432310',
        },
        {
          label: '433600 - Fibula Superior Tibio-Fibular Dislocation',
          value: '433600',
        },
        {
          label: '434001 - Calf Plantaris Strain',
          value: '434001',
        },
        {
          label: '434002 - Calf Gastrocnemius Strain',
          value: '434002',
        },
        {
          label: '434003 - Calf Soleus Strain',
          value: '434003',
        },
        {
          label: '434005 - Leg Flexor Digitorum Longus Tendinitis',
          value: '434005',
        },
        {
          label: '434006 - Leg Flexor Hallucis Longus Tendinitis',
          value: '434006',
        },
        {
          label: '434400 - Leg Tendon Avulsion',
          value: '434400',
        },
        {
          label: '434500 - Calf Gastrocnemius Tear/Rupture',
          value: '434500',
        },
        {
          label: '435010 - Fibula Fracture/Head',
          value: '435010',
        },
        {
          label: '435020 - Fibula Fracture/Neck',
          value: '435020',
        },
        {
          label: '435030 - Fibula Fracture/Shaft',
          value: '435030',
        },
        {
          label: '435040 - Fibula Fracture/Proximal',
          value: '435040',
        },
        {
          label: '435050 - Fibula Fracture/Distal',
          value: '435050',
        },
        {
          label: '435110 - Fibula Fracture/Head/Open',
          value: '435110',
        },
        {
          label: '435120 - Fibula Fracture/Neck/Open',
          value: '435120',
        },
        {
          label: '435130 - Fibula Fracture/Shaft/Open',
          value: '435130',
        },
        {
          label: '435140 - Fibula Fracture/Proximal/Open',
          value: '435140',
        },
        {
          label: '435200 - Fibula Fracture/avulsion',
          value: '435200',
        },
        {
          label: '435500 - Fibula Fracture/Distal/Stress',
          value: '435500',
        },
        {
          label: '435520 - Fibula Fracture/Neck/Stress',
          value: '435520',
        },
        {
          label: '435530 - Fibula Fracture/Shaft/Stress',
          value: '435530',
        },
        {
          label: '436001 - Leg Removal of Internal Fixation',
          value: '436001',
        },
        {
          label: '436130 - Fibula Periostitis',
          value: '436130',
        },
        {
          label: '436131 - Fibula Stress Reaction',
          value: '436131',
        },
        {
          label: '436270 - Leg Myositis Ossificans',
          value: '436270',
        },
        {
          label: '436290 - Fibula Fascial Herniation',
          value: '436290',
        },
        {
          label: '438600 - Fibula Infection',
          value: '438600',
        },
        {
          label: '438601 - Leg Staph Infection - MRSA',
          value: '438601',
        },
        {
          label: '438602 - Leg Staph Infection - MSSA',
          value: '438602',
        },
        {
          label: '440005 - Ankle Os Trigonum Syndrome',
          value: '440005',
        },
        {
          label: '440010 - Ankle Peroneal Tendon Subluxation/Dislocation/Acute',
          value: '440010',
        },
        {
          label:
            '440020 - Ankle Peroneal Tendon Subluxation/Dislocation/Recurrent',
          value: '440020',
        },
        {
          label: '440030 - Ankle Posterior Tibial Tendon Dislocation',
          value: '440030',
        },
        {
          label: '440100 - Ankle Abrasion',
          value: '440100',
        },
        {
          label: '440101 - Ankle Posterior Skin Abrasion',
          value: '440101',
        },
        {
          label: '440102 - Ankle Anterior Skin Abrasion',
          value: '440102',
        },
        {
          label: '440200 - Ankle Contusion',
          value: '440200',
        },
        {
          label: '440250 - Ankle Contusion/Talus',
          value: '440250',
        },
        {
          label: '440251 - Ankle Contusion/Talus Dome',
          value: '440251',
        },
        {
          label: '440300 - Ankle Puncture Wound',
          value: '440300',
        },
        {
          label: '440400 - Ankle Laceration',
          value: '440400',
        },
        {
          label: '440401 - Ankle Posterior Skin Laceration',
          value: '440401',
        },
        {
          label: '440402 - Ankle Anterior Skin Laceration',
          value: '440402',
        },
        {
          label: '440500 - Ankle Bursitis',
          value: '440500',
        },
        {
          label: '440612 - Ankle Achilles Tenosynovitis-Tendinitis/Insertional',
          value: '440612',
        },
        {
          label:
            '440613 - Ankle Achilles Tenosynovitis-Tendinitis/Noninsertional',
          value: '440613',
        },
        {
          label: '440614 - Ankle Achilles Tendinitis - Insertional',
          value: '440614',
        },
        {
          label: '440615 - Ankle Achilles Tendinitis - Midsubstance',
          value: '440615',
        },
        {
          label: '440616 - Ankle Achilles Tendinosis',
          value: '440616',
        },
        {
          label: '440620 - Ankle Peroneal Tenosynovitis-Tendinitis',
          value: '440620',
        },
        {
          label: '440630 - Ankle Posterior Tibial Tenosynovitis',
          value: '440630',
        },
        {
          label: '440640 - Ankle Anterior Tibial Tendon Tenosynovitis',
          value: '440640',
        },
        {
          label: '440700 - Ankle Capsulitis/Synovitis',
          value: '440700',
        },
        {
          label: '440800 - Ankle Vascular Trauma',
          value: '440800',
        },
        {
          label: '441600 - Ankle Nerve Disorder',
          value: '441600',
        },
        {
          label: '441641 - Ankle Ganglion Cyst',
          value: '441641',
        },
        {
          label: '442100 - Ankle Burn 1 Deg',
          value: '442100',
        },
        {
          label: '442200 - Ankle Burn 2 Deg',
          value: '442200',
        },
        {
          label: '442300 - Ankle Burn 3 Deg',
          value: '442300',
        },
        {
          label: '442400 - Ankle Friction Blister',
          value: '442400',
        },
        {
          label: '443010 - Lateral Ankle Sprain / Ligament Unknown',
          value: '443010',
        },
        {
          label: '443012 - Lateral Ankle Sprain / Anterior Talofibular',
          value: '443012',
        },
        {
          label: '443013 - Lateral Ankle Sprain / Posterior Talofibular',
          value: '443013',
        },
        {
          label: '443014 - Lateral Ankle Sprain / Calcaneofibular',
          value: '443014',
        },
        {
          label: '443015 - Calcaneo-Cuboid Ligament Sprain',
          value: '443015',
        },
        {
          label: '443016 - Ankle Subtalar Joint Ligament Sprain',
          value: '443016',
        },
        {
          label: '443021 - Medial Ankle Sprain / Deltoid',
          value: '443021',
        },
        {
          label: '443022 - High Ankle Sprain / Anterior Tibiofibular',
          value: '443022',
        },
        {
          label: '443023 - High Ankle Sprain / Posterior Tibiofibular',
          value: '443023',
        },
        {
          label: '443030 - Ankle Peroneal/Posterior Retinacular Sprain',
          value: '443030',
        },
        {
          label: '443032 - Ankle Posterior Retinacular Sprain',
          value: '443032',
        },
        {
          label: '443033 - High Ankle Sprain / Syndesmotic',
          value: '443033',
        },
        {
          label: '443600 - Ankle Dislocation',
          value: '443600',
        },
        {
          label: '443610 - Ankle Subtalar/Under Foot Dislocation',
          value: '443610',
        },
        {
          label: '443800 - Ankle Dislocation/Open',
          value: '443800',
        },
        {
          label: '444010 - Ankle Achilles Tendon Strain',
          value: '444010',
        },
        {
          label: '444020 - Ankle Peroneal Muscle/Tendon Strain',
          value: '444020',
        },
        {
          label: '444030 - Ankle Posterior Tibialis Strain',
          value: '444030',
        },
        {
          label: '444040 - Ankle Anterior Tibialis Strain',
          value: '444040',
        },
        {
          label: '444410 - Ankle Achilles Tendon Avulsion/Insertional Rupture',
          value: '444410',
        },
        {
          label: '444510 - Ankle Achilles Tendon Laceration',
          value: '444510',
        },
        {
          label: '444511 - Ankle Achilles Tendon Rupture',
          value: '444511',
        },
        {
          label: '444512 - Ankle Rupture - Midsubstance',
          value: '444512',
        },
        {
          label: '445010 - Ankle Fracture/Lateral Malleolus',
          value: '445010',
        },
        {
          label: '445020 - Ankle Fracture/Medial Malleolus',
          value: '445020',
        },
        {
          label: '445030 - Ankle Fracture/Posterior Malleolus',
          value: '445030',
        },
        {
          label: '445040 - Ankle Fracture/Talus/Body',
          value: '445040',
        },
        {
          label: '445050 - Ankle Fracture/Talus/Neck',
          value: '445050',
        },
        {
          label: '445060 - Ankle Fracture/Talus/Head',
          value: '445060',
        },
        {
          label: '445070 - Ankle Fracture/Talus/Dome',
          value: '445070',
        },
        {
          label: '445080 - Ankle Fracture/Talus/Posterior Process',
          value: '445080',
        },
        {
          label: '445110 - Ankle Fracture/Lateral Malleolus/Open',
          value: '445110',
        },
        {
          label: '445120 - Ankle Fracture/Medial Malleolus/Open',
          value: '445120',
        },
        {
          label: '445130 - Ankle Fracture/Posterior Malleolus/Open',
          value: '445130',
        },
        {
          label: '445170 - Ankle Fracture/Talar/Open',
          value: '445170',
        },
        {
          label: '445210 - Ankle Fracture/Lateral Malleolus/Avulsion',
          value: '445210',
        },
        {
          label: '445221 - Ankle Fracture/Medial Malleolus/Deltoid/Avulsion',
          value: '445221',
        },
        {
          label: '445230 - Ankle Fracture/Posterior Malleolus/Avulsion',
          value: '445230',
        },
        {
          label: '445510 - Ankle Fracture/Lateral Malleolus/Stress',
          value: '445510',
        },
        {
          label: '445520 - Ankle Fracture/Medial Malleolus/Stress',
          value: '445520',
        },
        {
          label: '445560 - Ankle Fracture/Talus/Stress',
          value: '445560',
        },
        {
          label: '445580 - Ankle Fracture/Talus/Posterior Process/Stress',
          value: '445580',
        },
        {
          label: '445770 - Ankle Fracture/Talus/Dome/Osteochondral',
          value: '445770',
        },
        {
          label: '446170 - Ankle Synovitis/Chronic',
          value: '446170',
        },
        {
          label: '446190 - Ankle Osteomyelitis',
          value: '446190',
        },
        {
          label: '446220 - Ankle Chondromalacia',
          value: '446220',
        },
        {
          label: '446230 - Ankle Traumatic Arthritis',
          value: '446230',
        },
        {
          label: '446240 - Ankle Exostosis',
          value: '446240',
        },
        {
          label: '446250 - Ankle Calcification',
          value: '446250',
        },
        {
          label: '446310 - Ankle Bone Cyst/Talus',
          value: '446310',
        },
        {
          label: '446402 - Ankle Posterior Impingement',
          value: '446402',
        },
        {
          label: '446410 - Ankle Joint Loose Bodies',
          value: '446410',
        },
        {
          label: '446411 - Ankle Anterior Impingement',
          value: '446411',
        },
        {
          label: '446460 - Ankle Degeneration/Chronic',
          value: '446460',
        },
        {
          label: '446470 - Ankle Developmental Defect/Bone',
          value: '446470',
        },
        {
          label: '448100 - Ankle General Stress Injury',
          value: '448100',
        },
        {
          label: '448500 - Ankle Abscess',
          value: '448500',
        },
        {
          label: '448600 - Ankle Infection',
          value: '448600',
        },
        {
          label: '448630 - Ankle Infection / Posterior',
          value: '448630',
        },
        {
          label: '448703 - Ankle Joint Staph Infection - MRSA',
          value: '448703',
        },
        {
          label: '448704 - Ankle Joint Staph Infection - MSSA',
          value: '448704',
        },
        {
          label: '448705 - Ankle External Skin Staph Infection - MRSA',
          value: '448705',
        },
        {
          label: '448706 - Ankle External Skin Staph Infection - MSSA',
          value: '448706',
        },
        {
          label: '450110 - Foot Abrasion/Plantar Surface',
          value: '450110',
        },
        {
          label: '450130 - Foot Abrasion/Dorsal Surface',
          value: '450130',
        },
        {
          label: '450210 - Foot Contusion/Plantar Surface',
          value: '450210',
        },
        {
          label: '450220 - Foot Ganglion',
          value: '450220',
        },
        {
          label: '450230 - Foot Contusion/Dorsal Surface',
          value: '450230',
        },
        {
          label: '450241 - Foot 1st Metatarsal Contusion',
          value: '450241',
        },
        {
          label: '450242 - Foot 2nd Metatarsal Contusion',
          value: '450242',
        },
        {
          label: '450243 - Foot 3rd Metatarsal Contusion',
          value: '450243',
        },
        {
          label: '450244 - Foot 4th Metatarsal Contusion',
          value: '450244',
        },
        {
          label: '450245 - Foot 5th Metatarsal Contusion',
          value: '450245',
        },
        {
          label: '450300 - Foot Puncture Wound',
          value: '450300',
        },
        {
          label: '450400 - Foot Laceration',
          value: '450400',
        },
        {
          label: '450500 - Foot Bursitis',
          value: '450500',
        },
        {
          label: '450700 - Foot Synovitis',
          value: '450700',
        },
        {
          label: '450900 - Foot Muscle Cramps',
          value: '450900',
        },
        {
          label: '451510 - Foot Nerve Contusion w/Sensory Loss',
          value: '451510',
        },
        {
          label: '451520 - Foot Nerve Contusion w/Motor Loss',
          value: '451520',
        },
        {
          label: '451530 - Foot Nerve Contusion w/S&M Loss',
          value: '451530',
        },
        {
          label: '451600 - Foot Nerve Disorder',
          value: '451600',
        },
        {
          label: '451610 - Foot Tarsal Tunnel Syndrome',
          value: '451610',
        },
        {
          label: '452100 - Foot Burn 1 Deg',
          value: '452100',
        },
        {
          label: '452200 - Foot Burn 2 Deg',
          value: '452200',
        },
        {
          label: '452300 - Foot Burn 3 Deg',
          value: '452300',
        },
        {
          label: '452400 - Foot Friction Blister',
          value: '452400',
        },
        {
          label: '453002 - Foot Arch Sprain/Traumatic/Plantar Fascial',
          value: '453002',
        },
        {
          label: '453005 - Foot Pes Planus Symptomatic/Congenital',
          value: '453005',
        },
        {
          label: '453008 - Foot Pes Cavus Symptomatic',
          value: '453008',
        },
        {
          label: '453011 - Foot Transverse Arch Sprain',
          value: '453011',
        },
        {
          label: '453012 - Foot Spring Ligament Sprain',
          value: '453012',
        },
        {
          label: '453016 - Foot Calcaneocuboid Sprain',
          value: '453016',
        },
        {
          label: '453017 - Foot Plantar Fascia Tear/Rupture',
          value: '453017',
        },
        {
          label: '453020 - Foot Midtarsal Sprain',
          value: '453020',
        },
        {
          label: '453021 - Foot Lis-Franc Sprain',
          value: '453021',
        },
        {
          label: '453022 - Foot Tarso-Navicular Sprain',
          value: '453022',
        },
        {
          label: '453030 - Foot Tarsometatarsal Sprain',
          value: '453030',
        },
        {
          label: '453321 - Foot Lis-Franc Subluxation/Dislocation',
          value: '453321',
        },
        {
          label: '453410 - Foot Talonavicular Subluxation/Dislocation',
          value: '453410',
        },
        {
          label: '453450 - Foot Midtarsal Subluxation/Dislocation/Acute',
          value: '453450',
        },
        {
          label: '453460 - Foot Tarsometatarsal Subluxation/Dislocation/Acute',
          value: '453460',
        },
        {
          label: '453551 - Foot Cuboid Subluxation (Syndrome)',
          value: '453551',
        },
        {
          label: '453600 - Foot Dislocation',
          value: '453600',
        },
        {
          label: '454011 - Foot Extensor Digitorum Brevis Strain',
          value: '454011',
        },
        {
          label: '454021 - Foot Anterior Tibialis Strain/Distal',
          value: '454021',
        },
        {
          label: '454030 - Foot Intrinsic Muscle Group Strain',
          value: '454030',
        },
        {
          label: '454500 - Foot Tendon Laceration',
          value: '454500',
        },
        {
          label: '455010 - Foot Fracture/Tarsal Navicular/Accessory',
          value: '455010',
        },
        {
          label: '455011 - Foot Jones Fracture/5th Metatarsal',
          value: '455011',
        },
        {
          label: '455020 - Foot Fracture/Cuboid',
          value: '455020',
        },
        {
          label: '455030 - Foot Fracture/Cuneiform',
          value: '455030',
        },
        {
          label: '455041 - Foot Fracture/5th Metatarsal/Base',
          value: '455041',
        },
        {
          label: '455042 - Foot Fracture/4th Metatarsal/Base',
          value: '455042',
        },
        {
          label: '455043 - Foot Fracture/3rd Metatarsal/Base',
          value: '455043',
        },
        {
          label: '455044 - Foot Fracture/2nd Metatarsal/Base',
          value: '455044',
        },
        {
          label: '455045 - Foot Fracture/1st Metatarsal/Base',
          value: '455045',
        },
        {
          label: '455051 - Foot Fracture/5th Metatarsal/Head',
          value: '455051',
        },
        {
          label: '455052 - Foot Fracture/4th Metatarsal/Head',
          value: '455052',
        },
        {
          label: '455053 - Foot Fracture/3rd Metatarsal/Head',
          value: '455053',
        },
        {
          label: '455054 - Foot Fracture/2nd Metatarsal/Head',
          value: '455054',
        },
        {
          label: '455055 - Foot Fracture/1st Metatarsal/Head',
          value: '455055',
        },
        {
          label: '455061 - Foot Fracture/5th Metatarsal/Neck',
          value: '455061',
        },
        {
          label: '455062 - Foot Fracture/4th Metatarsal/Neck',
          value: '455062',
        },
        {
          label: '455063 - Foot Fracture/3rd Metatarsal/Neck',
          value: '455063',
        },
        {
          label: '455064 - Foot Fracture/2nd Metatarsal/Neck',
          value: '455064',
        },
        {
          label: '455065 - Foot Fracture/1st Metatarsal/Neck',
          value: '455065',
        },
        {
          label: '455071 - Foot Fracture/5th Metatarsal/Shaft',
          value: '455071',
        },
        {
          label: '455072 - Foot Fracture/4th Metatarsal/Shaft',
          value: '455072',
        },
        {
          label: '455073 - Foot Fracture/3rd Metatarsal/Shaft',
          value: '455073',
        },
        {
          label: '455074 - Foot Fracture/2nd Metatarsal/Shaft',
          value: '455074',
        },
        {
          label: '455075 - Foot Fracture/1st Metatarsal/Shaft',
          value: '455075',
        },
        {
          label: '455080 - Foot Fracture/Metatarsal/Multiple',
          value: '455080',
        },
        {
          label: '455081 - Foot 5th Metatarsal Non-Union',
          value: '455081',
        },
        {
          label: '455090 - Foot Fracture/Tarsal Navicular',
          value: '455090',
        },
        {
          label: '455100 - Foot Fracture/Open',
          value: '455100',
        },
        {
          label: '455210 - Foot Fracture/Tarsal Navicular/Accessory/Avulsion',
          value: '455210',
        },
        {
          label: '455220 - Foot Fracture/Cuboid/Avulsion',
          value: '455220',
        },
        {
          label: '455230 - Foot Fracture/Cuneiform/Avulsion',
          value: '455230',
        },
        {
          label: '455240 - Foot Fracture/Metatarsal/Base/Avulsion',
          value: '455240',
        },
        {
          label: '455320 - Foot Fracture/Cuboid/Dislocation',
          value: '455320',
        },
        {
          label: '455340 - Foot Fracture/Metatarsal/Base/Dislocation',
          value: '455340',
        },
        {
          label: '455350 - Foot Fracture/Metatarsal/Head/Dislocation',
          value: '455350',
        },
        {
          label: '455520 - Foot Fracture Cuboid/Stress',
          value: '455520',
        },
        {
          label: '455530 - Foot Cuneiform Fracture/Stress',
          value: '455530',
        },
        {
          label: '455531 - Foot Fracture/1st Metatarsal/Stress',
          value: '455531',
        },
        {
          label: '455532 - Foot Fracture/2nd Metatarsal/Stress',
          value: '455532',
        },
        {
          label: '455533 - Foot Fracture/3rd Metatarsal/Stress',
          value: '455533',
        },
        {
          label: '455534 - Foot Fracture/4th Metatarsal/Stress',
          value: '455534',
        },
        {
          label: '455535 - Foot Fracture/5th Metatarsal/Stress',
          value: '455535',
        },
        {
          label: '455590 - Foot Fracture/Tarsal Navicular/Stress',
          value: '455590',
        },
        {
          label: '455710 - Foot Fracture/Talar Head/Osteochondral',
          value: '455710',
        },
        {
          label: '455750 - Foot Fracture/Metatarsal/Head/Osteochondral',
          value: '455750',
        },
        {
          label: '455790 - Foot Fracture/Tarsal Navicular/Osteochondral',
          value: '455790',
        },
        {
          label: '456121 - Foot 5th Metatarsal Ununited Apophysis',
          value: '456121',
        },
        {
          label: '456130 - Foot Periostitis',
          value: '456130',
        },
        {
          label: '456140 - Foot Sinus Tarsi Syndrome',
          value: '456140',
        },
        {
          label: '456162 - Foot Plantar Fascitis Chronic',
          value: '456162',
        },
        {
          label: '456163 - Foot Plantar Fascitis Acute',
          value: '456163',
        },
        {
          label: "456180 - Foot Metatarsal Osteochondritis/Freiberg's",
          value: '456180',
        },
        {
          label: '456230 - Foot Arthritis',
          value: '456230',
        },
        {
          label: '456240 - Foot Exostosis',
          value: '456240',
        },
        {
          label: '456250 - Foot Calcification',
          value: '456250',
        },
        {
          label: '456360 - Foot Talar Osteochondroma',
          value: '456360',
        },
        {
          label: '456361 - Foot Metatarsal Osteochondroma',
          value: '456361',
        },
        {
          label: '456480 - Foot Tarsal Coalition',
          value: '456480',
        },
        {
          label: '458110 - Foot Metatarsalgia',
          value: '458110',
        },
        {
          label: "458111 - Foot Morton's Neuroma",
          value: '458111',
        },
        {
          label: '458410 - Foot Plantar Neuroma',
          value: '458410',
        },
        {
          label: '458500 - Foot Abscess',
          value: '458500',
        },
        {
          label: '458600 - Foot Cellulitis',
          value: '458600',
        },
        {
          label: '458601 - Foot Staph Infection - MRSA',
          value: '458601',
        },
        {
          label: '458602 - Foot Staph Infection - MSSA',
          value: '458602',
        },
        {
          label: '458710 - Athletes Foot',
          value: '458710',
        },
        {
          label: '458790 - Foot Plantar Warts',
          value: '458790',
        },
        {
          label: '458810 - Foot Edema/Lymphedema',
          value: '458810',
        },
        {
          label: '458820 - Foot Atypical Condition/Navicular Joint',
          value: '458820',
        },
        {
          label: '460100 - Heel Abrasion',
          value: '460100',
        },
        {
          label: '460200 - Heel Contusion',
          value: '460200',
        },
        {
          label: '460300 - Heel Puncture',
          value: '460300',
        },
        {
          label: '460400 - Heel Laceration',
          value: '460400',
        },
        {
          label: '462400 - Heel Friction Blister',
          value: '462400',
        },
        {
          label: '465010 - Heel Fracture/Calcaneus/Body',
          value: '465010',
        },
        {
          label: '465110 - Heel Fracture/Calcaneus/Body/Open',
          value: '465110',
        },
        {
          label: '465220 - Heel Fracture/Calcaneus/Sustinaculum Tali/Avulsion',
          value: '465220',
        },
        {
          label: '465250 - Heel Fracture/Calcaneus/Tuberosity/Avulsion',
          value: '465250',
        },
        {
          label: "466120 - Heel Calcaneus Apophysitis/Sever's Apophysitis",
          value: '466120',
        },
        {
          label: '466130 - Heel Periostitis',
          value: '466130',
        },
        {
          label: '466131 - Heel Calcaneal Stress Reaction/Fracture',
          value: '466131',
        },
        {
          label: '466140 - Heel Bursitis',
          value: '466140',
        },
        {
          label: '466141 - Heel Retrocalcaneal Bursitis',
          value: '466141',
        },
        {
          label: '466240 - Heel Exostosis/Pump Bump',
          value: '466240',
        },
        {
          label: "466241 - Heel Haglund's Disease",
          value: '466241',
        },
        {
          label: '468500 - Heel Abscess',
          value: '468500',
        },
        {
          label: '468600 - Heel Infection',
          value: '468600',
        },
        {
          label: '470010 - Great Toe Nail Avulsion',
          value: '470010',
        },
        {
          label: '470200 - Great Toe Contusion',
          value: '470200',
        },
        {
          label: '470220 - Great Toe Nail Subungual Hematoma',
          value: '470220',
        },
        {
          label: '470400 - Great Toe Laceration',
          value: '470400',
        },
        {
          label: '470610 - Great Toe Extensor Hallicus Longus Tenosynovitis',
          value: '470610',
        },
        {
          label: '470620 - Great Toe Flexor Hallicus Longus Tenosynovitis',
          value: '470620',
        },
        {
          label: '471500 - Great Toe Nerve Contusion',
          value: '471500',
        },
        {
          label: '472400 - Great Toe Friction Blister',
          value: '472400',
        },
        {
          label: '473010 - Great Toe I-P Sprain',
          value: '473010',
        },
        {
          label: '473020 - Great Toe M-P Sprain/Turf Toe',
          value: '473020',
        },
        {
          label: '473610 - Great Toe I-P Subluxation/Dislocation',
          value: '473610',
        },
        {
          label: '473620 - Great Toe M-P Subluxation/Dislocation',
          value: '473620',
        },
        {
          label: '474010 - Great Toe Extensor Hallicus Longus Strain',
          value: '474010',
        },
        {
          label: '474020 - Great Toe Flexor Hallicus Longus Strain',
          value: '474020',
        },
        {
          label: '474500 - Great Toe Tendon Laceration/Rupture',
          value: '474500',
        },
        {
          label: '475010 - Great Toe Fracture/Phalanx',
          value: '475010',
        },
        {
          label: '475020 - Great Toe Fracture/Sesamoid',
          value: '475020',
        },
        {
          label: '475110 - Great Toe Fracture/Phalanx/Open',
          value: '475110',
        },
        {
          label: '475210 - Great Toe Fracture/Phalanx/Avulsion',
          value: '475210',
        },
        {
          label: '475510 - Great Toe Fracture/Phalanx/Stress',
          value: '475510',
        },
        {
          label: '475520 - Great Toe Fracture/Sesamoid/Stress',
          value: '475520',
        },
        {
          label: '475700 - Great Toe Fracture/Osteochondral',
          value: '475700',
        },
        {
          label: '475720 - Great Toe Fracture/Sesamoid/Osteochondral',
          value: '475720',
        },
        {
          label: '476170 - Great Toe Synovitis/Capsulitis',
          value: '476170',
        },
        {
          label: '476230 - Great Toe Sesamoiditis/Inflammation',
          value: '476230',
        },
        {
          label: '476231 - Great Toe Arthritis',
          value: '476231',
        },
        {
          label: '476232 - Great Toe Hallux Rigidus',
          value: '476232',
        },
        {
          label: '476410 - Great Toe Joint Loose Bodies',
          value: '476410',
        },
        {
          label: '476450 - Great Toe Bunion',
          value: '476450',
        },
        {
          label: '476470 - Great Toe Developmental Defect',
          value: '476470',
        },
        {
          label: '478140 - Great Toe Ingrown Nail',
          value: '478140',
        },
        {
          label: '478500 - Great Toe Abscess',
          value: '478500',
        },
        {
          label: '478700 - Great Toe Infection',
          value: '478700',
        },
        {
          label: '478701 - Great Toe Staph Infection - MRSA',
          value: '478701',
        },
        {
          label: '478702 - Great Toe Staph Infection - MSSA',
          value: '478702',
        },
        {
          label: '480010 - Toe Nail Avulsion Other Than Great Toe',
          value: '480010',
        },
        {
          label: '480200 - Toe Contusion',
          value: '480200',
        },
        {
          label: '480220 - Toe Nail Subungual Hematoma Other Than Great Toe',
          value: '480220',
        },
        {
          label: '480400 - Toe Laceration',
          value: '480400',
        },
        {
          label: '480610 - Toe Extensor Digitorum Longus Tenosynovitis',
          value: '480610',
        },
        {
          label: '480620 - Toe Flexor Digitorum Longus Tenosynovitis',
          value: '480620',
        },
        {
          label: '482100 - Toe Burn 1 Deg',
          value: '482100',
        },
        {
          label: '482200 - Toe Burn 2 Deg',
          value: '482200',
        },
        {
          label: '482300 - Toe Burn 3 Deg',
          value: '482300',
        },
        {
          label: '482400 - Toe Friction Blister',
          value: '482400',
        },
        {
          label: '483012 - Toe 2nd M-P Joint Sprain',
          value: '483012',
        },
        {
          label: '483013 - Toe 3rd M-P Joint Sprain',
          value: '483013',
        },
        {
          label: '483014 - Toe 4th M-P Joint Sprain',
          value: '483014',
        },
        {
          label: '483015 - Toe 5th M-P Joint Sprain',
          value: '483015',
        },
        {
          label: '483020 - Toe Interphalangeal Sprain',
          value: '483020',
        },
        {
          label: '483502 - Toe Lesser M-P Subluxation',
          value: '483502',
        },
        {
          label:
            '483610 - Toe Metatarsophalangeal Dislocation Other Than Great Toe/Hallux MP Joint',
          value: '483610',
        },
        {
          label:
            '483620 - Toe Interphalangeal Dislocation Other Than Great Toe/Hallux MP Joint',
          value: '483620',
        },
        {
          label: '484410 - Toe Extensor Digitorum Longus Avulsion/Rupture',
          value: '484410',
        },
        {
          label: '485010 - Toe Fracture/Proximal Phalanx',
          value: '485010',
        },
        {
          label: '485020 - Toe Fracture/Tuft Tip',
          value: '485020',
        },
        {
          label: '485100 - Toe Fracture/Open',
          value: '485100',
        },
        {
          label:
            '485110 - Toe Fracture/Proximal Phalanx/Open Other Than Great Toe',
          value: '485110',
        },
        {
          label: '485200 - Toe Fracture/Avulsion Other Than Great Toe',
          value: '485200',
        },
        {
          label: '485300 - Toe Fracture/Dislocation Other Than Great Toe',
          value: '485300',
        },
        {
          label: '486450 - Toe Bunionette',
          value: '486450',
        },
        {
          label: '486470 - Toe General Developmental Defect',
          value: '486470',
        },
        {
          label: '488140 - Toe Ingrown Toenail Other Than Great Toe',
          value: '488140',
        },
        {
          label: '488141 - Toe Corn',
          value: '488141',
        },
        {
          label: '488600 - Toe Infection/Cellulitis Other Than Great Toe',
          value: '488600',
        },
        {
          label: '488611 - Toe Staph Infection - MRSA',
          value: '488611',
        },
        {
          label: '488612 - Toe Staph Infection - MSSA',
          value: '488612',
        },
        {
          label: '488620 - Toe Paronychia Other Than Great Toe',
          value: '488620',
        },
        {
          label: '488700 - Toe Infection',
          value: '488700',
        },
        {
          label: '489600 - Toe Amputation',
          value: '489600',
        },
        {
          label: '490101 - Leg Skin Abrasion',
          value: '490101',
        },
        {
          label: '490201 - Leg Soft Tissue Contusion',
          value: '490201',
        },
        {
          label: '490301 - Leg Soft Tissue Puncture Wound',
          value: '490301',
        },
        {
          label: '490401 - Leg Skin Laceration',
          value: '490401',
        },
        {
          label: '496100 - Leg Tenosynovitis-Tendinitis/Acute',
          value: '496100',
        },
        {
          label: '498500 - Leg Abscess',
          value: '498500',
        },
        {
          label: '508000 - Psychological/General Stress',
          value: '508000',
        },
        {
          label: '508100 - Psychological/Illness/Acute',
          value: '508100',
        },
        {
          label: '508110 - Psychological/Anxiety Reaction',
          value: '508110',
        },
        {
          label: '508130 - Psychological/Eating Disorder',
          value: '508130',
        },
        {
          label: '508131 - Psychological/Anorexia Nervosa',
          value: '508131',
        },
        {
          label: '508132 - Psychological/Bulemia',
          value: '508132',
        },
        {
          label: '508140 - Psychological/Depression',
          value: '508140',
        },
        {
          label: '508800 - Psychological/Non-disease/atypical',
          value: '508800',
        },
        {
          label: '508811 - Neurological ADD/ADHD',
          value: '508811',
        },
        {
          label: '511510 - Neurological/Nerve Contusion w/Sensory Loss',
          value: '511510',
        },
        {
          label: '511520 - Neurological/Nerve Contusion w/Motor Loss',
          value: '511520',
        },
        {
          label: '511530 - Neurological/Nerve Contusion w/S&M Loss',
          value: '511530',
        },
        {
          label: '518600 - Neurological Infection',
          value: '518600',
        },
        {
          label: '518610 - Neurological/Neuritis',
          value: '518610',
        },
        {
          label: '518620 - Neurological/Tetanus',
          value: '518620',
        },
        {
          label: '518810 - Neurological/Atypical Condition',
          value: '518810',
        },
        {
          label: '518820 - Neurological Disorder',
          value: '518820',
        },
        {
          label: '518821 - Attention Deficit Hyperactivity Disorder (ADHD)',
          value: '518821',
        },
        {
          label: '518822 - Neurological Attention Deficit Disorder (ADD)',
          value: '518822',
        },
        {
          label: '520201 - Cervical Spinal Cord Contusion',
          value: '520201',
        },
        {
          label: '520202 - Thoracic Spinal Cord Contusion',
          value: '520202',
        },
        {
          label: '521001 - Cervical Spinal Cord Concussion',
          value: '521001',
        },
        {
          label: '521003 - Thoracic Spinal Cord Concussion',
          value: '521003',
        },
        {
          label: '521090 - Spinal Cord Cauda Equina Syndrome',
          value: '521090',
        },
        {
          label: '528610 - Spinal Cord Aseptic Meningitis',
          value: '528610',
        },
        {
          label: '528710 - Spinal Cord Viral Meningitis',
          value: '528710',
        },
        {
          label: '529220 - Spinal Cord Quadriplegia',
          value: '529220',
        },
        {
          label: '529300 - Spinal Cord Paraplegia',
          value: '529300',
        },
        {
          label: '530800 - Respiratory Pulmonary Embolism',
          value: '530800',
        },
        {
          label: '538000 - Respiratory Illness',
          value: '538000',
        },
        {
          label: '538010 - Respiratory Common Cold',
          value: '538010',
        },
        {
          label: '538100 - Respiratory Distress/General',
          value: '538100',
        },
        {
          label: '538110 - Respiratory Hyperventilation',
          value: '538110',
        },
        {
          label: '538200 - Respiratory Illness/Congenital',
          value: '538200',
        },
        {
          label: '538310 - Respiratory Asthma/Bronchial',
          value: '538310',
        },
        {
          label: '538311 - Respiratory Asthma/Exercise Induced',
          value: '538311',
        },
        {
          label: '538320 - Respiratory Hay Fever',
          value: '538320',
        },
        {
          label: '538450 - Respiratory Malignancy',
          value: '538450',
        },
        {
          label: '538600 - Respiratory Infection',
          value: '538600',
        },
        {
          label: '538610 - Respiratory Pneumonia/Acute',
          value: '538610',
        },
        {
          label: '538620 - Respiratory Viral Pleurisy',
          value: '538620',
        },
        {
          label: '538700 - Respiratory Upper Infection',
          value: '538700',
        },
        {
          label: '538701 - Respiratory Upper Infection/Viral',
          value: '538701',
        },
        {
          label: '538710 - Respiratory Acute Bronchitis',
          value: '538710',
        },
        {
          label: '538720 - Respiratory Tuberculosis',
          value: '538720',
        },
        {
          label: '538730 - Respiratory Mycoplasma Bronchitis',
          value: '538730',
        },
        {
          label: '538741 - Close Contact with COVID-19 - Monitoring',
          value: '538741',
        },
        {
          label: '538742 - Unconfirmed positive COVID-19 test',
          value: '538742',
        },
        {
          label: '538747 - Confirmed COVID-19 with symptoms',
          value: '538747',
        },
        {
          label: '538748 - Confirmed COVID-19 without symptoms',
          value: '538748',
        },
        {
          label: '538749 - Confirmed COVID-19, unknown if symptomatic',
          value: '538749',
        },
        {
          label: '538800 - Respiratory Non-disease/Atypical Condition',
          value: '538800',
        },
        {
          label: '538810 - Respiratory Pleurisy',
          value: '538810',
        },
        {
          label: '538811 - Allergic Rhinitis',
          value: '538811',
        },
        {
          label: '538812 - Reactive Airway Disease/Asthma',
          value: '538812',
        },
        {
          label: '546101 - Skin Eczema',
          value: '546101',
        },
        {
          label: '548100 - Skin Rash (non-specific)',
          value: '548100',
        },
        {
          label: '548110 - Skin Dermatitis Contact',
          value: '548110',
        },
        {
          label: '548120 - Skin Frostbite',
          value: '548120',
        },
        {
          label: '548150 - Skin Intertrigo',
          value: '548150',
        },
        {
          label: '548170 - Skin Insect Sting/Localized',
          value: '548170',
        },
        {
          label: '548300 - Skin Allergy',
          value: '548300',
        },
        {
          label: '548310 - Skin Hives',
          value: '548310',
        },
        {
          label: '548410 - Skin Melanoma/Malignant',
          value: '548410',
        },
        {
          label: '548500 - Skin Abscess',
          value: '548500',
        },
        {
          label: '548600 - Skin Infection',
          value: '548600',
        },
        {
          label: '548610 - Skin Pityriasis Rosea',
          value: '548610',
        },
        {
          label: '548620 - Skin Cellulitis',
          value: '548620',
        },
        {
          label: '548630 - Skin Furunculosis/Boil',
          value: '548630',
        },
        {
          label: '548650 - Skin Poison Ivy',
          value: '548650',
        },
        {
          label: '548660 - Skin Moniliasis Cutaneous',
          value: '548660',
        },
        {
          label: '548670 - Skin Ringworm',
          value: '548670',
        },
        {
          label: '548680 - Skin Wart',
          value: '548680',
        },
        {
          label: '548690 - Skin Carbuncle',
          value: '548690',
        },
        {
          label: '548710 - Skin Herpes Simplex',
          value: '548710',
        },
        {
          label: '548712 - Skin Herpes Zoster',
          value: '548712',
        },
        {
          label: '548713 - Skin Herpes Zoster (shingles)',
          value: '548713',
        },
        {
          label: '548719 - Skin Herpes Virus',
          value: '548719',
        },
        {
          label: '548720 - Skin Scabies',
          value: '548720',
        },
        {
          label: '548730 - Skin Hand/Foot & Mouth Disease',
          value: '548730',
        },
        {
          label: '548750 - Skin Impetigo',
          value: '548750',
        },
        {
          label: '548760 - Skin Molluscum Contagiosum',
          value: '548760',
        },
        {
          label: '548770 - Skin Tinea Versicolor',
          value: '548770',
        },
        {
          label: '548790 - Skin Pediculosis',
          value: '548790',
        },
        {
          label: '548800 - Skin Non Disease/Atypical Mole',
          value: '548800',
        },
        {
          label: '548810 - Skin Malformation',
          value: '548810',
        },
        {
          label: '548821 - Acne',
          value: '548821',
        },
        {
          label: '548822 - Fungal Infection',
          value: '548822',
        },
        {
          label: '548823 - Alopecia',
          value: '548823',
        },
        {
          label: '558410 - Lymph Hodgkins Disease',
          value: '558410',
        },
        {
          label: '558600 - Lymph Lymphatic Infection',
          value: '558600',
        },
        {
          label: '558610 - Lymph Lymphadenitis Acute',
          value: '558610',
        },
        {
          label: '558620 - Lymph Lymphadenitis Chronic',
          value: '558620',
        },
        {
          label: '558630 - Lymph Lymphangitis Acute',
          value: '558630',
        },
        {
          label: '558900 - Lymph Node Benign Tumor',
          value: '558900',
        },
        {
          label: '558901 - Lymph Node Nodular Fasciitis',
          value: '558901',
        },
        {
          label: '568110 - Secretory Dermatitis/Seborrheic',
          value: '568110',
        },
        {
          label: '568120 - Secretory Dermatophytid',
          value: '568120',
        },
        {
          label: '568130 - Secretory Hyperhydrosis',
          value: '568130',
        },
        {
          label: '568600 - Secretory Systemic Infection/Gland',
          value: '568600',
        },
        {
          label: '568610 - Secretory Apocrinitis',
          value: '568610',
        },
        {
          label: '568620 - Secretory Sebaceous Cyst Infection',
          value: '568620',
        },
        {
          label: '568630 - Secretory Hair Follicle/Infection',
          value: '568630',
        },
        {
          label: '568810 - Secretory Blood Mole',
          value: '568810',
        },
        {
          label: '568910 - Secretory Parotid Tumor/Benign',
          value: '568910',
        },
        {
          label: '574120 - Circulatory Varicose Veins',
          value: '574120',
        },
        {
          label: '574130 - Circulatory Stroke',
          value: '574130',
        },
        {
          label: '578110 - Circulatory Fat Embolism',
          value: '578110',
        },
        {
          label: '578120 - Circulatory Vasovagal Response',
          value: '578120',
        },
        {
          label: '578130 - Circulatory Thrombophlebitis',
          value: '578130',
        },
        {
          label: '578131 - Circulatory Aneurysm',
          value: '578131',
        },
        {
          label: '578132 - Circulatory Artery Severance',
          value: '578132',
        },
        {
          label: '578133 - Circulatory Deep Vein Thrombosis (DVT)',
          value: '578133',
        },
        {
          label:
            '578134 - Circulatory Deep Vein Thrombosis (DVT) - Lower Extremity',
          value: '578134',
        },
        {
          label:
            '578135 - Circulatory Deep Vein Thrombosis (DVT) - Upper Extremity',
          value: '578135',
        },
        {
          label: '578136 - Circulatory Superficial Vein Thrombosis',
          value: '578136',
        },
        {
          label:
            '578137 - Circulatory Superficial Vein Thrombosis - Lower Extremity',
          value: '578137',
        },
        {
          label:
            '578138 - Circulatory Superficial Vein Thrombosis - Upper Extremity',
          value: '578138',
        },
        {
          label: '578141 - Circulatory Hypertension - Uncontrolled',
          value: '578141',
        },
        {
          label: '578142 - Circulatory Hypertension - Controlled',
          value: '578142',
        },
        {
          label: '578150 - Circulatory Sickle Cell Embolism',
          value: '578150',
        },
        {
          label: '578151 - Circulatory Sickle Cell Trait Reaction',
          value: '578151',
        },
        {
          label: '578160 - Circulatory Anemia',
          value: '578160',
        },
        {
          label: '578161 - Circulatory Iron Deficiency Anemia',
          value: '578161',
        },
        {
          label: '578410 - Circulatory Leukemia',
          value: '578410',
        },
        {
          label: '578600 - Circulatory Infection',
          value: '578600',
        },
        {
          label: '578610 - Circulatory Viral Septicemia',
          value: '578610',
        },
        {
          label: '578611 - Circulatory Idiopathic Thrombocytopenia',
          value: '578611',
        },
        {
          label: '578612 - Circulatory Thrombocytosis',
          value: '578612',
        },
        {
          label: '578710 - Circulatory Viremia/Communicable',
          value: '578710',
        },
        {
          label: '580030 - GI Tract Colitis',
          value: '580030',
        },
        {
          label: "580032 - GI Crohn's Disease",
          value: '580032',
        },
        {
          label: '580033 - GI Inflammatory Bowel Disease',
          value: '580033',
        },
        {
          label: '580034 - GI Ulcerative Colitis',
          value: '580034',
        },
        {
          label: '580900 - GI Tract Gastrointestinal Cramps',
          value: '580900',
        },
        {
          label: '588000 - GI Tract Gastrointestinal Illness',
          value: '588000',
        },
        {
          label: '588010 - GI Tract Stomach Illness/Other',
          value: '588010',
        },
        {
          label: '588100 - GI Tract Stress/Dyspepsia/Indigestion',
          value: '588100',
        },
        {
          label: '588120 - GI Tract Duodenal Ulcer',
          value: '588120',
        },
        {
          label: '588140 - GI Tract Parasite',
          value: '588140',
        },
        {
          label: '588600 - GI Tract Food Poisoning',
          value: '588600',
        },
        {
          label: '588620 - GI Tract Constipation',
          value: '588620',
        },
        {
          label: '588630 - GI Tract Dysentery',
          value: '588630',
        },
        {
          label: '588700 - GI Tract Gastroenteritis/Viral/Acute',
          value: '588700',
        },
        {
          label: '588800 - GI Tract Non-disease/Atypical Condition',
          value: '588800',
        },
        {
          label: '589901 - Diarrhea',
          value: '589901',
        },
        {
          label: '589902 - Gastroesophangeal Reflux',
          value: '589902',
        },
        {
          label: '589903 - Gastric Ulcer',
          value: '589903',
        },
        {
          label: '594000 - Hernia Inguinal Canal Strain',
          value: '594000',
        },
        {
          label: '596280 - Hernia / Muscle',
          value: '596280',
        },
        {
          label: '598110 - Hernia / Inguinal / Direct',
          value: '598110',
        },
        {
          label: '598120 - Hernia / Inguinal / Indirect',
          value: '598120',
        },
        {
          label: '598130 - Hernia / Umbilical',
          value: '598130',
        },
        {
          label: '598140 - Hernia / Femoral',
          value: '598140',
        },
        {
          label: '600700 - Prophylactic IV Administration, Not Illness Related',
          value: '600700',
        },
        {
          label: '600800 - Vascular Trauma/Generalized',
          value: '600800',
        },
        {
          label: '600801 - Sleep Disorder',
          value: '600801',
        },
        {
          label: '600802 - Cancer',
          value: '600802',
        },
        {
          label: '600803 - Gunshot Wound (GSW)',
          value: '600803',
        },
        {
          label: '600901 - Exertional Muscle Cramps / Generalized',
          value: '600901',
        },
        {
          label: '600902 - Exertional Muscle Cramps / Localized Upper Body',
          value: '600902',
        },
        {
          label: '600903 - Exertional Muscle Cramps / Localized Lower Body',
          value: '600903',
        },
        {
          label: '600904 - Exertional Muscle Cramps / Localized Trunk',
          value: '600904',
        },
        {
          label: '600905 - Non-Exertional Muscle Cramps',
          value: '600905',
        },
        {
          label: '606841 - Rhabdomyolysis',
          value: '606841',
        },
        {
          label: '607200 - Chemical Intoxication',
          value: '607200',
        },
        {
          label: '607310 - Drug Adverse Reaction',
          value: '607310',
        },
        {
          label: '607320 - Nondrug Adverse Reaction',
          value: '607320',
        },
        {
          label: '608000 - Systemic Illness',
          value: '608000',
        },
        {
          label: '608110 - Systemic Hypothermia',
          value: '608110',
        },
        {
          label: '608123 - Heat Stroke',
          value: '608123',
        },
        {
          label: '608124 - Heat Exhaustion, without Complications',
          value: '608124',
        },
        {
          label: '608125 - Heat Exhaustion, with Rhabdomyolysis',
          value: '608125',
        },
        {
          label: '608126 - Heat Exhaustion with Renal Complication',
          value: '608126',
        },
        {
          label: '608130 - Systemic Electric Shock/Non-Fatal',
          value: '608130',
        },
        {
          label: '608131 - Systemic Gout',
          value: '608131',
        },
        {
          label: '608132 - Systemic Myoglobulinuria',
          value: '608132',
        },
        {
          label: '608133 - Systemic Hyperkalemic Periodic Paralysis',
          value: '608133',
        },
        {
          label: '608140 - Systemic Sleep Apnea',
          value: '608140',
        },
        {
          label: '608141 - Systemic Obstructive Sleep Apnea',
          value: '608141',
        },
        {
          label: '608142 - Systemic Central Sleep Apnea',
          value: '608142',
        },
        {
          label: '608143 - Systemic Mixed Sleep Apnea',
          value: '608143',
        },
        {
          label: '608150 - Systemic Sleep Disturbance/Insomnia',
          value: '608150',
        },
        {
          label: '608170 - Systemic Malnutrition/Excessive Dehydration',
          value: '608170',
        },
        {
          label: '608172 - Dehydration, Exertional',
          value: '608172',
        },
        {
          label: '608173 - Dehydration, Illness',
          value: '608173',
        },
        {
          label: '608180 - Systemic Fibromyalgia',
          value: '608180',
        },
        {
          label: '608199 - Systemic Near-drowning',
          value: '608199',
        },
        {
          label: '608300 - Systemic Allergy/Non-drug',
          value: '608300',
        },
        {
          label: '608310 - Systemic Anaphylaxis',
          value: '608310',
        },
        {
          label: '608320 - Systemic Angioneurotic Edema',
          value: '608320',
        },
        {
          label: '608330 - Systemic Seasonal/Environmental Allergies',
          value: '608330',
        },
        {
          label: '608600 - Systemic Infection',
          value: '608600',
        },
        {
          label: '608601 - Systemic Malaria',
          value: '608601',
        },
        {
          label: '608602 - Systemic Rheumatic Fever/Acute',
          value: '608602',
        },
        {
          label: "608604 - Systemic Marfan's Syndrome",
          value: '608604',
        },
        {
          label: '608605 - Systemic Multiple Sclerosis',
          value: '608605',
        },
        {
          label: '608701 - Systemic Influenza',
          value: '608701',
        },
        {
          label: '608702 - Systemic Chicken Pox',
          value: '608702',
        },
        {
          label: '608703 - Systemic Influenza A',
          value: '608703',
        },
        {
          label: '608704 - Systemic Influenza B',
          value: '608704',
        },
        {
          label: '608705 - Systemic Influenza - H1N1',
          value: '608705',
        },
        {
          label: '608706 - Systemic Rheumatoid Arthritis',
          value: '608706',
        },
        {
          label: '608710 - Systemic Measles',
          value: '608710',
        },
        {
          label: '608711 - Systemic Rubella',
          value: '608711',
        },
        {
          label: '608712 - Systemic Scarlet Fever',
          value: '608712',
        },
        {
          label: '608713 - Systemic Infectious Mononucleosis',
          value: '608713',
        },
        {
          label: '608714 - Systemic Mumps/Lymph Glands',
          value: '608714',
        },
        {
          label: '608716 - Vitamin D Deficiency',
          value: '608716',
        },
        {
          label: '608820 - Systemic Proteinuria',
          value: '608820',
        },
        {
          label: '608821 - Viral Illness',
          value: '608821',
        },
        {
          label: '608822 - Nutritional Deficiency, Unspecified',
          value: '608822',
        },
        {
          label: '777777 - Abnormal Lab Test - No Diagnosed Injury/Illness',
          value: '777777',
        },
        {
          label: '888888 - No Injury / Illness, Procedure Only',
          value: '888888',
        },
        {
          label: '999999 - Clinical Impression Placeholder',
          value: '999999',
        },
      ],
      path: 'clinical_impression_code/id',
      deprecated: true,
    },
    {
      label: 'Illness Onset',
      operators: [
        {
          label: 'Is',
          value: 'eq',
        },
      ],
      options: [
        {
          label: 'Acute',
          value: 1,
        },
        {
          label: 'Other',
          value: 4,
        },
        {
          label: 'Repetitive',
          value: 7,
        },
        {
          label: 'Unknown',
          value: 8,
        },
      ],
      path: 'illness_onset/id',
      deprecated: false,
    },
    {
      label: 'Issue Type',
      operators: [
        {
          label: 'Is',
          value: 'eq',
        },
      ],
      options: [
        {
          label: 'Chronic Issue',
          value: 'chronic_issue',
        },
        {
          label: 'Continuation',
          value: 'continuation',
        },
        {
          label: 'Illness Occurrence',
          value: 'illness_occurrence',
        },
        {
          label: 'Injury Occurrence',
          value: 'injury_occurrence',
        },
        {
          label: 'Recurrence',
          value: 'recurrence',
        },
      ],
      path: 'issue_type/name',
      deprecated: false,
    },
    {
      label: 'Organisation Coding System',
      operators: [
        {
          label: 'Is',
          value: 'eq',
        },
      ],
      options: [
        {
          label: 'Clinical Impressions',
          value: 4,
        },
        {
          label: 'Datalys',
          value: 3,
        },
        {
          label: 'ICD-10-CM',
          value: 1,
        },
        {
          label: 'OSICS-10',
          value: 2,
        },
      ],
      path: 'organisation_coding_system/id',
      deprecated: false,
    },
    {
      label: 'OSICS-10 Body Area',
      operators: [
        {
          label: 'Is',
          value: 'eq',
        },
      ],
      options: [
        {
          label: 'Ankle',
          value: 1,
        },
        {
          label: 'Buttock/pelvis',
          value: 2,
        },
        {
          label: 'Chest',
          value: 3,
        },
        {
          label: 'Elbow',
          value: 4,
        },
        {
          label: 'Foot',
          value: 5,
        },
        {
          label: 'Forearm',
          value: 6,
        },
        {
          label: 'Head',
          value: 7,
        },
        {
          label: 'Hip/Groin',
          value: 8,
        },
        {
          label: 'Knee',
          value: 9,
        },
        {
          label: 'Lower Leg',
          value: 10,
        },
        {
          label: 'Lumbar Spine',
          value: 11,
        },
        {
          label: 'Neck',
          value: 12,
        },
        {
          label: 'Shoulder',
          value: 13,
        },
        {
          label: 'Thigh',
          value: 15,
        },
        {
          label: 'Thoracic Spine',
          value: 16,
        },
        {
          label: 'Trunk/Abdominal',
          value: 17,
        },
        {
          label: 'Unspecified/Crossing',
          value: 18,
        },
        {
          label: 'Upper Arm',
          value: 19,
        },
        {
          label: 'Wrist/Hand',
          value: 20,
        },
      ],
      path: 'osics_body_area/id',
      deprecated: false,
    },
    {
      label: 'OSICS-10 Classification',
      operators: [
        {
          label: 'Is',
          value: 'eq',
        },
      ],
      options: [
        {
          label: 'Apophysitis',
          value: 1,
        },
        {
          label: 'Bruising/ Haematoma',
          value: 6,
        },
        {
          label: 'Concussion/ Brain Injury',
          value: 20,
        },
        {
          label: 'Disc',
          value: 24,
        },
        {
          label: 'Dislocation',
          value: 7,
        },
        {
          label: 'Fracture',
          value: 8,
        },
        {
          label: 'Hand Laceration/ Abrasion',
          value: 27,
        },
        {
          label: 'Instability',
          value: 9,
        },
        {
          label: 'Laceration/ Abrasion',
          value: 10,
        },
        {
          label: 'Ligament',
          value: 11,
        },
        {
          label: 'Muscle Strain/Spasm',
          value: 17,
        },
        {
          label: 'Nerve',
          value: 12,
        },
        {
          label: 'Organ Damage',
          value: 22,
        },
        {
          label: 'Osteoarthritis',
          value: 13,
        },
        {
          label: 'Osteochondral',
          value: 2,
        },
        {
          label: 'Other Pain/ unspecified',
          value: 3,
        },
        {
          label: 'Post Surgery',
          value: 4,
        },
        {
          label: 'Structural Abnormality',
          value: 5,
        },
        {
          label: 'Synovitis/ Impingement',
          value: 23,
        },
        {
          label: 'Synovitis/ Impingement/ Bursitis',
          value: 14,
        },
        {
          label: 'Tendon',
          value: 15,
        },
        {
          label: 'Unspecified/Crossing',
          value: 28,
        },
        {
          label: 'Vascular',
          value: 16,
        },
      ],
      path: 'osics_classification/id',
      deprecated: false,
    },
    {
      label: 'OSICS-10 Pathology',
      operators: [
        {
          label: 'Is',
          value: 'eq',
        },
      ],
      options: [
        {
          label: 'AAAX - Ankle joint osteoarthritis',
          value: 54,
        },
        {
          label: 'AASX - Subtalar joint arthritis',
          value: 55,
        },
        {
          label: 'AAXX - Osteoarthritis of Ankle/ Subtalar Joint',
          value: 56,
        },
        {
          label: 'ACLX - Loose body ankle joint',
          value: 57,
        },
        {
          label: 'ACPX - Tibial plafond osteochondral lesion',
          value: 58,
        },
        {
          label: 'ACTX - Talar dome osteochondral injury',
          value: 59,
        },
        {
          label: 'ACXX - Ankle Osteochondral Injuries',
          value: 60,
        },
        {
          label: 'ADXX - Ankle Dislocation',
          value: 11,
        },
        {
          label: 'AFAB - Bimalleolar fracture',
          value: 12,
        },
        {
          label: 'AFAL - Fracture lateral malleolus',
          value: 13,
        },
        {
          label: 'AFAM - Fracture medial malleolus',
          value: 14,
        },
        {
          label: 'AFAP - Fracture posterior malleolus',
          value: 15,
        },
        {
          label: 'AFAS - Ankle fracture with diastasis of syndesmosis',
          value: 16,
        },
        {
          label: 'AFAT - Trimalleolar fracture',
          value: 17,
        },
        {
          label: 'AFAX - Fracture tibia and fibula at ankle joint',
          value: 18,
        },
        {
          label: 'AFCA - Fractured anterior process calcaneus',
          value: 19,
        },
        {
          label: 'AFCX - Fractured calcaneus',
          value: 20,
        },
        {
          label: 'AFTD - Fractured talar dome',
          value: 21,
        },
        {
          label: 'AFTL - Fractured lateral process talus',
          value: 22,
        },
        {
          label: 'AFTN - Fractured talar neck',
          value: 23,
        },
        {
          label: 'AFTO - Fractured os trigonum',
          value: 24,
        },
        {
          label: 'AFTP - Fractured posterior process talus',
          value: 25,
        },
        {
          label: 'AFTX - Fractured talus',
          value: 26,
        },
        {
          label: 'AFTZ - Fractured talus not otherwise specified',
          value: 27,
        },
        {
          label: 'AFXX - Ankle Fracture',
          value: 28,
        },
        {
          label: 'AGAB - Anterior inpingement ankl d/t osteophytes',
          value: 68,
        },
        {
          label: 'AGAX - Anterior impingement ankle',
          value: 69,
        },
        {
          label: 'AGBC - Calcaneal bursitis (pump bump)',
          value: 70,
        },
        {
          label: 'AGBX - Busitis not otherwise specified',
          value: 71,
        },
        {
          label: 'AGPO - Ankle posterior impingement with os trigonum',
          value: 72,
        },
        {
          label: 'AGPS - Ankle posterior impingement post ankle sprain',
          value: 73,
        },
        {
          label: 'AGPX - Posterior impingement ankle',
          value: 74,
        },
        {
          label: 'AGPZ - Other posterior ankle impingement',
          value: 75,
        },
        {
          label: 'AGSA - Ankle joint synovitis',
          value: 76,
        },
        {
          label: 'AGSS - Subtalar joint synovitis/ sinus tarsi syndrome',
          value: 77,
        },
        {
          label: 'AGSX - Synovitis of ankle and subtalar joint',
          value: 78,
        },
        {
          label: 'AGTX - Tarsal tunnel syndrome',
          value: 79,
        },
        {
          label: 'AGXX - Ankle Synovitis/ Impingement/ Bursitis',
          value: 80,
        },
        {
          label: 'AHHX - Heel bruising/ haematoma incl fat pad contusion',
          value: 9,
        },
        {
          label: 'AHXX - Ankle Soft Tissue Bruising/ Haematoma',
          value: 10,
        },
        {
          label: 'AJDX - Ankle deltoid ligament sprain',
          value: 43,
        },
        {
          label: 'AJLA - Anterior talofibular ligament sprain',
          value: 44,
        },
        {
          label: 'AJLC - Calcaneofibular ligament sprain',
          value: 45,
        },
        {
          label: 'AJLR - Lateral ligaments rupture (grade 3 injury)',
          value: 46,
        },
        {
          label: 'AJLX - Ankle lateral ligament sprain',
          value: 47,
        },
        {
          label: 'AJMX - Ankle multiple ligaments sprain',
          value: 48,
        },
        {
          label: 'AJSX - Ankle syndesmosis sprain',
          value: 49,
        },
        {
          label: 'AJXX - Ankle Sprains',
          value: 50,
        },
        {
          label: 'AKBX - Blisters heel',
          value: 38,
        },
        {
          label: 'AKDX - Deep (intraarticular) laceration ankle',
          value: 39,
        },
        {
          label: 'AKSX - Superficial ankle laceration/ abrasion',
          value: 40,
        },
        {
          label:
            'AKXQ - Complication of ankle laceration/ abrasion incl infection ',
          value: 41,
        },
        {
          label: 'AKXX - Ankle Laceration/ Abrasion',
          value: 42,
        },
        {
          label: 'ANCM - Medial calcaneal nerve entrapment',
          value: 51,
        },
        {
          label: 'ANCX - Calcaneal nerve entrapment',
          value: 52,
        },
        {
          label: 'ANXX - Nerve Injury at Ankle',
          value: 53,
        },
        {
          label: 'ASCC - Fat pad contusion heel',
          value: 61,
        },
        {
          label: 'ASCF - Stress fracture calcaneus',
          value: 62,
        },
        {
          label: 'ASCX - Stress injury calcaneus',
          value: 63,
        },
        {
          label: 'ASFM - Lateral malleolar stress fracture',
          value: 29,
        },
        {
          label: 'ASFX - Stress fracture fibula at ankle',
          value: 30,
        },
        {
          label: 'ASLX - Stress fracture talus',
          value: 31,
        },
        {
          label: 'ASTM - Medial malleolar stress fracture',
          value: 32,
        },
        {
          label: 'ASTX - Stress fracture tibia at ankle',
          value: 33,
        },
        {
          label: 'ASXX - Ankle Stress Injuries/ Stress Fractures',
          value: 34,
        },
        {
          label: 'ATAB - Achilles enthesopathy with retrocalcaneal bursitis',
          value: 81,
        },
        {
          label: 'ATAE - Achilles enthesopathy',
          value: 82,
        },
        {
          label: 'ATAI - Insertional achilles tendon rupture',
          value: 83,
        },
        {
          label: 'ATAM - Midsubstance achilles tendon rupture',
          value: 84,
        },
        {
          label: 'ATAP - Achilles paratenonopathy',
          value: 85,
        },
        {
          label: 'ATAR - Achilles tendon rupture',
          value: 86,
        },
        {
          label: 'ATAS - Achilles tendon strain',
          value: 87,
        },
        {
          label: 'ATAT - Achilles tendinopathy',
          value: 88,
        },
        {
          label: 'ATAX - Achilles tendon injury',
          value: 89,
        },
        {
          label: 'ATEA - Tibialis anterior tenosynovitis',
          value: 90,
        },
        {
          label: 'ATEX - Extensor tendon injuries at ankle',
          value: 91,
        },
        {
          label: 'ATHI - FHL tenosynovitis',
          value: 92,
        },
        {
          label: 'ATHR - FHL rupture',
          value: 93,
        },
        {
          label: 'ATHS - FHL strain',
          value: 94,
        },
        {
          label: 'ATHT - FHL tendinopathy',
          value: 95,
        },
        {
          label: 'ATHX - Flexor hallucis tendon injury',
          value: 96,
        },
        {
          label: 'ATPR - Peroneal tendon rupture',
          value: 97,
        },
        {
          label: 'ATPS - Peroneal tendon strain',
          value: 98,
        },
        {
          label: 'ATPT - Peroneal tendinopathy',
          value: 99,
        },
        {
          label: 'ATPU - Peroneal tendon subluxation/ dislocation',
          value: 100,
        },
        {
          label: 'ATPX - Peroneal tendon injury',
          value: 101,
        },
        {
          label: 'ATTR - Tibialias posterior tendon rupture',
          value: 102,
        },
        {
          label: 'ATTS - Tibialis posterior strain',
          value: 103,
        },
        {
          label: 'ATTT - Tibialis posterior tendinopathy',
          value: 104,
        },
        {
          label: 'ATTX - Tibialis posterior injuries',
          value: 105,
        },
        {
          label: 'ATXX - Ankle Tendon Injury',
          value: 106,
        },
        {
          label: 'AULX - Chronic lateral instability',
          value: 35,
        },
        {
          label: 'AUMX - Chronic medial instability',
          value: 36,
        },
        {
          label: 'AUXX - Chronic Ankle Instability',
          value: 37,
        },
        {
          label: 'AVXX - Vascular Injury Ankle',
          value: 107,
        },
        {
          label: 'AXXX - Other Lower Leg Pain/ Injury not otherwise specified',
          value: 64,
        },
        {
          label: 'AZCX - Chronic regional pain syndrome ankle',
          value: 65,
        },
        {
          label: 'AZXX - Ankle Pain/ Injury not otherwsie specified',
          value: 4,
        },
        {
          label: 'AZZP - Posterior ankle pain undiagnosed',
          value: 66,
        },
        {
          label: 'AZZX - Ankle pain undiagnosed',
          value: 67,
        },
        {
          label: 'BFCX - Fractured coccyx',
          value: 116,
        },
        {
          label: 'BFIX - Fractured ischium',
          value: 117,
        },
        {
          label: 'BFLX - Fractured Ilium',
          value: 118,
        },
        {
          label: 'BFMX - Multiple fractures pelvis and sacrum',
          value: 119,
        },
        {
          label: 'BFSX - Fractured sacrum',
          value: 120,
        },
        {
          label: 'BFXX - Pelvic fracture(s)',
          value: 121,
        },
        {
          label: 'BFZX - Other stress fracture pelvis',
          value: 122,
        },
        {
          label:
            'BGSX - Sacroiliac Joint Inflammation (excl Inflammatory arthritis SIJ - See MRXX)',
          value: 151,
        },
        {
          label:
            'BGTX - Trochanteric bursitis (excl that a/w glut tendinopathy - see BTGB)',
          value: 152,
        },
        {
          label: 'BGXX - Buttock and Pelvis Synovitis/ Bursitis',
          value: 153,
        },
        {
          label: 'BHBX - Buttock bruising/ haematoma',
          value: 111,
        },
        {
          label: 'BHIX - Bruising/ haematoma iliac crest/ glut medius',
          value: 112,
        },
        {
          label: 'BHSX - SIJ bruising/ haematoma',
          value: 113,
        },
        {
          label: 'BHXX - Pelvis/ Buttock Soft Tissue Bruising/ Haematoma',
          value: 114,
        },
        {
          label: 'BHZX - Bruising buttock/ pelvis not otherwise specified',
          value: 115,
        },
        {
          label: 'BJCX - Sacrococcygeal joint injury/ pain',
          value: 146,
        },
        {
          label: 'BJSX - Sacroiliac joint sprain',
          value: 132,
        },
        {
          label: 'BJXX - Sacroiliac Joint Injury',
          value: 147,
        },
        {
          label:
            'BKXQ - Complication of pelvis/buttock laceration/ abrasion incl infection',
          value: 130,
        },
        {
          label: 'BKXX - Pelvic/ Buttock Laceration/ Abrasion',
          value: 131,
        },
        {
          label: 'BMGA - Gluteus maximus strain',
          value: 133,
        },
        {
          label: 'BMGB - Gluteus medius/ minimus strain',
          value: 134,
        },
        {
          label: 'BMGP - Piriformis muscle strain',
          value: 135,
        },
        {
          label: 'BMGX - Buttock muscle strain',
          value: 136,
        },
        {
          label: 'BMXX - Pelvic/ Buttock Muscle Strain/ Spasm/ Trigger Points',
          value: 137,
        },
        {
          label: 'BMYA - Glut Max trigger points',
          value: 138,
        },
        {
          label: 'BMYB - Glut Med/ Min trigger points',
          value: 139,
        },
        {
          label: 'BMYM - Multiple buttock muscle trigger points',
          value: 140,
        },
        {
          label: 'BMYP - Piriformis trigger points',
          value: 141,
        },
        {
          label: 'BMYX - Buttock trigger points',
          value: 142,
        },
        {
          label: 'BMYZ - Other gluteal muslce trigger points',
          value: 143,
        },
        {
          label: 'BNPX - Piriformis syndrome/ sciatic nerve entrapment',
          value: 144,
        },
        {
          label: 'BNXX - Buttock/ Pelvic Nerve Injury',
          value: 145,
        },
        {
          label: 'BSCX - Stress fracture coccyx',
          value: 123,
        },
        {
          label: 'BSIX - Stress fracture ischium',
          value: 124,
        },
        {
          label: 'BSLX - Stress fracture ilium',
          value: 125,
        },
        {
          label: 'BSSX - Stress fracture sacrum',
          value: 126,
        },
        {
          label: 'BSXX - Pelvic Stress Fracture(s)',
          value: 127,
        },
        {
          label: 'BTAT - Gluteus maximus tendinopathy',
          value: 154,
        },
        {
          label: 'BTAX - Gluteus maximus tendon Injury',
          value: 155,
        },
        {
          label:
            'BTGB - Gluteus med/ min tendinopathy with trochanteric bursitis',
          value: 156,
        },
        {
          label: 'BTGR - Gluteus med/ min tendon rupture',
          value: 157,
        },
        {
          label: 'BTGT - Gluteus med/ min tendinopathy',
          value: 158,
        },
        {
          label: 'BTGX - Gluteus med/ min tendon injury',
          value: 159,
        },
        {
          label: 'BTHB - Hamstring tendinopathy with ischial bursitis',
          value: 160,
        },
        {
          label:
            'BTHR - Hamstring origin tendon rupture (excl growth plate fracture - see JBFI)',
          value: 161,
        },
        {
          label: 'BTHT - Hamstring origin tendinopathy',
          value: 162,
        },
        {
          label: 'BTHX - Hamstring tendon injury',
          value: 163,
        },
        {
          label: 'BTPT - Piriformis tendinopathy',
          value: 164,
        },
        {
          label: 'BTPX - Piriformis tendon injury',
          value: 165,
        },
        {
          label: 'BTXX - Buttock/ Pelvis Tendon Injury',
          value: 166,
        },
        {
          label: 'BUXX - Sacroiliac Joint Instability',
          value: 129,
        },
        {
          label: 'BXXX - Lumbar Pain/ Injury nor otherwise specified',
          value: 148,
        },
        {
          label: 'BZXX - Pelvic/ Buttock Pain not otherwise specified',
          value: 149,
        },
        {
          label: 'BZZX - Buttock pain undiagnosed',
          value: 150,
        },
        {
          label: 'CDCX - Costochondral joint dislocation',
          value: 173,
        },
        {
          label: 'CDSP - Posterior sternoclavicular joint dislocation',
          value: 174,
        },
        {
          label: 'CDSX - Sternoclavicular joint dislocation',
          value: 175,
        },
        {
          label: 'CDXX - Chest Dislocations',
          value: 176,
        },
        {
          label: 'CFRA - Fracture upper rib (1- 4)',
          value: 177,
        },
        {
          label: 'CFRB - Fracture Middle rib (5 - 9)',
          value: 178,
        },
        {
          label: 'CFRC - Fracture lower rib (10 - 12)',
          value: 179,
        },
        {
          label: 'CFRM - Fracture multiple ribs',
          value: 180,
        },
        {
          label: 'CFRQ - Complication of rib fracture - incl pneumothorax',
          value: 181,
        },
        {
          label: 'CFRX - Rib Fracture(s)',
          value: 182,
        },
        {
          label: 'CFSX - Sternal fracture',
          value: 183,
        },
        {
          label: 'CFXX - Chest Fracture(s)',
          value: 184,
        },
        {
          label: 'CGCX - Costochondritis',
          value: 206,
        },
        {
          label: 'CGSX - Synovitis of Sternoclavicular joint',
          value: 207,
        },
        {
          label: 'CGXX - Synovitis of Chest Joint',
          value: 209,
        },
        {
          label:
            'CGZX - Inflammation of other chest joint not otherwise specified',
          value: 210,
        },
        {
          label: 'CHLX - Lung Bruising/ Haemotoma',
          value: 1486,
        },
        {
          label: 'CHRX - Bruised rib(s)/ chest wall',
          value: 170,
        },
        {
          label: 'CHSX - Bruised sternum',
          value: 171,
        },
        {
          label: 'CHXX - Chest Wall Soft Tissue Bruising/ Haematoma',
          value: 172,
        },
        {
          label: 'CJCX - Sternocostal/ Costochondral joint sprains',
          value: 193,
        },
        {
          label: 'CJSA - Anterior Sternoclavicular joint sprain',
          value: 194,
        },
        {
          label: 'CJSP - Posterior sternoclavicular joint sprain',
          value: 195,
        },
        {
          label: 'CJSX - Sternoclavicular joint sprains',
          value: 196,
        },
        {
          label: 'CJVX - Costovertebral joint sprains',
          value: 197,
        },
        {
          label: 'CJXX - Chest Joint Sprains',
          value: 198,
        },
        {
          label:
            'CKXQ - Complication of chest wall laceration / abrasion incl infection, perforation to chest cavity',
          value: 191,
        },
        {
          label: 'CKXX - Chest Wall laceration/ Abrasion',
          value: 192,
        },
        {
          label: 'CMTX - Intercostal tendinopathy',
          value: 211,
        },
        {
          label: 'CMXX - Chest Muscle or Tendon strain/ spasm/ trigger points',
          value: 199,
        },
        {
          label: 'CMYX - Chest muscle trigger points',
          value: 200,
        },
        {
          label: 'COPH - Haemothorax',
          value: 201,
        },
        {
          label: 'COPP - Pneumothorax',
          value: 202,
        },
        {
          label:
            'COPX - Lung Injury (excl injury due to laceration (CKXQ) or rib fracture (CFRQ))',
          value: 203,
        },
        {
          label: 'COXX - Chest Cavity Injury',
          value: 204,
        },
        {
          label: 'CRCX - Fracture of costochondral margin',
          value: 185,
        },
        {
          label: 'CSXX - Rib Stress Fracture(s)',
          value: 186,
        },
        {
          label: 'CUCX - Costochondral joint instability',
          value: 187,
        },
        {
          label: 'CUSX - Sternoclavicular joint instability',
          value: 188,
        },
        {
          label: 'CUVX - Costovertebral joint instability',
          value: 189,
        },
        {
          label: 'CUXX - Chest Joint Instability',
          value: 190,
        },
        {
          label:
            'CXXX - Other Wrist and Hand Pain/ Injury not otherwise specified',
          value: 1424,
        },
        {
          label: 'CZXX - Chest Pain/ Injury Not elsewhere specified',
          value: 167,
        },
        {
          label: 'CZZX - Chest pain undiagnosed',
          value: 205,
        },
        {
          label: 'DAFX - Facet joint OA thoracic spine',
          value: 1131,
        },
        {
          label: 'DAXX - Thoracic spine Osteoarthritis',
          value: 1132,
        },
        {
          label: 'DCXX - Thoracic Disc Injury',
          value: 1121,
        },
        {
          label:
            'DFPX - Fracture transverse or posterior process thoracic spine',
          value: 1122,
        },
        {
          label: 'DFVX - Fracture thoracic vertebral body',
          value: 1123,
        },
        {
          label: 'DFXX - Thoracic Spine Fracture',
          value: 1124,
        },
        {
          label: 'DGXX - Thoracic Postural Syndrome',
          value: 1133,
        },
        {
          label: 'DHXX - Thoracic Soft Tissue Bruising/ Haematoma',
          value: 1120,
        },
        {
          label: 'DJFX - Thoracic facet joint sprain',
          value: 1127,
        },
        {
          label:
            'DJPX - Thoracic facet joint pain/ chronic inflammation/ stiffness',
          value: 1134,
        },
        {
          label: 'DJXX - Thoracic spine Joint Injury',
          value: 1135,
        },
        {
          label:
            'DKXQ - Complication of thoracic laceration/ abrasion including infection',
          value: 1125,
        },
        {
          label: 'DKXX - Thoracic Laceration/ Abrasion',
          value: 1126,
        },
        {
          label: 'DMEX - Thoracic extensor muscle strain',
          value: 1128,
        },
        {
          label:
            'DMXX - Thoracic Muscle and Tendon Strain/ Spasm/ Trigger Points',
          value: 1129,
        },
        {
          label: 'DMYX - Thoracic muscle trigger points',
          value: 1130,
        },
        {
          label: 'DXXX - Abdominal pain not otherwise specified',
          value: 1164,
        },
        {
          label: 'DZXX - Thoracic Pain/ Injury not otherwise specified',
          value: 901,
        },
        {
          label: 'DZZX - Thoracic pain undiagnosed',
          value: 1136,
        },
        {
          label: 'EAXX - Elbow Osteoarthritis',
          value: 247,
        },
        {
          label: 'ECLX - Loose Body in Elbow',
          value: 248,
        },
        {
          label: 'ECXX - Elbow Osteochondral Injury ',
          value: 249,
        },
        {
          label: 'EDAX - Anterion elbow dislocation',
          value: 215,
        },
        {
          label: 'EDPX - Posterior elbow dislocation',
          value: 216,
        },
        {
          label: 'EDRX - Dislocated radial head',
          value: 217,
        },
        {
          label: 'EDXX - Elbow Dislocation',
          value: 218,
        },
        {
          label: 'EFHA - Avulsion fracture distal humerus',
          value: 219,
        },
        {
          label: 'EFHC - Fractured humeral condyle(s)',
          value: 220,
        },
        {
          label: 'EFHS - Supracondylar humeral fracture',
          value: 221,
        },
        {
          label: 'EFHX - Fractured distal humerus',
          value: 222,
        },
        {
          label: 'EFRA - Avulsion fracture distal radius',
          value: 223,
        },
        {
          label: 'EFRH - Fractured radial head',
          value: 224,
        },
        {
          label: 'EFRX - Fractured distal radius',
          value: 225,
        },
        {
          label: 'EFUA - Avulsion fracture distal ulna',
          value: 226,
        },
        {
          label: 'EFUO - Fractured olecranon',
          value: 227,
        },
        {
          label: 'EFUX - Fractured proximal ulna',
          value: 228,
        },
        {
          label:
            'EFXA - Avulsion fracture elbow multiple locations or location unspecified',
          value: 229,
        },
        {
          label: 'EFXX - Elbow Fractures',
          value: 230,
        },
        {
          label: 'EGBX - Elbow olecranon bursitis',
          value: 257,
        },
        {
          label: 'EGPX - Elbow posterior impingement/ synovitis',
          value: 258,
        },
        {
          label: 'EGXX - Elbow Impingement/ Synovitis',
          value: 259,
        },
        {
          label: 'EHXX - Elbow Soft Tissue Bruising/ Haematoma',
          value: 214,
        },
        {
          label:
            'EJHX - Elbow hyperextension +/- strain anterior elbow structures',
          value: 238,
        },
        {
          label: 'EJMC - Elbow medial ligament injury and CFO tear',
          value: 239,
        },
        {
          label: 'EJMR - Elbow medial lgament rupture/ grade 3 tear',
          value: 240,
        },
        {
          label: 'EJMX - Elbow medial ligament injury',
          value: 241,
        },
        {
          label: 'EJXX - Elbow Joint Sprain',
          value: 242,
        },
        {
          label: 'EJZX - Other elbow strain not otherwise specified',
          value: 243,
        },
        {
          label: 'EKDX - Elbow Laceration deep - intraarticular',
          value: 234,
        },
        {
          label: 'EKSX - Elbow Laceration/ abrasion superficial',
          value: 235,
        },
        {
          label: 'EKXQ - Complication of elbow laceration including infection',
          value: 236,
        },
        {
          label: 'EKXX - Elbow Laceration/ Abrasion',
          value: 237,
        },
        {
          label: 'EMXX - Elbow Muscle Strain/ Spasm/ Trigger Points',
          value: 244,
        },
        {
          label: 'ENUX - Ulnar nerve injury at elbow',
          value: 245,
        },
        {
          label: 'ENXX - Elbow Neurological Injury/ Entrapment',
          value: 246,
        },
        {
          label: 'ESXX - Elbow Stress/ Overuse Injuries incl Stress Fractures',
          value: 252,
        },
        {
          label: 'ETBR - Distal biceps tendon rupture',
          value: 260,
        },
        {
          label: 'ETBS - Distal biceps tendon strain',
          value: 261,
        },
        {
          label: 'ETBT - Distal biceps tendinopathy',
          value: 262,
        },
        {
          label: 'ETBX - Distal biceps tendon injury',
          value: 263,
        },
        {
          label: 'ETES - Common extensor origin strain/ rupture',
          value: 264,
        },
        {
          label:
            'ETET - Common extensor origin tendinopathy (incl tennis elbow)',
          value: 265,
        },
        {
          label: 'ETEX - Common extensor origin injury',
          value: 266,
        },
        {
          label: 'ETFS - Common flexor origin strain/ rupture',
          value: 267,
        },
        {
          label: 'ETFT - Common flexor origin tendinopathy',
          value: 268,
        },
        {
          label: 'ETFX - Common flexor origin injury',
          value: 269,
        },
        {
          label: 'ETTR - Distal triceps tendon rupture',
          value: 270,
        },
        {
          label: 'ETTS - Distal triceps tendon strain',
          value: 271,
        },
        {
          label: 'ETTT - Distal triceps tendinopathy',
          value: 272,
        },
        {
          label: 'ETTX - Distal triceps tendon injury',
          value: 273,
        },
        {
          label: 'ETXX - Elbow Tendon Injury',
          value: 274,
        },
        {
          label: 'EUMX - Elbow valgus instability',
          value: 231,
        },
        {
          label: 'EUPX - Elbow posterolateral instability',
          value: 232,
        },
        {
          label: 'EUXX - Elbow Instability',
          value: 233,
        },
        {
          label: 'EXXX - Elbow Injuries',
          value: 253,
        },
        {
          label: 'EZXX - Elbow Pain/ Injury not otherwise specified',
          value: 254,
        },
        {
          label: 'FAHB - Bunion of great toe MTP joint',
          value: 341,
        },
        {
          label: 'FAHR - Hallux rigidus',
          value: 342,
        },
        {
          label: 'FAHX - Arthritis MTP joint great toe',
          value: 343,
        },
        {
          label: 'FAMX - Arthritis of midfoot',
          value: 344,
        },
        {
          label: 'FAPB - Bunion 5th MTP joint',
          value: 345,
        },
        {
          label: 'FAPC - Claw toes',
          value: 346,
        },
        {
          label: 'FAPH - Hammer toes',
          value: 347,
        },
        {
          label: 'FAPX - Arthritis of lesser toes',
          value: 348,
        },
        {
          label: 'FAXX - Foot Osteoarthritis',
          value: 349,
        },
        {
          label: 'FCXX - Foot Chondral/ Osteochondral Lesion',
          value: 353,
        },
        {
          label: 'FDHX - Dislocation of great toe MTP jt',
          value: 283,
        },
        {
          label: 'FDMX - Dislocation of lesser toe MTP joint',
          value: 284,
        },
        {
          label: 'FDPX - Dislocation of IP joint of lesser toe',
          value: 285,
        },
        {
          label: 'FDTX - Dislocation of midfoot through TMT joints',
          value: 286,
        },
        {
          label: 'FDXX - Foot Dislocation',
          value: 287,
        },
        {
          label: 'FFHD - Fracture great toe distal phalanx',
          value: 288,
        },
        {
          label: 'FFHP - Fracture great toe proximal phalanx',
          value: 289,
        },
        {
          label: 'FFHX - Fracture great toe',
          value: 290,
        },
        {
          label: 'FFMA - Fracture 1st Metatarsal',
          value: 291,
        },
        {
          label: 'FFMB - Fracture 2nd Metatarsal',
          value: 292,
        },
        {
          label: 'FFMC - Fracture 3rd metatarsal',
          value: 293,
        },
        {
          label: 'FFMD - Fracture 4th metatarsal',
          value: 294,
        },
        {
          label: 'FFME - Fracture 5th metatarsal shaft',
          value: 295,
        },
        {
          label: 'FFMM - Fracture two or more metatarsals',
          value: 296,
        },
        {
          label: 'FFMV - Avulsion fracture 5th metatarsal base',
          value: 297,
        },
        {
          label: 'FFMX - Fracture Metatarsal(s)',
          value: 298,
        },
        {
          label: 'FFPX - Fracture lesser toes (2 - 5)',
          value: 299,
        },
        {
          label: 'FFQX - Complication of fractured foot including non union',
          value: 300,
        },
        {
          label: 'FFTB - Fracture cuboid',
          value: 301,
        },
        {
          label: 'FFTC - Fracture cuneiform',
          value: 302,
        },
        {
          label: 'FFTN - Fracture navicular',
          value: 303,
        },
        {
          label: 'FFTX - Fracture tarsal bone',
          value: 304,
        },
        {
          label: 'FFXX - Foot Fractures',
          value: 305,
        },
        {
          label: 'FGCX - Cuboid Syndrome',
          value: 368,
        },
        {
          label: 'FGMX - Synovitis of MTP joint(s)',
          value: 369,
        },
        {
          label: 'FGSX - Synovitis of midfoot joints',
          value: 370,
        },
        {
          label: 'FGXX - Synovitis/ Impingement/ Biomechanical Lesion of Foot',
          value: 371,
        },
        {
          label: 'FHHU - Nail bed haematoma great toe',
          value: 277,
        },
        {
          label: 'FHHX - Haematoma great toe',
          value: 278,
        },
        {
          label: 'FHPU - Nail bed haematoma lesser toes',
          value: 279,
        },
        {
          label: 'FHPX - Haematoma lesser toes',
          value: 280,
        },
        {
          label: 'FHXX - Foot Soft Tissue Bruising/ Haematoma',
          value: 281,
        },
        {
          label:
            'FHZX - Other foot soft tissue bruising/ haematoma not elsewhere specified',
          value: 282,
        },
        {
          label: 'FJBX - Bifurcate ligament sprain in foot',
          value: 1484,
        },
        {
          label:
            'FJFX - Forefoot joint sprain (ie MTP and IP joints lesser toes)',
          value: 326,
        },
        {
          label: 'FJHM - Sprain of 1st MTP joint/ turf toe',
          value: 327,
        },
        {
          label: 'FJHP - Sprain IP ligament(s) great toe',
          value: 328,
        },
        {
          label: 'FJHR - Sprain 1st MTP jt with volar plate rupture',
          value: 329,
        },
        {
          label: 'FJHX - Sprain of great toe',
          value: 330,
        },
        {
          label: 'FJMX - Midfoot joint/ ligament sprain',
          value: 331,
        },
        {
          label: 'FJPD - Mid/ distal plantar fasciitis',
          value: 332,
        },
        {
          label: 'FJPR - Plantar fascia rupture',
          value: 333,
        },
        {
          label: 'FJPX - Plantar fasciitis strain',
          value: 334,
        },
        {
          label: 'FJSX - Spring ligament sprain in foot',
          value: 335,
        },
        {
          label: 'FJXX - Foot Joint Sprain',
          value: 336,
        },
        {
          label: 'FKBX - Blisters foot',
          value: 321,
        },
        {
          label: 'FKCX - Callous on foot',
          value: 322,
        },
        {
          label: 'FKUX - Ulceration foot',
          value: 323,
        },
        {
          label:
            'FKXQ - Complication of foot laceration/ abrasion incl infection',
          value: 324,
        },
        {
          label: 'FKXX - Foot Laceration/ Abrasion',
          value: 325,
        },
        {
          label: 'FMXX - Foot Muscle Strain/ Spasm/ trigger Points',
          value: 337,
        },
        {
          label: 'FMYX - Foot muscle trigger points, cramping, spasm',
          value: 338,
        },
        {
          label: "FNMX - Morton's neuroma",
          value: 339,
        },
        {
          label: 'FNXX - Foot Neurological Injury',
          value: 340,
        },
        {
          label: 'FSBX - Cuboid stress fracture',
          value: 306,
        },
        {
          label: 'FSCX - Cuneiform stress fracture',
          value: 307,
        },
        {
          label: 'FSMA - First metatarsal stress fracture',
          value: 308,
        },
        {
          label: 'FSMB - Second metatarsal stress fracture',
          value: 309,
        },
        {
          label: 'FSMC - Third metatarsal stress fracture',
          value: 310,
        },
        {
          label: 'FSMD - Fourth metatarsal stress fracture',
          value: 311,
        },
        {
          label: 'FSME - Fifth metatarsal stress fracture',
          value: 312,
        },
        {
          label: 'FSMP - Base second metatarsal stress fracture',
          value: 313,
        },
        {
          label: 'FSMR - Stress rxn metatarsal/ metatarsalgia',
          value: 354,
        },
        {
          label: 'FSMX - Metatarsal stress fracture',
          value: 314,
        },
        {
          label: 'FSMZ - Other metatarsal stress fracture',
          value: 315,
        },
        {
          label: 'FSNN - Non union navicular stress fracture',
          value: 316,
        },
        {
          label: 'FSNX - Navicular stress fracture',
          value: 317,
        },
        {
          label: 'FSSA - AVN Sesamoid',
          value: 355,
        },
        {
          label: 'FSSF - Sesamoid stress fracture',
          value: 318,
        },
        {
          label: 'FSSS - Sesamoiditis/ stress fracture',
          value: 319,
        },
        {
          label: 'FSSX - Sesamoid stress injury',
          value: 356,
        },
        {
          label: 'FSXX - Stress Reactions/ Fractures in Foot',
          value: 320,
        },
        {
          label: 'FTET - Extensor tendinopathy in foot',
          value: 372,
        },
        {
          label: 'FTEX - Extensor tendon injury in foot',
          value: 373,
        },
        {
          label: 'FTTI - Tibialis posterior insertional tendinopathy',
          value: 374,
        },
        {
          label: 'FTTX - Tibialis posterior tendon injury in foot',
          value: 375,
        },
        {
          label: 'FTXX - Foot Tendon Injuries',
          value: 376,
        },
        {
          label: 'FVXX - Foot Vascular Injuries',
          value: 377,
        },
        {
          label: 'FZCX - Chronic regional pain syndrome foot',
          value: 357,
        },
        {
          label: 'FZXX - Foot Pain/ Injury Not otherwise specified',
          value: 358,
        },
        {
          label: 'FZZX - Foot pain Undiagnosed',
          value: 359,
        },
        {
          label: 'GAHX - Osteoarthritis Hip Joint',
          value: 555,
        },
        {
          label: 'GAXX - Hip/ Groin Arthritis',
          value: 556,
        },
        {
          label: 'GCCX - Hip joint chondral lesion',
          value: 557,
        },
        {
          label: 'GCVX - Inflammation/ stiffness of costovertebral joints',
          value: 208,
        },
        {
          label: 'GCXX - Hip Joint Chondral/ Osteochondral Injury',
          value: 558,
        },
        {
          label: 'GDXX - Hip Joint Dislocation',
          value: 516,
        },
        {
          label: 'GFAX - Acetabular fracture',
          value: 517,
        },
        {
          label: 'GFFN - Fractured neck of femur',
          value: 518,
        },
        {
          label: 'GFFX - Femoral fracture',
          value: 519,
        },
        {
          label: 'GFPI - Fracture inferior pubic ramus',
          value: 520,
        },
        {
          label: 'GFPS - Fracture superior pubic ramus',
          value: 521,
        },
        {
          label: 'GFPX - Fracture pubic ramus',
          value: 522,
        },
        {
          label: 'GFXX - Hip/ Groin Fractures',
          value: 523,
        },
        {
          label:
            'GGCX - Clicking hip (excl click d/t labral tear - GJLX, or psoas tendon - GMYS)',
          value: 577,
        },
        {
          label: 'GGFX - Femoral Acetabular Impingment of hip joint',
          value: 1481,
        },
        {
          label: 'GGSX - Synovitis of hip joint',
          value: 578,
        },
        {
          label:
            'GGXX - Hip Joint Inflammation/ Synovitis/ Other Biomechanical Lesion',
          value: 579,
        },
        {
          label: 'GHLX - Labial bruising/ haematoma',
          value: 512,
        },
        {
          label: 'GHSX - Scrotal/ testicular bruising/ haematoma',
          value: 513,
        },
        {
          label: 'GHXX - Hip and Groin Soft Tissue Bruising/ Haematoma',
          value: 514,
        },
        {
          label: 'GHZX - Other hip/groin bruising/ haematoma',
          value: 515,
        },
        {
          label: 'GJLX - Hip joint labral tear',
          value: 536,
        },
        {
          label: 'GJXX - Hip Joint Sprain',
          value: 537,
        },
        {
          label:
            'GKXQ - Complication of laceration/ abrasion including infection',
          value: 534,
        },
        {
          label: 'GKXX - Hip and Groin Laceration/ Abrasion',
          value: 535,
        },
        {
          label: 'GMFI - Iliopsoas muscle strain/ tear',
          value: 538,
        },
        {
          label: 'GMFP - Psoas muscle strain/ tear',
          value: 539,
        },
        {
          label: 'GMFX - Hip flexor muscle strain/ tear',
          value: 540,
        },
        {
          label: 'GMXX - Hip and Groin Muscle Strain/ Tear',
          value: 541,
        },
        {
          label: 'GMYP - Trigger points illiopsoas',
          value: 542,
        },
        {
          label: 'GMYS - Snapping psoas tendon',
          value: 543,
        },
        {
          label: 'GMYX - Hip and groin muscle spasm/ trigger points',
          value: 544,
        },
        {
          label: 'GNEG - Genitofemoral nerve entrapment',
          value: 545,
        },
        {
          label: 'GNEI - Ilioinguinal nerve entrapment',
          value: 546,
        },
        {
          label: 'GNEO - Obturator nerve entrapment',
          value: 547,
        },
        {
          label: 'GNEX - Nerve Entrapment Groin',
          value: 548,
        },
        {
          label: 'GNVA - Avascular necrosis femoral head',
          value: 615,
        },
        {
          label: 'GNVX - Vascular Injury Hip Joint',
          value: 616,
        },
        {
          label: 'GNXX - Groin Neurovascular Injuries',
          value: 549,
        },
        {
          label: 'GOPR - ruptured penis/ urethra',
          value: 550,
        },
        {
          label: 'GOPX - Penile injury',
          value: 551,
        },
        {
          label: 'GOSR - Testicular rupture',
          value: 552,
        },
        {
          label: 'GOSX - Scrotal +/- testicular injury',
          value: 553,
        },
        {
          label: 'GOXX - Groin Organ Damage',
          value: 554,
        },
        {
          label: 'GSFB - Stress fracture through femoral neck (both cortices)',
          value: 524,
        },
        {
          label: 'GSFI - Stress fracture inferior cortex femoral neck',
          value: 525,
        },
        {
          label: 'GSFS - Stress fracture superior cortex femoral neck',
          value: 526,
        },
        {
          label: 'GSFX - Femoral neck stress fracture',
          value: 527,
        },
        {
          label: 'GSPI - Stress fracture inferior pubic ramus',
          value: 528,
        },
        {
          label: 'GSPS - Stress fracture superior pubic ramus',
          value: 529,
        },
        {
          label: 'GSPX - Pelvic stress fracture',
          value: 530,
        },
        {
          label: 'GSXX - Hip/ Groin Stress Fracture',
          value: 531,
        },
        {
          label: 'GTAR - Abdominal tendon insertion rupture',
          value: 580,
        },
        {
          label: 'GTAS - Abdominal tendon insertion strain',
          value: 581,
        },
        {
          label: 'GTAT - Abdominal tendon insertion tendinopathy',
          value: 582,
        },
        {
          label: 'GTAX - Abdominal tendon insertion injury',
          value: 583,
        },
        {
          label: 'GTDR - Unspecified or multiple adductor tendon rupture',
          value: 584,
        },
        {
          label: 'GTDS - Unspecified or multiple adductor tendon strain',
          value: 585,
        },
        {
          label: 'GTDT - Unspecified or multiple adductor tendinopathy',
          value: 586,
        },
        {
          label: 'GTDX - Unspecified or multiple adductor tendon injury',
          value: 587,
        },
        {
          label: 'GTFB - Iliopsoas tendinopathy with bursitis',
          value: 588,
        },
        {
          label: 'GTFR - Iliopsoas tendon rupture',
          value: 589,
        },
        {
          label: 'GTFS - Iliopsoas tendon strain',
          value: 590,
        },
        {
          label: 'GTFT - Iliopsoas tendinopathy',
          value: 591,
        },
        {
          label: 'GTFX - Iliopsoas tendon injury',
          value: 592,
        },
        {
          label: 'GTHD - Direct inguinal hernia',
          value: 593,
        },
        {
          label: 'GTHF - Femoral hernia',
          value: 594,
        },
        {
          label: 'GTHI - Indirect inguinal hernia',
          value: 595,
        },
        {
          label: "GTHS - Sportsman's hernia",
          value: 596,
        },
        {
          label: 'GTHX - Groin hernias',
          value: 597,
        },
        {
          label: 'GTLR - Adductor longus tendon rupture',
          value: 598,
        },
        {
          label: 'GTLS - Adductor longus tendon strain',
          value: 599,
        },
        {
          label: 'GTLT - Adductor longus tendinopathy',
          value: 600,
        },
        {
          label: 'GTLX - Adductor longus tendon injury',
          value: 601,
        },
        {
          label: 'GTMR - Adductor magnus tendon rupture',
          value: 602,
        },
        {
          label: 'GTMS - Adductor magnus tendon strain',
          value: 603,
        },
        {
          label: 'GTMT - Adductor magnus tendinopathy',
          value: 604,
        },
        {
          label: 'GTMX - Adductor magnus tendon injury',
          value: 605,
        },
        {
          label: 'GTRR - Rectus femoris origin tendon rupture',
          value: 606,
        },
        {
          label: 'GTRS - Rectus femoris tendon strain',
          value: 607,
        },
        {
          label: 'GTRT - Rectus femoris origin tendinopathy',
          value: 608,
        },
        {
          label: 'GTRX - Rectus femoris tendon injury',
          value: 609,
        },
        {
          label: 'GTSR - Sartorius tendon rupture',
          value: 610,
        },
        {
          label: 'GTSS - Sartorius tendon strain',
          value: 611,
        },
        {
          label: 'GTST - Sartorius tendinopathy',
          value: 612,
        },
        {
          label: 'GTSX - Sartorius tendon injury',
          value: 613,
        },
        {
          label: 'GTXX - Hip and Groin Tendon Injuries',
          value: 614,
        },
        {
          label: 'GUPX - Pubic symphysis instability',
          value: 532,
        },
        {
          label: 'GUXX - Instability of Hip Jt/ Groin',
          value: 533,
        },
        {
          label: 'GYMX - Chronic non specific or multifactorial groin pain',
          value: 562,
        },
        {
          label: 'GYOX - Osteitis Pubis',
          value: 563,
        },
        {
          label: 'GYXX - Other Stress/ Overuse Injury Hip and Groin',
          value: 564,
        },
        {
          label: 'GZXX - Hip/ Groin Pain Not otherwise specified',
          value: 565,
        },
        {
          label: 'GZZX - Hip/Groin Pain undiagnosed',
          value: 566,
        },
        {
          label: 'HDJX - Jaw Dislocation',
          value: 424,
        },
        {
          label: 'HDXX - Facial Dislocation',
          value: 425,
        },
        {
          label: 'HFEF - Orbital floor fracture',
          value: 426,
        },
        {
          label: 'HFEM - Medial Wall fracture',
          value: 427,
        },
        {
          label: 'HFEX - Orbital fracture',
          value: 428,
        },
        {
          label: 'HFEZ - Other orbital fracture not otherwise specified',
          value: 429,
        },
        {
          label: 'HFMC - Compound fractured mandible',
          value: 430,
        },
        {
          label: 'HFMX - Mandibular fracture',
          value: 431,
        },
        {
          label: 'HFNX - Nasal fracture',
          value: 432,
        },
        {
          label: 'HFSF - Fractured frontal bone',
          value: 433,
        },
        {
          label: 'HFSX - Skull/cranial fracture',
          value: 434,
        },
        {
          label: 'HFUX - Maxillary fracture',
          value: 435,
        },
        {
          label: 'HFXX - Head/ Facial fracture',
          value: 436,
        },
        {
          label: 'HFZX - Zygoma fracture',
          value: 437,
        },
        {
          label: 'HHEC - Cauliflower Ear (Chronic)',
          value: 404,
        },
        {
          label: 'HHEX - Ear bruising/ haematoma',
          value: 405,
        },
        {
          label: 'HHJX - Jaw bruising/ haematoma',
          value: 406,
        },
        {
          label: 'HHMX - Mouth bruising/haematoma',
          value: 407,
        },
        {
          label: 'HHNE - Epistaxis',
          value: 408,
        },
        {
          label: 'HHNS - Septal haematoma',
          value: 409,
        },
        {
          label: 'HHNX - Nose bruising/ Haematoma',
          value: 410,
        },
        {
          label: 'HHOC - Conjunctival haematoma',
          value: 411,
        },
        {
          label: 'HHOO - Periorbital bruising/ haematoma',
          value: 412,
        },
        {
          label: 'HHOX - Eye bruising/ haematoma',
          value: 413,
        },
        {
          label: 'HHSX - Scalp bruising/ haematoma',
          value: 414,
        },
        {
          label: 'HHXX - Head / Facial Bruising/ Haematoma',
          value: 415,
        },
        {
          label: 'HHZX - Other bruising/ haematoma not otherwise specified',
          value: 416,
        },
        {
          label: 'HJJX - Jaw Sprain/ TMJ symptoms',
          value: 480,
        },
        {
          label: 'HJXX - Facial Joint sprain/ injury',
          value: 481,
        },
        {
          label: 'HKBN - Eyebrow laceration/ abrasion not requiring suturing',
          value: 438,
        },
        {
          label: 'HKBS - Eyebrow laceration requiring suturing',
          value: 439,
        },
        {
          label: 'HKBX - Eyebrow laceration/ abrasion',
          value: 440,
        },
        {
          label: 'HKCN - Cheek laceration/ abrasion not requiring suturing',
          value: 441,
        },
        {
          label: 'HKCS - Cheek lacerationrequiring suturing',
          value: 442,
        },
        {
          label: 'HKCX - Cheek laceration/ abrasion',
          value: 443,
        },
        {
          label: 'HKEN - Ear laceration/ abrasion not requiring suturing',
          value: 444,
        },
        {
          label: 'HKES - Ear laceration requiring suturing',
          value: 445,
        },
        {
          label: 'HKEX - Ear laceration/ abrasion',
          value: 446,
        },
        {
          label: 'HKHN - Forehead laceration/abrasion not requiring suturing',
          value: 447,
        },
        {
          label: 'HKHS - Forehead laceration requiring suturing',
          value: 448,
        },
        {
          label: 'HKHX - Forehead laceration/ abrasion',
          value: 449,
        },
        {
          label: 'HKJN - Chin laceration/ abrasion not requiring suturing',
          value: 450,
        },
        {
          label: 'HKJS - Chin laceration requiring suturing',
          value: 451,
        },
        {
          label: 'HKJX - Chin laceration',
          value: 452,
        },
        {
          label: 'HKKN - Lip laceration/abrasion not requiring suturing',
          value: 453,
        },
        {
          label: 'HKKS - Lip laceration requiring suturing',
          value: 454,
        },
        {
          label: 'HKKX - Lip laceration / abrasion',
          value: 455,
        },
        {
          label: 'HKLN - Eyelid laceration/ abrasion not requiring suturing',
          value: 456,
        },
        {
          label: 'HKLS - Eyelid aceration requiring suturing',
          value: 457,
        },
        {
          label: 'HKLX - Eyelid laceration/abrasion',
          value: 458,
        },
        {
          label: 'HKMX - Mouth/ musocal laceration/ abrasion',
          value: 459,
        },
        {
          label: 'HKNN - Nose laceration/ abrasion not requiring suturing',
          value: 460,
        },
        {
          label: 'HKNS - Nose laceration requiring suturing',
          value: 461,
        },
        {
          label: 'HKNX - Nose laceration/ abrasion',
          value: 462,
        },
        {
          label: 'HKOO - Periorbital laceration',
          value: 1487,
        },
        {
          label: 'HKPS - Perforating mouth laceration requiring suturing',
          value: 463,
        },
        {
          label: 'HKPX - Perforating mouth laceration',
          value: 464,
        },
        {
          label: 'HKSN - Scalp laceration/ abrasion not reuiring suturing',
          value: 465,
        },
        {
          label: 'HKSS - Scalp laceration requiring suturing',
          value: 466,
        },
        {
          label: 'HKSX - Scalp laceration/ abrasion',
          value: 467,
        },
        {
          label: 'HKTN - Tongue laceration not requiring suturing',
          value: 468,
        },
        {
          label: 'HKTS - Tongue laceration requiring suturing',
          value: 469,
        },
        {
          label: 'HKTX - Tongue laceration',
          value: 470,
        },
        {
          label:
            'HKXN - Head laceration location unspecified/ or multiple not requiring suturing',
          value: 471,
        },
        {
          label:
            'HKXQ - Complication of head laceration/ abrasion including infection',
          value: 472,
        },
        {
          label:
            'HKXS - Head laceration location unspecified/ or multiple requiring suturing',
          value: 473,
        },
        {
          label: 'HKXX - Head laceration/ abrasion',
          value: 474,
        },
        {
          label:
            'HKZN - Facial laceration/ abrasion NOS not requiring suturing',
          value: 475,
        },
        {
          label: 'HKZS - Facial laceration NOS requiring suturing',
          value: 476,
        },
        {
          label: 'HKZX - Facial laceration/ abrasion not otherwise specified',
          value: 477,
        },
        {
          label: 'HLMN - Mucosal laceration not requiring suturing',
          value: 478,
        },
        {
          label: 'HLMS - Musocal laceration requiring suturing',
          value: 479,
        },
        {
          label:
            'HMXX - Facial Muscle and/or Tendon strain/ spasm/ trigger points',
          value: 482,
        },
        {
          label: 'HMYX - Facial Muscle trigger points',
          value: 483,
        },
        {
          label: 'HNCA - Acute Concussion',
          value: 417,
        },
        {
          label: 'HNCC - Chronic Brain Injury',
          value: 418,
        },
        {
          label: 'HNCO - Acute Concussion with visual symptoms',
          value: 419,
        },
        {
          label: 'HNCX - Concussion ',
          value: 420,
        },
        {
          label: 'HNNX - Cranial Nerve injury',
          value: 421,
        },
        {
          label: 'HNVX - Intracranial Bleed',
          value: 422,
        },
        {
          label: 'HNXX - Concussion/ Brain Injury',
          value: 423,
        },
        {
          label: 'HODD - Avulsed Tooth',
          value: 484,
        },
        {
          label: 'HODF - Fractured Tooth',
          value: 485,
        },
        {
          label: 'HODL - Subluxed Tooth',
          value: 486,
        },
        {
          label: 'HODX - Dental Injury',
          value: 487,
        },
        {
          label: 'HOED - Perforated ear drum',
          value: 488,
        },
        {
          label: 'HOEX - Ear trauma',
          value: 489,
        },
        {
          label: 'HOOC - Eye foreign body - Corneal',
          value: 490,
        },
        {
          label: 'HOOH - Hyphaema',
          value: 491,
        },
        {
          label: 'HOOJ - Eye foreign body - Conjunctival',
          value: 492,
        },
        {
          label: 'HOOL - Contact lens displacement',
          value: 493,
        },
        {
          label: 'HOOM - Eye trauma with multiple lesions',
          value: 494,
        },
        {
          label: 'HOOP - Eye foreign body - perforating',
          value: 495,
        },
        {
          label: 'HOOR - Retinal detachment',
          value: 496,
        },
        {
          label: 'HOOU - Corneal Abrasion',
          value: 497,
        },
        {
          label: 'HOOX - Eye injury/ trauma',
          value: 498,
        },
        {
          label: 'HOOZ - Eye foreign body - not otherwise specified',
          value: 499,
        },
        {
          label: 'HOXX - Head Organ Damage ',
          value: 500,
        },
        {
          label: 'HXXX - Head Injuries',
          value: 501,
        },
        {
          label: 'HZEM - Exercise related migraine',
          value: 502,
        },
        {
          label: 'HZEX - Exercise related headache',
          value: 503,
        },
        {
          label: 'HZNM - Muscular trigger point referred headache',
          value: 504,
        },
        {
          label: 'HZNX - Cervicogenic headache',
          value: 505,
        },
        {
          label:
            'HZXX - Head Pain/ Injury Not Otherwise Specified (Including headache)',
          value: 506,
        },
        {
          label: 'HZZX - Other head pain/ injury not otherwise specified',
          value: 507,
        },
        {
          label: 'IACC - Calcaneocuboid coalition',
          value: 362,
        },
        {
          label: 'IACN - Calcaneonavicular coalition',
          value: 363,
        },
        {
          label: 'IACT - Talonavicular Coalition',
          value: 364,
        },
        {
          label: 'IACX - Tarsal Coalition of foot',
          value: 365,
        },
        {
          label: 'IAXX - Structural Abnormality of Ankle',
          value: 8,
        },
        {
          label: 'ICRX - Cervical rib',
          value: 168,
        },
        {
          label: 'ICXX - Chest Structural Abnormaility',
          value: 169,
        },
        {
          label: 'IDKX - Thoracic kyphosis',
          value: 1137,
        },
        {
          label: 'IDSX - Thoracic scoliosis',
          value: 1138,
        },
        {
          label: 'IDXX - Thoracic Spine Structural Abnormaility',
          value: 1139,
        },
        {
          label: 'IEXX - Elbow Structural Abnormality',
          value: 256,
        },
        {
          label: 'IFAX - Accessory bone foot',
          value: 366,
        },
        {
          label: 'IFXX - Structural Abnormality of Foot',
          value: 367,
        },
        {
          label: 'IGHD - Congenital dislocation of hip',
          value: 574,
        },
        {
          label: 'IGHX - Congenital abnormality of hip joint',
          value: 575,
        },
        {
          label: 'IGXX - Structural Abnormaility of Hip/ Groin',
          value: 576,
        },
        {
          label: 'IKCD - Discoid lateral meniscus',
          value: 726,
        },
        {
          label: 'IKCX - Congenital cartilage abnormality of knee',
          value: 727,
        },
        {
          label: 'IKPX - Bi or multipartite patella',
          value: 728,
        },
        {
          label: 'IKXX - Structural Abnormality of knee',
          value: 729,
        },
        {
          label: 'ILCB - Spina Bifida',
          value: 904,
        },
        {
          label: 'ILCL - Lumbarisation of S1',
          value: 905,
        },
        {
          label: 'ILCS - Sacralisation of L5',
          value: 906,
        },
        {
          label: 'ILCX - Congenital abnormality Lumbar Spine',
          value: 907,
        },
        {
          label: 'ILSX - Lumbar Scoliosis',
          value: 908,
        },
        {
          label: 'ILXX - Lumbosacral Spine Structural Abnormality',
          value: 909,
        },
        {
          label: 'IMHE - Generalised hypermobility of joints',
          value: 1216,
        },
        {
          label: 'IMHO - Generalised hypomobility of joints',
          value: 1217,
        },
        {
          label: 'IMHX - Hypo or hyper - mobility of joints',
          value: 1218,
        },
        {
          label: 'IMLA - Apparent leg length discrepancy',
          value: 1219,
        },
        {
          label: 'IMLQ - Tibial leg length discrepancy',
          value: 1220,
        },
        {
          label: 'IMLT - Femoral leg length discrspancy',
          value: 1221,
        },
        {
          label: 'IMLX - Leg length abnormaility',
          value: 1222,
        },
        {
          label: 'IMXX - Generalised Abnormality of the Musculoskeletal System',
          value: 1223,
        },
        {
          label: 'INXX - Structural Abnormality Cervical Spine',
          value: 946,
        },
        {
          label: 'IOXX - Abdominopelvic Structural abnormality',
          value: 1168,
        },
        {
          label: 'IQMS - Accessory soleus muscle (excl inj to that muscle)',
          value: 817,
        },
        {
          label: 'IQMX - Muscle abnormality of lower leg',
          value: 818,
        },
        {
          label: 'IQXX - Structural Abnormality of Lower leg',
          value: 819,
        },
        {
          label: 'ISXX - Shoulder Structural Abnormaility',
          value: 1030,
        },
        {
          label: 'IWCB - Carpal boss',
          value: 1441,
        },
        {
          label: 'IWCX - Carpal bone structural abnormality',
          value: 1442,
        },
        {
          label: 'IWUN - Negative ulnar variance',
          value: 1443,
        },
        {
          label: 'IWUP - Positive ulnar variance',
          value: 1444,
        },
        {
          label: 'IWUX - Radioulnar variance',
          value: 1445,
        },
        {
          label: 'IWXX - Wrist and Hand Structural Abnormality',
          value: 1446,
        },
        {
          label: 'JCAX - Osteochondrosis of ankle',
          value: 3,
        },
        {
          label: 'JCEC - Capitellar osteochondrosis',
          value: 250,
        },
        {
          label: 'JCEX - Osteochondrosis elbow',
          value: 251,
        },
        {
          label: "JCFF - Freiberg's disease - osteochondrosis of MT head",
          value: 350,
        },
        {
          label: "JCFK - Kholer's disease - navicular osteochondrosis",
          value: 351,
        },
        {
          label: 'JCFX - Osteochondrosis of foot',
          value: 352,
        },
        {
          label: 'JCGP - Perthes disease',
          value: 559,
        },
        {
          label: 'JCGS - Slipped capital femoral epiphysis',
          value: 560,
        },
        {
          label: 'JCGX - Osteochondroses of hip joint',
          value: 561,
        },
        {
          label: 'JCKF - OCD Medial or lateral femoral condyle',
          value: 684,
        },
        {
          label: 'JCKP - OCD Patella',
          value: 685,
        },
        {
          label: 'JCKS - Osteochondrosis of knee',
          value: 686,
        },
        {
          label:
            "JCKT - Epiphysitis of medial tibial plateau (Blount's Disease)",
          value: 687,
        },
        {
          label: 'JCLS - Scheuermanns disease',
          value: 1069,
        },
        {
          label: 'JCLX - Osteochondrosis Spine',
          value: 1070,
        },
        {
          label: 'JCSX - Osteochondrosis shoulder',
          value: 1016,
        },
        {
          label: 'JCWR - Epiphysitis of distal radius',
          value: 1419,
        },
        {
          label: 'JCWX - Osteochondrosis of wrist and hand',
          value: 1420,
        },
        {
          label: 'JCXX - Other Osteochondroses',
          value: 1210,
        },
        {
          label: 'JCZX - Other Osteochondrosis not elsewhere specified. ',
          value: 1211,
        },
        {
          label:
            'JTAC - Apophysitis/ avulsion fracture to calcaneus (Severs Dx)',
          value: 1,
        },
        {
          label: 'JTAX - Traction injury to apophysis ankle',
          value: 2,
        },
        {
          label: 'JTBH - Apophysitis/ avulsion fracture Iischial tuberosity',
          value: 108,
        },
        {
          label: 'JTBI - Apophysitis/ avulsion fracture iliac crest',
          value: 109,
        },
        {
          label: 'JTBX - Traction injury to apophysis at buttock and pelvis',
          value: 110,
        },
        {
          label:
            'JTEM - Apophysitis/ avulsion fracture medial epicondyle elbow',
          value: 212,
        },
        {
          label: 'JTEX - Traction injury to apophysis at elbow',
          value: 213,
        },
        {
          label: 'JTFM - Apophysitis/ avulsion fracture base 5th metetarsal',
          value: 275,
        },
        {
          label: 'JTFX - Traction injury to foot',
          value: 276,
        },
        {
          label: 'JTGR - Apophysitis/ avulsion fracture AIIS',
          value: 508,
        },
        {
          label: 'JTGS - Apophysitis/ avulsion fracture ASIS',
          value: 509,
        },
        {
          label: 'JTGX - Traction injury to apophysis at groin/ hip joint',
          value: 510,
        },
        {
          label: 'JTGZ - Other apophysitis/ avulsion fracture groin/ hip',
          value: 511,
        },
        {
          label:
            'JTKP - Apophysitis/ avulsion fracture distal pole patella (SLJ)',
          value: 617,
        },
        {
          label: 'JTKT - Apophysitis/ avulsion fracture tibial tubercle (OGS)',
          value: 618,
        },
        {
          label: 'JTKX - Traction injury to apophysis at knee',
          value: 619,
        },
        {
          label: 'JTSX - Traction injury to apophysis at shoulder',
          value: 947,
        },
        {
          label: 'JTWX - Traction injury to apophysis at wrist/ hand',
          value: 1265,
        },
        {
          label: 'JTXX - Traction Apophysitis/ Avusion Fracture Apophysitis',
          value: 1174,
        },
        {
          label:
            'JTZX - Other traction injury to apophysis not otherwise specified',
          value: 1175,
        },
        {
          label: 'JXXX - Paediatric Diagnoses',
          value: 1488,
        },
        {
          label: 'KABX - Bi or tri-comparmental osteoarthritis',
          value: 679,
        },
        {
          label: 'KALX - Lateral compartment osteoarthritis knee',
          value: 680,
        },
        {
          label: 'KAMX - Medial compartment osteoarthritis knee',
          value: 681,
        },
        {
          label: 'KAPX - Patellofemoral osteoarthritis',
          value: 682,
        },
        {
          label: 'KAXX - Knee Osteoarthritis',
          value: 683,
        },
        {
          label: 'KCBX - Mixed osteochondral and meniscal injury',
          value: 688,
        },
        {
          label: 'KCCB - Two or more osteochondral injury sites',
          value: 689,
        },
        {
          label: 'KCCL - Lateral femoral condyle osteochondral injury',
          value: 690,
        },
        {
          label: 'KCCM - Medial femoral condyle osteochondral injury',
          value: 691,
        },
        {
          label: 'KCCP - Patellofemoral osteochondral injury',
          value: 692,
        },
        {
          label: 'KCCT - Tibial osteochondral injury',
          value: 693,
        },
        {
          label: 'KCCX - Knee osteochondral injury',
          value: 694,
        },
        {
          label: 'KCLX - Knee cartilage injury with loose bodies',
          value: 695,
        },
        {
          label: 'KCMB - Medial and lateral meniscal tears',
          value: 696,
        },
        {
          label: 'KCMC - Lateral meniscal cyst',
          value: 697,
        },
        {
          label: 'KCMD - Degenerative meniscal tear',
          value: 698,
        },
        {
          label: 'KCML - Lateral meniscal tear',
          value: 699,
        },
        {
          label: 'KCMM - Medial meniscal tear',
          value: 700,
        },
        {
          label: 'KCMX - Knee Meniscal cartilage injury',
          value: 701,
        },
        {
          label: 'KCXX - Knee Cartilage Injury',
          value: 702,
        },
        {
          label: 'KDKQ - Knee dislocation with neural or vascular complication',
          value: 627,
        },
        {
          label: 'KDKX - Knee dislocation',
          value: 628,
        },
        {
          label: 'KDPF - Patellar dislocation with avulsion fracture patella',
          value: 629,
        },
        {
          label: 'KDPX - Patellar dislocation',
          value: 630,
        },
        {
          label: 'KDSX - Superior tib fib joint dislocation',
          value: 631,
        },
        {
          label: 'KDXX - Knee Dislocation ',
          value: 632,
        },
        {
          label: 'KFFI - Intraarticular femoral fracture',
          value: 633,
        },
        {
          label: 'KFFX - Distal femoral fracture',
          value: 634,
        },
        {
          label: 'KFPX - Patellar fracture',
          value: 635,
        },
        {
          label: 'KFTI - Intraarticular tibial fracture',
          value: 636,
        },
        {
          label: 'KFTX - Proximal tibial fracture',
          value: 637,
        },
        {
          label: 'KFXX - Knee Fractures',
          value: 638,
        },
        {
          label: 'KGBR - Ruptured Bakers Cyst',
          value: 704,
        },
        {
          label: 'KGBX - Bakers Cyst',
          value: 705,
        },
        {
          label: 'KGIX - ITB friction syndrome',
          value: 735,
        },
        {
          label: 'KGPB - PFS related to bipartite patella',
          value: 703,
        },
        {
          label: "KGPH - Hoffa's fat pad impingement",
          value: 730,
        },
        {
          label: 'KGPL - Excess lateral pressure syndrome',
          value: 731,
        },
        {
          label: 'KGPT - Patellofemoral pain with patellar tendinopathy',
          value: 736,
        },
        {
          label: 'KGPX - Patellofemoral pain',
          value: 706,
        },
        {
          label: 'KGSP - Synovial plica of knee',
          value: 732,
        },
        {
          label: 'KGSX - Knee joint synovitis',
          value: 733,
        },
        {
          label:
            'KGXX - Knee Impingement/ Synovitis/ Biomechanical Lesion not associated with other conditions',
          value: 734,
        },
        {
          label: 'KHBB - Pes Anserine burstitis of knee',
          value: 1483,
        },
        {
          label: 'KHBI - Infrapatellar fat pad haematoma/ bursitis',
          value: 620,
        },
        {
          label: 'KHBP - Prepatellar bursitis',
          value: 621,
        },
        {
          label: 'KHBX - Traumatic knee bursitis',
          value: 622,
        },
        {
          label: 'KHMX - Knee MCL contusion',
          value: 623,
        },
        {
          label: 'KHQX - Distal quadricep haematoma',
          value: 624,
        },
        {
          label: 'KHXX - Knee Soft Tissue Bruising/ Haematoma',
          value: 625,
        },
        {
          label: 'KHZX - Other soft tissue bruising/ haematoma knee',
          value: 626,
        },
        {
          label: 'KJAC - ACL strain/ rupture with chondral/ meniscal injury',
          value: 653,
        },
        {
          label: 'KJAG - ACL graft rupture',
          value: 654,
        },
        {
          label: 'KJAP - Partial ACL tear',
          value: 655,
        },
        {
          label: 'KJAR - ACL rupture',
          value: 656,
        },
        {
          label: 'KJAX - Acute ACL injury',
          value: 657,
        },
        {
          label:
            'KJBC - Combined ligament injury with chondral/meniscal injury',
          value: 658,
        },
        {
          label: 'KJBX - Combined ligament injuries knee',
          value: 659,
        },
        {
          label:
            'KJCC - PCL strain/ rupture with associated chondral/ meniscal injury',
          value: 660,
        },
        {
          label: 'KJCP - Partial PCL tear',
          value: 661,
        },
        {
          label: 'KJCR - PCL rupture',
          value: 662,
        },
        {
          label: 'KJCX - Acute PCL injury',
          value: 663,
        },
        {
          label: 'KJLC - PLC injury with chondral / meniscal injury',
          value: 664,
        },
        {
          label: 'KJLL - LCL strain/ rupture',
          value: 665,
        },
        {
          label: 'KJLP - Posterolateral corner strain/ rupture',
          value: 666,
        },
        {
          label: 'KJLX - Posterolateral corner and LCL ligament injuries knee',
          value: 667,
        },
        {
          label: 'KJMA - Grade 1 MCL tear knee',
          value: 668,
        },
        {
          label: 'KJMB - Grade 2 MCL tear knee',
          value: 669,
        },
        {
          label:
            'KJMC - MCL strain/ rupture with chondral/ meniscal damage knee',
          value: 670,
        },
        {
          label:
            'KJMQ - Complication post MCL strain/ rupture incl. Pellegrini Stieda lesion',
          value: 671,
        },
        {
          label: 'KJMR - MCL rupture knee',
          value: 672,
        },
        {
          label: 'KJMX - MCL injury knee',
          value: 673,
        },
        {
          label: 'KJPX - Patellar subluxation',
          value: 674,
        },
        {
          label: 'KJSX - Superior tib fib joint sprain',
          value: 675,
        },
        {
          label: 'KJXX - Knee Sprains/ Ligament Injuries',
          value: 676,
        },
        {
          label: 'KKDX - Deep knee laceration - intraarticular',
          value: 649,
        },
        {
          label: 'KKSX - Superficial knee laceration/ abrasion',
          value: 650,
        },
        {
          label:
            'KKXQ - Complication of knee laceration/ abrasion incl infection',
          value: 651,
        },
        {
          label: 'KKXX - Knee Laceration/ Abrasion',
          value: 652,
        },
        {
          label: 'KL01 - Influenza (A/B)',
          value: 1729,
        },
        {
          label: 'KL02 - Strep throat',
          value: 1730,
        },
        {
          label: 'KL03 - Attention Deficit Disorder (ADD)',
          value: 1731,
        },
        {
          label: 'KL04 - Attention Deficit Hyperactivity Disorder (ADHD)',
          value: 1732,
        },
        {
          label: 'KL05 - Immune thrombocytopenia',
          value: 1733,
        },
        {
          label: 'KL06 - Orthostatic hypotension',
          value: 1734,
        },
        {
          label: 'KL07 - Diabetes (Type I)',
          value: 1735,
        },
        {
          label: 'KL08 - Diabetes (Type II)',
          value: 1736,
        },
        {
          label: 'KL09 - RED-S (Relative Energy Deficiency in Sport)',
          value: 1737,
        },
        {
          label: 'KL10 - Kidney stone',
          value: 1738,
        },
        {
          label: 'KL100 - Shingles (Zoster Virus)',
          value: 2062,
        },
        {
          label: 'KL101 - Meningitis (Viral)',
          value: 2063,
        },
        {
          label: 'KL102 - Meningitis (Bacterial)',
          value: 2064,
        },
        {
          label: 'KL103 - Heat Cramps (Muscular)',
          value: 2065,
        },
        {
          label: 'KL104 - Heat Syncope',
          value: 2066,
        },
        {
          label: 'KL105 - Hyperthermia/ Heat Exhaustion',
          value: 2067,
        },
        {
          label: 'KL106 - Allergic Reaction',
          value: 2068,
        },
        {
          label: 'KL107 - Anaphylactic Reaction to Medication',
          value: 2069,
        },
        {
          label: 'KL108 - Anaphylactic Reaction to Food',
          value: 2070,
        },
        {
          label: 'KL109 - Medication Allergy (excluding Anaphylaxis)',
          value: 2071,
        },
        {
          label: 'KL11 - Exhaustion (Overexertion)',
          value: 1739,
        },
        {
          label: 'KL110 - Food Allergy (excluding Anaphylaxis)',
          value: 2072,
        },
        {
          label: 'KL111 - Allergic Reaction (Non-specific)',
          value: 2073,
        },
        {
          label: 'KL112 - Commotio Cordis',
          value: 2074,
        },
        {
          label: 'KL113 - Other DVT',
          value: 2075,
        },
        {
          label: 'KL114 - Superficial Thrombophlebitis',
          value: 2076,
        },
        {
          label: 'KL115 - Deep Vein Thrombosis',
          value: 2077,
        },
        {
          label: 'KL116 - Wolf-Parkinson White Syndrome (WPW)',
          value: 2078,
        },
        {
          label: 'KL117 - Hypertension Undiagnosed',
          value: 2079,
        },
        {
          label: 'KL118 - Gallstones',
          value: 2082,
        },
        {
          label: 'KL119 - Hydrocele',
          value: 2083,
        },
        {
          label: 'KL12 - Syncope',
          value: 1740,
        },
        {
          label: 'KL120 - Oligomenorrhoea',
          value: 2084,
        },
        {
          label: 'KL121 - General Irregularity of Menstrual Cycle',
          value: 2085,
        },
        {
          label: 'KL122 - OBGYN Cystic Lesions (excl. Tumours/ Malignancies)',
          value: 2086,
        },
        {
          label: 'KL123 - Polycystic Ovarian Syndrome',
          value: 2087,
        },
        {
          label: 'KL124 - Benign Ovarian Cyst',
          value: 2088,
        },
        {
          label: 'KL125 - Benign Cyst of Breast',
          value: 2089,
        },
        {
          label: 'KL126 - Other Benign Cyst Obgyn',
          value: 2090,
        },
        {
          label: 'KL127 - Sickle Cell Anaemia',
          value: 2091,
        },
        {
          label: 'KL128 - Metabolic Illness',
          value: 2092,
        },
        {
          label: 'KL129 - Diabetic Coma',
          value: 2093,
        },
        {
          label: 'KL13 - Conjunctivitis',
          value: 1741,
        },
        {
          label: 'KL130 - Diabetic Shock',
          value: 2094,
        },
        {
          label: 'KL131 - Diabetic Ketoacidosis',
          value: 2095,
        },
        {
          label: 'KL132 - Hyperglycemia',
          value: 2096,
        },
        {
          label: 'KL133 - Hypoglycemia',
          value: 2097,
        },
        {
          label: 'KL134 - Hyponatremia',
          value: 2098,
        },
        {
          label: 'KL135 - Hypocalcemia',
          value: 2099,
        },
        {
          label: 'KL136 - Hypercalcemia',
          value: 2100,
        },
        {
          label: 'KL137 - Folliculitis',
          value: 2101,
        },
        {
          label: 'KL138 - Post Traumatic Stress Disorder (Post-Injury)',
          value: 2102,
        },
        {
          label: 'KL139 - Post traumatic stress disorder (Post-Surgery)',
          value: 2103,
        },
        {
          label: 'KL14 - MRSA Not Specifically Mentioned',
          value: 1976,
        },
        {
          label: 'KL140 - Sleep Disorder(s)',
          value: 2104,
        },
        {
          label: 'KL141 - General Sleep Disorder',
          value: 2105,
        },
        {
          label: 'KL142 - Primary Insomnia (excl other assoc. diagnosis)',
          value: 2106,
        },
        {
          label: 'KL143 - Secondary Insomnia (incl other assoc. diagnosis)',
          value: 2107,
        },
        {
          label: 'KL144 - Tumour Obgyn',
          value: 2108,
        },
        {
          label: 'KL145 - Clinical Fatigue (Undiagnosed)',
          value: 2109,
        },
        {
          label: 'KL146 - Dizziness (Undiagnosed)',
          value: 2110,
        },
        {
          label: 'KL147 - Dehydration',
          value: 2111,
        },
        {
          label: 'KL148 - Electrolyte Imbalance',
          value: 2112,
        },
        {
          label: 'KL149 - Nausea (Undiagnosed)',
          value: 2113,
        },
        {
          label: 'KL15 - Staphylococcus Not Specifically Mentioned',
          value: 1977,
        },
        {
          label: 'KL150 - Overtraining Syndrome',
          value: 2114,
        },
        {
          label: 'KL151 - Vasovagal Syncope',
          value: 2115,
        },
        {
          label: 'KL152 - Somatic Dysfunction',
          value: 2116,
        },
        {
          label: 'KL153 - Duplicate Injury Entry',
          value: 2117,
        },
        {
          label: 'KL154 - Confirmed COVID-19 infection (Symptomatic)',
          value: 2080,
        },
        {
          label: 'KL155 - Confirmed COVID-19 infection (Asymptomatic)',
          value: 2081,
        },
        {
          label: 'KL156 - Otorrhea',
          value: 2118,
        },
        {
          label: 'KL157 - Otorrhagia',
          value: 2119,
        },
        {
          label: 'KL158 - Abdominal Aortic Aneurysm',
          value: 2120,
        },
        {
          label: 'KL159 - \tOtalgia',
          value: 2159,
        },
        {
          label: 'KL16 - Impetigo',
          value: 1978,
        },
        {
          label: 'KL160 - Infection of Head/ Face/ Neck',
          value: 2160,
        },
        {
          label: 'KL161 - Infection of Foot (excl. joint)',
          value: 2161,
        },
        {
          label: 'KL162 - Infection lower leg',
          value: 2162,
        },
        {
          label: 'KL163 - Infection of Wrist and/or Hand (excl. joint)',
          value: 2163,
        },
        {
          label: 'KL164 - Infection of Wrist/ Hand/ Finger(s) (excl. joint)',
          value: 2164,
        },
        {
          label: 'KL165 - Infection of Elbow and/ or Forearm (excl. joint)',
          value: 2165,
        },
        {
          label: 'KL166 - Other Abcess',
          value: 2166,
        },
        {
          label: 'KL167 - Other Cellulitis/Abcess not specifically mentioned',
          value: 2167,
        },
        {
          label: 'KL17 - Carbuncle',
          value: 1979,
        },
        {
          label: 'KL18 - Cellulitis/ Abcess Head/ Face/ Neck',
          value: 1980,
        },
        {
          label: 'KL19 - Abcess Head/ Face/ Neck',
          value: 1981,
        },
        {
          label: 'KL20 - MRSA Head/Face/Neck',
          value: 1982,
        },
        {
          label: 'KL21 - Staphylococcus Head/Face/Neck',
          value: 1983,
        },
        {
          label: 'KL22 - Infection of Upper Arm/ Shoulder',
          value: 1984,
        },
        {
          label: 'KL23 - Cellulitis/ Abcess Upper Arm/ Shoulder',
          value: 1985,
        },
        {
          label: 'KL24 - Abcess Upper Arm/ Shoulder',
          value: 1986,
        },
        {
          label: 'KL25 - MRSA Upper Arm/ Shoulder',
          value: 1987,
        },
        {
          label: 'KL26 - Staphylococcus Upper Arm/ Shoulder',
          value: 1988,
        },
        {
          label: 'KL27 - Infection of Elbow',
          value: 1989,
        },
        {
          label: 'KL28 - Cellulitis/Abcess Elbow (excl. Joint)',
          value: 1990,
        },
        {
          label: 'KL29 - Abcess Elbow (excl. Joint)',
          value: 1991,
        },
        {
          label: 'KL30 - MRSA Elbow (excl. Joint)',
          value: 1992,
        },
        {
          label: 'KL31 - Staphylococcus Elbow (excl. Joint)',
          value: 1993,
        },
        {
          label: 'KL32 - Infection of Forearm',
          value: 1994,
        },
        {
          label: 'KL33 - Cellulitis/Abcess Forearm',
          value: 1995,
        },
        {
          label: 'KL34 - Abcess Forearm',
          value: 1996,
        },
        {
          label: 'KL35 - MRSA Forearm',
          value: 1997,
        },
        {
          label: 'KL36 - Staphylococcus Forearm',
          value: 1998,
        },
        {
          label: 'KL37 - Cellulitis/ Abcess Wrist/ Hand (excl. Joint)',
          value: 1999,
        },
        {
          label: 'KL38 - Abcess Wrist/ Hand (excl. Joint)',
          value: 2000,
        },
        {
          label: 'KL39 - MRSA Wrist/Hand (excl. Joint)',
          value: 2001,
        },
        {
          label: 'KL40 - Staphylococcus Wrist/Hand (excl. Joint)',
          value: 2002,
        },
        {
          label: 'KL41 - Infection of Finger(s) (excl. Joint)',
          value: 2003,
        },
        {
          label: 'KL42 - Cellulitis/ Abcess Finger(s) (excl. Joint)',
          value: 2004,
        },
        {
          label: 'KL43 - Abcess Finger(s) (excl. Joint)',
          value: 2005,
        },
        {
          label: 'KL44 - MRSA Finger(s) (excl. Joint)',
          value: 2006,
        },
        {
          label: 'KL45 - Staphylococcus Finger(s) (excl. Joint)',
          value: 2007,
        },
        {
          label: 'KL46 - Infection of Trunk/ Abdomen (excl. Organs)',
          value: 2008,
        },
        {
          label: 'KL47 - Cellulitis/ Abcess Trunk/ Abdomen',
          value: 2009,
        },
        {
          label: 'KL48 - Abcess Trunk/ Abdomen',
          value: 2010,
        },
        {
          label: 'KL49 - MRSA Trunk/Abdomen',
          value: 2011,
        },
        {
          label: 'KL50 - Staphylococcus Trunk/ Abdomen',
          value: 2012,
        },
        {
          label: 'KL51 - Cellulitis/ Abcess Infection Pelvis/Buttock',
          value: 2013,
        },
        {
          label: 'KL52 - Abcess Pelvis/ Buttock',
          value: 2014,
        },
        {
          label: 'KL53 - MRSA Pelvis/Buttock',
          value: 2015,
        },
        {
          label: 'KL54 - Staphylococcus Pelvis/Buttock',
          value: 2016,
        },
        {
          label: 'KL55 - Infection of Hip and/ or Thigh (excl. Joint)',
          value: 2017,
        },
        {
          label: 'KL56 - Infection of Hip (excl. Joint)',
          value: 2018,
        },
        {
          label: 'KL57 - Cellulitis/ Abcess Hip (excl. Joint)',
          value: 2019,
        },
        {
          label: 'KL58 - Abcess Hip (excl. Joint)',
          value: 2020,
        },
        {
          label: 'KL59 - MRSA Hip (excl. Joint)',
          value: 2021,
        },
        {
          label: 'KL60 - Staphylococcus Hip (excl. Joint)',
          value: 2022,
        },
        {
          label: 'KL61 - Infection of Thigh',
          value: 2023,
        },
        {
          label: 'KL62 - Cellulitis/Abcess Thigh',
          value: 2024,
        },
        {
          label: 'KL63 - Abcess Thigh',
          value: 2025,
        },
        {
          label: 'KL64 - MRSA Thigh',
          value: 2026,
        },
        {
          label: 'KL65 - Staphylococcus Thigh',
          value: 2027,
        },
        {
          label: 'KL66 - Infection of Knee (excl. Joint)',
          value: 2028,
        },
        {
          label: 'KL67 - Cellulitis/Abcess Knee (excl. Joint)',
          value: 2029,
        },
        {
          label: 'KL68 - Abcess Knee (excl. Joint)',
          value: 2030,
        },
        {
          label: 'KL69 - MRSA Knee (excl. Joint)',
          value: 2031,
        },
        {
          label: 'KL70 - Staphylococcus Knee (excl. Joint)',
          value: 2032,
        },
        {
          label: 'KL71 - Cellulitis/Abcess Lower Leg',
          value: 2033,
        },
        {
          label: 'KL72 - Abcess Lower Leg',
          value: 2034,
        },
        {
          label: 'KL73 - MRSA Lower Leg',
          value: 2035,
        },
        {
          label: 'KL74 - Staphylococcus Lower Leg',
          value: 2036,
        },
        {
          label: 'KL75 - Cellulitis/Abcess Foot (excl. Joint)',
          value: 2037,
        },
        {
          label: 'KL76 - Abcess Foot (excl. Joint)',
          value: 2038,
        },
        {
          label: 'KL77 - MRSA Foot (excl. Joint)',
          value: 2039,
        },
        {
          label: 'KL78 - Staphylococcus Foot (excl. Joint)',
          value: 2040,
        },
        {
          label: 'KL79 - Infection of Ankle (excl. Joint)',
          value: 2041,
        },
        {
          label: 'KL80 - Cellulitis/ Abcess Ankle (excl. Joint)',
          value: 2042,
        },
        {
          label: 'KL81 - Abcess Ankle (excl. Joint)',
          value: 2043,
        },
        {
          label: 'KL82 - MRSA Ankle (excl. Joint)',
          value: 2044,
        },
        {
          label: 'KL83 - Staphylococcus Ankle (excl. Joint)',
          value: 2045,
        },
        {
          label: 'KL84 - Pityriasis Rosea',
          value: 2046,
        },
        {
          label: 'KL85 - Herpes Gladitorum',
          value: 2047,
        },
        {
          label: 'KL86 - Molluscum Contagiosum',
          value: 2048,
        },
        {
          label: 'KL87 - Tinea Capitis',
          value: 2049,
        },
        {
          label: 'KL88 - Tinea Corporis',
          value: 2050,
        },
        {
          label: 'KL89 - Tinea Versicolor',
          value: 2051,
        },
        {
          label: 'KL90 - Pulmonary Embolus(i)',
          value: 2052,
        },
        {
          label: 'KL91 - Other Ear Disorder NOS',
          value: 2053,
        },
        {
          label: 'KL92 - Eye Infection',
          value: 2054,
        },
        {
          label: 'KL93 - Conjunctivitis (Viral/ Bacterial)',
          value: 2055,
        },
        {
          label: 'KL94 - Conjunctivitis (Allergic)',
          value: 2056,
        },
        {
          label: 'KL95 - Urinary Tract Infection',
          value: 2057,
        },
        {
          label: 'KL96 - Bladder Infection',
          value: 2058,
        },
        {
          label: 'KL97 - Infected Wrist Joint',
          value: 2059,
        },
        {
          label: 'KL98 - Infected Thumb Joint',
          value: 2060,
        },
        {
          label: 'KL99 - Mononucleosis',
          value: 2061,
        },
        {
          label: 'KMPX - Popliteus muscle strain',
          value: 677,
        },
        {
          label: 'KMXX - Knee Muscle Strain/ Spasm/ Trigger Points',
          value: 678,
        },
        {
          label: 'KN01 - Osgood-Schlatter syndrome',
          value: 1742,
        },
        {
          label: 'KN02 - Snapping scapula syndrome',
          value: 1743,
        },
        {
          label: 'KN03 - Posterior labral lesion',
          value: 1744,
        },
        {
          label: 'KN04 - Stress reaction thoracic spine - grade 1',
          value: 1745,
        },
        {
          label: 'KN05 - Stress reaction thoracic spine - grade 2',
          value: 1746,
        },
        {
          label: 'KN06 - Stress reaction thoracic spine - grade 3',
          value: 1747,
        },
        {
          label: 'KN07 - Stress reaction lumbar spine - grade 1',
          value: 1748,
        },
        {
          label: 'KN08 - Stress reaction lumbar spine - grade 2',
          value: 1749,
        },
        {
          label: 'KN09 - Stress reaction lumbar spine - grade 3',
          value: 1750,
        },
        {
          label: 'KN10 - Stress reaction hip - grade 1',
          value: 1751,
        },
        {
          label: 'KN100 - Lumbar Soft Tissue Dysfunction',
          value: 1841,
        },
        {
          label: 'KN101 - Lumbar Spine Cyst in Bone',
          value: 1842,
        },
        {
          label: 'KN102 - Lumbar Spine Cyst in Joint',
          value: 1843,
        },
        {
          label: 'KN103 - Lumbar Spine Cyst in Soft Tissue',
          value: 1844,
        },
        {
          label: 'KN104 - Other Lumbar Spine Cyst',
          value: 1845,
        },
        {
          label: 'KN105 - Ischial Bursitis',
          value: 1846,
        },
        {
          label: 'KN106 - Pelvic Stress Reaction(s)',
          value: 1847,
        },
        {
          label: 'KN107 - Stress Reaction Ilium',
          value: 1848,
        },
        {
          label: 'KN108 - Stress Reaction Sacrum',
          value: 1849,
        },
        {
          label: 'KN109 - Stress Reaction Coccyx',
          value: 1850,
        },
        {
          label: 'KN11 - Stress reaction hip - grade 2',
          value: 1752,
        },
        {
          label: 'KN110 - Stress Reaction Ischium',
          value: 1851,
        },
        {
          label: 'KN111 - Multiple Stress Reactions Pelvis',
          value: 1852,
        },
        {
          label: 'KN112 - Other Stress Reaction Pelvis',
          value: 1853,
        },
        {
          label: 'KN113 - Pelvic Functional Movement Disorder',
          value: 1854,
        },
        {
          label: 'KN114 - Pelvic Muscle Imbalance',
          value: 1855,
        },
        {
          label: 'KN115 - Pelvic Soft Tissue Dysfunction',
          value: 1856,
        },
        {
          label: 'KN116 - Femoral Neck Stress Reaction',
          value: 1857,
        },
        {
          label: 'KN117 - Stress Reaction Superior Cortex Femoral Neck',
          value: 1858,
        },
        {
          label: 'KN118 - Stress Reaction Inferior Cortex Femoral Neck',
          value: 1859,
        },
        {
          label: 'KN119 - Stress Reaction through Femoral Neck (Cortices)',
          value: 1860,
        },
        {
          label: 'KN12 - Stress reaction hip - grade 3',
          value: 1753,
        },
        {
          label: 'KN120 - Pelvic Stress Reaction',
          value: 1861,
        },
        {
          label: 'KN121 - Stress Reaction Superior Pubic Ramus',
          value: 1862,
        },
        {
          label: 'KN122 - Stress Reaction Inferior Pubic Ramus',
          value: 1863,
        },
        {
          label: 'KN123 - Hip/Groin Soft Tissue Dysfunction',
          value: 1864,
        },
        {
          label: 'KN124 - Hip/Groin Functional Movement Disorder',
          value: 1865,
        },
        {
          label: 'KN125 - Hip/Groin Muscle Imbalance',
          value: 1866,
        },
        {
          label: 'KN126 - Hip/ Groin Cyst in Bone',
          value: 1867,
        },
        {
          label: 'KN127 - Hip/ Groin Cyst in Joint',
          value: 1868,
        },
        {
          label: 'KN128 - Hip/ Groin Cyst in Soft Tissue',
          value: 1869,
        },
        {
          label: 'KN129 - Other Hip/ Groin Cyst',
          value: 1870,
        },
        {
          label: 'KN13 - Stress reaction upper leg - grade 1',
          value: 1754,
        },
        {
          label: 'KN130 - Thigh Stress Reaction(s)',
          value: 1871,
        },
        {
          label: 'KN131 - Femoral Shaft Stress Reaction',
          value: 1872,
        },
        {
          label: 'KN132 - Femoral Shaft Bone Bruise',
          value: 1873,
        },
        {
          label: 'KN133 - Quadriceps Soft Tissue Dysfunction',
          value: 1874,
        },
        {
          label: 'KN134 - Hamstring Soft Tissue Dysfunction',
          value: 1875,
        },
        {
          label: 'KN135 - Adductor Soft Tissue Dysfunction',
          value: 1876,
        },
        {
          label: 'KN136 - Thigh Cyst in Bone',
          value: 1877,
        },
        {
          label: 'KN137 - Thigh Cyst in Soft Tissue',
          value: 1878,
        },
        {
          label: 'KN138 - Other Thigh Cyst',
          value: 1879,
        },
        {
          label: 'KN139 - LCL Injury With Chondral/Meniscal Injury',
          value: 1880,
        },
        {
          label: 'KN14 - Stress reaction upper leg - grade 2',
          value: 1755,
        },
        {
          label:
            'KN140 - Posterior capsule sprain (incl. isolated injury, excl. PLC)',
          value: 1881,
        },
        {
          label: 'KN141 - ACL/MCL Sprain',
          value: 1882,
        },
        {
          label: 'KN142 - ACL/MCL Sprain (incl. Meniscal Injury)',
          value: 1883,
        },
        {
          label: 'KN143 - ACL/LCL Sprain',
          value: 1884,
        },
        {
          label: 'KN144 - ACL/LCL Sprain (incl. Meniscal Injury)',
          value: 1885,
        },
        {
          label: 'KN145 - ACL/PCL Sprain',
          value: 1886,
        },
        {
          label: 'KN146 - ACL/PCL Sprain (incl. Collateral Ligaments)',
          value: 1887,
        },
        {
          label: 'KN147 - Knee Stress Reaction(s)',
          value: 1888,
        },
        {
          label: 'KN148 - Patellar Stress Reaction',
          value: 1889,
        },
        {
          label: 'KN149 - Distal Femoral Stress Reaction',
          value: 1890,
        },
        {
          label: 'KN15 - Stress reaction upper leg - grade 3',
          value: 1756,
        },
        {
          label: 'KN150 - Proximal Tibial Stress Reaction',
          value: 1891,
        },
        {
          label: 'KN151 - Femoral Bone Bruise',
          value: 1892,
        },
        {
          label: 'KN152 - Cyclops Lesion',
          value: 1893,
        },
        {
          label: 'KN153 - Knee Cyst in Bone',
          value: 1894,
        },
        {
          label: 'KN154 - Knee Cyst in Joint',
          value: 1895,
        },
        {
          label: 'KN155 - Knee Cyst in Soft Tissue',
          value: 1896,
        },
        {
          label: 'KN156 - Other Knee Cyst',
          value: 1897,
        },
        {
          label: 'KN157 - Weber A Fibular fracture',
          value: 1898,
        },
        {
          label: 'KN158 - Weber B Fibular fracture',
          value: 1899,
        },
        {
          label: 'KN159 - Weber C Fibular fracture',
          value: 1900,
        },
        {
          label: 'KN16 - Stress reaction lower leg - grade 1',
          value: 1757,
        },
        {
          label: 'KN160 - Lower Leg Stress Reaction(s)',
          value: 1901,
        },
        {
          label: 'KN161 - Stress Reaction Tibia',
          value: 1902,
        },
        {
          label: 'KN162 - Anterior Stress Reaction Tibia',
          value: 1903,
        },
        {
          label: 'KN163 - Posteromedial Stress Reaction Tibia',
          value: 1904,
        },
        {
          label: 'KN164 - Stress Reaction Fibula',
          value: 1905,
        },
        {
          label: 'KN165 - Tibial Nerve Palsy',
          value: 1906,
        },
        {
          label: 'KN166 - Tibial Bone Bruise',
          value: 1907,
        },
        {
          label: 'KN167 - Fibular Bone Bruise',
          value: 1908,
        },
        {
          label: 'KN168 - Lower Leg Soft Tissue Dysfunction',
          value: 1909,
        },
        {
          label: 'KN169 - Lower Leg Cyst in Bone',
          value: 1910,
        },
        {
          label: 'KN17 - Stress reaction lower leg - grade 2',
          value: 1758,
        },
        {
          label: 'KN170 - Lower Leg Cyst in Soft Tissue',
          value: 1911,
        },
        {
          label: 'KN171 - Other Lower Leg Cyst',
          value: 1912,
        },
        {
          label: 'KN172 - Posterior Talofibular Ligament Sprain',
          value: 1913,
        },
        {
          label:
            'KN173 - Posterior Talofibular Ligament Rupture/ Grade 3 Injury',
          value: 1914,
        },
        {
          label: 'KN174 - Stress Reaction Calcaneus',
          value: 1918,
        },
        {
          label: 'KN175 - Ankle Stress Injuries/ Stress Reaction(s)',
          value: 1919,
        },
        {
          label: 'KN176 - Stress Reaction Tibia At Ankle',
          value: 1920,
        },
        {
          label: 'KN177 - Medial Malleolar Stress Reaction',
          value: 1921,
        },
        {
          label: 'KN178 - Stress Reaction Fibula At Ankle',
          value: 1922,
        },
        {
          label: 'KN179 - Lateral Malleolar Stress Reaction',
          value: 1923,
        },
        {
          label: 'KN18 - Stress reaction lower leg - grade 3',
          value: 1759,
        },
        {
          label: 'KN180 - Stress Reaction Talus',
          value: 1924,
        },
        {
          label: 'KN181 - Peroneal Nerve Entrapment',
          value: 1925,
        },
        {
          label: 'KN182 - Superficial Peroneal Nerve Entrapment',
          value: 1926,
        },
        {
          label: 'KN183 - Deep Peroneal Nerve Entrapment',
          value: 1927,
        },
        {
          label: 'KN184 - Ankle Bone Bruise',
          value: 1928,
        },
        {
          label: 'KN185 - Calcaneal Bone Bruise',
          value: 1929,
        },
        {
          label: 'KN186 - Talar Bone Bruise',
          value: 1930,
        },
        {
          label: 'KN187 - Ankle Soft Tissue Dysfunction',
          value: 1931,
        },
        {
          label: 'KN188 - Ankle Functional Movement Disorder',
          value: 1932,
        },
        {
          label: 'KN189 - Ankle Muscle Imbalance',
          value: 1933,
        },
        {
          label: 'KN19 - Stress reaction foot - grade 1',
          value: 1760,
        },
        {
          label: 'KN190 - Ankle Cyst in Bone',
          value: 1934,
        },
        {
          label: 'KN191 - Ankle Cyst in Joint',
          value: 1935,
        },
        {
          label: 'KN192 - Ankle Cyst in Soft Tissue',
          value: 1936,
        },
        {
          label: 'KN193 - Other Ankle Cyst',
          value: 1937,
        },
        {
          label: 'KN194 - Lisfranc Sprain',
          value: 1938,
        },
        {
          label: 'KN195 - Lisfranc Sprain (with associated fracture)',
          value: 1939,
        },
        {
          label: 'KN196 - Lisfranc Dislocation',
          value: 1940,
        },
        {
          label: 'KN197 - Lisfranc Dislocation (with associated fracture)',
          value: 1941,
        },
        {
          label: 'KN198 - Navicular Stress Reaction',
          value: 1942,
        },
        {
          label: 'KN199 - Cuboid Stress Reaction',
          value: 1943,
        },
        {
          label: 'KN20 - Stress reaction foot - grade 2',
          value: 1761,
        },
        {
          label: 'KN200 - Cuneiform Stress Reaction',
          value: 1944,
        },
        {
          label: 'KN201 - Metatarsal Stress Reaction',
          value: 1945,
        },
        {
          label: 'KN202 - First Metatarsal Stress Reaction',
          value: 1946,
        },
        {
          label: 'KN203 - Second Metatarsal Stress Reaction',
          value: 1947,
        },
        {
          label: 'KN204 - Third Metatarsal Stress Reaction',
          value: 1948,
        },
        {
          label: 'KN205 - Fourth Metatarsal Stress Reaction',
          value: 1949,
        },
        {
          label: 'KN206 - Fifth Metatarsal Stress Reaction',
          value: 1950,
        },
        {
          label: 'KN207 - Base Second Metatarsal Stress Reaction',
          value: 1951,
        },
        {
          label: 'KN208 - Sesamoid Stress Reaction',
          value: 1952,
        },
        {
          label: 'KN209 - Metatarsal Bone Bruise',
          value: 1953,
        },
        {
          label: 'KN21 - Stress reaction foot - grade 3',
          value: 1762,
        },
        {
          label: 'KN210 - Phalangeal Bone Bruise',
          value: 1954,
        },
        {
          label: 'KN211 - Tarsal Bone Bruise',
          value: 1955,
        },
        {
          label: 'KN212 - Bone Spur/Exostosis',
          value: 1956,
        },
        {
          label: 'KN213 - Foot Soft Tissue Dysfunction',
          value: 1957,
        },
        {
          label: 'KN214 - Foot Cyst in Bone',
          value: 1958,
        },
        {
          label: 'KN215 - Foot Cyst in Joint',
          value: 1959,
        },
        {
          label: 'KN216 - Foot Cyst in Soft Tissue',
          value: 1960,
        },
        {
          label: 'KN217 - Other Foot Cyst',
          value: 1961,
        },
        {
          label: 'KN218 - Cyst in Bone not otherwise specified',
          value: 1962,
        },
        {
          label: 'KN219 - Cyst in Joint not otherwise specified',
          value: 1963,
        },
        {
          label: 'KN22 - Musocal Laceration (req. suturing)',
          value: 1763,
        },
        {
          label: 'KN220 - Cyst in Soft Tissue not otherwise specified',
          value: 1964,
        },
        {
          label: 'KN221 - Upper Extremity Functional Movement Disorder',
          value: 1965,
        },
        {
          label: 'KN222 - Lower Extremity Functional Movement Disorder',
          value: 1966,
        },
        {
          label: 'KN223 - Muscle Imbalance(s)',
          value: 1967,
        },
        {
          label: 'KN224 - Upper Extremity Muscle Imbalance',
          value: 1968,
        },
        {
          label: 'KN225 - Lower Extremity Muscle Imbalance',
          value: 1969,
        },
        {
          label: 'KN226 - Traumatic Amputation(s)',
          value: 1970,
        },
        {
          label: 'KN227 - Upper Limb Amputation',
          value: 1971,
        },
        {
          label: 'KN228 - Lower Limb Amputation',
          value: 1972,
        },
        {
          label: 'KN229 - Thoracic Functional Scoliosis',
          value: 1973,
        },
        {
          label: 'KN23 - Concussion: Ocular-motor (eye movement impairment)',
          value: 1764,
        },
        {
          label: 'KN230 - Lumbar Functional Scoliosis',
          value: 1974,
        },
        {
          label: 'KN231 - ATFL/ CFL sprain',
          value: 1915,
        },
        {
          label: 'KN232 - ATFL/ CFL/ PTFL sprain',
          value: 1916,
        },
        {
          label: 'KN233 - CFL/PTFL sprain',
          value: 1917,
        },
        {
          label: 'KN234 - Spinal Scoliosis (Multi-Segmental)',
          value: 1975,
        },
        {
          label: 'KN235 - Distal tarsal tunnel syndrome',
          value: 2121,
        },
        {
          label: 'KN236 - Proximal tarsal tunnel syndrome',
          value: 2122,
        },
        {
          label: 'KN237 - Ankle syndesmosis sprain (incl. fibular injury)',
          value: 2123,
        },
        {
          label: 'KN238 - Sternocostal joint dislocation',
          value: 2124,
        },
        {
          label: 'KN239 - Intercostal muscle strain',
          value: 2125,
        },
        {
          label:
            'KN24 - Concussion: Vestibular (vestibular-ocular reflex impairment)',
          value: 1765,
        },
        {
          label: 'KN240 - Costovertebral joint subluxation',
          value: 2126,
        },
        {
          label: 'KN241 - Osteochondritis dissecans',
          value: 2127,
        },
        {
          label: 'KN242 - Rupture of Bursa (traumatic)',
          value: 2128,
        },
        {
          label: 'KN243 - Cubital tunnel syndrome',
          value: 2129,
        },
        {
          label: 'KN244 - Proximal plantar fasciitis',
          value: 2130,
        },
        {
          label: 'KN245 - Femoral Acetabular Impingement (w/ Labral tear)',
          value: 2131,
        },
        {
          label: 'KN246 - Cauliflower Ear ( Acute)',
          value: 2132,
        },
        {
          label: 'KN247 - Subdural Haematoma',
          value: 2133,
        },
        {
          label: 'KN248 - Eye trauma not otherwise specified',
          value: 2134,
        },
        {
          label: 'KN249 - Medial meniscal cyst',
          value: 2135,
        },
        {
          label: 'KN25 - Concussion: Balance Impairment',
          value: 1766,
        },
        {
          label: 'KN250 - Femoral condyle fracture',
          value: 2136,
        },
        {
          label: 'KN251 - Tibial plateau fracture',
          value: 2137,
        },
        {
          label: 'KN252 - Patellar contusion',
          value: 2138,
        },
        {
          label: 'KN253 - Knee joint effusion (cause undiagnosed)',
          value: 2139,
        },
        {
          label: 'KN254 - Cervical disk sequestration',
          value: 2140,
        },
        {
          label: 'KN255 - Shoulder dislocation with Hill-Sachs lesion',
          value: 2141,
        },
        {
          label: 'KN256 - Anterior shoulder subluxation',
          value: 2142,
        },
        {
          label: 'KN257 - Inferior shoulder subluxation',
          value: 2143,
        },
        {
          label: 'KN258 - Nerve palsy of shoulder',
          value: 2144,
        },
        {
          label: 'KN259 - Scapular stress reaction',
          value: 2145,
        },
        {
          label: 'KN26 - Concussion: Migraine (headache)',
          value: 1767,
        },
        {
          label: 'KN260 - Biceps tendon strain partial thickness',
          value: 2146,
        },
        {
          label: 'KN261 - Subscapularis tendon strain partial thickness',
          value: 2147,
        },
        {
          label: 'KN262 - Infraspinatus tendon strain partial thickness',
          value: 2148,
        },
        {
          label: 'KN263 - Pectoralis major tendon strain partial thickness',
          value: 2149,
        },
        {
          label: 'KN264 - Other tendon strain partial thickness',
          value: 2150,
        },
        {
          label: 'KN265 - Other tendon rupture',
          value: 2151,
        },
        {
          label: 'KN266 - Other tendon strain',
          value: 2152,
        },
        {
          label: 'KN267 - Anterior instability of shoulder',
          value: 2153,
        },
        {
          label: 'KN268 - Brachialis muscle strain',
          value: 2154,
        },
        {
          label: 'KN269 - Stress Reaction Humerus',
          value: 2155,
        },
        {
          label: 'KN27 - Concussion: Cognitive Fatigue',
          value: 1768,
        },
        {
          label: 'KN270 - Dorsal Interossei strain',
          value: 2156,
        },
        {
          label: 'KN271 - Lumbrical muscle strain',
          value: 2157,
        },
        {
          label: 'KN272 - Palmar interossei strain',
          value: 2158,
        },
        {
          label: 'KN28 - Concussion: Anxiety and/or Depression',
          value: 1769,
        },
        {
          label: 'KN29 - Concussion: Sleep Impairement',
          value: 1770,
        },
        {
          label: 'KN30 - Concussion: Cervicogenic (i.e. Whiplash)',
          value: 1771,
        },
        {
          label: 'KN31 - Concussion: No subtype findings',
          value: 1772,
        },
        {
          label: 'KN32 - Epidural Hematoma',
          value: 1773,
        },
        {
          label: 'KN33 - Eye inflammation (incl. Iritis)',
          value: 1774,
        },
        {
          label: 'KN34 - Ruptured Globe',
          value: 1775,
        },
        {
          label: 'KN35 - Other/ General Tooth Pain Undiagnosed',
          value: 1776,
        },
        {
          label: 'KN36 - Neck Soft Tissue Dysfunction',
          value: 1777,
        },
        {
          label: 'KN37 - Neck Functional Movement Disorder',
          value: 1778,
        },
        {
          label: 'KN38 - Neck Muscle Imbalance',
          value: 1779,
        },
        {
          label: 'KN39 - Rhomboid Muscle Strain (excl. Chronic Dysfunction)',
          value: 1780,
        },
        {
          label:
            'KN40 - Middle Trapezius Muscle Strain (excl. Chronic Dysfunction)',
          value: 1781,
        },
        {
          label:
            'KN41 - Lower Trapezius Muscle Strain (excl. Chronic Dysfunction)',
          value: 1782,
        },
        {
          label: 'KN42 - Short Head Of Biceps Tendon Rupture',
          value: 1783,
        },
        {
          label: 'KN43 - Multiple Tendon Strain',
          value: 1784,
        },
        {
          label: 'KN44 - Multiple Tendon Rupture',
          value: 1785,
        },
        {
          label: 'KN45 - Reverse HAGL (PHAGL) Lesion',
          value: 1786,
        },
        {
          label: 'KN46 - Multidirectional Instability of Shoulder',
          value: 1787,
        },
        {
          label: 'KN47 - Shoulder Soft Tissue Dysfunction',
          value: 1788,
        },
        {
          label: 'KN48 - Shoulder Functional Movement Disorder',
          value: 1789,
        },
        {
          label: 'KN49 - Shoulder Muscle Imbalance',
          value: 1790,
        },
        {
          label: 'KN50 - Shoulder Cyst in Bone',
          value: 1791,
        },
        {
          label: 'KN51 - Shoulder Cyst in Joint',
          value: 1792,
        },
        {
          label: 'KN52 - Shoulder Cyst in Soft Tissue',
          value: 1793,
        },
        {
          label: 'KN53 - Other Shoulder Cyst',
          value: 1794,
        },
        {
          label: 'KN54 - Upper Arm Cyst in Bone',
          value: 1795,
        },
        {
          label: 'KN55 - Upper Arm Cyst in Soft Tissue',
          value: 1796,
        },
        {
          label: 'KN56 - Other Upper Arm Cyst',
          value: 1797,
        },
        {
          label: 'KN57 - Elbow Lateral Ligament Injury',
          value: 1798,
        },
        {
          label: 'KN58 - Elbow Lateral Ligament Sprain (Grade 1-2)',
          value: 1799,
        },
        {
          label: 'KN59 - Elbow Lateral Ligament Rupture/ Grade 3 Injury',
          value: 1800,
        },
        {
          label: 'KN60 - Combined UCL/ LCL Sprain Elbow',
          value: 1801,
        },
        {
          label: 'KN61 - Medial Epicondylitis',
          value: 1802,
        },
        {
          label: 'KN62 - Lateral Epicondylitis',
          value: 1803,
        },
        {
          label: 'KN63 - Stress Fracture Olecranon',
          value: 1804,
        },
        {
          label: 'KN64 - Stress Reaction Olecranon',
          value: 1805,
        },
        {
          label: 'KN65 - Elbow Soft Tissue Dysfunction',
          value: 1806,
        },
        {
          label: 'KN66 - Elbow Cyst in Bone',
          value: 1807,
        },
        {
          label: 'KN67 - Elbow Cyst in Joint',
          value: 1808,
        },
        {
          label: 'KN68 - Elbow Cyst in Soft Tissue',
          value: 1809,
        },
        {
          label: 'KN69 - Other Elbow Cyst',
          value: 1810,
        },
        {
          label: 'KN70 - Stress Reaction Radius and/or Ulna',
          value: 1811,
        },
        {
          label: 'KN71 - Forearm Soft Tissue Dysfunction',
          value: 1812,
        },
        {
          label: 'KN72 - Forearm Cyst in Bone',
          value: 1813,
        },
        {
          label: 'KN73 - Forearm Cyst in Soft Tissue',
          value: 1814,
        },
        {
          label: 'KN74 - Other Forearm Cyst',
          value: 1815,
        },
        {
          label: 'KN75 - Thumb Flexor Muscle Strain',
          value: 1816,
        },
        {
          label: 'KN76 - Thumb Extensor Muscle Strain',
          value: 1817,
        },
        {
          label: 'KN77 - Wrist or Hand Soft Tissue Dysfunction',
          value: 1818,
        },
        {
          label: 'KN78 - Wrist/ Hand Cyst in Bone',
          value: 1819,
        },
        {
          label: 'KN79 - Wrist/ Hand Cyst in Joint',
          value: 1820,
        },
        {
          label: 'KN80 - Wrist/ Hand Cyst in Soft Tissue',
          value: 1821,
        },
        {
          label: 'KN81 - Other Wrist/ Hand Cyst',
          value: 1822,
        },
        {
          label: 'KN82 - Costochondral Joint Sprain',
          value: 1823,
        },
        {
          label: 'KN83 - Rib Stress Reaction(s)',
          value: 1824,
        },
        {
          label: 'KN84 - Rib Stress Reaction ( 1- 4)',
          value: 1825,
        },
        {
          label: 'KN85 - Rib Stress Reaction ( 5- 9)',
          value: 1826,
        },
        {
          label: 'KN86 - Rib Stress Reaction ( 10- 12)',
          value: 1827,
        },
        {
          label: 'KN87 - Hemopneumothorax',
          value: 1828,
        },
        {
          label: 'KN88 - Chest Soft Tissue Dysfunction',
          value: 1829,
        },
        {
          label: 'KN89 - Abdominal Hernia',
          value: 1830,
        },
        {
          label: 'KN90 - Abdominal Soft Tissue Dysfunction',
          value: 1831,
        },
        {
          label: 'KN91 - Thoracic Functional Movement Disorder',
          value: 1832,
        },
        {
          label: 'KN92 - Thoracic Muscle Imbalance',
          value: 1833,
        },
        {
          label: 'KN93 - Thoracic Soft Tissue Dysfunction',
          value: 1834,
        },
        {
          label: 'KN94 - Thoracic Spine Cyst in Bone',
          value: 1835,
        },
        {
          label: 'KN95 - Thoracic Spine Cyst in Joint',
          value: 1836,
        },
        {
          label: 'KN96 - Thoracic Spine Cyst in Soft Tissue',
          value: 1837,
        },
        {
          label: 'KN97 - Other Thoracic Spine Cyst',
          value: 1838,
        },
        {
          label: 'KN98 - Lumbar Functional Movement Disorder',
          value: 1839,
        },
        {
          label: 'KN99 - Lumbar Muscle Imbalance',
          value: 1840,
        },
        {
          label: 'KSFX - Distal femoral stress fracture',
          value: 639,
        },
        {
          label: 'KSPX - Patellar stress fracture',
          value: 640,
        },
        {
          label: 'KSTX - Proximal tibial stress fracture',
          value: 641,
        },
        {
          label: 'KSXX - Knee Stress Fracture',
          value: 642,
        },
        {
          label: 'KTGL - Lateral gastroc tendinopathy knee',
          value: 737,
        },
        {
          label: 'KTGM - Medial gastroc tendinopathy knee',
          value: 738,
        },
        {
          label: 'KTGX - Gastrocnemius tendon injury',
          value: 739,
        },
        {
          label: 'KTHB - Lateral hamstring tendon strain',
          value: 740,
        },
        {
          label: 'KTHC - Lateral hamstring tendon rupture',
          value: 741,
        },
        {
          label: 'KTHL - Lateral hamstring tendinopathy',
          value: 742,
        },
        {
          label:
            'KTHM - Medial hamstring tendinopathy, incl pes anserine bursitis',
          value: 743,
        },
        {
          label: 'KTHR - Medial hamstring tendon rupture',
          value: 744,
        },
        {
          label: 'KTHS - Medial hamstring tendon strain',
          value: 745,
        },
        {
          label: 'KTHX - Hamstring tendon injury',
          value: 163,
        },
        {
          label:
            'KTPI - Insertional Patellar tendon pathology, incl intratend ossicle (excl Osgoode Schlatters - see JTKT)',
          value: 746,
        },
        {
          label: 'KTPR - Patellar tendon rupture',
          value: 747,
        },
        {
          label: 'KTPS - Patellar tendon strain',
          value: 748,
        },
        {
          label:
            'KTPT - Patellar tendinopathy (excl. Sinding Larsen Johannson syndrome see JTKP)',
          value: 749,
        },
        {
          label: 'KTPX - Patellar Tendon Injury',
          value: 750,
        },
        {
          label: 'KTQR - Quadriceps tendon rupture',
          value: 751,
        },
        {
          label: 'KTQS - Quadriceps tendon strain',
          value: 752,
        },
        {
          label: 'KTQT - Quadriceps tendinopathy',
          value: 753,
        },
        {
          label: 'KTQX - Quadriceps tendon injury',
          value: 754,
        },
        {
          label: 'KTTX - Popliteus tendon injury',
          value: 755,
        },
        {
          label: 'KTXX - Knee Tendon Injury',
          value: 756,
        },
        {
          label: 'KUAX - Chronic ACL insufficiency',
          value: 643,
        },
        {
          label: 'KUCX - Chronic PCL insufficiency',
          value: 644,
        },
        {
          label: 'KUMX - Chronic MCL insufficiency',
          value: 645,
        },
        {
          label: 'KUPX - Patellar instability',
          value: 646,
        },
        {
          label: 'KUXX - Knee Instability (chronic or recurrent subluxations)',
          value: 647,
        },
        {
          label: 'KUZX - Other instability',
          value: 648,
        },
        {
          label: 'KXXX - Thigh pain/ Injury Not otherwise specified',
          value: 707,
        },
        {
          label: 'KZHX - Knee haemarthrosis cause undiagnosed',
          value: 708,
        },
        {
          label: 'KZXX - Knee Pain/ Injury Not otherwise specified',
          value: 709,
        },
        {
          label: 'KZZX - Knee pain undiagnosed',
          value: 710,
        },
        {
          label: 'LACD - Degenerative L4/ L5 disc disease',
          value: 893,
        },
        {
          label: 'LACE - Degenerative L5/S1 disc disease',
          value: 894,
        },
        {
          label:
            'LACM - Degenerative disc disease multiple levels lumbar spine',
          value: 895,
        },
        {
          label: 'LACX - Degenerative lumbar disc disease',
          value: 896,
        },
        {
          label: 'LAFX - Facet joint OA lumbosacral spine',
          value: 897,
        },
        {
          label: 'LAXX - Osteoarthritis Lumbosacral spine',
          value: 898,
        },
        {
          label: 'LCAX - Lumbar disc annular tear',
          value: 827,
        },
        {
          label: 'LCPA - L1/2 disc prolapse',
          value: 828,
        },
        {
          label: 'LCPB - L2/3 disc prolapse',
          value: 829,
        },
        {
          label: 'LCPC - L3/4 disc prolapse',
          value: 830,
        },
        {
          label: 'LCPD - L4/5 disc prolapse',
          value: 831,
        },
        {
          label: 'LCPE - L5/S1 disc prolapse',
          value: 832,
        },
        {
          label: 'LCPX - Lumbar disc prolapse',
          value: 833,
        },
        {
          label: 'LCXX - Lumbar Disc Injury',
          value: 834,
        },
        {
          label: 'LFDX - Lumbar pedical fracture',
          value: 835,
        },
        {
          label: 'LFMX - Multiple lumbar spine fractures',
          value: 836,
        },
        {
          label: 'LFPX - Lumbar pars interarticularis acute fracture',
          value: 837,
        },
        {
          label:
            'LFQX - Complication of lumbar fracture (incl non union - excl spinal injury - see LNFXX)',
          value: 838,
        },
        {
          label: 'LFSX - Lumbar spinous process fracture',
          value: 839,
        },
        {
          label: 'LFTA - Fracture transverse process L1',
          value: 840,
        },
        {
          label: 'LFTB - Fracture transverse process L2',
          value: 841,
        },
        {
          label: 'LFTC - Fracture transverse process L3',
          value: 842,
        },
        {
          label: 'LFTD - Fracture transverse process L4',
          value: 843,
        },
        {
          label: 'LFTE - Fracture transverse process L5',
          value: 844,
        },
        {
          label: 'LFTM - Fracture multiple transverse processes',
          value: 845,
        },
        {
          label: 'LFTX - Lumbar spine tranvserse process fracture',
          value: 846,
        },
        {
          label: 'LFVX - Lumbar spine vertebral body fracture',
          value: 847,
        },
        {
          label: 'LFXX - Lumbar Spine Fracture',
          value: 848,
        },
        {
          label: 'LFZX - Other lumbar spine fracture',
          value: 849,
        },
        {
          label: 'LGXX - Lumbar Spine Facet Joint Pain/ Stiffness',
          value: 899,
        },
        {
          label: 'LHXX - Lumbar Soft Tissue Bruising/ Haematoma',
          value: 826,
        },
        {
          label: 'LJFX - Lumbar facet joint sprain',
          value: 869,
        },
        {
          label: 'LJLI - Iliolumbar Ligament pain',
          value: 870,
        },
        {
          label: 'LJLX - Lumbar ligament Sprain',
          value: 871,
        },
        {
          label: 'LJXX - Lumbar Spine Joint Injury',
          value: 900,
        },
        {
          label:
            'LKXQ - Complication of lumbar laceration/ abrasion incl infection',
          value: 867,
        },
        {
          label: 'LKXX - Lumbar Laceration/ Abrasion',
          value: 868,
        },
        {
          label:
            'LMXX - Lumbar Spine muscle and Tendon Strain/ Spasm/ Trigger Points',
          value: 872,
        },
        {
          label: 'LMYX - Lumbar muscle trigger points',
          value: 873,
        },
        {
          label:
            'LNAA - L1 - 3 Nerve root impingement due to foraminal stenosis bony and disc',
          value: 874,
        },
        {
          label:
            'LNAD - L4 Nerve root impingement due to foraminal stenosis bony and disc',
          value: 875,
        },
        {
          label:
            'LNAE - L5 Nerve root impingement due to foraminal stenosis bony and disc',
          value: 876,
        },
        {
          label:
            'LNAF - S1 Nerve root impingement due to foraminal stenosis bony and disc',
          value: 877,
        },
        {
          label:
            'LNAX - Lumbosacral Nerve root impingement due to foraminal stenosis bony and disc',
          value: 878,
        },
        {
          label:
            'LNDA - Lumbar disc injury with associated L1 - L3 nerve root injury',
          value: 879,
        },
        {
          label:
            'LNDD - Lumbar disc injury with associated L4 nerve root injury',
          value: 880,
        },
        {
          label:
            'LNDE - Lumbar disc injury with associated L5 nerve root injury',
          value: 881,
        },
        {
          label:
            'LNDF - Lumbar disc injury with associated S1 nerve root injury',
          value: 882,
        },
        {
          label:
            'LNDM - Lumbar disc injury with associated multiple nerve root injuries',
          value: 883,
        },
        {
          label:
            'LNDR - Lumbar disc injury with associated unspecified nerve root injury',
          value: 884,
        },
        {
          label:
            'LNDS - Lumbar disc Injury with associated spinal cord/ cauda equina injury',
          value: 885,
        },
        {
          label:
            'LNDX - Lumbar disc injury with associated neurological injury',
          value: 886,
        },
        {
          label:
            'LNFC - Lumbar spinal fracture with spinal cord/ cauda equina injury',
          value: 887,
        },
        {
          label:
            'LNFX - Lumbar spinal fracture with associated neurological injury',
          value: 888,
        },
        {
          label: 'LNSX - Lumbar Spinal canal stenosis',
          value: 889,
        },
        {
          label: 'LNTX - Lumbosacral nerve stretch/ traction injury',
          value: 890,
        },
        {
          label: 'LNXX - Lumbar Spine Neurological Injury',
          value: 891,
        },
        {
          label: 'LNZX - Other lumbosacral nerve injury',
          value: 892,
        },
        {
          label: 'LSDX - Lumbar pedicle stress fracture',
          value: 850,
        },
        {
          label: 'LSLX - Other lumbar spine stress fracture',
          value: 851,
        },
        {
          label: 'LSPA - Pars stress fracture L1 - L3',
          value: 852,
        },
        {
          label: 'LSPD - Pars stress fracture L4',
          value: 853,
        },
        {
          label: 'LSPE - Pars stress fracture L5',
          value: 854,
        },
        {
          label: 'LSPM - Multiple (incl bilateral) pars stress fractures',
          value: 855,
        },
        {
          label: 'LSPX - Pars interarticularis stress fracture',
          value: 856,
        },
        {
          label: 'LSRX - Lumbar spine stress reaction',
          value: 857,
        },
        {
          label: 'LSXX - Lumbar Stress Fracture',
          value: 858,
        },
        {
          label: 'LUPX - Lumbosacral instability',
          value: 859,
        },
        {
          label: 'LURX - Retrolisthesis lumbar spine',
          value: 860,
        },
        {
          label: 'LUSA - Grade 1 Spondylolisthesis lumbar spine',
          value: 861,
        },
        {
          label: 'LUSB - Grade 2 Spondylolisthesis lumbar spine',
          value: 862,
        },
        {
          label: 'LUSC - Grade 3 Spondylolisthesis lumbar spine',
          value: 863,
        },
        {
          label: 'LUSD - Grade 4 Spondylolisthesis lumbar spine',
          value: 864,
        },
        {
          label: 'LUSX - Spondylolisthesis any Level',
          value: 865,
        },
        {
          label: 'LUXX - Lumbar Instability',
          value: 866,
        },
        {
          label: 'LXXX - Thoracic Pain/ Injury not otherwise specified',
          value: 901,
        },
        {
          label: 'LZHX - Lumbar pain with hamstring referral',
          value: 902,
        },
        {
          label: 'LZXX - Lumbar Pain/ Injury nor otherwise specified',
          value: 148,
        },
        {
          label: 'LZZX - Lumbar pain undiagnosed',
          value: 903,
        },
        {
          label: 'MBXX - Drug Use/ Overdose/ Poisoning',
          value: 1699,
        },
        {
          label: 'MCAX - Athletes heart',
          value: 1570,
        },
        {
          label: 'MCCX - Conduction abnormality incl arrythmias',
          value: 1572,
        },
        {
          label: 'MCHX - HOCM',
          value: 1573,
        },
        {
          label: 'MCIX - Ischaemic heart disease',
          value: 1571,
        },
        {
          label: 'MCMX - Murmurs/ Valvular disease',
          value: 1574,
        },
        {
          label: 'MCPX - Peripheral vascular disease',
          value: 1580,
        },
        {
          label: 'MCVQ - DVT calf',
          value: 1577,
        },
        {
          label: 'MCVS - Subclavian vein/ axillary vein thrombosis',
          value: 1578,
        },
        {
          label: 'MCVV - Varicose veins',
          value: 1576,
        },
        {
          label: 'MCVX - Venous disease',
          value: 1575,
        },
        {
          label:
            'MCVZ - Other venous disease incl calf/ ankle oedema, cause unknown',
          value: 1579,
        },
        {
          label: 'MCXX - Cardiovascular Illness',
          value: 1569,
        },
        {
          label: 'MCZX - Other cardiovascular disease',
          value: 1581,
        },
        {
          label: 'MDDX - Dermatitis',
          value: 1659,
        },
        {
          label: 'MDPX - Psoriasis',
          value: 1658,
        },
        {
          label: 'MDUX - Urticaria',
          value: 1657,
        },
        {
          label:
            'MDXX - Dermatological Illness (excl infections MIXX, skin lesions/tumours MECX and sunburn MVHX)',
          value: 1656,
        },
        {
          label: 'MDZX - Other rash not otherwise mentioned or undiagnosed',
          value: 1660,
        },
        {
          label: 'MEAX - Tumour ankle',
          value: 1688,
        },
        {
          label: 'MEBX - Tumour pelvis and buttock',
          value: 1683,
        },
        {
          label: 'MECA - Benign Skin lesion',
          value: 1692,
        },
        {
          label: 'MECB - Basal cell carcinoma (BCC)',
          value: 1693,
        },
        {
          label: 'MECM - Melanoma',
          value: 1695,
        },
        {
          label: 'MECP - Multiple skin cancers',
          value: 1696,
        },
        {
          label: 'MECS - Squamous cell carcinoma (SCC)',
          value: 1694,
        },
        {
          label: 'MECX - Skin Lesion/ Tumour',
          value: 1691,
        },
        {
          label: 'MECZ - Other skin tumour',
          value: 1697,
        },
        {
          label: 'MEDX - Tumour thoracic spine/ chest wall',
          value: 1681,
        },
        {
          label: 'MEEX - Tumour elbow',
          value: 1676,
        },
        {
          label: 'MEFX - Tumour foot',
          value: 1689,
        },
        {
          label: 'MEGX - Tumour groin and Hip',
          value: 1684,
        },
        {
          label: 'MEHX - Tumour head',
          value: 1679,
        },
        {
          label: 'MEKX - Tumour knee',
          value: 1686,
        },
        {
          label: 'MELX - Tumour lumbar spine',
          value: 1682,
        },
        {
          label: 'MEMX - Haematological Malignancy',
          value: 1690,
        },
        {
          label: 'MENX - Tumour neck',
          value: 1680,
        },
        {
          label: 'MEQX - Tumour lower leg',
          value: 1687,
        },
        {
          label: 'MERX - tumour forearm',
          value: 1677,
        },
        {
          label: 'MESX - Tumour shoulder',
          value: 1674,
        },
        {
          label: 'METX - Tumour thigh',
          value: 1685,
        },
        {
          label: 'MEUX - Tumour upper arm',
          value: 1675,
        },
        {
          label: 'MEWX - Tumour wrist/ hand',
          value: 1678,
        },
        {
          label: 'MEXX - Tumours/ Malignancies',
          value: 1673,
        },
        {
          label: 'MEZX - Other tumour not otherwise mentioned',
          value: 1698,
        },
        {
          label: "MGDR - Runner's diarrhoea",
          value: 1631,
        },
        {
          label: 'MGDX - Diarrhoea',
          value: 1630,
        },
        {
          label: 'MGMX - Haematemesis/ malaena/ GI bleeding',
          value: 1632,
        },
        {
          label: 'MGPE - Exercise associated gastritis/ reflus',
          value: 1627,
        },
        {
          label: 'MGPN - NSAID associated gastritis/ peptic ulceration',
          value: 1628,
        },
        {
          label:
            'MGPU - Gastritis/ peptic ulceration - non exercise/ NSAID related',
          value: 1629,
        },
        {
          label: 'MGPX - Gastritis',
          value: 1626,
        },
        {
          label: 'MGSA - Appendicitis',
          value: 1634,
        },
        {
          label: 'MGSC - Cholecystitis',
          value: 1635,
        },
        {
          label: 'MGSX - Surgical bowel problem',
          value: 1633,
        },
        {
          label: 'MGXX - Gastrointestinal Illness',
          value: 1625,
        },
        {
          label: 'MHAI - Iron deficiency',
          value: 1652,
        },
        {
          label: 'MHAX - Anaemia',
          value: 1651,
        },
        {
          label: 'MHXX - Haematological Illness and Nutritional Deficiencies',
          value: 1650,
        },
        {
          label: 'MIAA - Infected ankle joint',
          value: 1553,
        },
        {
          label: 'MIAE - Infected elbow joint',
          value: 1548,
        },
        {
          label: 'MIAF - Infected foot joint',
          value: 1554,
        },
        {
          label: 'MIAG - Infected hip joint',
          value: 1550,
        },
        {
          label: 'MIAK - Infected knee joint',
          value: 1552,
        },
        {
          label: 'MIAO - Infected pubic symphysis',
          value: 1551,
        },
        {
          label: 'MIAS - Infected shoulder joint',
          value: 1547,
        },
        {
          label: 'MIAW - Infected wrist, hand, finger, thumb joint',
          value: 1549,
        },
        {
          label:
            'MIAX - Joint infection - septic arthritis (excl. complications of surgery or perforating lacerations)',
          value: 1546,
        },
        {
          label: 'MIBD - Septic discitis - osteomyelitis of the spine',
          value: 1556,
        },
        {
          label: 'MIBX - Infection of bone - osteomyelitis',
          value: 1555,
        },
        {
          label: 'MIEE - Otitis externa',
          value: 1533,
        },
        {
          label: 'MIEM - Middle ear infection',
          value: 1534,
        },
        {
          label: 'MIEX - Ear infection',
          value: 1532,
        },
        {
          label: "MIFF - Tinea pedis/ athlete's foot",
          value: 1522,
        },
        {
          label: 'MIFG - Fungal infection groin',
          value: 1521,
        },
        {
          label: 'MIFX - Skin Infection - fungal',
          value: 1520,
        },
        {
          label: 'MIFZ - Other fungal infection',
          value: 1523,
        },
        {
          label: 'MIGB - Bacterial gastroenteritis (incl food poinsoning)',
          value: 1536,
        },
        {
          label: 'MIGG - Amoebic dysentry',
          value: 1538,
        },
        {
          label: 'MIGH - Viral hepatitis (A, B, or C)',
          value: 1539,
        },
        {
          label: 'MIGV - Viral gastroenteritis',
          value: 1537,
        },
        {
          label: 'MIGX - Gastrointestinal infection',
          value: 1535,
        },
        {
          label: 'MIGZ - Other gastrointestinal infection',
          value: 1540,
        },
        {
          label: 'MIRB - Bronchitis',
          value: 1529,
        },
        {
          label: 'MIRL - Other lower respiratory tract infection',
          value: 1531,
        },
        {
          label: 'MIRN - Pneumonia',
          value: 1530,
        },
        {
          label: 'MIRP - Pharyngitis',
          value: 1526,
        },
        {
          label: 'MIRS - Sinusitis',
          value: 1525,
        },
        {
          label: 'MIRT - Tonsillitis',
          value: 1527,
        },
        {
          label: 'MIRU - Other upper resp tract infection',
          value: 1528,
        },
        {
          label: 'MIRX - Respiratory tract infection (bacterial or viral)',
          value: 1524,
        },
        {
          label: 'MISB - Skin infection pelvis/ buttock - incl ischial abscess',
          value: 1509,
        },
        {
          label: 'MISE - Skin infection elbow',
          value: 1507,
        },
        {
          label: 'MISF - Skin infection foot',
          value: 1511,
        },
        {
          label: 'MISH - Skin infection head/face/neck',
          value: 1506,
        },
        {
          label: 'MISL - Lymphadenopathy secondary to skin infection',
          value: 1513,
        },
        {
          label:
            'MISN - Skin infection toenail - incl infected ingrown toenail',
          value: 1512,
        },
        {
          label: 'MISQ - Skin infection lower leg',
          value: 1510,
        },
        {
          label: 'MISW - Skin infection wrist/hand',
          value: 1508,
        },
        {
          label:
            'MISX - Skin Infection/ Cellulitis/ Abscess/ Infected Bursa - bacterial (excl infection complicating laceration - see ? KXQ)',
          value: 1505,
        },
        {
          label: 'MISZ - Other skin infection not specifically mentioned',
          value: 1514,
        },
        {
          label: 'MIUC - Cyctitis',
          value: 1544,
        },
        {
          label: 'MIUP - Pyelonephritis',
          value: 1543,
        },
        {
          label: 'MIUS - Sexually transmitted disease',
          value: 1542,
        },
        {
          label: 'MIUX - Genitourinary infection',
          value: 1541,
        },
        {
          label: 'MIUZ - Other genitourinary infection',
          value: 1545,
        },
        {
          label: 'MIVC - Chicken Pox',
          value: 1559,
        },
        {
          label: 'MIVG - Glandular Fever',
          value: 1558,
        },
        {
          label:
            'MIVX - Systemic Viral Infection (excl viruses localised to one area)',
          value: 1557,
        },
        {
          label: 'MIWF - Feet warts - incl plantar warts',
          value: 1518,
        },
        {
          label: 'MIWH - Herpes simplex (incl scrum pox)',
          value: 1516,
        },
        {
          label: 'MIWW - Wrist and hand warts',
          value: 1517,
        },
        {
          label: 'MIWX - Skin infection - viral (incl warts)',
          value: 1515,
        },
        {
          label: 'MIWZ - Other warts',
          value: 1519,
        },
        {
          label: 'MIXX - Infection',
          value: 1504,
        },
        {
          label: 'MIZX - Other infection not otherwise specified',
          value: 1560,
        },
        {
          label: 'MNBX - Brachial neuritis',
          value: 1591,
        },
        {
          label: 'MNCX - Cerebral palsy',
          value: 1598,
        },
        {
          label: 'MNEX - Epilepsy',
          value: 1592,
        },
        {
          label: 'MNHC - Cluster headaches',
          value: 1595,
        },
        {
          label: 'MNHM - Migraine',
          value: 1594,
        },
        {
          label: 'MNHS - Sinus headache',
          value: 1596,
        },
        {
          label:
            'MNHX - Headaches (excl. those exercise related or Msk in origin - see HZXX)',
          value: 1593,
        },
        {
          label: 'MNHZ - Headache not otherwise specified',
          value: 1597,
        },
        {
          label: 'MNXX - Neurological Illness',
          value: 1590,
        },
        {
          label: 'MNZM - Generalised tight muscles/ spasticity',
          value: 1600,
        },
        {
          label: 'MNZX - Other neurological problem',
          value: 1599,
        },
        {
          label: 'MOXX - Opthalmological Illness (excl trauma)',
          value: 1661,
        },
        {
          label: 'MPAA - Asthma - allergic',
          value: 1585,
        },
        {
          label: 'MPAE - Asthma - exericse induced only',
          value: 1586,
        },
        {
          label:
            'MPAL - Allergy - rhinitis/ sinusitis/ hayfever (for urticaria see MDUX)',
          value: 1584,
        },
        {
          label: 'MPAX - Asthma and/or allergy',
          value: 1583,
        },
        {
          label: 'MPCX - Chronic airflow limitation',
          value: 1587,
        },
        {
          label: 'MPFX - Cyctic Fibrosis',
          value: 1588,
        },
        {
          label: 'MPIC - Confirmed COVID-19 infection',
          value: 1724,
        },
        {
          label: 'MPIV - Suspected COVID-19 infection',
          value: 1725,
        },
        {
          label: 'MPXX - Respiratory Disease',
          value: 1582,
        },
        {
          label: 'MPZX - Other respiratory illness not otherwise specified',
          value: 1589,
        },
        {
          label: 'MRFX - Fibromyalgia/ multiple sore muscle areas',
          value: 1622,
        },
        {
          label: 'MRGA - Gout in ankle/ foot (incl big toe)',
          value: 1607,
        },
        {
          label: 'MRGE - Gout in elbow',
          value: 1604,
        },
        {
          label: 'MRGK - Gout in knee',
          value: 1606,
        },
        {
          label: 'MRGP - Gout in hands/ fingers',
          value: 1605,
        },
        {
          label: 'MRGX - Gout',
          value: 1603,
        },
        {
          label: 'MRGZ - Gout in other location not otherwise specified',
          value: 1608,
        },
        {
          label:
            'MROX - Osteoarthritis - generalised (for OA isolated to one jt see ?AXX)',
          value: 1602,
        },
        {
          label: 'MRPK - Pseudogout in knee',
          value: 1610,
        },
        {
          label: 'MRPX - Pseudogout',
          value: 1609,
        },
        {
          label: 'MRPZ - Pseudogout in other joint/ location',
          value: 1611,
        },
        {
          label: 'MRRM - Rheumatoid arthritis affecting many joints',
          value: 1621,
        },
        {
          label: 'MRRO - Rheumatoid arthritis affecting <4 joints',
          value: 1620,
        },
        {
          label: 'MRRX - Rheumatoid arthritis',
          value: 1619,
        },
        {
          label: 'MRSA - Anklylosing spondylitis',
          value: 1613,
        },
        {
          label:
            'MRSM - Non specific seronegative arthritis affecting many joints',
          value: 1618,
        },
        {
          label:
            'MRSO - Non specific seronegative arthritis affecting <4 joints',
          value: 1617,
        },
        {
          label: 'MRSP - Psoriatic arthritis',
          value: 1614,
        },
        {
          label: "MRSR - Reiter's syndrome",
          value: 1615,
        },
        {
          label: 'MRSS - Non specific seronegative arthritis affecting SIJ',
          value: 1616,
        },
        {
          label: 'MRSX - Seronegative arthritis',
          value: 1612,
        },
        {
          label: 'MRXX - Rheumatological Illness',
          value: 1601,
        },
        {
          label: 'MRZK - Inflammatory arthritis of knee',
          value: 1624,
        },
        {
          label: 'MRZX - Rheumatological disease other/ undiagnosed',
          value: 1623,
        },
        {
          label: 'MSAX - Anxiety/ panic disorder',
          value: 1671,
        },
        {
          label: 'MSDX - Depression',
          value: 1670,
        },
        {
          label: 'MSFA - Anorexia nervosa',
          value: 1665,
        },
        {
          label: 'MSFB - Bulimia nervosa',
          value: 1666,
        },
        {
          label: 'MSFE - Exercise addiction',
          value: 1667,
        },
        {
          label: 'MSFF - Female athlete triad',
          value: 1668,
        },
        {
          label: 'MSFX - Eating/ overexercising disorder in females',
          value: 1664,
        },
        {
          label: 'MSMX - Eating/ overexercising disorder in males',
          value: 1669,
        },
        {
          label: 'MSXX - Psychological/ psychiatric Illness',
          value: 1663,
        },
        {
          label:
            'MSZX - Other psychological/ psychiatric disorder not otherwise specified',
          value: 1672,
        },
        {
          label:
            'MTXX - ENT Illness including dental (excl sinusitis - see MPAL)',
          value: 1662,
        },
        {
          label: 'MUGA - Other amenorrhoea',
          value: 1642,
        },
        {
          label: 'MUGD - Dysmennorrhoea',
          value: 1643,
        },
        {
          label: 'MUGE - Diet and Exercise associated amennorhoea',
          value: 1641,
        },
        {
          label: 'MUGO - Oral contraceptive pill (OCP) Advice',
          value: 1644,
        },
        {
          label: 'MUGX - Gynaecological Illness',
          value: 1640,
        },
        {
          label: 'MUGZ - Other gynaecological illness',
          value: 1645,
        },
        {
          label: 'MUPE - Exercise advice',
          value: 1647,
        },
        {
          label: 'MUPS - Pregnancy associated musculosketal injury',
          value: 1648,
        },
        {
          label: 'MUPT - Request for pregnancy test',
          value: 1649,
        },
        {
          label: 'MUPX - Pregnancy',
          value: 1646,
        },
        {
          label: 'MUUH - Haematuria',
          value: 1638,
        },
        {
          label: 'MUUX - Urinary Illness',
          value: 1637,
        },
        {
          label: 'MUVX - Varicocoele',
          value: 1639,
        },
        {
          label: 'MUXX - Genitourinary Illness (excl infection see MIGX)',
          value: 1636,
        },
        {
          label: 'MVBD - Decompression sickness',
          value: 1563,
        },
        {
          label: 'MVBX - Barotrauma',
          value: 1562,
        },
        {
          label: 'MVHE - Hyperthermia/ heat stroke',
          value: 1567,
        },
        {
          label: 'MVHO - Hypothermia',
          value: 1565,
        },
        {
          label: 'MVHR - Rhabdomyolysis',
          value: 1568,
        },
        {
          label: 'MVHS - Sunburn',
          value: 1566,
        },
        {
          label: 'MVHX - Heat Illness',
          value: 1564,
        },
        {
          label: 'MVXX - Environmental Illness',
          value: 1561,
        },
        {
          label: 'MXXX - Medical Illness',
          value: 1503,
        },
        {
          label: 'MYTX - Thyroid disorder',
          value: 1654,
        },
        {
          label: 'MYXX - Endocrine Illness',
          value: 1653,
        },
        {
          label: 'MYZX - Other endocrine disorder',
          value: 1655,
        },
        {
          label: 'MZFX - Tired athlete undiagnosed',
          value: 1701,
        },
        {
          label: 'MZIC - Self-isolation (contact tracing or household Covid)',
          value: 1727,
        },
        {
          label: 'MZIQ - Quarantine after cross border travel',
          value: 1726,
        },
        {
          label: 'MZXX - Medical Illness Undiagnosed/ Other',
          value: 1700,
        },
        {
          label: 'MZZF - Chronic Fatigue Syndrome',
          value: 1703,
        },
        {
          label: 'MZZO - Obesity',
          value: 1704,
        },
        {
          label: 'MZZX - Other medical illness',
          value: 1702,
        },
        {
          label: 'NACX - Cervical spinal canal stenosis',
          value: 911,
        },
        {
          label: 'NADX - Cervical disc degeneration',
          value: 912,
        },
        {
          label: 'NAFX - Cervical facet joint arthritis',
          value: 938,
        },
        {
          label:
            'NAXX - Cervical spinal column degenerative disc disease/ arthritis ',
          value: 939,
        },
        {
          label: 'NCLP - Cervical Disc Prolapse',
          value: 913,
        },
        {
          label: 'NCLX - Cervical Disc sprain',
          value: 914,
        },
        {
          label: 'NCXX - Cervical Disc Injury',
          value: 915,
        },
        {
          label:
            'NFCA - Avulsion fracture/s cervical spine (e.g. spinous process fracture)',
          value: 916,
        },
        {
          label: 'NFCS - Stable cervical fracture/s',
          value: 917,
        },
        {
          label: 'NFCU - Unstable cervical fracture/s',
          value: 918,
        },
        {
          label: 'NFCX - Cervical Fracture/s',
          value: 919,
        },
        {
          label: 'NFLX - Laryngeal fracture',
          value: 920,
        },
        {
          label: 'NFXX - Neck Fracture',
          value: 921,
        },
        {
          label: 'NHXX - Neck Soft Tissue Bruising/ Haematoma',
          value: 910,
        },
        {
          label: 'NJLX - Facet Joint/ Neck Ligament sprain',
          value: 927,
        },
        {
          label:
            'NJPX - Cervical Facet joint pain/ chronic inflammation/ stiffness',
          value: 940,
        },
        {
          label: 'NJUX - Cervical Subluxation/ instability',
          value: 922,
        },
        {
          label: 'NJXX - Cervical Spine Facet Joint injuries',
          value: 941,
        },
        {
          label: 'NKXN - Neck laceration not requiring suturing',
          value: 923,
        },
        {
          label:
            'NKXQ - Complication of neck laceration/ abrasion including infection ',
          value: 924,
        },
        {
          label: 'NKXS - Neck laceration requiring suturing',
          value: 925,
        },
        {
          label: 'NKXX - Neck Laceration/ Abrasion',
          value: 926,
        },
        {
          label: 'NMSX - Neck muscle strain',
          value: 928,
        },
        {
          label:
            'NMXX - Neck muscle and/or tendon strain/spasm/ trigger points',
          value: 929,
        },
        {
          label: 'NMYX - Neck muscle spasm/ trigger points incl torticollis',
          value: 930,
        },
        {
          label:
            'NNNX - Cervical nerve root compression/ stretch (proximal burner/ stinger)',
          value: 931,
        },
        {
          label: 'NNSC - Cervical spinal cord concussion',
          value: 932,
        },
        {
          label: 'NNSX - Cervical spinal cord injury',
          value: 933,
        },
        {
          label: 'NNXX - Neurological Neck Injury',
          value: 934,
        },
        {
          label: 'NOLF - Foreign body in larynx',
          value: 935,
        },
        {
          label: 'NOLX - Laryngeal trauma',
          value: 936,
        },
        {
          label: 'NOXX - Neck Organ Damage',
          value: 937,
        },
        {
          label: 'NWXX - Whiplash',
          value: 942,
        },
        {
          label: 'NXXX - Neck Injuries',
          value: 943,
        },
        {
          label: 'NZXX - Neck Pain/ Injury Not Otherwise Specified',
          value: 944,
        },
        {
          label: 'OGCX - Costoiliac impingement',
          value: 1165,
        },
        {
          label: 'OGXX - Abdominal Biomechanical Injury',
          value: 1166,
        },
        {
          label: 'OHXX - Abdominopelvic Soft Tissue Bruising/ Haematoma',
          value: 1140,
        },
        {
          label: 'OKXN - Truncal laceration/ abrasion not requiring suturing',
          value: 1141,
        },
        {
          label:
            'OKXQ - Complication of laceration/ abrasion to trunk - including infection',
          value: 1142,
        },
        {
          label: 'OKXS - Truncal laceration requiring suturing',
          value: 1143,
        },
        {
          label: 'OKXX - Truncal Laceration/ Abrasion',
          value: 1144,
        },
        {
          label: 'OMCX - Abdominal muscle cramps',
          value: 1145,
        },
        {
          label: 'OMMO - Obliques muscle strain',
          value: 1146,
        },
        {
          label: 'OMMR - Rectus abdominis muscle strain',
          value: 1147,
        },
        {
          label: 'OMMT - Trasversus abdominis muscle strain',
          value: 1148,
        },
        {
          label: 'OMMX - Truncal Muscle Strain',
          value: 1149,
        },
        {
          label: 'OMWX - Winded',
          value: 1150,
        },
        {
          label: 'OMXX - Truncal Muscle Strain/ Spasm/ Trigger points',
          value: 1151,
        },
        {
          label: 'OMYR - Rectus abdominis trigger points/ spasm',
          value: 1152,
        },
        {
          label: 'OMYX - Truncal Muscle Trigger Points/ Spasm',
          value: 1153,
        },
        {
          label: 'OOIX - Intestinal trauma',
          value: 1154,
        },
        {
          label: 'OOKX - Kidney trauma',
          value: 1155,
        },
        {
          label: 'OOLX - Liver trauma',
          value: 1156,
        },
        {
          label: 'OOMX - Multiple organ trauma',
          value: 1157,
        },
        {
          label: 'OOPX - Pancreatic trauma',
          value: 1158,
        },
        {
          label: 'OOSX - Spleen trauma',
          value: 1159,
        },
        {
          label: 'OOXX - Abdominal Organ Injury',
          value: 1160,
        },
        {
          label: 'OOZX - Other organ trauma not otherwise specified',
          value: 1161,
        },
        {
          label: 'OPBX - Bladder trauma',
          value: 1162,
        },
        {
          label: 'OPXX - Pelvic Organ Injury',
          value: 1163,
        },
        {
          label: 'OTRD - Divarication of rectus abdominis',
          value: 1169,
        },
        {
          label: 'OTRT - Rectus abdominus tendinopathy',
          value: 1170,
        },
        {
          label: 'OTRX - Rectus abdominis tendon injury',
          value: 1171,
        },
        {
          label: 'OTUX - Unbilical Hernia',
          value: 1172,
        },
        {
          label: 'OTXX - Abdominal Tendon Injury',
          value: 1173,
        },
        {
          label: 'OXXX - Chest Pain/ Injury Not elsewhere specified',
          value: 167,
        },
        {
          label: 'OZXX - Abdominal pain not otherwise specified',
          value: 1164,
        },
        {
          label: 'OZZX - Abdominal pain undiagnosed',
          value: 1167,
        },
        {
          label: 'QFFD - Fractured distal shaft fibula',
          value: 764,
        },
        {
          label: 'QFFM - Fractured mishaft fibula',
          value: 765,
        },
        {
          label:
            'QFFN - Fractured fibula with associated peroneal nerve injury',
          value: 766,
        },
        {
          label: 'QFFP - Fractured proximal fibula',
          value: 767,
        },
        {
          label:
            'QFFS - Fractured fibula with associated syndesmosis injury ankle',
          value: 768,
        },
        {
          label: 'QFFX - Fractured fibula',
          value: 769,
        },
        {
          label: 'QFTC - Compound midshaft fractured tibia +/- fibula',
          value: 770,
        },
        {
          label: 'QFTF - Fractured midshaft tibia and fibula',
          value: 771,
        },
        {
          label:
            'QFTQ - Fractured tibia +/- fibula with other complication (e.g. compartment syndrome)',
          value: 772,
        },
        {
          label: 'QFTT - Fractured midshaft tibia',
          value: 773,
        },
        {
          label: 'QFTX - Fractured Midshaft Tibia +/- Fibula',
          value: 774,
        },
        {
          label: 'QFXX - Lower Leg Fractures',
          value: 775,
        },
        {
          label: 'QHAX - Shin contusion',
          value: 1485,
        },
        {
          label: 'QHMA - Tib anterior haematoma',
          value: 757,
        },
        {
          label: 'QHML - Peroneal Haematoma',
          value: 758,
        },
        {
          label: 'QHMP - Calf/ gastroc haematoma',
          value: 759,
        },
        {
          label: 'QHMX - Lower leg muscle haematoma',
          value: 760,
        },
        {
          label: 'QHTX - Pretibial periosteal bruising/ haematoma',
          value: 761,
        },
        {
          label: 'QHXX - Leg Soft Tissue Bruising/ Haematoma',
          value: 762,
        },
        {
          label:
            'QHZX - Other soft tissue bruising/haematoma not otherwise specified',
          value: 763,
        },
        {
          label: 'QKAX - Shin laceration/ abrasion',
          value: 780,
        },
        {
          label: 'QKPX - Calf laceration/ abrasion',
          value: 781,
        },
        {
          label:
            'QKXI - Infection as complication of lower leg laceration/ abrasion ',
          value: 782,
        },
        {
          label: 'QKXQ - Other complication of lower leg laceration/ abrasion',
          value: 783,
        },
        {
          label: 'QKXX - Lower Leg Laceration/ Abrasion',
          value: 784,
        },
        {
          label: 'QMAX - Anterior compartment muscle injury',
          value: 785,
        },
        {
          label: 'QMCX - Calf cramping during exercise',
          value: 786,
        },
        {
          label: 'QMGL - Lateral gastroc strain',
          value: 787,
        },
        {
          label: 'QMGM - Medial gastroc strain',
          value: 788,
        },
        {
          label: 'QMGX - Gastrocnemius muscle injury/ strain',
          value: 789,
        },
        {
          label: 'QMLX - Lateral compartment muscle injury',
          value: 790,
        },
        {
          label: 'QMSA - Soleus strain a/w accessory soleus',
          value: 791,
        },
        {
          label: 'QMSX - Soleus Injury/ strain',
          value: 792,
        },
        {
          label: 'QMXX - Lower leg muscle Injury',
          value: 793,
        },
        {
          label: 'QMYD - Delayed onset muscle soreness',
          value: 794,
        },
        {
          label: 'QMYG - Gastroc muscle trigger points/ spasm',
          value: 795,
        },
        {
          label: 'QMYL - Lateral gastroc trigger points/ spasm',
          value: 796,
        },
        {
          label: 'QMYM - Medial gastroc trigger points/ spasm',
          value: 797,
        },
        {
          label: 'QMYP - Peroneal trigger points/ spasm',
          value: 798,
        },
        {
          label: 'QMYS - Soleus Trigger points/ Spasm',
          value: 799,
        },
        {
          label: 'QMYX - Calf muscle trigger points/ spasm',
          value: 800,
        },
        {
          label: 'QNPX - Peroneal nerve palsy (with foot drop)',
          value: 801,
        },
        {
          label: 'QNXX - Neurological Injury of Lower Leg',
          value: 802,
        },
        {
          label: 'QSFX - Stress fracture fibula',
          value: 776,
        },
        {
          label: 'QSTA - Anterior stress fracture tibia',
          value: 777,
        },
        {
          label: 'QSTP - Posteromedial stress fracture tibia',
          value: 778,
        },
        {
          label: 'QSTX - Stress fracture tibia',
          value: 779,
        },
        {
          label:
            'QTXX - Lower Leg Tendon Injuries (see knee or ankle depending on tendon location)',
          value: 820,
        },
        {
          label:
            'QVAX - Acute anterior compartment syndrome (excl that from fractured tibia - see QFTQ)',
          value: 821,
        },
        {
          label: 'QVVP - Popliteal artery entrapment',
          value: 822,
        },
        {
          label: 'QVVX - Other vascular injury to lower leg',
          value: 823,
        },
        {
          label: 'QVXX - Vascular Injury Lower Leg',
          value: 824,
        },
        {
          label: 'QVZX - Other acute compartment syndrome to lower leg',
          value: 825,
        },
        {
          label:
            'QYBA - Anterior shin periostitis/ stress syndrome/ shin splints',
          value: 803,
        },
        {
          label:
            'QYBP - Posteromedial shin periostitis/ stress syndrome/ shin splints',
          value: 804,
        },
        {
          label: 'QYBX - Tenoperiostitis of lower leg',
          value: 805,
        },
        {
          label: 'QYMA - Anterior compartment syndrome ',
          value: 806,
        },
        {
          label: 'QYMD - Deep posterior compartment syndrome',
          value: 807,
        },
        {
          label: 'QYML - Lateral (peroneal) compartment syndrome',
          value: 808,
        },
        {
          label: 'QYMM - Compartment syndrome multiple sites lower leg',
          value: 809,
        },
        {
          label: 'QYMP - Posterior compartment syndrome',
          value: 810,
        },
        {
          label: 'QYMX - Chronic compartment syndrome lower leg',
          value: 811,
        },
        {
          label: 'QYXX - Other Leg Overuse Injury',
          value: 812,
        },
        {
          label: 'QZXX - Other Lower Leg Pain/ Injury not otherwise specified',
          value: 64,
        },
        {
          label: 'QZZX - Lower leg pain undiagnosed',
          value: 813,
        },
        {
          label: 'RFBX - Fracture radius and ulna midshaft',
          value: 379,
        },
        {
          label:
            'RFRG - Galleazzi fracture - midshaft radius fracture, dislocation DRUJ',
          value: 380,
        },
        {
          label: 'RFRX - fracture radius midshaft',
          value: 381,
        },
        {
          label:
            'RFUM - Monteggia Fracture - midshaft ulna fracture and dislocation radial head at elbow',
          value: 382,
        },
        {
          label: 'RFUX - Fractured ulna midshaft',
          value: 383,
        },
        {
          label: 'RFXX - Forearm fracture(s)',
          value: 384,
        },
        {
          label: 'RHXX - Forearm Soft Tissue Bruising/ Haematoma',
          value: 378,
        },
        {
          label:
            'RKXQ - Complication of forearm laceration/ abrasion including infection',
          value: 387,
        },
        {
          label: 'RKXX - Forearm Laceration/ Abrasion',
          value: 388,
        },
        {
          label: 'RMEX - Forearm extensor muscle strain',
          value: 389,
        },
        {
          label: 'RMFX - Forearm flexor muscle strain',
          value: 390,
        },
        {
          label: 'RMXX - Forearm Muscle Injury',
          value: 391,
        },
        {
          label: 'RMYX - Forearm muscle soreness/ trigger points',
          value: 392,
        },
        {
          label: 'RNXX - Forearm Neurological Injury',
          value: 393,
        },
        {
          label: 'RSFX - Stress fracture radius and/or ulna',
          value: 385,
        },
        {
          label:
            'RSXX - Forearm Bony Stress/ Overuse Injury including Stress Fracture',
          value: 386,
        },
        {
          label: 'RTEI - Intersection syndrome',
          value: 398,
        },
        {
          label: 'RTES - Forearm extensor tenosynovitis',
          value: 399,
        },
        {
          label: 'RTET - Forearm extensor tendinopathy',
          value: 400,
        },
        {
          label: 'RTEX - Forearm extensor tendon injury',
          value: 401,
        },
        {
          label: 'RTFX - Forearm flexor tendon injury',
          value: 402,
        },
        {
          label: 'RTXX - Forearm Tendon Injury',
          value: 403,
        },
        {
          label: 'RXXX - Elbow Pain/ Injury not otherwise specified',
          value: 254,
        },
        {
          label: 'RYCX - Forearm compartment syndrome',
          value: 394,
        },
        {
          label: 'RYPX - Forearm splints/ medial ulnar stress syndrome',
          value: 395,
        },
        {
          label: 'RYXX - Other Stress/ Overuse injuries to Forearm',
          value: 396,
        },
        {
          label: 'RZXX - Forearm Pain/ Injury not otherwise specified',
          value: 397,
        },
        {
          label: 'SAAX - AC joint arthritis',
          value: 1013,
        },
        {
          label: 'SAGX - Glenohumeral osteoarthritis',
          value: 1014,
        },
        {
          label: 'SAXX - Shoulder Osteoarthritis',
          value: 1015,
        },
        {
          label: 'SCXX - Shoulder Osteochondral Lesion',
          value: 1017,
        },
        {
          label: 'SDAA - Shoulder dislocation with axillary nerve injury',
          value: 954,
        },
        {
          label: 'SDAG - Glenohumeral ligament tear',
          value: 955,
        },
        {
          label: 'SDAH - Shoulder dislocation with HAGL lesion',
          value: 956,
        },
        {
          label: 'SDAL - Shoulder dislocation with labral bankart lesion',
          value: 957,
        },
        {
          label:
            'SDAN - Shoulder dislocation with other or unspecified neurological injury',
          value: 958,
        },
        {
          label: 'SDAS - Shoulder dislocation with SLAP tear',
          value: 959,
        },
        {
          label: 'SDAX - Anteroinferior shoulder dislocation',
          value: 960,
        },
        {
          label: 'SDIX - Inferior shoulder dislocation',
          value: 961,
        },
        {
          label:
            'SDPL - Posterior shoulder dislocation with posterior labral lesion',
          value: 962,
        },
        {
          label: 'SDPX - Posterior shoulder dislocation',
          value: 963,
        },
        {
          label: 'SDXX - Acute Shoulder Dislocation',
          value: 964,
        },
        {
          label: 'SFCI - Fracture inner third clavicle',
          value: 968,
        },
        {
          label: 'SFCM - Fracture middle third clavicle',
          value: 969,
        },
        {
          label: 'SFCO - Fracture outer third clavicle',
          value: 970,
        },
        {
          label: 'SFCR - Refracture clavicle through callus',
          value: 971,
        },
        {
          label: 'SFCX - Clavicular fracture',
          value: 972,
        },
        {
          label: 'SFHH - Hill Sachs compression fracture',
          value: 973,
        },
        {
          label: 'SFHN - Fracture neck of humerus',
          value: 974,
        },
        {
          label: 'SFHT - Fracture greater tuberosity humerus',
          value: 975,
        },
        {
          label: 'SFHX - Humerus Fracture',
          value: 976,
        },
        {
          label: 'SFMX - Multiple stress fractures pelvis',
          value: 128,
        },
        {
          label: 'SFSB - Fractured glenoid = bony bankart lesion',
          value: 977,
        },
        {
          label: 'SFSX - Scapula fracture',
          value: 978,
        },
        {
          label: 'SFXX - Shoulder Fractures',
          value: 979,
        },
        {
          label: 'SGAX - Synovitis AC joint',
          value: 1031,
        },
        {
          label: 'SGCX - Adhesive Capsulitis',
          value: 1032,
        },
        {
          label: 'SGIA - Acute anterior internal impingement',
          value: 1033,
        },
        {
          label: 'SGIC - Chronic internal impingment',
          value: 1034,
        },
        {
          label: 'SGIP - Acute posterior internal impingement',
          value: 1035,
        },
        {
          label: 'SGIX - Internal impingement of the shoulder',
          value: 1036,
        },
        {
          label: 'SGSA - Acute subacromial impingement',
          value: 1037,
        },
        {
          label: 'SGSC - Other chronic subacromial impingement',
          value: 1038,
        },
        {
          label: 'SGSI - Instability associated subacromial impingement',
          value: 1039,
        },
        {
          label: 'SGSP - Posture associated impingement',
          value: 1040,
        },
        {
          label: 'SGSX - Subacromial impingement',
          value: 1041,
        },
        {
          label: 'SGXX - Shoulder impingement/ Synovitis',
          value: 1042,
        },
        {
          label: 'SHAX - AC Joint contusion',
          value: 948,
        },
        {
          label: 'SHMD - Deltoid haematoma',
          value: 949,
        },
        {
          label: 'SHMR - Rotator Cuff haematoma',
          value: 950,
        },
        {
          label: 'SHMT - Trapezius haematoma',
          value: 951,
        },
        {
          label: 'SHMX - Shoulder muscle haematoma',
          value: 952,
        },
        {
          label: 'SHXX - Shoulder Soft Tissue Bruising/ Haematoma',
          value: 953,
        },
        {
          label: 'SJAD - Grade 3 AC joint dislocation',
          value: 965,
        },
        {
          label: 'SJAF - Fracture dislocation AC joint',
          value: 966,
        },
        {
          label: 'SJAR - Grade 4 - 6 AC joint dislocation',
          value: 967,
        },
        {
          label: 'SJAS - Grade 1 AC joint sprain',
          value: 992,
        },
        {
          label: 'SJAT - Grade 2 AC joint sprain',
          value: 993,
        },
        {
          label: 'SJAX - Acromioclavicular joint sprain',
          value: 994,
        },
        {
          label: 'SJSA - Anteroinferior shoulder subluxation',
          value: 995,
        },
        {
          label: 'SJSL - Glenohumeral ligament sprain',
          value: 996,
        },
        {
          label: 'SJSP - Posterior shoulder subluxation',
          value: 997,
        },
        {
          label:
            'SJSQ - Glenohumeral joint sprain with chondral/ labral damage (incl SLAP tear)',
          value: 998,
        },
        {
          label: 'SJSX - Glenohumeral joint sprains',
          value: 999,
        },
        {
          label: 'SJXX - Acute Shoulder Sprains/ Subluxation',
          value: 1000,
        },
        {
          label: 'SKXN - Shoulder laceration/ abrasion not requiring suturing',
          value: 988,
        },
        {
          label:
            'SKXQ - Complication of shoulder laceration/ abrasion including infection',
          value: 989,
        },
        {
          label: 'SKXS - Shoulder laceration requiring suturing',
          value: 990,
        },
        {
          label: 'SKXX - Shoulder Soft Tissue Laceration/ Abrasion',
          value: 991,
        },
        {
          label: 'SMDX - Deltoid muscle injury',
          value: 1001,
        },
        {
          label: 'SMLX - Latissimus Dorsi muscle injury',
          value: 1002,
        },
        {
          label: 'SMPX - Pectoralis major muscle injury',
          value: 1003,
        },
        {
          label: 'SMRX - Rotator Cuff muscle injury',
          value: 1004,
        },
        {
          label: 'SMXX - Shoulder muscle strain/ spasm/ trigger points',
          value: 1005,
        },
        {
          label:
            'SMYX - Shoulder muscle trigger points/ posterior muscle soreness',
          value: 1006,
        },
        {
          label: 'SMZX - Other shoulder muscle injury not elsewhere specified',
          value: 1007,
        },
        {
          label:
            'SNAX - Isolated axillary nerve palsy (excl ax n palsy due to Shoulder dislocation - SDAA)',
          value: 1008,
        },
        {
          label: 'SNBX - Brachial plexus traction injury/ burner/ stinger',
          value: 1009,
        },
        {
          label: 'SNSX - Suprascapular nerve palsy',
          value: 1010,
        },
        {
          label: 'SNTX - Thoracic Outlet Syndrome',
          value: 1011,
        },
        {
          label: 'SNVS - Subclavian vein obstruction',
          value: 1067,
        },
        {
          label: 'SNVX - Shoulder vascular injury',
          value: 1068,
        },
        {
          label: 'SNXX - Shoulder Neurological/ vascular injury',
          value: 1012,
        },
        {
          label: 'SSAO - Osteolysis of distal clavicle',
          value: 1018,
        },
        {
          label: 'SSAX - AC joint stress/ overuse injury',
          value: 1019,
        },
        {
          label: 'SSFS - Stress fracture coracoid process',
          value: 980,
        },
        {
          label: 'SSFX - Shoulder bony stress/ over use injury',
          value: 1020,
        },
        {
          label: 'SSXS - Scapula Dyskinesis of shoulder joint',
          value: 1482,
        },
        {
          label:
            'SSXX - Shoulder stress/ Overuse injuries incl stress fractures',
          value: 1021,
        },
        {
          label:
            'SSZX - Other Bony/ overuse injuries noth elsewhere classified',
          value: 1022,
        },
        {
          label: 'STBR - Long head of biceps tendon rupture',
          value: 1043,
        },
        {
          label: 'STBT - Biceps tendinopathy',
          value: 1044,
        },
        {
          label: 'STBX - Proximal biceps tendon injury',
          value: 1045,
        },
        {
          label: 'STBZ - Other biceps tendon injury not otherwise specified',
          value: 1046,
        },
        {
          label: 'STCR - Subscapularis tendon rupture',
          value: 1047,
        },
        {
          label: 'STCX - Subscapularis Tendon Injury',
          value: 1048,
        },
        {
          label:
            'STCZ - Other Subscapularis tendon injury not otherwise specified',
          value: 1049,
        },
        {
          label: 'STIR - Infraspinatus tendon rupture',
          value: 1050,
        },
        {
          label: 'STIX - Infraspinatus tendon injury',
          value: 1051,
        },
        {
          label:
            'STIZ - Other Infraspinatus tendon injury Not otherwise specified',
          value: 1052,
        },
        {
          label: 'STMS - Multiple tendon strain/ rupture',
          value: 1053,
        },
        {
          label: 'STMT - Multiple tendinopathy',
          value: 1054,
        },
        {
          label: 'STMX - Multiple tendon injury',
          value: 1055,
        },
        {
          label: 'STPR - Pec Major tendon rupture',
          value: 1056,
        },
        {
          label: 'STPX - Pectoralis major tendon injury',
          value: 1057,
        },
        {
          label: 'STPZ - Other pec major tendon injury not otherwise specified',
          value: 1058,
        },
        {
          label: 'STSC - Calcific tendinopathy',
          value: 1059,
        },
        {
          label: 'STSP - Supraspinatus tendon tear partial thickness',
          value: 1060,
        },
        {
          label: 'STSR - Suprapinatus tendon rupture full thickness',
          value: 1061,
        },
        {
          label: 'STST - Supraspinatus tendinopathy',
          value: 1062,
        },
        {
          label: 'STSX - Supraspinatus tendon injury',
          value: 1063,
        },
        {
          label:
            'STSZ - Other supraspinatus tendon injur noth otherwsie specified',
          value: 1064,
        },
        {
          label: 'STXX - Shoulder Tendon Overuse Injury/ Strain',
          value: 1065,
        },
        {
          label: 'STZX - Other tendon injury NOS',
          value: 1066,
        },
        {
          label:
            'SUAI - Anteroinferior instability shoulder with RC bruising/ impingement',
          value: 981,
        },
        {
          label:
            'SUAL - Anteroinferior instability with labral lesion incl SLAP',
          value: 982,
        },
        {
          label: 'SUAX - Anteroinferior instability of shoulder',
          value: 983,
        },
        {
          label: 'SUBX - SLAP Lesion',
          value: 984,
        },
        {
          label: 'SUCX - AC Joint instability/ recurrent sprains',
          value: 985,
        },
        {
          label: 'SUPX - Posterior instability',
          value: 986,
        },
        {
          label: 'SUXX - Chronic Shoulder instability',
          value: 987,
        },
        {
          label: 'SZXX - Shoulder Pain/ Injury not otherwise specified',
          value: 1023,
        },
        {
          label: 'TFFX - Fractured femoral shaft',
          value: 1080,
        },
        {
          label: 'TFXX - Thigh Fractures',
          value: 1081,
        },
        {
          label: 'THMA - Adductor muscle haematoma',
          value: 1071,
        },
        {
          label: 'THMB - Acute artherial bleed thigh',
          value: 1072,
        },
        {
          label: 'THMH - Hamstring muscle haematoma',
          value: 1073,
        },
        {
          label: 'THMI - ITB Haematoma',
          value: 1074,
        },
        {
          label: 'THMQ - Quadriceps muscle haematoma',
          value: 1075,
        },
        {
          label: 'THMX - Thigh muscle haematoma',
          value: 1076,
        },
        {
          label: 'THOX - Myositis ossificans thigh',
          value: 1077,
        },
        {
          label: 'THXX - Thigh Soft Tissue Bruising/ Haematoma',
          value: 1078,
        },
        {
          label:
            'THZX - Other soft tissue bruising/ haematoma not otherwise specified',
          value: 1079,
        },
        {
          label: 'TKXQ - Complication of laceration/ abrasion incl. infection',
          value: 1084,
        },
        {
          label: 'TKXX - Thigh Laceration/ Abrasion',
          value: 1085,
        },
        {
          label: 'TMAL - Adductor longus strain',
          value: 1086,
        },
        {
          label: 'TMAM - Adductor magnus strain',
          value: 1087,
        },
        {
          label: 'TMAR - Adductor muscle rupture/ grade 3 strain',
          value: 1088,
        },
        {
          label: 'TMAX - Adductor strain',
          value: 1089,
        },
        {
          label: 'TMCA - Adductor muscle cramping suring exercise',
          value: 1090,
        },
        {
          label: 'TMCH - Hamstring cramping during exercise',
          value: 1091,
        },
        {
          label: 'TMCQ - Quadricep cramping during exercise',
          value: 1092,
        },
        {
          label: 'TMCX - Thigh muscle cramping during exercise',
          value: 1093,
        },
        {
          label:
            'TMGQ - Quadriceps wasting (excl. that where patellofemoral pain is clinical diagnosis)',
          value: 1094,
        },
        {
          label: 'TMGX - Thigh muscle wasting',
          value: 1095,
        },
        {
          label: 'TMHB - Biceps femoris strain grade 1 - 2',
          value: 1096,
        },
        {
          label: 'TMHR - Grade 3 hamstring strain',
          value: 1097,
        },
        {
          label: 'TMHS - Semimembranosis/ tendinosis strain (grade 1 - 2)',
          value: 1098,
        },
        {
          label: 'TMHX - Hamstring strain',
          value: 1099,
        },
        {
          label: 'TMLH - Back referred hamstring tightness',
          value: 1100,
        },
        {
          label: 'TMLX - Back referred muscle tightness',
          value: 1101,
        },
        {
          label: 'TMQR - Rectus femoris rupture',
          value: 1102,
        },
        {
          label: 'TMQS - Rectus femoris strain',
          value: 1103,
        },
        {
          label: 'TMQV - Other quadricep strain',
          value: 1104,
        },
        {
          label: 'TMQW - Other quadricep rupture',
          value: 1105,
        },
        {
          label: 'TMQX - Quadriceps Strain',
          value: 1106,
        },
        {
          label: 'TMXX - Thigh Muscle strain/ Spasm/ Trigger Points',
          value: 1107,
        },
        {
          label: 'TMYA - Adductor trigger points',
          value: 1108,
        },
        {
          label: 'TMYH - Hamstring trigger points',
          value: 1109,
        },
        {
          label: 'TMYQ - Quadricep trigger points',
          value: 1110,
        },
        {
          label: 'TMYX - Thigh muscle trigger points',
          value: 1111,
        },
        {
          label: 'TNEL - Lateral cutaneous nerve of thigh entrapment',
          value: 1113,
        },
        {
          label: 'TNEX - Nerve entrapment in thigh',
          value: 1114,
        },
        {
          label: 'TNXX - Thigh Neurological Injury',
          value: 1115,
        },
        {
          label: 'TSFX - Femoral shaft stress fracture',
          value: 1082,
        },
        {
          label: 'TSXX - Thigh Stress Fractures',
          value: 1083,
        },
        {
          label:
            'TTXX - Thigh Tendon Injuries (see Hip/ groin or knee depending on tendon location)',
          value: 1112,
        },
        {
          label: 'TXXX - Hip/ Groin Pain Not otherwise specified',
          value: 565,
        },
        {
          label: 'TYCX - Compartment Syndrome of Thigh',
          value: 1116,
        },
        {
          label: 'TYPX - Tenoperiostitis of Thigh',
          value: 1117,
        },
        {
          label: 'TYXX - Other stress/ Overuse Injuries to Thigh',
          value: 1118,
        },
        {
          label: 'TZZX - Thigh pain undiagnosed',
          value: 1119,
        },
        {
          label: 'UFHM - Midshaft humerus fracture',
          value: 1240,
        },
        {
          label: 'UFXX - Upper Arm Fracture',
          value: 1242,
        },
        {
          label: 'UHMB - Biceps haematoma',
          value: 1234,
        },
        {
          label: 'UHMO - Upper arm myositis ossificans',
          value: 1235,
        },
        {
          label: 'UHMT - Triceps Haematoma',
          value: 1236,
        },
        {
          label: 'UHMX - Upper arm muscle bruising/ haematoma',
          value: 1237,
        },
        {
          label: 'UHXX - Upper Arm Soft Tissue Bruising/ Haematoma',
          value: 1238,
        },
        {
          label: 'UHZX - Other Upper arm soft tissue bruising/ haematoma',
          value: 1239,
        },
        {
          label: 'UKXN - Upper arm laceration/ abrasion not requiring suturing',
          value: 1245,
        },
        {
          label:
            'UKXQ - Complication of upper arm laceration/ abrasion including infection',
          value: 1246,
        },
        {
          label: 'UKXS - Upper arm laceration requiring suturing',
          value: 1247,
        },
        {
          label: 'UKXX - Upper Arm Laceration/ Abrasion',
          value: 1248,
        },
        {
          label: 'UMBX - Biceps muscle strain',
          value: 1249,
        },
        {
          label: 'UMTX - Triceps muscle strain',
          value: 1250,
        },
        {
          label: 'UMXX - Upper Arm Muscle Strain/ Spasm/ Trigger points',
          value: 1251,
        },
        {
          label: 'UMYD - Upper arm DOMS',
          value: 1252,
        },
        {
          label: 'UMYT - Upper arm trigger points/ spasm',
          value: 1253,
        },
        {
          label: 'UMYX - Upper arm muscle trigger points/ pain',
          value: 1254,
        },
        {
          label: 'UNMX - Median nerve injury upper arm',
          value: 1255,
        },
        {
          label: 'UNRX - Radial nerve injury upper arm',
          value: 1256,
        },
        {
          label: 'UNSX - Musculocutaneous nerve injury upper arm',
          value: 1257,
        },
        {
          label: 'UNUX - Ulnar nerve injury upper arm',
          value: 1258,
        },
        {
          label: 'UNXX - Upper Arm neurological injury',
          value: 1259,
        },
        {
          label: 'USFH - Stress fracture humerus',
          value: 1243,
        },
        {
          label: 'USFX - Upper arm stress fracture',
          value: 1244,
        },
        {
          label: 'USXX - Upper Arm Bony Stress / Overuse Injury',
          value: 1260,
        },
        {
          label: 'UTXX - Upper Arm Tendon Injury',
          value: 1264,
        },
        {
          label:
            'UYTX - Upper arm soft tissue overuse injury (e.g. periostitis)',
          value: 1261,
        },
        {
          label: 'UYXX - Other Upper Arm Overuse Injury',
          value: 1262,
        },
        {
          label: 'UZXX - Upper Arm Pain/ Injury not otherwise specified',
          value: 1263,
        },
        {
          label: 'VASI - Infection of stump',
          value: 1492,
        },
        {
          label: 'VASS - Stump skin pressure sores',
          value: 1493,
        },
        {
          label: 'VASX - Stump Problem',
          value: 1491,
        },
        {
          label: 'VASZ - Other stump injury',
          value: 1494,
        },
        {
          label: 'VAXX - Injury/ Illness in an amputee athete',
          value: 1490,
        },
        {
          label: 'VWAX - Autonomic dysreflexia',
          value: 1496,
        },
        {
          label: 'VWSX - Skin pressure sores',
          value: 1497,
        },
        {
          label: 'VWUI - Urinary infection',
          value: 1500,
        },
        {
          label: 'VWUR - Urinary retention/ blocked catheter',
          value: 1499,
        },
        {
          label: 'VWUX - Urinary problem',
          value: 1498,
        },
        {
          label:
            'VWXX - Injury/ illness specific to a Spinal Cord Injured athlete',
          value: 1495,
        },
        {
          label:
            'VXXX - Disabled Athlete Injuries/Illnesses (where specifically due to that disability)',
          value: 1489,
        },
        {
          label:
            'VZXX - Injury/ Illness Specific to Disabled Athletes not elsewhere specified',
          value: 1501,
        },
        {
          label: 'WAFD - DIP jt OA fingers',
          value: 1266,
        },
        {
          label: 'WAFM - MCP jt OA fingers',
          value: 1267,
        },
        {
          label: 'WAFP - PIP jt OA fingers',
          value: 1268,
        },
        {
          label: 'WAFX - Osteoarthritis of fingers',
          value: 1269,
        },
        {
          label: 'WAPC - CMC jt OA',
          value: 1270,
        },
        {
          label: 'WAPI - IP jt OA',
          value: 1271,
        },
        {
          label: 'WAPM - MCP jt OA',
          value: 1272,
        },
        {
          label: 'WAPX - Osteoarthritis of thumb',
          value: 1273,
        },
        {
          label: 'WAWS - SLAC Wrist (post S-L tear)',
          value: 1274,
        },
        {
          label: 'WAWX - Wrist osteoarthritis',
          value: 1275,
        },
        {
          label: 'WAXX - Wrist and Hand Osteoarthritis',
          value: 1276,
        },
        {
          label: 'WCXX - Wrist and Hand Osteochondral/ Chondral Injury',
          value: 1421,
        },
        {
          label: 'WDCX - Dislocation through carpus',
          value: 1284,
        },
        {
          label: 'WDDX - DRUJ dislocation',
          value: 1285,
        },
        {
          label: 'WDFA - PIP joint dislocation index finger',
          value: 1286,
        },
        {
          label: 'WDFB - PIP joint dislocation middle finger',
          value: 1287,
        },
        {
          label: 'WDFC - PIP joint dislocation ring finger',
          value: 1288,
        },
        {
          label: 'WDFD - PIP joint dislocation little finger',
          value: 1289,
        },
        {
          label: 'WDFE - DIP joint dislocation index finger',
          value: 1290,
        },
        {
          label: 'WDFF - DIP joint dislocation middle finger',
          value: 1291,
        },
        {
          label: 'WDFG - DIP joint dislocation ring finger',
          value: 1292,
        },
        {
          label: 'WDFH - DIP joint dislocation little finger',
          value: 1293,
        },
        {
          label: 'WDFM - Multiple PIP and/or DIP joint dislocations',
          value: 1294,
        },
        {
          label:
            'WDFQ - Complication of PIP/ DIP joint dislocation (excl chr instability see WUFX)',
          value: 1295,
        },
        {
          label: 'WDFV - Finger joint dislocation with volar plate injury',
          value: 1296,
        },
        {
          label: 'WDFW - PIP joint dislocation finger unknown',
          value: 1297,
        },
        {
          label: 'WDFX - Dislocation of PIP or DIP joint(s) ',
          value: 1298,
        },
        {
          label: 'WDFY - DIP joint dislocation finger unknown',
          value: 1299,
        },
        {
          label: 'WDMA - MCP jt dislocation index finger',
          value: 1300,
        },
        {
          label: 'WDMB - MCP jt dislocation middle finger',
          value: 1301,
        },
        {
          label: 'WDMC - MCP jt dislocation ring finger',
          value: 1302,
        },
        {
          label: 'WDMD - MCP jt dislocation little finger',
          value: 1303,
        },
        {
          label: 'WDMM - MCP jt dislocation of two or more fingers',
          value: 1304,
        },
        {
          label:
            'WDMQ - Complication of finger MCP jt sprain (excl instability see WUMX)',
          value: 1305,
        },
        {
          label: 'WDMX - Dislocation of MCP joint finger(s)',
          value: 1306,
        },
        {
          label: 'WDPC - Dislocation CMC joint thumb',
          value: 1307,
        },
        {
          label: 'WDPI - Dislocation of IP joint thumb',
          value: 1308,
        },
        {
          label: 'WDPM - Dislocation of MCP joint thumb',
          value: 1309,
        },
        {
          label:
            'WDPQ - Complication of thumb joint dislocation excl instability - see WUPX',
          value: 1310,
        },
        {
          label: 'WDPX - Dislocation of thumb joint',
          value: 1311,
        },
        {
          label: 'WDTX - Dislocation of CMC joint of fingers',
          value: 1312,
        },
        {
          label: 'WDWX - Radiocarpal joint dislocation',
          value: 1313,
        },
        {
          label: 'WDXX - Wrist and Hand Dislocations',
          value: 1314,
        },
        {
          label: 'WFCM - Fracture multiple carpal bones',
          value: 1315,
        },
        {
          label: 'WFCX - Fracture other carpal bone',
          value: 1316,
        },
        {
          label: 'WFFA - Proximal phalanx fracture index finger',
          value: 1317,
        },
        {
          label: 'WFFB - Proximal phalanx fracture middle finger',
          value: 1318,
        },
        {
          label: 'WFFC - Proximal phalanx fracture ringfinger',
          value: 1319,
        },
        {
          label: 'WFFD - Proximal phalanx fracture little finger',
          value: 1320,
        },
        {
          label: 'WFFE - Middle phalanx fracture index finger',
          value: 1321,
        },
        {
          label: 'WFFF - Middle phalanx fracture middle finger',
          value: 1322,
        },
        {
          label: 'WFFG - Middle phalanx fracture ringfinger',
          value: 1323,
        },
        {
          label: 'WFFH - Middle phalanx fracture little finger',
          value: 1324,
        },
        {
          label: 'WFFI - Distal phalanx fracture index finger',
          value: 1325,
        },
        {
          label: 'WFFJ - Distal phalanx fracture middle finger',
          value: 1326,
        },
        {
          label: 'WFFK - Distal phalanx fracture ringfinger',
          value: 1327,
        },
        {
          label: 'WFFL - Distal phalanx fracture little finger',
          value: 1328,
        },
        {
          label: 'WFFM - Multiple phalangeal fractures fingers',
          value: 1329,
        },
        {
          label: 'WFFQ - Complication from finger fracture (incl malunion)',
          value: 1330,
        },
        {
          label: 'WFFX - Fracture finger(s) - excl avulsion fractures',
          value: 1331,
        },
        {
          label: 'WFHH - Fractured hook of hamate',
          value: 1332,
        },
        {
          label: 'WFHX - Fractured hamate',
          value: 1333,
        },
        {
          label: 'WFMA - Fracture 2nd metacarpal',
          value: 1334,
        },
        {
          label: 'WFMB - Fracture 3rd metacarpal',
          value: 1335,
        },
        {
          label: 'WFMC - Fracture 4th metacarpal',
          value: 1336,
        },
        {
          label: 'WFMD - Fracture 5th metacarpal',
          value: 1337,
        },
        {
          label: 'WFMM - Multiple metacarpal fractures',
          value: 1338,
        },
        {
          label: 'WFMX - Fracture metacarpals 2- 5',
          value: 1339,
        },
        {
          label: "WFPB - Bennett's fracture thumb - base 1st MC",
          value: 1340,
        },
        {
          label: 'WFPD - Fracture distal phalanx thumb',
          value: 1341,
        },
        {
          label: 'WFPM - Fracture shaft 1st MC',
          value: 1342,
        },
        {
          label: 'WFPP - Fracture proximal phalanx of thumb',
          value: 1343,
        },
        {
          label: 'WFPR - Rolando fracture (comminuted fracture base 1st MC)',
          value: 1344,
        },
        {
          label: 'WFPX - Fractured thumb',
          value: 1345,
        },
        {
          label: 'WFRC - Colles fracture distal radius',
          value: 1346,
        },
        {
          label: 'WFRQ - Wrist fracture with complication (e.g. EPL rupture)',
          value: 1347,
        },
        {
          label: 'WFRS - Smiths fracture distal radius',
          value: 1348,
        },
        {
          label: 'WFRT - Fracture radial styloid',
          value: 1349,
        },
        {
          label: 'WFRX - Fracture of distal radius +/- ulna',
          value: 1350,
        },
        {
          label: 'WFSD - Fracture distal pole scaphoid',
          value: 1351,
        },
        {
          label: 'WFSN - Non union fractured scaphoid',
          value: 1352,
        },
        {
          label: 'WFSP - Fracture proximal pole scaphoid',
          value: 1353,
        },
        {
          label: 'WFSW - Fracture wrist scaphoid',
          value: 1354,
        },
        {
          label: 'WFSX - Scaphoid fracture',
          value: 1355,
        },
        {
          label: 'WFTX - Fractured trapezium',
          value: 1356,
        },
        {
          label: 'WFUT - Fracture of ulna styloid',
          value: 1357,
        },
        {
          label: 'WFUX - Fracture of distal ulna',
          value: 1358,
        },
        {
          label: 'WFXX - Wrist and Hand Fractures',
          value: 1359,
        },
        {
          label: 'WGFD - Chronic synovitis of DIP joint(s)',
          value: 1375,
        },
        {
          label: 'WGFM - Chronic synovitis of MCP joint(s)',
          value: 1376,
        },
        {
          label: 'WGFP - Chronic synovitis of PIP joint(s)',
          value: 1377,
        },
        {
          label: 'WGFX - Chronic synovitis of fingers',
          value: 1378,
        },
        {
          label: 'WGPC - Chronic synovitis of 1st CMC joint ',
          value: 1379,
        },
        {
          label: 'WGPI - Chronic Synovitis of IP joint thumb',
          value: 1380,
        },
        {
          label: 'WGPM - Chronic synovitis of 1st MCP joint',
          value: 1381,
        },
        {
          label: 'WGPX - Chronic synovitis of thumb',
          value: 1382,
        },
        {
          label: 'WGWU - Ulnar abutment syndrome',
          value: 1383,
        },
        {
          label: 'WGWX - Chronic synovitis of wrist',
          value: 1384,
        },
        {
          label: 'WGXX - Wrist and Hand Impingement/ Synovitis',
          value: 1385,
        },
        {
          label: 'WHFU - Fingernail haematoma',
          value: 1277,
        },
        {
          label: 'WHFX - Finger bruising/ haematoma',
          value: 1278,
        },
        {
          label: 'WHHX - Hand bruising/ haematoma',
          value: 1279,
        },
        {
          label: 'WHPU - Thumbnail haematoma',
          value: 1280,
        },
        {
          label: 'WHPX - Thumb bruising/ haematoma',
          value: 1281,
        },
        {
          label: 'WHWX - Wrist bruising/ haematoma',
          value: 1282,
        },
        {
          label: 'WHXX - Wrist and Hand Soft Tissue Bruising/ Haematoma',
          value: 1283,
        },
        {
          label: 'WJCV - Lunate - triquetral sprain',
          value: 1399,
        },
        {
          label: 'WJCX - Other carpal ligament injury',
          value: 1400,
        },
        {
          label: 'WJDT - Triangular fibrocartilage complex tear',
          value: 1422,
        },
        {
          label: 'WJDX - Distal radioulnar joint injury',
          value: 1423,
        },
        {
          label:
            'WJFQ - Complication of finger joint sprain excl. chronic instability',
          value: 1401,
        },
        {
          label: 'WJFX - Finger joint sprain (PIP and DIP joints)',
          value: 1402,
        },
        {
          label:
            'WJMQ - Complication of MCP jt sprain excl chronic instability (see WUMQ)',
          value: 1403,
        },
        {
          label: 'WJMX - Metacarpophalangeal joint sprain',
          value: 1404,
        },
        {
          label: 'WJPC - Thumb CMC jt sprain',
          value: 1405,
        },
        {
          label: 'WJPI - Thumb IP joint sprain',
          value: 1406,
        },
        {
          label:
            'WJPM - Thumb MCP joint sprain (incl radial and ulnar collat ligs)',
          value: 1407,
        },
        {
          label:
            'WJPQ - Complication of thumb sprain excl chronic instability (see WUTX)',
          value: 1408,
        },
        {
          label: 'WJPR - Thumb RCL lig rupture at MCP joint',
          value: 1409,
        },
        {
          label: "WJPU - Thumb UCL lig rupture at MCP joint (skier's thumb)",
          value: 1410,
        },
        {
          label: 'WJPX - Thumb sprain',
          value: 1411,
        },
        {
          label: 'WJSR - Scapholunate ligament rupture',
          value: 1412,
        },
        {
          label: 'WJSS - Scapholunate ligament sprain',
          value: 1413,
        },
        {
          label: 'WJSX - Scapholunate ligament sprain/ tear',
          value: 1414,
        },
        {
          label: 'WJWG - Wrist ganglion',
          value: 1425,
        },
        {
          label: 'WJWQ - Other complication of wrist sprain',
          value: 1426,
        },
        {
          label: 'WJWX - Wrist sprain/ jarring (radiocarpal joint)',
          value: 1415,
        },
        {
          label: 'WJXX - Wrist and Hand Joint Injury',
          value: 1427,
        },
        {
          label: 'WKBX - Blisters of wrist/ hand (incl fingers/ thumb)',
          value: 1362,
        },
        {
          label: 'WKCX - Callous of Wrist/ hand (incl fingers/ thumb)',
          value: 1363,
        },
        {
          label: 'WKFU - Laceration of fingernail/ nailbed',
          value: 1364,
        },
        {
          label: 'WKFX - Finger laceration/ abrasion',
          value: 1365,
        },
        {
          label: 'WKHD - Dorsal hand laceration/ abrasion',
          value: 1366,
        },
        {
          label: 'WKHV - Palmar hand laceration/ abrasion',
          value: 1367,
        },
        {
          label: 'WKHX - Hand laceration/ abrasion',
          value: 1368,
        },
        {
          label: 'WKPU - Laceration of thumb nail/ nailbed',
          value: 1369,
        },
        {
          label: 'WKPX - Thumb laceration/ abrasion',
          value: 1370,
        },
        {
          label: 'WKWD - Dorsal wrist laceration/ abrasion',
          value: 1371,
        },
        {
          label: 'WKWX - Wrist laceration/ abrasion',
          value: 1372,
        },
        {
          label:
            'WKXQ - Complication of wrist/hand laceration/abrasion including infection',
          value: 1373,
        },
        {
          label: 'WKXX - Wrist and Hand Laceration/ Abrasion',
          value: 1374,
        },
        {
          label: 'WMXX - Wrist and Hand Muscle Injury',
          value: 1416,
        },
        {
          label: 'WNCX - Carpal Tunnel Syndrome',
          value: 1417,
        },
        {
          label: 'WNXX - Wrist and Hand Neurological Injury',
          value: 1418,
        },
        {
          label: 'WSCX - Carpal stress fracture',
          value: 1360,
        },
        {
          label: 'WSHP - Sesamoiditis of thumb',
          value: 1428,
        },
        {
          label: 'WSHX - Hand stress fracture (incl thumb and fingers)',
          value: 1361,
        },
        {
          label: 'WSXX - Wrist and Hand Stress/ Overuse Injuries',
          value: 1429,
        },
        {
          label: 'WTDR - Rupture wrist extensor tendon',
          value: 1447,
        },
        {
          label:
            'WTDT - Wrist extensor tenosynovitis/ tendinopathy at wrist (excl intersection syndrome see - RTEI)',
          value: 1448,
        },
        {
          label: 'WTDX - Wrist extensor tendon injury',
          value: 1449,
        },
        {
          label: 'WTEA - Index finger extensor tendon rupture',
          value: 1450,
        },
        {
          label: 'WTEB - Middle finger extensor tendon rupture',
          value: 1451,
        },
        {
          label: 'WTEC - Ring finger extensor tendon rupture',
          value: 1452,
        },
        {
          label: 'WTED - Little finger extensor tendon rupture',
          value: 1453,
        },
        {
          label: 'WTET - Finger(s) extensor tenosynovitis/ tendinopathy',
          value: 1454,
        },
        {
          label:
            'WTEX - Finger extensor tendon injury (incl mallet finger +/- avulsion fracture distal phalanx)',
          value: 1455,
        },
        {
          label: 'WTFA - Index finger flexor tendon rupture',
          value: 1456,
        },
        {
          label: 'WTFB - Middle finger flexor tendon rupture',
          value: 1457,
        },
        {
          label: 'WTFC - Ring finger flexor tendon rupture',
          value: 1458,
        },
        {
          label: 'WTFD - Little finger flexor tendon rupture',
          value: 1459,
        },
        {
          label: 'WTFF - Flexor pully Injury fingers',
          value: 1460,
        },
        {
          label: 'WTFG - Trigger Finger',
          value: 1461,
        },
        {
          label: "WTFP - Dupuytren's contracture",
          value: 1462,
        },
        {
          label: 'WTFT - Finger flexor tenosynovitis/ tendinopathy',
          value: 1463,
        },
        {
          label: 'WTFX - Flexor tendon injury finger(s)',
          value: 1464,
        },
        {
          label:
            'WTTE - Rupture thumb extensor tendon (excl if complication of wrist fracture - see specific fracture)',
          value: 1465,
        },
        {
          label: 'WTTF - Rupture thumb flexor tendon',
          value: 1466,
        },
        {
          label: 'WTTG - Trigger thumb',
          value: 1467,
        },
        {
          label: "WTTT - De Quervain's tenosynovitis",
          value: 1468,
        },
        {
          label: 'WTTX - Thumb tendon injury',
          value: 1469,
        },
        {
          label: 'WTTZ - Other tenosynovitis/ tendinopathy thumb',
          value: 1470,
        },
        {
          label: 'WTVR - Rupture wrist flexor tendon',
          value: 1471,
        },
        {
          label: 'WTVT - Wrist flexor tenosynovitis/ tendinopathy',
          value: 1472,
        },
        {
          label: 'WTVX - Flexor tendon injury at wrist',
          value: 1473,
        },
        {
          label: 'WTXX - Wrist and Hand Tendon Injury',
          value: 1474,
        },
        {
          label: 'WUCD - Scapholunate (DISI) instability',
          value: 1386,
        },
        {
          label: 'WUCV - VISI wrist instability',
          value: 1387,
        },
        {
          label: 'WUCX - Carpal instability',
          value: 1388,
        },
        {
          label: 'WUDX - Distal radioulnar joint instability',
          value: 1389,
        },
        {
          label: 'WUFX - Finger PIP or DIP joint instability',
          value: 1390,
        },
        {
          label: 'WUMX - Finger MCP joint instability',
          value: 1391,
        },
        {
          label: 'WUPC - 1st CMC joint instability',
          value: 1392,
        },
        {
          label: 'WUPI - IP joint instability of thumb',
          value: 1393,
        },
        {
          label: 'WUPM - 1st MCP joint instability',
          value: 1394,
        },
        {
          label: 'WUPX - Thumb Instability',
          value: 1395,
        },
        {
          label: 'WUWX - Radiocarpal joint instability',
          value: 1396,
        },
        {
          label: 'WUXX - Chronic Wrist or Hand Instability',
          value: 1397,
        },
        {
          label: 'WVAX - Wrist and hand arterial injury (incl aneurysm)',
          value: 1475,
        },
        {
          label: 'WVNL - AVN lunate',
          value: 1476,
        },
        {
          label: 'WVNS - AVN scaphoid',
          value: 1477,
        },
        {
          label: 'WVNX - Avascular necrosis in wrist/ hand',
          value: 1478,
        },
        {
          label: 'WVXX - Wrist and Hand Vascular Injury',
          value: 1479,
        },
        {
          label: 'WWV - Volar wrist laceration/ abrasion',
          value: 1398,
        },
        {
          label: 'WXXX - Forearm Pain/ Injury not otherwise specified',
          value: 397,
        },
        {
          label: 'WZCX - Chronic regional pain syndrome',
          value: 1430,
        },
        {
          label: 'WZFX - Other finger pain NOS',
          value: 1431,
        },
        {
          label: 'WZHX - Other hand pain NOS',
          value: 1432,
        },
        {
          label: 'WZPX - Other thumb pain NOS',
          value: 1433,
        },
        {
          label: 'WZWX - Other wrist pain NOS',
          value: 1434,
        },
        {
          label:
            'WZXX - Other Wrist and Hand Pain/ Injury not otherwise specified',
          value: 1424,
        },
        {
          label: 'WZZX - Wrist or hand pain undiagnosed',
          value: 1435,
        },
        {
          label: 'XALX - Lower limb osteoarthritis',
          value: 1207,
        },
        {
          label: 'XAUX - Upper limb osteoarthritis',
          value: 1208,
        },
        {
          label:
            'XAXX - Osteoarthritis Location Unspecified or Crossing Anatomical Boundaries (excl generalised OA see MROX)',
          value: 1209,
        },
        {
          label:
            'XBXX - Bone Bruising Location Unspecified or Crossing Anatomical Boundaries',
          value: 1480,
        },
        {
          label: 'XCXX - Chondral/ Osteochondral injury Location Unspecified',
          value: 1212,
        },
        {
          label: 'XDLX - Lower limb joint dislocation',
          value: 1179,
        },
        {
          label: 'XDUX - Upper limb joint dislocation',
          value: 1180,
        },
        {
          label: 'XDXX - Dislocation Location Unspecified',
          value: 1181,
        },
        {
          label: 'XFLX - Fracture lower limb',
          value: 1182,
        },
        {
          label: 'XFUX - Fracture upper limb',
          value: 1183,
        },
        {
          label:
            'XFXX - Fracture Location Unspecified or Crossing Anatomical Boundaries',
          value: 1184,
        },
        {
          label: 'XGLX - Lower limb synovitis/ impingement lesion',
          value: 1224,
        },
        {
          label: 'XGPX - Postural Syndrome',
          value: 1213,
        },
        {
          label: 'XGUX - Upper limb synovitis/ impingement lesion',
          value: 1225,
        },
        {
          label:
            'XGXX - Stress Fracture Location Unspecified or Crossing Anatomical Boundaries',
          value: 1185,
        },
        {
          label: 'XHLX - Soft tissue bruising lower limb',
          value: 1176,
        },
        {
          label: 'XHUX - Soft tissue bruising upper limb',
          value: 1177,
        },
        {
          label:
            'XHXX - Soft Tissue Bruising/ Haematoma Location Unspecified or Crossing Anatomical Boundaries',
          value: 1178,
        },
        {
          label: 'XJLX - Lower limb joint sprain',
          value: 1194,
        },
        {
          label: 'XJSX - Spinal joint sprain',
          value: 1195,
        },
        {
          label: 'XJUX - Upper limb joint sprain',
          value: 1196,
        },
        {
          label: 'XJXX - Sprain Location Unspecified',
          value: 1197,
        },
        {
          label: 'XKLX - Laceration/ abrasion lower limb',
          value: 1191,
        },
        {
          label: 'XKUX - Laceration/ abrasion upper limb',
          value: 1192,
        },
        {
          label:
            'XKXX - Laceration/ Abrasion Location Unspecified or Crossing Anatomical Boundaries',
          value: 1193,
        },
        {
          label: 'XMLX - Muscle strain lower limb',
          value: 1198,
        },
        {
          label: 'XMSX - Muscle strain spine',
          value: 1199,
        },
        {
          label: 'XMUX - Muscle strain upper limb',
          value: 1200,
        },
        {
          label:
            'XMXX - Muscle Strain/ Spasm/ Trigger Points Location Unspecified or Crossing Anatomical Boundaries',
          value: 1201,
        },
        {
          label: 'XMYX - Trigger points/ spasm multiple locations',
          value: 1202,
        },
        {
          label: 'XNLX - Lower limb neurological injury',
          value: 1203,
        },
        {
          label:
            'XNSX - Spinal injury location unspecified or crossing anatomical boundaries',
          value: 1204,
        },
        {
          label: 'XNUX - Upper limb neurological injury',
          value: 1205,
        },
        {
          label:
            'XNXX - Neurological lesion Location Unspecified or Crossing Anatomical Boundaries',
          value: 1206,
        },
        {
          label: 'XSLX - Lower limb stress fracture',
          value: 1186,
        },
        {
          label: 'XSUX - Upper limb stress fracture',
          value: 1187,
        },
        {
          label: 'XTLX - Tendon strain/ rupture lower limb',
          value: 1226,
        },
        {
          label: 'XTRX - Tendon strain/ rupture location unspecified',
          value: 1227,
        },
        {
          label: 'XTTX - Tendinopathy location unspecified',
          value: 1228,
        },
        {
          label: 'XTUX - Tendon strain/ rupture upper limb',
          value: 1229,
        },
        {
          label:
            'XTXX - Tendon Injury Location Unspecified or Crossing Anatomical Boundaries',
          value: 1230,
        },
        {
          label: 'XULX - Lower limb joint instability',
          value: 1188,
        },
        {
          label: 'XUUX - Upper limb joint instability',
          value: 1189,
        },
        {
          label: 'XUXX - Instability of Joint Location Unspecified',
          value: 1190,
        },
        {
          label: 'XVLX - Lower limb vascular injury',
          value: 1231,
        },
        {
          label: 'XVUX - Upper limb vascular injury',
          value: 1232,
        },
        {
          label:
            'XVXX - Vascular Injury Location Unspecified or Crossing Anatomical Boundaries',
          value: 1233,
        },
        {
          label: 'XX - General',
          value: 1728,
        },
        {
          label: 'XXXX - Injuries Location Unspecified/Crossing',
          value: 1214,
        },
        {
          label: 'YAAX - Post ankle arthroscopy and debridement',
          value: 5,
        },
        {
          label: 'YARX - Post ankle reconstruction +/- other proceedure',
          value: 6,
        },
        {
          label: 'YAXX - Post ankle surgery',
          value: 7,
        },
        {
          label: 'YEXX - Post Elbow Surgery',
          value: 255,
        },
        {
          label: 'YFHX - Post great toe surgery',
          value: 360,
        },
        {
          label: 'YFXX - Post foot surgery',
          value: 361,
        },
        {
          label: 'YGAX - Post hip arthroplasty',
          value: 567,
        },
        {
          label: 'YGGA - Post adductor tenotomy',
          value: 568,
        },
        {
          label: 'YGGH - Post hernia repain',
          value: 569,
        },
        {
          label: 'YGGM - Post mixed groin surgery',
          value: 570,
        },
        {
          label: 'YGGX - Post surgery for overuse groin injury',
          value: 571,
        },
        {
          label: 'YGSX - Post hip arthroscopy',
          value: 572,
        },
        {
          label: 'YGXX - Post Hip/ Groin Surgery',
          value: 573,
        },
        {
          label: 'YKAH - Post hemiarthroplasty knee',
          value: 711,
        },
        {
          label: 'YKAT - Post total arthroplasty knee',
          value: 712,
        },
        {
          label: 'YKAX - Post knee replacement surgery',
          value: 713,
        },
        {
          label: 'YKCC - Post chondral debridement',
          value: 714,
        },
        {
          label: 'YKCM - Post menisectomy',
          value: 715,
        },
        {
          label: 'YKCR - Post meniscal repair',
          value: 716,
        },
        {
          label: 'YKCT - Post cartilage transplant',
          value: 717,
        },
        {
          label: 'YKCX - Post cartilage surgery knee',
          value: 718,
        },
        {
          label: 'YKLA - Post ACL reconstruction',
          value: 719,
        },
        {
          label: 'YKLC - Post PCL reconstruction',
          value: 720,
        },
        {
          label: 'YKLX - Post knee reconstructive surgery',
          value: 721,
        },
        {
          label:
            'YKPX - Post Surgery for patellofemoral pain (incl debridement/ lat release/ realignment surgery/ patellectomy)',
          value: 722,
        },
        {
          label: 'YKQX - Complication post knee surgery - e.g. infection',
          value: 723,
        },
        {
          label: 'YKXX - Post knee Surgery',
          value: 724,
        },
        {
          label: 'YKZX - Post Other knee surgery',
          value: 725,
        },
        {
          label: 'YNXX - Post Neck Surgery',
          value: 945,
        },
        {
          label: 'YQAX - Post achilles tendon surgery',
          value: 814,
        },
        {
          label: 'YQFX - Post compartment release surgery',
          value: 815,
        },
        {
          label: 'YQXX - Post Lower leg surgery',
          value: 816,
        },
        {
          label: 'YSAX - Post AC joint surgery',
          value: 1024,
        },
        {
          label: 'YSRX - Post rotator cuff surgery',
          value: 1025,
        },
        {
          label: 'YSSA - Post arthroscopic shoulder stabilisation',
          value: 1026,
        },
        {
          label: 'YSSO - Post open shoulder stabilisation',
          value: 1027,
        },
        {
          label: 'YSSX - Post shoulder stabilisation',
          value: 1028,
        },
        {
          label: 'YSXX - Post Shoulder Surgery',
          value: 1029,
        },
        {
          label: 'YWCX - Post carpal tunnel release',
          value: 1436,
        },
        {
          label: 'YWHX - Post Hand/ Finger/ thumb surgery',
          value: 1437,
        },
        {
          label: 'YWWS - Post scapholunate stabilisation',
          value: 1438,
        },
        {
          label: 'YWWX - Post surgery on wrist joint',
          value: 1439,
        },
        {
          label: 'YWXX - Post Wrist/ Hand Surgery',
          value: 1440,
        },
        {
          label: 'YXXX - Post Surgical Patient',
          value: 1502,
        },
        {
          label: 'YZXX - Post surgery on other site not specifically mentioned',
          value: 1215,
        },
        {
          label: 'ZEAX - Exercise prescription for patient with arthritis',
          value: 1707,
        },
        {
          label:
            'ZECX - Exercise prescription for patient with cardiac disease',
          value: 1710,
        },
        {
          label:
            'ZEMX - Exercise prescription for patient with other medical disease',
          value: 1713,
        },
        {
          label:
            'ZEOJ - Exercise prescription for patient with juvenile obesity',
          value: 1709,
        },
        {
          label: 'ZEOX - Exercise prescription for patient with obesity',
          value: 1708,
        },
        {
          label:
            'ZERX - Exercise prescription for patient with respiratory disease',
          value: 1711,
        },
        {
          label:
            'ZEVX - Exercise prescription for patient with overtraining/ chronic fatigue',
          value: 1712,
        },
        {
          label: 'ZEXX - Exercise prescription',
          value: 1706,
        },
        {
          label:
            'ZOXX - Preparation for overseas travel - advice immunisations',
          value: 1722,
        },
        {
          label: 'ZPMX - Medical certificate',
          value: 1715,
        },
        {
          label: 'ZPPX - Prescription repeat',
          value: 1717,
        },
        {
          label: 'ZPRX - Referral',
          value: 1716,
        },
        {
          label: 'ZPXX - Paperwork',
          value: 1714,
        },
        {
          label: 'ZSDX - Dive medical',
          value: 1721,
        },
        {
          label: 'ZSMX - General medical screen',
          value: 1720,
        },
        {
          label: 'ZSPX - Preparticipation screen',
          value: 1719,
        },
        {
          label: 'ZSXX - Screening examination',
          value: 1718,
        },
        {
          label:
            'ZTXX - Advice on equiptment/ other aids e.g. appropriate footwear.',
          value: 1723,
        },
        {
          label:
            'ZXXX - Consultations Where There is No Presenting Illness Needing Treatment',
          value: 1705,
        },
      ],
      path: 'osics_pathology/id',
      deprecated: true,
    },
    {
      label: 'Other Event',
      operators: [
        {
          label: 'Is',
          value: 'eq',
        },
      ],
      options: [
        {
          label: 'Injury Occurred Prior to/Outside of NFL',
          value: 'prior',
        },
        {
          label: 'Not Club Football-Related',
          value: 'nonfootball',
        },
      ],
      path: 'other_event/value',
      deprecated: false,
    },
    {
      label: 'Pathology',
      operators: [
        {
          label: 'Any',
          value: 'any',
        },
      ],
      options: [
        {
          label: 'AAAX - Ankle joint osteoarthritis',
          value: 'AAAX',
        },
        {
          label: 'AASX - Subtalar joint arthritis',
          value: 'AASX',
        },
        {
          label: 'AAXX - Osteoarthritis of Ankle/ Subtalar Joint',
          value: 'AAXX',
        },
        {
          label: 'ACLX - Loose body ankle joint',
          value: 'ACLX',
        },
        {
          label: 'ACPX - Tibial plafond osteochondral lesion',
          value: 'ACPX',
        },
        {
          label: 'ACTX - Talar dome osteochondral injury',
          value: 'ACTX',
        },
        {
          label: 'ACXX - Ankle Osteochondral Injuries',
          value: 'ACXX',
        },
        {
          label: 'ADXX - Ankle Dislocation',
          value: 'ADXX',
        },
        {
          label: 'AFAB - Bimalleolar fracture',
          value: 'AFAB',
        },
        {
          label: 'AFAL - Fracture lateral malleolus',
          value: 'AFAL',
        },
        {
          label: 'AFAM - Fracture medial malleolus',
          value: 'AFAM',
        },
        {
          label: 'AFAP - Fracture posterior malleolus',
          value: 'AFAP',
        },
        {
          label: 'AFAS - Ankle fracture with diastasis of syndesmosis',
          value: 'AFAS',
        },
        {
          label: 'AFAT - Trimalleolar fracture',
          value: 'AFAT',
        },
        {
          label: 'AFAX - Fracture tibia and fibula at ankle joint',
          value: 'AFAX',
        },
        {
          label: 'AFCA - Fractured anterior process calcaneus',
          value: 'AFCA',
        },
        {
          label: 'AFCX - Fractured calcaneus',
          value: 'AFCX',
        },
        {
          label: 'AFTD - Fractured talar dome',
          value: 'AFTD',
        },
        {
          label: 'AFTL - Fractured lateral process talus',
          value: 'AFTL',
        },
        {
          label: 'AFTN - Fractured talar neck',
          value: 'AFTN',
        },
        {
          label: 'AFTO - Fractured os trigonum',
          value: 'AFTO',
        },
        {
          label: 'AFTP - Fractured posterior process talus',
          value: 'AFTP',
        },
        {
          label: 'AFTX - Fractured talus',
          value: 'AFTX',
        },
        {
          label: 'AFTZ - Fractured talus not otherwise specified',
          value: 'AFTZ',
        },
        {
          label: 'AFXX - Ankle Fracture',
          value: 'AFXX',
        },
        {
          label: 'AGAB - Anterior inpingement ankl d/t osteophytes',
          value: 'AGAB',
        },
        {
          label: 'AGAX - Anterior impingement ankle',
          value: 'AGAX',
        },
        {
          label: 'AGBC - Calcaneal bursitis (pump bump)',
          value: 'AGBC',
        },
        {
          label: 'AGBX - Busitis not otherwise specified',
          value: 'AGBX',
        },
        {
          label: 'AGPO - Ankle posterior impingement with os trigonum',
          value: 'AGPO',
        },
        {
          label: 'AGPS - Ankle posterior impingement post ankle sprain',
          value: 'AGPS',
        },
        {
          label: 'AGPX - Posterior impingement ankle',
          value: 'AGPX',
        },
        {
          label: 'AGPZ - Other posterior ankle impingement',
          value: 'AGPZ',
        },
        {
          label: 'AGSA - Ankle joint synovitis',
          value: 'AGSA',
        },
        {
          label: 'AGSS - Subtalar joint synovitis/ sinus tarsi syndrome',
          value: 'AGSS',
        },
        {
          label: 'AGSX - Synovitis of ankle and subtalar joint',
          value: 'AGSX',
        },
        {
          label: 'AGTX - Tarsal tunnel syndrome',
          value: 'AGTX',
        },
        {
          label: 'AGXX - Ankle Synovitis/ Impingement/ Bursitis',
          value: 'AGXX',
        },
        {
          label: 'AHHX - Heel bruising/ haematoma incl fat pad contusion',
          value: 'AHHX',
        },
        {
          label: 'AHXX - Ankle Soft Tissue Bruising/ Haematoma',
          value: 'AHXX',
        },
        {
          label: 'AJDX - Ankle deltoid ligament sprain',
          value: 'AJDX',
        },
        {
          label: 'AJLA - Anterior talofibular ligament sprain',
          value: 'AJLA',
        },
        {
          label: 'AJLC - Calcaneofibular ligament sprain',
          value: 'AJLC',
        },
        {
          label: 'AJLR - Lateral ligaments rupture (grade 3 injury)',
          value: 'AJLR',
        },
        {
          label: 'AJLX - Ankle lateral ligament sprain',
          value: 'AJLX',
        },
        {
          label: 'AJMX - Ankle multiple ligaments sprain',
          value: 'AJMX',
        },
        {
          label: 'AJSX - Ankle syndesmosis sprain',
          value: 'AJSX',
        },
        {
          label: 'AJXX - Ankle Sprains',
          value: 'AJXX',
        },
        {
          label: 'AKBX - Blisters heel',
          value: 'AKBX',
        },
        {
          label: 'AKDX - Deep (intraarticular) laceration ankle',
          value: 'AKDX',
        },
        {
          label: 'AKSX - Superficial ankle laceration/ abrasion',
          value: 'AKSX',
        },
        {
          label:
            'AKXQ - Complication of ankle laceration/ abrasion incl infection ',
          value: 'AKXQ',
        },
        {
          label: 'AKXX - Ankle Laceration/ Abrasion',
          value: 'AKXX',
        },
        {
          label: 'ANCM - Medial calcaneal nerve entrapment',
          value: 'ANCM',
        },
        {
          label: 'ANCX - Calcaneal nerve entrapment',
          value: 'ANCX',
        },
        {
          label: 'ANXX - Nerve Injury at Ankle',
          value: 'ANXX',
        },
        {
          label: 'ASCC - Fat pad contusion heel',
          value: 'ASCC',
        },
        {
          label: 'ASCF - Stress fracture calcaneus',
          value: 'ASCF',
        },
        {
          label: 'ASCX - Stress injury calcaneus',
          value: 'ASCX',
        },
        {
          label: 'ASFM - Lateral malleolar stress fracture',
          value: 'ASFM',
        },
        {
          label: 'ASFX - Stress fracture fibula at ankle',
          value: 'ASFX',
        },
        {
          label: 'ASLX - Stress fracture talus',
          value: 'ASLX',
        },
        {
          label: 'ASTM - Medial malleolar stress fracture',
          value: 'ASTM',
        },
        {
          label: 'ASTX - Stress fracture tibia at ankle',
          value: 'ASTX',
        },
        {
          label: 'ASXX - Ankle Stress Injuries/ Stress Fractures',
          value: 'ASXX',
        },
        {
          label: 'ATAB - Achilles enthesopathy with retrocalcaneal bursitis',
          value: 'ATAB',
        },
        {
          label: 'ATAE - Achilles enthesopathy',
          value: 'ATAE',
        },
        {
          label: 'ATAI - Insertional achilles tendon rupture',
          value: 'ATAI',
        },
        {
          label: 'ATAM - Midsubstance achilles tendon rupture',
          value: 'ATAM',
        },
        {
          label: 'ATAP - Achilles paratenonopathy',
          value: 'ATAP',
        },
        {
          label: 'ATAR - Achilles tendon rupture',
          value: 'ATAR',
        },
        {
          label: 'ATAS - Achilles tendon strain',
          value: 'ATAS',
        },
        {
          label: 'ATAT - Achilles tendinopathy',
          value: 'ATAT',
        },
        {
          label: 'ATAX - Achilles tendon injury',
          value: 'ATAX',
        },
        {
          label: 'ATEA - Tibialis anterior tenosynovitis',
          value: 'ATEA',
        },
        {
          label: 'ATEX - Extensor tendon injuries at ankle',
          value: 'ATEX',
        },
        {
          label: 'ATHI - FHL tenosynovitis',
          value: 'ATHI',
        },
        {
          label: 'ATHR - FHL rupture',
          value: 'ATHR',
        },
        {
          label: 'ATHS - FHL strain',
          value: 'ATHS',
        },
        {
          label: 'ATHT - FHL tendinopathy',
          value: 'ATHT',
        },
        {
          label: 'ATHX - Flexor hallucis tendon injury',
          value: 'ATHX',
        },
        {
          label: 'ATPR - Peroneal tendon rupture',
          value: 'ATPR',
        },
        {
          label: 'ATPS - Peroneal tendon strain',
          value: 'ATPS',
        },
        {
          label: 'ATPT - Peroneal tendinopathy',
          value: 'ATPT',
        },
        {
          label: 'ATPU - Peroneal tendon subluxation/ dislocation',
          value: 'ATPU',
        },
        {
          label: 'ATPX - Peroneal tendon injury',
          value: 'ATPX',
        },
        {
          label: 'ATTR - Tibialias posterior tendon rupture',
          value: 'ATTR',
        },
        {
          label: 'ATTS - Tibialis posterior strain',
          value: 'ATTS',
        },
        {
          label: 'ATTT - Tibialis posterior tendinopathy',
          value: 'ATTT',
        },
        {
          label: 'ATTX - Tibialis posterior injuries',
          value: 'ATTX',
        },
        {
          label: 'ATXX - Ankle Tendon Injury',
          value: 'ATXX',
        },
        {
          label: 'AULX - Chronic lateral instability',
          value: 'AULX',
        },
        {
          label: 'AUMX - Chronic medial instability',
          value: 'AUMX',
        },
        {
          label: 'AUXX - Chronic Ankle Instability',
          value: 'AUXX',
        },
        {
          label: 'AVXX - Vascular Injury Ankle',
          value: 'AVXX',
        },
        {
          label: 'AXXX - Other Lower Leg Pain/ Injury not otherwise specified',
          value: 'AXXX',
        },
        {
          label: 'AZCX - Chronic regional pain syndrome ankle',
          value: 'AZCX',
        },
        {
          label: 'AZXX - Ankle Pain/ Injury not otherwsie specified',
          value: 'AZXX',
        },
        {
          label: 'AZZP - Posterior ankle pain undiagnosed',
          value: 'AZZP',
        },
        {
          label: 'AZZX - Ankle pain undiagnosed',
          value: 'AZZX',
        },
        {
          label: 'BFCX - Fractured coccyx',
          value: 'BFCX',
        },
        {
          label: 'BFIX - Fractured ischium',
          value: 'BFIX',
        },
        {
          label: 'BFLX - Fractured Ilium',
          value: 'BFLX',
        },
        {
          label: 'BFMX - Multiple fractures pelvis and sacrum',
          value: 'BFMX',
        },
        {
          label: 'BFSX - Fractured sacrum',
          value: 'BFSX',
        },
        {
          label: 'BFXX - Pelvic fracture(s)',
          value: 'BFXX',
        },
        {
          label: 'BFZX - Other stress fracture pelvis',
          value: 'BFZX',
        },
        {
          label:
            'BGSX - Sacroiliac Joint Inflammation (excl Inflammatory arthritis SIJ - See MRXX)',
          value: 'BGSX',
        },
        {
          label:
            'BGTX - Trochanteric bursitis (excl that a/w glut tendinopathy - see BTGB)',
          value: 'BGTX',
        },
        {
          label: 'BGXX - Buttock and Pelvis Synovitis/ Bursitis',
          value: 'BGXX',
        },
        {
          label: 'BHBX - Buttock bruising/ haematoma',
          value: 'BHBX',
        },
        {
          label: 'BHIX - Bruising/ haematoma iliac crest/ glut medius',
          value: 'BHIX',
        },
        {
          label: 'BHSX - SIJ bruising/ haematoma',
          value: 'BHSX',
        },
        {
          label: 'BHXX - Pelvis/ Buttock Soft Tissue Bruising/ Haematoma',
          value: 'BHXX',
        },
        {
          label: 'BHZX - Bruising buttock/ pelvis not otherwise specified',
          value: 'BHZX',
        },
        {
          label: 'BJCX - Sacrococcygeal joint injury/ pain',
          value: 'BJCX',
        },
        {
          label: 'BJSX - Sacroiliac joint sprain',
          value: 'BJSX',
        },
        {
          label: 'BJXX - Sacroiliac Joint Injury',
          value: 'BJXX',
        },
        {
          label:
            'BKXQ - Complication of pelvis/buttock laceration/ abrasion incl infection',
          value: 'BKXQ',
        },
        {
          label: 'BKXX - Pelvic/ Buttock Laceration/ Abrasion',
          value: 'BKXX',
        },
        {
          label: 'BMGA - Gluteus maximus strain',
          value: 'BMGA',
        },
        {
          label: 'BMGB - Gluteus medius/ minimus strain',
          value: 'BMGB',
        },
        {
          label: 'BMGP - Piriformis muscle strain',
          value: 'BMGP',
        },
        {
          label: 'BMGX - Buttock muscle strain',
          value: 'BMGX',
        },
        {
          label: 'BMXX - Pelvic/ Buttock Muscle Strain/ Spasm/ Trigger Points',
          value: 'BMXX',
        },
        {
          label: 'BMYA - Glut Max trigger points',
          value: 'BMYA',
        },
        {
          label: 'BMYB - Glut Med/ Min trigger points',
          value: 'BMYB',
        },
        {
          label: 'BMYM - Multiple buttock muscle trigger points',
          value: 'BMYM',
        },
        {
          label: 'BMYP - Piriformis trigger points',
          value: 'BMYP',
        },
        {
          label: 'BMYX - Buttock trigger points',
          value: 'BMYX',
        },
        {
          label: 'BMYZ - Other gluteal muslce trigger points',
          value: 'BMYZ',
        },
        {
          label: 'BNPX - Piriformis syndrome/ sciatic nerve entrapment',
          value: 'BNPX',
        },
        {
          label: 'BNXX - Buttock/ Pelvic Nerve Injury',
          value: 'BNXX',
        },
        {
          label: 'BSCX - Stress fracture coccyx',
          value: 'BSCX',
        },
        {
          label: 'BSIX - Stress fracture ischium',
          value: 'BSIX',
        },
        {
          label: 'BSLX - Stress fracture ilium',
          value: 'BSLX',
        },
        {
          label: 'BSSX - Stress fracture sacrum',
          value: 'BSSX',
        },
        {
          label: 'BSXX - Pelvic Stress Fracture(s)',
          value: 'BSXX',
        },
        {
          label: 'BTAT - Gluteus maximus tendinopathy',
          value: 'BTAT',
        },
        {
          label: 'BTAX - Gluteus maximus tendon Injury',
          value: 'BTAX',
        },
        {
          label:
            'BTGB - Gluteus med/ min tendinopathy with trochanteric bursitis',
          value: 'BTGB',
        },
        {
          label: 'BTGR - Gluteus med/ min tendon rupture',
          value: 'BTGR',
        },
        {
          label: 'BTGT - Gluteus med/ min tendinopathy',
          value: 'BTGT',
        },
        {
          label: 'BTGX - Gluteus med/ min tendon injury',
          value: 'BTGX',
        },
        {
          label: 'BTHB - Hamstring tendinopathy with ischial bursitis',
          value: 'BTHB',
        },
        {
          label:
            'BTHR - Hamstring origin tendon rupture (excl growth plate fracture - see JBFI)',
          value: 'BTHR',
        },
        {
          label: 'BTHT - Hamstring origin tendinopathy',
          value: 'BTHT',
        },
        {
          label: 'BTHX - Hamstring tendon injury',
          value: 'BTHX',
        },
        {
          label: 'BTPT - Piriformis tendinopathy',
          value: 'BTPT',
        },
        {
          label: 'BTPX - Piriformis tendon injury',
          value: 'BTPX',
        },
        {
          label: 'BTXX - Buttock/ Pelvis Tendon Injury',
          value: 'BTXX',
        },
        {
          label: 'BUXX - Sacroiliac Joint Instability',
          value: 'BUXX',
        },
        {
          label: 'BXXX - Lumbar Pain/ Injury nor otherwise specified',
          value: 'BXXX',
        },
        {
          label: 'BZXX - Pelvic/ Buttock Pain not otherwise specified',
          value: 'BZXX',
        },
        {
          label: 'BZZX - Buttock pain undiagnosed',
          value: 'BZZX',
        },
        {
          label: 'CDCX - Costochondral joint dislocation',
          value: 'CDCX',
        },
        {
          label: 'CDSP - Posterior sternoclavicular joint dislocation',
          value: 'CDSP',
        },
        {
          label: 'CDSX - Sternoclavicular joint dislocation',
          value: 'CDSX',
        },
        {
          label: 'CDXX - Chest Dislocations',
          value: 'CDXX',
        },
        {
          label: 'CFRA - Fracture upper rib (1- 4)',
          value: 'CFRA',
        },
        {
          label: 'CFRB - Fracture Middle rib (5 - 9)',
          value: 'CFRB',
        },
        {
          label: 'CFRC - Fracture lower rib (10 - 12)',
          value: 'CFRC',
        },
        {
          label: 'CFRM - Fracture multiple ribs',
          value: 'CFRM',
        },
        {
          label: 'CFRQ - Complication of rib fracture - incl pneumothorax',
          value: 'CFRQ',
        },
        {
          label: 'CFRX - Rib Fracture(s)',
          value: 'CFRX',
        },
        {
          label: 'CFSX - Sternal fracture',
          value: 'CFSX',
        },
        {
          label: 'CFXX - Chest Fracture(s)',
          value: 'CFXX',
        },
        {
          label: 'CGCX - Costochondritis',
          value: 'CGCX',
        },
        {
          label: 'CGSX - Synovitis of Sternoclavicular joint',
          value: 'CGSX',
        },
        {
          label: 'CGXX - Synovitis of Chest Joint',
          value: 'CGXX',
        },
        {
          label:
            'CGZX - Inflammation of other chest joint not otherwise specified',
          value: 'CGZX',
        },
        {
          label: 'CHLX - Lung Bruising/ Haemotoma',
          value: 'CHLX',
        },
        {
          label: 'CHRX - Bruised rib(s)/ chest wall',
          value: 'CHRX',
        },
        {
          label: 'CHSX - Bruised sternum',
          value: 'CHSX',
        },
        {
          label: 'CHXX - Chest Wall Soft Tissue Bruising/ Haematoma',
          value: 'CHXX',
        },
        {
          label: 'CJCX - Sternocostal/ Costochondral joint sprains',
          value: 'CJCX',
        },
        {
          label: 'CJSA - Anterior Sternoclavicular joint sprain',
          value: 'CJSA',
        },
        {
          label: 'CJSP - Posterior sternoclavicular joint sprain',
          value: 'CJSP',
        },
        {
          label: 'CJSX - Sternoclavicular joint sprains',
          value: 'CJSX',
        },
        {
          label: 'CJVX - Costovertebral joint sprains',
          value: 'CJVX',
        },
        {
          label: 'CJXX - Chest Joint Sprains',
          value: 'CJXX',
        },
        {
          label:
            'CKXQ - Complication of chest wall laceration / abrasion incl infection, perforation to chest cavity',
          value: 'CKXQ',
        },
        {
          label: 'CKXX - Chest Wall laceration/ Abrasion',
          value: 'CKXX',
        },
        {
          label: 'CMTX - Intercostal tendinopathy',
          value: 'CMTX',
        },
        {
          label: 'CMXX - Chest Muscle or Tendon strain/ spasm/ trigger points',
          value: 'CMXX',
        },
        {
          label: 'CMYX - Chest muscle trigger points',
          value: 'CMYX',
        },
        {
          label: 'COPH - Haemothorax',
          value: 'COPH',
        },
        {
          label: 'COPP - Pneumothorax',
          value: 'COPP',
        },
        {
          label:
            'COPX - Lung Injury (excl injury due to laceration (CKXQ) or rib fracture (CFRQ))',
          value: 'COPX',
        },
        {
          label: 'COXX - Chest Cavity Injury',
          value: 'COXX',
        },
        {
          label: 'CRCX - Fracture of costochondral margin',
          value: 'CRCX',
        },
        {
          label: 'CSXX - Rib Stress Fracture(s)',
          value: 'CSXX',
        },
        {
          label: 'CUCX - Costochondral joint instability',
          value: 'CUCX',
        },
        {
          label: 'CUSX - Sternoclavicular joint instability',
          value: 'CUSX',
        },
        {
          label: 'CUVX - Costovertebral joint instability',
          value: 'CUVX',
        },
        {
          label: 'CUXX - Chest Joint Instability',
          value: 'CUXX',
        },
        {
          label:
            'CXXX - Other Wrist and Hand Pain/ Injury not otherwise specified',
          value: 'CXXX',
        },
        {
          label: 'CZXX - Chest Pain/ Injury Not elsewhere specified',
          value: 'CZXX',
        },
        {
          label: 'CZZX - Chest pain undiagnosed',
          value: 'CZZX',
        },
        {
          label: 'DAFX - Facet joint OA thoracic spine',
          value: 'DAFX',
        },
        {
          label: 'DAXX - Thoracic spine Osteoarthritis',
          value: 'DAXX',
        },
        {
          label: 'DCXX - Thoracic Disc Injury',
          value: 'DCXX',
        },
        {
          label:
            'DFPX - Fracture transverse or posterior process thoracic spine',
          value: 'DFPX',
        },
        {
          label: 'DFVX - Fracture thoracic vertebral body',
          value: 'DFVX',
        },
        {
          label: 'DFXX - Thoracic Spine Fracture',
          value: 'DFXX',
        },
        {
          label: 'DGXX - Thoracic Postural Syndrome',
          value: 'DGXX',
        },
        {
          label: 'DHXX - Thoracic Soft Tissue Bruising/ Haematoma',
          value: 'DHXX',
        },
        {
          label: 'DJFX - Thoracic facet joint sprain',
          value: 'DJFX',
        },
        {
          label:
            'DJPX - Thoracic facet joint pain/ chronic inflammation/ stiffness',
          value: 'DJPX',
        },
        {
          label: 'DJXX - Thoracic spine Joint Injury',
          value: 'DJXX',
        },
        {
          label:
            'DKXQ - Complication of thoracic laceration/ abrasion including infection',
          value: 'DKXQ',
        },
        {
          label: 'DKXX - Thoracic Laceration/ Abrasion',
          value: 'DKXX',
        },
        {
          label: 'DMEX - Thoracic extensor muscle strain',
          value: 'DMEX',
        },
        {
          label:
            'DMXX - Thoracic Muscle and Tendon Strain/ Spasm/ Trigger Points',
          value: 'DMXX',
        },
        {
          label: 'DMYX - Thoracic muscle trigger points',
          value: 'DMYX',
        },
        {
          label: 'DXXX - Abdominal pain not otherwise specified',
          value: 'DXXX',
        },
        {
          label: 'DZXX - Thoracic Pain/ Injury not otherwise specified',
          value: 'DZXX',
        },
        {
          label: 'DZZX - Thoracic pain undiagnosed',
          value: 'DZZX',
        },
        {
          label: 'EAXX - Elbow Osteoarthritis',
          value: 'EAXX',
        },
        {
          label: 'ECLX - Loose Body in Elbow',
          value: 'ECLX',
        },
        {
          label: 'ECXX - Elbow Osteochondral Injury ',
          value: 'ECXX',
        },
        {
          label: 'EDAX - Anterion elbow dislocation',
          value: 'EDAX',
        },
        {
          label: 'EDPX - Posterior elbow dislocation',
          value: 'EDPX',
        },
        {
          label: 'EDRX - Dislocated radial head',
          value: 'EDRX',
        },
        {
          label: 'EDXX - Elbow Dislocation',
          value: 'EDXX',
        },
        {
          label: 'EFHA - Avulsion fracture distal humerus',
          value: 'EFHA',
        },
        {
          label: 'EFHC - Fractured humeral condyle(s)',
          value: 'EFHC',
        },
        {
          label: 'EFHS - Supracondylar humeral fracture',
          value: 'EFHS',
        },
        {
          label: 'EFHX - Fractured distal humerus',
          value: 'EFHX',
        },
        {
          label: 'EFRA - Avulsion fracture distal radius',
          value: 'EFRA',
        },
        {
          label: 'EFRH - Fractured radial head',
          value: 'EFRH',
        },
        {
          label: 'EFRX - Fractured distal radius',
          value: 'EFRX',
        },
        {
          label: 'EFUA - Avulsion fracture distal ulna',
          value: 'EFUA',
        },
        {
          label: 'EFUO - Fractured olecranon',
          value: 'EFUO',
        },
        {
          label: 'EFUX - Fractured proximal ulna',
          value: 'EFUX',
        },
        {
          label:
            'EFXA - Avulsion fracture elbow multiple locations or location unspecified',
          value: 'EFXA',
        },
        {
          label: 'EFXX - Elbow Fractures',
          value: 'EFXX',
        },
        {
          label: 'EGBX - Elbow olecranon bursitis',
          value: 'EGBX',
        },
        {
          label: 'EGPX - Elbow posterior impingement/ synovitis',
          value: 'EGPX',
        },
        {
          label: 'EGXX - Elbow Impingement/ Synovitis',
          value: 'EGXX',
        },
        {
          label: 'EHXX - Elbow Soft Tissue Bruising/ Haematoma',
          value: 'EHXX',
        },
        {
          label:
            'EJHX - Elbow hyperextension +/- strain anterior elbow structures',
          value: 'EJHX',
        },
        {
          label: 'EJMC - Elbow medial ligament injury and CFO tear',
          value: 'EJMC',
        },
        {
          label: 'EJMR - Elbow medial lgament rupture/ grade 3 tear',
          value: 'EJMR',
        },
        {
          label: 'EJMX - Elbow medial ligament injury',
          value: 'EJMX',
        },
        {
          label: 'EJXX - Elbow Joint Sprain',
          value: 'EJXX',
        },
        {
          label: 'EJZX - Other elbow strain not otherwise specified',
          value: 'EJZX',
        },
        {
          label: 'EKDX - Elbow Laceration deep - intraarticular',
          value: 'EKDX',
        },
        {
          label: 'EKSX - Elbow Laceration/ abrasion superficial',
          value: 'EKSX',
        },
        {
          label: 'EKXQ - Complication of elbow laceration including infection',
          value: 'EKXQ',
        },
        {
          label: 'EKXX - Elbow Laceration/ Abrasion',
          value: 'EKXX',
        },
        {
          label: 'EMXX - Elbow Muscle Strain/ Spasm/ Trigger Points',
          value: 'EMXX',
        },
        {
          label: 'ENUX - Ulnar nerve injury at elbow',
          value: 'ENUX',
        },
        {
          label: 'ENXX - Elbow Neurological Injury/ Entrapment',
          value: 'ENXX',
        },
        {
          label: 'ESXX - Elbow Stress/ Overuse Injuries incl Stress Fractures',
          value: 'ESXX',
        },
        {
          label: 'ETBR - Distal biceps tendon rupture',
          value: 'ETBR',
        },
        {
          label: 'ETBS - Distal biceps tendon strain',
          value: 'ETBS',
        },
        {
          label: 'ETBT - Distal biceps tendinopathy',
          value: 'ETBT',
        },
        {
          label: 'ETBX - Distal biceps tendon injury',
          value: 'ETBX',
        },
        {
          label: 'ETES - Common extensor origin strain/ rupture',
          value: 'ETES',
        },
        {
          label:
            'ETET - Common extensor origin tendinopathy (incl tennis elbow)',
          value: 'ETET',
        },
        {
          label: 'ETEX - Common extensor origin injury',
          value: 'ETEX',
        },
        {
          label: 'ETFS - Common flexor origin strain/ rupture',
          value: 'ETFS',
        },
        {
          label: 'ETFT - Common flexor origin tendinopathy',
          value: 'ETFT',
        },
        {
          label: 'ETFX - Common flexor origin injury',
          value: 'ETFX',
        },
        {
          label: 'ETTR - Distal triceps tendon rupture',
          value: 'ETTR',
        },
        {
          label: 'ETTS - Distal triceps tendon strain',
          value: 'ETTS',
        },
        {
          label: 'ETTT - Distal triceps tendinopathy',
          value: 'ETTT',
        },
        {
          label: 'ETTX - Distal triceps tendon injury',
          value: 'ETTX',
        },
        {
          label: 'ETXX - Elbow Tendon Injury',
          value: 'ETXX',
        },
        {
          label: 'EUMX - Elbow valgus instability',
          value: 'EUMX',
        },
        {
          label: 'EUPX - Elbow posterolateral instability',
          value: 'EUPX',
        },
        {
          label: 'EUXX - Elbow Instability',
          value: 'EUXX',
        },
        {
          label: 'EXXX - Elbow Injuries',
          value: 'EXXX',
        },
        {
          label: 'EZXX - Elbow Pain/ Injury not otherwise specified',
          value: 'EZXX',
        },
        {
          label: 'FAHB - Bunion of great toe MTP joint',
          value: 'FAHB',
        },
        {
          label: 'FAHR - Hallux rigidus',
          value: 'FAHR',
        },
        {
          label: 'FAHX - Arthritis MTP joint great toe',
          value: 'FAHX',
        },
        {
          label: 'FAMX - Arthritis of midfoot',
          value: 'FAMX',
        },
        {
          label: 'FAPB - Bunion 5th MTP joint',
          value: 'FAPB',
        },
        {
          label: 'FAPC - Claw toes',
          value: 'FAPC',
        },
        {
          label: 'FAPH - Hammer toes',
          value: 'FAPH',
        },
        {
          label: 'FAPX - Arthritis of lesser toes',
          value: 'FAPX',
        },
        {
          label: 'FAXX - Foot Osteoarthritis',
          value: 'FAXX',
        },
        {
          label: 'FCXX - Foot Chondral/ Osteochondral Lesion',
          value: 'FCXX',
        },
        {
          label: 'FDHX - Dislocation of great toe MTP jt',
          value: 'FDHX',
        },
        {
          label: 'FDMX - Dislocation of lesser toe MTP joint',
          value: 'FDMX',
        },
        {
          label: 'FDPX - Dislocation of IP joint of lesser toe',
          value: 'FDPX',
        },
        {
          label: 'FDTX - Dislocation of midfoot through TMT joints',
          value: 'FDTX',
        },
        {
          label: 'FDXX - Foot Dislocation',
          value: 'FDXX',
        },
        {
          label: 'FFHD - Fracture great toe distal phalanx',
          value: 'FFHD',
        },
        {
          label: 'FFHP - Fracture great toe proximal phalanx',
          value: 'FFHP',
        },
        {
          label: 'FFHX - Fracture great toe',
          value: 'FFHX',
        },
        {
          label: 'FFMA - Fracture 1st Metatarsal',
          value: 'FFMA',
        },
        {
          label: 'FFMB - Fracture 2nd Metatarsal',
          value: 'FFMB',
        },
        {
          label: 'FFMC - Fracture 3rd metatarsal',
          value: 'FFMC',
        },
        {
          label: 'FFMD - Fracture 4th metatarsal',
          value: 'FFMD',
        },
        {
          label: 'FFME - Fracture 5th metatarsal shaft',
          value: 'FFME',
        },
        {
          label: 'FFMM - Fracture two or more metatarsals',
          value: 'FFMM',
        },
        {
          label: 'FFMV - Avulsion fracture 5th metatarsal base',
          value: 'FFMV',
        },
        {
          label: 'FFMX - Fracture Metatarsal(s)',
          value: 'FFMX',
        },
        {
          label: 'FFPX - Fracture lesser toes (2 - 5)',
          value: 'FFPX',
        },
        {
          label: 'FFQX - Complication of fractured foot including non union',
          value: 'FFQX',
        },
        {
          label: 'FFTB - Fracture cuboid',
          value: 'FFTB',
        },
        {
          label: 'FFTC - Fracture cuneiform',
          value: 'FFTC',
        },
        {
          label: 'FFTN - Fracture navicular',
          value: 'FFTN',
        },
        {
          label: 'FFTX - Fracture tarsal bone',
          value: 'FFTX',
        },
        {
          label: 'FFXX - Foot Fractures',
          value: 'FFXX',
        },
        {
          label: 'FGCX - Cuboid Syndrome',
          value: 'FGCX',
        },
        {
          label: 'FGMX - Synovitis of MTP joint(s)',
          value: 'FGMX',
        },
        {
          label: 'FGSX - Synovitis of midfoot joints',
          value: 'FGSX',
        },
        {
          label: 'FGXX - Synovitis/ Impingement/ Biomechanical Lesion of Foot',
          value: 'FGXX',
        },
        {
          label: 'FHHU - Nail bed haematoma great toe',
          value: 'FHHU',
        },
        {
          label: 'FHHX - Haematoma great toe',
          value: 'FHHX',
        },
        {
          label: 'FHPU - Nail bed haematoma lesser toes',
          value: 'FHPU',
        },
        {
          label: 'FHPX - Haematoma lesser toes',
          value: 'FHPX',
        },
        {
          label: 'FHXX - Foot Soft Tissue Bruising/ Haematoma',
          value: 'FHXX',
        },
        {
          label:
            'FHZX - Other foot soft tissue bruising/ haematoma not elsewhere specified',
          value: 'FHZX',
        },
        {
          label: 'FJBX - Bifurcate ligament sprain in foot',
          value: 'FJBX',
        },
        {
          label:
            'FJFX - Forefoot joint sprain (ie MTP and IP joints lesser toes)',
          value: 'FJFX',
        },
        {
          label: 'FJHM - Sprain of 1st MTP joint/ turf toe',
          value: 'FJHM',
        },
        {
          label: 'FJHP - Sprain IP ligament(s) great toe',
          value: 'FJHP',
        },
        {
          label: 'FJHR - Sprain 1st MTP jt with volar plate rupture',
          value: 'FJHR',
        },
        {
          label: 'FJHX - Sprain of great toe',
          value: 'FJHX',
        },
        {
          label: 'FJMX - Midfoot joint/ ligament sprain',
          value: 'FJMX',
        },
        {
          label: 'FJPD - Mid/ distal plantar fasciitis',
          value: 'FJPD',
        },
        {
          label: 'FJPR - Plantar fascia rupture',
          value: 'FJPR',
        },
        {
          label: 'FJPX - Plantar fasciitis strain',
          value: 'FJPX',
        },
        {
          label: 'FJSX - Spring ligament sprain in foot',
          value: 'FJSX',
        },
        {
          label: 'FJXX - Foot Joint Sprain',
          value: 'FJXX',
        },
        {
          label: 'FKBX - Blisters foot',
          value: 'FKBX',
        },
        {
          label: 'FKCX - Callous on foot',
          value: 'FKCX',
        },
        {
          label: 'FKUX - Ulceration foot',
          value: 'FKUX',
        },
        {
          label:
            'FKXQ - Complication of foot laceration/ abrasion incl infection',
          value: 'FKXQ',
        },
        {
          label: 'FKXX - Foot Laceration/ Abrasion',
          value: 'FKXX',
        },
        {
          label: 'FMXX - Foot Muscle Strain/ Spasm/ trigger Points',
          value: 'FMXX',
        },
        {
          label: 'FMYX - Foot muscle trigger points, cramping, spasm',
          value: 'FMYX',
        },
        {
          label: "FNMX - Morton's neuroma",
          value: 'FNMX',
        },
        {
          label: 'FNXX - Foot Neurological Injury',
          value: 'FNXX',
        },
        {
          label: 'FSBX - Cuboid stress fracture',
          value: 'FSBX',
        },
        {
          label: 'FSCX - Cuneiform stress fracture',
          value: 'FSCX',
        },
        {
          label: 'FSMA - First metatarsal stress fracture',
          value: 'FSMA',
        },
        {
          label: 'FSMB - Second metatarsal stress fracture',
          value: 'FSMB',
        },
        {
          label: 'FSMC - Third metatarsal stress fracture',
          value: 'FSMC',
        },
        {
          label: 'FSMD - Fourth metatarsal stress fracture',
          value: 'FSMD',
        },
        {
          label: 'FSME - Fifth metatarsal stress fracture',
          value: 'FSME',
        },
        {
          label: 'FSMP - Base second metatarsal stress fracture',
          value: 'FSMP',
        },
        {
          label: 'FSMR - Stress rxn metatarsal/ metatarsalgia',
          value: 'FSMR',
        },
        {
          label: 'FSMX - Metatarsal stress fracture',
          value: 'FSMX',
        },
        {
          label: 'FSMZ - Other metatarsal stress fracture',
          value: 'FSMZ',
        },
        {
          label: 'FSNN - Non union navicular stress fracture',
          value: 'FSNN',
        },
        {
          label: 'FSNX - Navicular stress fracture',
          value: 'FSNX',
        },
        {
          label: 'FSSA - AVN Sesamoid',
          value: 'FSSA',
        },
        {
          label: 'FSSF - Sesamoid stress fracture',
          value: 'FSSF',
        },
        {
          label: 'FSSS - Sesamoiditis/ stress fracture',
          value: 'FSSS',
        },
        {
          label: 'FSSX - Sesamoid stress injury',
          value: 'FSSX',
        },
        {
          label: 'FSXX - Stress Reactions/ Fractures in Foot',
          value: 'FSXX',
        },
        {
          label: 'FTET - Extensor tendinopathy in foot',
          value: 'FTET',
        },
        {
          label: 'FTEX - Extensor tendon injury in foot',
          value: 'FTEX',
        },
        {
          label: 'FTTI - Tibialis posterior insertional tendinopathy',
          value: 'FTTI',
        },
        {
          label: 'FTTX - Tibialis posterior tendon injury in foot',
          value: 'FTTX',
        },
        {
          label: 'FTXX - Foot Tendon Injuries',
          value: 'FTXX',
        },
        {
          label: 'FVXX - Foot Vascular Injuries',
          value: 'FVXX',
        },
        {
          label: 'FXXX - Ankle Pain/ Injury not otherwsie specified',
          value: 'FXXX',
        },
        {
          label: 'FZCX - Chronic regional pain syndrome foot',
          value: 'FZCX',
        },
        {
          label: 'FZXX - Foot Pain/ Injury Not otherwise specified',
          value: 'FZXX',
        },
        {
          label: 'FZZX - Foot pain Undiagnosed',
          value: 'FZZX',
        },
        {
          label: 'GAHX - Osteoarthritis Hip Joint',
          value: 'GAHX',
        },
        {
          label: 'GAXX - Hip/ Groin Arthritis',
          value: 'GAXX',
        },
        {
          label: 'GCCX - Hip joint chondral lesion',
          value: 'GCCX',
        },
        {
          label: 'GCVX - Inflammation/ stiffness of costovertebral joints',
          value: 'GCVX',
        },
        {
          label: 'GCXX - Hip Joint Chondral/ Osteochondral Injury',
          value: 'GCXX',
        },
        {
          label: 'GDXX - Hip Joint Dislocation',
          value: 'GDXX',
        },
        {
          label: 'GFAX - Acetabular fracture',
          value: 'GFAX',
        },
        {
          label: 'GFFN - Fractured neck of femur',
          value: 'GFFN',
        },
        {
          label: 'GFFX - Femoral fracture',
          value: 'GFFX',
        },
        {
          label: 'GFPI - Fracture inferior pubic ramus',
          value: 'GFPI',
        },
        {
          label: 'GFPS - Fracture superior pubic ramus',
          value: 'GFPS',
        },
        {
          label: 'GFPX - Fracture pubic ramus',
          value: 'GFPX',
        },
        {
          label: 'GFXX - Hip/ Groin Fractures',
          value: 'GFXX',
        },
        {
          label:
            'GGCX - Clicking hip (excl click d/t labral tear - GJLX, or psoas tendon - GMYS)',
          value: 'GGCX',
        },
        {
          label: 'GGFX - Femoral Acetabular Impingment of hip joint',
          value: 'GGFX',
        },
        {
          label: 'GGSX - Synovitis of hip joint',
          value: 'GGSX',
        },
        {
          label:
            'GGXX - Hip Joint Inflammation/ Synovitis/ Other Biomechanical Lesion',
          value: 'GGXX',
        },
        {
          label: 'GHLX - Labial bruising/ haematoma',
          value: 'GHLX',
        },
        {
          label: 'GHSX - Scrotal/ testicular bruising/ haematoma',
          value: 'GHSX',
        },
        {
          label: 'GHXX - Hip and Groin Soft Tissue Bruising/ Haematoma',
          value: 'GHXX',
        },
        {
          label: 'GHZX - Other hip/groin bruising/ haematoma',
          value: 'GHZX',
        },
        {
          label: 'GJLX - Hip joint labral tear',
          value: 'GJLX',
        },
        {
          label: 'GJXX - Hip Joint Sprain',
          value: 'GJXX',
        },
        {
          label:
            'GKXQ - Complication of laceration/ abrasion including infection',
          value: 'GKXQ',
        },
        {
          label: 'GKXX - Hip and Groin Laceration/ Abrasion',
          value: 'GKXX',
        },
        {
          label: 'GMFI - Iliopsoas muscle strain/ tear',
          value: 'GMFI',
        },
        {
          label: 'GMFP - Psoas muscle strain/ tear',
          value: 'GMFP',
        },
        {
          label: 'GMFX - Hip flexor muscle strain/ tear',
          value: 'GMFX',
        },
        {
          label: 'GMXX - Hip and Groin Muscle Strain/ Tear',
          value: 'GMXX',
        },
        {
          label: 'GMYP - Trigger points illiopsoas',
          value: 'GMYP',
        },
        {
          label: 'GMYS - Snapping psoas tendon',
          value: 'GMYS',
        },
        {
          label: 'GMYX - Hip and groin muscle spasm/ trigger points',
          value: 'GMYX',
        },
        {
          label: 'GNEG - Genitofemoral nerve entrapment',
          value: 'GNEG',
        },
        {
          label: 'GNEI - Ilioinguinal nerve entrapment',
          value: 'GNEI',
        },
        {
          label: 'GNEO - Obturator nerve entrapment',
          value: 'GNEO',
        },
        {
          label: 'GNEX - Nerve Entrapment Groin',
          value: 'GNEX',
        },
        {
          label: 'GNVA - Avascular necrosis femoral head',
          value: 'GNVA',
        },
        {
          label: 'GNVX - Vascular Injury Hip Joint',
          value: 'GNVX',
        },
        {
          label: 'GNXX - Groin Neurovascular Injuries',
          value: 'GNXX',
        },
        {
          label: 'GOPR - ruptured penis/ urethra',
          value: 'GOPR',
        },
        {
          label: 'GOPX - Penile injury',
          value: 'GOPX',
        },
        {
          label: 'GOSR - Testicular rupture',
          value: 'GOSR',
        },
        {
          label: 'GOSX - Scrotal +/- testicular injury',
          value: 'GOSX',
        },
        {
          label: 'GOXX - Groin Organ Damage',
          value: 'GOXX',
        },
        {
          label: 'GSFB - Stress fracture through femoral neck (both cortices)',
          value: 'GSFB',
        },
        {
          label: 'GSFI - Stress fracture inferior cortex femoral neck',
          value: 'GSFI',
        },
        {
          label: 'GSFS - Stress fracture superior cortex femoral neck',
          value: 'GSFS',
        },
        {
          label: 'GSFX - Femoral neck stress fracture',
          value: 'GSFX',
        },
        {
          label: 'GSPI - Stress fracture inferior pubic ramus',
          value: 'GSPI',
        },
        {
          label: 'GSPS - Stress fracture superior pubic ramus',
          value: 'GSPS',
        },
        {
          label: 'GSPX - Pelvic stress fracture',
          value: 'GSPX',
        },
        {
          label: 'GSXX - Hip/ Groin Stress Fracture',
          value: 'GSXX',
        },
        {
          label: 'GTAR - Abdominal tendon insertion rupture',
          value: 'GTAR',
        },
        {
          label: 'GTAS - Abdominal tendon insertion strain',
          value: 'GTAS',
        },
        {
          label: 'GTAT - Abdominal tendon insertion tendinopathy',
          value: 'GTAT',
        },
        {
          label: 'GTAX - Abdominal tendon insertion injury',
          value: 'GTAX',
        },
        {
          label: 'GTDR - Unspecified or multiple adductor tendon rupture',
          value: 'GTDR',
        },
        {
          label: 'GTDS - Unspecified or multiple adductor tendon strain',
          value: 'GTDS',
        },
        {
          label: 'GTDT - Unspecified or multiple adductor tendinopathy',
          value: 'GTDT',
        },
        {
          label: 'GTDX - Unspecified or multiple adductor tendon injury',
          value: 'GTDX',
        },
        {
          label: 'GTFB - Iliopsoas tendinopathy with bursitis',
          value: 'GTFB',
        },
        {
          label: 'GTFR - Iliopsoas tendon rupture',
          value: 'GTFR',
        },
        {
          label: 'GTFS - Iliopsoas tendon strain',
          value: 'GTFS',
        },
        {
          label: 'GTFT - Iliopsoas tendinopathy',
          value: 'GTFT',
        },
        {
          label: 'GTFX - Iliopsoas tendon injury',
          value: 'GTFX',
        },
        {
          label: 'GTHD - Direct inguinal hernia',
          value: 'GTHD',
        },
        {
          label: 'GTHF - Femoral hernia',
          value: 'GTHF',
        },
        {
          label: 'GTHI - Indirect inguinal hernia',
          value: 'GTHI',
        },
        {
          label: "GTHS - Sportsman's hernia",
          value: 'GTHS',
        },
        {
          label: 'GTHX - Groin hernias',
          value: 'GTHX',
        },
        {
          label: 'GTLR - Adductor longus tendon rupture',
          value: 'GTLR',
        },
        {
          label: 'GTLS - Adductor longus tendon strain',
          value: 'GTLS',
        },
        {
          label: 'GTLT - Adductor longus tendinopathy',
          value: 'GTLT',
        },
        {
          label: 'GTLX - Adductor longus tendon injury',
          value: 'GTLX',
        },
        {
          label: 'GTMR - Adductor magnus tendon rupture',
          value: 'GTMR',
        },
        {
          label: 'GTMS - Adductor magnus tendon strain',
          value: 'GTMS',
        },
        {
          label: 'GTMT - Adductor magnus tendinopathy',
          value: 'GTMT',
        },
        {
          label: 'GTMX - Adductor magnus tendon injury',
          value: 'GTMX',
        },
        {
          label: 'GTRR - Rectus femoris origin tendon rupture',
          value: 'GTRR',
        },
        {
          label: 'GTRS - Rectus femoris tendon strain',
          value: 'GTRS',
        },
        {
          label: 'GTRT - Rectus femoris origin tendinopathy',
          value: 'GTRT',
        },
        {
          label: 'GTRX - Rectus femoris tendon injury',
          value: 'GTRX',
        },
        {
          label: 'GTSR - Sartorius tendon rupture',
          value: 'GTSR',
        },
        {
          label: 'GTSS - Sartorius tendon strain',
          value: 'GTSS',
        },
        {
          label: 'GTST - Sartorius tendinopathy',
          value: 'GTST',
        },
        {
          label: 'GTSX - Sartorius tendon injury',
          value: 'GTSX',
        },
        {
          label: 'GTXX - Hip and Groin Tendon Injuries',
          value: 'GTXX',
        },
        {
          label: 'GUPX - Pubic symphysis instability',
          value: 'GUPX',
        },
        {
          label: 'GUXX - Instability of Hip Jt/ Groin',
          value: 'GUXX',
        },
        {
          label: 'GXXX - Pelvic/ Buttock Pain not otherwise specified',
          value: 'GXXX',
        },
        {
          label: 'GYMX - Chronic non specific or multifactorial groin pain',
          value: 'GYMX',
        },
        {
          label: 'GYOX - Osteitis Pubis',
          value: 'GYOX',
        },
        {
          label: 'GYXX - Other Stress/ Overuse Injury Hip and Groin',
          value: 'GYXX',
        },
        {
          label: 'GZXX - Hip/ Groin Pain Not otherwise specified',
          value: 'GZXX',
        },
        {
          label: 'GZZX - Hip/Groin Pain undiagnosed',
          value: 'GZZX',
        },
        {
          label: 'HDJX - Jaw Dislocation',
          value: 'HDJX',
        },
        {
          label: 'HDXX - Facial Dislocation',
          value: 'HDXX',
        },
        {
          label: 'HFEF - Orbital floor fracture',
          value: 'HFEF',
        },
        {
          label: 'HFEM - Medial Wall fracture',
          value: 'HFEM',
        },
        {
          label: 'HFEX - Orbital fracture',
          value: 'HFEX',
        },
        {
          label: 'HFEZ - Other orbital fracture not otherwise specified',
          value: 'HFEZ',
        },
        {
          label: 'HFMC - Compound fractured mandible',
          value: 'HFMC',
        },
        {
          label: 'HFMX - Mandibular fracture',
          value: 'HFMX',
        },
        {
          label: 'HFNX - Nasal fracture',
          value: 'HFNX',
        },
        {
          label: 'HFSF - Fractured frontal bone',
          value: 'HFSF',
        },
        {
          label: 'HFSX - Skull/cranial fracture',
          value: 'HFSX',
        },
        {
          label: 'HFUX - Maxillary fracture',
          value: 'HFUX',
        },
        {
          label: 'HFXX - Head/ Facial fracture',
          value: 'HFXX',
        },
        {
          label: 'HFZX - Zygoma fracture',
          value: 'HFZX',
        },
        {
          label: 'HHEC - Cauliflower Ear (Chronic)',
          value: 'HHEC',
        },
        {
          label: 'HHEX - Ear bruising/ haematoma',
          value: 'HHEX',
        },
        {
          label: 'HHJX - Jaw bruising/ haematoma',
          value: 'HHJX',
        },
        {
          label: 'HHMX - Mouth bruising/haematoma',
          value: 'HHMX',
        },
        {
          label: 'HHNE - Epistaxis',
          value: 'HHNE',
        },
        {
          label: 'HHNS - Septal haematoma',
          value: 'HHNS',
        },
        {
          label: 'HHNX - Nose bruising/ Haematoma',
          value: 'HHNX',
        },
        {
          label: 'HHOC - Conjunctival haematoma',
          value: 'HHOC',
        },
        {
          label: 'HHOO - Periorbital bruising/ haematoma',
          value: 'HHOO',
        },
        {
          label: 'HHOX - Eye bruising/ haematoma',
          value: 'HHOX',
        },
        {
          label: 'HHSX - Scalp bruising/ haematoma',
          value: 'HHSX',
        },
        {
          label: 'HHXX - Head / Facial Bruising/ Haematoma',
          value: 'HHXX',
        },
        {
          label: 'HHZX - Other bruising/ haematoma not otherwise specified',
          value: 'HHZX',
        },
        {
          label: 'HJJX - Jaw Sprain/ TMJ symptoms',
          value: 'HJJX',
        },
        {
          label: 'HJXX - Facial Joint sprain/ injury',
          value: 'HJXX',
        },
        {
          label: 'HKBN - Eyebrow laceration/ abrasion not requiring suturing',
          value: 'HKBN',
        },
        {
          label: 'HKBS - Eyebrow laceration requiring suturing',
          value: 'HKBS',
        },
        {
          label: 'HKBX - Eyebrow laceration/ abrasion',
          value: 'HKBX',
        },
        {
          label: 'HKCN - Cheek laceration/ abrasion not requiring suturing',
          value: 'HKCN',
        },
        {
          label: 'HKCS - Cheek lacerationrequiring suturing',
          value: 'HKCS',
        },
        {
          label: 'HKCX - Cheek laceration/ abrasion',
          value: 'HKCX',
        },
        {
          label: 'HKEN - Ear laceration/ abrasion not requiring suturing',
          value: 'HKEN',
        },
        {
          label: 'HKES - Ear laceration requiring suturing',
          value: 'HKES',
        },
        {
          label: 'HKEX - Ear laceration/ abrasion',
          value: 'HKEX',
        },
        {
          label: 'HKHN - Forehead laceration/abrasion not requiring suturing',
          value: 'HKHN',
        },
        {
          label: 'HKHS - Forehead laceration requiring suturing',
          value: 'HKHS',
        },
        {
          label: 'HKHX - Forehead laceration/ abrasion',
          value: 'HKHX',
        },
        {
          label: 'HKJN - Chin laceration/ abrasion not requiring suturing',
          value: 'HKJN',
        },
        {
          label: 'HKJS - Chin laceration requiring suturing',
          value: 'HKJS',
        },
        {
          label: 'HKJX - Chin laceration',
          value: 'HKJX',
        },
        {
          label: 'HKKN - Lip laceration/abrasion not requiring suturing',
          value: 'HKKN',
        },
        {
          label: 'HKKS - Lip laceration requiring suturing',
          value: 'HKKS',
        },
        {
          label: 'HKKX - Lip laceration / abrasion',
          value: 'HKKX',
        },
        {
          label: 'HKLN - Eyelid laceration/ abrasion not requiring suturing',
          value: 'HKLN',
        },
        {
          label: 'HKLS - Eyelid aceration requiring suturing',
          value: 'HKLS',
        },
        {
          label: 'HKLX - Eyelid laceration/abrasion',
          value: 'HKLX',
        },
        {
          label: 'HKMX - Mouth/ musocal laceration/ abrasion',
          value: 'HKMX',
        },
        {
          label: 'HKNN - Nose laceration/ abrasion not requiring suturing',
          value: 'HKNN',
        },
        {
          label: 'HKNS - Nose laceration requiring suturing',
          value: 'HKNS',
        },
        {
          label: 'HKNX - Nose laceration/ abrasion',
          value: 'HKNX',
        },
        {
          label: 'HKOO - Periorbital laceration',
          value: 'HKOO',
        },
        {
          label: 'HKPS - Perforating mouth laceration requiring suturing',
          value: 'HKPS',
        },
        {
          label: 'HKPX - Perforating mouth laceration',
          value: 'HKPX',
        },
        {
          label: 'HKSN - Scalp laceration/ abrasion not reuiring suturing',
          value: 'HKSN',
        },
        {
          label: 'HKSS - Scalp laceration requiring suturing',
          value: 'HKSS',
        },
        {
          label: 'HKSX - Scalp laceration/ abrasion',
          value: 'HKSX',
        },
        {
          label: 'HKTN - Tongue laceration not requiring suturing',
          value: 'HKTN',
        },
        {
          label: 'HKTS - Tongue laceration requiring suturing',
          value: 'HKTS',
        },
        {
          label: 'HKTX - Tongue laceration',
          value: 'HKTX',
        },
        {
          label:
            'HKXN - Head laceration location unspecified/ or multiple not requiring suturing',
          value: 'HKXN',
        },
        {
          label:
            'HKXQ - Complication of head laceration/ abrasion including infection',
          value: 'HKXQ',
        },
        {
          label:
            'HKXS - Head laceration location unspecified/ or multiple requiring suturing',
          value: 'HKXS',
        },
        {
          label: 'HKXX - Head laceration/ abrasion',
          value: 'HKXX',
        },
        {
          label:
            'HKZN - Facial laceration/ abrasion NOS not requiring suturing',
          value: 'HKZN',
        },
        {
          label: 'HKZS - Facial laceration NOS requiring suturing',
          value: 'HKZS',
        },
        {
          label: 'HKZX - Facial laceration/ abrasion not otherwise specified',
          value: 'HKZX',
        },
        {
          label: 'HLMN - Mucosal laceration not requiring suturing',
          value: 'HLMN',
        },
        {
          label: 'HLMS - Musocal laceration requiring suturing',
          value: 'HLMS',
        },
        {
          label:
            'HMXX - Facial Muscle and/or Tendon strain/ spasm/ trigger points',
          value: 'HMXX',
        },
        {
          label: 'HMYX - Facial Muscle trigger points',
          value: 'HMYX',
        },
        {
          label: 'HNCA - Acute Concussion',
          value: 'HNCA',
        },
        {
          label: 'HNCC - Chronic Brain Injury',
          value: 'HNCC',
        },
        {
          label: 'HNCO - Acute Concussion with visual symptoms',
          value: 'HNCO',
        },
        {
          label: 'HNCX - Concussion ',
          value: 'HNCX',
        },
        {
          label: 'HNNX - Cranial Nerve injury',
          value: 'HNNX',
        },
        {
          label: 'HNVX - Intracranial Bleed',
          value: 'HNVX',
        },
        {
          label: 'HNXX - Concussion/ Brain Injury',
          value: 'HNXX',
        },
        {
          label: 'HODD - Avulsed Tooth',
          value: 'HODD',
        },
        {
          label: 'HODF - Fractured Tooth',
          value: 'HODF',
        },
        {
          label: 'HODL - Subluxed Tooth',
          value: 'HODL',
        },
        {
          label: 'HODX - Dental Injury',
          value: 'HODX',
        },
        {
          label: 'HOED - Perforated ear drum',
          value: 'HOED',
        },
        {
          label: 'HOEX - Ear trauma',
          value: 'HOEX',
        },
        {
          label: 'HOOC - Eye foreign body - Corneal',
          value: 'HOOC',
        },
        {
          label: 'HOOH - Hyphaema',
          value: 'HOOH',
        },
        {
          label: 'HOOJ - Eye foreign body - Conjunctival',
          value: 'HOOJ',
        },
        {
          label: 'HOOL - Contact lens displacement',
          value: 'HOOL',
        },
        {
          label: 'HOOM - Eye trauma with multiple lesions',
          value: 'HOOM',
        },
        {
          label: 'HOOP - Eye foreign body - perforating',
          value: 'HOOP',
        },
        {
          label: 'HOOR - Retinal detachment',
          value: 'HOOR',
        },
        {
          label: 'HOOU - Corneal Abrasion',
          value: 'HOOU',
        },
        {
          label: 'HOOX - Eye injury/ trauma',
          value: 'HOOX',
        },
        {
          label: 'HOOZ - Eye foreign body - not otherwise specified',
          value: 'HOOZ',
        },
        {
          label: 'HOXX - Head Organ Damage ',
          value: 'HOXX',
        },
        {
          label: 'HXXX - Head Injuries',
          value: 'HXXX',
        },
        {
          label: 'HZEM - Exercise related migraine',
          value: 'HZEM',
        },
        {
          label: 'HZEX - Exercise related headache',
          value: 'HZEX',
        },
        {
          label: 'HZNM - Muscular trigger point referred headache',
          value: 'HZNM',
        },
        {
          label: 'HZNX - Cervicogenic headache',
          value: 'HZNX',
        },
        {
          label:
            'HZXX - Head Pain/ Injury Not Otherwise Specified (Including headache)',
          value: 'HZXX',
        },
        {
          label: 'HZZX - Other head pain/ injury not otherwise specified',
          value: 'HZZX',
        },
        {
          label: 'IACC - Calcaneocuboid coalition',
          value: 'IACC',
        },
        {
          label: 'IACN - Calcaneonavicular coalition',
          value: 'IACN',
        },
        {
          label: 'IACT - Talonavicular Coalition',
          value: 'IACT',
        },
        {
          label: 'IACX - Tarsal Coalition of foot',
          value: 'IACX',
        },
        {
          label: 'IAXX - Structural Abnormality of Ankle',
          value: 'IAXX',
        },
        {
          label: 'ICRX - Cervical rib',
          value: 'ICRX',
        },
        {
          label: 'ICXX - Chest Structural Abnormaility',
          value: 'ICXX',
        },
        {
          label: 'IDKX - Thoracic kyphosis',
          value: 'IDKX',
        },
        {
          label: 'IDSX - Thoracic scoliosis',
          value: 'IDSX',
        },
        {
          label: 'IDXX - Thoracic Spine Structural Abnormaility',
          value: 'IDXX',
        },
        {
          label: 'IEXX - Elbow Structural Abnormality',
          value: 'IEXX',
        },
        {
          label: 'IFAX - Accessory bone foot',
          value: 'IFAX',
        },
        {
          label: 'IFXX - Structural Abnormality of Foot',
          value: 'IFXX',
        },
        {
          label: 'IGHD - Congenital dislocation of hip',
          value: 'IGHD',
        },
        {
          label: 'IGHX - Congenital abnormality of hip joint',
          value: 'IGHX',
        },
        {
          label: 'IGXX - Structural Abnormaility of Hip/ Groin',
          value: 'IGXX',
        },
        {
          label: 'IKCD - Discoid lateral meniscus',
          value: 'IKCD',
        },
        {
          label: 'IKCX - Congenital cartilage abnormality of knee',
          value: 'IKCX',
        },
        {
          label: 'IKPX - Bi or multipartite patella',
          value: 'IKPX',
        },
        {
          label: 'IKXX - Structural Abnormality of knee',
          value: 'IKXX',
        },
        {
          label: 'ILCB - Spina Bifida',
          value: 'ILCB',
        },
        {
          label: 'ILCL - Lumbarisation of S1',
          value: 'ILCL',
        },
        {
          label: 'ILCS - Sacralisation of L5',
          value: 'ILCS',
        },
        {
          label: 'ILCX - Congenital abnormality Lumbar Spine',
          value: 'ILCX',
        },
        {
          label: 'ILSX - Lumbar Scoliosis',
          value: 'ILSX',
        },
        {
          label: 'ILXX - Lumbosacral Spine Structural Abnormality',
          value: 'ILXX',
        },
        {
          label: 'IMHE - Generalised hypermobility of joints',
          value: 'IMHE',
        },
        {
          label: 'IMHO - Generalised hypomobility of joints',
          value: 'IMHO',
        },
        {
          label: 'IMHX - Hypo or hyper - mobility of joints',
          value: 'IMHX',
        },
        {
          label: 'IMLA - Apparent leg length discrepancy',
          value: 'IMLA',
        },
        {
          label: 'IMLQ - Tibial leg length discrepancy',
          value: 'IMLQ',
        },
        {
          label: 'IMLT - Femoral leg length discrspancy',
          value: 'IMLT',
        },
        {
          label: 'IMLX - Leg length abnormaility',
          value: 'IMLX',
        },
        {
          label: 'IMXX - Generalised Abnormality of the Musculoskeletal System',
          value: 'IMXX',
        },
        {
          label: 'INXX - Structural Abnormality Cervical Spine',
          value: 'INXX',
        },
        {
          label: 'IOXX - Abdominopelvic Structural abnormality',
          value: 'IOXX',
        },
        {
          label: 'IQMS - Accessory soleus muscle (excl inj to that muscle)',
          value: 'IQMS',
        },
        {
          label: 'IQMX - Muscle abnormality of lower leg',
          value: 'IQMX',
        },
        {
          label: 'IQXX - Structural Abnormality of Lower leg',
          value: 'IQXX',
        },
        {
          label: 'ISXX - Shoulder Structural Abnormaility',
          value: 'ISXX',
        },
        {
          label: 'IWCB - Carpal boss',
          value: 'IWCB',
        },
        {
          label: 'IWCX - Carpal bone structural abnormality',
          value: 'IWCX',
        },
        {
          label: 'IWUN - Negative ulnar variance',
          value: 'IWUN',
        },
        {
          label: 'IWUP - Positive ulnar variance',
          value: 'IWUP',
        },
        {
          label: 'IWUX - Radioulnar variance',
          value: 'IWUX',
        },
        {
          label: 'IWXX - Wrist and Hand Structural Abnormality',
          value: 'IWXX',
        },
        {
          label: 'JCAX - Osteochondrosis of ankle',
          value: 'JCAX',
        },
        {
          label: 'JCEC - Capitellar osteochondrosis',
          value: 'JCEC',
        },
        {
          label: 'JCEX - Osteochondrosis elbow',
          value: 'JCEX',
        },
        {
          label: "JCFF - Freiberg's disease - osteochondrosis of MT head",
          value: 'JCFF',
        },
        {
          label: "JCFK - Kholer's disease - navicular osteochondrosis",
          value: 'JCFK',
        },
        {
          label: 'JCFX - Osteochondrosis of foot',
          value: 'JCFX',
        },
        {
          label: 'JCGP - Perthes disease',
          value: 'JCGP',
        },
        {
          label: 'JCGS - Slipped capital femoral epiphysis',
          value: 'JCGS',
        },
        {
          label: 'JCGX - Osteochondroses of hip joint',
          value: 'JCGX',
        },
        {
          label: 'JCKF - OCD Medial or lateral femoral condyle',
          value: 'JCKF',
        },
        {
          label: 'JCKP - OCD Patella',
          value: 'JCKP',
        },
        {
          label: 'JCKS - Osteochondrosis of knee',
          value: 'JCKS',
        },
        {
          label:
            "JCKT - Epiphysitis of medial tibial plateau (Blount's Disease)",
          value: 'JCKT',
        },
        {
          label: 'JCLS - Scheuermanns disease',
          value: 'JCLS',
        },
        {
          label: 'JCLX - Osteochondrosis Spine',
          value: 'JCLX',
        },
        {
          label: 'JCSX - Osteochondrosis shoulder',
          value: 'JCSX',
        },
        {
          label: 'JCWR - Epiphysitis of distal radius',
          value: 'JCWR',
        },
        {
          label: 'JCWX - Osteochondrosis of wrist and hand',
          value: 'JCWX',
        },
        {
          label: 'JCXX - Other Osteochondroses',
          value: 'JCXX',
        },
        {
          label: 'JCZX - Other Osteochondrosis not elsewhere specified. ',
          value: 'JCZX',
        },
        {
          label:
            'JTAC - Apophysitis/ avulsion fracture to calcaneus (Severs Dx)',
          value: 'JTAC',
        },
        {
          label: 'JTAX - Traction injury to apophysis ankle',
          value: 'JTAX',
        },
        {
          label: 'JTBH - Apophysitis/ avulsion fracture Iischial tuberosity',
          value: 'JTBH',
        },
        {
          label: 'JTBI - Apophysitis/ avulsion fracture iliac crest',
          value: 'JTBI',
        },
        {
          label: 'JTBX - Traction injury to apophysis at buttock and pelvis',
          value: 'JTBX',
        },
        {
          label:
            'JTEM - Apophysitis/ avulsion fracture medial epicondyle elbow',
          value: 'JTEM',
        },
        {
          label: 'JTEX - Traction injury to apophysis at elbow',
          value: 'JTEX',
        },
        {
          label: 'JTFM - Apophysitis/ avulsion fracture base 5th metetarsal',
          value: 'JTFM',
        },
        {
          label: 'JTFX - Traction injury to foot',
          value: 'JTFX',
        },
        {
          label: 'JTGR - Apophysitis/ avulsion fracture AIIS',
          value: 'JTGR',
        },
        {
          label: 'JTGS - Apophysitis/ avulsion fracture ASIS',
          value: 'JTGS',
        },
        {
          label: 'JTGX - Traction injury to apophysis at groin/ hip joint',
          value: 'JTGX',
        },
        {
          label: 'JTGZ - Other apophysitis/ avulsion fracture groin/ hip',
          value: 'JTGZ',
        },
        {
          label:
            'JTKP - Apophysitis/ avulsion fracture distal pole patella (SLJ)',
          value: 'JTKP',
        },
        {
          label: 'JTKT - Apophysitis/ avulsion fracture tibial tubercle (OGS)',
          value: 'JTKT',
        },
        {
          label: 'JTKX - Traction injury to apophysis at knee',
          value: 'JTKX',
        },
        {
          label: 'JTSX - Traction injury to apophysis at shoulder',
          value: 'JTSX',
        },
        {
          label: 'JTWX - Traction injury to apophysis at wrist/ hand',
          value: 'JTWX',
        },
        {
          label: 'JTXX - Traction Apophysitis/ Avusion Fracture Apophysitis',
          value: 'JTXX',
        },
        {
          label:
            'JTZX - Other traction injury to apophysis not otherwise specified',
          value: 'JTZX',
        },
        {
          label: 'JXXX - Paediatric Diagnoses',
          value: 'JXXX',
        },
        {
          label: 'KABX - Bi or tri-comparmental osteoarthritis',
          value: 'KABX',
        },
        {
          label: 'KALX - Lateral compartment osteoarthritis knee',
          value: 'KALX',
        },
        {
          label: 'KAMX - Medial compartment osteoarthritis knee',
          value: 'KAMX',
        },
        {
          label: 'KAPX - Patellofemoral osteoarthritis',
          value: 'KAPX',
        },
        {
          label: 'KAXX - Knee Osteoarthritis',
          value: 'KAXX',
        },
        {
          label: 'KCBX - Mixed osteochondral and meniscal injury',
          value: 'KCBX',
        },
        {
          label: 'KCCB - Two or more osteochondral injury sites',
          value: 'KCCB',
        },
        {
          label: 'KCCL - Lateral femoral condyle osteochondral injury',
          value: 'KCCL',
        },
        {
          label: 'KCCM - Medial femoral condyle osteochondral injury',
          value: 'KCCM',
        },
        {
          label: 'KCCP - Patellofemoral osteochondral injury',
          value: 'KCCP',
        },
        {
          label: 'KCCT - Tibial osteochondral injury',
          value: 'KCCT',
        },
        {
          label: 'KCCX - Knee osteochondral injury',
          value: 'KCCX',
        },
        {
          label: 'KCLX - Knee cartilage injury with loose bodies',
          value: 'KCLX',
        },
        {
          label: 'KCMB - Medial and lateral meniscal tears',
          value: 'KCMB',
        },
        {
          label: 'KCMC - Lateral meniscal cyst',
          value: 'KCMC',
        },
        {
          label: 'KCMD - Degenerative meniscal tear',
          value: 'KCMD',
        },
        {
          label: 'KCML - Lateral meniscal tear',
          value: 'KCML',
        },
        {
          label: 'KCMM - Medial meniscal tear',
          value: 'KCMM',
        },
        {
          label: 'KCMX - Knee Meniscal cartilage injury',
          value: 'KCMX',
        },
        {
          label: 'KCXX - Knee Cartilage Injury',
          value: 'KCXX',
        },
        {
          label: 'KDKQ - Knee dislocation with neural or vascular complication',
          value: 'KDKQ',
        },
        {
          label: 'KDKX - Knee dislocation',
          value: 'KDKX',
        },
        {
          label: 'KDPF - Patellar dislocation with avulsion fracture patella',
          value: 'KDPF',
        },
        {
          label: 'KDPX - Patellar dislocation',
          value: 'KDPX',
        },
        {
          label: 'KDSX - Superior tib fib joint dislocation',
          value: 'KDSX',
        },
        {
          label: 'KDXX - Knee Dislocation ',
          value: 'KDXX',
        },
        {
          label: 'KFFI - Intraarticular femoral fracture',
          value: 'KFFI',
        },
        {
          label: 'KFFX - Distal femoral fracture',
          value: 'KFFX',
        },
        {
          label: 'KFPX - Patellar fracture',
          value: 'KFPX',
        },
        {
          label: 'KFTI - Intraarticular tibial fracture',
          value: 'KFTI',
        },
        {
          label: 'KFTX - Proximal tibial fracture',
          value: 'KFTX',
        },
        {
          label: 'KFXX - Knee Fractures',
          value: 'KFXX',
        },
        {
          label: 'KGBR - Ruptured Bakers Cyst',
          value: 'KGBR',
        },
        {
          label: 'KGBX - Bakers Cyst',
          value: 'KGBX',
        },
        {
          label: 'KGIX - ITB friction syndrome',
          value: 'KGIX',
        },
        {
          label: 'KGPB - PFS related to bipartite patella',
          value: 'KGPB',
        },
        {
          label: "KGPH - Hoffa's fat pad impingement",
          value: 'KGPH',
        },
        {
          label: 'KGPL - Excess lateral pressure syndrome',
          value: 'KGPL',
        },
        {
          label: 'KGPT - Patellofemoral pain with patellar tendinopathy',
          value: 'KGPT',
        },
        {
          label: 'KGPX - Patellofemoral pain',
          value: 'KGPX',
        },
        {
          label: 'KGSP - Synovial plica of knee',
          value: 'KGSP',
        },
        {
          label: 'KGSX - Knee joint synovitis',
          value: 'KGSX',
        },
        {
          label:
            'KGXX - Knee Impingement/ Synovitis/ Biomechanical Lesion not associated with other conditions',
          value: 'KGXX',
        },
        {
          label: 'KHBB - Pes Anserine burstitis of knee',
          value: 'KHBB',
        },
        {
          label: 'KHBI - Infrapatellar fat pad haematoma/ bursitis',
          value: 'KHBI',
        },
        {
          label: 'KHBP - Prepatellar bursitis',
          value: 'KHBP',
        },
        {
          label: 'KHBX - Traumatic knee bursitis',
          value: 'KHBX',
        },
        {
          label: 'KHMX - Knee MCL contusion',
          value: 'KHMX',
        },
        {
          label: 'KHQX - Distal quadricep haematoma',
          value: 'KHQX',
        },
        {
          label: 'KHXX - Knee Soft Tissue Bruising/ Haematoma',
          value: 'KHXX',
        },
        {
          label: 'KHZX - Other soft tissue bruising/ haematoma knee',
          value: 'KHZX',
        },
        {
          label: 'KJAC - ACL strain/ rupture with chondral/ meniscal injury',
          value: 'KJAC',
        },
        {
          label: 'KJAG - ACL graft rupture',
          value: 'KJAG',
        },
        {
          label: 'KJAP - Partial ACL tear',
          value: 'KJAP',
        },
        {
          label: 'KJAR - ACL rupture',
          value: 'KJAR',
        },
        {
          label: 'KJAX - Acute ACL injury',
          value: 'KJAX',
        },
        {
          label:
            'KJBC - Combined ligament injury with chondral/meniscal injury',
          value: 'KJBC',
        },
        {
          label: 'KJBX - Combined ligament injuries knee',
          value: 'KJBX',
        },
        {
          label:
            'KJCC - PCL strain/ rupture with associated chondral/ meniscal injury',
          value: 'KJCC',
        },
        {
          label: 'KJCP - Partial PCL tear',
          value: 'KJCP',
        },
        {
          label: 'KJCR - PCL rupture',
          value: 'KJCR',
        },
        {
          label: 'KJCX - Acute PCL injury',
          value: 'KJCX',
        },
        {
          label: 'KJLC - PLC injury with chondral / meniscal injury',
          value: 'KJLC',
        },
        {
          label: 'KJLL - LCL strain/ rupture',
          value: 'KJLL',
        },
        {
          label: 'KJLP - Posterolateral corner strain/ rupture',
          value: 'KJLP',
        },
        {
          label: 'KJLX - Posterolateral corner and LCL ligament injuries knee',
          value: 'KJLX',
        },
        {
          label: 'KJMA - Grade 1 MCL tear knee',
          value: 'KJMA',
        },
        {
          label: 'KJMB - Grade 2 MCL tear knee',
          value: 'KJMB',
        },
        {
          label:
            'KJMC - MCL strain/ rupture with chondral/ meniscal damage knee',
          value: 'KJMC',
        },
        {
          label:
            'KJMQ - Complication post MCL strain/ rupture incl. Pellegrini Stieda lesion',
          value: 'KJMQ',
        },
        {
          label: 'KJMR - MCL rupture knee',
          value: 'KJMR',
        },
        {
          label: 'KJMX - MCL injury knee',
          value: 'KJMX',
        },
        {
          label: 'KJPX - Patellar subluxation',
          value: 'KJPX',
        },
        {
          label: 'KJSX - Superior tib fib joint sprain',
          value: 'KJSX',
        },
        {
          label: 'KJXX - Knee Sprains/ Ligament Injuries',
          value: 'KJXX',
        },
        {
          label: 'KKDX - Deep knee laceration - intraarticular',
          value: 'KKDX',
        },
        {
          label: 'KKSX - Superficial knee laceration/ abrasion',
          value: 'KKSX',
        },
        {
          label:
            'KKXQ - Complication of knee laceration/ abrasion incl infection',
          value: 'KKXQ',
        },
        {
          label: 'KKXX - Knee Laceration/ Abrasion',
          value: 'KKXX',
        },
        {
          label: 'KL01 - Influenza (A/B)',
          value: 'KL01',
        },
        {
          label: 'KL02 - Strep throat',
          value: 'KL02',
        },
        {
          label: 'KL03 - Attention Deficit Disorder (ADD)',
          value: 'KL03',
        },
        {
          label: 'KL04 - Attention Deficit Hyperactivity Disorder (ADHD)',
          value: 'KL04',
        },
        {
          label: 'KL05 - Immune thrombocytopenia',
          value: 'KL05',
        },
        {
          label: 'KL06 - Orthostatic hypotension',
          value: 'KL06',
        },
        {
          label: 'KL07 - Diabetes (Type I)',
          value: 'KL07',
        },
        {
          label: 'KL08 - Diabetes (Type II)',
          value: 'KL08',
        },
        {
          label: 'KL09 - RED-S (Relative Energy Deficiency in Sport)',
          value: 'KL09',
        },
        {
          label: 'KL10 - Kidney stone',
          value: 'KL10',
        },
        {
          label: 'KL100 - Shingles (Zoster Virus)',
          value: 'KL100',
        },
        {
          label: 'KL101 - Meningitis (Viral)',
          value: 'KL101',
        },
        {
          label: 'KL102 - Meningitis (Bacterial)',
          value: 'KL102',
        },
        {
          label: 'KL103 - Heat Cramps (Muscular)',
          value: 'KL103',
        },
        {
          label: 'KL104 - Heat Syncope',
          value: 'KL104',
        },
        {
          label: 'KL105 - Hyperthermia/ Heat Exhaustion',
          value: 'KL105',
        },
        {
          label: 'KL106 - Allergic Reaction',
          value: 'KL106',
        },
        {
          label: 'KL107 - Anaphylactic Reaction to Medication',
          value: 'KL107',
        },
        {
          label: 'KL108 - Anaphylactic Reaction to Food',
          value: 'KL108',
        },
        {
          label: 'KL109 - Medication Allergy (excluding Anaphylaxis)',
          value: 'KL109',
        },
        {
          label: 'KL11 - Exhaustion (Overexertion)',
          value: 'KL11',
        },
        {
          label: 'KL110 - Food Allergy (excluding Anaphylaxis)',
          value: 'KL110',
        },
        {
          label: 'KL111 - Allergic Reaction (Non-specific)',
          value: 'KL111',
        },
        {
          label: 'KL112 - Commotio Cordis',
          value: 'KL112',
        },
        {
          label: 'KL113 - Other DVT',
          value: 'KL113',
        },
        {
          label: 'KL114 - Superficial Thrombophlebitis',
          value: 'KL114',
        },
        {
          label: 'KL115 - Deep Vein Thrombosis',
          value: 'KL115',
        },
        {
          label: 'KL116 - Wolf-Parkinson White Syndrome (WPW)',
          value: 'KL116',
        },
        {
          label: 'KL117 - Hypertension Undiagnosed',
          value: 'KL117',
        },
        {
          label: 'KL118 - Gallstones',
          value: 'KL118',
        },
        {
          label: 'KL119 - Hydrocele',
          value: 'KL119',
        },
        {
          label: 'KL12 - Syncope',
          value: 'KL12',
        },
        {
          label: 'KL120 - Oligomenorrhoea',
          value: 'KL120',
        },
        {
          label: 'KL121 - General Irregularity of Menstrual Cycle',
          value: 'KL121',
        },
        {
          label: 'KL122 - OBGYN Cystic Lesions (excl. Tumours/ Malignancies)',
          value: 'KL122',
        },
        {
          label: 'KL123 - Polycystic Ovarian Syndrome',
          value: 'KL123',
        },
        {
          label: 'KL124 - Benign Ovarian Cyst',
          value: 'KL124',
        },
        {
          label: 'KL125 - Benign Cyst of Breast',
          value: 'KL125',
        },
        {
          label: 'KL126 - Other Benign Cyst Obgyn',
          value: 'KL126',
        },
        {
          label: 'KL127 - Sickle Cell Anaemia',
          value: 'KL127',
        },
        {
          label: 'KL128 - Metabolic Illness',
          value: 'KL128',
        },
        {
          label: 'KL129 - Diabetic Coma',
          value: 'KL129',
        },
        {
          label: 'KL13 - Conjunctivitis',
          value: 'KL13',
        },
        {
          label: 'KL130 - Diabetic Shock',
          value: 'KL130',
        },
        {
          label: 'KL131 - Diabetic Ketoacidosis',
          value: 'KL131',
        },
        {
          label: 'KL132 - Hyperglycemia',
          value: 'KL132',
        },
        {
          label: 'KL133 - Hypoglycemia',
          value: 'KL133',
        },
        {
          label: 'KL134 - Hyponatremia',
          value: 'KL134',
        },
        {
          label: 'KL135 - Hypocalcemia',
          value: 'KL135',
        },
        {
          label: 'KL136 - Hypercalcemia',
          value: 'KL136',
        },
        {
          label: 'KL137 - Folliculitis',
          value: 'KL137',
        },
        {
          label: 'KL138 - Post Traumatic Stress Disorder (Post-Injury)',
          value: 'KL138',
        },
        {
          label: 'KL139 - Post traumatic stress disorder (Post-Surgery)',
          value: 'KL139',
        },
        {
          label: 'KL14 - MRSA Not Specifically Mentioned',
          value: 'KL14',
        },
        {
          label: 'KL140 - Sleep Disorder(s)',
          value: 'KL140',
        },
        {
          label: 'KL141 - General Sleep Disorder',
          value: 'KL141',
        },
        {
          label: 'KL142 - Primary Insomnia (excl other assoc. diagnosis)',
          value: 'KL142',
        },
        {
          label: 'KL143 - Secondary Insomnia (incl other assoc. diagnosis)',
          value: 'KL143',
        },
        {
          label: 'KL144 - Tumour Obgyn',
          value: 'KL144',
        },
        {
          label: 'KL145 - Clinical Fatigue (Undiagnosed)',
          value: 'KL145',
        },
        {
          label: 'KL146 - Dizziness (Undiagnosed)',
          value: 'KL146',
        },
        {
          label: 'KL147 - Dehydration',
          value: 'KL147',
        },
        {
          label: 'KL148 - Electrolyte Imbalance',
          value: 'KL148',
        },
        {
          label: 'KL149 - Nausea (Undiagnosed)',
          value: 'KL149',
        },
        {
          label: 'KL15 - Staphylococcus Not Specifically Mentioned',
          value: 'KL15',
        },
        {
          label: 'KL150 - Overtraining Syndrome',
          value: 'KL150',
        },
        {
          label: 'KL151 - Vasovagal Syncope',
          value: 'KL151',
        },
        {
          label: 'KL152 - Somatic Dysfunction',
          value: 'KL152',
        },
        {
          label: 'KL153 - Duplicate Injury Entry',
          value: 'KL153',
        },
        {
          label: 'KL154 - Confirmed COVID-19 infection (Symptomatic)',
          value: 'KL154',
        },
        {
          label: 'KL155 - Confirmed COVID-19 infection (Asymptomatic)',
          value: 'KL155',
        },
        {
          label: 'KL156 - Otorrhea',
          value: 'KL156',
        },
        {
          label: 'KL157 - Otorrhagia',
          value: 'KL157',
        },
        {
          label: 'KL158 - Abdominal Aortic Aneurysm',
          value: 'KL158',
        },
        {
          label: 'KL159 - \tOtalgia',
          value: 'KL159',
        },
        {
          label: 'KL16 - Impetigo',
          value: 'KL16',
        },
        {
          label: 'KL160 - Infection of Head/ Face/ Neck',
          value: 'KL160',
        },
        {
          label: 'KL161 - Infection of Foot (excl. joint)',
          value: 'KL161',
        },
        {
          label: 'KL162 - Infection lower leg',
          value: 'KL162',
        },
        {
          label: 'KL163 - Infection of Wrist and/or Hand (excl. joint)',
          value: 'KL163',
        },
        {
          label: 'KL164 - Infection of Wrist/ Hand/ Finger(s) (excl. joint)',
          value: 'KL164',
        },
        {
          label: 'KL165 - Infection of Elbow and/ or Forearm (excl. joint)',
          value: 'KL165',
        },
        {
          label: 'KL166 - Other Abcess',
          value: 'KL166',
        },
        {
          label: 'KL167 - Other Cellulitis/Abcess not specifically mentioned',
          value: 'KL167',
        },
        {
          label: 'KL17 - Carbuncle',
          value: 'KL17',
        },
        {
          label: 'KL18 - Cellulitis/ Abcess Head/ Face/ Neck',
          value: 'KL18',
        },
        {
          label: 'KL19 - Abcess Head/ Face/ Neck',
          value: 'KL19',
        },
        {
          label: 'KL20 - MRSA Head/Face/Neck',
          value: 'KL20',
        },
        {
          label: 'KL21 - Staphylococcus Head/Face/Neck',
          value: 'KL21',
        },
        {
          label: 'KL22 - Infection of Upper Arm/ Shoulder',
          value: 'KL22',
        },
        {
          label: 'KL23 - Cellulitis/ Abcess Upper Arm/ Shoulder',
          value: 'KL23',
        },
        {
          label: 'KL24 - Abcess Upper Arm/ Shoulder',
          value: 'KL24',
        },
        {
          label: 'KL25 - MRSA Upper Arm/ Shoulder',
          value: 'KL25',
        },
        {
          label: 'KL26 - Staphylococcus Upper Arm/ Shoulder',
          value: 'KL26',
        },
        {
          label: 'KL27 - Infection of Elbow',
          value: 'KL27',
        },
        {
          label: 'KL28 - Cellulitis/Abcess Elbow (excl. Joint)',
          value: 'KL28',
        },
        {
          label: 'KL29 - Abcess Elbow (excl. Joint)',
          value: 'KL29',
        },
        {
          label: 'KL30 - MRSA Elbow (excl. Joint)',
          value: 'KL30',
        },
        {
          label: 'KL31 - Staphylococcus Elbow (excl. Joint)',
          value: 'KL31',
        },
        {
          label: 'KL32 - Infection of Forearm',
          value: 'KL32',
        },
        {
          label: 'KL33 - Cellulitis/Abcess Forearm',
          value: 'KL33',
        },
        {
          label: 'KL34 - Abcess Forearm',
          value: 'KL34',
        },
        {
          label: 'KL35 - MRSA Forearm',
          value: 'KL35',
        },
        {
          label: 'KL36 - Staphylococcus Forearm',
          value: 'KL36',
        },
        {
          label: 'KL37 - Cellulitis/ Abcess Wrist/ Hand (excl. Joint)',
          value: 'KL37',
        },
        {
          label: 'KL38 - Abcess Wrist/ Hand (excl. Joint)',
          value: 'KL38',
        },
        {
          label: 'KL39 - MRSA Wrist/Hand (excl. Joint)',
          value: 'KL39',
        },
        {
          label: 'KL40 - Staphylococcus Wrist/Hand (excl. Joint)',
          value: 'KL40',
        },
        {
          label: 'KL41 - Infection of Finger(s) (excl. Joint)',
          value: 'KL41',
        },
        {
          label: 'KL42 - Cellulitis/ Abcess Finger(s) (excl. Joint)',
          value: 'KL42',
        },
        {
          label: 'KL43 - Abcess Finger(s) (excl. Joint)',
          value: 'KL43',
        },
        {
          label: 'KL44 - MRSA Finger(s) (excl. Joint)',
          value: 'KL44',
        },
        {
          label: 'KL45 - Staphylococcus Finger(s) (excl. Joint)',
          value: 'KL45',
        },
        {
          label: 'KL46 - Infection of Trunk/ Abdomen (excl. Organs)',
          value: 'KL46',
        },
        {
          label: 'KL47 - Cellulitis/ Abcess Trunk/ Abdomen',
          value: 'KL47',
        },
        {
          label: 'KL48 - Abcess Trunk/ Abdomen',
          value: 'KL48',
        },
        {
          label: 'KL49 - MRSA Trunk/Abdomen',
          value: 'KL49',
        },
        {
          label: 'KL50 - Staphylococcus Trunk/ Abdomen',
          value: 'KL50',
        },
        {
          label: 'KL51 - Cellulitis/ Abcess Infection Pelvis/Buttock',
          value: 'KL51',
        },
        {
          label: 'KL52 - Abcess Pelvis/ Buttock',
          value: 'KL52',
        },
        {
          label: 'KL53 - MRSA Pelvis/Buttock',
          value: 'KL53',
        },
        {
          label: 'KL54 - Staphylococcus Pelvis/Buttock',
          value: 'KL54',
        },
        {
          label: 'KL55 - Infection of Hip and/ or Thigh (excl. Joint)',
          value: 'KL55',
        },
        {
          label: 'KL56 - Infection of Hip (excl. Joint)',
          value: 'KL56',
        },
        {
          label: 'KL57 - Cellulitis/ Abcess Hip (excl. Joint)',
          value: 'KL57',
        },
        {
          label: 'KL58 - Abcess Hip (excl. Joint)',
          value: 'KL58',
        },
        {
          label: 'KL59 - MRSA Hip (excl. Joint)',
          value: 'KL59',
        },
        {
          label: 'KL60 - Staphylococcus Hip (excl. Joint)',
          value: 'KL60',
        },
        {
          label: 'KL61 - Infection of Thigh',
          value: 'KL61',
        },
        {
          label: 'KL62 - Cellulitis/Abcess Thigh',
          value: 'KL62',
        },
        {
          label: 'KL63 - Abcess Thigh',
          value: 'KL63',
        },
        {
          label: 'KL64 - MRSA Thigh',
          value: 'KL64',
        },
        {
          label: 'KL65 - Staphylococcus Thigh',
          value: 'KL65',
        },
        {
          label: 'KL66 - Infection of Knee (excl. Joint)',
          value: 'KL66',
        },
        {
          label: 'KL67 - Cellulitis/Abcess Knee (excl. Joint)',
          value: 'KL67',
        },
        {
          label: 'KL68 - Abcess Knee (excl. Joint)',
          value: 'KL68',
        },
        {
          label: 'KL69 - MRSA Knee (excl. Joint)',
          value: 'KL69',
        },
        {
          label: 'KL70 - Staphylococcus Knee (excl. Joint)',
          value: 'KL70',
        },
        {
          label: 'KL71 - Cellulitis/Abcess Lower Leg',
          value: 'KL71',
        },
        {
          label: 'KL72 - Abcess Lower Leg',
          value: 'KL72',
        },
        {
          label: 'KL73 - MRSA Lower Leg',
          value: 'KL73',
        },
        {
          label: 'KL74 - Staphylococcus Lower Leg',
          value: 'KL74',
        },
        {
          label: 'KL75 - Cellulitis/Abcess Foot (excl. Joint)',
          value: 'KL75',
        },
        {
          label: 'KL76 - Abcess Foot (excl. Joint)',
          value: 'KL76',
        },
        {
          label: 'KL77 - MRSA Foot (excl. Joint)',
          value: 'KL77',
        },
        {
          label: 'KL78 - Staphylococcus Foot (excl. Joint)',
          value: 'KL78',
        },
        {
          label: 'KL79 - Infection of Ankle (excl. Joint)',
          value: 'KL79',
        },
        {
          label: 'KL80 - Cellulitis/ Abcess Ankle (excl. Joint)',
          value: 'KL80',
        },
        {
          label: 'KL81 - Abcess Ankle (excl. Joint)',
          value: 'KL81',
        },
        {
          label: 'KL82 - MRSA Ankle (excl. Joint)',
          value: 'KL82',
        },
        {
          label: 'KL83 - Staphylococcus Ankle (excl. Joint)',
          value: 'KL83',
        },
        {
          label: 'KL84 - Pityriasis Rosea',
          value: 'KL84',
        },
        {
          label: 'KL85 - Herpes Gladitorum',
          value: 'KL85',
        },
        {
          label: 'KL86 - Molluscum Contagiosum',
          value: 'KL86',
        },
        {
          label: 'KL87 - Tinea Capitis',
          value: 'KL87',
        },
        {
          label: 'KL88 - Tinea Corporis',
          value: 'KL88',
        },
        {
          label: 'KL89 - Tinea Versicolor',
          value: 'KL89',
        },
        {
          label: 'KL90 - Pulmonary Embolus(i)',
          value: 'KL90',
        },
        {
          label: 'KL91 - Other Ear Disorder NOS',
          value: 'KL91',
        },
        {
          label: 'KL92 - Eye Infection',
          value: 'KL92',
        },
        {
          label: 'KL93 - Conjunctivitis (Viral/ Bacterial)',
          value: 'KL93',
        },
        {
          label: 'KL94 - Conjunctivitis (Allergic)',
          value: 'KL94',
        },
        {
          label: 'KL95 - Urinary Tract Infection',
          value: 'KL95',
        },
        {
          label: 'KL96 - Bladder Infection',
          value: 'KL96',
        },
        {
          label: 'KL97 - Infected Wrist Joint',
          value: 'KL97',
        },
        {
          label: 'KL98 - Infected Thumb Joint',
          value: 'KL98',
        },
        {
          label: 'KL99 - Mononucleosis',
          value: 'KL99',
        },
        {
          label: 'KMPX - Popliteus muscle strain',
          value: 'KMPX',
        },
        {
          label: 'KMXX - Knee Muscle Strain/ Spasm/ Trigger Points',
          value: 'KMXX',
        },
        {
          label: 'KN01 - Osgood-Schlatter syndrome',
          value: 'KN01',
        },
        {
          label: 'KN02 - Snapping scapula syndrome',
          value: 'KN02',
        },
        {
          label: 'KN03 - Posterior labral lesion',
          value: 'KN03',
        },
        {
          label: 'KN04 - Stress reaction thoracic spine - grade 1',
          value: 'KN04',
        },
        {
          label: 'KN05 - Stress reaction thoracic spine - grade 2',
          value: 'KN05',
        },
        {
          label: 'KN06 - Stress reaction thoracic spine - grade 3',
          value: 'KN06',
        },
        {
          label: 'KN07 - Stress reaction lumbar spine - grade 1',
          value: 'KN07',
        },
        {
          label: 'KN08 - Stress reaction lumbar spine - grade 2',
          value: 'KN08',
        },
        {
          label: 'KN09 - Stress reaction lumbar spine - grade 3',
          value: 'KN09',
        },
        {
          label: 'KN10 - Stress reaction hip - grade 1',
          value: 'KN10',
        },
        {
          label: 'KN100 - Lumbar Soft Tissue Dysfunction',
          value: 'KN100',
        },
        {
          label: 'KN101 - Lumbar Spine Cyst in Bone',
          value: 'KN101',
        },
        {
          label: 'KN102 - Lumbar Spine Cyst in Joint',
          value: 'KN102',
        },
        {
          label: 'KN103 - Lumbar Spine Cyst in Soft Tissue',
          value: 'KN103',
        },
        {
          label: 'KN104 - Other Lumbar Spine Cyst',
          value: 'KN104',
        },
        {
          label: 'KN105 - Ischial Bursitis',
          value: 'KN105',
        },
        {
          label: 'KN106 - Pelvic Stress Reaction(s)',
          value: 'KN106',
        },
        {
          label: 'KN107 - Stress Reaction Ilium',
          value: 'KN107',
        },
        {
          label: 'KN108 - Stress Reaction Sacrum',
          value: 'KN108',
        },
        {
          label: 'KN109 - Stress Reaction Coccyx',
          value: 'KN109',
        },
        {
          label: 'KN11 - Stress reaction hip - grade 2',
          value: 'KN11',
        },
        {
          label: 'KN110 - Stress Reaction Ischium',
          value: 'KN110',
        },
        {
          label: 'KN111 - Multiple Stress Reactions Pelvis',
          value: 'KN111',
        },
        {
          label: 'KN112 - Other Stress Reaction Pelvis',
          value: 'KN112',
        },
        {
          label: 'KN113 - Pelvic Functional Movement Disorder',
          value: 'KN113',
        },
        {
          label: 'KN114 - Pelvic Muscle Imbalance',
          value: 'KN114',
        },
        {
          label: 'KN115 - Pelvic Soft Tissue Dysfunction',
          value: 'KN115',
        },
        {
          label: 'KN116 - Femoral Neck Stress Reaction',
          value: 'KN116',
        },
        {
          label: 'KN117 - Stress Reaction Superior Cortex Femoral Neck',
          value: 'KN117',
        },
        {
          label: 'KN118 - Stress Reaction Inferior Cortex Femoral Neck',
          value: 'KN118',
        },
        {
          label: 'KN119 - Stress Reaction through Femoral Neck (Cortices)',
          value: 'KN119',
        },
        {
          label: 'KN12 - Stress reaction hip - grade 3',
          value: 'KN12',
        },
        {
          label: 'KN120 - Pelvic Stress Reaction',
          value: 'KN120',
        },
        {
          label: 'KN121 - Stress Reaction Superior Pubic Ramus',
          value: 'KN121',
        },
        {
          label: 'KN122 - Stress Reaction Inferior Pubic Ramus',
          value: 'KN122',
        },
        {
          label: 'KN123 - Hip/Groin Soft Tissue Dysfunction',
          value: 'KN123',
        },
        {
          label: 'KN124 - Hip/Groin Functional Movement Disorder',
          value: 'KN124',
        },
        {
          label: 'KN125 - Hip/Groin Muscle Imbalance',
          value: 'KN125',
        },
        {
          label: 'KN126 - Hip/ Groin Cyst in Bone',
          value: 'KN126',
        },
        {
          label: 'KN127 - Hip/ Groin Cyst in Joint',
          value: 'KN127',
        },
        {
          label: 'KN128 - Hip/ Groin Cyst in Soft Tissue',
          value: 'KN128',
        },
        {
          label: 'KN129 - Other Hip/ Groin Cyst',
          value: 'KN129',
        },
        {
          label: 'KN13 - Stress reaction upper leg - grade 1',
          value: 'KN13',
        },
        {
          label: 'KN130 - Thigh Stress Reaction(s)',
          value: 'KN130',
        },
        {
          label: 'KN131 - Femoral Shaft Stress Reaction',
          value: 'KN131',
        },
        {
          label: 'KN132 - Femoral Shaft Bone Bruise',
          value: 'KN132',
        },
        {
          label: 'KN133 - Quadriceps Soft Tissue Dysfunction',
          value: 'KN133',
        },
        {
          label: 'KN134 - Hamstring Soft Tissue Dysfunction',
          value: 'KN134',
        },
        {
          label: 'KN135 - Adductor Soft Tissue Dysfunction',
          value: 'KN135',
        },
        {
          label: 'KN136 - Thigh Cyst in Bone',
          value: 'KN136',
        },
        {
          label: 'KN137 - Thigh Cyst in Soft Tissue',
          value: 'KN137',
        },
        {
          label: 'KN138 - Other Thigh Cyst',
          value: 'KN138',
        },
        {
          label: 'KN139 - LCL Injury With Chondral/Meniscal Injury',
          value: 'KN139',
        },
        {
          label: 'KN14 - Stress reaction upper leg - grade 2',
          value: 'KN14',
        },
        {
          label:
            'KN140 - Posterior capsule sprain (incl. isolated injury, excl. PLC)',
          value: 'KN140',
        },
        {
          label: 'KN141 - ACL/MCL Sprain',
          value: 'KN141',
        },
        {
          label: 'KN142 - ACL/MCL Sprain (incl. Meniscal Injury)',
          value: 'KN142',
        },
        {
          label: 'KN143 - ACL/LCL Sprain',
          value: 'KN143',
        },
        {
          label: 'KN144 - ACL/LCL Sprain (incl. Meniscal Injury)',
          value: 'KN144',
        },
        {
          label: 'KN145 - ACL/PCL Sprain',
          value: 'KN145',
        },
        {
          label: 'KN146 - ACL/PCL Sprain (incl. Collateral Ligaments)',
          value: 'KN146',
        },
        {
          label: 'KN147 - Knee Stress Reaction(s)',
          value: 'KN147',
        },
        {
          label: 'KN148 - Patellar Stress Reaction',
          value: 'KN148',
        },
        {
          label: 'KN149 - Distal Femoral Stress Reaction',
          value: 'KN149',
        },
        {
          label: 'KN15 - Stress reaction upper leg - grade 3',
          value: 'KN15',
        },
        {
          label: 'KN150 - Proximal Tibial Stress Reaction',
          value: 'KN150',
        },
        {
          label: 'KN151 - Femoral Bone Bruise',
          value: 'KN151',
        },
        {
          label: 'KN152 - Cyclops Lesion',
          value: 'KN152',
        },
        {
          label: 'KN153 - Knee Cyst in Bone',
          value: 'KN153',
        },
        {
          label: 'KN154 - Knee Cyst in Joint',
          value: 'KN154',
        },
        {
          label: 'KN155 - Knee Cyst in Soft Tissue',
          value: 'KN155',
        },
        {
          label: 'KN156 - Other Knee Cyst',
          value: 'KN156',
        },
        {
          label: 'KN157 - Weber A Fibular fracture',
          value: 'KN157',
        },
        {
          label: 'KN158 - Weber B Fibular fracture',
          value: 'KN158',
        },
        {
          label: 'KN159 - Weber C Fibular fracture',
          value: 'KN159',
        },
        {
          label: 'KN16 - Stress reaction lower leg - grade 1',
          value: 'KN16',
        },
        {
          label: 'KN160 - Lower Leg Stress Reaction(s)',
          value: 'KN160',
        },
        {
          label: 'KN161 - Stress Reaction Tibia',
          value: 'KN161',
        },
        {
          label: 'KN162 - Anterior Stress Reaction Tibia',
          value: 'KN162',
        },
        {
          label: 'KN163 - Posteromedial Stress Reaction Tibia',
          value: 'KN163',
        },
        {
          label: 'KN164 - Stress Reaction Fibula',
          value: 'KN164',
        },
        {
          label: 'KN165 - Tibial Nerve Palsy',
          value: 'KN165',
        },
        {
          label: 'KN166 - Tibial Bone Bruise',
          value: 'KN166',
        },
        {
          label: 'KN167 - Fibular Bone Bruise',
          value: 'KN167',
        },
        {
          label: 'KN168 - Lower Leg Soft Tissue Dysfunction',
          value: 'KN168',
        },
        {
          label: 'KN169 - Lower Leg Cyst in Bone',
          value: 'KN169',
        },
        {
          label: 'KN17 - Stress reaction lower leg - grade 2',
          value: 'KN17',
        },
        {
          label: 'KN170 - Lower Leg Cyst in Soft Tissue',
          value: 'KN170',
        },
        {
          label: 'KN171 - Other Lower Leg Cyst',
          value: 'KN171',
        },
        {
          label: 'KN172 - Posterior Talofibular Ligament Sprain',
          value: 'KN172',
        },
        {
          label:
            'KN173 - Posterior Talofibular Ligament Rupture/ Grade 3 Injury',
          value: 'KN173',
        },
        {
          label: 'KN174 - Stress Reaction Calcaneus',
          value: 'KN174',
        },
        {
          label: 'KN175 - Ankle Stress Injuries/ Stress Reaction(s)',
          value: 'KN175',
        },
        {
          label: 'KN176 - Stress Reaction Tibia At Ankle',
          value: 'KN176',
        },
        {
          label: 'KN177 - Medial Malleolar Stress Reaction',
          value: 'KN177',
        },
        {
          label: 'KN178 - Stress Reaction Fibula At Ankle',
          value: 'KN178',
        },
        {
          label: 'KN179 - Lateral Malleolar Stress Reaction',
          value: 'KN179',
        },
        {
          label: 'KN18 - Stress reaction lower leg - grade 3',
          value: 'KN18',
        },
        {
          label: 'KN180 - Stress Reaction Talus',
          value: 'KN180',
        },
        {
          label: 'KN181 - Peroneal Nerve Entrapment',
          value: 'KN181',
        },
        {
          label: 'KN182 - Superficial Peroneal Nerve Entrapment',
          value: 'KN182',
        },
        {
          label: 'KN183 - Deep Peroneal Nerve Entrapment',
          value: 'KN183',
        },
        {
          label: 'KN184 - Ankle Bone Bruise',
          value: 'KN184',
        },
        {
          label: 'KN185 - Calcaneal Bone Bruise',
          value: 'KN185',
        },
        {
          label: 'KN186 - Talar Bone Bruise',
          value: 'KN186',
        },
        {
          label: 'KN187 - Ankle Soft Tissue Dysfunction',
          value: 'KN187',
        },
        {
          label: 'KN188 - Ankle Functional Movement Disorder',
          value: 'KN188',
        },
        {
          label: 'KN189 - Ankle Muscle Imbalance',
          value: 'KN189',
        },
        {
          label: 'KN19 - Stress reaction foot - grade 1',
          value: 'KN19',
        },
        {
          label: 'KN190 - Ankle Cyst in Bone',
          value: 'KN190',
        },
        {
          label: 'KN191 - Ankle Cyst in Joint',
          value: 'KN191',
        },
        {
          label: 'KN192 - Ankle Cyst in Soft Tissue',
          value: 'KN192',
        },
        {
          label: 'KN193 - Other Ankle Cyst',
          value: 'KN193',
        },
        {
          label: 'KN194 - Lisfranc Sprain',
          value: 'KN194',
        },
        {
          label: 'KN195 - Lisfranc Sprain (with associated fracture)',
          value: 'KN195',
        },
        {
          label: 'KN196 - Lisfranc Dislocation',
          value: 'KN196',
        },
        {
          label: 'KN197 - Lisfranc Dislocation (with associated fracture)',
          value: 'KN197',
        },
        {
          label: 'KN198 - Navicular Stress Reaction',
          value: 'KN198',
        },
        {
          label: 'KN199 - Cuboid Stress Reaction',
          value: 'KN199',
        },
        {
          label: 'KN20 - Stress reaction foot - grade 2',
          value: 'KN20',
        },
        {
          label: 'KN200 - Cuneiform Stress Reaction',
          value: 'KN200',
        },
        {
          label: 'KN201 - Metatarsal Stress Reaction',
          value: 'KN201',
        },
        {
          label: 'KN202 - First Metatarsal Stress Reaction',
          value: 'KN202',
        },
        {
          label: 'KN203 - Second Metatarsal Stress Reaction',
          value: 'KN203',
        },
        {
          label: 'KN204 - Third Metatarsal Stress Reaction',
          value: 'KN204',
        },
        {
          label: 'KN205 - Fourth Metatarsal Stress Reaction',
          value: 'KN205',
        },
        {
          label: 'KN206 - Fifth Metatarsal Stress Reaction',
          value: 'KN206',
        },
        {
          label: 'KN207 - Base Second Metatarsal Stress Reaction',
          value: 'KN207',
        },
        {
          label: 'KN208 - Sesamoid Stress Reaction',
          value: 'KN208',
        },
        {
          label: 'KN209 - Metatarsal Bone Bruise',
          value: 'KN209',
        },
        {
          label: 'KN21 - Stress reaction foot - grade 3',
          value: 'KN21',
        },
        {
          label: 'KN210 - Phalangeal Bone Bruise',
          value: 'KN210',
        },
        {
          label: 'KN211 - Tarsal Bone Bruise',
          value: 'KN211',
        },
        {
          label: 'KN212 - Bone Spur/Exostosis',
          value: 'KN212',
        },
        {
          label: 'KN213 - Foot Soft Tissue Dysfunction',
          value: 'KN213',
        },
        {
          label: 'KN214 - Foot Cyst in Bone',
          value: 'KN214',
        },
        {
          label: 'KN215 - Foot Cyst in Joint',
          value: 'KN215',
        },
        {
          label: 'KN216 - Foot Cyst in Soft Tissue',
          value: 'KN216',
        },
        {
          label: 'KN217 - Other Foot Cyst',
          value: 'KN217',
        },
        {
          label: 'KN218 - Cyst in Bone not otherwise specified',
          value: 'KN218',
        },
        {
          label: 'KN219 - Cyst in Joint not otherwise specified',
          value: 'KN219',
        },
        {
          label: 'KN22 - Musocal Laceration (req. suturing)',
          value: 'KN22',
        },
        {
          label: 'KN220 - Cyst in Soft Tissue not otherwise specified',
          value: 'KN220',
        },
        {
          label: 'KN221 - Upper Extremity Functional Movement Disorder',
          value: 'KN221',
        },
        {
          label: 'KN222 - Lower Extremity Functional Movement Disorder',
          value: 'KN222',
        },
        {
          label: 'KN223 - Muscle Imbalance(s)',
          value: 'KN223',
        },
        {
          label: 'KN224 - Upper Extremity Muscle Imbalance',
          value: 'KN224',
        },
        {
          label: 'KN225 - Lower Extremity Muscle Imbalance',
          value: 'KN225',
        },
        {
          label: 'KN226 - Traumatic Amputation(s)',
          value: 'KN226',
        },
        {
          label: 'KN227 - Upper Limb Amputation',
          value: 'KN227',
        },
        {
          label: 'KN228 - Lower Limb Amputation',
          value: 'KN228',
        },
        {
          label: 'KN229 - Thoracic Functional Scoliosis',
          value: 'KN229',
        },
        {
          label: 'KN23 - Concussion: Ocular-motor (eye movement impairment)',
          value: 'KN23',
        },
        {
          label: 'KN230 - Lumbar Functional Scoliosis',
          value: 'KN230',
        },
        {
          label: 'KN231 - ATFL/ CFL sprain',
          value: 'KN231',
        },
        {
          label: 'KN232 - ATFL/ CFL/ PTFL sprain',
          value: 'KN232',
        },
        {
          label: 'KN233 - CFL/PTFL sprain',
          value: 'KN233',
        },
        {
          label: 'KN234 - Spinal Scoliosis (Multi-Segmental)',
          value: 'KN234',
        },
        {
          label: 'KN235 - Distal tarsal tunnel syndrome',
          value: 'KN235',
        },
        {
          label: 'KN236 - Proximal tarsal tunnel syndrome',
          value: 'KN236',
        },
        {
          label: 'KN237 - Ankle syndesmosis sprain (incl. fibular injury)',
          value: 'KN237',
        },
        {
          label: 'KN238 - Sternocostal joint dislocation',
          value: 'KN238',
        },
        {
          label: 'KN239 - Intercostal muscle strain',
          value: 'KN239',
        },
        {
          label:
            'KN24 - Concussion: Vestibular (vestibular-ocular reflex impairment)',
          value: 'KN24',
        },
        {
          label: 'KN240 - Costovertebral joint subluxation',
          value: 'KN240',
        },
        {
          label: 'KN241 - Osteochondritis dissecans',
          value: 'KN241',
        },
        {
          label: 'KN242 - Rupture of Bursa (traumatic)',
          value: 'KN242',
        },
        {
          label: 'KN243 - Cubital tunnel syndrome',
          value: 'KN243',
        },
        {
          label: 'KN244 - Proximal plantar fasciitis',
          value: 'KN244',
        },
        {
          label: 'KN245 - Femoral Acetabular Impingement (w/ Labral tear)',
          value: 'KN245',
        },
        {
          label: 'KN246 - Cauliflower Ear ( Acute)',
          value: 'KN246',
        },
        {
          label: 'KN247 - Subdural Haematoma',
          value: 'KN247',
        },
        {
          label: 'KN248 - Eye trauma not otherwise specified',
          value: 'KN248',
        },
        {
          label: 'KN249 - Medial meniscal cyst',
          value: 'KN249',
        },
        {
          label: 'KN25 - Concussion: Balance Impairment',
          value: 'KN25',
        },
        {
          label: 'KN250 - Femoral condyle fracture',
          value: 'KN250',
        },
        {
          label: 'KN251 - Tibial plateau fracture',
          value: 'KN251',
        },
        {
          label: 'KN252 - Patellar contusion',
          value: 'KN252',
        },
        {
          label: 'KN253 - Knee joint effusion (cause undiagnosed)',
          value: 'KN253',
        },
        {
          label: 'KN254 - Cervical disk sequestration',
          value: 'KN254',
        },
        {
          label: 'KN255 - Shoulder dislocation with Hill-Sachs lesion',
          value: 'KN255',
        },
        {
          label: 'KN256 - Anterior shoulder subluxation',
          value: 'KN256',
        },
        {
          label: 'KN257 - Inferior shoulder subluxation',
          value: 'KN257',
        },
        {
          label: 'KN258 - Nerve palsy of shoulder',
          value: 'KN258',
        },
        {
          label: 'KN259 - Scapular stress reaction',
          value: 'KN259',
        },
        {
          label: 'KN26 - Concussion: Migraine (headache)',
          value: 'KN26',
        },
        {
          label: 'KN260 - Biceps tendon strain partial thickness',
          value: 'KN260',
        },
        {
          label: 'KN261 - Subscapularis tendon strain partial thickness',
          value: 'KN261',
        },
        {
          label: 'KN262 - Infraspinatus tendon strain partial thickness',
          value: 'KN262',
        },
        {
          label: 'KN263 - Pectoralis major tendon strain partial thickness',
          value: 'KN263',
        },
        {
          label: 'KN264 - Other tendon strain partial thickness',
          value: 'KN264',
        },
        {
          label: 'KN265 - Other tendon rupture',
          value: 'KN265',
        },
        {
          label: 'KN266 - Other tendon strain',
          value: 'KN266',
        },
        {
          label: 'KN267 - Anterior instability of shoulder',
          value: 'KN267',
        },
        {
          label: 'KN268 - Brachialis muscle strain',
          value: 'KN268',
        },
        {
          label: 'KN269 - Stress Reaction Humerus',
          value: 'KN269',
        },
        {
          label: 'KN27 - Concussion: Cognitive Fatigue',
          value: 'KN27',
        },
        {
          label: 'KN270 - Dorsal Interossei strain',
          value: 'KN270',
        },
        {
          label: 'KN271 - Lumbrical muscle strain',
          value: 'KN271',
        },
        {
          label: 'KN272 - Palmar interossei strain',
          value: 'KN272',
        },
        {
          label: 'KN28 - Concussion: Anxiety and/or Depression',
          value: 'KN28',
        },
        {
          label: 'KN29 - Concussion: Sleep Impairement',
          value: 'KN29',
        },
        {
          label: 'KN30 - Concussion: Cervicogenic (i.e. Whiplash)',
          value: 'KN30',
        },
        {
          label: 'KN31 - Concussion: No subtype findings',
          value: 'KN31',
        },
        {
          label: 'KN32 - Epidural Hematoma',
          value: 'KN32',
        },
        {
          label: 'KN33 - Eye inflammation (incl. Iritis)',
          value: 'KN33',
        },
        {
          label: 'KN34 - Ruptured Globe',
          value: 'KN34',
        },
        {
          label: 'KN35 - Other/ General Tooth Pain Undiagnosed',
          value: 'KN35',
        },
        {
          label: 'KN36 - Neck Soft Tissue Dysfunction',
          value: 'KN36',
        },
        {
          label: 'KN37 - Neck Functional Movement Disorder',
          value: 'KN37',
        },
        {
          label: 'KN38 - Neck Muscle Imbalance',
          value: 'KN38',
        },
        {
          label: 'KN39 - Rhomboid Muscle Strain (excl. Chronic Dysfunction)',
          value: 'KN39',
        },
        {
          label:
            'KN40 - Middle Trapezius Muscle Strain (excl. Chronic Dysfunction)',
          value: 'KN40',
        },
        {
          label:
            'KN41 - Lower Trapezius Muscle Strain (excl. Chronic Dysfunction)',
          value: 'KN41',
        },
        {
          label: 'KN42 - Short Head Of Biceps Tendon Rupture',
          value: 'KN42',
        },
        {
          label: 'KN43 - Multiple Tendon Strain',
          value: 'KN43',
        },
        {
          label: 'KN44 - Multiple Tendon Rupture',
          value: 'KN44',
        },
        {
          label: 'KN45 - Reverse HAGL (PHAGL) Lesion',
          value: 'KN45',
        },
        {
          label: 'KN46 - Multidirectional Instability of Shoulder',
          value: 'KN46',
        },
        {
          label: 'KN47 - Shoulder Soft Tissue Dysfunction',
          value: 'KN47',
        },
        {
          label: 'KN48 - Shoulder Functional Movement Disorder',
          value: 'KN48',
        },
        {
          label: 'KN49 - Shoulder Muscle Imbalance',
          value: 'KN49',
        },
        {
          label: 'KN50 - Shoulder Cyst in Bone',
          value: 'KN50',
        },
        {
          label: 'KN51 - Shoulder Cyst in Joint',
          value: 'KN51',
        },
        {
          label: 'KN52 - Shoulder Cyst in Soft Tissue',
          value: 'KN52',
        },
        {
          label: 'KN53 - Other Shoulder Cyst',
          value: 'KN53',
        },
        {
          label: 'KN54 - Upper Arm Cyst in Bone',
          value: 'KN54',
        },
        {
          label: 'KN55 - Upper Arm Cyst in Soft Tissue',
          value: 'KN55',
        },
        {
          label: 'KN56 - Other Upper Arm Cyst',
          value: 'KN56',
        },
        {
          label: 'KN57 - Elbow Lateral Ligament Injury',
          value: 'KN57',
        },
        {
          label: 'KN58 - Elbow Lateral Ligament Sprain (Grade 1-2)',
          value: 'KN58',
        },
        {
          label: 'KN59 - Elbow Lateral Ligament Rupture/ Grade 3 Injury',
          value: 'KN59',
        },
        {
          label: 'KN60 - Combined UCL/ LCL Sprain Elbow',
          value: 'KN60',
        },
        {
          label: 'KN61 - Medial Epicondylitis',
          value: 'KN61',
        },
        {
          label: 'KN62 - Lateral Epicondylitis',
          value: 'KN62',
        },
        {
          label: 'KN63 - Stress Fracture Olecranon',
          value: 'KN63',
        },
        {
          label: 'KN64 - Stress Reaction Olecranon',
          value: 'KN64',
        },
        {
          label: 'KN65 - Elbow Soft Tissue Dysfunction',
          value: 'KN65',
        },
        {
          label: 'KN66 - Elbow Cyst in Bone',
          value: 'KN66',
        },
        {
          label: 'KN67 - Elbow Cyst in Joint',
          value: 'KN67',
        },
        {
          label: 'KN68 - Elbow Cyst in Soft Tissue',
          value: 'KN68',
        },
        {
          label: 'KN69 - Other Elbow Cyst',
          value: 'KN69',
        },
        {
          label: 'KN70 - Stress Reaction Radius and/or Ulna',
          value: 'KN70',
        },
        {
          label: 'KN71 - Forearm Soft Tissue Dysfunction',
          value: 'KN71',
        },
        {
          label: 'KN72 - Forearm Cyst in Bone',
          value: 'KN72',
        },
        {
          label: 'KN73 - Forearm Cyst in Soft Tissue',
          value: 'KN73',
        },
        {
          label: 'KN74 - Other Forearm Cyst',
          value: 'KN74',
        },
        {
          label: 'KN75 - Thumb Flexor Muscle Strain',
          value: 'KN75',
        },
        {
          label: 'KN76 - Thumb Extensor Muscle Strain',
          value: 'KN76',
        },
        {
          label: 'KN77 - Wrist or Hand Soft Tissue Dysfunction',
          value: 'KN77',
        },
        {
          label: 'KN78 - Wrist/ Hand Cyst in Bone',
          value: 'KN78',
        },
        {
          label: 'KN79 - Wrist/ Hand Cyst in Joint',
          value: 'KN79',
        },
        {
          label: 'KN80 - Wrist/ Hand Cyst in Soft Tissue',
          value: 'KN80',
        },
        {
          label: 'KN81 - Other Wrist/ Hand Cyst',
          value: 'KN81',
        },
        {
          label: 'KN82 - Costochondral Joint Sprain',
          value: 'KN82',
        },
        {
          label: 'KN83 - Rib Stress Reaction(s)',
          value: 'KN83',
        },
        {
          label: 'KN84 - Rib Stress Reaction ( 1- 4)',
          value: 'KN84',
        },
        {
          label: 'KN85 - Rib Stress Reaction ( 5- 9)',
          value: 'KN85',
        },
        {
          label: 'KN86 - Rib Stress Reaction ( 10- 12)',
          value: 'KN86',
        },
        {
          label: 'KN87 - Hemopneumothorax',
          value: 'KN87',
        },
        {
          label: 'KN88 - Chest Soft Tissue Dysfunction',
          value: 'KN88',
        },
        {
          label: 'KN89 - Abdominal Hernia',
          value: 'KN89',
        },
        {
          label: 'KN90 - Abdominal Soft Tissue Dysfunction',
          value: 'KN90',
        },
        {
          label: 'KN91 - Thoracic Functional Movement Disorder',
          value: 'KN91',
        },
        {
          label: 'KN92 - Thoracic Muscle Imbalance',
          value: 'KN92',
        },
        {
          label: 'KN93 - Thoracic Soft Tissue Dysfunction',
          value: 'KN93',
        },
        {
          label: 'KN94 - Thoracic Spine Cyst in Bone',
          value: 'KN94',
        },
        {
          label: 'KN95 - Thoracic Spine Cyst in Joint',
          value: 'KN95',
        },
        {
          label: 'KN96 - Thoracic Spine Cyst in Soft Tissue',
          value: 'KN96',
        },
        {
          label: 'KN97 - Other Thoracic Spine Cyst',
          value: 'KN97',
        },
        {
          label: 'KN98 - Lumbar Functional Movement Disorder',
          value: 'KN98',
        },
        {
          label: 'KN99 - Lumbar Muscle Imbalance',
          value: 'KN99',
        },
        {
          label: 'KSFX - Distal femoral stress fracture',
          value: 'KSFX',
        },
        {
          label: 'KSPX - Patellar stress fracture',
          value: 'KSPX',
        },
        {
          label: 'KSTX - Proximal tibial stress fracture',
          value: 'KSTX',
        },
        {
          label: 'KSXX - Knee Stress Fracture',
          value: 'KSXX',
        },
        {
          label: 'KTGL - Lateral gastroc tendinopathy knee',
          value: 'KTGL',
        },
        {
          label: 'KTGM - Medial gastroc tendinopathy knee',
          value: 'KTGM',
        },
        {
          label: 'KTGX - Gastrocnemius tendon injury',
          value: 'KTGX',
        },
        {
          label: 'KTHB - Lateral hamstring tendon strain',
          value: 'KTHB',
        },
        {
          label: 'KTHC - Lateral hamstring tendon rupture',
          value: 'KTHC',
        },
        {
          label: 'KTHL - Lateral hamstring tendinopathy',
          value: 'KTHL',
        },
        {
          label:
            'KTHM - Medial hamstring tendinopathy, incl pes anserine bursitis',
          value: 'KTHM',
        },
        {
          label: 'KTHR - Medial hamstring tendon rupture',
          value: 'KTHR',
        },
        {
          label: 'KTHS - Medial hamstring tendon strain',
          value: 'KTHS',
        },
        {
          label: 'KTHX - Hamstring tendon injury',
          value: 'KTHX',
        },
        {
          label:
            'KTPI - Insertional Patellar tendon pathology, incl intratend ossicle (excl Osgoode Schlatters - see JTKT)',
          value: 'KTPI',
        },
        {
          label: 'KTPR - Patellar tendon rupture',
          value: 'KTPR',
        },
        {
          label: 'KTPS - Patellar tendon strain',
          value: 'KTPS',
        },
        {
          label:
            'KTPT - Patellar tendinopathy (excl. Sinding Larsen Johannson syndrome see JTKP)',
          value: 'KTPT',
        },
        {
          label: 'KTPX - Patellar Tendon Injury',
          value: 'KTPX',
        },
        {
          label: 'KTQR - Quadriceps tendon rupture',
          value: 'KTQR',
        },
        {
          label: 'KTQS - Quadriceps tendon strain',
          value: 'KTQS',
        },
        {
          label: 'KTQT - Quadriceps tendinopathy',
          value: 'KTQT',
        },
        {
          label: 'KTQX - Quadriceps tendon injury',
          value: 'KTQX',
        },
        {
          label: 'KTTX - Popliteus tendon injury',
          value: 'KTTX',
        },
        {
          label: 'KTXX - Knee Tendon Injury',
          value: 'KTXX',
        },
        {
          label: 'KUAX - Chronic ACL insufficiency',
          value: 'KUAX',
        },
        {
          label: 'KUCX - Chronic PCL insufficiency',
          value: 'KUCX',
        },
        {
          label: 'KUMX - Chronic MCL insufficiency',
          value: 'KUMX',
        },
        {
          label: 'KUPX - Patellar instability',
          value: 'KUPX',
        },
        {
          label: 'KUXX - Knee Instability (chronic or recurrent subluxations)',
          value: 'KUXX',
        },
        {
          label: 'KUZX - Other instability',
          value: 'KUZX',
        },
        {
          label: 'KXXX - Thigh pain/ Injury Not otherwise specified',
          value: 'KXXX',
        },
        {
          label: 'KZHX - Knee haemarthrosis cause undiagnosed',
          value: 'KZHX',
        },
        {
          label: 'KZXX - Knee Pain/ Injury Not otherwise specified',
          value: 'KZXX',
        },
        {
          label: 'KZZX - Knee pain undiagnosed',
          value: 'KZZX',
        },
        {
          label: 'LACD - Degenerative L4/ L5 disc disease',
          value: 'LACD',
        },
        {
          label: 'LACE - Degenerative L5/S1 disc disease',
          value: 'LACE',
        },
        {
          label:
            'LACM - Degenerative disc disease multiple levels lumbar spine',
          value: 'LACM',
        },
        {
          label: 'LACX - Degenerative lumbar disc disease',
          value: 'LACX',
        },
        {
          label: 'LAFX - Facet joint OA lumbosacral spine',
          value: 'LAFX',
        },
        {
          label: 'LAXX - Osteoarthritis Lumbosacral spine',
          value: 'LAXX',
        },
        {
          label: 'LCAX - Lumbar disc annular tear',
          value: 'LCAX',
        },
        {
          label: 'LCPA - L1/2 disc prolapse',
          value: 'LCPA',
        },
        {
          label: 'LCPB - L2/3 disc prolapse',
          value: 'LCPB',
        },
        {
          label: 'LCPC - L3/4 disc prolapse',
          value: 'LCPC',
        },
        {
          label: 'LCPD - L4/5 disc prolapse',
          value: 'LCPD',
        },
        {
          label: 'LCPE - L5/S1 disc prolapse',
          value: 'LCPE',
        },
        {
          label: 'LCPX - Lumbar disc prolapse',
          value: 'LCPX',
        },
        {
          label: 'LCXX - Lumbar Disc Injury',
          value: 'LCXX',
        },
        {
          label: 'LFDX - Lumbar pedical fracture',
          value: 'LFDX',
        },
        {
          label: 'LFMX - Multiple lumbar spine fractures',
          value: 'LFMX',
        },
        {
          label: 'LFPX - Lumbar pars interarticularis acute fracture',
          value: 'LFPX',
        },
        {
          label:
            'LFQX - Complication of lumbar fracture (incl non union - excl spinal injury - see LNFXX)',
          value: 'LFQX',
        },
        {
          label: 'LFSX - Lumbar spinous process fracture',
          value: 'LFSX',
        },
        {
          label: 'LFTA - Fracture transverse process L1',
          value: 'LFTA',
        },
        {
          label: 'LFTB - Fracture transverse process L2',
          value: 'LFTB',
        },
        {
          label: 'LFTC - Fracture transverse process L3',
          value: 'LFTC',
        },
        {
          label: 'LFTD - Fracture transverse process L4',
          value: 'LFTD',
        },
        {
          label: 'LFTE - Fracture transverse process L5',
          value: 'LFTE',
        },
        {
          label: 'LFTM - Fracture multiple transverse processes',
          value: 'LFTM',
        },
        {
          label: 'LFTX - Lumbar spine tranvserse process fracture',
          value: 'LFTX',
        },
        {
          label: 'LFVX - Lumbar spine vertebral body fracture',
          value: 'LFVX',
        },
        {
          label: 'LFXX - Lumbar Spine Fracture',
          value: 'LFXX',
        },
        {
          label: 'LFZX - Other lumbar spine fracture',
          value: 'LFZX',
        },
        {
          label: 'LGXX - Lumbar Spine Facet Joint Pain/ Stiffness',
          value: 'LGXX',
        },
        {
          label: 'LHXX - Lumbar Soft Tissue Bruising/ Haematoma',
          value: 'LHXX',
        },
        {
          label: 'LJFX - Lumbar facet joint sprain',
          value: 'LJFX',
        },
        {
          label: 'LJLI - Iliolumbar Ligament pain',
          value: 'LJLI',
        },
        {
          label: 'LJLX - Lumbar ligament Sprain',
          value: 'LJLX',
        },
        {
          label: 'LJXX - Lumbar Spine Joint Injury',
          value: 'LJXX',
        },
        {
          label:
            'LKXQ - Complication of lumbar laceration/ abrasion incl infection',
          value: 'LKXQ',
        },
        {
          label: 'LKXX - Lumbar Laceration/ Abrasion',
          value: 'LKXX',
        },
        {
          label:
            'LMXX - Lumbar Spine muscle and Tendon Strain/ Spasm/ Trigger Points',
          value: 'LMXX',
        },
        {
          label: 'LMYX - Lumbar muscle trigger points',
          value: 'LMYX',
        },
        {
          label:
            'LNAA - L1 - 3 Nerve root impingement due to foraminal stenosis bony and disc',
          value: 'LNAA',
        },
        {
          label:
            'LNAD - L4 Nerve root impingement due to foraminal stenosis bony and disc',
          value: 'LNAD',
        },
        {
          label:
            'LNAE - L5 Nerve root impingement due to foraminal stenosis bony and disc',
          value: 'LNAE',
        },
        {
          label:
            'LNAF - S1 Nerve root impingement due to foraminal stenosis bony and disc',
          value: 'LNAF',
        },
        {
          label:
            'LNAX - Lumbosacral Nerve root impingement due to foraminal stenosis bony and disc',
          value: 'LNAX',
        },
        {
          label:
            'LNDA - Lumbar disc injury with associated L1 - L3 nerve root injury',
          value: 'LNDA',
        },
        {
          label:
            'LNDD - Lumbar disc injury with associated L4 nerve root injury',
          value: 'LNDD',
        },
        {
          label:
            'LNDE - Lumbar disc injury with associated L5 nerve root injury',
          value: 'LNDE',
        },
        {
          label:
            'LNDF - Lumbar disc injury with associated S1 nerve root injury',
          value: 'LNDF',
        },
        {
          label:
            'LNDM - Lumbar disc injury with associated multiple nerve root injuries',
          value: 'LNDM',
        },
        {
          label:
            'LNDR - Lumbar disc injury with associated unspecified nerve root injury',
          value: 'LNDR',
        },
        {
          label:
            'LNDS - Lumbar disc Injury with associated spinal cord/ cauda equina injury',
          value: 'LNDS',
        },
        {
          label:
            'LNDX - Lumbar disc injury with associated neurological injury',
          value: 'LNDX',
        },
        {
          label:
            'LNFC - Lumbar spinal fracture with spinal cord/ cauda equina injury',
          value: 'LNFC',
        },
        {
          label:
            'LNFX - Lumbar spinal fracture with associated neurological injury',
          value: 'LNFX',
        },
        {
          label: 'LNSX - Lumbar Spinal canal stenosis',
          value: 'LNSX',
        },
        {
          label: 'LNTX - Lumbosacral nerve stretch/ traction injury',
          value: 'LNTX',
        },
        {
          label: 'LNXX - Lumbar Spine Neurological Injury',
          value: 'LNXX',
        },
        {
          label: 'LNZX - Other lumbosacral nerve injury',
          value: 'LNZX',
        },
        {
          label: 'LSDX - Lumbar pedicle stress fracture',
          value: 'LSDX',
        },
        {
          label: 'LSLX - Other lumbar spine stress fracture',
          value: 'LSLX',
        },
        {
          label: 'LSPA - Pars stress fracture L1 - L3',
          value: 'LSPA',
        },
        {
          label: 'LSPD - Pars stress fracture L4',
          value: 'LSPD',
        },
        {
          label: 'LSPE - Pars stress fracture L5',
          value: 'LSPE',
        },
        {
          label: 'LSPM - Multiple (incl bilateral) pars stress fractures',
          value: 'LSPM',
        },
        {
          label: 'LSPX - Pars interarticularis stress fracture',
          value: 'LSPX',
        },
        {
          label: 'LSRX - Lumbar spine stress reaction',
          value: 'LSRX',
        },
        {
          label: 'LSXX - Lumbar Stress Fracture',
          value: 'LSXX',
        },
        {
          label: 'LUPX - Lumbosacral instability',
          value: 'LUPX',
        },
        {
          label: 'LURX - Retrolisthesis lumbar spine',
          value: 'LURX',
        },
        {
          label: 'LUSA - Grade 1 Spondylolisthesis lumbar spine',
          value: 'LUSA',
        },
        {
          label: 'LUSB - Grade 2 Spondylolisthesis lumbar spine',
          value: 'LUSB',
        },
        {
          label: 'LUSC - Grade 3 Spondylolisthesis lumbar spine',
          value: 'LUSC',
        },
        {
          label: 'LUSD - Grade 4 Spondylolisthesis lumbar spine',
          value: 'LUSD',
        },
        {
          label: 'LUSX - Spondylolisthesis any Level',
          value: 'LUSX',
        },
        {
          label: 'LUXX - Lumbar Instability',
          value: 'LUXX',
        },
        {
          label: 'LXXX - Thoracic Pain/ Injury not otherwise specified',
          value: 'LXXX',
        },
        {
          label: 'LZHX - Lumbar pain with hamstring referral',
          value: 'LZHX',
        },
        {
          label: 'LZXX - Lumbar Pain/ Injury nor otherwise specified',
          value: 'LZXX',
        },
        {
          label: 'LZZX - Lumbar pain undiagnosed',
          value: 'LZZX',
        },
        {
          label: 'MBXX - Drug Use/ Overdose/ Poisoning',
          value: 'MBXX',
        },
        {
          label: 'MCAX - Athletes heart',
          value: 'MCAX',
        },
        {
          label: 'MCCX - Conduction abnormality incl arrythmias',
          value: 'MCCX',
        },
        {
          label: 'MCHX - HOCM',
          value: 'MCHX',
        },
        {
          label: 'MCIX - Ischaemic heart disease',
          value: 'MCIX',
        },
        {
          label: 'MCMX - Murmurs/ Valvular disease',
          value: 'MCMX',
        },
        {
          label: 'MCPX - Peripheral vascular disease',
          value: 'MCPX',
        },
        {
          label: 'MCVQ - DVT calf',
          value: 'MCVQ',
        },
        {
          label: 'MCVS - Subclavian vein/ axillary vein thrombosis',
          value: 'MCVS',
        },
        {
          label: 'MCVV - Varicose veins',
          value: 'MCVV',
        },
        {
          label: 'MCVX - Venous disease',
          value: 'MCVX',
        },
        {
          label:
            'MCVZ - Other venous disease incl calf/ ankle oedema, cause unknown',
          value: 'MCVZ',
        },
        {
          label: 'MCXX - Cardiovascular Illness',
          value: 'MCXX',
        },
        {
          label: 'MCZX - Other cardiovascular disease',
          value: 'MCZX',
        },
        {
          label: 'MDDX - Dermatitis',
          value: 'MDDX',
        },
        {
          label: 'MDPX - Psoriasis',
          value: 'MDPX',
        },
        {
          label: 'MDUX - Urticaria',
          value: 'MDUX',
        },
        {
          label:
            'MDXX - Dermatological Illness (excl infections MIXX, skin lesions/tumours MECX and sunburn MVHX)',
          value: 'MDXX',
        },
        {
          label:
            'MDZG - Dermatological Illness (excl infections MIXX, skin lesions/tumours MECX and sunburn MVHX)',
          value: 'MDZG',
        },
        {
          label:
            'MDZW - Dermatological Illness (excl infections MIXX, skin lesions/tumours MECX and sunburn MVHX)',
          value: 'MDZW',
        },
        {
          label: 'MDZX - Other rash not otherwise mentioned or undiagnosed',
          value: 'MDZX',
        },
        {
          label: 'MEAX - Tumour ankle',
          value: 'MEAX',
        },
        {
          label: 'MEBX - Tumour pelvis and buttock',
          value: 'MEBX',
        },
        {
          label: 'MECA - Benign Skin lesion',
          value: 'MECA',
        },
        {
          label: 'MECB - Basal cell carcinoma (BCC)',
          value: 'MECB',
        },
        {
          label: 'MECM - Melanoma',
          value: 'MECM',
        },
        {
          label: 'MECP - Multiple skin cancers',
          value: 'MECP',
        },
        {
          label: 'MECS - Squamous cell carcinoma (SCC)',
          value: 'MECS',
        },
        {
          label: 'MECX - Skin Lesion/ Tumour',
          value: 'MECX',
        },
        {
          label: 'MECZ - Other skin tumour',
          value: 'MECZ',
        },
        {
          label: 'MEDX - Tumour thoracic spine/ chest wall',
          value: 'MEDX',
        },
        {
          label: 'MEEX - Tumour elbow',
          value: 'MEEX',
        },
        {
          label: 'MEFX - Tumour foot',
          value: 'MEFX',
        },
        {
          label: 'MEGX - Tumour groin and Hip',
          value: 'MEGX',
        },
        {
          label: 'MEHX - Tumour head',
          value: 'MEHX',
        },
        {
          label: 'MEKX - Tumour knee',
          value: 'MEKX',
        },
        {
          label: 'MELX - Tumour lumbar spine',
          value: 'MELX',
        },
        {
          label: 'MEMX - Haematological Malignancy',
          value: 'MEMX',
        },
        {
          label: 'MENX - Tumour neck',
          value: 'MENX',
        },
        {
          label: 'MEQX - Tumour lower leg',
          value: 'MEQX',
        },
        {
          label: 'MERX - tumour forearm',
          value: 'MERX',
        },
        {
          label: 'MESX - Tumour shoulder',
          value: 'MESX',
        },
        {
          label: 'METX - Tumour thigh',
          value: 'METX',
        },
        {
          label: 'MEUX - Tumour upper arm',
          value: 'MEUX',
        },
        {
          label: 'MEWX - Tumour wrist/ hand',
          value: 'MEWX',
        },
        {
          label: 'MEXX - Tumours/ Malignancies',
          value: 'MEXX',
        },
        {
          label: 'MEZX - Other tumour not otherwise mentioned',
          value: 'MEZX',
        },
        {
          label: "MGDR - Runner's diarrhoea",
          value: 'MGDR',
        },
        {
          label: 'MGDX - Diarrhoea',
          value: 'MGDX',
        },
        {
          label: 'MGMX - Haematemesis/ malaena/ GI bleeding',
          value: 'MGMX',
        },
        {
          label: 'MGPE - Exercise associated gastritis/ reflus',
          value: 'MGPE',
        },
        {
          label: 'MGPN - NSAID associated gastritis/ peptic ulceration',
          value: 'MGPN',
        },
        {
          label:
            'MGPU - Gastritis/ peptic ulceration - non exercise/ NSAID related',
          value: 'MGPU',
        },
        {
          label: 'MGPX - Gastritis',
          value: 'MGPX',
        },
        {
          label: 'MGSA - Appendicitis',
          value: 'MGSA',
        },
        {
          label: 'MGSC - Cholecystitis',
          value: 'MGSC',
        },
        {
          label: 'MGSX - Surgical bowel problem',
          value: 'MGSX',
        },
        {
          label: 'MGXX - Gastrointestinal Illness',
          value: 'MGXX',
        },
        {
          label: 'MHAI - Iron deficiency',
          value: 'MHAI',
        },
        {
          label: 'MHAX - Anaemia',
          value: 'MHAX',
        },
        {
          label: 'MHXX - Haematological Illness and Nutritional Deficiencies',
          value: 'MHXX',
        },
        {
          label: 'MIAA - Infected ankle joint',
          value: 'MIAA',
        },
        {
          label: 'MIAE - Infected elbow joint',
          value: 'MIAE',
        },
        {
          label: 'MIAF - Infected foot joint',
          value: 'MIAF',
        },
        {
          label: 'MIAG - Infected hip joint',
          value: 'MIAG',
        },
        {
          label: 'MIAK - Infected knee joint',
          value: 'MIAK',
        },
        {
          label: 'MIAO - Infected pubic symphysis',
          value: 'MIAO',
        },
        {
          label: 'MIAS - Infected shoulder joint',
          value: 'MIAS',
        },
        {
          label: 'MIAW - Infected wrist, hand, finger, thumb joint',
          value: 'MIAW',
        },
        {
          label:
            'MIAX - Joint infection - septic arthritis (excl. complications of surgery or perforating lacerations)',
          value: 'MIAX',
        },
        {
          label: 'MIBD - Septic discitis - osteomyelitis of the spine',
          value: 'MIBD',
        },
        {
          label: 'MIBX - Infection of bone - osteomyelitis',
          value: 'MIBX',
        },
        {
          label: 'MIEE - Otitis externa',
          value: 'MIEE',
        },
        {
          label: 'MIEM - Middle ear infection',
          value: 'MIEM',
        },
        {
          label: 'MIEX - Ear infection',
          value: 'MIEX',
        },
        {
          label: "MIFF - Tinea pedis/ athlete's foot",
          value: 'MIFF',
        },
        {
          label: 'MIFG - Fungal infection groin',
          value: 'MIFG',
        },
        {
          label: 'MIFX - Skin Infection - fungal',
          value: 'MIFX',
        },
        {
          label: 'MIFZ - Other fungal infection',
          value: 'MIFZ',
        },
        {
          label: 'MIGB - Bacterial gastroenteritis (incl food poinsoning)',
          value: 'MIGB',
        },
        {
          label: 'MIGG - Amoebic dysentry',
          value: 'MIGG',
        },
        {
          label: 'MIGH - Viral hepatitis (A, B, or C)',
          value: 'MIGH',
        },
        {
          label: 'MIGV - Viral gastroenteritis',
          value: 'MIGV',
        },
        {
          label: 'MIGX - Gastrointestinal infection',
          value: 'MIGX',
        },
        {
          label: 'MIGZ - Other gastrointestinal infection',
          value: 'MIGZ',
        },
        {
          label: 'MIRB - Bronchitis',
          value: 'MIRB',
        },
        {
          label: 'MIRL - Other lower respiratory tract infection',
          value: 'MIRL',
        },
        {
          label: 'MIRN - Pneumonia',
          value: 'MIRN',
        },
        {
          label: 'MIRP - Pharyngitis',
          value: 'MIRP',
        },
        {
          label: 'MIRS - Sinusitis',
          value: 'MIRS',
        },
        {
          label: 'MIRT - Tonsillitis',
          value: 'MIRT',
        },
        {
          label: 'MIRU - Other upper resp tract infection',
          value: 'MIRU',
        },
        {
          label: 'MIRX - Respiratory tract infection (bacterial or viral)',
          value: 'MIRX',
        },
        {
          label: 'MISB - Skin infection pelvis/ buttock - incl ischial abscess',
          value: 'MISB',
        },
        {
          label: 'MISE - Skin infection elbow',
          value: 'MISE',
        },
        {
          label: 'MISF - Skin infection foot',
          value: 'MISF',
        },
        {
          label: 'MISH - Skin infection head/face/neck',
          value: 'MISH',
        },
        {
          label: 'MISL - Lymphadenopathy secondary to skin infection',
          value: 'MISL',
        },
        {
          label:
            'MISN - Skin infection toenail - incl infected ingrown toenail',
          value: 'MISN',
        },
        {
          label: 'MISQ - Skin infection lower leg',
          value: 'MISQ',
        },
        {
          label: 'MISW - Skin infection wrist/hand',
          value: 'MISW',
        },
        {
          label:
            'MISX - Skin Infection/ Cellulitis/ Abscess/ Infected Bursa - bacterial (excl infection complicating laceration - see ? KXQ)',
          value: 'MISX',
        },
        {
          label: 'MISZ - Other skin infection not specifically mentioned',
          value: 'MISZ',
        },
        {
          label: 'MIUC - Cyctitis',
          value: 'MIUC',
        },
        {
          label: 'MIUP - Pyelonephritis',
          value: 'MIUP',
        },
        {
          label: 'MIUS - Sexually transmitted disease',
          value: 'MIUS',
        },
        {
          label: 'MIUX - Genitourinary infection',
          value: 'MIUX',
        },
        {
          label: 'MIUZ - Other genitourinary infection',
          value: 'MIUZ',
        },
        {
          label: 'MIVC - Chicken Pox',
          value: 'MIVC',
        },
        {
          label: 'MIVG - Glandular Fever',
          value: 'MIVG',
        },
        {
          label:
            'MIVX - Systemic Viral Infection (excl viruses localised to one area)',
          value: 'MIVX',
        },
        {
          label: 'MIWF - Feet warts - incl plantar warts',
          value: 'MIWF',
        },
        {
          label: 'MIWH - Herpes simplex (incl scrum pox)',
          value: 'MIWH',
        },
        {
          label: 'MIWW - Wrist and hand warts',
          value: 'MIWW',
        },
        {
          label: 'MIWX - Skin infection - viral (incl warts)',
          value: 'MIWX',
        },
        {
          label: 'MIWZ - Other warts',
          value: 'MIWZ',
        },
        {
          label: 'MIXX - Infection',
          value: 'MIXX',
        },
        {
          label: 'MIZX - Other infection not otherwise specified',
          value: 'MIZX',
        },
        {
          label: 'MNBX - Brachial neuritis',
          value: 'MNBX',
        },
        {
          label: 'MNCX - Cerebral palsy',
          value: 'MNCX',
        },
        {
          label: 'MNEX - Epilepsy',
          value: 'MNEX',
        },
        {
          label: 'MNHC - Cluster headaches',
          value: 'MNHC',
        },
        {
          label: 'MNHM - Migraine',
          value: 'MNHM',
        },
        {
          label: 'MNHS - Sinus headache',
          value: 'MNHS',
        },
        {
          label:
            'MNHX - Headaches (excl. those exercise related or Msk in origin - see HZXX)',
          value: 'MNHX',
        },
        {
          label: 'MNHZ - Headache not otherwise specified',
          value: 'MNHZ',
        },
        {
          label: 'MNXX - Neurological Illness',
          value: 'MNXX',
        },
        {
          label: 'MNZM - Generalised tight muscles/ spasticity',
          value: 'MNZM',
        },
        {
          label: 'MNZX - Other neurological problem',
          value: 'MNZX',
        },
        {
          label: 'MOXX - Opthalmological Illness (excl trauma)',
          value: 'MOXX',
        },
        {
          label: 'MPAA - Asthma - allergic',
          value: 'MPAA',
        },
        {
          label: 'MPAE - Asthma - exericse induced only',
          value: 'MPAE',
        },
        {
          label:
            'MPAL - Allergy - rhinitis/ sinusitis/ hayfever (for urticaria see MDUX)',
          value: 'MPAL',
        },
        {
          label: 'MPAX - Asthma and/or allergy',
          value: 'MPAX',
        },
        {
          label: 'MPCX - Chronic airflow limitation',
          value: 'MPCX',
        },
        {
          label: 'MPFX - Cyctic Fibrosis',
          value: 'MPFX',
        },
        {
          label: 'MPIC - Confirmed COVID-19 infection',
          value: 'MPIC',
        },
        {
          label: 'MPIV - Suspected COVID-19 infection',
          value: 'MPIV',
        },
        {
          label: 'MPXX - Respiratory Disease',
          value: 'MPXX',
        },
        {
          label: 'MPZX - Other respiratory illness not otherwise specified',
          value: 'MPZX',
        },
        {
          label: 'MRFX - Fibromyalgia/ multiple sore muscle areas',
          value: 'MRFX',
        },
        {
          label: 'MRGA - Gout in ankle/ foot (incl big toe)',
          value: 'MRGA',
        },
        {
          label: 'MRGE - Gout in elbow',
          value: 'MRGE',
        },
        {
          label: 'MRGK - Gout in knee',
          value: 'MRGK',
        },
        {
          label: 'MRGP - Gout in hands/ fingers',
          value: 'MRGP',
        },
        {
          label: 'MRGX - Gout',
          value: 'MRGX',
        },
        {
          label: 'MRGZ - Gout in other location not otherwise specified',
          value: 'MRGZ',
        },
        {
          label:
            'MROX - Osteoarthritis - generalised (for OA isolated to one jt see ?AXX)',
          value: 'MROX',
        },
        {
          label: 'MRPK - Pseudogout in knee',
          value: 'MRPK',
        },
        {
          label: 'MRPX - Pseudogout',
          value: 'MRPX',
        },
        {
          label: 'MRPZ - Pseudogout in other joint/ location',
          value: 'MRPZ',
        },
        {
          label: 'MRRM - Rheumatoid arthritis affecting many joints',
          value: 'MRRM',
        },
        {
          label: 'MRRO - Rheumatoid arthritis affecting <4 joints',
          value: 'MRRO',
        },
        {
          label: 'MRRX - Rheumatoid arthritis',
          value: 'MRRX',
        },
        {
          label: 'MRSA - Anklylosing spondylitis',
          value: 'MRSA',
        },
        {
          label:
            'MRSM - Non specific seronegative arthritis affecting many joints',
          value: 'MRSM',
        },
        {
          label:
            'MRSO - Non specific seronegative arthritis affecting <4 joints',
          value: 'MRSO',
        },
        {
          label: 'MRSP - Psoriatic arthritis',
          value: 'MRSP',
        },
        {
          label: "MRSR - Reiter's syndrome",
          value: 'MRSR',
        },
        {
          label: 'MRSS - Non specific seronegative arthritis affecting SIJ',
          value: 'MRSS',
        },
        {
          label: 'MRSX - Seronegative arthritis',
          value: 'MRSX',
        },
        {
          label: 'MRXX - Rheumatological Illness',
          value: 'MRXX',
        },
        {
          label: 'MRZK - Inflammatory arthritis of knee',
          value: 'MRZK',
        },
        {
          label: 'MRZX - Rheumatological disease other/ undiagnosed',
          value: 'MRZX',
        },
        {
          label: 'MSAX - Anxiety/ panic disorder',
          value: 'MSAX',
        },
        {
          label: 'MSDX - Depression',
          value: 'MSDX',
        },
        {
          label: 'MSFA - Anorexia nervosa',
          value: 'MSFA',
        },
        {
          label: 'MSFB - Bulimia nervosa',
          value: 'MSFB',
        },
        {
          label: 'MSFE - Exercise addiction',
          value: 'MSFE',
        },
        {
          label: 'MSFF - Female athlete triad',
          value: 'MSFF',
        },
        {
          label: 'MSFX - Eating/ overexercising disorder in females',
          value: 'MSFX',
        },
        {
          label: 'MSMX - Eating/ overexercising disorder in males',
          value: 'MSMX',
        },
        {
          label: 'MSXX - Psychological/ psychiatric Illness',
          value: 'MSXX',
        },
        {
          label:
            'MSZX - Other psychological/ psychiatric disorder not otherwise specified',
          value: 'MSZX',
        },
        {
          label:
            'MTXX - ENT Illness including dental (excl sinusitis - see MPAL)',
          value: 'MTXX',
        },
        {
          label: 'MUGA - Other amenorrhoea',
          value: 'MUGA',
        },
        {
          label: 'MUGD - Dysmennorrhoea',
          value: 'MUGD',
        },
        {
          label: 'MUGE - Diet and Exercise associated amennorhoea',
          value: 'MUGE',
        },
        {
          label: 'MUGO - Oral contraceptive pill (OCP) Advice',
          value: 'MUGO',
        },
        {
          label: 'MUGX - Gynaecological Illness',
          value: 'MUGX',
        },
        {
          label: 'MUGZ - Other gynaecological illness',
          value: 'MUGZ',
        },
        {
          label: 'MUPE - Exercise advice',
          value: 'MUPE',
        },
        {
          label: 'MUPS - Pregnancy associated musculosketal injury',
          value: 'MUPS',
        },
        {
          label: 'MUPT - Request for pregnancy test',
          value: 'MUPT',
        },
        {
          label: 'MUPX - Pregnancy',
          value: 'MUPX',
        },
        {
          label: 'MUUH - Haematuria',
          value: 'MUUH',
        },
        {
          label: 'MUUX - Urinary Illness',
          value: 'MUUX',
        },
        {
          label: 'MUVX - Varicocoele',
          value: 'MUVX',
        },
        {
          label: 'MUXX - Genitourinary Illness (excl infection see MIGX)',
          value: 'MUXX',
        },
        {
          label: 'MVBD - Decompression sickness',
          value: 'MVBD',
        },
        {
          label: 'MVBX - Barotrauma',
          value: 'MVBX',
        },
        {
          label: 'MVHE - Hyperthermia/ heat stroke',
          value: 'MVHE',
        },
        {
          label: 'MVHO - Hypothermia',
          value: 'MVHO',
        },
        {
          label: 'MVHR - Rhabdomyolysis',
          value: 'MVHR',
        },
        {
          label: 'MVHS - Sunburn',
          value: 'MVHS',
        },
        {
          label: 'MVHX - Heat Illness',
          value: 'MVHX',
        },
        {
          label: 'MVXX - Environmental Illness',
          value: 'MVXX',
        },
        {
          label: 'MXXX - Medical Illness',
          value: 'MXXX',
        },
        {
          label: 'MYTX - Thyroid disorder',
          value: 'MYTX',
        },
        {
          label: 'MYXX - Endocrine Illness',
          value: 'MYXX',
        },
        {
          label: 'MYZX - Other endocrine disorder',
          value: 'MYZX',
        },
        {
          label: 'MZFX - Tired athlete undiagnosed',
          value: 'MZFX',
        },
        {
          label: 'MZIC - Self-isolation (contact tracing or household Covid)',
          value: 'MZIC',
        },
        {
          label: 'MZIQ - Quarantine after cross border travel',
          value: 'MZIQ',
        },
        {
          label: 'MZXX - Medical Illness Undiagnosed/ Other',
          value: 'MZXX',
        },
        {
          label: 'MZZF - Chronic Fatigue Syndrome',
          value: 'MZZF',
        },
        {
          label: 'MZZO - Obesity',
          value: 'MZZO',
        },
        {
          label: 'MZZX - Other medical illness',
          value: 'MZZX',
        },
        {
          label: 'NACX - Cervical spinal canal stenosis',
          value: 'NACX',
        },
        {
          label: 'NADX - Cervical disc degeneration',
          value: 'NADX',
        },
        {
          label: 'NAFX - Cervical facet joint arthritis',
          value: 'NAFX',
        },
        {
          label:
            'NAXX - Cervical spinal column degenerative disc disease/ arthritis ',
          value: 'NAXX',
        },
        {
          label: 'NCLP - Cervical Disc Prolapse',
          value: 'NCLP',
        },
        {
          label: 'NCLX - Cervical Disc sprain',
          value: 'NCLX',
        },
        {
          label: 'NCXX - Cervical Disc Injury',
          value: 'NCXX',
        },
        {
          label:
            'NFCA - Avulsion fracture/s cervical spine (e.g. spinous process fracture)',
          value: 'NFCA',
        },
        {
          label: 'NFCS - Stable cervical fracture/s',
          value: 'NFCS',
        },
        {
          label: 'NFCU - Unstable cervical fracture/s',
          value: 'NFCU',
        },
        {
          label: 'NFCX - Cervical Fracture/s',
          value: 'NFCX',
        },
        {
          label: 'NFLX - Laryngeal fracture',
          value: 'NFLX',
        },
        {
          label: 'NFXX - Neck Fracture',
          value: 'NFXX',
        },
        {
          label: 'NHXX - Neck Soft Tissue Bruising/ Haematoma',
          value: 'NHXX',
        },
        {
          label: 'NJLX - Facet Joint/ Neck Ligament sprain',
          value: 'NJLX',
        },
        {
          label:
            'NJPX - Cervical Facet joint pain/ chronic inflammation/ stiffness',
          value: 'NJPX',
        },
        {
          label: 'NJUX - Cervical Subluxation/ instability',
          value: 'NJUX',
        },
        {
          label: 'NJXX - Cervical Spine Facet Joint injuries',
          value: 'NJXX',
        },
        {
          label: 'NKXN - Neck laceration not requiring suturing',
          value: 'NKXN',
        },
        {
          label:
            'NKXQ - Complication of neck laceration/ abrasion including infection ',
          value: 'NKXQ',
        },
        {
          label: 'NKXS - Neck laceration requiring suturing',
          value: 'NKXS',
        },
        {
          label: 'NKXX - Neck Laceration/ Abrasion',
          value: 'NKXX',
        },
        {
          label: 'NMSX - Neck muscle strain',
          value: 'NMSX',
        },
        {
          label:
            'NMXX - Neck muscle and/or tendon strain/spasm/ trigger points',
          value: 'NMXX',
        },
        {
          label: 'NMYX - Neck muscle spasm/ trigger points incl torticollis',
          value: 'NMYX',
        },
        {
          label:
            'NNNX - Cervical nerve root compression/ stretch (proximal burner/ stinger)',
          value: 'NNNX',
        },
        {
          label: 'NNSC - Cervical spinal cord concussion',
          value: 'NNSC',
        },
        {
          label: 'NNSX - Cervical spinal cord injury',
          value: 'NNSX',
        },
        {
          label: 'NNXX - Neurological Neck Injury',
          value: 'NNXX',
        },
        {
          label: 'NOLF - Foreign body in larynx',
          value: 'NOLF',
        },
        {
          label: 'NOLX - Laryngeal trauma',
          value: 'NOLX',
        },
        {
          label: 'NOXX - Neck Organ Damage',
          value: 'NOXX',
        },
        {
          label: 'NWXX - Whiplash',
          value: 'NWXX',
        },
        {
          label: 'NXXX - Neck Injuries',
          value: 'NXXX',
        },
        {
          label: 'NZXX - Neck Pain/ Injury Not Otherwise Specified',
          value: 'NZXX',
        },
        {
          label: 'OGCX - Costoiliac impingement',
          value: 'OGCX',
        },
        {
          label: 'OGXX - Abdominal Biomechanical Injury',
          value: 'OGXX',
        },
        {
          label: 'OHXX - Abdominopelvic Soft Tissue Bruising/ Haematoma',
          value: 'OHXX',
        },
        {
          label: 'OKXN - Truncal laceration/ abrasion not requiring suturing',
          value: 'OKXN',
        },
        {
          label:
            'OKXQ - Complication of laceration/ abrasion to trunk - including infection',
          value: 'OKXQ',
        },
        {
          label: 'OKXS - Truncal laceration requiring suturing',
          value: 'OKXS',
        },
        {
          label: 'OKXX - Truncal Laceration/ Abrasion',
          value: 'OKXX',
        },
        {
          label: 'OMCX - Abdominal muscle cramps',
          value: 'OMCX',
        },
        {
          label: 'OMMO - Obliques muscle strain',
          value: 'OMMO',
        },
        {
          label: 'OMMR - Rectus abdominis muscle strain',
          value: 'OMMR',
        },
        {
          label: 'OMMT - Trasversus abdominis muscle strain',
          value: 'OMMT',
        },
        {
          label: 'OMMX - Truncal Muscle Strain',
          value: 'OMMX',
        },
        {
          label: 'OMWX - Winded',
          value: 'OMWX',
        },
        {
          label: 'OMXX - Truncal Muscle Strain/ Spasm/ Trigger points',
          value: 'OMXX',
        },
        {
          label: 'OMYR - Rectus abdominis trigger points/ spasm',
          value: 'OMYR',
        },
        {
          label: 'OMYX - Truncal Muscle Trigger Points/ Spasm',
          value: 'OMYX',
        },
        {
          label: 'OOIX - Intestinal trauma',
          value: 'OOIX',
        },
        {
          label: 'OOKX - Kidney trauma',
          value: 'OOKX',
        },
        {
          label: 'OOLX - Liver trauma',
          value: 'OOLX',
        },
        {
          label: 'OOMX - Multiple organ trauma',
          value: 'OOMX',
        },
        {
          label: 'OOPX - Pancreatic trauma',
          value: 'OOPX',
        },
        {
          label: 'OOSX - Spleen trauma',
          value: 'OOSX',
        },
        {
          label: 'OOXX - Abdominal Organ Injury',
          value: 'OOXX',
        },
        {
          label: 'OOZX - Other organ trauma not otherwise specified',
          value: 'OOZX',
        },
        {
          label: 'OPBX - Bladder trauma',
          value: 'OPBX',
        },
        {
          label: 'OPXX - Pelvic Organ Injury',
          value: 'OPXX',
        },
        {
          label: 'OTRD - Divarication of rectus abdominis',
          value: 'OTRD',
        },
        {
          label: 'OTRT - Rectus abdominus tendinopathy',
          value: 'OTRT',
        },
        {
          label: 'OTRX - Rectus abdominis tendon injury',
          value: 'OTRX',
        },
        {
          label: 'OTUX - Unbilical Hernia',
          value: 'OTUX',
        },
        {
          label: 'OTXX - Abdominal Tendon Injury',
          value: 'OTXX',
        },
        {
          label: 'OXXX - Chest Pain/ Injury Not elsewhere specified',
          value: 'OXXX',
        },
        {
          label: 'OZXX - Abdominal pain not otherwise specified',
          value: 'OZXX',
        },
        {
          label: 'OZZX - Abdominal pain undiagnosed',
          value: 'OZZX',
        },
        {
          label: 'QFFD - Fractured distal shaft fibula',
          value: 'QFFD',
        },
        {
          label: 'QFFM - Fractured mishaft fibula',
          value: 'QFFM',
        },
        {
          label:
            'QFFN - Fractured fibula with associated peroneal nerve injury',
          value: 'QFFN',
        },
        {
          label: 'QFFP - Fractured proximal fibula',
          value: 'QFFP',
        },
        {
          label:
            'QFFS - Fractured fibula with associated syndesmosis injury ankle',
          value: 'QFFS',
        },
        {
          label: 'QFFX - Fractured fibula',
          value: 'QFFX',
        },
        {
          label: 'QFTC - Compound midshaft fractured tibia +/- fibula',
          value: 'QFTC',
        },
        {
          label: 'QFTF - Fractured midshaft tibia and fibula',
          value: 'QFTF',
        },
        {
          label:
            'QFTQ - Fractured tibia +/- fibula with other complication (e.g. compartment syndrome)',
          value: 'QFTQ',
        },
        {
          label: 'QFTT - Fractured midshaft tibia',
          value: 'QFTT',
        },
        {
          label: 'QFTX - Fractured Midshaft Tibia +/- Fibula',
          value: 'QFTX',
        },
        {
          label: 'QFXX - Lower Leg Fractures',
          value: 'QFXX',
        },
        {
          label: 'QHAX - Shin contusion',
          value: 'QHAX',
        },
        {
          label: 'QHMA - Tib anterior haematoma',
          value: 'QHMA',
        },
        {
          label: 'QHML - Peroneal Haematoma',
          value: 'QHML',
        },
        {
          label: 'QHMP - Calf/ gastroc haematoma',
          value: 'QHMP',
        },
        {
          label: 'QHMX - Lower leg muscle haematoma',
          value: 'QHMX',
        },
        {
          label: 'QHTX - Pretibial periosteal bruising/ haematoma',
          value: 'QHTX',
        },
        {
          label: 'QHXX - Leg Soft Tissue Bruising/ Haematoma',
          value: 'QHXX',
        },
        {
          label:
            'QHZX - Other soft tissue bruising/haematoma not otherwise specified',
          value: 'QHZX',
        },
        {
          label: 'QKAX - Shin laceration/ abrasion',
          value: 'QKAX',
        },
        {
          label: 'QKPX - Calf laceration/ abrasion',
          value: 'QKPX',
        },
        {
          label:
            'QKXI - Infection as complication of lower leg laceration/ abrasion ',
          value: 'QKXI',
        },
        {
          label: 'QKXQ - Other complication of lower leg laceration/ abrasion',
          value: 'QKXQ',
        },
        {
          label: 'QKXX - Lower Leg Laceration/ Abrasion',
          value: 'QKXX',
        },
        {
          label: 'QMAX - Anterior compartment muscle injury',
          value: 'QMAX',
        },
        {
          label: 'QMCX - Calf cramping during exercise',
          value: 'QMCX',
        },
        {
          label: 'QMGL - Lateral gastroc strain',
          value: 'QMGL',
        },
        {
          label: 'QMGM - Medial gastroc strain',
          value: 'QMGM',
        },
        {
          label: 'QMGX - Gastrocnemius muscle injury/ strain',
          value: 'QMGX',
        },
        {
          label: 'QMLX - Lateral compartment muscle injury',
          value: 'QMLX',
        },
        {
          label: 'QMSA - Soleus strain a/w accessory soleus',
          value: 'QMSA',
        },
        {
          label: 'QMSX - Soleus Injury/ strain',
          value: 'QMSX',
        },
        {
          label: 'QMXX - Lower leg muscle Injury',
          value: 'QMXX',
        },
        {
          label: 'QMYD - Delayed onset muscle soreness',
          value: 'QMYD',
        },
        {
          label: 'QMYG - Gastroc muscle trigger points/ spasm',
          value: 'QMYG',
        },
        {
          label: 'QMYL - Lateral gastroc trigger points/ spasm',
          value: 'QMYL',
        },
        {
          label: 'QMYM - Medial gastroc trigger points/ spasm',
          value: 'QMYM',
        },
        {
          label: 'QMYP - Peroneal trigger points/ spasm',
          value: 'QMYP',
        },
        {
          label: 'QMYS - Soleus Trigger points/ Spasm',
          value: 'QMYS',
        },
        {
          label: 'QMYX - Calf muscle trigger points/ spasm',
          value: 'QMYX',
        },
        {
          label: 'QNPX - Peroneal nerve palsy (with foot drop)',
          value: 'QNPX',
        },
        {
          label: 'QNXX - Neurological Injury of Lower Leg',
          value: 'QNXX',
        },
        {
          label: 'QSFX - Stress fracture fibula',
          value: 'QSFX',
        },
        {
          label: 'QSTA - Anterior stress fracture tibia',
          value: 'QSTA',
        },
        {
          label: 'QSTP - Posteromedial stress fracture tibia',
          value: 'QSTP',
        },
        {
          label: 'QSTX - Stress fracture tibia',
          value: 'QSTX',
        },
        {
          label: 'QSXX - Fractured fibula',
          value: 'QSXX',
        },
        {
          label:
            'QTXX - Lower Leg Tendon Injuries (see knee or ankle depending on tendon location)',
          value: 'QTXX',
        },
        {
          label:
            'QVAX - Acute anterior compartment syndrome (excl that from fractured tibia - see QFTQ)',
          value: 'QVAX',
        },
        {
          label: 'QVVP - Popliteal artery entrapment',
          value: 'QVVP',
        },
        {
          label: 'QVVX - Other vascular injury to lower leg',
          value: 'QVVX',
        },
        {
          label: 'QVXX - Vascular Injury Lower Leg',
          value: 'QVXX',
        },
        {
          label: 'QVZX - Other acute compartment syndrome to lower leg',
          value: 'QVZX',
        },
        {
          label: 'QXXX - Knee Pain/ Injury Not otherwise specified',
          value: 'QXXX',
        },
        {
          label:
            'QYBA - Anterior shin periostitis/ stress syndrome/ shin splints',
          value: 'QYBA',
        },
        {
          label:
            'QYBP - Posteromedial shin periostitis/ stress syndrome/ shin splints',
          value: 'QYBP',
        },
        {
          label: 'QYBX - Tenoperiostitis of lower leg',
          value: 'QYBX',
        },
        {
          label: 'QYMA - Anterior compartment syndrome ',
          value: 'QYMA',
        },
        {
          label: 'QYMD - Deep posterior compartment syndrome',
          value: 'QYMD',
        },
        {
          label: 'QYML - Lateral (peroneal) compartment syndrome',
          value: 'QYML',
        },
        {
          label: 'QYMM - Compartment syndrome multiple sites lower leg',
          value: 'QYMM',
        },
        {
          label: 'QYMP - Posterior compartment syndrome',
          value: 'QYMP',
        },
        {
          label: 'QYMX - Chronic compartment syndrome lower leg',
          value: 'QYMX',
        },
        {
          label: 'QYXX - Other Leg Overuse Injury',
          value: 'QYXX',
        },
        {
          label: 'QZXX - Other Lower Leg Pain/ Injury not otherwise specified',
          value: 'QZXX',
        },
        {
          label: 'QZZX - Lower leg pain undiagnosed',
          value: 'QZZX',
        },
        {
          label: 'RFBX - Fracture radius and ulna midshaft',
          value: 'RFBX',
        },
        {
          label:
            'RFRG - Galleazzi fracture - midshaft radius fracture, dislocation DRUJ',
          value: 'RFRG',
        },
        {
          label: 'RFRX - fracture radius midshaft',
          value: 'RFRX',
        },
        {
          label:
            'RFUM - Monteggia Fracture - midshaft ulna fracture and dislocation radial head at elbow',
          value: 'RFUM',
        },
        {
          label: 'RFUX - Fractured ulna midshaft',
          value: 'RFUX',
        },
        {
          label: 'RFXX - Forearm fracture(s)',
          value: 'RFXX',
        },
        {
          label: 'RHXX - Forearm Soft Tissue Bruising/ Haematoma',
          value: 'RHXX',
        },
        {
          label:
            'RKXQ - Complication of forearm laceration/ abrasion including infection',
          value: 'RKXQ',
        },
        {
          label: 'RKXX - Forearm Laceration/ Abrasion',
          value: 'RKXX',
        },
        {
          label: 'RMEX - Forearm extensor muscle strain',
          value: 'RMEX',
        },
        {
          label: 'RMFX - Forearm flexor muscle strain',
          value: 'RMFX',
        },
        {
          label: 'RMXX - Forearm Muscle Injury',
          value: 'RMXX',
        },
        {
          label: 'RMYX - Forearm muscle soreness/ trigger points',
          value: 'RMYX',
        },
        {
          label: 'RNXX - Forearm Neurological Injury',
          value: 'RNXX',
        },
        {
          label: 'RSFX - Stress fracture radius and/or ulna',
          value: 'RSFX',
        },
        {
          label:
            'RSXX - Forearm Bony Stress/ Overuse Injury including Stress Fracture',
          value: 'RSXX',
        },
        {
          label: 'RTEI - Intersection syndrome',
          value: 'RTEI',
        },
        {
          label: 'RTES - Forearm extensor tenosynovitis',
          value: 'RTES',
        },
        {
          label: 'RTET - Forearm extensor tendinopathy',
          value: 'RTET',
        },
        {
          label: 'RTEX - Forearm extensor tendon injury',
          value: 'RTEX',
        },
        {
          label: 'RTFX - Forearm flexor tendon injury',
          value: 'RTFX',
        },
        {
          label: 'RTXX - Forearm Tendon Injury',
          value: 'RTXX',
        },
        {
          label: 'RXXX - Elbow Pain/ Injury not otherwise specified',
          value: 'RXXX',
        },
        {
          label: 'RYCX - Forearm compartment syndrome',
          value: 'RYCX',
        },
        {
          label: 'RYPX - Forearm splints/ medial ulnar stress syndrome',
          value: 'RYPX',
        },
        {
          label: 'RYXX - Other Stress/ Overuse injuries to Forearm',
          value: 'RYXX',
        },
        {
          label: 'RZXX - Forearm Pain/ Injury not otherwise specified',
          value: 'RZXX',
        },
        {
          label: 'SAAX - AC joint arthritis',
          value: 'SAAX',
        },
        {
          label: 'SAGX - Glenohumeral osteoarthritis',
          value: 'SAGX',
        },
        {
          label: 'SAXX - Shoulder Osteoarthritis',
          value: 'SAXX',
        },
        {
          label: 'SCXX - Shoulder Osteochondral Lesion',
          value: 'SCXX',
        },
        {
          label: 'SDAA - Shoulder dislocation with axillary nerve injury',
          value: 'SDAA',
        },
        {
          label: 'SDAG - Glenohumeral ligament tear',
          value: 'SDAG',
        },
        {
          label: 'SDAH - Shoulder dislocation with HAGL lesion',
          value: 'SDAH',
        },
        {
          label: 'SDAL - Shoulder dislocation with labral bankart lesion',
          value: 'SDAL',
        },
        {
          label:
            'SDAN - Shoulder dislocation with other or unspecified neurological injury',
          value: 'SDAN',
        },
        {
          label: 'SDAS - Shoulder dislocation with SLAP tear',
          value: 'SDAS',
        },
        {
          label: 'SDAX - Anteroinferior shoulder dislocation',
          value: 'SDAX',
        },
        {
          label: 'SDIX - Inferior shoulder dislocation',
          value: 'SDIX',
        },
        {
          label:
            'SDPL - Posterior shoulder dislocation with posterior labral lesion',
          value: 'SDPL',
        },
        {
          label: 'SDPX - Posterior shoulder dislocation',
          value: 'SDPX',
        },
        {
          label: 'SDXX - Acute Shoulder Dislocation',
          value: 'SDXX',
        },
        {
          label: 'SFCI - Fracture inner third clavicle',
          value: 'SFCI',
        },
        {
          label: 'SFCM - Fracture middle third clavicle',
          value: 'SFCM',
        },
        {
          label: 'SFCO - Fracture outer third clavicle',
          value: 'SFCO',
        },
        {
          label: 'SFCR - Refracture clavicle through callus',
          value: 'SFCR',
        },
        {
          label: 'SFCX - Clavicular fracture',
          value: 'SFCX',
        },
        {
          label: 'SFHH - Hill Sachs compression fracture',
          value: 'SFHH',
        },
        {
          label: 'SFHN - Fracture neck of humerus',
          value: 'SFHN',
        },
        {
          label: 'SFHT - Fracture greater tuberosity humerus',
          value: 'SFHT',
        },
        {
          label: 'SFHX - Humerus Fracture',
          value: 'SFHX',
        },
        {
          label: 'SFMX - Multiple stress fractures pelvis',
          value: 'SFMX',
        },
        {
          label: 'SFSB - Fractured glenoid = bony bankart lesion',
          value: 'SFSB',
        },
        {
          label: 'SFSX - Scapula fracture',
          value: 'SFSX',
        },
        {
          label: 'SFXX - Shoulder Fractures',
          value: 'SFXX',
        },
        {
          label: 'SGAX - Synovitis AC joint',
          value: 'SGAX',
        },
        {
          label: 'SGCX - Adhesive Capsulitis',
          value: 'SGCX',
        },
        {
          label: 'SGIA - Acute anterior internal impingement',
          value: 'SGIA',
        },
        {
          label: 'SGIC - Chronic internal impingment',
          value: 'SGIC',
        },
        {
          label: 'SGIP - Acute posterior internal impingement',
          value: 'SGIP',
        },
        {
          label: 'SGIX - Internal impingement of the shoulder',
          value: 'SGIX',
        },
        {
          label: 'SGSA - Acute subacromial impingement',
          value: 'SGSA',
        },
        {
          label: 'SGSC - Other chronic subacromial impingement',
          value: 'SGSC',
        },
        {
          label: 'SGSI - Instability associated subacromial impingement',
          value: 'SGSI',
        },
        {
          label: 'SGSP - Posture associated impingement',
          value: 'SGSP',
        },
        {
          label: 'SGSX - Subacromial impingement',
          value: 'SGSX',
        },
        {
          label: 'SGXX - Shoulder impingement/ Synovitis',
          value: 'SGXX',
        },
        {
          label: 'SHAX - AC Joint contusion',
          value: 'SHAX',
        },
        {
          label: 'SHMD - Deltoid haematoma',
          value: 'SHMD',
        },
        {
          label: 'SHMR - Rotator Cuff haematoma',
          value: 'SHMR',
        },
        {
          label: 'SHMT - Trapezius haematoma',
          value: 'SHMT',
        },
        {
          label: 'SHMX - Shoulder muscle haematoma',
          value: 'SHMX',
        },
        {
          label: 'SHXX - Shoulder Soft Tissue Bruising/ Haematoma',
          value: 'SHXX',
        },
        {
          label: 'SHZX - AC Joint contusion',
          value: 'SHZX',
        },
        {
          label: 'SJAD - Grade 3 AC joint dislocation',
          value: 'SJAD',
        },
        {
          label: 'SJAF - Fracture dislocation AC joint',
          value: 'SJAF',
        },
        {
          label: 'SJAR - Grade 4 - 6 AC joint dislocation',
          value: 'SJAR',
        },
        {
          label: 'SJAS - Grade 1 AC joint sprain',
          value: 'SJAS',
        },
        {
          label: 'SJAT - Grade 2 AC joint sprain',
          value: 'SJAT',
        },
        {
          label: 'SJAX - Acromioclavicular joint sprain',
          value: 'SJAX',
        },
        {
          label: 'SJSA - Anteroinferior shoulder subluxation',
          value: 'SJSA',
        },
        {
          label: 'SJSL - Glenohumeral ligament sprain',
          value: 'SJSL',
        },
        {
          label: 'SJSP - Posterior shoulder subluxation',
          value: 'SJSP',
        },
        {
          label:
            'SJSQ - Glenohumeral joint sprain with chondral/ labral damage (incl SLAP tear)',
          value: 'SJSQ',
        },
        {
          label: 'SJSX - Glenohumeral joint sprains',
          value: 'SJSX',
        },
        {
          label: 'SJXX - Acute Shoulder Sprains/ Subluxation',
          value: 'SJXX',
        },
        {
          label: 'SKXN - Shoulder laceration/ abrasion not requiring suturing',
          value: 'SKXN',
        },
        {
          label:
            'SKXQ - Complication of shoulder laceration/ abrasion including infection',
          value: 'SKXQ',
        },
        {
          label: 'SKXS - Shoulder laceration requiring suturing',
          value: 'SKXS',
        },
        {
          label: 'SKXX - Shoulder Soft Tissue Laceration/ Abrasion',
          value: 'SKXX',
        },
        {
          label: 'SMDX - Deltoid muscle injury',
          value: 'SMDX',
        },
        {
          label: 'SMLX - Latissimus Dorsi muscle injury',
          value: 'SMLX',
        },
        {
          label: 'SMPX - Pectoralis major muscle injury',
          value: 'SMPX',
        },
        {
          label: 'SMRX - Rotator Cuff muscle injury',
          value: 'SMRX',
        },
        {
          label: 'SMXX - Shoulder muscle strain/ spasm/ trigger points',
          value: 'SMXX',
        },
        {
          label:
            'SMYX - Shoulder muscle trigger points/ posterior muscle soreness',
          value: 'SMYX',
        },
        {
          label: 'SMZX - Other shoulder muscle injury not elsewhere specified',
          value: 'SMZX',
        },
        {
          label:
            'SNAX - Isolated axillary nerve palsy (excl ax n palsy due to Shoulder dislocation - SDAA)',
          value: 'SNAX',
        },
        {
          label: 'SNBX - Brachial plexus traction injury/ burner/ stinger',
          value: 'SNBX',
        },
        {
          label: 'SNSX - Suprascapular nerve palsy',
          value: 'SNSX',
        },
        {
          label: 'SNTX - Thoracic Outlet Syndrome',
          value: 'SNTX',
        },
        {
          label: 'SNVS - Subclavian vein obstruction',
          value: 'SNVS',
        },
        {
          label: 'SNVX - Shoulder vascular injury',
          value: 'SNVX',
        },
        {
          label: 'SNXX - Shoulder Neurological/ vascular injury',
          value: 'SNXX',
        },
        {
          label: 'SSAO - Osteolysis of distal clavicle',
          value: 'SSAO',
        },
        {
          label: 'SSAX - AC joint stress/ overuse injury',
          value: 'SSAX',
        },
        {
          label: 'SSFS - Stress fracture coracoid process',
          value: 'SSFS',
        },
        {
          label: 'SSFX - Shoulder bony stress/ over use injury',
          value: 'SSFX',
        },
        {
          label: 'SSXS - Scapula Dyskinesis of shoulder joint',
          value: 'SSXS',
        },
        {
          label:
            'SSXX - Shoulder stress/ Overuse injuries incl stress fractures',
          value: 'SSXX',
        },
        {
          label:
            'SSZX - Other Bony/ overuse injuries noth elsewhere classified',
          value: 'SSZX',
        },
        {
          label: 'STBR - Long head of biceps tendon rupture',
          value: 'STBR',
        },
        {
          label: 'STBT - Biceps tendinopathy',
          value: 'STBT',
        },
        {
          label: 'STBX - Proximal biceps tendon injury',
          value: 'STBX',
        },
        {
          label: 'STBZ - Other biceps tendon injury not otherwise specified',
          value: 'STBZ',
        },
        {
          label: 'STCR - Subscapularis tendon rupture',
          value: 'STCR',
        },
        {
          label: 'STCX - Subscapularis Tendon Injury',
          value: 'STCX',
        },
        {
          label:
            'STCZ - Other Subscapularis tendon injury not otherwise specified',
          value: 'STCZ',
        },
        {
          label: 'STIR - Infraspinatus tendon rupture',
          value: 'STIR',
        },
        {
          label: 'STIX - Infraspinatus tendon injury',
          value: 'STIX',
        },
        {
          label:
            'STIZ - Other Infraspinatus tendon injury Not otherwise specified',
          value: 'STIZ',
        },
        {
          label: 'STMS - Multiple tendon strain/ rupture',
          value: 'STMS',
        },
        {
          label: 'STMT - Multiple tendinopathy',
          value: 'STMT',
        },
        {
          label: 'STMX - Multiple tendon injury',
          value: 'STMX',
        },
        {
          label: 'STPR - Pec Major tendon rupture',
          value: 'STPR',
        },
        {
          label: 'STPX - Pectoralis major tendon injury',
          value: 'STPX',
        },
        {
          label: 'STPZ - Other pec major tendon injury not otherwise specified',
          value: 'STPZ',
        },
        {
          label: 'STSC - Calcific tendinopathy',
          value: 'STSC',
        },
        {
          label: 'STSP - Supraspinatus tendon tear partial thickness',
          value: 'STSP',
        },
        {
          label: 'STSR - Suprapinatus tendon rupture full thickness',
          value: 'STSR',
        },
        {
          label: 'STST - Supraspinatus tendinopathy',
          value: 'STST',
        },
        {
          label: 'STSX - Supraspinatus tendon injury',
          value: 'STSX',
        },
        {
          label:
            'STSZ - Other supraspinatus tendon injur noth otherwsie specified',
          value: 'STSZ',
        },
        {
          label: 'STXX - Shoulder Tendon Overuse Injury/ Strain',
          value: 'STXX',
        },
        {
          label: 'STZX - Other tendon injury NOS',
          value: 'STZX',
        },
        {
          label:
            'SUAI - Anteroinferior instability shoulder with RC bruising/ impingement',
          value: 'SUAI',
        },
        {
          label:
            'SUAL - Anteroinferior instability with labral lesion incl SLAP',
          value: 'SUAL',
        },
        {
          label: 'SUAX - Anteroinferior instability of shoulder',
          value: 'SUAX',
        },
        {
          label: 'SUBX - SLAP Lesion',
          value: 'SUBX',
        },
        {
          label: 'SUCX - AC Joint instability/ recurrent sprains',
          value: 'SUCX',
        },
        {
          label: 'SUPX - Posterior instability',
          value: 'SUPX',
        },
        {
          label: 'SUXX - Chronic Shoulder instability',
          value: 'SUXX',
        },
        {
          label: 'SXXX - Neck Pain/ Injury Not Otherwise Specified',
          value: 'SXXX',
        },
        {
          label: 'SZXX - Shoulder Pain/ Injury not otherwise specified',
          value: 'SZXX',
        },
        {
          label: 'TFFX - Fractured femoral shaft',
          value: 'TFFX',
        },
        {
          label: 'TFXX - Thigh Fractures',
          value: 'TFXX',
        },
        {
          label: 'THMA - Adductor muscle haematoma',
          value: 'THMA',
        },
        {
          label: 'THMB - Acute artherial bleed thigh',
          value: 'THMB',
        },
        {
          label: 'THMH - Hamstring muscle haematoma',
          value: 'THMH',
        },
        {
          label: 'THMI - ITB Haematoma',
          value: 'THMI',
        },
        {
          label: 'THMQ - Quadriceps muscle haematoma',
          value: 'THMQ',
        },
        {
          label: 'THMX - Thigh muscle haematoma',
          value: 'THMX',
        },
        {
          label: 'THOX - Myositis ossificans thigh',
          value: 'THOX',
        },
        {
          label: 'THXX - Thigh Soft Tissue Bruising/ Haematoma',
          value: 'THXX',
        },
        {
          label:
            'THZX - Other soft tissue bruising/ haematoma not otherwise specified',
          value: 'THZX',
        },
        {
          label: 'TKXQ - Complication of laceration/ abrasion incl. infection',
          value: 'TKXQ',
        },
        {
          label: 'TKXX - Thigh Laceration/ Abrasion',
          value: 'TKXX',
        },
        {
          label: 'TMAL - Adductor longus strain',
          value: 'TMAL',
        },
        {
          label: 'TMAM - Adductor magnus strain',
          value: 'TMAM',
        },
        {
          label: 'TMAR - Adductor muscle rupture/ grade 3 strain',
          value: 'TMAR',
        },
        {
          label: 'TMAX - Adductor strain',
          value: 'TMAX',
        },
        {
          label: 'TMCA - Adductor muscle cramping suring exercise',
          value: 'TMCA',
        },
        {
          label: 'TMCH - Hamstring cramping during exercise',
          value: 'TMCH',
        },
        {
          label: 'TMCQ - Quadricep cramping during exercise',
          value: 'TMCQ',
        },
        {
          label: 'TMCX - Thigh muscle cramping during exercise',
          value: 'TMCX',
        },
        {
          label:
            'TMGQ - Quadriceps wasting (excl. that where patellofemoral pain is clinical diagnosis)',
          value: 'TMGQ',
        },
        {
          label: 'TMGX - Thigh muscle wasting',
          value: 'TMGX',
        },
        {
          label: 'TMHB - Biceps femoris strain grade 1 - 2',
          value: 'TMHB',
        },
        {
          label: 'TMHR - Grade 3 hamstring strain',
          value: 'TMHR',
        },
        {
          label: 'TMHS - Semimembranosis/ tendinosis strain (grade 1 - 2)',
          value: 'TMHS',
        },
        {
          label: 'TMHX - Hamstring strain',
          value: 'TMHX',
        },
        {
          label: 'TMLH - Back referred hamstring tightness',
          value: 'TMLH',
        },
        {
          label: 'TMLX - Back referred muscle tightness',
          value: 'TMLX',
        },
        {
          label: 'TMQR - Rectus femoris rupture',
          value: 'TMQR',
        },
        {
          label: 'TMQS - Rectus femoris strain',
          value: 'TMQS',
        },
        {
          label: 'TMQV - Other quadricep strain',
          value: 'TMQV',
        },
        {
          label: 'TMQW - Other quadricep rupture',
          value: 'TMQW',
        },
        {
          label: 'TMQX - Quadriceps Strain',
          value: 'TMQX',
        },
        {
          label: 'TMXX - Thigh Muscle strain/ Spasm/ Trigger Points',
          value: 'TMXX',
        },
        {
          label: 'TMYA - Adductor trigger points',
          value: 'TMYA',
        },
        {
          label: 'TMYH - Hamstring trigger points',
          value: 'TMYH',
        },
        {
          label: 'TMYQ - Quadricep trigger points',
          value: 'TMYQ',
        },
        {
          label: 'TMYX - Thigh muscle trigger points',
          value: 'TMYX',
        },
        {
          label: 'TNEL - Lateral cutaneous nerve of thigh entrapment',
          value: 'TNEL',
        },
        {
          label: 'TNEX - Nerve entrapment in thigh',
          value: 'TNEX',
        },
        {
          label: 'TNXX - Thigh Neurological Injury',
          value: 'TNXX',
        },
        {
          label: 'TSFX - Femoral shaft stress fracture',
          value: 'TSFX',
        },
        {
          label: 'TSXX - Thigh Stress Fractures',
          value: 'TSXX',
        },
        {
          label:
            'TTXX - Thigh Tendon Injuries (see Hip/ groin or knee depending on tendon location)',
          value: 'TTXX',
        },
        {
          label: 'TXXX - Hip/ Groin Pain Not otherwise specified',
          value: 'TXXX',
        },
        {
          label: 'TYCX - Compartment Syndrome of Thigh',
          value: 'TYCX',
        },
        {
          label: 'TYPX - Tenoperiostitis of Thigh',
          value: 'TYPX',
        },
        {
          label: 'TYXX - Other stress/ Overuse Injuries to Thigh',
          value: 'TYXX',
        },
        {
          label: 'TZXX - Thigh pain/ Injury Not otherwise specified',
          value: 'TZXX',
        },
        {
          label: 'TZZX - Thigh pain undiagnosed',
          value: 'TZZX',
        },
        {
          label: 'UFHM - Midshaft humerus fracture',
          value: 'UFHM',
        },
        {
          label: 'UFHX - Humerus Fracture',
          value: 'UFHX',
        },
        {
          label: 'UFXX - Upper Arm Fracture',
          value: 'UFXX',
        },
        {
          label: 'UHMB - Biceps haematoma',
          value: 'UHMB',
        },
        {
          label: 'UHMO - Upper arm myositis ossificans',
          value: 'UHMO',
        },
        {
          label: 'UHMT - Triceps Haematoma',
          value: 'UHMT',
        },
        {
          label: 'UHMX - Upper arm muscle bruising/ haematoma',
          value: 'UHMX',
        },
        {
          label: 'UHXX - Upper Arm Soft Tissue Bruising/ Haematoma',
          value: 'UHXX',
        },
        {
          label: 'UHZX - Other Upper arm soft tissue bruising/ haematoma',
          value: 'UHZX',
        },
        {
          label: 'UKXN - Upper arm laceration/ abrasion not requiring suturing',
          value: 'UKXN',
        },
        {
          label:
            'UKXQ - Complication of upper arm laceration/ abrasion including infection',
          value: 'UKXQ',
        },
        {
          label: 'UKXS - Upper arm laceration requiring suturing',
          value: 'UKXS',
        },
        {
          label: 'UKXX - Upper Arm Laceration/ Abrasion',
          value: 'UKXX',
        },
        {
          label: 'UMBX - Biceps muscle strain',
          value: 'UMBX',
        },
        {
          label: 'UMTX - Triceps muscle strain',
          value: 'UMTX',
        },
        {
          label: 'UMXX - Upper Arm Muscle Strain/ Spasm/ Trigger points',
          value: 'UMXX',
        },
        {
          label: 'UMYD - Upper arm DOMS',
          value: 'UMYD',
        },
        {
          label: 'UMYT - Upper arm trigger points/ spasm',
          value: 'UMYT',
        },
        {
          label: 'UMYX - Upper arm muscle trigger points/ pain',
          value: 'UMYX',
        },
        {
          label: 'UNMX - Median nerve injury upper arm',
          value: 'UNMX',
        },
        {
          label: 'UNRX - Radial nerve injury upper arm',
          value: 'UNRX',
        },
        {
          label: 'UNSX - Musculocutaneous nerve injury upper arm',
          value: 'UNSX',
        },
        {
          label: 'UNUX - Ulnar nerve injury upper arm',
          value: 'UNUX',
        },
        {
          label: 'UNXX - Upper Arm neurological injury',
          value: 'UNXX',
        },
        {
          label: 'USFH - Stress fracture humerus',
          value: 'USFH',
        },
        {
          label: 'USFX - Upper arm stress fracture',
          value: 'USFX',
        },
        {
          label: 'USXX - Upper Arm Bony Stress / Overuse Injury',
          value: 'USXX',
        },
        {
          label: 'UTXX - Upper Arm Tendon Injury',
          value: 'UTXX',
        },
        {
          label: 'UXXX - Shoulder Pain/ Injury not otherwise specified',
          value: 'UXXX',
        },
        {
          label:
            'UYTX - Upper arm soft tissue overuse injury (e.g. periostitis)',
          value: 'UYTX',
        },
        {
          label: 'UYXX - Other Upper Arm Overuse Injury',
          value: 'UYXX',
        },
        {
          label: 'UZXX - Upper Arm Pain/ Injury not otherwise specified',
          value: 'UZXX',
        },
        {
          label: 'VASI - Infection of stump',
          value: 'VASI',
        },
        {
          label: 'VASS - Stump skin pressure sores',
          value: 'VASS',
        },
        {
          label: 'VASX - Stump Problem',
          value: 'VASX',
        },
        {
          label: 'VASZ - Other stump injury',
          value: 'VASZ',
        },
        {
          label: 'VAXX - Injury/ Illness in an amputee athete',
          value: 'VAXX',
        },
        {
          label: 'VWAX - Autonomic dysreflexia',
          value: 'VWAX',
        },
        {
          label: 'VWSX - Skin pressure sores',
          value: 'VWSX',
        },
        {
          label: 'VWUI - Urinary infection',
          value: 'VWUI',
        },
        {
          label: 'VWUR - Urinary retention/ blocked catheter',
          value: 'VWUR',
        },
        {
          label: 'VWUX - Urinary problem',
          value: 'VWUX',
        },
        {
          label:
            'VWXX - Injury/ illness specific to a Spinal Cord Injured athlete',
          value: 'VWXX',
        },
        {
          label:
            'VXXX - Disabled Athlete Injuries/Illnesses (where specifically due to that disability)',
          value: 'VXXX',
        },
        {
          label:
            'VZXX - Injury/ Illness Specific to Disabled Athletes not elsewhere specified',
          value: 'VZXX',
        },
        {
          label: 'WAFD - DIP jt OA fingers',
          value: 'WAFD',
        },
        {
          label: 'WAFM - MCP jt OA fingers',
          value: 'WAFM',
        },
        {
          label: 'WAFP - PIP jt OA fingers',
          value: 'WAFP',
        },
        {
          label: 'WAFX - Osteoarthritis of fingers',
          value: 'WAFX',
        },
        {
          label: 'WAPC - CMC jt OA',
          value: 'WAPC',
        },
        {
          label: 'WAPI - IP jt OA',
          value: 'WAPI',
        },
        {
          label: 'WAPM - MCP jt OA',
          value: 'WAPM',
        },
        {
          label: 'WAPX - Osteoarthritis of thumb',
          value: 'WAPX',
        },
        {
          label: 'WAWS - SLAC Wrist (post S-L tear)',
          value: 'WAWS',
        },
        {
          label: 'WAWX - Wrist osteoarthritis',
          value: 'WAWX',
        },
        {
          label: 'WAXX - Wrist and Hand Osteoarthritis',
          value: 'WAXX',
        },
        {
          label: 'WCXX - Wrist and Hand Osteochondral/ Chondral Injury',
          value: 'WCXX',
        },
        {
          label: 'WDCX - Dislocation through carpus',
          value: 'WDCX',
        },
        {
          label: 'WDDX - DRUJ dislocation',
          value: 'WDDX',
        },
        {
          label: 'WDFA - PIP joint dislocation index finger',
          value: 'WDFA',
        },
        {
          label: 'WDFB - PIP joint dislocation middle finger',
          value: 'WDFB',
        },
        {
          label: 'WDFC - PIP joint dislocation ring finger',
          value: 'WDFC',
        },
        {
          label: 'WDFD - PIP joint dislocation little finger',
          value: 'WDFD',
        },
        {
          label: 'WDFE - DIP joint dislocation index finger',
          value: 'WDFE',
        },
        {
          label: 'WDFF - DIP joint dislocation middle finger',
          value: 'WDFF',
        },
        {
          label: 'WDFG - DIP joint dislocation ring finger',
          value: 'WDFG',
        },
        {
          label: 'WDFH - DIP joint dislocation little finger',
          value: 'WDFH',
        },
        {
          label: 'WDFM - Multiple PIP and/or DIP joint dislocations',
          value: 'WDFM',
        },
        {
          label:
            'WDFQ - Complication of PIP/ DIP joint dislocation (excl chr instability see WUFX)',
          value: 'WDFQ',
        },
        {
          label: 'WDFV - Finger joint dislocation with volar plate injury',
          value: 'WDFV',
        },
        {
          label: 'WDFW - PIP joint dislocation finger unknown',
          value: 'WDFW',
        },
        {
          label: 'WDFX - Dislocation of PIP or DIP joint(s) ',
          value: 'WDFX',
        },
        {
          label: 'WDFY - DIP joint dislocation finger unknown',
          value: 'WDFY',
        },
        {
          label: 'WDMA - MCP jt dislocation index finger',
          value: 'WDMA',
        },
        {
          label: 'WDMB - MCP jt dislocation middle finger',
          value: 'WDMB',
        },
        {
          label: 'WDMC - MCP jt dislocation ring finger',
          value: 'WDMC',
        },
        {
          label: 'WDMD - MCP jt dislocation little finger',
          value: 'WDMD',
        },
        {
          label: 'WDMM - MCP jt dislocation of two or more fingers',
          value: 'WDMM',
        },
        {
          label:
            'WDMQ - Complication of finger MCP jt sprain (excl instability see WUMX)',
          value: 'WDMQ',
        },
        {
          label: 'WDMX - Dislocation of MCP joint finger(s)',
          value: 'WDMX',
        },
        {
          label: 'WDPC - Dislocation CMC joint thumb',
          value: 'WDPC',
        },
        {
          label: 'WDPI - Dislocation of IP joint thumb',
          value: 'WDPI',
        },
        {
          label: 'WDPM - Dislocation of MCP joint thumb',
          value: 'WDPM',
        },
        {
          label:
            'WDPQ - Complication of thumb joint dislocation excl instability - see WUPX',
          value: 'WDPQ',
        },
        {
          label: 'WDPX - Dislocation of thumb joint',
          value: 'WDPX',
        },
        {
          label: 'WDTX - Dislocation of CMC joint of fingers',
          value: 'WDTX',
        },
        {
          label: 'WDWX - Radiocarpal joint dislocation',
          value: 'WDWX',
        },
        {
          label: 'WDXX - Wrist and Hand Dislocations',
          value: 'WDXX',
        },
        {
          label: 'WFCM - Fracture multiple carpal bones',
          value: 'WFCM',
        },
        {
          label: 'WFCX - Fracture other carpal bone',
          value: 'WFCX',
        },
        {
          label: 'WFFA - Proximal phalanx fracture index finger',
          value: 'WFFA',
        },
        {
          label: 'WFFB - Proximal phalanx fracture middle finger',
          value: 'WFFB',
        },
        {
          label: 'WFFC - Proximal phalanx fracture ringfinger',
          value: 'WFFC',
        },
        {
          label: 'WFFD - Proximal phalanx fracture little finger',
          value: 'WFFD',
        },
        {
          label: 'WFFE - Middle phalanx fracture index finger',
          value: 'WFFE',
        },
        {
          label: 'WFFF - Middle phalanx fracture middle finger',
          value: 'WFFF',
        },
        {
          label: 'WFFG - Middle phalanx fracture ringfinger',
          value: 'WFFG',
        },
        {
          label: 'WFFH - Middle phalanx fracture little finger',
          value: 'WFFH',
        },
        {
          label: 'WFFI - Distal phalanx fracture index finger',
          value: 'WFFI',
        },
        {
          label: 'WFFJ - Distal phalanx fracture middle finger',
          value: 'WFFJ',
        },
        {
          label: 'WFFK - Distal phalanx fracture ringfinger',
          value: 'WFFK',
        },
        {
          label: 'WFFL - Distal phalanx fracture little finger',
          value: 'WFFL',
        },
        {
          label: 'WFFM - Multiple phalangeal fractures fingers',
          value: 'WFFM',
        },
        {
          label: 'WFFQ - Complication from finger fracture (incl malunion)',
          value: 'WFFQ',
        },
        {
          label: 'WFFX - Fracture finger(s) - excl avulsion fractures',
          value: 'WFFX',
        },
        {
          label: 'WFHH - Fractured hook of hamate',
          value: 'WFHH',
        },
        {
          label: 'WFHX - Fractured hamate',
          value: 'WFHX',
        },
        {
          label: 'WFMA - Fracture 2nd metacarpal',
          value: 'WFMA',
        },
        {
          label: 'WFMB - Fracture 3rd metacarpal',
          value: 'WFMB',
        },
        {
          label: 'WFMC - Fracture 4th metacarpal',
          value: 'WFMC',
        },
        {
          label: 'WFMD - Fracture 5th metacarpal',
          value: 'WFMD',
        },
        {
          label: 'WFMM - Multiple metacarpal fractures',
          value: 'WFMM',
        },
        {
          label: 'WFMX - Fracture metacarpals 2- 5',
          value: 'WFMX',
        },
        {
          label: "WFPB - Bennett's fracture thumb - base 1st MC",
          value: 'WFPB',
        },
        {
          label: 'WFPD - Fracture distal phalanx thumb',
          value: 'WFPD',
        },
        {
          label: 'WFPM - Fracture shaft 1st MC',
          value: 'WFPM',
        },
        {
          label: 'WFPP - Fracture proximal phalanx of thumb',
          value: 'WFPP',
        },
        {
          label: 'WFPR - Rolando fracture (comminuted fracture base 1st MC)',
          value: 'WFPR',
        },
        {
          label: 'WFPX - Fractured thumb',
          value: 'WFPX',
        },
        {
          label: 'WFRC - Colles fracture distal radius',
          value: 'WFRC',
        },
        {
          label: 'WFRQ - Wrist fracture with complication (e.g. EPL rupture)',
          value: 'WFRQ',
        },
        {
          label: 'WFRS - Smiths fracture distal radius',
          value: 'WFRS',
        },
        {
          label: 'WFRT - Fracture radial styloid',
          value: 'WFRT',
        },
        {
          label: 'WFRX - Fracture of distal radius +/- ulna',
          value: 'WFRX',
        },
        {
          label: 'WFSD - Fracture distal pole scaphoid',
          value: 'WFSD',
        },
        {
          label: 'WFSN - Non union fractured scaphoid',
          value: 'WFSN',
        },
        {
          label: 'WFSP - Fracture proximal pole scaphoid',
          value: 'WFSP',
        },
        {
          label: 'WFSW - Fracture wrist scaphoid',
          value: 'WFSW',
        },
        {
          label: 'WFSX - Scaphoid fracture',
          value: 'WFSX',
        },
        {
          label: 'WFTX - Fractured trapezium',
          value: 'WFTX',
        },
        {
          label: 'WFUT - Fracture of ulna styloid',
          value: 'WFUT',
        },
        {
          label: 'WFUX - Fracture of distal ulna',
          value: 'WFUX',
        },
        {
          label: 'WFXX - Wrist and Hand Fractures',
          value: 'WFXX',
        },
        {
          label: 'WGFD - Chronic synovitis of DIP joint(s)',
          value: 'WGFD',
        },
        {
          label: 'WGFM - Chronic synovitis of MCP joint(s)',
          value: 'WGFM',
        },
        {
          label: 'WGFP - Chronic synovitis of PIP joint(s)',
          value: 'WGFP',
        },
        {
          label: 'WGFX - Chronic synovitis of fingers',
          value: 'WGFX',
        },
        {
          label: 'WGPC - Chronic synovitis of 1st CMC joint ',
          value: 'WGPC',
        },
        {
          label: 'WGPI - Chronic Synovitis of IP joint thumb',
          value: 'WGPI',
        },
        {
          label: 'WGPM - Chronic synovitis of 1st MCP joint',
          value: 'WGPM',
        },
        {
          label: 'WGPX - Chronic synovitis of thumb',
          value: 'WGPX',
        },
        {
          label: 'WGWU - Ulnar abutment syndrome',
          value: 'WGWU',
        },
        {
          label: 'WGWX - Chronic synovitis of wrist',
          value: 'WGWX',
        },
        {
          label: 'WGXX - Wrist and Hand Impingement/ Synovitis',
          value: 'WGXX',
        },
        {
          label: 'WHFU - Fingernail haematoma',
          value: 'WHFU',
        },
        {
          label: 'WHFX - Finger bruising/ haematoma',
          value: 'WHFX',
        },
        {
          label: 'WHHX - Hand bruising/ haematoma',
          value: 'WHHX',
        },
        {
          label: 'WHPU - Thumbnail haematoma',
          value: 'WHPU',
        },
        {
          label: 'WHPX - Thumb bruising/ haematoma',
          value: 'WHPX',
        },
        {
          label: 'WHWX - Wrist bruising/ haematoma',
          value: 'WHWX',
        },
        {
          label: 'WHXX - Wrist and Hand Soft Tissue Bruising/ Haematoma',
          value: 'WHXX',
        },
        {
          label: 'WJCV - Lunate - triquetral sprain',
          value: 'WJCV',
        },
        {
          label: 'WJCX - Other carpal ligament injury',
          value: 'WJCX',
        },
        {
          label: 'WJDT - Triangular fibrocartilage complex tear',
          value: 'WJDT',
        },
        {
          label: 'WJDX - Distal radioulnar joint injury',
          value: 'WJDX',
        },
        {
          label:
            'WJFQ - Complication of finger joint sprain excl. chronic instability',
          value: 'WJFQ',
        },
        {
          label: 'WJFX - Finger joint sprain (PIP and DIP joints)',
          value: 'WJFX',
        },
        {
          label:
            'WJMQ - Complication of MCP jt sprain excl chronic instability (see WUMQ)',
          value: 'WJMQ',
        },
        {
          label: 'WJMX - Metacarpophalangeal joint sprain',
          value: 'WJMX',
        },
        {
          label: 'WJPC - Thumb CMC jt sprain',
          value: 'WJPC',
        },
        {
          label: 'WJPI - Thumb IP joint sprain',
          value: 'WJPI',
        },
        {
          label:
            'WJPM - Thumb MCP joint sprain (incl radial and ulnar collat ligs)',
          value: 'WJPM',
        },
        {
          label:
            'WJPQ - Complication of thumb sprain excl chronic instability (see WUTX)',
          value: 'WJPQ',
        },
        {
          label: 'WJPR - Thumb RCL lig rupture at MCP joint',
          value: 'WJPR',
        },
        {
          label: "WJPU - Thumb UCL lig rupture at MCP joint (skier's thumb)",
          value: 'WJPU',
        },
        {
          label: 'WJPX - Thumb sprain',
          value: 'WJPX',
        },
        {
          label: 'WJSR - Scapholunate ligament rupture',
          value: 'WJSR',
        },
        {
          label: 'WJSS - Scapholunate ligament sprain',
          value: 'WJSS',
        },
        {
          label: 'WJSX - Scapholunate ligament sprain/ tear',
          value: 'WJSX',
        },
        {
          label: 'WJWG - Wrist ganglion',
          value: 'WJWG',
        },
        {
          label: 'WJWQ - Other complication of wrist sprain',
          value: 'WJWQ',
        },
        {
          label: 'WJWX - Wrist sprain/ jarring (radiocarpal joint)',
          value: 'WJWX',
        },
        {
          label: 'WJXX - Wrist and Hand Joint Injury',
          value: 'WJXX',
        },
        {
          label: 'WKBX - Blisters of wrist/ hand (incl fingers/ thumb)',
          value: 'WKBX',
        },
        {
          label: 'WKCX - Callous of Wrist/ hand (incl fingers/ thumb)',
          value: 'WKCX',
        },
        {
          label: 'WKFU - Laceration of fingernail/ nailbed',
          value: 'WKFU',
        },
        {
          label: 'WKFX - Finger laceration/ abrasion',
          value: 'WKFX',
        },
        {
          label: 'WKHD - Dorsal hand laceration/ abrasion',
          value: 'WKHD',
        },
        {
          label: 'WKHV - Palmar hand laceration/ abrasion',
          value: 'WKHV',
        },
        {
          label: 'WKHX - Hand laceration/ abrasion',
          value: 'WKHX',
        },
        {
          label: 'WKPU - Laceration of thumb nail/ nailbed',
          value: 'WKPU',
        },
        {
          label: 'WKPX - Thumb laceration/ abrasion',
          value: 'WKPX',
        },
        {
          label: 'WKWD - Dorsal wrist laceration/ abrasion',
          value: 'WKWD',
        },
        {
          label: 'WKWX - Wrist laceration/ abrasion',
          value: 'WKWX',
        },
        {
          label:
            'WKXQ - Complication of wrist/hand laceration/abrasion including infection',
          value: 'WKXQ',
        },
        {
          label: 'WKXX - Wrist and Hand Laceration/ Abrasion',
          value: 'WKXX',
        },
        {
          label: 'WMXX - Wrist and Hand Muscle Injury',
          value: 'WMXX',
        },
        {
          label: 'WNCX - Carpal Tunnel Syndrome',
          value: 'WNCX',
        },
        {
          label: 'WNXX - Wrist and Hand Neurological Injury',
          value: 'WNXX',
        },
        {
          label: 'WSCX - Carpal stress fracture',
          value: 'WSCX',
        },
        {
          label: 'WSHP - Sesamoiditis of thumb',
          value: 'WSHP',
        },
        {
          label: 'WSHX - Hand stress fracture (incl thumb and fingers)',
          value: 'WSHX',
        },
        {
          label: 'WSXX - Wrist and Hand Stress/ Overuse Injuries',
          value: 'WSXX',
        },
        {
          label: 'WTDR - Rupture wrist extensor tendon',
          value: 'WTDR',
        },
        {
          label:
            'WTDT - Wrist extensor tenosynovitis/ tendinopathy at wrist (excl intersection syndrome see - RTEI)',
          value: 'WTDT',
        },
        {
          label: 'WTDX - Wrist extensor tendon injury',
          value: 'WTDX',
        },
        {
          label: 'WTEA - Index finger extensor tendon rupture',
          value: 'WTEA',
        },
        {
          label: 'WTEB - Middle finger extensor tendon rupture',
          value: 'WTEB',
        },
        {
          label: 'WTEC - Ring finger extensor tendon rupture',
          value: 'WTEC',
        },
        {
          label: 'WTED - Little finger extensor tendon rupture',
          value: 'WTED',
        },
        {
          label: 'WTET - Finger(s) extensor tenosynovitis/ tendinopathy',
          value: 'WTET',
        },
        {
          label:
            'WTEX - Finger extensor tendon injury (incl mallet finger +/- avulsion fracture distal phalanx)',
          value: 'WTEX',
        },
        {
          label: 'WTFA - Index finger flexor tendon rupture',
          value: 'WTFA',
        },
        {
          label: 'WTFB - Middle finger flexor tendon rupture',
          value: 'WTFB',
        },
        {
          label: 'WTFC - Ring finger flexor tendon rupture',
          value: 'WTFC',
        },
        {
          label: 'WTFD - Little finger flexor tendon rupture',
          value: 'WTFD',
        },
        {
          label: 'WTFF - Flexor pully Injury fingers',
          value: 'WTFF',
        },
        {
          label: 'WTFG - Trigger Finger',
          value: 'WTFG',
        },
        {
          label: "WTFP - Dupuytren's contracture",
          value: 'WTFP',
        },
        {
          label: 'WTFT - Finger flexor tenosynovitis/ tendinopathy',
          value: 'WTFT',
        },
        {
          label: 'WTFX - Flexor tendon injury finger(s)',
          value: 'WTFX',
        },
        {
          label:
            'WTTE - Rupture thumb extensor tendon (excl if complication of wrist fracture - see specific fracture)',
          value: 'WTTE',
        },
        {
          label: 'WTTF - Rupture thumb flexor tendon',
          value: 'WTTF',
        },
        {
          label: 'WTTG - Trigger thumb',
          value: 'WTTG',
        },
        {
          label: "WTTT - De Quervain's tenosynovitis",
          value: 'WTTT',
        },
        {
          label: 'WTTX - Thumb tendon injury',
          value: 'WTTX',
        },
        {
          label: 'WTTZ - Other tenosynovitis/ tendinopathy thumb',
          value: 'WTTZ',
        },
        {
          label: 'WTVR - Rupture wrist flexor tendon',
          value: 'WTVR',
        },
        {
          label: 'WTVT - Wrist flexor tenosynovitis/ tendinopathy',
          value: 'WTVT',
        },
        {
          label: 'WTVX - Flexor tendon injury at wrist',
          value: 'WTVX',
        },
        {
          label: 'WTXX - Wrist and Hand Tendon Injury',
          value: 'WTXX',
        },
        {
          label: 'WUCD - Scapholunate (DISI) instability',
          value: 'WUCD',
        },
        {
          label: 'WUCV - VISI wrist instability',
          value: 'WUCV',
        },
        {
          label: 'WUCX - Carpal instability',
          value: 'WUCX',
        },
        {
          label: 'WUDX - Distal radioulnar joint instability',
          value: 'WUDX',
        },
        {
          label: 'WUFX - Finger PIP or DIP joint instability',
          value: 'WUFX',
        },
        {
          label: 'WUMX - Finger MCP joint instability',
          value: 'WUMX',
        },
        {
          label: 'WUPC - 1st CMC joint instability',
          value: 'WUPC',
        },
        {
          label: 'WUPI - IP joint instability of thumb',
          value: 'WUPI',
        },
        {
          label: 'WUPM - 1st MCP joint instability',
          value: 'WUPM',
        },
        {
          label: 'WUPX - Thumb Instability',
          value: 'WUPX',
        },
        {
          label: 'WUWX - Radiocarpal joint instability',
          value: 'WUWX',
        },
        {
          label: 'WUXX - Chronic Wrist or Hand Instability',
          value: 'WUXX',
        },
        {
          label: 'WVAX - Wrist and hand arterial injury (incl aneurysm)',
          value: 'WVAX',
        },
        {
          label: 'WVNL - AVN lunate',
          value: 'WVNL',
        },
        {
          label: 'WVNS - AVN scaphoid',
          value: 'WVNS',
        },
        {
          label: 'WVNX - Avascular necrosis in wrist/ hand',
          value: 'WVNX',
        },
        {
          label: 'WVXX - Wrist and Hand Vascular Injury',
          value: 'WVXX',
        },
        {
          label: 'WWV - Volar wrist laceration/ abrasion',
          value: 'WWV',
        },
        {
          label: 'WXXX - Forearm Pain/ Injury not otherwise specified',
          value: 'WXXX',
        },
        {
          label: 'WZCX - Chronic regional pain syndrome',
          value: 'WZCX',
        },
        {
          label: 'WZFX - Other finger pain NOS',
          value: 'WZFX',
        },
        {
          label: 'WZHX - Other hand pain NOS',
          value: 'WZHX',
        },
        {
          label: 'WZPX - Other thumb pain NOS',
          value: 'WZPX',
        },
        {
          label: 'WZWX - Other wrist pain NOS',
          value: 'WZWX',
        },
        {
          label:
            'WZXX - Other Wrist and Hand Pain/ Injury not otherwise specified',
          value: 'WZXX',
        },
        {
          label: 'WZZX - Wrist or hand pain undiagnosed',
          value: 'WZZX',
        },
        {
          label: 'XALX - Lower limb osteoarthritis',
          value: 'XALX',
        },
        {
          label: 'XAUX - Upper limb osteoarthritis',
          value: 'XAUX',
        },
        {
          label:
            'XAXX - Osteoarthritis Location Unspecified or Crossing Anatomical Boundaries (excl generalised OA see MROX)',
          value: 'XAXX',
        },
        {
          label:
            'XBXX - Bone Bruising Location Unspecified or Crossing Anatomical Boundaries',
          value: 'XBXX',
        },
        {
          label: 'XCXX - Chondral/ Osteochondral injury Location Unspecified',
          value: 'XCXX',
        },
        {
          label: 'XDLX - Lower limb joint dislocation',
          value: 'XDLX',
        },
        {
          label: 'XDUX - Upper limb joint dislocation',
          value: 'XDUX',
        },
        {
          label: 'XDXX - Dislocation Location Unspecified',
          value: 'XDXX',
        },
        {
          label: 'XFLX - Fracture lower limb',
          value: 'XFLX',
        },
        {
          label: 'XFUX - Fracture upper limb',
          value: 'XFUX',
        },
        {
          label:
            'XFXX - Fracture Location Unspecified or Crossing Anatomical Boundaries',
          value: 'XFXX',
        },
        {
          label: 'XGLX - Lower limb synovitis/ impingement lesion',
          value: 'XGLX',
        },
        {
          label: 'XGPX - Postural Syndrome',
          value: 'XGPX',
        },
        {
          label: 'XGUX - Upper limb synovitis/ impingement lesion',
          value: 'XGUX',
        },
        {
          label:
            'XGXX - Stress Fracture Location Unspecified or Crossing Anatomical Boundaries',
          value: 'XGXX',
        },
        {
          label: 'XHLX - Soft tissue bruising lower limb',
          value: 'XHLX',
        },
        {
          label: 'XHUX - Soft tissue bruising upper limb',
          value: 'XHUX',
        },
        {
          label:
            'XHXX - Soft Tissue Bruising/ Haematoma Location Unspecified or Crossing Anatomical Boundaries',
          value: 'XHXX',
        },
        {
          label: 'XJLX - Lower limb joint sprain',
          value: 'XJLX',
        },
        {
          label: 'XJSX - Spinal joint sprain',
          value: 'XJSX',
        },
        {
          label: 'XJUX - Upper limb joint sprain',
          value: 'XJUX',
        },
        {
          label: 'XJXX - Sprain Location Unspecified',
          value: 'XJXX',
        },
        {
          label: 'XKLX - Laceration/ abrasion lower limb',
          value: 'XKLX',
        },
        {
          label: 'XKUX - Laceration/ abrasion upper limb',
          value: 'XKUX',
        },
        {
          label:
            'XKXX - Laceration/ Abrasion Location Unspecified or Crossing Anatomical Boundaries',
          value: 'XKXX',
        },
        {
          label: 'XMLX - Muscle strain lower limb',
          value: 'XMLX',
        },
        {
          label: 'XMSX - Muscle strain spine',
          value: 'XMSX',
        },
        {
          label: 'XMUX - Muscle strain upper limb',
          value: 'XMUX',
        },
        {
          label:
            'XMXX - Muscle Strain/ Spasm/ Trigger Points Location Unspecified or Crossing Anatomical Boundaries',
          value: 'XMXX',
        },
        {
          label: 'XMYX - Trigger points/ spasm multiple locations',
          value: 'XMYX',
        },
        {
          label: 'XNLX - Lower limb neurological injury',
          value: 'XNLX',
        },
        {
          label:
            'XNSX - Spinal injury location unspecified or crossing anatomical boundaries',
          value: 'XNSX',
        },
        {
          label: 'XNUX - Upper limb neurological injury',
          value: 'XNUX',
        },
        {
          label:
            'XNXX - Neurological lesion Location Unspecified or Crossing Anatomical Boundaries',
          value: 'XNXX',
        },
        {
          label: 'XSLX - Lower limb stress fracture',
          value: 'XSLX',
        },
        {
          label: 'XSUX - Upper limb stress fracture',
          value: 'XSUX',
        },
        {
          label:
            'XSXX - Stress Fracture Location Unspecified or Crossing Anatomical Boundaries',
          value: 'XSXX',
        },
        {
          label: 'XTLX - Tendon strain/ rupture lower limb',
          value: 'XTLX',
        },
        {
          label: 'XTRX - Tendon strain/ rupture location unspecified',
          value: 'XTRX',
        },
        {
          label: 'XTTX - Tendinopathy location unspecified',
          value: 'XTTX',
        },
        {
          label: 'XTUX - Tendon strain/ rupture upper limb',
          value: 'XTUX',
        },
        {
          label:
            'XTXX - Tendon Injury Location Unspecified or Crossing Anatomical Boundaries',
          value: 'XTXX',
        },
        {
          label: 'XULX - Lower limb joint instability',
          value: 'XULX',
        },
        {
          label: 'XUUX - Upper limb joint instability',
          value: 'XUUX',
        },
        {
          label: 'XUXX - Instability of Joint Location Unspecified',
          value: 'XUXX',
        },
        {
          label: 'XVLX - Lower limb vascular injury',
          value: 'XVLX',
        },
        {
          label: 'XVUX - Upper limb vascular injury',
          value: 'XVUX',
        },
        {
          label:
            'XVXX - Vascular Injury Location Unspecified or Crossing Anatomical Boundaries',
          value: 'XVXX',
        },
        {
          label: 'XX - General',
          value: 'XX',
        },
        {
          label: 'XXXX - Injuries Location Unspecified/Crossing',
          value: 'XXXX',
        },
        {
          label: 'YAAX - Post ankle arthroscopy and debridement',
          value: 'YAAX',
        },
        {
          label: 'YARX - Post ankle reconstruction +/- other proceedure',
          value: 'YARX',
        },
        {
          label: 'YAXX - Post ankle surgery',
          value: 'YAXX',
        },
        {
          label: 'YEXX - Post Elbow Surgery',
          value: 'YEXX',
        },
        {
          label: 'YFHX - Post great toe surgery',
          value: 'YFHX',
        },
        {
          label: 'YFXX - Post foot surgery',
          value: 'YFXX',
        },
        {
          label: 'YGAX - Post hip arthroplasty',
          value: 'YGAX',
        },
        {
          label: 'YGGA - Post adductor tenotomy',
          value: 'YGGA',
        },
        {
          label: 'YGGH - Post hernia repain',
          value: 'YGGH',
        },
        {
          label: 'YGGM - Post mixed groin surgery',
          value: 'YGGM',
        },
        {
          label: 'YGGX - Post surgery for overuse groin injury',
          value: 'YGGX',
        },
        {
          label: 'YGSX - Post hip arthroscopy',
          value: 'YGSX',
        },
        {
          label: 'YGXX - Post Hip/ Groin Surgery',
          value: 'YGXX',
        },
        {
          label: 'YKAH - Post hemiarthroplasty knee',
          value: 'YKAH',
        },
        {
          label: 'YKAT - Post total arthroplasty knee',
          value: 'YKAT',
        },
        {
          label: 'YKAX - Post knee replacement surgery',
          value: 'YKAX',
        },
        {
          label: 'YKCC - Post chondral debridement',
          value: 'YKCC',
        },
        {
          label: 'YKCM - Post menisectomy',
          value: 'YKCM',
        },
        {
          label: 'YKCR - Post meniscal repair',
          value: 'YKCR',
        },
        {
          label: 'YKCT - Post cartilage transplant',
          value: 'YKCT',
        },
        {
          label: 'YKCX - Post cartilage surgery knee',
          value: 'YKCX',
        },
        {
          label: 'YKLA - Post ACL reconstruction',
          value: 'YKLA',
        },
        {
          label: 'YKLC - Post PCL reconstruction',
          value: 'YKLC',
        },
        {
          label: 'YKLX - Post knee reconstructive surgery',
          value: 'YKLX',
        },
        {
          label:
            'YKPX - Post Surgery for patellofemoral pain (incl debridement/ lat release/ realignment surgery/ patellectomy)',
          value: 'YKPX',
        },
        {
          label: 'YKQX - Complication post knee surgery - e.g. infection',
          value: 'YKQX',
        },
        {
          label: 'YKXX - Post knee Surgery',
          value: 'YKXX',
        },
        {
          label: 'YKZX - Post Other knee surgery',
          value: 'YKZX',
        },
        {
          label: 'YNXX - Post Neck Surgery',
          value: 'YNXX',
        },
        {
          label: 'YQAX - Post achilles tendon surgery',
          value: 'YQAX',
        },
        {
          label: 'YQFX - Post compartment release surgery',
          value: 'YQFX',
        },
        {
          label: 'YQXX - Post Lower leg surgery',
          value: 'YQXX',
        },
        {
          label: 'YSAX - Post AC joint surgery',
          value: 'YSAX',
        },
        {
          label: 'YSRX - Post rotator cuff surgery',
          value: 'YSRX',
        },
        {
          label: 'YSSA - Post arthroscopic shoulder stabilisation',
          value: 'YSSA',
        },
        {
          label: 'YSSO - Post open shoulder stabilisation',
          value: 'YSSO',
        },
        {
          label: 'YSSX - Post shoulder stabilisation',
          value: 'YSSX',
        },
        {
          label: 'YSXX - Post Shoulder Surgery',
          value: 'YSXX',
        },
        {
          label: 'YWCX - Post carpal tunnel release',
          value: 'YWCX',
        },
        {
          label: 'YWHX - Post Hand/ Finger/ thumb surgery',
          value: 'YWHX',
        },
        {
          label: 'YWWS - Post scapholunate stabilisation',
          value: 'YWWS',
        },
        {
          label: 'YWWX - Post surgery on wrist joint',
          value: 'YWWX',
        },
        {
          label: 'YWXX - Post Wrist/ Hand Surgery',
          value: 'YWXX',
        },
        {
          label: 'YXXX - Post Surgical Patient',
          value: 'YXXX',
        },
        {
          label: 'YZXX - Post surgery on other site not specifically mentioned',
          value: 'YZXX',
        },
        {
          label: 'ZEAX - Exercise prescription for patient with arthritis',
          value: 'ZEAX',
        },
        {
          label:
            'ZECX - Exercise prescription for patient with cardiac disease',
          value: 'ZECX',
        },
        {
          label:
            'ZEMX - Exercise prescription for patient with other medical disease',
          value: 'ZEMX',
        },
        {
          label:
            'ZEOJ - Exercise prescription for patient with juvenile obesity',
          value: 'ZEOJ',
        },
        {
          label: 'ZEOX - Exercise prescription for patient with obesity',
          value: 'ZEOX',
        },
        {
          label:
            'ZERX - Exercise prescription for patient with respiratory disease',
          value: 'ZERX',
        },
        {
          label:
            'ZEVX - Exercise prescription for patient with overtraining/ chronic fatigue',
          value: 'ZEVX',
        },
        {
          label: 'ZEXX - Exercise prescription',
          value: 'ZEXX',
        },
        {
          label:
            'ZOXX - Preparation for overseas travel - advice immunisations',
          value: 'ZOXX',
        },
        {
          label: 'ZPMX - Medical certificate',
          value: 'ZPMX',
        },
        {
          label: 'ZPPX - Prescription repeat',
          value: 'ZPPX',
        },
        {
          label: 'ZPRX - Referral',
          value: 'ZPRX',
        },
        {
          label: 'ZPXX - Paperwork',
          value: 'ZPXX',
        },
        {
          label: 'ZSDX - Dive medical',
          value: 'ZSDX',
        },
        {
          label: 'ZSMX - General medical screen',
          value: 'ZSMX',
        },
        {
          label: 'ZSPX - Preparticipation screen',
          value: 'ZSPX',
        },
        {
          label: 'ZSXX - Screening examination',
          value: 'ZSXX',
        },
        {
          label:
            'ZTXX - Advice on equiptment/ other aids e.g. appropriate footwear.',
          value: 'ZTXX',
        },
        {
          label:
            'ZXXX - Consultations Where There is No Presenting Illness Needing Treatment',
          value: 'ZXXX',
        },
      ],
      path: 'pathology/codes',
      deprecated: false,
    },
    {
      label: 'Reported Date',
      operators: [
        {
          label: 'Is',
          value: 'eq',
        },
      ],
      options: [
        {
          label: 'Examination Date (not supported yet)',
          value: 'examination_date',
        },
        {
          label: 'Occurrence Date (Onset Date)',
          value: 'occurrence_date',
        },
        {
          label: 'Resolved Date (not supported yet)',
          value: 'resolved_date',
        },
      ],
      path: 'reported_date/value',
      deprecated: false,
    },
  ],
};

export const response = {
  data,
};
