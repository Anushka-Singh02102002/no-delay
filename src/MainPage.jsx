import React, { useState, useEffect } from "react";

function MainPage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [delays, setDelays] = useState(0);
  const [streak, setStreak] = useState(1);
  const [lastReason, setLastReason] = useState("");
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [timers, setTimers] = useState({});
  const [activeTimer, setActiveTimer] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // Load data from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    const savedDelays = localStorage.getItem("delays");
    const savedStreak = localStorage.getItem("streak");
    const savedReason = localStorage.getItem("lastReason");

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedDelays) setDelays(parseInt(savedDelays));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedReason) setLastReason(savedReason);
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask,
        completed: false,
        running: false
      };
      setTasks([...tasks, task]);
      setNewTask("");
    }
  };

  const startTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, running: true } : { ...t, running: false }
      ));
      setActiveTimer(taskId);
      setTimers({ ...timers, [taskId]: 25 * 60 }); // 25 minutes
    }
  };

  const completeTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: true, running: false } : task
    ));
    if (activeTimer === taskId) setActiveTimer(null);
    
    // Increment streak
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem("streak", newStreak);
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    if (activeTimer === taskId) setActiveTimer(null);
  };

  const handleDelay = (taskId) => {
    setCurrentTaskId(taskId);
    setShowReasonModal(true);
  };

  const submitReason = (reason) => {
    setLastReason(reason);
    localStorage.setItem("lastReason", reason);
    
    const newDelays = delays + 1;
    setDelays(newDelays);
    localStorage.setItem("delays", newDelays);
    
    setShowReasonModal(false);
    setCurrentTaskId(null);
  };

  const resetAllData = () => {
    if (window.confirm("Are you sure you want to reset all data?")) {
      setTasks([]);
      setDelays(0);
      setStreak(1);
      setLastReason("");
      localStorage.removeItem("tasks");
      localStorage.removeItem("delays");
      localStorage.removeItem("streak");
      localStorage.removeItem("lastReason");
    }
  };

  // Timer countdown
  useEffect(() => {
    let interval;
    if (activeTimer && timers[activeTimer] > 0) {
      interval = setInterval(() => {
        setTimers(prev => ({
          ...prev,
          [activeTimer]: prev[activeTimer] - 1
        }));
      }, 1000);
    } else if (activeTimer && timers[activeTimer] === 0) {
      alert("Time's up! Great work! 🎉");
      completeTask(activeTimer);
    }
    return () => clearInterval(interval);
  }, [activeTimer, timers]);

  const formatTime = (seconds) => {
    if (!seconds) return "25:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>🚀 No Delay</h1>
          <p style={styles.subtitle}>Beat procrastination, {user?.name}!</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{totalTasks}/{totalTasks}</div>
          <div style={styles.statLabel}>TASKS</div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statNumber, color: '#00ff88'}}>{completedTasks}</div>
          <div style={styles.statLabel}>COMPLETED</div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statNumber, color: '#ff6b6b'}}>{delays}</div>
          <div style={styles.statLabel}>DELAYS</div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statNumber, color: '#ff6b35'}}>{streak}🔥</div>
          <div style={styles.statLabel}>STREAK</div>
        </div>
      </div>

      {/* Last Reason */}
      {lastReason && (
        <div style={styles.reasonCard}>
          <strong>Last Reason:</strong> {lastReason}
        </div>
      )}

      {/* Add Task */}
      <div style={styles.addTaskContainer}>
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          style={styles.taskInput}
        />
        <button onClick={addTask} style={styles.addBtn}>
          + Add Task
        </button>
      </div>

      {/* Task List */}
      <div style={styles.taskList}>
        {tasks.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No tasks yet. Start by adding one! 💪</p>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} style={{
              ...styles.taskCard,
              opacity: task.completed ? 0.5 : 1,
              borderLeft: task.running ? '4px solid #a855f7' : '4px solid #333'
            }}>
              <div style={styles.taskLeft}>
                <div style={styles.taskText}>
                  {task.text}
                  {task.running && (
                    <span style={styles.timerBadge}>
                      ⏱️ {formatTime(timers[task.id])}
                    </span>
                  )}
                </div>
              </div>
              <div style={styles.taskActions}>
                {!task.completed && !task.running && (
                  <button 
                    onClick={() => startTask(task.id)} 
                    style={styles.startBtn}
                  >
                    ▶ Start Now
                  </button>
                )}
                {task.running && (
                  <button 
                    onClick={() => handleDelay(task.id)} 
                    style={styles.delayBtn}
                  >
                    ⏸️ Delay
                  </button>
                )}
                <button 
                  onClick={() => completeTask(task.id)} 
                  style={styles.completeBtn}
                  disabled={task.completed}
                >
                  ✓
                </button>
                <button 
                  onClick={() => deleteTask(task.id)} 
                  style={styles.deleteBtn}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reset Button */}
      <div style={styles.resetContainer}>
        <button onClick={resetAllData} style={styles.resetBtn}>
          🗑️ Reset All Data
        </button>
      </div>

      {/* Reason Modal */}
      {showReasonModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Why are you delaying?</h2>
            <p style={styles.modalSubtitle}>Be honest with yourself 💭</p>
            <div style={styles.reasonButtons}>
              {[
                "Feeling Bored",
                "Too Difficult",
                "Not in the Mood",
                "Distracted",
                "Overwhelmed",
                "Tired"
              ].map(reason => (
                <button
                  key={reason}
                  onClick={() => submitReason(reason)}
                  style={styles.reasonBtn}
                >
                  {reason}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowReasonModal(false)} 
              style={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#fff",
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  headerLeft: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "bold",
  },
  subtitle: {
    margin: "5px 0 0 0",
    color: "#888",
    fontSize: "14px",
  },
  logoutBtn: {
    padding: "10px 20px",
    background: "#ff4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "30px",
  },
  statCard: {
    background: "#1a1a1a",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid #333",
  },
  statNumber: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#a855f7",
    marginBottom: "5px",
  },
  statLabel: {
    fontSize: "12px",
    color: "#888",
    letterSpacing: "1px",
  },
  reasonCard: {
    background: "#1a1a1a",
    padding: "15px 20px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #333",
    color: "#aaa",
  },
  addTaskContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
  },
  taskInput: {
    flex: 1,
    padding: "15px",
    background: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "16px",
  },
  addBtn: {
    padding: "15px 30px",
    background: "#a855f7",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  },
  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  taskCard: {
    background: "#1a1a1a",
    padding: "20px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #333",
  },
  taskLeft: {
    flex: 1,
  },
  taskText: {
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  timerBadge: {
    background: "#a855f7",
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  taskActions: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  startBtn: {
    padding: "10px 20px",
    background: "#a855f7",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  delayBtn: {
    padding: "10px 20px",
    background: "#ff6b35",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  completeBtn: {
    padding: "10px 15px",
    background: "#00ff88",
    color: "#000",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
  },
  deleteBtn: {
    padding: "10px 15px",
    background: "#ff4444",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "18px",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#666",
    fontSize: "18px",
  },
  resetContainer: {
    marginTop: "40px",
    textAlign: "center",
  },
  resetBtn: {
    padding: "12px 24px",
    background: "#333",
    color: "#fff",
    border: "1px solid #555",
    borderRadius: "8px",
    cursor: "pointer",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    background: "#1a1a1a",
    padding: "40px",
    borderRadius: "16px",
    maxWidth: "500px",
    border: "1px solid #333",
  },
  modalTitle: {
    margin: "0 0 10px 0",
    fontSize: "24px",
  },
  modalSubtitle: {
    margin: "0 0 30px 0",
    color: "#888",
  },
  reasonButtons: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "20px",
  },
  reasonBtn: {
    padding: "15px",
    background: "#2a2a2a",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s",
  },
  cancelBtn: {
    width: "100%",
    padding: "12px",
    background: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default MainPage;