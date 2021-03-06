class UserAuthorizer < ApplicationAuthorizer

  def self.creatable_by?(_user)
    true
  end

  def self.updatable_by?(user)
    user.admin?
  end

  def self.readable_by?(user)
    user.admin?
  end

  def self.deletable_by?(user)
    user.admin?
  end

  def creatable_by?(user)
    resource == user || user.admin?
  end

  def updatable_by?(user)
    resource == user || user.admin?
  end

  def readable_by?(user)
    resource == user || user.admin?
  end

  def deletable_by?(user)
    user.admin?
  end

end
