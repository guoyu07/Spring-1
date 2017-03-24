````js
<script src="./static/plugins/pinyin/pinyin_dict_notone.js"></script>
<script src="./static/plugins/pinyin/pinyinUtil.js"></script>
const pinyinUtil = window.pinyinUtil
const key = pinyinUtil.getPinyin(name).replace(/\s/ig, '_') // 汉字转化成拼音
````