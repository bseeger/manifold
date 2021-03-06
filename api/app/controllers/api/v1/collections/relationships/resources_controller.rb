module Api
  module V1
    module Collections
      module Relationships
        # Responds with resources in a collection
        class ResourcesController < ApplicationController

          before_action :set_collection, only: [:index]

          resourceful! Resource, authorize_options: { except: [:index, :show] } do
            ids = @collection.resources.pluck(:id)
            Resource.filter(
              with_pagination!(resource_filter_params),
              scope: Resource.all.where("resources.id IN (?)", ids)
            )
          end

          # GET /resources
          def index
            @resources = load_zresources
            render_multiple_resources(
              @resources,
              include: %w(collection_resources),
              each_serializer: ResourcePartialSerializer,
              meta: { pagination: pagination_dict(@resources) },
              location: api_v1_collection_relationships_resources_url(@collection)
            )
          end

          def show
            @resource = load_zresource
            render_single_resource(@resource)
          end

          private

          def set_collection
            @collection = Collection.friendly.find(params[:collection_id])
          end

        end
      end
    end
  end
end
