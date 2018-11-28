import { shallowMount } from '@vue/test-utils'
import Config from '@/components/Config.vue'

describe('Config.vue', () => {

  let wrapper;
  let propsData;

  beforeEach(() => {
    propsData = {
      isActive: false,
      fontSize: 'x8',
      lineNumbers: false,
      lineWrapping: false,
      autosaveInterval: 5,
      keyMap: 'emacs'
    };
    wrapper = shallowMount(Config, { propsData: propsData });
  });

  it('props to local data when isActive is changed.', () => {
    expect(wrapper.vm.fontsize_).toBeNull();
    expect(wrapper.vm.linenum_).toBeNull();
    expect(wrapper.vm.linewrap_).toBeNull();
    expect(wrapper.vm.interval_).toBeNull();
    expect(wrapper.vm.keymap_).toBeNull();

    propsData.isActive = !propsData.isActive;
    wrapper.setProps({ isActive: propsData.isActive });
    expect(wrapper.vm.fontsize_).toBe(propsData.fontSize);
    expect(wrapper.vm.linenum_).toBe(propsData.lineNumbers);
    expect(wrapper.vm.linewrap_).toBe(propsData.lineWrapping);
    expect(wrapper.vm.interval_).toBe(propsData.autosaveInterval);
    expect(wrapper.vm.keymap_).toBe(propsData.keyMap);

    propsData.fontSize = 'x9';
    propsData.lineNumbers = !propsData.lineNumbers;
    propsData.lineWrapping = !propsData.lineWrapping;
    propsData.autosaveInterval = 30;
    propsData.keyMap = 'vim';
    wrapper.setProps(propsData);
    expect(wrapper.vm.fontsize_).not.toBe(propsData.fontSize);
    expect(wrapper.vm.linenum_).not.toBe(propsData.lineNumbers);
    expect(wrapper.vm.linewrap_).not.toBe(propsData.lineWrapping);
    expect(wrapper.vm.interval_).not.toBe(propsData.autosaveInterval);
    expect(wrapper.vm.keymap_).not.toBe(propsData.keyMap);

    wrapper.setProps({ isActive: !propsData.isActive });
    expect(wrapper.vm.fontsize_).toBe(propsData.fontSize);
    expect(wrapper.vm.linenum_).toBe(propsData.lineNumbers);
    expect(wrapper.vm.linewrap_).toBe(propsData.lineWrapping);
    expect(wrapper.vm.interval_).toBe(propsData.autosaveInterval);
    expect(wrapper.vm.keymap_).toBe(propsData.keyMap);
  });

  it('click save button', () => {
    wrapper.find('.btn-primary').trigger('click');
    expect(wrapper.emitted().save).toBeTruthy();
  });

});
