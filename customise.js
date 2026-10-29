
// ========================================
// ONE QUESTION A DAY
// JOURNAL CUSTOMISER
// ========================================

const STORAGE_KEY = "oneQuestionJournalDesign";

const $ = id => document.getElementById(id);

const MONTH_NAMES = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

const PAPER_NAMES = {
  squared: "Squared · 5 mm",
  dotted: "Dotted",
  lined: "Lined",
  blank: "Blank"
};

const MATERIAL_NAMES = {
  linen: "Linen",
  leather: "Faux leather",
  paper: "Textured paper"
};

// Provisional page limits for the prototype.
// Confirm these with the printer before selling.
const PAGE_LIMITS = {
  1: 100,
  3: 180,
  6: 320
};

// Each optional section has:
// name: label shown to customer
// pages: pages per occurrence
// frequency: opening, monthly, weekly, book, closing

const OPTIONAL_SECTIONS = {
  ownership: {
    name: "This Journal Belongs To",
    pages: 2,
    frequency: "opening"
  },
  future: {
    name: "Letter to Future Self",
    pages: 2,
    frequency: "opening"
  },
  vision: {
    name: "Vision Board",
    pages: 2,
    frequency: "opening"
  },
  bucket: {
    name: "Bucket List",
    pages: 2,
    frequency: "opening"
  },

  mood: {
    name: "Mood Tracker",
    pages: 2,
    frequency: "monthly"
  },
  sleep: {
    name: "Sleep Tracker",
    pages: 2,
    frequency: "monthly"
  },
  gratitude: {
    name: "Gratitude Pages",
    pages: 2,
    frequency: "monthly"
  },
  highlights: {
    name: "Monthly Highlights",
    pages: 2,
    frequency: "monthly"
  },
  fitness: {
    name: "Fitness Tracker",
    pages: 2,
    frequency: "monthly"
  },
  challenge: {
    name: "30-Day Challenge",
    pages: 2,
    frequency: "monthly"
  },
  scrapbook: {
    name: "Memory Scrapbook",
    pages: 4,
    frequency: "monthly"
  },

  weekly: {
    name: "Weekly Planner",
    pages: 2,
    frequency: "weekly"
  },
  weeklygoals: {
    name: "Weekly Goals",
    pages: 2,
    frequency: "weekly"
  },
  weeklyreflection: {
    name: "Weekly Reflection",
    pages: 2,
    frequency: "weekly"
  },

  reading: {
    name: "Reading Log",
    pages: 4,
    frequency: "book"
  },
  creative: {
    name: "Creative Ideas",
    pages: 4,
    frequency: "book"
  },

  achievements: {
    name: "Biggest Achievements",
    pages: 2,
    frequency: "closing"
  },
  lessons: {
    name: "Lessons I've Learned",
    pages: 2,
    frequency: "closing"
  },
  next: {
    name: "What's Next?",
    pages: 2,
    frequency: "closing"
  }
};

let habitNames = Array(10).fill("");

// ========================================
// GET DESIGN
// ========================================

function getDesign() {
  const duration = Number(
    document.querySelector(
      'input[name="duration"]:checked'
    ).value
  );

  const cover = document.querySelector(
    'input[name="cover"]:checked'
  ).value;

  return {
    duration,
    dated: $("dated-journal").checked,
    startMonth: $("start-month").value,

    cover,
    material: $("cover-material").value,
    title: $("cover-title").value.trim(),
    showBrand: $("show-brand").checked,
    finish: $("title-finish").value,

    paper: $("paper-type").value,
    writingPages: Number($("writing-pages").value),

    habitCount: Number($("habit-count").value),
    habitNames: habitNames.slice(0, 10),
    habitGraph: $("habit-graph").value,
    habitReflection: $("habit-reflection").checked,

    optionalSections: [
      ...document.querySelectorAll(
        "#optional-sections input:checked"
      )
    ].map(input => input.value)
  };
}

// ========================================
// DATES AND MONTHS
// ========================================

