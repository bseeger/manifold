import React from 'react';
import renderer from 'react-test-renderer';
import Thumbnail from '../Thumbnail';
import build from 'test/fixtures/build';

describe("Frontend.Project.Thumbnail component", () => {

  const project = build.entity.project("1");
  const dispatchMock = jest.fn();

  it('renders correctly', () => {
    const component = renderer.create(
      <Thumbnail
        dispatch={dispatchMock}
        project={project}
        favorites={{}}
        authenticated
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
