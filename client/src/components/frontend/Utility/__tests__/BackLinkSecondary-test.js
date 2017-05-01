import React from 'react';
import renderer from 'react-test-renderer';
import BackLinkSecondary from '../BackLinkSecondary';

describe("Frontend.Utility.BackLinkSecondary component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <BackLinkSecondary
        link="test/link"
        title="test"
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
