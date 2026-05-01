module ApplicationHelper

	def espy_thumbnail_tag(document, image_options = {})
		thumbnail_value = Array(document['thumbnail_ss']).first
		return if thumbnail_value.blank?

		image_url = thumbnail_value.to_s.split(';').first
		image_tag "#{image_url}?file=thumbnail", image_options
	end

	def advanced_search_path
		search_action_url(action: 'advanced_search')
	end

	def container_classes
		'container'
	end

	def render_document_main_content_partial(document = nil)
		render 'catalog/document', document: (document || @document), document_counter: 0
	end

	def render_document_sidebar_partial(document = nil)
		render 'catalog/document_sidebar', document: (document || @document)
	end
end
