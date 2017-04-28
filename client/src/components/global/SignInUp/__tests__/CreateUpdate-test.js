import React from 'react';
import renderer from 'react-test-renderer';
import CreateUpdate from '../CreateUpdate';
import build from 'test/fixtures/build'
import { Provider } from 'react-redux';

describe("GlobalSignInUpCreateUpdate component", () => {

  const store = build.store();

  const user = build.entity.user("1");

  it('renders correctly', () => {
    const component = renderer.create(
      <Provider store={store} >
        <CreateUpdate
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
