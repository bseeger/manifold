import React from 'react';
import renderer from 'react-test-renderer';
import AllLink from '../AllLink';

describe("Frontend.Event.AllLink Component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <AllLink
        count={5}
        threshold={3}
        projectId="1"
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
