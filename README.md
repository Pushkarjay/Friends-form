# Friends Form 📇

A personal friend profile management system with printable A4 templates. Store detailed information about your friends, add photos, and print beautiful profile pages.

## Features

### 📝 Dual Page Template
- **Page 1**: Complete template with labels and dotted lines for handwriting
- **Page 2**: Data-only overlay printing (prints values without labels)

### 💾 Local Database
- Data saved to local JSON file (`Data/Database/friends-database.json`)
- Works offline - no internet required
- Portable - copy folder to new PC and data comes with it
- Survives browser cache clear

### 🖼️ Photo Management
- Main profile photo + 4 additional photos per entry
- Zoom in/out with controls or mouse wheel
- Pan/drag to position photos
- Delete photos individually

### 📊 Database Viewer
- View all entries in a table
- Search by name, phone, email
- Sort by any column
- Edit or delete entries
- Export/Import JSON backup

### ✨ Incremental Printing
- Load existing entry, add new data
- **Print only the NEW fields** on Page 2
- Previously saved data shown in gray (won't print)
- Perfect for updating printed pages over time

## Quick Start

### Requirements
- [Node.js](https://nodejs.org/) installed on your PC

### How to Run

1. **Double-click `START.bat`**
   - Opens browser automatically at `http://localhost:3000`
   - Server runs in background

2. **Or run manually:**
   ```bash
   cd Backend
   node server.js
   ```
   Then open `http://localhost:3000`

## Usage

### Adding a New Friend
1. Fill in the fields on Page 1
2. Click photo placeholders to add images
3. Click **💾 Save Entry**

### Editing Existing Entry
1. Click **📁 View Database**
2. Find the entry and click **✏️ Edit**
3. Make changes and **💾 Save Entry**

### Printing

#### First Time (Full Profile)
1. Fill all available data
2. Click **🖨️ Print Page 1** for template with labels

#### Adding Data Later (Overlay Print)
1. Open existing entry from database
2. Add new fields (they appear in normal color)
3. Click **🖨️ Print Page 2**
4. Only NEW data prints - overlay on existing printed page!

## Folder Structure

```
Friends-form/
├── START.bat              # Double-click to start
├── index.html             # Main form page
├── database.html          # Database viewer
├── Backend/
│   └── server.js          # Local API server
├── Data/
│   ├── Collected Data/    # Your source data files
│   └── Database/
│       └── friends-database.json  # YOUR DATA
└── Older Versions/        # Previous template versions
```

## Data Fields

### Personal Details
- Name, DOB, Gender
- Phone, Alt Phone, Email, Social

### Connection
- First Meet, Relationship
- Father, Mother, Zodiac, Best Friend

### Favorites
- Hobbies, Food, Chocolate, Movie, Song
- Place, Color, Actor, Actress
- Fruit, Sweet, Subject, Book, Person
- Dream Place, Memory

### Journey
- 10th School, 12th School, Stream
- College, City, Degree, Branch
- Company, Work City, Address

## Tips

- **Gray fields** = Already saved (won't print on Page 2)
- **Normal fields** = New/edited (will print on Page 2)
- **Export regularly** to backup your data
- Copy entire folder to transfer to another PC

## Technical Details

- Frontend: Vanilla HTML/CSS/JavaScript
- Backend: Node.js (no dependencies)
- Database: JSON file
- Print: CSS @media print rules
- Photos: Base64 encoded in database

## License

Personal use only.

---

## 📋 Response Forms

Collect friend data online using these forms:

| Form | Link |
|------|------|
| **Response Form 1** (SurveyHeart) | [https://surveyheart.com/form/601f8c70106f57336fa57109](https://surveyheart.com/form/601f8c70106f57336fa57109) |
| **Response Form 2** (Google Forms) | [https://docs.google.com/forms/d/e/1FAIpQLScWlljazTAvHwfOsIbrGjU7PEL4mGMQyVKnDysEnHXJx7zl1A/viewform](https://docs.google.com/forms/d/e/1FAIpQLScWlljazTAvHwfOsIbrGjU7PEL4mGMQyVKnDysEnHXJx7zl1A/viewform?usp=sf_link) |
| **Response Form 3** | ------ |

---

Made with ❤️ for keeping friend memories organized
