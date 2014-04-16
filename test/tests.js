(function (T, $) {
  var $target, $toggle, datalist;

  T.testStart(function () {
    $.fx.off = true;
    datalist = [
      {value: 1, text: 'foo'},
      {value: 2, text: 'bar'},
      {value: 3, text: 'baz'},
      {value: 4, text: 'foobar'}
    ];
  });

  T.testDone(function () {
    destroyMultilist();
    $.fx.off = false;
  });

  var destroyMultilist = function() {
    if ($target) {
      $target.remove();
      $target = null;
    }
  };

  var initMultilist = function(options) {
    destroyMultilist();
    $(document.body).append('<div id="target" style="display: none;" />');
    $target = $('div#target');
    $target.multilist(options || {
      datalist: datalist
    });
    $toggle = $('a.label', $target);
  };

  /*** INIT ***/

  T.module('init');

  T.test('adds proper attributes to and shows the target', function() {
    initMultilist();

    T.equal($target.attr('role'), 'listbox');
    T.equal($target.attr('aria-multiselectable'), 'true');
    T.ok($target.is(':visible'), 'Target should be made visible');
  });

  T.test('renders datalist items as list items', function() {
    initMultilist();

    var $items = $('.holder.items a', $target);

    T.equal($items.length, datalist.length);
    $items.each(function(i, e) {
      var item = datalist[i];
      var $e = $(e);

      T.equal($e.attr('value'), item.value);
      T.equal($e.text().trim(), item.text);
    });
  });

  /*** CLICK WHEN CLOSED ***/

  T.module('click when closed', {
    setup: function() {
      initMultilist();
    }
  });

  T.test('shows and focuses search', function() {
    var $searchHolder = $('div.search', $target);
    var $search = $('input[role="search"]', $searchHolder);

    $toggle.trigger('click');

    T.ok($searchHolder.is(':visible'), 'Search element holder should be made visible');
    T.ok($search.is(':focus'), 'Search element should have focus');
  });

  T.test('shows items', function() {
    $toggle.trigger('click');

    var $items = $('div.items', $target);

    T.ok($items.length == 1, 'Items holder element should be created');
    T.ok($items.is(':visible'), 'Items holder element should be made visible');
  });

  T.test('adds `opened\' css class', function() {
    $toggle.trigger('click');

    T.ok($target.hasClass('opened'), 'Target should have `opened\' css class');
  });

  /*** CLICK WHEN OPEN ***/

  T.module('click when open', {
    setup: function() {
      initMultilist();
      $toggle.trigger('click');
    }
  });

  T.test('clears the search and filters', function() {
    var $searchHolder = $('div.search', $target);
    var $search = $('input[role="search"]', $searchHolder);
    var $items = $('.holder.items a', $target);
    $search.val('foo');
    $items.addClass('filtered');

    $toggle.trigger('click');

    T.ok(!$searchHolder.is(':visible'), 'Search element holder should be hidden');
    T.equal($search.val(), '');
    $items.each(function(i, e) {
      T.ok(!$(e).hasClass('filtered'));
    });
  });

  T.test('removes `opened\' css class', function() {
    $toggle.trigger('click');

    T.ok(!$target.hasClass('opened'), 'Should remove `opened\' class');
  });

  /*** SEARCH BOX KEYUP ***/

  T.module('search box keyup', {
    setup: function() {
      initMultilist();
      $toggle.trigger('click');
    }
  });

  T.test('does nothing when less than 3 characters entered', function() {
    var $search = $('.holder.search input', $target);
    var item = datalist[0];

    $search.val(item.text.substring(0, 1));
    $search.trigger('keyup');

    T.ok(!$('.holder.items ul li a', $target).hasClass('filtered'), 'Should not filter after only 1 character');

    $search.val(item.text.substring(0, 2));
    $search.trigger('keyup');

    T.ok(!$('.holder.items ul li a', $target).hasClass('filtered'), 'Should not filter after only 2 characters');

    $search.val(item.text.substring(0, 3));
    $search.trigger('keyup');

    T.ok($('.holder.items ul li a', $target).hasClass('filtered'), 'Should have some items filtered');
  });
} (QUnit, jQuery));
