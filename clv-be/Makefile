#start project
run:
	clear
	pnpm run start:dev

#run migration
runmigration:
	clear
	npm run typeorm migration:run -- -d ./src/configs/config.typeorm.migration.ts

#create migration
createmigration: 
	clear
	npm run typeorm -- migration:create ./migrations/$(filter-out $@,$(MAKECMDGOALS))

#gen migration 
genmigration: 
	clear
	npm run typeorm -- -d ./src/configs/config.typeorm.migration.ts migration:generate ./migrations/$(filter-out $@,$(MAKECMDGOALS))

#revert migration 
revertmigration: 
	clear
	npm run typeorm -- -d ./src/configs/config.typeorm.migration.ts migration:revert

testall:
	clear
	pnpm run test

testauth: 
	clear
	pnpm run test auth/test

testuser: 
	clear
	pnpm run test user/test

 