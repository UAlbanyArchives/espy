Rails.application.routes.draw do

  scope 'espy' do

  concern :range_searchable, BlacklightRangeLimit::Routes::RangeSearchable.new
  mount Blacklight::Engine => '/'
  #    concern :marc_viewable, Blacklight::Marc::Routes::MarcViewable.new

  root to: "catalog#index"
    concern :searchable, Blacklight::Routes::Searchable.new

  resource :catalog, only: [:index], as: 'catalog', path: '/catalog', controller: 'catalog' do
    concerns :searchable
    concerns :range_searchable

  end

  concern :exportable, Blacklight::Routes::Exportable.new

  resources :solr_documents, only: [:show], path: '/catalog', controller: 'catalog' do
    #concerns [:exportable, :marc_viewable]
  end
  
  get "/manifest" => "catalog#manifest"
  
  resources :bookmarks do
    concerns :exportable

    collection do
      delete 'clear'
    end
  end

  get "fields", to: "fields#index"

  end
	# For docker healthcheck
    get 'health', to: proc { [200, {}, ['OK']] }

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