function getMonths(design) {
  const months = [];

  const parts = design.startMonth.split("-");

  const year = Number(parts[0]);
  const month = Number(parts[1]);

  const valid =
    Number.isInteger(year) &&
    Number.isInteger(month) &&
    year >= 1 &&
    year <= 9999 &&
    month >= 1 &&
    month <= 12;

  for (let i = 0; i < design.duration; i++) {
    if (!design.dated || !valid) {
      months.push(`Month ${i + 1}`);
      continue;
    }

    const date = new Date(year, month - 1 + i, 1);

    months.push(
      `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`
    );
  }

  return months;
}

function getDateRange(design) {
  if (!design.dated) return "Undated";

  const months = getMonths(design);

  if (months.length === 1) {
    return months[0];
  }

  return `${months[0]} – ${months[months.length - 1]}`;
}

function updateMonths(design) {
  $("date-settings").hidden = !design.dated;

  const months = getMonths(design);
  const container = $("selected-months");

  container.replaceChildren();

  months.forEach(month => {
    const tag = document.createElement("span");
    tag.className = "month-tag";
    tag.textContent = month;
    container.appendChild(tag);
  });

  $("summary-duration").textContent =
    `${design.duration} ${design.duration === 1 ? "month" : "months"}`;

  $("summary-dates").textContent =
    getDateRange(design);

  const select = $("preview-month");
  const previous = Number(select.value) || 0;

  select.replaceChildren();

  months.forEach((month, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = month;
    select.appendChild(option);
  });

  select.value = String(
    Math.min(previous, months.length - 1)
  );
}

// ========================================
// HABIT NAME INPUTS
// ========================================

function renderHabitInputs() {
  const container = $("habit-names");
  const count = Number($("habit-count").value);

  container.replaceChildren();

  for (let i = 0; i < count; i++) {
    const row = document.createElement("div");
    row.className = "habit-name-row";

    const label = document.createElement("label");
    label.htmlFor = `habit-name-${i}`;
    label.textContent = `Habit ${i + 1}`;

    const input = document.createElement("input");
    input.type = "text";
    input.id = `habit-name-${i}`;
    input.maxLength = 22;
    input.placeholder = "e.g. Reading";
    input.value = habitNames[i];

    input.addEventListener("input", () => {
      habitNames[i] = input.value;
      updateAll();
      showPreview("habits");
    });

    row.append(label, input);
    container.appendChild(row);
  }
}

// ========================================
// PREVIEW TABS
// ========================================

function setTab(tab) {
  $("cover-preview").hidden = tab !== "cover";
  $("inside-preview").hidden = tab !== "inside";

  document.querySelectorAll(".preview-tab").forEach(
    button => {
      const active = button.dataset.tab === tab;

      button.classList.toggle("active", active);
      button.setAttribute(
        "aria-pressed",
        String(active)
      );
    }
  );
}

function showPreview(section) {
  if (section === "cover") {
    setTab("cover");
    return;
  }

  setTab("inside");

  const options = [
    ...$("preview-page").options
  ].map(option => option.value);

  $("preview-page").value = options.includes(section)
    ? section
    : "habits";

  updateInside(getDesign());
}

// ========================================
// COVER
// ========================================

function updateCover(design) {
  $("journal-cover").className =
    `journal-cover ${design.cover} material-${design.material}`;

  $("preview-title").textContent = design.title;
  $("preview-title").className =
    `finish-${design.finish}`;
  $("preview-title").hidden = !design.title;

  $("cover-brand").hidden = !design.showBrand;

  // Dates are previewed on the cover.
  // This is a design choice, not a required
  // manufacturing placement.
  $("cover-dates").textContent =
    design.dated ? getDateRange(design) : "";

  $("summary-cover").textContent =
    design.cover.charAt(0).toUpperCase() +
    design.cover.slice(1);

  $("summary-material").textContent =
    MATERIAL_NAMES[design.material];

  $("summary-title").textContent =
    design.title || "No title";

  $("summary-paper").textContent =
    PAPER_NAMES[design.paper];
}

// ========================================
// INTERIOR PAGE HELPERS
// ========================================

function addLine(container, count = 1) {
  for (let i = 0; i < count; i++) {
    const line = document.createElement("div");
    line.className = "preview-line";
    container.appendChild(line);
  }
}

