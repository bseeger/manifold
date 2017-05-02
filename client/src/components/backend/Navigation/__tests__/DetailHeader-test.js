import React from 'react';
import renderer from 'react-test-renderer';
import DetailHeader from '../DetailHeader';

describe("Backend.Navigation.DetailHeader component", () => {

  it('renders correctly', () => {
    const component = renderer.create(
      <DetailHeader
        title="Rowan"
        subtitle="World's Greatest Dog"
        type="project"
        breadcrumb={[{
          label: "All Projects",
          path: "/backend"
        }]}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

