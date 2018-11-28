import { shallowMount } from '@vue/test-utils'
import App from '@/App.vue'

describe('App.vue', () => {

  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(App);
  });

  afterEach(() => {
    wrapper.vm.store.clearAll();
  });

  it('initial', () => {
    const count = wrapper.vm.store.size();
    expect(count).toBe(5);
    expect(wrapper.vm.store.get('fontSize')).toBe('x8');
  });

  it('restore', () => {
    wrapper.vm.config.fontSize = 'x10';
    wrapper.vm.save();

    wrapper.vm.restore();
    expect(wrapper.vm.store.get('fontSize')).toBe('x10');
  });

  it('save', () => {
    wrapper.vm.config.fontSize = 'x10';
    wrapper.vm.save();
    expect(wrapper.vm.store.get('fontSize')).toBe('x10');
  });

});
