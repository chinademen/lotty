!function (a, b, c, d) {
    var e, f = {name: "", jsNamespace: ""}, g = a.Games, h = {
        init: function (a) {
            var b = this;
            b.events()
        }, events: function () {
        }, algorithmInjection: function () {
            var a = g.getCurrentGame().getCurrentMethodId(), b = g.getCurrentMethod(), d = g.getCurrentGameOrder(), e = d.getSelectedBalls(), f = g.getCurrentGame();
            f.getRenxuanNum();
            switch (a) {
                case"380":
                case"106":
                case"110":
                case"109":
                case"122":
                case"98":
                    e.ballsNum > 0 ? f.doneAlgorithmInjection(e.ballsNum) : d.fireEvent("resetSelectBalls");
                    break;
                case"381":
                case"107":
                case"99":
                    var h = b.combine(b.getPureDataFromBall(e.balls[0]), 2);
                    h.length > 0 ? f.doneAlgorithmInjection(h.length) : d.fireEvent("resetSelectBalls");
                    break;
                case"382":
                case"108":
                case"100":
                    var h = b.combine(b.getPureDataFromBall(e.balls[0]), 3);
                    h.length > 0 ? f.doneAlgorithmInjection(h.length) : d.fireEvent("resetSelectBalls");
                    break;
                case"383":
                case"101":
                    var h = b.combine(b.getPureDataFromBall(e.balls[0]), 4);
                    h.length > 0 ? f.doneAlgorithmInjection(h.length) : d.fireEvent("resetSelectBalls");
                    break;
                case"384":
                case"102":
                    var h = b.combine(b.getPureDataFromBall(e.balls[0]), 5);
                    h.length > 0 ? f.doneAlgorithmInjection(h.length) : d.fireEvent("resetSelectBalls");
                    break;
                case"103":
                    var h = b.combine(b.getPureDataFromBall(e.balls[0]), 6);
                    h.length > 0 ? f.doneAlgorithmInjection(h.length) : d.fireEvent("resetSelectBalls");
                    break;
                case"104":
                    var h = b.combine(b.getPureDataFromBall(e.balls[0]), 7);
                    h.length > 0 ? f.doneAlgorithmInjection(h.length) : d.fireEvent("resetSelectBalls");
                    break;
                case"105":
                    var h = b.combine(b.getPureDataFromBall(e.balls[0]), 8);
                    h.length > 0 ? f.doneAlgorithmInjection(h.length) : d.fireEvent("resetSelectBalls");
                    break;
                case"111":
                case"112":
                    var h = b.filterErrorData(b.combination2(b.getPureDataFromBall(e.balls)));
                    h.length > 0 ? f.doneAlgorithmInjection(h.length) : d.fireEvent("resetSelectBalls");
                    break;
                case"119":
                    if (0 == c(".ball-section .ball-content:eq(0) .ball-number-current").size())return;
                    var h = b.combine(b.getPureDataFromBall(e.balls[1]), 8 - c(".ball-section .ball-content:eq(0) .ball-number-current").size());
                    h.length > 0 ? f.doneAlgorithmInjection(h.length) : d.fireEvent("resetSelectBalls");
                    break;
                case"118":
                    if (0 == c(".ball-section .ball-content:eq(0) .ball-number-current").size())return;
                    var h = b.combine(b.getPureDataFromBall(e.balls[1]), 7 - c(".ball-section .ball-content:eq(0) .ball-number-current").size());
                    h.length > 0 ? f.doneAlgorithmInjection(h.length) : d.fireEvent("resetSelectBalls");
                    break;
                case"117":
                    if (0 == c(".ball-section .ball-content:eq(0) .ball-number-current").size())return;
                    var h = b.combine(b.getPureDataFromBall(e.balls[1]), 6 - c(".ball-section .ball-content:eq(0) .ball-number-current").size());
                    h.length > 0 ? f.doneAlgorithmInjection(h.length) : d.fireEvent("resetSelectBalls");
                    break;
                case"116":
                    if (0 == c(".ball-section .ball-content:eq(0) .ball-number-current").size())return;
                    var h = b.combine(b.getPureDataFromBall(e.balls[1]), 5 - c(".ball-section .ball-content:eq(0) .ball-number-current").size());
                    h.length > 0 ? f.doneAlgorithmInjection(h.length) : d.fireEvent("resetSelectBalls");
                    break;
                case"115":
                    if (0 == c(".ball-section .ball-content:eq(0) .ball-number-current").size())return;
                    var h = b.combine(b.getPureDataFromBall(e.balls[1]), 4 - c(".ball-section .ball-content:eq(0) .ball-number-current").size());
                    h.length > 0 ? f.doneAlgorithmInjection(h.length) : d.fireEvent("resetSelectBalls");
                    break;
                case"114":
                case"121":
                    if (0 == c(".ball-section .ball-content:eq(0) .ball-number-current").size()){
                        d.fireEvent("resetSelectBalls")
                        return;
                    }
                    var h = b.combine(b.getPureDataFromBall(e.balls[1]), 3 - c(".ball-section .ball-content:eq(0) .ball-number-current").size());
                    h.length > 0? f.doneAlgorithmInjection(h.length) : d.fireEvent("resetSelectBalls");
                    break;
                case"113":
                case"120":
                    if (0 == c(".ball-section .ball-content:eq(0) .ball-number-current").size())return;
                    var h = b.combine(b.getPureDataFromBall(e.balls[1]), 2 - c(".ball-section .ball-content:eq(0) .ball-number-current").size());
                    h.length > 0 ? f.doneAlgorithmInjection(h.length) : d.fireEvent("resetSelectBalls")
            }
        }
    }, i = a.ExtendClass(h, d);
    i.defConfig = f, i.getInstance = function (a) {
        return e || (e = new i(a))
    }, a.Games.L115[b] = i
}(gagame, "Config", jQuery, gagame.Event);