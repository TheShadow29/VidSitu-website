function init_cards_text(tag_id, card_dict, with_modal = true, with_card_text = true, with_modal_img = true, resize_img = false, with_card_title = true) {
    let out_src = `<div class="row row-cols-1 row-cols-md-${card_dict.length} g-4">`
    for (card of card_dict) {
        let modal_tag_id = `myModal_${tag_id}_${card.place_id}`
        let modal_size = 'modal-md'
        if (card.hasOwnProperty('img_len')) {
            modal_size = `modal-${card.img_len}`
        }
        let modal_img_src = ''
        if (with_modal_img) {
            if (resize_img) {
                modal_img_src = `<img src=${card.card_img} class="card-img-top card-img-top-resize">`
            } else {
                modal_img_src = `<img src=${card.card_img} class="card-img-top card-img-top2">`
            }
        }

        let modal_src = ''
        if (with_modal) {
            let pop_img = ''
            if (Array.isArray(card.card_popimg)) {
                for (cpop of card.card_popimg) {
                    let croprect = ''
                    if (cpop.hasOwnProperty('croprect')) {
                        croprect = `cropimg`
                    }
                    pop_img += `<p>${cpop.text}</p>
                    <a href="${cpop.img}" target="_blank">
                        <div class='img_cont py-3'><img src="${cpop.img}" class="img-fluid ${croprect}" style="max-width:100%"></div>
                    </a>`
                }
            } else {
                pop_img = `<a href="${card.card_popimg}" target="_blank"><img src="${card.card_popimg}" class="img-fluid" style="max-width:100%"></a>`
                // pop_img = `<a href="${card.card_popimg}" target="_blank"><object data="${card.card_popimg}"></object></a>`

            }

            modal_src = `<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#${modal_tag_id}">${card.pimg_txt}</button>
        <div id="${modal_tag_id}" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
          aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered ${modal_size}">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${card.card_title}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
              <div class="modal-body">
              ${pop_img}
              </div >
            </div >
          </div >
        </div >`
        }
        let card_text = ''
        if (with_card_text) {
            card_text = `<p class="card-text text-center">${card.card_text}</p>`
        }
        let card_title = ''
        if (with_card_title) {
            card_title = `<h5 class="card-title">${card.card_title}</h5>`
        }
        out_src += `
        <div class="col">
          <div class="card h-100">
            ${modal_img_src}
            <div class="card-body">
                ${card_title}
                ${card_text}
            </div>
            ${modal_src}
          </div >
        </div >`
    }
    return `${out_src} </div>`
}

