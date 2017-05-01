import React from 'react';
import renderer from 'react-test-renderer';
import Card from '../Card';
import build from 'test/fixtures/build';

describe("Frontend.Resource.Card component", () => {

  const resource = build.entity.resource("1");
  const project = build.entity.project("2");

  it('renders correctly', () => {
    const component = renderer.create(
      <Card
        resource={resource}
        context={project}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

