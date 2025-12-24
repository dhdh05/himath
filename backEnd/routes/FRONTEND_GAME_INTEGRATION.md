# Frontend to Backend Game Integration Guide

## Overview

Hi Math backend now has complete game system support with 5 game types:
- **hoc-so** (Học số): Learn numbers 0-9
- **ghep-so** (Ghép số): Drag-drop matching (6 levels)
- **chan-le** (Chẵn/Lẻ): Even/odd classification
- **so-sanh** (So sánh): Number comparison
- **xep-so** (Xếp số): Sort numbers

## Architecture

### Frontend -> Backend Flow

```
User interacts with game (frontend)
         ↓
Frontend sends game result (POST /api/games/result)
         ↓
Backend calculates stars & progress
         ↓
Backend checks and unlocks achievements
         ↓
Frontend displays stars & unlocked badges
```

## Step-by-Step Integration

### 1. Initialize Game Session

When user clicks a game level in frontend:

```javascript
// Frontend code (main.js or panel.js)
const studentId = localStorage.getItem('STUDENT_ID'); // From auth
const gameType = 'hoc-so'; // Current game
const levelId = 1; // Current level

// Display level details
fetch(`http://localhost:5000/api/games/level/${levelId}`)
  .then(r => r.json())
  .then(data => {
    const level = data.data;
    console.log(`Playing: ${level.title}`);
    console.log(`Time limit: ${level.time_limit} seconds`);
    console.log(`Required score: ${level.required_score}%`);
    // Use level.config for game-specific settings
  });
```

### 2. Track Game Progress

During game play, track:
- Score (0-100)
- Time spent (seconds)
- Answers/responses

```javascript
// Track during gameplay
let startTime = Date.now();
let answers = {};

// When user answers questions
answers['question_1'] = 'answer_choice';

// When game ends
const timeSpent = Math.round((Date.now() - startTime) / 1000);
const score = calculateGameScore(); // Your calculation
```

### 3. Submit Game Result

When game ends, send result to backend:

```javascript
const token = localStorage.getItem('AUTH_KEY'); // From auth
const gameResult = {
  studentId: parseInt(studentId),
  levelId: parseInt(levelId),
  score: score,
  timeSpent: timeSpent,
  answers: answers
};