function init_ds_cards(tag_id) {
    let card_dict = [
        {
            'place_id': 1,
            'card_title': 'Large-Scale',
            'card_text': '3K Movies, 29K 10-second Movie Clips, 145K Events',
            'card_img': 'assets/tmp_pics/scale.png',
            'card_popimg': '/assets/modal_imgs/vb_gen_mov_dist_v2-min.svg',
            'img_len': 'xl',
            'pimg_txt': 'Scale <br> Statistics'
        },
        {
            'place_id': 2,
            'card_title': 'Diverse Videos',
            'card_text': 'Videos in VidSitu are diverse. 224 Verbs appear in at least 100 Events. 336 Distinct Nouns appear in at least 100 Videos',
            'card_img': 'assets/tmp_pics/Diversity.png',
            // 'card_popimg': '/assets/modal_imgs/diversity_only-min.svg',
            'card_popimg': [
                {
                    'img': '/assets/ds_stats_fin/r1c1_verb_diversity.svg',
                    'text': 'Diversity of Actions',
                    'croprect': ''
                },
                {
                    'img': '/assets/ds_stats_fin/r1c2_noun_diversity.svg',
                    'text': 'Diversity of Entities',
                    'croprect': ''
                }
            ],
            'pimg_txt': 'Diversity <br> Statistics'
        },
        {
            'place_id': 3,
            'card_title': 'Complex Videos',
            'card_text': 'Videos in VidSitu are complex. More than 80% of the videos have at least 4 unique verbs and 70% of the videos have at least 6 unique entities.',
            'card_img': 'assets/tmp_pics/Complexity.png',
            // 'card_popimg': '/assets/modal_imgs/complexity_only-min.svg',
            'card_popimg': [
                {
                    'img': '/assets/ds_stats_fin/r2c1_uniqvbs_onevid_histogram.svg',
                    'text': 'Unique Verbs Per Video',
                    'croprect': ''
                },
                {
                    'img': '/assets/ds_stats_fin/r2c2_entity_histogram.svg',
                    'text': 'Unique Entities Per Video',
                    'croprect': ''
                }
            ],
            'pimg_txt': 'Complexity <br> Statistics'
        },
        {
            'place_id': 4,
            'card_title': 'Rich Annotations',
            'card_text': 'Each Video in VidSitu is annotated with rich structured representations of events that includes verbs, semantic role labels, entitycoreferences, and event relations.',
            'card_img': '/assets/icons2/annotate.png',
            // 'card_popimg': '/assets/modal_imgs/richness_only-min.svg',
            'card_popimg': [
                {
                    'img': '/assets/ds_stats_fin/r2c3_nsrls_histogram.svg',
                    'text': 'Annotated Semantic Roles Per Event',
                    'croprect': ''
                },
                {
                    'img': '/assets/ds_stats_fin/r3c2_coref_ent_only_vsitu.svg',
                    'text': 'Coreference Chain Lengths',
                    'croprect': ''
                }
            ],
            'pimg_txt': 'Annotation <br> Statistics'
        },

    ]
    document.getElementById(tag_id).innerHTML = init_cards_text(tag_id, card_dict)
}

function init_task_cards(tag_id) {
    let card_dict = [


        {
            'place_id': 1,
            'card_title': '',
            'card_text': 'Given a 2-second clip, predict a verb-sense describing the most salient action.',
            'card_img': '/assets/VidSitu_logos_v2/VidSitVerbs.svg',
            'card_popimg': '/assets/modal_imgs/verb_pred_model_only-min3.png',
            'pimg_txt': 'Verb Example'
        },
        {
            'place_id': 2,
            'card_title': '',
            'card_text': 'Given a verb sense, generate the semantic roles for each 2-second interval. Entities within and across time-steps should be co-referenced.',
            'card_img': '/assets/VidSitu_logos_v2/VidSitSemantic.svg',
            'card_popimg': '/assets/modal_imgs/srl_pred_only-min3.png',
            'pimg_txt': 'Role Example'
        },
        {
            'place_id': 3,
            'card_title': '',
            'card_text': 'Given the verbs and semantic roles for two events, predict how the events are related to each other by classifying among 4 event-relation types.',
            'card_img': '/assets/VidSitu_logos_v2/VidSitEvent.svg',
            'card_popimg': '/assets/modal_imgs/evrel_only-min3.png',
            'pimg_txt': 'Relation Example'
        },

    ]
    document.getElementById(tag_id).innerHTML = init_cards_text(tag_id, card_dict, with_modal = true, with_card_text = true, with_modal_img = true)

}

function init_download_cards(tag_id) {
    let card_dict = [
        {
            'place_id': 0,
            'card_title': '',
            'card_text': '',
            'card_img': '/assets/icons2/blank.png',
        },
        {
            'place_id': 1,
            'card_title': 'YouTube Video Ids',
            'card_text': 'Links and download scripts to set up the dataset (train, validation and test sets)',
            'card_img': '/assets/icons2/youtube.png',
        },
        {
            'place_id': 2,
            'card_title': 'Annotations',
            'card_text': 'Annotations for train and validation sets',
            'card_img': '/assets/icons2/annotate.png',
        },
        {
            'place_id': 3,
            'card_title': 'Video Features',
            'card_text': 'Video features extracted using pretrained I3D and SlowFast models',
            'card_img': '/assets/icons2/model_weights.png',
        },
        {
            'place_id': 4,
            'card_title': '',
            'card_text': '',
            'card_img': '/assets/icons2/blank.png',
        },
    ]
    document.getElementById(tag_id).innerHTML = init_cards_text(tag_id, card_dict, with_modal = false, with_card_text = true, with_modal_img = true, resize_img = false)

}

