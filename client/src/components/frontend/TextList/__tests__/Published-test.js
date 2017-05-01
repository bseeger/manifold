import React from 'react';
import renderer from 'react-test-renderer';
import Published from '../Published';
import build from 'test/fixtures/build';

describe("Frontend.TextList.Published component", () => {

  const text = build.entity.text("1");

  it('renders correctly', () => {
    const component = renderer.create(
      <Published
        text={text}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