fetch('http://localhost:5000/api/games/result', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(gameResult)
})
.then(r => r.json())
.then(data => {
  if (data.success) {
    const result = data.data;
    console.log(`Stars earned: ${result.stars}`);
    console.log(`Score: ${result.score}%`);
    console.log(`Passed: ${result.is_passed}`);
    
    // Show result screen
    showGameResult(result);
  }
});
```

### 4. Display Results

After game ends, show stars and achievements:

```javascript
async function showGameResult(result) {
  // Show stars
  displayStars(result.stars); // 0-3 stars

  // Check for new achievements
  const achievements = await fetch(
    `http://localhost:5000/api/games/achievements/${studentId}?gameType=${gameType}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  ).then(r => r.json());

  // Show newly earned badges
  achievements.data.forEach(badge => {
    if (badge.earned_at === new Date().toISOString().split('T')[0]) {
      showAchievementPopup(badge);
    }
  });

  // Update progress bar
  const progress = await fetch(
    `http://localhost:5000/api/games/progress/${studentId}/${gameType}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  ).then(r => r.json());

  updateProgressDisplay(progress.data);
}
```

### 5. Load Student Progress

When user opens a game section:

```javascript
async function loadGameProgress() {
  const response = await fetch(
    `http://localhost:5000/api/games/progress/${studentId}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  const data = await response.json();
  
  // data.data is array of all game progress
  data.data.forEach(gameProgress => {
    console.log(`${gameProgress.game_type}: Level ${gameProgress.current_level}`);
    console.log(`Total stars: ${gameProgress.total_stars}`);
    console.log(`Highest passed: ${gameProgress.highest_level_passed}`);
  });
}
```

### 6. Load Levels

When user selects a game type:

```javascript
async function loadGameLevels(gameType) {
  const response = await fetch(
    `http://localhost:5000/api/games/levels/${gameType}`
  );
  const data = await response.json();
  
  // data.data is array of levels
  const levels = data.data;
  
  levels.forEach(level => {
    console.log(`Level ${level.level_number}: ${level.title}`);
    console.log(`Difficulty: ${level.difficulty}`);
    console.log(`Config:`, level.config); // Game-specific settings
    
    // Create clickable level button
    createLevelButton(level);
  });
}
```

## Game Level Configuration

Each level has a `config` JSON field with game-specific settings:

### hoc-so (Learn Numbers)
```json
{
  "numbers": [0, 1, 2, 3],
  "hasAudio": true
}
```

### ghep-so (Drag-Drop)
```json
{
  "numbers": [1, 2, 3],
  "hasIcons": true,
  "levels": 3
}
```

### chan-le (Even/Odd)
```json
{
  "numbers": [1, 2, 3, 4, 5],
  "range": "1-5"
}
```

### so-sanh (Comparison)
```json
{
  "numbers": [1, 2, 3],
  "comparisons": [">", "<", "="]
}
```

### xep-so (Sort)
```json
{
  "numbers": [1, 2, 3],
  "sortOrder": "ascending"
}
```

## Frontend Implementation Checklist

- [ ] **Authenticate User**: Get AUTH_KEY and STUDENT_ID from login
- [ ] **Load Game List**: Display all 5 game types
- [ ] **Load Levels**: Fetch levels for selected game
- [ ] **Display Level Details**: Show title, time limit, required score
- [ ] **Execute Game**: Run game logic and collect answers
- [ ] **Track Scores**: Calculate score (0-100)
- [ ] **Submit Results**: POST to `/api/games/result`
- [ ] **Display Stars**: Show 0-3 stars based on performance
- [ ] **Show Achievements**: Display unlocked badges
- [ ] **Update Progress**: Show current level and total stars
- [ ] **Leaderboard**: Fetch and display top players

## API Endpoints Quick Reference

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/levels/:gameType` | No | Get all levels |
| GET | `/level/:levelId` | No | Get level details |
| GET | `/leaderboard/:gameType` | No | Get top players |
| POST | `/result` | Yes | Save game result |
| GET | `/progress/:studentId/:gameType` | Yes | Get single game progress |
| GET | `/progress/:studentId` | Yes | Get all game progress |
| GET | `/results/:studentId` | Yes | Get all game results |
| GET | `/achievements/:studentId` | Yes | Get achievements |
| GET | `/stats/:studentId` | Yes | Get game statistics |

## Star Calculation Logic

Backend automatically calculates stars based on:

```
Score: 100 → 3 stars
Score: 80-99 → 2 stars  
Score: 60-79 → 1 star
Score: < 60 → 0 stars

+ Bonus: +1 star if time < 50% of limit
- Penalty: -1 star if attempts > 2
(Final: min 0, max 3)
```

## Achievement Types

These are automatically unlocked:

| Type | Condition |
|------|-----------|
| `first_play` | Play a game type for first time |
| `perfect_score` | Achieve 100 points |
| `level_master` | Earn 3-star on 3 levels |
| `streak_5` | Pass 5 levels in a row |
| `streak_10` | Pass 10 levels in a row |
| `speedrun` | Complete with 3 stars and score ≥ 80 |
| `game_guru` | Master all levels |
| `star_collector` | Collect 50 total stars |

## Frontend to Backend Data Flow Example

```javascript
// hoc-so game example
async function playHocSoGame() {
  const gameType = 'hoc-so';
  const levelId = 1;
  
  // 1. Get level details
  const levelRes = await fetch(`/api/games/level/${levelId}`);
  const level = (await levelRes.json()).data;
  
  // 2. Run game with level.config
  const gameResult = runHocSoGame(level);
  // Returns: { score: 85, timeSpent: 95, answers: {...} }
  
  // 3. Save result
  const saveRes = await fetch('/api/games/result', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      studentId: 1,
      levelId: levelId,
      score: gameResult.score,
      timeSpent: gameResult.timeSpent,
      answers: gameResult.answers
    })
  });
  
  const result = (await saveRes.json()).data;
  
  // 4. Display result
  console.log(`Stars: ${result.stars}`);
  console.log(`Passed: ${result.is_passed}`);
  
  // 5. Check achievements
  const achievementsRes = await fetch(
    `/api/games/achievements/${studentId}?gameType=${gameType}`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  const achievements = (await achievementsRes.json()).data;
  
  achievements.forEach(badge => console.log(`Unlocked: ${badge.title}`));
}
```

## Testing with Frontend

### Test Data
- **Student ID**: 1 (from database)
- **Game Type**: hoc-so
- **Level ID**: 1
- **Test Score**: 85
- **Test Time**: 95 seconds

### Test Commands

```bash
# 1. Get all hoc-so levels
curl http://localhost:5000/api/games/levels/hoc-so

# 2. Get level 1 details  
curl http://localhost:5000/api/games/level/1

# 3. Save game result (needs AUTH token)
curl -X POST http://localhost:5000/api/games/result \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "studentId": 1,
    "levelId": 1,
    "score": 85,
    "timeSpent": 95,
    "answers": {"q1": "1"}
  }'

# 4. Get student progress
curl http://localhost:5000/api/games/progress/1/hoc-so \
  -H "Authorization: Bearer YOUR_TOKEN"

# 5. Get achievements
curl http://localhost:5000/api/games/achievements/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### Error: "Token not provided"
- Ensure `Authorization: Bearer <token>` header is included
- Check token is not expired (7 days from login)

### Error: "Student not found"
- Verify studentId matches database
- Check user is logged in with correct account

### Error: "Level not found"
- Verify levelId exists in database
- Check game_type matches

### No achievements unlocking
- Achievements unlock on next game play
- Check achievement unlocking conditions
- Verify score/performance meets criteria

## Performance Optimization

For leaderboard with many students:
```javascript
// Add pagination
fetch('/api/games/leaderboard/hoc-so?limit=10')

// Add game type filter for progress
fetch('/api/games/results/1?gameType=hoc-so&limit=20&offset=0')
```

## Next Steps

1. Update frontend HTML to add game navigation buttons
2. Implement game logic in panel.js files
3. Integrate score calculation
4. Add result display UI
5. Add leaderboard view
6. Add achievement badge display
