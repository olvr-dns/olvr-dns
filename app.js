const overrides = [
  {
    id: 1,
    domain: "example.com",
    type: "A",
    target: "192.168.50.199",
    mode: "override",
    notes: "Demo override",
  },
  {
    id: 2,
    domain: "badsite.com",
    type: "A",
    target: "0.0.0.0",
    mode: "block",
    notes: "Demo blocked domain",
  },
];

let nextId = 3;
let currentMode = "block";
let filterQuery = "";

const tableBody = document.getElementById("table-body");
const emptyState = document.getElementById("empty-state");
const statOverrides = document.getElementById("stat-overrides");
const statBlocked = document.getElementById("stat-blocked");
const statSync = document.getElementById("stat-sync");

const btnNewOverride = document.getElementById("btn-new-override");
const btnRefresh = document.getElementById("btn-refresh");
const searchInput = document.getElementById("search-input");

const modalBackdrop = document.getElementById("modal-backdrop");
const modalClose = document.getElementById("modal-close");
const btnCancel = document.getElementById("btn-cancel");
const btnSave = document.getElementById("btn-save");

const fieldDomain = document.getElementById("field-domain");
const fieldTarget = document.getElementById("field-target");
const fieldTargetWrapper = document.getElementById("field-target-wrapper");
const fieldNotes = document.getElementById("field-notes");
const modeGroup = document.getElementById("mode-group");

function renderStats() {
  const total = overrides.length;
  const blocked = overrides.filter((o) => o.mode === "block").length;
  statOverrides.textContent = String(total);
  statBlocked.textContent = String(blocked);
  statSync.textContent = new Date().toLocaleTimeString();
}

function renderTable() {
  const q = filterQuery.trim().toLowerCase();
  const data = overrides.filter((o) =>
    o.domain.toLowerCase().includes(q)
  );

  tableBody.innerHTML = "";

  if (data.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
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
    tdTarget.textContent = o.target;

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

    const btnDelete = document.createElement("button");
    btnDelete.className = "action-btn action-btn--danger";
    btnDelete.textContent = "Delete";
    btnDelete.addEventListener("click", () => {
      const idx = overrides.findIndex((x) => x.id === o.id);
      if (idx !== -1) overrides.splice(idx, 1);
      renderTable();
      renderStats();
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

function openModal() {
  modalBackdrop.classList.add("visible");
  fieldDomain.value = "";
  fieldTarget.value = "";
  fieldNotes.value = "";
  currentMode = "block";
  updateModeUI();
  fieldTargetWrapper.style.display = currentMode === "override" ? "flex" : "none";
  setTimeout(() => fieldDomain.focus(), 50);
}

function closeModal() {
  modalBackdrop.classList.remove("visible");
}

function updateModeUI() {
  const pills = modeGroup.querySelectorAll(".pill");
  pills.forEach((pill) => {
    if (pill.dataset.mode === currentMode) {
      pill.classList.add("pill-active");
    } else {
      pill.classList.remove("pill-active");
    }
  });
}

btnNewOverride.addEventListener("click", openModal);
btnCancel.addEventListener("click", closeModal);
modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) closeModal();
});

modeGroup.addEventListener("click", (e) => {
  const btn = e.target.closest(".pill");
  if (!btn) return;
  currentMode = btn.dataset.mode;
  updateModeUI();
  fieldTargetWrapper.style.display = currentMode === "override" ? "flex" : "none";
});

btnSave.addEventListener("click", () => {
  const domain = fieldDomain.value.trim();
  let target = fieldTarget.value.trim();

  if (!domain) {
    alert("Domain is required");
    return;
  }

  if (currentMode === "block") {
    target = "0.0.0.0";
  } else if (!target) {
    alert("Target IP is required in override mode");
    return;
  }

  overrides.unshift({
    id: nextId++,
    domain,
    type: "A",
    target,
    mode: currentMode,
    notes: fieldNotes.value.trim(),
  });

  renderTable();
  renderStats();
  closeModal();
});

searchInput.addEventListener("input", (e) => {
  filterQuery = e.target.value;
  renderTable();
});

btnRefresh.addEventListener("click", () => {
  statSync.textContent = new Date().toLocaleTimeString();
});

renderTable();
renderStats();
