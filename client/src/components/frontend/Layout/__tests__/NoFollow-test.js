import React from 'react';
import renderer from 'react-test-renderer';
import NoFollow from '../NoFollow';

describe("Frontend.Layout.NoFollow component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <NoFollow />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

