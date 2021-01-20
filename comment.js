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
    let comment_body = p.parseFromString(clean, "text/html")
    comment_body.querySelectorAll("a").forEach((el) => {
        if (!(["http:", "https:", "ftp:", "mailto:"].includes(el.protocol))) {
            console.log(el.protocol, "blocked");
            el.href = "about:blank#blocked";
        }
        el.rel = "nofollow";
    })
    return new XMLSerializer().serializeToString(comment_body)
}

const comment_root = {
    data() {
        return {
            comments: []
        }
    },
    mounted() {
        setTimeout(() => {
            this.comments.push(
                {
                    user: "lemon-mint",
                    time: new Date().toISOString(),
                    body: md2html("# overflow: hidden;\n[example link](https://example.com)\n")
                }
            )
        }, 1000);
    },
    delimiters: ['[[%', '%]]']
};
Vue.createApp(comment_root).mount('#vue-comment-root');
