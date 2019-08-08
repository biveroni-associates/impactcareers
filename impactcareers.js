// document ready wrapper
$(document).ready(function() {

    // find all filter buttons
    var cumulative_filter_keyword = '';
    const filterToggles = document.querySelectorAll('[data-filter]');
    // go over each filter button
    filterToggles.forEach(function(toggle) {
        let attrVal = toggle.getAttribute(['data-filter']); // find the filter attr
        let newVal = attrVal.toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, ''); // Trim - from end of text // hyphenate filter attr val
        toggle.setAttribute('data-filter', "." + newVal); // set filter attr with new val
        // All Filter: *
        if (attrVal == '*') {
            toggle.setAttribute('data-filter', "*");
        }
    });

    // go over all collection item category label elems
    $('.w-dyn-item .category').each(function(index, element) {
        var _this = $(element);
        var categories = ['tech', 'health', 'food', 'environment', 'finance', 'energy', 'ventures', 'innovation', 'consulting', 'education', 'sustainability', 'social', 'biveroni-associates'];
        $.each(categories, function(index, value) {
            if (_this.data(value) == '1') {
                _this.parent().parent().addClass(value);
                //console.log('add: ' + value);
            }
        });
    });

    // go over all collection item category label elems
    $('.w-dyn-item .categories').each(function(index, element) {
        var _this = $(element);
        var _this_categories = _this.data('categories').split(',');
        $(_this_categories).each(function(index, value) {
            let newVal = value.toLowerCase()
                .replace(/\s+/g, '-') // Replace spaces with -
                .replace(/[^\w\-]+/g, '') // Remove all non-word chars
                .replace(/\-\-+/g, '-') // Replace multiple - with single -
                .replace(/^-+/, '') // Trim - from start of text
                .replace(/-+$/, ''); // Trim - from end of text // hyphenate filter attr val

            _this.parent().parent().addClass(newVal);

        });
    });

    // go over all collection item category label elems
    $('.w-dyn-item .locations').each(function(index, element) {
        var _this = $(element);
        var _this_location = _this.data('locations').split(',');
        $(_this_location).each(function(index, value) {
            let newVal = value.toLowerCase()
                .replace(/\s+/g, '-') // Replace spaces with -
                .replace(/[^\w\-]+/g, '') // Remove all non-word chars
                .replace(/\-\-+/g, '-') // Replace multiple - with single -
                .replace(/^-+/, '') // Trim - from start of text
                .replace(/-+$/, ''); // Trim - from end of text // hyphenate filter attr val

            _this.parent().parent().addClass(newVal);

        });
    });

    // go over all collection item category label elems
    $('.w-dyn-item .levels').each(function(index, element) {
        var _this = $(element);
        var _this_level = _this.data('levels').split(',');
        $(_this_level).each(function(index, value) {
            let newVal = value.toLowerCase()
                .replace(/\s+/g, '-') // Replace spaces with -
                .replace(/[^\w\-]+/g, '') // Remove all non-word chars
                .replace(/\-\-+/g, '-') // Replace multiple - with single -
                .replace(/^-+/, '') // Trim - from start of text
                .replace(/-+$/, ''); // Trim - from end of text // hyphenate filter attr val

            _this.parent().parent().addClass(newVal);

        });
    });

    // quick search regex
    let qsRegex;
    let buttonFilter;

    // Config
    let config = {
        itemSelector: '.w-dyn-item',
        //stagger: 30,
        transitionDuration: '0.3s', // Start Fade in und bei Filter 
        filter: function() {
            var $this = $(this);
            var searchResult = qsRegex ? $this.text().match(qsRegex) : true;
            var buttonResult = buttonFilter ? $this.is(buttonFilter) : true;
            return searchResult && buttonResult;
        },
        hiddenStyle: {
            opacity: 0
        },
        visibleStyle: {
            opacity: 1
        }
    };

    // Show Grid
    $('.loading').hide();
    $('#grid').show();
    $('#grid2').show();

    // // Check if there is a category in the url
    // if(window.location.search.substring(1)) {
    //   buttonFilter = "." + window.location.search.substring(1);
    // }

    // init Isotope
    const $grid = $('#grid').isotope(config);
    const $grid2 = $('#grid2').isotope(config);

    // reveal all items after init
    const $items = $grid.find('.w-dyn-item');
    $grid.addClass('is-showing-items').isotope('revealItemElements', $items);

    const $items2 = $grid2.find('.w-dyn-item');
    $grid2.addClass('is-showing-items').isotope('revealItemElements', $items2);

    $('#filters').on('click', 'button', function() {
        var selected_filter = [];
        $('.is-checked').each(function(index, element) {
            if ($(element).attr('data-filter') != '*') {
                selected_filter.push($(element).attr('data-filter'));
            }
        });
        buttonFilter = selected_filter.join('');
        //buttonFilter = $(this).attr('data-filter');
        console.log(selected_filter);
        console.log(buttonFilter);
        //window.history.pushState(null, '', '/jobs?' + $(this).attr('data-filter').substring(1))

        $grid.isotope();
        $grid2.isotope();
    });

    // // Check if there is a category in the url
    // if (window.location.search.substring(1)) {
    //     $('[data-filter=".' + window.location.search.substring(1) + '"]').click();
    //     $('.is-checked').removeClass('is-checked');
    //     $('[data-filter=".' + window.location.search.substring(1) + '"]').addClass('is-checked');
    // }

    // use value of search field to filter
    const $quicksearch = $('#quicksearch').keyup(debounce(function() {
        qsRegex = new RegExp($quicksearch.val(), 'gi');
        $grid.isotope();
        $grid2.isotope();
    }));

    // change is-checked class on buttons
    $('.button-group').each(function(i, buttonGroup) {
        const $buttonGroup = $(buttonGroup);
        $buttonGroup.on('click', 'button', function() {
            $buttonGroup.find('.is-checked').removeClass('is-checked');
            $(this).addClass('is-checked');
        });
    });

    // debounce so filtering doesn't happen every millisecond
    function debounce(fn, threshold) {
        let timeout;
        return function debounced() {
            if (timeout) {
                clearTimeout(timeout);
            }

            function delayed() {
                fn();
                timeout = null;
            }
            setTimeout(delayed, threshold || 100);
        };
    };

    // disable search from submitting
    $('#quicksearch').on('keyup keypress', function(e) {
        const keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
            e.preventDefault();
            return false;
        }
    });

});
