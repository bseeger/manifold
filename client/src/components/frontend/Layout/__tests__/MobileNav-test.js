import React from 'react';
import renderer from 'react-test-renderer';
import MobileNav from '../MobileNav';

describe("Frontend.Layout.MobileNav component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <MobileNav
        location={{}}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

