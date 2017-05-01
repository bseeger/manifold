import React from 'react';
import renderer from 'react-test-renderer';
import Grouped from '../Grouped';
import build from 'test/fixtures/build';

describe("Frontend.TextList.Grouped component", () => {

  const textA = build.entity.text("1");
  const textB = build.entity.text("2");
  const category = build.entity.category("3");
  textA.relationships.category = category;
  textB.relationships.category = category;

  const texts = [textA, textB];
  const categories = [category];

  it('renders correctly', () => {
    const component = renderer.create(
      <Grouped
        texts={texts}
        categories={categories}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
