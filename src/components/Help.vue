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
          <li>Emac-like Keybinds</li>
          <li>Auto Save To Web Storage (localStorage)</li>
          <li>Lisp (scheme) REPL</li>
        </ul>
        <div class="h5 subtitle">Shortcut Keys</div>
        <p>For shortcut keys, please see <a href="https://codemirror.net/demo/emacs.html" target="_blank" rel="noopener noreferrer">CodeMirror's page</a>.</p>
        <p>Extra shortcut keys</p>
        <table class="table table-striped table-hover">
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
              <td>Ctrl-X Ctrl-F</td>
              <td>Open or create a document</td>
            </tr>
            <tr>
              <td>Ctrl-X B</td>
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
              <td>Ctrl-X Ctrl-/</td>
              <td>Redo <span class="text-error ml-2">not repeat</span></td>
            </tr>
            <tr>
              <td>Ctrl-X Ctrl-Z</td>
              <td>Redo <span class="text-error ml-2">not repeat</span></td>
            </tr>
            <tr>
              <td>Ctrl-X Shift-Ctrl--</td>
              <td>Redo <span class="text-error ml-2">not repeat</span></td>
            </tr>
            <tr>
              <td>Ctrl-X Cmd-Z</td>
              <td>Redo <span class="text-error ml-2">not repeat</span></td>
            </tr>
            <tr>
              <td>Ctrl-M</td>
              <td>Insert a newline and auto-indent the new line</td>
            </tr>
            <tr>
              <td>Ctrl-C</td>
              <td>Fold code</td>
            </tr>
            <tr>
              <td>Ctrl-J</td>
              <td>Insert a newline and no-indent the new line
                <div class="text-success">Eval expr in *scratch*</div></td>
            </tr>
          </tbody>
        </table>
        <div class="h6 subtitle">Version</div>
        <p>0.1.0</p>
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
    isActive: Boolean
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
</style>
