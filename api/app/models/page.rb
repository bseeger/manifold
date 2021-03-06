# Model representing a page of content
class Page < ApplicationRecord

  # Authority
  include Authority::Abilities

  # Concerns
  include FriendlyId
  include TrackedCreator

  # Validation
  validates :title, presence: true
  validates :slug, presence: true, uniqueness: true

  # Misc
  friendly_id :nav_title, use: :slugged

  def to_s
    title
  end

end
