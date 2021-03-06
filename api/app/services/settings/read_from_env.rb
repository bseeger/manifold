class Settings < ApplicationRecord
  # Read settings from `ENV` and transform into a suitable hash
  # that can be merged into {Settings}.
  class ReadFromEnv < ActiveInteraction::Base
    # Parses an environment variable into its component section & setting names
    KEY_PARSER = /\AMANIFOLD_SETTING_(?<section>[^_]+)_(?<setting>\w+)\z/

    # Proxied here so that we can test easily.
    interface :env, methods: %i(each_with_object), default: proc { ENV }

    # @return [{Symbol => {Symbol => String}}]
    # rubocop:disable Metrics/AbcSize
    def execute
      env.each_with_object({}) do |(key, value), hsh|
        next unless key =~ KEY_PARSER

        section = Regexp.last_match[:section].downcase.to_sym
        setting = Regexp.last_match[:setting].downcase.to_sym

        value = parse_value(section, setting, value)

        unless value.nil?
          hsh[section] ||= {}
          hsh[section][setting] = value
        end
      end
    end
    # rubocop:enable Metrics/AbcSize

    private

    # @param [Symbol] section
    # @param [Symbol] setting
    # @param [String] value
    # @return [String]
    def parse_value(section, setting, value)
      if section == :secrets
        parse_secret_value setting, value
      else
        value
      end
    end

    # @param [String] setting
    # @param [String] value
    # @return [String]
    def parse_secret_value(setting, value)
      case setting
      when :google_private_key
        # The value is potentially stored in the filesystem.
        key_path = Rails.application.root.join("..", value)

        # If it is not found, we do not want to store anything
        # under this key.
        key_path.file? ? key_path.read : nil
      else
        value
      end
    end
  end
end
