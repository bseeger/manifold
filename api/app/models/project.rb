# The project model is the primary unit of Manifold.
class Project < ActiveRecord::Base
  
  has_many :texts
  belongs_to :published_text, class_name: "Text", optional: true
  has_many :text_categories, -> { for_text }, class_name: "Category"
  has_many :resource_categories, -> { for_resource }, class_name: "Category"
  has_many :favorites, as: :favoritable, dependent: :destroy
  include Collaborative
  include MoneyAttributes
  money_attributes :purchase_price


  has_attached_file :avatar,
                    include_updated_timestamp: false,
                    default_url: "",
                    url: "/system/:class/:uuid_partition/:id/:style_:filename",
                    styles: {
                      thumb: ["x246", :png]
                    }

  has_attached_file :cover,
                    include_updated_timestamp: false,
                    default_url: "",
                    url: "/system/:class/:uuid_partition/:id/:style_:filename",
                    styles: {
                      hero: ["800", :png]
                    }

  has_attached_file :hero,
                    include_updated_timestamp: false,
                    url: "/system/:class/:uuid_partition/:id/:style_:filename",
                    default_url: "",
                    styles: { background: ["1800", :jpg] }

  validates_attachment_content_type :cover, :hero, :avatar, content_type: %w(
    image/gif
    image/jpeg
    image/jpg
    image/png
    image/svg+xml
  )
  validates_attachment_file_name :cover, :hero, :avatar, matches: [
    /gif\Z/,
    /jpe?g\Z/,
    /png\Z/,
    /svg\Z/
  ]
  validates :purchase_url, url: { allow_nil: true }

  def self.filtered(filters)
    projects = Project.all
    defaults = { featured: nil }
    filters = defaults.merge(filters[:filter].to_h.symbolize_keys || {})
    projects = projects.where(featured: true) if filters[:featured] == "true"
    projects = projects.where(featured: false) if filters[:featured] == "false"
    projects
  end

  def avatar_url
    return nil if avatar.url(:thumb).blank?
    ENV["API_DOMAIN"] + avatar.url(:thumb)
  end

  def cover_url
    return nil if cover.url(:hero).blank?
    ENV["API_DOMAIN"] + cover.url(:hero)
  end

  def hero_url
    return nil if hero.url(:background).blank?
    ENV["API_DOMAIN"] + hero.url(:background)
  end
end
