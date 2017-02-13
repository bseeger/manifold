require "rails_helper"

RSpec.describe Resource, type: :model do

  it "has a valid factory" do
    expect(FactoryGirl.build(:resource)).to be_valid
  end

  it "belongs to a project" do
    resource = FactoryGirl.create(:resource)
    expect(resource.project).to be_a Project
  end

  it "is invalid without a title" do
    resource = FactoryGirl.build(:resource, title: "")
    expect(resource).to_not be_valid
  end

  it "has a list of tags" do
    resource = FactoryGirl.create(:resource)
    resource.keywords = "one, two; three"
    resource.save
    expect(resource.tag_list.count).to eq(3)
  end

  it { is_expected.to have_attached_file(:attachment) }

end
