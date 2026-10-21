(function () {
  const STORAGE_KEY = 'todo-app-v4';

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

  function generateId() {
    return 't_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
  }

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(t => t && typeof t.id === 'string' && typeof t.title === 'string' && typeof t.done === 'boolean') : [];
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
      li.className = 'js-task-item flex items-center justify-between gap-task-gap p-task-pad border border-border bg-card rounded-btn transition-all';
      if (t.done) li.classList.add('opacity-60');
      li.setAttribute('data-id', t.id);

      const leftContainer = document.createElement('div');
      leftContainer.className = 'flex items-center gap-2 flex-1 min-w-0';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = t.done;
      cb.id = `cb-${t.id}`;
      cb.className = 'w-4 h-4 rounded border-border bg-bg text-done accent-done cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
      cb.setAttribute('aria-labelledby', `cb-${t.id} title-${t.id}`);
      cb.addEventListener('change', () => toggleTask(t.id, cb.checked));

      const titleSpan = document.createElement('span');
      titleSpan.id = `title-${t.id}`;
      titleSpan.className = 'text-task-item text-text break-all select-none';
      if (t.done) {
        titleSpan.className += ' line-through text-muted';
        titleSpan.innerHTML = `<span class="sr-only">(выполнено) </span>${t.title}`;
      } else {
        titleSpan.textContent = t.title;
      }

      leftContainer.appendChild(cb);
      leftContainer.appendChild(titleSpan);

      const rightContainer = document.createElement('div');
      rightContainer.className = 'flex items-center gap-modal-field-gap shrink-0';

      const baseBtnClass = 'w-icon-btn h-icon-btn inline-flex items-center justify-center border border-border bg-card text-text rounded-icon-btn cursor-pointer transition-all hover:brightness-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = `${baseBtnClass}`;
      editBtn.innerHTML = '<span aria-hidden="true">&#9998;</span>';
      editBtn.setAttribute('aria-label', `Редактировать задачу: ${t.title}`);
      editBtn.addEventListener('click', () => openEditModal(t.id));

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = `${baseBtnClass}`;
      delBtn.innerHTML = '<span aria-hidden="true">&#128465;</span>';
      delBtn.setAttribute('aria-label', `Удалить задачу: ${t.title}`);
      delBtn.addEventListener('click', () => deleteTask(t.id));

      rightContainer.appendChild(editBtn);
      rightContainer.appendChild(delBtn);

      li.appendChild(leftContainer);
      li.appendChild(rightContainer);
      taskListEl.appendChild(li);
    });
  }

  function addTask(title) {
    if (!title.trim()) return;
    tasks.push({ id: generateId(), title: title.trim(), done: false });
    tasks.sort((a, b) => Number(a.done) - Number(b.done));
    saveTasks();
    renderTasks();
  }

  function editTask(id, newTitle) {
    const idx = tasks.findIndex(t => t.id === id);
    if (idx >= 0 && newTitle.trim()) {
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
      
      const remaining = taskListEl.querySelectorAll('.js-task-item');
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
    modal.showModal();
    setTimeout(() => modalInput.focus(), 0);
  }

  function closeModal() {
    modal.close();
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
  addBtn.addEventListener('click', openAddModal);

  function init() {
    tasks = loadTasks();
    renderTasks();
  }
  init();
})();