# config valid only for current version of Capistrano
lock "3.4.1"
set :application, "Manifold"
set :repo_url, "git@github.com:ManifoldScholar/manifold.git"
set :deploy_to, "/home/manifold/deploy"
set :scm, :git
set :format, :pretty
set :rails_env, "production"

# Linked Files
set :linked_files, fetch(:linked_files, []).push(".env")
set :linked_dirs, fetch(:linked_dirs, []).push(
  "api/public/system", "client/node_modules", "import", "api/tmp", "config/keys"
)

# Ruby & Bundler
set :bundle_gemfile, -> { release_path.join("api").join("Gemfile") }
set :rbenv_type, :user
set :rbenv_ruby, File.read("api/.ruby-version").strip
set :rbenv_prefix, "RBENV_ROOT=#{fetch(:rbenv_path)} RBENV_VERSION=#{fetch(:rbenv_ruby)} #{fetch(:rbenv_path)}/bin/rbenv exec"

# Yarn
set :yarn_target_path, -> { release_path.join("client") }
set :yarn_flags, "--production"

# rubocop:disable Metrics/LineLength
namespace :deploy do

  services = %w(manifold_client manifold_api manifold_scheduler manifold_workers manifold_cable)

  after :updated, :build_client_dist do
     on roles(:app), in: :groups, limit: 3, wait: 10 do
      with path: "node_modules/.bin:$PATH" do
        within "#{release_path}/client" do
          execute :yarn, "run dist"
        end
      end
    end
  end

  desc "Stop Services"
  task :start do
    on roles(:app), in: :sequence, wait: 5 do
      services.each { |cmd| execute "sudo systemctl start #{cmd}" }
    end
  end

  desc "Stop Services"
  task :stop do
    on roles(:app), in: :sequence, wait: 5 do
      services.each { |cmd| execute "sudo systemctl stop #{cmd}" }
    end
  end

  desc "Restart Services"
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      services.each { |cmd| execute "sudo systemctl restart #{cmd}" }
    end
  end

  desc "Reseed the database"
  task :reseed do
    on roles(:app), in: :sequence, wait: 5 do
      with path: "./bin:$PATH" do
        within "#{current_path}/api" do
          execute :rails, "db:seed"
        end
      end
    end
  end

  after :published, :reseed
  after :published, :restart

end

# See https://github.com/yarnpkg/yarn/issues/761
# When this issue is resolved, we can likely remove this hack.
namespace :yarn do
  desc "Remove dev dependencies from package.json"
  task :remove_dev_deps do
    on roles(:app), in: :groups, limit: 3, wait: 10 do
      with path: "node_modules/.bin:$PATH" do
        within "#{release_path}/client" do
          execute "cd #{release_path}/client && jq 'del(.devDependencies)' package.json > tmp.json && mv tmp.json package.json"
        end
      end
    end
  end
  before :install, :remove_dev_deps
end

namespace :upload do
  task :projects do
    on roles(:app) do
      system("rsync -azv --progress ./import/ #{host.username}@#{host.hostname}:/home/manifold/deploy/shared/import/")
    end
  end
end

namespace :import do
  task :projects, :project do |t, args|
    project = args[:project]
    path = "../import"
    task = project ? "import:project" : "import:project"
    path << "/#{project}" if project
    on roles(:app) do
      with path: "./bin:$PATH" do
        within "#{current_path}/api" do
          cmd = "#{task}[\"#{path}\"]"
          execute :rails, cmd
        end
      end
    end
  end
end
# rubocop:enable Metrics/LineLength
