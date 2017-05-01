import React from 'react';
import renderer from 'react-test-renderer';
import Detail from '../Detail';
import build from 'test/fixtures/build';
import { Provider } from 'react-redux';

describe("Frontend.Resource.Detail component", () => {

  const store = build.store();

  const resource = build.entity.resource("1");
  const project = build.entity.project("2");

  it('renders correctly', () => {
    const component = renderer.create(
      <Provider store={store} >
        <Detail
          resource={resource}
          projectId={project.id}
          resourceUrl="resource/url"
          projectUrl="project/url"
        />
      </Provider>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
