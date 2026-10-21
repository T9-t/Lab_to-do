(function () {
  const STORAGE_KEY = 'todo-app-v1';
  const THEME_KEY = 'todo-theme';

  const themeToggleBtn = document.querySelector('.js-theme-toggle');
  const searchInput = document.querySelector('.js-search-input');
  const addBtn = document.querySelector('.js-open-modal');
  
  const modal = document.querySelector('.js-todo-modal');
  const modalTitle = document.querySelector('.js-modal-title');
  const modalForm = document.querySelector('.js-modal-form');
  const modalInput = document.getElementById('modal-title-input');
  const modalCancel = document.querySelector('.js-modal-cancel');

  const taskListEl = document.querySelector('.js-task-list');

  let tasks = [];
  let editingId = null;
  let lastFocusedBeforeModal = null;

  function generateId() {
    return 't_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
  }

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(t => t &&
        typeof t.id === 'string' &&
        typeof t.title === 'string' &&
        typeof t.done === 'boolean');
    } catch {
      return [];
    }
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function renderTasks() {
    const query = (searchInput.value || '').toLowerCase().trim();
    taskListEl.innerHTML = '';
    const toRender = tasks.filter(t => t.title.toLowerCase().includes(query));
    
    toRender.forEach((t) => {
      const li = document.createElement('li');
      li.classList.add('task-item');
      if (t.done) {
        li.classList.add('task-item_done');
      }
      li.setAttribute('data-id', t.id);

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = t.done;
      cb.id = `cb-${t.id}`;
      cb.className = 'task-item__checkbox js-task-done';
      cb.setAttribute('aria-labelledby', `cb-${t.id} title-${t.id}`);
      cb.addEventListener('change', () => toggleTask(t.id, cb.checked));

      const titleSpan = document.createElement('span');
      titleSpan.id = `title-${t.id}`;
      titleSpan.className = 'task-item__title';
      
      if (t.done) {
        titleSpan.innerHTML = `<span class="visually-hidden">(выполнено) </span>${t.title}`;
      } else {
        titleSpan.textContent = t.title;
      }

      const editBtn = document.createElement('button');
      editBtn.className = 'btn icon-btn task-item__btn js-edit';
      editBtn.innerHTML = '<span aria-hidden="true">&#9998;</span>';
      editBtn.setAttribute('aria-label', `Редактировать задачу: ${t.title}`);
      editBtn.setAttribute('data-id', t.id);
      editBtn.addEventListener('click', () => openEditModal(t.id));

      const delBtn = document.createElement('button');
      delBtn.className = 'btn icon-btn js-delete';
      delBtn.innerHTML = '<span aria-hidden="true">&#128465;</span>';
      delBtn.setAttribute('aria-label', `Удалить задачу: ${t.title}`);
      delBtn.setAttribute('data-id', t.id);
      delBtn.addEventListener('click', () => deleteTask(t.id));

      li.appendChild(cb);
      li.appendChild(titleSpan);
      li.appendChild(editBtn);
      li.appendChild(delBtn);

      taskListEl.appendChild(li);
    });
  }

  function addTask(title) {
    const t = { id: generateId(), title: title.trim(), done: false };
    if (!t.title) return;
    
    tasks.push(t);
    tasks.sort((a, b) => Number(a.done) - Number(b.done));
    
    saveTasks();
    renderTasks();
  }

  function editTask(id, newTitle) {
    const idx = tasks.findIndex(t => t.id === id);
    
    if (idx >= 0) {
      tasks[idx].title = newTitle.trim();
      saveTasks();
      renderTasks();
    }
  }

  function deleteTask(id) {
    const idx = tasks.findIndex(t => t.id === id);

    if (idx >= 0) {
      tasks.splice(idx, 1);
      saveTasks();
      renderTasks();
      const remaining = taskListEl.querySelectorAll('.task-item');

      if (remaining.length > 0) {
        const nextItem = remaining[Math.min(idx, remaining.length - 1)];
        const cb = nextItem.querySelector('input[type="checkbox"]');
        
        if (cb) cb.focus();
      } else {
        addBtn.focus();
      }
    }
  }

  function toggleTask(id, done) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;

    t.done = !!done;
    tasks.sort((a, b) => Number(a.done) - Number(b.done));

    saveTasks();
    renderTasks();
  }

  searchInput.addEventListener('input', () => renderTasks());

  function openAddModal() {
    editingId = null;
    modalTitle.textContent = 'Добавить задачу';
    modalInput.value = '';

    showModal();
  }

  function openEditModal(id) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;

    editingId = id;
    modalTitle.textContent = 'Редактировать задачу';
    modalInput.value = t.title;
    showModal();
  }

  function showModal() {
    lastFocusedBeforeModal = document.activeElement;

    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');

    setTimeout(() => modalInput.focus(), 0);
  }

  function closeModal() {
    if (typeof modal.close === 'function') modal.close();
    else modal.removeAttribute('open');

    if (lastFocusedBeforeModal) lastFocusedBeforeModal.focus();
  }

  modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = modalInput.value.trim();

    if (!title) return;
    if (editingId) editTask(editingId, title);
    else addTask(title);

    closeModal();
  });

  modalCancel.addEventListener('click', closeModal);

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
    }
  });

  (function trapFocus() {
    const focusablesSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusables = modal.querySelectorAll(focusablesSelector);
      
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();

      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    });
  })();

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
  }

  function initTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(currentTheme);
  }

  themeToggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });

  addBtn.addEventListener('click', openAddModal);

  addBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openAddModal();
    }
  });

  function init() {
    tasks = loadTasks();
    renderTasks();
    initTheme();
  }
  init();
})();