import React from 'react';
import renderer from 'react-test-renderer';
import ListItem from '../ListItem';
import build from 'test/fixtures/build';

describe("Backend.User.ListItem component", () => {

  const user = build.entity.user("1");

  it('renders correctly', () => {
    const component = renderer.create(
      <ListItem
        entity={user}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

