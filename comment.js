let md = new showdown.Converter();
md.setFlavor("github")
md.setOption('tasklists', 'true');
md.setOption('tables', 'true');
md.setOption('parseImgDimensions', 'true');
md.setOption('ghCodeBlocks', 'true');
md.setOption('requireSpaceBeforeHeadingText', 'true');

function md2html(markdown) {
    let clean = HtmlSanitizer.SanitizeHtml(md.makeHtml(markdown));
    let p = new DOMParser();
    let cmt = p.parseFromString(clean, "text/html")
    cmt.querySelectorAll("a").forEach((el) => {
        el.rel = "nofollow";
    })
    return new XMLSerializer().serializeToString(cmt)
}

const comment_root = {
    data() {
        return {
            comments: []
        }
    },
    mounted() {
        setTimeout(()=>{
            this.comments.push(
                {
                    user: "lemon-mint",
                    time: new Date().toISOString(),
                    body: md2html("# overflow: hidden;\n[example link](https://example.com)\n")
                }
            )
        },1000);
    },
    delimiters: ['[[%', '%]]']
};
Vue.createApp(comment_root).mount('#vue-comment-root');