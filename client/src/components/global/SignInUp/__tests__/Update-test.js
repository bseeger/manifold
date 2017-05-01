import React from 'react';
import renderer from 'react-test-renderer';
import Update from '../Update';
import build from 'test/fixtures/build';
import { Provider } from 'react-redux';

describe("Global.SignInUp.Update component", () => {

  const store = build.store();

  const user = build.entity.user("1");

  it('renders correctly', () => {
    const component = renderer.create(
      <Provider store={store} >
        <Update
          authentication={{
            currentUser: user
          }}
        />
      </Provider>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
