// Simulated user progress
const userProgress = {
  waterIntake: 7, // Consecutive days of meeting the water goal
  steps: 10, // Consecutive days of meeting the step goal
  sleep: 12, // Consecutive days of meeting the sleep goal
};

// Achievement criteria
const achievementsCriteria = {
  mars: { type: 'waterIntake', goal: 7 },
  jupiter: { type: 'steps', goal: 14 },
  saturn: { type: 'sleep', goal: 14 },
};

// Update achievements based on progress
function updateAchievements() {
  const achievements = document.querySelectorAll('.achievement');

  achievements.forEach((achievement) => {
    const achievementKey = achievement.dataset.achievement;
    const criteria = achievementsCriteria[achievementKey];

    if (userProgress[criteria.type] >= criteria.goal) {
      achievement.classList.add('unlocked');
    }
  });
}

// Call the function on page load
document.addEventListener('DOMContentLoaded', updateAchievements);
