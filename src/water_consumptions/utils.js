const calculateDailyGoal = (user) => {
  let waterBase = user.weight * 30;
  switch (user.physical_activity) {
  case 'sédentaire':
    waterBase += 350;
    break;
  case 'activité légère':
    waterBase += 500;
    break;
  case 'actif':
    waterBase += 750;
    break;
  case 'très actif':
    waterBase += 1000;
    break;
  default:
    break;
  }
  let waterGoal = waterBase / 1000;
  waterGoal = Math.max(waterGoal, 1.5);
  waterGoal = Math.min(waterGoal, 3.5);
  return waterGoal;
};

module.exports = calculateDailyGoal;
