import React from 'react';
import renderer from 'react-test-renderer';
import Form from '../Form';
import build from 'test/fixtures/build'
import { Provider } from 'react-redux';

describe("Backend.Category.Form Component", () => {

  const store = build.store();

  it('renders correctly', () => {
    const component = renderer.create(
      <Provider store={store} >
        <Form
          projectId="1"
        />
      </Provider>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