function init_team_members(tag_id) {
    let card_dict = [
        {
            'place_id': 1,
            'card_text': `<a href='https://theshadow29.github.io/'>Arka Sadhu</a>`,
            'card_img': '/assets/authors/Arka.jpg'
        },
        {
            'place_id': 2,
            'card_text': `<a href='http://tanmaygupta.info/'>Tanmay Gupta</a>`,
            'card_img': '/assets/authors/tanmay.jpg'
        },
        {
            'place_id': 3,
            'card_text': `<a href='http://markyatskar.com/'>Mark Yatskar</a>`,
            'card_img': '/assets/authors/mark.jpg'
        },
        {
            'place_id': 4,
            'card_text': `<a href='https://sites.usc.edu/iris-cvlab/professor-ram-nevatia/'>Ram Nevatia</a>`,
            'card_img': '/assets/authors/ram_personal.jpg'
        },
        {
            'place_id': 5,
            'card_text': `<a href='https://anikem.github.io/'>Aniruddha Kembhavi</a>`,
            'card_img': '/assets/authors/ani.jpg'
        }
    ]
    document.getElementById(tag_id).innerHTML = init_cards_text(tag_id, card_dict, with_modal = false, with_card_text = true, with_modal_image = true, resize_img = true, with_card_title = false)

}

function init_code_cards(tag_id) {
    let card_dict = [
        {
            'place_id': 0,
            'card_title': '',
            'card_text': '',
            'card_img': '/assets/icons2/blank.png',
        },
        {
            'place_id': 1,
            'card_title': 'Data Setup',
            'card_text': 'Download Scripts and Data Loaders',
            'card_img': '/assets/icons2/datasetup.png'
        },
        {
            'place_id': 2,
            'card_title': 'Baselines',
            'card_text': 'Baseline Models with Config Files',
            'card_img': '/assets/icons2/baseline_config.png'
        },
        {
            'place_id': 3,
            'card_title': 'Evaluation',
            'card_text': 'Evaluation scripts and leaderboard instructions',
            'card_img': '/assets/icons2/leaderboard.png',
        },
        {
            'place_id': 4,
            'card_title': '',
            'card_text': '',
            'card_img': '/assets/icons2/blank.png',
        },
    ]
    document.getElementById(tag_id).innerHTML = init_cards_text(tag_id, card_dict, with_modal = false, with_card_text = true, with_modal_img = true, resize_img = false)

}

function header_fixer() {
    window.onscroll = function () { myFunction() };

    var header = document.getElementById("main_navbar");
    var sticky = header.offsetTop;

    function myFunction() {
        if (window.pageYOffset > sticky) {
            header.classList.add("fixed-top");
            // document.getElementsByTagName('h1').array.forEach(element => {
            //     element.style.paddingTop = 56
            // });
        } else {
            header.classList.remove("fixed-top");
            // document.getElementsByTagName('h1').array.forEach(element => {
            //     element.style.paddingTop = 88.8
            // });
        }
    }
}

function findPos(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return [curtop];
    }
}

// function correct_scroll() {
//     var head1 = document.getElementById('main_navbar')
//     var sticky = head1.offsetHeight
//     var nav_links = document.getElementsByClassName('nav-link')
//     for (navl of nav_links) {
//         if (navl.hash != "") {
//             navl.onclick = function (e) {
//                 e.preventDefault()
//                 window.scroll(0, findPos(document.getElementById(`${navl.hash.substring(1)}`)) - 56);
//             }
//         }
//     }
// }
