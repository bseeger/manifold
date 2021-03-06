require "rails_helper"

RSpec.describe Text, type: :model do
  let(:new_text) { Text.new }
  let(:text_with_sections) do
    text = FactoryGirl.create(:text)
    text.text_sections << FactoryGirl.create(:text_section, position: 1)
    text.text_sections << FactoryGirl.create(:text_section, position: 2)
    text.text_sections << FactoryGirl.create(:text_section, position: 3)
    text.text_sections << FactoryGirl.create(:text_section, position: 4)
    text.text_sections << FactoryGirl.create(:text_section, position: 5)
    text
  end

  it "has a valid factory" do
    expect(FactoryGirl.build(:text)).to be_valid
  end

  it "correctly returns the section at a certain position" do
    text = text_with_sections
    sections = text.text_sections
    expect(text.section_at(2)).to eq sections.second
  end

  it "has many titles" do
    text = new_text
    2.times { text.titles.build }
    expect(text.titles.length).to be 2
  end

  it "has many text subjects" do
    text = new_text
    2.times { text.text_subjects.build }
    expect(text.text_subjects.length).to be 2
  end

  it "has many ingestion sources" do
    text = new_text
    2.times { text.ingestion_sources.build }
    expect(text.ingestion_sources.length).to be 2
  end

  it "has many text sections" do
    text = new_text
    2.times { text.text_sections.build }
    expect(text.text_sections.length).to be 2
  end

  it "has many stylesheets" do
    text = new_text
    2.times { text.stylesheets.build }
    expect(text.stylesheets.length).to be 2
  end

  it "belongs to a project" do
    text = new_text
    project = Project.new
    text.project = project
    expect(text.project).to be project
  end

  it "belongs to a category" do
    text = new_text
    category = Category.new
    text.category = category
    expect(text.category).to be category
  end

end
