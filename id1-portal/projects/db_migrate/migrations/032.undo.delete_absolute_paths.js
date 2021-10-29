var crypto = require('crypto');
require('dotenv').config();

module.exports.generateSql = function () {
    return (`select (SELECT f_replace_everywhere( '/attachments/'
                , '${process.env.ATTACHMENT_URL}'
                , format($$"%1$s" $$, table_name)))as ROW_COUNT
   FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY table_name;
   DROP FUNCTION "f_replace_everywhere";`
    )
  }