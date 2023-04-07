const statusBadgeColors = (): {} => ({
  unknown: 'bg-secondary',
  planned: 'bg-primary',
  passed: 'bg-success',
  requested: 'bg-warning',
  approved: 'bg-primary',
  over: 'bg-warning',
  readyForGrading: 'bg-warning',
});

export default statusBadgeColors;
