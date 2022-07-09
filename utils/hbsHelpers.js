const moment = require('moment')

const hbsHelpers = (handlebars) => {
   handlebars.registerHelper('paginate', require('handlebars-paginate')),

   handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
     return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
   });
   handlebars.registerHelper('formatDate', function(dateString){
     return new handlebars.SafeString(
       moment(dateString).format('DD.MM.YYYY')
     )
   })
}
 module.exports = hbsHelpers

