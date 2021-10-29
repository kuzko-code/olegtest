module.exports.generateSql = function () {
    return (`DELETE FROM public.site_settings WHERE title='serviceHost';`
    )
}
