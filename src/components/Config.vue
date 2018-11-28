<template>
  <div class="modal modal-sm" v-bind:class="{ active: isActive }">
    <span class="modal-overlay"></span>
    <div class="modal-container">
      <div class="modal-header">
        <a class="btn btn-clear float-right" v-on:click="$emit('close')"></a>
        <div class="h5">Config</div>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Font</label>
          <select class="form-select" v-model="fontsize_">
            <option value="x5">xx-small</option>
            <option value="x6">x-small</option>
            <option value="x7">small</option>
            <option value="x8">medium</option>
            <option value="x9">large</option>
            <option value="x10">x-large</option>
            <option value="x11">xx-large</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-switch">
            <input type="checkbox" v-model="linenum_"><i class="form-icon"></i> Show LineNumbers
          </label>
        </div>
        <div class="form-group">
          <label class="form-switch">
            <input type="checkbox" v-model="linewrap_"><i class="form-icon"></i> Enable LineWrapping
          </label>
        </div>
        <div class="form-group">
          <label class="form-label">AutoSave Interval (second)</label>
          <select class="form-select" v-model="interval_">
            <option value=1000>1</option>
            <option value=5000>5</option>
            <option value=10000>10</option>
            <option value=30000>30</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Keymap</label>
          <select class="form-select" v-model="keymap_">
            <option value="emacs">Emacs</option>
            <option value="vim">Vim</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" v-on:click="save">Save</button>
        <button class="btn" v-on:click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isActive: Boolean,
    fontSize: String,
    lineNumbers: Boolean,
    lineWrapping: Boolean,
    autosaveInterval: Number,
    keyMap: String
  },
  data: function () {
    return {
      fontsize_: null,
      linenum_: null,
      linewrap_: null,
      interval_: null,
      keymap_: null
    }
  },
  watch: {
    isActive: function () {
      this.fontsize_ = this.fontSize;
      this.linenum_ = this.lineNumbers;
      this.linewrap_ = this.lineWrapping;
      this.interval_ = this.autosaveInterval;
      this.keymap_ = this.keyMap;
    }
  },
  methods: {
    save: function() {
      this.$emit(
        'save', this.fontsize_, this.linenum_, this.linewrap_,
        this.interval_, this.keymap_
      );
      this.$emit('close');
    }
  }
}
</script>

<style scoped lang="scss">
.modal-footer button:not(:first-child) {
  margin-left: .4rem;
}
</style>
