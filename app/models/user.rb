class User < ApplicationRecord

  # Connects this user object to Blacklights Bookmarks.
  include Blacklight::User

  # Method added by Blacklight; Blacklight uses #to_s on your
  # user class to get a user-displayable login/identifier for
  # the account.
  def to_s
    email
  end
end
