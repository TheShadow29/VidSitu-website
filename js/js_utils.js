var loadJS = function (url, implementationCode, location) {
    //url is URL of external file, implementationCode is the code
    //to be called from the file, location is the location to
    //insert the <script> element

    var scriptTag = document.createElement('script');
    scriptTag.src = url;
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);


    // scriptTag.onload = implementationCode;
    // scriptTag.onreadystatechange = implementationCode;

    // location.appendChild(scriptTag);
};
String.prototype.rsplit = function (sep, maxsplit) {
    var split = this.split(sep);
    return maxsplit ? [split.slice(0, -maxsplit).join(sep)].concat(split.slice(-maxsplit)) : split;
}

// var colors = ['#001f3f', '#0074D9', '#7FDBFF', '#39CCCC', '#3D9970', ]

function add_acmp(tag_id, verb_list_args) {
    $(`#${tag_id}`).autocomplete({
        source: verb_list_args.verb_list,
        select: function (event, ui) {
            let vid_id = tag_id.split('_vb_drop')[0]
            let num_vb = tag_id.split('_vb_drop_')[1]
            let div_id = `${vid_id}_SRL_drop_${num_vb}`
            //let vid_id = {{ v1.uid |tojson}}
            let verb_sel = ui.item.value;
            let verb_data_sel = verb_list_args.verb_dct[verb_sel];
            let roles = verb_data_sel['order'];

            let th_inp = ''
            for (r of roles) {
                th_inp += `<th>${r}</th>`
            }

            let td_inp = ''
            for (let [ridx, r] of roles.entries()) {
                td_inp += `<td><input id="${tag_id}_role_${ridx}" name="${tag_id}_role_${ridx}"
            label="Role" required type="text"/><span></span></td>`
            }
            let abs = verb_data_sel['abstract']
            let tbl_inp = `
            <table id=${tag_id}_SRL_Table class=${tag_id}_SRL_Tab>
            <tr>
                ${th_inp}
            </tr>
            <tr>
                ${td_inp}
            </tr>
            <tr>
                <td colspan="${roles.length}">${abs}</td>
            </tr>
            </table> <a href="#" id=${vid_id}_${num_vb}_btn_remove class="remove_field">Remove</a>`
            $(`#${vid_id}_${num_vb}_btn_remove `).remove()
            // $("table").remove()
            $("table").remove(`#${tag_id}_SRL_Table`)

            // $("table").remove(`.${tag_id}_SRL_Tab`)
            // $(`.${tag_id}_SRL_Tab table`).remove()
            // $(``)
            $(`#${div_id}`).append(`${tbl_inp}`)
            for (let [ridx, r] of roles.entries()) {
                let tag_id_r = `${tag_id}_role_${ridx}`
                acmp_simple(tag_id_r, lst_dct, vid_id)
            }
            if (num_vb > 1) {
                add_evev(`${tag_id}_SRL_Table`)
            }
        }
    });
}

function create_table_from_lst(header, lst) {
    let tlst = ''
    for (itm of lst) {
        tlst += `<tr><td>${itm}</td></tr>`
    }
    let tab = `
    <table>
        <tr><th>${header}</th></tr>
        ${tlst}
    </table>
    `
    return tab
}

function create_var_table(vid_id) {
    let plst_tab = create_table_from_lst('person', lst_dct['person'])
    let elst_tab = create_table_from_lst('events', lst_dct['event'])
    let re_lst_tab = create_table_from_lst('referred entities', lst_dct['refexp'])
    $(`#${vid_id}_tab_lst`).html(plst_tab + elst_tab + re_lst_tab)
}

function recreate_acmp_lst(vid_id) {
    let plst = lst_dct['person']
    // let elst = lst_dct['event']
    let elst = Array.from(vlst_dct[vid_id].table_grid.getRowOrder(), function (itm) {
        return `Ev${itm}`
    })
    let re_lst = lst_dct['refexp']
    acmp_lst = [...plst, ...re_lst, ...elst]
    // acmp_lst = [...re_lst]
    create_var_table(vid_id)
}

function acmp_simple(tag_id, lst_dct, vid_id) {
    // src_lst =
    // let vid_id = tag_id.split('_vb_drop')[0]
    recreate_acmp_lst(vid_id)
    $(`#${tag_id}`).autocomplete({
        source: function (request, response) {

            var result = $.ui.autocomplete.filter(acmp_lst, request.term);
            response(result);
        },

        change: function (event, ui) {
            let curr_val = $(this).val()
            if (curr_val[0] == '$' || curr_val[0] == '#') {
                if (curr_val[0] == '$') {
                    if ($.inArray(curr_val.slice(1), lst_dct['refexp']) < 0) {
                        lst_dct['refexp'].push(curr_val.slice(1));
                        $(this).val(curr_val.slice(1))
                        recreate_acmp_lst(vid_id)

                        $(this).next('span').hide()
                    }
                }
                else if (curr_val[0] == '#') {
                    if ($.inArray(curr_val.slice(1), lst_dct['person']) < 0) {
                        lst_dct['person'].push(curr_val.slice(1));
                        $(this).val(curr_val.slice(1))
                        recreate_acmp_lst(vid_id)
                        $(this).next('span').hide()
                    }
                }
                $(this).next('span').hide()
            }
            else {
                if (ui.item == null) {
                    // if ($.inArray(curr_val, lst_dct['refexp']) < 0) {
                    $(this).next('span').text('To create new Item, start with $ or #(for person)').show()
                }
                else {
                    $(this).next('span').hide()
                }
            }

        }
    })

    $(`#${tag_id}`).on("autocompletefocus", function (event, ui) {
        console.log('focus')
        $(this).keydown(function (event) {
            if ((event.which == 46 || event.which == 8) && event.shiftKey) {
                // let curr_val = $(this).val()
                event.preventDefault();
                if (ui.item != null) {
                    console.log('yolo')
                    let curr_val = ui.item.value
                    let ix = lst_dct['refexp'].indexOf(curr_val);
                    if (ix > -1) {
                        lst_dct['refexp'].splice(ix, 1)
                        recreate_acmp_lst(vid_id)
                    }
                }

            }
        })
    });
}

