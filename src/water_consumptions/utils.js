const calculateDailyGoal = (user) => {
  let waterBase = user.weight * 30; // Base calculée sur le poids
  switch (user.physical_activity) {
  case 'sédentaire':
    waterBase += 350; // Vous ajoutez 350ml pour une activité sédentaire
    break;
  case 'activité légère':
    waterBase += 500; // 500ml pour une activité légère
    break;
  case 'actif':
    waterBase += 750; // 750ml pour un utilisateur actif
    break;
  case 'très actif':
    waterBase += 1000; // 1000ml pour une activité très active
    break;
  default:
    break;
  }
  let waterGoal = waterBase / 1000; // Conversion en litres
  waterGoal = Math.max(waterGoal, 1.5); // Ne devrait pas être inférieur à 1.5L
  waterGoal = Math.min(waterGoal, 3.5); // Ne devrait pas dépasser 3.5L
  return waterGoal;
};

module.exports = calculateDailyGoal;
