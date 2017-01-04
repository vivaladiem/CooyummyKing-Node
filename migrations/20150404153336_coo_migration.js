var log = console.log;
'use strict'; exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable('users', function(t) {
			t.increments('user_id');
			t.string('email', 20).unique();
			t.string('username', 20);
			t.string('password', 20);
			t.string('token', 32);
			t.string('phone', 11);
			t.string('profile_text', 150);
			t.integer('point', 11);
			t.integer('level', 3);
			t.integer('recipe_count', 7);
			t.integer('following_count', 6);
			t.integer('follower_count', 6);
			t.timestamps();
		}).catch(function(err) {
			console.log(err);
		}),

		knex.schema.createTable('recipes', function(t) {
			t.increments('recipe_id');
			t.integer('user_id', 10).unsigned().references('user_id').inTable('users').onUpdate('no action').onDelete('cascade');
			t.string('title', 30);
			t.text('instruction');
			t.integer('image_length', 2);
			t.integer('main_image_index', 2);
			t.integer('cooking_time', 3);
			t.string('theme', 10);
			t.string('ingredient', 100);
			t.string('source', 100);
			t.integer('like_count');
			t.integer('scrap_count');
			t.timestamps();
		}).catch(function(err) {
			console.log(err);
		}),

		knex.schema.createTable('likes', function(t) {
			t.integer('user_id', 10).unsigned().references('user_id').inTable('users').onUpdate('no action').onDelete('cascade');
			t.integer('recipe_id', 10).unsigned().references('recipe_id').inTable('recipes').onUpdate('no action').onDelete('cascade');
		}).catch(function(err) {
			console.log(err);
		}),

		knex.schema.createTable('scraps', function(t) {
			t.integer('user_id', 10).unsigned().references('user_id').inTable('users').onUpdate('no action').onDelete('cascade');
			t.integer('recipe_id', 10).unsigned().references('recipe_id').inTable('recipes').onUpdate('no action').onDelete('cascade');
		}).catch(function(err) {
			console.log(err);
		}),

		knex.schema.createTable('comments', function(t) {
			t.integer('user_id', 10).unsigned().references('user_id').inTable('users').onUpdate('no action').onDelete('cascade');
			t.integer('recipe_id', 10).unsigned().references('recipe_id').inTable('recipes').onUpdate('no action').onDelete('cascade');
			t.string('comment', 150);
			t.timestamps();
		}).catch(function(err) {
			console.log(err);
		}),

		knex.schema.createTable('questions', function(t) {
			t.increments('question_id');
			t.integer('user_id', 10).unsigned().references('user_id').inTable('users').onUpdate('no action').onDelete('cascade');
			t.integer('recipe_id', 10).unsigned().references('recipe_id').inTable('recipes').onUpdate('no action').onDelete('cascade');
			t.string('question', 150);
			t.timestamps();
		}).catch(function(err) {
			console.log(err);
		}),

		knex.schema.createTable('replies', function(t) {
			t.integer('user_id', 10).unsigned().references('user_id').inTable('users').onUpdate('no action').onDelete('cascade');
			t.integer('question_id', 10).unsigned().references('question_id').inTable('questions').onUpdate('no action').onDelete('cascade');
		t.string('reply', 150);
			t.timestamps();
		}).catch(function(err) {
			console.log(err);
		}),

		knex.schema.createTable('follows', function(t) {
			t.integer('following_id', 10).unsigned().references('user_id').inTable('users').onUpdate('no action').onDelete('cascade');
			t.integer('follower_id', 10).unsigned().references('user_id').inTable('users').onUpdate('no action').onDelete('cascade');
			t.timestamps();
		}).catch(function(err) {
			console.log(err);
		}),

		knex.schema.createTable('ingredients', function(t) {
			t.increments('ingredient_id');
			t.string('ingredient', 45);
		}).catch(function(err) {
			console.log(err);
		}),

		knex.schema.createTable('recipe_ingredient', function(t) {
			t.integer('ingredient_id', 10).unsigned().references('ingredient_id').inTable('ingredients').onUpdate('no action').onDelete('no action');
			t.integer('recipe_id', 10).unsigned().references('recipe_id').inTable('recipes').onUpdate('no action').onDelete('cascade');
		}).catch(function(err) {
			console.log(err);
		}),

		knex.schema.raw('CREATE TRIGGER follow_insert AFTER INSERT ON follows' +
						' FOR EACH ROW BEGIN' +
						' UPDATE users SET following_count = following_count + 1 WHERE users.user_id = NEW.following_id;' + 
						' UPDATE users SET follower_count = follower_count + 1 WHERE users.user_id = NEW.follower_id;' + 
						' END'),

		knex.schema.raw('CREATE TRIGGER follow_delete AFTER DELETE ON follows' +
						' FOR EACH ROW BEGIN' +
						' UPDATE users SET following_count = following_count - 1 WHERE users.user_id = OLD.following_id;' + 
						' UPDATE users SET follower_count = follower_count - 1 WHERE users.user_id = OLD.follower_id;' + 
						' END'),

		knex.schema.raw('CREATE TRIGGER like_insert AFTER INSERT ON likes' +
						' FOR EACH ROW BEGIN' +
						' UPDATE users SET like_count = like_count + 1 WHERE users.user_id = NEW.user_id;' + 
						' END'),

		knex.schema.raw('CREATE TRIGGER like_delete AFTER DELETE ON likes' +
						' FOR EACH ROW BEGIN' +
						' UPDATE users SET like_count = like_count - 1 WHERE users.user_id = OLD.user_id;' + 
						' END'),
		
		// users에 lock을 걸어서 createRecipe에서 user를 조회하는 절차에서 데드락 발생하는 문제.
		knex.schema.raw('CREATE TRIGGER recipe_insert AFTER INSERT ON recipes' +
						' FOR EACH ROW BEGIN' +
						' UPDATE users SET recipe_count = recipe_count + 1 WHERE users.user_id = NEW.recipe_id;' + 
						' END'),

		knex.schema.raw('CREATE TRIGGER recipe_delete AFTER DELETE ON recipes' +
						' FOR EACH ROW BEGIN' +
						' UPDATE users SET recipe_count = recipe_count - 1 WHERE users.user_id = OLD.user_id;' + 
						' END'),

		knex.schema.raw('CREATE TRIGGER scrap_insert AFTER INSERT ON scraps' +
						' FOR EACH ROW BEGIN' +
						' UPDATE users SET scrap_count = scrap_count + 1 WHERE users.user_id = NEW.user_id;' + 
						' END'),

		knex.schema.raw('CREATE TRIGGER scrap_delete AFTER DELETE ON scraps' +
						' FOR EACH ROW BEGIN' +
						' UPDATE users SET scrap_count = scrap_count - 1 WHERE users.user_id = OLD.user_id;' + 
						' END'),

		//knex.schema.raw('CREATE PROCEDURE getRecipeList()' +
		//				' BEGIN' +
		//				' SET @i = 0;' +
		//				' (SELECT recipe_id FROM' +
		//				' (select recipe_id from recipes where (@i := @i + 1) between 0 and' +
		//				' (SELECT @num := FLOOR((SELECT COUNT(*) FROM recipes) / 10) AS num)' +
		//				' order by like_count desc) as id' +
		//				' ORDER BY RAND() LIMIT 2)' +
		//				' UNION' +
		//				' (SELECT recipe_id FROM recipes ORDER BY RAND() LIMIT 12)' +
		//				' LIMIT 12;' +
		//				' END')
		knex.schema.raw('CREATE PROCEDURE getRecipeList()' +
						' BEGIN' +
						' SET @i = 0;' +
						' (SELECT recipe_id, title, main_image_index FROM' +
						' (select recipe_id, title, main_image_index from recipes where (@i := @i + 1) between 0 and' +
						' (SELECT @num := FLOOR((SELECT COUNT(*) FROM recipes) / 10) AS num)' +
						' order by like_count desc) as id' +
						' ORDER BY RAND() LIMIT 2)' +
						' UNION ALL' +
						' (SELECT recipe_id, title, main_image_index FROM recipes ORDER BY RAND() LIMIT 12)' +
						' LIMIT 12;' +
						' END')
	]);
};