function add_evev(tag_id) {

    let radio_inp = ''
    for (const [ix, elm] of evev_reln_lst.entries()) {
        radio_inp += `
        <input type="radio" name="${tag_id}_radio" id="${tag_id}_radio-${ix}" value="${elm}">
        <label for="${tag_id}_radio-${ix}">${elm}</label>
        `
    }
    let new_ev = `
    <fieldset class="f1">
    ${radio_inp}
    </fieldset>
    `
    // $(`#${tag_id}`).find('tr').eq(1).append(`${new_ev}`)
    $(`#${tag_id}_Ev_Sel`).remove()
    $(`#${tag_id}`).after(`
    <table class='${tag_id}_SRL_Tab' id='${tag_id}_Ev_Sel'>
    <tr><th>Relation to Central Event</th></tr><tr><td>${new_ev}</td></tr>
    </table>`)
    $(function () {
        $(".f1 input").checkboxradio();
        $(".f1 fieldset").controlgroup();
    });

}

function add_inp_srl(vid_id, verb_list_args, loop_idx) {
    $(`#${vid_id}_btn_add_vb`).click(function (e) { //on add input button click
        e.preventDefault();
        let num_vbs = vlst_dct_num_vbs[vid_id]
        let row_ix = vlst_dct_row_ix[vid_id]
        let vid_dct = vlst_dct[vid_id]
        let start = vid_dct.start
        let end = vid_dct.end
        if (num_vbs < max_fields) {
            num_vbs += 1
            row_ix += 1
            vlst_dct_num_vbs[vid_id] = num_vbs
            vlst_dct_row_ix[vid_id] = row_ix
            add_vb(vid_id = vid_id, row_ix = row_ix, loop_idx = loop_idx, start = start, end = end)
            let tg_id = `${vid_id}_vb_drop_${row_ix}`
            add_acmp(`${tg_id}`, verb_list_args)
            //add_evev(`${tg_id}_SRL_Table`)
        }

    });

    $(`#${vid_id}_SRL`).on("click", ".remove_field", function (e) { //user click on remove text
        e.preventDefault();
        let vid_id = this.id.split('_btn_remove')[0].rsplit('_', 1)[0]
        vlst_dct_num_vbs[vid_id] -= 1
        // $(this).parent('div').remove();
        $(this).parent('div').hide();
        rename_events(vid_id)
    });

}

function rename_events(vid_id) {
    // do nothing
    return
    $(`#${vid_id}_SRL table:visible`).each(
        function (i) {
            $($($(this).find('tr')[1]).find('td')[0]).html(`Ev${i + 1}`)
        }
    )
    // TODO:
    // Rename Events if appearing elsewhere in the arguments by creating a map!
}

function add_vb(vid_id, row_ix, loop_idx, start, end) {
    // let num_vb_c = vlst_dct_num_vbs[vid_id]
    // vlst_dct_row_ix_to_num_vb[row_ix] = num_vb_c
    // event_lst.push(`Ev${row_ix}`)

    lst_dct['event'].push(`Ev${row_ix}`)
    create_var_table(vid_id)
    let ev_name = ''
    if (row_ix != 1) {
        ev_name = `Ev${row_ix}`
    }
    else {
        ev_name = 'Central Event'
    }
    let tbl_inp = `
    <div id="${vid_id}_SRL_drop_${row_ix}" cPlass="container">
    <table>
    <tr>
        <th> Event ID </th>
        <th> Start </th>
        <th> End </th>
        <th>Verb</th>
    </tr>
    <tr>
        <td class="VSRL_Tab">
            ${ev_name}
        <td>
            <input id="${vid_id}_vb_drop_${row_ix}_time_start" type="number" step="0.01"
            name="${vid_id}_${loop_idx}_vb_drop_${row_ix}_time_start" min="${start}" max="${end}">
        </td>
        <td>
            <input id="${vid_id}_vb_drop_${row_ix}_time_end" type="number" step="0.01"
            name="${vid_id}_${loop_idx}_vb_drop_${row_ix}_time_end" min="${start}" max="${end}">
        </td>
        <td>
            <input id="${vid_id}_vb_drop_${row_ix}" name="${vid_id}_${loop_idx}_vb_drop_${row_ix}"
            label="Verb" required type="text"/>
        </td>
    </tr>
    </table>
    <a href="#" id=${vid_id}_${row_ix}_btn_remove class="remove_field">Remove</a>
    </div>
    `
    $(`#${vid_id}_SRL`).append(tbl_inp)
    rename_events(vid_id)
    // $(".VSRL_Tab").unbind("click").click(function (event) {
    //     $(".VSRL_Tab.sel").not(this).removeClass("sel");
    //     if ($(this).hasClass('sel')) {
    //         $(this).removeClass('sel')
    //         curr_num_vb = '0'
    //     }
    //     else {
    //         $(this).addClass('sel')
    //         curr_num_vb = $(this).closest('div').attr('id').rsplit('_', 1)[1]
    //     }
    // })
    $(".VSRL_Tab").unbind("click").click(function (event) {
        select_curr_elm_for_time(this)
    })
}

console.log('Test112413')

function select_curr_elm_for_time(tag) {

    $(".VSRL_Tab.sel").not(tag).removeClass("sel");
    if ($(tag).hasClass('sel')) {
        $(tag).removeClass('sel')
        curr_num_vb = '0'
    }
    else {
        $(tag).addClass('sel')
        curr_num_vb = $(tag).closest('div').attr('id').rsplit('_', 1)[1]
    }
}


