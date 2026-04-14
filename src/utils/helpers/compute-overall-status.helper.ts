export function computeOverallStatus(evals: any[]) {
  const third = evals.find(e => e.stage === 'third_month_evaluation');
  const fifth = evals.find(e => e.stage === 'fifth_month_evaluation');

  const thirdComplete = !!third?.completed_at;
  const fifthComplete = !!fifth?.completed_at;

  if (!thirdComplete || !fifthComplete) {
    return 'for_evaluation';
  }

  // assuming you’ll add "approved" later
  return 'for_verification';
}