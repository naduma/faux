<template>
  <div class="modal" v-bind:class="{ active: isActive }">
    <a class="modal-overlay" v-on:click="$emit('close')"></a>
    <div class="modal-container">
      <div class="modal-header">
        <a class="btn btn-clear float-right" v-on:click="$emit('close')"></a>
        <div class="h5"><img src="../assets/logo.svg"><span class="text-bold">faux</span> - a toy emacs</div>
      </div>
      <div class="modal-body">
        <div class="h5 subtitle">Features</div>
        <ul>
          <li>No Registration Required</li>
          <li>Emac-like or Vim-like Keybinds</li>
          <li>Auto Save To Web Storage (localStorage)</li>
          <li>Lisp (scheme) REPL</li>
        </ul>
        <div class="h5 subtitle">Shortcut Keys</div>
        <p>For shortcut keys, please see <a href="https://codemirror.net/demo/emacs.html" target="_blank" rel="noopener noreferrer">CodeMirror's page</a>.</p>
        <p>Extra shortcut keys</p>
        <ul class="tab tab-block">
          <li class="tab-item" v-bind:class="{ active: isEmacs }">
            <a v-on:click="isEmacs = true">Emacs</a>
          </li>
          <li class="tab-item" v-bind:class="{ active: !isEmacs }">
            <a v-on:click="isEmacs = false">Vim</a>
          </li>
        </ul>
        <table class="table table-striped table-hover" v-if="isEmacs">
          <thead>
            <tr>
              <th>Shortcut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ctrl-X O</td>
              <td>Select another window</td>
            </tr>
            <tr>
              <td>Ctrl-X 0</td>
              <td>Delete this window</td>
            </tr>
            <tr>
              <td>Ctrl-X 1</td>
              <td>Delete all other windows</td>
            </tr>
            <tr>
              <td>Ctrl-X 2</td>
              <td>Split window, above and below <span class="text-error ml-2">one time only</span></td>
            </tr>
            <tr>
              <td>Ctrl-X 3</td>
              <td>Split window, side by side <span class="text-error ml-2">one time only</span></td>
            </tr>
            <tr>
              <td><ul>
                <ol>Ctrl-X Ctrl-F</ol>
                <ol>Ctrl-X B</ol>
              </ul></td>
              <td>Open or create a document</td>
            </tr>
            <tr>
              <td>Ctrl-X Delete</td>
              <td>Delete this document</td>
            </tr>
            <tr>
              <td>Ctrl-X M</td>
              <td>Change this document mode</td>
            </tr>
            <tr>
              <td><ul>
                <ol>Ctrl-X Ctrl-/</ol>
                <ol>Ctrl-X Ctrl-Z</ol>
                <ol>Ctrl-X Shift-Ctrl--</ol>
                <ol>Ctrl-X Cmd-Z</ol>
              </ul></td>
              <td>Redo <span class="text-error ml-2">not repeat</span></td>
            </tr>
            <tr>
              <td>Ctrl-M</td>
              <td>Insert a newline and auto-indent the new line</td>
            </tr>
            <tr>
              <td>Ctrl-I</td>
              <td>Fold code</td>
            </tr>
            <tr>
              <td>Ctrl-J</td>
              <td>Insert a newline and no-indent the new line
                <div class="text-success">Eval expr in *scratch*</div></td>
            </tr>
          </tbody>
        </table>
        <table class="table table-striped table-hover" v-else>
          <thead>
            <tr>
              <th>Shortcut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><ul>
                <ol>Ctrl-W W</ol>
                <ol>Ctrl-W Ctrl-W</ol>
              </ul></td>
              <td>Select another window</td>
            </tr>
            <tr>
              <td><ul>
                <ol>Ctrl-W Q</ol>
                <ol>Ctrl-W Ctrl-Q</ol>
                <ol>:q[uit]</ol>
                <ol>Ctrl-W C</ol>
                <ol>:clo[se]</ol>
              </ul></td>
              <td>Delete this window</td>
            </tr>
            <tr>
              <td><ul>
                <ol>Ctrl-W O</ol>
                <ol>Ctrl-W Ctrl-O</ol>
                <ol>:on[ly]</ol>
              </ul></td>
              <td>Delete all other windows</td>
            </tr>
            <tr>
              <td><ul>
                <ol>Ctrl-W S</ol>
                <ol>:sp[lit]</ol>
              </ul></td>
              <td>Split window, above and below <span class="text-error ml-2">one time only</span></td>
            </tr>
            <tr>
              <td><ul>
                <ol>Ctrl-W V</ol>
                <ol>Ctrl-W Ctrl-V</ol>
                <ol>:vs[plit]</ol>
              </ul></td>
              <td>Split window, side by side <span class="text-error ml-2">one time only</span></td>
            </tr>
            <tr>
              <td>:e[dit]</td>
              <td>Open or create a document</td>
            </tr>
            <tr>
              <td>Ctrl-W Delete</td>
              <td>Delete this document</td>
            </tr>
            <tr>
              <td>Ctrl-W M</td>
              <td>Change this document mode</td>
            </tr>
            <tr>
              <td><ul>
                <ol>Ctrl-W I</ol>
                <ol>Ctrl-W Ctrl-I</ol>
              </ul></td>
              <td>Fold code</td>
            </tr>
            <tr>
              <td>Ctrl-J</td>
              <td class="text-success">Eval expr in *scratch*</td>
            </tr>
          </tbody>
        </table>
        <div class="h6 subtitle">Version</div>
        <p>0.2.0</p>
      </div>
      <div class="modal-footer">
        <button class="btn" v-on:click="$emit('close')">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isActive: Boolean,
    keyMap: String
  },
  data: function() {
    return {
      isEmacs: false
    }
  },
  watch: {
    isActive: function (newValue) {
      if (!newValue) return;
      this.isEmacs = this.keyMap === 'emacs';
    }
  }
}
</script>

<style scoped lang="scss">
p {
  margin-bottom: .4rem;
}
.modal-header img {
  height: 1.2rem;
  vertical-align: middle;
  margin-right: .4rem;
}
.subtitle {
  margin-bottom: .8rem;
}
.subtitle:not(:first-child) {
  margin-top: 2rem;
}
table ul, table ol {
  margin: 0;
}
</style>
