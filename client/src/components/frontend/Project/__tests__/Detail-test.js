import React from 'react';
import renderer from 'react-test-renderer';
import Detail from '../Detail';
import build from 'test/fixtures/build';

describe("Frontend.Project.Detail component", () => {

  const project = build.entity.project("1");
  const dispatchMock = jest.fn();

  it('renders correctly', () => {
    const component = renderer.create(
      <Detail
        dispatch={dispatchMock}
        project={project}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

