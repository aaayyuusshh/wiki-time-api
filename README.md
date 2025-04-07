# 📚 WikiTime API

**WikiTime** is a fun, minimal API that extracts useful information from Wikipedia pages.  
It’s perfect for devs building apps, bots, or tools that interact with Wikipedia content.

---

## 🔗 Live Endpoints

All endpoints are live and publicly accessible at:

``https://wiki-time-api-production.up.railway.app/api/{type}/:{title}``

Example Usage:

- 🕒 Reading Time  
  `https://wiki-time-api-production.up.railway.app/api/reading-time/basketball`  
  [Open in browser](https://wiki-time-api-production.up.railway.app/api/reading-time/basketball)

- 🖼️ Image Count  
  `https://wiki-time-api-production.up.railway.app/api/images/basketball`  
  [Open in browser](https://wiki-time-api-production.up.railway.app/api/images/basketball)

- ✍️ Word Count  
  `https://wiki-time-api-production.up.railway.app/api/words/basketball`  
  [Open in browser](https://wiki-time-api-production.up.railway.app/api/words/basketball)

---

## 📌 Available Endpoints

All endpoints follow the format:

```
GET /api/{type}/:{title}
```

Replace `{type}` with one of the three options below, and `{title}` with any valid Wikipedia article title.

---

### [⏳] In progress `/api/info/:{title}`

Returns **all relevant** info of the article.

**Example:**

```
GET /api/images/basketball
```

**Response:**

```json
{
  "title": "basketball",
  "numOfWords": 10231
  "numOfImages": 34
  "readingTime": 36
  "images": [
    "https://upload.wikimedia.org/...",
    "https://upload.wikimedia.org/..."
  ]
}
```
---

---

### `/api/words/:{title}`

Returns the total **word count** of the article.

**Example:**

```
GET /api/words/basketball
```

**Response:**

```json
{
  "title": "basketball",
  "numOfWords": 10231
}
```
---

### `/api/images/:{title}`

Returns the **number of images** in the article.

**Example:**

```
GET /api/images/basketball
```

**Response:**

```json
{
  "title": "basketball",
  "numOfImages": 34
}
```

---

### `/api/readingTime/:{title}`

Returns an estimated **reading time** for the article.

**Example:**

```
GET /api/readingTime/basketball
```

**Response:**

```json
{
  "title": "basketball",
  "readingTime": 36
}
```

---

### [⏳] In progress `/api/imagesUrl/:{title}`

Returns a list of all **image URLs** in the article.

**Example:**

```
GET /api/images/basketball
```

**Response:**

```json
{
  "title": "basketball",
  "images": [
    "https://upload.wikimedia.org/...",
    "https://upload.wikimedia.org/..."
  ]
}
```

---
