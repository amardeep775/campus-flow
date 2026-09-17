export const calculateAttendance = (attended, total) => {
  if (total === 0) return 100; // Assume 100% if no classes yet
  return (attended / total) * 100;
};

// Returns maximum classes that can be missed while staying at >= requiredPercentage
export const calculateClassesToMiss = (attended, totalClasses, requiredPercentage) => {
  if (totalClasses === 0) return 0;
  
  const currentPercentage = calculateAttendance(attended, totalClasses);
  if (currentPercentage < requiredPercentage) return 0;

  // We want to find largest x such that:
  // (attended / (totalClasses + x)) * 100 >= requiredPercentage
  // attended * 100 >= requiredPercentage * (totalClasses + x)
  // (attended * 100) / requiredPercentage >= totalClasses + x
  // x <= ((attended * 100) / requiredPercentage) - totalClasses
  
  const x = Math.floor(((attended * 100) / requiredPercentage) - totalClasses);
  return Math.max(0, x);
};

// Returns minimum consecutive classes required to attend to reach requiredPercentage
export const calculateClassesToAttend = (attended, totalClasses, requiredPercentage) => {
  if (totalClasses === 0) return 0;
  
  const currentPercentage = calculateAttendance(attended, totalClasses);
  if (currentPercentage >= requiredPercentage) return 0;

  // We want to find smallest x such that:
  // ((attended + x) / (totalClasses + x)) * 100 >= requiredPercentage
  // (attended + x) * 100 >= requiredPercentage * (totalClasses + x)
  // (attended * 100) + 100x >= (requiredPercentage * totalClasses) + (requiredPercentage * x)
  // 100x - requiredPercentage * x >= (requiredPercentage * totalClasses) - (attended * 100)
  // x * (100 - requiredPercentage) >= (requiredPercentage * totalClasses) - (attended * 100)
  // x >= ((requiredPercentage * totalClasses) - (attended * 100)) / (100 - requiredPercentage)
  
  if (requiredPercentage === 100) return Infinity; // Impossible to reach 100% if missed any

  const x = Math.ceil(((requiredPercentage * totalClasses) - (attended * 100)) / (100 - requiredPercentage));
  return Math.max(0, x);
};

export const getAttendanceStatus = (percentage, required) => {
  if (percentage >= required + 5) return 'safe';
  if (percentage >= required) return 'warning';
  return 'critical';
};
