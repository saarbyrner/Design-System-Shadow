// @flow

import type { Athlete } from '@kitman/common/src/types/Athlete';

export const data: {
  athletes: Array<Athlete>,
  meta: {
    current_page: number,
    next_page: ?number,
    prev_page: ?number,
    total_pages: number,
    total_count: number,
  },
} = {
  athletes: [
    {
      id: 1,
      firstname: 'Robbie',
      lastname: 'Brady',
      fullname: 'Robbie Brady',
      position: 'Left Back',
      avatar_url:
        'https://s3:9000/injpro-staging-public/avatar.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=dummy1234%2F20241015%2Feu-west-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241015T140807Z\u0026X-Amz-Expires=900\u0026X-Amz-SignedHeaders=host\u0026X-Amz-Signature=2ad7faa20b8cfe65f9e4b1b642c35158e26c53a4d76b5933b1bbe729557bce95',
      shortname: 'R. Brady',
      availability: 'unavailable',
      last_screening: '2024-01-01',
      status_data: {},
      positionId: 1,
      positionGroup: 'Defender',
      positionGroupId: 1,
    },
    {
      id: 2,
      firstname: 'Caoimhin',
      lastname: 'Kelleher',
      fullname: 'Caoimhin Kelleher',
      position: 'Goalkeeper',
      avatar_url:
        'https://s3:9000/injpro-staging-public/avatar.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=dummy1234%2F20241015%2Feu-west-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20241015T140807Z\u0026X-Amz-Expires=900\u0026X-Amz-SignedHeaders=host\u0026X-Amz-Signature=2ad7faa20b8cfe65f9e4b1b642c35158e26c53a4d76b5933b1bbe729557bce95',
      shortname: 'C. Kelleher',
      availability: 'unavailable',
      last_screening: '2024-01-01',
      status_data: {},
      positionId: 2,
      positionGroup: 'Goalkeeper',
      positionGroupId: 2,
    },
    {
      id: 3,
      firstname: 'Adam',
      lastname: 'Conway',
      fullname: 'Adam Conway',
      position: 'Scrum Half',
      avatar_url:
        'https://s3:9000/injpro-staging-public/kitman-stock-assets/test.no_filetype_set?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=dummy1234%2F20250226%2Feu-west-1%2Fs3%2Faws4_request\u0026X-Amz-Date=20250226T175826Z\u0026X-Amz-Expires=900\u0026X-Amz-SignedHeaders=host\u0026X-Amz-Signature=e0752275a0c7cf2fdcd41e9f6eb0a012d277616e7c5e419a3259ec2fdea25825',
      shortname: 'A. Conway',
      availability: 'unavailable',
      last_screening: '2024-01-01',
      status_data: {},
      positionId: 3,
      positionGroup: 'Back',
      positionGroupId: 3,
    },
  ],
  meta: {
    current_page: 1,
    next_page: null,
    prev_page: null,
    total_pages: 1,
    total_count: 3,
  },
};

export default data;
