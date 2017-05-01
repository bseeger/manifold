import React from 'react';
import renderer from 'react-test-renderer';
import SummaryGrid from '../SummaryGrid';
import build from 'test/fixtures/build';

describe("Frontend.ProjectList.SummaryGrid component", () => {

  const projects = [build.entity.project("1"), build.entity.project("2")];
  const dispatchMock = jest.fn();

  it('renders correctly', () => {
    const component = renderer.create(
      <SummaryGrid
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
