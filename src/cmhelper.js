import CodeMirror from 'codemirror';
import BiwaScheme from 'biwascheme';

export const SCRATCH = '*scratch*';
export const SCRATCH_VALUE = `;; This doc is not saved, and for Lisp evaluation.\n\n`;
export const MODE_NULL = 'null';

export const evalExpr = (expr) => {
  const v = new BiwaScheme.Parser(expr).getVector();
  return BiwaScheme.run(
    BiwaScheme.to_display(v[(v.length - 1)]),
    { 'no_print': true });
}

export const makeCodeMirror = (el, options) => {
  const cm = CodeMirror.fromTextArea(el, {
    ...options,
    autoCloseBrackets: true,
    autoCloseTags: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    keyMap: 'emacs'
  });
  return cm;
}

const makeDocInputHtml = (docNameList) => {
  const list = docNameList.map(b => `<option value="${b}" />`).join('');
  const datalist = `<datalist id="docs">${list}</datalist>`;
  return `name: <input type="text" autocomplete="on" list="docs" />${datalist}`;
}

export const openDocDialog = (cm, getAllDocNames, openDoc) => {
  const html = makeDocInputHtml(getAllDocNames());
  cm.openDialog(
    html,
    (name) => {
      if (name.replace(/\s+/g, '') !== '') {
        openDoc(cm.options.cid, name);
      }
    },
    { bottom: true }
  );
}

export const openModeDialog = (cm, changeMode) => {
  const mapping = {
    css: 'css',
    html: 'htmlmixed',
    javascript: 'javascript',
    markdown: 'markdown',
    none: MODE_NULL,
  };
  const list = Object.keys(mapping).map(
    (k) => `<option value="${k}" />`).join('');
  const datalist = `<datalist id="modes">${list}</datalist>`;
  const html = `mode: <input type="text" autocomplete="on" list="modes" />${datalist}`;
  cm.openDialog(
    html,
    (mode) => {
      if (Object.keys(mapping).includes(mode)) {
        changeMode(cm.options.cid, mapping[mode]);
      }
    },
    { bottom: true }
  );
}

export const openNotification = (cm, message, className='cm-error') => {
  cm.openNotification(
    `<div class='${className}'>${message}</div>`,
    { bottom: true }
  );
}

export const setOptions = (cm, options) => {
  for (const [k, v] of Object.entries(options)) {
    cm.setOption(k, v);
  }
}

export const changeDoc = (cm, doc) => {
  let copy = doc;
  if (doc.getEditor()) copy = doc.linkedDoc({ sharedHist: true });
  copy.name = doc.name;
  copy.modeOption = doc.modeOption;
  const old = cm.swapDoc(copy);
  let updatedDoc = null;
  old.iterLinkedDocs(function(linked) {
    old.unlinkDoc(linked);
    updatedDoc = linked;
  });
  return updatedDoc;
}

export const addCommands = (commands) => {
  for (const [name, action] of Object.entries(commands)) {
    CodeMirror.commands[name] = action;
  }
}

// Emacs
const originals = Object.assign({}, CodeMirror.keyMap.emacs);

const foldCode = (cm) => {
  cm.foldCode(cm.getCursor());
};

const evalOperation = (cm) => {
  originals['Ctrl-J'](cm);
  const name = cm.getDoc().name;
  if (name == SCRATCH) {
    const doc = cm.getDoc();
    const cursor = doc.getCursor();
    try {
      const result = evalExpr(doc.getRange(CodeMirror.Pos(0, 0), cursor));
      if (result !== null) {
        const line = doc.getLine(cursor.line);
        const pos = CodeMirror.Pos(cursor.line, line.length - 1);
        doc.replaceRange(`${result}\n`, pos);
      }
    }
    catch(e) {
      openNotification(cm, `eval: ${e.message}`);
    }
  }
};

