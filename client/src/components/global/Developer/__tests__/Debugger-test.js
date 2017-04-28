import React from 'react';
import renderer from 'react-test-renderer';
import Debugger from '../Debugger';
import build from 'test/fixtures/build';

describe("GlobalDeveloperDebugger component", () => {

  const project = build.entity.project("1");

  it('renders correctly', () => {
    const component = renderer.create(
      <Debugger
        object={project}
        label="Project"
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

