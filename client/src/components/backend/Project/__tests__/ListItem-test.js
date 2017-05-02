import React from 'react';
import renderer from 'react-test-renderer';
import ListItem from '../ListItem';
import build from 'test/fixtures/build';

describe("Backend.Project.ListItem component", () => {

  const project = build.entity.project("1");

  it('renders correctly', () => {
    const component = renderer.create(
      <ListItem
        entity={project}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

