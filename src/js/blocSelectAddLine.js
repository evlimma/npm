$(function() {
    $(document).on("click", ".validateDbVal:not(.validateDbValText)", function (e) {
        $(this).parent().find(".setaValidateDbVal").trigger('click');
    });
        
    $(document).on("click", ".liMenuSuspenso", function (e) {
        e.stopPropagation();
        
        var input = $(this).closest(".caixa").find(".validateDbVal");
            input.val($(this).html())
                    .attr("bloqenv", "")
                    .removeClass("inAvisoCorrecao")
                    .removeClass("validateDbValText")
                    .prop("readonly", true);
            
        var inputId = $(this).closest(".caixa").find(".seletorCampo");
            inputId.val($(this).attr("seletor"));
            
        var ulCaixa = $(this).closest(".MenuSuspensoDb");
            ulCaixa.remove();
    });
    
    $(document).on("click", ".addCustom", function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        var input = $(this).closest(".caixa").find(".validateDbVal");
            input.val("")
                    .prop("readonly", false)
                    .focus()
                    .addClass("validateDbValText");
            
        var inputId = $(this).closest(".caixa").find(".seletorCampo");
            inputId.val("");
            
        var ulCaixa = $(this).closest(".MenuSuspensoDb");
            ulCaixa.remove();
    });
        
    $(document).on("click", ".setaValidateDbVal", function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        $("ul.MenuSuspensoDb.ds-block").remove();
        $("*").removeClass("validateDbValFocus");
        
        var button = $(this);
        var input = button.parent().find('input.validateDbVal');
        var form = button.parents("form");
        var father = button.parent();
        
        input.addClass("validateDbValFocus");
        
        form.ajaxSubmit({
            url: input.attr("url"),
            type: "POST",
            data: form.serialize(),
            dataType: "json",
            beforeSend: function () {
                button.addClass("setaValidateDbValLoad");
            },
            success: function (response) {
                var liContent = "<ul class='MenuSuspensoDb ds-block'>";
                    if (response.success) {
                        $.each(response.success, function(key, value) {
                            liContent += "  <li seletor='" + key + "' class='liMenuSuspenso'>" + value + "</li>";
                        });
                    }

                    liContent += "  <li class='addCustom'>(+) Adic. personalizado</li>";
                liContent += "</ul>";

                father.prepend(liContent);
            },
            error: function (e) {
                console.log(e);
                $().funAvisoLight("Erro|Não foi possível processar as informações.");
            },
            complete: function () {
                button.removeClass("setaValidateDbValLoad");
            }
        });
    });
});