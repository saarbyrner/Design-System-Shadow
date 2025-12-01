import { rest } from 'msw';

const data = {
  containers: [],
  columns: [
    {
      row_key: 'athlete',
      datatype: 'plain',
      name: 'Athlete',
      assessment_item_id: null,
      training_variable_id: null,
      readonly: true,
      id: 10326406,
      active: true,
      default: true,
      container_id: null,
      order: 0,
      protected: false,
      status_definition: null,
      workload_unit: false,
    },
    {
      row_key: 'squads',
      datatype: 'plain',
      name: 'Squads',
      assessment_item_id: null,
      training_variable_id: null,
      readonly: true,
      id: 10326407,
      active: true,
      default: true,
      container_id: null,
      order: 1,
      protected: false,
      status_definition: null,
      workload_unit: false,
    },
    {
      row_key: 'participation_level',
      datatype: 'plain',
      name: 'Participation level',
      assessment_item_id: null,
      training_variable_id: null,
      readonly: false,
      id: 10326408,
      active: true,
      default: true,
      container_id: null,
      order: 2,
      protected: false,
      status_definition: null,
      workload_unit: false,
    },
    {
      row_key: 'participation_level_reason',
      datatype: 'plain',
      name: 'Participation level reason',
      assessment_item_id: null,
      training_variable_id: null,
      readonly: false,
      id: 10326409,
      active: true,
      default: true,
      container_id: null,
      order: 3,
      protected: false,
      status_definition: null,
      workload_unit: false,
    },
    {
      row_key: 'include_in_group_calculations',
      datatype: 'plain',
      name: 'Group Calculations',
      assessment_item_id: null,
      training_variable_id: null,
      readonly: false,
      id: 10326410,
      active: true,
      default: true,
      container_id: null,
      order: 4,
      protected: false,
      status_definition: null,
      workload_unit: false,
    },
    {
      row_key: 'related_issue',
      datatype: 'plain',
      name: 'Injury/ Illness',
      assessment_item_id: null,
      training_variable_id: null,
      readonly: true,
      id: 10326411,
      active: true,
      default: true,
      container_id: null,
      order: 5,
      protected: false,
      status_definition: null,
      workload_unit: false,
    },
    {
      row_key: 'free_note',
      datatype: 'plain',
      name: 'Notes',
      assessment_item_id: null,
      training_variable_id: null,
      readonly: true,
      id: 10326412,
      active: true,
      default: true,
      container_id: null,
      order: 6,
      protected: false,
      status_definition: null,
      workload_unit: false,
    },
  ],
  rows: [
    {
      id: 13917549,
      athlete: {
        id: 78041,
        fullname: 'Test Athlete',
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
        position: 'Loose-head Prop',
        availability: 'unavailable',
      },
      squads: [
        {
          name: '1st team',
          primary: true,
        },
        {
          name: 'International Squad',
          primary: false,
        },
      ],
      participation_level: 3859,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917555,
      athlete: {
        id: 40211,
        fullname: 'Tomas Albornoz',
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0P2JnPTk1MjQyZjM4JnR4dDY0PU1nJnR4dGFsaWduPWNlbnRlciZ0eHRjbHI9ZmZmJnR4dGZvbnQ9QXZlbmlyK05leHQrQ29uZGVuc2VkK01lZGl1bSZ0eHRwYWQ9NSZ0eHRzaGFkPTImdHh0c2l6ZT0xNiZ3PTM2&markalign=left%2Cbottom&markfit=max&markpad=0&w=100',
        position: 'Second Row',
        availability: 'unavailable',
      },
      squads: [
        {
          name: 'International Squad',
          primary: true,
        },
      ],
      participation_level: 3860,
      participation_level_reason: null,
      include_in_group_calculations: false,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917564,
      athlete: {
        id: 93304,
        fullname: 'Craig Athlete',
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
        position: 'Second Row',
        availability: 'available',
      },
      squads: [
        {
          name: 'International Squad',
          primary: false,
        },
      ],
      participation_level: 3861,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917550,
      athlete: {
        id: 80524,
        fullname: 'Daniel Athlete Athlete',
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
        position: 'Loose-head Prop',
        availability: 'unavailable',
      },
      squads: [
        {
          name: 'International Squad',
          primary: true,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917493,
      athlete: {
        id: 39894,
        fullname: 'Test Email Athlete',
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
        position: 'Hooker',
        availability: 'injured',
      },
      squads: [
        {
          name: 'International Squad',
          primary: false,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917495,
      athlete: {
        id: 33344,
        fullname: 'Mohamed Athlete Test',
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0P2JnPTk1MjQyZjM4JnR4dDY0PU9BJnR4dGFsaWduPWNlbnRlciZ0eHRjbHI9ZmZmJnR4dGZvbnQ9QXZlbmlyK05leHQrQ29uZGVuc2VkK01lZGl1bSZ0eHRwYWQ9NSZ0eHRzaGFkPTImdHh0c2l6ZT0xNiZ3PTM2&markalign=left%2Cbottom&markfit=max&markpad=0&w=100',
        position: 'No. 8',
        availability: 'unavailable',
      },
      squads: [
        {
          name: 'Kitman Labs - Staff',
          primary: false,
        },
        {
          name: 'International Squad',
          primary: false,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917543,
      athlete: {
        id: 30693,
        fullname: 'Federico Baldasso',
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0P2JnPTk1MjQyZjM4JnR4dDY0PU1UQSZ0eHRhbGlnbj1jZW50ZXImdHh0Y2xyPWZmZiZ0eHRmb250PUF2ZW5pcitOZXh0K0NvbmRlbnNlZCtNZWRpdW0mdHh0cGFkPTUmdHh0c2hhZD0yJnR4dHNpemU9MTYmdz0zNg&markalign=left%2Cbottom&markfit=max&markpad=0&w=100',
        position: 'Other',
        availability: 'unavailable',
      },
      squads: [
        {
          name: 'Academy Squad',
          primary: true,
        },
        {
          name: 'International Squad',
          primary: false,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917556,
      athlete: {
        id: 73858,
        fullname: 'Mattia Bellini',
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
        position: 'Second Row',
        availability: 'unavailable',
      },
      squads: [
        {
          name: 'Academy Squad',
          primary: false,
        },
        {
          name: 'International Squad',
          primary: false,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917484,
      athlete: {
        id: 15642,
        fullname: 'hugo beuzeboc',
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0P2JnPTk1MjQyZjM4JnR4dDY0PU1RJnR4dGFsaWduPWNlbnRlciZ0eHRjbHI9ZmZmJnR4dGZvbnQ9QXZlbmlyK05leHQrQ29uZGVuc2VkK01lZGl1bSZ0eHRwYWQ9NSZ0eHRzaGFkPTImdHh0c2l6ZT0xNiZ3PTM2&markalign=left%2Cbottom&markfit=max&markpad=0&w=100',
        position: 'Loose-head Prop',
        availability: 'unavailable',
      },
      squads: [
        {
          name: 'International Squad',
          primary: false,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917552,
      athlete: {
        id: 81233,
        fullname: 'Bhuvan Bhatt',
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
        position: 'Loose-head Prop',
        availability: 'unavailable',
      },
      squads: [
        {
          name: 'International Squad',
          primary: true,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917485,
      athlete: {
        id: 33332,
        fullname: 'Test Bobcat',
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
        position: 'Openside Flanker',
        availability: 'unavailable',
      },
      squads: [
        {
          name: 'International Squad',
          primary: false,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917544,
      athlete: {
        id: 51488,
        fullname: 'Juan Ignacio Brex',
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
        position: 'Loose-head Prop',
        availability: 'unavailable',
      },
      squads: [
        {
          name: 'International Squad',
          primary: false,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917530,
      athlete: {
        id: 45856,
        fullname: 'Steve Byrne',
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
        position: 'No. 8',
        availability: 'injured',
      },
      squads: [
        {
          name: 'International Squad',
          primary: true,
        },
        {
          name: 'Kitman Labs - Staff',
          primary: false,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917486,
      athlete: {
        id: 1941,
        fullname: 'Roland Calabash',
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0P2JnPTk1MjQyZjM4JnR4dDY0PU1nJnR4dGFsaWduPWNlbnRlciZ0eHRjbHI9ZmZmJnR4dGZvbnQ9QXZlbmlyK05leHQrQ29uZGVuc2VkK01lZGl1bSZ0eHRwYWQ9NSZ0eHRzaGFkPTImdHh0c2l6ZT0xNiZ3PTM2&markalign=left%2Cbottom&markfit=max&markpad=0&w=100',
        position: 'Second Row',
        availability: 'unavailable',
      },
      squads: [
        {
          name: 'International Squad',
          primary: false,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917545,
      athlete: {
        id: 67736,
        fullname: 'Lorenzo Cannone',
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
        position: 'Wing',
        availability: 'available',
      },
      squads: [
        {
          name: 'International Squad',
          primary: true,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917546,
      athlete: {
        id: 1644,
        fullname: "Niccolo' Cannone",
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0P2JnPTk1MjQyZjM4JnR4dDY0PU1UQSZ0eHRhbGlnbj1jZW50ZXImdHh0Y2xyPWZmZiZ0eHRmb250PUF2ZW5pcitOZXh0K0NvbmRlbnNlZCtNZWRpdW0mdHh0cGFkPTUmdHh0c2hhZD0yJnR4dHNpemU9MTYmdz0zNg&markalign=left%2Cbottom&markfit=max&markpad=0&w=100',
        position: 'Hooker',
        availability: 'unavailable',
      },
      squads: [
        {
          name: 'Kitman Labs - Staff',
          primary: false,
        },
        {
          name: 'Kitman Test Squad',
          primary: false,
        },
        {
          name: 'International Squad',
          primary: false,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917540,
      athlete: {
        id: 11560,
        fullname: 'KitmanLabs Capture',
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0P2JnPTk1MjQyZjM4JnR4dDY0PU13JnR4dGFsaWduPWNlbnRlciZ0eHRjbHI9ZmZmJnR4dGZvbnQ9QXZlbmlyK05leHQrQ29uZGVuc2VkK01lZGl1bSZ0eHRwYWQ9NSZ0eHRzaGFkPTImdHh0c2l6ZT0xNiZ3PTM2&markalign=left%2Cbottom&markfit=max&markpad=0&w=100',
        position: 'Fullback',
        availability: 'unavailable',
      },
      squads: [
        {
          name: 'International Squad',
          primary: false,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917532,
      athlete: {
        id: 34453,
        fullname: 'Ian Carey',
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
        position: 'Outside Center',
        availability: 'available',
      },
      squads: [
        {
          name: 'Technical Director',
          primary: false,
        },
        {
          name: 'International Squad',
          primary: false,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917535,
      athlete: {
        id: 55266,
        fullname: 'Sean Carty',
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
        position: 'Outside Center',
        availability: 'available',
      },
      squads: [
        {
          name: 'Technical Director',
          primary: false,
        },
        {
          name: 'International Squad',
          primary: false,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917500,
      athlete: {
        id: 45547,
        fullname: 'jonathan chat',
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
        position: 'Inside Center',
        availability: 'available',
      },
      squads: [
        {
          name: 'International Squad',
          primary: false,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917510,
      athlete: {
        id: 46687,
        fullname: 'Alejandro Clavero',
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0P2JnPTk1MjQyZjM4JnR4dDY0PU1qWSZ0eHRhbGlnbj1jZW50ZXImdHh0Y2xyPWZmZiZ0eHRmb250PUF2ZW5pcitOZXh0K0NvbmRlbnNlZCtNZWRpdW0mdHh0cGFkPTUmdHh0c2hhZD0yJnR4dHNpemU9MTYmdz0zNg&markalign=left%2Cbottom&markfit=max&markpad=0&w=100',
        position: 'Wing',
        availability: 'available',
      },
      squads: [
        {
          name: 'International Squad',
          primary: true,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917512,
      athlete: {
        id: 3525,
        fullname: 'Adam Conway',
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
        position: 'Other',
        availability: 'injured',
      },
      squads: [
        {
          name: 'Kitman Labs - Staff',
          primary: false,
        },
        {
          name: 'International Squad',
          primary: false,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917534,
      athlete: {
        id: 2942,
        fullname: 'Adam Conway',
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0P2JnPTk1MjQyZjM4JnR4dDY0PU5RJnR4dGFsaWduPWNlbnRlciZ0eHRjbHI9ZmZmJnR4dGZvbnQ9QXZlbmlyK05leHQrQ29uZGVuc2VkK01lZGl1bSZ0eHRwYWQ9NSZ0eHRzaGFkPTImdHh0c2l6ZT0xNiZ3PTM2&markalign=left%2Cbottom&markfit=max&markpad=0&w=100',
        position: 'Scrum Half',
        availability: 'unavailable',
      },
      squads: [
        {
          name: 'Technical Director',
          primary: false,
        },
        {
          name: 'International Squad',
          primary: false,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917531,
      athlete: {
        id: 36479,
        fullname: 'Nick Cunningham',
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
        position: 'Loose-head Prop',
        availability: 'unavailable',
      },
      squads: [
        {
          name: 'Technical Director',
          primary: false,
        },
        {
          name: 'International Squad',
          primary: false,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917507,
      athlete: {
        id: 1966,
        fullname: 'Nick "The Athlete" Cunningham',
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0P2JnPTk1MjQyZjM4JnR4dDY0PU5RJnR4dGFsaWduPWNlbnRlciZ0eHRjbHI9ZmZmJnR4dGZvbnQ9QXZlbmlyK05leHQrQ29uZGVuc2VkK01lZGl1bSZ0eHRwYWQ9NSZ0eHRzaGFkPTImdHh0c2l6ZT0xNiZ3PTM2&markalign=left%2Cbottom&markfit=max&markpad=0&w=100',
        position: 'Wing',
        availability: 'unavailable',
      },
      squads: [
        {
          name: 'International Squad',
          primary: false,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917523,
      athlete: {
        id: 57651,
        fullname: 'John Dams',
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
        position: 'Inside Center',
        availability: 'available',
      },
      squads: [
        {
          name: 'International Squad',
          primary: false,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917565,
      athlete: {
        id: 93752,
        fullname: 'Pablo de Miguel',
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
        position: 'Outside Center',
        availability: 'available',
      },
      squads: [
        {
          name: 'International Squad',
          primary: false,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917547,
      athlete: {
        id: 74104,
        fullname: 'Dewalt Duvenage',
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
        position: 'Loose-head Prop',
        availability: 'unavailable',
      },
      squads: [
        {
          name: 'Academy Squad',
          primary: false,
        },
        {
          name: 'International Squad',
          primary: false,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917487,
      athlete: {
        id: 33331,
        fullname: 'Test Email',
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
        position: 'Hooker',
        availability: 'available',
      },
      squads: [
        {
          name: 'International Squad',
          primary: false,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
    {
      id: 13917494,
      athlete: {
        id: 39982,
        fullname: 'Test Email',
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
        position: 'Outside Center',
        availability: 'injured',
      },
      squads: [
        {
          name: 'International Squad',
          primary: false,
        },
      ],
      participation_level: 3864,
      participation_level_reason: null,
      include_in_group_calculations: true,
      related_issue: null,
      free_note: null,
    },
  ],
  next_id: 13917562,
};

const handler = rest.post(
  '/planning_hub/events/5/athlete_tab',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
