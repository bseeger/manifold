import React from 'react';
import renderer from 'react-test-renderer';
import Thumbnails from '../Thumbnails';
import build from 'test/fixtures/build';

describe("Frontend.ResourceList.Thumbnails Component", () => {

  const resources = [build.entity.resource("1"), build.entity.resource("2")];

  it("renders correctly", () => {
    const component = renderer.create(
      <Thumbnails
        resources={resources}
        projectId="1"
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
