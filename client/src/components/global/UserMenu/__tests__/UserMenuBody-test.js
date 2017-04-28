import React from 'react';
import { shallow, mount, render } from 'enzyme';
import renderer from 'react-test-renderer';
import UserMenuBody from '../UserMenuBody';

describe("GlobalUserMenuBody Component", () => {

  const props = {
    hideUserMenu: () => {},
    startLogout: () => {},
    showLoginOverlay: () => {},
    visible: false
  };

  it('renders correctly', () => {
    const component = renderer.create(
      <UserMenuBody
        {...props}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("has the user-menu class", () => {
    expect(shallow(
      <UserMenuBody
        {...props}
      />
    ).is('.user-menu')).toBe(true)
  });

  it("has the menu-visible class when props.visible is true", () => {
    expect(shallow(
      <UserMenuBody
        {...props}
        visible={true}
      />
    ).is('.menu-visible')).toBe(true)
  });

  it("has the menu-hidden class when props.visible is false", () => {
    expect(shallow(
      <UserMenuBody
        {...props}
        visible={false}
      />
    ).is('.menu-hidden')).toBe(true)
  });

});

