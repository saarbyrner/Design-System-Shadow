export default {
  MLS_ATHLETE: [
    { id: 1, name: 'Incomplete', type: 'incomplete' }, // This state is default from BE
    { id: 2, name: 'Approved', type: 'approved' },
    { id: 3, name: 'Rejected', type: 'rejected' },
  ],
  MLS_STAFF: [
    { id: 1, name: 'Incomplete', type: 'incomplete' },
    { id: 2, name: 'Pending (League approval)', type: 'pending_association' },
    { id: 3, name: 'Rejected (League)', type: 'rejected_association' },
  ],

  MLS_NEXT_PRO_ATHLETE: [
    { id: 1, name: 'Incomplete', type: 'incomplete' },
    { id: 2, name: 'Pending (League approval)', type: 'pending_association' },
    { id: 3, name: 'Rejected (League)', type: 'rejected_association' },
  ],
};
