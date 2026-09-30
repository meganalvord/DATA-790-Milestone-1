
/* we'll use this globally scoped var to determine
what happens to our event listener for 'beforeunload' on the
window object */
var warnBeforeWindowUnload = false;

/* this event is trigger when the window is ready to unload, which
includes events like an inadvertent press of the browsers BACK BUTTON */
window.addEventListener('beforeunload', function (e) {

    if (warnBeforeWindowUnload) {

        /* we need to warn the user they may have unsaved changes,
        this function will fire silently unless we set a returnValue that's not null.
        Note: some browsers will display this text, others use a generic modal/alert dialog */
        e.returnValue = 'Are you sure you wish to leave without saving your changes?';

    } else {

        //do nothing

    }

});

$(document).ready(function () {

    /* we need to apply our .change logic on this field
    before we add listeners that detect for form changes */
    $("#id_url").change(function () {
        $('.url_link').hide();
        if ($(this).val() == 'http://' || $(this).val() == '') {
            $('.url_link_default').show();
        } else {
            url = $(this).val().replace('http://', '');
            $.getJSON('/link_check/' + url, function (v) {
                foo = v;
                if (v.valid == 1) {
                    $('.url_link_ok').show();
                } else {
                    $('.url_link_fail').show();
                }
            });
        }
    });

    if ($("#id_url").val()) {
        $("#id_url").change();
    }

    set_author_order();

    // get rid of empty 'p' tags (CKeditor)
    $("p:empty").remove();

    // wrap h1 and first p (or ul) to avoid breaks, print only
    // Am I proud of this? No.
    //if (window.matchMedia("print").matches) {
    //    $(".section:not('.formset_container')").each(function(){
    //        $(this).find('h1:first').addClass('hwrap');
    //        $(this).find('p:first').addClass('pwrap');
    //        $(this).find('ul:first').addClass('ulwrap');
    //        $(this).find('table:first').addClass('tblwrap');
    //        if ( $( '.pwrap' ).length ) {
    //            $('.hwrap, .pwrap').wrapAll('<div class="no_break" />');
    //            $('.hwrap').removeClass('hwrap');
    //            $('.pwrap').removeClass('pwrap');
    //            $('.ulwrap').removeClass('ulwrap');
    //            $('.ulwrap').removeClass('tblwrap');
    //        } else {
    //            if ($('.ulwrap').length) {
    //                $('.hwrap, .ulwrap').wrapAll('<div class="no_break" />');
    //                $('.hwrap').removeClass('hwrap');
    //                $('.ulwrap').removeClass('ulwrap');
    //            }
    //            //else {
    //            //    if ($('.tblwrap').length) {
    //            //        $('.hwrap, .tblwrap').wrapAll('<div class="no_break" />');
    //            //        $('.hwrap').removeClass('hwrap');
    //            //        $('.tblwrap').removeClass('ulwrap');
    //            //    }
    //            //}
    //        }
    //
    //    });
    //}

    if (typeof ($(":file").filestyle) !== 'undefined') {
        $(":file").filestyle({input: false, size: "sm"});
    }


    $("#id_keywords").attr('placeholder', 'Keywords or tags, comma-separated');

    $('.section > table').attr('border', '0')
        .addClass("table table-striped")
        .wrap('<div class="table-responsive"></div>');

    $('.section:first table:first').css({'display': 'inline'});

//    $(".ncce_employee").each(function(){
//        $(this).load('http://www.ces.ncsu.edu/wp-content/themes/ncce/ncce_ajax.php?mode_type=display_user&unityid='+$(this).attr('data-value'))
//    });
    $(".ncce_photo").each(function () {
        unity_id = $(this).attr('data-value');
        $(this).attr('src', 'http://newton.ces.ncsu.edu/xemp_photos/_thumbs/' + unity_id.charAt(0) + '/' + unity_id.charAt(1) + '/' + unity_id + '_48x48.jpg');
    });


    $("#id_document_status option[value='']").remove();

    $('.fsg_choice_button').click(function () {
        var no_buttons_checked = !$(".fsg_choice_button").hasClass('active');
        switch ($(this).attr('id')) {
            case 'pub_is_fsg':
                if (no_buttons_checked || confirm('Warning! This will delete all file uploads and web urls.')) {
//                    $("#id_url").val('');
//                    $("#file-clear_id").prop( "checked", true );
                    $("#id_pub_type_choice").val('pub_is_fsg');
                    set_fsg_or_pdf($(this));
                }
                break;
            case 'pub_is_pdf':
                if (no_buttons_checked || confirm('Warning! This will delete all html sections and web urls.')) {
//                    $(".section_delete").click();
//                    $("#id_url").val('');
                    $("#id_pub_type_choice").val('pub_is_pdf');
                    set_fsg_or_pdf($(this));
                }
                break;
            case 'pub_is_url':
                if (no_buttons_checked || confirm('Warning! This will delete all html sections and file uploads.')) {
//                    $(".section_delete").click();
//                    $("#file-clear_id").prop( "checked", true );
                    $("#id_pub_type_choice").val('pub_is_url');
                    set_fsg_or_pdf($(this));
                }
        }
    }).each(function () {
        if ($(this).hasClass('active')) {
            set_fsg_or_pdf($(this));
        }
    });

    function set_fsg_or_pdf(el) {
        switch ($(el).attr('id')) {
            case 'pub_is_fsg':
                $(".uploads").addClass('hide-uploads');
                $('.url').val('').hide();
                $(".section_fieldset").css({'height': 'auto', 'overflow': 'auto'});
                $(".required_text_fieldset").removeClass('hidden');
                break;
            case 'pub_is_pdf':
                $(".uploads").removeClass('hide-uploads');
                $('.url').val('').hide();
                $(".section_fieldset").css({'height': '0', 'overflow': 'hidden'});
                $(".required_text_fieldset").addClass('hidden');
                break;
            case 'pub_is_url':
                $(".uploads").addClass('hide-uploads');
                $(".url").show();
                $(".section_fieldset").css({'height': '0', 'overflow': 'hidden'});
                $(".required_text_fieldset").addClass('hidden');
                break;
        }

        $(".authors_fieldset").css({'height': 'auto', 'overflow': 'auto'});
        $(".ep3_fieldset").removeClass('hidden');
        $(".reviewer_fieldset").removeClass('hidden');
        $(".alt_version_fieldset, .parent_publication_fieldset").removeClass('hidden');
        $('.fsg_choice_button').removeClass('active');
        $(".notes").show();
        $(el).addClass('active');
    }

//    $("#id_file").click(function(){
//        $("#pub_is_pdf").click();
//    });

    $('.ep3_choice_button').click(function () {
        switch ($(this).attr('id')) {
            case 'pub_is_ep3':
                $("#id_ep3").val('1');
                $(".ep3_fields").removeClass('ep3_fields_hidden');
                break;
            case 'pub_not_ep3':
                $("#id_ep3").val('');
                $(".ep3_fields").addClass('ep3_fields_hidden');
                break;
        }
        $('.ep3_choice_button').removeClass('active');
        $(this).addClass('active');
        $("#publication_form").change();
    });

    $('.review_choice_button').click(function () {
        switch ($(this).attr('id')) {
            case 'pub_is_reviewed':
                $(".reviewers").removeClass('hidden');
                break;
            case 'pub_not_reviewed':
                $(".reviewers").addClass('hidden');
                break;
        }
        $('.review_choice_button').removeClass('active');
        $(this).addClass('active');
        $("#publication_form").change();
    });

    if ($(".file").length) {
        if ($(".file").find('a').length) {
            var file_elem_name = $(".file").find('a').attr('href').substr($(".file").find('a').attr('href').lastIndexOf('/') + 1);
            $(".file").find('a').attr('href', '/publication/' + $("#slug").val()).text(file_elem_name);
        }
    }

    $('.img_sortable').sortable({
        update: function () {
            $(".image").find('input[name$=image_order]').each(function () {
                update_inline_order('image', 'url');
            });
        },
        cursor: "move",
        placeholder: "ui-state-highlight",
        forcePlaceholderSize: "true"
    });

    $(".edit_toc").sortable({
        update: function () {
            $(".child_pub").find('input[name$=collection_order]').each(function (i) {
                $(this).val($(this).data('child_id') + '|' + i);
                console.log(i);
            });
        },
        cursor: "move",
        placeholder: "ui-state-highlight",
        forcePlaceholderSize: "true"
    });

    //if( $( 'textarea.editor').length ) {
    //
    //    $( 'textarea.editor' ).ckeditor( config );
    //}

    $('textarea.editor').each(function () {
        var editor = $(this);
        editor.ckeditor(config);
        id = $(this).attr('id');
        CKEDITOR.instances[id].on('change', function () {
            //console.log('form change detected from a ckeditor');
            if (!warnBeforeWindowUnload) {
                $("#publication_form").change();
            }
        });

        //editor.on('change', function () {
        //    console.log('ck_change');
        //});
    });


//    $("#cke_133_textInput").autocomplete({
//        source: [61, 62, 63]
//    });


    /*----------//    EDIT images on form //------------------*/

    $(".images").on('click', ".edit_img", function () {

//        var section_id = get_id_digits($(this).parent().parent().parent());
        var the_image = $(this).parent().parent();
        the_image.addClass('image_editing');
        var img_id = get_id_digits($(this));
        $("#img_dialog").html('')
            .load('/edit_image/' + img_id, function () {
                $(this).dialog({
                    show: {
                        effect: "fade",
                        duration: 500
                    },
                    hide: {
                        effect: "fade",
                        duration: 500
                    },
                    modal: true,
                    height: 540,
                    width: 530,
                    title: 'Edit Image',
                    buttons: [],
                    close: function (event, ui) {
                        the_image.removeClass('image_editing')
                    }
                });
            });

    });

    $("#img_dialog").on('click', '#img_form_button', function (e) {
        e.preventDefault();
        $.ajax({ // create an AJAX call...
            data: $("#img_form").serialize(), // get the form data
            type: $("#img_form").attr('method'), // GET or POST
            url: '/edit_image/' + $("#image_id").val(), // the file to call
            success: function (response) { // on success..
                if (isNumber(response)) { // script was submitted successfully, img was added or updated
                    update_form_images($("#section_images_controls-" + response), response);
                    $("#img_dialog").dialog('close');
                }
                $("#img_dialog").html(response); // Django returned some form errors, update the DIV
            }
        });
    });

    /*----------//    ADD images on form //------------------*/

    $(".images").on('click', ".add_img", function () {
        var section_id = get_id_digits($(this).parent().parent())
        //console.log(section_id);
        $("#img_dialog").html('<iframe src="/add_image/' + section_id + '" frameborder="0" height="460" width="500"></iframe>')
            .dialog({
                show: {
                    effect: "fade",
                    duration: 500
                },
                hide: {
                    effect: "fade",
                    duration: 500
                },
                modal: true,
                height: 600,
                width: 540,
                title: 'Add Image',
                buttons: [
                    {
                        text: "Ok", click: function () {
                            update_form_images($("#section_images_controls-" + section_id), section_id);
                            $(this).dialog("close");
                        }
                    }
                ]

            })
    });

    /*----------//    DELETE images on form //------------------*/

    $(".images").on('click', ".delete_img", function () {
        var the_image = $(this).parent().parent()
        the_image.addClass('image_warning');
        var img_id = get_id_digits($(this));
        $("#img_dialog").html('')
            .load('/delete_image/' + img_id, function () {
                $(this).dialog({
                    show: {
                        effect: "fade",
                        duration: 500
                    },
                    hide: {
                        effect: "fade",
                        duration: 500
                    },
                    modal: true,
                    height: 380,
                    width: 240,
                    title: 'Delete Image',
                    buttons: [{
                        text: "Cancel", click: function () {
                            $(this).dialog("close");
                        }
                    }],
                    close: function (event, ui) {
                        the_image.removeClass('image_warning')
                    }
                });
            });

    });

    $("#img_dialog").on('click', '#delete_img_form_button', function (e) {
        e.preventDefault();
        $.ajax({ // create an AJAX call...
            data: $("#img_form").serialize(), // get the form data
            type: $("#img_form").attr('method'), // GET or POST
            url: '/delete_image/' + $("#image_id").val(), // the file to call
            success: function (response) { // on success..
                if (isNumber(response)) { // script was submitted successfully, img was added or updated
                    update_form_images($("#section_images_controls-" + response), response);
                    $("#img_dialog").dialog('close');
                }
                $("#img_dialog").html(response); // Django returned some form errors, update the DIV
            }
        });
    });

    $("#id_title").change(function () {
        $("#docTitle").html($(this).val());
    });

    $('body').on('click', '#remove_alt_version', function () {
        $("#id_alternate_version").val('');
        $("#alt_alternate_version").hide();
        $("#id_alt_alternate_version_input").show().val('');
        $("#publication_form").change();
    });

    $('body').on('click', '#remove_parent_publication', function () {
        $("#id_parent_publication").val('');
        $("#alt_parent_publication").hide();
        $("#id_alt_parent_publication_input").show().val('');
        $("#publication_form").change();
    });

//    $("#pub_search").autocomplete({
//        source: '/publication_search/'
//        select: function(event, ui){
//            window.location = ui.item.url;
//        }
//    });

    $("#pub_search_button").click(function () {
        if ($("#pub_search").val() != '') {
            window.location = $(this).data("site_url") + '/?q=' + $("#pub_search").val();
        } else {
            window.location = '/';
        }
    });

    $("#search_form").submit(function (e) {
        e.preventDefault();
        $("#pub_search_button").click();
    });

    $("#cse_search_form").submit(function (e) {
        if ($("#gse_search_input").val() == '') {
            e.preventDefault();
        }
    });

    $("#id_alt_alternate_version_input").autocomplete({
        source: '/alternate_publication_search/?pub_id=' + $("#pub_id").val() + "&pub_type=alt",
        minLength: 2,
        select: function (event, ui) {
            $("#alt_version_value").html(ui.item.value);
            $("#alt_alternate_version").show();
            $(this).hide();
            $("#id_alternate_version").val(ui.item.id);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                $(this).val('');
            }
        }
    });

    $("#id_alt_parent_publication_input").autocomplete({
        source: '/alternate_publication_search/?pub_id=' + $("#pub_id").val() + "&pub_type=parent",
        minLength: 2,
        select: function (event, ui) {
            $("#parent_publication_value").html(ui.item.value);
            $("#alt_parent_publication").show();
            $(this).hide();
            $("#id_parent_publication").val(ui.item.id);
            return false;
        },
        change: function (event, ui) {
            if (!ui.item) {
                $(this).val('');
            }
        }
    });

    $(".first_name").autocomplete({
        source: '/author_search/?name=first',
        select: function (event, ui) {
            author_select(event, ui, $(this));
            return false;
        }
    });

    $(".last_name").autocomplete({
        source: '/author_search/?name=last',
        select: function (event, ui) {
            author_select(event, ui, $(this));
            return false;
        }
    });

    function author_select(event, ui, el) {
        //console.log(ui);
        var num = $(el).attr('id').split('-')[1];
        $("#id_author-" + num + "-employee").val(ui.item.emp_id);
        $("#id_author-" + num + "-first_name").val(ui.item.first_name);
        $("#id_author-" + num + "-last_name").val(ui.item.last_name);
        $("#id_author-" + num + "-title").val(ui.item.title);
        $("#id_author-" + num + "-department").val(ui.item.primary_dept);
        $("#id_author-" + num + "-order").val(parseInt($(".first_name:visible").length) - 1);
        $("#publication_form").change();
    }


    if ($("#id_keywords").length) {
        $("#id_keywords").val($("#id_keywords").val().replace(/"/g, ''));
        $("#id_keywords").val($("#id_keywords").val().replace(/, /g, ','));
        update_keywords('');
    }


    $("#keyword_adder").autocomplete({
        minLength: 0,
        source: function (request, response) {
            $.getJSON("/keyword_search/", {
                term: extractLast(request.term)
            }, response);
        },
        focus: function () {
            // prevent value inserted on focus
            return false;
        },
        select: function (event, ui) {
            update_keywords(ui.item.value);
            $(this).val('');
            return false;
        }
    });

//  In case the tag is not in autocomplete
    $("#keyword_adder").change(function () {
        var keys = split($(this).val());
        $.each(keys, function (i, k) {
            update_keywords(k);
        });

        $("#keyword_adder").val('');
    });

    $("body").on('click', '.delete_tag', function () {
        var id = get_id_digits($(this));
        var tag_text = ($(this).parent().data('value'));
        $("#id_keywords").val($("#id_keywords").val().replace(tag_text, ''));
        $("#id_keywords").val($("#id_keywords").val().replace(',,', ','));
        $("#id_keywords").val($("#id_keywords").val().replace(/^[,\s]+|[,\s]+$/g, '') + ",");
        $(this).parent().remove();
        $("#publication_form").change();
    });

    function split(val) {
        return val.split(/,\s*/);
    }

    function extractLast(term) {
        return split(term).pop();
    }

    function update_keywords(term) {
        var keywords = $("#id_keywords").val();
        terms = (keywords == '' ? new Array() : split(keywords));
        if (term != '') {
            if ($.inArray(term, terms) < 0) {
                terms.push(term);
            }
        }
        $("#keyword_cloud").html('');

        terms.sort();
        var kw_replace = '';
        var cloud = '';
        $.each(terms, function (i, t) {
            if (t != '') {
                t = t.replace(/"/g, '');
                cloud += '<span id="tag_' + i + '" class="label label-default tag_label" data-value="' + t + '">' + t + '&nbsp;&nbsp;<span id="delete_tag_' + i + '" class="glyphicon glyphicon-remove delete_tag"></span></span>';
                kw_replace += t + ',';
            }

        });
        $("#keyword_cloud").append(cloud);
        $("#id_keywords").val(kw_replace);
        $("#publication_form").change();
    }

//    This is to change the primary department when a primary contact is set.
//    var department_is_set comes from the template; we don't want to toggle departments if there is one already set.
    $("#id_primary_contact").on("change", function (e) {
        console.log($(this).val());
        if ($(this).val() && !department_is_set) {
            var emp_dept;
            var emp_id = parseInt($(this).val());
            $.getJSON('/author_department_search/?id=' + emp_id, function (data) {
                console.log(data);
                if (data.dept_id) {
                    $("#id_department").val(data.dept_id).change();
                }
            });
        }
    });

    $(document).on('focus', '.select2-selection.select2-selection--single', function (e) {
        $(this).closest(".select2-container").siblings('select:enabled').select2('open');
    });

// steal focus during close - only capture once and stop propogation
    $('select.select2').on('select2:closing', function (e) {
        $(e.target).data("select2").$selection.one('focus focusin', function (e) {
            e.stopPropagation();
        });
    });

//    If browser supports input type="data", then use the native datepicker, otherwise, use jQuery.
    if ($('[type="date"]').prop('type') != 'date') {
        $('[type="date"]').datepicker({dateFormat: 'yy-mm-dd', maxDate: '0', minDate: '1914-01-01'});
    } else {
        //var d = new Date();
        //$('[type="date"]').attr('max', new Date().toJSON().slice(0,10));
    }

    $(".author_container").sortable({
        update: function (event, ui) {
            set_author_order();
        }
    });

    function set_author_order() {
        $(".author").each(function (idx) {
            if ($(this).find('.first_name').val() != '') {
                $(this).find('.order').val(idx);
            }
        });
    }

    $("#publication_form").change(function (e) {

        /* the .change() method in jQuery can be used to both trigger the event,
        or attach an event listener, this is our event listener, which is triggered by
        one of several calls to $('#publication_form').change() above */
        warnBeforeWindowUnload = true;

    });


    $("#pub_form_approve_submit").click(function(){
        $("#id_document_status").val('Pub');
        $('#pub_form_submit').click();
    });


    $("#pub_form_submit_2").click(function () {
        $('#pub_form_submit').click();
    });

    $('#publication_form').submit(function () {
        warnBeforeWindowUnload = false;

        $.when(update_section_order()).then(update_inline_order('image', 'url')).then(set_author_order).then(function () {
            return true;
        });
    });


    $(".images").each(function () {
        var idRegex = new RegExp('\\d+');
        var id = $(this).attr('id');
        var section_id = id.match(idRegex);
        update_form_images($(this), section_id)
    });

//    $("#print").click(function(e){
//        $(this).parent().parent().html('Please wait...');
//    });

    /*------ Required Text ---------------------------*/

    $(".required_text_toggle").click(function () {
        $(".required_text_toggle").toggle();
        $(".required_text_examples").slideToggle('fast');

    });

    /*------ Set modal headers correct width ---------*/

    $(".modal-body").each(function () {
        var id = get_id_digits($(this));
        var label = $("#modal_label_" + id[0]);
        var dialog = $(this).parent().parent();
        var img = $(this).find('img');
        var theImage = new Image();
        var src_img = img[0];
        $(theImage).attr('src', $(src_img).attr("src"))
            .load(function () {
                imageWidth = Math.min(600, this.width);
                dialog.css({'width': imageWidth + 40});
                img.css({'width': imageWidth});
                label.css({'width': imageWidth});
            });
    });

    $("body").on('click', 'a.img_modal_trigger', function (e) {
        e.preventDefault();
        if ($(".no_modal").css("float") == "none") {
            var modal_id = $(this).attr('href');
            adjust_modal_label($(modal_id));
            $(modal_id).modal();
        }
    });

    function update_form_images(section, section_id) {
        if (isNumber(section_id)) {
            section.load('/section_images/' + section_id, function () {
                var croppedSelector = $('.cropped_img')
                var croppedImages = ($(this).find(croppedSelector));
                croppedImages.each(function () {
                    var this_crop = $(this);
                    var img = $(this).find('img');
                    var new_image = new Image();
                    $(new_image).attr('src', $(img).attr('src'))
                        .load(function () {
                            var scale = this.width / 150;
                            var scaled_height = this.height / scale;
                            if (scaled_height > 150) {
                                $(this_crop).css({'borderBottom': '3px dashed gray'});
                                $(section).find('.cropped_note').show();
                            }
                        });
                });
            });
        } else {
            section.html('<p class="alert alert-info"><strong>Save</strong> before adding images.</p>');
        }
    }

    if ($("#publication_table").length) {
        var dt_cols = '';
        var table = $('#publication_table').DataTable(
            {
                "paging": true,
                "lengthMenu": [[50, 100, 200, -1], [50, 100, 200, "All"]],
                "pagingType": "full_numbers",
                "order": [[10, "desc"]],
                "stateSave": false,
                "autoWidth": false,
                "columnDefs": [
                    {'orderable': false, 'targets': [2, 4, 5]},
                    {"width": "112px", "aTargets": 3},
                    {"width": "80px", "aTargets": 6},
                    {"width": "80px", "aTargets": 7},
                    {"width": "230px", "targets": 0}
                ],
                "language": {
                    "emptyTable": "No Publications available"
                },
                "initComplete": function (oSettings, json) {
                    dt_cols = oSettings.aoPreSearchCols;
                    $("#dept_select").val(dt_cols[3].sSearch);
                    $("#portal_select").val(dt_cols[5].sSearch);
                }
            }
        );
        $("#publication_table").show();
        $("#publication_table_filter").hide();


        $("#dept_select").change(function () {
            table
                .column(3)
                .search($(this).val())
                .draw();
        });

        $("#portal_select").change(function () {
            table
                .column(5)
                .search($(this).val())
                .draw();
        });

        $("#status_select").change(function () {
            table
                .column(10)
                .search($(this).val())
                .draw();
        });

        $("#clear_search").click(function () {
            localStorage.removeItem("DataTables_publication_table_/");
            location.reload();
        });

    }


    if ($("#publication_table_expired").length) {
        var dt_cols = '';
        var table = $('#publication_table_expired').DataTable(
            {
                "paging": false,
                "order": [[6, "desc"]],
                "stateSave": false,
                "autoWidth": false,
                "columnDefs": [
                    {'orderable': false, 'targets': [2, 4, 5, 12]},
                    {"width": "112px", "aTargets": 3},
                    {"width": "80px", "aTargets": 6},
                    {"width": "80px", "aTargets": 7},
                    {"width": "230px", "targets": 0}
                ],
                "language": {
                    "emptyTable": "No Publications available"
                },
                "initComplete": function (oSettings, json) {
                    dt_cols = oSettings.aoPreSearchCols;
                    $("#dept_select").val(dt_cols[3].sSearch);
                    $("#portal_select").val(dt_cols[5].sSearch);
                }
            }
        );
        $("#publication_table_expired").show();
        $("#publication_table_expired_filter").hide();


        $("#dept_select").change(function () {
            table
                .column(3)
                .search($(this).val())
                .draw();
        });

        $("#portal_select").change(function () {
            table
                .column(5)
                .search($(this).val())
                .draw();
        });

        $("#clear_search").click(function () {
            localStorage.removeItem("DataTables_publication_table_/expired");
            location.reload();
        });

    }

    /*---------- ChangeLog Modal ------------------*/

    $("#show_pub_changes").on('click', function (e) {
        e.preventDefault();
        $("#changelog_modal").html('')
            .load('/publication/changes/' + $("#pub_id").val() + '/?limit=10', function () {
                $(this).dialog({
                    show: {
                        effect: "fade",
                        duration: 250
                    },
                    hide: {
                        effect: "fade",
                        duration: 250
                    },
                    width: 500,
                    modal: true
                });
            });
    });

//    $("#dictionary_table").dataTable();
    /*--------- Dictionary editor ----------------*/
    $("#entry_dialog").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "Save": function () {
                var entry = $("#entry_form").serialize();
                var id = $("#id_form-0-id").val();
                var term = $("#id_term").val();
                var definition = $("#id_definition").val();
                //console.log(entry);
                $.post("/dictionary/edit/" + id, entry)
                    .done(function () {
                        $("#entry_term_" + id).text(term);
                        $("#entry_def_" + id).text(definition);
                    })
                    .fail(function () {
                        $(this).html('there was an error');
                    });
                $(this).dialog("close");
            },
            "Delete": function () {
                var entry = $("#entry_form").serialize() + "&delete=True";
                var id = $("#id_form-0-id").val();
                if (confirm("Delete entry for " + $("#id_term").val() + "?\nThis cannot be undone.")) {
                    $.post("/dictionary/delete_entry/" + id + "/", entry)
                        .done(function () {
                            $("#entry_term_" + id).next('dd').remove();
                            $("#entry_term_" + id).remove();
                        })
                        .fail(function () {

                        });
                    $(this).dialog("close");
                }
            },
            "Cancel": function () {
                $(this).dialog("close");
            }
        },
        open: function (event) {
            $('.ui-dialog-buttonpane').find('button:contains("Save")').addClass('btn btn-success');
            $('.ui-dialog-buttonpane').find('button:contains("Delete")').addClass('btn btn-danger');
            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').addClass('btn');
            $('.ui-dialog-buttonpane').addClass('center_button_pane');
            $('.ui-dialog-buttonset').addClass('center_button_set');
        },
        close: function () {
            $("#entry_form").remove();
        }
    });

    $("#add_dialog").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "Save": function () {
                var entry = $("#entry_form").serialize();
                $.post("/dictionary/add/", entry)
                    .done(function () {
                        window.location.reload(true);
                    });
                $(this).dialog("close");
            },
            "Cancel": function () {
                $(this).dialog("close");
            }
        },
        open: function (event) {
            $('.ui-dialog-buttonpane').find('button:contains("Save")').addClass('btn btn-success');
            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').addClass('btn');
            $('.ui-dialog-buttonpane').addClass('center_button_pane');
            $('.ui-dialog-buttonset').addClass('center_button_set');
        }
    });


    $(".ep3_pdf_link").click(function (e) {
        e.preventDefault();
        pub_id = $(this).data("pub_id");
        $.getJSON('/api/timestamp/', function (data) {
            var timestamp = data.timestamp
            console.log(timestamp);
            window.location = '/show_ep3_pdf/' + timestamp + '/' + pub_id + '/';
        });
    });


    function update_inline_order(elem_name, validator) {
        $("." + elem_name).find('input[name$=' + elem_name + '_order]').each(function (i) {
            var empty = $(this).parent().find('input[id$=' + validator + ']').val() == '';
            if (!empty) {
                $(this).val(i);
            }
        });
    }

    function update_section_order() {
        $(".section").find('input[name$=section_order]').each(function (i) {
            //console.log($(this).parent().parent().parent().find('input[id$=heading]').val());
            var head_empty = $(this).parent().parent().parent().find('input[id$=heading]').val() == '';
            var order_empty = $(this).val() == '';
            //var empty = $(this).parent().find('input[id$=heading]').val() == '' && $(this).val() == '';
            if (!head_empty && order_empty) {
                $(this).val(i);
            }
        });
    }

    // Add urls to youtube videos
    $('iframe').each(function () {
        $(this).parent().append('<div class="print_show yt_source">http:' + $(this).attr('src') + '</div>');
    });

    function get_id_digits(elem) {
        var idRegex = new RegExp('\\d+');
        var id = elem.attr('id');
        return id.match(idRegex);
    }

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }


    function adjust_modal_label(modal) {
//        var id = get_id_digits(modal);
//        var label = $("#modal_label_"+id[0]);
//        var img = $(modal).find('img');
//        var imageWidth = 600
//        if(img){
//            var theImage = new Image();
//            var src_img = img[0];
//            $(theImage).attr('src', $(src_img).attr("src"))
//                .load(function(){
//                    imageWidth = Math.min(600,this.width);
//                    img.css({'width': imageWidth });
//                    label.css({'width': imageWidth });
//                });
//        }
    }

    function isOverflowed(element) {
        var ret = element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
        var foo = 'bar';
        return ret;
    }

    $('body').on('click', '.btn-facebook', function () {
        shareFacebook($(this).data('url'), $(this).data('text'));
    });

    $('body').on('click', '.btn-twitter', function () {
        shareTwitter($(this).data('url'), $(this).data('text'));
    });

    //http://davidwalsh.name/social-sharing-links
    function shareTwitter(url, text) {
        open('http://twitter.com/share?url=' + url + '&text=' + text, 'tshare', 'height=400,width=550,resizable=1,toolbar=0,menubar=0,status=0,location=0');
    }

    function shareFacebook(url, text) {
        open('http://facebook.com/sharer.php?s=100&p[url]=' + url + '&p[title]=' + text, 'fbshare', 'height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0');
    }

    if ($(".errorlist").length) {
        $('html, body').animate({
            scrollTop: $(".errorlist").offset().top - 10
        }, 1);
    }

});
