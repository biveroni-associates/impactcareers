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
        $('.w-dyn-item .categories').each(function(index, element) {
            var _this = $(element);
            var _thisCategories = _this.data('categories').split(',');
            $( _thisCategories ).each(function(index, value) {
                value = value.toLowerCase();
                let newVal = value
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
            var _thisLocation = _this.data('locations').split(',');
            $(_thisLocation).each(function(index, value) {
                value = value.toLowerCase();

                let newVal = value
                    .replace(/\s+/g, '-') // Replace spaces with -
                    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
                    .replace(/\-\-+/g, '-') // Replace multiple - with single -
                    .replace(/^-+/, '') // Trim - from start of text
                    .replace(/-+$/, ''); // Trim - from end of text // hyphenate filter attr val
                _this.parent().parent().addClass(newVal);

                if ( /(ü|ä|ö)/gi.test(value) ){
                    let newVal = value
                        .replace(/ü/g,'u')
                        .replace(/ä/g,'a')
                        .replace(/ö/g,'o')

                    newVal = newVal
                        .replace(/\s+/g, '-') // Replace spaces with -
                        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
                        .replace(/\-\-+/g, '-') // Replace multiple - with single -
                        .replace(/^-+/, '') // Trim - from start of text
                        .replace(/-+$/, ''); // Trim - from end of text // hyphenate filter attr val
                    _this.parent().parent().addClass(newVal);
                }

                if ( /(u|a|o)/gi.test(value) ){
                    let newVal = value
                        .replace(/u/g,'ü')
                        .replace(/a/g,'ä')
                        .replace(/o/g,'ö')

                    newVal = newVal
                        .replace(/\s+/g, '-') // Replace spaces with -
                        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
                        .replace(/\-\-+/g, '-') // Replace multiple - with single -
                        .replace(/^-+/, '') // Trim - from start of text
                        .replace(/-+$/, ''); // Trim - from end of text // hyphenate filter attr val
                    _this.parent().parent().addClass(newVal);
                }

            });
        });

        // go over all collection item category label elems
        $('.w-dyn-item .levels').each(function(index, element) {
            var _this = $(element);
            var _thisLevel = _this.data('levels').split(',');
            $(_thisLevel).each(function(index, value) {
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
            // stagger: 30,
            transitionDuration: '0.5s', // Start Fade in und bei Filter 
            filter: function() {
                var $this = $(this);
                var searchResult = true;
                if ( qsRegex ){
                    var this_text = $this[0].outerText;
                    this_text = this_text.replace(/\r/g, "").replace(/\n/g, "");
                    searchResult = this_text.match(qsRegex);
                }
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

        // // Check if there is a category in the url
        // if(window.location.search.substring(1)) {
        //   buttonFilter = "." + window.location.search.substring(1);
        // }

        // init Isotope
        const $grid = $('#grid').isotope(config);

        // reveal all items after init
        const $items = $grid.find('.w-dyn-item');
        $grid.addClass('is-showing-items').isotope('revealItemElements', $items);

        $('#filters').on('click', 'button', function() {
            var selected_filter = [];
            $('.is-checked').each(function(index, element) {
                if ($(element).attr('data-filter') != '*') {
                    selected_filter.push($(element).attr('data-filter'));
                }
            });
            buttonFilter = selected_filter.join('');
            //buttonFilter = $(this).attr('data-filter');
            //window.history.pushState(null, '', '/jobs?' + $(this).attr('data-filter').substring(1))
            $grid.isotope();
        });

        // // Check if there is a category in the url
        // if (window.location.search.substring(1)) {
        //     $('[data-filter=".' + window.location.search.substring(1) + '"]').click();
        //     $('.is-checked').removeClass('is-checked');
        //     $('[data-filter=".' + window.location.search.substring(1) + '"]').addClass('is-checked');
        // }

        // use value of search field to filter
        var prevButtonFilter = '';
        const $quicksearch = $('#quicksearch').keyup(debounce(function() {
            if ( buttonFilter!= '' && prevButtonFilter != buttonFilter ) prevButtonFilter = buttonFilter;
            var searchQuery = $quicksearch.val().trim();
            var queryArray = [];
            if ( searchQuery != '' && searchQuery.length > 3) {
                buttonFilter = '';
                searchQuery = searchQuery.replace(/\s{2,}/g, ' ').toLowerCase();
                var queries = searchQuery.split(' ');

                $( queries ).each ( function(index,value){
                    if ( value.length > 3 ){
                        let makeStr = value;
                        if ( /(ü|ä|ö)/gi.test(value) ){
                            let newVal = value
                                .replace(/ü/g,'u')
                                .replace(/ä/g,'a')
                                .replace(/ö/g,'o')

                            makeStr += '|.*'+newVal;
                        }
                        if ( /(u|a|o)/gi.test(value) ){
                            let newVal = value
                                .replace(/u/g,'ü')
                                .replace(/a/g,'ä')
                                .replace(/o/g,'ö')
                             makeStr += '|.*'+newVal;
                        }
                        queryArray.push(makeStr);
                    }
                });
                qsRegex =new RegExp("(?=.*"+queryArray.join(")(?=.*")+")","gi");
            }else {
                qsRegex = '';
                buttonFilter = prevButtonFilter;
                prevButtonFilter = '';
            }
            $grid.isotope();
            // setTimeout(function(){  $grid.isotope(); }, 1000);
        },300)
        );

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
