//=================================================================================================
(function ($) {
  'use strict';
  $.Zebra_DatePicker = function (element, options) {
    this.version = '2.1.0';
    var is_iOS   = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    var defaults = {
      //--- использовать атрибут дата вместо значения в input
      value_data : false,
      //--- установка в TRUE приведет к тому, что средство выбора даты не будет закрываться при выборе,
      //--- но только тогда, когда пользователь щелкает вне средства выбора даты.
      //--- при использовании формата даты,которая включает время, это свойство будет автоматически установлена в TRUE
      always_visible: false,
      //--- по умолчанию, date picker вставляется в <body>; используйте это свойство для вставки
      //--- date picker в пользовательский element - (когда хотите открыть date picker в заданной позиции). Должен быть jQuery element
      container: $('body'),
      //--- по умолчанию текущая дата (the value of *Today*) взята из системы
      //--- устанавливаем эту дату в формате 'YYYY-MM-DD'
      //--- по умолчанию FALSE обозначает "the current system's date"
      current_date: false,
      //--- даты которые должны иметь примененный к ним пользовательский класс
      //--- {   'myclass1': [dates_to_apply_the_custom_class_to],  'myclass2': [dates_to_apply_the_custom_class_to] }
      //--- где "dates_to_apply_the_custom_class_to" - даты в таком же формате, как ожидаемые для "disabled_dates" property.
      //--- пользователькие классы будут применены только к day picker view and not on month/year views!
      //--- также class name должен иметь "_disabled" suffix, добавленный если class - запрещающий
      //--- используйте синтаксис CSS :
      //--- 'myclass':  ['* * * 0,6']
      //--- .Zebra_DatePicker .dp_daypicker td.myclass1 { .. }
      //--- .Zebra_DatePicker .dp_daypicker td.myclass1_disabled { .. }
      custom_classes: false,
      //--- дни недели
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      //--- по умолчанию абревиатура наименований дней состонит из 2 символов дня;
      //--- для использования полного названия поставьте days_abbr = TRUE
      days_abbr: false,
      //--- положение средства выбора даты относительно элемента, к которому оно прикреплено.
      //--- позиция будет автоматически скорректирована, чтобы быть доступной в окне просмотра, если это необходимо.
      //--- возможные значения "above" and "below"
      default_position: 'above',
      //--- направление календаря
      //--- положительное или отрицательное целое число: n (положительное целое число) создает календарь только для будущего,
      //--- начинающийся через n дней после сегодняшнего дня; -n (отрицательное целое число);
      //--- если n равно 0, календарь не имеет ограничений. используйте логическое значение true для календаря
      //--- только для будущего, начинающегося с сегодняшнего дня, и используйте логическое значение false для календаря
      //--- только для прошлого, заканчивающегося сегодня.
      //--- вы также можете использовать массив с двумя элементами в следующей комбинации
      //--- первый элемент-логическое значение TRUE (календарь начинается сегодня), и целое число > 0 (календарь начинается через n дней)
      //--- или действительная дата, заданная в формате, определяемом атрибутом "format", с использованием английского языка для
      //--- названий месяцев (календарь начинается с указанной даты), а второй элемент-boolean FALSE (календарь не имеет конечной даты),
      //--- и целое число > 0 (календарь заканчивается через n дней после начальной даты) или действительная дата
      //--- заданная в формате, определяемом атрибутом "формат", использующим английский язык для названий месяцев,
      //--- и которая встречается после даты начала (календарь заканчивается в указанную дату)
      //--- [1, 7] календарь начинается завтра и заканчивается через семь дней после этого
      //--- [true, 7] - календарь начинается сегодня и заканчивается через семь дней после этого
      //--- ['2013-01-01', false] - календарь начинается 1 января 2013 года и не имеет конечной даты ("формат"-ГГГГ-ММ-ДД)
      //--- [false, '2012-01-01'] - календарь заканчивается сегодня и начинается 1 января 2012 года ("формат" - ГГГГ-ММ-ДД)
      //--- обратите внимание, что свойство "disabled_dates" все равно будет применяться!
      direction: 0,
      //--- по умолчанию, установка format которая включает время (h, H, g, G, i, s, a, A) автоматически разрешает time picker.
      //--- если вы хотите использовать формат, включая время но не использовать time picker, установите disable_time_picker - TRUE.
      disable_time_picker: false,
      //--- массив запрещенных dates в формате : 'day month year weekday' где "weekday" - опционально и может быть 0-6 (Saturday to Sunday);
      //--- данные разделяются пробелом и могут содержать * (asterisk) - (dash) and , (comma) разделители:
      //--- ['1 1 2012'] запретит January 1, 2012;
      //--- ['* 1 2012'] запретит все дни in January 2012;
      //--- ['1-10 1 2012'] запретит дни с 1 января по 10 в 2012;
      //--- ['1,10 1 2012'] запретит 1 и 10 января в 2012;
      //--- ['1-10,22,24 1-3 *'] будут запрещены с 1 по 10, 22 и 24 с января по март каждого года;
      //--- ['* * * 0,6'] будут запрещены все субботы и воскресенья
      //--- ['01 07 2012', '02 07 2012', '* 08 2012'] будут запрещены соответствующие даты и весь август 2012
      //--- должна быть разрешена хотя-бы одна дата
      //---  default is FALSE, no disabled dates
      disabled_dates: false,
      //--- массив допустимых значений am/pm.
      //--- допустимые значения ['am'], ['pm'], or ['am', 'pm']
      //--- default is FALSE, оба значения являютя выбираемыми
      //--- обратите внимание, что это применимо только в том случае, если формат даты включает am/pm (a или A)
      //--- когда разрешен только один вариант, onChange() будет все равно срабатывать при нажатии up/down buttons рядом с AM/PM на timepicker
      enabled_ampm: false,
      //--- массив с разрешенными датами в таком же формате как запрещенные даты
      //--- при совместном использовании, первыми обрабатываются запрещенные даты
      //--- "[* * * *]" (запрещенная дата - запретит все) и установка "enabled_dates" "[* * * 0,6]" разрешит только выходные
      enabled_dates  : false,
      enabled_hours  : false,                                     //--- массив выбора часов default is FALSE, все часы выбираемы
      enabled_minutes: false,                                     //--- массив выбора минут default is FALSE, все минуты выбираемы
      enabled_seconds: false,                                     //--- массив выбора секунд default is FALSE, все секунды выбираемы
      //--- позволяет пользователям быстро перемещаться по месяцам и годам, нажав на верхнюю метку выбора даты.
      fast_navigation: true,
      //--- начальный день в неделе
      //--- корректное значение от 0 до 6, Sunday - Saturday
      first_day_of_week: 1,
      //--- format возвращаемой даты
      //--- допустимы следующие символы для форматирования даты: d, D, j, l, N, w, S, F, m, M, n, Y, y, h, H,
      //--- g, G, i, s, a, заимствовано из синтаксиса PHP's "date" function.
      //--- отметим, что когда date format без дней ('d', 'j'), пользователи могут выбирать только годы и месяцы,
      //--- и когда format без месяцев и дней ('F', 'm', 'M', 'n', 'd', 'j'), пользователи могут выбирать только годы
      //--- когда указан только месяцы ('F', 'm', 'M', 'n') или только годы ('Y', 'y'), пользователи могут выбирать только их
      //--- настроки format также включают время (h, H, g, G, i, s, a, A) автоматически разрешая time picker.
      //--- если вы хотите использовать format, который включает время но не хотите использовать time picker,
      //--- установите "disable_time_picker" свойство to TRUE.
      //--- настроки времени format содержат "a" or "A" (12-hour format) но используя "H" or "G" в качестве
      //--- часового формата приведет к изменению формата часа на "h" or "g", соответственно.
      //--- значение свойства "view" property (ниже) может быть переопределено  в случае : значение "days" для свойства "view" property
      // делает date format безсмысленным и не позволяет выбирать дни .
      format: 'Y-m-d',
      //--- подписи в заголовке datepicker для 3 возможных просмотров: дни,месяцы, годы
      //--- для каждого из 3 представлений могут использоваться следующие специальные символы, заимствованные из функции PHP "date".
      //--- syntax: m, n, F, M, y and Y; любой из них будет заменен во время выполнения соответствующим фрагментом даты,
      //--- также доступны еще два специальных символа Y1 и Y2 (верхний регистр, представляющий годы с 4 цифрами,
      //--- строчный регистр, представляющий годы с 2 цифрами), которые представляют "текущий выбранный год - 7" и
      //--- "текущий выбранный год + 4", которые имеют смысл использовать только в "years" представлении.
      //--- Text and HTML может быть также добавлен
      //--- header_captions: {
      //---   'days':     'Departure:<br>F, Y',
      //---   'months':   'Departure:<br>Y',
      //---   'years':    'Departure:<br>Y1 - Y2'
      //---  }
      header_captions: { days: 'F, Y', months: 'Y', years: 'Y1 - Y2' },
      //--- левые и правые границы вокруг иконки
      //--- если свойству "inside" присвоено значение TRUE, то заполнение целевого элемента будет изменено таким образом, чтобы
      //--- левое или правое заполнение элемента (в зависимости от значения "icon_position") будет равно 2 x icon_margin
      //--- + icon's ширина
      //--- если свойству "inside" присвоено значение FALSE, то это будет расстояние между элементом и значком.
      //--- оставьте значение FALSE для использования существующего заполнения элемента
      icon_margin: false,
      //--- позиция иконки
      //--- допустимые значения "left" и "right"
      //--- если "inside" свойство = TRUE, это свойство всегда будет "right"
      icon_position: 'right',
      //--- должен ли значок для открытия datepicker находиться внутри элемента?
      inside: true,
      //--- заголовок для кнопки - "clear"
      lang_clear_date: 'сбросить',
      //--- наименование месяцев
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      //--- абревиатура наименования месяца состоит из 3 символов полного наименования
      //--- для использования полного наименование используйте  months_abbr = TRUE
      months_abbr: false,
      //---  символы для вывода навигации календаря default is ['&#9664;', '&#9654;', '&#9650;', '&#9660;']
      navigation: ['&#9664;', '&#9654;', '&#9650;', '&#9660;'],
      //--- смещение , в pixels (x, y), смещает позицию date picker's относительно правого угла icon или относительно
      //--- правого угла элемента (если значок отключен)
      offset: [5, -5],
      //--- должен ли выбор даты отображаться *только* при взаимодействии со значком
      //--- обратите внимание, что если вы также установите свойство "show_icon" в значение FALSE,
      //--- вы больше не сможете показывать средство выбора даты!
      open_icon_only: false,
      //--- значение TRUE, если вы хотите, чтобы date picker отображался, когда родительский элемент (если "open_icon_only"
      //--- не имеет значения FALSE) или связанный значок (если "show_icon" имеет значение TRUE) получить фокус.
      open_on_focus: false,
      //--- праный выбор даты. если задан как элемент jQuery с прикрепленным Zebra_DatePicker,
      //--- то этот конкретный date picker будет использовать значение выбора текущей даты в качестве начальной даты
      //--- note that the rules set in the "direction" property will still apply, only that the reference date will
      //--- not be the current system date but the value selected in the current date picker
      //--- default is FALSE (not paired with another date picker)
      pair: false,
      //--- должен ли элемент, к которому прикреплен календарь, быть доступен только для чтения?
      //--- значение TRUE, дата может быть установлена только через средство выбора и не может быть введена вручную
      readonly_element: true,
      //--- enables rtl text (справа налево).
      rtl: false,
      //--- необходимо ли иметь возможность выбирать дни предыдущего/последующего месяцев когда они видимы
      select_other_months: false,
      //--- необходимость  вывода button "Clear date"
      //--- 0 (zero) - кнопка для очистки ранее выбранной даты отображается только в том случае, если ранее выбранная дата
      //--- уже существует; это означает, что если input the date picker пуст, и пользователь выбирает дату в первый
      //--- раз эта кнопка не будет видна; как только пользователь выберет дату и снова откроет окно выбора даты
      //--- на этот раз кнопка будет видна.
      //--- - TRUE кнопка будет видна всегда
      //--- кнопка будет не видна
      show_clear_date: 0,
      //--- следует ли добавлять значок календаря к элементам, к которым прикреплен плагин?
      show_icon: true,
      //--- должны ли быть видны дни из предыдущего и/или следующего месяца?
      show_other_months: true,
      //--- необходимо ли выводить кнопку "сегодня"
      //--- любое значение кроме boolean FALSE выведет кнопку и будет использовано в свойстве property's как значение
      show_select_today: 'сегодня',
      //--- должен ли быть показан дополнительный столбец, показывающий число каждой недели
      //--- любое значение кроме FALSE разрешит эту опцию, и будет использовано как заголовок столбца
      //--- например show_week_number: 'Wk' разрешит эту опцию и будет иметь "Wk" как заголовок столбца
      show_week_number: false,
      //---  начальная дата по умолчанию date picker должна соответствовать формату определенному в свойстве "format"
      //--- используется только если значение value в поле date picker не заполнено
      start_date: false,
      //--- значения по умолчанию в поле ввода, к которому прикреплен выбор даты, будут удалены, если они недействительны
      strict: false,
      //--- начальное значения показа "days", "months" and "years"
      //--- date picker всегда циклически days-months-years когда нажимать на date picker's заголовок,
      //--- и years-months-days когда выбиратся даты (если только один или несколько видов не отсутствуют из-за формата даты)
      //--- также обратите внимание, что значение свойства "view" может быть переопределено, если формат даты требует этого
      view: 'days',
      //--- дни недели, которые считаются "выходными днями"
      //--- valid values are 0 to 6, Sunday to Saturday
      weekend_days: [0, 6],
      //--- если установлено TRUE, то номера дней < 10 будут иметь префикс 0;
      zero_pad: false,
      //--- callback function будет вызвана при смене представления (days/months/years/time) а также при навигации по кнопкам
      //--- "next"/"previous" в любом представлении (кроме времени)
      //--- вызов имеет 2 аргумента первый аргумент представляет текущее представление (может быть "дни", "месяцы", "годы"
      //--- или "время" второй аргумент представляет массив, содержащий "активные" элементы (не отключеные) из представления,
      //--- как элементы jQuery, позволяющие легко настраивать и взаимодействовать с определенными ячейками
      onChange: null,
      //--- callback function будет вызвана когда пользователь нажмет кнопку "Clear" (вызов не имеет аргументов)
      //--- "this" прикреплен к элементу к которому прикреплен date picker как jQuery object
      onClear: null,
      //--- callback function будет вызвана, когда date picker будет показан (вызов не имеет аргументов)
      //--- "this" прикреплен к элементу к которому прикреплен date picker как jQuery object
      onOpen: null,
      //--- callback function будет выполнена когда date picker будет закрыт, но только когда "always_visible" = FALSE
      //--- callback function не имеет аргументов; "this" прикреплен к элементу к которому прикреплен date picker как jQuery object
      onClose: null,
      //--- callback function будет выполнена когда дата будет выбрана
      //--- the callback function получает 3 arguments:
      //--- the date in the format specified by the "format" attribute;
      //--- the date in YYYY-MM-DD format
      //--- the date as a JavaScript Date object
      //--- "this" прикреплен к элементу к которому прикреплен date picker как jQuery object
      onSelect: null
    },
    //--- private свойства класса --------------------------------------------------------------------------------------
    datepicker,                                               //--- jQuery object из HTML и ссылки
    plugin   = this,                                          //--- текущий this объекта
    $element = $(element),                                    // --- jQuery version of the element "element"
                                                              //--- (without the $) will point to the DOM element
    //--- ссылки к различным частям date picker ------------------------------------------------------------------------
    header,daypicker,monthpicker,yearpicker,timepicker,footer,selecttoday,cleardate,view_toggler,confirm_selection,
    //------------------------------------------------------------------------------------------------------------------
    original_attributes = {},                                 //--- оригинальные атрибуты element (style,padding)
    views,                                                    //--- представления (years,months и т.д.)
    //--- "is12hour":false,"hour_format":"H","hours":[0,..23],"minutes":[0,..59],"seconds":[0,..59],ampm_case:a,ampm:['am','pm'];
    timepicker_config,                                        //--- по умолчанию false
    //--- массивы для обозначения запрещенных/разрешенных дат или дат выделенных пользователем -------------------------
    disabled_dates, enabled_dates,                            //--- запрещенные и разрешенные даты
    custom_class_names,custom_classes = {},                   //--- наименование классов и асоциативный массив с датами
    //------------------------------------------------------------------------------------------------------------------
    selected_month, selected_year,                            //--- выбранные месяц и год (используются в выводе header)
    show_select_today,                                        //--- кнопка сегодня видима
    //--- группа переменных для представления day ----------------------------------------------------------------------
    daypicker_cells,                                          //--- все ячейки таблицы datepicker (не disabled) инициализация в generate_daypicker
    //--- группа переменных для представления month --------------------------------------------------------------------
    monthpicker_cells,                                        //--- все ячейки таблицы datepicker (не disabled) инициализация в generate_daypicker
    //--- группа переменных для представления year ---------------------------------------------------------------------
    yearpicker_cells,                                         //--- все ячейки таблицы datepicker (не disabled) инициализация в generate_daypicker
    //------------------------------------------------------------------------------------------------------------------
    uniqueid = '',                                            //--- определяет уникальность имен обработчиков событий
    //--- инициализация settings.reference_date или в атрибуте zdp_reference_date или так же как current_system --------
    start_date,                                               //--- начальное ограничение календаря
    end_date,                                                 //--- конечное ограничение календаря
    first_selectable_year, first_selectable_month, first_selectable_day,
    last_selectable_day, last_selectable_month, last_selectable_year,
    //--- инициализация plugin.settings.current_date или текущая системная дата (используется для подсветки) -----------
    current_system_day, current_system_month, current_system_year,
    //------------------------------------------------------------------------------------------------------------------

        clickables,
        default_day, default_month, default_year,
        icon,    selected_hour, selected_minute,
        selected_second, selected_ampm,
        timeout,  touchmove = false,
        view,  is_touch = false, timer_interval,
    //==================================================================================================================
    //### функция инициализации ########################################################################################
    //==================================================================================================================
    valueRW = function(value){
      if (plugin.settings.value_data){
        if( value == undefined ) {
          let sign = false;
          for (let data in $element.data()){ if (data.indexOf('zdp_valueRW') === 0) { sign = true; break; }}
          if(!sign) $element.data('zdp_valueRW','');
        }
        if( value == undefined ) return $element.data('zdp_valueRW');
        return $element.data('zdp_valueRW',value);
      }
      else {
        if( value == undefined ) return $element.val();
        return $element.val(value);
      }
    },
    //==================================================================================================================
    init = function (update) {
      var data,k,format_is_valid = false,type = null,l,dates,
        //--- допустимые символы в формате даты  months, years, hours, minutes and seconds
        date_chars = {
          days:       ['d', 'j', 'D'],
          months:     ['F', 'm', 'M', 'n', 't'],
          years:      ['o', 'Y', 'y'],
          hours:      ['G', 'g', 'H', 'h'],
          minutes:    ['i'],
          seconds:    ['s'],
          ampm:       ['A', 'a']
        };
      //--- инициализируем enabled/disabled dates
      disabled_dates = [],enabled_dates = [];
      //--- генерация случайного идентификатора (будет использован при удалении date picker и связанных с ним обработчиков событий)
      for (k = 0; k < 3; k++) uniqueid += Math.floor((1 + Math.random()) * 0x10000).toString(16);
      //--- если не обновляются настройки (начальная инициализация) ----------------------------------------------------
      if (!update) {
        //--- формируем settings из локального и глобального defaults и опций пользователя
        plugin.settings = $.extend({}, defaults, $.fn.Zebra_DatePicker.defaults, options);
        //--- сохраняем отдельные оригинальные атрибуты элемента element
        original_attributes.readonly      = $element.attr('readonly');
        original_attributes.style         = $element.attr('style');
        original_attributes.padding_left  = parseInt($element.css('paddingLeft'), 10) || 0;
        original_attributes.padding_right = parseInt($element.css('paddingRight'), 10) || 0;
        //--- разбираем дата атрибуты у элемента с префиксом "zdp_"
        for (data in $element.data())
          //--- if имя data атрибутов начинается с "zdp_"
          if (data.indexOf('zdp_') === 0) {
            data = data.replace(/^zdp\_/, '');                    //--- удаляем "zdp_" prefix
            if (defaults[data] !== undefined )                    //--- если свойство отсутствует - оно будет проигнорировано
              //--- отметим  что для значения "pair" необходимо конвертировать свойство в элемент
              plugin.settings[data] = (data === 'pair' ? $($element.data('zdp_' + data)) : $element.data('zdp_' + data));
          }
      }
      //--- если элемент должен быть read-only - устанавливаем "readonly" атрибут
      if (plugin.settings.readonly_element) $element.attr('readonly', 'readonly'); else $element.removeAttr('readonly');
      //################################################################################################################
      //--- заполняем timepicker_config, views -------------------------------------------------------------------------
      //--- определяем виды, которые пользователь может циклически просматривать (в зависимости от format) -------------
      while (!format_is_valid) {
        views             = [];                                   //--- представления, которые пользователь может циклически менять
        timepicker_config = false;                                //--- инициализируем timepicker - отсутствует
        for (type in date_chars)
          $.each(date_chars[type], function(index, character) {
            var i, max;
            //---  если текущий символ существует в свойстве "format"
            if (plugin.settings.format.indexOf(character) > -1)
              if (type === 'days') views.push('days');            //--- можно циклически просматривать представление "дни"
              else if (type === 'months') views.push('months');   //--- можно циклически просматривать представление "месяцы"
              else if (type === 'years') views.push('years');     //--- можно циклически просматривать представление "годы"
              else if ((type === 'hours' || type === 'minutes'||  //--- если время доступно в формате даты и выбор времени явно не отключен
                type === 'seconds' || type === 'ampm') && !plugin.settings.disable_time_picker) {
                if (!timepicker_config) {                         //--- если переменная не инициализирована (timepicker_config=FALSE)
                  timepicker_config = { is12hour: false };
                  views.push('time');                             //--- можно циклически просматривать представление "часы"
                }
                if (type === 'hours') {                           //--- если часы доступны в формате даты
                  timepicker_config.hour_format = character;      //--- сохраняем часовой формат
                  if (character === 'g' || character === 'h') {   //--- выбранные часы (12 or 24) зависит от формата
                    max = 12;
                    timepicker_config.is12hour = true;            //---  признак 12 часового формата
                  } else max = 24;
                  timepicker_config.hours = [];
                  //--- массив с часами должен быть целочисленным
                  if ($.isArray(plugin.settings.enabled_hours))
                    plugin.settings.enabled_hours = plugin.settings.enabled_hours.map( function(value) { return parseInt(value, 10); })
                  //--- либо все часы либо только разрешенные в диапазоне [1-12] или [0-23]
                  for (i = (max === 12 ? 1 : 0); i < (max === 12 ? 13 : max); i++)
                    //--- and add them to the lookup array if a user-defined list of values doesn't exist, or if the value is in that list
                    if (!$.isArray(plugin.settings.enabled_hours) ||
                      $.inArray(i, plugin.settings.enabled_hours) > -1) timepicker_config.hours.push(i);
                }
                else if (type === 'minutes') {
                  timepicker_config.minutes = [];
                  //--- массив с минутами должен быть целочисленным
                  if ($.isArray(plugin.settings.enabled_minutes))
                    plugin.settings.enabled_minutes = plugin.settings.enabled_minutes.map(function(value) { return parseInt(value, 10); })
                  for (i = 0; i < 60; i++)
                    //--- добавляем минуты в lookup array если user-defined список значений не существует, или значение в списке
                    if (!$.isArray(plugin.settings.enabled_minutes) ||
                      $.inArray(i, plugin.settings.enabled_minutes) > -1) timepicker_config.minutes.push(i);
                }
                else if (type === 'seconds') {
                  timepicker_config.seconds = [];
                  //--- массив с секундами должен быть целочисленным
                  if ($.isArray(plugin.settings.enabled_seconds))
                    plugin.settings.enabled_seconds = plugin.settings.enabled_seconds.map(function(value) { return parseInt(value, 10); })
                  for (i = 0; i < 60; i++)
                    //--- добавляем секунды в lookup array если user-defined список значений не существует, или значение в списке
                    if (!$.isArray(plugin.settings.enabled_seconds) ||
                      $.inArray(i, plugin.settings.enabled_seconds) > -1) timepicker_config.seconds.push(i);
                }
                else {                                          //--- используем AM/PM или am/pm, зависимый от format
                  timepicker_config.ampm_case = character;
                  //--- если пользовательские значения - "am" and/or "pm"
                  if ($.isArray(plugin.settings.enabled_ampm) &&
                    $.grep(plugin.settings.enabled_ampm,
                      function(value) { return $.inArray(value.toLowerCase(), ['am', 'pm']) > -1; }).length)
                    timepicker_config.ampm = plugin.settings.enabled_ampm;
                  else timepicker_config.ampm = ['am', 'pm'];
                }
              }
          });
        //--- если time format содержит hours, am/pm должно быть показано но часы в 24-hour формате
        if (timepicker_config.hour_format && timepicker_config.ampm && timepicker_config.is12hour === false)
          //--- заменяем часовой format с 24-hour на 12-hour format
          plugin.settings.format = plugin.settings.format.replace(timepicker_config.hour_format, timepicker_config.hour_format.toLowerCase());
        else format_is_valid = true;
      }
      //--- если invalid format (no days, no months, no years)используем default
      if (views.length === 0) views = ['years', 'months', 'days'];
      //--- если начальное view некоректное, устанавливаем корректное начальное starting view
      if ($.inArray(plugin.settings.view, views) === -1) plugin.settings.view = views[views.length - 1];
      //################################################################################################################
      //--- parse правила для запрещения дат и пользовательские классы
      custom_class_names = [];
      for (k in plugin.settings.custom_classes)
        //--- hasOwnProperty() возвращает логическое значение, указывающее, содержит ли объект указанное свойство
        if (plugin.settings.custom_classes.hasOwnProperty(k) && custom_class_names.indexOf(k) === -1) custom_class_names.push(k);
      //--- однотипная логика для enable/disable дат и для пользовательских классов ------------------------------------
      for (l = 0; l < 2 + custom_class_names.length; l++) {
        if (l === 0) dates = plugin.settings.disabled_dates;      //--- обработка запрещенных дат
        else if (l === 1) dates = plugin.settings.enabled_dates;  //--- обработка разрешенных дат
        //--- обработка дат с пользовательскими классами
        else dates = plugin.settings.custom_classes[custom_class_names[l - 2]];
        //--- для каждого элемента даты (запрещенного/разрешенного/пользователького формата- ['1-10,22,24 1-3 *'])
        if ($.isArray(dates) && dates.length > 0)
          $.each(dates, function( ) {
            //--- this ссылается на элемент (получаем составные части разбивая строку по white space)
            var rules = this.split(' '), i, j, k, limits;
            //--- результат не превышает 4 элементов (days, months, years and, optionally, day of the week)
            for (i = 0; i < 4; i++) {
              //--- если одно значение недоступно используем групповой символ
              if (!rules[i]) rules[i] = '*';
              //--- если есть разделитель , создаем новый массив на основе разделителя
              //--- если нет разделителя , создаем массив на основе строки текущего правила
              rules[i] = (rules[i].indexOf(',') > -1 ? rules[i].split(',') : new Array(rules[i]));
              //--- перебираем все созданные элементы правил для одного элемента
              for (j = 0; j < rules[i].length; j++)
                //--- если имеется разделитель - (определяющий диапазон)
                if (rules[i][j].indexOf('-') > -1) {
                  //--- получаем нижнюю и верхнюю границы
                  limits = rules[i][j].match(/^([0-9]+)\-([0-9]+)/);
                  //--- если формат корректный
                  if (limits !== null) {
                    //--- добавляем в тот же массив значение в промежутке, если оно отсутствует в массиве
                    for (k = to_int(limits[1]); k <= to_int(limits[2]); k++)
                      if ($.inArray(k, rules[i]) === -1) rules[i].push(k + '');
                  }
                  //--- удаляем индикатор диапазона
                  rules[i].splice(j, 1);
                  j--;
                }
              //--- конвертируем числа в числовой формат. нечисловые данные оставляем как есть
              for (j = 0; j < rules[i].length; j++) rules[i][j] = (isNaN(to_int(rules[i][j])) ? rules[i][j] : to_int(rules[i][j]));
            }
            //--- добавляем полученный список в соответствующий ресурс
            if (l === 0) disabled_dates.push(rules);
            else if (l === 1) enabled_dates.push(rules);
            else {                      //--- сохраняем даты для которых необходимо применить пользовательские классы
              if (undefined === custom_classes[custom_class_names[l - 2]]) custom_classes[custom_class_names[l - 2]] = [];
              custom_classes[custom_class_names[l - 2]].push(rules);
            }
          });
      }
      //--- ############################################################################################################
      var
        //--- cache текущей даты (которая является system's датой или пользовательской)
        date = plugin.settings.current_date !== false ? new Date(plugin.settings.current_date) : new Date(),
        //--- когда начальная дата date picker's зависит от значения другого date picker, это значение  будет установлено
        //--- другим date picker. это значение будет использовано как базовое для всех вычислений
        //--- если значение не установлено, будет установлено текущая системная дата
        reference_date = (!plugin.settings.reference_date ? ($element.data('zdp_reference_date') &&
          $element.data('zdp_reference_date' !== undefined ) ? $element.data('zdp_reference_date') : date) : plugin.settings.reference_date),
        tmp_start_date, tmp_end_date;
      //--- сбрасываем значения, этот метод может быть вызван неоднократно в течении жизни date picker
      //---  (когда выбираемые даты зависят от значений из другого date picker)
      start_date = undefined; end_date = undefined;
      //--- сохраняем системные month/day/year - эти данные будут использоваться для подсветки текущей даты ------------
      current_system_year  = date.getFullYear();
      current_system_month = date.getMonth();
      current_system_day   = date.getDate();
      //--- получаем части даты ----------------------------------------------------------------------------------------
      first_selectable_month = reference_date.getMonth();
      first_selectable_year  = reference_date.getFullYear();
      first_selectable_day   = reference_date.getDate();
      //--- проверка есть ли в календаре ограничения
      //--- календарь это только будущее начиная с сегодняшнего дня
      //--- это означает, что у нас есть начальная дата (текущая системная дата), но нет конечной даты
      if (plugin.settings.direction === true) start_date = reference_date;
      else if (plugin.settings.direction === false) {             //--- только прошлое заканчивающее сегодня
        end_date = reference_date;                                //--- имеется конечная дата без наличия начальной
        //--- извлекаем части даты
        last_selectable_month = end_date.getMonth();
        last_selectable_year  = end_date.getFullYear();
        last_selectable_day   = end_date.getDate();
      }
      else {
        //--- если направление не представлено массивом и значение целое число integer > 0 -------------------------------
        if ((!$.isArray(plugin.settings.direction) && is_integer(plugin.settings.direction) &&
          to_int(plugin.settings.direction) > 0) ||
          ($.isArray(plugin.settings.direction) && ( //--- или направление задано массивом
          //--- первое значение - корректная дата
          (tmp_start_date = check_date(plugin.settings.direction[0])) ||
          //--- или boolean TRUE
          plugin.settings.direction[0] === true ||
          //--- или integer > 0
          (is_integer(plugin.settings.direction[0]) && plugin.settings.direction[0] > 0)
          )  && (
          //--- второе значение - корректная дата
          (tmp_end_date = check_date(plugin.settings.direction[1])) ||
          //--- или boolean FALSE
          plugin.settings.direction[1] === false ||
          //--- или integer >= 0
          (is_integer(plugin.settings.direction[1]) && plugin.settings.direction[1] >= 0)
          ))
        ){
           if (tmp_start_date) start_date = tmp_start_date;        //--- если в границах задана начальная дата
           else
             //--- используем Date object для нормализации даты
             //--- for example, 2011 05 33 will be transformed to 2011 06 02
             start_date = new Date(
             first_selectable_year,
             first_selectable_month,
             first_selectable_day + (!$.isArray(plugin.settings.direction) ? to_int(plugin.settings.direction) :
               to_int(plugin.settings.direction[0] === true ? 0 : plugin.settings.direction[0])));
             //--- заполняем части даты
           first_selectable_month = start_date.getMonth();
           first_selectable_year  = start_date.getFullYear();
           first_selectable_day   = start_date.getDate();
           //--- если была указана дата окончания и она находится после даты начала, используем ее в качестве даты окончания
           if (tmp_end_date && +tmp_end_date >= +start_date) end_date = tmp_end_date;
           //--- если имеется информация о конечной дате
           else if (!tmp_end_date && $.isArray(plugin.settings.direction) && plugin.settings.direction[1] !== false)
             end_date = new Date( first_selectable_year,first_selectable_month,
               first_selectable_day + to_int(plugin.settings.direction[1]));
           //--- если существует корректная конечная дата -----------------------------------------------------------------
           if (end_date) {
             last_selectable_month = end_date.getMonth();
             last_selectable_year  = end_date.getFullYear();
             last_selectable_day   = end_date.getDate();
           }
        }
        else if (   //--- если отсутствует if предписание в виде массива  и значение integer < 0
          (!$.isArray(plugin.settings.direction) && is_integer(plugin.settings.direction) &&
            to_int(plugin.settings.direction) < 0) ||
          ($.isArray(plugin.settings.direction) &&               //--- инструкции приведены в массиве
          (plugin.settings.direction[0] === false  ||            //--- первое значение является boolean FALSE
          //---или integer < 0
          (is_integer(plugin.settings.direction[0]) && plugin.settings.direction[0] < 0)
          ) && (
          //--- и второе значение - корректна дата
          (tmp_start_date = check_date(plugin.settings.direction[1])) ||
          //--- или integer >= 0
          (is_integer(plugin.settings.direction[1]) && plugin.settings.direction[1] >= 0)
          ))
          ) {
              end_date = new Date(
                first_selectable_year,
                first_selectable_month,
                first_selectable_day + (!$.isArray(plugin.settings.direction) ? to_int(plugin.settings.direction) :
                   to_int(plugin.settings.direction[0] === false ? 0 : plugin.settings.direction[0]))
              );
              last_selectable_month = end_date.getMonth();
              last_selectable_year = end_date.getFullYear();
              last_selectable_day = end_date.getDate();
              //--- если была указана точная дата начала и эта дата предшествует дате окончания
              if (tmp_start_date && +tmp_start_date < +end_date) start_date = tmp_start_date;
              //--- если имеется информация о начальной дате
              else if (!tmp_start_date && $.isArray(plugin.settings.direction))
                start_date = new Date(
                  last_selectable_year,
                  last_selectable_month,
                  last_selectable_day - to_int(plugin.settings.direction[1])
                );
              //--- если начальная дата существует
              if (start_date) {
              first_selectable_month = start_date.getMonth();
              first_selectable_year = start_date.getFullYear();
              first_selectable_day = start_date.getDate();
            }
            }
        //--- если имеются запрещенные даты ----------------------------------------------------------------------------
        else if ($.isArray(plugin.settings.disabled_dates) && plugin.settings.disabled_dates.length > 0)
          for (var interval in disabled_dates)
          //--- поиск правила, запрещающего все *
          if ($.inArray('*', disabled_dates[interval][0]) > -1 &&
              $.inArray('*', disabled_dates[interval][1]) > -1 &&
              $.inArray('*', disabled_dates[interval][2]) > -1 &&
              $.inArray('*', disabled_dates[interval][3]) > -1) {
            var tmpDates = [];
            $.each(enabled_dates, function() {                    //--- итерактивно по разрешающим датам, поиск minimum/maximum selectable date
              var rule = this;
              if (rule[2][0] !== '*')                             //--- если правило не содержит все годы
                tmpDates.push(parseInt(                           //--- format date and store it in our stack
                  rule[2][0] +
                  (rule[1][0] === '*' ? '12' : str_pad(rule[1][0], 2)) +
                  (rule[0][0] === '*' ? (rule[1][0] === '*' ? '31' : new Date(rule[2][0],
                    rule[1][0], 0).getDate()) : str_pad(rule[0][0], 2)), 10));
            });
            tmpDates.sort();                                      //--- сортируем dates
            if (tmpDates.length > 0) {
              var matches = (tmpDates[0] + '').match(/([0-9]{4})([0-9]{2})([0-9]{2})/);
              first_selectable_year  = parseInt(matches[1], 10);
              first_selectable_month = parseInt(matches[2], 10) - 1;
              first_selectable_day   = parseInt(matches[3], 10);
            }
            break;
          }
      }
      //--- если первый день существует но он запрещен, поиск актуально первого дня
      if (is_disabled(first_selectable_year, first_selectable_month, first_selectable_day)) {
        while (is_disabled(first_selectable_year))                //--- цикл пока не будет найден выбираемый год
          if (!start_date) {                                      // если календарь только прошлое
            first_selectable_year--;
            first_selectable_month = 11;
            first_selectable_day = 1;
          } else {
            first_selectable_year++;
            first_selectable_month = 0;
            first_selectable_day = 1;
          }
        //--- цикл пока не будет найдет выбираемый месяц
        while (is_disabled(first_selectable_year, first_selectable_month)) {
          if (!start_date) {
            first_selectable_month--;
            first_selectable_day = new Date(first_selectable_year, first_selectable_month + 1, 0).getDate();
          } else { first_selectable_month++; first_selectable_day = 1;  }
          if (first_selectable_month > 11) {                      //--- если подшли к следующему году
            first_selectable_year++;
            first_selectable_month = 0;
            first_selectable_day = 1;
          } else if (first_selectable_month < 0) {
            first_selectable_year--;
            first_selectable_month = 11;
            first_selectable_day = new Date(first_selectable_year, first_selectable_month + 1, 0).getDate();
          }
        }
        //--- цикл пока не будет найден первый выбираемый день
        while (is_disabled(first_selectable_year, first_selectable_month, first_selectable_day)) {
          if (!start_date) first_selectable_day--;
          else first_selectable_day++;
          date = new Date(first_selectable_year, first_selectable_month, first_selectable_day);
          first_selectable_year = date.getFullYear();
          first_selectable_month = date.getMonth();
          first_selectable_day = date.getDate();
        }
        date = new Date(first_selectable_year, first_selectable_month, first_selectable_day);
        first_selectable_year = date.getFullYear();
        first_selectable_month = date.getMonth();
        first_selectable_day = date.getDate();
      }
      //--- если "start_date" является JavaScript Date object
      if (plugin.settings.start_date && typeof plugin.settings.start_date === 'object' &&
        plugin.settings.start_date instanceof Date) plugin.settings.start_date = format(plugin.settings.start_date);
      //--- получаем default дату из элемента , и проверяем валидность согласно ожидаемому формату
      var default_date = check_date(valueRW() || (plugin.settings.start_date ? plugin.settings.start_date : ''));
      //--- if there is a default date, date picker is in "strict" mode, and the default date is disabled
      if (default_date && plugin.settings.strict && is_disabled(default_date.getFullYear(), default_date.getMonth(), default_date.getDate()))
      //--- clear the value of the parent element
      valueRW('');
      //--- updates value for the date picker whose starting date depends on the selected date (if any)
      if (!update && (undefined !== start_date || undefined !== default_date))
        update_dependent(undefined !== default_date ? default_date : start_date);
      //--- if date picker is not always visible in a container
      //################################################################################################################
      if (!(plugin.settings.always_visible instanceof jQuery)) {
        //--- если date picker только что создан
        if (!update) {
          //--- если calendar icon должна быть добавлена
          if (plugin.settings.show_icon) {
            // strangely, in Firefox 21+ (or maybe even earlier) input elements have their "display" property
            // set to "inline" instead of "inline-block" as do all the other browsers.
            // because this behavior brakes the positioning of the icon, we'll set the "display" property to
            // "inline-block" before anything else;
            if (browser.name === 'firefox' && $element.is('input[type="text"]') &&
                $element.css('display') === 'inline') $element.css('display', 'inline-block');
            // we create a wrapper for the parent element so that we can later position the icon
            // also, make sure the wrapper inherits positioning properties of the target element
            var marginTop = parseInt($element.css('marginTop'), 10) || 0,
              marginRight = parseInt($element.css('marginRight'), 10) || 0,
              marginBottom = parseInt($element.css('marginBottom'), 10) || 0,
              marginLeft = parseInt($element.css('marginLeft'), 10) || 0,
              icon_wrapper = $('<span class="Zebra_DatePicker_Icon_Wrapper"></span>').css({
                display:        $element.css('display'),
                position:       $element.css('position') === 'static' ? 'relative' : $element.css('position'),
                float:          $element.css('float'),
                top:            $element.css('top'),
                right:          $element.css('right'),
                bottom:         $element.css('bottom'),
                left:           $element.css('left'),
                marginTop:      marginTop < 0 ? marginTop : 0,
                marginRight:    marginRight < 0 ? marginRight : 0,
                marginBottom:   marginBottom < 0 ? marginBottom : 0,
                marginLeft:     marginLeft < 0 ? marginLeft : 0,
                paddingTop:     marginTop,
                paddingRight:   marginRight,
                paddingBottom:  marginBottom,
                paddingLeft:    marginLeft
              });
            // if parent element has its "display" property set to "block"
            // the wrapper has to have its "width" set
            if ($element.css('display') === 'block') icon_wrapper.css('width', $element.outerWidth(true));
            //             // put wrapper around the element
            //             // also, reset the target element's positioning properties
            $element.wrap(icon_wrapper).css({
              position:       'relative',
              float:          'none',
              top:            'auto',
              right:          'auto',
              bottom:         'auto',
              left:           'auto',
              marginTop:      0,
              marginRight:    0,
              marginBottom:   0,
              marginLeft:     0
            });
            // create the actual calendar icon (show a disabled icon if the element is disabled)
            icon = $('<button type="button" class="Zebra_DatePicker_Icon' + ($element.attr('disabled') === 'disabled' ?
              ' Zebra_DatePicker_Icon_Disabled' : '') + '">Pick a date</button>');
            plugin.icon = icon;                                   // a reference to the icon, as a global property
            // the date picker will open when clicking both the icon and the element the plugin is attached to
            // (or the icon only, if set so)
            clickables = plugin.settings.open_icon_only ? icon : icon.add($element);
            // if calendar icon is not visible, the date picker will open when clicking the element
          } else clickables = $element;
          // attach the "click" and, if required, the "focus" event to the clickable elements (icon and/or element)
          clickables.on('click.Zebra_DatePicker_' + uniqueid + (plugin.settings.open_on_focus ? ' focus.Zebra_DatePicker_' + uniqueid : ''), function() {
            //if date picker is not visible and element is not disabled
            if (datepicker.hasClass('dp_hidden') && !$element.attr('disabled'))
              // if not a touch-enabled device or the element is read-only, show the date picker right away
              if (!(is_touch && !plugin.settings.readonly_element)) plugin.show();
              // if touch-enabled device and the element is not read-only
              else {   // stop a previously started timeout, if any
                clearTimeout(timeout);
                // wait for 600 milliseconds for the virtual keyboard to appear and show the date picker afterwards
                timeout = setTimeout(function() { plugin.show() }, 600);
              }
          });
          //         // attach a keydown event to the clickable elements (icon and/or element)
          clickables.on('keydown.Zebra_DatePicker_' + uniqueid, function(e) {
            // if "Tab" key was pressed and the date picker is visible
            if (e.keyCode === 9 && !datepicker.hasClass('dp_hidden')) plugin.hide();// hide the date picker
          });
          // if users can manually enter dates and a pair date element exists
          if (!plugin.settings.readonly_element && plugin.settings.pair)
            // whenever the element looses focus
            $element.on('blur.Zebra_DatePicker_' + uniqueid, function() {
              var date;
              // if a valid date was entered, update the paired date picker
              if ((date = check_date($(this).val())) && !is_disabled(date.getFullYear(), date.getMonth(), date.getDate())) update_dependent(date);
            });
          // if icon exists, inject it into the DOM, right after the parent element (and inside the wrapper)
          if (undefined !== icon) icon.insertAfter($element);
        }
        // if calendar icon exists
        if (undefined !== icon) {
          // needed when updating: remove any inline style set previously by library,
          // so we get the right values below
          icon.attr('style', '');
          var
            //             // get element's width and height (including margins)
            element_width  = $element.outerWidth(),
            element_height = $element.outerHeight(),
            // get icon's width, height and margins
            icon_width = icon.outerWidth(),
            icon_height = icon.outerHeight();
            // set icon's vertical position
            icon.css('top', (element_height - icon_height) / 2);
            // if icon is to be placed *inside* the element
            // position the icon accordingly
          if (plugin.settings.inside)
            // if icon is to be placed on the right
            if (plugin.settings.icon_position === 'right') {
              // place the icon to the right, respecting the element's right padding
              icon.css('right', plugin.settings.icon_margin !== false ? plugin.settings.icon_margin : original_attributes.padding_right);
              // also, adjust the element's right padding
              $element.css('paddingRight', ((plugin.settings.icon_margin !== false ? plugin.settings.icon_margin : original_attributes.padding_right) * 2) + icon_width);
              // if icon is to be placed on the left
            } else {
              // place the icon to the left, respecting the element's left padding
              icon.css('left', plugin.settings.icon_margin !== false ? plugin.settings.icon_margin : original_attributes.padding_left);
              // also, adjust the element's left padding
              $element.css('paddingLeft', ((plugin.settings.icon_margin !== false ? plugin.settings.icon_margin : original_attributes.padding_left) * 2) + icon_width);
            }
            // if icon is to be placed to the right of the element
            // position the icon accordingly
          else icon.css('left', element_width + (plugin.settings.icon_margin !== false ? plugin.settings.icon_margin : original_attributes.padding_left));
          // assume the datepicker is not disabled
          icon.removeClass('Zebra_DatePicker_Icon_Disabled');
          // if element the datepicker is attached to became disabled, disable the calendar icon, too
          if ($element.attr('disabled') === 'disabled') icon.addClass('Zebra_DatePicker_Icon_Disabled');
        }
      }
      // if the "Today" button is to be shown and it makes sense to be shown
      // (the "days" view is available and "today" is not a disabled date)
      show_select_today = (plugin.settings.show_select_today !== false && $.inArray('days', views) > -1 && !is_disabled(current_system_year, current_system_month, current_system_day) ? plugin.settings.show_select_today : false);
      // if we just needed to recompute the things above
      if (update) {
        //     // make sure we update these strings, in case they've changed
        $('.dp_previous', datepicker).html(plugin.settings.navigation[0]);
        $('.dp_next', datepicker).html(plugin.settings.navigation[1]);
        $('.dp_time_controls_increase .dp_time_control', datepicker).html(plugin.settings.navigation[2]);
        $('.dp_time_controls_decrease .dp_time_control', datepicker).html(plugin.settings.navigation[3]);
        $('.dp_clear', datepicker).html(plugin.settings.lang_clear_date);
        $('.dp_today', datepicker).html(plugin.settings.show_select_today);
        //     // if the date picker is visible at this time
        if (datepicker.is(':visible')) {
          // store the default view when opening the date picker
          k = plugin.settings.view;
          // make the current view the default view
          plugin.settings.view = view;
          // repaint the date picker
          // (the "FALSE" argument tells the script to not fire the onOpen and onChange events when doing this)
          plugin.show(false);
          // if we had to handle the view
          // restore the default view
          plugin.settings.view = k;
        }
        // in case "container" has changed
        if (datepicker.parent() !== plugin.settings.container)
          // remove from the old one and place in the one one
          plugin.settings.container.append(datepicker.detach());
          // don't go further
        return;
      }
      // update icon/date picker position on resize and/or changing orientation
      $(window).on('resize.Zebra_DatePicker_' + uniqueid + ', orientationchange.Zebra_DatePicker_' + uniqueid, function() {
        plugin.hide(); //     // hide the date picker
      });
      //################################################################################################################
      //--- создаем контейнер, в котором будет все находится
      var html = '' +
        '<div class="Zebra_DatePicker">' +
        '<table class="dp_header dp_actions">' +
        '<tr>' +
        '<td class="dp_previous">' + plugin.settings.navigation[0] + (is_iOS ? '&#xFE0E;' : '') + '</td>' +
        '<td class="dp_caption"></td>' +
        '<td class="dp_next">' + plugin.settings.navigation[1] + (is_iOS ? '&#xFE0E;' : '') + '</td>' +
        '</tr>' +
        '</table>' +
        '<table class="dp_daypicker' + (plugin.settings.show_week_number ? ' dp_week_numbers' : '') + ' dp_body"></table>' +
        '<table class="dp_monthpicker dp_body"></table>' +
        '<table class="dp_yearpicker dp_body"></table>' +
        '<table class="dp_timepicker dp_body"></table>' +
        '<table class="dp_footer dp_actions"><tr>' +
        '<td class="dp_today">' + show_select_today + '</td>' +
        '<td class="dp_clear">' + plugin.settings.lang_clear_date + '</td>' +
        '<td class="dp_view_toggler dp_icon">&nbsp;&nbsp;&nbsp;&nbsp;</td>' +
        '<td class="dp_confirm dp_icon"></td>' + '</tr>' +
        '</table>' +
        '</div>';
      //--- создаем jQuery object из HTML и ссылки к нему ------------------------------------------------------------
      datepicker = $(html);
      //--- создаем  create ссылки к различным частям date picker ----------------------------------------------------
      header      = $('table.dp_header', datepicker);
      daypicker   = $('table.dp_daypicker', datepicker);
      monthpicker = $('table.dp_monthpicker', datepicker);
      yearpicker  = $('table.dp_yearpicker', datepicker);
      timepicker  = $('table.dp_timepicker', datepicker);
      footer      = $('table.dp_footer', datepicker);
      selecttoday = $('td.dp_today', footer);
      cleardate   = $('td.dp_clear', footer);
      view_toggler = $('td.dp_view_toggler', footer);
      confirm_selection = $('td.dp_confirm', footer);
      //--- if date picker is not always visible in a container вставляем контейнер в DOM
      if (!(plugin.settings.always_visible instanceof jQuery)) plugin.settings.container.append(datepicker);
      else if (!$element.attr('disabled')) {  //--- иначе, если элемент не disabled вставляем date picker в предоставленный контейнер element
        plugin.settings.always_visible.append(datepicker);
        plugin.show();   //--- и делаем его видимым
      }
      //################################################################################################################
      // add the mouseover/mousevents to all to the date picker's cells
      // except those that are not selectable
      datepicker
        .on('mouseover', 'td:not(.dp_disabled)', function() {  $(this).addClass('dp_hover');   })
        .on('mouseout', 'td:not(.dp_disabled)', function() {   $(this).removeClass('dp_hover'); });
      //--- prevent text selection (prevent accidental select when user clicks too fast)
      disable_text_select(datepicker);
      //--- event for when clicking the "previous" button --------------------------------------------------------------
      // (directions are inverted when in RTL mode)
      $(plugin.settings.rtl ? '.dp_next' : '.dp_previous', header).on('click', function() {
        // if view is "months"  decrement year by one
        if (view === 'months') selected_year--;
        // if view is "years" decrement years by 12
        else if (view === 'years') selected_year -= 12;
        // if view is "days" decrement the month and
        // if month is out of range
        else if (--selected_month < 0) {
          selected_month = 11;                                    // go to the last month of the previous year
          selected_year--;
        }
        manage_views();                                           //--- generate the appropriate view
      });
      //--- if "fast_navigation" is enabled, allow clicking the upper label for quickly navigating through months and years
      if (plugin.settings.fast_navigation)
        //--- attach a click event to the caption in header
        $('.dp_caption', header).on('click', function() {
          // if current view is "days", take the user to the next view, depending on the format
          if (view === 'days') view = ($.inArray('months', views) > -1 ? 'months' : ($.inArray('years', views) > -1 ? 'years' : 'days'));
          // if current view is "months", take the user to the next view, depending on the format
          else if (view === 'months') view = ($.inArray('years', views) > -1 ? 'years' : ($.inArray('days', views) > -1 ? 'days' : 'months'));
          // if current view is "years", take the user to the next view, depending on the format
          else view = ($.inArray('days', views) > -1 ? 'days' : ($.inArray('months', views) > -1 ? 'months' : 'years'));
          // generate the appropriate view
          manage_views();
        });
      //--- event for when clicking the "next" button ------------------------------------------------------------------
      // // (directions are inverted when in RTL mode)
      $(plugin.settings.rtl ? '.dp_previous' : '.dp_next', header).on('click', function() {
        if (view === 'months') selected_year++;                   // if view is "months" increment year by 1
        else if (view === 'years') selected_year += 12;           //--- if view is "years"  increment years by 12
        //--- if view is "days" increment the month and if month is out of range
        else if (++selected_month === 12) {                       //--- go to the first month of the next year
          selected_month = 0;
          selected_year++;
        }
        manage_views();                                           //--- generate the appropriate view
      });
      //--- attach a click event for the cells in the day picker -------------------------------------------------------
      daypicker.on('click', 'td:not(.dp_disabled)', function() {
        var matches;
        //--- if other months are selectable and currently clicked cell contains a class with the cell's date
        if (plugin.settings.select_other_months && $(this).attr('class') && null !==
           (matches = $(this).attr('class').match(/date\_([0-9]{4})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])/)))
          //--- use the stored date
          select_date(matches[1], matches[2] - 1, matches[3], 'days', $(this));
        //--- put selected date in the element the plugin is attached to, and hide the date picker
        else select_date(selected_year, selected_month, to_int($(this).html()), 'days', $(this));
      });
      //--- attach a click event for the cells in the month picker -----------------------------------------------------
      monthpicker.on('click', 'td:not(.dp_disabled)', function() {
        //--- get the month we've clicked on
        var matches = $(this).attr('class').match(/dp\_month\_([0-9]+)/);
        //--- set the selected month
        selected_month = to_int(matches[1]);
        //--- if user can select only years and months
        if ($.inArray('days', views) === -1)
          // put selected date in the element the plugin is attached to, and hide the date picker
          select_date(selected_year, selected_month, 1, 'months', $(this));
        else {                                                    //--- direct the user to the "days" view
          view = 'days';
          // if date picker is always visible
          // empty the value in the text box the date picker is attached to
          if (plugin.settings.always_visible) valueRW('');
          // generate the appropriate view
          manage_views();
        }
      });
      //--- attach a click event for the cells in the year picker ------------------------------------------------------
      yearpicker.on('click', 'td:not(.dp_disabled)', function() {
        selected_year = to_int($(this).html());                   //--- set the selected year
        if ($.inArray('months', views) === -1)                    //--- if user can select only years
          //--- put selected date in the element the plugin is attached to, and hide the date picker
          select_date(selected_year, 0, 1, 'years', $(this));
        else {                                                    //--- direct the user to the "months" view
          view = 'months';
          //--- if date picker is always visible
          // empty the value in the text box the date picker is attached to
          if (plugin.settings.always_visible) valueRW('');
          manage_views();                                         //--- generate the appropriate view
        }
      });
      //--- function to execute when the "Today" button is clicked -----------------------------------------------------
      selecttoday.on('click', function(e) {
        //--- date might have changed since we opened the date picker, so always use the current date
        var date = plugin.settings.current_date !== false ? new Date(plugin.settings.current_date) : new Date();
        e.preventDefault();
        // select the current date
        select_date(date.getFullYear(), date.getMonth(), date.getDate(), 'days', $('.dp_current', daypicker));
      });
      //--- function to execute when the "Clear" button is clicked -----------------------------------------------------
      cleardate.on('click', function(e) {
        e.preventDefault();
        valueRW('');                                         //--- clear the element's value
        //--- reset these values
        default_day = null; default_month = null; default_year = null;
        if (!plugin.settings.always_visible) {                    //--- if date picker is not always visible
          selected_month = null; selected_year = null;            //--- reset these values
        } else                                                    //--- if date picker is always visible
          //--- remove the "selected" class from all cells that have it
          $('td.dp_selected', datepicker).removeClass('dp_selected');
        //--- give the focus back to the parent element
        $element.focus();
        //--- hide the date picker
        plugin.hide();
        //--- if a callback function exists for when clearing a date
        if (plugin.settings.onClear && typeof plugin.settings.onClear === 'function')
        //--- execute the callback function and pass as argument the element the plugin is attached to
        plugin.settings.onClear.call($element);
      });
      //--- function to execute when the clock/calendar button is clicked in the footer
      view_toggler.on('click', function() {
        //--- if we're not in the time picker mode
        if (view !== 'time') {                                    //---  switch to time picker mode
          view = 'time';
          manage_views();
          //     // if we are already in the time picker mode,
          //     // switch back to the standard view
          //     // (let the click on the header's caption handle things)
        } else $('.dp_caption', header).trigger('click');
      });
      //--- when the "confirm selection" button is clicked, hide the date picker ---------------------------------------
      //--- (visible only when in the "time" view)
      confirm_selection.on('click', function() {
        // as users may click this before making any adjustments to time, simulate time adjustment so that
        // a value is selected
        $('.dp_time_controls_increase td', timepicker).first().trigger('mousedown');
        clearInterval(timer_interval);
        $('.dp_time_controls_decrease td', timepicker).first().trigger('mousedown');
        clearInterval(timer_interval);
        //--- if a callback function exists for when selecting a date
        if (plugin.settings.onSelect && typeof plugin.settings.onSelect === 'function') {
          var js_date = new Date(selected_year, selected_month, default_day,
            (timepicker_config && timepicker_config.hours ? selected_hour + (timepicker_config.ampm && ((selected_ampm === 'pm' && selected_hour < 12) || (selected_ampm === 'am' && selected_hour === 12)) ? 12 : 0) : 0),
            (timepicker_config && timepicker_config.minutes ? selected_minute : 0),
            (timepicker_config && timepicker_config.seconds ? selected_second : 0)
          );
          //--- execute the callback function
          //--- make "this" inside the callback function refer to the element the date picker is attached to, as a jQuery object
          plugin.settings.onSelect.call($element, format(js_date), selected_year + '-' +
            str_pad(selected_month + 1, 2) + '-' + str_pad(default_day, 2) + (timepicker_config ? ' ' + str_pad(js_date.getHours(), 2) + ':' + str_pad(js_date.getMinutes(), 2) + ':' + str_pad(js_date.getSeconds(), 2) : ''), js_date);
        }
        plugin.hide();
      });
      //--- handle value increases/decreases on the time picker --------------------------------------------------------
      datepicker.on('mousedown', '.dp_time_controls_increase td, .dp_time_controls_decrease td', function() {
        var element = this,count = 0;
        manage_timer_controls(element);                           //--- trigger once
        timer_interval = setInterval(function() {                 //--- as long as the mouse button is pressed
          manage_timer_controls(element);                         //--- update value
          if (++count > 5) {                                      //--- if we updated 5 times
            clearInterval(timer_interval);                        //--- increase speed
            timer_interval = setInterval(function() {
              manage_timer_controls(element);                     //--- update value
              if (++count > 10) {                                 //--- if we updated more times
                clearInterval(timer_interval);                    //--- increase speed
                timer_interval = setInterval(function() {         //--- update value
                  manage_timer_controls(element);
                }, 100, element);
              }
            }, 200, element);
          }
        }, 400, element);
      });
      //--- clear timers -----------------------------------------------------------------------------------------------
      datepicker.on('mouseup mouseleave', '.dp_time_controls_increase td, .dp_time_controls_decrease td',
        function() { clearInterval(timer_interval);  });
      //--- if date picker is not always visible in a container --------------------------------------------------------
      if (!(plugin.settings.always_visible instanceof jQuery)) {
        //--- if we dragged the screen
        $(document).on('touchmove.Zebra_DatePicker_' + uniqueid, function() {
          touchmove = true;                                       //--- set this flag to TRUE
        });
      //--- whenever anything is clicked on the page
      $(document).on('mousedown.Zebra_DatePicker_' + uniqueid + ' touchend.Zebra_DatePicker_' + uniqueid,
        function(e) {
        // if this happened on a touch-enabled device and it represents the end of finger movement instead of a tap
        // set the "touchmove" flag to FALSE and don't go further
        if (e.type === 'touchend' && touchmove) {
          is_touch = true;                                        //--- we now know that this is a touch enabled device
          return (touchmove = false);
        }
        touchmove = false;                                        //--- always set this to FALSE here
        if (
          !datepicker.hasClass('dp_hidden') &&                  //--- date picker is visible
         (
          //--- date picker opens only on interacting with the icon, icon exists, but it is not the clicked element
         (plugin.settings.open_icon_only && plugin.icon && $(e.target).get(0) !== plugin.icon.get(0)) ||
          //--- date picker doesn't open only on interacting with the icon but the clicked element it's not the icon nor the parent element
         (!plugin.settings.open_icon_only && $(e.target).get(0) !== $element.get(0) && (!plugin.icon ||
           $(e.target).get(0) !== plugin.icon.get(0)))  ) &&
          //--- and the click is not inside the calendar
         $(e.target).closest('.Zebra_DatePicker').length === 0 &&
          //--- and the click is not on a time control element
         !$(e.target).hasClass('dp_time_control')
          ) plugin.hide(true);                                    //--- hide the date picker
      });
      //--- whenever a key is pressed on the page --------------------------------------------------------------------
      $(document).on('keyup.Zebra_DatePicker_' + uniqueid, function(e) {
        // if the date picker is visible
        // and the pressed key is ESC
        // hide the date picker
        if (!datepicker.hasClass('dp_hidden') && e.which === 27) plugin.hide();
      });
      }
      //--- вывод date picker в соответствии с параметрами -----------------------------------------------------------
      manage_views();
    },
    //=== объединяет строки в переданых аргументах =====================================================================
    str_concat = function () {
      var str = '', i;
      for (i = 0; i < arguments.length; i++) str += (arguments[i] + '');
      return str;
    },
    //=== получение строки с ведущим нудем слева =======================================================================
    str_pad = function (str, len) {
      str += '';
      while (str.length < len) str = '0' + str;
      return str;
    },
    //==================================================================================================================
    to_int = function (str) { return parseInt(str, 10);  },
      //=== Экранирование специальных символов, подготавливая ее к использованию в регулярных выражениях =================
    escape_regexp = function (str) {
      return str.replace(/([-.,*+?^${}()|[\]\/\\])/g, '\\$1');  //--- return string with special characters escaped
    },
    //=== проверка содержит ли строка корректную дату, согласно формата, определенного в "format" свойстве.
    //--- @param  string  str_date Строка, содержащая дату, отформатированная согласно "format" свойству.
    //---         Например, если "format" = "Y-m-d" строка должна быть "2011-06-01"
    //--- @return mixed возвращает JavaScript Date object если сравнение успешно, или FALSE.
    check_date = function (str_date) {
      //--- преобразуем argument в string
      str_date += '';
      //--- если аргумент присутствует -------------------------------------------------------------------------------
      if ($.trim(str_date) !== '') {
        var
        // --- изменяем формат экранируя спец. символы имеющие значение в регулярных выражениях
        format = escape_regexp(plugin.settings.format),
        //--- допустимые символы в формате
        format_chars = ['d', 'D', 'j', 'l', 'N', 'S', 'w', 'F', 'm', 'M', 'n', 'Y', 'y', 'G', 'g', 'H', 'h', 'i', 's', 'a', 'A'],
        matches = [],                                        //--- "сопадения" содержат символы определенные в date's format
        regexp = [],                                         //--- "regexp" регулярное выражение для каждого символа в date's format
        position = null,                                     //--- "position" содержит позицию символа найденого в date's format
        segments = null,                                     //--- "segments" содержит совпадения regular expression
        date, i;
        //--- для каждого символа из date's format -------------------------------------------------------------------
        for (i = 0; i < format_chars.length; i++)
          //--- если символ присутствует в date's format
          if ((position = format.indexOf(format_chars[i])) > -1)
            matches.push({ character: format_chars[i], position: position });
          //--- сортировка символов согласно их позиции в date's format
        matches.sort(function(a, b) { return a.position - b.position; });
        //--- для каждого символа в date's format и в заданном порядке
        $.each(matches, function(index, match) {
          //--- заполняем массив регулярных выражений, базирующийся на символе
          switch (match.character) {
            //--- день месяца, 2 цифры с ведущим нулём
            case 'd': regexp.push('0[1-9]|[12][0-9]|3[01]'); break;
            //--- текстовое представление дня недели, 3 символа (от Mon до Sun)
            case 'D': regexp.push(plugin.settings.days_abbr ? plugin.settings.days.map(
              function(value) { return escape_regexp(value); }).join('|') : '[a-z\u00C0-\u024F]{3}'); break;
            //--- день месяца без ведущего нуля
            case 'j': regexp.push('[1-9]|[12][0-9]|3[01]'); break;
            //--- полное наименование дня недели (от Sunday до Saturday)
            case 'l': regexp.push(plugin.settings.days_abbr ? plugin.settings.days.map(
              function(value) { return escape_regexp(value); }).join('|') : '[a-z\u00C0-\u024F]+'); break;
            //--- порядковый номер дня недели (от 1 (понедельник) до 7 (воскресенье))
            case 'N': regexp.push('[1-7]'); break;
            //--- англ.суффикс порядкового числительного дня месяца, 2 символа (st, nd, rd или th)
            case 'S': regexp.push('st|nd|rd|th'); break;
            //--- порядковый номер дня недели от 0 (воскресенье) до 6 (суббота)
            case 'w': regexp.push('[0-6]'); break;
            //--- полное наименование месяца, например, January или March
            case 'F': regexp.push(plugin.settings.months_abbr ? plugin.settings.months.map(
              function(value) { return escape_regexp(value); }).join('|') : '[a-z\u00C0-\u024F]+'); break;
            //--- порядковый номер месяца с ведущим нулём
            case 'm': regexp.push('0[1-9]|1[012]'); break;
            //--- сокращённое наименование месяца, 3 символа от Jan до Dec
            case 'M': regexp.push(plugin.settings.months_abbr ? plugin.settings.months.map(
              function(value) { return escape_regexp(value); }).join('|') : '[a-z\u00C0-\u024F]{3}'); break;
            //--- порядковый номер месяца без ведущего нуля
            case 'n': regexp.push('[1-9]|1[012]'); break;
            //--- порядковый номер года, 4 цифры
            case 'Y': regexp.push('[0-9]{4}'); break;
            //--- номер года, 2 цифры
            case 'y': regexp.push('[0-9]{2}'); break;
            //--- часы в 24-часовом формате без ведущего нуля
            case 'G': regexp.push('[1-9]|1[0-9]|2[0123]'); break;
            //--- часы в 12-часовом формате без ведущего нуля
            case 'g': regexp.push('[0-9]|1[012]'); break;
            //--- часы в 24-часовом формате с ведущим нулём
            case 'H': regexp.push('0[0-9]|1[0-9]|2[0123]'); break;
            //--- часы в 12-часовом формате с ведущим нулём
            case 'h': regexp.push('0[0-9]|1[012]'); break;
            //--- минуты с ведущим нулём
            case 'i': regexp.push('0[0-9]|[12345][0-9]'); break;
            //--- секунды с ведущим нулём
            case 's': regexp.push('0[0-9]|[12345][0-9]'); break;
            //--- am или pm
            case 'a': regexp.push('am|pm'); break;
            //--- AM или PM
            case 'A': regexp.push('AM|PM'); break;
          }
        });
        //--- имеется в наличии массив регулярных выражений ------------------------------------------------------------
        if (regexp.length) {
          matches.reverse();                                      //--- меняем порядок с символами формата даты
          //--- каждый символ в формате даты заменяем соответствующим регулярным выражением
          //--- добавляем (  ) - группу символов для поиска
          $.each(matches, function(index, match) {
            format = format.replace(match.character, '(' + regexp[regexp.length - index - 1] + ')');
          });
          //--- окончательное регулярное выражение (добавляем начало и конец входных данных)
          regexp = new RegExp('^' + format + '$', 'ig');
          //--- ищем совпадение (вызывается на регулярном выражении)
          if ((segments = regexp.exec(str_date))) {
          //             // check if date is a valid date (i.e. there's no February 31)
            var tmpdate        = new Date(),
              original_day     = 1,
              original_month   = tmpdate.getMonth() + 1,
              original_year    = tmpdate.getFullYear(),
              original_hours   = tmpdate.getHours(),
              original_minutes = tmpdate.getMinutes(),
              original_seconds = tmpdate.getSeconds(),
              original_ampm,
              english_days     = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
              english_months   = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
                                  'September', 'October', 'November', 'December'],
              iterable,
            //--- по умолчанию предполагаем корректность даты
              valid = true;
            //--- reverse обратно смиволы в формате даты
            matches.reverse();
            //--- для каждого символа формата в date's format
            $.each(matches, function(index, match) {
              // if the date is not valid, don't look further
              if (!valid) return true;
              // based on the character
              switch (match.character) {
                //--- извлекаем месяц из переданной даты
                case 'm': case 'n': original_month = to_int(segments[index + 1]);  break;
                //--- извлекаем номер дня из переданной даты
                case 'd': case 'j': original_day = to_int(segments[index + 1]); break;
                //--- D текстовое представление дня недели, 3 символа (от Mon до Sun)
                //--- l полное наименование дня недели (от Sunday до Saturday)
                //--- F полное наименование месяца, например, January или March
                //--- M сокращённое наименование месяца, 3 символа от Jan до Dec
                case 'D': case 'l': case 'F': case 'M':
                  if (match.character === 'D') iterable = plugin.settings.days_abbr || plugin.settings.days;
                  else if (match.character === 'l') iterable = plugin.settings.days;
                  else if (match.character === 'M') iterable = plugin.settings.months_abbr || plugin.settings.months;
                  else iterable = plugin.settings.months;
                  valid = false;
                  //--- для каждого month/days в используемом языке
                  $.each(iterable, function(key, value) {
                    //--- если month/day был введен корректно дальше не смотрим (ищем первое совпадение)
                    if (valid) return true;
                    if (segments[index + 1].toLowerCase() === value.substring(0, (
                       (match.character === 'D' && !plugin.settings.days_abbr)  ||
                       (match.character === 'M' && !plugin.settings.months_abbr) ? 3 : value.length)).toLowerCase()) {
                      switch (match.character) {
                        case 'D': segments[index + 1] = english_days[key].substring(0, 3); break;
                        case 'l': segments[index + 1] = english_days[key]; break;
                        case 'F': segments[index + 1] = english_months[key]; original_month = key + 1; break;
                        case 'M': segments[index + 1] = english_months[key].substring(0, 3); original_month = key + 1; break;
                      }
                      valid = true;
                    }});
                break;
                case 'Y': original_year = to_int(segments[index + 1]); break;
                case 'y': original_year = to_int('20' + to_int(segments[index + 1])); break;
                case 'G': case 'H': case 'g': case 'h': original_hours = to_int(segments[index + 1]); break;
                case 'i': original_minutes = to_int(segments[index + 1]); break;
                case 's': original_seconds = to_int(segments[index + 1]); break;
                case 'a': case 'A': original_ampm = segments[index + 1].toLowerCase(); break;
              }
            });
            //--- создаем объект Date используя полученные значения от пользователя
            if (valid) {
              date = new Date(original_year, (original_month || 1) - 1, original_day || 1, original_hours + (original_ampm === 'pm' &&
                              original_hours !== 12 ? 12 : (original_ampm === 'am' && original_hours === 12 ? -12 : 0)),
                              original_minutes, original_seconds);
              //--- проверяем совпадение с данными, полученными от пользователя
              if (date.getFullYear() === original_year && date.getDate() === (original_day || 1) &&
                  date.getMonth() === ((original_month || 1) - 1)) return date;
            }
          }
        }
        return false;
      }
    },
    //=== получаем строку из JavaScript date object в соответствии со спецификацией "format" ===========================
    format = function (date) {
      var result = '',
        j = date.getDate(),                   //--- day number, 1 - 31
        w = date.getDay(),                    //--- day of the week, 0 - 6, Sunday - Saturday
        l = plugin.settings.days[w],          //--- наименование дня недели Sunday - Saturday
        n = date.getMonth() + 1,              //--- номер месяца 1 - 12
        f = plugin.settings.months[n - 1],    //--- наименование месяца January - December
        y = date.getFullYear() + '',          //--- год как строка
        h = date.getHours(),                  //--- час 0-23
        h12 = h % 12 === 0 ? 12 : h % 12,     //--- час в 12 часовом format
        m = date.getMinutes(),                //--- минуты 0-59
        s = date.getSeconds(),                //--- секунды 0-59
        a = (h >= 12 ? 'pm' : 'am'),          //--- am/pm
        i, chr;
        //--- для каждого символа в формате format
        for (i = 0; i < plugin.settings.format.length; i++) {
          chr = plugin.settings.format.charAt(i);
          switch (chr) {
            //--- год как две цифры
            case 'y': y = y.substr(2); result += y; break;
            case 'Y': result += y; break;
            //--- месяц с префиксом 0 в начале month number, prefixed with 0
            case 'm': n = str_pad(n, 2); result += n; break;
            //--- номер месяца без ведущего нуля
            case 'n': result += n; break;
            //--- номер месяца (3 символа)
            case 'M':
              f = ( $.isArray(plugin.settings.months_abbr) && plugin.settings.months_abbr[n - 1] !== undefined ?
                plugin.settings.months_abbr[n - 1] : plugin.settings.months[n - 1].substr(0, 3));
              result += f;
            break;
            case 'F': result += f; break;
            //--- день с префиксом 0
            case 'd': j = str_pad(j, 2); result += j; break;
            case 'j': result += j; break;
            //--- номер дня, 3 символа
            case 'D':
              l = ($.isArray(plugin.settings.days_abbr) &&
                plugin.settings.days_abbr[w] !== undefined  ? plugin.settings.days_abbr[w] :
                plugin.settings.days[w].substr(0, 3));
              result += l;
            break;
            case 'l': result += l; break;
            //--- ISO-8601 numeric representation of the day of the week, 1 - 7
            case 'N': w++;  result += w; break;
            //--- день недели 0 - 6
            case 'w': result += w; break;
            //--- english suffix для месяца, 2 символа (st, nd, rd or th (works well with j))
            case 'S':
              if (j % 10 === 1 && j !== 11) result += 'st';
              else if (j % 10 === 2 && j !== 12) result += 'nd';
              else if (j % 10 === 3 && j !== 13) result += 'rd';
              else result += 'th';
            break;
            //--- час в 12 часовом формате без лидирующего 0
            case 'g': result += h12; break;
            //--- час в 12 часовом формате с лидирующим 0
            case 'h': result += str_pad(h12, 2); break;
            //--- час  в 24 часовом формате без лидирующего 0
            case 'G': result += h; break;
            //--- час в 24 часовом формате с лидирующим 0
            case 'H': result += str_pad(h, 2); break;
            //--- минуты с лидирующим 0
            case 'i': result += str_pad(m, 2); break;
            //--- секунды с лидирующим 0
            case 's': result += str_pad(s, 2); break;
            //--- am/pm, lowercase
            case 'a': result += a; break;
            //--- am/pm, uppercase
            case 'A': result += a.toUpperCase(); break;
            //--- все остальное как разделители
            default: result += chr;
          }
        }
      return result;
    },
    //=== возвращает TRUE если значение состоит из цифр ================================================================
    is_integer = function (value) {
        return (value + '').match(/^\-?[0-9]+$/);
      },
    //=== расчет номер недели для заданной даты ========================================================================
    get_week_number = function (date) {
      var y = date.getFullYear(),
          m = date.getMonth() + 1,
          d = date.getDate(),
          a, b, c, s, e, f, g, n, w;
        // // if month jan. or feb.
      if (m < 3) {
        a = y - 1;
        b = (a / 4 | 0) - (a / 100 | 0) + (a / 400 | 0);
        c = ((a - 1) / 4 | 0) - ((a - 1) / 100 | 0) + ((a - 1) / 400 | 0);
        s = b - c;
        e = 0;
        f = d - 1 + 31 * (m - 1);
          // // if month mar. through dec.
      } else {
        a = y;
        b = (a / 4 | 0) - (a / 100 | 0) + (a / 400 | 0);
        c = ((a - 1) / 4 | 0) - ((a - 1) / 100 | 0) + ((a - 1) / 400 | 0);
        s = b - c;
        e = s + 1;
        f = d + ((153 * (m - 3) + 2) / 5 | 0) + 58 + s;
      }
      g = (a + b) % 7;
        // ISO Weekday (0 is monday, 1 is tuesday etc.)
      d = (f + g - e) % 7;
      n = f + 3 - d;
      if (n < 0) w = 53 - ((g - s) / 5 | 0);
        else if (n > 364 + s) w = 1; else w = (n / 7 | 0) + 1;
      return w;
    },
    //=== устанавливаем заголовок для date picker ( @param строка заголовка которую необходимо отобразить)
    manage_header = function (caption) {
      if (!isNaN(parseFloat(selected_month)) && isFinite(selected_month))
        caption = caption.replace(/\bm\b|\bn\b|\bF\b|\bM\b/, function(match) {
          var months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль',
                        'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
          switch (match) {
            case 'm': return str_pad(selected_month + 1, 2); //--- month number, prefixed with 0
            case 'n': return selected_month + 1;                     //--- month number, not prefixed with 0
            case 'F': return months[selected_month];                 //--- full month name (return plugin.settings.months[selected_month];)
            case 'M': // month name, three letters
              return ($.isArray(plugin.settings.months_abbr) &&
                undefined !== plugin.settings.months_abbr[selected_month] ?
                plugin.settings.months_abbr[selected_month] : plugin.settings.months[selected_month].substr(0, 3));
            default: return match; //             // unknown replace
          }
        });
        if (!isNaN(parseFloat(selected_year)) && isFinite(selected_year)) caption = caption
            .replace(/\bY\b/, selected_year)                  // year as four digits
            .replace(/\by\b/, (selected_year + '').substr(2)) // year as two digits
            .replace(/\bY1\b/i, selected_year - 7)            // lower limit of year as two or four digits
            .replace(/\bY2\b/i, selected_year + 4);           // upper limit of year as two or four digits
        $('.dp_caption', header).html(caption);
    },
    //=== получаем имя пользовательского класса для заданной даты
    get_custom_class = function (year, month, day) {
      var class_name, i, found;
      //--- если передан месяц, инкрементируем его (as JavaScript uses 0 for January, 1 for February...)
      if (typeof month !== 'undefined') month = month + 1;
      //--- для каждого пользовательского класса
      for (i in custom_class_names) {
        class_name = custom_class_names[i]; found = false;
        if ($.isArray(custom_classes[class_name]))
          $.each(custom_classes[class_name], function() {
            //--- если пользовательский класс должен быть применен к дате, которую мы проверяем, не смотрите дальше
            if (found) return;
            var rule = this, weekday;
            //--- если правило должно быть применено для текущего года
            if ($.inArray(year, rule[2]) > -1 || $.inArray('*', rule[2]) > -1)
              //--- если правило должно быть применено для текущего месяца
              if ((typeof month !== 'undefined' && $.inArray(month, rule[1]) > -1) || $.inArray('*', rule[1]) > -1)
              //--- если правило должно быть применено для текущего дня
                if ((typeof day !== 'undefined' && $.inArray(day, rule[0]) > -1) || $.inArray('*', rule[0]) > -1) {
                  //--- если пользовательский класс должен быть применен в любой день
                  if ($.inArray('*', rule[3]) > -1) return (found = class_name);
                  //--- получаем будни
                  weekday = new Date(year, month - 1, day).getDay();
                  //--- если пользовательский класс должен быть применен к буднему дню
                  if ($.inArray(weekday, rule[3]) > -1) return (found = class_name);
                }

          });
        //--- если пользовательский класс должен быть применен к дате, которую мы проверяем
        if (found) return found;
      }
      return found || '';
    },
    //=== Проверяет, соответствуют ли ограничения календаря и/или значения, определенные параметром "disabled_dates"
    //=== @return boolean Returns TRUE if the given value is not disabled or FALSE otherwise
    is_disabled = function (year, month, day) {
      var now, len, disabled, enabled;
      if ((undefined === year || isNaN(year)) && (undefined === month || isNaN(month)) && (undefined === day || isNaN(day))) return false;
      else if (year < 1000) return true;                          //--- не обрабатываются даты менее 1000 года
      //--- если имеются ограничения по направлению (прошлое/будущее)
      if (!(!$.isArray(plugin.settings.direction) && to_int(plugin.settings.direction) === 0)) {
        //--- нормализуем и объединяем аргументы и преобразуем результат в число
        now = to_int(str_concat(year, (typeof month !== 'undefined' ? str_pad(month, 2) : ''),
                    (typeof day !== 'undefined' ? str_pad(day, 2) : '')));
        len = (now + '').length;
        if (len === 8 && (                                        //--- если мы проверяем дни
          //--- день до первой выбранной даты
          (typeof start_date !== 'undefined' && now < to_int(str_concat(first_selectable_year,
            str_pad(first_selectable_month, 2), str_pad(first_selectable_day, 2)))) ||
          //--- или день после последней выбранной даты
          (typeof end_date !== 'undefined' && now > to_int(str_concat(last_selectable_year,
            str_pad(last_selectable_month, 2), str_pad(last_selectable_day, 2))))
        )) return true;                                           //--- день должен быть отключен
        else if (len === 6 && (                                   //--- если мы проверяем месяцы
          //--- месяц до первого выбранного месяца
          (typeof start_date !== 'undefined' && now < to_int(str_concat(first_selectable_year, str_pad(first_selectable_month, 2)))) ||
          //--- или день после последней выбранной даты
          (typeof end_date !== 'undefined' && now > to_int(str_concat(last_selectable_year, str_pad(last_selectable_month, 2))))
        )) return true;                                           //--- месяц должен быть отключен
        else if (len === 4 && (                                   //--- если мы проверяем годы
          //--- год до первого выбираемого года
          (typeof start_date !== 'undefined' && now < first_selectable_year) ||
          //--- или день после последней выбранной даты
          (typeof end_date !== 'undefined' && now > last_selectable_year)
         )) return true;                                          //--- год должен быть запрещен
      }
      //--- если в качестве аргумента задан месяц, увеличьте его (as JavaScript uses 0 for January, 1 for February...)
      if (typeof month !== 'undefined') month = month + 1;
      //--- по умолчанию мы предполагаем, что день/месяц/год не включен и не отключен
      disabled = false; enabled = false;
      //--- если имеются правила запрещающие даты
      if ($.isArray(disabled_dates) && disabled_dates.length)
        $.each(disabled_dates, function() {                       //--- для каждого правила disable
          if (disabled) return;                                   //--- если дата должна быть отключена
          var rule = this, weekday;
          //--- если правила применяются на текущий год
          if ($.inArray(year, rule[2]) > -1 || $.inArray('*', rule[2]) > -1)
          //--- если правила действуют на текущий месяц
            if ((typeof month !== 'undefined' && $.inArray(month, rule[1]) > -1) || $.inArray('*', rule[1]) > -1)
              //--- если правила действуют на текущую дату
              if ((typeof day !== 'undefined' && $.inArray(day, rule[0]) > -1) || $.inArray('*', rule[0]) > -1) {
                //--- если день должен быть отключен независимо от дня
                if ($.inArray('*', rule[3]) > -1) return (disabled = true);
                //--- получаем будний день
                weekday = new Date(year, month - 1, day).getDay();
                //--- если будний день должен быть отключен
                if ($.inArray(weekday, rule[3]) > -1) return (disabled = true);
              }

        });

      //--- если есть правила, которые явно разрешают даты
      if (enabled_dates)
      $.each(enabled_dates, function() {
        if (enabled) return;                                      //--- если дата должна быть включена
        var rule = this, weekday;
        //--- если правила применяются на текущий год
        if ($.inArray(year, rule[2]) > -1 || $.inArray('*', rule[2]) > -1) {
          enabled = true;  //---  год включен
          //--- если также проверяем месяцы
          if (typeof month !== 'undefined') {
            enabled = true;                                       //---  предполагаем, что месяц включен
            //--- если правила действуют на текущий месяц
            if ($.inArray(month, rule[1]) > -1 || $.inArray('*', rule[1]) > -1) {
              //--- если также проверяем дни
              if (typeof day !== 'undefined') {
                enabled = true;                                     //--- предполагаем, что день включен
                //--- если правила действуют на текущий день
                if ($.inArray(day, rule[0]) > -1 || $.inArray('*', rule[0]) > -1) {
                  //--- если день должен быть включен независимо от дня
                  if ($.inArray('*', rule[3]) > -1) return (enabled = true);
                  weekday = new Date(year, month - 1, day).getDay();
                  //--- если будний день должен быть включен
                  if ($.inArray(weekday, rule[3]) > -1) return (enabled = true);
                  enabled = false;
                } else enabled = false;
              }
            } else enabled = false;                                 //--- если месяц не включен
          }
        }
      });

      if (enabled_dates && enabled) return false;
      else if (disabled_dates && disabled) return true;
      return false;
    },
    // === формируем day picker view, и выводим его (используется в manage_views) ======================================
    generate_daypicker = function () {
      var
        //--- количество дней в текущем выбранном месяце
        days_in_month = new Date(selected_year, selected_month + 1, 0).getDate(),
        //--- получаем для первого дня месяца стартовую позицию дня недели (from 0 to 6)
        first_day = new Date(selected_year, selected_month, 1).getDay(),
        //--- количество дней в предыдущем месяце
        days_in_previous_month = new Date(selected_year, selected_month, 0).getDate(),
        //--- количество дней от предыдущего месяца, которое должно быть показано
        days_from_previous_month = first_day - plugin.settings.first_day_of_week,
        i, html, day, real_date, real_year, real_month, real_day, weekday, class_name, custom_class_name, is_weekend, rtl_offset;
      //----------------------------------------------------------------------------------------------------------------
      days_from_previous_month = days_from_previous_month < 0 ? 7 + days_from_previous_month : days_from_previous_month;
      //--- устанавливаем текст заголовка
      manage_header(plugin.settings.header_captions.days);
      //--- генерируем текст HTML --------------------------------------------------------------------------------------
      html = '<tr>';
      //--- если должен быть показан столбец с номером недели
      if (plugin.settings.show_week_number) html += '<th>' + plugin.settings.show_week_number + '</th>';
      //--- выводим абревиатуру дней в заголовке календаря -------------------------------------------------------------
      for (i = 0; i < 7; i++) {
        day = (plugin.settings.first_day_of_week + (plugin.settings.rtl ? 6 - i : i)) % 7;
        html += '<th>' + ($.isArray(plugin.settings.days_abbr) &&
         undefined !== plugin.settings.days_abbr[day] ? plugin.settings.days_abbr[day] : plugin.settings.days[day].substr(0, 2)) + '</th>';
      }
      //--- формируем ячейки календаря ---------------------------------------------------------------------------------
      html += '</tr><tr>';
      for (i = 0; i < 42; i++) {
        //--- we need some additional math when showing an RTL calendar
        rtl_offset = (plugin.settings.rtl ? 6 - ((i % 7) * 2) : 0);
        if (i > 0 && i % 7 === 0) html += '</tr><tr>';            //--- при завершении текущей строки - переходим на следующую
        //--- в начале строки, если необходимо показывать дополнительный столбец (номер недели)
        if (i % 7 === 0 && plugin.settings.show_week_number) //         // show ISO 8601 week number
          html += '<th>' + get_week_number(new Date(selected_year, selected_month, (i - days_from_previous_month + 1))) + '</th>';
        //--- the number of the day in month
        day = rtl_offset + (i - days_from_previous_month + 1);
        //--- если даты предыдущего/следующего месяца могут быть выбрпаны, и это один из этих дней
        if (plugin.settings.select_other_months && (i < days_from_previous_month || day > days_in_month)) {
          // use the Date object to normalize the date
          // for example, 2011 05 33 will be transformed to 2011 06 02
          real_date  = new Date(selected_year, selected_month, day);
          real_year  = real_date.getFullYear();
          real_month = real_date.getMonth();
          real_day   = real_date.getDate();
          //--- extract normalized date parts and merge them
          real_date = real_year + str_pad(real_month + 1, 2) + str_pad(real_day, 2);
        }
        //--- get the week day (0 to 6, Sunday to Saturday)
        weekday = (plugin.settings.first_day_of_week + i) % 7;
        //--- является ли день выходным?
        is_weekend = ($.inArray(weekday, plugin.settings.weekend_days) > -1);
        //--- если это день предыдущего месяца
        if ((plugin.settings.rtl && day < 1) || (!plugin.settings.rtl && i < days_from_previous_month))
          html += '<td class="dp_not_in_month ' + (is_weekend ? 'dp_weekend ' : '') +
            (plugin.settings.select_other_months && !is_disabled(real_year, real_month, real_day) ?
            'date_' + real_date : 'dp_disabled') + '">' + (plugin.settings.select_other_months || plugin.settings.show_other_months ?
             str_pad(rtl_offset + days_in_previous_month - days_from_previous_month + i + 1,
               plugin.settings.zero_pad ? 2 : 0) : '&nbsp;') + '</td>';
        //--- если это день следующего месяца
        else if (day > days_in_month)
          html += '<td class="dp_not_in_month ' + (is_weekend ? 'dp_weekend ' : '') +
            (plugin.settings.select_other_months && !is_disabled(real_year, real_month, real_day) ?
            'date_' + real_date : 'dp_disabled') + '">' + (plugin.settings.select_other_months || plugin.settings.show_other_months ?
             str_pad(day - days_in_month, plugin.settings.zero_pad ? 2 : 0) : '&nbsp;') + '</td>';
        else {                                                    //---  если это день текущего месяца
          class_name = '';
          // custom class, if any
          custom_class_name = get_custom_class(selected_year, selected_month, day);
          //--- если текущий день - выходной
          if (is_weekend) class_name = ' dp_weekend';
          //--- если текущая дата - системная дата
          if (selected_month === current_system_month && selected_year === current_system_year &&
              current_system_day === day) class_name += ' dp_current';
          //--- если существует пользовательский класс - добавляем его
          if (custom_class_name !== '') class_name += ' ' + custom_class_name;
          //--- подсветка текущей даты
          if (selected_month === default_month && selected_year === default_year && default_day === day) class_name += ' dp_selected';
          //--- если дата должна быть запрещена
          if (is_disabled(selected_year, selected_month, day)) class_name += ' dp_disabled';
          //--- выводим день месяца (if "day" is NaN, use an empty string instead)
          html += '<td' + (class_name !== '' ? ' class="' + $.trim(class_name) + '"' : '') + '>' +
            ((plugin.settings.zero_pad ? str_pad(day, 2) : day) || '&nbsp;') + '</td>';
        }
      }
      html += '</tr>';
      daypicker.html($(html));                                    //--- вставляем day picker в DOM
      if (plugin.settings.always_visible)
      //--- cache все ячейки
      //--- они нужны нам для того, чтобы мы могли легко удалить класс "dp_selected" из всех них, когда пользователь выбирает дату)
      daypicker_cells = $('td:not(.dp_disabled)', daypicker);
      daypicker.show();
    },
    // === формируем month picker view, и выводим его (используется в manage_views) ====================================
    generate_monthpicker = function () {
      //--- manage header caption and enable/disable navigation buttons if necessary
      manage_header(plugin.settings.header_captions.months);
      var html = '<tr>', i, class_name, month;
      for (i = 0; i < 12; i++) {                                  //--- iterate through all the months
        if (i > 0 && i % 3 === 0) html += '</tr><tr>';            //--- three month per row
          //--- the month, taking RTL into account
          month = plugin.settings.rtl ? 2 + i - (2 * (i % 3)) : i;
          class_name = 'dp_month_' + month;
          //--- if month needs to be disabled
          if (is_disabled(selected_year, month)) class_name += ' dp_disabled';
          //--- else, if a date is already selected and this is that particular month, highlight it
          else if (default_month !== false && default_month === month && selected_year === default_year) class_name += ' dp_selected';
          //--- else, if this the current system month, highlight it
          else if (current_system_month === month && current_system_year === selected_year) class_name += ' dp_current';
          //--- first three letters of the month's name
          html += '<td class="' + $.trim(class_name) + '">' + ($.isArray(plugin.settings.months_abbr) && undefined !== plugin.settings.months_abbr[month] ? plugin.settings.months_abbr[month] : plugin.settings.months[month].substr(0, 3)) + '</td>';
        }
      //--- wrap up
      html += '</tr>';
      monthpicker.html($(html));                                  //--- inject into the DOM
      if (plugin.settings.always_visible)                         //--- if date picker is always visible
        // cache all the cells
        // (we need them so that we can easily remove the "dp_selected" class from all of them when user selects a month)
        monthpicker_cells = $('td:not(.dp_disabled)', monthpicker);
        monthpicker.show();                                       //--- make the month picker visible
    },
    // === формируем year picker view, и выводим его (используется в manage_views) =====================================
    generate_yearpicker = function () {
      //--- manage header caption and enable/disable navigation buttons if necessary
      manage_header(plugin.settings.header_captions.years);
      var html = '<tr>', i, class_name, year;
      //--- we're showing 12 years at a time, current year in the middle
      for (i = 0; i < 12; i++) {
        if (i > 0 && i % 3 === 0) html += '</tr><tr>';            //--- three years per row
          year = plugin.settings.rtl ? 2 + i - (2 * (i % 3)) : i; //--- the year, taking RTL into account
          class_name = '';
          //--- if year needs to be disabled
          if (is_disabled(selected_year - 7 + year)) class_name += ' dp_disabled';
          //--- else, if a date is already selected and this is that particular year, highlight it
          else if (default_year && default_year === selected_year - 7 + year) class_name += ' dp_selected';
          //--- else, if this is the current system year, highlight it
          else if (current_system_year === (selected_year - 7 + year)) class_name += ' dp_current';
          //--- first three letters of the month's name
          html += '<td' + ($.trim(class_name) !== '' ? ' class="' + $.trim(class_name) + '"' : '') + '>' + (selected_year - 7 + year) + '</td>';
      }
      html += '</tr>';
      yearpicker.html($(html));                                   //--- inject into the DOM
      //--- if date picker is always visible
      if (plugin.settings.always_visible)
      //--- cache all the cells
      //--- (we need them so that we can easily remove the "dp_selected" class from all of them when user selects a year)
      yearpicker_cells = $('td:not(.dp_disabled)', yearpicker);
      //--- make the year picker visible
      yearpicker.show();
    },
    // === формируем time picker view, и выводим его (используется в manage_views) =====================================
    generate_timepicker = function () {
      var html, condensed = (timepicker_config.hours && timepicker_config.minutes && timepicker_config.seconds && timepicker_config.ampm);
      html = '<tr class="dp_time_controls_increase' + (condensed ? ' dp_time_controls_condensed' : '') + '">' +
          (plugin.settings.rtl && timepicker_config.ampm ? '<td class="dp_time_ampm dp_time_control">' +
           plugin.settings.navigation[2] + '</td>' : '') +
          (timepicker_config.hours ? '<td class="dp_time_hour dp_time_control">' + plugin.settings.navigation[2] + '</td>' : '') +
          (timepicker_config.minutes ? '<td class="dp_time_minute dp_time_control">' + plugin.settings.navigation[2] + '</td>' : '') +
          (timepicker_config.seconds ? '<td class="dp_time_second dp_time_control">' + plugin.settings.navigation[2] + '</td>' : '') +
          (!plugin.settings.rtl && timepicker_config.ampm ? '<td class="dp_time_ampm dp_time_control">' +
            plugin.settings.navigation[2] + '</td>' : '') +'</tr>';
      html += '<tr class="dp_time_segments' + (condensed ? ' dp_time_controls_condensed' : '') + '">';
      if (plugin.settings.rtl && timepicker_config.ampm) html += '<td class="dp_time_ampm dp_disabled' +
        (timepicker_config.hours || timepicker_config.minutes || timepicker_config.seconds ? ' dp_time_separator' : '') +
        '"><div>' + (timepicker_config.ampm_case === 'A' ? selected_ampm.toUpperCase() : selected_ampm) + '</div></td>';
      if (timepicker_config.hours) html += '<td class="dp_time_hours dp_disabled' +
         (timepicker_config.minutes || timepicker_config.seconds || (!plugin.settings.rtl && timepicker_config.ampm) ?
           ' dp_time_separator' : '') + '"><div>' + (timepicker_config.hour_format === 'h' ||
        timepicker_config.hour_format === 'H' ? str_pad(selected_hour, 2) : selected_hour) + '</div></td>';
      if (timepicker_config.minutes) html += '<td class="dp_time_minutes dp_disabled' + (timepicker_config.seconds ||
        (!plugin.settings.rtl && timepicker_config.ampm) ? ' dp_time_separator' : '') + '"><div>' +
          str_pad(selected_minute, 2) + '</div></td>';
      if (timepicker_config.seconds) html += '<td class="dp_time_seconds dp_disabled' + (!plugin.settings.rtl &&
        timepicker_config.ampm ? ' dp_time_separator' : '') + '"><div>' + str_pad(selected_second, 2) + '</div></td>';
      if (!plugin.settings.rtl && timepicker_config.ampm) html += '<td class="dp_time_ampm dp_disabled">' +
         (timepicker_config.ampm_case === 'A' ? selected_ampm.toUpperCase() : selected_ampm) + '</td>';
      html += '</tr>';
      html += '<tr class="dp_time_controls_decrease' + (condensed ? ' dp_time_controls_condensed' : '') + '">' +
        (plugin.settings.rtl && timepicker_config.ampm ? '<td class="dp_time_ampm dp_time_control">' +
         plugin.settings.navigation[3] + '</td>' : '') +
        (timepicker_config.hours ? '<td class="dp_time_hour dp_time_control">' + plugin.settings.navigation[3] + '</td>' : '') +
        (timepicker_config.minutes ? '<td class="dp_time_minute dp_time_control">' + plugin.settings.navigation[3] + '</td>' : '') +
        (timepicker_config.seconds ? '<td class="dp_time_second dp_time_control">' + plugin.settings.navigation[3] + '</td>' : '') +
        (!plugin.settings.rtl && timepicker_config.ampm ? '<td class="dp_time_ampm dp_time_control">' +
          plugin.settings.navigation[3] + '</td>' : '') +'</tr>';
      //--- inject into the DOM
      timepicker.html($(html));
      //--- make the time picker visible
      timepicker.show();
    },
    //=== вывод view (days, months, years or time) согласно текущего значения свойства "view"
    manage_views = function (fire_events) {
      var height, elements;
      //--- если day picker еще не сгенерирован ------------------------------------------------------------------------
      if (daypicker.text () === '' || view === 'days') {
        //--- если day picker еще не сгенерирован
        if (daypicker.text() === '') {
          //--- если date picker не всегда видимый в контейнере
          if (!(plugin.settings.always_visible instanceof jQuery))
            //--- временно перемещаем date picker's влево, так мы сможем вычислить его видимые ширину и высоту
            datepicker.css('left', -1000);
          datepicker.removeClass('hidden');
          generate_daypicker();                                   //--- заполняем day picker
          //--- jQuery округляет значения, возвращаемые outerWidth и outerHeight
          //--- следовательно, если мы можем получить неокругленные значения, то получим их
          //--- получим ширину и высоту day picker's (нам нужна вторая проверка для Internet Explorers...)
          if (typeof daypicker[0].getBoundingClientRect !== 'undefined' &&
              typeof daypicker[0].getBoundingClientRect().height !== 'undefined') height = daypicker[0].getBoundingClientRect().height;
          else height = daypicker.outerHeight(true);
          //--- делаем все остальные picker одинакового размера
          monthpicker.css('height', height);
          yearpicker.css('height', height);
          timepicker.css('height', height + header.outerHeight(true));
          //--- установливаем ширину контейнера так, чтобы все виды имели ширину 100%
          datepicker.css('width', datepicker.outerWidth());
          datepicker.addClass('dp_hidden');                       //--- скрываем date picker
        }
        else generate_daypicker();
        header.show();                                        //--- показываем заголовок
        //--- прячем year and the month pickers
        monthpicker.hide();
        yearpicker.hide();
        //--- прячем time-picker related elements
        timepicker.hide();
        view_toggler.hide();
        confirm_selection.hide();
        //--- если time picker доступен, show the clock icon
        if (timepicker_config) view_toggler.show().removeClass('dp_calendar');
      }
      else if (view === 'months') {
        generate_monthpicker();                                   //--- формируем the month picker
        //--- скрываем day and the year pickers
        daypicker.hide();
        yearpicker.hide();
        //--- скрываем time-picker related elements
        timepicker.hide();
        view_toggler.hide();
        confirm_selection.hide();

      } else if (view === 'years') {
        generate_yearpicker();                                    //--- формируем the year picker
        daypicker.hide();
        monthpicker.hide();
        //--- скрываем time-picker related elements
        timepicker.hide();
        view_toggler.hide();
        confirm_selection.hide();
      } else if (view === 'time') {
        generate_timepicker();                                    //--- формируем the time picker
        if (views.length === 1) {                                 //--- если "time" view единственное представление
          view_toggler.hide();                                    //--- скрываем the time picker toggler button
          confirm_selection.show();                               //--- показываем confirmation button
        } else {                                                  //--- если "time" view не единственное представление
          view_toggler.show().addClass('dp_calendar');            //--- time picker toggler button, but change the icon
          if (valueRW() === '') confirm_selection.hide();         //--- если не выбрана дата - скрываем hide the confirmation button
          else confirm_selection.show();                          //--- показываем the confirmation button
        }

        //скрываем  заголовок, day, month and year pickers
        header.hide();
        daypicker.hide();
        monthpicker.hide();
        yearpicker.hide();
      }
      //--- если для навигации по days/months/years/time
      //--- ("fire_events" is FALSE when the method was called by the "update" method)
      if (fire_events !== false && plugin.settings.onChange && typeof plugin.settings.onChange === 'function' && undefined !== view) {
        //--- получаем активные элементы в view (ignoring the disabled ones)
        elements = (view === 'days' ? daypicker.find('td:not(.dp_disabled)') :
                   (view === 'months' ? monthpicker.find('td:not(.dp_disabled)') :
                   (view === 'years' ? yearpicker.find('td:not(.dp_disabled)') : timepicker.find('.dp_time_segments td'))));
        //--- для каждого элемента прикрепляем "date" data attribute
        //--- YYYY-MM-DD if the view is "days"
        //--- YYYY-MM if the view is "months"
        //--- YYYY if the view is "years"
        //--- таким образом, легко идентифицировать элементы в списке
        elements.each(function() {
          var matches;
          if (view === 'days')
            //--- если дата относится к следующему/предыдущему месяцу и выбирается
            if ($(this).hasClass('dp_not_in_month') && !$(this).hasClass('dp_disabled')) {
              //-- извлекаем дату из прикрепленного класса
              matches = $(this).attr('class').match(/date\_([0-9]{4})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])/);
              //--- прикрепляем дату к "date" атрибуту в формате YYYY-MM-DD для легкой идентификации
              $(this).data('date', matches[1] + '-' + matches[2] + '-' + matches[3]);
            } else                                                //--- если дата из текущего выбранного месяца
              //--- прикрепляем дату к "date" атрибуту в формате YYYY-MM-DD для легкой идентификации
              $(this).data('date', selected_year + '-' + str_pad(selected_month + 1, 2) + '-' +
                str_pad(to_int($(this).text()), 2));
          else if (view === 'months') {                           //--- if view is "months"
            //--- получаем номер месяца для класса элемента
            matches = $(this).attr('class').match(/dp\_month\_([0-9]+)/);
            //--- прикрепляем дату к "date" атрибуту в формате YYYY-MM для легкой идентификации
            $(this).data('date', selected_year + '-' + str_pad(to_int(matches[1]) + 1, 2));
          } else if (view === 'years') //         // if view is "years"
            //--- прикрепляем к "date" атрибуту данные в формате YYYY для легкой идентификации
            $(this).data('date', to_int($(this).text()));
        });

        //---выполняем callback function и передаем текущий view, the elements in the view, and the element the plugin is attached to
        plugin.settings.onChange.call($element, view, elements);
      }
      //--- делаем нижний колонтитул видимым
      footer.show();
      //--- если текущий view "time"  и других больше нет
      if (view === 'time' && views.length > 1) {
        //--- прячем кнопки "Today" и "Clear"
        selecttoday.hide();
        cleardate.hide();
        //--- устанавливаем ширину view toggler
        view_toggler.css('width', valueRW() === '' ? '100%' : '50%');
      } else {
        //--- делаем видимыми кнопки "Today" and "Clear"
        selecttoday.show();
        cleardate.show();
        //--- если кнопка для очистки ранее выбранной даты должна быть видна все время
        //--- или кнопка "Очистить" должна отображаться только тогда, когда дата была ранее выбрана, и теперь это так,
        //--- или средство выбора даты всегда видно, а кнопка "Очистить" явно не была отключена
        if (
          plugin.settings.show_clear_date === true ||
          (plugin.settings.show_clear_date === 0 && valueRW() !== '') ||
          (plugin.settings.always_visible && plugin.settings.show_clear_date !== false)
        )
          if (show_select_today) {                                //--- если кнопка сегодня видима
            selecttoday.css('width', '50%');                      //--- установить ширину на 50% от доступного пространства
            cleardate.css('width', '50%');                        //--- кнопка "Clear date" займет 50% от текущей ширины

          } else {                                                //--- если кнопка "Today" не видна
            selecttoday.hide();                                   //--- прячем кнопку "Today"
            //--- кнопка "Clear date" займет 100% текущего пространства если time picker недоступен иначе 50%
            cleardate.css('width', $.inArray(views, 'time') > -1 ? '50%' : '100%');
          }
        else {
          cleardate.hide();                                        //--- прячем кнопку "Clear"
          //--- если кнопка "Today" видима, то она займет все доступное пространство
          if (show_select_today) selecttoday.css('width', '100%');
          else {                                                   //--- если кнопка "Today" невидима - прячем ее
            selecttoday.hide();
            //--- если не timepicker view, прячем нижний колонтитул
            if (!timepicker_config || (view !== 'time' && view !== 'days')) footer.hide();
          }
        }
      }
    },
    //=== обновление парного выбора даты (начальная дата которого зависит от значения текущего выбора даты)
    update_dependent = function (date) {
      //--- если существует парный элемент
      if (plugin.settings.pair)
        $.each(plugin.settings.pair, function() {                 //--- для каждого парного элемента
          var $pair = $(this), dp;
            // chances are that in the beginning the pair element doesn't have the Zebra_DatePicker attached to it yet
            // (as the "start" element is usually created before the "end" element)
            // so we'll have to rely on "data" to send the starting date to the pair element
            // therefore, if Zebra_DatePicker is not yet attached
            if (!($pair.data && $pair.data('Zebra_DatePicker')))
              $pair.data('zdp_reference_date', date);             //--- устанавливаем начальную дату
            else {                                                //--- if Zebra_DatePicker is attached to the pair element
              // reference the date picker object attached to the other element
              dp = $pair.data('Zebra_DatePicker');
              // update the other date picker's starting date
              // the value depends on the original value of the "direction" attribute
              // (also, if the pair date picker does not have a direction, set it to 1)
              dp.update({
                reference_date: date,
                direction:      dp.settings.direction === 0 ? 1 : dp.settings.direction
              });
              // if the other date picker is always visible, update the visuals now
              if (dp.settings.always_visible) dp.show();
            }
          });
      },
    //=== предотвращение выделение текста на элементе, используется на кнопках "Предыдущий" и "следующий"
    disable_text_select = function (el) {
      //--- if browser is Firefox
      if (browser.name === 'firefox') el.css('MozUserSelect', 'none');
      //--- if browser is Internet Explorer
      else if (browser.name === 'explorer') $(document).on('selectstart', el, function() { return false; });
      //---for the other browsers
      else el.mousedown(function() { return false; });
    },
    //=== заполняет дату в элементе прикрепленном к date picker и скрывает его =========================================
    //--- year,month,day - год месяц, день - соответственно, rview - вид, cell - элемент где был выбор
    select_date = function (year, month, day, rview, cell) {
      var
        //--- конструктор новой даты
        default_date = new Date(year, month, day,
          (timepicker_config && timepicker_config.hours ? selected_hour +
            (timepicker_config.ampm ? (selected_ampm === 'pm' && selected_hour !== 12 ? 12 :
            (selected_ampm === 'am' && selected_hour === 12 ? -12 : 0)) : 0) : 12),
          (timepicker_config && timepicker_config.minutes ? selected_minute : 0),
          (timepicker_config && timepicker_config.seconds ? selected_second : 0)
        ),
        //--- объекты ячеек текущего представления
        view_cells = (rview === 'days' ? daypicker_cells : (rview === 'months' ? monthpicker_cells : yearpicker_cells)),
        selected_value = format(default_date);                    //--- получаем выбранную дату в корректном формате
        valueRW(selected_value);                                  //--- устанавливаем выбранную дату в элементе
        if (plugin.settings.always_visible || timepicker_config){ //--- если date picker всегда виден или доступен time picker
        //--- извлекаем части даты и переприсваиваем переменные --------------------------------------------------------
        default_month  = default_date.getMonth();
        selected_month = default_date.getMonth();
        default_year   = default_date.getFullYear();
        selected_year  = default_date.getFullYear();
        default_day    = default_date.getDate();
        //--- проверяем наличие ячейки (для time picker это не так) и переназначаем активную ячейку --------------------
        if (cell && view_cells) {
          view_cells.removeClass('dp_selected');                  //--- удаляем "selected" class из предыдущей ячейки
          cell.addClass('dp_selected');                           //--- добавляем "selected" class к теущей ячейки
          //--- если view = "days" и дни других месяцев выбираемы переформировать вывод таким образом чтобы сменить месяц
          if (rview === 'days' && cell.hasClass('dp_not_in_month') && !cell.hasClass('dp_disabled')) plugin.show();
        }
      }
      //--- если format содержит время, переключиться к  time picker view
      if (timepicker_config) { view = 'time'; manage_views(); }
      else {                                                      //--- если format не содержит time
        $element.focus();                                         //--- перемещаем фокус на элемент к которому прикреплен plugin
        plugin.hide();                                            //--- скрываем date picker
      }
      //--- обновляем значение для date picker которые зависят от выбранной даты
      update_dependent(default_date);
      //--- если имеется callback function для выбранной даты вызывыаем ее
      if (!timepicker_config && plugin.settings.onSelect && typeof plugin.settings.onSelect === 'function')
        plugin.settings.onSelect.call($element, selected_value,
          year + '-' + str_pad(month + 1, 2) + '-' + str_pad(day, 2), default_date);
    },
   //===================================================================================================================
    manage_timer_controls = function (element) {
      var
      // are we increasing or decreasing values?
      increase = $(element).parent('.dp_time_controls_increase').length > 0,
      // figure out what we're increasing (hour, minutes, seconds, ampm)
      matches = $(element).attr('class').match(/dp\_time\_([^\s]+)/i),
      value_container = $('.dp_time_segments .dp_time_' + matches[1] + (matches[1] !== 'ampm' ? 's' : ''), timepicker),
      // the current value (strip the zeros in front)
      value = value_container.text().toLowerCase(),
      // the array with allowed values
      lookup = timepicker_config[matches[1] + (matches[1] !== 'ampm' ? 's' : '')],
      // the current value's position in the array of allowed values
      current_value_position = $.inArray(matches[1] !== 'ampm' ? parseInt(value, 10) : value, lookup),
      // the next value's position in the lookup array
      next_value_position = current_value_position === -1 ? 0 : (increase ? (current_value_position + 1 >= lookup.length ? 0 :
        current_value_position + 1) : (current_value_position - 1 < 0 ? lookup.length - 1 : current_value_position - 1)),default_date;
      // increase/decrease the required value according to the values in the lookup array
      if (matches[1] === 'hour') selected_hour = lookup[next_value_position];
      else if (matches[1] === 'minute') selected_minute = lookup[next_value_position];
      else if (matches[1] === 'second') selected_second = lookup[next_value_position];
      else selected_ampm = lookup[next_value_position];
      // if a default day is not available and the "start_date" property is set
      if (!default_day && plugin.settings.start_date) {
        // check if "start_date" is valid according to the format
        default_date = check_date(plugin.settings.start_date);
        // and if it is, extract the day from there
        if (default_date) default_day = default_date.getDate();
      }
      // if still no value, use the first selectable day
      if (!default_day) default_day = first_selectable_day;
        // set the new value
        value_container.text(str_pad(lookup[next_value_position], 2).toUpperCase());
        // update the value in the element
        select_date(selected_year, selected_month, default_day);
    },
    //=== определяем тип браузера ======================================================================================
    browser = {
      init: function () {
        this.name = this.searchString(this.dataBrowser) || '';
        this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || '';
      },
      searchString: function (data) {
        var i, dataString, dataProp;
        for (i = 0; i < data.length; i++) {
          dataString = data[i].string;
          dataProp = data[i].prop;
          this.versionSearchString = data[i].versionSearch || data[i].identity;
          if (dataString) {
            if (dataString.indexOf(data[i].subString) !== -1) return data[i].identity;
          } else if (dataProp) return data[i].identity;
        }
      },
      searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index === -1) return;
        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
      },
      dataBrowser: [
        {
           string: navigator.userAgent,
           subString: 'Firefox',
           identity: 'firefox'
        },
        {
           string: navigator.userAgent,
           subString: 'MSIE',
           identity: 'explorer',
           versionSearch: 'MSIE'
        }
      ]
    };
    //=== скрываем date picker =========================================================================================
    plugin.hide = function (outside) {
      //--- если date picker еще не скрыт И date picker не всегда виден или нажали вне date picker
      //--- (аргумент "outside" = TRUE при щелчке вне date picker, а параметр "always_visible" имеет значение boolean TRUE)
      if (!datepicker.hasClass('dp_hidden') && (!plugin.settings.always_visible || outside)) {
        datepicker.addClass('dp_hidden');                         //--- скрываем date picker
        //--- если callback function существует для случая закрытия date picker
        if (plugin.settings.onClose && typeof plugin.settings.onClose === 'function')
          //--- вызываем the callback функцию и передаем как аргумент прикрепленный element
          plugin.settings.onClose.call($element);
      }
    };
    //=== устанавливаем новое значение даты date picker ================================================================
    //=== значение должно быть строкой, представляющая дату в формате, заданном свойством "format", или объект даты JavaScript.
    plugin.set_date = function (date) {
      var dateObj;
      if (typeof date === 'object' && date instanceof Date) date = format(date);
      if ((dateObj = check_date(date)) && !is_disabled(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate())) {
        valueRW(date);
        update_dependent(dateObj);
      }
    };
    //=== обновляем конфигурационные опции данными из аргумента ========================================================
    plugin.update = function (values) {
      //--- if original direction not saved, save it now
      if (plugin.original_direction) plugin.original_direction = plugin.direction;
      //--- объединяем и перезаписываем plugin.settings
      plugin.settings = $.extend(plugin.settings, values);
      //--- reinitialize the object with the new options
      init(true);
    };
    //=== вывод date picker ============================================================================================
    plugin.show = function (fire_events) {
      view = plugin.settings.view;
      var current_date,
        //--- получаем начальную дату и проверяем соответствие ее формату
      default_date = check_date(valueRW() || (plugin.settings.start_date ? plugin.settings.start_date : ''));
      if (default_date) {
        //     // extract the date parts
        //     // we'll use these to highlight the default date in the date picker and as starting point to
        //     // what year and month to start the date picker with
        //     // why separate values? because selected_* will change as user navigates within the date picker
        default_month = default_date.getMonth();
        selected_month = default_date.getMonth();
        default_year = default_date.getFullYear();
        selected_year = default_date.getFullYear();
        default_day = default_date.getDate();
        //     // if the default date represents a disabled date
        if (is_disabled(default_year, default_month, default_day)) {
          //         // if date picker is in "strict" mode, clear the value of the parent element
          if (plugin.settings.strict) valueRW('');
          //         // the calendar will start with the first selectable year/month
          selected_month = first_selectable_month;
          selected_year = first_selectable_year;
        }
       //--- if a default value is not available, or value does not represent a valid date
      } else {
        //     // the calendar will start with the first selectable year/month
        selected_month = first_selectable_month;
        selected_year = first_selectable_year;
      }
      // whatever the case, if time picker is enabled
      if (timepicker_config) {
        //     // if a default date is available, use the time from there
        if (default_date) current_date = default_date;
        //     // use current system time otherwise
        else current_date = new Date();
        //     // extract time parts from it
        selected_hour = current_date.getHours();
        selected_minute = current_date.getMinutes();
        selected_second = current_date.getSeconds();
        selected_ampm = (selected_hour >= 12 ? 'pm' : 'am');
        //     // if hour is in 12 hour format
        if (timepicker_config.is12hour)
          //         // convert it to the correct value
          selected_hour = (selected_hour % 12 === 0 ? 12 : selected_hour % 12);
        //     // make sure that the default values are within the allowed range, if a range is defined
        if ($.isArray(plugin.settings.enabled_hours) && $.inArray(selected_hour, plugin.settings.enabled_hours) === -1) selected_hour = plugin.settings.enabled_hours[0];
        if ($.isArray(plugin.settings.enabled_minutes) && $.inArray(selected_minute, plugin.settings.enabled_minutes) === -1) selected_minute = plugin.settings.enabled_minutes[0];
        if ($.isArray(plugin.settings.enabled_seconds) && $.inArray(selected_second, plugin.settings.enabled_seconds) === -1) selected_second = plugin.settings.enabled_seconds[0];
        if ($.isArray(plugin.settings.enabled_ampm) && $.inArray(selected_ampm, plugin.settings.enabled_ampm) === -1) selected_ampm = plugin.settings.enabled_ampm[0];
      }
      // // generate the appropriate view
      manage_views(fire_events);
      // // if date picker is not always visible in a container, and the calendar icon is visible
      if (!(plugin.settings.always_visible instanceof jQuery)) {
        //     // if date picker is to be injected into the <body>
        if (plugin.settings.container.is('body')) {
          var
            //             // get the date picker width and height
            datepicker_width = datepicker.outerWidth(),
            datepicker_height = datepicker.outerHeight(),
            //             // compute the date picker's default left and top
            //             // this will be computed relative to the icon's top-right corner (if the calendar icon exists), or
            //             // relative to the element's top-right corner otherwise, to which the offsets given at initialization
            //             // are added/subtracted
            left = (undefined !== icon ? icon.offset().left + icon.outerWidth(true) : $element.offset().left + $element.outerWidth(true)) + plugin.settings.offset[0],
            top = (undefined !== icon ? icon.offset().top : $element.offset().top) - datepicker_height + plugin.settings.offset[1],
            //             // get browser window's width and height
            window_width = $(window).width(),
            window_height = $(window).height(),
            //             // get browser window's horizontal and vertical scroll offsets
            window_scroll_top = $(window).scrollTop(),
            window_scroll_left = $(window).scrollLeft();
          if (plugin.settings.default_position === 'below')
            top = (undefined !== icon ? icon.offset().top : $element.offset().top) + plugin.settings.offset[1];
          //         // if date picker is outside the viewport, adjust its position so that it is visible
          if (left + datepicker_width > window_scroll_left + window_width) left = window_scroll_left + window_width - datepicker_width;
          if (left < window_scroll_left) left = window_scroll_left;
          if (top + datepicker_height > window_scroll_top + window_height) top = window_scroll_top + window_height - datepicker_height;
          if (top < window_scroll_top) top = window_scroll_top;
          //         // make the date picker visible
          datepicker.css({
            left:   left,
            top:    top
          });
          //     // if date picker is to be injected into a custom container element
        } else
          datepicker.css({
            left:   0,
            top:    0
          });
        //     // fade-in the date picker
        //     // for Internet Explorer < 9 show the date picker instantly or fading alters the font's weight
        datepicker.removeClass('dp_hidden');
        //     // show the iFrameShim in Internet Explorer 6
        // iframeShim();
        // // if date picker is always visible, show it
      } else datepicker.removeClass('dp_hidden');
      // // if a callback function exists for when showing the date picker
      // // ("fire_events" is FALSE when the method was called by the "update" method)
      if (fire_events !== false && plugin.settings.onOpen && typeof plugin.settings.onOpen === 'function')
        //     // execute the callback function and pass as argument the element the plugin is attached to
        plugin.settings.onOpen.call($element);
    };
    //=== сброс выбранно даты (реализовано через вызов события нажатия кнопки "сбросить") ==============================
    plugin.clear_date = function () { $(cleardate).trigger('click');  };
    //==================================================================================================================
    plugin.destroy = function () {
      // if the calendar icon exists
      if (undefined !== plugin.icon) {
        //--- remove associated event handlers
        plugin.icon.off('click.Zebra_DatePicker_' + uniqueid);
        plugin.icon.off('focus.Zebra_DatePicker_' + uniqueid);
        plugin.icon.off('keydown.Zebra_DatePicker_' + uniqueid);
        //--- remove the icon itself
        plugin.icon.remove();
      }
      // remove all events attached to the datepicker
      // (these are the ones for increasing/decreasing values in the time picker)
      datepicker.off();
      // remove the calendar
      datepicker.remove();
      // if calendar icon was shown and the date picker was not always visible in a container,
      // also remove the wrapper used for positioning it
      if (plugin.settings.show_icon && !(plugin.settings.always_visible instanceof jQuery)) $element.unwrap();
      // remove associated event handlers from the element
      $element.off('blur.Zebra_DatePicker_' + uniqueid);
      $element.off('click.Zebra_DatePicker_' + uniqueid);
      $element.off('focus.Zebra_DatePicker_' + uniqueid);
      $element.off('keydown.Zebra_DatePicker_' + uniqueid);
      $element.off('mousedown.Zebra_DatePicker_' + uniqueid);
      // remove associated event handlers from the document
      $(document).off('keyup.Zebra_DatePicker_' + uniqueid);
      $(document).off('mousedown.Zebra_DatePicker_' + uniqueid);
      $(document).off('touchend.Zebra_DatePicker_' + uniqueid);
      $(window).off('resize.Zebra_DatePicker_' + uniqueid);
      $(window).off('orientationchange.Zebra_DatePicker_' + uniqueid);

      // remove association with the element
      $element.removeData('Zebra_DatePicker');

      // restore element's modified attributes
      $element.attr('readonly', original_attributes.readonly);
      $element.attr('style', original_attributes.style ? original_attributes.style : '');
      $element.css('paddingLeft', original_attributes.padding_left);
      $element.css('paddingRight', original_attributes.padding_right);
    };
    //==================================================================================================================
    plugin.settings = {};
    browser.init();
    init();
  };
  //--- создание объекта календарь и закрепление его в data DOM --------------------------------------------------------
  $.fn.Zebra_DatePicker = function (options) {
    return this.each(function () {
      if ($(this).data('Zebra_DatePicker') !== undefined) $(this).data('Zebra_DatePicker').destroy();
      var plugin = new $.Zebra_DatePicker(this, options);
      $(this).data('Zebra_DatePicker', plugin);
    });
  };
  //--- глобальный defaults, доступен каждому to all date pickers ------------------------------------------------------
  $.fn.Zebra_DatePicker.defaults = {};
})(jQuery);
//=================================================================================================