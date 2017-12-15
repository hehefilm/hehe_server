var vue = new Vue({
    el: '#vue-page',
    data: {
        friend_li: [
            {
                "rlogo": "/path/to/logo", //LOGO
                "rlink": "http://something.com" //跳转链接
            }
        ],

    },
    created: function () {
        axios.get('http://staging.hehefilm.com/resources/friend')
            .then(resp => {
                this.friend_li = resp.data.friend_li;
                this.friend_li=this.friend_li.concat(resp.data.friend_li).concat(resp.data.friend_li).concat(resp.data.friend_li);
                console.log(resp.data);
            }).catch(err => {
            console.log('请求失败：' + err.status + ',' + err.statusText);
        })
        ;
    },
    methods: {}
    ,

});
