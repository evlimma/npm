$(function () {
    window.resizableCol = function (variables) {
        console.log(variables);
    };

    $.fn.resizableLoad = function () {
        if ($("th.resizable:not(:last-child)").length === 0) {
            return;
        }

        $("th.resizable:not(:last-child)").resizable({
            handles: "e",
            minWidth: 60,
            start: function (event, ui) { },
            resize: function (event, ui) { },
            stop: function (event, ui) {
                table = $(this).parents(".blocTblPadrao");
                
                var orderCol = [];
                table.find("th").each(function (i, e) {
                    orderCol.push($(this).attr("colid"));
                });
                
                $().ajaxSingle(root + "/resizableCol", {
                    func_name: "resizableCol", 
                    idordercol: table.attr("idordercol"), 
                    orderCol: orderCol,
                    colid: $(this).attr("colid"), 
                    width_end: ui.size.width
                });
            }
        });

        $(".scrollable-content").each(function () {
            var widthScrollableContent = $(this).width();
            var $table = $(this).find("table");
            var $cols = $table.find('thead th');
            var larguraOcupada = 0;

            $cols.each(function (index) {
                larguraOcupada += parseFloat($(this).attr("db_width"));
            });

            if (widthScrollableContent > larguraOcupada) {
                 $cols.last().css('width', '');
            }
        });
    };

    $().resizableLoad();

    window.btDeleteLine = function (lineCurrent) {
        lineCurrent.addClass("caixaTranspFilhos");
        lineCurrent.find("select").prop("disabled", true);
        lineCurrent.find().css("text-decoration", "line-through");
        lineCurrent.find("input.hiActivField").val("del");
        lineCurrent.find("input:not([type='hidden'])").prop("disabled", true);
    };

    window.checkTit = function (fatherBloc) {
        if (parseInt(fatherBloc.find("tbody tr").length) === 0) {
            fatherBloc.find("thead").addClass("clean");
            fatherBloc.find("tfoot").addClass("clean");
        }

        $(".loadSubtotal").trigger('change');
    };

    $(document).on("click", "[href^='#confirmDelLin']", function (e) {
        e.preventDefault();
        $("#bgLightBox").remove();

        var fieldSeq = $(this).attr("href").split("|");
        var lineCurrent = $("a[field-seq='" + fieldSeq[1] + "']").parents("tr");
        btDeleteLine(lineCurrent);
    });

    $(document).on("click", "a[href='btDeleteLine']", function (e) {
        e.preventDefault();

        var fatherBloc = $(this).parents(".containerTblPadrao");
        var newField = $(this).attr("field-seq") >= 999999999999 ? true : false;
        var lineCurrent = $(this).parents("tr");
        var indescription = lineCurrent.find("[name^='indescription']");

        if ($(this).parents(".caixaTranspFilhos").length > 0) {
            return;
        }

        if ($(this).attr("field-required") === "true" && fatherBloc.find("tbody tr:not(.caixaTranspFilhos)").length === 1) {
            $().funAvisoLight("Erro|Não foi possível excluir, é necessário pelos menos um item no cadastro.");
            return;
        }

        if (newField) {
            lineCurrent.remove();
            checkTit(fatherBloc);
            return;
        }

        if ($(this).attr("field-confirm") === "true") {
            var alertfinal = [
                "Deseja realmente excluir este link?",
                "<p class='indentado'><strong>Identificação: </strong> " + indescription.val() + "</p>"];

            openLightBox("AVISO!", alertfinal[0] + alertfinal[1], "Erro", "SIM", "#confirmDelLin|" + $(this).attr("field-seq"), "NÃO", "#close");
            return;
        }

        btDeleteLine(lineCurrent);
        checkTit(fatherBloc);
    });

    $("body").on("change", ".loadSubtotal", function (e) {
        var valorTotalGeral = 0;
        var father = $(this).parents(".tblPadrao tbody").find("tr:not('.caixaTranspFilhos')");

        father.each(function (i, ele) {
            var quantidade = $(this).find("[name^='inamount']").val();
            var inValorUnd = $(this).find("[name^='inunit_cost_pt']").val();
            var multiplicarQtdCusto = quantidade * funConverteMoedaParaEn(inValorUnd);

            if (quantidade !== "" && inValorUnd !== "") {
                $(this).find("[name^='insubtotal']").val(funConverteMoedaParaPt(multiplicarQtdCusto.toFixed(2), false));
            } else {
                $(this).find("[name^='insubtotal']").val("0,00");
            }

            valorTotalGeral += multiplicarQtdCusto;
        });

        $(".valorTotalNum").html(funConverteMoedaParaPt(valorTotalGeral.toFixed(2)));
    });

    $("body").on("click", ".containerTblPadrao .btAddline", function (e) {
        e.preventDefault();

        var fatherBloc = $(this).parents(".containerTblPadrao");
        fatherBloc.find("thead").removeClass("clean");
        fatherBloc.find("tfoot").removeClass("clean");

        $().ajaxSingle($(this).attr("href"), { validateHead: $(this).attr("validatehead") });
    });

    window.returnLineNewItem = function (variables) {
        var blocPrincipal = $(".returnLineNewItem");

        blocPrincipal.find("tbody").append(variables.lineNew);
    };

    /**
     * SearchFull
     */
    $(document).on("click", "input.btlimparfiltro", function () {
        var inputText = $(this).siblings("input[type='text']");
        inputText.val("");
        inputText.focus();

        $(this).hide();
        $(this).siblings(".btfiltro").trigger('click');
    });

    $(document).on("keyup", ".buscaRapida input[type='text']", function (e) {
        $(this).siblings("input.btlimparfiltro").css("display", $(this).val() === "" ? "none" : "block");

        if (e.which === 13) {
            $(this).siblings(".btfiltro").trigger('click');
        }
    });

    $(document).on("keyup", ".column_filter", function (e) {
        var father = $(this).parents(".blocTblPadrao");

        if (e.which === 13) {
            father.find(".btfiltro").trigger('click');
        }
    });

    $(document).on("change", ".itensPorPag", function (e) {
        $(this).parents(".blocTblPadrao").find(".btfiltro").trigger('click');
    });

    $(document).on("click", "[href='#prev']", function (e) {
        e.preventDefault();

        var fatherBloc = $(this).parents(".blocTblPadrao");
        var itensPorPag = fatherBloc.find(".itensPorPag").val();
        var itemInicio = fatherBloc.find(".itemInicio").text();

        if (parseFloat(itemInicio) === 1) {
            return;
        }

        fatherBloc.find(".btfiltro").trigger('click', { itemInicioProx: parseFloat(itemInicio) - itensPorPag });
    });

    $(document).on("click", "[href='#next']", function (e) {
        e.preventDefault();

        var fatherBloc = $(this).parents(".blocTblPadrao");
        var itensPorPag = fatherBloc.find(".itensPorPag").val();
        var itemInicio = fatherBloc.find(".itemInicio").text();
        var itemInicioProx = parseFloat(itensPorPag) + parseFloat(itemInicio);
        var itemFim = fatherBloc.find(".itemFim").text();
        var totalRec = fatherBloc.find(".totalRec").text();

        if (parseFloat(itemFim) === parseFloat(totalRec)) {
            return;
        }

        fatherBloc.find(".btfiltro").trigger('click', { itemInicioProx: itemInicioProx });
    });

    $(document).on("click", "[href='#limpar-filtros']", function (e, param) {
        var father = $(this).parents(".blocTblPadrao");
        father.find(".column_filter").val("");
        father.find("[name='v']").val("");

        father.find(".imagem_filtro").css({ 'background-image': "url(" + root + "/src/images/contem.svg)" });
        father.find(".column_filter").attr("filter-type", "contem");

        father.find(".btfiltro").trigger('click');
    });

    $(document).on("click", ".btfiltro", function (e, param) {
        e.preventDefault();

        var gridActual = $(this).parents(".blocTblPadrao");
        var data = $(this).data();
        var pai = $(this).parents(".blocTblPadrao");

        var fieldsName = [];
        var fieldsFilter = [];
        var filterType = [];
        $.each(gridActual.find(".column_filter"), function (index, value) {
            fieldsName.push($(this).attr("field-name"));
            fieldsFilter.push($(this).val());
            filterType.push($(this).attr("filter-type"));
        });

        var scopeSelect = [];
        $(".inEscopo:checked").each(function (i, ele) {
            scopeSelect.push($(this).val());
        });

        $().ajaxSingle(
            data.post,
            {
                func_name: "searchFull",
                father: pai.attr("idmain"),
                itensPorPag: pai.find(".itensPorPag").val(),
                itemInicio: var_empty(param) ? 1 : param.itemInicioProx,
                v: pai.find("[name='v']").val(),
                csrf: $("[name='csrf']").val(),
                scopeSelect: scopeSelect,
                fieldsName: fieldsName,
                fieldsFilter: fieldsFilter,
                filterType: filterType
            }
        );
    });

    window.searchFull = function (variables) {
        var pai = $("[idmain='" + variables.father + "']").parent();
        pai.find(".blocTblPadrao").replaceWith(variables.success);
        pai.find("[name='v']").val(variables.v);
        pai.find("[name='v']").focus();

        $.each(variables.fieldsName, function (index, value) {
            pai.find("[field-name='" + value + "']").val(variables.fieldsFilter[index]);
            pai.find("[field-name='" + value + "']").attr("filter-type", variables.filterType[index]);
            pai.find("[field-image='" + value + "']").css(
                { 'background-image': "url(" + root + "/src/images/" + variables.filterType[index] + ".svg)" }
            );
        });

        if ($(".mega_popup").length) {
            height = $(document).height() - 135;
            $(".mega_popup .containerTblPadrao").css("height", (height) + "px");
        }

        if (variables.v !== "") {
            pai.find(".btlimparfiltro").show();
        }

        $().funTableSorter();
        $().resizableLoad();
    };

    $(document).on("click", "[href='#filter_col']", function (e) {
        e.preventDefault();
        e.stopPropagation();

        $(".linha_filtro").find(".bloco_filtro").remove();

        var blocoFiltro = `
            <div class='bloco_filtro'>
                <a href='#limpar_filtro' title='Limpar filtro' class='item_filtro limpar_filtro'>Limpar filtro</a>
                <a href='#contem' title='Contém' class='item_filtro contem'>Contém</a>
                <a href='#nao_contem' title='Não contém' class='item_filtro nao_contem'>Não contém</a>
            </div>
        `;

        var father = $(this).parents(".linha_filtro");
        father.append(blocoFiltro);

        $(".bloco_filtro").fadeIn();
    });

    $(document).on("click", "[href='#limpar_filtro']", function (e) {
        e.preventDefault();

        var father = $(this).parents("td");
        father.find(".column_filter").val("");

        var fatherBloc = $(this).parents(".blocTblPadrao");
        fatherBloc.find(".btfiltro").trigger('click');
    });

    $(document).on("click", "[href='#contem']", function (e) {
        e.preventDefault();

        var father = $(this).parents("td");
        father.find(".imagem_filtro").css({ 'background-image': "url(" + root + "/src/images/contem.svg)" });
        father.find(".column_filter").attr("filter-type", "contem");
        father.find(".column_filter").focus();

        $(".bloco_filtro").remove();
    });

    $(document).on("click", "[href='#nao_contem']", function (e) {
        e.preventDefault();

        var father = $(this).parents("td");
        father.find(".imagem_filtro").css({ 'background-image': "url(" + root + "/src/images/nao_contem.svg)" });
        father.find(".column_filter").attr("filter-type", "nao_contem");
        father.find(".column_filter").focus();

        $(".bloco_filtro").remove();
    });

    $(document).on("click", ".bloco_filtro", function (e) {
        e.stopPropagation();
    });

    $(document).on("click", "body", function (e) {
        $(".bloco_filtro").remove();
    });

    $(document).on("click", ".sort-button", function (event) {
        event.preventDefault();

        var $cell = $(this).closest('th');
        var $table = $cell.closest('table');
        var colIndex = $cell.index();
        var order = $cell.data('sortOrder') || 0;

        order = (order === 0) ? 1 : 0;
        $cell.data('sortOrder', order);
        $table.trigger('sorton', [[[colIndex, order]]]);
    });

    $.fn.funTableSorter = function () {
        // $('.tablesorter').each(function () {
        //     var $table = $(this);
        //     var headers = {};

        //     $table.find('thead th').each(function (index) {
        //         headers[index] = { sorter: false };
        //     });

        //     $table.tablesorter({
        //         headers: headers
        //     });
        // });

        // Parser para configurar a data para o formato do Brasil
        // $.tablesorter.addParser({
        //     id: 'datetime',
        //     is: function (s) {
        //         return false;
        //     },
        //     format: function (s, table) {
        //         s = s.replace(/\-/g, "/");
        //         s = s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, "$3/$2/$1");
        //         return $.tablesorter.formatFloat(new Date(s).getTime());
        //     },
        //     type: 'numeric'
        // });
        //
        $('.tablesorter').tablesorter({
            headers: {
                1: {
                    //sorter: false  // Desativa a ordenação para essa coluna  // A primeira coluna começa do zero
                },
                4: {
                    //sorter: 'datetime' // Ativa o parser de data na coluna 4
                }
            } //,
            //dateFormat: 'dd/mm/yyyy' // Formato de data
        });

        // $('.tablesorter').trigger('sorton', [[[1, 1]]]);
    };

    $().funTableSorter();
});
