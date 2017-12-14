defmodule ActiveMonitoring.CampaignsView do
  use ActiveMonitoring.Web, :view

  def render("index.json", %{campaigns: campaigns}) do
    rendered = campaigns |> Enum.map(fn(campaign) ->
      render_one(campaign)
    end)
    %{data: rendered}
  end


  def render("show.json", %{campaign: campaign, calls: calls, subjects: subjects}) do
    data = Map.merge(render_one(campaign), %{calls: calls})
    data = Map.merge(data, %{subjects: subjects})
    %{data: data}
  end

  def render("show.json", %{campaign: campaign}) do
    %{data: render_one(campaign)}
  end

  defp render_one(campaign) do
    %{
      id: campaign.id,
      name: campaign.name,
      symptoms: campaign.symptoms,
      forwarding_number: campaign.forwarding_number,
      forwarding_condition: campaign.forwarding_condition,
      audios: campaign.audios,
      langs: campaign.langs,
      additional_information: campaign.additional_information,
      started_at: campaign.started_at,
      monitor_duration: campaign.monitor_duration,
      retry_config: campaign.retry_config,
      retry_mode: campaign.retry_mode,
      retry_after: campaign.retry_after,
      retry_after_hours: campaign.retry_after_hours,
      timezone: campaign.timezone,
      channel: campaign.channel
    }
  end
end
