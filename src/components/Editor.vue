<template>
  <div class="wrapper" v-bind:class="wrapperClass">
    <div class="white" v-bind:class="classes.white" ref="white">
      <textarea></textarea>
      <div class="navbar statusbar">
        <div class="navbar-section">
          <div>{{ names.white }}</div>
        </div>
        <div class="navbar-center">
          <div>( {{ showMode('white') }} )</div>
        </div>
        <div class="navbar-section"></div>
      </div>
    </div>
    <div class="black" v-bind:class="classes.black" ref="black">
      <textarea></textarea>
      <div class="navbar statusbar">
        <div class="navbar-section">
          <div>{{ names.black }}</div>
        </div>
        <div class="navbar-center">
          <div>( {{ showMode('black') }} )</div>
        </div>
        <div class="navbar-section"></div>
      </div>
    </div>
  </div>
</template>

<script>
import CodeMirror from 'codemirror';
import 'codemirror/keymap/emacs';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/markdown-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/mode/meta';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/scheme/scheme';
import 'codemirror/mode/css/css';
import store from 'store2';
import md5 from 'md5';
import {
  SCRATCH,
  SCRATCH_VALUE,
  MODE_NULL,
  makeCodeMirror,
  openDocDialog,
  openModeDialog,
  openNotification,
  setOptions,
  changeDoc,
  addCommands
} from '../cmhelper';