function addLabel(container, text) {
  const label = document.createElement("p");
  label.className = "preview-label";
  label.textContent = text;
  container.appendChild(label);
}

function addBlankPage(container, lines = 9) {
  addLine(container, lines);
}

// ========================================
// CONNECTED 31-DAY SPREAD
// ========================================

function renderHabitSpread(design) {
  const left = $("habit-spread-left");
  const right = $("habit-spread-right");

  left.replaceChildren();
  right.replaceChildren();

  const months = getMonths(design);
  const monthIndex = Number($("preview-month").value) || 0;
  const monthLabel = months[monthIndex] || months[0];

  $("spread-left-caption").textContent = monthLabel;
  $("spread-right-caption").textContent = monthLabel;

  const graphTypes = [];

  if (
    design.habitGraph === "score" ||
    design.habitGraph === "both"
  ) {
    graphTypes.push("SCORE");
  }

  if (
    design.habitGraph === "mood" ||
    design.habitGraph === "both"
  ) {
    graphTypes.push("MOOD");
  }

  const count = design.habitCount;

  const columns =
    `repeat(${count}, minmax(0, 1fr))` +
    (
      graphTypes.length
        ? ` repeat(${graphTypes.length}, minmax(0, 1.5fr))`
        : ""
    );

  // LEFT: DAY + MEMORABLE MOMENT

  const leftHeader = document.createElement("div");
  leftHeader.className =
    "connected-header memory-header";

  const dayTitle = document.createElement("span");
  dayTitle.textContent = "DAY";

  const momentTitle = document.createElement("span");
  momentTitle.textContent = "MEMORABLE MOMENT";

  leftHeader.append(dayTitle, momentTitle);
  left.appendChild(leftHeader);

  const memoryRows = document.createElement("div");
  memoryRows.className = "connected-rows";

  // RIGHT: HABIT AND GRAPH HEADINGS

  const rightHeader = document.createElement("div");
  rightHeader.className =
    "connected-header tracker-header";
  rightHeader.style.gridTemplateColumns = columns;

  for (let i = 0; i < count; i++) {
    const heading = document.createElement("span");
    heading.className = "tracker-heading";
    heading.textContent =
      design.habitNames[i]?.trim() || `Habit ${i + 1}`;

    rightHeader.appendChild(heading);
  }

  graphTypes.forEach(name => {
    const heading = document.createElement("span");
    heading.className = "tracker-heading";
    heading.textContent = name;
    rightHeader.appendChild(heading);
  });

  right.appendChild(rightHeader);

  const trackerRows = document.createElement("div");
  trackerRows.className = "connected-rows";

  // Determine how many days the selected month has.
  // Undated journals keep all 31 rows.
  let daysInMonth = 31;

  if (design.dated) {
    const parts = design.startMonth.split("-");
    const year = Number(parts[0]);
    const month = Number(parts[1]);

    if (
      Number.isInteger(year) &&
      Number.isInteger(month) &&
      year >= 1 &&
      month >= 1 &&
      month <= 12
    ) {
      daysInMonth = new Date(
        year,
        month + monthIndex,
        0
      ).getDate();
    }
  }

  // Both pages use exactly 31 aligned rows.
  // Days beyond the selected month's length
  // remain empty and lightly shaded.

  for (let day = 1; day <= 31; day++) {
    const validDay = day <= daysInMonth;

    // Left row

    const memoryRow = document.createElement("div");
    memoryRow.className = "connected-row memory-row";

    const dayCell = document.createElement("span");
    dayCell.className = "memory-day";
    dayCell.textContent = validDay ? String(day) : "";

    const writingCell = document.createElement("span");
    writingCell.className = "memory-space";

    if (!validDay) {
      memoryRow.style.opacity = ".3";
      memoryRow.style.background = "#e8e4db";
    }

    memoryRow.append(dayCell, writingCell);
    memoryRows.appendChild(memoryRow);

    // Right row

    const trackerRow = document.createElement("div");
    trackerRow.className = "connected-row tracker-row";
    trackerRow.style.gridTemplateColumns = columns;

    if (!validDay) {
      trackerRow.style.opacity = ".3";
      trackerRow.style.background = "#e8e4db";
    }

    for (let i = 0; i < count; i++) {
      const cell = document.createElement("span");
      cell.className = "tracker-cell";
      trackerRow.appendChild(cell);
    }

    graphTypes.forEach(() => {
      const cell = document.createElement("span");
      cell.className = "tracker-cell graph-cell";
      trackerRow.appendChild(cell);
    });

    trackerRows.appendChild(trackerRow);
  }

  left.appendChild(memoryRows);
  right.appendChild(trackerRows);

  // Optional reflection below the aligned grid

  if (design.habitReflection) {
    const reflection = document.createElement("div");
    reflection.className = "spread-reflection";

    const title = document.createElement("strong");
    title.textContent = "HABIT REFLECTION";

    reflection.appendChild(title);
    addLine(reflection, 3);

    right.appendChild(reflection);
  }
}

