import React from 'react';
import Searchable from '../Searchable';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import ListItem from 'components/backend/Resource/ListItem';
import build from 'test/fixtures/build';

describe("Backend.List.Searchable component", () => {

  const entities = [build.entity.resource("1"), build.entity.resource("2")];
  const pagination = {
    perPage: 1,
    currentPage: 1,
    totalPages: 10,
    totalCount: 2,
    nextPage: 2,
    prevPage: 0
  };
  const pageChangeMock = jest.fn();
  const root = (
    <Searchable
      entities={entities}
      singularUnit="resource"
      pluralUnit="resources"
      pagination={pagination}
      paginationClickHandler={() => pageChangeMock}
      entityComponent={ListItem}
      filterOptions={{
        type: ['TWEET', 'PROJECT_CREATED']
      }}
    />
  );

  it('renders correctly', () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the correct number of ListItems', () => {
    const wrapper = mount(root);
    expect(wrapper.find(wrapper.props().entityComponent)).toHaveLength(2);
  });
});
