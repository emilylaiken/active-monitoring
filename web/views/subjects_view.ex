defmodule ActiveMonitoring.SubjectsView do
  use ActiveMonitoring.Web, :view

  def render("index.json", %{subjects: subjects}) do
    rendered = subjects |> Enum.map(fn(subject) ->
      render_one(subject)
    end)
    %{data: rendered}
  end

  def render("show.json", %{subject: subject}) do
    %{data: render_one(subject)}
  end

  defp render_one(subject) do
    %{
      id: subject.id,
      campaign_id: subject.campaign_id,
      phone_number: subject.phone_number,
    }
  end
end
