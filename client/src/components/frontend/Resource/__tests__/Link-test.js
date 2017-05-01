import React from 'react';
import renderer from 'react-test-renderer';
import Link from '../Link';
import build from 'test/fixtures/build';

describe("Frontend.Resource.Link component", () => {

  const resource = build.entity.resource("1");

  it('renders correctly', () => {
    const component = renderer.create(
      <Link
        attributes={resource.attributes}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
