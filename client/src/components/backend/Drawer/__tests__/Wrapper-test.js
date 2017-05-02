import React from 'react';
import Wrapper from '../Wrapper';
import { mount } from 'enzyme';

describe("Backend.Drawer.Wrapper Component", () => {

  it('renders correctly', () => {
    const component = mount(
      <Wrapper
        open={true}
        style="backend"
      />
    );

    // Wrapper has event listeners attached to document,
    // so we need to use Enzyme to mock that.
    // debug() outputs the markdown generated.
    let tree = component.debug();
    expect(tree).toMatchSnapshot();
  });

});
