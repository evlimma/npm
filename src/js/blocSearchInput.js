$(function () {
    $(document).on("keypress", ".PesquisarDbJs", function (e) {
        var blocoAcaoBt = $(this).parent().find('.LupaPesquisaLab');
        var tecla = (e.keyCode ? e.keyCode : e.which);

        if (tecla === 13) { /* Entra aqui quando pressionado Enter | 13=Teclado principal, 38=Teclado Numérico */
            e.preventDefault();
            blocoAcaoBt.trigger('click');
        }
    });

    $(document).on("focus", ".clickTypeSelect", function (e) {
        e.stopPropagation();
        e.preventDefault();

        loadSelect($(this), true);
    });

    $(document).on("click", ".setaSelect", function (e) {
        e.preventDefault();

        var blocoAcaoInput = $(this).parents(".inDescriptionCustom").find('.PesquisarDbJs');
        blocoAcaoInput.addClass("clickTypeSelect");

        $(this).siblings('.clickTypeSelect').focus();
    });

    $(document).on("click", ".LupaPesquisaLab", function (e) {
        e.stopPropagation();

        loadSelect($(this));
    });

    $(document).on("click", ".mega_popup", function (e) {
        e.stopPropagation();

        $(this).remove();
    });

    $(document).on("click", ".fecha_mega_popup", function (e) {
        e.stopPropagation();
        e.preventDefault();

        $(".mega_popup").remove();
    });

    $(document).on("click", ".mega_popup section", function (e) {
        e.stopPropagation();
    });

    $(document).on("click", "[href^='m-popup']", function (e) {
        e.preventDefault();

        var valorEscolhido = $(this).parents("tr").find("span a span").first().text();
        var splitHref = $(this).attr("href").replace("m-popup/", "").split("/");
        var blocSearch = splitHref[0];
        var destinyId = splitHref[1];

        var blocoAcao = $('#txt' + blocSearch);
        blocoAcao.val(valorEscolhido)
            .attr('valorBanco', valorEscolhido)
            .removeClass("inAvisoCorrecao")
            .removeAttr("bloqEnv");

        var blocoSeletor = $('#in' + blocSearch);
        blocoSeletor.val(destinyId);

        updateDetailedDescription = true;

        var avisosCorrecao = blocoAcao.parents(".caixa").find('span.avisosCorrecao');
        avisosCorrecao.remove();

        $(".mega_popup").remove();
    });

    $(document).on("click", ".tblPesquisaLab", function (e) {
        e.preventDefault();

        var father = $(this).parent();
        var url_action = father.find('.PesquisarDbJs').attr("url") + "Mpopup";
        var destiny_id = father.find("input[type='text']").attr("id");
        var labelContent = father.find("label").text().replace(/[*:]/g, '');

        $().ajaxSingle(url_action, { func_name: "tblPesquisaLab", destiny_id: destiny_id, labelContent: labelContent });
    });

    window.tblPesquisaLab = function (variables) {
        height = $(window).height() - 135;

        variables.labelContent = var_empty(variables.labelContent) ? "Proposta" : variables.labelContent;

        var html = "<div class='mega_popup' height='" + height + "'>"
            + "    <section>"
            + "        <div class='menu_left'>"
            + "            <div class='menu_locked'>"
            + "                <a class='nav_link fecha_mega_popup' href='" + root + "/comercial/propostas'>"
            + "                    <span><img src='" + root + "/src/images/iconefechar.svg'></span>"
            + "                    <span>Fechar</span>"
            + "                </a>"
            + "                <a class='nav_link SemPermissao' href='#'>"
            + "                    <span><img src='" + root + "/src/images/iconeexportar.svg'></span>"
            + "                    <span>Exportar</span>"
            + "                </a>"
            + "            </div>"
            + "        </div>"
            + "        <div class='content_rigth'>"
            + "                <div class='title_main title_mega'>"
            + "                   <div class='title_description' style='background-image: url('/src/images/iconefechar.svg')'>"
            + "                       <span><img src='" + root + "/src/images/banco.svg'></span>"
            + "                       <h1 style='border-bottom-color: #2369AC;'>" + variables.labelContent + "</h1>"
            + "                   </div>"
            + "                   <div class='bt_right'>"
            + "                       <a href='#menu_responsive' title='Menu'></a>"
            + "                   </div>"
            + "               </div>"
            + "            " + variables.success + ""
            + "        </div>"
            + "     </section>"
            + "</div>";

        $(html).prependTo(".content_body");

        $(".mega_popup .containerTblPadrao").css("height", (height) + "px");
    };

    $(document).on("click", "li[seletor]", function (e) {
        var blocoAcaoInput = $(this).parents(".inDescriptionCustom").find('.PesquisarDbJs');
        blocoAcaoInput.prop("readonly", true);
        blocoAcaoInput.addClass("clickTypeSelect");
    });

    function loadSelect(ele, addCustom = false) {
        var blocoAcaoInput = ele.parent().find('.PesquisarDbJs');
        var blocoAcaoMenu = ele.parent().find('ul.MenuSuspensoDb');

        $.ajax({
            url: blocoAcaoInput.attr("url"),
            type: "POST",
            data: {
                intxt: blocoAcaoInput.val()
            },
            dataType: "json",
            beforeSend: function () {
                ele.addClass("ProcurandoLoad");
                ele.removeClass("LupaPesquisaLab");
            },
            success: function (response) {
                if (response.success) {
                    blocoAcaoMenu.empty();

                    var liContent = "";
                    $.each(response.success, function (key, value) {
                        liContent += "<li seletor='" + key + "' onclick='funMenuSuspensoDbLi(this);'>" + value + "</li>";
                    });

                    if (addCustom) {
                        liContent += "<li class='addCustom'>(+) Adic. personalizado</li>";
                    }

                    blocoAcaoMenu
                        .prepend(liContent)
                        .show();
                }
            },
            error: function (e) {
                console.log(e);
                $().funAvisoLight("Erro|Não foi possível processar as informações.");
                blocoAcaoMenu.hide();
            },
            complete: function () {
                ele.removeClass("ProcurandoLoad");
                ele.addClass("LupaPesquisaLab");
            }
        });

    }

    // FECHAR O MEGA POP UP AO PRESSIONAR ESC
    $(document).on("keydown", function (e) {
        if (e.keyCode === 27) { // Verifica se a tecla pressionada é ESC (código 27)
            $(".mega_popup").remove(); // Remove o mega_popup
        }
    });
});
