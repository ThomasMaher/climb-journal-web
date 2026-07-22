# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

tom = User.create(id: 1, first_name: 'Tom', last_name: 'Maher')

first_session = Session.create(gym_name: 'Vital', date: '2025-12-10', user_id: tom.id)
Session.create(gym_name: 'GP81', date: '2026-05-10', user_id: tom.id)
Session.create(gym_name: 'Metrorock', date: Time.zone.today - 16.days, user_id: tom.id)
last_session = Session.create(gym_name: 'Vital', date: '2026-07-19', user_id: tom.id)

b1 = Boulder.create(
  nickname: 'Salmon-reach',
  vgrade_range_min: 6,
  vgrade_range_max: 7,
  self_grade: 7,
  incline: 0,
  boulder_type: 'Indoor'
)
b4 = Boulder.create(
  nickname: 'volume-slab',
  vgrade_range_min: 4,
  vgrade_range_max: 5,
  self_grade: 4,
  incline: 0,
  boulder_type: 'Indoor'
)
b2 = Boulder.create(
  nickname: 'Blue-swing-dyno',
  vgrade_range_min: 4,
  vgrade_range_max: 5,
  self_grade: 4,
  incline: 35,
  boulder_type: 'Indoor'
)
b3 = Boulder.create(
  nickname: 'Spooky-yellow-slab',
  vgrade_range_min: 6,
  vgrade_range_max: 7,
  self_grade: 6,
  incline: 0,
  boulder_type: 'Indoor'
)
b5 = Boulder.create(
  nickname: 'Yellow-volume-slab',
  vgrade_range_min: 1,
  vgrade_range_max: 2,
  self_grade: 3,
  incline: 0,
  boulder_type: 'Indoor'
)

sc = SessionClimb.create(
  session_id: last_session.id,
  user_id: tom.id,
  boulder_id: b1.id,
  attempts: 7,
  percent_finished: 25,
  warmup: false,
)

SessionClimb.create(
  session_id: last_session.id,
  user_id: tom.id,
  boulder_id: b2.id,
  attempts: 3,
  percent_finished: 100,
  warmup: false,
)
SessionClimb.create(
  session_id: last_session.id,
  user_id: tom.id,
  boulder_id: b3.id,
  attempts: 3,
  percent_finished: 100,
  warmup: false,
)
SessionClimb.create(
  session_id: last_session.id,
  user_id: tom.id,
  boulder_id: b4.id,
  attempts: 4,
  percent_finished: 100,
  warmup: false,
)
SessionClimb.create(
  session_id: last_session.id,
  user_id: tom.id,
  boulder_id: b5.id,
  attempts: 2,
  percent_finished: 100,
  warmup: true,
)

SessionClimb.create(
  session_id: first_session.id,
  user_id: tom.id,
  boulder_id: b1.id,
  attempts: 8,
  percent_finished: 15,
  warmup: false,
)