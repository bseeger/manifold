import React from 'react';
import renderer from 'react-test-renderer';
import CoversGrid from '../CoversGrid';
import build from 'test/fixtures/build';

describe("Frontend.ProjectList.CoversGrid component", () => {

  const projects = [build.entity.project("1"), build.entity.project("2")];
  const dispatchMock = jest.fn();

  it('renders correctly', () => {
    const component = renderer.create(
      <CoversGrid
        dispatch={dispatchMock}
        projects={projects}
        authenticated
        favorites={{}}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
