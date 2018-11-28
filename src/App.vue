<template>
  <div id="app">
    <Menubar @config="toggleConfig" @help="toggleHelp" />
    <main>
      <Editor
          :configUpdate="config.update"
          :fontSize="config.fontSize"
          :lineNumbers="config.lineNumbers"
          :lineWrapping="config.lineWrapping"
          :autosaveInterval="config.autosaveInterval"
          :keyMap="config.keyMap"
          @reflectedConfig="reflectedConfig"
      />
    </main>
    <Config
        :isActive="config.isActive"
        :fontSize="config.fontSize"
        :lineNumbers="config.lineNumbers"
        :lineWrapping="config.lineWrapping"
        :autosaveInterval="config.autosaveInterval"
        :keyMap="config.keyMap"
        @save="saveConfig"
        @close="toggleConfig"
    />
    <Help
        :isActive="help.isActive"
        :keyMap="config.keyMap"
        @close="toggleHelp"
    />
  </div>
</template>

<script>
import store from 'store2';
import Config from './components/Config.vue';
import Editor from './components/Editor.vue';
import Help from './components/Help.vue';
import Menubar from './components/Menubar.vue';

export default {
  name: 'app',
  components: {
    Config,
    Editor,
    Help,
    Menubar
  },
  data: function () {
    return {
      store: null,
      config: {
        isActive: false,
        update: false,
        fontSize: 'x8',
        lineNumbers: true,
        lineWrapping: true,
        autosaveInterval: 5000,
        keyMap: 'emacs'
      },
      help: {
        isActive: false
      }
    }
  },
  mounted: function() {
    if (process.env.NODE_ENV === 'test') this.store = store.area('fakeConfig');
    else this.store = store.namespace('config');

    this.restore();
  },
  methods: {
    toggleConfig: function() {
      this.config.isActive = !this.config.isActive;
    },

    saveConfig: function(fontSize, lineNumbers, lineWrapping, autosaveInterval, keyMap) {
      this.config.fontSize = fontSize;
      this.config.lineNumbers = lineNumbers;
      this.config.lineWrapping = lineWrapping;
      this.config.autosaveInterval = parseInt(autosaveInterval, 10);
      this.config.keyMap = keyMap;
      this.config.update = true;
      this.save();
    },

    reflectedConfig: function() {
      this.config.update = false;
    },

    toggleHelp: function() {
      this.help.isActive = !this.help.isActive;
    },

    restore: function() {
      if (this.store.size() === 0) {
        this.save();
      }
      else {
        ['fontSize', 'lineNumbers', 'lineWrapping',
         'autosaveInterval', 'keyMap'].forEach((key) => {
           if (this.store.has(key)) {
             this.config[key] = this.store.get(key);
           }
         });
        this.config.update = true;
      }
    },

    save: function() {
      ['fontSize', 'lineNumbers', 'lineWrapping',
       'autosaveInterval', 'keyMap'].forEach(
        (key) => this.store.set(key, this.config[key]));
    }
  }
}
</script>

<style lang="scss">
html, body, #app {
  height: 100%;
}

$navbar-height: $control-size;
main {
  height: calc(100% - #{$navbar-height} - 1px);
}

/* codemirro is not managed. */
@import '../node_modules/codemirror/lib/codemirror.css';
@import '../node_modules/codemirror/addon/dialog/dialog.css';
@import '../node_modules/codemirror/addon/fold/foldgutter.css';

.CodeMirror {
  height: calc(100% - #{$navbar-height});
  font-size: .8rem;
}

@for $i from 5 through 11 {
  .x#{$i} .CodeMirror {
    font-size: #{$i * 0.1}rem;
  }
}
</style>