export default {
  name: 'Editor',
  props: {
    configUpdate: Boolean,
    fontSize: String,
    lineNumbers: Boolean,
    lineWrapping: Boolean,
    autosaveInterval: Number
  },
  data: function() {
    return {
      store: null,
      autosaveTimer: null,
      wrapperClass: this.fontSize,
      docs: {},
      hashes: {},
      cms: this.makePair(null, null),
      classes: this.makePair('ed-full', ''),
      names: this.makePair(SCRATCH, SCRATCH),
      modes: this.makePair(MODE_NULL, MODE_NULL)
    }
  },
  watch: {
    configUpdate: function (newValue) {
      if (!newValue) return;
      this.wrapperClass = this.fontSize;
      /* eslint-disable no-unused-vars */
      for (const [_, cm] of Object.entries(this.cms)) {
        setOptions(cm, {
          lineNumbers: this.lineNumbers,
          lineWrapping: this.lineWrapping
        });
        cm.refresh();
      }
      /* eslint-enable no-unused-vars */
      this.startAutoSave();
      this.$emit('reflectedConfig');
    }
  },
  mounted: function() {
    // define commands
    addCommands({
      open: (cm) => openDocDialog(cm, this.getAllDocNames, this.openDoc),
      extMoveWindow: (cm) => this.moveWindow(cm.options.cid),
      extDeleteWindow: (cm) => this.deleteWindow(cm.options.cid),
      extDeleteOtherWindow: (cm) => this.deleteOther(cm.options.cid),
      extSplitHorizon: (cm) => this.splitHorizon(cm.options.cid),
      extSplitVertical: (cm) => this.splitVertical(cm.options.cid),
      extDeleteDoc: (cm) => {
        if (window.confirm(
          'Are you sure you want to delete this document?')) {
            this.deleteDoc(cm.options.cid);
        }
      },
      extChangeMode: (cm) => openModeDialog(cm, this.changeMode)
    });

    // setup codemirror
    const options = {
      lineNumbers: this.lineNumbers,
      lineWrapping: this.lineWrapping
    };
    for (const [cid] of Object.entries(this.cms)) {
      const el = this.$refs[cid].querySelector('textarea');
      this.cms[cid] = makeCodeMirror(el, options);
      this.cms[cid].setOption('cid', cid);
    }

    // add scratch doc
    this.addDoc(SCRATCH, SCRATCH_VALUE);
    for (const [cid] of Object.entries(this.cms)) {
      this.selectDoc(cid, SCRATCH);
      this.modes[cid] = this.getMode(cid);
    }

    // initial storage
    if (process.env.NODE_ENV === 'test') this.store = store.area('fakeDoc');
    else this.store = store.namespace('doc');

    this.restore();

    // initial view
    this.classes.black = 'ed-hide';
    this.cms.white.focus();

    this.startAutoSave();
  },
  destroyed: function() {
    this.stopAutoSave();
  },
  methods: {
    makePair: function(whiteValue, blackValue) {
      return {
        white: whiteValue,
        black: blackValue
      }
    },

    getOtherId: function(cid) {
      return cid === 'white' ? 'black' : 'white';
    },

    moveWindow: function(cid) {
      const oid = this.getOtherId(cid);
      this.cms[oid].focus();
    },

    deleteWindow: function(cid) {
      this.classes[cid] = 'ed-hide';
      const oid = this.getOtherId(cid);
      this.classes[oid] = 'ed-full';
      this.cms[oid].focus();
    },

    deleteOther: function(cid) {
      this.classes[cid] = 'ed-full';
      const oid = this.getOtherId(cid);
      this.classes[oid] = 'ed-hide';
    },

    splitHorizon: function(cid) {
      this.classes[cid] = 'ed-top';
      const oid = this.getOtherId(cid);
      this.classes[oid] = 'ed-bottom';
      this.modes[oid] = this.modes[cid]
      const name = this.getDocName(cid);
      this.selectDoc(oid, name);
    },

    splitVertical: function(cid) {
      this.classes[cid] = 'ed-left';
      const oid = this.getOtherId(cid);
      this.classes[oid] = 'ed-right';
      this.modes[oid] = this.modes[cid]
      const name = this.getDocName(cid);
      this.selectDoc(oid, name);
    },

    getAllDocNames: function() {
      return Object.keys(this.docs);
    },

    getDocName: function(cid) {
      return this.cms[cid].getDoc().name;
    },

    getMode: function(cid) {
      return this.cms[cid].getDoc().mode.name;
    },

    openDoc: function(cid, name) {
      if (!this.getAllDocNames().includes(name)) {
        this.addDoc(name);
      }
      this.selectDoc(cid, name);
    },

    selectDoc: function(cid, name) {
      if (!this.getAllDocNames().includes(name)) return;
      if (this.getDocName(cid) === name) return;
      const linked = changeDoc(this.cms[cid], this.docs[name]);
      if (linked !== null) this.docs[linked.name] = linked;

      this.names[cid] = name;
      this.modes[cid] = this.getMode(cid);
      this.updateMode(cid);
    },

    addDoc: function (name, value='') {
      let info = CodeMirror.findModeByFileName(name);
      if (name === SCRATCH) info = CodeMirror.findModeByName('scheme');
      const doc = CodeMirror.Doc(value, info ? info.mode : info);
      doc.name = name;
      this.docs[name] = doc;
    },

    deleteDoc: function(cid) {
      const name = this.getDocName(cid);
      if (!this.getAllDocNames().includes(name)) return;
      if (name === SCRATCH) {
        openNotification(this.cms[cid], `${SCRATCH} can't be deleted.`);
        return;
      }
      this.selectDoc(cid, SCRATCH);
      delete this.docs[name];
    },

    showMode: function(cid) {
      const mode = this.modes[cid];
      if (mode === MODE_NULL) return 'none';
      if (mode === 'htmlmixed') return 'html';
      return mode;
    },

    changeMode: function(cid, mode) {
      const name = this.getDocName(cid);
      if (name === SCRATCH) {
        openNotification(this.cms[cid], `${SCRATCH} mode can't be changed.`);
        return;
      }
      this.modes[cid] = mode;
      this.updateMode(cid);
      this.cms[cid].focus();
    },

    updateMode: function(cid) {
      const setMode = (cid, mode) => {
        const cm = this.cms[cid];
        let m = mode;
        if (m === MODE_NULL) m = undefined;
        if (cm.options.mode !== m) {
          cm.setOption('mode', m);
        }
      };

      const mode = this.modes[cid];
      setMode(cid, mode);
      const name = this.getDocName(cid);
      this.docs[name].modeOption = mode;

      // sync other codemirror
      const oid = this.getOtherId(cid);
      if (name === this.getDocName(oid)) {
        this.modes[oid] = mode;
        setMode(oid, mode);
      }
    },

    restore: function() {
      this.store.each((key, val) => {
        this.addDoc(key, val);
      });
    },

    save: function() {
      const hkeys = Object.keys(this.hashes);
      for (const [key, val] of Object.entries(this.docs)) {
        if (key === SCRATCH) continue;
        const text = val.getValue();
        const hash = md5(text);
        if (hkeys.includes(key) && this.hashes[key] === hash) continue;
        this.hashes[key] = hash;
        this.store.set(key, text);
      }
      hkeys.forEach((key) => {
        if (!this.getAllDocNames().includes(key)) {
          this.store.remove(key);
          delete this.hashes[key];
        }
      });
    },
    startAutoSave: function() {
      if (this.autosaveTimer !== null) {
        clearInterval(this.autosaveTimer);
        this.autosaveTimer = null;
      }
      this.autosaveTimer = setInterval(this.save, this.autosaveInterval);
    },
    stopAutoSave: function() {
      if (this.autosaveTimer !== null) {
        clearInterval(this.autosaveTimer);
        this.autosaveTimer = null;
      }
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  height: 100%;
  position: relative;
}
.ed-full {
  height: 100%;
  width: 100%;
}
.ed-hide {
  position: absolute;
  top: -100%;
  left: -100%;
  height: 100%;
  width: 100%;
}
.ed-top {
  position: absolute;
  top: 0;
  height: 50%;
  width: 100%;
}
.ed-bottom {
  position: absolute;
  top: 50%;
  height: 50%;
  width: 100%;
}
.ed-left {
  position: absolute;
  left: 0;
  height: 100%;
  width: 50%;
}
.ed-right {
  position: absolute;
  left: 50%;
  height: 100%;
  width: 50%;
  border-left: 1px solid #ddd;
}

.statusbar {
  height: $control-size;
  padding: 0 1rem;
  background: #f7f7f7;
}
.statusbar .navbar-section > div {
  margin-right: .6rem;
}
</style>
