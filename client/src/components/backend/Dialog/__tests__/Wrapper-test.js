import React from 'react';
import { mount } from 'enzyme';
import Wrapper from '../Wrapper';

describe("Backend.Dialog.Wrapper Component", () => {

  const child = (
    <div>How is babby formed?</div>
  );

  it('renders correctly', () => {
    const component = mount(
      <Wrapper
        className="dialog-confirm"
        maxWidth={400}
        children={child}
      />
    );

    // Wrapper has event listeners attached to document,
    // so we need to use Enzyme to mock that.
    // debug() outputs the markdown generated.
    let tree = component.debug();
    expect(tree).toMatchSnapshot();
  });

});
