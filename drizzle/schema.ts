import { pgTable, index, foreignKey, uuid, integer, text, timestamp, numeric, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const weightUnit = pgEnum("weight_unit", ['lbs', 'kg'])


export const workoutExercises = pgTable("workout_exercises", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	workoutId: uuid("workout_id").notNull(),
	exerciseId: uuid("exercise_id").notNull(),
	position: integer().notNull(),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("workout_exercises_exercise_id_idx").using("btree", table.exerciseId.asc().nullsLast().op("uuid_ops")),
	index("workout_exercises_workout_id_idx").using("btree", table.workoutId.asc().nullsLast().op("uuid_ops")),
	index("workout_exercises_workout_id_position_idx").using("btree", table.workoutId.asc().nullsLast().op("int4_ops"), table.position.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.workoutId],
			foreignColumns: [workouts.id],
			name: "workout_exercises_workout_id_workouts_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.exerciseId],
			foreignColumns: [exercises.id],
			name: "workout_exercises_exercise_id_exercises_id_fk"
		}).onDelete("restrict"),
]);

export const sets = pgTable("sets", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	workoutExerciseId: uuid("workout_exercise_id").notNull(),
	setNumber: integer("set_number").notNull(),
	reps: integer().notNull(),
	weight: numeric({ precision: 8, scale:  2 }),
	weightUnit: weightUnit("weight_unit"),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("sets_workout_exercise_id_idx").using("btree", table.workoutExerciseId.asc().nullsLast().op("uuid_ops")),
	index("sets_workout_exercise_id_set_number_idx").using("btree", table.workoutExerciseId.asc().nullsLast().op("int4_ops"), table.setNumber.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.workoutExerciseId],
			foreignColumns: [workoutExercises.id],
			name: "sets_workout_exercise_id_workout_exercises_id_fk"
		}).onDelete("cascade"),
]);

export const workouts = pgTable("workouts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	name: text(),
	date: text().notNull(),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("workouts_user_id_date_idx").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.date.asc().nullsLast().op("text_ops")),
	index("workouts_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
]);

export const exercises = pgTable("exercises", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	muscleGroup: text("muscle_group"),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("exercises_muscle_group_idx").using("btree", table.muscleGroup.asc().nullsLast().op("text_ops")),
	index("exercises_name_idx").using("btree", table.name.asc().nullsLast().op("text_ops")),
]);
