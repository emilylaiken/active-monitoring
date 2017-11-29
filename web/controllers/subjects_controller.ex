defmodule ActiveMonitoring.SubjectsController do
  use ActiveMonitoring.Web, :controller

  alias ActiveMonitoring.{
    Campaign,
    ChangesetView,
    Repo,
    Subject,
  }

  require Logger

  def index(conn, %{"campaigns_id" => campaign_id}) do
    subjects = Repo.get!(Campaign, campaign_id)
    |> authorize_campaign(conn)
    |> assoc(:subjects)
    |> Repo.all

    render(conn, "index.json", subjects: subjects)
  end

  def show(conn, %{"id" => subject_id, "campaigns_id" => campaign_id}) do
    subject = Repo.get!(Campaign, campaign_id)
      |> authorize_campaign(conn)
      |> assoc(:subjects)
      |> Repo.get!(subject_id)

    render(conn, "show.json", subject: subject)
  end

  def create(conn, %{"subject" => subject_params, "campaigns_id" => campaign_id}) do
    campaign = Repo.get!(Campaign, campaign_id)
    |> authorize_campaign(conn)

    changeset = campaign
    |> build_assoc(:subjects)
    |> Subject.changeset(subject_params)

    case Repo.insert(changeset) do
      {:ok, subject} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", campaigns_subjects_path(conn, :index, campaign))
        |> render("show.json", subject: subject)
      {:error, changeset} ->
        Logger.warn "Error when creating subject: #{inspect changeset}"
        conn
        |> put_status(:unprocessable_entity)
        |> render(ActiveMonitoring.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def update(conn, %{"id" => subject_id, "campaigns_id" => campaign_id, "subject" => subject_params}) do
    subject = Repo.get!(Campaign, campaign_id)
    |> authorize_campaign(conn)
    |> assoc(:subjects)
    |> Repo.get!(subject_id)
    changeset = Subject.changeset(subject, subject_params)

    case Repo.update(changeset) do
      {:ok, subject} ->
        render(conn, "show.json", subject: subject)

      {:error, changeset} ->
        render(conn, ChangesetView, "error.json", changeset: changeset)
    end
  end
end
