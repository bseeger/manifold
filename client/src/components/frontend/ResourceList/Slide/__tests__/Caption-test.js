jest.mock('velocity-react');

import React from 'react';
import renderer from 'react-test-renderer';
import Caption from '../Caption';
import build from 'test/fixtures/build';

describe("Frontend.ResourceList.Caption component", () => {

  const resource = build.entity.resource("1");

  it('renders correctly', () => {
    const component = renderer.create(
      <Caption
        resource={resource}
        collectionId="1"
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
