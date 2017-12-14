defmodule ActiveMonitoring.Repo.Migrations.AddRetryOptionsToCampaigns do
  use Ecto.Migration

  def change do
    alter table(:campaigns) do
      add :retry_mode, :string
      add :retry_after, :time
      add :retry_after_hours, :boolean
    end
  end
end
