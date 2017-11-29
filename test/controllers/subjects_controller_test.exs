defmodule ActiveMonitoring.SubjectsControllerTest do
  use ActiveMonitoring.ConnCase
  use ExUnit.Case
  import ActiveMonitoring.Factory

  alias ActiveMonitoring.{Repo}

  setup %{conn: conn} do
    user = build(:user, email: "test@example.com") |> Repo.insert!
    campaign = build(:campaign, user: user) |> Repo.insert!

    other_user = build(:user, email: "other@example.com") |> Repo.insert!
    other_campaign = build(:campaign, user: other_user) |> Repo.insert!

    other_subject = build(:subject, campaign: other_campaign) |> Repo.insert!

    {:ok, conn: conn, user: user, campaign: campaign, other_campaign: other_campaign, other_subject: other_subject}
  end

  defp with_logged_in_user %{conn: conn, user: user} do
    conn = conn |> assign(:current_user, user)
    [conn: conn]
  end

  defp with_campaign_subjects %{campaign: campaign} do
    subject = build(:subject, campaign: campaign) |> Repo.insert!
    for _ <- 1..3, do: build(:subject, campaign: campaign) |> Repo.insert!
    [subject: subject]
  end

  describe "campaign without subjects" do
    setup [:with_logged_in_user]

    test "shows an empty index", %{conn: conn, campaign: campaign} do
      response = conn |> get(campaigns_subjects_path(conn, :index, campaign)) |> json_response(200)
      assert response["data"] == []
    end
  end

  describe "campaign with subjects" do
    setup [:with_logged_in_user, :with_campaign_subjects]

    test "lists all subjects", %{conn: conn, campaign: campaign, subject: subject} do
      response = conn |> get(campaigns_subjects_path(conn, :index, campaign)) |> json_response(200)
      assert length(response["data"]) == 4
      [subject1, subject2 | _] = response["data"]
      assert subject1["phoneNumber"] == subject.phone_number
      assert subject1["phoneNumber"] != subject2["phoneNumber"]
    end

    test "shows a single subject", %{conn: conn, campaign: campaign, subject: subject} do
      response = conn |> get(campaigns_subjects_path(conn, :show, campaign, subject)) |> json_response(200)
      assert response["data"]["phoneNumber"] == subject.phone_number
    end

    test "creates a subject", %{conn: conn, campaign: campaign} do
      response = conn |> get(campaigns_subjects_path(conn, :index, campaign)) |> json_response(200)
      assert length(response["data"]) == 4

      phone_number = "4440000"

      response = conn
      |> post(campaigns_subjects_path(conn, :create, campaign), subject: %{phone_number: phone_number})
      |> json_response(201)

      assert response["data"]["id"]
      assert response["data"]["phoneNumber"] == phone_number
      assert response["data"]["campaignId"] == campaign.id

      response = conn |> get(campaigns_subjects_path(conn, :index, campaign)) |> json_response(200)
      assert length(response["data"]) == 5
    end

    test "updates a subject", %{conn: conn, campaign: campaign, subject: subject} do
      phone_number = "4440000"
      assert subject.phone_number != phone_number

      response = conn
      |> patch(campaigns_subjects_path(conn, :update, campaign, subject), subject: %{phone_number: phone_number})
      |> json_response(200)

      assert response["data"]["id"] == subject.id
      assert response["data"]["phoneNumber"] == phone_number
      assert response["data"]["campaignId"] == campaign.id
    end
  end

  describe "access control" do
    setup [:with_logged_in_user]

    test "doesn't allow to index another user's campaign subjects", %{conn: conn, other_campaign: other_campaign} do
      assert_error_sent 403, fn ->
        conn |> get(campaigns_subjects_path(conn, :index, other_campaign))
      end
    end

    test "not found when trying to list a campaign that doesn't exist subjects", %{conn: conn} do
      assert_error_sent 404, fn ->
        conn |> get(campaigns_subjects_path(conn, :index, -1))
      end
    end

    test "doesn't allow to create another user's campaign subject", %{conn: conn, other_campaign: other_campaign} do
      assert_error_sent 403, fn ->
        conn |> post(campaigns_subjects_path(conn, :create, other_campaign), subject: %{phone_number: "4444333221"})
      end
    end

    test "doesn't allow to update another user's campaign subject", %{conn: conn, other_campaign: other_campaign, other_subject: other_subject} do
      assert_error_sent 403, fn ->
        conn |> patch(campaigns_subjects_path(conn, :update, other_campaign, other_subject), subject: %{phone_number: "4444333221"})
      end
    end
  end
end
