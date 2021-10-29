import { postgrator } from '../index';

//Migrate to specific version
postgrator
  .migrate('001')
  .then(appliedMigrations => console.log(appliedMigrations))
  .catch(error => {
    console.log(error)
    // Because migrations prior to the migration with error would have run
    // error object is decorated with appliedMigrations
    console.log(error.appliedMigrations) // array of migration objects
  });
