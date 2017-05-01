import React from 'react';
import renderer from 'react-test-renderer';
import build from 'test/fixtures/build';
import entity from 'test/fixtures/entity';
import { Provider } from 'react-redux';
import Sharebar from '../Sharebar';

describe("Frontend.Utility.Sharebar component", () => {

  const store = build.store();
  const settings = entity.defaults.settings;

  it('renders correctly', () => {
    const component = renderer.create(
      <Provider store={store} >
        <Sharebar
          dispatch={store.dispatch}
          label="The Label"
          url="the/url"
          message="The Message"
          settings={settings}
        />
      </Provider>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
