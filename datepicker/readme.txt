переработанная версия автора 
 *  @author     Stefan Gabos <contact@stefangabos.ro>
 *  @version    1.9.18 (last revision: December 31, 2020)

исправлены ошибки, например строка 632
// (or this won't work when doing $.inArray(): enabled_hours: ['11', '12', '13'])
if ($.isArray(plugin.settings.enabled_hours)) plugin.settings.enabled_hour = plugin.settings.enabled_hours.map(function(value) { return parseInt(value, 10); })
исправлена 
if ($.isArray(plugin.settings.enabled_hours)) plugin.settings.enabled_hours= plugin.settings.enabled_hours.map(function(value) { return parseInt(value, 10); })
и т.д.
добавлены новые возможнсти. Например если в input ведется учет количества дней (а не самих дат) до события. 
событие можно выбирать календарем, результат выводится как разница дней. 
и т.д.

работа автора Stefan Gabos <contact@stefangabos.ro> - выше всех похвал !!!
