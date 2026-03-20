// In-memory overrides store
let overrides = [];
let nextId = 1;

let currentMode = "block";
let filterQuery = "";
let filterView = "all"; // all | block | override
let editingId = null;

const tableBody = document.getElementById("table-body");
const emptyState = document.getElementById("empty-state");
const toolbarCount = document.getElementById("toolbar-count");
const metaStatus = document.getElementById("meta-status");

const btnNewOverride = document.getElementById("btn-new-override");
const btnRefresh = document.getElementById("btn-refresh");
const emptyAddBtn = document.getElementById("empty-add-btn");
const searchInput = document.getElementById("search-input");

const toolbarButtons = document.querySelectorAll(".toolbar-btn");

const modalBackdrop = document.getElementById("modal-backdrop");
const modalClose = document.getElementById("modal-close");
const btnCancel = document.getElementById("btn-cancel");
const btnSave = document.getElementById("btn-save");
const modalTitle = document.getElementById("modal-title");

const fieldDomain = document.getElementById("field-domain");
const fieldTarget = document.getElementById("field-target");
const fieldTargetWrapper = document.getElementById("field-target-wrapper");
const fieldScope = document.getElementById("field-scope");
const fieldType = document.getElementById("field-type");
const fieldLabel = document.getElementById("field-label");
const modeGroup = document.getElementById("mode-group");

function applyFilters(list) {
  const q = filterQuery.trim().toLowerCase();
  return list.filter((o) => {
    if (filterView === "block" && o.mode !== "block") return false;
    if (filterView === "override" && o.mode !== "override") return false;
    if (q && !o.domain.toLowerCase().includes(q)) return false;
    return true;
  });
}

function renderTable() {
  const data = applyFilters(overrides);
  tableBody.innerHTML = "";

  toolbarCount.textContent = String(overrides.length);

  if (overrides.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = data.length === 0 ? "block" : "none";
  }

  data.forEach((o) => {
    const tr = document.createElement("tr");

    const tdDomain = document.createElement("td");
    tdDomain.className = "row-domain";
    tdDomain.textContent = o.domain;

    const tdType = document.createElement("td");
    tdType.textContent = o.type;

    const tdTarget = document.createElement("td");
    tdTarget.className = "row-target";
    tdTarget.textContent = o.mode === "block" ? "0.0.0.0" : o.target;

    const tdMode = document.createElement("td");
    const badge = document.createElement("span");
    badge.className =
      "badge " + (o.mode === "block" ? "badge--block" : "badge--override");
    badge.textContent = o.mode === "block" ? "Blocked" : "Override";
    tdMode.appendChild(badge);

    const tdActions = document.createElement("td");
    tdActions.className = "col-actions";

    const btnEdit = document.createElement("button");
    btnEdit.className = "action-btn";
    btnEdit.textContent = "Edit";
    btnEdit.addEventListener("click", () => openModal(o.id));

    const btnDelete = document.createElement("button");
    btnDelete.className = "action-btn action-btn--danger";
    btnDelete.textContent = "Delete";
    btnDelete.addEventListener("click", () => {
      overrides = overrides.filter((x) => x.id !== o.id);
      renderTable();
    });

    tdActions.appendChild(btnEdit);
    tdActions.appendChild(btnDelete);

    tr.appendChild(tdDomain);
    tr.appendChild(tdType);
    tr.appendChild(tdTarget);
    tr.appendChild(tdMode);
    tr.appendChild(tdActions);

    tableBody.appendChild(tr);
  });
}

function setMode(newMode) {
  currentMode = newMode;
  const pills = modeGroup.querySelectorAll(".pill");
  pills.forEach((pill) => {
    pill.classList.toggle("pill-active", pill.dataset.mode === currentMode);
  });
  fieldTargetWrapper.style.display = currentMode === "override" ? "flex" : "none";
}

function openModal(id = null) {
  editingId = id;
  modalBackdrop.classList.add("visible");

  if (id == null) {
    modalTitle.textContent = "New override";
    fieldDomain.value = "";
    fieldTarget.value = "";
    fieldScope.value = "exact";
    fieldType.value = "A";
    fieldLabel.value = "";
    setMode("block");
  } else {
    modalTitle.textContent = "Edit override";
    const o = overrides.find((x) => x.id === id);
    if (!o) return;
    fieldDomain.value = o.domain;
    fieldTarget.value = o.target;
    fieldScope.value = o.scope;
    fieldType.value = o.type;
    fieldLabel.value = o.label || "";
    setMode(o.mode);
  }

  setTimeout(() => fieldDomain.focus(), 20);
}

function closeModal() {
  modalBackdrop.classList.remove("visible");
  editingId = null;
}

function handleSave() {
  const domain = fieldDomain.value.trim();
  let target = fieldTarget.value.trim();
  const scope = fieldScope.value;
  const type = fieldType.value;
  const label = fieldLabel.value.trim();

  if (!domain) {
    alert("Domain is required.");
    return;
  }

  if (currentMode === "override" && !target) {
    alert("Target IP is required for override mode.");
    return;
  }

  if (currentMode === "block") {
    target = "0.0.0.0";
  }

  if (editingId == null) {
    overrides.unshift({
      id: nextId++,
      domain,
      type,
      target,
      mode: currentMode,
      scope,
      label,
    });
  } else {
    const idx = overrides.findIndex((x) => x.id === editingId);
    if (idx !== -1) {
      overrides[idx] = {
        ...overrides[idx],
        domain,
        type,
        target,
        mode: currentMode,
        scope,
        label,
      };
    }
  }

  closeModal();
  renderTable();
}

btnNewOverride.addEventListener("click", () => openModal());
emptyAddBtn.addEventListener("click", () => openModal());
btnCancel.addEventListener("click", closeModal);
modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) closeModal();
});

modeGroup.addEventListener("click", (e) => {
  const btn = e.target.closest(".pill");
  if (!btn) return;
  setMode(btn.dataset.mode);
});

searchInput.addEventListener("input", (e) => {
  filterQuery = e.target.value;
  renderTable();
});

toolbarButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    toolbarButtons.forEach((b) => b.classList.remove("toolbar-btn-active"));
    btn.classList.add("toolbar-btn-active");
    filterView = btn.dataset.view;
    renderTable();
  });
});

btnSave.addEventListener("click", handleSave);

btnRefresh.addEventListener("click", () => {
  metaStatus.textContent = "synced";
  setTimeout(() => {
    metaStatus.textContent = "idle";
  }, 1500);
});

setMode("block");
renderTable();
