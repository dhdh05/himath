# Game API Documentation

## Base URL
```
http://localhost:5000/api/games
```

## Game Types (Enum)
- `hoc-so` - Học số (Learn Numbers 0-9)
- `ghep-so` - Ghép số (Drag-drop matching game, 6 levels)
- `chan-le` - Chẵn/Lẻ (Even/Odd classification)
- `so-sanh` - So sánh số (Number comparison)
- `xep-so` - Xếp số (Sort numbers)

## Endpoints

### Public Endpoints (No Authentication Required)

#### 1. Get All Levels of a Game
```
GET /levels/:gameType
```

**Parameters:**
- `gameType` (path): Game type (hoc-so, ghep-so, chan-le, so-sanh, xep-so)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "level_id": 1,
      "game_type": "hoc-so",
      "level_number": 1,
      "title": "Học từ 0 đến 3",
      "description": "Nhận biết và học các số từ 0 đến 3 với hình ảnh và âm thanh",
      "difficulty": "easy",
      "time_limit": 120,
      "required_score": 60,
      "config": {
        "numbers": [0, 1, 2, 3],
        "hasAudio": true
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 2. Get Specific Level Details
```
GET /level/:levelId
```

**Parameters:**
- `levelId` (path): Level ID

**Response:** Single level object (same structure as above)

#### 3. Get Game Leaderboard
```
GET /leaderboard/:gameType
```

**Query Parameters:**
- `limit` (query): Limit results (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "progress_id": 1,
      "student_id": 1,
      "game_type": "hoc-so",
      "current_level": 3,
      "highest_level_passed": 3,
      "total_stars": 9,
      "total_attempts": 3,
      "last_played_at": "2024-01-15T10:30:00.000Z",
      "student": {
        "student_id": 1,
        "full_name": "Bé Bi"
      }
    }
  ]
}
```

### Protected Endpoints (Authentication Required)

#### 4. Save Game Result
```
POST /result
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "studentId": 1,
  "levelId": 1,
  "score": 85,
  "timeSpent": 95,
  "answers": {
    "q1": "answer1",
    "q2": "answer2"
  }
}
```

**Required Fields:**
- `studentId` (number): Student ID
- `levelId` (number): Level ID
- `score` (number): Score 0-100

**Optional Fields:**
- `timeSpent` (number): Time spent in seconds
- `answers` (object): Detailed answers

**Response:**
```json
{
  "success": true,
  "message": "Lưu kết quả thành công",
  "data": {
    "result_id": 1,
    "student_id": 1,
    "level_id": 1,
    "game_type": "hoc-so",
    "score": 85,
    "max_score": 100,
    "stars": 2,
    "time_spent": 95,
    "attempts": 1,
    "is_passed": true,
    "answers": {},
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Star Calculation Logic:**
- 100 points = 3 stars
- 80-99 points = 2 stars
- 60-79 points = 1 star
- < 60 points = 0 stars
- Bonus: +1 star if completed < 50% of time limit
- Penalty: -1 star if attempts > 2

#### 5. Get Student Game Progress (Single Game)
```
GET /progress/:studentId/:gameType
Authorization: Bearer <token>
```

**Parameters:**
- `studentId` (path): Student ID
- `gameType` (path): Game type

**Response:**
```json
{
  "success": true,
  "data": {
    "progress_id": 1,
    "student_id": 1,
    "game_type": "hoc-so",
    "current_level": 2,
    "highest_level_passed": 2,
    "total_stars": 4,
    "total_attempts": 2,
    "last_played_at": "2024-01-15T10:30:00.000Z",
    "last_updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 6. Get All Game Progress
```
GET /progress/:studentId
Authorization: Bearer <token>
```

**Parameters:**
- `studentId` (path): Student ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "progress_id": 1,
      "student_id": 1,
      "game_type": "hoc-so",
      "current_level": 2,
      "highest_level_passed": 2,
      "total_stars": 4,
      "total_attempts": 2,
      "last_played_at": "2024-01-15T10:30:00.000Z"
    },
    {
      "progress_id": 2,
      "student_id": 1,
      "game_type": "ghep-so",
      "current_level": 1,
      "highest_level_passed": 0,
      "total_stars": 0,
      "total_attempts": 1,
      "last_played_at": "2024-01-15T09:30:00.000Z"
    }
  ]
}
```

#### 7. Get Student Game Results
```
GET /results/:studentId
Authorization: Bearer <token>
```

**Query Parameters:**
- `gameType` (query): Optional - filter by game type
- `limit` (query): Limit results (default: 20)
- `offset` (query): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "result_id": 1,
      "student_id": 1,
      "level_id": 1,
      "game_type": "hoc-so",
      "score": 85,
      "max_score": 100,
      "stars": 2,
      "time_spent": 95,
      "attempts": 1,
      "is_passed": true,
      "answers": {},
      "createdAt": "2024-01-15T10:30:00.000Z",
      "level": {
        "level_id": 1,
        "level_number": 1,
        "title": "Học từ 0 đến 3",
        "difficulty": "easy",
        "time_limit": 120
      }
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 20,
    "offset": 0
  }
}
```

#### 8. Get Student Achievements
```
GET /achievements/:studentId
Authorization: Bearer <token>
```

**Query Parameters:**
- `gameType` (query): Optional - filter by game type

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "achievement_id": 1,
      "student_id": 1,
      "game_type": "hoc-so",
      "achievement_type": "first_play",
      "title": "Khởi đầu",
      "description": "Chơi lần đầu tiên hoc-so",
      "icon_url": "/assets/badges/first_play.png",
      "earned_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Achievement Types:**
- `first_play`: Chơi lần đầu tiên
- `perfect_score`: Đạt 100 điểm
- `level_master`: Đạt 3 sao ở 3 level
- `streak_5`: Vượt qua 5 level liên tiếp
- `streak_10`: Vượt qua 10 level liên tiếp
- `speedrun`: Hoàn thành trong thời gian kỷ lục
- `game_guru`: Hoàn thành tất cả level
- `star_collector`: Tập hợp 50 sao

#### 9. Get Game Statistics
```
GET /stats/:studentId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_games": 5,
    "total_results": 25,
    "total_achievements": 8,
    "total_stars": 42,
    "games": [
      {
        "progress_id": 1,
        "student_id": 1,
        "game_type": "hoc-so",
        "current_level": 3,
        "highest_level_passed": 3,
        "total_stars": 9,
        "total_attempts": 5,
        "last_played_at": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

### Admin Endpoints

#### 10. Create Game Level
```
POST /level
Authorization: Bearer <token>
```

**Required Headers:**
- User must have role: `admin`

**Request Body:**
```json
{
  "gameType": "hoc-so",
  "levelNumber": 5,
  "title": "Học 10",
  "description": "Nhận biết số 10",
  "difficulty": "medium",
  "timeLimit": 120,
  "requiredScore": 70,
  "config": {
    "numbers": [10],
    "hasAudio": true
  }
}
```

**Response:** Created level object

#### 11. Update Game Level
```
PUT /level/:levelId
Authorization: Bearer <token>
```

**Parameters:**
- `levelId` (path): Level ID

**Request Body:** Same as create (all fields optional for update)

**Response:** Updated level object

#### 12. Delete Game Level
```
DELETE /level/:levelId
Authorization: Bearer <token>
```

**Parameters:**
- `levelId` (path): Level ID

**Response:**
```json
{
  "success": true,
  "message": "Xóa level thành công"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Thiếu dữ liệu bắt buộc: studentId, levelId, score"
}
```

### 404 Not Found
```json
{
  "message": "Không tìm thấy level này"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Error message details"
}
```

## Usage Examples

### Example 1: Save a Game Result
```bash
curl -X POST http://localhost:5000/api/games/result \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "studentId": 1,
    "levelId": 1,
    "score": 85,
    "timeSpent": 95,
    "answers": {"q1": "correct"}
  }'
```

### Example 2: Get Game Levels
```bash
curl http://localhost:5000/api/games/levels/hoc-so
```

### Example 3: Get Student Progress
```bash
curl http://localhost:5000/api/games/progress/1/hoc-so \
  -H "Authorization: Bearer <token>"
```

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Game results are automatically saved to database
- Stars and achievements are calculated automatically
- Leaderboard is sorted by: highest_level_passed (DESC) → total_stars (DESC) → total_attempts (ASC)
- All game data is stored in JSON config field for flexibility