exports.down = function(knex, Promise) {
	Promise.all([
		knex.raw('SET foreign_key_checks = 0;'),
		knex.schema.dropTableIfExists('likes').catch(function(err) {
			console.log(err);
		}),
		knex.schema.dropTableIfExists('scraps').catch(function(err) {
			console.log(err);
		}),
		knex.schema.dropTableIfExists('comments').catch(function(err) {
			console.log(err);
		}),
		knex.schema.dropTableIfExists('replies').catch(function(err) {
			console.log(err);
		}),
		knex.schema.dropTableIfExists('questions').catch(function(err) {
			console.log(err);
		}),
		knex.schema.dropTableIfExists('follows').catch(function(err) {
			console.log(err);
		}),
		knex.schema.dropTableIfExists('recipe_ingredient').catch(function(err) {
			console.log(err);
		}),
		knex.schema.dropTableIfExists('ingredients').catch(function(err) {
			console.log(err);
		}),
		knex.schema.dropTableIfExists('recipes').catch(function(err) {
			console.log(err);
		}),
		knex.schema.dropTableIfExists('users').catch(function(err) {
			console.log(err);
		}),
		knex.schema.raw('DROP PROCEDURE IF EXISTS getRecipeList'),
		knex.raw('SET foreign_key_checks = 1;')
	]);
};
