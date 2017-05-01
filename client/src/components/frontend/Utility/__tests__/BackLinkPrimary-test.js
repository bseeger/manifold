import React from 'react';
import renderer from 'react-test-renderer';
import BackLinkPrimary from '../BackLinkPrimary';

describe("Frontend.Utility.BackLinkPrimary component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <BackLinkPrimary
        link="test/link"
        title="test"
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
