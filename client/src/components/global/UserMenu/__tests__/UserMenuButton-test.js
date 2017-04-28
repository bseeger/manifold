import React from 'react';
import renderer from 'react-test-renderer';
import UserMenuButton from "../UserMenuButton";

describe("GlobalUserMenuBody Component", () => {

  const props = {
    showLoginOverlay: jest.fn(),
    toggleUserMenu: jest.fn(),
    visible: false
  };

  it('renders correctly', () => {
    const component = renderer.create(
      <UserMenuButton
        {...props}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

