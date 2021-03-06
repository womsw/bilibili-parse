// ==UserScript==
// @name         bilibili视频下载
// @namespace    https://github.com/injahow
// @version      0.1.2
// @description  目前仅支持flv视频，使用a标签绕过防盗链，但ip受限，api接口见https://github.com/injahow/bilibili-parse
// @author       injahow
// @match        *://www.bilibili.com/video/*
// @license      MIT
// @grant        none
// @require      https://static.hdslb.com/js/jquery.min.js
// ==/UserScript==

(function () {
  'use strict';

  let aid = '', p = '', q = '';
  let aid_temp = '', p_temp = '', q_temp = '';

  const topBox =
    "<div style='position:fixed;z-index:999999;cursor:pointer;top:60px;left:0px;'>" +
    "<div id='bilibili_parse' style='font-size:14px;padding:10px 2px;color:#000000;background-color:#00a1d6;'>请求地址</div>" +
    "<div style='font-size:14px;padding:10px 2px;'>" +
    "<a id='video_url' style='display:none' target='_blank' referrerpolicy='origin' href='#'>下载视频</a>" +
    "</div>" +
    "</div>";
  $('body').append(topBox)
  const video_url = $('#video_url')

  $('body').on('click', '#bilibili_parse', function () {

    //获取视频编号参数aid
    const link_av = $('link[rel="canonical"]')[0].href
    const patt = /bilibili.com\/video\/av\d+/g
    if (patt.test(link_av)) {
      aid = link_av.replace(/[^0-9]/ig, '')
      console.log('获取aid:', aid)
    } else {
      console.log('aid获取出错！')
      return
    }

    // 获取视频分辨率参数q
    q = $('li.bui-select-item.bui-select-item-active').attr('data-value')
    q = q || '64'

    // 获取视频分页参数p
    let query_arr = window.location.search.substring(1).split('&');
    for (let i = 0; i < query_arr.length; i++) {
      let pair = query_arr[i].split('=')
      if (pair[0] == 'p') {
        p = pair[1]
      }
    }
    p = p || '1'

    if (aid === aid_temp && p === p_temp && q === q_temp) {
      console.log('重复请求')
      video_url.show()
      return
    }
    aid_temp = aid
    p_temp = p
    q_temp = q

    console.log('开始解析')
    $.ajax({
      url: `https://api.injahow.cn/bparse/?av=${aid}&p=${p}&q=${q}&otype=url`,
      dataType: 'text',
      success: function (result) {
        console.log('url获取成功')
        video_url.attr('href', result)
        video_url.show()
      }
    })
  })

  // 监听p
  $('body').on('click', '.list-box', function () {
    video_url.hide()
  })

  // 监听q
  $('body').on('click', 'li.bui-select-item', function () {
    video_url.hide()
  })

  // 监听aid 右侧推荐
  $('body').on('click', '.rec-list', function () {
    video_url.hide()
  })

  // 监听aid 视频内部推荐
  $('body').on('click', '.bilibili-player-ending-panel-box-videos', function () {
    video_url.hide()
  })

})();
