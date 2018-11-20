import { shallowMount } from '@vue/test-utils';
import jsdom from 'jsdom';
import Editor from '@/components/Editor.vue';
import { SCRATCH, evalExpr } from '@/cmhelper';

describe('Editor.vue', () => {

  let wrapper;

  beforeEach(() => {
    const { JSDOM } = jsdom;
    const doc = (new JSDOM('<!doctype html><html><body></body></html>'));
    global.document = doc;
    global.window = doc.defaultView;
    global.document.body.createTextRange = function() {
      return {
        setEnd: function() {},
        setStart: function() {},
        getBoundingClientRect: function() {
          return { right: 0 };
        },
        getClientRects: function() {
          return {
            length: 0,
            left: 0,
            right: 0
          }
        }
      }
    }
    global.window.focus = jest.fn();

    const pd = {
      autosaveInterval: 5000,
      configUpdate: false,
      lineNumbers: false, lineWrapping: false
    };
    wrapper = shallowMount(Editor, { propsData: pd });
  });

  it('render', () => {
    expect(wrapper.findAll('.CodeMirror').length).toBe(2);
    expect(wrapper.vm.classes.white).toBe('ed-full');
    expect(wrapper.vm.classes.black).toBe('ed-hide');
  });

  it('deleteWindow', () => {
    wrapper.vm.deleteWindow('white');
    expect(wrapper.vm.classes.white).toBe('ed-hide');
    expect(wrapper.vm.classes.black).toBe('ed-full');
  });

  it('deleteOther', () => {
    wrapper.vm.deleteOther('white');
    expect(wrapper.vm.classes.white).toBe('ed-full');
    expect(wrapper.vm.classes.black).toBe('ed-hide');
  });

  it('splitHorizon', () => {
    wrapper.vm.splitHorizon('white');
    expect(wrapper.vm.classes.white).toBe('ed-top');
    expect(wrapper.vm.classes.black).toBe('ed-bottom');
    wrapper.vm.splitHorizon('black');
    expect(wrapper.vm.classes.white).toBe('ed-bottom');
    expect(wrapper.vm.classes.black).toBe('ed-top');
  });

  it('splitVertical', () => {
    wrapper.vm.splitVertical('white');
    expect(wrapper.vm.classes.white).toBe('ed-left');
    expect(wrapper.vm.classes.black).toBe('ed-right');
    wrapper.vm.splitVertical('black');
    expect(wrapper.vm.classes.white).toBe('ed-right');
    expect(wrapper.vm.classes.black).toBe('ed-left');
  });
  
  it('open doc', () => {
    expect(Object.keys(wrapper.vm.docs).length).toBe(1);
    wrapper.vm.openDoc('white', 'js');
    expect(Object.keys(wrapper.vm.docs).length).toBe(2);
    wrapper.vm.openDoc('black', 'js');
    expect(Object.keys(wrapper.vm.docs).length).toBe(2);
    expect(wrapper.vm.names.black).toBe('js');
  });

  it('change doc', () => {
    wrapper.vm.openDoc('white', 'js');
    wrapper.vm.openDoc('black', 'css');
    expect(wrapper.vm.getDocName('white')).toBe('js');
    expect(wrapper.vm.getDocName('black')).toBe('css');
    wrapper.vm.openDoc('white', 'css');
    expect(wrapper.vm.getDocName('white')).toBe('css');

    expect(Object.keys(wrapper.vm.docs).length).toBe(3);
    let count = 0;
    wrapper.vm.docs['js'].iterLinkedDocs(function() { count++; });
    expect(count).toBe(0);
    count = 0;
    wrapper.vm.docs['css'].iterLinkedDocs(function() { count++; });
    expect(count).toBe(1);
  });

  it('delete doc', () => {
    wrapper.vm.openDoc('white', 'js');
    expect(Object.keys(wrapper.vm.docs).length).toBe(2);
    wrapper.vm.deleteDoc('white');
    expect(Object.keys(wrapper.vm.docs).length).toBe(1);
  });

  it('disable delete *scrach*', () => {
    wrapper.vm.openDoc('white', SCRATCH);
    expect(Object.keys(wrapper.vm.docs).length).toBe(1);
    wrapper.vm.deleteDoc('white');
    expect(Object.keys(wrapper.vm.docs).length).toBe(1);
  });

  it('detect mode', () => {
    wrapper.vm.openDoc('white', 'foo');
    expect(wrapper.vm.cms.white.options.mode).toBeUndefined();
    wrapper.vm.openDoc('white', 'foo.js');
    expect(wrapper.vm.cms.white.options.mode).toBe('javascript');
  });

  it('change mode', () => {
    wrapper.vm.openDoc('white', 'foo');
    wrapper.vm.openDoc('black', 'foo');
    expect(wrapper.findAll('.wrapper .cm-comment').length).toBe(0);
    wrapper.vm.changeMode('white', 'javascript');
    expect(wrapper.vm.modes.black).toBe('javascript');
    wrapper.vm.cms.white.getDoc().setValue('// comment');
    expect(wrapper.findAll('.wrapper .cm-comment').length).toBe(2);
  });

  it('disable change mode *scratch*', () => {
    wrapper.vm.changeMode('white', 'javascript');
    expect(wrapper.vm.modes.white).toBe('scheme');
  });

  it('update config', () => {
    expect(wrapper.findAll('.CodeMirror-linenumbers').length).toBe(0);
    wrapper.setProps({ lineNumbers: true });
    wrapper.setProps({ configUpdate: true });
    expect(wrapper.findAll('.CodeMirror-linenumbers').length).toBe(2);
  });

  it('eval lisp expr', () => {
    expect(evalExpr('(+ 1 2)')).toBe(3);
    expect(evalExpr('foo bar (+ 1 2) 9')).toBe(9);
    expect(() => { evalExpr(''); }).toThrow();
    expect(() => { evalExpr('(+ 1 2) foo'); }).toThrow();
  });

  describe('store', () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });

    beforeEach(() => {
      const pd = {
        autosaveInterval: 1,
        configUpdate: false,
        lineNumbers: false, lineWrapping: false
      };
      wrapper = shallowMount(Editor, { propsData: pd });
    });

    afterEach(() => {
      wrapper.destroy();
      wrapper.vm.store.clearAll();
      jest.clearAllTimers();
    });

    it('restore', () => {
      const pd = {
        autosaveInterval: 1,
        configUpdate: false,
        lineNumbers: false, lineWrapping: false
      };

      const wrapper1 = shallowMount(Editor, { propsData: pd });
      wrapper1.vm.openDoc('white', 'foo');
      wrapper1.vm.openDoc('white', 'bar');
      jest.runOnlyPendingTimers();
      let count = wrapper.vm.store.size();
      expect(count).toBe(2);
      wrapper1.destroy();
      jest.clearAllTimers();

      const wrapper2 = shallowMount(Editor, { propsData: pd });
      count = wrapper.vm.store.size();
      expect(count).toBe(2);
      wrapper2.destroy();
    });

    it('add doc', () => {
      jest.runOnlyPendingTimers();
      let count = wrapper.vm.store.size();
      expect(count).toBe(0);

      wrapper.vm.openDoc('white', 'foo');
      jest.runOnlyPendingTimers();
      count = wrapper.vm.store.size();
      expect(count).toBe(1);
    });

    it('delete doc', () => {
      wrapper.vm.openDoc('white', 'foo');
      jest.runOnlyPendingTimers();
      let count = wrapper.vm.store.size();
      expect(count).toBe(1);

      wrapper.vm.deleteDoc('white');
      jest.runOnlyPendingTimers();
      count = wrapper.vm.store.size();
      expect(count).toBe(0);
    });

    it('update doc', () => {
      wrapper.vm.openDoc('white', 'foo');
      jest.runOnlyPendingTimers();
      let count = wrapper.vm.store.size();
      expect(count).toBe(1);

      wrapper.vm.store.clearAll();
      jest.runOnlyPendingTimers();
      count = wrapper.vm.store.size();
      // same hash, no operation
      expect(count).toBe(0);

      wrapper.vm.cms.white.getDoc().setValue('bar');
      jest.runOnlyPendingTimers();
      count = wrapper.vm.store.size();
      expect(count).toBe(1);
    });
  });

});
