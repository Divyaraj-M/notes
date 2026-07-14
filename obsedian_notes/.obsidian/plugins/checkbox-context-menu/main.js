var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => CheckboxContextMenuPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian3 = require("obsidian");

// src/checkbox-states.ts
var UNCHECKED_CHAR = " ";
var DEFAULT_STATES = [
  { char: UNCHECKED_CHAR, label: "Unchecked", icon: "\u2610" },
  { char: "x", label: "Done", icon: "\u2713" },
  { char: "/", label: "Half-done", icon: "\u25D0" },
  { char: ">", label: "Deferred", icon: "\u2192" },
  { char: "<", label: "Scheduled", icon: "\u2190" },
  { char: "!", label: "Important", icon: "!" },
  { char: "-", label: "Cancelled", icon: "\u2212" }
];
var DEFAULT_SETTINGS = {
  enabledStates: DEFAULT_STATES.map((s) => s.char),
  stateOverrides: {},
  customStates: [],
  showIcons: true,
  highlightCurrent: true,
  sortAlphabetically: false,
  stateOrder: DEFAULT_STATES.map((s) => s.char),
  injectStatusStyles: true
};
function normalizeStateOrder(settings) {
  var _a;
  const known = [...DEFAULT_STATES, ...settings.customStates].map((s) => s.char);
  const order = ((_a = settings.stateOrder) != null ? _a : []).filter((c) => known.includes(c));
  for (const c of known) {
    if (!order.includes(c)) order.push(c);
  }
  return order;
}
function getOrderedStates(settings) {
  const byChar = new Map([...DEFAULT_STATES, ...settings.customStates].map((s) => [s.char, s]));
  return normalizeStateOrder(settings).map((c) => byChar.get(c)).filter((s) => s !== void 0);
}
function getActiveStates(settings) {
  const active = getOrderedStates(settings).filter((s) => settings.enabledStates.includes(s.char)).map((s) => __spreadValues(__spreadValues({}, s), settings.stateOverrides[s.char]));
  if (settings.sortAlphabetically) {
    const empty = active.find((s) => s.char === UNCHECKED_CHAR);
    const rest = active.filter((s) => s.char !== UNCHECKED_CHAR);
    rest.sort((a, b) => a.label.localeCompare(b.label));
    return empty ? [empty, ...rest] : rest;
  }
  return active;
}

