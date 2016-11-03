# Provides a serialization of an event model.
class EventSerializer < ActiveModel::Serializer
  cache key: "event", expires_in: 12.hours
  attributes :event_type, :event_url, :subject_id, :subject_type, :subject_title,
             :subject_subtitle, :attribution_name, :attribution_url,
             :attribution_identifier, :excerpt, :project_id, :event_title,
             :event_subtitle, :created_at
end