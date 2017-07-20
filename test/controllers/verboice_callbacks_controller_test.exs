defmodule ActiveMonitoring.VerboiceCallbacksControllerTest do
  use ActiveMonitoring.ConnCase
  use ExUnit.Case
  import ActiveMonitoring.Factory

  alias ActiveMonitoring.{Repo, Channel, Campaign, Runtime.Flow}

  describe "on call receive" do
    setup do
      owner = build(:user, email: "test@example.com") |> Repo.insert!
      campaign = build(:campaign, user: owner) |> with_audios |> with_channel |> Repo.insert!
      channel = Repo.get(Channel, campaign.channel_id)
      Flow.handle_status(channel.id, "abc123", "12345678", "")
      {:ok, channel_uuid: channel.uuid, campaign: campaign}
    end

    test "answers a verboice status call", %{conn: conn, channel_uuid: channel_uuid, campaign: campaign} do
      cs = Campaign.changeset(campaign, %{})
      Repo.update(Ecto.Changeset.put_change(cs, :started_at, Ecto.DateTime.utc()))
      conn = post(conn, verboice_callbacks_path(conn, :callback, channel_uuid, CallSid: "abc123"))
      assert conn.status == 200
    end

    test "refuses a call if campaign hasn't begun", %{conn: conn, channel_uuid: channel_uuid} do
      conn = post conn, verboice_callbacks_path(conn, :callback, channel_uuid, CallSid: "abc123")
      assert conn.resp_body == "<Hangup/>"
      assert conn.status == 503
    end
  end
end
