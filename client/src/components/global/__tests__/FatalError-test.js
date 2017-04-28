import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import FatalError from '../FatalError';

describe("GlobalFatalError component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <FatalError
        error={{
          detail: "Kriss Kross'll make you",
          status: 404,
          title: "Jump, jump"
        }}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

