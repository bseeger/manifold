require "rails_helper"

# rubocop:disable Style/StringLiteralsInInterpolation
RSpec.describe Validator::Html do

  html_config = Rails.configuration.manifold.html_validator
  excluded_css_properties = [
    'position',
    'font-family',
    'overflow',
    'overflow-x',
    'overflow-y',
    'z-index',
    'max-width'
  ]

  let(:validator) { Validator::Html.new }

  it "should wrap top level siblings in a div element" do
    fragment = "<p>AAA</p><p>BBB</p>"
    valid = "<div><p>AAA</p><p>BBB</p></div>"
    expect(validator.validate(fragment).delete("\n")).to eq(valid)
  end

  it "should ensure that an option tag is wrapped in a select tag" do
    fragment = "<div><option></option></div>"
    valid = "<div><select><option></option></select></div>"
    expect(validator.validate(fragment).delete("\n")).to eq(valid)
  end

  it "should not wrap a caption tag in a tbody tag when fixing table markup" do
    fragment = "<table><caption>AAA</caption><tr><td>BBB</td></tr><tr><td>CCC</td>" \
               "</tr></table>"
    valid = "<table><caption>AAA</caption><tbody><tr><td>BBB</td></tr><tr><td>CCC</td>" \
            "</tr></tbody></table>"
    expect(validator.validate(fragment).delete("\n")).to eq(valid)
  end

  it "should wrap sibling TR tags in a TBODY tag" do
    fragment = "<table><tr><td>A</td></tr><tr><td>B</td></tr></table>"
    valid = "<table><tbody><tr><td>A</td></tr><tr><td>B</td></tr></tbody></table>"
    expect(validator.validate(fragment).delete("\n")).to eq(valid)
  end

  it "should not double wrap sibling TR tags in a TBODY tag" do
    fragment = "<table><tbody><tr><td>A</td></tr><tr><td>B</td></tr></tbody></table>"
    expect(validator.validate(fragment).delete("\n")).to eq(fragment)
  end

  it "should not wrap sibling TR tags already in TFOOT in a TBODY tag" do
    fragment = "<table><tfoot><tr><td>A</td></tr><tr><td>B</td></tr></tfoot></table>"
    expect(validator.validate(fragment).delete("\n")).to eq(fragment)
  end

  describe "excluded attributes" do
    html_config.attribute_exclusions.each do |attr|
      it "are removed: #{attr}" do
        fragment = "<div #{attr}=\"value\"></div>"
        expect(validator.validate(fragment).include?("#{attr}=")).to eq(false)
      end
    end
  end

  it "removes height attributes" do
    fragment = "<div height=\"value\"></div>"
    expect(validator.validate(fragment).include?("height=")).to eq(false)
  end

  excluded_css_properties.each do |prop|
    it "should remove blacklisted #{prop} CSS property" do
      fragment = "<div style=\"#{prop}: value\"></div>"
      valid = "<div></div>"
      expect(validator.validate(fragment).delete("\n")).to eq(valid)
    end
  end

  it "should remove an empty css property" do
    fragment = "<div style=\"position: absolute\"></div>"
    valid = "<div></div>"
    expect(validator.validate(fragment).delete("\n")).to eq(valid)
  end

  it "should remove a blacklisted CSS property while keeping a valid property" do
    fragment = "<div style=\"font-weight: bold; position: absolute\"></div>"
    valid = "<div style=\"font-weight: bold\"></div>"
    expect(validator.validate(fragment).delete("\n")).to eq(valid)
  end

  it "should remove max-width style attributes" do
    fragment = "<img style=\"max-width: 650px\">"
    valid = "<img>"
    expect(validator.validate(fragment).delete("\n")).to eq(valid)
  end

  it "should rewrite width attribute to width style" do
    fragment = "<img width=\"650px\">"
    valid = "<img style=\"width: 650px\">"
    expect(validator.validate(fragment).delete("\n")).to eq(valid)
  end

  it "should cap the width" do
    fragment = "<img width=\"700px\">"
    valid = "<img style=\"width: 650px\">"
    expect(validator.validate(fragment).delete("\n")).to eq(valid)
  end

  it "should maintain units when rewriting measured attribute" do
    fragment = "<img width=\"50%\">"
    valid = "<img style=\"width: 50%\">"
    expect(validator.validate(fragment).delete("\n")).to eq(valid)
  end

  it "should default to pixels when rewriting measured attributes that have no unit" do
    fragment = "<img width=\"50\">"
    valid = "<img style=\"width: 50px\">"
    expect(validator.validate(fragment).delete("\n")).to eq(valid)
  end

  it "should rewrite bgcolor attribute to background-color style" do
    fragment = "<img bgcolor=\"red\">"
    valid = "<img style=\"background-color: red\">"
    expect(validator.validate(fragment).delete("\n")).to eq(valid)
  end

  it "should rewrite align attribute to text-align style" do
    fragment = "<img align=\"left\">"
    valid = "<img style=\"text-align: left\">"
    expect(validator.validate(fragment).delete("\n")).to eq(valid)
  end

  it "shouldn't allow color on an a tag" do
    fragment = "<a style=\"color: blue\">link</a>"
    valid = "<a>link</a>"
    expect(validator.validate(fragment).delete("\n")).to eq(valid)
  end

  it "rewrites mapped css values" do
    fragment = "<div style=\"font-size: medium\"></div>"
    valid = "<div style=\"font-size: 1em\"></div>"
    expect(validator.validate(fragment).delete("\n")).to eq(valid)
  end

  it "does not rewrite unmapped css values" do
    fragment = "<div style=\"font-size: .5em\"></div>"
    valid = "<div style=\"font-size: .5em\"></div>"
    expect(validator.validate(fragment).delete("\n")).to eq(valid)
  end
end
