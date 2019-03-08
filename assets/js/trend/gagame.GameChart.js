! function(t, e, n) {
    var a = {},
        r = {
            init: function() {
                var t = this;
                t.lineWidth = 2, t.lineColor = "red"
            },
            getParentContainer: function() {
                var t = this;
                return t.parentContainer || document.body
            },
            setOption: function(t) {
                var e = this;
                e.parentContainer = t.parentContainer || e.parentContainer, e.lineWidth = t.lineWidth || e.lineWidth, e.lineColor = t.lineColor || e.lineColor
            },
            line: function(t, e, n, a) {
                var r = this,
                    o = null,
                    d = 0,
                    l = 0,
                    i = 0,
                    s = 0,
                    c = [],
                    u = t,
                    m = e,
                    h = n,
                    p = a;
                setTimeout(function() {
                    i = Math.max.apply(Math, [p, m]), s = Math.min.apply(Math, [p, m]), d = i == s ? r.lineWidth : i - s, l = h - u, o = document.createElement("canvas"), o.style.position = "absolute", o.style.left = s + "px", o.style.top = u + "px", m == p && (o.style.left = s - d / 2 + "px"), o.setAttribute("width", d), o.setAttribute("height", l), r.getParentContainer().appendChild(o), $.support.leadingWhitespace || window.G_vmlCanvasManager_.initElement(o), ctx = o.getContext("2d"), ctx.beginPath(), c = m > p ? r.mathNum(d, 0, 0, l, 7.5) : r.mathNum(0, 0, d, l, 7.5), ctx.moveTo(c[0], c[1]), ctx.lineTo(c[2], c[3]), ctx.lineWidth = r.lineWidth, ctx.strokeStyle = r.lineColor, ctx.stroke(), ctx.closePath()
                }, 25)
            },
            mathNum: function(t, e, n, a, r) {
                var o = t - n,
                    d = e - a,
                    l = Math.round(Math.sqrt(Math.pow(o, 2) + Math.pow(d, 2))),
                    i = Math.round(o * r / l),
                    s = Math.round(d * r / l);
                return [n + i, a + s, t - i, e - s]
            }
        },
        o = t.Class(r, n);
    o.defConfig = a, t[e] = new o
}(gagame, "DrawLine", gagame.Event),
function(t, e, n) {
    var a = {
            renderLength: 20,
            separateNum: 5,
            isDelayLoading: !1,
            renderIntervalTime: 0,
            chartWarpDom: "#J-chart-content",
            dateType: "periods",
            dateNum: 30,
            currentGameType: "cqssc",
            currentGameMethod: "Wuxing"
        },
        r = {},
        o = null,
        d = null,
        l = "",
        i = 1,
        s = {
            init: function() {
                var e = this;
                e.chartCache = [], e.statisticsCache = [], e.draw = t.DrawLine, e.addEvent("afterRenderChartHtml", function() {
                    var t = e.getStatisticsData();
                    "function" == typeof e[e.getCurrentGameType() + e.getCurrentGameMethod() + "RenderStatistics"] && e[e.getCurrentGameType() + e.getCurrentGameMethod() + "RenderStatistics"](t)
                })
            },
            getDataUrl: function() {
                return "?"
            },
            getSelectContent: function() {
                return $("#J-select-content")
            },
            getContainer: function() {
                return document.getElementById("J-chart-content")
            },
            getBallContainer: function() {
                return document.getElementById("J-ball-content")
            },
            getRenderLength: function() {
                var t = this;
                return t.defConfig.renderLength
            },
            setRenderLength: function(t) {
                var e = this;
                e.defConfig.renderLength = t
            },
            getSeparateNum: function() {
                var t = this;
                return t.defConfig.separateNum
            },
            setSeparateNum: function(t) {
                var e = this;
                e.defConfig.separateNum = t
            },
            getChartData: function() {
                var t = this;
                return t.chartCache
            },
            setChartData: function(t) {
                var e = this;
                e.chartCache = t
            },
            getStatisticsData: function() {
                return this.statisticsCache
            },
            setStatisticsData: function(t) {
                this.statisticsCache = t
            },
            setCurrentGameType: function(t) {
                var e = this;
                e.defConfig[currentGameType] = t
            },
            getCurrentGameType: function() {
                var t = this,
                    e = t.defConfig.currentGameType;
                return e ? e : ""
            },
            setCurrentGameMethod: function(t) {
                var e = this;
                e.defConfig[currentGameMethod] = t
            },
            getCurrentGameMethod: function() {
                var t = this,
                    e = t.defConfig.currentGameMethod;
                return e ? e : ""
            },
            setDateType: function(t) {
                var e = this;
                e.defConfig.dateType = t
            },
            getDateType: function() {
                var t = this;
                return t.defConfig.dateType
            },
            setDateNum: function(t) {
                var e = this;
                e.defConfig.dateNum = t
            },
            getDateNum: function() {
                var t = this;
                return t.defConfig.dateNum
            },
            setQueueMark: function(t) {
                l = t
            },
            getQueueMark: function() {
                return l
            },
            getCurrentHtml: function() {
                var t = this,
                    e = t.getCurrentGameType();
                return e ? e : ""
            },
            getServerChartData: function(t) {
                var e = this,
                    n = (e.getCurrentGameType(), e.getCurrentGameMethod(), e.getDateType(), e.getDateNum(), e.getDataUrl());
                o && o.abort(), o = $.ajax({
                    type: "GET",
                    url: n,
                    cache: !1,
                    dataType: "json",
                    success: function(n) {
                        var n = n.data;
                        1 == Number(n.isSuccess) ? (n = e.reBuildData(n), e.setChartData(n.data), e.setStatisticsData(n.statistics), e.fireEvent("afterGetServerData", n), t && t()) : alert(n.msg)
                    },
                    error: function() {
                        o = null
                    },
                    complete: function() {
                        o = null
                    }
                })
            },
            reBuildData: function(t) {
                return t
            },
            renderChartHtml: function(t, e, n, a) {
                var r = this,
                    t = t || 0,
                    o = r.getChartData(),
                    n = n || r.getQueueMark(),
                    l = r.getRenderLength() + 1,
                    s = {},
                    a = a || [],
                    c = r.defConfig.renderIntervalTime,
                    e = e || document.createDocumentFragment();
                if (n == r.getQueueMark()) {
                    if (t == o.length) return r.appendHtmlDom(e, a), i = 1, void r.fireEvent("afterRenderChartHtml", o);
                    s = o[t], d = setTimeout(function() {
                        if (l > i)
                            if ("function" == typeof r[r.getCurrentGameType() + r.getCurrentGameMethod() + "Render"]) {
                                if (e.appendChild(r[r.getCurrentGameType() + r.getCurrentGameMethod() + "Render"](s, i)), a.push(s), t++, i++, i == l) return r.appendHtmlDom(e, a), i = 1, void setTimeout(function() {
                                    r.renderChartHtml(t)
                                }, 1e3 * c);
                                r.renderChartHtml(t, e, n, a)
                            } else try {
                                console.log("缺少当前玩法:[" + r.getCurrentGameType() + r.getCurrentGameMethod() + "]渲染方法")
                            } catch (o) {}
                    }, 25)
                }
            },
            cqsscWuxingRenderStatistics: function(t) {
                var e = this,
                    n = 0,
                    a = 0,
                    r = '<td class="ball-none border-right"></td><td class="ball-none"></td>',
                    o = [],
                    d = [],
                    l = [],
                    i = [];
                for (o.push('<tr class="auxiliary-area"><td class="ball-none border-bottom"></td><td class="border-bottom border-top">出现总次数</td><td class="ball-none border-right border-bottom"></td><td class="ball-none  border-bottom"></td><td class="border-bottom"></td><td class="ball-none border-right border-bottom"></td><td class="ball-none border-bottom"></td>'), d.push('<tr class="auxiliary-area"><td class="ball-none border-bottom"></td><td class="border-bottom">平均遗漏值</td><td class="ball-none border-right border-bottom"></td><td class="ball-none border-bottom"></td><td class="border-bottom"></td><td class="ball-none border-right border-bottom"></td><td class="ball-none border-bottom"></td>'), l.push('<tr class="auxiliary-area"><td class="ball-none border-bottom"></td><td class="border-bottom">最大遗漏值</td><td class="ball-none border-right border-bottom"></td><td class="ball-none border-bottom"></td><td class="border-bottom"></td><td class="ball-none border-right border-bottom"></td><td class="ball-none border-bottom"></td>'), i.push('<tr class="auxiliary-area"><td class="ball-none border-bottom"></td><td class="border-bottom">最大连出值</td><td class="ball-none border-right border-bottom"></td><td class="ball-none border-bottom"></td><td class="border-bottom"></td><td class="ball-none border-right border-bottom"></td><td class="ball-none border-bottom"></td>'), n = 0, a = 60; a > n; n++) r = (n + 1) % 10 == 0 ? '<td class="ball-none border-right border-bottom"></td><td class="ball-none border-bottom"></td>' : "", r = n == a - 1 ? '<td class="ball-none border-bottom"></td>' : r, o.push('<td class="border-bottom"><i class="ball-noraml">' + t[0][n] + "</i></td>" + r), d.push('<td class="border-bottom"><i class="ball-noraml">' + t[1][n] + "</i></td>" + r), l.push('<td class="border-bottom"><i class="ball-noraml">' + t[2][n] + "</i></td>" + r), i.push('<td class="border-bottom"><i class="ball-noraml">' + t[3][n] + "</i></td>" + r);
                o.push("</tr>"), d.push("</tr>"), l.push("</tr>"), i.push("</tr>"), $(e.getBallContainer()).append($(o.join(""))).append($(d.join(""))).append($(l.join(""))).append($(i.join("")))
            },
            renderTrendArea: function(t, e) {
                var n = this;
                "function" == typeof n[n.getCurrentGameType() + n.getCurrentGameMethod() + "TrendCanvas"] && n[n.getCurrentGameType() + n.getCurrentGameMethod() + "TrendCanvas"](t, e)
            },
            appendHtmlDom: function(t, e) {
                var n = this,
                    a = document.getElementById("J-chart-content");
                e && (a.appendChild(t), setTimeout(function() {
                    n.renderTrendArea(a, e)
                }, 25))
            },
            destroyRenderQueue: function() {
                var t = this;
                t.setQueueMark((new Date).getTime()), t.setChartData([]), i = 1, d && (clearTimeout(d), d = null)
            },
            destroyTrendQueue: function() {
                $("canvas").remove(), r = []
            },
            show: function() {
                var t = this;
                t.reset(), t.getServerChartData(function() {
                    t.renderChartHtml()
                }), t.addEvent("afterGetServerData", function() {})
            },
            reset: function() {
                var t = this,
                    e = $(t.defConfig.chartWarpDom);
                e.html("<tr></tr>"), $(t.getBallContainer()).html(""), t.destroyRenderQueue(), t.destroyTrendQueue()
            },
            changePeriodsShow: function(t) {
                var e = this;
                e.reset(), "undefined" != typeof t.dateType && e.setDateType(t.dateType), "undefined" != typeof t.dateNum && e.setDateNum(t.dateNum), "undefined" != typeof t.gameType && e.setCurrentGameType(t.dateNum), e.fireEvent("afterChangePeriods", e.getDateType(), e.getDateNum(), e.getCurrentGameType()), e.show()
            },
            getUnitSize: function(t) {
                var t = $(t),
                    e = t.position().top,
                    n = t.position().left,
                    a = t[0].offsetWidth,
                    r = t[0].offsetHeight;
                return {
                    topNum: e,
                    leftNum: n,
                    widthNum: a,
                    heightNum: r
                }
            },
            singleLotteryBall: function(t, e) {
                var n, a, r, o = document.createDocumentFragment(),
                    d = e,
                    l = "",
                    i = "";
                n = document.createElement("td"), n.className = "ball-none" + d, o.appendChild(n);
                for (var s, c = 0; c < t.length; c++) s = t[c], l = "l-" + s[3], i = "c-" + s[0] + "-" + s[2], a = document.createElement("td"), a.className = d + " " + l, a.innerHTML = '<i data-info="' + s.join(",") + '" class="ball-noraml ' + i + '">' + (0 == s[0] ? s[1] : s[0]) + "</i>", o.appendChild(a);
                return r = document.createElement("td"), r.className = "ball-none border-right" + d, o.appendChild(r), o
            },
            layoutLotteryBall: function(t, e) {
                var n, a, r = document.createDocumentFragment(),
                    o = e,
                    d = "";
                n = document.createElement("td"), n.className = "ball-none" + o, r.appendChild(n);
                for (var l, i = 0; i < t.length; i++) l = t[i], d = "f-" + l[2], a = document.createElement("td"), a.className = o, a.innerHTML = '<i data-info="' + l.join(",") + '" class="ball-noraml ' + d + '">' + (0 == l[0] ? l[1] : l[0]) + "</i>", r.appendChild(a);
                return r
            },
            addSelectRow: function() {
                var t = this,
                    e = t.getSelectContent(),
                    n = e.find(".select-area"),
                    a = $('<tr class="select-area">' + $("#J-tr-select").html() + "</tr>");
                a.find(".ball-noraml").removeClass("ball-orange"), a.insertAfter(n.eq(n.size() - 1)).find(".ico-add").removeClass(".ico-add").addClass("ico-del").attr("data-action", "delSelectRow")
            },
            delSelectRow: function(t) {
                t.remove()
            },
            cqsscWuxingRender: function(t, e) {
                var n, a, r, o, d, l, i = this,
                    s = e % i.getSeparateNum() == 0 ? " border-bottom" : "",
                    c = (new Array, i.getRenderLength(), document.createElement("tr"));
                return n = document.createElement("td"), n.className = "ball-none " + s, c.appendChild(n), a = document.createElement("td"), a.className = "issue-numbers " + s, a.innerHTML = t[0], c.appendChild(a), r = document.createElement("td"), r.className = "ball-none border-right" + s, c.appendChild(r), o = document.createElement("td"), o.className = "ball-none " + s, c.appendChild(o), d = document.createElement("td"), d.className = s, d.innerHTML = '<span class="lottery-numbers">' + t[1] + "</span>", c.appendChild(d), l = document.createElement("td"), l.className = "ball-none border-right" + s, c.appendChild(l), c.appendChild(i.singleLotteryBall(t[2], s)), c.appendChild(i.singleLotteryBall(t[3], s)), c.appendChild(i.singleLotteryBall(t[4], s)), c.appendChild(i.singleLotteryBall(t[5], s)), c.appendChild(i.singleLotteryBall(t[6], s)), c.appendChild(i.layoutLotteryBall(t[7], s)), n = document.createElement("td"), n.className = "ball-none " + s, c.appendChild(n), c
            },
            getChartTrendPosition: function() {
                return r
            },
            cqsscWuxingTrendCanvas: function(t, e) {
                for (var n, a = 0, r = this, o = 0, d = 0, l = r.getChartTrendPosition(), i = 0; i < e.length; i++) {
                    n = e[i];
                    for (var s = 0; s < n.length; s++)
                        if (s > 1 && 7 > s)
                            for (var c = 0; c < n[s].length; c++) {
                                if (0 == c) var u = t.getElementsByTagName("i")[a].parentNode,
                                    m = r.getUnitSize(u),
                                    h = m.topNum,
                                    p = m.leftNum,
                                    f = m.widthNum,
                                    g = m.heightNum;
                                a++, 0 == n[s][c][0] && ("undefined" == typeof l[s] ? (o = p + (c + 1) * f - f / 2, d = h + g / 2, l[s] = {}, l[s].top = d, l[s].left = o) : (o = p + (c + 1) * f - f / 2, d = l[s].top + g, r.draw.setOption({
                                    parentContainer: $("#J-chart-area")[0]
                                }), r.draw.line(l[s].top, l[s].left, d, o), l[s].top = d, l[s].left = o))
                            }
                    a = 0
                }
            }
        },
        c = t.Class(s, n);
    c.defConfig = a, t[e] = c
}(gagame, "GameCharts", gagame.Event);