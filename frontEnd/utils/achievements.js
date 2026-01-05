// Helper functions de check va hien thi achievements/rewards sau khi submit score

/**
 * Check achievements va rewards sau khi submit score
 * @param {Object} submitResponse - Response tu API submit score
 */
export async function checkAndShowAchievements(submitResponse) {
  if (!submitResponse || !submitResponse.success) return;

  // Show achievements popup neu co
  if (submitResponse.new_achievements && submitResponse.new_achievements.length > 0) {
    try {
      const { showAchievementPopup } = await import('../panels/achievements/panel.js');
      showAchievementPopup(submitResponse.new_achievements);
    } catch (error) {
      console.error('Loi hien thi achievement popup:', error);
    }
  }

  // Show rewards popup neu co
  if (submitResponse.new_rewards && submitResponse.new_rewards.length > 0) {
    try {
      const { showRewardPopup } = await import('../panels/rewards/panel.js');
      showRewardPopup(submitResponse.new_rewards);
    } catch (error) {
      console.error('Loi hien thi reward popup:', error);
    }
  }
}

/**
 * Wrapper function de submit score va tu dong check achievements
 * @param {Object} scoreData - Data de submit (level_id, game_type, score, stars, is_passed, time_spent)
 * @returns {Promise<Object>} Response tu API
 */
export async function submitScoreWithAchievements(scoreData) {
  try {
    const apiUrl = window.API_CONFIG?.ENDPOINTS?.GAMES?.SUBMIT || 'http://localhost:3000/api/games/submit';
    const headers = window.getAuthHeaders ? window.getAuthHeaders() : { 'Content-Type': 'application/json' };

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(scoreData)
    });

    if (!res.ok) throw new Error('Failed to submit score');

    const data = await res.json();

    // Tu dong check va hien thi achievements/rewards
    if (data.success) {
      await checkAndShowAchievements(data);
    }

    return data;
  } catch (error) {
    console.error('Loi submit score:', error);
    throw error;
  }
}

// Export de dung trong cac game panels
window.checkAndShowAchievements = checkAndShowAchievements;
window.submitScoreWithAchievements = submitScoreWithAchievements;

