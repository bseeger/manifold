import React from 'react';
import renderer from 'react-test-renderer';
import Header from '../Header';
import build from 'test/fixtures/build';
import { Provider } from 'react-redux';

describe("Frontend.Layout.Header component", () => {

  const settings = build.entity.settings();
  const store = build.store();
  const toggleOverlayMock = jest.fn();
  const togglerUserPanelMock = jest.fn();

  it('renders correctly', () => {
    const component = renderer.create(
      <Provider store={store}>
        <Header
          authentication={{ authenticated: false }}
          notifications={{ notifications: {} }}
          commonActions={{
            toggleSignInUpOverlay: toggleOverlayMock,
            toggleUserPanel: togglerUserPanelMock
          }}
          visibility={{ uiPanels: {} }}
          location={{ pathname: "" }}
          settings={settings}
        />
      </Provider>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