// ========================================
// AUTOMATIC PAGE ORGANISATION
// ========================================

function getOrganisedSections(design) {
  const sections = [
    ["starting", "My Starting Point", "opening"],
    ["vision3", "My Overall Vision", "opening"]
  ];

  // Opening optional pages

  Object.entries(OPTIONAL_SECTIONS).forEach(
    ([id, item]) => {
      if (
        design.optionalSections.includes(id) &&
        item.frequency === "opening"
      ) {
        sections.push([id, item.name, "opening"]);
      }
    }
  );

  // Monthly pages are always in a fixed order

  sections.push(
    ["goals", "Monthly Goals", "monthly"],
    ["habits", "A Moment a Day + Habits", "monthly"],
    ["writing", "Free Writing", "monthly"]
  );

  // Weekly extras

  Object.entries(OPTIONAL_SECTIONS).forEach(
    ([id, item]) => {
      if (
        design.optionalSections.includes(id) &&
        item.frequency === "weekly"
      ) {
        sections.push([id, item.name, "weekly"]);
      }
    }
  );

  // Other monthly extras

  Object.entries(OPTIONAL_SECTIONS).forEach(
    ([id, item]) => {
      if (
        design.optionalSections.includes(id) &&
        item.frequency === "monthly"
      ) {
        sections.push([id, item.name, "monthly"]);
      }
    }
  );

  sections.push(
    ["reflection", "Monthly Reflection", "monthly"]
  );

  // Once-per-book extras

  Object.entries(OPTIONAL_SECTIONS).forEach(
    ([id, item]) => {
      if (
        design.optionalSections.includes(id) &&
        item.frequency === "book"
      ) {
        sections.push([id, item.name, "book"]);
      }
    }
  );

  // Closing pages

  sections.push(
    ["final", "My Final Reflection", "closing"],
    ["beforeafter", "Before & After", "closing"]
  );

  Object.entries(OPTIONAL_SECTIONS).forEach(
    ([id, item]) => {
      if (
        design.optionalSections.includes(id) &&
        item.frequency === "closing"
      ) {
        sections.push([id, item.name, "closing"]);
      }
    }
  );

  return sections;
}

// ========================================
// PREVIEW DROPDOWN
// ========================================

function updatePreviewOptions(design) {
  const select = $("preview-page");
  const previous = select.value;

  const sections = getOrganisedSections(design);

  select.replaceChildren();

  const groups = {
    opening: "Opening Pages",
    monthly: "Monthly Pages",
    weekly: "Weekly Pages",
    book: "Other Pages",
    closing: "Closing Pages"
  };

  let currentGroup = null;

  sections.forEach(([id, name, group]) => {
    if (group !== currentGroup) {
      const optgroup = document.createElement("optgroup");
      optgroup.label = groups[group];
      select.appendChild(optgroup);
      currentGroup = group;
    }

    const option = document.createElement("option");
    option.value = id;
    option.textContent = name;

    select.lastElementChild.appendChild(option);
  });

  const available = sections.map(section => section[0]);

  select.value = available.includes(previous)
    ? previous
    : "habits";
}

// ========================================
// INTERIOR PREVIEW
// ========================================

