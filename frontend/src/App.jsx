
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Backend se tasks load karna
  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        return response.json();
      })
      .then((data) => setTasks(data))
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  // Naya task backend mein save karna
  async function addTask(event) {
    event.preventDefault();

    if (!title.trim()) return;

    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add task");
      }

      setTasks((currentTasks) => [...currentTasks, data.task]);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Task add nahi hua. Backend server check karo.");
    }
  }

  // Task ka status backend mein update karna
  async function toggleTask(id) {
    const task = tasks.find((item) => item.id === id);

    if (!task) return;

    const updatedCompleted = !task.completed;

    // UI ko turant update karna
    setTasks((currentTasks) =>
      currentTasks.map((item) =>
        item.id === id
          ? { ...item, completed: updatedCompleted }
          : item
      )
    );

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completed: updatedCompleted,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update task");
      }

      // Backend se mila updated task use karna
      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === id ? data.task : item
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);

      // Update fail hone par purana status restore karna
      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === id
            ? { ...item, completed: task.completed }
            : item
        )
      );

      alert("Task status update nahi hua. Please dobara try karo.");
    }
  }

  // Task backend se delete karna
  async function deleteTask(id) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete task");
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
      );
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Task delete nahi hua. Please dobara try karo.");
    }
  }

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  return (
    <main className="app">
      <header className="app-header">
        <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
        <h1>Task Manager</h1>
        <p className="subtitle">
          Organize your work. One task at a time.
        </p>
      </header>

      <section className="stats">
        <div className="stat-card">
          <span>Total Tasks</span>
          <strong>{tasks.length}</strong>
        </div>

        <div className="stat-card">
          <span>Completed</span>
          <strong>{completedCount}</strong>
        </div>

        <div className="stat-card">
          <span>Remaining</span>
          <strong>{tasks.length - completedCount}</strong>
        </div>
      </section>

      <section className="panel">
        <h2>Add a New Task</h2>

        <form onSubmit={addTask} className="task-form">
          <label htmlFor="task-title">Task title</label>
          <input
            id="task-title"
            type="text"
            placeholder="What do you need to do?"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            placeholder="Add some details (optional)"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows="3"
          />

          <button type="submit" className="add-button">
            + Add Task
          </button>
        </form>
      </section>

      <section className="tasks-section">
        <div className="section-heading">
          <h2>Your Tasks</h2>
          <span>{tasks.length} tasks</span>
        </div>

        {tasks.length === 0 ? (
          <p className="empty-state">
            No tasks yet. Add your first task above!
          </p>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <article
                className={`task-card ${task.completed ? "completed" : ""}`}
                key={task.id}
              >
                <input
                  className="task-checkbox"
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  aria-label={`Mark ${task.title} as ${
                    task.completed ? "incomplete" : "complete"
                  }`}
                />

                <div className="task-content">
                  <h3>{task.title}</h3>

                  {task.description && <p>{task.description}</p>}

                  <span className="task-status">
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                </div>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete ${task.title}`}
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