function select_curr_elm_for_time_new(tag) {

    $(".VSRL_Tab.sel").not(tag).removeClass("sel");
    if ($(tag).hasClass('sel')) {
        $(tag).removeClass('sel')
        curr_num_vb = '0'
    }
    else {
        $(tag).addClass('sel')
        // curr_num_vb = $(tag).closest('div').attr('id').rsplit('_', 1)[1]
        curr_num_vb = $(tag).data('row')
    }
}

function onButtonRecordTime(btn_id) {
    let player_info = vlst_dct[btn_id.id.split('_record_btn')[0]]
    let player_tmp = player_info.player_var
    // let pl_state = player_tmp.getPlayerState()
    let curr_time = player_tmp.getCurrentTime()
}


function addSlider(vid_id, start, end) {
    var handle1 = $("#custom-handle1");
    var handle2 = $("#custom-handle2");
    // var splayer = vlst_dct[vid_id].player_var
    start = Number(start)
    end = Number(end)
    $("#slider").slider({
        range: true,
        min: start,
        max: end,
        step: 0.01,
        create: function (event, ui) {
            $(this).slider('option', 'values', [start + 1, end - 1])
            handle1.text($(this).slider("values", 0).toFixed(1));
            handle2.text($(this).slider("values", 1).toFixed(1));
        },
        slide: function (event, ui) {
            handle1.text(ui.values[0].toFixed(1));
            handle2.text(ui.values[1].toFixed(1));
            let num_vb = curr_num_vb
            $(`#${vid_id}_vb_drop_${num_vb}_time_start`).val(ui.values[0])
            $(`#${vid_id}_vb_drop_${num_vb}_time_end`).val(ui.values[1])
            vlst_dct[vid_id].player_var.seekTo(ui.value)
            vlst_dct[vid_id].player_var.pauseVideo()
        }
    });

}


function compile_free_text(vid_id, start, end) {
    let ftxt_inp = $(`#${vid_id}_ftxt`).val().split('\n')
    let ftxt_tabl_inp = ''
    let loop_idx = 0
    for (const [row_ix, ftxt_line] of ftxt_inp.entries()) {
        ftxt_tabl_inp += `
        <tr>
            <td class="VSRL_Tab" data-row="${row_ix}"> ${ftxt_line} </td>
            <td>
                <input id="${vid_id}_vb_drop_${row_ix}_time_start" type="number" step="0.01"
                name="${vid_id}_${loop_idx}_vb_drop_${row_ix}_time_start" min="${start}" max="${end}">
            </td>
            <td>
                <input id="${vid_id}_vb_drop_${row_ix}_time_end" type="number" step="0.01"
                name="${vid_id}_${loop_idx}_vb_drop_${row_ix}_time_end" min="${start}" max="${end}">
            </td>
            <td>
                NA
            </td>
        </tr>
        `
    }

    let tbl_inp = `
    <table>
        <tr>
            <th> Sentence </th>
            <th colspan=2> Time Stamps </th>
            <th> Event Relations </th>
        </tr>
        ${ftxt_tabl_inp}
    </table>
    `
    $(`#${vid_id}_SRL`).html(tbl_inp)
    $(".VSRL_Tab").unbind("click").click(function (event) {
        select_curr_elm_for_time_new(this)
    })
}


// function addFaces(vid_id)

function createColumnsForTable(tstep_options) {
    return {
        'TimeIx': {
            name: "TimeIx",
            display: "TimeIx",
            type: "select",
            ctrlOptions: tstep_options,
            events: {
                change: function (e) {
                    init_ev(vid_id);
                }
            },
            cellClass: "time_ix_sel"
        },
        'Play': {
            name: "Play", display: "Play", type: "custom",
            cellClass: "yt_play",
            customBuilder: function (parent, idPrefix, name, uniqueIndex) {
                let btn_id = idPrefix + "_" + name + "_" + uniqueIndex
                let html_inp = `
                <button type="button" id=${btn_id} class="vplay_btn">
                <i class='fas fa-play' style='font-size:12px'></i>
                </button>
                <input id="${btn_id}_btn_count" name="${btn_id}_btn_count" hidden type="number" value="0">
                `
                $(parent).html(html_inp)
                // set_play_btn_stuff(vid_id, uniqueIndex)
            },
            customGetter: function (idPrefix, name, uniqueIndex) {
            },
            customSetter: function (idPrefix, name, uniqueIndex, value) {
            }
        },
        'EventID': {
            name: "EventID", display: "EventID", type: "readonly",
            cellClass: "event_id_sel",
        },
        'Verb': {
            name: "Verb", display: "Verb",
            events: {
                change: function (e) {
                    // init_ev(vid_id);
                    // get_main_event(vid_id, cev_id);
                }
            },
            cellClass: "verb_sel",
            // ctrlAttr: { pattern: '(\w*)\s\(.*\)'}
        },
        'Roles': {
            name: "Roles", display: "Arguments", type: "custom",
            cellClass: "role_sel",
            // displayCss: {
            //     "background-color": "#333333",
            //     "color": "#ffffff",
            //     "width": "20%",
            // },
            customBuilder: function (parent, idPrefix, name, uniqueIndex) {
            },
            customGetter: function (idPrefix, name, uniqueIndex) {
                //let td_role_id = idPrefix + '_td_RolesRow_' + uniqueIndex
            },
            customSetter: function (idPrefix, name, uniqueIndex, value) {
            }
        },
        'EvRelSel': {
            name: "EvRelSel", display: "EventRelation", type: "select",
            ctrlAttr: {
                required: "required",
            },
            cellClass: "even_rel_sel_col",
            // ctrlOptions: function (elem) {
            //     // let urow_ix = elem.parentElement.dataset.uniqueIndex
            //     let urow_ix = 1
            //     if (urow_ix < 3) {
            //         elem.appendChild(new Option("", ""));
            //         elem.appendChild(new Option(`Ev${urow_ix} Causes Ev3`, 'Causes'));
            //         elem.appendChild(new Option(`Ev3 is a Reaction To Ev${urow_ix}`, 'Reaction To'));
            //         elem.appendChild(new Option(`Ev${urow_ix} Enables Ev3`, 'Enables'));
            //         elem.appendChild(new Option(`Ev${urow_ix} and Ev3 are Not Related`, 'NoRel'));
            //     } else if (urow_ix > 3) {
            //         elem.appendChild(new Option("", ""));
            //         elem.appendChild(new Option(`Ev3 Causes Ev${urow_ix}`, 'Causes'));
            //         elem.appendChild(new Option(`Ev${urow_ix} is a Reaction To Ev3`, 'Reaction To'));
            //         elem.appendChild(new Option(`Ev3 Enables Ev${urow_ix}`, 'Enables'));
            //         elem.appendChild(new Option(`Ev${urow_ix} and Ev3 are Not Related`, 'NoRel'));
            //     }
            //     else {
            //         elem.appendChild(new Option("", ""));
            //     }
            // }
            // ctrlOptions: evev_reln_lst,
            // displayCss: {
            //     "width": "15%",
            // },
        },
        'SelEv': {
            name: 'SelEv',
            display: 'SelEv',
            type: "select",
            ctrlOptions: []
        },
        'SSents': {
            name: 'SSents',
            display: 'SSents',
            type: "custom",
            customBuilder: function (parent, idPrefix, name, uniqueIndex) {
                let txt_area = idPrefix + "_" + name + "_" + uniqueIndex
                let html_inp = `
                <textarea id=${txt_area} name=${txt_area} rows="2" cols="16"></textarea>
                `
                $(parent).html(html_inp)
            },
            customGetter: function (idPrefix, name, uniqueIndex) {
            },
            customSetter: function (idPrefix, name, uniqueIndex, value) {
            }
        }

    }
}