CodeMirror.keyMap.emacs = {
  ...CodeMirror.keyMap.emacs,

  // window
  'Ctrl-X O': function(cm) { CodeMirror.commands.extMoveWindow(cm); },
  'Ctrl-X 0': function(cm) { CodeMirror.commands.extDeleteWindow(cm); },
  'Ctrl-X 1': function(cm) { CodeMirror.commands.extDeleteOtherWindow(cm); },
  'Ctrl-X 2': function(cm) { CodeMirror.commands.extSplitHorizon(cm); },
  'Ctrl-X 3': function(cm) { CodeMirror.commands.extSplitVertical(cm); },

  // doc
  'Ctrl-X Ctrl-F': function(cm) { CodeMirror.commands.open(cm); },
  'Ctrl-X B': function(cm) { CodeMirror.commands.open(cm); },
  'Ctrl-X Delete': function(cm) { CodeMirror.commands.extDeleteDoc(cm); },

  // mode
  'Ctrl-X M': function(cm) { CodeMirror.commands.extChangeMode(cm); },

  // redo
  'Ctrl-X Ctrl-/': CodeMirror.commands.redo,
  'Ctrl-X Ctrl-Z': CodeMirror.commands.redo,
  'Ctrl-X Shift-Ctrl--': CodeMirror.commands.redo,
  'Ctrl-X Cmd-Z': CodeMirror.commands.redo,

  // misc
  'Ctrl-M': CodeMirror.commands.newlineAndIndent,
  'Ctrl-I': function(cm) { foldCode(cm); },
  'Ctrl-J': function(cm) { evalOperation(cm); }
};

// Vim
// window
CodeMirror.Vim.defineAction('moveWindow', (cm) => CodeMirror.commands.extMoveWindow(cm));
CodeMirror.Vim.mapCommand('<C-w>w', 'action', 'moveWindow', {});
CodeMirror.Vim.mapCommand('<C-w><C-w>', 'action', 'moveWindow', {});

CodeMirror.Vim.defineEx('quit', 'q', (cm) => CodeMirror.commands.extDeleteWindow(cm));
CodeMirror.Vim.map('<C-w>q', ':quit', 'normal');
CodeMirror.Vim.map('<C-w><C-q>', ':quit', 'normal');
CodeMirror.Vim.defineEx('close', 'clo', (cm) => CodeMirror.commands.extDeleteWindow(cm));
CodeMirror.Vim.map('<C-w>c', ':close', 'normal');
CodeMirror.Vim.defineEx('only', 'on', (cm) => CodeMirror.commands.extDeleteOtherWindow(cm));
CodeMirror.Vim.map('<C-w>o', ':only', 'normal');
CodeMirror.Vim.map('<C-w><C-o>', ':only', 'normal');

CodeMirror.Vim.defineEx('split', 'sp', (cm) => CodeMirror.commands.extSplitHorizon(cm));
CodeMirror.Vim.map('<C-w>s', ':split', 'normal');

CodeMirror.Vim.defineEx('vsplit', 'vs', (cm) => CodeMirror.commands.extSplitVertical(cm));
CodeMirror.Vim.map('<C-w>v', ':vsplit', 'normal');
CodeMirror.Vim.map('<C-w><C-v>', ':vsplit', 'normal');

// doc
CodeMirror.Vim.defineEx('edit', 'e', (cm, params) => {
  if (params.args) {
    const name = params.args[0];
    if (name.replace(/\s+/g, '') !== '') {
      CodeMirror.commands.extOpenDoc(cm, name);
      return;
    }
  }
  CodeMirror.commands.open(cm);
});
CodeMirror.Vim.defineAction('deleteDoc', (cm) => CodeMirror.commands.extDeleteDoc(cm));
CodeMirror.Vim.mapCommand('<C-w><Del>', 'action', 'deleteDoc', {});

// mode
CodeMirror.Vim.defineAction('changeMode', (cm) => CodeMirror.commands.extChangeMode(cm));
CodeMirror.Vim.mapCommand('<C-w>m', 'action', 'changeMode', {});

// misc
CodeMirror.Vim.defineAction('fold', (cm) => foldCode(cm));
CodeMirror.Vim.mapCommand('<C-w>i', 'action', 'fold', {});
CodeMirror.Vim.mapCommand('<C-w><C-i>', 'action', 'fold', {});
CodeMirror.Vim.defineAction('evalExpr', (cm) => evalOperation(cm));
CodeMirror.Vim.mapCommand('<C-j>', 'action', 'evalExpr', {}, { context: 'insert' });
