import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTask, setActiveTask] = useState(null);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [showDelay, setShowDelay] = useState(false);
  const [delayCount, setDelayCount] = useState(() => {
    const saved = localStorage.getItem('delayCount');
    return saved ? parseInt(saved) : 0;
  });
  const [delayReason, setDelayReason] = useState(() => {
    const saved = localStorage.getItem('delayReason');
    return saved ? saved : '';
  });
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('streak');
    return saved ? parseInt(saved) : 0;
  });
  const [lastActive, setLastActive] = useState(() => {
    return localStorage.getItem('lastActive') || '';
  });
  const [completedCount, setCompletedCount] = useState(() => {
    const saved = localStorage.getItem('completedCount');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('delayCount', delayCount);
  }, [delayCount]);

  useEffect(() => {
    localStorage.setItem('delayReason', delayReason);
  }, [delayReason]);

  useEffect(() => {
    localStorage.setItem('completedCount', completedCount);
  }, [completedCount]);

  useEffect(() => {
    const today = new Date().toDateString();
    const yesterday = new Date(
      Date.now() - 86400000
    ).toDateString();
    if (lastActive === today) return;
    if (lastActive === yesterday) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('streak', newStreak);
    } else {
      setStreak(1);
      localStorage.setItem('streak', 1);
    }
    setLastActive(today);
    localStorage.setItem('lastActive', today);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!activeTask) return;
    if (timeLeft === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTask, timeLeft]);

  function addTask() {
    if (task === '') return;
    if (tasks.length >= 3) return;
    setTasks([...tasks, task]);
    setTask('');
  }

  function completeTask(index) {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    setCompletedCount(completedCount + 1);
  }

  function deleteTask(index) {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  }

  function startTask(t) {
    setActiveTask(t);
    setTimeLeft(25 * 60);
    setShowDelay(false);
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function getMotivationalMessage() {
    if (delayCount === 0) {
      return { emoji: '🔥', message: "Zero delays! You are built different!", color: 'green' };
    } else if (delayCount <= 2) {
      return { emoji: '⚠️', message: "Your future self is watching. Don't disappoint them.", color: 'orange' };
    } else if (delayCount <= 4) {
      return { emoji: '😤', message: "Every delay is a vote for the person you DON'T want to be.", color: '#ef4444' };
    } else {
      return { emoji: '💀', message: "5+ delays. Your dreams don't care about your excuses.", color: '#dc2626' };
    }
  }

  function handleStop() { setShowDelay(true); }

  function handleDelayReason(reason) {
    setDelayReason(reason);
    setDelayCount(delayCount + 1);
    setActiveTask(null);
    setShowDelay(false);
  }

  function goBack() { setShowDelay(false); }

  function resetAll() {
    localStorage.clear();
    setTasks([]);
    setDelayCount(0);
    setDelayReason('');
    setActiveTask(null);
    setStreak(0);
    setLastActive('');
    setCompletedCount(0);
  }

  const delayReasons = [
    { emoji: '📱', label: 'Got Distracted', message: 'Your brain found an easier dopamine source' },
    { emoji: '😰', label: 'Too Difficult', message: 'Your brain avoids hard things — push anyway' },
    { emoji: '😴', label: 'Feeling Bored', message: 'Boredom means your brain is resisting deep work' },
    { emoji: '🤯', label: 'Lost Motivation', message: 'Motivation follows action — not the other way around' },
  ];

  if (showDelay) {
    return (
      <div className="app">
        <div className="delay-screen">
          <h1>🧠 Your brain is tricking you!</h1>
          <p className="task-name">{activeTask}</p>
          <p className="subtitle">Your brain WANTS to quit — don't let it win!</p>
          <button className="btn-continue" onClick={goBack}>
            💪 No! I'll Keep Going!
          </button>
          <hr className="divider" />
          <h3 style={{ color: '#888', marginBottom: '16px' }}>
            Still want to quit? Tell me why:
          </h3>
          <div className="delay-reasons">
            {delayReasons.map((r, index) => (
              <div className="reason-item" key={index}
                onClick={() => handleDelayReason(r.label)}>
                <button className="reason-btn">
                  {r.emoji} {r.label}
                </button>
                <p className="reason-msg">{r.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeTask) {
    return (
      <div className="app">
        <div className="focus-mode">
          <h1>🔒 Focus Mode</h1>
          <p className="focus-task">{activeTask}</p>
          <div className="timer">{formatTime(timeLeft)}</div>
          <button className="btn-stop" onClick={handleStop}>
            Stop Task
          </button>
        </div>
      </div>
    );
  }

  const msg = getMotivationalMessage();

  return (
    <div className="app">
      <div className="header">
        <h1>No Delay</h1>
        <p>Delay Ends Here</p>
      </div>

      <div className="motivation" style={{ color: msg.color }}>
        {msg.emoji} {msg.message}
      </div>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter your task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <button className="btn-add" onClick={addTask}>
          + Add
        </button>
      </div>

      <div className="stats">
        <div className="stat-box">
          <div className="number">{tasks.length}/3</div>
          <div className="label">Tasks</div>
        </div>
        <div className="stat-box">
          <div className="number">{completedCount}</div>
          <div className="label">Completed</div>
        </div>
        <div className="stat-box">
          <div className="number">{delayCount}</div>
          <div className="label">Delays</div>
        </div>
        <div className="stat-box">
          <div className="number" style={{ color: '#f59e0b' }}>
            {streak}🔥
          </div>
          <div className="label">Streak</div>
        </div>
      </div>

      {delayReason && (
        <div className="motivation" style={{ color: '#888' }}>
          Last Reason: {delayReason}
        </div>
      )}

      <div className="task-list">
        {tasks.map((t, index) => (
          <div className="task-item" key={index}>
            <span className="task-name">{t}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-start"
                onClick={() => startTask(t)}>
                ▶ Start Now
              </button>
              <button className="btn-done"
                onClick={() => completeTask(index)}>
                ✅
              </button>
              <button className="btn-delete"
                onClick={() => deleteTask(index)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <hr className="divider" />
      <button className="btn-reset" onClick={resetAll}>
        🗑️ Reset All Data
      </button>
    </div>
  );
}

export default App;