require "rails_helper"

RSpec.shared_context "authenticated request" do

  def token(user, password)
    params = {email: user.email, password: password}
    post api_v1_tokens_path, params: params
    data = JSON.parse(response.body)
    return data.dig("meta", "authToken")
  end

  def build_headers(token)
    {
      "Authorization" => "Bearer #{token}",
      "content-type"=> "application/json"
    }
  end

  let(:author_email) { "author@castironcoding.com" }
  let(:reader_email) { "reader@castironcoding.com" }
  let(:admin_email) { "admin@castironcoding.com" }
  let(:password) { "testTest123" }
  let(:author) { user = FactoryGirl.create(:user, email: author_email, password: password, password_confirmation: password, role: "author") }
  let(:reader) { user = FactoryGirl.create(:user, email: reader_email, password: password, password_confirmation: password, role: "reader") }
  let(:admin) { user = FactoryGirl.create(:user, email: admin_email, password: password, password_confirmation: password, role: "admin") }
  let(:author_token) { token(author, password) }
  let(:reader_token) { token(reader, password) }
  let(:admin_token) { token(admin, password) }
  let(:admin_headers) { build_headers(admin_token) }
  let(:author_headers) { build_headers(author_token) }
  let(:reader_headers) { build_headers(reader_token) }
  let(:anonymous_headers) { { "content-type" => "application/json" } }

end
