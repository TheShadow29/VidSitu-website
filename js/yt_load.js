// var tag = document.createElement('script');

// tag.src = "https://www.youtube.com/iframe_api";
// var firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var def_player_cfg_vars = {
    autoplay: 0, // Auto-play the video on load
    controls: 0, // Show pause/play buttons in player
    showinfo: 1, // Hide the video title
    modestbranding: 1, // Hide the Youtube Logo
    fs: 1, // Hide the full screen button
    cc_load_policy: 0, // Hide closed captions
    iv_load_policy: 3, // Hide the Video Annotations
    rel: 0, // Hide related videos
    //start: startSeconds,
    //end: endSeconds,
    autohide: 0, // Hide video controls when playing
};

function create_player_cfg(vid_id, st_time, end_time) {
    var play_cfg_vars = JSON.parse(JSON.stringify(def_player_cfg_vars));
    if (st_time != "") {
        play_cfg_vars['start'] = Number(st_time).toFixed(0)
    }
    if (end_time != "") {
        play_cfg_vars['end'] = Number(end_time).toFixed(0)
    }
    //play_cfg_vars['start'] = Number(st_time).toFixed(0)
    //play_cfg_vars['end'] = Number(end_time).toFixed(0)
    var play_cfg = {
        height: '360',
        width: '640',
        videoId: vid_id,
        playerVars: play_cfg_vars,
        events: {
            'onReady': function (e) {
                e.target.mute();
                e.target.playVideo();
                setTimeout(function () {
                    e.target.pauseVideo();
                }, 2000);
                //e.target.setPlaybackRate()
            },
            'onStateChange': function (e) {
                console.log('yolo')
            }
        }
    }
    return play_cfg
}

function onYouTubeIframeAPIReady() {
    for (i = 0; i < vlist.length; i++) {
        let curr_vl = vlist[i];
        let curr_play_cfg = create_player_cfg(curr_vl.name, curr_vl.start, curr_vl.end);
        console.log(curr_play_cfg);
        console.log('wtf');
        // let vid_uid = vlist[i].uid
        let main_vid_id = vlist[i].uid + '_main_vid'
        var main_player = new YT.Player(main_vid_id, curr_play_cfg);
        var new_player = new YT.Player(vlist[i].uid, curr_play_cfg);
        vlst_dct[curr_vl.uid].main_player_var = main_player;
        vlst_dct[curr_vl.uid].main_player_var['first_time_load'] = false
        vlst_dct[curr_vl.uid].orig_player_var = new_player;
        vlst_dct[curr_vl.uid].player_var = new_player;
        vlst_dct[curr_vl.uid].player_var['first_time_load'] = false
        vlst_dct[curr_vl.uid].player_cfg = curr_play_cfg;
    }
}


// function onVideoIFrame() {
//     for (i = 0; i < vlist.length; i++) {
//         let curr_vl = vlist[i];
//         let curr_play_cfg = create_player_cfg(curr_vl.name, curr_vl.start, curr_vl.end);
//         console.log(curr_play_cfg);
//         console.log('wtf');
//         var new_player = new YT.Player(vlist[i].uid, curr_play_cfg);
//         // vlst_dct[vid_id].orig_player_var = new_player;
//         vlst_dct[curr_vl.uid].player_var = new_player;
//         vlst_dct[curr_vl.uid].player_cfg = curr_play_cfg;
//     }
// }


// function onPlayerStateChange(state) {
//     console.log('yolo')
//     // if (state.data === YT.PlayerState.ENDED) {
//     //     let st_time = vlst_dct[state.target.f.id].start
//     //     state.target.seekTo(st_time)
//     //     state.target.pauseVideo()
//     // }
//     if (state.data === YT.PlayerState.PLAYING && !pdone) {
//         curr_set_time_outs.push(
//             setTimeout(function () {
//                 state.target.pauseVideo();
//             }, (delta + 0.2) * 1000)
//         )
//         pdone = true
//     }
// }

function onButtonPlayerStateChange(btn_id, to_play = true) {
    console.log('btn_yolo')
    let player_info = vlst_dct[btn_id.id.split('_btn')[0]]
    // let player_tmp = player_info.player_var
    // let pl_state = player_tmp.getPlayerState()
    let player_tmp = player_info.main_player_var
    let st_time = player_info.start
    player_tmp.seekTo(st_time)
    if (to_play) {
        player_tmp.playVideo()
    }
}

console.log('qefear')

// Disable if one is selected instead of the other!
function toToggle(input_tag) {
    console.log('toggling')
    let tag_split = input_tag.id.split('_isVideoUsed');
    let vid = tag_split[0];
    let loop_idx = Number(input_tag.getAttribute('data-loop-idx'));
    let vsob_id = vid + "_vsob";
    let ftxt_id = vid + "_ftxt";
    let srl_id = vid + "_SRL";
    let curr_val = document.getElementById(input_tag.id).checked
    //    document.getElementById(vsob_id).required = curr_val
    document.getElementById(ftxt_id).required = curr_val
    $(`#${srl_id} :input`).attr("required", curr_val);

    if (loop_idx < vlist.length && !curr_val) {
        let next_vid_id = vlist[loop_idx + 1].uid
        document.getElementById(next_vid_id).scrollIntoView(alignToTop = true)
    }
}