function updateInside(design) {
  const section = $("preview-page").value;

  const connected = section === "habits";

  $("habit-spread").hidden = !connected;
  $("paper-preview").hidden = connected;

  if (connected) {
    renderHabitSpread(design);
    return;
  }

  const content = $("page-preview-content");
  content.replaceChildren();

  const sections = getOrganisedSections(design);
  const match = sections.find(item => item[0] === section);

  const heading = match ? match[1] : "My Journal";

  $("page-preview-heading").textContent = heading;

  $("paper-preview").className =
    "paper-preview " +
    (section === "writing" ? design.paper : "blank");

  const monthIndex = Number($("preview-month").value) || 0;
  const month = getMonths(design)[monthIndex];

  const monthlySections = [
    "goals", "writing", "reflection"
  ];

  if (monthlySections.includes(section)) {
    addLabel(content, month);
  }

  // Blank essential pages

  if (section === "goals") {
    addBlankPage(content, 10);
    return;
  }

  if (section === "reflection") {
    addBlankPage(content, 10);
    return;
  }

  if (section === "writing") {
    addBlankPage(content, 10);
    return;
  }

  // All other pages are open templates,
  // without predefined questions.

  addBlankPage(content, 10);
}

// ========================================
// PAGE COUNT
// ========================================

function calculatePages(design) {
  // Mandatory opening: 4 pages
  // Mandatory closing: 4 pages

  let total = 8;

  // Per-month:
  // Monthly Goals: 2 pages
  // Connected Moments + Habits: 2 pages
  // Monthly Reflection: 2 pages
  // Free Writing: chosen number

  total += design.duration * (
    2 +
    2 +
    2 +
    design.writingPages
  );

  // Extra habit reflection space is included
  // in the connected spread estimate.

  // Approximate four weekly occurrences
  // per month for prototype calculations.
  const estimatedWeeks = design.duration * 4;

  design.optionalSections.forEach(id => {
    const item = OPTIONAL_SECTIONS[id];

    if (!item) return;

    if (item.frequency === "monthly") {
      total += item.pages * design.duration;
    } else if (item.frequency === "weekly") {
      total += item.pages * estimatedWeeks;
    } else {
      total += item.pages;
    }
  });

  // Round up to an even page count.
  return Math.ceil(total / 2) * 2;
}

function updatePageCount(design) {
  const pages = calculatePages(design);
  const limit = PAGE_LIMITS[design.duration];

  const overLimit = pages > limit;

  $("page-count").textContent =
    `${pages} / ${limit}`;

  $("page-progress-fill").style.width =
    `${Math.min(100, pages / limit * 100)}%`;

  $("page-progress-fill").classList.toggle(
    "over-limit",
    overLimit
  );

  $("page-message").classList.toggle(
    "error",
    overLimit
  );

  $("page-message").textContent = overLimit
    ? `${pages - limit} pages over the estimated limit.`
    : `${limit - pages} pages remaining.`;

  $("save-design").disabled = overLimit;
}

// ========================================
// UPDATE EVERYTHING
// ========================================

function updateAll() {
  const design = getDesign();

  updateMonths(design);
  updateCover(design);
  updatePreviewOptions(design);
  updateInside(design);
  updatePageCount(design);

  $("summary-extras").textContent =
    design.optionalSections.length
      ? `${design.optionalSections.length} selected`
      : "None";
}

// ========================================
// EVENT LISTENERS
// ========================================

// Duration

document.querySelectorAll(
  'input[name="duration"]'
).forEach(input => {
  input.addEventListener("change", () => {
    updateAll();
    showPreview("habits");
  });
});

// Dated / undated

$("dated-journal").addEventListener("change", () => {
  updateAll();
  showPreview("habits");
});

// Starting month

$("start-month").addEventListener("change", () => {
  updateAll();
  showPreview("habits");
});

// Cover

document.querySelectorAll(
  "#cover-settings input, #cover-settings select"
).forEach(input => {
  input.addEventListener("input", () => {
    updateAll();
    showPreview("cover");
  });
});

// Paper