// src/settings.ts
var import_obsidian = require("obsidian");
function describeChar(char) {
  if (char === UNCHECKED_CHAR) return "[ ] (empty)";
  return `[${char}]`;
}
var CheckboxPluginSettingTab = class extends import_obsidian.PluginSettingTab {
  setPlugin(plugin) {
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    const settings = this.plugin.settings;
    this.addMenuAppearanceSection(containerEl, settings);
    this.addStatusStylesSection(containerEl, settings);
    this.addCheckboxStatesSection(containerEl, settings);
    this.addCustomStatesSection(containerEl, settings);
  }
  addStatusStylesSection(containerEl, settings) {
    new import_obsidian.Setting(containerEl).setName("Checkbox styling").setHeading();
    new import_obsidian.Setting(containerEl).setName("Inject status styles").setDesc(
      "Colour and glyph each checkbox state (half-done, deferred, scheduled, important, cancelled) in the editor and reading view. Turn off if your theme or snippet already styles these states."
    ).addToggle((toggle) => toggle.setValue(settings.injectStatusStyles).onChange((value) => __async(this, null, function* () {
      settings.injectStatusStyles = value;
      yield this.plugin.saveSettings();
      this.plugin.applyStatusStyles();
    })));
  }
  addMenuAppearanceSection(containerEl, settings) {
    new import_obsidian.Setting(containerEl).setName("Menu appearance").setHeading();
    new import_obsidian.Setting(containerEl).setName("Show icons in menu").addToggle((toggle) => toggle.setValue(settings.showIcons).onChange((value) => __async(this, null, function* () {
      settings.showIcons = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("Highlight current state").addToggle((toggle) => toggle.setValue(settings.highlightCurrent).onChange((value) => __async(this, null, function* () {
      settings.highlightCurrent = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("Sort states alphabetically").addToggle((toggle) => toggle.setValue(settings.sortAlphabetically).onChange((value) => __async(this, null, function* () {
      settings.sortAlphabetically = value;
      yield this.plugin.saveSettings();
    })));
  }
  addCheckboxStatesSection(containerEl, settings) {
    new import_obsidian.Setting(containerEl).setName("Checkbox states").setDesc(
      "Enable or disable each checkbox state and override its label and icon. Drag the \u283F handle to reorder the context menu (ignored while alphabetical sort is on)."
    ).setHeading();
    const listEl = containerEl.createDiv({ cls: "checkbox-context-menu-state-list" });
    getOrderedStates(settings).forEach((state) => {
      this.addStateRow(listEl, settings, state);
    });
  }
  addStateRow(listEl, settings, state) {
    var _a;
    const isEnabled = settings.enabledStates.includes(state.char);
    const isCustom = !DEFAULT_STATES.some((s) => s.char === state.char);
    const override = (_a = settings.stateOverrides[state.char]) != null ? _a : {};
    const setting = new import_obsidian.Setting(listEl).setDesc(`Renders as: ${describeChar(state.char)}`);
    setting.settingEl.dataset.stateChar = state.char;
    const refreshName = () => {
      var _a2, _b, _c, _d;
      const o = (_a2 = settings.stateOverrides[state.char]) != null ? _a2 : {};
      setting.setName(`${(_c = (_b = o.icon) != null ? _b : state.icon) != null ? _c : ""} ${(_d = o.label) != null ? _d : state.label}`.trim());
    };
    refreshName();
    this.attachDragHandle(setting, settings);
    setting.addToggle((toggle) => toggle.setValue(isEnabled).onChange((value) => __async(this, null, function* () {
      if (value) {
        if (!settings.enabledStates.includes(state.char)) {
          settings.enabledStates = [...settings.enabledStates, state.char];
        }
      } else {
        settings.enabledStates = settings.enabledStates.filter((c) => c !== state.char);
      }
      yield this.plugin.saveSettings();
    })));
    setting.addText((text) => {
      var _a2;
      return text.setPlaceholder("Custom label").setValue((_a2 = override.label) != null ? _a2 : "").onChange((value) => __async(this, null, function* () {
        var _a3;
        settings.stateOverrides[state.char] = __spreadProps(__spreadValues({}, (_a3 = settings.stateOverrides[state.char]) != null ? _a3 : {}), {
          label: value || void 0
        });
        refreshName();
        yield this.plugin.saveSettings();
      }));
    });
    setting.addText((text) => {
      var _a2;
      return text.setPlaceholder("Custom icon").setValue((_a2 = override.icon) != null ? _a2 : "").onChange((value) => __async(this, null, function* () {
        var _a3;
        settings.stateOverrides[state.char] = __spreadProps(__spreadValues({}, (_a3 = settings.stateOverrides[state.char]) != null ? _a3 : {}), {
          icon: value || void 0
        });
        refreshName();
        yield this.plugin.saveSettings();
      }));
    });
    if (isCustom) {
      setting.addButton((btn) => btn.setButtonText("Remove").setWarning().onClick(() => __async(this, null, function* () {
        settings.customStates = settings.customStates.filter((s) => s.char !== state.char);
        settings.enabledStates = settings.enabledStates.filter((c) => c !== state.char);
        settings.stateOrder = settings.stateOrder.filter((c) => c !== state.char);
        delete settings.stateOverrides[state.char];
        yield this.plugin.saveSettings();
        this.display();
      })));
    }
  }
  /** Prepend a ⠿ grip to the row and wire up HTML5 drag-and-drop reordering. */
  attachDragHandle(setting, settings) {
    const rowEl = setting.settingEl;
    rowEl.addClass("checkbox-context-menu-state-row");
    const handle = setting.nameEl.createSpan({
      cls: "checkbox-context-menu-drag-handle",
      text: "\u283F"
    });
    setting.nameEl.prepend(handle);
    handle.addEventListener("mousedown", () => {
      rowEl.draggable = true;
    });
    handle.addEventListener("touchstart", () => {
      rowEl.draggable = true;
    });
    rowEl.addEventListener("dragstart", (ev) => {
      var _a, _b;
      (_b = ev.dataTransfer) == null ? void 0 : _b.setData("text/plain", (_a = rowEl.dataset.stateChar) != null ? _a : "");
      rowEl.addClass("checkbox-context-menu-dragging");
    });
    rowEl.addEventListener("dragend", () => {
      var _a;
      rowEl.draggable = false;
      rowEl.removeClass("checkbox-context-menu-dragging");
      (_a = rowEl.parentElement) == null ? void 0 : _a.querySelectorAll(".checkbox-context-menu-drop-target").forEach((el) => el.removeClass("checkbox-context-menu-drop-target"));
    });
    rowEl.addEventListener("dragover", (ev) => {
      ev.preventDefault();
      rowEl.addClass("checkbox-context-menu-drop-target");
    });
    rowEl.addEventListener("dragleave", () => {
      rowEl.removeClass("checkbox-context-menu-drop-target");
    });
    rowEl.addEventListener("drop", (ev) => {
      var _a;
      ev.preventDefault();
      const draggedChar = (_a = ev.dataTransfer) == null ? void 0 : _a.getData("text/plain");
      const targetChar = rowEl.dataset.stateChar;
      if (draggedChar == null || targetChar == null || draggedChar === targetChar) return;
      void this.moveState(settings, draggedChar, targetChar);
    });
  }
  /** Reorder stateOrder so draggedChar takes targetChar's position. */
  moveState(settings, draggedChar, targetChar) {
    return __async(this, null, function* () {
      const order = normalizeStateOrder(settings);
      const from = order.indexOf(draggedChar);
      const to = order.indexOf(targetChar);
      if (from === -1 || to === -1) return;
      order.splice(from, 1);
      order.splice(to, 0, draggedChar);
      settings.stateOrder = order;
      yield this.plugin.saveSettings();
      this.display();
    });
  }
  addCustomStatesSection(containerEl, settings) {
    new import_obsidian.Setting(containerEl).setName("Custom states").setDesc("Add your own checkbox states with a unique character, label, and icon. They appear in the list above.").setHeading();
    const formSetting = new import_obsidian.Setting(containerEl).setName("Add custom state").setDesc("Define a new checkbox state.").addText(
      (text) => text.setPlaceholder("Character (single char)")
    ).addText((text) => text.setPlaceholder("Label")).addText((text) => text.setPlaceholder("Icon")).addButton((btn) => btn.setButtonText("Add").onClick(() => __async(this, null, function* () {
      const inputEls = formSetting.controlEl.querySelectorAll('input[type="text"]');
      if (inputEls.length < 3) return;
      const [charInput, labelInput, iconInput] = inputEls;
      const char = charInput.value;
      const label = labelInput.value.trim();
      const icon = iconInput.value.trim();
      if (char.length !== 1 || char === " ") {
        new import_obsidian.Notice("Character must be exactly one non-space character.");
        return;
      }
      if (DEFAULT_STATES.some((s) => s.char === char)) {
        new import_obsidian.Notice(`"${char}" is already a built-in state \u2014 edit it above instead.`);
        return;
      }
      if (!label) {
        new import_obsidian.Notice("Label is required.");
        return;
      }
      const existingIndex = settings.customStates.findIndex((s) => s.char === char);
      if (existingIndex !== -1) {
        settings.customStates[existingIndex] = { char, label, icon };
      } else {
        settings.customStates = [...settings.customStates, { char, label, icon }];
        if (!settings.enabledStates.includes(char)) {
          settings.enabledStates = [...settings.enabledStates, char];
        }
        settings.stateOrder = normalizeStateOrder(settings);
      }
      yield this.plugin.saveSettings();
      this.display();
    })));
  }
};

// src/utils.ts
var CHECKBOX_REGEX = /\[.\]/g;
function findCheckboxes(lineText) {
  const matches = [];
  CHECKBOX_REGEX.lastIndex = 0;
  let match;
  while ((match = CHECKBOX_REGEX.exec(lineText)) !== null) {
    matches.push({
      startPos: match.index,
      endPos: match.index + match[0].length,
      currentState: match[0]
    });
  }
  return matches;
}

// src/detector.ts
var TASK_LINE = /^\s*(?:[-*+]|\d+[.)])\s+\[.\]/;
function isTaskLine(lineText) {
  return TASK_LINE.test(lineText);
}
function findCheckboxOnLine(lineText, cursorOffset) {
  const matches = findCheckboxes(lineText);
  if (matches.length === 0) return null;
  if (cursorOffset === void 0) return matches[0];
  let closest = null;
  let closestDist = Infinity;
  for (const m of matches) {
    const dist = Math.min(Math.abs(m.startPos - cursorOffset), Math.abs(m.endPos - cursorOffset));
    if (dist < closestDist) {
      closestDist = dist;
      closest = m;
    }
  }
  return closest;
}
function getCheckboxLineAndColumn(editor) {
  const cursor = editor.getCursor();
  if (!cursor) return null;
  return { line: cursor.line, column: cursor.ch };
}

// src/menu.ts
function replaceCheckbox(editor, lineNum, match, newChar) {
  const currentLine = editor.getLine(lineNum);
  if (currentLine === null) return;
  const cursorBefore = editor.getCursor();
  const replacement = `[${newChar}]`;
  const oldLen = match.endPos - match.startPos;
  const newLine = currentLine.slice(0, match.startPos) + replacement + currentLine.slice(match.endPos);
  editor.setLine(lineNum, newLine);
  let newCharPos = cursorBefore.ch;
  if (cursorBefore.ch > match.startPos && cursorBefore.ch <= match.endPos) {
    newCharPos = match.startPos + replacement.length;
  } else if (cursorBefore.ch > match.endPos) {
    newCharPos += replacement.length - oldLen;
  }
  editor.setCursor({
    line: cursorBefore.line,
    ch: Math.max(0, Math.min(newCharPos, newLine.length))
  });
}
function populateStateMenu(target, states, currentState, settings, onSelect) {
  for (const state of states) {
    const isCurrent = `[${state.char}]` === currentState;
    const glyph = settings.showIcons && state.icon ? `${state.icon} ` : "";
    target.addItem((item) => {
      item.setTitle(glyph + state.label);
      if (isCurrent && settings.highlightCurrent) {
        item.setChecked(true);
      }
      if (isCurrent) {
        item.setDisabled(true);
      }
      item.onClick(() => onSelect(state.char));
    });
  }
}
function populateCheckboxSubmenu(submenu, editor, lineNum, checkboxMatch, states, settings) {
  populateStateMenu(submenu, states, checkboxMatch.currentState, settings, (char) => {
    replaceCheckbox(editor, lineNum, checkboxMatch, char);
  });
}

// src/reading-mode.ts
var import_obsidian2 = require("obsidian");
var CHECKBOX_SELECTOR = "input.task-list-item-checkbox";
var LONG_PRESS_MS = 500;
var MOVE_THRESHOLD_PX = 10;
function attachReadingModeMenu(app, getSettings, element, context) {
  const checkboxes = element.querySelectorAll(CHECKBOX_SELECTOR);
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("contextmenu", (evt) => {
      showReadingModeMenuAtMouse(app, getSettings(), evt, checkbox, element, context);
    });
    attachLongPressHandler(app, getSettings, checkbox, element, context);
  });
}
function attachLongPressHandler(app, getSettings, checkbox, element, context) {
  let timerId = null;
  let startX = 0;
  let startY = 0;
  let startEvent = null;
  function cancel() {
    if (timerId !== null) {
      window.clearTimeout(timerId);
      timerId = null;
    }
    startEvent = null;
  }
  checkbox.addEventListener("touchstart", (evt) => {
    const touch = evt.touches[0];
    if (!touch) return;
    startX = touch.clientX;
    startY = touch.clientY;
    startEvent = evt;
    timerId = window.setTimeout(() => {
      timerId = null;
      if (startEvent) {
        startEvent.preventDefault();
      }
      startEvent = null;
      showReadingModeMenuAtPosition(
        app,
        getSettings(),
        startX,
        startY,
        checkbox,
        element,
        context
      );
    }, LONG_PRESS_MS);
  }, { passive: false });
  checkbox.addEventListener("touchend", () => {
    cancel();
  });
  checkbox.addEventListener("touchcancel", () => {
    cancel();
  });
  checkbox.addEventListener("touchmove", (evt) => {
    const touch = evt.touches[0];
    if (!touch) {
      cancel();
      return;
    }
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    if (Math.sqrt(dx * dx + dy * dy) > MOVE_THRESHOLD_PX) {
      cancel();
    }
  });
}
function resolveCheckbox(app, checkbox, element, context) {
  const section = context.getSectionInfo(element);
  if (!section) return null;
  const file = app.vault.getAbstractFileByPath(context.sourcePath);
  if (!(file instanceof import_obsidian2.TFile)) return null;
  const allCheckboxes = Array.from(element.querySelectorAll(CHECKBOX_SELECTOR));
  const domIndex = allCheckboxes.indexOf(checkbox);
  if (domIndex < 0) return null;
  const lines = section.text.split("\n");
  const taskLineNumbers = [];
  for (let i = section.lineStart; i <= section.lineEnd && i < lines.length; i++) {
    if (TASK_LINE.test(lines[i])) {
      taskLineNumbers.push(i);
    }
  }
  const targetLine = taskLineNumbers[domIndex];
  if (targetLine === void 0) return null;
  const match = findCheckboxOnLine(lines[targetLine]);
  if (!match) return null;
  return { file, targetLine, match };
}
function buildMenu(app, settings, file, targetLine, match) {
  const states = getActiveStates(settings);
  const menu = new import_obsidian2.Menu();
  populateStateMenu(menu, states, match.currentState, settings, (char) => {
    void applyChange(app, file, targetLine, match.startPos, match.endPos, char);
  });
  return menu;
}
function showReadingModeMenuAtMouse(app, settings, evt, checkbox, element, context) {
  const resolved = resolveCheckbox(app, checkbox, element, context);
  if (!resolved) return;
  evt.preventDefault();
  evt.stopPropagation();
  const menu = buildMenu(app, settings, resolved.file, resolved.targetLine, resolved.match);
  menu.showAtMouseEvent(evt);
}
function showReadingModeMenuAtPosition(app, settings, x, y, checkbox, element, context) {
  const resolved = resolveCheckbox(app, checkbox, element, context);
  if (!resolved) return;
  const menu = buildMenu(app, settings, resolved.file, resolved.targetLine, resolved.match);
  menu.showAtPosition({ x, y });
}
function applyChange(app, file, lineNum, startPos, endPos, newChar) {
  return __async(this, null, function* () {
    yield app.vault.process(file, (content) => {
      const lines = content.split("\n");
      const line = lines[lineNum];
      if (line === void 0) return content;
      const replacement = `[${newChar}]`;
      if (/^\[.\]$/.test(line.slice(startPos, endPos))) {
        lines[lineNum] = line.slice(0, startPos) + replacement + line.slice(endPos);
      } else {
        const current = findCheckboxOnLine(line);
        if (!current) return content;
        lines[lineNum] = line.slice(0, current.startPos) + replacement + line.slice(current.endPos);
      }
      return lines.join("\n");
    });
  });
}

// src/main.ts
var STATUS_STYLES_CLASS = "checkbox-context-menu-styles";
var CheckboxContextMenuPlugin = class extends import_obsidian3.Plugin {
  onload() {
    return __async(this, null, function* () {
      yield this.loadSettings();
      this.applyStatusStyles();
      this.register(() => activeDocument.body.classList.remove(STATUS_STYLES_CLASS));
      const tab = new CheckboxPluginSettingTab(this.app, this);
      tab.setPlugin(this);
      this.addSettingTab(tab);
      this.registerEvent(
        this.app.workspace.on("editor-menu", (menu, editor) => {
          const cursor = getCheckboxLineAndColumn(editor);
          if (!cursor) return;
          const lineText = editor.getLine(cursor.line);
          if (!lineText || !isTaskLine(lineText)) return;
          const match = findCheckboxOnLine(lineText, cursor.column);
          if (!match) return;
          const states = getActiveStates(this.settings);
          menu.addItem((item) => {
            item.setTitle("Change checkbox state");
            item.setIcon("check-square");
            const submenu = item.setSubmenu();
            populateCheckboxSubmenu(submenu, editor, cursor.line, match, states, this.settings);
          });
        })
      );
      this.registerMarkdownPostProcessor((element, context) => {
        attachReadingModeMenu(this.app, () => this.settings, element, context);
      });
      this.addCommand({
        id: "cycle-checkbox-state",
        name: "Cycle checkbox state",
        editorCallback: (editor) => {
          const cursor = getCheckboxLineAndColumn(editor);
          if (!cursor) {
            new import_obsidian3.Notice("No checkbox on this line");
            return;
          }
          const lineText = editor.getLine(cursor.line);
          if (!lineText || !isTaskLine(lineText)) {
            new import_obsidian3.Notice("No checkbox on this line");
            return;
          }
          const match = findCheckboxOnLine(lineText, cursor.column);
          if (!match) {
            new import_obsidian3.Notice("No checkbox found on this line");
            return;
          }
          const states = getActiveStates(this.settings);
          const currentChar = match.currentState.replace("[", "").replace("]", "");
          const currentIndex = states.findIndex((s) => s.char === currentChar);
          const nextIndex = (currentIndex + 1) % states.length;
          const nextState = states[nextIndex];
          replaceCheckbox(editor, cursor.line, match, nextState.char);
        }
      });
    });
  }
  onunload() {
  }
  /**
   * Toggle the body class that enables the per-status checkbox styling in
   * styles.css, following the `injectStatusStyles` setting. Called on load and
   * whenever the setting changes.
   */
  applyStatusStyles() {
    activeDocument.body.classList.toggle(STATUS_STYLES_CLASS, this.settings.injectStatusStyles);
  }
  loadSettings() {
    return __async(this, null, function* () {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const raw = yield this.loadData();
      const loaded = raw != null && typeof raw === "object" ? raw : null;
      this.settings = __spreadValues({}, DEFAULT_SETTINGS);
      if (loaded) {
        this.settings.enabledStates = (_a = loaded.enabledStates) != null ? _a : DEFAULT_SETTINGS.enabledStates;
        this.settings.stateOverrides = (_b = loaded.stateOverrides) != null ? _b : DEFAULT_SETTINGS.stateOverrides;
        this.settings.customStates = (_c = loaded.customStates) != null ? _c : DEFAULT_SETTINGS.customStates;
        this.settings.showIcons = (_d = loaded.showIcons) != null ? _d : DEFAULT_SETTINGS.showIcons;
        this.settings.highlightCurrent = (_e = loaded.highlightCurrent) != null ? _e : DEFAULT_SETTINGS.highlightCurrent;
        this.settings.sortAlphabetically = (_f = loaded.sortAlphabetically) != null ? _f : DEFAULT_SETTINGS.sortAlphabetically;
        this.settings.injectStatusStyles = (_g = loaded.injectStatusStyles) != null ? _g : DEFAULT_SETTINGS.injectStatusStyles;
        this.settings.stateOrder = (_h = loaded.stateOrder) != null ? _h : DEFAULT_SETTINGS.stateOrder;
        this.migrateEmptyUncheckedChar();
      }
      this.settings.stateOrder = normalizeStateOrder(this.settings);
    });
  }
  /**
   * Early versions used "" for the unchecked state, which serialized to the
   * invalid `[]` (no space). Rewrite any persisted "" to a single space so
   * existing vaults keep the unchecked state enabled and rendering `[ ]`.
   */
  migrateEmptyUncheckedChar() {
    this.settings.enabledStates = this.settings.enabledStates.map(
      (c) => c === "" ? UNCHECKED_CHAR : c
    );
    this.settings.stateOrder = this.settings.stateOrder.map(
      (c) => c === "" ? UNCHECKED_CHAR : c
    );
    if (Object.prototype.hasOwnProperty.call(this.settings.stateOverrides, "")) {
      this.settings.stateOverrides[UNCHECKED_CHAR] = this.settings.stateOverrides[""];
      delete this.settings.stateOverrides[""];
    }
  }
  saveSettings() {
    return __async(this, null, function* () {
      yield this.saveData(this.settings);
    });
  }
};

/* nosourcemap */