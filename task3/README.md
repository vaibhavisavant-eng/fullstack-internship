# ⚡ TaskFlow — React (Vite) To-Do Application

A modern, responsive, feature-packed To-Do List application built with **React 18** and **Vite**. Features inline task editing, priority tags, real-time progress tracking, filtering, dark glassmorphism styling, and automatic persistence with `localStorage`.

---

## 📁 Project Architecture

```
task3/
├── index.html              # HTML entry point with Google Fonts
├── package.json            # Project dependencies & scripts
├── vite.config.js          # Vite configuration
├── README.md               # Project documentation & React concepts guide
└── src/
    ├── main.jsx            # React root renderer
    ├── App.jsx             # Main container, state holder & localStorage logic
    ├── index.css           # Global design system, theme variables & styles
    └── components/
        ├── TodoForm.jsx    # Input component for adding tasks with priorities
        ├── TodoList.jsx    # Container component rendering tasks / empty states
        ├── TodoItem.jsx    # Component for individual task (inline editing, toggle, delete)
        └── TodoFilter.jsx  # Toolbar with filter tabs, progress bar & remaining counter
```

---

## 🚀 Quick Setup Instructions

Follow these steps to run the application locally:

### 1. Navigate to the task directory
```bash
cd task3
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

The application will start locally at **`http://localhost:3000`** (or `http://localhost:5173`). Open the URL in your web browser to test the app.

### 4. Build for production (optional)
```bash
npm run build
```

---

## ✨ Key Features & Capabilities

1. **Task Management (CRUD)**:
   - **Add**: Create tasks with custom text and priority levels (*Low*, *Medium*, *High*).
   - **Inline Editing**: Double-click task text or click the edit icon to edit tasks directly in place. Press `Enter` to save or `Esc` to cancel.
   - **Complete / Uncomplete**: Toggle completion state with custom animated checkbox.
   - **Delete**: Remove individual tasks or clear all completed tasks in one click.

2. **Smart Filtering**:
   - **All**: Displays complete list with total task count.
   - **Active**: Shows only pending tasks with remaining counter.
   - **Completed**: Displays finished tasks with option to clear them.

3. **Progress Visualizer**:
   - Real-time progress bar showing percentage of completed tasks.

4. **Data Persistence**:
   - All tasks are automatically saved to browser `localStorage` and reloaded on page refresh.

5. **Responsive & Modern UI**:
   - Built with custom CSS variables, glassmorphism, responsive flexbox layout, gradient accents, and hover micro-animations.

---

## 🧠 React Concepts Explained

This application demonstrates core React.js patterns and best practices:

### 1. Functional Components
Each UI section is built using JavaScript functions that return JSX. Components are modular and maintain single responsibility:
- **`App`**: Top-level container managing central state and data persistence.
- **`TodoForm`**: Controlled form component for user input.
- **`TodoList`**: Presentational list wrapper.
- **`TodoItem`**: Individual task row supporting view mode and inline edit mode.
- **`TodoFilter`**: Tab bar and statistics display.

### 2. `useState` Hook
Manages component-level state and reactivity:
- **In `App.jsx`**: Manages `todos` array and `filter` status.
- **In `TodoForm.jsx`**: Controls input value (`text`) and selected `priority`.
- **In `TodoItem.jsx`**: Manages inline edit mode toggle (`isEditing`) and temporary edit buffer (`editText`).

### 3. `useEffect` Hook
Handles side effects independent of direct rendering:
- **`localStorage` Synchronization**: Listens for changes to the `todos` state array and automatically serializes the data to `localStorage`:
  ```javascript
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);
  ```
- **Auto-Focus in Inline Edit**: Sets focus to the text input field when entering inline editing mode using `useEffect` combined with React `useRef`.

### 4. Props & Component Communication
- **Data Down**: Parents pass data to child components (e.g., `App` passes `filteredTodos` down to `TodoList`, which maps over them to pass `todo` to `TodoItem`).
- **Events Up**: Children notify parents of user actions via callback functions passed as props (e.g., `onToggleComplete`, `onEditTodo`, `onDeleteTodo`, `onAddTodo`).

### 5. Array Methods & Immutability
State is never mutated directly. JavaScript array methods are used to produce new state arrays:
- `map()`: For toggling completion status and updating edited text.
- `filter()`: For deleting tasks, filtering active/completed tasks, and clearing finished tasks.
- Spread operator `[newTodo, ...todos]`: For inserting new tasks at the top of the list.

### 6. Conditional Rendering
- Switches between normal task display mode and inline input field based on `isEditing` state.
- Renders customized empty states based on the active filter tab (`all`, `active`, `completed`).
- Dynamically shows/hides the progress bar and "Clear Completed" button.

---

## 🛠️ Tech Stack & Dependencies

- **React 18**: Frontend UI library
- **Vite**: Lightning-fast build tool & dev server
- **Lucide React**: Clean SVG icons
- **CSS3**: Custom variables, Glassmorphism, and responsive layout