document.querySelectorAll(
  "#paper-settings select"
).forEach(input => {
  input.addEventListener("change", () => {
    updateAll();
    showPreview("writing");
  });
});

// Habit count

$("habit-count").addEventListener("change", () => {
  renderHabitInputs();
  updateAll();
  showPreview("habits");
});

// Habit graph

$("habit-graph").addEventListener("change", () => {
  updateAll();
  showPreview("habits");
});

// Habit reflection

$("habit-reflection").addEventListener("change", () => {
  updateAll();
  showPreview("habits");
});

// Optional pages

document.querySelectorAll(
  "#optional-sections input"
).forEach(input => {
  input.addEventListener("change", () => {
    updateAll();

    if (input.checked) {
      showPreview(input.value);
    }
  });
});

// Preview tabs

document.querySelectorAll(".preview-tab").forEach(
  button => {
    button.addEventListener("click", () => {
      setTab(button.dataset.tab);
    });
  }
);

// Preview page selection

$("preview-page").addEventListener("change", () => {
  setTab("inside");
  updateInside(getDesign());
});

// Preview month selection

$("preview-month").addEventListener("change", () => {
  setTab("inside");
  updateInside(getDesign());
});

// ========================================
// SAVE DESIGN
// ========================================

$("save-design").addEventListener("click", () => {
  const design = getDesign();

  if (
    calculatePages(design) >
    PAGE_LIMITS[design.duration]
  ) {
    $("save-message").textContent =
      "Reduce your page count before saving.";
    return;
  }

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(design)
    );

    $("save-message").textContent =
      "Your journal design has been saved.";
  } catch (error) {
    console.error(error);
    $("save-message").textContent =
      "Your design could not be saved.";
  }
});

// ========================================
// LOAD SAVED DESIGN
// ========================================

function restoreSelect(id, value) {
  const element = $(id);

  if (!element || value == null) return;

  const available = [...element.options].some(
    option => option.value === String(value)
  );

  if (available) {
    element.value = String(value);
  }
}

function loadSavedDesign() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return;

    const design = JSON.parse(raw);

    if (!design || typeof design !== "object") {
      return;
    }

    // Duration

    const duration = document.querySelector(
      `input[name="duration"][value="${design.duration}"]`
    );

    if (duration) {
      duration.checked = true;
    }

    // Date settings

    if (typeof design.dated === "boolean") {
      $("dated-journal").checked = design.dated;
    }

    if (
      typeof design.startMonth === "string" &&
      /^\d{4}-\d{2}$/.test(design.startMonth)
    ) {
      $("start-month").value = design.startMonth;
    }

    // Cover

    const cover = [
      ...document.querySelectorAll(
        'input[name="cover"]'
      )
    ].find(input => input.value === design.cover);

    if (cover) {
      cover.checked = true;
    }

    if (typeof design.title === "string") {
      $("cover-title").value = design.title;
    }

    if (typeof design.showBrand === "boolean") {
      $("show-brand").checked = design.showBrand;
    }

    // Select inputs

    [
      ["cover-material", design.material],
      ["title-finish", design.finish],
      ["paper-type", design.paper],
      ["writing-pages", design.writingPages],
      ["habit-count", design.habitCount],
      ["habit-graph", design.habitGraph]
    ].forEach(([id, value]) => {
      restoreSelect(id, value);
    });

    // Habit reflection

    if (typeof design.habitReflection === "boolean") {
      $("habit-reflection").checked =
        design.habitReflection;
    }

    // Habit names

    if (Array.isArray(design.habitNames)) {
      design.habitNames.slice(0, 10).forEach(
        (name, index) => {
          habitNames[index] =
            typeof name === "string" ? name : "";
        }
      );
    }

    // Optional sections

    if (Array.isArray(design.optionalSections)) {
      document.querySelectorAll(
        "#optional-sections input"
      ).forEach(input => {
        input.checked =
          design.optionalSections.includes(input.value);
      });
    }
  } catch (error) {
    console.error("Could not load design:", error);
  }
}

// ========================================
// INITIALISE
// ========================================

loadSavedDesign();
renderHabitInputs();
updateAll();
setTab("cover");
