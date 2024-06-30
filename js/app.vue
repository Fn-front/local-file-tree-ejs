<script>
let setData;

axios.get('directoryData.json').then(response => {
  setData = response.data;
  result(setData);
})

let getList = [];
let latestData;

function result(obj) {
  for (let i = 0; i < Object.keys(obj).length; i++) {
    let key = Object.keys(obj)[i];
    let value = obj[key];

    /* 戻り値がArrayか判断 */
    if (Object.getPrototypeOf(value).constructor.name == 'Array') {
      /* map関数で配列を一次元に変換 */
      const array = value.map(obj => obj);
      /* keyがpathの.htmlを含む文字列を変数に格納 */
      if (array[0] === 'path' && array[1].match(/.(html)$/g)) {
        setArray(array[1]);
      }
      else {
        if (array[0] === 'children' && array[1].length == 0) {
          const createArray = latestData[1] + '/index.html';
          setArray(createArray);
        }
        if (array[0] == 'path') {
          latestData = array;
        }
      }
      result(array);
    }
    /* 戻り値がObjectか判断 */
    else if (Object.getPrototypeOf(value).constructor.name == 'Object') {
      /* Arrayに変換 */
      const object = Object.entries(value);
      result(object);
    }
  }
};

const setArray = (data) => {
  let str = data;
  /* dist/を/に文字列変換 */
  let str_rep = str.replace(/.+?[/]/, '/');
  /* 文字列の末尾がindex.html又はstaicを含む場合末尾を削除 */
  if (str_rep.match(/(^(?=.*index.html).*$)|(^(?=.*static).*$)/)) {
    str_rep = str_rep.replace(/[^//]+$/, '')
  }
  getList.push(str_rep);
}

export default {
  data() {
    return {
      data: getList,
    }
  },
  mounted() {
  },
  methods: {
    confirmChk(element) {
      /* チェックを入れる要素にクラスを付与 */
      const target = element.target.nextElementSibling;
      if (!target.classList.contains('visible')) {
        target.classList.add('visible');
      }
    },
    confirmRemove(element) {
      /* チェックを押下したらクラスを削除 */
      const target = element.target;
      if (!!target.classList.contains('visible')) {
        target.classList.remove('visible');
      }
    },
    createReleaseLink(data) {
      const releasechk = this.notReleasedChk(data);
      /* /pc/c_ が含まれる場合はパラメータリンクにする */
      const membershipRegex = /^(?=.*\/pc\/c_).*/;
      const lotte = 'https://***/';
      const lotteFan = 'https://***/';
      let result;
      if (!!releasechk) {
        if (data.match(membershipRegex)) {
          /* 文字列の末尾の/から後ろを抽出 */
          const filename = data.match(/[^//]+$/);
          /* .htmlから後ろを抽出 */
          const parameter = filename[0].match(/(.*)(?=.html)/);
          result = lotteFan + '?page=' + parameter[0];
        }
        else {
          result = lotte + data;
        }
      }
      else {
        result = null;
      }

      return result;
    },
    notReleasedChk(data) {
      const target = data;
      const regex = /(^(?=.*\/bbs\/).*$)|(^(?=.*ssi).*$)/;
      if (target.match(regex)) {
        return false;
      }
      return true;
    }
  }
}
</script>

<template>
  <div>
    <table class="link_list-title">
      <tr>
        <th class="link_list-title-head">テストサイト</th>
        <th class="link_list-title-text">本番</th>
        <th class="link_list-title-confirm">確認</th>
      </tr>
    </table>
    <ul class="link_list">
      <li v-for="item in data" :key="item.id" class="link_list-item">
        <a
          :href="'http://'+item"
          target="_blank">
          {{ item }}
        </a>
        <a
          :href="createReleaseLink(item)"
          @click="confirmChk($event)"
          :class="notReleasedChk(item) == false ? 'disabled' : false"
          class="link_list-item-production"
          target="_blank"
        >
          <span class="link_list-item-production-effects"></span>
        </a>
        <div
          @click="confirmRemove($event)"
          class="link_list-item-confirm"></div>
      </li>
    </ul>
  </div>
</template>

