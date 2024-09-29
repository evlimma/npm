$(function () 
{
    /**
     * 
     * @param {type} url
     * @param {type} data
     * @param {type} form
     * @returns {undefined}
     */
    $.fn.ajaxSingle = function (post, param = null, form = null, percentual = false, remove_process = true) {
        var ajax = {
            url: post,
            type: "POST",
            data: param,
            dataType: "json",
            beforeSend: $().processoAjaxBg(true, percentual),
            success: function (response) {
                if (response.message) {
                    $().funAvisoLight(response.message);
                }

                if (response.newtab) {
                    window.open(response.newtab, '_blank');
                }

                if (response.redirect) {
                    window.location.href = response.redirect;
                }

                if (response.method) {
                    window[response.method.function](response.method.variables);
                }
            },
            error: function (e) {
                console.error(e);
                $().funAvisoLight("Erro|Não foi possível processar as informações.");
                $("#bgLightBox").remove();
            },
            complete: function () {
                if (remove_process) {
                    $().processoAjaxBg(false);
                }
            }
        };

        if (form) {
            form.ajaxSubmit(ajax);
            return;
        }

        $.ajax(ajax);
    };
    
    /**
     * 
     */
    $(document).on("click", "[href='ajax-button']", function (e) {
        e.preventDefault();
        
        var data = $(this).data();
        
        var param = !var_empty(data.param) ? data.param : null;
        var form = !var_empty(data.form) ? data.form : null;
        var percentual = !var_empty(data.percentual) ? data.percentual : false;
        var remove_process = !var_empty(data.remove_process) ? data.remove_process : true;
        
        $().ajaxSingle(data.post, param, form, percentual, remove_process);
    });
    
    /**
     * 
     * @param {type} obj
     * @returns {String}
     */
    String.prototype.replaceAll = function(obj) {
        let finalString = '';
        let word = this;
        for (let each of word){
            for (const o in obj){
                const value = obj[o];
                if (each === o){
                    each = value;
                }
            }
            finalString += each;
        }

        return finalString;
    };
    
    /**
     * 
     * @param {type} number
     * @param {type} decimals
     * @param {type} dec_point
     * @param {type} thousands_sep
     * @returns {x1|x|dec_point|x2|String|window.numberFormat.dec_point}
     */
    window.numberFormat = function(number, decimals, dec_point, thousands_sep) {
        var nstr = number.toString();
        nstr += '';
        x = nstr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? dec_point + x[1] : '';
        var rgx = /(\d+)(\d{3})/;

        while (rgx.test(x1))
            x1 = x1.replace(rgx, '$1' + thousands_sep + '$2');

        return x1 + x2;
    };
    
    /**
     * 
     * @param {type} value
     * @returns {Boolean}
     */
    window.var_empty = function(value) {
        if (typeof(value) === "undefined" || value === undefined || value === null || value === 0 || value === "") {
            return true;
        }

        return false;
    };
    
    /* AvisoLight
     ================================================== */

    $.fn.funAvisoLight = function (msg) {
        $().processoAjaxBg(false);
        avisoLight(msg);
    };

    function avisoLight(msg) {
        var msg = msg.split("|");
        var tipoClass = ((msg[0] === "Aviso") ? "avisoVerde" : ((msg[0] === "Info") ? "avisoLaranja" : "avisoVermelho"));
        
        $("body").prepend("<div class='avisoRapido " + tipoClass + "'>" + msg[1] + "</div>");

        $(".avisoRapido").animate({
            top: "+=50px", opacity: "0.9"
        }, "fast", function () {
            setTimeout(function () {
                $(".avisoRapido").animate({
                    top: "-=50px", opacity: "0"
                }, "fast", function () {
                    $(".avisoRapido").remove();
                });
            }, 1000 * 4);
        });
    }

    $.fn.processoAjax = function (msg, top = false) {
        if (msg) {
            $("body").prepend("<div class='processandoAjax' " + ((top) ? "style='top: 30px; bottom: auto;'" : "") + ">" + msg + "</div>");
            $(".processandoAjax").animate({opacity: "0.9"}, "fast");
        } else {
            $(".processandoAjax").animate({
                opacity: "0"
            }, "fast", function () {
                $(".processandoAjax").remove();
            });
        }
    };

    $.fn.processoAjaxBg = function (display = true, percentual = true) 
    {
        if (display) {
            if ($(".processandoAjaxFixed").length === 0) { $("body").prepend("<div class='processandoAjaxFixed'>Aguarde, carregando...</div>"); };
            if ($(".preloadBackgroud").length === 0) { $("body").prepend("<div class='preloadBackgroud'></div>"); };
            
            if (percentual) {
                if ($(".processandoPercentual").length === 0) { $("body").prepend("<div class='processandoPercentual'>0%</div>"); };
            }
        } else {
            $(".processandoAjaxFixed").remove();
            $(".preloadBackgroud").remove();
            $(".processandoPercentual").remove();
        }
    };
    
    /**
     * 
     * @param {type} processAtual
     * @param {type} processTotal
     * @returns {undefined}
     */
    $.fn.processPercent = function(processAtual, processTotal) {
        $(".processandoPercentual").html(Math.round((100 * processAtual) / processTotal) + "%");
    };
    
    /* Abre AvisoLight
     ================================================== */

});