function increment_counter(inp_btn_count_id) {
    // let inp_btn_count_id = `${vid_id}_btn_hidden`
    let curr_val = parseInt(document.getElementById(inp_btn_count_id).value, 10);
    curr_val = isNaN(curr_val) ? 0 : curr_val;
    curr_val++;
    document.getElementById(inp_btn_count_id).value = curr_val
}

function addTable_v3(vid_id, ntstep) {
    // Add table with verb-arg structure
    // but no time-stamps
    /*
        Head: TimeSteps, EventID, Verb, RoleStructure, Event Event-Event Relation
    */

    let table_div_id = `${vid_id}_SRL`
    let table_id = `${vid_id}_srl_table_v3`
    let cev_id = `${table_id}_cev_id`
    $(`#${table_div_id}`).html(`<table id=${table_id}></table>`)
    let tstep_options = []
    let init_data = []
    // let delta = 2
    for (tstep of [...Array(ntstep).keys()]) {
        let sti_t = tstep * delta
        let eni_t = sti_t + delta
        let to_push = `${sti_t}-${eni_t}s`
        tstep_options.push(`${to_push}`)
        init_data.push({ 'TimeIx': `${to_push}` })
    }
    cols = createColumnsForTable(tstep_options)
    vlst_dct[vid_id].table_grid = new AppendGrid({
        element: `${table_id}`,
        uiFramework: "bootstrap4",
        iconFramework: "fontawesome5",
        hideRowNumColumn: true,
        hideButtons: {
            append: true,
            removeLast: true,
            insert: true,
            remove: true,
            moveUp: true,
            moveDown: true,
        },
        columns: [
            cols['TimeIx'],
            cols['Play'],
            cols['EventID'],
            cols['Verb'],
            cols['Roles'],
            cols['EvRelSel'],
            //cols['SelEv'],
        ],
        sectionClasses: {
            table: "table-sm",
            control: "form-control-sm",
            buttonGroup: "btn-group-sm"
        },
        // initRows: 15,
        initData: init_data,
        rowButtonsInFront: true,
        afterRowAppended: function (caller, parentIndex, addedRows) {
            do_stuff_after_row_action()
            if ('table_grid' in vlst_dct[vid_id]) {
                if (parentIndex !== null) {
                    let ev_val = vlst_dct[vid_id].table_grid.getCellCtrl("TimeIx", parentIndex).selectedIndex
                    for (adr of addedRows) {
                        vlst_dct[vid_id].table_grid.getCellCtrlByUniqueIndex("TimeIx", adr).selectedIndex = ev_val
                    }
                }
            }
        },
        afterRowInserted: function (caller, parentIndex, addedRows) {
            do_stuff_after_row_action()
            if ('table_grid' in vlst_dct[vid_id]) {
                if (parentIndex !== null) {
                    let ev_val = vlst_dct[vid_id].table_grid.getCellCtrl("TimeIx", parentIndex).selectedIndex
                    for (adr of addedRows) {
                        vlst_dct[vid_id].table_grid.getCellCtrlByUniqueIndex("TimeIx", adr).selectedIndex = ev_val
                    }
                }
            }
        },
        afterRowRemoved: function (caller, rowIndex) {
            do_stuff_after_row_action()
        },
        afterRowSwapped: function (caller, oldRowIndex, newRowIndex) {
            do_stuff_after_row_action()
        },
        beforeRowRemove: function (caller, rowIndex) {
            if ('table_grid' in vlst_dct[vid_id]) {
                let ev_val = vlst_dct[vid_id].table_grid.getCellCtrl("TimeIx", rowIndex).selectedIndex
                return false;
            }
            // Add confirmation before removing a row
            // return confirm("Are you sure to remove this row?");
        },


    });

    function init_ev(vid_id) {
        $('.time_ix_sel').find('select').attr('disabled', true)
        // let rowIndex = vlst_dct[vid_id].table_grid.getRowIndex(uniqueIndex);
        let row_order = vlst_dct[vid_id].table_grid.getRowOrder()
        for (ro of row_order) {
            let rowIndex = vlst_dct[vid_id].table_grid.getRowIndex(ro)
            vlst_dct[vid_id].table_grid.setCtrlValue("EventID", rowIndex, `Ev${ro}`);
        }
    }

    function acmp_vb_easy_source(term_inp) {
        var term = $.ui.autocomplete.escapeRegex(term_inp)
            , startsWithMatcher = new RegExp("^" + term, "i")
            , startsWith = $.grep(verb_list_args.verb_list, function (value) {
                return startsWithMatcher.test(value.label || value.value || value);
            })
            , containsMatcher = new RegExp(term, "i")
            , contains = $.grep(verb_list_args.verb_list, function (value) {
                return $.inArray(value, startsWith) < 0 &&
                    containsMatcher.test(value.label || value.value || value);
            });
        return { 'startsWith': startsWith, 'contains': contains }
        // return startsWith, contains;

    }

    function acmp_vb_easy_select(verb_elm, vid_id, ro, ui = 0) {
        let role_tag_prefix = verb_elm.id.split('_Verb_')[0]
        let verb_span_id = role_tag_prefix + '_verb_eg_' + ro
        if ($(`#${verb_span_id}`).length === 0) {
            $(`#${verb_elm.id}`).after(`<div class="verbeg" id=${verb_span_id} style="height:auto">
            </div>`)
        }
        let vb_html_hidden_div_id = `${verb_elm.id}_hidden_verb_id_div`
        if ($(`#${vb_html_hidden_div_id}`).length === 0) {
            $(`#${verb_elm.id}`).after(`<div class="verb_id_hid" id=${vb_html_hidden_div_id}></div>`)
        }

        let roles_td_id = $(`#${verb_elm.id}`).closest('td').next('td')
        // let verb_sel = ui.item.value;
        var verb_sel
        if (ui != 0) {
            verb_sel = ui.item.value;
        } else {
            verb_sel = verb_elm.value;
        }
        // let
        let verb_data_sel = verb_list_args.verb_dct[verb_sel];
        let verb_abs = verb_data_sel.abstract
        let verb_abs_inp = `${verb_sel} <br>`
        verb_abs_inp += '<u>Example Usage for ' + verb_sel.split('(', 1)[0].trim() + ':</u>'
        for (abs of verb_abs) {
            verb_abs_inp += '<br>'
            verb_abs_inp += abs;
        }

        $(`#${verb_span_id}`).html(`<span class="noselect"> ${verb_abs_inp} </span>`)
        let vb_html_hidden = `<input type="text" hidden id=${verb_elm.id}_hidden_verb_id name=${verb_elm.id}_hidden_verb_id value="${verb_data_sel.id}" />`
        $(`#${vb_html_hidden_div_id}`).html(vb_html_hidden)
        $(`#${vb_html_hidden_div_id}`).attr('data-curvb', verb_sel)

        let roles = verb_data_sel['order'];
        if (roles[roles.length - 1] != argm_loc) {
            let to_add_loc = true
            for (r of roles) {
                if (r.includes('location')) {
                    to_add_loc = false
                }
            }
            if (to_add_loc) {
                roles.push(argm_loc)
            }
        }

        let role_html = ``
        let role_id_lst = []
        for ([role_ix, role] of roles.entries()) {
            let role_id = role_tag_prefix + '_Roles_' + ro + '_RoleNum_' + role_ix
            role_id_lst.push(role_id)
            role_html += `
            <div class="role_container">
                <input type="text" class="inputText form-control form-control-sm" required
                id=${role_id} name=${role_id} value="" onkeyup="this.setAttribute('value', this.value);"
                oninvalid="this.setCustomValidity('Please Fill this Argument. Use - if cannot be filled')"
                oninput="this.setCustomValidity('')" />
                <span class="floating-label">${role}</span>
                <input type="text" class="inputText form-control form-control-sm" hidden
                         id=${role_id}_hidden_role_name name=${role_id}_hidden_role_name value="${role}" />

            </div>
            `
        }

        roles_td_id.attr('id', role_tag_prefix + '_td_RolesRow_' + ro)
        roles_td_id.attr('data-nr', roles.length)
        roles_td_id.attr('data-curvb', verb_sel)
        roles_td_id.html(role_html)
        for (rl_id of role_id_lst) {
            acmp_roles_simple(rl_id, vid_id)
        }
        if (ro == 3) {
            for (rl_id of role_id_lst) {
                $(`#${rl_id}`).on('change', function () {
                    get_main_event(vid_id, cev_id)
                })
            }
        }
        if (task_type == 'eval_vb') {
            for (rl_id of role_id_lst) {
                $(`#${rl_id}`).attr('disabled', true)
            }
        }
    }

    function acmp_vb_easy(tag_id, vid_id, ro) {
        $(`#${tag_id}`).autocomplete({
            //source: verb_list_args.verb_list,

            source: function (request, response) {

                // var result = $.ui.autocomplete.filter(verb_list_args.verb_list, request.term);
                // response(result);

                // var term = $.ui.autocomplete.escapeRegex(request.term)
                //     , startsWithMatcher = new RegExp("^" + term, "i")
                //     , startsWith = $.grep(verb_list_args.verb_list, function (value) {
                //         return startsWithMatcher.test(value.label || value.value || value);
                //     })
                //     , containsMatcher = new RegExp(term, "i")
                //     , contains = $.grep(verb_list_args.verb_list, function (value) {
                //         return $.inArray(value, startsWith) < 0 &&
                //             containsMatcher.test(value.label || value.value || value);
                //     });
                var source_out = acmp_vb_easy_source(request.term)
                response(source_out.startsWith.concat(source_out.contains));

            },

            select: function (event, ui) {

                //         let role_tag_prefix = this.id.split('_Verb_')[0]
                //         let verb_span_id = role_tag_prefix + '_verb_eg_' + ro
                //         if ($(`#${verb_span_id}`).length === 0) {
                //             $(`#${this.id}`).after(`<div class="verbeg" id=${verb_span_id} style="height:auto">
                //             </div>`)
                //         }
                //         let vb_html_hidden_div_id = `${this.id}_hidden_verb_id_div`
                //         if ($(`#${vb_html_hidden_div_id}`).length === 0) {
                //             $(`#${this.id}`).after(`<div class="verb_id_hid" id=${vb_html_hidden_div_id}></div>`)
                //         }

                //         let roles_td_id = $(`#${this.id}`).closest('td').next('td')
                //         let verb_sel = ui.item.value;
                //         let verb_data_sel = verb_list_args.verb_dct[verb_sel];
                //         let verb_abs = verb_data_sel.abstract
                //         let verb_abs_inp = '<u>Example Usage for ' + verb_sel.split('(', 1)[0].trim() + ':</u>'
                //         for (abs of verb_abs) {
                //             verb_abs_inp += '<br>'
                //             verb_abs_inp += abs;
                //         }

                //         $(`#${verb_span_id}`).html(`<span class="noselect"> ${verb_abs_inp} </span>`)
                //         let vb_html_hidden = `<input type="text" hidden id=${this.id}_hidden_verb_id name=${this.id}_hidden_verb_id value="${verb_data_sel.id}" />`
                //         $(`#${vb_html_hidden_div_id}`).html(vb_html_hidden)
                //         $(`#${vb_html_hidden_div_id}`).attr('data-curvb', verb_sel)

                //         let roles = verb_data_sel['order'];
                //         if (roles[roles.length - 1] != argm_loc) {
                //             let to_add_loc = true
                //             for (r of roles) {
                //                 if (r.includes('location')) {
                //                     to_add_loc = false
                //                 }
                //             }
                //             if (to_add_loc) {
                //                 roles.push(argm_loc)
                //             }
                //         }

                //         let role_html = ``
                //         let role_id_lst = []
                //         for ([role_ix, role] of roles.entries()) {
                //             let role_id = role_tag_prefix + '_Roles_' + ro + '_RoleNum_' + role_ix
                //             role_id_lst.push(role_id)
                //             role_html += `
                //             <div class="role_container">
                //                 <input type="text" class="inputText form-control form-control-sm" required
                //                 id=${role_id} name=${role_id} value="" onkeyup="this.setAttribute('value', this.value);"
                //                 oninvalid="this.setCustomValidity('Please Fill this Argument. Use - if cannot be filled')"
                //                 oninput="this.setCustomValidity('')" />
                //                 <span class="floating-label">${role}</span>
                //                 <input type="text" class="inputText form-control form-control-sm" hidden
                //                          id=${role_id}_hidden_role_name name=${role_id}_hidden_role_name value="${role}" />

                //             </div>
                //             `
                //         }

                //         roles_td_id.attr('id', role_tag_prefix + '_td_RolesRow_' + ro)
                //         roles_td_id.attr('data-nr', roles.length)
                //         roles_td_id.attr('data-curvb', verb_sel)
                //         roles_td_id.html(role_html)
                //         for (rl_id of role_id_lst) {
                //             acmp_roles_simple(rl_id, vid_id)
                //         }
                //         if (ro == 3) {
                //             for (rl_id of role_id_lst) {
                //                 $(`#${rl_id}`).on('change', function () {
                //                     get_main_event(vid_id, cev_id)
                //                 })
                //             }
                //         }
                //         if (task_type == 'eval_vb') {
                //             for (rl_id of role_id_lst) {
                //                 $(`#${rl_id}`).attr('disabled', true)
                //             }
                //         }
                acmp_vb_easy_select(this, vid_id, ro, ui)

            },
            change: function () {
                get_main_event(vid_id, cev_id)
                let role_tag_prefix = this.id.split('_Verb_')[0]
                let verb_span_id = role_tag_prefix + '_verb_eg_' + ro
                // let roles_td_id = $(`#${this.id}`).closest('td').next('td')
                let vb_html_hidden_div_id = `${this.id}_hidden_verb_id_div`
                // let prev_vb = roles_td_id.attr('data-curvb')
                let prev_vb = $(`#${vb_html_hidden_div_id}`).attr('data-curvb')
                let vb_sel_msg = `<b>Select a Verb from DropDown</b>`
                if (prev_vb == null) {
                    if ($(`#${verb_span_id}`).length === 0) {
                        $(`#${this.id}`).after(`<div class="verbeg" id=${verb_span_id} style="height:auto">
                        </div>`)
                    }
                    $(`#${verb_span_id}`).html(`<span class="noselect"> ${vb_sel_msg} </span>`)
                }
                let new_vb = this.value;
                if (!(new_vb == prev_vb)) {
                    // vb being changed
                    if (!(new_vb in verb_list_args.verb_dct)) {
                        // some problem
                        this.value = ''
                        if (!(prev_vb == null)) {
                            $(`#${verb_span_id}`).html(`<span class="noselect"><u>Previous Verb chosen:</u><br> ${prev_vb}. <br> ${vb_sel_msg} </span>`)
                        }
                    }
                }
            }
        })

    }

    function acmp_roles_simple(tag_id, vid_id) {
        recreate_acmp_lst(vid_id)
        $(`#${tag_id} `).autocomplete({
            source: function (request, response) {

                var result = $.ui.autocomplete.filter(acmp_lst, request.term);
                response(result);
            },
            minLength: 0,
            change: function (event, ui) {
                let curr_val = $(this).val()
                if ($.inArray(curr_val, lst_dct['refexp']) < 0) {
                    lst_dct['refexp'].push(curr_val);
                    recreate_acmp_lst(vid_id)
                }
            }
        }).bind('focus', function () { $(this).autocomplete("search"); });

    }

    function acmp_for_existing_vbs(vid_id) {
        let row_order = vlst_dct[vid_id].table_grid.getRowOrder()
        for (ro of row_order) {
            //let rowIndex = vlst_dct[vid_id].table_grid.getRowIndex(ro)
            let tg_id = vlst_dct[vid_id].table_grid.getCellCtrlByUniqueIndex("Verb", ro);
            tg_id.required = true
            acmp_vb_easy(tg_id.id, vid_id, ro)
        }
    }
    function play_two_sec(curr_elm, event) {
        let vid_id = curr_elm.id.split('_srl_table', 1)[0]
        let uniq_idx = curr_elm.id.rsplit('_', 1)[1]
        // console.log(curr_set_time_outs)
        while (curr_set_time_outs.length) {
            c = curr_set_time_outs.pop();
            clearTimeout(c)
        }
        let yt_player = vlst_dct[vid_id]
        // let rowIndex = yt_player.table_grid.getRowIndex(uniqueIndex);
        let tg_id = vlst_dct[vid_id].table_grid.getCellCtrlByUniqueIndex("TimeIx", uniq_idx);
        let interval_id = tg_id.selectedIndex
        let st_time = yt_player['start']
        let new_seek_time = st_time + delta * interval_id
        // yt_player.player_var.pauseVideo()
        pdone = false
        yt_player.player_var.seekTo(new_seek_time)
        yt_player.player_var.pauseVideo()
        yt_player.player_var.playVideo()
        // while (yt_player.player_var.getPlayerState() != 1) {
        //     setTimeout(() => { }, 100);
        // }
        curr_set_time_outs.push(
            setTimeout(function () {
                yt_player.player_var.pauseVideo();
            }, (delta + 0.05) * 1000)
        )
    }
    function set_play_btn_stuff() {
        $('.vplay_btn').unbind("click").click(function (event) {
            play_two_sec(this, event)
            let btn_count_id = `${this.id}_btn_count`
            increment_counter(btn_count_id)
        });
    }

    function get_list_from_row_order(row_order) {
        let out_lst = ''
        for (ro of row_order) {
            out_lst += `< option value = ${ro}> Ev${ro} </option > `
        }
        return out_lst
    }
    function update_sel_lst(vid_id) {
        let row_order = vlst_dct[vid_id].table_grid.getRowOrder()
        out_ops = get_list_from_row_order(row_order)
        for (ro of row_order) {
            let tg_id = vlst_dct[vid_id].table_grid.getCellCtrlByUniqueIndex("SelEv", ro);
            let curr_val = tg_id.value
            $(`#${tg_id.id} `).html(out_ops)
            $(`#${tg_id.id} `).prop("selectedIndex", -1);
            let new_vals = $(`#${tg_id.id} option`).map(function () { return $(this).val(); }).get();
            if (new_vals.indexOf(curr_val) !== -1) {
                tg_id.value = curr_val
            }
        }
    }

    function get_main_event(vid_id, cev_id) {
        curr_row_uix = 3
        if ('table_grid' in vlst_dct[vid_id]) {
            let req_cell = vlst_dct[vid_id].table_grid.getCellCtrlByUniqueIndex('EventID', curr_row_uix)
            req_cell.style.backgroundColor = "#C5E1C5"
        }
        function copy_from_orig_inp(elm) {
            // let curr_id = elm.id
            // let orig_id = curr_id.rsplit('_', 1)[0] + '_' + curr_row_uix
            let orig_id = elm.dataset.orig_id
            let curr_val = $(`#${orig_id} `).val()
            elm.value = curr_val
        }
        function copy_from_orig_sel(elm) {
            let orig_id = elm.dataset.orig_id
            let curr_val = $(`#${orig_id} `)[0].selectedIndex
            elm.selectedIndex = curr_val
        }
        $(`#${cev_id}`).attr('data-curr_uix', curr_row_uix)
        if (curr_row_uix > -1) {
            // Main Event is selected. Show the main ev
            let trow = vlst_dct[vid_id].table_grid.getCellCtrlByUniqueIndex("EventID", curr_row_uix)
            let trow_html = $(`#${trow.id} `).closest('tr').clone()
            trow_html.find("*[id]").each(function (ix) {
                let curr_id = this.id
                let new_id
                if (curr_id.includes('_Roles_')) {
                    //do stuff
                    let suffix = '_RoleNum' + curr_id.split('_RoleNum', 1)[1]
                    new_id = curr_id.split('_RoleNum', 1)[0].rsplit('_', 1)[0] + '_50' + suffix
                }
                else {
                    new_id = curr_id.rsplit('_', 1)[0] + '_50'
                }
                $(this).attr('id', new_id)
                $(this).attr('data-orig_id', curr_id)
                // $(this).attr('name', new_id)
            })
            //trow_html.find("select").attr('disabled', true)
            $(`#${cev_id}`).html(`< tbody style = "height:auto" > ${trow_html.html()}</tbody >`)
            $(`#${cev_id} .verbeg`).hide()
            $(`#${cev_id}`).find('input').each(function (ix) {
                $(this).attr('readonly', true)
                let curr_id = this.id
                $(this).attr('name', curr_id)
                copy_from_orig_inp(this)
            })
            $(`#${cev_id}`).find('select').each(function (ix) {
                $(this).attr('readonly', true)
                let curr_id = this.id
                $(this).attr('name', curr_id)
                copy_from_orig_sel(this)
            })
            $(`#${cev_id}.vplay_btn`).unbind("click").click(function (event) {
                play_two_sec(this, event)
            });
            // $(`#${ cev_id }.cev_span`).text('Main Event')
        }
        else {
            // Main Event is not selected. Say nothing is selected
            $(`#${cev_id}`).html('<span>Main Event is not Selected</span>')
        }
    }

    function create_ev_rel_lst() {
        $('.even_rel_sel_col').each(function () {
            let urow_ix = $(this).closest('tr').data('unique-index')
            let elem = $(this).find('select').get(0)
            if (use_new_evrel) {
                if (urow_ix < 3) {
                    elem.appendChild(new Option("", ""));
                    elem.appendChild(new Option(`Ev${urow_ix} Causes Ev3`, 'Causes'));
                    // elem.appendChild(new Option(`Ev3 is a Reaction To Ev${urow_ix}`, 'Reaction To'));
                    elem.appendChild(new Option(`Ev${urow_ix} Enables Ev3`, 'Enables'));
                    elem.appendChild(new Option(`Ev${urow_ix} and Ev3 have Other Relation`, 'SomeRel'));
                    elem.appendChild(new Option(`Ev${urow_ix} and Ev3 are Completely UnRelated`, 'NoRel'));

                } else if (urow_ix > 3) {
                    elem.appendChild(new Option("", ""));
                    elem.appendChild(new Option(`Ev3 Causes Ev${urow_ix}`, 'Causes'));
                    // elem.appendChild(new Option(`Ev${urow_ix} is a Reaction To Ev3`, 'Reaction To'));
                    elem.appendChild(new Option(`Ev3 Enables Ev${urow_ix}`, 'Enables'));
                    // elem.appendChild(new Option(`Some other Relation exists between Ev${urow_ix} and Ev3`, 'SomeRel'));
                    elem.appendChild(new Option(`Ev${urow_ix} and Ev3 have Other Relation`, 'SomeRel'));
                    elem.appendChild(new Option(`Ev${urow_ix} and Ev3 are Completely UnRelated`, 'NoRel'));
                }
                else {
                    // elem.appendChild(new Option("", ""));
                    elem.disabled = true
                }
            } else {
                if (urow_ix < 3) {
                    elem.appendChild(new Option("", ""));
                    elem.appendChild(new Option(`Ev${urow_ix} Causes Ev3`, 'Causes'));
                    elem.appendChild(new Option(`Ev3 is a Reaction To Ev${urow_ix}`, 'Reaction To'));
                    elem.appendChild(new Option(`Ev${urow_ix} Enables Ev3`, 'Enables'));
                    elem.appendChild(new Option(`Ev${urow_ix} and Ev3 are Not Related`, 'NoRel'));
                } else if (urow_ix > 3) {
                    elem.appendChild(new Option("", ""));
                    elem.appendChild(new Option(`Ev3 Causes Ev${urow_ix}`, 'Causes'));
                    elem.appendChild(new Option(`Ev${urow_ix} is a Reaction To Ev3`, 'Reaction To'));
                    elem.appendChild(new Option(`Ev3 Enables Ev${urow_ix}`, 'Enables'));
                    elem.appendChild(new Option(`Ev${urow_ix} and Ev3 are Not Related`, 'NoRel'));
                }
                else {
                    // elem.appendChild(new Option("", ""));
                    elem.disabled = true
                }
            }

            // console.log(urow_ix)
        })
    }

    function do_stuff_after_row_action(rowIndex = -1) {

        if ('table_grid' in vlst_dct[vid_id]) {
            init_ev(vid_id)
            acmp_for_existing_vbs(vid_id)
            //update_sel_lst(vid_id)
            if ($(`#${cev_id}`).length === 0) {
                $(`#${table_id}`).after(`<div class= "cev" id = ${cev_id} style = "height:auto"></div>
        <span>(MainEvent)</span>`)
            }
            get_main_event(vid_id, cev_id)
            set_play_btn_stuff()

            create_ev_rel_lst()
            if (task_type == 'eval_vb') {
                $('select').attr('disabled', true)
            }
            if (task_type == 'eval_arg') {
                fill_vbs_only()
            }
        }
    }
    do_stuff_after_row_action()

    function fill_vbs_only() {
        if ('table_grid' in vlst_dct[vid_id]) {
            let row_order_fb = vlst_dct[vid_id].table_grid.getRowOrder()
            for (ro of row_order_fb) {
                let verb_tag_id = vlst_dct[vid_id].table_grid.getCellCtrlByUniqueIndex('Verb', ro)
                if ('vb_to_use' in vlst_dct[vid_id]) {
                    verb_tag_id.value = vlst_dct[vid_id]['vb_to_use'][`Ev${ro}`]
                    acmp_vb_easy_select(verb_tag_id, vid_id, ro)
                }
            }
            $('.verb_sel').find('input').attr('disabled', true)
            $('.verb_id_hid').find('input').attr('disabled', false)
        }
    }

    return do_stuff_after_row_action
}

function try_post() {
    let btn_id = `${vid_id}_ftxt_post`
    let ftxt_data = { 'ftxt': "Man throws a ball towards a kid" }
    $(`#${btn_id}`).click(function () {
        $.ajax({
            type: 'POST',
            crossDomain: true,
            data: ftxt_data,
            //headers: { 'Access-Control-Allow-Origin': '*' },
            // dataType: 'json',
            url: 'http://localhost:7008/alnlp_post',
            success: function (jsondata) {
                alert('Data is' + jsondata['data'])
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
                xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
                xhr.setRequestHeader("Access-Control-Allow-Credentials", "true");
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            }

        })
    })

}
