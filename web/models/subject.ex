defmodule ActiveMonitoring.Subject do
  use ActiveMonitoring.Web, :model

  alias ActiveMonitoring.{Call, Campaign, Repo, CallAnswer, Subject}
  import Ecto.Query
  import Timex

  schema "subjects" do
    field :phone_number, :string
    field :registration_identifier, :string

    has_many :calls, Call
    belongs_to :campaign, Campaign

    timestamps()
  end

  def changeset(model, params \\ %{}) do
    model
    |> cast(params, [:phone_number, :registration_identifier, :campaign_id])
    |> validate_required([:registration_identifier])
    |> unique_constraint(:registration_identifier, name: :subjects_campaign_id_registration_identifier_index)
    |> assoc_constraint(:campaign)
  end

  def enroll_date(%Subject{inserted_at: inserted_at}) do
    inserted_at
  end

  def first_call_date(%Subject{id: subject_id, campaign_id: campaign_id}) do
    call = Repo.one(from c in Call,
            where: c.subject_id == ^subject_id and c.campaign_id == ^campaign_id,
            order_by: [asc: c.inserted_at],
            limit: 1)

    case call do
      nil -> nil
      %Call{inserted_at: inserted_at} -> inserted_at
    end
  end

  def last_call_date(%Subject{id: subject_id, campaign_id: campaign_id}) do
    call = Repo.one(from c in Call,
            where: c.subject_id == ^subject_id and c.campaign_id == ^campaign_id,
            order_by: [desc: c.inserted_at],
            limit: 1)

    case call do
      nil -> nil
      %Call{inserted_at: inserted_at} -> inserted_at
    end
  end

  def last_successful_call_date(%Subject{id: subject_id, campaign_id: campaign_id}) do
    call = Repo.one(from c in Call,
            where: c.subject_id == ^subject_id and c.campaign_id == ^campaign_id and c.current_step == "thanks",
            order_by: [desc: c.updated_at],
            limit: 1)

    case call do
      nil -> nil
      %Call{updated_at: updated_at} -> updated_at
    end
  end

  def active_case(%Subject{id: subject_id, campaign: campaign} = subject, now) do
    subject_enroll_date = Subject.enroll_date(subject)

    final_enroll_date = subject_enroll_date |> Timex.shift(days: campaign.monitor_duration)
    Timex.compare(now, subject_enroll_date) > 0 && Timex.compare(final_enroll_date, now) > 0
  end

  def active_case(subject) do
    active_case(subject, Timex.now())
  end

  def stats(campaign_id) do
    campaign = Repo.get(Campaign, campaign_id)
    cases =
      case campaign.forwarding_condition do
        "all" ->
          calls_with_at_least_one = Repo.all(from c in Call,
            join: ca in CallAnswer, on: ca.call_id == c.id,
            join: s in Subject, on: c.subject_id == s.id,
            where: ca.response == ^true, select: [c.id, s.id])
          chunked = Enum.chunk_by(calls_with_at_least_one, fn([c,_]) -> c end)
          both_yes = Enum.filter(chunked, fn(l) -> Enum.count(l) > 1 end)
          subjects = Enum.map(both_yes, fn([[_,a],_]) -> a end)
          Enum.count(Enum.uniq(subjects))
        _ ->
          Repo.one(from c in Call,
            join: ca in CallAnswer, on: ca.call_id == c.id,
            where: ca.response == ^true, select: count("id"))
      end
    total_subjects = Repo.one(from s in Subject, select: count("id"), where: s.campaign_id == ^campaign_id)
    timeline = Repo.all((from s in Subject, where: s.inserted_at >= ^subtract(now(), Timex.Duration.from_days(90))) |> Call.by_week(:inserted_at))
    %{cases: cases, total_subjects: total_subjects, timeline: timeline}
  end
end
