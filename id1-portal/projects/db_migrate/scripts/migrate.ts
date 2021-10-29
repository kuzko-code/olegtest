import { postgrator } from '../index';

// Migrate to max version (optionally can provide 'max')
postgrator
  .migrate()
  .then(appliedMigrations => console.log(appliedMigrations))
  .catch(error => console.log(error))