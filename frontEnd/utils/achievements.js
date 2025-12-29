// Helper functions để check và hiển thị achievements/rewards sau khi submit score

/**
 * Check achievements và rewards sau khi submit score
 * @param {Object} submitResponse - Response từ API submit score
 */
export async function checkAndShowAchievements(submitResponse) {
  if (!submitResponse || !submitResponse.success) return;
  
  // Show achievements popup nếu có
  if (submitResponse.new_achievements && submitResponse.new_achievements.length > 0) {
    try {
      const { showAchievementPopup } = await import('../panels/achievements/panel.js');
      showAchievementPopup(submitResponse.new_achievements);
    } catch (error) {
      console.error('Lỗi hiển thị achievement popup:', error);
    }
  }
  
  // Show rewards popup nếu có
  if (submitResponse.new_rewards && submitResponse.new_rewards.length > 0) {
    try {
      const { showRewardPopup } = await import('../panels/rewards/panel.js');
      showRewardPopup(submitResponse.new_rewards);
    } catch (error) {
      console.error('Lỗi hiển thị reward popup:', error);
    }
  }
}

/**
 * Wrapper function để submit score và tự động check achievements
 * @param {Object} scoreData - Data để submit (level_id, game_type, score, stars, is_passed, time_spent)
 * @returns {Promise<Object>} Response từ API
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
    
    // Tự động check và hiển thị achievements/rewards
    if (data.success) {
      await checkAndShowAchievements(data);
    }
    
    return data;
  } catch (error) {
    console.error('Lỗi submit score:', error);
    throw error;
  }
}

// Export để dùng trong các game panels
window.checkAndShowAchievements = checkAndShowAchievements;
window.submitScoreWithAchievements = submitScoreWithAchievements;

