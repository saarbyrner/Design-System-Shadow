export const getTreatmentSessionsOptions = {
  treatment_modality_options: [
    {
      name: 'AT Directed Rehab',
      isGroupOption: true,
    },
    {
      key_name: 209,
      name: 'Rehab Exercises',
    },
    {
      name: 'Cryotherapy/Compression',
      isGroupOption: true,
    },
    {
      key_name: 39,
      name: 'Cold Tub',
    },
    {
      key_name: 38,
      name: 'Ice Pack',
    },
    {
      name: 'Electrotherapy',
      isGroupOption: true,
    },
    {
      key_name: 37,
      name: 'Laser',
    },
    {
      key_name: 2,
      name: 'Shockwave',
    },
    {
      key_name: 1,
      name: 'Ultrasound',
    },
    {
      name: 'Exercise',
      isGroupOption: true,
    },
    {
      key_name: 227,
      name: 'Bed Based Rehab',
    },
    {
      key_name: 228,
      name: 'Gym Based Rehab',
    },
    {
      name: 'General Medical Treatment',
      isGroupOption: true,
    },
    {
      key_name: 36,
      name: 'DNS',
    },
    {
      key_name: 69,
      name: 'General Treatment',
    },
    {
      key_name: 34,
      name: 'Review HEP',
    },
    {
      name: 'Manual Therapy',
      isGroupOption: true,
    },
    {
      key_name: 10,
      name: 'Dry Needling',
    },
    {
      key_name: 9,
      name: 'Instrument Assisted Soft Tissue',
    },
    {
      key_name: 15,
      name: 'Joint Mobilization',
    },
    {
      key_name: 8,
      name: 'Myofascial Manipulation',
    },
    {
      key_name: 18,
      name: 'Nerve Glides',
    },
    {
      key_name: 51,
      name: 'PNF Stretching',
    },
    {
      name: 'Other',
      isGroupOption: true,
    },
    {
      key_name: 114,
      name: 'Injection',
    },
    {
      key_name: 220,
      name: 'Injection Therapy',
    },
    {
      name: 'Rehabilitation',
      isGroupOption: true,
    },
    {
      key_name: 140,
      name: 'Supervised Rehab',
    },
    {
      key_name: 28,
      name: 'Vestibular Rehab',
    },
    {
      name: 'Taping',
      isGroupOption: true,
    },
    {
      key_name: 224,
      name: 'Taping/Strapping',
    },
    {
      name: 'Thermotherapy',
      isGroupOption: true,
    },
    {
      key_name: 42,
      name: 'Heat Pack',
    },
    {
      key_name: 40,
      name: 'Hot Tub',
    },
    {
      key_name: 41,
      name: 'Sauna',
    },
  ],
  rehab_exercise_options: [],
  treatable_area_options: [
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 1,
        side_id: 1,
      },
      name: 'Ankle',
      description: 'Left',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 262,
        side_id: 1,
      },
      name: 'Achilles Tendon',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 93,
        side_id: 1,
      },
      name: 'Calcaneus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 207,
        side_id: 1,
      },
      name: 'Deltoid Ligament',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 90,
        side_id: 1,
      },
      name: 'Fibula',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 206,
        side_id: 1,
      },
      name: 'Lateral Ligaments',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 275,
        side_id: 1,
      },
      name: 'Other',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 260,
        side_id: 1,
      },
      name: 'Plantar Fascia',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 203,
        side_id: 1,
      },
      name: 'Sub-talar',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 204,
        side_id: 1,
      },
      name: 'Syndesmosis Joint',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 205,
        side_id: 1,
      },
      name: 'Syndesmosis Ligament',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 202,
        side_id: 1,
      },
      name: 'Talocrural',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 91,
        side_id: 1,
      },
      name: 'Talus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 92,
        side_id: 1,
      },
      name: 'Tibia',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 1,
        side_id: 3,
      },
      name: 'Ankle',
      description: 'Right',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 262,
        side_id: 3,
      },
      name: 'Achilles Tendon',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 93,
        side_id: 3,
      },
      name: 'Calcaneus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 207,
        side_id: 3,
      },
      name: 'Deltoid Ligament',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 90,
        side_id: 3,
      },
      name: 'Fibula',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 206,
        side_id: 3,
      },
      name: 'Lateral Ligaments',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 275,
        side_id: 3,
      },
      name: 'Other',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 260,
        side_id: 3,
      },
      name: 'Plantar Fascia',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 203,
        side_id: 3,
      },
      name: 'Sub-talar',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 204,
        side_id: 3,
      },
      name: 'Syndesmosis Joint',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 205,
        side_id: 3,
      },
      name: 'Syndesmosis Ligament',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 202,
        side_id: 3,
      },
      name: 'Talocrural',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 91,
        side_id: 3,
      },
      name: 'Talus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 92,
        side_id: 3,
      },
      name: 'Tibia',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 1,
        side_id: 4,
      },
      name: 'Ankle',
      description: 'Bilateral',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 262,
        side_id: 4,
      },
      name: 'Achilles Tendon',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 93,
        side_id: 4,
      },
      name: 'Calcaneus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 207,
        side_id: 4,
      },
      name: 'Deltoid Ligament',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 90,
        side_id: 4,
      },
      name: 'Fibula',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 206,
        side_id: 4,
      },
      name: 'Lateral Ligaments',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 275,
        side_id: 4,
      },
      name: 'Other',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 260,
        side_id: 4,
      },
      name: 'Plantar Fascia',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 203,
        side_id: 4,
      },
      name: 'Sub-talar',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 204,
        side_id: 4,
      },
      name: 'Syndesmosis Joint',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 205,
        side_id: 4,
      },
      name: 'Syndesmosis Ligament',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 202,
        side_id: 4,
      },
      name: 'Talocrural',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 91,
        side_id: 4,
      },
      name: 'Talus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 92,
        side_id: 4,
      },
      name: 'Tibia',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 2,
        side_id: 1,
      },
      name: 'Buttock/pelvis',
      description: 'Left',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 368,
        side_id: 1,
      },
      name: 'Bladder',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 75,
        side_id: 1,
      },
      name: 'Coccyx',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 250,
        side_id: 1,
      },
      name: 'Gluteal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 276,
        side_id: 1,
      },
      name: 'Gluteus Maximus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 277,
        side_id: 1,
      },
      name: 'Gluteus Medius',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 278,
        side_id: 1,
      },
      name: 'Gluteus Minimus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 73,
        side_id: 1,
      },
      name: 'Ilium',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 279,
        side_id: 1,
      },
      name: 'Other',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 369,
        side_id: 1,
      },
      name: 'Penis',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 370,
        side_id: 1,
      },
      name: 'Prostate',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 371,
        side_id: 1,
      },
      name: 'Reproductive Organ',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 74,
        side_id: 1,
      },
      name: 'Sacrum',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 372,
        side_id: 1,
      },
      name: 'Scrotum',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 373,
        side_id: 1,
      },
      name: 'Testicle',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 374,
        side_id: 1,
      },
      name: 'Urinary Organs',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 375,
        side_id: 1,
      },
      name: 'Uterus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 376,
        side_id: 1,
      },
      name: 'Vagina',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 377,
        side_id: 1,
      },
      name: 'Vulva',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 2,
        side_id: 2,
      },
      name: 'Buttock/pelvis',
      description: 'Center',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 368,
        side_id: 2,
      },
      name: 'Bladder',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 75,
        side_id: 2,
      },
      name: 'Coccyx',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 250,
        side_id: 2,
      },
      name: 'Gluteal',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 276,
        side_id: 2,
      },
      name: 'Gluteus Maximus',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 277,
        side_id: 2,
      },
      name: 'Gluteus Medius',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 278,
        side_id: 2,
      },
      name: 'Gluteus Minimus',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 73,
        side_id: 2,
      },
      name: 'Ilium',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 279,
        side_id: 2,
      },
      name: 'Other',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 369,
        side_id: 2,
      },
      name: 'Penis',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 370,
        side_id: 2,
      },
      name: 'Prostate',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 371,
        side_id: 2,
      },
      name: 'Reproductive Organ',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 74,
        side_id: 2,
      },
      name: 'Sacrum',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 372,
        side_id: 2,
      },
      name: 'Scrotum',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 373,
        side_id: 2,
      },
      name: 'Testicle',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 374,
        side_id: 2,
      },
      name: 'Urinary Organs',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 375,
        side_id: 2,
      },
      name: 'Uterus',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 376,
        side_id: 2,
      },
      name: 'Vagina',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 377,
        side_id: 2,
      },
      name: 'Vulva',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 2,
        side_id: 3,
      },
      name: 'Buttock/pelvis',
      description: 'Right',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 368,
        side_id: 3,
      },
      name: 'Bladder',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 75,
        side_id: 3,
      },
      name: 'Coccyx',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 250,
        side_id: 3,
      },
      name: 'Gluteal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 276,
        side_id: 3,
      },
      name: 'Gluteus Maximus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 277,
        side_id: 3,
      },
      name: 'Gluteus Medius',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 278,
        side_id: 3,
      },
      name: 'Gluteus Minimus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 73,
        side_id: 3,
      },
      name: 'Ilium',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 279,
        side_id: 3,
      },
      name: 'Other',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 369,
        side_id: 3,
      },
      name: 'Penis',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 370,
        side_id: 3,
      },
      name: 'Prostate',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 371,
        side_id: 3,
      },
      name: 'Reproductive Organ',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 74,
        side_id: 3,
      },
      name: 'Sacrum',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 372,
        side_id: 3,
      },
      name: 'Scrotum',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 373,
        side_id: 3,
      },
      name: 'Testicle',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 374,
        side_id: 3,
      },
      name: 'Urinary Organs',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 375,
        side_id: 3,
      },
      name: 'Uterus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 376,
        side_id: 3,
      },
      name: 'Vagina',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 377,
        side_id: 3,
      },
      name: 'Vulva',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 2,
        side_id: 4,
      },
      name: 'Buttock/pelvis',
      description: 'Bilateral',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 368,
        side_id: 4,
      },
      name: 'Bladder',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 75,
        side_id: 4,
      },
      name: 'Coccyx',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 250,
        side_id: 4,
      },
      name: 'Gluteal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 276,
        side_id: 4,
      },
      name: 'Gluteus Maximus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 277,
        side_id: 4,
      },
      name: 'Gluteus Medius',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 278,
        side_id: 4,
      },
      name: 'Gluteus Minimus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 73,
        side_id: 4,
      },
      name: 'Ilium',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 279,
        side_id: 4,
      },
      name: 'Other',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 369,
        side_id: 4,
      },
      name: 'Penis',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 370,
        side_id: 4,
      },
      name: 'Prostate',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 371,
        side_id: 4,
      },
      name: 'Reproductive Organ',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 74,
        side_id: 4,
      },
      name: 'Sacrum',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 372,
        side_id: 4,
      },
      name: 'Scrotum',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 373,
        side_id: 4,
      },
      name: 'Testicle',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 374,
        side_id: 4,
      },
      name: 'Urinary Organs',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 375,
        side_id: 4,
      },
      name: 'Uterus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 376,
        side_id: 4,
      },
      name: 'Vagina',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 377,
        side_id: 4,
      },
      name: 'Vulva',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 2,
        side_id: 5,
      },
      name: 'Buttock/pelvis',
      description: 'N/A',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 368,
        side_id: 5,
      },
      name: 'Bladder',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 75,
        side_id: 5,
      },
      name: 'Coccyx',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 250,
        side_id: 5,
      },
      name: 'Gluteal',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 276,
        side_id: 5,
      },
      name: 'Gluteus Maximus',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 277,
        side_id: 5,
      },
      name: 'Gluteus Medius',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 278,
        side_id: 5,
      },
      name: 'Gluteus Minimus',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 73,
        side_id: 5,
      },
      name: 'Ilium',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 279,
        side_id: 5,
      },
      name: 'Other',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 369,
        side_id: 5,
      },
      name: 'Penis',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 370,
        side_id: 5,
      },
      name: 'Prostate',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 371,
        side_id: 5,
      },
      name: 'Reproductive Organ',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 74,
        side_id: 5,
      },
      name: 'Sacrum',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 372,
        side_id: 5,
      },
      name: 'Scrotum',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 373,
        side_id: 5,
      },
      name: 'Testicle',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 374,
        side_id: 5,
      },
      name: 'Urinary Organs',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 375,
        side_id: 5,
      },
      name: 'Uterus',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 376,
        side_id: 5,
      },
      name: 'Vagina',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 377,
        side_id: 5,
      },
      name: 'Vulva',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 3,
        side_id: 1,
      },
      name: 'Chest',
      description: 'Left',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 169,
        side_id: 1,
      },
      name: '10th Costo-Chondral',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 53,
        side_id: 1,
      },
      name: '10th Rib',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 170,
        side_id: 1,
      },
      name: '11th Costo-Chondral',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 54,
        side_id: 1,
      },
      name: '11th Rib',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 171,
        side_id: 1,
      },
      name: '12th Costo-Chondral',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 55,
        side_id: 1,
      },
      name: '12th Rib',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 160,
        side_id: 1,
      },
      name: '1st Costo-Chondral',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 44,
        side_id: 1,
      },
      name: '1st Rib',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 161,
        side_id: 1,
      },
      name: '2nd Costo-Chondral',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 45,
        side_id: 1,
      },
      name: '2nd Rib',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 162,
        side_id: 1,
      },
      name: '3rd Costo-Chondral',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 46,
        side_id: 1,
      },
      name: '3rd Rib',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 163,
        side_id: 1,
      },
      name: '4th Costo-Chondral',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 47,
        side_id: 1,
      },
      name: '4th Rib',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 164,
        side_id: 1,
      },
      name: '5th Costo-Chondral',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 48,
        side_id: 1,
      },
      name: '5th Rib',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 165,
        side_id: 1,
      },
      name: '6th Costo-Chondral',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 49,
        side_id: 1,
      },
      name: '6th Rib',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 166,
        side_id: 1,
      },
      name: '7th Costo-Chondral',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 50,
        side_id: 1,
      },
      name: '7th Rib',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 167,
        side_id: 1,
      },
      name: '8th Costo-Chondral',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 51,
        side_id: 1,
      },
      name: '8th Rib',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 168,
        side_id: 1,
      },
      name: '9th Costo-Chondral',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 52,
        side_id: 1,
      },
      name: '9th Rib',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 280,
        side_id: 1,
      },
      name: 'Breast',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 281,
        side_id: 1,
      },
      name: 'Diaphragm',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 282,
        side_id: 1,
      },
      name: 'Heart',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 283,
        side_id: 1,
      },
      name: 'Intercostal Muscle(s)',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 284,
        side_id: 1,
      },
      name: 'Lung(s)',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 285,
        side_id: 1,
      },
      name: 'Other',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 246,
        side_id: 1,
      },
      name: 'Pectoralis',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 286,
        side_id: 1,
      },
      name: 'Pectoralis Major',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 287,
        side_id: 1,
      },
      name: 'Pectoralis Minor',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 288,
        side_id: 1,
      },
      name: 'Rib(s)',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 43,
        side_id: 1,
      },
      name: 'Sternum',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 3,
        side_id: 2,
      },
      name: 'Chest',
      description: 'Center',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 169,
        side_id: 2,
      },
      name: '10th Costo-Chondral',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 53,
        side_id: 2,
      },
      name: '10th Rib',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 170,
        side_id: 2,
      },
      name: '11th Costo-Chondral',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 54,
        side_id: 2,
      },
      name: '11th Rib',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 171,
        side_id: 2,
      },
      name: '12th Costo-Chondral',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 55,
        side_id: 2,
      },
      name: '12th Rib',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 160,
        side_id: 2,
      },
      name: '1st Costo-Chondral',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 44,
        side_id: 2,
      },
      name: '1st Rib',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 161,
        side_id: 2,
      },
      name: '2nd Costo-Chondral',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 45,
        side_id: 2,
      },
      name: '2nd Rib',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 162,
        side_id: 2,
      },
      name: '3rd Costo-Chondral',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 46,
        side_id: 2,
      },
      name: '3rd Rib',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 163,
        side_id: 2,
      },
      name: '4th Costo-Chondral',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 47,
        side_id: 2,
      },
      name: '4th Rib',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 164,
        side_id: 2,
      },
      name: '5th Costo-Chondral',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 48,
        side_id: 2,
      },
      name: '5th Rib',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 165,
        side_id: 2,
      },
      name: '6th Costo-Chondral',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 49,
        side_id: 2,
      },
      name: '6th Rib',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 166,
        side_id: 2,
      },
      name: '7th Costo-Chondral',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 50,
        side_id: 2,
      },
      name: '7th Rib',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 167,
        side_id: 2,
      },
      name: '8th Costo-Chondral',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 51,
        side_id: 2,
      },
      name: '8th Rib',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 168,
        side_id: 2,
      },
      name: '9th Costo-Chondral',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 52,
        side_id: 2,
      },
      name: '9th Rib',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 280,
        side_id: 2,
      },
      name: 'Breast',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 281,
        side_id: 2,
      },
      name: 'Diaphragm',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 282,
        side_id: 2,
      },
      name: 'Heart',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 283,
        side_id: 2,
      },
      name: 'Intercostal Muscle(s)',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 284,
        side_id: 2,
      },
      name: 'Lung(s)',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 285,
        side_id: 2,
      },
      name: 'Other',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 246,
        side_id: 2,
      },
      name: 'Pectoralis',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 286,
        side_id: 2,
      },
      name: 'Pectoralis Major',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 287,
        side_id: 2,
      },
      name: 'Pectoralis Minor',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 288,
        side_id: 2,
      },
      name: 'Rib(s)',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 43,
        side_id: 2,
      },
      name: 'Sternum',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 3,
        side_id: 3,
      },
      name: 'Chest',
      description: 'Right',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 169,
        side_id: 3,
      },
      name: '10th Costo-Chondral',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 53,
        side_id: 3,
      },
      name: '10th Rib',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 170,
        side_id: 3,
      },
      name: '11th Costo-Chondral',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 54,
        side_id: 3,
      },
      name: '11th Rib',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 171,
        side_id: 3,
      },
      name: '12th Costo-Chondral',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 55,
        side_id: 3,
      },
      name: '12th Rib',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 160,
        side_id: 3,
      },
      name: '1st Costo-Chondral',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 44,
        side_id: 3,
      },
      name: '1st Rib',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 161,
        side_id: 3,
      },
      name: '2nd Costo-Chondral',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 45,
        side_id: 3,
      },
      name: '2nd Rib',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 162,
        side_id: 3,
      },
      name: '3rd Costo-Chondral',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 46,
        side_id: 3,
      },
      name: '3rd Rib',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 163,
        side_id: 3,
      },
      name: '4th Costo-Chondral',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 47,
        side_id: 3,
      },
      name: '4th Rib',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 164,
        side_id: 3,
      },
      name: '5th Costo-Chondral',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 48,
        side_id: 3,
      },
      name: '5th Rib',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 165,
        side_id: 3,
      },
      name: '6th Costo-Chondral',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 49,
        side_id: 3,
      },
      name: '6th Rib',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 166,
        side_id: 3,
      },
      name: '7th Costo-Chondral',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 50,
        side_id: 3,
      },
      name: '7th Rib',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 167,
        side_id: 3,
      },
      name: '8th Costo-Chondral',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 51,
        side_id: 3,
      },
      name: '8th Rib',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 168,
        side_id: 3,
      },
      name: '9th Costo-Chondral',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 52,
        side_id: 3,
      },
      name: '9th Rib',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 280,
        side_id: 3,
      },
      name: 'Breast',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 281,
        side_id: 3,
      },
      name: 'Diaphragm',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 282,
        side_id: 3,
      },
      name: 'Heart',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 283,
        side_id: 3,
      },
      name: 'Intercostal Muscle(s)',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 284,
        side_id: 3,
      },
      name: 'Lung(s)',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 285,
        side_id: 3,
      },
      name: 'Other',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 246,
        side_id: 3,
      },
      name: 'Pectoralis',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 286,
        side_id: 3,
      },
      name: 'Pectoralis Major',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 287,
        side_id: 3,
      },
      name: 'Pectoralis Minor',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 288,
        side_id: 3,
      },
      name: 'Rib(s)',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 43,
        side_id: 3,
      },
      name: 'Sternum',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 3,
        side_id: 4,
      },
      name: 'Chest',
      description: 'Bilateral',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 169,
        side_id: 4,
      },
      name: '10th Costo-Chondral',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 53,
        side_id: 4,
      },
      name: '10th Rib',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 170,
        side_id: 4,
      },
      name: '11th Costo-Chondral',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 54,
        side_id: 4,
      },
      name: '11th Rib',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 171,
        side_id: 4,
      },
      name: '12th Costo-Chondral',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 55,
        side_id: 4,
      },
      name: '12th Rib',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 160,
        side_id: 4,
      },
      name: '1st Costo-Chondral',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 44,
        side_id: 4,
      },
      name: '1st Rib',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 161,
        side_id: 4,
      },
      name: '2nd Costo-Chondral',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 45,
        side_id: 4,
      },
      name: '2nd Rib',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 162,
        side_id: 4,
      },
      name: '3rd Costo-Chondral',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 46,
        side_id: 4,
      },
      name: '3rd Rib',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 163,
        side_id: 4,
      },
      name: '4th Costo-Chondral',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 47,
        side_id: 4,
      },
      name: '4th Rib',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 164,
        side_id: 4,
      },
      name: '5th Costo-Chondral',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 48,
        side_id: 4,
      },
      name: '5th Rib',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 165,
        side_id: 4,
      },
      name: '6th Costo-Chondral',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 49,
        side_id: 4,
      },
      name: '6th Rib',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 166,
        side_id: 4,
      },
      name: '7th Costo-Chondral',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 50,
        side_id: 4,
      },
      name: '7th Rib',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 167,
        side_id: 4,
      },
      name: '8th Costo-Chondral',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 51,
        side_id: 4,
      },
      name: '8th Rib',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 168,
        side_id: 4,
      },
      name: '9th Costo-Chondral',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 52,
        side_id: 4,
      },
      name: '9th Rib',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 280,
        side_id: 4,
      },
      name: 'Breast',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 281,
        side_id: 4,
      },
      name: 'Diaphragm',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 282,
        side_id: 4,
      },
      name: 'Heart',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 283,
        side_id: 4,
      },
      name: 'Intercostal Muscle(s)',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 284,
        side_id: 4,
      },
      name: 'Lung(s)',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 285,
        side_id: 4,
      },
      name: 'Other',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 246,
        side_id: 4,
      },
      name: 'Pectoralis',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 286,
        side_id: 4,
      },
      name: 'Pectoralis Major',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 287,
        side_id: 4,
      },
      name: 'Pectoralis Minor',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 288,
        side_id: 4,
      },
      name: 'Rib(s)',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 43,
        side_id: 4,
      },
      name: 'Sternum',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 3,
        side_id: 5,
      },
      name: 'Chest',
      description: 'N/A',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 169,
        side_id: 5,
      },
      name: '10th Costo-Chondral',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 53,
        side_id: 5,
      },
      name: '10th Rib',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 170,
        side_id: 5,
      },
      name: '11th Costo-Chondral',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 54,
        side_id: 5,
      },
      name: '11th Rib',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 171,
        side_id: 5,
      },
      name: '12th Costo-Chondral',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 55,
        side_id: 5,
      },
      name: '12th Rib',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 160,
        side_id: 5,
      },
      name: '1st Costo-Chondral',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 44,
        side_id: 5,
      },
      name: '1st Rib',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 161,
        side_id: 5,
      },
      name: '2nd Costo-Chondral',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 45,
        side_id: 5,
      },
      name: '2nd Rib',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 162,
        side_id: 5,
      },
      name: '3rd Costo-Chondral',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 46,
        side_id: 5,
      },
      name: '3rd Rib',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 163,
        side_id: 5,
      },
      name: '4th Costo-Chondral',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 47,
        side_id: 5,
      },
      name: '4th Rib',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 164,
        side_id: 5,
      },
      name: '5th Costo-Chondral',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 48,
        side_id: 5,
      },
      name: '5th Rib',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 165,
        side_id: 5,
      },
      name: '6th Costo-Chondral',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 49,
        side_id: 5,
      },
      name: '6th Rib',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 166,
        side_id: 5,
      },
      name: '7th Costo-Chondral',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 50,
        side_id: 5,
      },
      name: '7th Rib',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 167,
        side_id: 5,
      },
      name: '8th Costo-Chondral',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 51,
        side_id: 5,
      },
      name: '8th Rib',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 168,
        side_id: 5,
      },
      name: '9th Costo-Chondral',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 52,
        side_id: 5,
      },
      name: '9th Rib',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 280,
        side_id: 5,
      },
      name: 'Breast',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 281,
        side_id: 5,
      },
      name: 'Diaphragm',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 282,
        side_id: 5,
      },
      name: 'Heart',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 283,
        side_id: 5,
      },
      name: 'Intercostal Muscle(s)',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 284,
        side_id: 5,
      },
      name: 'Lung(s)',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 285,
        side_id: 5,
      },
      name: 'Other',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 246,
        side_id: 5,
      },
      name: 'Pectoralis',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 286,
        side_id: 5,
      },
      name: 'Pectoralis Major',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 287,
        side_id: 5,
      },
      name: 'Pectoralis Minor',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 288,
        side_id: 5,
      },
      name: 'Rib(s)',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 43,
        side_id: 5,
      },
      name: 'Sternum',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 4,
        side_id: 1,
      },
      name: 'Elbow',
      description: 'Left',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 238,
        side_id: 1,
      },
      name: 'Bicep',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 289,
        side_id: 1,
      },
      name: 'Brachialis',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 290,
        side_id: 1,
      },
      name: 'Brachioradialis',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 19,
        side_id: 1,
      },
      name: 'Distal Humerus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 129,
        side_id: 1,
      },
      name: 'Elbow Joint',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 241,
        side_id: 1,
      },
      name: 'Extensors',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 240,
        side_id: 1,
      },
      name: 'Flexors',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 131,
        side_id: 1,
      },
      name: 'Lateral Collateral Ligament',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 130,
        side_id: 1,
      },
      name: 'Medial Collateral Ligament',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 22,
        side_id: 1,
      },
      name: 'Olecranon',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 291,
        side_id: 1,
      },
      name: 'Olecranon fossa',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 292,
        side_id: 1,
      },
      name: 'Other',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 128,
        side_id: 1,
      },
      name: 'Radio Ulner Joint',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 20,
        side_id: 1,
      },
      name: 'Radius',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 239,
        side_id: 1,
      },
      name: 'Tricep',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 21,
        side_id: 1,
      },
      name: 'Ulna',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 4,
        side_id: 3,
      },
      name: 'Elbow',
      description: 'Right',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 238,
        side_id: 3,
      },
      name: 'Bicep',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 289,
        side_id: 3,
      },
      name: 'Brachialis',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 290,
        side_id: 3,
      },
      name: 'Brachioradialis',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 19,
        side_id: 3,
      },
      name: 'Distal Humerus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 129,
        side_id: 3,
      },
      name: 'Elbow Joint',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 241,
        side_id: 3,
      },
      name: 'Extensors',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 240,
        side_id: 3,
      },
      name: 'Flexors',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 131,
        side_id: 3,
      },
      name: 'Lateral Collateral Ligament',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 130,
        side_id: 3,
      },
      name: 'Medial Collateral Ligament',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 22,
        side_id: 3,
      },
      name: 'Olecranon',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 291,
        side_id: 3,
      },
      name: 'Olecranon fossa',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 292,
        side_id: 3,
      },
      name: 'Other',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 128,
        side_id: 3,
      },
      name: 'Radio Ulner Joint',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 20,
        side_id: 3,
      },
      name: 'Radius',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 239,
        side_id: 3,
      },
      name: 'Tricep',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 21,
        side_id: 3,
      },
      name: 'Ulna',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 4,
        side_id: 4,
      },
      name: 'Elbow',
      description: 'Bilateral',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 238,
        side_id: 4,
      },
      name: 'Bicep',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 289,
        side_id: 4,
      },
      name: 'Brachialis',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 290,
        side_id: 4,
      },
      name: 'Brachioradialis',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 19,
        side_id: 4,
      },
      name: 'Distal Humerus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 129,
        side_id: 4,
      },
      name: 'Elbow Joint',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 241,
        side_id: 4,
      },
      name: 'Extensors',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 240,
        side_id: 4,
      },
      name: 'Flexors',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 131,
        side_id: 4,
      },
      name: 'Lateral Collateral Ligament',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 130,
        side_id: 4,
      },
      name: 'Medial Collateral Ligament',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 22,
        side_id: 4,
      },
      name: 'Olecranon',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 291,
        side_id: 4,
      },
      name: 'Olecranon fossa',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 292,
        side_id: 4,
      },
      name: 'Other',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 128,
        side_id: 4,
      },
      name: 'Radio Ulner Joint',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 20,
        side_id: 4,
      },
      name: 'Radius',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 239,
        side_id: 4,
      },
      name: 'Tricep',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 21,
        side_id: 4,
      },
      name: 'Ulna',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 5,
        side_id: 1,
      },
      name: 'Foot',
      description: 'Left',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 100,
        side_id: 1,
      },
      name: '1st Cuneiform',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 103,
        side_id: 1,
      },
      name: '1st Metatarsal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 221,
        side_id: 1,
      },
      name: '1st Metatarsal Phalangeal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 109,
        side_id: 1,
      },
      name: '1st Tarsal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 216,
        side_id: 1,
      },
      name: '1st Tarso-Metatarsal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 101,
        side_id: 1,
      },
      name: '2nd Cuneiform',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 104,
        side_id: 1,
      },
      name: '2nd Metatarsal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 222,
        side_id: 1,
      },
      name: '2nd Metatarsal Phalangeal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 110,
        side_id: 1,
      },
      name: '2nd Tarsal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 217,
        side_id: 1,
      },
      name: '2nd Tarso-Metatarsal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 102,
        side_id: 1,
      },
      name: '3rd Cuneiform',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 105,
        side_id: 1,
      },
      name: '3rd Metatarsal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 223,
        side_id: 1,
      },
      name: '3rd Metatarsal Phalangeal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 111,
        side_id: 1,
      },
      name: '3rd Tarsal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 218,
        side_id: 1,
      },
      name: '3rd Tarso-Metatarsal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 106,
        side_id: 1,
      },
      name: '4th Metatarsal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 224,
        side_id: 1,
      },
      name: '4th Metatarsal Phalangeal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 112,
        side_id: 1,
      },
      name: '4th Tarsal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 219,
        side_id: 1,
      },
      name: '4th Tarso-Metatarsal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 107,
        side_id: 1,
      },
      name: '5th Metatarsal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 225,
        side_id: 1,
      },
      name: '5th Metatarsal Phalangeal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 113,
        side_id: 1,
      },
      name: '5th Tarsal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 220,
        side_id: 1,
      },
      name: '5th Tarso-Metatarsal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 98,
        side_id: 1,
      },
      name: 'Calcaneus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 99,
        side_id: 1,
      },
      name: 'Cuboid',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 293,
        side_id: 1,
      },
      name: 'Extensor Digitorum Longus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 294,
        side_id: 1,
      },
      name: 'Extensor Hallucis Longus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 295,
        side_id: 1,
      },
      name: 'Flexor Digitorum Brevis',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 296,
        side_id: 1,
      },
      name: 'Flexor Digitorum Longus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 297,
        side_id: 1,
      },
      name: 'Flexor Hallucis Longus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 298,
        side_id: 1,
      },
      name: 'Heel',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 214,
        side_id: 1,
      },
      name: 'Lisfranc Joint',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 227,
        side_id: 1,
      },
      name: 'Lisfranc Ligament',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 299,
        side_id: 1,
      },
      name: 'Metatarsal(s)',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 215,
        side_id: 1,
      },
      name: 'Midfoot Joint',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 229,
        side_id: 1,
      },
      name: 'Midfoot Ligaments',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 108,
        side_id: 1,
      },
      name: 'Navicular',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 300,
        side_id: 1,
      },
      name: 'Other',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 226,
        side_id: 1,
      },
      name: 'Sesamoid Joint',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 209,
        side_id: 1,
      },
      name: 'Sub-talar',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 95,
        side_id: 1,
      },
      name: 'Talus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 228,
        side_id: 1,
      },
      name: 'Toe Ligaments',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 301,
        side_id: 1,
      },
      name: 'Toe(s)',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 5,
        side_id: 3,
      },
      name: 'Foot',
      description: 'Right',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 100,
        side_id: 3,
      },
      name: '1st Cuneiform',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 103,
        side_id: 3,
      },
      name: '1st Metatarsal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 221,
        side_id: 3,
      },
      name: '1st Metatarsal Phalangeal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 109,
        side_id: 3,
      },
      name: '1st Tarsal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 216,
        side_id: 3,
      },
      name: '1st Tarso-Metatarsal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 101,
        side_id: 3,
      },
      name: '2nd Cuneiform',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 104,
        side_id: 3,
      },
      name: '2nd Metatarsal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 222,
        side_id: 3,
      },
      name: '2nd Metatarsal Phalangeal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 110,
        side_id: 3,
      },
      name: '2nd Tarsal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 217,
        side_id: 3,
      },
      name: '2nd Tarso-Metatarsal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 102,
        side_id: 3,
      },
      name: '3rd Cuneiform',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 105,
        side_id: 3,
      },
      name: '3rd Metatarsal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 223,
        side_id: 3,
      },
      name: '3rd Metatarsal Phalangeal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 111,
        side_id: 3,
      },
      name: '3rd Tarsal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 218,
        side_id: 3,
      },
      name: '3rd Tarso-Metatarsal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 106,
        side_id: 3,
      },
      name: '4th Metatarsal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 224,
        side_id: 3,
      },
      name: '4th Metatarsal Phalangeal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 112,
        side_id: 3,
      },
      name: '4th Tarsal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 219,
        side_id: 3,
      },
      name: '4th Tarso-Metatarsal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 107,
        side_id: 3,
      },
      name: '5th Metatarsal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 225,
        side_id: 3,
      },
      name: '5th Metatarsal Phalangeal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 113,
        side_id: 3,
      },
      name: '5th Tarsal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 220,
        side_id: 3,
      },
      name: '5th Tarso-Metatarsal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 98,
        side_id: 3,
      },
      name: 'Calcaneus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 99,
        side_id: 3,
      },
      name: 'Cuboid',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 293,
        side_id: 3,
      },
      name: 'Extensor Digitorum Longus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 294,
        side_id: 3,
      },
      name: 'Extensor Hallucis Longus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 295,
        side_id: 3,
      },
      name: 'Flexor Digitorum Brevis',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 296,
        side_id: 3,
      },
      name: 'Flexor Digitorum Longus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 297,
        side_id: 3,
      },
      name: 'Flexor Hallucis Longus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 298,
        side_id: 3,
      },
      name: 'Heel',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 214,
        side_id: 3,
      },
      name: 'Lisfranc Joint',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 227,
        side_id: 3,
      },
      name: 'Lisfranc Ligament',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 299,
        side_id: 3,
      },
      name: 'Metatarsal(s)',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 215,
        side_id: 3,
      },
      name: 'Midfoot Joint',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 229,
        side_id: 3,
      },
      name: 'Midfoot Ligaments',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 108,
        side_id: 3,
      },
      name: 'Navicular',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 300,
        side_id: 3,
      },
      name: 'Other',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 226,
        side_id: 3,
      },
      name: 'Sesamoid Joint',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 209,
        side_id: 3,
      },
      name: 'Sub-talar',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 95,
        side_id: 3,
      },
      name: 'Talus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 228,
        side_id: 3,
      },
      name: 'Toe Ligaments',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 301,
        side_id: 3,
      },
      name: 'Toe(s)',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 5,
        side_id: 4,
      },
      name: 'Foot',
      description: 'Bilateral',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 100,
        side_id: 4,
      },
      name: '1st Cuneiform',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 103,
        side_id: 4,
      },
      name: '1st Metatarsal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 221,
        side_id: 4,
      },
      name: '1st Metatarsal Phalangeal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 109,
        side_id: 4,
      },
      name: '1st Tarsal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 216,
        side_id: 4,
      },
      name: '1st Tarso-Metatarsal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 101,
        side_id: 4,
      },
      name: '2nd Cuneiform',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 104,
        side_id: 4,
      },
      name: '2nd Metatarsal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 222,
        side_id: 4,
      },
      name: '2nd Metatarsal Phalangeal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 110,
        side_id: 4,
      },
      name: '2nd Tarsal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 217,
        side_id: 4,
      },
      name: '2nd Tarso-Metatarsal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 102,
        side_id: 4,
      },
      name: '3rd Cuneiform',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 105,
        side_id: 4,
      },
      name: '3rd Metatarsal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 223,
        side_id: 4,
      },
      name: '3rd Metatarsal Phalangeal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 111,
        side_id: 4,
      },
      name: '3rd Tarsal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 218,
        side_id: 4,
      },
      name: '3rd Tarso-Metatarsal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 106,
        side_id: 4,
      },
      name: '4th Metatarsal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 224,
        side_id: 4,
      },
      name: '4th Metatarsal Phalangeal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 112,
        side_id: 4,
      },
      name: '4th Tarsal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 219,
        side_id: 4,
      },
      name: '4th Tarso-Metatarsal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 107,
        side_id: 4,
      },
      name: '5th Metatarsal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 225,
        side_id: 4,
      },
      name: '5th Metatarsal Phalangeal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 113,
        side_id: 4,
      },
      name: '5th Tarsal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 220,
        side_id: 4,
      },
      name: '5th Tarso-Metatarsal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 98,
        side_id: 4,
      },
      name: 'Calcaneus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 99,
        side_id: 4,
      },
      name: 'Cuboid',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 293,
        side_id: 4,
      },
      name: 'Extensor Digitorum Longus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 294,
        side_id: 4,
      },
      name: 'Extensor Hallucis Longus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 295,
        side_id: 4,
      },
      name: 'Flexor Digitorum Brevis',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 296,
        side_id: 4,
      },
      name: 'Flexor Digitorum Longus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 297,
        side_id: 4,
      },
      name: 'Flexor Hallucis Longus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 298,
        side_id: 4,
      },
      name: 'Heel',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 214,
        side_id: 4,
      },
      name: 'Lisfranc Joint',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 227,
        side_id: 4,
      },
      name: 'Lisfranc Ligament',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 299,
        side_id: 4,
      },
      name: 'Metatarsal(s)',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 215,
        side_id: 4,
      },
      name: 'Midfoot Joint',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 229,
        side_id: 4,
      },
      name: 'Midfoot Ligaments',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 108,
        side_id: 4,
      },
      name: 'Navicular',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 300,
        side_id: 4,
      },
      name: 'Other',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 226,
        side_id: 4,
      },
      name: 'Sesamoid Joint',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 209,
        side_id: 4,
      },
      name: 'Sub-talar',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 95,
        side_id: 4,
      },
      name: 'Talus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 228,
        side_id: 4,
      },
      name: 'Toe Ligaments',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 301,
        side_id: 4,
      },
      name: 'Toe(s)',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 6,
        side_id: 1,
      },
      name: 'Forearm',
      description: 'Left',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 243,
        side_id: 1,
      },
      name: 'Extensors',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 242,
        side_id: 1,
      },
      name: 'Flexors',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 302,
        side_id: 1,
      },
      name: 'Other',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 23,
        side_id: 1,
      },
      name: 'Radius',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 24,
        side_id: 1,
      },
      name: 'Ulna',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 6,
        side_id: 3,
      },
      name: 'Forearm',
      description: 'Right',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 243,
        side_id: 3,
      },
      name: 'Extensors',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 242,
        side_id: 3,
      },
      name: 'Flexors',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 302,
        side_id: 3,
      },
      name: 'Other',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 23,
        side_id: 3,
      },
      name: 'Radius',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 24,
        side_id: 3,
      },
      name: 'Ulna',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 6,
        side_id: 4,
      },
      name: 'Forearm',
      description: 'Bilateral',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 243,
        side_id: 4,
      },
      name: 'Extensors',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 242,
        side_id: 4,
      },
      name: 'Flexors',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 302,
        side_id: 4,
      },
      name: 'Other',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 23,
        side_id: 4,
      },
      name: 'Radius',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 24,
        side_id: 4,
      },
      name: 'Ulna',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 7,
        side_id: 5,
      },
      name: 'Head',
      description: 'N/A',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 309,
        side_id: 5,
      },
      name: 'Abducens Nerve',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 310,
        side_id: 5,
      },
      name: 'Accessory Nerve',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 311,
        side_id: 5,
      },
      name: 'Acoustic Nerve',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 312,
        side_id: 5,
      },
      name: 'Brain',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 313,
        side_id: 5,
      },
      name: 'Chin',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 314,
        side_id: 5,
      },
      name: 'Cranial Nerve(s)',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 1,
        side_id: 5,
      },
      name: 'Cranium',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 315,
        side_id: 5,
      },
      name: 'Ear',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 316,
        side_id: 5,
      },
      name: 'Eyelid',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 317,
        side_id: 5,
      },
      name: 'Face',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 318,
        side_id: 5,
      },
      name: 'Facial Nerve',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 319,
        side_id: 5,
      },
      name: 'Forehead',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 320,
        side_id: 5,
      },
      name: 'Hypoglossal Nerve',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 321,
        side_id: 5,
      },
      name: 'Lip',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 4,
        side_id: 5,
      },
      name: 'Mandible',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 322,
        side_id: 5,
      },
      name: 'Mastoid',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 323,
        side_id: 5,
      },
      name: 'Mouth',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 3,
        side_id: 5,
      },
      name: 'Nasal',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 324,
        side_id: 5,
      },
      name: 'Oculomotor Nerve',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 325,
        side_id: 5,
      },
      name: 'Optic Nerve',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 2,
        side_id: 5,
      },
      name: 'Orbital',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 326,
        side_id: 5,
      },
      name: 'Other',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 327,
        side_id: 5,
      },
      name: 'Palate',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 328,
        side_id: 5,
      },
      name: 'Pineal Gland',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 329,
        side_id: 5,
      },
      name: 'Pituitary Gland',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 330,
        side_id: 5,
      },
      name: 'Scalp',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 114,
        side_id: 5,
      },
      name: 'TMJ',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 331,
        side_id: 5,
      },
      name: 'Tongue',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 332,
        side_id: 5,
      },
      name: 'Tooth/Teeth',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 333,
        side_id: 5,
      },
      name: 'Trigeminal Nerve',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 334,
        side_id: 5,
      },
      name: 'Trochlear Nerve',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 5,
        side_id: 5,
      },
      name: 'Zygomatic',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 8,
        side_id: 1,
      },
      name: 'Hip/Groin',
      description: 'Left',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 80,
        side_id: 1,
      },
      name: 'Acetabulum',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 77,
        side_id: 1,
      },
      name: 'Acetabulum',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 303,
        side_id: 1,
      },
      name: 'Adductor Brevis',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 304,
        side_id: 1,
      },
      name: 'Adductor Longus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 305,
        side_id: 1,
      },
      name: 'Adductor Magnus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 251,
        side_id: 1,
      },
      name: 'Adductors',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 79,
        side_id: 1,
      },
      name: 'Femur',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 82,
        side_id: 1,
      },
      name: 'Femur',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 339,
        side_id: 1,
      },
      name: 'Gracilis',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 335,
        side_id: 1,
      },
      name: 'Greater Trochanter',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 191,
        side_id: 1,
      },
      name: 'Hip',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 193,
        side_id: 1,
      },
      name: 'Hip',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 252,
        side_id: 1,
      },
      name: 'Hip Flexor',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 76,
        side_id: 1,
      },
      name: 'Ilium',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 253,
        side_id: 1,
      },
      name: 'Lower Abdominals',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 336,
        side_id: 1,
      },
      name: 'Other',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 306,
        side_id: 1,
      },
      name: 'Pectineus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 337,
        side_id: 1,
      },
      name: 'Piriformis',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 194,
        side_id: 1,
      },
      name: 'Pubic Symphysis',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 192,
        side_id: 1,
      },
      name: 'Pubic Symphysis',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 78,
        side_id: 1,
      },
      name: 'Pubis',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 81,
        side_id: 1,
      },
      name: 'Pubis',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 338,
        side_id: 1,
      },
      name: 'Tensor Fascia Lata (TFL)',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 8,
        side_id: 3,
      },
      name: 'Hip/Groin',
      description: 'Right',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 80,
        side_id: 3,
      },
      name: 'Acetabulum',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 77,
        side_id: 3,
      },
      name: 'Acetabulum',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 303,
        side_id: 3,
      },
      name: 'Adductor Brevis',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 304,
        side_id: 3,
      },
      name: 'Adductor Longus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 305,
        side_id: 3,
      },
      name: 'Adductor Magnus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 251,
        side_id: 3,
      },
      name: 'Adductors',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 79,
        side_id: 3,
      },
      name: 'Femur',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 82,
        side_id: 3,
      },
      name: 'Femur',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 339,
        side_id: 3,
      },
      name: 'Gracilis',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 335,
        side_id: 3,
      },
      name: 'Greater Trochanter',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 191,
        side_id: 3,
      },
      name: 'Hip',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 193,
        side_id: 3,
      },
      name: 'Hip',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 252,
        side_id: 3,
      },
      name: 'Hip Flexor',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 76,
        side_id: 3,
      },
      name: 'Ilium',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 253,
        side_id: 3,
      },
      name: 'Lower Abdominals',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 336,
        side_id: 3,
      },
      name: 'Other',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 306,
        side_id: 3,
      },
      name: 'Pectineus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 337,
        side_id: 3,
      },
      name: 'Piriformis',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 194,
        side_id: 3,
      },
      name: 'Pubic Symphysis',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 192,
        side_id: 3,
      },
      name: 'Pubic Symphysis',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 78,
        side_id: 3,
      },
      name: 'Pubis',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 81,
        side_id: 3,
      },
      name: 'Pubis',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 338,
        side_id: 3,
      },
      name: 'Tensor Fascia Lata (TFL)',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 8,
        side_id: 4,
      },
      name: 'Hip/Groin',
      description: 'Bilateral',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 80,
        side_id: 4,
      },
      name: 'Acetabulum',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 77,
        side_id: 4,
      },
      name: 'Acetabulum',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 303,
        side_id: 4,
      },
      name: 'Adductor Brevis',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 304,
        side_id: 4,
      },
      name: 'Adductor Longus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 305,
        side_id: 4,
      },
      name: 'Adductor Magnus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 251,
        side_id: 4,
      },
      name: 'Adductors',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 79,
        side_id: 4,
      },
      name: 'Femur',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 82,
        side_id: 4,
      },
      name: 'Femur',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 339,
        side_id: 4,
      },
      name: 'Gracilis',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 335,
        side_id: 4,
      },
      name: 'Greater Trochanter',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 191,
        side_id: 4,
      },
      name: 'Hip',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 193,
        side_id: 4,
      },
      name: 'Hip',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 252,
        side_id: 4,
      },
      name: 'Hip Flexor',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 76,
        side_id: 4,
      },
      name: 'Ilium',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 253,
        side_id: 4,
      },
      name: 'Lower Abdominals',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 336,
        side_id: 4,
      },
      name: 'Other',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 306,
        side_id: 4,
      },
      name: 'Pectineus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 337,
        side_id: 4,
      },
      name: 'Piriformis',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 194,
        side_id: 4,
      },
      name: 'Pubic Symphysis',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 192,
        side_id: 4,
      },
      name: 'Pubic Symphysis',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 78,
        side_id: 4,
      },
      name: 'Pubis',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 81,
        side_id: 4,
      },
      name: 'Pubis',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 338,
        side_id: 4,
      },
      name: 'Tensor Fascia Lata (TFL)',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 9,
        side_id: 1,
      },
      name: 'Knee',
      description: 'Left',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 259,
        side_id: 1,
      },
      name: 'Achilles',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 198,
        side_id: 1,
      },
      name: 'Anterior Cruciate Ligament',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 257,
        side_id: 1,
      },
      name: 'Calf',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 84,
        side_id: 1,
      },
      name: 'Femur',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 85,
        side_id: 1,
      },
      name: 'Fibula',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 263,
        side_id: 1,
      },
      name: 'Iliotibial Band',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 201,
        side_id: 1,
      },
      name: 'Lateral Collateral Ligament',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 200,
        side_id: 1,
      },
      name: 'Medial Collateral Ligament',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 341,
        side_id: 1,
      },
      name: 'Other',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 86,
        side_id: 1,
      },
      name: 'Patella',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 261,
        side_id: 1,
      },
      name: 'Patellar Tendon',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 195,
        side_id: 1,
      },
      name: 'Patello-femoral',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 258,
        side_id: 1,
      },
      name: 'Peroneals',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 340,
        side_id: 1,
      },
      name: 'Popliteal Fossa',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 342,
        side_id: 1,
      },
      name: 'Popliteus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 199,
        side_id: 1,
      },
      name: 'Posterior Cruciate Ligament',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 197,
        side_id: 1,
      },
      name: 'Proximal Tib/Fib',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 343,
        side_id: 1,
      },
      name: 'Proximal Tib/Fib Joint',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 87,
        side_id: 1,
      },
      name: 'Tibia',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 196,
        side_id: 1,
      },
      name: 'Tibio-femoral',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 9,
        side_id: 3,
      },
      name: 'Knee',
      description: 'Right',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 259,
        side_id: 3,
      },
      name: 'Achilles',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 198,
        side_id: 3,
      },
      name: 'Anterior Cruciate Ligament',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 257,
        side_id: 3,
      },
      name: 'Calf',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 84,
        side_id: 3,
      },
      name: 'Femur',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 85,
        side_id: 3,
      },
      name: 'Fibula',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 263,
        side_id: 3,
      },
      name: 'Iliotibial Band',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 201,
        side_id: 3,
      },
      name: 'Lateral Collateral Ligament',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 200,
        side_id: 3,
      },
      name: 'Medial Collateral Ligament',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 341,
        side_id: 3,
      },
      name: 'Other',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 86,
        side_id: 3,
      },
      name: 'Patella',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 261,
        side_id: 3,
      },
      name: 'Patellar Tendon',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 195,
        side_id: 3,
      },
      name: 'Patello-femoral',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 258,
        side_id: 3,
      },
      name: 'Peroneals',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 340,
        side_id: 3,
      },
      name: 'Popliteal Fossa',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 342,
        side_id: 3,
      },
      name: 'Popliteus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 199,
        side_id: 3,
      },
      name: 'Posterior Cruciate Ligament',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 197,
        side_id: 3,
      },
      name: 'Proximal Tib/Fib',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 343,
        side_id: 3,
      },
      name: 'Proximal Tib/Fib Joint',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 87,
        side_id: 3,
      },
      name: 'Tibia',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 196,
        side_id: 3,
      },
      name: 'Tibio-femoral',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 9,
        side_id: 4,
      },
      name: 'Knee',
      description: 'Bilateral',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 259,
        side_id: 4,
      },
      name: 'Achilles',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 198,
        side_id: 4,
      },
      name: 'Anterior Cruciate Ligament',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 257,
        side_id: 4,
      },
      name: 'Calf',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 84,
        side_id: 4,
      },
      name: 'Femur',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 85,
        side_id: 4,
      },
      name: 'Fibula',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 263,
        side_id: 4,
      },
      name: 'Iliotibial Band',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 201,
        side_id: 4,
      },
      name: 'Lateral Collateral Ligament',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 200,
        side_id: 4,
      },
      name: 'Medial Collateral Ligament',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 341,
        side_id: 4,
      },
      name: 'Other',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 86,
        side_id: 4,
      },
      name: 'Patella',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 261,
        side_id: 4,
      },
      name: 'Patellar Tendon',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 195,
        side_id: 4,
      },
      name: 'Patello-femoral',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 258,
        side_id: 4,
      },
      name: 'Peroneals',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 340,
        side_id: 4,
      },
      name: 'Popliteal Fossa',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 342,
        side_id: 4,
      },
      name: 'Popliteus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 199,
        side_id: 4,
      },
      name: 'Posterior Cruciate Ligament',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 197,
        side_id: 4,
      },
      name: 'Proximal Tib/Fib',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 343,
        side_id: 4,
      },
      name: 'Proximal Tib/Fib Joint',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 87,
        side_id: 4,
      },
      name: 'Tibia',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 196,
        side_id: 4,
      },
      name: 'Tibio-femoral',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 10,
        side_id: 1,
      },
      name: 'Lower Leg',
      description: 'Left',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 88,
        side_id: 1,
      },
      name: 'Fibula',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 344,
        side_id: 1,
      },
      name: 'Gastrocnemius',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 345,
        side_id: 1,
      },
      name: 'Other',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 346,
        side_id: 1,
      },
      name: 'Peroneal Muscle(s)',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 347,
        side_id: 1,
      },
      name: 'Peroneus Brevis',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 348,
        side_id: 1,
      },
      name: 'Peroneus Longus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 349,
        side_id: 1,
      },
      name: 'Peroneus Tertius',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 350,
        side_id: 1,
      },
      name: 'Plantaris',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 351,
        side_id: 1,
      },
      name: 'Soleus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 89,
        side_id: 1,
      },
      name: 'Tibia',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 352,
        side_id: 1,
      },
      name: 'Tibialis Anterior',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 353,
        side_id: 1,
      },
      name: 'Tibialis Posterior',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 10,
        side_id: 3,
      },
      name: 'Lower Leg',
      description: 'Right',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 88,
        side_id: 3,
      },
      name: 'Fibula',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 344,
        side_id: 3,
      },
      name: 'Gastrocnemius',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 345,
        side_id: 3,
      },
      name: 'Other',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 346,
        side_id: 3,
      },
      name: 'Peroneal Muscle(s)',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 347,
        side_id: 3,
      },
      name: 'Peroneus Brevis',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 348,
        side_id: 3,
      },
      name: 'Peroneus Longus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 349,
        side_id: 3,
      },
      name: 'Peroneus Tertius',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 350,
        side_id: 3,
      },
      name: 'Plantaris',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 351,
        side_id: 3,
      },
      name: 'Soleus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 89,
        side_id: 3,
      },
      name: 'Tibia',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 352,
        side_id: 3,
      },
      name: 'Tibialis Anterior',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 353,
        side_id: 3,
      },
      name: 'Tibialis Posterior',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 10,
        side_id: 4,
      },
      name: 'Lower Leg',
      description: 'Bilateral',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 88,
        side_id: 4,
      },
      name: 'Fibula',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 344,
        side_id: 4,
      },
      name: 'Gastrocnemius',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 345,
        side_id: 4,
      },
      name: 'Other',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 346,
        side_id: 4,
      },
      name: 'Peroneal Muscle(s)',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 347,
        side_id: 4,
      },
      name: 'Peroneus Brevis',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 348,
        side_id: 4,
      },
      name: 'Peroneus Longus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 349,
        side_id: 4,
      },
      name: 'Peroneus Tertius',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 350,
        side_id: 4,
      },
      name: 'Plantaris',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 351,
        side_id: 4,
      },
      name: 'Soleus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 89,
        side_id: 4,
      },
      name: 'Tibia',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 352,
        side_id: 4,
      },
      name: 'Tibialis Anterior',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 353,
        side_id: 4,
      },
      name: 'Tibialis Posterior',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 11,
        side_id: 1,
      },
      name: 'Lumbar Spine',
      description: 'Left',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 68,
        side_id: 1,
      },
      name: 'L1',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 185,
        side_id: 1,
      },
      name: 'L1/L2',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 69,
        side_id: 1,
      },
      name: 'L2',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 186,
        side_id: 1,
      },
      name: 'L2/L3',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 70,
        side_id: 1,
      },
      name: 'L3',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 187,
        side_id: 1,
      },
      name: 'L3/L4',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 71,
        side_id: 1,
      },
      name: 'L4',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 188,
        side_id: 1,
      },
      name: 'L4/L5',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 72,
        side_id: 1,
      },
      name: 'L5',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 189,
        side_id: 1,
      },
      name: 'L5/S1',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 249,
        side_id: 1,
      },
      name: 'Lumbar',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 354,
        side_id: 1,
      },
      name: 'Lumbar Nerve Root',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 355,
        side_id: 1,
      },
      name: 'Other',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 356,
        side_id: 1,
      },
      name: 'Quadratus Lomborum (QL)',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 357,
        side_id: 1,
      },
      name: 'Sacral Nerve Root',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 190,
        side_id: 1,
      },
      name: 'Sacro-iliac',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 184,
        side_id: 1,
      },
      name: 'T12/L1',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 11,
        side_id: 2,
      },
      name: 'Lumbar Spine',
      description: 'Center',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 68,
        side_id: 2,
      },
      name: 'L1',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 185,
        side_id: 2,
      },
      name: 'L1/L2',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 69,
        side_id: 2,
      },
      name: 'L2',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 186,
        side_id: 2,
      },
      name: 'L2/L3',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 70,
        side_id: 2,
      },
      name: 'L3',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 187,
        side_id: 2,
      },
      name: 'L3/L4',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 71,
        side_id: 2,
      },
      name: 'L4',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 188,
        side_id: 2,
      },
      name: 'L4/L5',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 72,
        side_id: 2,
      },
      name: 'L5',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 189,
        side_id: 2,
      },
      name: 'L5/S1',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 249,
        side_id: 2,
      },
      name: 'Lumbar',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 354,
        side_id: 2,
      },
      name: 'Lumbar Nerve Root',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 355,
        side_id: 2,
      },
      name: 'Other',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 356,
        side_id: 2,
      },
      name: 'Quadratus Lomborum (QL)',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 357,
        side_id: 2,
      },
      name: 'Sacral Nerve Root',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 190,
        side_id: 2,
      },
      name: 'Sacro-iliac',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 184,
        side_id: 2,
      },
      name: 'T12/L1',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 11,
        side_id: 3,
      },
      name: 'Lumbar Spine',
      description: 'Right',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 68,
        side_id: 3,
      },
      name: 'L1',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 185,
        side_id: 3,
      },
      name: 'L1/L2',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 69,
        side_id: 3,
      },
      name: 'L2',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 186,
        side_id: 3,
      },
      name: 'L2/L3',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 70,
        side_id: 3,
      },
      name: 'L3',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 187,
        side_id: 3,
      },
      name: 'L3/L4',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 71,
        side_id: 3,
      },
      name: 'L4',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 188,
        side_id: 3,
      },
      name: 'L4/L5',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 72,
        side_id: 3,
      },
      name: 'L5',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 189,
        side_id: 3,
      },
      name: 'L5/S1',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 249,
        side_id: 3,
      },
      name: 'Lumbar',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 354,
        side_id: 3,
      },
      name: 'Lumbar Nerve Root',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 355,
        side_id: 3,
      },
      name: 'Other',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 356,
        side_id: 3,
      },
      name: 'Quadratus Lomborum (QL)',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 357,
        side_id: 3,
      },
      name: 'Sacral Nerve Root',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 190,
        side_id: 3,
      },
      name: 'Sacro-iliac',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 184,
        side_id: 3,
      },
      name: 'T12/L1',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 11,
        side_id: 4,
      },
      name: 'Lumbar Spine',
      description: 'Bilateral',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 68,
        side_id: 4,
      },
      name: 'L1',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 185,
        side_id: 4,
      },
      name: 'L1/L2',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 69,
        side_id: 4,
      },
      name: 'L2',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 186,
        side_id: 4,
      },
      name: 'L2/L3',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 70,
        side_id: 4,
      },
      name: 'L3',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 187,
        side_id: 4,
      },
      name: 'L3/L4',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 71,
        side_id: 4,
      },
      name: 'L4',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 188,
        side_id: 4,
      },
      name: 'L4/L5',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 72,
        side_id: 4,
      },
      name: 'L5',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 189,
        side_id: 4,
      },
      name: 'L5/S1',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 249,
        side_id: 4,
      },
      name: 'Lumbar',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 354,
        side_id: 4,
      },
      name: 'Lumbar Nerve Root',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 355,
        side_id: 4,
      },
      name: 'Other',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 356,
        side_id: 4,
      },
      name: 'Quadratus Lomborum (QL)',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 357,
        side_id: 4,
      },
      name: 'Sacral Nerve Root',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 190,
        side_id: 4,
      },
      name: 'Sacro-iliac',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 184,
        side_id: 4,
      },
      name: 'T12/L1',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 11,
        side_id: 5,
      },
      name: 'Lumbar Spine',
      description: 'N/A',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 68,
        side_id: 5,
      },
      name: 'L1',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 185,
        side_id: 5,
      },
      name: 'L1/L2',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 69,
        side_id: 5,
      },
      name: 'L2',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 186,
        side_id: 5,
      },
      name: 'L2/L3',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 70,
        side_id: 5,
      },
      name: 'L3',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 187,
        side_id: 5,
      },
      name: 'L3/L4',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 71,
        side_id: 5,
      },
      name: 'L4',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 188,
        side_id: 5,
      },
      name: 'L4/L5',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 72,
        side_id: 5,
      },
      name: 'L5',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 189,
        side_id: 5,
      },
      name: 'L5/S1',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 249,
        side_id: 5,
      },
      name: 'Lumbar',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 354,
        side_id: 5,
      },
      name: 'Lumbar Nerve Root',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 355,
        side_id: 5,
      },
      name: 'Other',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 356,
        side_id: 5,
      },
      name: 'Quadratus Lomborum (QL)',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 357,
        side_id: 5,
      },
      name: 'Sacral Nerve Root',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 190,
        side_id: 5,
      },
      name: 'Sacro-iliac',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 184,
        side_id: 5,
      },
      name: 'T12/L1',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 12,
        side_id: 1,
      },
      name: 'Neck',
      description: 'Left',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 358,
        side_id: 1,
      },
      name: 'Brachial Plexus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 115,
        side_id: 1,
      },
      name: 'C0/C1',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 6,
        side_id: 1,
      },
      name: 'C1',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 116,
        side_id: 1,
      },
      name: 'C1/C2',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 7,
        side_id: 1,
      },
      name: 'C2',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 117,
        side_id: 1,
      },
      name: 'C2/C3',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 8,
        side_id: 1,
      },
      name: 'C3',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 118,
        side_id: 1,
      },
      name: 'C3/C4',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 9,
        side_id: 1,
      },
      name: 'C4',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 119,
        side_id: 1,
      },
      name: 'C4/C5',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 10,
        side_id: 1,
      },
      name: 'C5',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 120,
        side_id: 1,
      },
      name: 'C5/C6',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 11,
        side_id: 1,
      },
      name: 'C6',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 121,
        side_id: 1,
      },
      name: 'C6/C7',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 12,
        side_id: 1,
      },
      name: 'C7',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 359,
        side_id: 1,
      },
      name: 'Cervical Nerve Root',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 360,
        side_id: 1,
      },
      name: 'Cervical Spine',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 361,
        side_id: 1,
      },
      name: 'Larynx',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 362,
        side_id: 1,
      },
      name: 'Other',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 363,
        side_id: 1,
      },
      name: 'Scalene Muscle(s)',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 364,
        side_id: 1,
      },
      name: 'Sternocleidomastoid (SCM)',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 365,
        side_id: 1,
      },
      name: 'Suboccipital',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 366,
        side_id: 1,
      },
      name: 'Throat',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 367,
        side_id: 1,
      },
      name: 'Thyroid Gland',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 12,
        side_id: 2,
      },
      name: 'Neck',
      description: 'Center',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 358,
        side_id: 2,
      },
      name: 'Brachial Plexus',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 115,
        side_id: 2,
      },
      name: 'C0/C1',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 6,
        side_id: 2,
      },
      name: 'C1',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 116,
        side_id: 2,
      },
      name: 'C1/C2',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 7,
        side_id: 2,
      },
      name: 'C2',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 117,
        side_id: 2,
      },
      name: 'C2/C3',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 8,
        side_id: 2,
      },
      name: 'C3',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 118,
        side_id: 2,
      },
      name: 'C3/C4',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 9,
        side_id: 2,
      },
      name: 'C4',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 119,
        side_id: 2,
      },
      name: 'C4/C5',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 10,
        side_id: 2,
      },
      name: 'C5',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 120,
        side_id: 2,
      },
      name: 'C5/C6',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 11,
        side_id: 2,
      },
      name: 'C6',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 121,
        side_id: 2,
      },
      name: 'C6/C7',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 12,
        side_id: 2,
      },
      name: 'C7',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 359,
        side_id: 2,
      },
      name: 'Cervical Nerve Root',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 360,
        side_id: 2,
      },
      name: 'Cervical Spine',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 361,
        side_id: 2,
      },
      name: 'Larynx',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 362,
        side_id: 2,
      },
      name: 'Other',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 363,
        side_id: 2,
      },
      name: 'Scalene Muscle(s)',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 364,
        side_id: 2,
      },
      name: 'Sternocleidomastoid (SCM)',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 365,
        side_id: 2,
      },
      name: 'Suboccipital',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 366,
        side_id: 2,
      },
      name: 'Throat',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 367,
        side_id: 2,
      },
      name: 'Thyroid Gland',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 12,
        side_id: 3,
      },
      name: 'Neck',
      description: 'Right',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 358,
        side_id: 3,
      },
      name: 'Brachial Plexus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 115,
        side_id: 3,
      },
      name: 'C0/C1',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 6,
        side_id: 3,
      },
      name: 'C1',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 116,
        side_id: 3,
      },
      name: 'C1/C2',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 7,
        side_id: 3,
      },
      name: 'C2',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 117,
        side_id: 3,
      },
      name: 'C2/C3',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 8,
        side_id: 3,
      },
      name: 'C3',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 118,
        side_id: 3,
      },
      name: 'C3/C4',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 9,
        side_id: 3,
      },
      name: 'C4',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 119,
        side_id: 3,
      },
      name: 'C4/C5',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 10,
        side_id: 3,
      },
      name: 'C5',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 120,
        side_id: 3,
      },
      name: 'C5/C6',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 11,
        side_id: 3,
      },
      name: 'C6',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 121,
        side_id: 3,
      },
      name: 'C6/C7',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 12,
        side_id: 3,
      },
      name: 'C7',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 359,
        side_id: 3,
      },
      name: 'Cervical Nerve Root',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 360,
        side_id: 3,
      },
      name: 'Cervical Spine',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 361,
        side_id: 3,
      },
      name: 'Larynx',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 362,
        side_id: 3,
      },
      name: 'Other',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 363,
        side_id: 3,
      },
      name: 'Scalene Muscle(s)',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 364,
        side_id: 3,
      },
      name: 'Sternocleidomastoid (SCM)',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 365,
        side_id: 3,
      },
      name: 'Suboccipital',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 366,
        side_id: 3,
      },
      name: 'Throat',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 367,
        side_id: 3,
      },
      name: 'Thyroid Gland',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 12,
        side_id: 4,
      },
      name: 'Neck',
      description: 'Bilateral',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 358,
        side_id: 4,
      },
      name: 'Brachial Plexus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 115,
        side_id: 4,
      },
      name: 'C0/C1',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 6,
        side_id: 4,
      },
      name: 'C1',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 116,
        side_id: 4,
      },
      name: 'C1/C2',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 7,
        side_id: 4,
      },
      name: 'C2',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 117,
        side_id: 4,
      },
      name: 'C2/C3',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 8,
        side_id: 4,
      },
      name: 'C3',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 118,
        side_id: 4,
      },
      name: 'C3/C4',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 9,
        side_id: 4,
      },
      name: 'C4',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 119,
        side_id: 4,
      },
      name: 'C4/C5',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 10,
        side_id: 4,
      },
      name: 'C5',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 120,
        side_id: 4,
      },
      name: 'C5/C6',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 11,
        side_id: 4,
      },
      name: 'C6',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 121,
        side_id: 4,
      },
      name: 'C6/C7',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 12,
        side_id: 4,
      },
      name: 'C7',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 359,
        side_id: 4,
      },
      name: 'Cervical Nerve Root',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 360,
        side_id: 4,
      },
      name: 'Cervical Spine',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 361,
        side_id: 4,
      },
      name: 'Larynx',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 362,
        side_id: 4,
      },
      name: 'Other',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 363,
        side_id: 4,
      },
      name: 'Scalene Muscle(s)',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 364,
        side_id: 4,
      },
      name: 'Sternocleidomastoid (SCM)',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 365,
        side_id: 4,
      },
      name: 'Suboccipital',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 366,
        side_id: 4,
      },
      name: 'Throat',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 367,
        side_id: 4,
      },
      name: 'Thyroid Gland',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 12,
        side_id: 5,
      },
      name: 'Neck',
      description: 'N/A',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 358,
        side_id: 5,
      },
      name: 'Brachial Plexus',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 115,
        side_id: 5,
      },
      name: 'C0/C1',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 6,
        side_id: 5,
      },
      name: 'C1',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 116,
        side_id: 5,
      },
      name: 'C1/C2',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 7,
        side_id: 5,
      },
      name: 'C2',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 117,
        side_id: 5,
      },
      name: 'C2/C3',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 8,
        side_id: 5,
      },
      name: 'C3',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 118,
        side_id: 5,
      },
      name: 'C3/C4',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 9,
        side_id: 5,
      },
      name: 'C4',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 119,
        side_id: 5,
      },
      name: 'C4/C5',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 10,
        side_id: 5,
      },
      name: 'C5',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 120,
        side_id: 5,
      },
      name: 'C5/C6',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 11,
        side_id: 5,
      },
      name: 'C6',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 121,
        side_id: 5,
      },
      name: 'C6/C7',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 12,
        side_id: 5,
      },
      name: 'C7',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 359,
        side_id: 5,
      },
      name: 'Cervical Nerve Root',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 360,
        side_id: 5,
      },
      name: 'Cervical Spine',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 361,
        side_id: 5,
      },
      name: 'Larynx',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 362,
        side_id: 5,
      },
      name: 'Other',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 363,
        side_id: 5,
      },
      name: 'Scalene Muscle(s)',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 364,
        side_id: 5,
      },
      name: 'Sternocleidomastoid (SCM)',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 365,
        side_id: 5,
      },
      name: 'Suboccipital',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 366,
        side_id: 5,
      },
      name: 'Throat',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 367,
        side_id: 5,
      },
      name: 'Thyroid Gland',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 13,
        side_id: 1,
      },
      name: 'Shoulder',
      description: 'Left',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 122,
        side_id: 1,
      },
      name: 'AC Joint',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 123,
        side_id: 1,
      },
      name: 'AC Ligament',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 378,
        side_id: 1,
      },
      name: 'Anterior Capsule',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 231,
        side_id: 1,
      },
      name: 'Bicep',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 13,
        side_id: 1,
      },
      name: 'Clavicle',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 379,
        side_id: 1,
      },
      name: 'Coracobrachialis',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 17,
        side_id: 1,
      },
      name: 'Coracoid',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 264,
        side_id: 1,
      },
      name: 'Deltoid',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 380,
        side_id: 1,
      },
      name: 'Deltoid Muscle',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 124,
        side_id: 1,
      },
      name: 'Glenohumeral',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 16,
        side_id: 1,
      },
      name: 'Glenoid',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 15,
        side_id: 1,
      },
      name: 'Head of Humerus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 381,
        side_id: 1,
      },
      name: 'Infraspinatus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 382,
        side_id: 1,
      },
      name: 'Labrum',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 234,
        side_id: 1,
      },
      name: 'Other',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 233,
        side_id: 1,
      },
      name: 'Pectoralis',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 383,
        side_id: 1,
      },
      name: 'Posterior Capsule',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 230,
        side_id: 1,
      },
      name: 'Rotator Cuff',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 126,
        side_id: 1,
      },
      name: 'SC Joint',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 127,
        side_id: 1,
      },
      name: 'SC Ligament',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 14,
        side_id: 1,
      },
      name: 'Scapula',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 125,
        side_id: 1,
      },
      name: 'Scapulo-thoracic',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 384,
        side_id: 1,
      },
      name: 'Subscapularis',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 385,
        side_id: 1,
      },
      name: 'Supraspinatus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 386,
        side_id: 1,
      },
      name: 'Teres Major',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 387,
        side_id: 1,
      },
      name: 'Teres Minor',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 232,
        side_id: 1,
      },
      name: 'Tricep',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 13,
        side_id: 3,
      },
      name: 'Shoulder',
      description: 'Right',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 122,
        side_id: 3,
      },
      name: 'AC Joint',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 123,
        side_id: 3,
      },
      name: 'AC Ligament',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 378,
        side_id: 3,
      },
      name: 'Anterior Capsule',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 231,
        side_id: 3,
      },
      name: 'Bicep',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 13,
        side_id: 3,
      },
      name: 'Clavicle',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 379,
        side_id: 3,
      },
      name: 'Coracobrachialis',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 17,
        side_id: 3,
      },
      name: 'Coracoid',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 264,
        side_id: 3,
      },
      name: 'Deltoid',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 380,
        side_id: 3,
      },
      name: 'Deltoid Muscle',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 124,
        side_id: 3,
      },
      name: 'Glenohumeral',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 16,
        side_id: 3,
      },
      name: 'Glenoid',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 15,
        side_id: 3,
      },
      name: 'Head of Humerus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 381,
        side_id: 3,
      },
      name: 'Infraspinatus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 382,
        side_id: 3,
      },
      name: 'Labrum',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 234,
        side_id: 3,
      },
      name: 'Other',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 233,
        side_id: 3,
      },
      name: 'Pectoralis',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 383,
        side_id: 3,
      },
      name: 'Posterior Capsule',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 230,
        side_id: 3,
      },
      name: 'Rotator Cuff',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 126,
        side_id: 3,
      },
      name: 'SC Joint',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 127,
        side_id: 3,
      },
      name: 'SC Ligament',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 14,
        side_id: 3,
      },
      name: 'Scapula',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 125,
        side_id: 3,
      },
      name: 'Scapulo-thoracic',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 384,
        side_id: 3,
      },
      name: 'Subscapularis',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 385,
        side_id: 3,
      },
      name: 'Supraspinatus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 386,
        side_id: 3,
      },
      name: 'Teres Major',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 387,
        side_id: 3,
      },
      name: 'Teres Minor',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 232,
        side_id: 3,
      },
      name: 'Tricep',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 13,
        side_id: 4,
      },
      name: 'Shoulder',
      description: 'Bilateral',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 122,
        side_id: 4,
      },
      name: 'AC Joint',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 123,
        side_id: 4,
      },
      name: 'AC Ligament',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 378,
        side_id: 4,
      },
      name: 'Anterior Capsule',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 231,
        side_id: 4,
      },
      name: 'Bicep',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 13,
        side_id: 4,
      },
      name: 'Clavicle',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 379,
        side_id: 4,
      },
      name: 'Coracobrachialis',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 17,
        side_id: 4,
      },
      name: 'Coracoid',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 264,
        side_id: 4,
      },
      name: 'Deltoid',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 380,
        side_id: 4,
      },
      name: 'Deltoid Muscle',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 124,
        side_id: 4,
      },
      name: 'Glenohumeral',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 16,
        side_id: 4,
      },
      name: 'Glenoid',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 15,
        side_id: 4,
      },
      name: 'Head of Humerus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 381,
        side_id: 4,
      },
      name: 'Infraspinatus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 382,
        side_id: 4,
      },
      name: 'Labrum',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 234,
        side_id: 4,
      },
      name: 'Other',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 233,
        side_id: 4,
      },
      name: 'Pectoralis',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 383,
        side_id: 4,
      },
      name: 'Posterior Capsule',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 230,
        side_id: 4,
      },
      name: 'Rotator Cuff',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 126,
        side_id: 4,
      },
      name: 'SC Joint',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 127,
        side_id: 4,
      },
      name: 'SC Ligament',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 14,
        side_id: 4,
      },
      name: 'Scapula',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 125,
        side_id: 4,
      },
      name: 'Scapulo-thoracic',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 384,
        side_id: 4,
      },
      name: 'Subscapularis',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 385,
        side_id: 4,
      },
      name: 'Supraspinatus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 386,
        side_id: 4,
      },
      name: 'Teres Major',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 387,
        side_id: 4,
      },
      name: 'Teres Minor',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 232,
        side_id: 4,
      },
      name: 'Tricep',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 15,
        side_id: 1,
      },
      name: 'Thigh',
      description: 'Left',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 388,
        side_id: 1,
      },
      name: 'Biceps Femoris',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 83,
        side_id: 1,
      },
      name: 'Femur',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 256,
        side_id: 1,
      },
      name: 'Hamstring',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 389,
        side_id: 1,
      },
      name: 'Iliotibial (IT) Band',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 390,
        side_id: 1,
      },
      name: 'Other',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 254,
        side_id: 1,
      },
      name: 'Quadricep',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 255,
        side_id: 1,
      },
      name: 'Rectus Femoris',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 391,
        side_id: 1,
      },
      name: 'Sartorius',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 392,
        side_id: 1,
      },
      name: 'Semimembranosus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 393,
        side_id: 1,
      },
      name: 'Semitendinosus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 394,
        side_id: 1,
      },
      name: 'Vastus Intermedius',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 395,
        side_id: 1,
      },
      name: 'Vastus Lateralis',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 396,
        side_id: 1,
      },
      name: 'Vastus Medialis',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 15,
        side_id: 3,
      },
      name: 'Thigh',
      description: 'Right',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 388,
        side_id: 3,
      },
      name: 'Biceps Femoris',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 83,
        side_id: 3,
      },
      name: 'Femur',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 256,
        side_id: 3,
      },
      name: 'Hamstring',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 389,
        side_id: 3,
      },
      name: 'Iliotibial (IT) Band',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 390,
        side_id: 3,
      },
      name: 'Other',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 254,
        side_id: 3,
      },
      name: 'Quadricep',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 255,
        side_id: 3,
      },
      name: 'Rectus Femoris',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 391,
        side_id: 3,
      },
      name: 'Sartorius',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 392,
        side_id: 3,
      },
      name: 'Semimembranosus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 393,
        side_id: 3,
      },
      name: 'Semitendinosus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 394,
        side_id: 3,
      },
      name: 'Vastus Intermedius',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 395,
        side_id: 3,
      },
      name: 'Vastus Lateralis',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 396,
        side_id: 3,
      },
      name: 'Vastus Medialis',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 15,
        side_id: 4,
      },
      name: 'Thigh',
      description: 'Bilateral',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 388,
        side_id: 4,
      },
      name: 'Biceps Femoris',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 83,
        side_id: 4,
      },
      name: 'Femur',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 256,
        side_id: 4,
      },
      name: 'Hamstring',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 389,
        side_id: 4,
      },
      name: 'Iliotibial (IT) Band',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 390,
        side_id: 4,
      },
      name: 'Other',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 254,
        side_id: 4,
      },
      name: 'Quadricep',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 255,
        side_id: 4,
      },
      name: 'Rectus Femoris',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 391,
        side_id: 4,
      },
      name: 'Sartorius',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 392,
        side_id: 4,
      },
      name: 'Semimembranosus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 393,
        side_id: 4,
      },
      name: 'Semitendinosus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 394,
        side_id: 4,
      },
      name: 'Vastus Intermedius',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 395,
        side_id: 4,
      },
      name: 'Vastus Lateralis',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 396,
        side_id: 4,
      },
      name: 'Vastus Medialis',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 16,
        side_id: 1,
      },
      name: 'Thoracic Spine',
      description: 'Left',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 172,
        side_id: 1,
      },
      name: 'C7/T1',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 397,
        side_id: 1,
      },
      name: 'Lower Trapezius',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 398,
        side_id: 1,
      },
      name: 'Other',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 399,
        side_id: 1,
      },
      name: 'Rhomboid Muscle(s)',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 56,
        side_id: 1,
      },
      name: 'T1',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 173,
        side_id: 1,
      },
      name: 'T1/T2',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 65,
        side_id: 1,
      },
      name: 'T10',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 182,
        side_id: 1,
      },
      name: 'T10/T11',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 66,
        side_id: 1,
      },
      name: 'T11',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 183,
        side_id: 1,
      },
      name: 'T11/T12',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 67,
        side_id: 1,
      },
      name: 'T12',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 57,
        side_id: 1,
      },
      name: 'T2',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 174,
        side_id: 1,
      },
      name: 'T2/T3',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 58,
        side_id: 1,
      },
      name: 'T3',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 175,
        side_id: 1,
      },
      name: 'T3/T4',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 59,
        side_id: 1,
      },
      name: 'T4',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 176,
        side_id: 1,
      },
      name: 'T4/T5',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 60,
        side_id: 1,
      },
      name: 'T5',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 177,
        side_id: 1,
      },
      name: 'T5/T6',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 61,
        side_id: 1,
      },
      name: 'T6',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 178,
        side_id: 1,
      },
      name: 'T6/T7',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 62,
        side_id: 1,
      },
      name: 'T7',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 179,
        side_id: 1,
      },
      name: 'T7/T8',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 63,
        side_id: 1,
      },
      name: 'T8',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 180,
        side_id: 1,
      },
      name: 'T8/T9',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 64,
        side_id: 1,
      },
      name: 'T9',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 181,
        side_id: 1,
      },
      name: 'T9/T10',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 248,
        side_id: 1,
      },
      name: 'Thoracic',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 400,
        side_id: 1,
      },
      name: 'Upper Trapezius',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 16,
        side_id: 2,
      },
      name: 'Thoracic Spine',
      description: 'Center',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 172,
        side_id: 2,
      },
      name: 'C7/T1',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 397,
        side_id: 2,
      },
      name: 'Lower Trapezius',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 398,
        side_id: 2,
      },
      name: 'Other',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 399,
        side_id: 2,
      },
      name: 'Rhomboid Muscle(s)',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 56,
        side_id: 2,
      },
      name: 'T1',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 173,
        side_id: 2,
      },
      name: 'T1/T2',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 65,
        side_id: 2,
      },
      name: 'T10',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 182,
        side_id: 2,
      },
      name: 'T10/T11',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 66,
        side_id: 2,
      },
      name: 'T11',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 183,
        side_id: 2,
      },
      name: 'T11/T12',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 67,
        side_id: 2,
      },
      name: 'T12',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 57,
        side_id: 2,
      },
      name: 'T2',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 174,
        side_id: 2,
      },
      name: 'T2/T3',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 58,
        side_id: 2,
      },
      name: 'T3',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 175,
        side_id: 2,
      },
      name: 'T3/T4',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 59,
        side_id: 2,
      },
      name: 'T4',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 176,
        side_id: 2,
      },
      name: 'T4/T5',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 60,
        side_id: 2,
      },
      name: 'T5',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 177,
        side_id: 2,
      },
      name: 'T5/T6',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 61,
        side_id: 2,
      },
      name: 'T6',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 178,
        side_id: 2,
      },
      name: 'T6/T7',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 62,
        side_id: 2,
      },
      name: 'T7',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 179,
        side_id: 2,
      },
      name: 'T7/T8',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 63,
        side_id: 2,
      },
      name: 'T8',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 180,
        side_id: 2,
      },
      name: 'T8/T9',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 64,
        side_id: 2,
      },
      name: 'T9',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 181,
        side_id: 2,
      },
      name: 'T9/T10',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 248,
        side_id: 2,
      },
      name: 'Thoracic',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 400,
        side_id: 2,
      },
      name: 'Upper Trapezius',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 16,
        side_id: 3,
      },
      name: 'Thoracic Spine',
      description: 'Right',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 172,
        side_id: 3,
      },
      name: 'C7/T1',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 397,
        side_id: 3,
      },
      name: 'Lower Trapezius',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 398,
        side_id: 3,
      },
      name: 'Other',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 399,
        side_id: 3,
      },
      name: 'Rhomboid Muscle(s)',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 56,
        side_id: 3,
      },
      name: 'T1',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 173,
        side_id: 3,
      },
      name: 'T1/T2',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 65,
        side_id: 3,
      },
      name: 'T10',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 182,
        side_id: 3,
      },
      name: 'T10/T11',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 66,
        side_id: 3,
      },
      name: 'T11',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 183,
        side_id: 3,
      },
      name: 'T11/T12',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 67,
        side_id: 3,
      },
      name: 'T12',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 57,
        side_id: 3,
      },
      name: 'T2',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 174,
        side_id: 3,
      },
      name: 'T2/T3',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 58,
        side_id: 3,
      },
      name: 'T3',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 175,
        side_id: 3,
      },
      name: 'T3/T4',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 59,
        side_id: 3,
      },
      name: 'T4',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 176,
        side_id: 3,
      },
      name: 'T4/T5',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 60,
        side_id: 3,
      },
      name: 'T5',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 177,
        side_id: 3,
      },
      name: 'T5/T6',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 61,
        side_id: 3,
      },
      name: 'T6',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 178,
        side_id: 3,
      },
      name: 'T6/T7',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 62,
        side_id: 3,
      },
      name: 'T7',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 179,
        side_id: 3,
      },
      name: 'T7/T8',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 63,
        side_id: 3,
      },
      name: 'T8',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 180,
        side_id: 3,
      },
      name: 'T8/T9',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 64,
        side_id: 3,
      },
      name: 'T9',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 181,
        side_id: 3,
      },
      name: 'T9/T10',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 248,
        side_id: 3,
      },
      name: 'Thoracic',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 400,
        side_id: 3,
      },
      name: 'Upper Trapezius',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 16,
        side_id: 4,
      },
      name: 'Thoracic Spine',
      description: 'Bilateral',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 172,
        side_id: 4,
      },
      name: 'C7/T1',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 397,
        side_id: 4,
      },
      name: 'Lower Trapezius',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 398,
        side_id: 4,
      },
      name: 'Other',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 399,
        side_id: 4,
      },
      name: 'Rhomboid Muscle(s)',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 56,
        side_id: 4,
      },
      name: 'T1',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 173,
        side_id: 4,
      },
      name: 'T1/T2',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 65,
        side_id: 4,
      },
      name: 'T10',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 182,
        side_id: 4,
      },
      name: 'T10/T11',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 66,
        side_id: 4,
      },
      name: 'T11',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 183,
        side_id: 4,
      },
      name: 'T11/T12',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 67,
        side_id: 4,
      },
      name: 'T12',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 57,
        side_id: 4,
      },
      name: 'T2',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 174,
        side_id: 4,
      },
      name: 'T2/T3',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 58,
        side_id: 4,
      },
      name: 'T3',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 175,
        side_id: 4,
      },
      name: 'T3/T4',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 59,
        side_id: 4,
      },
      name: 'T4',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 176,
        side_id: 4,
      },
      name: 'T4/T5',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 60,
        side_id: 4,
      },
      name: 'T5',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 177,
        side_id: 4,
      },
      name: 'T5/T6',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 61,
        side_id: 4,
      },
      name: 'T6',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 178,
        side_id: 4,
      },
      name: 'T6/T7',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 62,
        side_id: 4,
      },
      name: 'T7',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 179,
        side_id: 4,
      },
      name: 'T7/T8',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 63,
        side_id: 4,
      },
      name: 'T8',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 180,
        side_id: 4,
      },
      name: 'T8/T9',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 64,
        side_id: 4,
      },
      name: 'T9',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 181,
        side_id: 4,
      },
      name: 'T9/T10',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 248,
        side_id: 4,
      },
      name: 'Thoracic',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 400,
        side_id: 4,
      },
      name: 'Upper Trapezius',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 16,
        side_id: 5,
      },
      name: 'Thoracic Spine',
      description: 'N/A',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 172,
        side_id: 5,
      },
      name: 'C7/T1',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 397,
        side_id: 5,
      },
      name: 'Lower Trapezius',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 398,
        side_id: 5,
      },
      name: 'Other',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 399,
        side_id: 5,
      },
      name: 'Rhomboid Muscle(s)',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 56,
        side_id: 5,
      },
      name: 'T1',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 173,
        side_id: 5,
      },
      name: 'T1/T2',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 65,
        side_id: 5,
      },
      name: 'T10',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 182,
        side_id: 5,
      },
      name: 'T10/T11',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 66,
        side_id: 5,
      },
      name: 'T11',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 183,
        side_id: 5,
      },
      name: 'T11/T12',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 67,
        side_id: 5,
      },
      name: 'T12',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 57,
        side_id: 5,
      },
      name: 'T2',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 174,
        side_id: 5,
      },
      name: 'T2/T3',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 58,
        side_id: 5,
      },
      name: 'T3',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 175,
        side_id: 5,
      },
      name: 'T3/T4',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 59,
        side_id: 5,
      },
      name: 'T4',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 176,
        side_id: 5,
      },
      name: 'T4/T5',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 60,
        side_id: 5,
      },
      name: 'T5',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 177,
        side_id: 5,
      },
      name: 'T5/T6',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 61,
        side_id: 5,
      },
      name: 'T6',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 178,
        side_id: 5,
      },
      name: 'T6/T7',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 62,
        side_id: 5,
      },
      name: 'T7',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 179,
        side_id: 5,
      },
      name: 'T7/T8',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 63,
        side_id: 5,
      },
      name: 'T8',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 180,
        side_id: 5,
      },
      name: 'T8/T9',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 64,
        side_id: 5,
      },
      name: 'T9',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 181,
        side_id: 5,
      },
      name: 'T9/T10',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 248,
        side_id: 5,
      },
      name: 'Thoracic',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 400,
        side_id: 5,
      },
      name: 'Upper Trapezius',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 17,
        side_id: 1,
      },
      name: 'Trunk/Abdominal',
      description: 'Left',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 247,
        side_id: 1,
      },
      name: 'Abdominal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 265,
        side_id: 1,
      },
      name: 'Adrenal Gland',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 266,
        side_id: 1,
      },
      name: 'Internal Oblique',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 267,
        side_id: 1,
      },
      name: 'Kidney',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 268,
        side_id: 1,
      },
      name: 'Liver',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 269,
        side_id: 1,
      },
      name: 'Other',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 270,
        side_id: 1,
      },
      name: 'Pancreas',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 271,
        side_id: 1,
      },
      name: 'Rectus Abdominus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 272,
        side_id: 1,
      },
      name: 'Spleen',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 273,
        side_id: 1,
      },
      name: 'Stomach',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 274,
        side_id: 1,
      },
      name: 'Transversus Abdominis',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 17,
        side_id: 2,
      },
      name: 'Trunk/Abdominal',
      description: 'Center',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 247,
        side_id: 2,
      },
      name: 'Abdominal',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 265,
        side_id: 2,
      },
      name: 'Adrenal Gland',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 266,
        side_id: 2,
      },
      name: 'Internal Oblique',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 267,
        side_id: 2,
      },
      name: 'Kidney',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 268,
        side_id: 2,
      },
      name: 'Liver',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 269,
        side_id: 2,
      },
      name: 'Other',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 270,
        side_id: 2,
      },
      name: 'Pancreas',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 271,
        side_id: 2,
      },
      name: 'Rectus Abdominus',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 272,
        side_id: 2,
      },
      name: 'Spleen',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 273,
        side_id: 2,
      },
      name: 'Stomach',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 274,
        side_id: 2,
      },
      name: 'Transversus Abdominis',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 17,
        side_id: 3,
      },
      name: 'Trunk/Abdominal',
      description: 'Right',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 247,
        side_id: 3,
      },
      name: 'Abdominal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 265,
        side_id: 3,
      },
      name: 'Adrenal Gland',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 266,
        side_id: 3,
      },
      name: 'Internal Oblique',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 267,
        side_id: 3,
      },
      name: 'Kidney',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 268,
        side_id: 3,
      },
      name: 'Liver',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 269,
        side_id: 3,
      },
      name: 'Other',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 270,
        side_id: 3,
      },
      name: 'Pancreas',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 271,
        side_id: 3,
      },
      name: 'Rectus Abdominus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 272,
        side_id: 3,
      },
      name: 'Spleen',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 273,
        side_id: 3,
      },
      name: 'Stomach',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 274,
        side_id: 3,
      },
      name: 'Transversus Abdominis',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 17,
        side_id: 4,
      },
      name: 'Trunk/Abdominal',
      description: 'Bilateral',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 247,
        side_id: 4,
      },
      name: 'Abdominal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 265,
        side_id: 4,
      },
      name: 'Adrenal Gland',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 266,
        side_id: 4,
      },
      name: 'Internal Oblique',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 267,
        side_id: 4,
      },
      name: 'Kidney',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 268,
        side_id: 4,
      },
      name: 'Liver',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 269,
        side_id: 4,
      },
      name: 'Other',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 270,
        side_id: 4,
      },
      name: 'Pancreas',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 271,
        side_id: 4,
      },
      name: 'Rectus Abdominus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 272,
        side_id: 4,
      },
      name: 'Spleen',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 273,
        side_id: 4,
      },
      name: 'Stomach',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 274,
        side_id: 4,
      },
      name: 'Transversus Abdominis',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 17,
        side_id: 5,
      },
      name: 'Trunk/Abdominal',
      description: 'N/A',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 247,
        side_id: 5,
      },
      name: 'Abdominal',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 265,
        side_id: 5,
      },
      name: 'Adrenal Gland',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 266,
        side_id: 5,
      },
      name: 'Internal Oblique',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 267,
        side_id: 5,
      },
      name: 'Kidney',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 268,
        side_id: 5,
      },
      name: 'Liver',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 269,
        side_id: 5,
      },
      name: 'Other',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 270,
        side_id: 5,
      },
      name: 'Pancreas',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 271,
        side_id: 5,
      },
      name: 'Rectus Abdominus',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 272,
        side_id: 5,
      },
      name: 'Spleen',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 273,
        side_id: 5,
      },
      name: 'Stomach',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 274,
        side_id: 5,
      },
      name: 'Transversus Abdominis',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 18,
        side_id: 1,
      },
      name: 'Unspecified/Crossing',
      description: 'Left',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 401,
        side_id: 1,
      },
      name: 'Circulatory System',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 402,
        side_id: 1,
      },
      name: 'Disc(s)',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 403,
        side_id: 1,
      },
      name: 'Dorsal Nerve Root',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 404,
        side_id: 1,
      },
      name: 'Endocrine System',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 405,
        side_id: 1,
      },
      name: 'Erector Spinae',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 406,
        side_id: 1,
      },
      name: 'Facet Joint',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 407,
        side_id: 1,
      },
      name: 'Full Body',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 408,
        side_id: 1,
      },
      name: 'Gastrointestinal System',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 409,
        side_id: 1,
      },
      name: 'Genitourinary System',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 410,
        side_id: 1,
      },
      name: 'Latissimus Dorsi',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 411,
        side_id: 1,
      },
      name: 'Lower Limb',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 412,
        side_id: 1,
      },
      name: 'Lymphatic System',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 413,
        side_id: 1,
      },
      name: 'Multifidus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 414,
        side_id: 1,
      },
      name: 'Musculoskeletal System',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 415,
        side_id: 1,
      },
      name: 'Nervous System',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 416,
        side_id: 1,
      },
      name: 'Other',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 417,
        side_id: 1,
      },
      name: 'Other - Bone(s)',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 418,
        side_id: 1,
      },
      name: 'Other - Joint(s)',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 419,
        side_id: 1,
      },
      name: 'Other Specified Organs',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 420,
        side_id: 1,
      },
      name: 'Paraspinals',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 421,
        side_id: 1,
      },
      name: 'Peripheral Nerves',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 422,
        side_id: 1,
      },
      name: 'Phalanges',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 423,
        side_id: 1,
      },
      name: 'Respiratory System',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 424,
        side_id: 1,
      },
      name: 'Serratus Anterior',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 425,
        side_id: 1,
      },
      name: 'Serratus Posterior Inferior',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 426,
        side_id: 1,
      },
      name: 'Serratus Posterior Superior',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 427,
        side_id: 1,
      },
      name: 'Skin',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 428,
        side_id: 1,
      },
      name: 'Spinal Cord',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 429,
        side_id: 1,
      },
      name: 'Spine',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 430,
        side_id: 1,
      },
      name: 'Systemic',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 431,
        side_id: 1,
      },
      name: 'Trapezius Muscle(s)',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 432,
        side_id: 1,
      },
      name: 'Upper Limb',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 433,
        side_id: 1,
      },
      name: 'Vertebra',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 18,
        side_id: 2,
      },
      name: 'Unspecified/Crossing',
      description: 'Center',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 401,
        side_id: 2,
      },
      name: 'Circulatory System',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 402,
        side_id: 2,
      },
      name: 'Disc(s)',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 403,
        side_id: 2,
      },
      name: 'Dorsal Nerve Root',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 404,
        side_id: 2,
      },
      name: 'Endocrine System',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 405,
        side_id: 2,
      },
      name: 'Erector Spinae',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 406,
        side_id: 2,
      },
      name: 'Facet Joint',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 407,
        side_id: 2,
      },
      name: 'Full Body',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 408,
        side_id: 2,
      },
      name: 'Gastrointestinal System',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 409,
        side_id: 2,
      },
      name: 'Genitourinary System',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 410,
        side_id: 2,
      },
      name: 'Latissimus Dorsi',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 411,
        side_id: 2,
      },
      name: 'Lower Limb',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 412,
        side_id: 2,
      },
      name: 'Lymphatic System',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 413,
        side_id: 2,
      },
      name: 'Multifidus',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 414,
        side_id: 2,
      },
      name: 'Musculoskeletal System',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 415,
        side_id: 2,
      },
      name: 'Nervous System',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 416,
        side_id: 2,
      },
      name: 'Other',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 417,
        side_id: 2,
      },
      name: 'Other - Bone(s)',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 418,
        side_id: 2,
      },
      name: 'Other - Joint(s)',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 419,
        side_id: 2,
      },
      name: 'Other Specified Organs',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 420,
        side_id: 2,
      },
      name: 'Paraspinals',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 421,
        side_id: 2,
      },
      name: 'Peripheral Nerves',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 422,
        side_id: 2,
      },
      name: 'Phalanges',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 423,
        side_id: 2,
      },
      name: 'Respiratory System',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 424,
        side_id: 2,
      },
      name: 'Serratus Anterior',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 425,
        side_id: 2,
      },
      name: 'Serratus Posterior Inferior',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 426,
        side_id: 2,
      },
      name: 'Serratus Posterior Superior',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 427,
        side_id: 2,
      },
      name: 'Skin',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 428,
        side_id: 2,
      },
      name: 'Spinal Cord',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 429,
        side_id: 2,
      },
      name: 'Spine',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 430,
        side_id: 2,
      },
      name: 'Systemic',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 431,
        side_id: 2,
      },
      name: 'Trapezius Muscle(s)',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 432,
        side_id: 2,
      },
      name: 'Upper Limb',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 433,
        side_id: 2,
      },
      name: 'Vertebra',
      description: 'Center',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 18,
        side_id: 3,
      },
      name: 'Unspecified/Crossing',
      description: 'Right',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 401,
        side_id: 3,
      },
      name: 'Circulatory System',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 402,
        side_id: 3,
      },
      name: 'Disc(s)',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 403,
        side_id: 3,
      },
      name: 'Dorsal Nerve Root',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 404,
        side_id: 3,
      },
      name: 'Endocrine System',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 405,
        side_id: 3,
      },
      name: 'Erector Spinae',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 406,
        side_id: 3,
      },
      name: 'Facet Joint',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 407,
        side_id: 3,
      },
      name: 'Full Body',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 408,
        side_id: 3,
      },
      name: 'Gastrointestinal System',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 409,
        side_id: 3,
      },
      name: 'Genitourinary System',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 410,
        side_id: 3,
      },
      name: 'Latissimus Dorsi',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 411,
        side_id: 3,
      },
      name: 'Lower Limb',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 412,
        side_id: 3,
      },
      name: 'Lymphatic System',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 413,
        side_id: 3,
      },
      name: 'Multifidus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 414,
        side_id: 3,
      },
      name: 'Musculoskeletal System',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 415,
        side_id: 3,
      },
      name: 'Nervous System',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 416,
        side_id: 3,
      },
      name: 'Other',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 417,
        side_id: 3,
      },
      name: 'Other - Bone(s)',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 418,
        side_id: 3,
      },
      name: 'Other - Joint(s)',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 419,
        side_id: 3,
      },
      name: 'Other Specified Organs',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 420,
        side_id: 3,
      },
      name: 'Paraspinals',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 421,
        side_id: 3,
      },
      name: 'Peripheral Nerves',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 422,
        side_id: 3,
      },
      name: 'Phalanges',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 423,
        side_id: 3,
      },
      name: 'Respiratory System',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 424,
        side_id: 3,
      },
      name: 'Serratus Anterior',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 425,
        side_id: 3,
      },
      name: 'Serratus Posterior Inferior',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 426,
        side_id: 3,
      },
      name: 'Serratus Posterior Superior',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 427,
        side_id: 3,
      },
      name: 'Skin',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 428,
        side_id: 3,
      },
      name: 'Spinal Cord',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 429,
        side_id: 3,
      },
      name: 'Spine',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 430,
        side_id: 3,
      },
      name: 'Systemic',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 431,
        side_id: 3,
      },
      name: 'Trapezius Muscle(s)',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 432,
        side_id: 3,
      },
      name: 'Upper Limb',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 433,
        side_id: 3,
      },
      name: 'Vertebra',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 18,
        side_id: 4,
      },
      name: 'Unspecified/Crossing',
      description: 'Bilateral',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 401,
        side_id: 4,
      },
      name: 'Circulatory System',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 402,
        side_id: 4,
      },
      name: 'Disc(s)',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 403,
        side_id: 4,
      },
      name: 'Dorsal Nerve Root',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 404,
        side_id: 4,
      },
      name: 'Endocrine System',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 405,
        side_id: 4,
      },
      name: 'Erector Spinae',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 406,
        side_id: 4,
      },
      name: 'Facet Joint',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 407,
        side_id: 4,
      },
      name: 'Full Body',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 408,
        side_id: 4,
      },
      name: 'Gastrointestinal System',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 409,
        side_id: 4,
      },
      name: 'Genitourinary System',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 410,
        side_id: 4,
      },
      name: 'Latissimus Dorsi',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 411,
        side_id: 4,
      },
      name: 'Lower Limb',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 412,
        side_id: 4,
      },
      name: 'Lymphatic System',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 413,
        side_id: 4,
      },
      name: 'Multifidus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 414,
        side_id: 4,
      },
      name: 'Musculoskeletal System',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 415,
        side_id: 4,
      },
      name: 'Nervous System',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 416,
        side_id: 4,
      },
      name: 'Other',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 417,
        side_id: 4,
      },
      name: 'Other - Bone(s)',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 418,
        side_id: 4,
      },
      name: 'Other - Joint(s)',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 419,
        side_id: 4,
      },
      name: 'Other Specified Organs',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 420,
        side_id: 4,
      },
      name: 'Paraspinals',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 421,
        side_id: 4,
      },
      name: 'Peripheral Nerves',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 422,
        side_id: 4,
      },
      name: 'Phalanges',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 423,
        side_id: 4,
      },
      name: 'Respiratory System',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 424,
        side_id: 4,
      },
      name: 'Serratus Anterior',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 425,
        side_id: 4,
      },
      name: 'Serratus Posterior Inferior',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 426,
        side_id: 4,
      },
      name: 'Serratus Posterior Superior',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 427,
        side_id: 4,
      },
      name: 'Skin',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 428,
        side_id: 4,
      },
      name: 'Spinal Cord',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 429,
        side_id: 4,
      },
      name: 'Spine',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 430,
        side_id: 4,
      },
      name: 'Systemic',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 431,
        side_id: 4,
      },
      name: 'Trapezius Muscle(s)',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 432,
        side_id: 4,
      },
      name: 'Upper Limb',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 433,
        side_id: 4,
      },
      name: 'Vertebra',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 18,
        side_id: 5,
      },
      name: 'Unspecified/Crossing',
      description: 'N/A',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 401,
        side_id: 5,
      },
      name: 'Circulatory System',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 402,
        side_id: 5,
      },
      name: 'Disc(s)',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 403,
        side_id: 5,
      },
      name: 'Dorsal Nerve Root',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 404,
        side_id: 5,
      },
      name: 'Endocrine System',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 405,
        side_id: 5,
      },
      name: 'Erector Spinae',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 406,
        side_id: 5,
      },
      name: 'Facet Joint',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 407,
        side_id: 5,
      },
      name: 'Full Body',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 408,
        side_id: 5,
      },
      name: 'Gastrointestinal System',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 409,
        side_id: 5,
      },
      name: 'Genitourinary System',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 410,
        side_id: 5,
      },
      name: 'Latissimus Dorsi',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 411,
        side_id: 5,
      },
      name: 'Lower Limb',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 412,
        side_id: 5,
      },
      name: 'Lymphatic System',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 413,
        side_id: 5,
      },
      name: 'Multifidus',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 414,
        side_id: 5,
      },
      name: 'Musculoskeletal System',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 415,
        side_id: 5,
      },
      name: 'Nervous System',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 416,
        side_id: 5,
      },
      name: 'Other',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 417,
        side_id: 5,
      },
      name: 'Other - Bone(s)',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 418,
        side_id: 5,
      },
      name: 'Other - Joint(s)',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 419,
        side_id: 5,
      },
      name: 'Other Specified Organs',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 420,
        side_id: 5,
      },
      name: 'Paraspinals',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 421,
        side_id: 5,
      },
      name: 'Peripheral Nerves',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 422,
        side_id: 5,
      },
      name: 'Phalanges',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 423,
        side_id: 5,
      },
      name: 'Respiratory System',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 424,
        side_id: 5,
      },
      name: 'Serratus Anterior',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 425,
        side_id: 5,
      },
      name: 'Serratus Posterior Inferior',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 426,
        side_id: 5,
      },
      name: 'Serratus Posterior Superior',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 427,
        side_id: 5,
      },
      name: 'Skin',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 428,
        side_id: 5,
      },
      name: 'Spinal Cord',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 429,
        side_id: 5,
      },
      name: 'Spine',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 430,
        side_id: 5,
      },
      name: 'Systemic',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 431,
        side_id: 5,
      },
      name: 'Trapezius Muscle(s)',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 432,
        side_id: 5,
      },
      name: 'Upper Limb',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 433,
        side_id: 5,
      },
      name: 'Vertebra',
      description: 'N/A',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 19,
        side_id: 1,
      },
      name: 'Upper Arm',
      description: 'Left',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 235,
        side_id: 1,
      },
      name: 'Bicep',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 434,
        side_id: 1,
      },
      name: 'Biceps Brachii',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 18,
        side_id: 1,
      },
      name: 'Humeral Shaft',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 435,
        side_id: 1,
      },
      name: 'Humerus',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 237,
        side_id: 1,
      },
      name: 'Other',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 236,
        side_id: 1,
      },
      name: 'Tricep',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 19,
        side_id: 3,
      },
      name: 'Upper Arm',
      description: 'Right',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 235,
        side_id: 3,
      },
      name: 'Bicep',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 434,
        side_id: 3,
      },
      name: 'Biceps Brachii',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 18,
        side_id: 3,
      },
      name: 'Humeral Shaft',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 435,
        side_id: 3,
      },
      name: 'Humerus',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 237,
        side_id: 3,
      },
      name: 'Other',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 236,
        side_id: 3,
      },
      name: 'Tricep',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 19,
        side_id: 4,
      },
      name: 'Upper Arm',
      description: 'Bilateral',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 235,
        side_id: 4,
      },
      name: 'Bicep',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 434,
        side_id: 4,
      },
      name: 'Biceps Brachii',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 18,
        side_id: 4,
      },
      name: 'Humeral Shaft',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 435,
        side_id: 4,
      },
      name: 'Humerus',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 237,
        side_id: 4,
      },
      name: 'Other',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 236,
        side_id: 4,
      },
      name: 'Tricep',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 20,
        side_id: 1,
      },
      name: 'Wrist/Hand',
      description: 'Left',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 136,
        side_id: 1,
      },
      name: '1st Carpo-Metacarpal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 138,
        side_id: 1,
      },
      name: '1st Carpo-Metacarpal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 153,
        side_id: 1,
      },
      name: '1st DIP',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 33,
        side_id: 1,
      },
      name: '1st Metacarpal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 143,
        side_id: 1,
      },
      name: '1st Metacarpo-phalangeal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 148,
        side_id: 1,
      },
      name: '1st PIP',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 38,
        side_id: 1,
      },
      name: '1st Phalanx',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 139,
        side_id: 1,
      },
      name: '2nd Carpo-Metacarpal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 154,
        side_id: 1,
      },
      name: '2nd DIP',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 34,
        side_id: 1,
      },
      name: '2nd Metacarpal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 144,
        side_id: 1,
      },
      name: '2nd Metacarpo-phalangeal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 149,
        side_id: 1,
      },
      name: '2nd PIP',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 39,
        side_id: 1,
      },
      name: '2nd Phalanx',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 140,
        side_id: 1,
      },
      name: '3rd Carpo-Metacarpal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 155,
        side_id: 1,
      },
      name: '3rd DIP',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 35,
        side_id: 1,
      },
      name: '3rd Metacarpal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 145,
        side_id: 1,
      },
      name: '3rd Metacarpo-phalangeal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 150,
        side_id: 1,
      },
      name: '3rd PIP',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 40,
        side_id: 1,
      },
      name: '3rd Phalanx',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 141,
        side_id: 1,
      },
      name: '4th Carpo-Metacarpal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 156,
        side_id: 1,
      },
      name: '4th DIP',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 36,
        side_id: 1,
      },
      name: '4th Metacarpal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 146,
        side_id: 1,
      },
      name: '4th Metacarpo-phalangeal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 151,
        side_id: 1,
      },
      name: '4th PIP',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 41,
        side_id: 1,
      },
      name: '4th Phalanx',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 142,
        side_id: 1,
      },
      name: '5th Carpo-Metacarpal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 157,
        side_id: 1,
      },
      name: '5th DIP',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 37,
        side_id: 1,
      },
      name: '5th Metacarpal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 147,
        side_id: 1,
      },
      name: '5th Metacarpo-phalangeal',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 152,
        side_id: 1,
      },
      name: '5th PIP',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 42,
        side_id: 1,
      },
      name: '5th Phalanx',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 25,
        side_id: 1,
      },
      name: 'Capitate',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 436,
        side_id: 1,
      },
      name: 'Carpal(s)',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 132,
        side_id: 1,
      },
      name: 'Distal Radial Ulnar Joint',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 245,
        side_id: 1,
      },
      name: 'Extensors',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 158,
        side_id: 1,
      },
      name: 'Finger',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 244,
        side_id: 1,
      },
      name: 'Flexors',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 26,
        side_id: 1,
      },
      name: 'Hamate',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 135,
        side_id: 1,
      },
      name: 'Intercarpal Joint',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 307,
        side_id: 1,
      },
      name: 'Intrinsic Hand Muscles',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 27,
        side_id: 1,
      },
      name: 'Lunate',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 308,
        side_id: 1,
      },
      name: 'Metacarpal(s)',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 437,
        side_id: 1,
      },
      name: 'Other',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 28,
        side_id: 1,
      },
      name: 'Pisiform',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 133,
        side_id: 1,
      },
      name: 'Scapho-Lunate joint',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 29,
        side_id: 1,
      },
      name: 'Scaphoid',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 134,
        side_id: 1,
      },
      name: 'TFCC',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 159,
        side_id: 1,
      },
      name: 'Thumb',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 30,
        side_id: 1,
      },
      name: 'Trapezium',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 31,
        side_id: 1,
      },
      name: 'Trapezoid',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 32,
        side_id: 1,
      },
      name: 'Triquetrum',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 438,
        side_id: 1,
      },
      name: 'Wrist Extensor(s)',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 439,
        side_id: 1,
      },
      name: 'Wrist Flexor(s)',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 137,
        side_id: 1,
      },
      name: 'Wrist Ligaments',
      description: 'Left',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 20,
        side_id: 3,
      },
      name: 'Wrist/Hand',
      description: 'Right',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 136,
        side_id: 3,
      },
      name: '1st Carpo-Metacarpal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 138,
        side_id: 3,
      },
      name: '1st Carpo-Metacarpal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 153,
        side_id: 3,
      },
      name: '1st DIP',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 33,
        side_id: 3,
      },
      name: '1st Metacarpal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 143,
        side_id: 3,
      },
      name: '1st Metacarpo-phalangeal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 148,
        side_id: 3,
      },
      name: '1st PIP',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 38,
        side_id: 3,
      },
      name: '1st Phalanx',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 139,
        side_id: 3,
      },
      name: '2nd Carpo-Metacarpal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 154,
        side_id: 3,
      },
      name: '2nd DIP',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 34,
        side_id: 3,
      },
      name: '2nd Metacarpal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 144,
        side_id: 3,
      },
      name: '2nd Metacarpo-phalangeal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 149,
        side_id: 3,
      },
      name: '2nd PIP',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 39,
        side_id: 3,
      },
      name: '2nd Phalanx',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 140,
        side_id: 3,
      },
      name: '3rd Carpo-Metacarpal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 155,
        side_id: 3,
      },
      name: '3rd DIP',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 35,
        side_id: 3,
      },
      name: '3rd Metacarpal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 145,
        side_id: 3,
      },
      name: '3rd Metacarpo-phalangeal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 150,
        side_id: 3,
      },
      name: '3rd PIP',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 40,
        side_id: 3,
      },
      name: '3rd Phalanx',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 141,
        side_id: 3,
      },
      name: '4th Carpo-Metacarpal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 156,
        side_id: 3,
      },
      name: '4th DIP',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 36,
        side_id: 3,
      },
      name: '4th Metacarpal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 146,
        side_id: 3,
      },
      name: '4th Metacarpo-phalangeal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 151,
        side_id: 3,
      },
      name: '4th PIP',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 41,
        side_id: 3,
      },
      name: '4th Phalanx',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 142,
        side_id: 3,
      },
      name: '5th Carpo-Metacarpal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 157,
        side_id: 3,
      },
      name: '5th DIP',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 37,
        side_id: 3,
      },
      name: '5th Metacarpal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 147,
        side_id: 3,
      },
      name: '5th Metacarpo-phalangeal',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 152,
        side_id: 3,
      },
      name: '5th PIP',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 42,
        side_id: 3,
      },
      name: '5th Phalanx',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 25,
        side_id: 3,
      },
      name: 'Capitate',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 436,
        side_id: 3,
      },
      name: 'Carpal(s)',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 132,
        side_id: 3,
      },
      name: 'Distal Radial Ulnar Joint',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 245,
        side_id: 3,
      },
      name: 'Extensors',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 158,
        side_id: 3,
      },
      name: 'Finger',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 244,
        side_id: 3,
      },
      name: 'Flexors',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 26,
        side_id: 3,
      },
      name: 'Hamate',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 135,
        side_id: 3,
      },
      name: 'Intercarpal Joint',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 307,
        side_id: 3,
      },
      name: 'Intrinsic Hand Muscles',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 27,
        side_id: 3,
      },
      name: 'Lunate',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 308,
        side_id: 3,
      },
      name: 'Metacarpal(s)',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 437,
        side_id: 3,
      },
      name: 'Other',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 28,
        side_id: 3,
      },
      name: 'Pisiform',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 133,
        side_id: 3,
      },
      name: 'Scapho-Lunate joint',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 29,
        side_id: 3,
      },
      name: 'Scaphoid',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 134,
        side_id: 3,
      },
      name: 'TFCC',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 159,
        side_id: 3,
      },
      name: 'Thumb',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 30,
        side_id: 3,
      },
      name: 'Trapezium',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 31,
        side_id: 3,
      },
      name: 'Trapezoid',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 32,
        side_id: 3,
      },
      name: 'Triquetrum',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 438,
        side_id: 3,
      },
      name: 'Wrist Extensor(s)',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 439,
        side_id: 3,
      },
      name: 'Wrist Flexor(s)',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 137,
        side_id: 3,
      },
      name: 'Wrist Ligaments',
      description: 'Right',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
        treatable_area_id: 20,
        side_id: 4,
      },
      name: 'Wrist/Hand',
      description: 'Bilateral',
      isGroupOption: true,
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 136,
        side_id: 4,
      },
      name: '1st Carpo-Metacarpal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 138,
        side_id: 4,
      },
      name: '1st Carpo-Metacarpal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 153,
        side_id: 4,
      },
      name: '1st DIP',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 33,
        side_id: 4,
      },
      name: '1st Metacarpal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 143,
        side_id: 4,
      },
      name: '1st Metacarpo-phalangeal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 148,
        side_id: 4,
      },
      name: '1st PIP',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 38,
        side_id: 4,
      },
      name: '1st Phalanx',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 139,
        side_id: 4,
      },
      name: '2nd Carpo-Metacarpal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 154,
        side_id: 4,
      },
      name: '2nd DIP',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 34,
        side_id: 4,
      },
      name: '2nd Metacarpal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 144,
        side_id: 4,
      },
      name: '2nd Metacarpo-phalangeal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 149,
        side_id: 4,
      },
      name: '2nd PIP',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 39,
        side_id: 4,
      },
      name: '2nd Phalanx',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 140,
        side_id: 4,
      },
      name: '3rd Carpo-Metacarpal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 155,
        side_id: 4,
      },
      name: '3rd DIP',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 35,
        side_id: 4,
      },
      name: '3rd Metacarpal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 145,
        side_id: 4,
      },
      name: '3rd Metacarpo-phalangeal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 150,
        side_id: 4,
      },
      name: '3rd PIP',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 40,
        side_id: 4,
      },
      name: '3rd Phalanx',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 141,
        side_id: 4,
      },
      name: '4th Carpo-Metacarpal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 156,
        side_id: 4,
      },
      name: '4th DIP',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 36,
        side_id: 4,
      },
      name: '4th Metacarpal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 146,
        side_id: 4,
      },
      name: '4th Metacarpo-phalangeal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 151,
        side_id: 4,
      },
      name: '4th PIP',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 41,
        side_id: 4,
      },
      name: '4th Phalanx',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 142,
        side_id: 4,
      },
      name: '5th Carpo-Metacarpal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 157,
        side_id: 4,
      },
      name: '5th DIP',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 37,
        side_id: 4,
      },
      name: '5th Metacarpal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 147,
        side_id: 4,
      },
      name: '5th Metacarpo-phalangeal',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 152,
        side_id: 4,
      },
      name: '5th PIP',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 42,
        side_id: 4,
      },
      name: '5th Phalanx',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 25,
        side_id: 4,
      },
      name: 'Capitate',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 436,
        side_id: 4,
      },
      name: 'Carpal(s)',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 132,
        side_id: 4,
      },
      name: 'Distal Radial Ulnar Joint',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 245,
        side_id: 4,
      },
      name: 'Extensors',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 158,
        side_id: 4,
      },
      name: 'Finger',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 244,
        side_id: 4,
      },
      name: 'Flexors',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 26,
        side_id: 4,
      },
      name: 'Hamate',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 135,
        side_id: 4,
      },
      name: 'Intercarpal Joint',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 307,
        side_id: 4,
      },
      name: 'Intrinsic Hand Muscles',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 27,
        side_id: 4,
      },
      name: 'Lunate',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 308,
        side_id: 4,
      },
      name: 'Metacarpal(s)',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 437,
        side_id: 4,
      },
      name: 'Other',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 28,
        side_id: 4,
      },
      name: 'Pisiform',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 133,
        side_id: 4,
      },
      name: 'Scapho-Lunate joint',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 29,
        side_id: 4,
      },
      name: 'Scaphoid',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 134,
        side_id: 4,
      },
      name: 'TFCC',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 159,
        side_id: 4,
      },
      name: 'Thumb',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 30,
        side_id: 4,
      },
      name: 'Trapezium',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 31,
        side_id: 4,
      },
      name: 'Trapezoid',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 32,
        side_id: 4,
      },
      name: 'Triquetrum',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 438,
        side_id: 4,
      },
      name: 'Wrist Extensor(s)',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 439,
        side_id: 4,
      },
      name: 'Wrist Flexor(s)',
      description: 'Bilateral',
    },
    {
      value: {
        treatable_area_type: 'Emr::Private::Models::BodyPart',
        treatable_area_id: 137,
        side_id: 4,
      },
      name: 'Wrist Ligaments',
      description: 'Bilateral',
    },
  ],
  issues_options: [
    {
      key_name: 'Open Injuries',
      name: 'Open Injuries',
      isGroupOption: true,
    },
    {
      key_name:
        '{"reason":"issue","issue_type":"InjuryOccurrence","issue_id":1}',
      name: 'Wrist/Hand 1st CMC joint instability [Bilateral]',
      description: '(Ongoing since Jul  1, 2022)',
    },
    {
      key_name:
        '{"reason":"issue","issue_type":"InjuryOccurrence","issue_id":2}',
      name: 'Wrist/Hand 1st CMC joint instability [Right]',
      description: '(Ongoing since Aug  1, 2022)',
    },
    {
      key_name:
        '{"reason":"issue","issue_type":"InjuryOccurrence","issue_id":3}',
      name: 'Wrist/Hand 1st CMC joint instability [Right]',
      description: '(Ongoing since Aug  2, 2022)',
    },
    {
      key_name: 'Open Illnesses',
      name: 'Open Illnesses',
      isGroupOption: true,
    },
    {
      key_name: 'Closed Injuries',
      name: 'Closed Injuries',
      isGroupOption: true,
    },
    {
      key_name: 'Closed Illnesses',
      name: 'Closed Illnesses',
      isGroupOption: true,
    },
  ],
};
